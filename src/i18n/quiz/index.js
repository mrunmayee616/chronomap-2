// Translates the generated quiz questions for display.
//
// Nearly every question in src/data/places.js and src/data/worldPlaces.js is
// built from a handful of English sentence patterns ("In which country is X
// located?"), and most answer options come from small fixed sets (countries,
// continents, event types, centuries, dates). Each language file in this
// folder translates those patterns and sets once; this module matches a
// question against the patterns and rebuilds it in the chosen language.
//
// Anything it doesn't recognise -- hand-written questions, event names,
// description options -- is shown in English, so a gap never breaks a quiz.
// Only the displayed text changes: the question object (and so answer
// checking, hint keys and progress) stays exactly as it was.

import { COUNTRIES } from '../../data/countries.js'
import fr from './fr.js'
import es from './es.js'
import de from './de.js'
import pt from './pt.js'
import ru from './ru.js'
import ar from './ar.js'
import it from './it.js'
import nl from './nl.js'
import ja from './ja.js'
import ko from './ko.js'
import zh from './zh.js'
import hi from './hi.js'
import tr from './tr.js'
import pl from './pl.js'
import id from './id.js'
import sv from './sv.js'
import el from './el.js'
import uk from './uk.js'
import ro from './ro.js'

const PACKS = { fr, es, de, pt, ru, ar, it, nl, ja, ko, zh, hi, tr, pl, id, sv, el, uk, ro }

/* ---------- question patterns ---------- */

// Event names are quoted with either “…” or '…' in the source data.
const EV = `[“'](.+)[”']`

// [pattern key, regex, option kind, capture names]. Order matters where one
// pattern is a prefix of another (typeAt before type, whenAt before when).
const PATTERNS = [
  ['country', /^In which country is (.+) located\?$/, 'country', ['place']],
  ['mostAssociated', /^Which historical event is most associated with (.+)\?$/, null, ['place']],
  ['continent', /^On which continent is (.+?)(?: located)?\?$/, 'continent', ['place']],
  ['whenAt', new RegExp(`^When did ${EV} take place at (.+)\\?$`), 'date', ['event', 'place']],
  ['when', new RegExp(`^When did ${EV} take place\\?$`), 'date', ['event']],
  ['centuryBegin', new RegExp(`^In which century did ${EV} begin\\?$`), 'date', ['event']],
  ['century', new RegExp(`^In which century did ${EV} take place\\?$`), 'date', ['event']],
  ['typeAt', new RegExp(`^What type of historical event (?:is|was) ${EV} at (.+)\\?$`), 'type', ['event', 'place']],
  ['type', new RegExp(`^What type of historical event (?:is|was) ${EV}(?: classified as)?\\?$`), 'type', ['event']],
  ['lat', /^Which is the approximate latitude of (.+)\?$/, 'degrees', ['place']],
  ['lng', /^Which is the approximate longitude of (.+)\?$/, 'degrees', ['place']],
  ['describes', /^Which of these best describes what happened at (.+)\?$/, null, ['place']],
  ['count', /^How many distinct historical events are recorded for (.+) in this dataset\?$/, null, ['place']],
  ['mainCentury', /^Approximately which century did the main event at (.+) occur in\?$/, 'date', ['place']],
  ['associated', /^Which of these events is historically associated with (.+)\?$/, null, ['place']],
  ['besides', new RegExp(`^Besides ${EV}, which other event is recorded at (.+)\\?$`), null, ['event', 'place']],
]

const fill = (template, vars) => template.replace(/\{(\w+)\}/g, (m, k) => (vars[k] !== undefined ? vars[k] : m))

/* ---------- countries ---------- */

