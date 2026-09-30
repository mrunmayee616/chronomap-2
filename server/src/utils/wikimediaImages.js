// Pulls real photos from Wikipedia for a place, instead of the seeded
// picsum.photos placeholders the dataset originally shipped with.
//
// Used two ways:
//   1. server/scripts/sync-place-images.mjs -- a one-time batch run that
//      fills in real photos (hero + a varied gallery) for the ~74 built-in
//      places in src/data/places.js.
//   2. Admin "Add place" / CSV import (server/src/routes/admin.routes.js,
//      server/src/utils/csvImport.js) -- a live, best-effort lookup by name
//      when the admin doesn't supply their own image, so newly added
//      places get a real photo too instead of a generic placeholder.
//
// Only the public MediaWiki API is used (no API key). Every call sets a
// descriptive User-Agent, per Wikimedia's etiquette guidelines:
// https://meta.wikimedia.org/wiki/User-Agent_policy

const API = 'https://en.wikipedia.org/w/api.php'
const USER_AGENT = 'ChronoMap/1.0 (https://github.com/; educational history app)'
const FETCH_TIMEOUT_MS = 10_000

// Wikipedia's thumbnail renderer only serves a fixed set of widths (see
// https://www.mediawiki.org/wiki/Common_thumbnail_sizes) -- anything else
// gets rounded up. Asking for one of these directly avoids that rounding.
const HERO_WIDTH = 1280
const GALLERY_WIDTH = 960

// Filenames that are almost never a usable "photo of the place": wiki chrome,
// flags/coats of arms/locator maps (accurate but not a photo of the place
// itself), and generic icons. Matched case-insensitively against the file
// title. Not exhaustive by design -- the size/aspect-ratio filters below
// catch most other icon-shaped junk that slips past this list.
const SKIP_FILENAME_PATTERNS = [
  /commons-logo/, /wiki(pedia|source|quote|news|data|voyage)?[-_]?logo/,
  /edit[-_]?icon/, /icons8/, /question_book/, /ambox/, /crystal_?clear/,
  /nuvola/, /folder/, /padlock/, /semi-protection/, /protection[-_]shield/,
  /red_pog/, /blue_pog/, /pin_?icon/, /^marker/, /loudspeaker/, /speaker_?icon/,
  /sound[-_]?icon/, /stub_?icon/, /information_?icon/, /disambig/,
  /flag_of/, /^flag[-_]/, /coat_of_arms/, /^coa_/, /blazon/, /emblem_of/,
  /seal_of/, /logo_of/, /locator_map/, /location_map/, /^locator/,
  /blank_map/, /_map\.(svg|png)$/i, /world_map/, /wiktionary/,
  /commons[-_]?category/, /^symbol[-_]/, /_icon\.svg$/i,
]

function isUsablePhoto({ title, width, height, mime }) {
  if (!title || !width || !height) return false
  if (!/^image\/(jpeg|png|webp)$/i.test(mime || '')) return false // no svg/gif/tiff
  if (width < 500 || height < 350) return false // too small to be a real photo
  const ratio = width / height
  if (ratio > 3.2 || ratio < 0.3) return false // banner strips / icon rows
  const lower = title.toLowerCase()
  return !SKIP_FILENAME_PATTERNS.some((re) => re.test(lower))
}

// "File:Roman_Colosseum_at_dusk.jpg" -> "Roman Colosseum at dusk"
function captionFromFilename(title) {
  return title
    .replace(/^File:/i, '')
    .replace(/\.(jpe?g|png|webp)$/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

async function callApi(params) {
  const url = `${API}?${new URLSearchParams({ format: 'json', origin: '*', ...params }).toString()}`
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  })
  if (!res.ok) throw new Error(`Wikipedia API ${res.status} for ${params.titles}`)
  return res.json()
}

// The article's own infobox picture -- almost always the best single "hero"
// shot for a place, and picked by Wikipedia's own PageImages extension
// rather than by us guessing from a list.
async function fetchLeadImage(title) {
  const data = await callApi({
    action: 'query',
    prop: 'pageimages',
    piprop: 'thumbnail|name',
    pithumbsize: String(HERO_WIDTH),
    redirects: '1',
    titles: title,
  })
  const page = Object.values(data?.query?.pages || {})[0]
  if (!page || page.missing !== undefined || !page.thumbnail?.source || !page.pageimage) return null
  return { fileTitle: `File:${page.pageimage}`, url: page.thumbnail.source }
}

