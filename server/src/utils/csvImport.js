import { eraFor, shuffled } from './placeBuilder.js'
import { parseEventDate } from './eventDate.js'

export const REQUIRED_CSV_COLUMNS = [
  'place_name',
  'country',
  'latitude',
  'longitude',
  'event_name',
  'event_type',
  'event_date',
  'description',
]

// Maps each event_type value from the CSV format to one of the six sidebar
// filter categories. Every event_type used in the original dataset is
// covered; an unrecognized one is reported as a per-row error rather than
// silently dropped or miscategorized.
const CATEGORY_MAP = {
  Battle: 'Battles',
  'War Event': 'Battles',
  'Colonial Violence': 'Battles',
  Conquest: 'Battles',
  'Conquest/Destruction': 'Battles',
  'Surrender/War End': 'Battles',
  'Terrorist Attack': 'Battles',
  'Political Assassination': 'Battles',

  'Kingdom Founding': 'Kingdoms',
  'Kingdom Flourishing': 'Kingdoms',
  'Empire Founding': 'Kingdoms',
  'Empire Collapse': 'Kingdoms',
  'Political Transfer': 'Kingdoms',
  'Political Imprisonment': 'Kingdoms',

  Exploration: 'Discoveries',
  'Migration/Exploration': 'Discoveries',

  Revolution: 'Revolution',
  'Revolution/Independence': 'Revolution',
  'Revolution/Political Event': 'Revolution',
  'Revolution/Protest': 'Revolution',
  Protest: 'Revolution',
  'Protest/Civil Disobedience': 'Revolution',
  'Protest/Civil Rights Event': 'Revolution',
  'Protest/Uprising': 'Revolution',

  'Architectural/Cultural': 'Monuments',
  'Cultural Flourishing': 'Monuments',
  'Religious Event': 'Monuments',
  'Religious/Military Event': 'Monuments',
  'Natural Disaster': 'Monuments',
  Disaster: 'Monuments',
  'Industrial Disaster': 'Monuments',
  'Legal/Institutional Founding': 'Monuments',
  'Legal/Political Event': 'Monuments',

  Treaty: 'Treaties',
  'Treaty/Diplomatic Conference': 'Treaties',
  'Treaty/Diplomatic Congress': 'Treaties',
  'Treaty/Founding Document': 'Treaties',
  'Diplomatic Conference': 'Treaties',
}

function fmtYear(y) {
  return y < 0 ? `${Math.abs(y)} BCE` : `${y} CE`
}

