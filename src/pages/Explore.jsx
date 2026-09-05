import { useMemo, useRef, useState } from 'react'
import Navbar from '../components/Navbar.jsx'

/* ---------- constants ---------- */

const MIN_YEAR = -3000 // 3000 BCE
const MAX_YEAR = 2026  // 2026 CE

const CATEGORIES = [
  { key: 'Events', label: 'Events', Icon: CoinIcon },
  { key: 'Battles', label: 'Battles', Icon: SwordsIcon },
  { key: 'Kingdoms', label: 'Kingdoms', Icon: CrownIcon },
  { key: 'Discoveries', label: 'Discoveries', Icon: CompassIcon },
  { key: 'Revolution', label: 'Revolution', Icon: RevolutionIcon },
  { key: 'Monuments', label: 'Monuments', Icon: MonumentIcon },
  { key: 'Treaties', label: 'Treaties', Icon: TreatyIcon },
]

const ERA_PRESETS = [
  { label: 'Ancient', range: [-3000, 500] },
  { label: 'Medieval', range: [500, 1500] },
  { label: 'Renaissance', range: [1400, 1700] },
  { label: 'Modern', range: [1700, 2026] },
]

/* ---------- small icon components ---------- */

function SearchIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function CoinIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9.5 14.5c.3 1 1.2 1.5 2.5 1.5 1.6 0 2.6-.7 2.6-1.8 0-2.4-5-1-5-3.4 0-1.1 1-1.8 2.4-1.8 1.3 0 2.2.5 2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function SwordsIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path d="M3 21l6.5-6.5M14.5 9.5L21 3l-2 6-6.5 6.5M3 3l6 6M11 11l7.5 7.5-2 2L9 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CrownIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path d="M4 8l3.5 3L12 5l4.5 6L20 8l-1.5 10h-13L4 8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

function CompassIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M14.8 9.2l-2 4.6-4.6 2 2-4.6z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}

function RevolutionIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path d="M4 12a8 8 0 0 1 13.6-5.7M20 12a8 8 0 0 1-13.6 5.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M17.6 3.5v3.3h-3.3M6.4 20.5v-3.3h3.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MonumentIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path d="M12 2.5l3 5.5H9l3-5.5zM7 9h10M6 21V11M10 21V11M14 21V11M18 21V11M4 21h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TreatyIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path d="M6 3h9l4 4v14H6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 12h6M9 16h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function ZoomInIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M12 6v12M6 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function ZoomOutIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M6 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function CompassRoseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M12 6.5l2.6 5.5-2.6 5.5-2.6-5.5z" fill="var(--yellow)" />
    </svg>
  )
}

/* ---------- helpers ---------- */

function formatYear(y) {
  const n = Math.round(y)
  if (n < 0) return `${Math.abs(n)}BCE`
  if (n === 0) return '1CE'
  return `${n}CE`
}

function pct(y) {
  return ((y - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100
}

/* ---------- simplified world map (2D) ---------- */

function WorldMap2D() {
  return (
    <svg className="world-svg" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="ocean" cx="50%" cy="38%" r="75%">
          <stop offset="0%" stopColor="#132043" />
          <stop offset="55%" stopColor="#0c1730" />
          <stop offset="100%" stopColor="#070c1c" />
        </radialGradient>
        <linearGradient id="land" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a5a3a" />
          <stop offset="100%" stopColor="#39472e" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="1000" height="500" fill="url(#ocean)" />

      {/* graticule */}
      <g stroke="#ffffff10" strokeWidth="1">
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`v${i}`} x1={(i + 1) * 100} y1="0" x2={(i + 1) * 100} y2="500" />
        ))}
        {Array.from({ length: 4 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={(i + 1) * 100} x2="1000" y2={(i + 1) * 100} />
        ))}
      </g>

      {/* simplified continents (stylised, low-poly) */}
      <g fill="url(#land)" stroke="#00000030" strokeWidth="1.5" strokeLinejoin="round">
        {/* North America */}
        <path d="M95 95 L175 70 L235 90 L255 140 L230 175 L245 210 L205 245 L175 235 L150 260 L110 235 L120 190 L90 165 L100 130 Z" />
        {/* South America */}
        <path d="M215 280 L255 270 L275 310 L265 370 L245 430 L215 425 L205 360 L190 320 Z" />
        {/* Europe */}
        <path d="M470 95 L525 80 L560 100 L545 130 L565 150 L530 175 L495 165 L480 135 Z" />
        {/* Africa */}
        <path d="M480 190 L545 180 L575 220 L565 280 L540 350 L505 400 L470 370 L460 300 L470 240 Z" />
        {/* Asia */}
        <path d="M575 85 L680 70 L780 95 L840 130 L820 175 L860 210 L820 250 L760 240 L720 270 L670 245 L640 200 L600 210 L575 165 L595 130 Z" />
        {/* Australia */}
        <path d="M800 340 L865 330 L900 360 L885 400 L830 405 L795 375 Z" />
      </g>
    </svg>
  )
}

/* ---------- rotating 3D globe ---------- */

function Globe3D() {
  return (
    <div className="globe3d-wrap">
      <div className="globe3d-halo" />
      <div className="globe3d-sphere">
        <div className="globe3d-surface">
          <WorldMap2D />
          <WorldMap2D />
        </div>
        <div className="globe3d-shading" />
        <div className="globe3d-grid" />
      </div>
    </div>
  )
}

/* ---------- dual range timeline ---------- */

