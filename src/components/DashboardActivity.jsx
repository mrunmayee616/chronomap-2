import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ProfessorOwl from './ProfessorOwl.jsx'
import { CalendarIcon, MapPinIcon } from './Icons.jsx'
import { usePlaces } from '../context/PlacesContext.jsx'
import { useLanguage, richText } from '../i18n/LanguageContext.jsx'

// Dashboard pieces built from the user's quiz attempts
// (GET /api/progress/activity): a greeting with the streak, a monthly
// activity calendar, and the list of quizzes they've attempted. Days are the
// browser's local days, matching how the server counts streaks.

const DAY_MS = 24 * 60 * 60 * 1000

function dayKey(date) {
  const d = new Date(date)
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

// Same rules as server/src/utils/streak.js: a streak survives until a whole
// day passes with no attempt.
export function computeStreaks(attempts, now = new Date()) {
  const dayNumber = (date) => {
    const d = new Date(date)
    return Math.round(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / DAY_MS)
  }
  const days = [...new Set(attempts.map((a) => dayNumber(a.at)))].sort((a, b) => a - b)
  if (days.length === 0) return { current: 0, max: 0, activeToday: false }
  let max = 1
  let run = 1
  for (let i = 1; i < days.length; i++) {
    run = days[i] === days[i - 1] + 1 ? run + 1 : 1
    max = Math.max(max, run)
  }
  const today = dayNumber(now)
  const last = days[days.length - 1]
  return {
    current: last === today || last === today - 1 ? run : 0,
    max,
    activeToday: last === today,
  }
}

/* ---------------- greeting ---------------- */

export function DashboardGreeting({ name, streak }) {
  const { t } = useLanguage()
  const firstName = String(name || '').trim().split(/\s+/)[0]
  let message
  if (streak.current >= 2 && streak.activeToday) message = t('dashboard.streakOnFire', { days: streak.current })
  else if (streak.current >= 1 && !streak.activeToday) message = t('dashboard.streakAtRisk', { days: streak.current })
  else if (streak.current === 1) message = t('dashboard.streakStarted')
  else message = t('dashboard.streakNone')

  return (
    <div className="dashboard-greeting">
      <h1 className="dashboard-greeting-title">{t('dashboard.hello', { name: firstName })}</h1>
      <div className="dashboard-greeting-mascot">
        <span className="dashboard-greeting-owl">
          <ProfessorOwl size={46} />
        </span>
        <p className="dashboard-greeting-bubble">
          {richText(message, { b: (text) => <strong>{text}</strong> })}
        </p>
      </div>
    </div>
  )
}

/* ---------------- calendar ---------------- */

export function ActivityCalendar({ attempts, streak }) {
  const { t, locale } = useLanguage()
  const now = new Date()
  const [month, setMonth] = useState({ y: now.getFullYear(), m: now.getMonth() })

  const countsByDay = useMemo(() => {
    const map = new Map()
    for (const a of attempts) map.set(dayKey(a.at), (map.get(dayKey(a.at)) || 0) + 1)
    return map
  }, [attempts])

  const first = new Date(month.y, month.m, 1)
  const daysInMonth = new Date(month.y, month.m + 1, 0).getDate()
  const leadingBlanks = (first.getDay() + 6) % 7 // Monday-first
  const todayKey = dayKey(now)
  const isCurrentMonth = month.y === now.getFullYear() && month.m === now.getMonth()

  // Weekday initials in the user's language, Monday first (2024-01-01 was a Monday).
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    new Date(2024, 0, 1 + i).toLocaleDateString(locale, { weekday: 'narrow' })
  )
  const monthLabel = first.toLocaleDateString(locale, { month: 'long', year: 'numeric' })

  function shift(delta) {
    setMonth(({ y, m }) => {
      const d = new Date(y, m + delta, 1)
      return { y: d.getFullYear(), m: d.getMonth() }
    })
  }

  const cells = []
  for (let i = 0; i < leadingBlanks; i++) cells.push(<span key={`b${i}`} className="activity-day blank" />)
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(month.y, month.m, day)
    const key = dayKey(date)
    const count = countsByDay.get(key) || 0
    let cls = 'activity-day'
    if (count > 0) cls += ' attempted'
    if (key === todayKey) cls += ' today'
    if (date > now) cls += ' future'
    cells.push(
      <span
        key={key}
        className={cls}
        title={count > 0 ? t('dashboard.quizzesOnDay', { count }) : undefined}
      >
        {day}
      </span>
    )
  }

  return (
    <section className="profile-card activity-card">
      {/* faded professor peeking up from the bottom, behind the days */}
      <span className="activity-card-owl" aria-hidden="true">
        <ProfessorOwl />
      </span>

      <div className="activity-card-head">
        <h3 className="activity-card-title">
          <CalendarIcon size={18} /> {t('dashboard.monthlyActivity')}
        </h3>
        <div className="activity-month-nav">
          <button type="button" onClick={() => shift(-1)} aria-label={t('dashboard.prevMonth')}>‹</button>
          <span className="activity-month-label">{monthLabel}</span>
          <button
            type="button"
            onClick={() => shift(1)}
            disabled={isCurrentMonth}
            aria-label={t('dashboard.nextMonth')}
          >
            ›
          </button>
        </div>
      </div>

      <div className="activity-streak-row">
        <span className="activity-streak-flame" aria-hidden="true">🔥</span>
        <span className="activity-streak-num">{streak.current}</span>
        <span className="activity-streak-label">{t('dashboard.dayStreak', { count: streak.current })}</span>
      </div>

      <div className="activity-grid">
        {weekdays.map((w, i) => (
          <span key={`w${i}`} className="activity-weekday">{w}</span>
        ))}
        {cells}
      </div>

      <div className="activity-legend">
        <span><i className="activity-legend-dot attempted" /> {t('dashboard.attempted')}</span>
        <span><i className="activity-legend-dot today" /> {t('dashboard.today')}</span>
        <span className="activity-legend-max">
          {richText(t('dashboard.maxStreak', { count: streak.max }), { b: (text) => <strong>{text}</strong> })}
        </span>
      </div>
    </section>
  )
}

