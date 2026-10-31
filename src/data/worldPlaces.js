import { WORLD_EVENTS } from './worldEvents.js'
import { COUNTRY_HINTS, CONTINENT_HINTS, TYPE_HINTS, CENTURY_HINTS } from './quizHints/templates.js'

// Builds full place objects from the raw rows in worldEvents.js, in exactly
// the shape of the entries in places.js (which appends these to PLACES), so
// the map, place page, quiz and admin dashboard treat them like any other.
//
// The quiz is generated from the data plus any hand-written questions, and
// is deterministic: options are shuffled with a generator seeded by the
// place id, so a quiz looks the same on every load and for every player.

// Event type -> sidebar category. Mirrors CATEGORY_MAP in
// server/src/utils/csvImport.js, which the admin CSV import uses.
export const TYPE_CATEGORY = {
  Battle: 'Battles',
  'War Event': 'Battles',
  'Colonial Violence': 'Battles',
  Conquest: 'Battles',
  'Conquest/Destruction': 'Battles',
  'Surrender/War End': 'Battles',
  'Kingdom Founding': 'Kingdoms',
  'Kingdom Flourishing': 'Kingdoms',
  'Empire Founding': 'Kingdoms',
  'Political Transfer': 'Kingdoms',
  Exploration: 'Discoveries',
  'Migration/Exploration': 'Discoveries',
  'Revolution/Independence': 'Revolution',
  'Revolution/Political Event': 'Revolution',
  'Protest/Uprising': 'Revolution',
  'Protest/Civil Rights Event': 'Revolution',
  'Architectural/Cultural': 'Monuments',
  'Cultural Flourishing': 'Monuments',
  'Religious Event': 'Monuments',
  'Natural Disaster': 'Monuments',
  'Legal/Institutional Founding': 'Monuments',
  'Legal/Political Event': 'Monuments',
  Treaty: 'Treaties',
  'Treaty/Diplomatic Conference': 'Treaties',
  'Treaty/Founding Document': 'Treaties',
}

const CONTINENTS = ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania']

// Same cut-offs as eraFor() in server/src/utils/placeBuilder.js.
function eraFor(year) {
  if (year < 500) return 'Ancient'
  if (year < 1400) return 'Medieval'
  if (year < 1700) return 'Renaissance'
  return 'Modern'
}

function fmtYear(y) {
  return y < 0 ? `${Math.abs(y)} BCE` : `${y} CE`
}

/* ---------- deterministic shuffling ---------- */

