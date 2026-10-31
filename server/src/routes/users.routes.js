import { Router } from 'express'
import mongoose from 'mongoose'
import User from '../models/User.js'
import Follow from '../models/Follow.js'
import { requireAuth } from '../middleware/auth.js'
import { titleForLevel, xpToNextLevel } from '../utils/achievements.js'
import { streaksFor } from '../utils/streak.js'

const router = Router()
router.use(requireAuth)

const SEARCH_LIMIT = 20
const LIST_LIMIT = 100
const MIN_QUERY_LENGTH = 2

// The admin account has no User document (see utils/admin.js), so it has no
// id to attach a follow to. It can browse explorers, but not follow anyone.
const isAdmin = (req) => req.user?.role === 'admin'
const myId = (req) => (isAdmin(req) ? null : req.user.sub)

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// The small, public shape used in search results and follower lists. Never
// includes email, gender or any progress detail beyond level/XP.
function liteUser(user, followingSet) {
  return {
    id: String(user._id),
    username: user.username,
    fullName: user.fullName,
    avatar: user.avatar || '',
    country: user.country || '',
    level: user.level,
    title: titleForLevel(user.level),
    xp: user.xp,
    isFollowing: followingSet ? followingSet.has(String(user._id)) : false,
  }
}

// Which of `users` the signed-in user already follows (one query, not N).
async function followingSetFor(req, users) {
  const me = myId(req)
  if (!me || users.length === 0) return new Set()
  const edges = await Follow.find({ follower: me, following: { $in: users.map((u) => u._id) } })
    .select('following')
    .lean()
  return new Set(edges.map((e) => String(e.following)))
}

async function countsFor(userId) {
  const [followers, following] = await Promise.all([
    Follow.countDocuments({ following: userId }),
    Follow.countDocuments({ follower: userId }),
  ])
  return { followersCount: followers, followingCount: following }
}

// GET /api/users/search?q=ada
// Case-insensitive match on username or full name. The signed-in user is
// left out of their own results. Needs at least two characters so a single
// letter can't dump the whole user list.
router.get('/search', async (req, res) => {
  const q = typeof req.query.q === 'string' ? req.query.q.trim() : ''
  if (q.length < MIN_QUERY_LENGTH) {
    return res.status(200).json({ users: [], query: q, tooShort: true })
  }

  const rx = new RegExp(escapeRegex(q.slice(0, 40)), 'i')
  const filter = { $or: [{ username: rx }, { fullName: rx }] }
  const me = myId(req)
  if (me) filter._id = { $ne: me }

  const users = await User.find(filter)
    .select('username fullName avatar country level xp')
    .sort({ xp: -1, username: 1 })
    .limit(SEARCH_LIMIT)
    .lean()

  const followingSet = await followingSetFor(req, users)
  return res.status(200).json({ users: users.map((u) => liteUser(u, followingSet)), query: q })
})

// Loads :username, or answers 404. Sets req.target.
async function loadTarget(req, res, next) {
  const target = await User.findOne({ username: req.params.username })
  if (!target) return res.status(404).json({ error: 'Explorer not found.' })
  req.target = target
  return next()
}

// GET /api/users/:username -- a public profile.
router.get('/:username', loadTarget, async (req, res) => {
  const u = req.target
  const counts = await countsFor(u._id)
  const me = myId(req)
  const isSelf = Boolean(me) && String(u._id) === String(me)
  const isFollowing = me && !isSelf ? Boolean(await Follow.exists({ follower: me, following: u._id })) : false

  return res.status(200).json({
    user: {
      id: String(u._id),
      username: u.username,
      fullName: u.fullName,
      avatar: u.avatar || '',
      bio: u.bio || '',
      location: u.location || '',
      country: u.country || '',
      joinedAt: u.createdAt,
      level: u.level,
      title: titleForLevel(u.level),
      xp: u.xp,
      xpToNextLevel: xpToNextLevel(u.level),
      countriesExplored: u.countriesExplored,
      eventsDiscovered: u.eventsDiscovered,
      quizzesCompleted: u.quizzesCompleted,
      currentStreak: streaksFor(u).current,
      ...counts,
      isFollowing,
      isSelf,
    },
  })
})

// POST /api/users/:username/follow -- idempotent.
router.post('/:username/follow', loadTarget, async (req, res) => {
  if (isAdmin(req)) {
    return res.status(403).json({ error: "The admin account can't follow explorers." })
  }
  const target = req.target
  if (String(target._id) === String(req.user.sub)) {
    return res.status(400).json({ error: "You can't follow yourself." })
  }

  try {
    await Follow.create({ follower: req.user.sub, following: target._id })
  } catch (err) {
    // 11000 = the unique index fired: already following. That's fine.
    if (err?.code !== 11000) throw err
  }
  const counts = await countsFor(target._id)
  return res.status(200).json({ isFollowing: true, ...counts })
})

// DELETE /api/users/:username/follow -- idempotent.
router.delete('/:username/follow', loadTarget, async (req, res) => {
  if (isAdmin(req)) {
    return res.status(403).json({ error: "The admin account can't follow explorers." })
  }
  await Follow.deleteOne({ follower: req.user.sub, following: req.target._id })
  const counts = await countsFor(req.target._id)
  return res.status(200).json({ isFollowing: false, ...counts })
})

// GET /api/users/:username/followers | /following -- newest first.
async function listEdges(req, res, direction) {
  const u = req.target
  const edgeFilter = direction === 'followers' ? { following: u._id } : { follower: u._id }
  const otherField = direction === 'followers' ? 'follower' : 'following'

  const edges = await Follow.find(edgeFilter).sort({ createdAt: -1 }).limit(LIST_LIMIT).select(otherField).lean()
  const ids = edges.map((e) => e[otherField])
  const found = await User.find({ _id: { $in: ids } })
    .select('username fullName avatar country level xp')
    .lean()
  // Keep the newest-first order of the edges.
  const byId = new Map(found.map((x) => [String(x._id), x]))
  const users = ids.map((id) => byId.get(String(id))).filter(Boolean)

  const followingSet = await followingSetFor(req, users)
  const counts = await countsFor(u._id)
  return res.status(200).json({ users: users.map((x) => liteUser(x, followingSet)), ...counts })
}
router.get('/:username/followers', loadTarget, (req, res) => listEdges(req, res, 'followers'))
router.get('/:username/following', loadTarget, (req, res) => listEdges(req, res, 'following'))

export default router
