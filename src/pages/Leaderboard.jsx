import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { leaderboardApi } from '../lib/api.js'
import { avatarUrlFor } from '../lib/avatar.js'
import { countryNameFor, flagEmojiFor } from '../data/countries.js'
import { CrownIcon, TrophyIcon } from '../components/Icons.jsx'

const PERIODS = [
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
  { key: 'year', label: 'This Year' },
]

const PERIOD_NOUN = { week: 'week', month: 'month', year: 'year' }

function MedalIcon({ place }) {
  // place: 1, 2 or 3
  const colors = { 1: '#f7c740', 2: '#c7d3e6', 3: '#cd8a4a' }
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="14" r="7" fill={colors[place]} stroke="#00000030" strokeWidth="1" />
      <text x="12" y="17.5" textAnchor="middle" fontSize="9" fontWeight="800" fill="#1a1300">
        {place}
      </text>
      <path d="M9 8l-3-5M15 8l3-5" stroke={colors[place]} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function PodiumColumn({ entry, place }) {
  const heightByPlace = { 1: 168, 2: 128, 3: 100 }
  const colorByPlace = {
    1: { bg: 'linear-gradient(180deg, #f7c74033, #f7c74014)', border: '#f7c74055' },
    2: { bg: 'linear-gradient(180deg, #4f7fe033, #4f7fe014)', border: '#4f7fe055' },
    3: { bg: 'linear-gradient(180deg, #3fae6a33, #3fae6a14)', border: '#3fae6a55' },
  }
  const style = colorByPlace[place]

  return (
    <div className="podium-col" style={{ order: place === 1 ? 2 : place === 2 ? 3 : 1 }}>
      <img
        src={avatarUrlFor(entry.username, entry.gender)}
        alt={`${entry.fullName}'s avatar`}
        className={`podium-avatar podium-avatar-${place}`}
      />
      <div
        className="podium-block"
        style={{ height: heightByPlace[place], background: style.bg, borderColor: style.border }}
      >
        <span className="podium-medal"><MedalIcon place={place} /></span>
        <p className="podium-name">{entry.fullName}</p>
        <p className="podium-xp">{entry.xp.toLocaleString()} XP</p>
      </div>
    </div>
  )
}

export default function Leaderboard() {
  const { token } = useAuth()
  const [period, setPeriod] = useState('week')
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return
    let cancelled = false
    setLoading(true)
    setError('')

    leaderboardApi
      .get(token, period)
      .then((data) => {
        if (cancelled) return
        setLeaderboard(data.leaderboard || [])
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.error || 'Could not load the leaderboard.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [token, period])

  const top3 = leaderboard.slice(0, 3)
  const [first, second, third] = top3

  return (
    <div className="page leaderboard-page">
      <Navbar active="Leaderboard" />

      <div className="leaderboard-wrap">
        <div className="leaderboard-header">
          <h1 className="leaderboard-title"><TrophyIcon size={30} /> Leaderboard</h1>
          <p className="leaderboard-sub">
            Top explorers of history this {PERIOD_NOUN[period]} !!!
          </p>
        </div>

        <div className="leaderboard-tabs">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              type="button"
              className={p.key === period ? 'leaderboard-tab active' : 'leaderboard-tab'}
              onClick={() => setPeriod(p.key)}
            >
              {p.label}
            </button>
          ))}
        </div>

        {error && <p className="form-error" style={{ marginTop: 20 }}>{error}</p>}

        {loading ? (
          <p className="leaderboard-status">Loading leaderboard…</p>
        ) : leaderboard.length === 0 ? (
          <p className="leaderboard-status">
            No one has scored any points this {PERIOD_NOUN[period]} yet — take a quiz and be the first!
          </p>
        ) : (
          <div className="leaderboard-grid">
            <div className="leaderboard-podium-wrap">
              {top3.length > 0 && (
                <div className="leaderboard-podium">
                  {first && <PodiumColumn entry={first} place={1} />}
                  {second && <PodiumColumn entry={second} place={2} />}
                  {third && <PodiumColumn entry={third} place={3} />}
                </div>
              )}
            </div>

            <div className="leaderboard-table-card">
              <div className="leaderboard-table-header">
                <span>#</span>
                <span>User</span>
                <span>XP</span>
                <span>Country</span>
              </div>
              <div className="leaderboard-table-body">
                {leaderboard.map((entry) => (
                  <div
                    key={entry.id}
                    className={entry.isYou ? 'leaderboard-row leaderboard-row-you' : 'leaderboard-row'}
                  >
                    <span className="leaderboard-rank">
                      {entry.rank <= 3 ? <CrownIcon size={16} /> : entry.rank}
                    </span>
                    <span className="leaderboard-user">
                      <img
                        src={avatarUrlFor(entry.username, entry.gender)}
                        alt={`${entry.fullName}'s avatar`}
                        className="leaderboard-avatar"
                      />
                      {entry.fullName}
                      {entry.isYou && <span className="leaderboard-you-tag">You</span>}
                    </span>
                    <span className="leaderboard-xp">{entry.xp.toLocaleString()}</span>
                    <span className="leaderboard-country">
                      {entry.country ? (
                        <>
                          <span className="leaderboard-flag">{flagEmojiFor(entry.country)}</span>
                          {countryNameFor(entry.country) || entry.country}
                        </>
                      ) : (
                        <span className="leaderboard-country-unset">—</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
