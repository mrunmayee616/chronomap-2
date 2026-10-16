import mongoose from 'mongoose'

// Quiz questions added from the admin dashboard. The bulk of the quiz data
// ships inside the static places dataset in the client bundle, so these are
// stored separately and appended to a place's quiz when the client merges
// the live place list (see src/context/PlacesContext.jsx and
// GET /api/places/overrides). Same shape as a static quiz entry:
// { question, options, answerIndex }.
const quizQuestionSchema = new mongoose.Schema(
  {
    placeId: { type: String, required: true, trim: true, index: true },
    question: { type: String, required: true, trim: true, maxlength: 300 },
    options: { type: [String], required: true },
    answerIndex: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
)

export default mongoose.model('QuizQuestion', quizQuestionSchema)
