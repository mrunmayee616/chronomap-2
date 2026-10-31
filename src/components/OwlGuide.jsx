import { useState } from 'react'
import ProfessorOwl from './ProfessorOwl.jsx'
import { useT } from '../i18n/LanguageContext.jsx'

// Professor Owl on the home page: click him (or his speech bubble) for the
// next tip. He can be sent away with the ×, and stays away for the session.
const TIP_COUNT = 5
const DISMISS_KEY = 'chronomap-owl-guide-dismissed'

function wasDismissed() {
  try {
    return sessionStorage.getItem(DISMISS_KEY) === '1'
  } catch {
    return false
  }
}

export default function OwlGuide() {
  const t = useT()
  const [tip, setTip] = useState(0)
  const [hidden, setHidden] = useState(wasDismissed)
  const [bump, setBump] = useState(0)

  if (hidden) return null

  const next = () => {
    setTip((n) => (n + 1) % TIP_COUNT)
    setBump((n) => n + 1)
  }
  const dismiss = () => {
    setHidden(true)
    try {
      sessionStorage.setItem(DISMISS_KEY, '1')
    } catch {
      // private mode -- he'll just come back next visit
    }
  }

  return (
    <div className="owl-guide">
      <button type="button" className="owl-guide-owl" onClick={next} aria-label={t('home.owlNextTip')}>
        <ProfessorOwl size={84} />
      </button>
      <div className="owl-guide-bubble" key={bump}>
        <button type="button" className="owl-guide-close" onClick={dismiss} aria-label={t('home.owlDismiss')}>
          ×
        </button>
        <p className="owl-guide-text">{t(`home.owlTips.${tip}`)}</p>
        <button type="button" className="owl-guide-next" onClick={next}>
          {t('home.owlMore')} <span aria-hidden="true">→</span>
          <span className="owl-guide-dots" aria-hidden="true">
            {Array.from({ length: TIP_COUNT }, (_, i) => (
              <i key={i} className={i === tip ? 'on' : ''} />
            ))}
          </span>
        </button>
      </div>
    </div>
  )
}
