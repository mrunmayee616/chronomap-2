import mongoose from 'mongoose'

// Quiz questions written by the admin, layered on top of each place's
// bundled quiz (src/data/places.js). Kept in their own collection rather
// than inside a PlaceOverride: a place has only one override document, and
// removing/restoring a place replaces or deletes it -- questions stored there
// would be lost. Here they survive edits, removal and restore untouched.
//
// Served to every visitor through GET /api/places/overrides (quizAdditions)
// and appended to the place's quiz client-side in PlacesContext.
const quizQuestionSchema = new mongoose.Schema(
  {
    placeId: { type: String, required: true, trim: true, index: true },
    question: { type: String, required: true, trim: true },
    options: { type: [String], required: true },
    answerIndex: { type: Number, required: true },
  },
  { timestamps: true }
)

export default mongoose.model('QuizQuestion', quizQuestionSchema)
