# ChronoMap

ChronoMap is a new, standalone educational software application developed to provide
an interactive and gamified approach to learning world history. Unlike conventional
educational resources that primarily rely on text-based content, ChronoMap integrates
an interactive world map, historical timelines, quizzes, and a ranking system into a
single platform, allowing users to explore historical events geographically and
chronologically.
The system is designed as a modular, client-server application consisting of a
user-facing web interface, an application server, and a centralized database. The
frontend provides interactive map visualization, user dashboards, quizzes, and learning
progress, while the backend manages user authentication, historical content,
gamification, rankings, and data processing. The database stores user information,
historical locations, quizzes, achievements, and learning statistics.
ChronoMap interacts with external services such as map providers (e.g.,
OpenStreetMap or Mapbox) for geographical visualization and may integrate with
external authentication or media storage services in future versions. The modular
architecture enables scalability and allows additional features, such as AI-powered
recommendations, augmented reality experiences, and collaborative learning, to be
incorporated without significantly modifying the existing system.
## Features

- **Explore** history on an interactive map (Cesium globe + Leaflet map) with a page for each place or event
- **Quizzes** for each place, with XP awarded the first time you pass
- **Progress and achievements**: levels (250 XP per level) plus World Explorer, Timeline Master, Quiz Master, History Buff and Legendary
- **Leaderboard** ranking users by progress
- **Accounts**: email/password registration and login
- **Profile** with avatar, favourites and unlocked achievements
- **Admin dashboard**: manage users, add, edit, delete and restore places, and bulk-import places from CSV
- **Place images** pulled from Wikipedia/Wikimedia via a sync script
- **Share** button for places

## Tech stack

| Layer | Tools |
|-------|-------|
| Frontend | React 18, React Router 6, Vite 5, Cesium, Leaflet |
| Backend | Node.js, Express 4, Mongoose 8 |
| Database | MongoDB (local or Atlas) |
| Auth | JWT, bcryptjs, Google and GitHub OAuth |

## Project structure

```
chronomap-2/
├── src/                     # React frontend
│   ├── pages/               # Home, Explore, Place, Quiz, Profile, Leaderboard, AdminDashboard, ...
│   ├── components/          # Navbar, Logo, CountryFlag, ShareButton, route guards, ...
│   ├── context/             # Auth, Places and Favourites providers
│   ├── data/                # Built-in places, countries, generated place images
│   └── lib/                 # API client, achievements, avatar helpers
├── server/                  # Express API
│   ├── src/
│   │   ├── routes/          # auth, oauth, places, progress, leaderboard, admin
│   │   ├── models/          # User, PlaceOverride
│   │   ├── middleware/      # auth (JWT)
│   │   ├── utils/           # mailer, achievements, CSV import, Wikimedia images, ...
│   │   └── db/              # Mongo connection and init
│   └── scripts/             # sync-place-images.mjs
├── public/
├── index.html
└── vite.config.js
```

## Getting started

### Prerequisites

- Node.js 18 or newer
- MongoDB running locally, or a MongoDB Atlas connection string

### 1. Clone and install

```bash
git clone https://github.com/mrunmayee616/chronomap-2.git
cd chronomap-2
git checkout update

npm install                 # frontend dependencies
cd server && npm install    # backend dependencies
cd ..
```

### 2. Configure environment variables

**Frontend**: copy `.env.example` to `.env` in the project root:

```env
VITE_API_URL=http://localhost:5000
```

**Backend**: copy `server/.env.example` to `server/.env` and fill it in:

```env
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
SERVER_URL=http://localhost:5000

JWT_SECRET=replace-this-with-a-long-random-string
JWT_EXPIRES_IN=7d

MONGODB_URI=mongodb://127.0.0.1:27017/chronomap

# Optional: Google / GitHub sign-in
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

OAuth callback URLs to register with each provider:

- Google: `http://localhost:5000/api/auth/oauth/google/callback`
- GitHub: `http://localhost:5000/api/auth/oauth/github/callback`

> Never commit `.env` files or real secrets. Only the `.env.example` files belong in the repo.

### 3. Run it

Use two terminals:

```bash
# Terminal 1: API (http://localhost:5000)
cd server
npm run dev

# Terminal 2: frontend (http://localhost:5173)
npm run dev
```

## Scripts

**Frontend (project root)**

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build |

**Backend (`server/`)**

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the API with auto-reload |
| `npm start` | Start the API |
| `npm run db:check` | Check the database connection |
| `node scripts/sync-place-images.mjs` | Fetch Wikipedia photos for every built-in place into `src/data/placeImages.generated.js` (needs internet; safe to re-run) |

## API overview

| Area | Base path | Endpoints |
|------|-----------|-----------|
| Auth | `/api/auth` | `POST /register`, `POST /login`, `GET /me`, `PATCH /me` |
| OAuth | `/api/auth/oauth` | `GET /:provider`, `GET /:provider/callback` (Google, GitHub) |
| Places | `/api/places` | `GET /overrides` |
| Progress | `/api/progress` | `POST /visit-place`, `POST /quiz-result` |
| Leaderboard | `/api/leaderboard` | `GET /` (auth required) |
| Admin | `/api/admin` | users list and delete; places create, update, bulk CSV import, delete and restore |

## Team

- Anmol Rai
- Mrunmayee Raje
- Sneha Ramamurthy

## Notes

- Built-in places live in `src/data/places.js`. Admin edits are stored as overrides in MongoDB and layered on top.
- The `/admin` route is restricted to admin users.
