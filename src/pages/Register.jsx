import { useState } from 'react'
import { Link } from 'react-router-dom'
import globeImg from '../assets/globe-register.png'
import Navbar from '../components/Navbar.jsx'

function noop(e) {
  e.preventDefault()
}

function MapIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M9 4L4 6v14l5-2 6 2 5-2V4l-5 2-6-2z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9 4v14M15 6v14" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}

function TrophyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M7 4h10v4a5 5 0 0 1-5 5 5 5 0 0 1-5-5V4z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M7 5H4v1a4 4 0 0 0 4 4M17 5h3v1a4 4 0 0 1-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M12 13v3M9 20h6M10 17h4v3h-4z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8.5" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 20c1.1-3.3 3.6-5 5.5-5s4.4 1.7 5.5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="17" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M15.8 12.3c1.8.3 3.4 1.7 4.2 4.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function PersonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4.5 20c1.3-3.8 4.3-6 7.5-6s6.2 2.2 7.5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 6.5l8 6.5 8-6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function AtIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="1.6" />
      <path d="M15.6 12v1.4a2.6 2.6 0 0 0 5.2 0V12a8.8 8.8 0 1 0-3.6 7.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="10.5" width="14" height="9.5" rx="2.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function EyeIcon({ open }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M2 12s3.8-7 10-7 10 7 10 7-3.8 7-10 7-10-7-10-7z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 3l18 18M9.9 5.2A10.7 10.7 0 0 1 12 5c6.2 0 10 7 10 7a15.3 15.3 0 0 1-3.6 4.4M6.5 6.6C4 8.3 2 12 2 12s3.8 7 10 7c1.4 0 2.7-.3 3.8-.9M9.9 14.1a3 3 0 0 0 4.2-4.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5c-.3 1.5-1.1 2.7-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.7z"/>
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1C3.3 21.3 7.3 24 12 24z"/>
      <path fill="#FBBC05" d="M5.4 14.4c-.2-.7-.4-1.4-.4-2.4s.1-1.6.4-2.4V6.6H1.4A11.9 11.9 0 0 0 0 12c0 1.9.5 3.8 1.4 5.4l4-3z"/>
      <path fill="#EA4335" d="M12 4.7c1.8 0 3.3.6 4.5 1.8l3.4-3.4C17.9 1.2 15.1 0 12 0 7.3 0 3.3 2.7 1.4 6.6l4 3.1C6.3 6.8 8.9 4.7 12 4.7z"/>
    </svg>
  )
}

