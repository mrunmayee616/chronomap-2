export const PLACE_CATEGORIES = ['Battles', 'Kingdoms', 'Discoveries', 'Revolution', 'Monuments', 'Treaties']

// A base64 data: URI (an uploaded image) is stored inline in the Mongo
// document -- there's no file storage in this project. Cap it well under
// Mongo's 16MB document limit so one huge image can't crowd out everything
// else in the document (or, for bulk imports, the whole batch).
const MAX_IMAGE_DATA_URI_LENGTH = 4_000_000 // ~3MB of image data, base64-inflated

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

// A image field is optional everywhere it appears (falls back to a
// placeholder), but if one is given it must be a plausible URL or an
// upload that isn't absurdly large.
export function validateImage(image) {
  if (image === undefined || image === null || image === '') return null
  const str = String(image)
  if (str.startsWith('data:image/')) {
    if (str.length > MAX_IMAGE_DATA_URI_LENGTH) return 'That image is too large. Please use one under 3MB.'
    return null
  }
  if (/^https?:\/\//.test(str)) return null
  return 'Enter an image URL, or upload a file.'
}

// Validates a raw admin "add place" form payload. Returns a map of field ->
// error message; an empty object means the payload is valid.
export function validatePlaceForm({ name, country, latitude, longitude, category, year, yearEra, summary, image }) {
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
  const imageError = validateImage(image)
  if (imageError) fieldErrors.image = imageError
  return fieldErrors
}

// Builds a full place object (matching the shape of the static dataset) from
// a validated admin form payload. `id` must already be resolved to a unique,
// unused slug by the caller (uniqueness depends on what's already stored).
export function buildPlace({ id, name, country, latitude, longitude, category, year, yearEra, summary, allCountries, image }) {
  const lat = Number(latitude)
  const lng = Number(longitude)
  const yearNum = Number(year)
  const yearValue = yearEra === 'BCE' ? -yearNum : yearNum
  const dateLabel = `${yearNum} ${yearEra}`
  const era = eraFor(yearValue)
  const finalImage = image && String(image).trim() ? String(image).trim() : `https://picsum.photos/seed/${id}/900/600`
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
    image: finalImage,
    tags: [category, country],
    summary,
    overview: summary,
    quickFacts: { Date: dateLabel, Location: location, Category: category, Era: era },
    keyFigures: [],
    timeline: [{ year: dateLabel, label: name, detail: summary }],
    gallery: [{ image: finalImage, caption: name }],
    quiz: [
      {
        question: `In which country is ${name} located?`,
        options: quizOptions,
        answerIndex: quizOptions.indexOf(country),
      },
    ],
  }
}

// Validates a partial "edit place" payload -- only the fields actually
// present are checked, since an edit can touch just one field at a time.
export function validatePlaceEdit({ name, category, image, summary }) {
  const fieldErrors = {}
  if (name !== undefined && !String(name).trim()) fieldErrors.name = 'Name cannot be empty.'
  if (category !== undefined && !PLACE_CATEGORIES.includes(category)) fieldErrors.category = 'Pick a valid category.'
  if (summary !== undefined && !String(summary).trim()) fieldErrors.summary = 'Description cannot be empty.'
  const imageError = validateImage(image)
  if (imageError) fieldErrors.image = imageError
  return fieldErrors
}

// Merges an edit onto a full place object, keeping the fields that are
// derived from name/category/image in sync (the location string, the tags
// list, the quick-facts panel, and the hero/gallery image).
export function applyEditToPlace(place, changes) {
  const next = { ...place }

  if (changes.name !== undefined && changes.name !== '') {
    const trimmedName = String(changes.name).trim()
    const country = place.location?.includes(', ') ? place.location.split(', ').pop() : ''
    next.tags = (place.tags || []).map((t) => (t === place.name ? trimmedName : t))
    next.name = trimmedName
    next.location = country ? `${trimmedName}, ${country}` : trimmedName
    next.quickFacts = { ...place.quickFacts, Location: next.location }
    if (place.gallery?.[0]?.caption === place.name) {
      next.gallery = [{ ...place.gallery[0], caption: trimmedName }, ...place.gallery.slice(1)]
    }
  }

  if (changes.category !== undefined && changes.category !== '') {
    next.tags = (next.tags || place.tags || []).map((t) => (t === place.category ? changes.category : t))
    next.category = changes.category
    next.quickFacts = { ...next.quickFacts, Category: changes.category }
  }

  if (changes.image !== undefined && changes.image !== '') {
    next.image = changes.image
    next.gallery = [{ image: changes.image, caption: next.name }, ...(place.gallery || []).slice(1)]
  }

  if (changes.summary !== undefined && changes.summary !== '') {
    next.summary = changes.summary
    next.overview = changes.summary
  }

  return next
}
