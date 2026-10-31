// Quiz hints: a fun, descriptive clue that nudges the player towards the
// answer without giving it away. Hand-written hints live in
// src/data/quizHints (keyed by question text); generated questions carry a
// `hint` of their own (see src/data/worldPlaces.js). Admin-added questions
// can set `hint` too; anything without one gets a gentle generic clue.

import { QUIZ_HINTS } from '../data/quizHints/index.js'
import { normalizeQuestionText } from './quiz.js'

// Stable id for a question, used by the server to remember which questions
// a hint was already spent on (so asking again is free). Based on the text
// rather than the position, so reordering a quiz can't mix hints up.
export function questionKey(question) {
  return normalizeQuestionText(question.question).slice(0, 200)
}

function magnitude(n) {
  if (n >= 1e6) return 'in the millions'
  if (n >= 1e5) return 'in the hundreds of thousands'
  if (n >= 1e4) return 'in the tens of thousands'
  if (n >= 1e3) return 'in the thousands'
  if (n >= 100) return 'in the hundreds'
  return 'fairly small'
}

function fallbackHint(question) {
  const answer = String(question.options?.[question.answerIndex] ?? '').trim()
  if (!answer) return ''
  const number = answer.replace(/,/g, '').match(/\d+/)
  if (number && !/\b(BCE|BC|CE|AD|century)\b/i.test(answer)) {
    return `🔢 Think big picture — the number you're after is ${magnitude(Number(number[0]))}.`
  }
  return '🤔 Read the question again slowly — one of the options should ring a bell from the place page! 📖'
}

// ---- First-letter reveal ----
// Shown under the clue as an extra nudge. Leading filler words ("The",
// "About"...) are skipped, since "T" for "The Flavians" would be useless.

const FILLER_WORDS = new Set(['the', 'a', 'an', 'about', 'roughly', 'around', 'approximately', 'up', 'to', 'some', 'his', 'her', 'its', 'their'])

// The letter itself is never shown: it's encoded as three emojis whose names
// all start with it (🎻 🌋 🧛 -> violin, volcano, vampire -> V). Each set is
// picked to be easy to name and hard to misread.
const LETTER_EMOJIS = {
  a: ['🍎', '🐜', '🥑'], b: ['🍌', '🐻', '🎈'], c: ['🐱', '🥕', '🎂'], d: ['🐬', '🦆', '🐉'],
  e: ['🐘', '🥚', '🦅'], f: ['🐸', '🦊', '🔥'], g: ['🦒', '🍇', '👻'], h: ['🐴', '🍔', '🚁'],
  i: ['🍦', '🧊', '🏝️'], j: ['🧃', '👖', '🕹️'], k: ['🦘', '🪁', '🥝'], l: ['🦁', '🍋', '🦞'],
  m: ['🐒', '🍄', '🧲'], n: ['👃', '🪺', '📰'], o: ['🐙', '🦉', '🍊'], p: ['🐧', '🍕', '🍍'],
  q: ['👸', '🪶', '❓'], r: ['🌈', '🚀', '🤖'], s: ['🐍', '🦈', '⭐'], t: ['🐯', '🍅', '🌮'],
  u: ['☂️', '🦄', '🛸'], v: ['🎻', '🌋', '🧛'], w: ['🐋', '🍉', '🐺'], x: ['🩻', '❌', '🎹'],
  y: ['🪀', '🧶', '🧘'], z: ['🦓', '🧟', '💤'],
}

// Digits get a counting riddle instead.
const DIGIT_RIDDLES = {
  0: '🍩 the digit shaped like a doughnut',
  1: '☝️ how many noses you have',
  2: '👀 how many eyes you have',
  3: '🔺 the number of sides on a triangle',
  4: '🍀 the leaves on a lucky clover',
  5: '🖐️ the fingers on one hand',
  6: '🐞 the legs on a ladybird',
  7: '🌈 the colours in a rainbow',
  8: '🐙 the arms on an octopus',
  9: '⚾ the players on a baseball team',
}

const RIDDLE_LINES = [
  ['🧩', 'Emoji riddle! Say these out loud: the answer starts with the same letter they all do.'],
  ['🕵️', 'Decode this, detective: name each picture and listen to how they all begin.'],
  ['🦉', 'The wise owl drew you a picture puzzle: the answer begins with the same letter as all of these!'],
  ['🏺', 'Archaeologists found these symbols carved beside the answer. Their names share its first letter!'],
  ['🪄', 'Abracadabra! These pictures all start with the secret letter.'],
  ['📜', 'An ancient scroll of pictures. Their first letter is the answer’s first letter!'],
]

const DIGIT_LINES = [
  ['🔢', 'Number riddle! The answer starts with the digit for…'],
  ['🧮', 'Count it out: the first digit of the answer is…'],
]

function seededIndex(text, size) {
  let h = 0
  for (const ch of text) h = (h * 31 + ch.codePointAt(0)) >>> 0
  return h % size
}

// The option text from its first meaningful word on, letters and digits only.
function keyOf(option) {
  const words = String(option ?? '').trim().split(/\s+/)
  const skipped = []
  while (words.length > 1 && FILLER_WORDS.has(words[0].toLowerCase())) skipped.push(words.shift())
  const chars = [...words.join(' ')].filter((ch) => /[\p{L}\p{N}]/u.test(ch))
  return { chars, skipped }
}

// Usually just the first letter -- but when another option starts with the
// same letter (Athena / Artemis) reveal a little more, up to MAX_REVEAL
// characters, so the clue can actually tell them apart.
const MAX_REVEAL = 3

export function firstLetterFor(question) {
  const options = question.options || []
  const answer = keyOf(options[question.answerIndex])
  if (answer.chars.length === 0) return null

  const others = options
    .filter((_, i) => i !== question.answerIndex)
    .map((o) => keyOf(o).chars.join('').toLowerCase())
  let n = 1
  while (n < MAX_REVEAL && n < answer.chars.length) {
    const prefix = answer.chars.slice(0, n).join('').toLowerCase()
    if (!others.some((o) => o.startsWith(prefix))) break
    n++
  }
  // Accents dropped so "É" is riddled as "e".
  const revealed = answer.chars
    .slice(0, n)
    .map((ch) => ch.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase())

  // One riddle per revealed character; stop at anything we can't encode.
  const parts = []
  for (const ch of revealed) {
    if (LETTER_EMOJIS[ch]) parts.push({ emojis: LETTER_EMOJIS[ch] })
    else if (DIGIT_RIDDLES[ch]) parts.push({ text: DIGIT_RIDDLES[ch] })
    else break
  }
  if (parts.length === 0) return null

  const seed = question.question || revealed.join('')
  const isDigit = Boolean(parts[0].text)
  const [icon, lead] = isDigit
    ? DIGIT_LINES[seededIndex(seed, DIGIT_LINES.length)]
    : RIDDLE_LINES[seededIndex(seed, RIDDLE_LINES.length)]
  return {
    icon,
    lead:
      parts.length > 1
        ? `${lead} Clue 1 gives the first ${isDigit ? 'digit' : 'letter'}, clue 2 the next${parts.length > 2 ? ', and so on' : ''}.`
        : lead,
    parts,
    // e.g. "not counting “The”" so players know to look past it
    skipped: answer.skipped.join(' '),
  }
}

export function hintFor(question) {
  if (typeof question.hint === 'string' && question.hint.trim()) return question.hint.trim()
  return QUIZ_HINTS[question.question] || fallbackHint(question)
}