// Countries that appear in quizzes but not in the registration list.
const EXTRA_CODES = {
  Palestine: 'PS', Guatemala: 'GT', Tunisia: 'TN', Mali: 'ML', Zimbabwe: 'ZW',
  'Bosnia and Herzegovina': 'BA', Zambia: 'ZM', Libya: 'LY', Tanzania: 'TZ',
  'Democratic Republic of the Congo': 'CD', Senegal: 'SN', Sudan: 'SD', Bolivia: 'BO',
  Ecuador: 'EC', 'Solomon Islands': 'SB', Haiti: 'HT', 'Dominican Republic': 'DO',
  Bahamas: 'BS', Mongolia: 'MN', Turkmenistan: 'TM', 'Papua New Guinea': 'PG',
}
const COUNTRY_CODES = { ...Object.fromEntries(COUNTRIES.map((c) => [c.name, c.code])), ...EXTRA_CODES }

const regionNames = {}
function countryIn(name, locale) {
  const code = COUNTRY_CODES[name]
  if (!code) return null
  try {
    regionNames[locale] ||= new Intl.DisplayNames([locale], { type: 'region' })
    return regionNames[locale].of(code) || null
  } catch {
    return null
  }
}

// "Israel/Palestine", "Ukraine (Crimea)"
function localizeCountry(raw, pack, locale) {
  const m = raw.match(/^(.+?) \(Crimea\)$/)
  if (m) {
    const base = countryIn(m[1], locale)
    return base ? `${base} (${pack.crimea})` : null
  }
  const parts = raw.split('/').map((p) => countryIn(p, locale))
  return parts.every(Boolean) ? parts.join('/') : null
}

/* ---------- dates and centuries ---------- */

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const MONTH_RE = MONTHS.join('|')

function roman(n) {
  const table = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]
  let out = ''
  for (const [v, s] of table) while (n >= v) { out += s; n -= v }
  return out
}

// Gregorian calendar and Latin digits everywhere, so dates line up with the
// years and numbers shown elsewhere in the quiz (ar-SA would otherwise
// default to the Hijri calendar).
const formatters = {}
function formatDate(locale, opts, y, m, d = 1) {
  const key = locale + JSON.stringify(opts)
  formatters[key] ||= new Intl.DateTimeFormat(locale, { ...opts, calendar: 'gregory', numberingSystem: 'latn', timeZone: 'UTC' })
  const date = new Date(Date.UTC(2000, m - 1, d))
  date.setUTCFullYear(y)
  return formatters[key].format(date)
}
const monthName = (locale, m) => formatDate(locale, { month: 'long' }, 2000, m)

// One side of a date range, without its era: "14 July 1789", "July 1789",
// "461-429", "1990s", "18th century", "15th-16th century".
function localizeCore(core, pack, locale) {
  let m
  if ((m = core.match(/^(\d{4})-(\d{2})-(\d{2})$/))) return formatDate(locale, { dateStyle: 'long' }, +m[1], +m[2], +m[3])
  if ((m = core.match(/^(\d{4})-(\d{2})$/))) return formatDate(locale, { year: 'numeric', month: 'long' }, +m[1], +m[2])
  if ((m = core.match(new RegExp(`^(\\d{1,2}) (${MONTH_RE}) (\\d{3,4})$`))))
    return formatDate(locale, { dateStyle: 'long' }, +m[3], MONTHS.indexOf(m[2]) + 1, +m[1])
  if ((m = core.match(new RegExp(`^(${MONTH_RE}) (\\d{3,4})$`))))
    return formatDate(locale, { year: 'numeric', month: 'long' }, +m[2], MONTHS.indexOf(m[1]) + 1)
  if ((m = core.match(new RegExp(`^(\\d{1,2}) (${MONTH_RE})$`))))
    return formatDate(locale, { day: 'numeric', month: 'long' }, 2000, MONTHS.indexOf(m[2]) + 1, +m[1])
  if ((m = core.match(new RegExp(`^(${MONTH_RE})$`)))) return monthName(locale, MONTHS.indexOf(m[1]) + 1)
  if ((m = core.match(/^\d{1,2}$/))) return core
  if ((m = core.match(/^(\d+)(?:-(\d+))?$/))) return fill(pack.year, { y: m[2] ? `${m[1]}–${m[2]}` : m[1] })
  if ((m = core.match(/^(\d{3,4})s(?:-(\d{3,4})s)?$/)))
    return m[2] ? `${fill(pack.decade, { n: m[1] })}–${fill(pack.decade, { n: m[2] })}` : fill(pack.decade, { n: m[1] })
  if ((m = core.match(/^(\d{4})-(\d{4})s$/))) return `${fill(pack.year, { y: m[1] })}–${fill(pack.decade, { n: m[2] })}`
  if ((m = core.match(/^(\d+)(?:st|nd|rd|th)(?:-(\d+)(?:st|nd|rd|th))? century$/))) {
    const a = pack.century(+m[1], roman(+m[1]))
    return m[2] ? `${a}–${pack.century(+m[2], roman(+m[2]))}` : a
  }
  return null
}

