import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import ShareButton from '../components/ShareButton.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import FavouriteButton from '../components/FavouriteButton.jsx'
import { progressApi } from '../lib/api.js'
import { usePlaces } from '../context/PlacesContext.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'

const TABS = ['Overview', 'Timeline', 'Key Figures', 'Gallery']
const TAB_KEYS = { Overview: 'overview', Timeline: 'timeline', 'Key Figures': 'keyFigures', Gallery: 'gallery' }
// quickFacts keys in the dataset -> dictionary keys
const FACT_KEYS = { Date: 'date', Location: 'location', Category: 'category', Era: 'era' }

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
  const { isAuthenticated, token, refreshUser, user } = useAuth()
  const { t, tValue } = useLanguage()

  const [activeTab, setActiveTab] = useState('Overview')

  // Visiting a place's page is what counts toward countries explored -- but
  // only for a signed-in account, since the count lives on the account, not
  // the browser. This fires once per place per page load; the server-side
  // visit list is idempotent, so re-visiting an already-visited place is a
  // harmless no-op. Guests can still browse freely, it just won't count
  // until they sign in. The admin's activity is never tracked (the server
  // ignores it anyway), so it isn't sent.
  useEffect(() => {
    if (!place || !isAuthenticated || !token || user?.isAdmin) return
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
          <h2>{t('place.notFoundTitle')}</h2>
          <p>{t('place.notFoundBody')}</p>
          <Link to="/explore" className="btn-primary">{t('place.backToExplore')}</Link>
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

  return (
    <div className="page place-page">
      <Navbar active="Explore" />

      <div className="place-wrap">
        <div className="place-grid">
          {/* -------- left: media + tabs -------- */}
          <div className="place-media">
            <img src={place.image} alt={place.name} className="place-hero-img" />

            <div className="place-tab-strip" role="tablist" aria-label={t('place.sectionsLabel', { name: place.name })}>
              {TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab}
                  className={activeTab === tab ? 'place-tab active' : 'place-tab'}
                  onClick={() => setActiveTab(tab)}
                >
                  {t(`place.tabs.${TAB_KEYS[tab]}`)}
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
                <span className="place-badge place-badge-filled">{tValue('categories', place.category)}</span>
                {place.tags
                  .filter((t) => t !== place.category)
                  .map((t) => (
                    <span key={t} className="place-badge place-badge-outline">{t}</span>
                  ))}
              </div>

              <div className="place-actions">
                <FavouriteButton place={place} />
                <ShareButton
                  title={place.name}
                  text={t('place.shareText', { name: place.name, location: place.location })}
                  path={`/place/${place.id}`}
                />
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
              <p className="place-section-label">{t('place.tabs.keyFigures')}</p>
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
                  <span className="place-facts-label">{FACT_KEYS[label] ? t(`place.facts.${FACT_KEYS[label]}`) : label}</span>
                  <span className="place-facts-value">
                    {label === 'Category' ? tValue('categories', value) : label === 'Era' ? tValue('eras', value) : value}
                  </span>
                </div>
              ))}
            </div>

            <button type="button" className="btn-start-quiz" onClick={handleStartQuiz}>
              {t('place.startQuiz')}
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}
