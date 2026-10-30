import { Router } from 'express'
import mongoose from 'mongoose'
import User from '../models/User.js'
import { requireAuth } from '../middleware/auth.js'
import { publicUser } from '../utils/publicUser.js'
import { adminPublicUser } from '../utils/admin.js'
import { getEffectivePlaceCountries, groupByCountry } from '../utils/placeOverrides.js'
import { QUIZ_PASS_XP, applyXp } from '../utils/achievements.js'

const router = Router()

const QUIZ_PASS_THRESHOLD = 80 // percent
const QUIZ_HINT_LIMIT = 3 // per place, for the lifetime of the account

router.use(requireAuth)

// The admin can browse the site and play quizzes like anyone else, but its
// activity is never recorded: no visited places, no completed quizzes, no XP
// -- which also keeps it off the leaderboard. Answering 200 (rather than an
// error) lets the client treat an admin run like a normal, uncounted one.
router.use((req, res, next) => {
  if (req.user?.role !== 'admin') return next()
  if (req.path === '/quiz-result') {
    return res.status(200).json({
      user: adminPublicUser(),
      counted: false,
      xpGained: 0,
      levelsGained: 0,
      adminPreview: true,
    })
  }
  return res.status(200).json({ user: adminPublicUser(), adminPreview: true })
})

async function loadUser(req, res) {
  if (!mongoose.isValidObjectId(req.user.sub)) {
    res.status(404).json({ error: 'Account not found.' })
    return null
  }
  const user = await User.findById(req.user.sub)
  if (!user) {
    res.status(404).json({ error: 'Account not found.' })
    return null
  }
  return user
}

// ---------------------------------------------------------------------------
// POST /api/progress/visit-place  { placeId }  (protected)
// Records that the signed-in user has visited a place, then recomputes
// countriesExplored from scratch: a country only counts once every one of
// its points is in the visited list. Recomputing (instead of incrementing)
// means revisiting the same place, or places in an already-explored
// country, can never inflate the count.
// ---------------------------------------------------------------------------
router.post('/visit-place', async (req, res) => {
  const { placeId } = req.body || {}
  if (typeof placeId !== 'string' || !placeId.trim()) {
    return res.status(400).json({ error: 'A placeId is required.' })
  }

  const placeCountries = await getEffectivePlaceCountries()
  if (!Object.prototype.hasOwnProperty.call(placeCountries, placeId)) {
    return res.status(404).json({ error: 'Unknown place.' })
  }

  const user = await loadUser(req, res)
  if (!user) return undefined

  if (!user.visitedPlaces.includes(placeId)) {
    user.visitedPlaces.push(placeId)
  }

  const placesByCountry = groupByCountry(placeCountries)
  const visitedSet = new Set(user.visitedPlaces)
  user.exploredCountries = Object.entries(placesByCountry)
    .filter(([, ids]) => ids.length > 0 && ids.every((id) => visitedSet.has(id)))
    .map(([country]) => country)
  user.countriesExplored = user.exploredCountries.length

  await user.save()
  return res.status(200).json({ user: publicUser(user) })
})

// ---------------------------------------------------------------------------
// POST /api/progress/quiz-result  { placeId, scorePercent }  (protected)
// Only the first time a given place's quiz is passed (>= 80%) adds it to
// quizzesCompleted and awards XP -- retaking an already-completed quiz,
// whether it's passed or failed again, and no matter what score it gets,
// never increments the count or awards XP a second time. The final score
// on record for a place is effectively the one from that first pass; later
// re-attempts (higher or lower) don't change anything that counts.
// ---------------------------------------------------------------------------
router.post('/quiz-result', async (req, res) => {
  const { placeId, scorePercent } = req.body || {}
  if (typeof placeId !== 'string' || !placeId.trim()) {
    return res.status(400).json({ error: 'A placeId is required.' })
  }
  if (typeof scorePercent !== 'number' || Number.isNaN(scorePercent)) {
    return res.status(400).json({ error: 'A numeric scorePercent is required.' })
  }

  const user = await loadUser(req, res)
  if (!user) return undefined

  const alreadyCompleted = user.completedQuizzes.includes(placeId)
  const passed = scorePercent >= QUIZ_PASS_THRESHOLD
  const counted = !alreadyCompleted && passed

  let xpGained = 0
  let levelsGained = 0

  if (counted) {
    user.completedQuizzes.push(placeId)
    user.quizzesCompleted = user.completedQuizzes.length
    xpGained = QUIZ_PASS_XP
    levelsGained = applyXp(user, xpGained)
    user.xpHistory.push({ amount: xpGained, placeId, at: new Date() })
    await user.save()
  }

  return res.status(200).json({ user: publicUser(user), counted, xpGained, levelsGained })
})

// ---------------------------------------------------------------------------
// POST /api/progress/use-hint  { placeId }  (protected)
// Spends one of the QUIZ_HINT_LIMIT hints for a place's quiz. The count is
// kept on the account and never resets -- not on retake, not on logging out
// and back in -- so once a quiz's hints are gone they're gone for good. The
// limit is enforced in the update filter itself, so two requests racing
// each other still can't push the count past the limit.
// ---------------------------------------------------------------------------
router.post('/use-hint', async (req, res) => {
  const { placeId } = req.body || {}
  // Place ids are slugs; rejecting '.' and '$' also keeps the id safe to use
  // as a key in the Mongo update path below.
  if (typeof placeId !== 'string' || !placeId.trim() || /[.$]/.test(placeId)) {
    return res.status(400).json({ error: 'A placeId is required.' })
  }

  const placeCountries = await getEffectivePlaceCountries()
  if (!Object.prototype.hasOwnProperty.call(placeCountries, placeId)) {
    return res.status(404).json({ error: 'Unknown place.' })
  }

  if (!mongoose.isValidObjectId(req.user.sub)) {
    return res.status(404).json({ error: 'Account not found.' })
  }

  const field = `quizHints.${placeId}`
  const user = await User.findOneAndUpdate(
    {
      _id: req.user.sub,
      $or: [{ [field]: { $exists: false } }, { [field]: { $lt: QUIZ_HINT_LIMIT } }],
    },
    { $inc: { [field]: 1 } },
    { new: true }
  )

  if (!user) {
    const exists = await User.exists({ _id: req.user.sub })
    if (!exists) return res.status(404).json({ error: 'Account not found.' })
    return res.status(409).json({
      error: 'No hints left for this quiz.',
      hintsUsed: QUIZ_HINT_LIMIT,
      hintLimit: QUIZ_HINT_LIMIT,
    })
  }

  return res.status(200).json({
    user: publicUser(user),
    hintsUsed: user.quizHints.get(placeId),
    hintLimit: QUIZ_HINT_LIMIT,
  })
})

export default router
