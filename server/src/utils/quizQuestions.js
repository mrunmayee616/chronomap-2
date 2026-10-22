import QuizQuestion from '../models/QuizQuestion.js'

// The client-facing shape of an admin-written question -- the same
// { question, options, answerIndex } shape as the bundled quiz data, plus an
// id (for deleting it) and `custom: true` so the dashboard can tell them apart.
export function publicQuizQuestion(q) {
  return {
    id: String(q._id),
    question: q.question,
    options: q.options,
    answerIndex: q.answerIndex,
    custom: true,
  }
}

// { placeId: [question, ...] } in the order they were written.
export async function getQuizAdditions() {
  const questions = await QuizQuestion.find().sort({ createdAt: 1 }).lean()
  return questions.reduce((acc, q) => {
    if (!acc[q.placeId]) acc[q.placeId] = []
    acc[q.placeId].push(publicQuizQuestion(q))
    return acc
  }, {})
}
