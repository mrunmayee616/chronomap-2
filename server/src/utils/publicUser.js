import { titleForLevel, xpToNextLevel } from './achievements.js'

// Shapes a Mongoose User document into what the client is allowed to see.
// Shared by every route that returns a user object, so auth and progress
// endpoints can't drift out of sync with each other.
export function publicUser(user) {
  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    username: user.username,
    bio: user.bio || '',
    location: user.location || '',
    gender: user.gender || 'unspecified',
    country: user.country || '',
    joinedAt: user.createdAt,
    level: user.level,
    title: titleForLevel(user.level),
    xp: user.xp,
    xpToNextLevel: xpToNextLevel(user.level),
    countriesExplored: user.countriesExplored,
    eventsDiscovered: user.eventsDiscovered,
    quizzesCompleted: user.quizzesCompleted,
    currentStreak: user.currentStreak,
    unlockedAchievements: user.unlockedAchievements || [],
    visitedPlaces: user.visitedPlaces || [],
  }
}
