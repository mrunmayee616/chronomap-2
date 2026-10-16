import { Router } from 'express'
import mongoose from 'mongoose'
import User from '../models/User.js'
import PlaceOverride from '../models/PlaceOverride.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import { PLACE_COUNTRIES } from '../data/places.js'
import { slugify, validatePlaceForm, validatePlaceEdit, buildPlace, applyEditToPlace, resolvePlaceImage } from '../utils/placeBuilder.js'
import { parseCsv } from '../utils/csvParse.js'
import { buildPlacesFromCsvRows, REQUIRED_CSV_COLUMNS } from '../utils/csvImport.js'
<<<<<<< HEAD
=======
import QuizQuestion from '../models/QuizQuestion.js'
import Follow from '../models/Follow.js'
import { syncPlaceImages, isSyncRunning } from '../utils/placeImageSync.js'
import { getEffectivePlaceCountries } from '../utils/placeOverrides.js'
import { validateQuizQuestion } from '../utils/quizQuestion.js'
>>>>>>> 3450fa5 (feat: Fixes for admin user and loading accurate images for locations)

const router = Router()

router.use(requireAuth, requireAdmin)

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

// GET /api/admin/users
router.get('/users', async (_req, res) => {
  const users = await User.find()
<<<<<<< HEAD
    .select('fullName email username gender level xp countriesExplored quizzesCompleted createdAt')
=======
    .select('fullName email username gender avatar level xp countriesExplored quizzesCompleted createdAt')
>>>>>>> 3450fa5 (feat: Fixes for admin user and loading accurate images for locations)
    .sort({ createdAt: -1 })
    .lean()

  return res.status(200).json({
    users: users.map((u) => ({
      id: u._id,
      fullName: u.fullName,
      email: u.email,
      username: u.username,
      gender: u.gender,
<<<<<<< HEAD
=======
      avatar: u.avatar || '',
>>>>>>> 3450fa5 (feat: Fixes for admin user and loading accurate images for locations)
      level: u.level,
      xp: u.xp,
      countriesExplored: u.countriesExplored,
      quizzesCompleted: u.quizzesCompleted,
      joinedAt: u.createdAt,
    })),
  })
})

// DELETE /api/admin/users/:id
router.delete('/users/:id', async (req, res) => {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).json({ error: 'User not found.' })
  }
  const deleted = await User.findByIdAndDelete(id)
  if (!deleted) {
    return res.status(404).json({ error: 'User not found.' })
  }
<<<<<<< HEAD
=======
  // Drop the deleted user's follows in both directions so nobody is left
  // with a phantom follower or following count.
  await Follow.deleteMany({ $or: [{ follower: id }, { following: id }] })
>>>>>>> 3450fa5 (feat: Fixes for admin user and loading accurate images for locations)
  return res.status(200).json({ message: 'User deleted.', id })
})

// ---------------------------------------------------------------------------
// Dataset (places)
// ---------------------------------------------------------------------------

// POST /api/admin/places
// Body: { name, country, latitude, longitude, category, year, yearEra, summary }
// Builds a complete place object (matching the shape of the static dataset)
// from a short admin form, and stores it as an 'added' override.
router.post('/places', async (req, res) => {
  const { name, country, latitude, longitude, category, year, yearEra, summary, image } = req.body || {}

  const fieldErrors = validatePlaceForm({ name, country, latitude, longitude, category, year, yearEra, summary, image })
  if (Object.keys(fieldErrors).length > 0) {
    return res.status(400).json({ error: 'Please fix the highlighted fields.', fieldErrors })
  }

  const trimmedName = String(name).trim()
  const trimmedCountry = String(country).trim()
  const trimmedSummary = String(summary).trim()

  const existingIds = new Set([
    ...Object.keys(PLACE_COUNTRIES),
    ...(await PlaceOverride.find().distinct('placeId')),
  ])
  let id = slugify(trimmedName) || 'place'
  let n = 2
  while (existingIds.has(id)) {
    id = `${slugify(trimmedName)}-${n}`
    n += 1
  }

  // If the admin didn't supply an image, try a real Wikipedia photo (and a
  // small gallery) before falling back to buildPlace's placeholder image.
  // Best-effort and bounded (see resolvePlaceImage) -- never blocks this
  // request for long, and a lookup miss just means the usual placeholder.
  const resolved = await resolvePlaceImage(trimmedName, image)

  const place = buildPlace({
    id,
    name: trimmedName,
    country: trimmedCountry,
    latitude,
    longitude,
    category,
    year,
    yearEra,
    summary: trimmedSummary,
    image: resolved.image,
    gallery: resolved.gallery,
    allCountries: Object.values(PLACE_COUNTRIES),
  })

  await PlaceOverride.create({ placeId: id, action: 'added', data: place })

  return res.status(201).json({ place })
})

