// Content for the quiz results "discovery bubbles": bite-sized extra facts
// about the place just quizzed, and a suggestion for a similar place to
// visit next. Built only from the place data the app already has.

const MAX_TEXT = 280

// Whole sentences, up to about `max` characters, so cards never end mid-word.
function excerpt(text, max = MAX_TEXT) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const sentences = clean.match(/[^.!?]+[.!?]+(\s|$)/g) || [clean]
  let out = ''
  for (const s of sentences) {
    if ((out + s).length > max) break
    out += s
  }
  return (out || clean.slice(0, max).replace(/\s+\S*$/, '') + '…').trim()
}

// Some timelines store ISO dates ("1945-08-06"); show them as "6 Aug 1945".
function readableDate(value) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ''))
  if (!m) return value
  return new Date(+m[1], +m[2] - 1, +m[3]).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Up to five fact cards for a place:
 *   📜 its story · 👑 up to two key figures · 🗓️ up to two timeline moments
 *   · 🏛️ quick facts (only if there's room)
 * Each: { id, emoji, label, title, text }
 */
export function buildDiscoveries(place) {
  const cards = []
  const story = place.overview || place.summary
  if (story) {
    cards.push({ id: 'story', emoji: '📜', label: 'story', title: place.name, text: excerpt(story) })
  }

  for (const f of (place.keyFigures || []).slice(0, 2)) {
    if (!f?.name) continue
    cards.push({
      id: `figure-${f.id || f.name}`,
      emoji: '👑',
      label: 'figure',
      title: f.role ? `${f.name} · ${f.role}` : f.name,
      text: excerpt(f.bio || f.role || ''),
      short: f.name,
    })
  }

  // Skip the first timeline entry when it just repeats the story.
  const moments = (place.timeline || []).filter((e) => e?.detail || e?.label)
  for (const e of moments.slice(moments.length > 2 ? 1 : 0).slice(0, 2)) {
    const when = readableDate(e.year)
    cards.push({
      id: `moment-${e.year}-${e.label}`,
      emoji: '🗓️',
      label: 'moment',
      title: [when, e.label].filter(Boolean).join(' · '),
      text: excerpt(e.detail || e.label),
      short: when,
    })
  }

  if (cards.length < 5) {
    const facts = [place.category, place.era && `${place.era} era`, place.dateLabel, place.location].filter(Boolean)
    if (facts.length) {
      cards.push({ id: 'facts', emoji: '🏛️', label: 'facts', title: place.name, text: facts.join(' · ') })
    }
  }
  return cards.slice(0, 5)
}

/* ---------- similar place ---------- */

function distanceKm(a, b) {
  if (!a || !b) return Infinity
  const rad = (d) => (d * Math.PI) / 180
  const dLat = rad(b.lat - a.lat)
  const dLng = rad(b.lng - a.lng)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 6371 * 2 * Math.asin(Math.sqrt(h))
}

const countryOf = (p) => String(p.location || '').split(', ').pop()

/**
 * The most similar other place, with the reasons it was picked:
 * same category, same era, shared tags, same country and nearness on the
 * map all add up; places the player hasn't visited yet get a small boost.
 * Returns { place, reasons: [{ key, value }], km } or null.
 */
export function suggestNextPlace(current, places, visitedIds = []) {
  const visited = new Set(visitedIds)
  const tags = new Set((current.tags || []).map((t) => t.toLowerCase()))
  let best = null

  for (const p of places) {
    if (!p || p.id === current.id || !p.quiz?.length) continue
    let score = 0
    const reasons = []
    if (p.category && p.category === current.category) {
      score += 3
      reasons.push({ key: 'category', value: p.category })
    }
    if (p.era && p.era === current.era) {
      score += 2
      reasons.push({ key: 'era', value: p.era })
    }
    const shared = (p.tags || []).filter((t) => tags.has(t.toLowerCase()) && t !== p.category)
    if (shared.length) {
      score += shared.length
      reasons.push({ key: 'tag', value: shared[0] })
    }
    if (countryOf(p) && countryOf(p) === countryOf(current)) {
      score += 2
      reasons.push({ key: 'country', value: countryOf(p) })
    }
    const km = distanceKm(current.coords, p.coords)
    if (km < 3000) score += 2 * (1 - km / 3000)
    if (!visited.has(p.id)) score += 0.5

    if (!best || score > best.score) best = { place: p, reasons, km, score }
  }
  if (!best) return null
  if (best.km < 1500 && !best.reasons.some((r) => r.key === 'country')) {
    best.reasons.push({ key: 'near', value: Math.round(best.km) })
  }
  return { place: best.place, reasons: best.reasons, km: best.km }
}
