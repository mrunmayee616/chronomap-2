import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { avatarUrlFor } from '../lib/avatar.js'
import Logo from './Logo.jsx'

const NAV_ITEMS = ['Home', 'Explore', 'Quiz', 'Leaderboard', 'Explorers', 'About']

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

function PaletteIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.1 0 2-.9 2-2v-.5c0-.55-.22-1.05-.59-1.41a.996.996 0 0 1 0-1.42C13.78 16.22 14 15.72 14 15.17V15c0-1.1-.9-2-2-2H8c-1.66 0-3-1.34-3-3 0-3.87 3.13-7 7-7s7 3.13 7 7v1c0 1.1-.9 2-2 2s-2-.9-2-2v-1c0-1.66-1.34-3-3-3"
        stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
      <circle cx="8.5" cy="10.5" r="1" fill="currentColor" />
      <circle cx="12" cy="7.5" r="1" fill="currentColor" />
      <circle cx="15.5" cy="10.5" r="1" fill="currentColor" />
    </svg>
  )
}

function ChevronIcon({ open }) {
  return (
    <svg
      width="12" height="12" viewBox="0 0 24 24" fill="none"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
    >
      <polyline points="6 9 12 15 18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Navbar({ active = 'Home' }) {
  const { isAuthenticated, user, logout } = useAuth()
  const { theme, themes, setTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [themeSubOpen, setThemeSubOpen] = useState(false)
  const menuRef = useRef(null)
  // For logged-out theme picker dropdown
  const themePickerRef = useRef(null)
  const [themePickerOpen, setThemePickerOpen] = useState(false)

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

  function goToExplorers(e) {
    e.preventDefault()
    if (isAuthenticated) {
      navigate('/explorers')
    } else {
      navigate('/signin', { state: { from: { pathname: '/explorers' } } })
    }
  }

  const isOnDashboard = location.pathname === '/profile' || location.pathname === '/admin'
  const dashboardPath = user?.isAdmin ? '/admin' : '/profile'

  // Close avatar menu on outside click
  useEffect(() => {
    function onClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
        setThemeSubOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  // Close logged-out theme picker on outside click
  useEffect(() => {
    function onClickOutside(e) {
      if (themePickerRef.current && !themePickerRef.current.contains(e.target)) {
        setThemePickerOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  // Close the menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false)
    setThemeSubOpen(false)
    setThemePickerOpen(false)
  }, [location.pathname])

  function handleLogout() {
    setMenuOpen(false)
    setThemeSubOpen(false)
    logout()
    navigate('/')
  }

  function handleSelectTheme(themeId) {
    setTheme(themeId)
    setThemeSubOpen(false)
    setMenuOpen(false)
    setThemePickerOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="brand">
        <Logo size={44} />
        <span>ChronoMap</span>
      </div>

      <div className="nav-links">
        {NAV_ITEMS.map((item) => {
          if (item === 'Home' || item === 'Explore' || item === 'About') {
            return (
              <Link
                key={item}
                to={item === 'Home' ? '/' : item === 'Explore' ? '/explore' : '/about'}
                className={item === active ? 'active' : ''}
              >
                {item}
              </Link>
            )
          }
          if (item === 'Quiz') {
            return (
              <a key={item} href="#" className={item === active ? 'active' : ''} onClick={goToQuiz}>
                {item}
              </a>
            )
          }
          if (item === 'Explorers') {
            return (
              <a
                key={item}
                href="#"
                className={item === active ? 'active' : ''}
                onClick={goToExplorers}
              >
                {item}
              </a>
            )
          }
          if (item === 'Leaderboard') {
            return (
              <a key={item} href="#" className={item === active ? 'active' : ''} onClick={goToLeaderboard}>
                {item}
              </a>
            )
          }
          return (
            <a key={item} href="#" className={item === active ? 'active' : ''} onClick={noop}>
              {item}
            </a>
          )
        })}
      </div>

      <div className="navbar-right">
        {isAuthenticated && user ? (
          /* ---- Logged-in: avatar button with dropdown ---- */
          <div className="navbar-avatar-wrap" ref={menuRef}>
            <button
              type="button"
              className={isOnDashboard ? 'navbar-avatar-link active' : 'navbar-avatar-link'}
              aria-label="Account menu"
              aria-expanded={menuOpen}
              onClick={() => { setMenuOpen((v) => !v); setThemeSubOpen(false) }}
            >
              <img
                src={avatarUrlFor(user.username, user.avatar)}
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

                {/* ---- Theme row — click to expand inline submenu ---- */}
                <button
                  type="button"
                  className="navbar-avatar-menu-item navbar-theme-row"
                  role="menuitem"
                  aria-expanded={themeSubOpen}
                  onClick={(e) => { e.stopPropagation(); setThemeSubOpen((v) => !v) }}
                >
                  <PaletteIcon />
                  <span className="navbar-theme-row-label">Theme</span>
                  <span className="navbar-theme-badge-sm">{theme.icon} {theme.label}</span>
                  <ChevronIcon open={themeSubOpen} />
                </button>

                {/* Inline theme picker that slides open */}
                {themeSubOpen && (
                  <div className="navbar-theme-submenu" role="group" aria-label="Choose a theme">
                    {themes.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        className={`navbar-theme-option${t.id === theme.id ? ' active' : ''}`}
                        onClick={() => handleSelectTheme(t.id)}
                        aria-pressed={t.id === theme.id}
                      >
                        <span className="navbar-theme-option-icon">{t.icon}</span>
                        <span className="navbar-theme-option-label">{t.label}</span>
                        {t.id === theme.id && <CheckIcon />}
                      </button>
                    ))}
                  </div>
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
          /* ---- Logged-out: theme pill with dropdown + Sign In ---- */
          <>
            <div className="navbar-theme-picker-wrap" ref={themePickerRef}>
              <button
                type="button"
                className="btn-theme-cycle"
                onClick={() => setThemePickerOpen((v) => !v)}
                aria-expanded={themePickerOpen}
                aria-label={`Theme: ${theme.label}. Click to choose`}
              >
                <span className="btn-theme-icon" aria-hidden="true">{theme.icon}</span>
                <span className="btn-theme-label">{theme.label}</span>
                <ChevronIcon open={themePickerOpen} />
              </button>

              {themePickerOpen && (
                <div className="navbar-theme-dropdown" role="listbox" aria-label="Choose a theme">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className={`navbar-theme-option${t.id === theme.id ? ' active' : ''}`}
                      role="option"
                      aria-selected={t.id === theme.id}
                      onClick={() => handleSelectTheme(t.id)}
                    >
                      <span className="navbar-theme-option-icon">{t.icon}</span>
                      <span className="navbar-theme-option-label">{t.label}</span>
                      {t.id === theme.id && <CheckIcon />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/signin"
              className={active === 'Sign In' ? 'btn-signin active' : 'btn-signin'}
            >
              Sign In
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
