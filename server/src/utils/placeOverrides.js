import PlaceOverride from '../models/PlaceOverride.js'
import { PLACE_COUNTRIES } from '../data/places.js'

// Merges the static id -> country lookup with whatever the admin dashboard
// has changed, so a newly-added place can be visited/counted immediately,
// and a removed one stops counting without needing a deploy.
export async function getEffectivePlaceCountries() {
  const overrides = await PlaceOverride.find().lean()
  const removedIds = new Set(overrides.filter((o) => o.action === 'removed').map((o) => o.placeId))
  const added = overrides.filter((o) => o.action === 'added' && o.data)

  const countries = {}
  for (const [id, country] of Object.entries(PLACE_COUNTRIES)) {
    if (!removedIds.has(id)) countries[id] = country
  }
  for (const o of added) {
    const country = o.data.location?.split(', ').pop() || o.data.country
    if (country) countries[o.data.id] = country
  }
  return countries
}

export function groupByCountry(countryMap) {
  return Object.entries(countryMap).reduce((acc, [id, country]) => {
    if (!acc[country]) acc[country] = []
    acc[country].push(id)
    return acc
  }, {})
}