// Every photo used on the article, so the gallery shows several different
// views instead of one image repeated. Filtered down to real photos, with a
// bounded-width thumbnail URL so a gallery of 10MP originals doesn't bloat
// the page.
async function fetchArticleImagePool(title) {
  const data = await callApi({
    action: 'query',
    generator: 'images',
    titles: title,
    gimlimit: '40',
    prop: 'imageinfo',
    iiprop: 'url|size|mime',
    iiurlwidth: String(GALLERY_WIDTH),
    redirects: '1',
  })
  const pages = Object.values(data?.query?.pages || {})
  const pool = []
  for (const page of pages) {
    const info = page.imageinfo?.[0]
    if (!info) continue
    if (!isUsablePhoto({ title: page.title, width: info.width, height: info.height, mime: info.mime })) continue
    pool.push({ fileTitle: page.title, url: info.thumburl || info.url, caption: captionFromFilename(page.title) })
  }
  return pool
}

/**
 * Look up real photos for one topic (a Wikipedia article title, e.g. from
 * PLACE_IMAGE_TOPICS), and return a ready-to-use hero image plus a varied
 * gallery pulled from the topic article and a few related ones.
 *
 * @param {{ title: string, extra?: string[] }} topic
 * @param {string} placeName - used as the hero photo's caption
 * @param {number} galleryTarget - how many gallery photos to try to collect
 * @returns {Promise<{ image: string|null, gallery: Array<{image:string,caption:string}>, warning: string|null }>}
 */
export async function fetchPlaceImageSet(topic, placeName, galleryTarget = 6) {
  const titles = [topic.title, ...(topic.extra || [])]
  const seenFiles = new Set()
  const gallery = []
  let hero = null

  // 1. Hero shot from the main topic's own infobox image.
  try {
    const lead = await fetchLeadImage(topic.title)
    if (lead) {
      hero = lead.url
      seenFiles.add(lead.fileTitle)
      gallery.push({ image: lead.url, caption: placeName })
    }
  } catch {
    // Fall through -- a missing hero is recovered from the image pool below.
  }

  // 2. Fill out the gallery from the main topic first, then the related
  //    ("extra") articles, round-robin, so variety doesn't come entirely
  //    from one article.
  const pools = []
  for (const t of titles) {
    try {
      pools.push(await fetchArticleImagePool(t))
    } catch {
      pools.push([]) // that one article's photos are skipped, not fatal
    }
  }
  let round = 0
  while (gallery.length < galleryTarget && pools.some((p) => round < p.length)) {
    for (const pool of pools) {
      if (gallery.length >= galleryTarget) break
      const candidate = pool[round]
      if (!candidate || seenFiles.has(candidate.fileTitle)) continue
      seenFiles.add(candidate.fileTitle)
      gallery.push({ image: candidate.url, caption: candidate.caption })
    }
    round += 1
  }

  if (!hero && gallery.length) hero = gallery[0].image
  if (!hero) return { image: null, gallery: [], warning: `No usable image found for "${topic.title}".` }
  if (gallery.length < 2) return { image: hero, gallery, warning: `Only ${gallery.length} photo(s) found for "${topic.title}" -- gallery has little variety.` }
  return { image: hero, gallery, warning: null }
}

/**
 * Best-effort lookup by a place's own name, for admin-added places that
 * have no curated topic entry. More likely to miss (a made-up or very
 * obscure place name may not have a matching article) -- callers should
 * fall back to a placeholder image when this returns null.
 */
export async function fetchPlaceImageSetByName(placeName, galleryTarget = 4) {
  try {
    return await fetchPlaceImageSet({ title: placeName, extra: [] }, placeName, galleryTarget)
  } catch {
    return { image: null, gallery: [], warning: `Lookup failed for "${placeName}".` }
  }
}

// Exported for tests.
export const _internal = { isUsablePhoto, captionFromFilename, SKIP_FILENAME_PATTERNS }
