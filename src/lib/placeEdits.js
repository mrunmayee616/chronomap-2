// Mirrors server/src/utils/placeBuilder.js's applyEditToPlace exactly --
// merges an admin edit onto a full place object, keeping the derived fields
// (location, tags, quickFacts, gallery hero image) in sync. Kept in sync
// with the server version; if one changes, update the other.
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
