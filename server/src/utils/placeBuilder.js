export const PLACE_CATEGORIES = ['Battles', 'Kingdoms', 'Discoveries', 'Revolution', 'Monuments', 'Treaties']

export function slugify(name) {
  return name
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function eraFor(yearStart) {
  if (yearStart < 500) return 'Ancient'
  if (yearStart < 1400) return 'Medieval'
  if (yearStart < 1700) return 'Renaissance'
  return 'Modern'
}

export function shuffled(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Validates a raw admin "add place" form payload. Returns a map of field ->
// error message; an empty object means the payload is valid.
export function validatePlaceForm({ name, country, latitude, longitude, category, year, yearEra, summary }) {
  const fieldErrors = {}
  if (!name || !String(name).trim()) fieldErrors.name = 'Name is required.'
  if (!country || !String(country).trim()) fieldErrors.country = 'Country is required.'
  const lat = Number(latitude)
  const lng = Number(longitude)
  if (!Number.isFinite(lat) || lat < -90 || lat > 90) fieldErrors.latitude = 'Enter a latitude between -90 and 90.'
  if (!Number.isFinite(lng) || lng < -180 || lng > 180) fieldErrors.longitude = 'Enter a longitude between -180 and 180.'
  if (!PLACE_CATEGORIES.includes(category)) fieldErrors.category = 'Pick a valid category.'
  const yearNum = Number(year)
  if (!Number.isFinite(yearNum) || yearNum < 0) fieldErrors.year = 'Enter a positive year.'
  if (yearEra !== 'BCE' && yearEra !== 'CE') fieldErrors.yearEra = 'Pick BCE or CE.'
  if (!summary || !String(summary).trim()) fieldErrors.summary = 'A short description is required.'
  return fieldErrors
}

// Builds a full place object (matching the shape of the static dataset) from
// a validated admin form payload. `id` must already be resolved to a unique,
// unused slug by the caller (uniqueness depends on what's already stored).
export function buildPlace({ id, name, country, latitude, longitude, category, year, yearEra, summary, allCountries }) {
  const lat = Number(latitude)
  const lng = Number(longitude)
  const yearNum = Number(year)
  const yearValue = yearEra === 'BCE' ? -yearNum : yearNum
  const dateLabel = `${yearNum} ${yearEra}`
  const era = eraFor(yearValue)
  const image = `https://picsum.photos/seed/${id}/900/600`
  const location = `${name}, ${country}`

  const otherCountries = [...new Set(allCountries)].filter((c) => c !== country)
  const distractorCountries = shuffled(otherCountries).slice(0, 3)
  const quizOptions = shuffled([country, ...distractorCountries])

  return {
    id,
    name,
    location,
    coords: { lat, lng },
    category,
    era,
    dateLabel,
    yearStart: yearValue,
    yearEnd: yearValue,
    image,
    tags: [category, country],
    summary,
    overview: summary,
    quickFacts: { Date: dateLabel, Location: location, Category: category, Era: era },
    keyFigures: [],
    timeline: [{ year: dateLabel, label: name, detail: summary }],
    gallery: [{ image, caption: name }],
    quiz: [
      {
        question: `In which country is ${name} located?`,
        options: quizOptions,
        answerIndex: quizOptions.indexOf(country),
      },
    ],
  }
}
