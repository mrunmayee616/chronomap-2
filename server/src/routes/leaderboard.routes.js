import { Router } from 'express'
import mongoose from 'mongoose'
import User from '../models/User.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

const VALID_PERIODS = ['week', 'month', 'year']
const RESULT_LIMIT = 20

// Calendar-aligned start of the requested period, in UTC:
//  - week: Monday 00:00 of the current week
//  - month: the 1st of the current month
//  - year: Jan 1st of the current year
function startOfPeriod(period) {
  const now = new Date()
  if (period === 'month') {
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
  }
  if (period === 'year') {
    return new Date(Date.UTC(now.getUTCFullYear(), 0, 1))
  }
  const day = now.getUTCDay() // 0 (Sun) .. 6 (Sat)
  const diffToMonday = (day + 6) % 7
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - diffToMonday))
}

// ---------------------------------------------------------------------------
// GET /api/leaderboard?period=week|month|year  (protected)
// Ranks users by XP earned within the period, summed live from each user's
// xpHistory log -- there's no separate stored "rank", so a user's position
// moves the moment their summed XP overtakes someone else's, and a user
// with zero XP in the period simply doesn't appear.
// ---------------------------------------------------------------------------
router.get('/', requireAuth, async (req, res) => {
  const period = VALID_PERIODS.includes(req.query.period) ? req.query.period : 'week'
  const start = startOfPeriod(period)

  const rows = await User.aggregate([
    { $unwind: '$xpHistory' },
    { $match: { 'xpHistory.at': { $gte: start } } },
    {
      $group: {
        _id: '$_id',
        xp: { $sum: '$xpHistory.amount' },
        fullName: { $first: '$fullName' },
        username: { $first: '$username' },
        gender: { $first: '$gender' },
        country: { $first: '$country' },
      },
    },
    // Highest XP first; ties broken alphabetically so ordering is stable
    // rather than shuffling between requests.
    { $sort: { xp: -1, username: 1 } },
    { $limit: RESULT_LIMIT },
  ])

  const currentUserId = mongoose.isValidObjectId(req.user.sub) ? req.user.sub : null

  const leaderboard = rows.map((row, index) => ({
    rank: index + 1,
    id: row._id,
    fullName: row.fullName,
    username: row.username,
    gender: row.gender || 'unspecified',
    country: row.country || '',
    xp: row.xp,
    isYou: currentUserId ? String(row._id) === String(currentUserId) : false,
  }))

  return res.status(200).json({ period, generatedAt: new Date().toISOString(), leaderboard })
})

export default router
