import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { authApi } from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'

// Landing page for "Continue with Google / GitHub". The server finishes the
// OAuth exchange and redirects here as /oauth/callback#token=<jwt>&next=<path>.
// The token is in the URL fragment (never sent to any server). We load the
// profile with it, start the session, and move on to the page the user wanted.

// Only allow a path on this site.
function safeNext(value) {
  if (typeof value !== 'string') return '/'
  if (!value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) return '/'
  return value
}

export default function OAuthCallback() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return // React StrictMode runs effects twice in dev
    ran.current = true

    const params = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    const token = params.get('token')
    const next = safeNext(params.get('next'))

    if (!token) {
      navigate('/signin?oauth_error=server_error', { replace: true })
      return
    }

    authApi
      .me(token)
      .then((data) => {
        login({ token, user: data.user })
        // `replace` also removes the token from the address bar / history.
        navigate(next, { replace: true })
      })
      .catch(() => {
        navigate('/signin?oauth_error=server_error', { replace: true })
      })
  }, [login, navigate])

  return (
    <div className="page signin-page">
      <Navbar active="Sign In" />
      <div className="verify-wrap">
        <div className="signin-card verify-card">
          <h2 className="signin-title">Signing you in…</h2>
          <p className="verify-message">Just a moment while we finish logging you in.</p>
        </div>
      </div>
    </div>
  )
}
