import { Link } from 'react-router-dom'
import globeImg from '../assets/globe.png'
import Navbar from '../components/Navbar.jsx'
import CountUp from '../components/CountUp.jsx'
import OwlGuide from '../components/OwlGuide.jsx'
import { useLanguage, richText } from '../i18n/LanguageContext.jsx'

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

export default function Home() {
  const { t, locale } = useLanguage()
  return (
    <div className="page">
      <Navbar active="Home" />

      <header className="hero">
        <div className="hero-copy">
          <h1 className="hero-title">
            {richText(t('home.title'), { accent: (text) => <span className="accent">{text}</span> })}
          </h1>

          <p className="hero-sub">{t('home.subtitle')}</p>

          <div className="hero-actions">
            <Link to="/explore" className="btn-primary">
              {t('common.startExploring')} <ArrowIcon />
            </Link>
            <Link to="/how-it-works" className="btn-secondary">
              {t('home.learnMore')}
            </Link>
          </div>

          <div className="stats-row">
            <div className="stat">
              <span className="stat-icon"><ShieldIcon /></span>
              <span>
                <span className="stat-value"><CountUp to={50000} locale={locale} suffix="+" /></span>
                <br />
                <span className="stat-label">{t('home.statEvents')}</span>
              </span>
            </div>
            <div className="stat">
              <span className="stat-icon"><PinIcon /></span>
              <span>
                <span className="stat-value"><CountUp to={200} locale={locale} suffix="+" /></span>
                <br />
                <span className="stat-label">{t('home.statCountries')}</span>
              </span>
            </div>
            <div className="stat">
              <span className="stat-icon"><ClockIcon /></span>
              <span>
                <span className="stat-value">{t('home.statFromYear')}</span>
                <br />
                <span className="stat-label">{t('home.statToPresent')}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="hero-globe">
          {/* a soft glow and a dashed orbit ring behind the floating globe */}
          <span className="hero-globe-glow" aria-hidden="true" />
          <span className="hero-globe-orbit" aria-hidden="true" />
          <img src={globeImg} alt={t('home.globeAlt')} className="globe-img" />
        </div>

        <OwlGuide />
      </header>
    </div>
  )
}
