import { COUNTRIES } from '../data/countries.js'

// Small display helpers for the Explore map's hover card and info panel.

const CODE_BY_NAME = new Map(COUNTRIES.map((c) => [c.name.toLowerCase(), c.code]))

// Countries that appear in the place dataset but not in COUNTRIES (that list
// drives the registration form, so it isn't extended just for flags), plus
// dataset spellings that differ from it. "Israel/Palestine" deliberately has
// no entry: either flag alone would take a side, so it shows none.
const EXTRA_CODES = {
  tunisia: 'TN',
  mali: 'ML',
  zimbabwe: 'ZW',
  'bosnia and herzegovina': 'BA',
  guatemala: 'GT',
  'ukraine (crimea)': 'UA',
  tanzania: 'TZ',
  senegal: 'SN',
  libya: 'LY',
  sudan: 'SD',
  zambia: 'ZM',
  'democratic republic of the congo': 'CD',
  bolivia: 'BO',
  ecuador: 'EC',
  haiti: 'HT',
  'dominican republic': 'DO',
  bahamas: 'BS',
  'papua new guinea': 'PG',
  'solomon islands': 'SB',
  mongolia: 'MN',
  turkmenistan: 'TM',
}

// A place's location is "City, Country" -- the country is the last part.
export function placeCountry(place) {
  const name = place?.location?.includes(', ') ? place.location.split(', ').pop() : ''
  const key = name.toLowerCase()
  return { name, code: CODE_BY_NAME.get(key) || EXTRA_CODES[key] || null }
}

// 41.9028, 12.4964 -> "41.90° N, 12.50° E"
export function formatCoords(coords) {
  if (!coords) return ''
  const lat = `${Math.abs(coords.lat).toFixed(2)}° ${coords.lat >= 0 ? 'N' : 'S'}`
  const lng = `${Math.abs(coords.lng).toFixed(2)}° ${coords.lng >= 0 ? 'E' : 'W'}`
  return `${lat}, ${lng}`
}

// -3000 -> "3000 BCE", 2026 -> "2026 CE" (there is no year 0)
export function formatYearLabel(year) {
  const n = Math.round(year)
  return n < 0 ? `${-n} BCE` : `${Math.max(n, 1)} CE`
}

export function pluralize(count, word, plural = `${word}s`) {
  return `${count} ${count === 1 ? word : plural}`
}
