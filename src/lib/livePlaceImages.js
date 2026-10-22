// Looks up the real Wikipedia photo of each place straight from the browser
// (the MediaWiki API allows cross-origin requests), so correct images show up
// even when the Node server / MongoDB sync has not been run. Results are
// cached in localStorage so each place is only looked up once.
import { PLACE_IMAGE_TOPICS } from '../data/placeImageTopics.js'
import { fetchPlaceImageSet } from './wikimediaImages.js'

const CACHE_KEY = 'chronomap.placeImages.v1'
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000

function readCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}')
  } catch {
    return {}
  }
}
function writeCache(cache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  } catch {
    /* storage full or blocked -- fine */
  }
}

export function getCachedPlaceImages() {
  const cache = readCache()
  const out = {}
  for (const [id, v] of Object.entries(cache)) {
    if (PLACE_IMAGE_TOPICS[id]?.title === v.topic && Date.now() - v.at < MAX_AGE_MS) out[id] = { image: v.image, gallery: v.gallery }
  }
  return out
}

/** Fetches missing places (4 at a time) and calls onUpdate(id, set) as each arrives. */
export async function loadLivePlaceImages(placeNames, skipIds, onUpdate, signal) {
  const cache = readCache()
  const todo = Object.keys(PLACE_IMAGE_TOPICS).filter((id) => {
    if (skipIds.has(id)) return false
    const c = cache[id]
    return !(c && c.topic === PLACE_IMAGE_TOPICS[id].title && Date.now() - c.at < MAX_AGE_MS)
  })
  let next = 0
  async function worker() {
    while (next < todo.length && !signal?.aborted) {
      const id = todo[next++]
      const topic = PLACE_IMAGE_TOPICS[id]
      try {
        const set = await fetchPlaceImageSet(topic, placeNames[id] || topic.title, 6)
        if (set.image) {
          cache[id] = { topic: topic.title, image: set.image, gallery: set.gallery, at: Date.now() }
          writeCache(cache)
          onUpdate(id, { image: set.image, gallery: set.gallery })
        }
      } catch {
        /* offline or blocked: keep the labelled placeholder */
      }
    }
  }
  await Promise.all([worker(), worker(), worker(), worker()])
}
