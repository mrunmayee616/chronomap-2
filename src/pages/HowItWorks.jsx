import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { TrophyIcon, ClockIcon, QuizIcon, CrownIcon, MapPinIcon } from '../components/Icons.jsx'

function ArrowIcon() {
  return (
    <svg className="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}

function FilterIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M4 5h16M7 12h10M10 19h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 20s-7-4.4-9.5-9C.8 7.6 2.6 4 6.2 4c2 0 3.6 1.1 4.3 2.7C11.2 5.1 12.8 4 14.8 4c3.6 0 5.4 3.6 3.7 7-2.5 4.6-9.5 9-9.5 9z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  )
}

const STEPS = [
  {
    icon: <GlobeIcon />,
    title: 'Explore the map',
    body: 'Head to Explore and spin the interactive 3D globe or switch to the flat 2D map — both show every historical place as a pin you can click.',
  },
  {
    icon: <FilterIcon />,
    title: 'Filter and search',
    body: 'Narrow things down by category — Battles, Kingdoms, Discoveries, Revolution, Monuments, Treaties — drag the era slider to a time period, or just search a place by name.',
  },
  {
    icon: <MapPinIcon size={22} />,
    title: 'Open a place',
    body: 'Click any pin to see its story: an overview, a chronological timeline of everything that happened there, quick facts, and a photo gallery.',
  },
  {
    icon: <QuizIcon size={22} />,
    title: 'Take the quiz',
    body: 'Every place has a short quiz about what you just read. Score 80% or higher to have it count — you can always retake a quiz, but only your first pass earns XP.',
  },
  {
    icon: <TrophyIcon size={22} />,
    title: 'Earn XP and level up',
    body: 'Passing a quiz for the first time earns you XP. Rack up enough and you level up — your title and level show on your profile and next to your name.',
  },
  {
    icon: <CrownIcon size={22} />,
    title: 'Climb the leaderboard',
    body: 'The leaderboard ranks explorers by XP earned this week, month, or year — recalculated live, so it always reflects real activity, not a stale snapshot.',
  },
  {
    icon: <HeartIcon />,
    title: 'Track your journey',
    body: 'Favorite the places you love, and watch your "Countries Explored" count grow on your profile — a country only counts once you\u2019ve visited every place pinned there.',
  },
]

export default function HowItWorks() {
  return (
    <div className="page howitworks-page">
      <Navbar active="Home" />

      <div className="hiw-hero">
        <span className="hiw-eyebrow">
          <ClockIcon size={16} /> How it works
        </span>
        <h1 className="hiw-title">
          From <span className="accent">curious</span> to <span className="accent">expert</span>,
          <br />
          one place at a time.
        </h1>
        <p className="hiw-sub">
          ChronoMap blends a map, a timeline, and a quiz into one loop: explore a place,
          learn its story, prove what you learned, and watch your progress grow.
        </p>
      </div>

      <section className="hiw-steps">
        {STEPS.map((step, i) => (
          <div className="hiw-step-card" key={step.title}>
            <span className="hiw-step-number">{String(i + 1).padStart(2, '0')}</span>
            <span className="hiw-step-icon">{step.icon}</span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </div>
        ))}
      </section>

      <section className="hiw-note">
        <p>
          Browsing is open to everyone — but visiting places, taking quizzes, favoriting,
          and appearing on the leaderboard all need a free account, since that progress is
          tied to you, not your browser.
        </p>
      </section>

      <section className="hiw-cta">
        <Link to="/explore" className="btn-primary">
          Start Exploring <ArrowIcon />
        </Link>
        <Link to="/register" className="btn-secondary">
          Create an Account
        </Link>
      </section>
    </div>
  )
}