function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5C5.7.5.9 5.3.9 11.6c0 5 3.2 9.2 7.7 10.7.6.1.8-.2.8-.6v-2.2c-3.1.7-3.8-1.3-3.8-1.3-.5-1.3-1.2-1.7-1.2-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 1.7 2.6 1.2 3.2.9.1-.7.4-1.2.7-1.5-2.5-.3-5.1-1.2-5.1-5.5 0-1.2.4-2.2 1.1-3-.1-.3-.5-1.4.1-3 0 0 .9-.3 3 1.1a10.4 10.4 0 0 1 5.4 0c2.1-1.4 3-1.1 3-1.1.6 1.6.2 2.7.1 3 .7.8 1.1 1.8 1.1 3 0 4.3-2.6 5.2-5.1 5.5.4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6 4.5-1.5 7.7-5.7 7.7-10.7C23.1 5.3 18.3.5 12 .5z"/>
    </svg>
  )
}

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <div className="page register-page">
      <div className="register-bg" aria-hidden="true">
        <img src={globeImg} alt="" className="register-globe-img"/>
      </div>

      <Navbar active="Sign In" />

      <div className="register-layout">
        <div className="register-visual-content">
          <h1 className="register-welcome">
            Join the Journey.
            <br />
            <span className="accent">Become an Explorer.</span>
          </h1>
          <p className="register-sub">
            Create an account and start exploring history's greatest stories
          </p>

          <ul className="signin-features">
            <li>
              <span className="feature-icon"><MapIcon /></span>
              Explore interactive maps
            </li>
            <li>
              <span className="feature-icon"><TrophyIcon /></span>
              Test your knowledge
            </li>
            <li>
              <span className="feature-icon"><UsersIcon /></span>
              Compete with explorers
            </li>
          </ul>
        </div>

        <div className="signin-form-wrap">
          <div className="signin-card register-card">
            <h2 className="signin-title">Create Account</h2>
            <p className="signin-card-sub">Sign up and begin your adventure</p>

            <form onSubmit={noop}>
              <label className="field-label" htmlFor="fullname">Full Name</label>
              <div className="field">
                <input id="fullname" type="text" placeholder="Enter your full name" autoComplete="name" />
                <span className="field-icon"><PersonIcon /></span>
              </div>

              <label className="field-label" htmlFor="email">Email</label>
              <div className="field">
                <input id="email" type="email" placeholder="Enter your email address" autoComplete="email" />
                <span className="field-icon"><MailIcon /></span>
              </div>

              <label className="field-label" htmlFor="username">Username</label>
              <div className="field">
                <input id="username" type="text" placeholder="Choose a username" autoComplete="username" />
                <span className="field-icon"><AtIcon /></span>
              </div>

              <label className="field-label" htmlFor="password">Password</label>
              <div className="field">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="field-icon field-icon-btn"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>

              <label className="field-label" htmlFor="confirm-password">Confirm Password</label>
              <div className="field">
                <input
                  id="confirm-password"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="field-icon field-icon-btn"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  <EyeIcon open={showConfirm} />
                </button>
              </div>

              <label className="terms-row">
                <input type="checkbox" />
                <span>
                  I agree to the <a href="#" onClick={noop} className="link-accent">Terms of Service</a> and{' '}
                  <a href="#" onClick={noop} className="link-accent">Privacy Policy</a>
                </span>
              </label>

              <button type="submit" className="btn-login" onClick={noop}>
                Sign Up
              </button>
            </form>

            <div className="divider"><span>or</span></div>

            <a href="#" className="btn-oauth" onClick={noop}>
              <GoogleIcon /> Sign up with Google
            </a>
            <a href="#" className="btn-oauth" onClick={noop}>
              <GithubIcon /> Sign up with GitHub
            </a>

            <p className="signup-row">
              Already have an account?{' '}
              <Link to="/signin" className="link-accent">Log In</Link>
            </p>
          </div>
        </div>
      </div>

      <footer className="site-footer">
        <div className="footer-brand">
          <span className="brand-mark" aria-hidden="true" />
          <span>ChronoMap</span>
        </div>

        <div className="footer-social">
          <a href="#" onClick={noop} aria-label="Twitter">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23 4.9c-.8.4-1.7.7-2.6.8a4.6 4.6 0 0 0 2-2.5c-.9.5-1.8.9-2.9 1.1a4.5 4.5 0 0 0-7.7 4.1A12.9 12.9 0 0 1 2.5 3.7a4.5 4.5 0 0 0 1.4 6 4.4 4.4 0 0 1-2-.6v.1c0 2.2 1.6 4 3.6 4.4a4.5 4.5 0 0 1-2 .1 4.5 4.5 0 0 0 4.2 3.1A9 9 0 0 1 1 18.6 12.8 12.8 0 0 0 7.9 20.6c8.3 0 12.9-6.9 12.9-12.9v-.6c.9-.6 1.6-1.4 2.2-2.2z"/></svg>
          </a>
          <a href="#" onClick={noop} aria-label="Facebook">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-7.5H16l.4-3H13.5V8.4c0-.9.2-1.5 1.5-1.5h1.6V4.2c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.4H8v3h2.4V21h3.1z"/></svg>
          </a>
          <a href="#" onClick={noop} aria-label="Instagram">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1"/></svg>
          </a>
          <a href="#" onClick={noop} aria-label="YouTube">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23 7.2s-.2-1.6-.9-2.3c-.9-.9-1.8-.9-2.3-1C16.9 3.6 12 3.6 12 3.6h0s-4.9 0-7.8.3c-.5.1-1.4.1-2.3 1C1.2 5.6 1 7.2 1 7.2S.8 9 .8 10.9v1.9C.8 14.7 1 16.5 1 16.5s.2 1.6.9 2.3c.9.9 2 .9 2.5 1 1.8.2 7.6.3 7.6.3s4.9 0 7.8-.3c.5-.1 1.4-.1 2.3-1 .7-.7.9-2.3.9-2.3s.2-1.8.2-3.7v-1.9c0-1.9-.2-3.7-.2-3.7zM9.7 14.9V8.7l5.4 3.1z"/></svg>
          </a>
          <a href="#" onClick={noop} aria-label="Discord">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.3 5.4A17.5 17.5 0 0 0 16 4l-.3.6a13 13 0 0 1 3.8 1.5 15.8 15.8 0 0 0-14.9 0 13 13 0 0 1 3.8-1.5L8 4a17.5 17.5 0 0 0-4.3 1.4S1 10 1 15.3A17.7 17.7 0 0 0 6.3 18l.7-1a10 10 0 0 1-1.7-.8l.4-.3a12.6 12.6 0 0 0 10.6 0l.4.3c-.5.3-1.1.6-1.7.8l.7 1A17.7 17.7 0 0 0 21 15.3c0-5.3-2.7-9.9-2.7-9.9zM9 13.2c-.8 0-1.5-.8-1.5-1.7s.7-1.7 1.5-1.7 1.5.8 1.5 1.7-.7 1.7-1.5 1.7zm6 0c-.8 0-1.5-.8-1.5-1.7s.7-1.7 1.5-1.7 1.5.8 1.5 1.7-.7 1.7-1.5 1.7z"/></svg>
          </a>
        </div>

        <div className="footer-links">
          <a href="#" onClick={noop}>Privacy Policy</a>
          <a href="#" onClick={noop}>Terms of Service</a>
          <a href="#" onClick={noop}>Help Center</a>
        </div>

        <p className="footer-copy">© 2024 ChronoMap. All rights reserved.</p>
      </footer>
    </div>
  )
}
