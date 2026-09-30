import { Router } from 'express'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { ADMIN_USERNAME } from '../utils/admin.js'

// "Continue with Google" / "Continue with GitHub".
//
// Standard OAuth 2.0 authorization-code flow, done entirely on the server so
// the client secrets never reach the browser:
//
//   1. GET /api/auth/oauth/:provider
//        -> redirects the browser to Google/GitHub's consent screen
//   2. GET /api/auth/oauth/:provider/callback?code=...&state=...
//        -> exchanges the code for the user's profile, finds or creates the
//           matching ChronoMap account, then redirects back to the React app
//           at /oauth/callback#token=<jwt> (see src/pages/OAuthCallback.jsx).
//
// Any failure redirects to /signin?oauth_error=<code> instead of showing a
// raw JSON error, since the user is in the middle of a browser navigation.

const router = Router()

const STATE_COOKIE = 'cm_oauth_state'
const COOKIE_PATH = '/api/auth/oauth'
const STATE_TTL_SECONDS = 10 * 60

// Read lazily (not at import time) so values from .env are always present.
const jwtSecret = () => process.env.JWT_SECRET || 'dev-insecure-secret-change-me'
const tokenTtl = () => process.env.JWT_EXPIRES_IN || '7d'
const clientOrigin = () => (process.env.CLIENT_ORIGIN || 'http://localhost:5173').replace(/\/+$/, '')
const serverUrl = () =>
  (process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`).replace(/\/+$/, '')
const callbackUrl = (provider) => `${serverUrl()}/api/auth/oauth/${provider}/callback`

class OAuthError extends Error {
  constructor(code, detail) {
    super(detail || code)
    this.code = code
  }
}

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

async function fetchJson(url, options = {}) {
  let res
  try {
    res = await fetch(url, { ...options, signal: AbortSignal.timeout(10000) })
  } catch (err) {
    throw new OAuthError('provider_error', `Request to ${url} failed: ${err.message}`)
  }
  let data = null
  try {
    data = await res.json()
  } catch {
    // fall through -- handled below
  }
  if (!res.ok || data === null) {
    throw new OAuthError('provider_error', `Request to ${url} returned ${res.status}`)
  }
  return data
}

function readCookie(req, name) {
  const header = req.headers.cookie || ''
  for (const part of header.split(';')) {
    const idx = part.indexOf('=')
    if (idx === -1) continue
    if (part.slice(0, idx).trim() === name) {
      try {
        return decodeURIComponent(part.slice(idx + 1).trim())
      } catch {
        return null
      }
    }
  }
  return null
}

function safeEqual(a, b) {
  const bufA = Buffer.from(String(a))
  const bufB = Buffer.from(String(b))
  return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB)
}

// Only ever redirect to a path on our own site (prevents open redirects).
function safeNext(value) {
  if (typeof value !== 'string') return '/'
  if (value.length > 200 || !value.startsWith('/')) return '/'
  if (value.startsWith('//') || value.startsWith('/\\') || /[\r\n]/.test(value)) return '/'
  return value
}

function redirectError(res, code) {
  return res.redirect(`${clientOrigin()}/signin?oauth_error=${encodeURIComponent(code)}`)
}

function clearStateCookie(res) {
  res.clearCookie(STATE_COOKIE, { path: COOKIE_PATH })
}

// ---------------------------------------------------------------------------
// Providers
// ---------------------------------------------------------------------------

const PROVIDERS = {
  google: {
    clientIdEnv: 'GOOGLE_CLIENT_ID',
    clientSecretEnv: 'GOOGLE_CLIENT_SECRET',
    authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    scope: 'openid email profile',
    extraAuthParams: { prompt: 'select_account' },

    async fetchProfile(code) {
      const tokens = await fetchJson('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
        body: new URLSearchParams({
          code,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: callbackUrl('google'),
          grant_type: 'authorization_code',
        }),
      })
      if (!tokens.access_token) throw new OAuthError('provider_error', 'Google returned no access token')

      const info = await fetchJson('https://openidconnect.googleapis.com/v1/userinfo', {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      })
      if (!info.sub || !info.email) throw new OAuthError('no_verified_email')

      return {
        providerId: String(info.sub),
        email: String(info.email),
        emailVerified: info.email_verified === true || info.email_verified === 'true',
        name: info.name || '',
        // Usernames are public (leaderboard, profile), so prefer the display
        // name over the email prefix to avoid exposing part of the address.
        usernameSeed: info.name || String(info.email).split('@')[0],
      }
    },
  },

  github: {
    clientIdEnv: 'GITHUB_CLIENT_ID',
    clientSecretEnv: 'GITHUB_CLIENT_SECRET',
    authorizeUrl: 'https://github.com/login/oauth/authorize',
    scope: 'read:user user:email',
    extraAuthParams: {},

    async fetchProfile(code) {
      const tokens = await fetchJson('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
        body: new URLSearchParams({
          code,
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          redirect_uri: callbackUrl('github'),
        }),
      })
      // GitHub answers HTTP 200 with { error } for a bad/expired code.
      if (!tokens.access_token) throw new OAuthError('provider_error', `GitHub: ${tokens.error || 'no access token'}`)

      const headers = {
        Authorization: `Bearer ${tokens.access_token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'ChronoMap',
      }
      const ghUser = await fetchJson('https://api.github.com/user', { headers })
      if (!ghUser.id) throw new OAuthError('provider_error', 'GitHub returned no user id')

      // The email on the public profile can be blank or unverified, so ask
      // for the account's email list and only trust a verified address.
      let emails = []
      try {
        const list = await fetchJson('https://api.github.com/user/emails', { headers })
        if (Array.isArray(list)) emails = list
      } catch {
        // No access to the email list -- handled by the check below.
      }
      const verified = emails.filter((e) => e && e.verified && e.email)
      const chosen = verified.find((e) => e.primary) || verified[0]
      if (!chosen) throw new OAuthError('no_verified_email')

      return {
        providerId: String(ghUser.id),
        email: String(chosen.email),
        emailVerified: true,
        name: ghUser.name || '',
        usernameSeed: ghUser.login || String(chosen.email).split('@')[0],
      }
    },
  },
}