function seededRandom(seedText) {
  let h = 1779033703 ^ seedText.length
  for (let i = 0; i < seedText.length; i++) {
    h = Math.imul(h ^ seedText.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return () => {
    // mulberry32
    h = (h + 0x6d2b79f5) | 0
    let t = Math.imul(h ^ (h >>> 15), 1 | h)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shuffle(items, rand) {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()

// A question with the correct answer plus three distractors drawn from
// `pool` (skipping anything that matches the answer), in a shuffled order.
function question(text, answer, pool, rand) {
  const wrong = []
  for (const option of shuffle(pool, rand)) {
    if (wrong.length === 3) break
    if (norm(option) !== norm(answer) && !wrong.some((w) => norm(w) === norm(option))) wrong.push(option)
  }
  if (wrong.length < 3) return null
  const options = shuffle([answer, ...wrong], rand)
  return { question: text, options, answerIndex: options.indexOf(answer) }
}

/* ---------- century questions ---------- */

// Signed century index: 1 = 1st century CE, -1 = 1st century BCE (no 0).
function centuryIndex(year) {
  return year > 0 ? Math.ceil(year / 100) : -Math.ceil(-year / 100)
}

function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

function centuryLabel(index) {
  return `${ordinal(Math.abs(index))} century ${index > 0 ? 'CE' : 'BCE'}`
}

function nearbyCenturies(index) {
  const out = []
  for (const step of [-3, -2, -1, 1, 2, 3]) {
    let n = index + step
    if (index > 0 && n <= 0) n -= 1 // skip the missing "century 0"
    if (index < 0 && n >= 0) n += 1
    out.push(centuryLabel(n))
  }
  return out
}

/* ---------- quiz hints ---------- */

// Fun clues for the generated questions, built from the same data as the
// answer but never naming it (see src/data/quizHints/templates.js).
function withHint(q, hint) {
  if (q && hint) q.hint = hint
  return q
}

function whenInCentury(year) {
  const y = Math.abs(year) % 100
  if (y === 0 || y > 66) return 'late in that era'
  if (y > 33) return 'around the middle of that era'
  return 'early in that era'
}

function eventHint(e) {
  const type = TYPE_HINTS[e.type]
  const era = CENTURY_HINTS[centuryIndex(e.year)]
  return [type, era && `🕰️ Era clue: ${era}`].filter(Boolean).join(' ')
}

/* ---------- build ---------- */

function buildPlace(entry, ctx) {
  const rand = seededRandom(entry.id)
  const events = entry.events.map((e) => {
    const category = TYPE_CATEGORY[e.type]
    if (!category) throw new Error(`worldEvents.js: unknown event type "${e.type}" for ${entry.id}`)
    return { ...e, category, end: e.end ?? e.year }
  })
  const primary = events[0]
  const sorted = [...events].sort((a, b) => a.year - b.year)
  const yearStart = Math.min(...events.map((e) => e.year))
  const yearEnd = Math.max(...events.map((e) => e.end))
  const dateLabel = events.length === 1 ? primary.date : `${fmtYear(yearStart)} – ${fmtYear(yearEnd)}`
  const era = eraFor(yearStart)
  const location = `${entry.name}, ${entry.country}`
  const image = `https://picsum.photos/seed/${entry.id}/900/600`

  // Distractor pools, always excluding this place's own events.
  const otherEvents = ctx.allEvents.filter((e) => e.placeId !== entry.id)
  const sameContinent = ctx.countries.filter((c) => c.continent === entry.continent && c.name !== entry.country)
  const countryPool = sameContinent.length >= 3 ? sameContinent : ctx.countries.filter((c) => c.name !== entry.country)
  const typePool = Object.keys(TYPE_CATEGORY).filter((t) => TYPE_CATEGORY[t] !== primary.category)
  const datePool = otherEvents.filter((e) => Math.abs(e.year - primary.year) >= 30).map((e) => e.date)

  const primaryEra = CENTURY_HINTS[centuryIndex(primary.year)]

  const quiz = [
    withHint(
      question(`In which country is ${entry.name} located?`, entry.country, countryPool.map((c) => c.name), rand),
      COUNTRY_HINTS[entry.country]
    ),
    ...(entry.questions || []).map((q) => {
      const options = shuffle([q.a, ...q.wrong], rand)
      return { question: q.q, options, answerIndex: options.indexOf(q.a) }
    }),
    withHint(
      question(`On which continent is ${entry.name}?`, entry.continent, CONTINENTS, rand),
      CONTINENT_HINTS[entry.continent]
    ),
    withHint(
      question(`When did “${primary.name}” take place?`, primary.date, datePool, rand),
      primaryEra && `🕰️ ${primaryEra} It happened ${whenInCentury(primary.year)}.`
    ),
    withHint(
      question(
        `In which century did “${primary.name}” ${primary.end !== primary.year ? 'begin' : 'take place'}?`,
        centuryLabel(centuryIndex(primary.year)),
        nearbyCenturies(centuryIndex(primary.year)),
        rand
      ),
      primaryEra && `🕰️ ${primaryEra}`
    ),
    withHint(
      question(`What type of historical event was “${primary.name}”?`, primary.type, typePool, rand),
      TYPE_HINTS[primary.type]
    ),
    withHint(
      question(`Which historical event is most associated with ${entry.name}?`, primary.name, otherEvents.map((e) => e.name), rand),
      eventHint(primary)
    ),
    ...events.slice(1).map((e) =>
      withHint(
        question(
          `Besides “${primary.name}”, which other event is recorded at ${entry.name}?`,
          e.name,
          otherEvents.map((o) => o.name),
          rand
        ),
        eventHint(e)
      )
    ),
  ].filter(Boolean)

  const overview = [
    `${entry.name}, in present-day ${entry.country}, is tied to ${events.length} pivotal moment${events.length > 1 ? 's' : ''} in world history.`,
    ...sorted.map((e) => `${e.name} (${e.date}): ${e.text}`),
  ].join(' ')

  return {
    id: entry.id,
    name: entry.name,
    location,
    coords: { lat: entry.lat, lng: entry.lng },
    category: primary.category,
    era,
    dateLabel,
    yearStart,
    yearEnd,
    image,
    tags: [primary.category, entry.country],
    summary: primary.text,
    overview,
    quickFacts: { Date: dateLabel, Location: location, Category: primary.category, Era: era },
    keyFigures: [],
    timeline: sorted.map((e) => ({ year: e.date, label: e.name, detail: e.text })),
    gallery: [{ image, caption: entry.name }],
    quiz,
  }
}

function buildWorldPlaces(entries) {
  const seen = new Set()
  for (const e of entries) {
    if (seen.has(e.id)) throw new Error(`worldEvents.js: duplicate id "${e.id}"`)
    seen.add(e.id)
  }
  const countries = [...new Map(entries.map((e) => [e.country, { name: e.country, continent: e.continent }])).values()]
  const allEvents = entries.flatMap((p) => p.events.map((e) => ({ ...e, placeId: p.id })))
  return entries.map((entry) => buildPlace(entry, { countries, allEvents }))
}

export const WORLD_PLACES = buildWorldPlaces(WORLD_EVENTS)
