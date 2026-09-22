import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useFavourites } from '../context/FavouritesContext.jsx'
import { progressApi } from '../lib/api.js'
import { usePlaces } from '../context/PlacesContext.jsx'

const TABS = ['Overview', 'Timeline', 'Key Figures', 'Gallery']

function HeartIcon({ filled }) {
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

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="18" cy="5" r="2.6" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="6" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="18" cy="19" r="2.6" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8.3 10.7l7.4-4.2M8.3 13.3l7.4 4.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="12" cy="9.5" r="2.3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function initials(name = '') {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function Place() {
  const { placeId } = useParams()
  const { getPlaceById } = usePlaces()
  const place = getPlaceById(placeId || 'colosseum')
  const navigate = useNavigate()
  const { isAuthenticated, token, refreshUser } = useAuth()
  const { isFavourite, toggleFavourite } = useFavourites()

  const [activeTab, setActiveTab] = useState('Overview')
  const [showLoginNotice, setShowLoginNotice] = useState(false)
  const liked = place ? isFavourite(place.id) : false

  // Auto-dismiss the "please log in" notice so it doesn't linger forever.
  useEffect(() => {
    if (!showLoginNotice) return
    const timer = setTimeout(() => setShowLoginNotice(false), 4000)
    return () => clearTimeout(timer)
  }, [showLoginNotice])

  // Visiting a place's page is what counts toward countries explored -- but
  // only for a signed-in account, since the count lives on the account, not
  // the browser. This fires once per place per page load; the server-side
  // visit list is idempotent, so re-visiting an already-visited place is a
  // harmless no-op. Guests can still browse freely, it just won't count
  // until they sign in.
  useEffect(() => {
    if (!place || !isAuthenticated || !token) return
    progressApi
      .visitPlace(token, place.id)
      .then(() => refreshUser())
      .catch(() => {
        // Best-effort -- a failed sync shouldn't block browsing.
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [place?.id, isAuthenticated, token])

  if (!place) {
    return (
      <div className="page place-page">
        <Navbar active="Explore" />
        <div className="place-not-found">
          <h2>We couldn't find that place.</h2>
          <p>It may not be in the dataset yet.</p>
          <Link to="/explore" className="btn-primary">Back to Explore</Link>
        </div>
      </div>
    )
  }

  function handleStartQuiz() {
    if (isAuthenticated) {
      navigate(`/quiz/${place.id}`)
    } else {
      navigate('/signin', { state: { from: { pathname: `/quiz/${place.id}` } } })
    }
  }

  // Favouriting is just a bookmark now -- visiting (above) is what counts
  // toward countries explored, so this no longer needs to call the API.
  function handleToggleFavourite() {
    if (!isAuthenticated) {
      setShowLoginNotice(true)
      return
    }
    toggleFavourite(place.id)
  }

  return (
    <div className="page place-page">
      <Navbar active="Explore" />

      <div className="place-wrap">
        <div className="place-grid">
          {/* -------- left: media + tabs -------- */}
          <div className="place-media">
            <img src={place.image} alt={place.name} className="place-hero-img" />

            <div className="place-tab-strip" role="tablist" aria-label={`${place.name} sections`}>
              {TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab}
                  className={activeTab === tab ? 'place-tab active' : 'place-tab'}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="place-tab-panel">
              {activeTab === 'Overview' && <p className="place-overview-text">{place.overview}</p>}

              {activeTab === 'Timeline' && (
                <ol className="place-timeline">
                  {place.timeline.map((item) => (
                    <li key={item.year + item.label} className="place-timeline-item">
                      <span className="place-timeline-year">{item.year}</span>
                      <div>
                        <p className="place-timeline-label">{item.label}</p>
                        <p className="place-timeline-detail">{item.detail}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}

              {activeTab === 'Key Figures' && (
                <div className="place-figures-grid">
                  {place.keyFigures.map((fig) => (
                    <div key={fig.id} className="place-figure-card">
                      <span className="place-figure-avatar">{initials(fig.name)}</span>
                      <p className="place-figure-name">{fig.name}</p>
                      <p className="place-figure-role">{fig.role}</p>
                      <p className="place-figure-bio">{fig.bio}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'Gallery' && (
                <div className="place-gallery-grid">
                  {place.gallery.map((g, i) => (
                    <figure key={g.caption + i} className="place-gallery-item">
                      <img src={g.image} alt={g.caption} />
                      <figcaption>{g.caption}</figcaption>
                    </figure>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* -------- right: info panel -------- */}
          <div className="place-info">
            <div className="place-info-top-row">
              <div className="place-badges">
                <span className="place-badge place-badge-filled">{place.category}</span>
                {place.tags
                  .filter((t) => t !== place.category)
                  .map((t) => (
                    <span key={t} className="place-badge place-badge-outline">{t}</span>
                  ))}
              </div>

              <div className="place-actions">
                <button
                  type="button"
                  className={liked ? 'place-icon-btn liked' : 'place-icon-btn'}
                  aria-label="Save place"
                  aria-pressed={liked}
                  onClick={handleToggleFavourite}
                >
                  <HeartIcon filled={liked} />
                </button>
                <button type="button" className="place-icon-btn" aria-label="Share place">
                  <ShareIcon />
                </button>
              </div>
            </div>

            <h1 className="place-title">{place.name}</h1>

            <div className="place-meta-row">
              <span className="place-meta-item"><PinIcon /> {place.location}</span>
              <span className="place-meta-dot">•</span>
              <span className="place-meta-item"><ClockIcon /> {place.dateLabel}</span>
            </div>

            <p className="place-summary">{place.summary}</p>

            <div className="place-key-figures-section">
              <p className="place-section-label">Key Figures</p>
              <div className="place-avatar-row">
                {place.keyFigures.map((fig) => (
                  <span key={fig.id} className="place-avatar-circle" title={fig.name}>
                    {initials(fig.name)}
                  </span>
                ))}
              </div>
            </div>

            <div className="place-facts-card">
              {Object.entries(place.quickFacts).map(([label, value]) => (
                <div key={label} className="place-facts-row">
                  <span className="place-facts-label">{label}</span>
                  <span className="place-facts-value">{value}</span>
                </div>
              ))}
            </div>

            <button type="button" className="btn-start-quiz" onClick={handleStartQuiz}>
              Start Quiz
            </button>
          </div>
        </div>
      </div>

      {showLoginNotice && (
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
            onClick={() => navigate('/signin', { state: { from: { pathname: `/place/${place.id}` } } })}
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
        </div>
      )}
    </div>
  )
}
