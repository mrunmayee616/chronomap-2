import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { avatarUrlFor } from '../lib/avatar.js'

const NAV_ITEMS = ['Home', 'Explore', 'Timeline', 'Quiz', 'Leaderboard', 'About']

function noop(e) {
  e.preventDefault()
}

function LogoutIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 16l4-4-4-4M20 12H9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DashboardIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
      <rect x="13" y="3.5" width="7.5" height="4.5" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
      <rect x="13" y="10" width="7.5" height="10.5" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
      <rect x="3.5" y="13" width="7.5" height="7.5" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}

export default function Navbar({ active = 'Home' }) {
  const { isAuthenticated, user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  function goToQuiz(e) {
    e.preventDefault()
    if (isAuthenticated) {
      navigate('/quiz')
    } else {
      navigate('/signin', { state: { from: { pathname: '/quiz' } } })
    }
  }

  function goToLeaderboard(e) {
    e.preventDefault()
    if (isAuthenticated) {
      navigate('/leaderboard')
    } else {
      navigate('/signin', { state: { from: { pathname: '/leaderboard' } } })
    }
  }

  const isOnDashboard = location.pathname === '/profile' || location.pathname === '/admin'
  const dashboardPath = user?.isAdmin ? '/admin' : '/profile'

  useEffect(() => {
    function onClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  // Close the menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  function handleLogout() {
    setMenuOpen(false)
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true" />
        <span>ChronoMap</span>
      </div>

      <div className="nav-links">
        {NAV_ITEMS.map((item) => {
          if (item === 'Home' || item === 'Explore') {
            return (
              <Link
                key={item}
                to={item === 'Home' ? '/' : '/explore'}
                className={item === active ? 'active' : ''}
              >
                {item}
              </Link>
            )
          }
          if (item === 'Quiz') {
            return (
              <a
                key={item}
                href="#"
                className={item === active ? 'active' : ''}
                onClick={goToQuiz}
              >
                {item}
              </a>
            )
          }
          if (item === 'Leaderboard') {
            return (
              <a
                key={item}
                href="#"
                className={item === active ? 'active' : ''}
                onClick={goToLeaderboard}
              >
                {item}
              </a>
            )
          }
          return (
            <a
              key={item}
              href="#"
              className={item === active ? 'active' : ''}
              onClick={noop}
            >
              {item}
            </a>
          )
        })}
      </div>

      {isAuthenticated && user ? (
        <div className="navbar-avatar-wrap" ref={menuRef}>
          <button
            type="button"
            className={isOnDashboard ? 'navbar-avatar-link active' : 'navbar-avatar-link'}
            aria-label="Account menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <img
              src={avatarUrlFor(user.username, user.gender)}
              alt={`${user.username}'s avatar`}
              className="navbar-avatar"
            />
          </button>

          {menuOpen && (
            <div className="navbar-avatar-menu" role="menu">
              {!isOnDashboard && (
                <Link to={dashboardPath} className="navbar-avatar-menu-item" role="menuitem">
                  <DashboardIcon /> Dashboard
                </Link>
              )}
              <button
                type="button"
                className="navbar-avatar-menu-item"
                role="menuitem"
                onClick={handleLogout}
              >
                <LogoutIcon /> Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <Link
          to="/signin"
          className={active === 'Sign In' ? 'btn-signin active' : 'btn-signin'}
        >
          Sign In
        </Link>
      )}
    </nav>
  )
}
