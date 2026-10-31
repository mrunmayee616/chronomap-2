import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import ProfessorOwl from './ProfessorOwl.jsx'
import { usePlaces } from '../context/PlacesContext.jsx'
import { useT } from '../i18n/LanguageContext.jsx'
import { buildDiscoveries, suggestNextPlace } from '../lib/placeDiscovery.js'

// The quiz results screen: a hero banner with the score, a single bubble
// drifting around the screen that bursts open the place's chronicle (over a
// glowing, slowly turning astrolabe, with Professor Owl teaching), a
// suggested similar place to visit next, and a fold-away review of every answer.

/* ---------------- confetti + score ring ---------------- */

const PARTICLE_COLORS = ['#f7c740', '#8b7ef8', '#3fcf8e', '#f25a76', '#00bfff', '#ff8c00']

function Particles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        id: i,
        color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
        x: Math.random() * 100,
        delay: Math.random() * 0.8,
        duration: 0.9 + Math.random() * 0.8,
        size: 6 + Math.random() * 8,
        drift: (Math.random() - 0.5) * 120,
      })),
    []
  )
  return (
    <div className="quiz-particles" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="quiz-particle"
          style={{
            left: `${p.x}%`,
            background: p.color,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            '--drift': `${p.drift}px`,
          }}
        />
      ))}
    </div>
  )
}

function ScoreRing({ score, total }) {
  const pct = total > 0 ? score / total : 0
  const radius = 64
  const circ = 2 * Math.PI * radius
  const passed = pct >= 0.8
  const colour = passed ? 'var(--success)' : 'var(--error)'
  return (
    <div className="quiz-score-ring-wrap">
      <svg width="164" height="164" viewBox="0 0 164 164">
        <circle cx="82" cy="82" r={radius} fill="none" stroke="rgb(255 255 255 / 0.18)" strokeWidth="12" />
        <circle
          className="quiz-score-ring-fill"
          cx="82"
          cy="82"
          r={radius}
          fill="none"
          stroke={colour}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          transform="rotate(-90 82 82)"
          style={{ '--ring-from': circ }}
        />
      </svg>
      <div className="quiz-score-ring-label">
        <span className="quiz-score-ring-num" style={{ color: colour }}>
          {score}/{total}
        </span>
        <span className="quiz-score-ring-pct">{Math.round(pct * 100)}%</span>
      </div>
    </div>
  )
}

/* ---------------- next destination ---------------- */

const REASON_KEYS = {
  category: 'quiz.results.reasonCategory',
  era: 'quiz.results.reasonEra',
  tag: 'quiz.results.reasonTag',
  country: 'quiz.results.reasonCountry',
  near: 'quiz.results.reasonNear',
}

function NextPlaceCard({ suggestion }) {
  const t = useT()
  const { place, reasons } = suggestion
  return (
    <div className="quiz-next-place">
      <div className="quiz-next-place-media">
        <img src={place.image} alt="" loading="lazy" />
        <span className="quiz-next-place-badge">🧭 {t('quiz.results.nextDestination')}</span>
      </div>
      <div className="quiz-next-place-body">
        <h4 className="quiz-next-place-name">{place.name}</h4>
        <p className="quiz-next-place-meta">
          📍 {place.location}
          {place.dateLabel && <> · {place.dateLabel}</>}
        </p>
        {place.summary && <p className="quiz-next-place-summary">{place.summary}</p>}
        {reasons.length > 0 && (
          <div className="quiz-next-place-reasons">
            <span className="quiz-next-place-why">{t('quiz.results.whySimilar')}</span>
            {reasons.map((r) => (
              <span key={r.key} className="quiz-next-place-reason">
                {t(REASON_KEYS[r.key], { value: r.value })}
              </span>
            ))}
          </div>
        )}
        <div className="quiz-next-place-actions">
          <Link to={`/place/${place.id}`} className="btn-secondary">🗺️ {t('quiz.results.explorePlace')}</Link>
          <Link to={`/quiz/${place.id}`} className="btn-primary">🎯 {t('quiz.results.takeItsQuiz')}</Link>
        </div>
      </div>
    </div>
  )
}

