import mongoose from 'mongoose'

// The bulk of the place dataset (Rome, Athens, etc.) ships as a static file
// in the client bundle -- it's too large and too richly nested (timelines,
// quizzes, galleries) to duplicate in Mongo. Instead, admin edits are stored
// here as a small delta on top of that static list:
//
//   action: 'removed' -> hides a static place (data is unused/null)
//   action: 'added'   -> a brand new place created from the admin dashboard,
//                        stored in full so it can be merged into the client
//                        dataset alongside the static ones
//
// See server/src/routes/places.routes.js (the public merge endpoint) and
// server/src/routes/admin.routes.js (the routes that create/delete these).
const placeOverrideSchema = new mongoose.Schema(
  {
    placeId: { type: String, required: true, unique: true, trim: true, index: true },
    action: { type: String, enum: ['removed', 'added'], required: true },
    data: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
)

export default mongoose.model('PlaceOverride', placeOverrideSchema)
