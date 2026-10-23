import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import authRoutes from './routes/auth.routes.js'
import progressRoutes from './routes/progress.routes.js'
import leaderboardRoutes from './routes/leaderboard.routes.js'
import placesRoutes from './routes/places.routes.js'
import adminRoutes from './routes/admin.routes.js'
import usersRoutes from './routes/users.routes.js'
import { connectDB } from './db/index.js'
import { syncPlaceImages } from './utils/placeImageSync.js'

const app = express()
const PORT = process.env.PORT || 5000
const IS_VERCEL = Boolean(process.env.VERCEL)

// CLIENT_ORIGIN can hold one URL or several, comma-separated, e.g.
// "https://chronomap.vercel.app,http://localhost:5173"
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim().replace(/\/$/, ''))
  .filter(Boolean)

// Vercel sits behind a proxy; without this, express-rate-limit errors out
// on the X-Forwarded-For header and sees every user as the same IP.
app.set('trust proxy', 1)

app.use(
  cors({
    origin(origin, cb) {
      // Allow non-browser requests (no Origin header) and listed origins.
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
      return cb(new Error('Not allowed by CORS'))
    },
    credentials: true,
  })
)

// NOTE: Vercel serverless functions reject request bodies over 4.5MB (413),
// whatever this limit says. Large CSV imports / base64 images need to stay
// under that, or be uploaded to storage (Cloudinary/S3) instead.
app.use(express.json({ limit: '15mb' }))

// Connect to MongoDB once per serverless instance and reuse the connection
// across requests. Safe locally too.
let dbPromise = null
function ensureDB() {
  if (!dbPromise) {
    dbPromise = connectDB().catch((err) => {
      dbPromise = null // allow a retry on the next request
      throw err
    })
  }
  return dbPromise
}
app.use(async (_req, res, next) => {
  try {
    await ensureDB()
    next()
  } catch (err) {
    console.error('DB connection failed:', err)
    res.status(500).json({ error: 'Database connection failed.' })
  }
})

// Basic brute-force protection on auth endpoints.
// (In-memory, so on serverless it is per-instance and only a soft limit.)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
})
app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/progress', progressRoutes)
app.use('/api/leaderboard', leaderboardRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/places', placesRoutes)
app.use('/api/admin', adminRoutes)

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: 'Internal server error.' })
})

// Local / traditional-server mode only. On Vercel the platform invokes the
// exported app directly, so we must not call listen().
if (!IS_VERCEL) {
  ensureDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`ChronoMap API listening on http://localhost:${PORT}`)
      })
      // Fill in real Wikipedia photos for built-in places that lack one.
      // Background only; disabled on Vercel because serverless functions are
      // frozen once the response is sent, so background work gets cut off.
      // Set PLACE_IMAGE_SYNC=off to disable locally as well.
      if (process.env.PLACE_IMAGE_SYNC !== 'off') {
        syncPlaceImages().catch((err) => console.error('Place image sync failed:', err.message))
      }
    })
    .catch((err) => {
      console.error('Failed to start server:', err)
      process.exit(1)
    })
}

export default app