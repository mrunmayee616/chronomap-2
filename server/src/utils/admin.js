// The admin account is a single, fixed credential rather than a normal
// registered user -- there's no User document for it, and its identity in
// a JWT is just { sub: 'admin', role: 'admin' }. That keeps the whole admin
// feature additive: nothing about the existing registration/login flow for
// real users changes, and this email/username stay reserved so nobody can
// register over them (see auth.routes.js).
export const ADMIN_EMAIL = 'admin@fsdl'
export const ADMIN_USERNAME = 'admin'
export const ADMIN_PASSWORD = 'chronomap'

// Shaped like publicUser() so every client code path that reads user.*
// (Navbar, Profile, refreshUser, etc.) keeps working if the admin ever
// stumbles onto a page meant for regular explorers.
export function adminPublicUser() {
  return {
    id: 'admin',
    fullName: 'Admin',
    email: ADMIN_EMAIL,
    username: ADMIN_USERNAME,
    role: 'admin',
    isAdmin: true,
    bio: '',
    location: '',
    gender: 'unspecified',
    country: '',
    joinedAt: null,
    level: 0,
    title: 'Administrator',
    xp: 0,
    xpToNextLevel: 0,
    countriesExplored: 0,
    eventsDiscovered: 0,
    quizzesCompleted: 0,
    currentStreak: 0,
    unlockedAchievements: [],
    visitedPlaces: [],
  }
}
