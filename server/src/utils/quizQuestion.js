// Validates the body of "add a quiz question" and returns a cleaned copy.
// Returns { fieldErrors, clean }: clean is only meaningful when fieldErrors
// is empty.
export function validateQuizQuestion({ question, options, answerIndex }) {
  const fieldErrors = {}

  const trimmedQuestion = typeof question === 'string' ? question.trim() : ''
  if (!trimmedQuestion) fieldErrors.question = 'Question text is required.'
  else if (trimmedQuestion.length < 5) fieldErrors.question = 'Question must be at least 5 characters.'
  else if (trimmedQuestion.length > 300) fieldErrors.question = 'Question must be 300 characters or fewer.'

  let cleanOptions = []
  if (!Array.isArray(options)) {
    fieldErrors.options = 'Options are required.'
  } else {
    cleanOptions = options.map((o) => (typeof o === 'string' ? o.trim() : ''))
    if (cleanOptions.length < 2 || cleanOptions.length > 4) {
      fieldErrors.options = 'Provide between 2 and 4 answer options.'
    } else if (cleanOptions.some((o) => !o)) {
      fieldErrors.options = 'Every answer option needs text.'
    } else if (cleanOptions.some((o) => o.length > 120)) {
      fieldErrors.options = 'Each answer option must be 120 characters or fewer.'
    } else if (new Set(cleanOptions.map((o) => o.toLowerCase())).size !== cleanOptions.length) {
      // The quiz page keys its option buttons by their text, so duplicates
      // would also break rendering -- not just be confusing.
      fieldErrors.options = 'Answer options must all be different.'
    }
  }

  if (!Number.isInteger(answerIndex) || answerIndex < 0 || answerIndex >= cleanOptions.length) {
    if (!fieldErrors.answerIndex) fieldErrors.answerIndex = 'Pick which option is the correct answer.'
  }

  return {
    fieldErrors,
    clean: { question: trimmedQuestion, options: cleanOptions, answerIndex },
  }
}
