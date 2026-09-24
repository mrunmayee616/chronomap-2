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
import { connectDB } from './db/index.js'

const app = express()
const PORT = process.env.PORT || 5000
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }))
// Default body limit (100kb) is too small for a bulk CSV import or an
// uploaded place image (stored inline as a base64 data URI) -- both go
// through the admin routes as plain JSON, so the whole app's limit is
// raised rather than special-casing one path.
app.use(express.json({ limit: '15mb' }))

// Basic brute-force protection on auth endpoints.
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
app.use('/api/places', placesRoutes)
app.use('/api/admin', adminRoutes)

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: 'Internal server error.' })
})

async function start() {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`ChronoMap API listening on http://localhost:${PORT}`)
  })
}

start()
