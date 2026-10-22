import { COUNTRY_CODES } from '../data/countries.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/
// "unspecified" is kept only as a legacy fallback for accounts created
// before gender selection existed (see auth.routes.js PATCH /me) - new
// registrations must pick male or female.
const GENDER_VALUES = ['male', 'female', 'unspecified']
const REGISTRATION_GENDER_VALUES = ['male', 'female']
const COUNTRY_CODE_SET = new Set(COUNTRY_CODES)

export function isValidGender(gender) {
  return GENDER_VALUES.includes(gender)
}

export function isValidCountry(country) {
  return typeof country === 'string' && COUNTRY_CODE_SET.has(country.toUpperCase())
}

export function validateRegistration({ fullName, email, username, password, confirmPassword, agreeTerms, gender, country }) {
  const errors = {}

  if (!fullName || !fullName.trim()) errors.fullName = 'Full name is required.'
  else if (fullName.trim().length < 2) errors.fullName = 'Full name is too short.'

  if (!email || !email.trim()) errors.email = 'Email is required.'
  else if (!EMAIL_RE.test(email.trim())) errors.email = 'Enter a valid email address.'

  if (!username || !username.trim()) errors.username = 'Username is required.'
  else if (!USERNAME_RE.test(username.trim())) {
    errors.username = 'Username must be 3-20 characters (letters, numbers, underscore only).'
  }

  if (!password) errors.password = 'Password is required.'
  else if (password.length < 8) errors.password = 'Password must be at least 8 characters.'
  else if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    errors.password = 'Password must include at least one letter and one number.'
  }

  if (!confirmPassword) errors.confirmPassword = 'Please confirm your password.'
  else if (password && confirmPassword !== password) errors.confirmPassword = 'Passwords do not match.'

  if (!agreeTerms) errors.agreeTerms = 'You must agree to the Terms of Service and Privacy Policy.'

  if (!gender) {
    errors.gender = 'Please select Male or Female.'
  } else if (!REGISTRATION_GENDER_VALUES.includes(gender)) {
    errors.gender = 'Please select Male or Female.'
  }

  if (!country) {
    errors.country = 'Please select your country.'
  } else if (!isValidCountry(country)) {
    errors.country = 'Please select a valid country.'
  }

  return errors
}

export function validateLogin({ identifier, password }) {
  const errors = {}
  if (!identifier || !identifier.trim()) errors.identifier = 'Email or username is required.'
  if (!password) errors.password = 'Password is required.'
  return errors
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0
}

export const QUIZ_OPTION_COUNT = 4
const QUIZ_QUESTION_MAX = 300
const QUIZ_OPTION_MAX = 150

// Validates an admin-written quiz question: { question, options[4], answerIndex }.
// Option errors are keyed option0..option3 so the form can highlight the
// exact input; duplicate options are rejected since two identical choices
// make the question ambiguous.
export function validateQuizQuestion({ question, options, answerIndex }) {
  const errors = {}

  if (typeof question !== 'string' || !question.trim()) errors.question = 'Write the question.'
  else if (question.trim().length > QUIZ_QUESTION_MAX) errors.question = `Keep the question under ${QUIZ_QUESTION_MAX} characters.`

  if (!Array.isArray(options) || options.length !== QUIZ_OPTION_COUNT) {
    errors.options = `Provide exactly ${QUIZ_OPTION_COUNT} answer options.`
  } else {
    const seen = new Map()
    options.forEach((opt, i) => {
      const text = typeof opt === 'string' ? opt.trim() : ''
      if (!text) errors[`option${i}`] = 'Fill in this option.'
      else if (text.length > QUIZ_OPTION_MAX) errors[`option${i}`] = `Keep options under ${QUIZ_OPTION_MAX} characters.`
      else if (seen.has(text.toLowerCase())) errors[`option${i}`] = `Same as option ${seen.get(text.toLowerCase()) + 1}.`
      else seen.set(text.toLowerCase(), i)
    })
  }

  if (!Number.isInteger(answerIndex) || answerIndex < 0 || answerIndex >= QUIZ_OPTION_COUNT) {
    errors.answerIndex = 'Mark which option is correct.'
  }

  return errors
}
