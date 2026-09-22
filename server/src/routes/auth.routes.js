import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import User from '../models/User.js'
import { validateRegistration, validateLogin, hasErrors, isValidGender, isValidCountry } from '../utils/validators.js'
import { requireAuth } from '../middleware/auth.js'
import { publicUser } from '../utils/publicUser.js'
import { ADMIN_EMAIL, ADMIN_USERNAME, ADMIN_PASSWORD, adminPublicUser } from '../utils/admin.js'

const router = Router()

const JWT_SECRET = process.env.JWT_SECRET || 'dev-insecure-secret-change-me'
const TOKEN_TTL = process.env.JWT_EXPIRES_IN || '7d'
const MAX_FAILED_ATTEMPTS = 5
const LOCK_DURATION_MS = 15 * 60 * 1000 // 15 min

function issueToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), username: user.username, email: user.email },
    JWT_SECRET,
    { expiresIn: TOKEN_TTL }
  )
}

// ---------------------------------------------------------------------------
// POST /api/auth/register
// ---------------------------------------------------------------------------
router.post('/register', async (req, res) => {
  const { fullName, email, username, password, confirmPassword, agreeTerms, gender, country } = req.body || {}

  const normalizedEmail = (email || '').trim().toLowerCase()
  const normalizedUsername = (username || '').trim()

  // Checked before format validation below: "admin@fsdl" doesn't even pass
  // the email regex (no dot in the domain), so if the reservation check ran
  // after validation, someone typing it would see "invalid email" instead
  // of "already taken" -- which would look like a plain formatting error
  // rather than the reserved id it actually is.
  if (normalizedEmail === ADMIN_EMAIL) {
    return res.status(409).json({
      error: 'Account already exists.',
      fieldErrors: { email: 'An account with this email already exists. Try a different one.' },
    })
  }
  if (normalizedUsername.toLowerCase() === ADMIN_USERNAME) {
    return res.status(409).json({
      error: 'Account already exists.',
      fieldErrors: { username: 'This username is taken. Try a different one.' },
    })
  }

  const errors = validateRegistration({ fullName, email, username, password, confirmPassword, agreeTerms, gender, country })
  if (hasErrors(errors)) {
    return res.status(400).json({ error: 'Please fix the highlighted fields.', fieldErrors: errors })
  }

  const existing = await User.findOne({
    $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
  }).lean()

  if (existing) {
    const fieldErrors = {}
    if (existing.email === normalizedEmail) fieldErrors.email = 'An account with this email already exists.'
    if (existing.username === normalizedUsername) fieldErrors.username = 'This username is taken.'
    return res.status(409).json({ error: 'Account already exists.', fieldErrors })
  }

  const passwordHash = await bcrypt.hash(password, 12)

  let user
  try {
    user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      username: normalizedUsername,
      passwordHash,
      gender: isValidGender(gender) ? gender : 'unspecified',
      country: isValidCountry(country) ? country.toUpperCase() : '',
    })
  } catch (err) {
    // Race condition on the unique index (two requests at once).
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Account already exists.' })
    }
    console.error('Register DB error:', err)
    return res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }

  const token = issueToken(user)
  return res.status(201).json({
    message: 'Account created! You are now logged in.',
    token,
    user: publicUser(user),
  })
})

