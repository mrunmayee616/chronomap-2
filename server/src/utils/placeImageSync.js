import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import PlaceImage from '../models/PlaceImage.js'
import { PLACE_IMAGE_TOPICS } from '../data/placeImageTopics.js'
import { fetchPlaceImageSet } from './wikimediaImages.js'

// Looks up a real Wikipedia photo set for every built-in place that doesn't
// have one stored yet, and saves it to MongoDB. Runs in the background when
// the server starts (see server.js), so nobody has to remember to run a
// script: the first start fills the cache, later starts only fill gaps.
//
// Each place uses the lead image of its own Wikipedia article (picked by
// Wikipedia itself), so a place always shows the picture that article is
// about -- never a random stock photo.

const STALE_MS = 90 * 24 * 60 * 60 * 1000 // re-check each place about quarterly
const DELAY_MS = 250 // be polite to Wikimedia's servers
const GALLERY_SIZE = 6
const MAX_CONSECUTIVE_FAILURES = 5 // looks like no internet: stop and retry next start

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
let running = false

// Display names (for the hero caption) are read from the client's places
// file without importing it -- it pulls in .jpg files that plain Node can't
// load. Falls back to the article title if the file isn't there (e.g. the
// API is deployed on its own).
async function readPlaceNames() {
  const names = new Map()
  try {
    const file = fileURLToPath(new URL('../../../src/data/places.js', import.meta.url))
    const text = await fs.readFile(file, 'utf8')
    const re = /^ {4}id: +(['"])((?:(?!\1).)+)\1,\s*\n {4}name: +(['"])((?:(?!\3).)+)\3/gm
    let m
    while ((m = re.exec(text))) names.set(m[2], m[4])
  } catch {
    // fine -- article titles are used instead
  }
  return names
}

export function isSyncRunning() {
  return running
}

/**
 * @param {{ force?: boolean, log?: (msg: string) => void }} [opts]
 *   force: look every place up again, even ones already stored.
 */
export async function syncPlaceImages({ force = false, log = console.log } = {}) {
  if (running) return { started: false, reason: 'already running' }
  running = true
  const summary = { started: true, checked: 0, updated: 0, failed: 0, aborted: false }
  try {
    const existing = await PlaceImage.find().select('placeId topicTitle fetchedAt').lean()
    const byId = new Map(existing.map((e) => [e.placeId, e]))
    const names = await readPlaceNames()

    const todo = Object.keys(PLACE_IMAGE_TOPICS).filter((id) => {
      const have = byId.get(id)
      if (force || !have) return true
      if (have.topicTitle !== PLACE_IMAGE_TOPICS[id].title) return true
      return Date.now() - new Date(have.fetchedAt).getTime() > STALE_MS
    })
    if (todo.length === 0) return summary

    log(`Place images: looking up ${todo.length} place(s) on Wikipedia in the background...`)
    let consecutiveFailures = 0

    for (const id of todo) {
      const topic = PLACE_IMAGE_TOPICS[id]
      summary.checked += 1
      let set
      try {
        set = await fetchPlaceImageSet(topic, names.get(id) || topic.title, GALLERY_SIZE)
      } catch {
        set = { image: null, gallery: [] }
      }

      if (set.image) {
        consecutiveFailures = 0
        await PlaceImage.findOneAndUpdate(
          { placeId: id },
          { placeId: id, topicTitle: topic.title, image: set.image, gallery: set.gallery, fetchedAt: new Date() },
          { upsert: true }
        )
        summary.updated += 1
      } else {
        summary.failed += 1
        consecutiveFailures += 1
        if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
          summary.aborted = true
          log('Place images: Wikipedia is not reachable from this server -- will retry on the next start.')
          break
        }
      }
      await sleep(DELAY_MS)
    }
    log(`Place images: ${summary.updated} updated, ${summary.failed} not found.`)
    return summary
  } finally {
    running = false
  }
}