function TimelineRange({ range, setRange }) {
  const [from, to] = range
  const dragging = useRef(null)

  function clamp(v) {
    return Math.min(MAX_YEAR, Math.max(MIN_YEAR, v))
  }

  function handleFromInput(e) {
    const v = clamp(Number(e.target.value))
    setRange([Math.min(v, to - 1), to])
  }

  function handleToInput(e) {
    const v = clamp(Number(e.target.value))
    setRange([from, Math.max(v, from + 1)])
  }

  function handleFromNumber(e) {
    const v = clamp(Number(e.target.value) || MIN_YEAR)
    setRange([Math.min(v, to - 1), to])
  }

  function handleToNumber(e) {
    const v = clamp(Number(e.target.value) || MAX_YEAR)
    setRange([from, Math.max(v, from + 1)])
  }

  const leftPct = pct(from)
  const rightPct = pct(to)
  // give the thumb that's behind (closer to the opposite edge) a higher
  // z-index so both remain draggable even when the range is narrow
  const fromOnTop = from > (MIN_YEAR + MAX_YEAR) / 2

  return (
    <div className="timeline-bar">
      <span className="timeline-label">Timeline</span>

      <div className="timeline-controls">
        <span className="timeline-caption">Show Events From</span>

        <input
          className="timeline-year-input"
          type="text"
          value={formatYear(from)}
          onChange={handleFromNumber}
          aria-label="Start year"
        />

        <div className="timeline-track-wrap">
          <div className="timeline-track">
            <div
              className="timeline-track-fill"
              style={{ left: `${leftPct}%`, width: `${rightPct - leftPct}%` }}
            />
          </div>
          <input
            type="range"
            min={MIN_YEAR}
            max={MAX_YEAR}
            value={from}
            onChange={handleFromInput}
            className="timeline-thumb"
            style={{ zIndex: fromOnTop ? 3 : 2 }}
            aria-label="Start year slider"
          />
          <input
            type="range"
            min={MIN_YEAR}
            max={MAX_YEAR}
            value={to}
            onChange={handleToInput}
            className="timeline-thumb"
            style={{ zIndex: fromOnTop ? 2 : 3 }}
            aria-label="End year slider"
          />
        </div>

        <span className="timeline-caption">to</span>

        <input
          className="timeline-year-input"
          type="text"
          value={formatYear(to)}
          onChange={handleToNumber}
          aria-label="End year"
        />
      </div>
    </div>
  )
}

/* ---------- main page ---------- */

export default function Explore({ events = [] }) {
  const [mode, setMode] = useState('2D')
  const [activeCategory, setActiveCategory] = useState('Events')
  const [search, setSearch] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [range, setRange] = useState([MIN_YEAR, MAX_YEAR])

  const filteredEvents = useMemo(() => {
    const q = search.trim().toLowerCase()
    return events.filter((ev) => {
      const inCategory = activeCategory === 'Events' ? true : ev.category === activeCategory
      const inRange = ev.year >= range[0] && ev.year <= range[1]
      const inSearch =
        !q ||
        ev.title?.toLowerCase().includes(q) ||
        ev.place?.toLowerCase().includes(q)
      return inCategory && inRange && inSearch
    })
  }, [events, activeCategory, range, search])

  function applyPreset(preset) {
    setRange(preset.range)
    setFilterOpen(false)
  }

  return (
    <div className="page explore-page">
      <Navbar active="Explore" />

      <div className="explore-toolbar">
        <div className="explore-search">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search events, places or people.."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="explore-filter-wrap">
          <button
            type="button"
            className="btn-filter"
            onClick={() => setFilterOpen((v) => !v)}
            aria-expanded={filterOpen}
          >
            <FilterIcon /> Filter
          </button>

          {filterOpen && (
            <div className="filter-panel">
              <span className="filter-panel-title">Jump to era</span>
              {ERA_PRESETS.map((p) => (
                <button key={p.label} type="button" onClick={() => applyPreset(p)}>
                  {p.label}
                </button>
              ))}
              <button
                type="button"
                className="filter-reset"
                onClick={() => applyPreset({ range: [MIN_YEAR, MAX_YEAR] })}
              >
                Reset range
              </button>
            </div>
          )}
        </div>

        <div className="view-toggle" role="tablist" aria-label="Map view">
          <button
            type="button"
            role="tab"
            aria-selected={mode === '2D'}
            className={mode === '2D' ? 'active' : ''}
            onClick={() => setMode('2D')}
          >
            2D
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === '3D'}
            className={mode === '3D' ? 'active' : ''}
            onClick={() => setMode('3D')}
          >
            3D
          </button>
        </div>
      </div>

      <div className="explore-body">
        <aside className="explore-sidebar">
          {CATEGORIES.map(({ key, label, Icon }) => (
            <button
              key={key}
              type="button"
              className={key === activeCategory ? 'sidebar-item active' : 'sidebar-item'}
              onClick={() => setActiveCategory(key)}
              title={label}
            >
              <span className="sidebar-icon"><Icon /></span>
              <span className="sidebar-label">{label}</span>
            </button>
          ))}
        </aside>

        <div className="map-panel">
          <div
            className="map-viewport"
            style={mode === '2D' ? { transform: `scale(${zoom})` } : undefined}
          >
            {mode === '2D' ? <WorldMap2D /> : <Globe3D />}
          </div>

          {filteredEvents.length === 0 && (
            <div className="map-empty-note">
              No dataset connected yet — pins will appear here once events are loaded.
            </div>
          )}

          {mode === '2D' && (
            <div className="map-zoom-controls">
              <button type="button" onClick={() => setZoom((z) => Math.min(2.5, +(z + 0.2).toFixed(2)))} aria-label="Zoom in">
                <ZoomInIcon />
              </button>
              <button type="button" onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.2).toFixed(2)))} aria-label="Zoom out">
                <ZoomOutIcon />
              </button>
            </div>
          )}

          <div className="map-compass">
            <CompassRoseIcon />
          </div>
        </div>
      </div>

      <TimelineRange range={range} setRange={setRange} />
    </div>
  )
}
