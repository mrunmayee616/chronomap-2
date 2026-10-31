import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { progressApi } from '../lib/api.js'
import { usePlaces } from '../context/PlacesContext.jsx'
import { useT } from '../i18n/LanguageContext.jsx'
import { firstLetterFor, hintFor, questionKey } from '../lib/quizHint.js'
import QuizResults from '../components/QuizResults.jsx'
import ProfessorOwl from '../components/ProfessorOwl.jsx'

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

function LightbulbIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M9 18h6M10 22h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2V17h6v-.3c0-.8.4-1.5 1-2A7 7 0 0 0 12 2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E']

/* ------------------------------------------------------------------ */
/* Quiz Hub — pick a place                                             */
/* ------------------------------------------------------------------ */

function QuizHub() {
  const { places: PLACES } = usePlaces()
  const t = useT()
  return (
    <div className="page quiz-page">
      <Navbar active="Quiz" />
      <div className="quiz-hub-wrap">
        <div className="quiz-hub-header">
          <div className="quiz-hub-header-text">
            <div className="quiz-hub-eyebrow">
              <BookOpenIcon /> {t('quiz.hubEyebrow')}
            </div>
            <h1 className="quiz-hub-title">{t('quiz.hubTitle')}</h1>
            <p className="quiz-hub-sub">{t('quiz.hubSubtitle')}</p>
          </div>
          <span className="quiz-hub-owl" aria-hidden="true">
            <ProfessorOwl size={110} pointer />
          </span>
        </div>

        <div className="quiz-hub-grid">
          {PLACES.map((place) => (
            <Link key={place.id} to={`/quiz/${place.id}`} className="quiz-hub-card">
              <div className="quiz-hub-card-media">
                <img src={place.image} alt={place.name} />
                <div className="quiz-hub-card-overlay" />
                <div className="quiz-hub-card-top-row">
                  <span className="quiz-hub-card-badge">
                    <StarIcon /> {t('quiz.questionsShort', { count: place.quiz.length })}
                  </span>
                </div>
                <div className="quiz-hub-card-bottom-title">{place.name}</div>
              </div>
              <div className="quiz-hub-card-body">
                <p className="quiz-hub-card-meta">{place.location} · {place.dateLabel}</p>
                <div className="quiz-hub-card-footer">
                  <span className="quiz-hub-card-count">{t('quiz.questions', { count: place.quiz.length })}</span>
                  <span className="quiz-hub-card-start-hint">{t('place.startQuiz')} →</span>
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

const HINT_LIMIT = 3

function PlaceQuiz({ place }) {
  const { token, user, refreshUser } = useAuth()
  const t = useT()
  // The admin can play any quiz, but results aren't recorded for it: no XP,
  // no completion, and so no place on the leaderboard.
  const isAdmin = Boolean(user?.isAdmin)
  const questions = place.quiz

  // answers[i] = chosen option index, or null if not yet answered. Answers
  // stay changeable until the quiz is submitted, and whether they're right
  // is only revealed on the result screen.
  const [answers, setAnswers] = useState(() => Array(questions.length).fill(null))
  const [step, setStep] = useState(0)
  const [finished, setFinished] = useState(false)
  const [xpResult, setXpResult] = useState(null)
  // Track which answer was just picked (for animation)
  const [justAnswered, setJustAnswered] = useState(null)
  // Keys of the questions a hint was spent on. Kept per place on the server
  // (see /api/progress/use-hint), so it starts from the account's record and
  // survives retakes, reloads and logging out; the admin's is local only.
  const [hinted, setHinted] = useState(() => {
    const saved = user?.quizHints?.[place.id]
    return Array.isArray(saved) ? saved : []
  })
  // The open hint box: { step, text }, or null once the user closes it.
  const [openHint, setOpenHint] = useState(null)
  const [hintPending, setHintPending] = useState(false)
  const [hintError, setHintError] = useState('')
  const cardRef = useRef(null)

  const current = questions[step]
  const selectedForStep = answers[step]
  const score = answers.filter((a, i) => a === questions[i].answerIndex).length
  const answeredCount = answers.filter((a) => a !== null).length
  const allAnswered = answeredCount === questions.length
  const isLastStep = step + 1 === questions.length
  const hintsLeft = Math.max(0, HINT_LIMIT - hinted.length)
  const currentHinted = hinted.includes(questionKey(current))
  const canHint = currentHinted || hintsLeft > 0

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
    setAnswers((prev) => {
      const next = [...prev]
      next[step] = i
      return next
    })
    setJustAnswered(i)
    setTimeout(() => setJustAnswered(null), 600)
  }

  function goToStep(s) {
    setHintError('')
    setStep(s)
  }

  function previous() {
    if (step > 0) goToStep(step - 1)
  }

  function next() {
    if (!isLastStep) goToStep(step + 1)
    else if (allAnswered) setFinished(true)
  }

  async function takeHint() {
    if (hintPending || !canHint) return
    const hintStep = step
    const key = questionKey(current)
    const show = () =>
      setOpenHint({
        step: hintStep,
        text: hintFor(questions[hintStep]),
        letter: firstLetterFor(questions[hintStep]),
      })
    setHintError('')

    // Same question again: show the same hint, no request, no hint spent.
    if (currentHinted) {
      show()
      return
    }

    setHintPending(true)
    try {
      const data = await progressApi.useHint(token, place.id, key)
      if (data.adminPreview) setHinted((prev) => [...prev, key])
      else setHinted(data.hinted)
    } catch (err) {
      setHintError(
        err.status === 409 ? t('quiz.noHintsLeft') : err.networkError ? t('quiz.hintOffline') : t('quiz.hintError')
      )
      setHintPending(false)
      // 409 = hints were used up elsewhere (e.g. another tab): resync.
      if (err.status === 409) {
        const fresh = await refreshUser()
        const saved = fresh?.quizHints?.[place.id]
        if (Array.isArray(saved)) setHinted(saved)
      }
      return
    }
    setHintPending(false)
    show()
    refreshUser()
  }

  function restart() {
    setAnswers(Array(questions.length).fill(null))
    setStep(0)
    setFinished(false)
    setXpResult(null)
    setJustAnswered(null)
    setOpenHint(null)
    setHintError('')
  }

  // ---------- Result screen ----------
  if (finished) {
    return (
      <QuizResults
        place={place}
        questions={questions}
        answers={answers}
        hintsUsed={hinted.length}
        xpResult={xpResult}
        isAdmin={isAdmin}
        visitedIds={user?.visitedPlaces}
        onRestart={restart}
      />
    )
  }

  // ---------- Question screen ----------
  return (
    <div className="quiz-card" ref={cardRef}>

      {isAdmin && (
        <p className="quiz-admin-note">
          {t('quiz.adminPractice')}
        </p>
      )}

      {/* ---- Progress header ---- */}
      <div className="quiz-progress-row">
        <span className="quiz-progress-label">{t('quiz.questionLabel')} <strong>{step + 1}</strong> / {questions.length}</span>
        <span className="quiz-score-pill">{t('quiz.answeredCount', { answered: answeredCount, total: questions.length })}</span>
      </div>

      <div className="quiz-progress-track">
        <div
          className="quiz-progress-fill"
          style={{ width: `${(answeredCount / questions.length) * 100}%` }}
        />
      </div>

      {/* ---- Question navigator dots ---- */}
      <div className="quiz-nav-dots" role="tablist" aria-label={t('quiz.navigator')}>
        {questions.map((_, i) => {
          const answered = answers[i] !== null
          let dotClass = 'quiz-nav-dot'
          if (i === step) dotClass += ' current'
          else if (answered) dotClass += ' answered'
          return (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === step}
              aria-label={`${t('quiz.questionLabel')} ${i + 1} — ${answered ? t('quiz.answered') : t('quiz.unanswered')}`}
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

      {/* ---- Hint ---- */}
      <div className="quiz-hint-row">
        <button
          type="button"
          className="quiz-hint-btn"
          onClick={takeHint}
          disabled={hintPending || !canHint}
          title={t('quiz.hintTitle')}
        >
          <LightbulbIcon /> {currentHinted ? t('quiz.showHint') : t('quiz.useHint')}
        </button>
        <span className={hintsLeft > 0 ? 'quiz-hint-count' : 'quiz-hint-count none'}>
          {hintsLeft > 0 ? t('quiz.hintsLeft', { count: hintsLeft }) : t('quiz.noHintsLeft')}
        </span>
        {hintError && <span className="quiz-hint-error" role="alert">{hintError}</span>}
      </div>

      {/* ---- Options ---- */}
      <div className="quiz-options">
        {current.options.map((opt, i) => {
          let cls = 'quiz-option'
          if (i === selectedForStep) cls += ' selected'
          if (i === justAnswered) cls += ' just-answered'

          return (
            <button
              key={opt}
              type="button"
              className={cls}
              onClick={() => choose(i)}
              aria-pressed={i === selectedForStep}
            >
              <span className="quiz-option-letter">{OPTION_LETTERS[i]}</span>
              <span className="quiz-option-text">{opt}</span>
            </button>
          )
        })}
      </div>

      {/* ---- Navigation row ---- */}
      <div className="quiz-nav-row">
        <button
          type="button"
          className="btn-secondary quiz-prev-btn"
          onClick={previous}
          disabled={step === 0}
        >
          <ChevronLeftIcon /> {t('quiz.previous')}
        </button>
        <div className="quiz-nav-row-end">
          {isLastStep && !allAnswered && (
            <span className="quiz-nav-hint">{t('quiz.answerAll')}</span>
          )}
          <button
            type="button"
            className="btn-start-quiz quiz-next-btn"
            onClick={next}
            disabled={isLastStep && !allAnswered}
          >
            {isLastStep ? t('quiz.seeResults') : t('quiz.next')}
            {!isLastStep && <ChevronRightIcon />}
          </button>
        </div>
      </div>

      {/* ---- Hint box: pinned bottom-right until the user closes it ---- */}
      {openHint && (
        <div className="quiz-hint-box" role="status" aria-live="polite">
          <div className="quiz-hint-box-head">
            <span className="quiz-hint-box-title">
              <span className="quiz-hint-box-title-icon" aria-hidden="true">📜</span>
              {t('quiz.hintFor', { number: openHint.step + 1 })}
            </span>
            <button
              type="button"
              className="quiz-hint-box-close"
              onClick={() => setOpenHint(null)}
              aria-label={t('quiz.closeHint')}
            >
              ×
            </button>
          </div>
          <p className="quiz-hint-box-text">{openHint.text}</p>
          {openHint.letter && (
            <div className="quiz-hint-letter">
              <p className="quiz-hint-letter-lead">
                <span className="quiz-hint-letter-icon" aria-hidden="true">{openHint.letter.icon}</span>
                <span>{openHint.letter.lead}</span>
              </p>
              <div className="quiz-hint-riddles">
                {openHint.letter.parts.map((part, i) => (
                  <span key={i} className={part.text ? 'quiz-hint-riddle is-text' : 'quiz-hint-riddle'}>
                    {openHint.letter.parts.length > 1 && (
                      <span className="quiz-hint-riddle-num">{i + 1}</span>
                    )}
                    {part.emojis ? part.emojis.join(' ') : part.text}
                  </span>
                ))}
              </div>
              {openHint.letter.skipped && (
                <p className="quiz-hint-letter-note">
                  {t('quiz.hintSkipped', { words: openHint.letter.skipped })}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Root export                                                          */
/* ------------------------------------------------------------------ */

export default function Quiz() {
  const { placeId } = useParams()
  const { getPlaceById } = usePlaces()
  const t = useT()
  const place = useMemo(() => (placeId ? getPlaceById(placeId) : null), [placeId, getPlaceById])

  if (!placeId) return <QuizHub />

  if (!place) {
    return (
      <div className="page quiz-page">
        <Navbar active="Quiz" />
        <div className="place-not-found">
          <h2>{t('quiz.notFound')}</h2>
          <Link to="/quiz" className="btn-primary">{t('quiz.chooseAnother')}</Link>
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
