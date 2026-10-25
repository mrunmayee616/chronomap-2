import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { leaderboardApi } from '../lib/api.js'
import { avatarUrlFor } from '../lib/avatar.js'
import { countryNameFor } from '../data/countries.js'
import { useLanguage, countryName } from '../i18n/LanguageContext.jsx'
import CountryFlag from '../components/CountryFlag.jsx'
import { CrownIcon, TrophyIcon } from '../components/Icons.jsx'

const PERIODS = ['week', 'month', 'year']

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
  const { t, locale } = useLanguage()
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
        src={avatarUrlFor(entry.username, entry.avatar)}
        alt={t('common.avatarOf', { name: entry.fullName })}
        className={`podium-avatar podium-avatar-${place}`}
      />
      <div
        className="podium-block"
        style={{ height: heightByPlace[place], background: style.bg, borderColor: style.border }}
      >
        <span className="podium-medal"><MedalIcon place={place} /></span>
        <p className="podium-name">
          <Link to={`/u/${encodeURIComponent(entry.username)}`} className="lb-profile-link">{entry.fullName}</Link>
        </p>
        <p className="podium-xp">{entry.xp.toLocaleString(locale)} XP</p>
      </div>
    </div>
  )
}

export default function Leaderboard() {
  const { token, user } = useAuth()
  const { t, locale } = useLanguage()
  const isAdmin = Boolean(user?.isAdmin)
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
        setError(err.error || t('leaderboard.loadError'))
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
          <h1 className="leaderboard-title"><TrophyIcon size={30} /> {t('leaderboard.title')}</h1>
          <p className="leaderboard-sub">{t(`leaderboard.subtitle.${period}`)}</p>
          {isAdmin && (
            <p className="leaderboard-admin-note">{t('leaderboard.adminNote')}</p>
          )}
        </div>

        <div className="leaderboard-tabs">
          {PERIODS.map((p) => (
            <button
              key={p}
              type="button"
              className={p === period ? 'leaderboard-tab active' : 'leaderboard-tab'}
              onClick={() => setPeriod(p)}
            >
              {t(`leaderboard.tabs.${p}`)}
            </button>
          ))}
        </div>

        {error && <p className="form-error" style={{ marginTop: 20 }}>{error}</p>}

        {loading ? (
          <p className="leaderboard-status">{t('leaderboard.loading')}</p>
        ) : leaderboard.length === 0 ? (
          <p className="leaderboard-status">
            {t(`leaderboard.empty.${period}`)}
            {isAdmin ? '' : ` ${t('leaderboard.emptyCta')}`}
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
                <span>{t('leaderboard.colUser')}</span>
                <span>XP</span>
                <span>{t('leaderboard.colCountry')}</span>
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
                        src={avatarUrlFor(entry.username, entry.avatar)}
                        alt={t('common.avatarOf', { name: entry.fullName })}
                        className="leaderboard-avatar"
                      />
                      <Link to={`/u/${encodeURIComponent(entry.username)}`} className="lb-profile-link">
                        {entry.fullName}
                      </Link>
                      {entry.isYou && <span className="leaderboard-you-tag">{t('leaderboard.you')}</span>}
                    </span>
                    <span className="leaderboard-xp">{entry.xp.toLocaleString(locale)}</span>
                    <span className="leaderboard-country">
                      {entry.country ? (
                        <>
                          <CountryFlag code={entry.country} size={18} className="leaderboard-flag" />
                          {countryName(entry.country, locale, countryNameFor(entry.country) || entry.country)}
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