// ---------------------------------------------------------------------------
// POST /api/auth/login  { identifier, password }
// ---------------------------------------------------------------------------
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body || {}

  const errors = validateLogin({ identifier, password })
  if (hasErrors(errors)) {
    return res.status(400).json({ error: 'Please fix the highlighted fields.', fieldErrors: errors })
  }

  const normalized = identifier.trim().toLowerCase()

  // Fixed admin credential -- no User document backs it, so this has to be
  // checked before the normal DB lookup below.
  if (normalized === ADMIN_EMAIL || normalized === ADMIN_USERNAME) {
    if (password === ADMIN_PASSWORD) {
      const token = jwt.sign({ sub: 'admin', role: 'admin', email: ADMIN_EMAIL, username: ADMIN_USERNAME }, JWT_SECRET, {
        expiresIn: TOKEN_TTL,
      })
      return res.status(200).json({ token, user: adminPublicUser() })
    }
    return res.status(401).json({ error: 'Invalid email/username or password.' })
  }

  const user = await User.findOne({
    $or: [{ email: normalized }, { username: identifier.trim() }],
  })

  // Use one generic error for "not found" and "wrong password" so we don't
  // reveal which accounts exist.
  const invalidCredsResponse = () => res.status(401).json({ error: 'Invalid email/username or password.' })

  if (!user) return invalidCredsResponse()

  if (user.lockedUntil && Date.now() < user.lockedUntil) {
    const minutesLeft = Math.ceil((user.lockedUntil - Date.now()) / 60000)
    return res.status(423).json({ error: `Too many failed attempts. Try again in ${minutesLeft} minute(s).` })
  }

  const passwordOk = await bcrypt.compare(password, user.passwordHash)

  if (!passwordOk) {
    const attempts = user.failedLoginAttempts + 1
    const lockUntil = attempts >= MAX_FAILED_ATTEMPTS ? Date.now() + LOCK_DURATION_MS : null
    user.failedLoginAttempts = lockUntil ? 0 : attempts
    user.lockedUntil = lockUntil
    await user.save()
    return invalidCredsResponse()
  }

  // Successful password check - reset lockout counters.
  if (user.failedLoginAttempts > 0 || user.lockedUntil) {
    user.failedLoginAttempts = 0
    user.lockedUntil = null
    await user.save()
  }

  const token = issueToken(user)
  return res.status(200).json({ token, user: publicUser(user) })
})

// ---------------------------------------------------------------------------
// GET /api/auth/me  (protected)
// ---------------------------------------------------------------------------
router.get('/me', requireAuth, async (req, res) => {
  if (req.user.role === 'admin') {
    return res.status(200).json({ user: adminPublicUser() })
  }
  if (!mongoose.isValidObjectId(req.user.sub)) {
    return res.status(404).json({ error: 'Account not found.' })
  }
  const user = await User.findById(req.user.sub)
  if (!user) return res.status(404).json({ error: 'Account not found.' })
  return res.status(200).json({ user: publicUser(user) })
})

// ---------------------------------------------------------------------------
// PATCH /api/auth/me  { bio?, location? }  (protected)
// Updates the editable "About Me" fields on the Profile page.
// ---------------------------------------------------------------------------
router.patch('/me', requireAuth, async (req, res) => {
  if (req.user.role === 'admin') {
    return res.status(403).json({ error: 'The admin account has no editable profile.' })
  }
  if (!mongoose.isValidObjectId(req.user.sub)) {
    return res.status(404).json({ error: 'Account not found.' })
  }

  const { bio, location, gender, country } = req.body || {}
  const fieldErrors = {}

  if (bio !== undefined && typeof bio !== 'string') fieldErrors.bio = 'Bio must be text.'
  if (bio !== undefined && bio.length > 280) fieldErrors.bio = 'Bio must be 280 characters or fewer.'
  if (location !== undefined && typeof location !== 'string') fieldErrors.location = 'Location must be text.'
  if (location !== undefined && location.length > 120) fieldErrors.location = 'Location must be 120 characters or fewer.'
  if (gender !== undefined && !isValidGender(gender)) fieldErrors.gender = 'Please select a valid option.'
  if (country !== undefined && country !== '' && !isValidCountry(country)) {
    fieldErrors.country = 'Please select a valid country.'
  }

  if (hasErrors(fieldErrors)) {
    return res.status(400).json({ error: 'Please fix the highlighted fields.', fieldErrors })
  }

  const user = await User.findById(req.user.sub)
  if (!user) return res.status(404).json({ error: 'Account not found.' })

  if (bio !== undefined) user.bio = bio.trim()
  if (location !== undefined) user.location = location.trim()
  if (gender !== undefined) user.gender = gender
  if (country !== undefined) user.country = country ? country.toUpperCase() : ''
  await user.save()

  return res.status(200).json({ user: publicUser(user) })
})

export default router
