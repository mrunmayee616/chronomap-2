import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { progressApi } from '../lib/api.js'
import { usePlaces } from '../context/PlacesContext.jsx'

/* ------------------------------------------------------------------ */
/* Icons                                                                */
/* ------------------------------------------------------------------ */

function TrophyIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="M7 4h10v4a5 5 0 0 1-10 0V4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M7 5H4a3 3 0 0 0 3 4M17 5h3a3 3 0 0 1-3 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 13v3M9 20h6M10 16.5h4l.5 3.5h-5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

function CheckCircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
      <polyline points="8 12 11 15 16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function XCircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
      <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <polyline points="15 18 9 12 15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <polyline points="9 18 15 12 9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function BookOpenIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Particle burst (result screen)                                       */
/* ------------------------------------------------------------------ */

const PARTICLE_COLORS = ['#f7c740', '#8b7ef8', '#3fcf8e', '#f25a76', '#00bfff', '#ff8c00']
const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E']

function Particles() {
  const particles = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
      x: Math.random() * 100,
      delay: Math.random() * 0.8,
      duration: 0.9 + Math.random() * 0.8,
      size: 6 + Math.random() * 8,
      drift: (Math.random() - 0.5) * 120,
    })), [])

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

/* ------------------------------------------------------------------ */
/* Score ring (SVG donut)                                              */
/* ------------------------------------------------------------------ */

function ScoreRing({ score, total }) {
  const pct = total > 0 ? score / total : 0
  const radius = 54
  const circ = 2 * Math.PI * radius
  const offset = circ * (1 - pct)
  const passed = pct >= 0.8

  return (
    <div className="quiz-score-ring-wrap">
      <svg width="140" height="140" viewBox="0 0 140 140">
        {/* track */}
        <circle cx="70" cy="70" r={radius} fill="none" stroke="var(--card-border)" strokeWidth="10" />
        {/* fill */}
        <circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke={passed ? '#3fcf8e' : '#f25a76'}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 70 70)"
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)' }}
        />
      </svg>
      <div className="quiz-score-ring-label">
        <span className="quiz-score-ring-num" style={{ color: passed ? '#3fcf8e' : '#f25a76' }}>
          {score}/{total}
        </span>
        <span className="quiz-score-ring-pct">{Math.round(pct * 100)}%</span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Quiz Hub — pick a place                                             */
/* ------------------------------------------------------------------ */