// A date or century option, e.g. "c. 500 BCE – 100 CE", "18th century CE",
// "12 – 14 June 1815", "1200-1450 CE". Ranges are split on " – " and each
// side keeps its own "c." and era.
function localizeDate(raw, pack, locale) {
  if (raw === 'Unknown century') return pack.unknownCentury
  let text = raw
  let suffix = ''
  if (text.endsWith(' (traditional date)')) {
    text = text.slice(0, -' (traditional date)'.length)
    suffix = ` ${pack.traditional}`
  }
  const sides = text.split(' – ')
  // "c. 960 – 1279 CE": the era at the end covers both sides.
  const sharedEra = sides.length > 1 && !/ (BCE|CE)$/.test(sides[0]) ? sides.at(-1).match(/ (BCE|CE)$/)?.[1] : null
  const out = []
  for (let i = 0; i < sides.length; i++) {
    const m = sides[i].match(/^(c\. )?(.+?)(?: (BCE|CE))?$/)
    if (!m) return null
    let core = localizeCore(m[2], pack, locale)
    if (core === null) return null
    const era = m[3] || (sharedEra && /^\d+$/.test(m[2]) ? sharedEra : null)
    // A shared era is written once, on the last side.
    if (era && (m[3] || i === sides.length - 1)) core = fill(pack.withEra, { x: core, era: pack.era[era.toLowerCase()] })
    if (m[1]) core = fill(pack.circa, { x: core })
    out.push(core)
  }
  return out.join(' – ') + suffix
}

/* ---------- options ---------- */

function localizeOption(kind, raw, pack, locale) {
  const text = String(raw)
  switch (kind) {
    case 'country':
      return localizeCountry(text, pack, locale)
    case 'continent':
      return text.split('/').every((p) => pack.continents[p]) ? text.split('/').map((p) => pack.continents[p]).join('/') : null
    case 'type':
      return pack.types[text] || null
    case 'date':
      return localizeDate(text, pack, locale)
    case 'degrees': {
      const m = text.match(/^~(-?\d+) deg$/)
      return m ? `≈ ${m[1]}°` : null
    }
    default:
      return null
  }
}

/**
 * The question and options as they should be shown in `language`.
 * Returns `{ question, options }`; anything without a translation comes back
 * in English.
 */
export function localizeQuestion(q, language, locale) {
  const pack = PACKS[language]
  if (!pack || !q) return q
  for (const [key, re, kind, names] of PATTERNS) {
    const m = q.question.match(re)
    if (!m) continue
    const vars = Object.fromEntries(names.map((n, i) => [n, m[i + 1]]))
    const options = q.options.map((o) => (kind && localizeOption(kind, o, pack, locale)) || o)
    return { ...q, question: fill(pack.q[key], vars), options }
  }
  return q
}

export { PACKS as QUIZ_PACKS, PATTERNS as QUIZ_PATTERNS }