/* ---------------- the floating bubble ---------------- */

const DRIFT_MS = 3800
const randomSpot = () => ({ x: 8 + Math.random() * 78, y: 18 + Math.random() * 64 })

// One bubble that wanders around the whole screen. Rendered into <body> so
// "fixed" really means the viewport, whatever its parents do.
function FloatingBubble({ onPop }) {
  const t = useT()
  const [spot, setSpot] = useState(randomSpot)
  const [popping, setPopping] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setSpot(randomSpot()), DRIFT_MS)
    // first move right away so it starts drifting immediately
    const first = setTimeout(() => setSpot(randomSpot()), 50)
    return () => {
      clearInterval(id)
      clearTimeout(first)
    }
  }, [])

  function pop(e) {
    if (popping) return
    const r = e.currentTarget.getBoundingClientRect()
    setPopping(true)
    setTimeout(() => onPop({ x: r.left + r.width / 2, y: r.top + r.height / 2 }), 220)
  }

  return createPortal(
    <button
      type="button"
      className={popping ? 'history-bubble popping' : 'history-bubble'}
      style={{ left: `${spot.x}vw`, top: `${spot.y}vh`, '--drift-ms': `${DRIFT_MS}ms` }}
      onClick={pop}
      aria-label={t('quiz.results.popMeLabel')}
    >
      <span className="history-bubble-inner">
        <span className="history-bubble-emoji" aria-hidden="true">📜</span>
        <span className="history-bubble-label">{t('quiz.results.popMe')}</span>
      </span>
    </button>,
    document.body
  )
}

/* ---------------- the splash ---------------- */

// A brass astrolabe drawn in the theme's accent colour: engraved rings,
// degree ticks, Roman-numeral hours and a compass star. The outer dial and
// the inner rete turn slowly in opposite directions behind the chronicle.
const NUMERALS = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI']

function Astrolabe() {
  const ticks = []
  for (let i = 0; i < 120; i++) {
    const a = (i / 120) * Math.PI * 2
    const long = i % 10 === 0
    const mid = i % 5 === 0
    const r1 = 176
    const r2 = long ? 192 : mid ? 187 : 183
    ticks.push(
      <line
        key={i}
        x1={(Math.sin(a) * r1).toFixed(2)}
        y1={(-Math.cos(a) * r1).toFixed(2)}
        x2={(Math.sin(a) * r2).toFixed(2)}
        y2={(-Math.cos(a) * r2).toFixed(2)}
        strokeWidth={long ? 1.6 : 0.8}
      />
    )
  }
  const star = (r, inner, points) =>
    Array.from({ length: points * 2 }, (_, i) => {
      const a = (i / (points * 2)) * Math.PI * 2
      const rr = i % 2 === 0 ? r : inner
      return `${(Math.sin(a) * rr).toFixed(1)},${(-Math.cos(a) * rr).toFixed(1)}`
    }).join(' ')

  return (
    <svg className="chronicle-astrolabe" viewBox="-200 -200 400 400" aria-hidden="true">
      {/* outer dial */}
      <g className="chronicle-astrolabe-dial">
        <circle r="196" />
        <circle r="174" />
        <g className="chronicle-astrolabe-ticks">{ticks}</g>
        {NUMERALS.map((n, i) => {
          const a = (i / 12) * Math.PI * 2
          return (
            <text
              key={n}
              x={(Math.sin(a) * 158).toFixed(1)}
              y={(-Math.cos(a) * 158).toFixed(1)}
              transform={`rotate(${i * 30} ${(Math.sin(a) * 158).toFixed(1)} ${(-Math.cos(a) * 158).toFixed(1)})`}
            >
              {n}
            </text>
          )
        })}
        <circle r="142" />
      </g>

      {/* inner rete, turning the other way */}
      <g className="chronicle-astrolabe-rete">
        <circle r="118" strokeDasharray="2 6" />
        <circle r="96" />
        <ellipse rx="96" ry="58" />
        <ellipse rx="58" ry="96" />
        <line x1="-142" y1="0" x2="142" y2="0" />
        <line x1="0" y1="-142" x2="0" y2="142" />
        <polygon className="chronicle-astrolabe-star" points={star(88, 14, 8)} />
        <polygon className="chronicle-astrolabe-star bright" points={star(60, 10, 4)} />
        <circle r="10" className="chronicle-astrolabe-hub" />
      </g>
    </svg>
  )
}