function getProvider(name) {
  return Object.prototype.hasOwnProperty.call(PROVIDERS, name) ? PROVIDERS[name] : null
}

// ---------------------------------------------------------------------------
// Account lookup / creation
// ---------------------------------------------------------------------------

// ChronoMap usernames are 3-20 chars of letters, numbers and underscores.
function sanitizeUsername(seed) {
  let base = String(seed || '')
    .replace(/[^A-Za-z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 16)
  if (!base) base = 'explorer'
  if (base.length < 3) base = `${base}user`.slice(0, 16)
  return base
}

async function usernameTaken(candidate) {
  // Case-insensitive so "Alex" and "alex" can't both exist.
  return Boolean(await User.exists({ username: new RegExp(`^${candidate}$`, 'i') }))
}

async function generateUsername(seed) {
  const base = sanitizeUsername(seed)
  if (base.toLowerCase() !== ADMIN_USERNAME && !(await usernameTaken(base))) return base
  for (let i = 0; i < 10; i += 1) {
    const candidate = `${base}${crypto.randomInt(10, 10000)}` // base <= 16 + <= 4 digits
    if (!(await usernameTaken(candidate))) return candidate
  }
  return `user${crypto.randomInt(10000000, 100000000)}`
}

async function findOrCreateUser(providerName, profile) {
  const email = profile.email.trim().toLowerCase()
  const identity = { provider: providerName, providerId: profile.providerId }

  // A retry loop only because two simultaneous first-time sign-ins could race
  // on the unique email/username indexes.
  for (let attempt = 0; attempt < 3; attempt += 1) {
    // 1. Already signed in with this exact Google/GitHub identity before.
    const linked = await User.findOne({ oauthAccounts: { $elemMatch: identity } })
    if (linked) return linked

    // 2. Someone already owns this email address.
    const existing = await User.findOne({ email })
    if (existing) {
      // Registration doesn't verify emails, so a password account's email
      // can't be trusted to belong to the person holding it. Silently
      // merging a social login into it would let whoever registered that
      // email first (with a password only they know) get into the account.
      // Only accounts that were themselves created through a verified social
      // login are safe to link to.
      if (existing.passwordHash) throw new OAuthError('email_exists')
      existing.oauthAccounts.push(identity)
      await existing.save()
      return existing
    }

    // 3. Brand new visitor -- create the account.
    const username = await generateUsername(profile.usernameSeed || email.split('@')[0])
    const fullName = (profile.name || '').trim().slice(0, 80)
    try {
      return await User.create({
        fullName: fullName.length >= 2 ? fullName : username,
        email,
        username,
        passwordHash: '',
        oauthAccounts: [identity],
        gender: 'unspecified',
        country: '',
      })
    } catch (err) {
      if (err.code === 11000) continue
      throw err
    }
  }
  throw new OAuthError('server_error', 'Could not create account after retries')
}

// ---------------------------------------------------------------------------
// GET /api/auth/oauth/:provider   -> send the browser to the consent screen
// ---------------------------------------------------------------------------
router.get('/:provider', (req, res) => {
  const name = req.params.provider
  const provider = getProvider(name)
  if (!provider) return res.status(404).json({ error: 'Unknown sign-in provider.' })

  const clientId = process.env[provider.clientIdEnv]
  const clientSecret = process.env[provider.clientSecretEnv]
  if (!clientId || !clientSecret) return redirectError(res, 'not_configured')

  // `state` is a signed, short-lived token AND a matching random value is
  // stored in a cookie. The callback requires both, which ties the sign-in
  // to the browser that started it.
  const nonce = crypto.randomBytes(16).toString('hex')
  const state = jwt.sign({ provider: name, nonce, next: safeNext(req.query.next) }, jwtSecret(), {
    expiresIn: STATE_TTL_SECONDS,
  })
  res.cookie(STATE_COOKIE, nonce, {
    httpOnly: true,
    sameSite: 'lax', // must survive the top-level redirect back from Google/GitHub
    secure: serverUrl().startsWith('https://'),
    maxAge: STATE_TTL_SECONDS * 1000,
    path: COOKIE_PATH,
  })

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: callbackUrl(name),
    response_type: 'code',
    scope: provider.scope,
    state,
    ...provider.extraAuthParams,
  })
  return res.redirect(`${provider.authorizeUrl}?${params.toString()}`)
})

