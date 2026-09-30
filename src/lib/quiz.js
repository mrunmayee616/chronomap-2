// The generated quiz data (src/data/places.js) repeats itself: most places
// ask "In which country is X located?" twice, and several ask the same fact
// in two phrasings ("What type of event is ... classified as?" / "What type
// of event was ... at X?"). Places merged from two source rows (e.g. Beijing)
// repeat their country, coordinates and continent questions wholesale.
//
// A question is treated as a repeat if an earlier question in the same quiz
// has the same wording OR the same correct answer -- a quiz should never ask
// for the same answer twice, since the second time is free points. Wording is
// compared with parentheticals dropped, so "...associated with Beijing?" and
// "...associated with Beijing (Forbidden City)?" count as the same question.
// The first occurrence is kept so the original question order is preserved.

const normalize = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
const normalizeQuestion = (s) => normalize(String(s).replace(/\([^)]*\)/g, ''))

export function dedupeQuiz(quiz) {
  if (!Array.isArray(quiz)) return []
  const seenQuestions = new Set()
  const seenAnswers = new Set()
  return quiz.filter((q) => {
    const question = normalizeQuestion(q.question)
    const answer = normalize(q.options?.[q.answerIndex])
    if (seenQuestions.has(question) || (answer && seenAnswers.has(answer))) return false
    seenQuestions.add(question)
    if (answer) seenAnswers.add(answer)
    return true
  })
}