/* ---------------- attempted quizzes ---------------- */

// Paged rather than expanded, so the card always stays the calendar's height.
const PAGE_SIZE = 4

export function AttemptedQuizzes({ attempts }) {
  const { t, locale } = useLanguage()
  const { getPlaceById } = usePlaces()
  const [page, setPage] = useState(0)

  // One row per place: attempt count, best known score, passed, last attempt.
  const rows = useMemo(() => {
    const byPlace = new Map()
    for (const a of attempts) {
      const row = byPlace.get(a.placeId) || { placeId: a.placeId, count: 0, best: null, passed: false, last: a.at }
      row.count += 1
      if (typeof a.scorePercent === 'number') row.best = Math.max(row.best ?? 0, a.scorePercent)
      row.passed = row.passed || a.passed
      if (new Date(a.at) > new Date(row.last)) row.last = a.at
      byPlace.set(a.placeId, row)
    }
    return [...byPlace.values()]
      .map((row) => ({ ...row, place: getPlaceById(row.placeId) }))
      .filter((row) => row.place)
      .sort((a, b) => new Date(b.last) - new Date(a.last))
  }, [attempts, getPlaceById])

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount - 1)
  const visible = rows.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE)

  return (
    <section className="profile-card attempted-card">
      <div className="attempted-head">
        <h3 className="attempted-title">📝 {t('dashboard.attemptedQuizzes')}</h3>
        <span className="attempted-count">{t('dashboard.placesCount', { count: rows.length })}</span>
      </div>

      {rows.length === 0 ? (
        <p className="attempted-empty">
          {richText(t('dashboard.noAttempts'), { quiz: (text) => <Link to="/quiz">{text}</Link> })}
        </p>
      ) : (
        <ul className="attempted-list">
          {visible.map((row) => (
            <li key={row.placeId} className="attempted-row">
              <Link to={`/place/${row.placeId}`} className="attempted-thumb">
                <img src={row.place.image} alt="" loading="lazy" />
              </Link>
              <div className="attempted-info">
                <Link to={`/place/${row.placeId}`} className="attempted-name">{row.place.name}</Link>
                <p className="attempted-meta">
                  <MapPinIcon size={12} /> {row.place.location}
                </p>
                <p className="attempted-meta">
                  {t('dashboard.attemptsCount', { count: row.count })} ·{' '}
                  {new Date(row.last).toLocaleDateString(locale, { day: 'numeric', month: 'short' })}
                </p>
              </div>
              <div className="attempted-side">
                <span className={row.passed ? 'attempted-score passed' : 'attempted-score'}>
                  {row.best !== null ? `${row.best}%` : row.passed ? '✓' : '—'}
                </span>
                <span className={row.passed ? 'attempted-status passed' : 'attempted-status'}>
                  {row.passed ? t('dashboard.passed') : t('dashboard.notPassed')}
                </span>
                <Link to={`/quiz/${row.placeId}`} className="attempted-retry">
                  {row.passed ? t('dashboard.playAgain') : t('dashboard.retry')}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}

      {pageCount > 1 && (
        <div className="attempted-pager">
          <button
            type="button"
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 0}
            aria-label={t('dashboard.prevPage')}
          >
            ‹
          </button>
          <span className="attempted-pager-label">
            {t('dashboard.pageOf', { page: currentPage + 1, total: pageCount })}
          </span>
          <button
            type="button"
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage === pageCount - 1}
            aria-label={t('dashboard.nextPage')}
          >
            ›
          </button>
        </div>
      )}
    </section>
  )
}
