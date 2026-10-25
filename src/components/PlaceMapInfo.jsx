import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import CountryFlag from './CountryFlag.jsx'
import FavouriteButton from './FavouriteButton.jsx'
import { formatCoords, placeCountry } from '../lib/placeInfo.js'
import { useLanguage, countryName } from '../i18n/LanguageContext.jsx'

// The on-map information for a place on the Explore page: a compact card
// that follows the cursor while hovering a pin, and a full panel that opens
// when a pin is clicked. Both render over either map engine (Leaflet 2D or
// Cesium 3D), which only report which place is hovered/selected and where.

function CalendarIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3.5 10h17M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function CrosshairIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function Location({ place }) {
  const { locale } = useLanguage()
  const country = placeCountry(place)
  // "City, Country" with the country named in the current language.
  const city = country.name ? place.location.slice(0, -(country.name.length + 2)) : place.location
  const label = country.code ? `${city}, ${countryName(country.code, locale, country.name)}` : place.location
  return (
    <span className="map-info-location">
      {country.code && <CountryFlag code={country.code} size={16} />}
      <span>{label}</span>
    </span>
  )
}

/* ---------- hover card ---------- */

const HOVER_CARD_HALF_WIDTH = 130
const PIN_HEIGHT = 34

// x/y are the pin's tip in map-panel pixels; bounds is the panel width, used
// to keep the card from hanging off either edge.
export function MapHoverCard({ place, x, y, bounds }) {
  const { t, tValue } = useLanguage()
  if (!place) return null
  const left = Math.min(Math.max(x, HOVER_CARD_HALF_WIDTH + 8), Math.max(bounds - HOVER_CARD_HALF_WIDTH - 8, 0))
  const below = y < 150 // too close to the top edge: show it under the pin instead
  const events = place.timeline?.length || 0

  return (
    <div
      className={`map-hover-card${below ? ' is-below' : ''}`}
      style={{ left, top: below ? y + 10 : y - PIN_HEIGHT - 10 }}
      role="tooltip"
    >
      <p className="map-hover-name">{place.name}</p>
      <Location place={place} />
      <p className="map-hover-meta">
        {place.dateLabel} · {tValue('categories', place.category)}
        {events > 0 && ` · ${t('map.events', { count: events })}`}
      </p>
      <p className="map-hover-hint">{t('map.clickForDetails')}</p>
    </div>
  )
}

/* ---------- info panel ---------- */

export function PlaceInfoPanel({ place, onClose }) {
  const { t, tValue } = useLanguage()
  const panelRef = useRef(null)

  // New place: start reading from the top and move focus into the panel so
  // keyboard and screen-reader users land on what just opened.
  useEffect(() => {
    if (!panelRef.current) return
    panelRef.current.scrollTop = 0
    panelRef.current.focus({ preventScroll: true })
  }, [place?.id])

  if (!place) return null
  const timeline = place.timeline || []
  const figures = place.keyFigures || []
  const quizCount = place.quiz?.length || 0

  return (
    <aside
      ref={panelRef}
      className="map-info-panel"
      aria-label={t('map.detailsLabel', { name: place.name })}
      tabIndex={-1}
    >
      <div className="map-info-hero">
        {place.image && <img src={place.image} alt="" />}
        <FavouriteButton place={place} className="map-info-fav" />
        <button type="button" className="map-info-close" onClick={onClose} aria-label={t('map.closeDetails')}>
          <CloseIcon />
        </button>
      </div>

      <div className="map-info-body">
        <div className="map-info-badges">
          <span className="map-info-badge map-info-badge-category">{tValue('categories', place.category)}</span>
          {place.era && <span className="map-info-badge">{tValue('eras', place.era)}</span>}
        </div>

        <h2 className="map-info-title">{place.name}</h2>

        <dl className="map-info-facts">
          <div>
            <dt>{t('place.facts.location')}</dt>
            <dd><Location place={place} /></dd>
          </div>
          <div>
            <dt>{t('place.facts.date')}</dt>
            <dd className="map-info-icon-row"><CalendarIcon /> {place.dateLabel}</dd>
          </div>
          <div>
            <dt>{t('map.coordinates')}</dt>
            <dd className="map-info-icon-row"><CrosshairIcon /> {formatCoords(place.coords)}</dd>
          </div>
        </dl>

        {place.summary && <p className="map-info-summary">{place.summary}</p>}

        {timeline.length > 0 && (
          <section className="map-info-section">
            <h3 className="map-info-heading">{t('place.tabs.timeline')} · {t('map.events', { count: timeline.length })}</h3>
            <ol className="map-info-timeline">
              {timeline.map((event, i) => (
                <li key={`${event.year}-${i}`}>
                  <span className="map-info-year">{event.year}</span>
                  <p className="map-info-event">{event.label}</p>
                  {/* The generated data often reuses an event's detail as the
                      place summary -- don't print the same text twice. */}
                  {event.detail && event.detail !== event.label && event.detail !== place.summary && (
                    <p className="map-info-detail">{event.detail}</p>
                  )}
                </li>
              ))}
            </ol>
          </section>
        )}

        {figures.length > 0 && (
          <section className="map-info-section">
            <h3 className="map-info-heading">{t('place.tabs.keyFigures')}</h3>
            <ul className="map-info-figures">
              {figures.map((fig) => (
                <li key={fig.id || fig.name}>
                  <span className="map-info-event">{fig.name}</span>
                  {fig.role && <span className="map-info-detail"> — {fig.role}</span>}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <div className="map-info-actions">
        <Link to={`/place/${place.id}`} className="btn-primary">{t('map.viewDetails')}</Link>
        {quizCount > 0 && (
          <Link to={`/quiz/${place.id}`} className="btn-secondary">
            {t('map.takeQuiz')} · {quizCount}
          </Link>
        )}
      </div>
    </aside>
  )
}

/* ---------- stats chip ---------- */

export function MapStats({ places, range }) {
  const { t } = useLanguage()
  const year = (y) => (y < 0 ? t('years.bce', { year: -Math.round(y) }) : t('years.ce', { year: Math.max(Math.round(y), 1) }))
  const countries = new Set(places.map((p) => placeCountry(p).name).filter(Boolean))
  return (
    <div className="map-stats" aria-live="polite">
      <strong>{t('map.places', { count: places.length })}</strong>
      <span className="map-stats-sep" aria-hidden="true">·</span>
      <span>{t('map.countries', { count: countries.size })}</span>
      <span className="map-stats-sep" aria-hidden="true">·</span>
      <span>{year(range[0])} – {year(range[1])}</span>
    </div>
  )
}
