import { ORIGINAL_EVENT_DETAILS_1 } from './original1.js'
import { ORIGINAL_EVENT_DETAILS_2 } from './original2.js'
import { WORLD_AFRICA_EVENT_DETAILS } from './worldAfrica.js'
import { WORLD_AMERICAS_EVENT_DETAILS } from './worldAmericas.js'
import { WORLD_ASIA_OCEANIA_EVENT_DETAILS } from './worldAsiaOceania.js'

// Paragraph-length explanations for every timeline event, keyed by place id
// and then by the event's exact label. Each place keeps its short one-line
// summary (shown under its title and in map hover cards); these paragraphs
// replace the one-line `detail` of each timeline event, which is what the
// Timeline tab and the map's info panel show.
//
// Kept apart from places.js / worldEvents.js so the text can be edited
// without touching the big generated dataset. When you add a place or an
// event, add its paragraph to the file for its region here too.
export const EVENT_DETAILS = {
  ...ORIGINAL_EVENT_DETAILS_1,
  ...ORIGINAL_EVENT_DETAILS_2,
  ...WORLD_AFRICA_EVENT_DETAILS,
  ...WORLD_AMERICAS_EVENT_DETAILS,
  ...WORLD_ASIA_OCEANIA_EVENT_DETAILS,
}

export function withEventDetails(places) {
  return places.map((place) => {
    const details = EVENT_DETAILS[place.id]
    if (!details) return place
    return {
      ...place,
      timeline: place.timeline.map((event) => ({ ...event, detail: details[event.label] || event.detail })),
    }
  })
}
