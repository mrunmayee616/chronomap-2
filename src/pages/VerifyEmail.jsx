import { useEffect, useState, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { authApi } from '../lib/api.js'

export default function VerifyEmail() {
  const [params] = useSearchParams()
  const [status, setStatus] = useState('verifying') // 'verifying' | 'success' | 'error'
  const [message, setMessage] = useState('Verifying your email…')
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    const token = params.get('token')
    const uid = params.get('uid')

    if (!token || !uid) {
      setStatus('error')
      setMessage('This verification link is missing information. Please use the link from your email.')
      return
    }

    authApi
      .verifyEmail(token, uid)
      .then((data) => {
        setStatus('success')
        setMessage(data.message || 'Your email has been verified.')
      })
      .catch((err) => {
        setStatus('error')
        setMessage(err.error || 'This verification link is invalid or has expired.')
      })
  }, [params])

  return (
    <div className="page signin-page">
      <Navbar active="Sign In" />

      <div className="verify-wrap">
        <div className="signin-card verify-card">
          <h2 className="signin-title">Email Verification</h2>
          <p className={`verify-message verify-${status}`}>{message}</p>

          {status !== 'verifying' && (
            <Link to="/signin" className="btn-login verify-cta">
              Go to Log In
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
