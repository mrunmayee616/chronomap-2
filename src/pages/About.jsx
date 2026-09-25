import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { avatarUrlFor } from '../lib/avatar.js'

const TEAM = [
  {
    name: 'Anmol Rai',
    seed: 'anmol-rai-chronomap',
  },
  {
    name: 'Mrunmayee Raje',
    seed: 'mrunmayee-raje-chronomap',
  },
  {
    name: 'Sneha Ramamurthy',
    seed: 'sneha-ramamurthy-chronomap',
  },
]

function CompassIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path d="M15 9l-2 6-6 2 2-6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

function BookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21V5.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M4 5.5V21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function SparkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
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

export default function About() {
  return (
    <div className="page about-page">
      <Navbar active="About" />

      <div className="about-hero">
        <span className="about-eyebrow">
          <CompassIcon /> About the project
        </span>
        <h1 className="about-title">
          History, made to be <span className="accent">explored.</span>
        </h1>
        <p className="about-sub">
          ChronoMap turns world history into a living, interactive map — pin by pin,
          era by era — so learning it feels closer to exploring than memorizing.
        </p>
      </div>

      <section className="about-section about-mission">
        <div className="about-mission-card">
          <span className="about-mission-icon"><BookIcon /></span>
          <div>
            <h2>Why we built it</h2>
            <p>
              Most history lives in long paragraphs and disconnected dates. ChronoMap
              anchors it to places instead — a city, a battlefield, a monument — so you can
              see where something happened before learning what happened there. Timelines,
              quizzes, and a bit of friendly competition on the leaderboard turn passive
              reading into active exploration.
            </p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2 className="about-section-title">
          <SparkIcon /> The team
        </h2>
        <p className="about-section-sub">
          ChronoMap was designed and built by three developers as a software engineering
          project at K. J. Somaiya College of Engineering, Mumbai.
        </p>

        <div className="about-team-grid">
          {TEAM.map((person) => (
            <div className="about-team-card" key={person.name}>
              <img src={avatarUrlFor(person.seed)} alt="" className="about-team-avatar" />
              <p className="about-team-name">{person.name}</p>
              <p className="about-team-role">Creator &amp; Developer</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-section about-cta">
        <p>Ready to see it for yourself?</p>
        <Link to="/explore" className="btn-primary">
          Start Exploring <ArrowIcon />
        </Link>
      </section>
    </div>
  )
}
