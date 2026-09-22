// Keep ids/titles/descriptions in sync with server/src/utils/achievements.js.
// `icon` and `color` are display-only and only used here.
// `statKey` + `target` describe how close the user is to unlocking the
// achievement, so the UI can show a completion percentage before it's done.
export const ACHIEVEMENTS = [
  {
    id: 'world-explorer',
    title: 'World Explorer',
    description: 'Visit 10 countries',
    icon: 'trophy',
    color: '#f7c740',
    statKey: 'countriesExplored',
    target: 10,
  },
  {
    id: 'timeline-master',
    title: 'Timeline Master',
    description: 'Explore 50 events',
    icon: 'clock',
    color: '#3fcf8e',
    statKey: 'eventsDiscovered',
    target: 50,
  },
  {
    id: 'quiz-master',
    title: 'Quiz Master',
    description: 'Solve 100 quizzes',
    icon: 'quiz',
    color: '#f76c6c',
    statKey: 'quizzesCompleted',
    target: 100,
  },
  {
    id: 'history-buff',
    title: 'History Buff',
    description: 'Solve 500 quizzes',
    icon: 'shield',
    color: '#5b7fd6',
    statKey: 'quizzesCompleted',
    target: 500,
  },
  {
    id: 'legendary',
    title: 'Legendary',
    description: 'Reach level 20',
    icon: 'crown',
    color: '#5b7fd6',
    statKey: 'level',
    target: 20,
  },
]

// Returns a 0-100 completion percentage for an achievement given the
// signed-in user's current stats. Unlocked achievements are always 100,
// even if the underlying stat has since changed (e.g. a re-computed value).
export function achievementProgress(achievement, user) {
  if (!user) return 0
  const unlocked = new Set(user.unlockedAchievements || []).has(achievement.id)
  if (unlocked) return 100
  const current = Number(user[achievement.statKey]) || 0
  const target = achievement.target || 1
  return Math.max(0, Math.min(100, Math.round((current / target) * 100)))
}