// PATCH /api/admin/places/:id
// Partial edit -- only the fields present in the body are changed. Works
// for both an admin-added custom place (updates its stored data directly)
// and a static place (stores an 'edited' override that the client merges
// onto the bundled static object at render time).
router.patch('/places/:id', async (req, res) => {
  const { id } = req.params
  const { name, category, image, summary } = req.body || {}

  const changes = {}
  if (name !== undefined) changes.name = String(name).trim()
  if (category !== undefined) changes.category = category
  if (image !== undefined) changes.image = image
  if (summary !== undefined) changes.summary = String(summary).trim()

  if (Object.keys(changes).length === 0) {
    return res.status(400).json({ error: 'Nothing to update.' })
  }

  const fieldErrors = validatePlaceEdit(changes)
  if (Object.keys(fieldErrors).length > 0) {
    return res.status(400).json({ error: 'Please fix the highlighted fields.', fieldErrors })
  }

  const existingAdded = await PlaceOverride.findOne({ placeId: id, action: 'added' })
  if (existingAdded) {
    existingAdded.data = applyEditToPlace(existingAdded.data, changes)
    existingAdded.markModified('data')
    await existingAdded.save()
    return res.status(200).json({ place: existingAdded.data })
  }

  if (!Object.prototype.hasOwnProperty.call(PLACE_COUNTRIES, id)) {
    return res.status(404).json({ error: 'Unknown place.' })
  }

  const existingEdit = await PlaceOverride.findOne({ placeId: id, action: 'edited' })
  const mergedChanges = { ...(existingEdit?.data || {}), ...changes }
  await PlaceOverride.findOneAndUpdate(
    { placeId: id },
    { placeId: id, action: 'edited', data: mergedChanges },
    { upsert: true }
  )
  return res.status(200).json({ edits: mergedChanges })
})

// POST /api/admin/places/bulk
// Body: { csv: "<raw CSV text>" }
// Bulk-imports places from a CSV using the same columns as the original
// dataset (place_name, country, latitude, longitude, event_name,
// event_type, event_date, description). Rows sharing a place_name are
// combined into one place with a multi-entry timeline, exactly like the
// original dataset build. Each successfully parsed place is stored as its
// own 'added' override.
router.post('/places/bulk', async (req, res) => {
  const { csv } = req.body || {}
  if (typeof csv !== 'string' || !csv.trim()) {
    return res.status(400).json({ error: 'No CSV data received.' })
  }

  let rows
  try {
    rows = parseCsv(csv)
  } catch (err) {
    return res.status(400).json({ error: `Could not parse that CSV: ${err.message}` })
  }
  if (rows.length === 0) {
    return res.status(400).json({ error: 'The CSV has no data rows.' })
  }

  const headerCols = Object.keys(rows[0])
  const missingCols = REQUIRED_CSV_COLUMNS.filter((c) => !headerCols.includes(c))
  if (missingCols.length > 0) {
    return res.status(400).json({ error: `CSV is missing required column(s): ${missingCols.join(', ')}` })
  }

  const existingIds = new Set([
    ...Object.keys(PLACE_COUNTRIES),
    ...(await PlaceOverride.find().distinct('placeId')),
  ])

  const { places, skipped, errors } = buildPlacesFromCsvRows(rows, {
    existingIds,
    allCountries: Object.values(PLACE_COUNTRIES),
    slugify,
  })

  if (places.length > 0) {
    await PlaceOverride.insertMany(places.map((p) => ({ placeId: p.id, action: 'added', data: p })))
  }

  return res.status(200).json({
    addedCount: places.length,
    added: places.map((p) => ({ id: p.id, name: p.name })),
    skipped,
    errors,
  })
})

