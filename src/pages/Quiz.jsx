import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { progressApi } from '../lib/api.js'
import { usePlaces } from '../context/PlacesContext.jsx'

function TrophyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M7 4h10v4a5 5 0 0 1-10 0V4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M7 5H4a3 3 0 0 0 3 4M17 5h3a3 3 0 0 1-3 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 13v3M9 20h6M10 16.5h4l.5 3.5h-5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

/* ---------- hub: pick a place to quiz on ---------- */

function QuizHub() {
  const { places: PLACES } = usePlaces()
  return (
    <div className="page quiz-page">
      <Navbar active="Quiz" />
      <div className="quiz-hub-wrap">
        <h1 className="quiz-hub-title">Pick a place to quiz on</h1>
        <p className="quiz-hub-sub">Test what you've learned exploring the map.</p>

        <div className="quiz-hub-grid">
          {PLACES.map((place) => (
            <Link key={place.id} to={`/quiz/${place.id}`} className="quiz-hub-card">
              <img src={place.image} alt={place.name} />
              <div className="quiz-hub-card-body">
                <p className="quiz-hub-card-name">{place.name}</p>
                <p className="quiz-hub-card-meta">{place.location} · {place.dateLabel}</p>
                <p className="quiz-hub-card-count">{place.quiz.length} questions</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ---------- an actual quiz for one place ---------- */

function PlaceQuiz({ place }) {
  const { token, refreshUser } = useAuth()
  const questions = place.quiz
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [xpResult, setXpResult] = useState(null)

  const current = questions[step]

  // Submits the result every time a quiz run finishes (including retries),
  // but the server only ever adds this place to quizzesCompleted -- and
  // awards XP -- the first time it's passed at 80% or above. Reattempts
  // (pass or fail, higher score or lower) never inflate the dashboard count
  // or award XP a second time; only that first passing attempt counts.
  useEffect(() => {
    if (!finished || !token) return
    const scorePercent = Math.round((score / questions.length) * 100)
    progressApi
      .submitQuizResult(token, place.id, scorePercent)
      .then((data) => {
        setXpResult(data)
        return refreshUser()
      })
      .catch(() => {
        // Best-effort -- a failed submission shouldn't block seeing results.
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished])

  function choose(i) {
    if (selected !== null) return
    setSelected(i)
    if (i === current.answerIndex) setScore((s) => s + 1)
  }

  function next() {
    if (step + 1 < questions.length) {
      setStep((s) => s + 1)
      setSelected(null)
    } else {
      setFinished(true)
    }
  }

  function restart() {
    setStep(0)
    setSelected(null)
    setScore(0)
    setFinished(false)
    setXpResult(null)
  }

  if (finished) {
    return (
      <div className="quiz-card quiz-result">
        <span className="quiz-result-icon"><TrophyIcon /></span>
        <h2 className="quiz-result-title">Quiz complete!</h2>
        <p className="quiz-result-score">
          You scored <strong>{score}</strong> out of <strong>{questions.length}</strong>
        </p>
        {xpResult && xpResult.xpGained > 0 && (
          <p className="quiz-result-xp">
            +{xpResult.xpGained} XP{xpResult.levelsGained > 0 ? ' · Level up!' : ''}
          </p>
        )}
        {xpResult && xpResult.xpGained === 0 && (
          <p className="quiz-result-xp quiz-result-xp-muted">
            {xpResult.counted === false && Math.round((score / questions.length) * 100) >= 80
              ? 'Already completed — no additional XP for retakes.'
              : 'Score 80% or higher to earn XP.'}
          </p>
        )}
        <div className="quiz-result-actions">
          <button type="button" className="btn-primary" onClick={restart}>Try Again</button>
          <Link to={`/place/${place.id}`} className="btn-secondary">Back to {place.name}</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="quiz-card">
      <div className="quiz-progress-row">
        <span className="quiz-progress-label">Question {step + 1} of {questions.length}</span>
        <span className="quiz-progress-label">Score: {score}</span>
      </div>
      <div className="quiz-progress-track">
        <div className="quiz-progress-fill" style={{ width: `${((step) / questions.length) * 100}%` }} />
      </div>

      <h2 className="quiz-question">{current.question}</h2>

      <div className="quiz-options">
        {current.options.map((opt, i) => {
          let cls = 'quiz-option'
          if (selected !== null) {
            if (i === current.answerIndex) cls += ' correct'
            else if (i === selected) cls += ' incorrect'
          }
          return (
            <button key={opt} type="button" className={cls} onClick={() => choose(i)} disabled={selected !== null}>
              {opt}
            </button>
          )
        })}
      </div>

      {selected !== null && (
        <button type="button" className="btn-start-quiz quiz-next-btn" onClick={next}>
          {step + 1 < questions.length ? 'Next Question' : 'See Results'}
        </button>
      )}
    </div>
  )
}

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