// Golden dust motes drifting up, like light in an old library.
const MOTES = Array.from({ length: 34 }, (_, i) => ({
  x: (i * 37) % 100,
  size: 2 + ((i * 7) % 5),
  dur: 7 + ((i * 13) % 9),
  delay: -((i * 11) % 14),
  drift: ((i * 29) % 60) - 30,
}))

// History bits riding along the splash (percent of the screen).
const SPLASH_DECOR = [
  { e: '🏛️', x: 10, y: 70 }, { e: '📜', x: 24, y: 52 }, { e: '🪶', x: 78, y: 12 },
  { e: '🏺', x: 88, y: 26 }, { e: '⚔️', x: 6, y: 90 }, { e: '👑', x: 40, y: 34 },
  { e: '🧭', x: 64, y: 22 }, { e: '⏳', x: 55, y: 8 }, { e: '🗺️', x: 18, y: 84 },
]
const BURST_DROPS = 22
const SPRAY = 26
const CLOSE_MS = 420

function HistorySplash({ place, cards, origin, onClose }) {
  const t = useT()
  const spray = useMemo(
    () =>
      Array.from({ length: SPRAY }, (_, i) => {
        const a = (i / SPRAY) * Math.PI * 2 + (i % 3) * 0.2
        const dist = 160 + ((i * 37) % 140)
        return { dx: Math.cos(a) * dist, dy: Math.sin(a) * dist * 0.7 - 60, s: 4 + (i % 4) * 2, delay: (i % 5) * 0.03 }
      }),
    []
  )
  const [closing, setClosing] = useState(false)
  const closeRef = useRef(null)

  const close = useCallback(() => {
    setClosing(true)
    setTimeout(onClose, CLOSE_MS)
  }, [onClose])

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [close])

  return createPortal(
    <div
      className={closing ? 'history-splash closing' : 'history-splash'}
      role="dialog"
      aria-modal="true"
      aria-label={t('quiz.results.chronicleTitle', { name: place.name })}
      style={{ '--ox': `${origin.x}px`, '--oy': `${origin.y}px` }}
    >
      <div className="history-splash-flash" aria-hidden="true" />

      {/* the pop itself: rings, droplets and a gravity spray from the burst point */}
      <div className="history-splash-pop" style={{ left: origin.x, top: origin.y }} aria-hidden="true">
        <span className="history-splash-ring" />
        <span className="history-splash-ring r2" />
        <span className="history-splash-ring r3" />
        {Array.from({ length: BURST_DROPS }, (_, i) => (
          <span
            key={`d${i}`}
            className="history-splash-drop"
            style={{
              '--a': `${(360 / BURST_DROPS) * i + (i % 3) * 7}deg`,
              '--d': `${130 + (i % 5) * 55}px`,
              '--s': `${7 + (i % 3) * 5}px`,
            }}
          />
        ))}
        {spray.map((p, i) => (
          <span
            key={`s${i}`}
            className="history-splash-spray"
            style={{ '--dx': `${p.dx}px`, '--dy': `${p.dy}px`, '--s': `${p.s}px`, animationDelay: `${p.delay}s` }}
          />
        ))}
      </div>

      {/* a glow, a slowly turning astrolabe and drifting dust behind the chronicle */}
      <div className="chronicle-aura" aria-hidden="true" />
      <Astrolabe />
      <div className="chronicle-motes" aria-hidden="true">
        {MOTES.map((m, i) => (
          <span
            key={i}
            style={{
              left: `${m.x}%`,
              width: m.size,
              height: m.size,
              animationDuration: `${m.dur}s`,
              animationDelay: `${m.delay}s`,
              '--drift': `${m.drift}px`,
            }}
          />
        ))}
      </div>

      {SPLASH_DECOR.map((d, i) => (
        <span
          key={d.e}
          className="history-splash-decor"
          style={{ left: `${d.x}%`, top: `${d.y}%`, animationDelay: `${0.45 + i * 0.06}s, ${i * -0.7}s` }}
          aria-hidden="true"
        >
          {d.e}
        </span>
      ))}

      {/* every fact at once, written up as an old manuscript */}
      <article className="history-splash-scroll">
        <button
          ref={closeRef}
          type="button"
          className="history-splash-close"
          onClick={close}
          aria-label={t('quiz.results.closeFact')}
        >
          ×
        </button>
        <header className="history-chronicle-header">
          <span className="history-chronicle-seal" aria-hidden="true">📜</span>
          <div>
            <p className="history-splash-kicker">🦉 {t('quiz.results.professorSays')}</p>
            <h3 className="history-splash-title">{t('quiz.results.chronicleTitle', { name: place.name })}</h3>
            <p className="history-chronicle-meta">
              📍 {place.location}
              {place.dateLabel && <> · 🗓️ {place.dateLabel}</>}
            </p>
          </div>
        </header>

        {/* every fact down a timeline rail */}
        <div className="history-chronicle">
          {cards.map((card, i) => (
            <section key={card.id} className="history-chronicle-entry" style={{ animationDelay: `${1 + i * 0.12}s` }}>
              <span className="history-chronicle-dot" aria-hidden="true">{card.emoji}</span>
              <span className="history-chronicle-kind">{t(`quiz.results.bubble.${card.label}`)}</span>
              <h4 className="history-chronicle-heading">{card.title}</h4>
              <p className="history-splash-text">{card.text}</p>
            </section>
          ))}
        </div>
        <p className="history-splash-foot">{t('quiz.results.popAgain')}</p>
      </article>

      <div className="history-splash-owl" aria-hidden="true">
        <ProfessorOwl size={210} pointer />
      </div>
    </div>,
    document.body
  )
}

