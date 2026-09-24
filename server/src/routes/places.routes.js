import { Router } from 'express'
import PlaceOverride from '../models/PlaceOverride.js'

const router = Router()

// ---------------------------------------------------------------------------
// GET /api/places/overrides  (public)
// Everything the client needs to turn the static bundled dataset into the
// "live" one the admin dashboard controls: which static places to hide, and
// which admin-added places to append. No auth required -- every visitor
// (signed in or not) needs this just to render the map correctly.
// ---------------------------------------------------------------------------
router.get('/overrides', async (_req, res) => {
  const overrides = await PlaceOverride.find().lean()
  const removedIds = overrides.filter((o) => o.action === 'removed').map((o) => o.placeId)
  const addedPlaces = overrides.filter((o) => o.action === 'added' && o.data).map((o) => o.data)
  const edits = overrides
    .filter((o) => o.action === 'edited' && o.data)
    .reduce((acc, o) => ({ ...acc, [o.placeId]: o.data }), {})
  return res.status(200).json({ removedIds, addedPlaces, edits })
})

export default router