function QuizHub() {
  const { places: PLACES } = usePlaces()
  return (
    <div className="page quiz-page">
      <Navbar active="Quiz" />
      <div className="quiz-hub-wrap">
        <div className="quiz-hub-header">
          <div className="quiz-hub-eyebrow">
            <BookOpenIcon /> Knowledge Challenge
          </div>
          <h1 className="quiz-hub-title">Pick a place to quiz on</h1>
          <p className="quiz-hub-sub">Test what you've learned exploring the map. Score 80% or higher to earn XP.</p>
        </div>

        <div className="quiz-hub-grid">
          {PLACES.map((place) => (
            <Link key={place.id} to={`/quiz/${place.id}`} className="quiz-hub-card">
              <div className="quiz-hub-card-media">
                <img src={place.image} alt={place.name} />
                <div className="quiz-hub-card-overlay" />
                <div className="quiz-hub-card-top-row">
                  <span className="quiz-hub-card-badge">
                    <StarIcon /> {place.quiz.length} Qs
                  </span>
                </div>
                <div className="quiz-hub-card-bottom-title">{place.name}</div>
              </div>
              <div className="quiz-hub-card-body">
                <p className="quiz-hub-card-meta">{place.location} · {place.dateLabel}</p>
                <div className="quiz-hub-card-footer">
                  <span className="quiz-hub-card-count">{place.quiz.length} questions</span>
                  <span className="quiz-hub-card-start-hint">Start Quiz →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Place Quiz                                                           */
/* ------------------------------------------------------------------ */

function PlaceQuiz({ place }) {
  const { token, user, refreshUser } = useAuth()
  // The admin can play any quiz, but results aren't recorded for it: no XP,
  // no completion, and so no place on the leaderboard.
  const isAdmin = Boolean(user?.isAdmin)
  const questions = place.quiz

  // answers[i] = chosen option index, or null if not yet answered
  const [answers, setAnswers] = useState(() => Array(questions.length).fill(null))
  const [step, setStep] = useState(0)
  const [finished, setFinished] = useState(false)
  const [xpResult, setXpResult] = useState(null)
  // Track which answers were just revealed (for animation)
  const [justAnswered, setJustAnswered] = useState(null)
  const cardRef = useRef(null)

  const current = questions[step]
  const selectedForStep = answers[step]
  const score = answers.filter((a, i) => a === questions[i].answerIndex).length
  const answeredCount = answers.filter((a) => a !== null).length

  // Submit once quiz is fully answered and user clicks "See Results"
  useEffect(() => {
    if (!finished || !token || isAdmin) return
    const scorePercent = Math.round((score / questions.length) * 100)
    progressApi
      .submitQuizResult(token, place.id, scorePercent)
      .then((data) => {
        setXpResult(data)
        return refreshUser()
      })
      .catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished])

  function choose(i) {
    // Don't allow changing an already-answered question
    if (answers[step] !== null) return
    setAnswers((prev) => {
      const next = [...prev]
      next[step] = i
      return next
    })
    setJustAnswered(i)
    setTimeout(() => setJustAnswered(null), 600)
  }

  function goToStep(s) {
    setStep(s)
  }

  function next() {
    if (step + 1 < questions.length) {
      setStep((s) => s + 1)
    } else {
      setFinished(true)
    }
  }

  function restart() {
    setAnswers(Array(questions.length).fill(null))
    setStep(0)
    setFinished(false)
    setXpResult(null)
    setJustAnswered(null)
  }

  // ---------- Result screen ----------
  if (finished) {
    const passed = score / questions.length >= 0.8
    return (
      <div className="quiz-card quiz-result">
        <Particles />
        <ScoreRing score={score} total={questions.length} />

        <h2 className="quiz-result-title">
          {passed ? '🎉 Outstanding!' : '💪 Keep Going!'}
        </h2>
        <p className="quiz-result-subtitle">
          {passed
            ? 'You aced this quiz. History remembers the thorough.'
            : 'Explore the place again and give it another shot.'}
        </p>
        {isAdmin && (
          <p className="quiz-result-xp quiz-result-xp-muted">
            Admin preview — scores aren't recorded and the admin isn't ranked on the leaderboard.
          </p>
        )}

        {!isAdmin && xpResult && xpResult.xpGained > 0 && (
          <div className="quiz-result-xp">
            <span className="quiz-result-xp-num">+{xpResult.xpGained} XP</span>
            {xpResult.levelsGained > 0 && <span className="quiz-result-levelup">⬆ Level Up!</span>}
          </div>
        )}
        {!isAdmin && xpResult && xpResult.xpGained === 0 && (
          <p className="quiz-result-xp quiz-result-xp-muted">
            {xpResult.counted === false && Math.round((score / questions.length) * 100) >= 80
              ? 'Already completed — no additional XP for retakes.'
              : 'Score 80% or higher to earn XP.'}
          </p>
        )}

        {/* Per-question review */}
        <div className="quiz-result-review">
          {questions.map((q, i) => {
            const chosen = answers[i]
            const correct = chosen === q.answerIndex
            return (
              <div key={i} className={`quiz-result-review-item ${correct ? 'correct' : 'incorrect'}`}>
                <span className="quiz-result-review-icon">
                  {correct ? <CheckCircleIcon /> : <XCircleIcon />}
                </span>
                <span className="quiz-result-review-q">{q.question}</span>
              </div>
            )
          })}
        </div>

        <div className="quiz-result-actions">
          <button type="button" className="btn-primary" onClick={restart}>Try Again</button>
          <Link to={`/place/${place.id}`} className="btn-secondary">Back to {place.name}</Link>
        </div>
      </div>
    )
  }

  // ---------- Question screen ----------
  return (
    <div className="quiz-card" ref={cardRef}>

      {/* ---- Progress header ---- */}
      <div className="quiz-progress-row">
        <span className="quiz-progress-label">Question <strong>{step + 1}</strong> of {questions.length}</span>
        <span className="quiz-score-pill">⭐ {score} pts</span>
      </div>

      <div className="quiz-progress-track">
        <div
          className="quiz-progress-fill"
          style={{ width: `${(answeredCount / questions.length) * 100}%` }}
        />
      </div>

      {/* ---- Question navigator dots ---- */}
      <div className="quiz-nav-dots" role="tablist" aria-label="Question navigator">
        {questions.map((_, i) => {
          const ans = answers[i]
          let dotClass = 'quiz-nav-dot'
          if (i === step) dotClass += ' current'
          else if (ans !== null) {
            dotClass += ans === questions[i].answerIndex ? ' correct' : ' incorrect'
          }
          return (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === step}
              aria-label={`Question ${i + 1}${ans !== null ? (ans === questions[i].answerIndex ? ' — correct' : ' — incorrect') : ' — unanswered'}`}
              className={dotClass}
              onClick={() => goToStep(i)}
            >
              {i + 1}
            </button>
          )
        })}
      </div>

      {/* ---- Question text ---- */}
      <h2 className="quiz-question" key={step}>
        {current.question}
      </h2>

      {/* ---- Options ---- */}
      <div className="quiz-options">
        {current.options.map((opt, i) => {
          // Only reveal correct/incorrect state after the user has answered THIS question
          let cls = 'quiz-option'
          if (selectedForStep !== null) {
            if (i === current.answerIndex) cls += ' correct'
            else if (i === selectedForStep) cls += ' incorrect'
          }
          if (i === justAnswered) cls += ' just-answered'

          return (
            <button
              key={opt}
              type="button"
              className={cls}
              onClick={() => choose(i)}
              disabled={selectedForStep !== null}
            >
              <span className="quiz-option-letter">{OPTION_LETTERS[i]}</span>
              <span className="quiz-option-text">{opt}</span>
              {selectedForStep !== null && i === current.answerIndex && (
                <span className="quiz-option-indicator correct-indicator"><CheckCircleIcon /></span>
              )}
              {selectedForStep !== null && i === selectedForStep && i !== current.answerIndex && (
                <span className="quiz-option-indicator incorrect-indicator"><XCircleIcon /></span>
              )}
            </button>
          )
        })}
      </div>

      {/* ---- Navigation row ---- */}
      <div className="quiz-nav-row">
        {selectedForStep !== null ? (
          <button type="button" className="btn-start-quiz quiz-next-btn" onClick={next}>
            {step + 1 < questions.length ? 'Next Question' : 'See Results'}
            {step + 1 < questions.length && <ChevronRightIcon />}
          </button>
        ) : (
          <span className="quiz-nav-hint">Choose an answer to continue</span>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Root export                                                          */
/* ------------------------------------------------------------------ */

export default function Quiz() {
  const { placeId } = useParams()
  const { getPlaceById } = usePlaces()
  const place = useMemo(() => (placeId ? getPlaceById(placeId) : null), [placeId, getPlaceById])

  if (!placeId) return <QuizHub />

  if (!place) {
    return (
      <div className="page quiz-page">
        <Navbar active="Quiz" />
        <div className="place-not-found">
          <h2>We couldn't find a quiz for that place.</h2>
          <Link to="/quiz" className="btn-primary">Choose another place</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page quiz-page">
      <Navbar active="Quiz" />
      <div className="quiz-wrap">
        <p className="quiz-place-label">{place.name} · {place.location}</p>
        <PlaceQuiz key={place.id} place={place} />
      </div>
    </div>
  )
}
