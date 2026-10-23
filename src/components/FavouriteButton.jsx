import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useFavourites } from '../context/FavouritesContext.jsx'

export function HeartIcon({ filled }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'}>
      <path
        d="M12 20.5s-7.5-4.6-10-9.3C.5 8 2 4.5 5.5 3.6c2.2-.6 4.4.3 6.5 2.6 2.1-2.3 4.3-3.2 6.5-2.6C22 4.5 23.5 8 22 11.2c-2.5 4.7-10 9.3-10 9.3z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// The heart toggle for a place, shared by the Place page and the Explore
// map's info panel so both save into the same per-account favourites list
// (FavouritesContext) that the Profile dashboard reads. Favouriting is just a
// bookmark -- visiting is what counts toward progress, so this never calls
// the API. Guests get a "log in" toast instead.
export default function FavouriteButton({ place, className = '' }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const { isFavourite, toggleFavourite } = useFavourites()
  const [showLoginNotice, setShowLoginNotice] = useState(false)
  const liked = isFavourite(place.id)

  // Auto-dismiss the "please log in" notice so it doesn't linger forever.
  useEffect(() => {
    if (!showLoginNotice) return
    const timer = setTimeout(() => setShowLoginNotice(false), 4000)
    return () => clearTimeout(timer)
  }, [showLoginNotice])

  function handleToggleFavourite() {
    if (!isAuthenticated) {
      setShowLoginNotice(true)
      return
    }
    toggleFavourite(place.id)
  }

  return (
    <>
      <button
        type="button"
        className={`place-icon-btn${liked ? ' liked' : ''}${className ? ` ${className}` : ''}`}
        aria-label={liked ? 'Remove from favourites' : 'Save place'}
        aria-pressed={liked}
        onClick={handleToggleFavourite}
      >
        <HeartIcon filled={liked} />
      </button>

      {/* Portalled so the fixed-position toast isn't trapped inside a parent
          with backdrop-filter (the map info panel has one). */}
      {showLoginNotice &&
        createPortal(
          <div className="login-toast" role="alert">
            <span className="login-toast-icon">
              <HeartIcon filled={false} />
            </span>
            <div className="login-toast-body">
              <p className="login-toast-title">Log in to save favourites</p>
              <p className="login-toast-text">Create a free account or sign in to start saving places.</p>
            </div>
            <button
              type="button"
              className="login-toast-cta"
              onClick={() => navigate('/signin', { state: { from: { pathname: location.pathname } } })}
            >
              Log In
            </button>
            <button
              type="button"
              className="login-toast-close"
              aria-label="Dismiss"
              onClick={() => setShowLoginNotice(false)}
            >
              ×
            </button>
          </div>,
          document.body
        )}
    </>
  )
}
