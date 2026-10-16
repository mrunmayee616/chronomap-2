<<<<<<< HEAD
// A generic, consistent avatar for a given user: a solid-colour circle with
// their initials, in the style of Slack/GitHub's default avatars. The same
// user always gets the same colour and initials - there's no per-user
// cartoon face, just one clean look drawn from a small, fixed palette that
// matches the app's dark/gold theme.
=======
// Avatars. By default a user gets a generic one: a solid-colour circle with
// their initials, in the style of Slack/GitHub's default avatars -- the same
// user always gets the same colour and initials. Users can also pick one of
// the preset avatars below (a coloured circle with a history-themed glyph);
// the chosen preset id is stored on their account (`user.avatar`).
>>>>>>> 3450fa5 (feat: Fixes for admin user and loading accurate images for locations)
//
// Rendered as an inline SVG data URI, so there's no network request and
// nothing that can fail to load: `avatarUrlFor(...)` can be dropped
// straight into an <img src>.

// A small, fixed set of "generic" colours - muted jewel tones that sit well
// on the app's dark navy background, rather than a full rainbow of options.
const PALETTE = [
  '#5B7FDE', // slate blue
  '#3FA79B', // teal
  '#D9A441', // amber (echoes the site's gold accent)
  '#C15B5B', // muted rose
  '#8A6FD1', // violet
  '#4E9A5D', // emerald
  '#C97A4A', // terracotta
  '#5B8CA0', // steel blue
]

// Simple deterministic string hash so the same seed always resolves to the
// same colour/initials - avatars stay stable across page loads and never
// flicker between looks.
function hashSeed(seed) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

// "Alex_Doe" -> "AD", "alexdoe" -> "AL", "x" -> "X"
function initialsFor(seed) {
  const parts = seed.split(/[^a-zA-Z0-9]+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return '?'
}

function escapeXml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

<<<<<<< HEAD
// `gender` is accepted (and ignored) so every existing call site --
// Navbar, Profile, AdminDashboard, Leaderboard, Register, About -- keeps
// working unchanged; it no longer affects the avatar's appearance.
export function avatarUrlFor(seed, _gender) {
=======
// Preset avatars users can choose from. Each is a colour plus a simple
// 24x24 stroke glyph. Keep the ids in sync with server/src/data/avatars.js,
// which is what the server validates a chosen avatar against.
export const AVATAR_PRESETS = [
  { id: 'compass', label: 'Compass', color: '#5B7FDE', path: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM15.5 8.5l-2 5-5 2 2-5z' },
  { id: 'scroll', label: 'Scroll', color: '#C97A4A', path: 'M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM9 8h6M9 12h6M9 16h4' },
  { id: 'castle', label: 'Castle', color: '#8A6FD1', path: 'M4 21V8h3v2h3V8h4v2h3V8h3v13zM10 21v-4a2 2 0 0 1 4 0v4' },
  { id: 'globe', label: 'Globe', color: '#3FA79B', path: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z' },
  { id: 'hourglass', label: 'Hourglass', color: '#D9A441', path: 'M6 3h12M6 21h12M7 3c0 5 4 5 5 9-1 4-5 4-5 9M17 3c0 5-4 5-5 9 1 4 5 4 5 9' },
  { id: 'ship', label: 'Ship', color: '#5B8CA0', path: 'M3 15h18l-2 5H5zM12 15V4M12 5l6 8h-6M12 7l-5 6h5' },
  { id: 'pyramid', label: 'Pyramid', color: '#C15B5B', path: 'M12 4L3 20h18zM7.5 12h9' },
  { id: 'shield', label: 'Shield', color: '#4E9A5D', path: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z' },
  { id: 'torch', label: 'Torch', color: '#D9784A', path: 'M12 3c2 2.5 3 4 3 6a3 3 0 0 1-6 0c0-2 1-3.5 3-6zM10 13h4l-1 8h-2z' },
  { id: 'temple', label: 'Temple', color: '#7A7FD1', path: 'M4 9l8-5 8 5zM6 9v9M10 9v9M14 9v9M18 9v9M4 20h16' },
  { id: 'crown', label: 'Crown', color: '#B8892F', path: 'M3 8l4 4 5-7 5 7 4-4-2 11H5z' },
  { id: 'map', label: 'Map', color: '#4A9BB8', path: 'M9 4L3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14' },
]

const PRESETS_BY_ID = Object.fromEntries(AVATAR_PRESETS.map((p) => [p.id, p]))

// `avatarId` is the user's chosen preset (`user.avatar`). When it's empty or
// unrecognised, the avatar falls back to the generated initials look, so
// every call site can pass whatever it has without checking first.
export function avatarUrlFor(seed, avatarId) {
  const preset = avatarId ? PRESETS_BY_ID[avatarId] : null
  if (preset) {
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` +
      `<circle cx="32" cy="32" r="32" fill="${preset.color}"/>` +
      `<g transform="translate(16 16) scale(1.333)" fill="none" stroke="#ffffff" stroke-opacity="0.95" ` +
      `stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">` +
      `<path d="${preset.path}"/></g>` +
      `</svg>`
    return `data:image/svg+xml,${encodeURIComponent(svg)}`
  }

>>>>>>> 3450fa5 (feat: Fixes for admin user and loading accurate images for locations)
  const safeSeed = seed || 'chronomap'
  const hash = hashSeed(safeSeed)
  const color = PALETTE[hash % PALETTE.length]
  const initials = escapeXml(initialsFor(safeSeed))

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` +
    `<circle cx="32" cy="32" r="32" fill="${color}"/>` +
    `<text x="32" y="32" text-anchor="middle" dominant-baseline="central" ` +
    `font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700" ` +
    `fill="#ffffff" fill-opacity="0.95">${initials}</text>` +
    `</svg>`

  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}
