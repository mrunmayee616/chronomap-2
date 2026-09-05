import { useState } from 'react'
import { Link } from 'react-router-dom'
import colosseumImg from '../assets/colosseum.jpg'
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

function PinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <circle cx="12" cy="9.5" r="2.3" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}

function CrownIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 8l3.5 3L12 5l4.5 6L20 8l-1.5 10h-13L4 8z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 2.5l7.5 3v5.2c0 5-3.2 8.9-7.5 10.3-4.3-1.4-7.5-5.3-7.5-10.3V5.5l7.5-3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}

function CoinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9.5 14.5c.3 1 1.2 1.5 2.5 1.5 1.6 0 2.6-.7 2.6-1.8 0-2.4-5-1-5-3.4 0-1.1 1-1.8 2.4-1.8 1.3 0 2.2.5 2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function HourglassIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M6 3h12M6 21h12M7 3c0 5 10 5 10 9s-10 4-10 9M17 3c0 5-10 5-10 9s10 4 10 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
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

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="page signin-page">
      <Navbar active="Sign In" />

      <div className="signin-layout">
        <div className="signin-visual">
          <img src={colosseumImg} alt="The Colosseum at sunrise" className="signin-visual-img" />
          <div className="signin-visual-fade" />
          <div className="signin-visual-content">
            <h1 className="signin-welcome">
              Welcome Back,
              <br />
              <span className="accent">Explorer.</span>
            </h1>
            <span className="signin-underline" />
            <p className="signin-sub">
              Login to continue your journey through time and across civilizations.
            </p>

            <ul className="signin-features">
              <li>
                <span className="feature-icon"><MapIcon /></span>
                Explore interactive maps
              </li>
              <li>
                <span className="feature-icon"><PinIcon /></span>
                Test your knowledge
              </li>
              <li>
                <span className="feature-icon"><CrownIcon /></span>
                Compete with explorers
              </li>
            </ul>

            <div className="signin-stats">
              <div className="stat">
                <span className="stat-icon small"><ShieldIcon /></span>
                <span>
                  <span className="stat-value small">50,000+</span>
                  <br />
                  <span className="stat-label">Historical Events</span>
                </span>
              </div>
              <div className="stat">
                <span className="stat-icon small"><CoinIcon /></span>
                <span>
                  <span className="stat-value small">200+</span>
                  <br />
                  <span className="stat-label">Countries Covered</span>
                </span>
              </div>
              <div className="stat">
                <span className="stat-icon small"><HourglassIcon /></span>
                <span>
                  <span className="stat-value small">3,000 BCE</span>
                  <br />
                  <span className="stat-label">To Present Day</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="signin-form-wrap">
          <div className="signin-card">
            <h2 className="signin-title">Log In</h2>
            <p className="signin-card-sub">Welcome back! Please enter your details.</p>

            <form onSubmit={noop}>
              <label className="field-label" htmlFor="identifier">Email or Username</label>
              <div className="field">
                <input id="identifier" type="text" placeholder="Enter your email or username" />
                <span className="field-icon"><PersonIcon /></span>
              </div>

              <label className="field-label" htmlFor="password">Password</label>
              <div className="field">
                <input id="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" />
                <button
                  type="button"
                  className="field-icon field-icon-btn"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>

              <div className="forgot-row">
                <a href="#" onClick={noop} className="link-accent">Forgot Password?</a>
              </div>

              <button type="submit" className="btn-login" onClick={noop}>
                Log In
              </button>
            </form>

            <div className="divider"><span>or</span></div>

            <a href="#" className="btn-oauth" onClick={noop}>
              <GoogleIcon /> Continue with Google
            </a>
            <a href="#" className="btn-oauth" onClick={noop}>
              <GithubIcon /> Continue with GitHub
            </a>

            <p className="signup-row">
              Don't have an account?{' '}
              <Link to="/register" className="link-accent">Sign Up</Link>
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