// DELETE /api/admin/places/:id
// A custom (admin-added) place is deleted outright. A static place is
// "removed" -- recorded as hidden rather than actually deleted, since it
// isn't stored here to begin with; see POST /:id/restore to undo this.
router.delete('/places/:id', async (req, res) => {
  const { id } = req.params

  const existingAdded = await PlaceOverride.findOne({ placeId: id, action: 'added' })
  if (existingAdded) {
    await PlaceOverride.deleteOne({ _id: existingAdded._id })
<<<<<<< HEAD
=======
    // A custom place is gone for good, so its extra quiz questions go too.
    await QuizQuestion.deleteMany({ placeId: id })
>>>>>>> 3450fa5 (feat: Fixes for admin user and loading accurate images for locations)
    return res.status(200).json({ message: 'Place deleted.', id })
  }

  if (!Object.prototype.hasOwnProperty.call(PLACE_COUNTRIES, id)) {
    return res.status(404).json({ error: 'Unknown place.' })
  }

  await PlaceOverride.findOneAndUpdate(
    { placeId: id },
    { placeId: id, action: 'removed', data: null },
    { upsert: true }
  )
  return res.status(200).json({ message: 'Place removed.', id })
})

// POST /api/admin/places/:id/restore
// Undoes a removal of a static place. No-op for anything else.
router.post('/places/:id/restore', async (req, res) => {
  const { id } = req.params
  await PlaceOverride.deleteOne({ placeId: id, action: 'removed' })
  return res.status(200).json({ message: 'Place restored.', id })
})

<<<<<<< HEAD
=======
// POST /api/admin/places/images/sync   Body: { force?: boolean }
// Re-runs the Wikipedia photo lookup in the background (force: redo every
// place, not just the ones missing a photo). Returns straight away.
router.post('/places/images/sync', async (req, res) => {
  if (isSyncRunning()) return res.status(202).json({ message: 'A photo sync is already running.' })
  syncPlaceImages({ force: Boolean(req.body?.force) }).catch((err) => console.error('Place image sync failed:', err.message))
  return res.status(202).json({ message: 'Photo sync started.' })
})

// ---------------------------------------------------------------------------
// Quiz questions
// ---------------------------------------------------------------------------

// POST /api/admin/places/:id/questions
// Body: { question, options: [..2-4 strings], answerIndex }
// Adds one question to a place's quiz. Works for static and admin-added
// places alike; the client appends these after the place's built-in
// questions.
router.post('/places/:id/questions', async (req, res) => {
  const { id } = req.params
  const placeCountries = await getEffectivePlaceCountries()
  if (!Object.prototype.hasOwnProperty.call(placeCountries, id)) {
    return res.status(404).json({ error: 'Unknown place.' })
  }

  const { fieldErrors, clean } = validateQuizQuestion(req.body || {})
  if (Object.keys(fieldErrors).length > 0) {
    return res.status(400).json({ error: 'Please fix the highlighted fields.', fieldErrors })
  }

  // Keep questions unique. The built-in quiz lives in the client bundle (the
  // admin form checks against it), so here we guard what the server knows:
  // no identical question text anywhere, and no second custom question for
  // this place with the same correct answer.
  const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim()
  const stored = await QuizQuestion.find().lean()
  if (stored.some((q) => norm(q.question) === norm(clean.question))) {
    return res.status(409).json({
      error: 'That question already exists.',
      fieldErrors: { question: 'A question with that wording already exists.' },
    })
  }
  const wantedAnswer = norm(clean.options[clean.answerIndex])
  if (stored.some((q) => q.placeId === id && norm(q.options[q.answerIndex]) === wantedAnswer)) {
    return res.status(409).json({
      error: 'That answer is already used in this quiz.',
      fieldErrors: { answerIndex: 'Another question for this place already has that correct answer.' },
    })
  }

  const created = await QuizQuestion.create({ placeId: id, ...clean })
  return res.status(201).json({
    question: {
      id: String(created._id),
      question: created.question,
      options: created.options,
      answerIndex: created.answerIndex,
      custom: true,
    },
  })
})

// DELETE /api/admin/questions/:qid
// Only admin-added questions live here, so this can never touch the
// built-in quiz data.
router.delete('/questions/:qid', async (req, res) => {
  const { qid } = req.params
  if (!mongoose.isValidObjectId(qid)) {
    return res.status(404).json({ error: 'Question not found.' })
  }
  const deleted = await QuizQuestion.findByIdAndDelete(qid)
  if (!deleted) return res.status(404).json({ error: 'Question not found.' })
  return res.status(200).json({ message: 'Question deleted.', id: qid })
})

>>>>>>> 3450fa5 (feat: Fixes for admin user and loading accurate images for locations)
export default router
