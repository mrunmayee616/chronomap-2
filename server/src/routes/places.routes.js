import { Router } from 'express'
import PlaceOverride from '../models/PlaceOverride.js'
import QuizQuestion from '../models/QuizQuestion.js'
import PlaceImage from '../models/PlaceImage.js'

const router = Router()

// ---------------------------------------------------------------------------
// GET /api/places/overrides  (public)
// Everything the client needs to turn the static bundled dataset into the
// "live" one the admin dashboard controls: which static places to hide, and
// which admin-added places to append. No auth required -- every visitor
// (signed in or not) needs this just to render the map correctly.
// ---------------------------------------------------------------------------
// GET /api/places/images  (public)
// The real Wikipedia photos found for the built-in places, keyed by place
// id: { [placeId]: { image, gallery: [{ image, caption }] } }. A place with
// no entry yet simply keeps showing its neutral placeholder.
router.get('/images', async (_req, res) => {
  const rows = await PlaceImage.find().lean()
  const images = rows.reduce((acc, r) => {
    acc[r.placeId] = { image: r.image, gallery: r.gallery || [] }
    return acc
  }, {})
  res.set('Cache-Control', 'public, max-age=300')
  return res.status(200).json({ images })
})

router.get('/overrides', async (_req, res) => {
  const overrides = await PlaceOverride.find().lean()
  const removedIds = overrides.filter((o) => o.action === 'removed').map((o) => o.placeId)
  const addedPlaces = overrides.filter((o) => o.action === 'added' && o.data).map((o) => o.data)
  const edits = overrides
    .filter((o) => o.action === 'edited' && o.data)
    .reduce((acc, o) => ({ ...acc, [o.placeId]: o.data }), {})
  // Admin-written quiz questions, grouped by place and oldest first so the
  // order an admin added them in is the order they appear in the quiz.
  const questions = await QuizQuestion.find().sort({ createdAt: 1 }).lean()
  const extraQuestions = questions.reduce((acc, q) => {
    ;(acc[q.placeId] ||= []).push({
      id: String(q._id),
      question: q.question,
      options: q.options,
      answerIndex: q.answerIndex,
      custom: true,
    })
    return acc
  }, {})
  return res.status(200).json({ removedIds, addedPlaces, edits, extraQuestions })
})

export default router
