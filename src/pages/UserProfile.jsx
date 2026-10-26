import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import FollowButton from '../components/FollowButton.jsx'
import CountryFlag from '../components/CountryFlag.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { usersApi } from '../lib/api.js'
import { avatarUrlFor } from '../lib/avatar.js'
import { countryNameFor } from '../data/countries.js'
import { useLanguage, countryName } from '../i18n/LanguageContext.jsx'

// Another explorer's public profile. Only shows what's safe to share: no
// email, gender, or raw progress records.
export default function UserProfile() {
  const { username } = useParams()
  const { token } = useAuth()
  const { t, tTitle, locale } = useLanguage()
  const [person, setPerson] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    setPerson(null)
    usersApi
      .get(token, username)
      .then((data) => !cancelled && setPerson(data.user))
      .catch((err) => !cancelled && setError(err.status === 404 ? t('userProfile.notFound') : err.error || t('userProfile.loadError')))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [username, token])

  function onFollowChange(next, counts) {
    setPerson((p) => ({ ...p, isFollowing: next, followersCount: counts.followersCount, followingCount: counts.followingCount }))
  }

  const xpPct = person && person.xpToNextLevel > 0 ? Math.min(100, Math.round((person.xp / person.xpToNextLevel) * 100)) : 0

  return (
    <div className="page profile-page">
      <Navbar active="Explorers" />
      <div className="profile-wrap">
        <Link to="/explorers" className="explorers-back">← {t('userProfile.back')}</Link>

        {loading && <p className="explorers-hint">{t('common.loading')}</p>}
        {error && <p className="form-error" role="alert">{error}</p>}

        {person && (
          <div className="profile-card profile-summary-card">
            <div className="profile-header-row">
              <img src={avatarUrlFor(person.username, person.avatar)} alt={t('common.avatarOf', { name: person.username })} className="profile-avatar" />
              <div className="user-profile-head">
                <h2 className="profile-name">{person.fullName}</h2>
                <p className="profile-username">@{person.username}</p>
                <p className="profile-level-row">
                  {t('common.level', { level: person.level })} <span className="dot">•</span> {tTitle(person.title)}
                </p>
              </div>
              <div className="user-profile-action">
                {person.isSelf ? (
                  <Link to="/profile" className="btn-secondary user-profile-edit">{t('userProfile.editMine')}</Link>
                ) : (
                  <FollowButton username={person.username} isFollowing={person.isFollowing} onChange={onFollowChange} />
                )}
              </div>
            </div>

            <p className="user-profile-counts">
              <strong>{person.followersCount}</strong> {t('userProfile.followers', { count: person.followersCount })}
              <span className="dot"> • </span>
              <strong>{person.followingCount}</strong> {t('userProfile.following')}
            </p>

            {(person.bio || person.location || person.country) && (
              <div className="user-profile-about">
                {person.bio && <p>{person.bio}</p>}
                <p className="user-profile-meta">
                  {person.country && (
                    <span className="user-profile-country">
                      <CountryFlag code={person.country} size={16} /> {countryName(person.country, locale, countryNameFor(person.country) || person.country)}
                    </span>
                  )}
                  {person.location && <span>{person.location}</span>}
                </p>
              </div>
            )}

            <div className="xp-bar-wrap">
              <div className="xp-bar-track">
                <div className="xp-bar-fill" style={{ width: `${xpPct}%` }} />
              </div>
              <p className="xp-bar-label">{person.xp.toLocaleString(locale)} / {person.xpToNextLevel.toLocaleString(locale)} XP</p>
            </div>

            <div className="profile-stat-grid">
              <div className="profile-stat"><p className="profile-stat-value">{person.countriesExplored}</p><p className="profile-stat-label">{t('stats.countriesExplored')}</p></div>
              <div className="profile-stat"><p className="profile-stat-value">{person.eventsDiscovered}</p><p className="profile-stat-label">{t('stats.eventsDiscovered')}</p></div>
              <div className="profile-stat"><p className="profile-stat-value">{person.quizzesCompleted}</p><p className="profile-stat-label">{t('stats.quizzesCompleted')}</p></div>
              <div className="profile-stat"><p className="profile-stat-value">{person.currentStreak}</p><p className="profile-stat-label">{t('stats.currentStreak')}</p></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
