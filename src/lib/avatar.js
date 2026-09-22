// Generates a consistent cartoon avatar for a given user, so the same user
// always sees the same avatar in the navbar and on their profile page.
// DiceBear's "avataaars" style is a free, keyless SVG API - no account needed.
//
// The avatar is shaped by two independent things:
//   1. `seed` (the username) - guarantees every user gets a distinct-looking
//      avatar (hair style, skin tone, clothes, etc. all vary by seed).
//   2. `gender` - restricts which hairstyles/facial hair DiceBear is allowed
//      to pick from, so male and female avatars read as visually distinct.
//
// Hairstyle pools below are taken from DiceBear's avataaars "top" option
// (https://api.dicebear.com/7.x/avataaars/svg) - see
// https://www.dicebear.com/styles/avataaars for the full option list.
const FEMALE_TOP = [
  'bigHair',
  'bob',
  'bun',
  'curly',
  'curvy',
  'frida',
  'fro',
  'froBand',
  'longButNotTooLong',
  'miaWallace',
  'straight01',
  'straight02',
  'straightAndStrand',
]

const MALE_TOP = [
  'shortFlat',
  'shortRound',
  'shortWaved',
  'shortCurly',
  'shaggy',
  'shaggyMullet',
  'sides',
  'theCaesar',
  'theCaesarAndSidePart',
  'shavedSides',
  'dreads01',
  'dreads02',
  'frizzle',
]

// Simple deterministic string hash so the same seed always resolves to the
// same fallback gender when the user hasn't set one - avatars stay stable
// across page loads instead of flickering between styles.
function hashSeed(seed) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function resolveGender(seed, gender) {
  if (gender === 'male' || gender === 'female') return gender
  // No gender on file (or an "unspecified" choice) - assign one
  // deterministically from the seed so the look stays consistent.
  return hashSeed(seed) % 2 === 0 ? 'male' : 'female'
}

export function avatarUrlFor(seed, gender) {
  const safeSeed = seed || 'chronomap'
  const resolvedGender = resolveGender(safeSeed, gender)
  const topPool = resolvedGender === 'female' ? FEMALE_TOP : MALE_TOP
  const facialHairProbability = resolvedGender === 'female' ? 0 : 30

  const params = new URLSearchParams({
    seed: safeSeed,
    backgroundType: 'solid',
    backgroundColor: '1a1a2e',
    facialHairProbability: String(facialHairProbability),
  })
  topPool.forEach((style) => params.append('top[]', style))

  return `https://api.dicebear.com/7.x/avataaars/svg?${params.toString()}`
}
