import globeImg from '../assets/globe.png'
import Navbar from '../components/Navbar.jsx'

function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 2.5l7.5 3v5.2c0 5-3.2 8.9-7.5 10.3-4.3-1.4-7.5-5.3-7.5-10.3V5.5l7.5-3z"
        stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21z"
        stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="12" cy="9.5" r="2.3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg className="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function noop(e) {
  e.preventDefault()
}

export default function Home() {
  return (
    <div className="page">
      <Navbar active="Home" />

      <header className="hero">
        <div className="hero-copy">
          <h1 className="hero-title">
            Explore <span className="accent">History.</span>
            <br />
            Understand the World
          </h1>

          <p className="hero-sub">
            Discover historical events, legendary places and incredible stories
            from across time and space
          </p>

          <div className="hero-actions">
            <a href="#" className="btn-primary" onClick={noop}>
              Start Exploring <ArrowIcon />
            </a>
            <a href="#" className="btn-secondary" onClick={noop}>
              Learn More
            </a>
          </div>

          <div className="stats-row">
            <div className="stat">
              <span className="stat-icon"><ShieldIcon /></span>
              <span>
                <span className="stat-value">50,000+</span>
                <br />
                <span className="stat-label">Historical Events</span>
              </span>
            </div>
            <div className="stat">
              <span className="stat-icon"><PinIcon /></span>
              <span>
                <span className="stat-value">200+</span>
                <br />
                <span className="stat-label">Countries Covered</span>
              </span>
            </div>
            <div className="stat">
              <span className="stat-icon"><ClockIcon /></span>
              <span>
                <span className="stat-value">3000 BCE</span>
                <br />
                <span className="stat-label">To Present</span>
              </span>
            </div>
          </div>
        </div>

        <div className="hero-globe">
          <img src={globeImg} alt="Globe showing historical event locations" className="globe-img" />
        </div>
      </header>
    </div>
  )
}
