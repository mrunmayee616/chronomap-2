// Hand-written quiz hints, keyed by exact question text. Split across files
// only to keep each one a manageable size (like src/data/eventDetails).
// Generated questions get their hints in src/data/worldPlaces.js instead.
import bank1 from './bank1.js'
import bank2 from './bank2.js'
import bank3 from './bank3.js'
import others from './others.js'

export const QUIZ_HINTS = { ...bank1, ...bank2, ...bank3, ...others }
