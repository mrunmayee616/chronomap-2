// A generic, consistent avatar for a given user: a solid-colour circle with
// their initials, in the style of Slack/GitHub's default avatars. The same
// user always gets the same colour and initials - there's no per-user
// cartoon face, just one clean look drawn from a small, fixed palette that
// matches the app's dark/gold theme.
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

// `gender` is accepted (and ignored) so every existing call site --
// Navbar, Profile, AdminDashboard, Leaderboard, Register, About -- keeps
// working unchanged; it no longer affects the avatar's appearance.
export function avatarUrlFor(seed, _gender) {
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