/* Pop the bubble -> the splash with the place's whole chronicle; close it
   and the bubble floats off again, ready to be popped for another look. */
function HistoryDiscovery({ place }) {
  const discoveries = useMemo(() => buildDiscoveries(place), [place])
  const [origin, setOrigin] = useState(null)

  if (discoveries.length === 0) return null
  return origin ? (
    <HistorySplash place={place} cards={discoveries} origin={origin} onClose={() => setOrigin(null)} />
  ) : (
    <FloatingBubble onPop={setOrigin} />
  )
}

/* ---------------- answer review ---------------- */

function AnswerReview({ questions, answers, score }) {
  const t = useT()
  const [open, setOpen] = useState(false)
  return (
    <section className={open ? 'quiz-review open' : 'quiz-review'}>
      <button type="button" className="quiz-review-toggle" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <span>📋 {t('quiz.results.reviewTitle')}</span>
        <span className="quiz-review-score">{t('quiz.results.reviewScore', { score, total: questions.length })}</span>
        <span className="quiz-review-chevron" aria-hidden="true">▾</span>
      </button>
      {open && (
        <ol className="quiz-review-list">
          {questions.map((q, i) => {
            const chosen = answers[i]
            const correct = chosen === q.answerIndex
            return (
              <li key={i} className={correct ? 'quiz-review-item correct' : 'quiz-review-item incorrect'}>
                <span className="quiz-review-num">{correct ? '✓' : '✗'}</span>
                <div className="quiz-review-body">
                  <p className="quiz-review-q">
                    <span className="quiz-review-index">{i + 1}.</span> {q.question}
                  </p>
                  <p className="quiz-review-answer">
                    {t('quiz.yourAnswer')}: <strong>{chosen !== null ? q.options[chosen] : '—'}</strong>
                  </p>
                  {!correct && (
                    <p className="quiz-review-answer right">
                      {t('quiz.correctAnswer')}: <strong>{q.options[q.answerIndex]}</strong>
                    </p>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}

/* ---------------- the screen ---------------- */

export default function QuizResults({ place, questions, answers, hintsUsed, xpResult, isAdmin, visitedIds, onRestart }) {
  const t = useT()
  const { places } = usePlaces()
  const score = answers.filter((a, i) => a === questions[i].answerIndex).length
  const total = questions.length
  const percent = Math.round((score / total) * 100)
  const passed = percent >= 80
  const suggestion = useMemo(() => suggestNextPlace(place, places, visitedIds), [place, places, visitedIds])

  return (
    <div className="quiz-results">
      <section className={passed ? 'quiz-results-hero passed' : 'quiz-results-hero'}>
        <div className="quiz-results-hero-bg" style={{ backgroundImage: `url("${place.image}")` }} />
        {passed && <Particles />}
        <ScoreRing score={score} total={total} />
        <div className="quiz-results-hero-text">
          <span className="quiz-results-place">📍 {place.name}</span>
          <h2 className="quiz-results-title">
            {passed ? `🎉 ${t('quiz.passedTitle')}` : `💪 ${t('quiz.failedTitle')}`}
          </h2>
          <p className="quiz-results-subtitle">{passed ? t('quiz.passedSubtitle') : t('quiz.failedSubtitle')}</p>

          <div className="quiz-results-stats">
            <span className="quiz-stat good">✅ {t('quiz.results.correct', { count: score })}</span>
            <span className="quiz-stat bad">❌ {t('quiz.results.wrong', { count: total - score })}</span>
            <span className="quiz-stat">💡 {t('quiz.results.hints', { count: hintsUsed })}</span>
            <span className="quiz-stat">🎯 {t('quiz.results.accuracy', { percent })}</span>
          </div>

          {isAdmin && <p className="quiz-results-xp muted">{t('quiz.adminPreview')}</p>}
          {!isAdmin && xpResult && xpResult.xpGained > 0 && (
            <p className="quiz-results-xp">
              <span className="quiz-results-xp-num">+{xpResult.xpGained} XP</span>
              {xpResult.levelsGained > 0 && <span className="quiz-results-levelup">⬆ {t('quiz.levelUp')}</span>}
            </p>
          )}
          {!isAdmin && xpResult && xpResult.xpGained === 0 && (
            <p className="quiz-results-xp muted">
              {xpResult.counted === false && passed ? t('quiz.alreadyCompleted') : t('quiz.scoreToEarn')}
            </p>
          )}
        </div>
      </section>

      <p className="history-bubble-tip">🫧 {t('quiz.results.bubbleTip', { name: place.name })}</p>
      <HistoryDiscovery place={place} />

      {suggestion && <NextPlaceCard suggestion={suggestion} />}

      <AnswerReview questions={questions} answers={answers} score={score} />

      <div className="quiz-results-actions">
        <button type="button" className="btn-primary" onClick={onRestart}>🔁 {t('quiz.tryAgain')}</button>
        <Link to={`/place/${place.id}`} className="btn-secondary">{t('quiz.backTo', { name: place.name })}</Link>
        {suggestion && (
          <Link to={`/quiz/${suggestion.place.id}`} className="btn-secondary quiz-results-next">
            {t('quiz.results.nextQuiz', { name: suggestion.place.name })} →
          </Link>
        )}
      </div>
    </div>
  )
}
