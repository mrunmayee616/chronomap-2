import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true },

    // Brute-force protection
    failedLoginAttempts: { type: Number, default: 0 },
    lockedUntil: { type: Number, default: null }, // epoch ms

    // Profile
    bio: { type: String, default: '', trim: true, maxlength: 280 },
    location: { type: String, default: '', trim: true, maxlength: 120 },
    // Used only to pick a visually distinct (and consistently gendered)
    // avatar style -- see src/lib/avatar.js on the client.
    gender: { type: String, enum: ['male', 'female', 'unspecified'], default: 'unspecified' },
    // Chosen avatar preset id (see server/src/data/avatars.js). Empty means
    // the user hasn't picked one, so the client shows initials instead.
    avatar: { type: String, default: '' },
    // ISO 3166-1 alpha-2 code (e.g. "IN", "US"). Empty string means not set
    // (only possible for accounts created before this field existed).
    // See server/src/data/countries.js for the canonical list of codes.
    country: { type: String, default: '', trim: true, uppercase: true },

    // Progress / gamification (all start at zero for a new account)
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    countriesExplored: { type: Number, default: 0 },
    eventsDiscovered: { type: Number, default: 0 },
    quizzesCompleted: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    unlockedAchievements: { type: [String], default: [] },

    // Raw progress records behind the counters above -- kept so the
    // counters can always be recomputed instead of incremented by hand,
    // which is what makes them safe against double-counting (revisiting a
    // place, or retaking an already-passed quiz, never re-adds an entry
    // that's already in these lists).
    visitedPlaces: { type: [String], default: [] },
    exploredCountries: { type: [String], default: [] },
    completedQuizzes: { type: [String], default: [] },

    // Every quiz attempt, passed or not (newest last, capped -- see
    // progress.routes.js). Drives the dashboard's attempted-quizzes list,
    // activity calendar and streaks.
    quizAttempts: {
      type: [
        {
          placeId: { type: String, required: true },
          scorePercent: { type: Number, required: true },
          passed: { type: Boolean, required: true },
          at: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
    // The player's UTC offset in minutes (as JS getTimezoneOffset() reports
    // it), so "a day" for streaks means their local day, not UTC's.
    streakTzOffset: { type: Number, default: 0 },

    // placeId -> keys of the questions a hint was spent on in that place's
    // quiz (max QUIZ_HINT_LIMIT, see progress.routes.js). Stored here rather
    // than in the browser so the limit survives logging out, retaking the
    // quiz, or switching devices; re-asking for a listed question is free.
    quizHints: { type: Map, of: [String], default: {} },

    // One entry per XP award (currently just first-time quiz passes). Kept
    // as a running log, rather than only the running `xp` total, so the
    // leaderboard can sum "XP earned in the last week/month/year" without
    // needing a separate points-history collection. See
    // server/src/routes/leaderboard.routes.js.
    xpHistory: {
      type: [
        {
          amount: { type: Number, required: true },
          placeId: { type: String, default: '' },
          at: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
)

export default mongoose.model('User', userSchema)
