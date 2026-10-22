// The avatars a user can pick from. Must stay in sync with the presets in
// src/lib/avatar.js on the client -- the client draws them, the server only
// needs to know which ids are valid. An empty string means "no choice
// made": the client falls back to the generated initials avatar.
export const AVATAR_IDS = [
  'compass',
  'scroll',
  'castle',
  'globe',
  'hourglass',
  'ship',
  'pyramid',
  'shield',
  'torch',
  'temple',
  'crown',
  'map',
]
