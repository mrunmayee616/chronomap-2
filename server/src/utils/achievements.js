// Fixed catalog of achievements. `id` values are what gets stored in
// User.unlockedAchievements. Keep this in sync with the frontend catalog
// in src/lib/achievements.js if descriptions ever change.
export const ACHIEVEMENTS = [
  { id: 'world-explorer', title: 'World Explorer', description: 'Visit 10 countries' },
  { id: 'timeline-master', title: 'Timeline Master', description: 'Explore 50 events' },
  { id: 'quiz-master', title: 'Quiz Master', description: 'Solve 100 quizzes' },
  { id: 'history-buff', title: 'History Buff', description: 'Solve 500 quizzes' },
  { id: 'legendary', title: 'Legendary', description: 'Reach level 20' },
]

const XP_PER_LEVEL = 250

// XP awarded the first time a quiz is passed. Flat per quiz, not scaled by
// score -- re-attempts (even with a higher score) never award XP again,
// since the caller only invokes this on the one attempt that first crosses
// the pass threshold. See server/src/routes/progress.routes.js.
export const QUIZ_PASS_XP = 50

// Adds `xpGained` to a user's xp/level, rolling over into as many level-ups
// as the XP total covers (e.g. a big XP grant could cross more than one
// level boundary at once). Mutates the passed-in mongoose document's xp and
// level fields directly; caller is responsible for saving it. Returns the
// number of levels gained, mainly so callers can surface a "level up!"
// moment in the response if they want to.
export function applyXp(user, xpGained) {
  if (!xpGained || xpGained <= 0) return 0

  user.xp += xpGained
  let levelsGained = 0
  let needed = xpToNextLevel(user.level)
  while (user.xp >= needed) {
    user.xp -= needed
    user.level += 1
    levelsGained += 1
    needed = xpToNextLevel(user.level)
  }
  return levelsGained
}

const LEVEL_TITLES = [
  { minLevel: 1, title: 'New Explorer' },
  { minLevel: 5, title: 'History Seeker' },
  { minLevel: 10, title: 'Veteran Historian' },
  { minLevel: 15, title: 'Master Chronologist' },
  { minLevel: 20, title: 'Legendary Explorer' },
]

export function titleForLevel(level) {
  let result = LEVEL_TITLES[0].title
  for (const t of LEVEL_TITLES) {
    if (level >= t.minLevel) result = t.title
  }
  return result
}

export function xpToNextLevel(level) {
  return level * XP_PER_LEVEL
}