// Groups CSV rows into places (rows sharing an exact place_name become one
// place with a multi-entry timeline -- the same "same places can be
// combined" rule used when the dataset was first built), validates each
// row, and builds full place objects ready to store as 'added' overrides.
//
// Returns { places, skipped, errors }:
//  - places: successfully built place objects
//  - skipped: places whose name collides with something already in the
//    dataset (static or previously added)
//  - errors: per-row problems (bad date, unknown event_type, missing field)
export function buildPlacesFromCsvRows(rows, { existingIds, allCountries, slugify }) {
  const groups = new Map()
  const errors = []

  rows.forEach((row, idx) => {
    const csvLine = idx + 2 // header is line 1
    const name = (row.place_name || '').trim()
    const country = (row.country || '').trim()
    const lat = Number(row.latitude)
    const lng = Number(row.longitude)
    const eventType = (row.event_type || '').trim()
    const eventDateRaw = (row.event_date || '').trim()
    const description = (row.description || '').trim()
    const eventName = (row.event_name || '').trim() || eventType || 'Historical Event'

    if (!name) {
      errors.push({ row: csvLine, message: 'Missing place_name.' })
      return
    }
    if (!country) {
      errors.push({ row: csvLine, message: `Missing country for "${name}".` })
      return
    }
    if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
      errors.push({ row: csvLine, message: `Invalid latitude for "${name}".` })
      return
    }
    if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
      errors.push({ row: csvLine, message: `Invalid longitude for "${name}".` })
      return
    }
    if (!eventType) {
      errors.push({ row: csvLine, message: `Missing event_type for "${name}".` })
      return
    }
    const category = CATEGORY_MAP[eventType]
    if (!category) {
      errors.push({ row: csvLine, message: `Unrecognized event_type "${eventType}" for "${name}".` })
      return
    }
    if (!eventDateRaw) {
      errors.push({ row: csvLine, message: `Missing event_date for "${name}".` })
      return
    }
    let parsedDate
    try {
      parsedDate = parseEventDate(eventDateRaw)
    } catch {
      errors.push({ row: csvLine, message: `Could not parse event_date "${eventDateRaw}" for "${name}".` })
      return
    }
    if (!description) {
      errors.push({ row: csvLine, message: `Missing description for "${name}".` })
      return
    }

    if (!groups.has(name)) groups.set(name, { country, lat, lng, events: [] })
    groups.get(name).events.push({ eventName, eventType, category, description, ...parsedDate })
  })

  const places = []
  const skipped = []
  const usedIds = new Set(existingIds)
  const eventTypePool = Object.keys(CATEGORY_MAP)

  for (const [name, group] of groups) {
    const baseId = slugify(name) || 'place'
    if (usedIds.has(baseId)) {
      skipped.push({ name, reason: 'A place with this name already exists in the dataset.' })
      continue
    }
    usedIds.add(baseId)
    const id = baseId

    const sortedEvents = [...group.events].sort((a, b) => a.yearStart - b.yearStart)
    const overallStart = Math.min(...group.events.map((e) => e.yearStart))
    const overallEnd = Math.max(...group.events.map((e) => e.yearEnd))
    const dateLabel = overallStart === overallEnd ? fmtYear(overallStart) : `${fmtYear(overallStart)} \u2013 ${fmtYear(overallEnd)}`
    const era = eraFor(overallStart)
    const category = group.events[0].category
    const image = `https://picsum.photos/seed/${id}/900/600`
    const location = `${name}, ${group.country}`

    const overviewParts = [
      `${name}, in present-day ${group.country}, is tied to ${group.events.length} pivotal moment${group.events.length > 1 ? 's' : ''} in world history.`,
    ]
    for (const e of sortedEvents) overviewParts.push(`${e.eventName} (${e.dateLabel}): ${e.description}`)

    const otherCountries = shuffled([...new Set(allCountries)].filter((c) => c !== group.country)).slice(0, 3)
    const countryOptions = shuffled([group.country, ...otherCountries])

    const primaryEvent = group.events[0]
    const typeDistractors = shuffled(eventTypePool.filter((t) => t !== primaryEvent.eventType)).slice(0, 3)
    const typeOptions = shuffled([primaryEvent.eventType, ...typeDistractors])

    const quiz = [
      {
        question: `In which country is ${name} located?`,
        options: countryOptions,
        answerIndex: countryOptions.indexOf(group.country),
      },
      {
        question: `What type of historical event is \u201c${primaryEvent.eventName}\u201d classified as?`,
        options: typeOptions,
        answerIndex: typeOptions.indexOf(primaryEvent.eventType),
      },
    ]

    places.push({
      id,
      name,
      location,
      coords: { lat: group.lat, lng: group.lng },
      category,
      era,
      dateLabel,
      yearStart: overallStart,
      yearEnd: overallEnd,
      image,
      tags: [category, group.country],
      summary: sortedEvents[0].description,
      overview: overviewParts.join(' '),
      quickFacts: { Date: dateLabel, Location: location, Category: category, Era: era },
      keyFigures: [],
      timeline: sortedEvents.map((e) => ({ year: e.dateLabel, label: e.eventName, detail: e.description })),
      gallery: [{ image, caption: name }],
      quiz,
    })
  }

  return { places, skipped, errors }
}
