import { Router } from 'express'
import mongoose from 'mongoose'
import User from '../models/User.js'
import PlaceOverride from '../models/PlaceOverride.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import { PLACE_COUNTRIES } from '../data/places.js'
import { slugify, validatePlaceForm, validatePlaceEdit, buildPlace, applyEditToPlace } from '../utils/placeBuilder.js'
import { parseCsv } from '../utils/csvParse.js'
import { buildPlacesFromCsvRows, REQUIRED_CSV_COLUMNS } from '../utils/csvImport.js'

const router = Router()

router.use(requireAuth, requireAdmin)

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

// GET /api/admin/users
router.get('/users', async (_req, res) => {
  const users = await User.find()
    .select('fullName email username gender level xp countriesExplored quizzesCompleted createdAt')
    .sort({ createdAt: -1 })
    .lean()

  return res.status(200).json({
    users: users.map((u) => ({
      id: u._id,
      fullName: u.fullName,
      email: u.email,
      username: u.username,
      gender: u.gender,
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
    image,
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

export default router
