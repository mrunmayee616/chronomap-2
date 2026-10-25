import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { useT, richText } from '../i18n/LanguageContext.jsx'
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
    key: 'explore',
  },
  {
    icon: <FilterIcon />,
    key: 'filter',
  },
  {
    icon: <MapPinIcon size={22} />,
    key: 'open',
  },
  {
    icon: <QuizIcon size={22} />,
    key: 'quiz',
  },
  {
    icon: <TrophyIcon size={22} />,
    key: 'xp',
  },
  {
    icon: <CrownIcon size={22} />,
    key: 'leaderboard',
  },
  {
    icon: <HeartIcon />,
    key: 'journey',
  },
]

export default function HowItWorks() {
  const t = useT()
  return (
    <div className="page howitworks-page">
      <Navbar active="Home" />

      <div className="hiw-hero">
        <span className="hiw-eyebrow">
          <ClockIcon size={16} /> {t('howItWorks.eyebrow')}
        </span>
        <h1 className="hiw-title">{richText(t('howItWorks.title'), { accent: (text) => <span className="accent">{text}</span> })}</h1>
        <p className="hiw-sub">{t('howItWorks.subtitle')}</p>
      </div>

      <section className="hiw-steps">
        {STEPS.map((step, i) => (
          <div className="hiw-step-card" key={step.key}>
            <span className="hiw-step-number">{String(i + 1).padStart(2, '0')}</span>
            <span className="hiw-step-icon">{step.icon}</span>
            <h3>{t(`howItWorks.steps.${step.key}.title`)}</h3>
            <p>{t(`howItWorks.steps.${step.key}.body`)}</p>
          </div>
        ))}
      </section>

      <section className="hiw-note">
        <p>{t('howItWorks.note')}</p>
      </section>

      <section className="hiw-cta">
        <Link to="/explore" className="btn-primary">
          {t('common.startExploring')} <ArrowIcon />
        </Link>
        <Link to="/register" className="btn-secondary">
          {t('howItWorks.createAccount')}
        </Link>
      </section>
    </div>
  )
}