// ---------------------------------------------------------------------------
// GET /api/auth/oauth/:provider/callback
// ---------------------------------------------------------------------------
router.get('/:provider/callback', async (req, res) => {
  const name = req.params.provider
  const provider = getProvider(name)
  if (!provider) return res.status(404).json({ error: 'Unknown sign-in provider.' })

  const cookieNonce = readCookie(req, STATE_COOKIE)
  clearStateCookie(res) // single use, whatever happens next

  const { code, state, error } = req.query

  let statePayload
  try {
    statePayload = jwt.verify(String(state || ''), jwtSecret())
  } catch {
    return redirectError(res, 'invalid_state')
  }
  if (
    !cookieNonce ||
    typeof statePayload.nonce !== 'string' ||
    !safeEqual(statePayload.nonce, cookieNonce) ||
    statePayload.provider !== name
  ) {
    return redirectError(res, 'invalid_state')
  }

  // The user pressed "Cancel" / "Deny" on the consent screen.
  if (error) return redirectError(res, error === 'access_denied' ? 'access_denied' : 'provider_error')
  if (typeof code !== 'string' || !code) return redirectError(res, 'provider_error')

  try {
    const profile = await provider.fetchProfile(code)
    if (!profile.emailVerified) throw new OAuthError('no_verified_email')

    const user = await findOrCreateUser(name, profile)

    const token = jwt.sign(
      { sub: user._id.toString(), username: user.username, email: user.email },
      jwtSecret(),
      { expiresIn: tokenTtl() }
    )

    // The token goes in the URL *fragment* so it is never sent to a server,
    // written to access logs, or leaked through a Referer header.
    const next = safeNext(statePayload.next)
    return res.redirect(
      `${clientOrigin()}/oauth/callback#token=${encodeURIComponent(token)}&next=${encodeURIComponent(next)}`
    )
  } catch (err) {
    if (err instanceof OAuthError) {
      if (err.code === 'provider_error' || err.code === 'server_error') {
        console.error(`OAuth (${name}) error:`, err.message)
      }
      return redirectError(res, err.code)
    }
    console.error(`OAuth (${name}) unexpected error:`, err)
    return redirectError(res, 'server_error')
  }
})

export default router
