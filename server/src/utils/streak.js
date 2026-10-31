// Quiz streaks: the number of consecutive days, in the player's own time
// zone, on which they attempted at least one quiz. A streak stays alive
// through today even if today's quiz hasn't happened yet -- it only breaks
// once a whole day passes with no attempt.

const DAY_MS = 24 * 60 * 60 * 1000

// Days since the epoch in the player's local time. tzOffset is in minutes,
// as JS getTimezoneOffset() reports it (e.g. -330 for India).
function localDay(date, tzOffset) {
  return Math.floor((new Date(date).getTime() - tzOffset * 60 * 1000) / DAY_MS)
}

// All dated activity for a user: every recorded attempt, plus quiz passes
// from before attempts were recorded (xpHistory), so older accounts don't
// start with an empty history. Works on Mongoose docs and lean objects.
export function activityEntries(user) {
  const attempts = (user.quizAttempts || []).map((a) => ({
    placeId: a.placeId,
    scorePercent: a.scorePercent,
    passed: a.passed,
    at: a.at,
  }))
  const firstRecorded = attempts.length
    ? Math.min(...attempts.map((a) => new Date(a.at).getTime()))
    : Infinity
  const legacy = (user.xpHistory || [])
    .filter((x) => x.placeId && new Date(x.at).getTime() < firstRecorded)
    .map((x) => ({ placeId: x.placeId, scorePercent: null, passed: true, at: x.at }))
  return [...legacy, ...attempts].sort((a, b) => new Date(b.at) - new Date(a.at))
}

export function computeStreaks(dates, tzOffset = 0, now = new Date()) {
  const days = [...new Set(dates.map((d) => localDay(d, tzOffset)))].sort((a, b) => a - b)
  if (days.length === 0) return { current: 0, max: 0 }

  let max = 1
  let run = 1
  for (let i = 1; i < days.length; i++) {
    run = days[i] === days[i - 1] + 1 ? run + 1 : 1
    max = Math.max(max, run)
  }

  const today = localDay(now, tzOffset)
  const last = days[days.length - 1]
  // `run` is the length of the streak ending on the latest active day.
  const current = last === today || last === today - 1 ? run : 0
  return { current, max }
}

export function streaksFor(user, now = new Date()) {
  return computeStreaks(
    activityEntries(user).map((e) => e.at),
    user.streakTzOffset || 0,
    now
  )
}
