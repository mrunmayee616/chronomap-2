import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useFavourites } from '../context/FavouritesContext.jsx'
import { authApi } from '../lib/api.js'
import { avatarUrlFor } from '../lib/avatar.js'
import { ACHIEVEMENTS, achievementProgress } from '../lib/achievements.js'
import { getPlaceById } from '../data/places.js'
import {
  TrophyIcon,
  ClockIcon,
  QuizIcon,
  ShieldIcon,
  CrownIcon,
  LockIcon,
  MapPinIcon,
  CalendarIcon,
  EditIcon,
  CheckIcon,
  XIcon,
} from '../components/Icons.jsx'

function HeartIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 20.5s-7.5-4.6-10-9.3C.5 8 2 4.5 5.5 3.6c2.2-.6 4.4.3 6.5 2.6 2.1-2.3 4.3-3.2 6.5-2.6C22 4.5 23.5 8 22 11.2c-2.5 4.7-10 9.3-10 9.3z" />
    </svg>
  )
}

const ACHIEVEMENT_ICONS = {
  trophy: TrophyIcon,
  clock: ClockIcon,
  quiz: QuizIcon,
  shield: ShieldIcon,
  crown: CrownIcon,
}

const FILTERS = ['All', 'Unlocked', 'Locked']

function formatJoinedDate(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function Profile() {
  const { user, token, refreshUser } = useAuth()
  const { favourites, removeFavourite } = useFavourites()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('All')

  const [isEditingAbout, setIsEditingAbout] = useState(false)
  const [bioDraft, setBioDraft] = useState('')
  const [locationDraft, setLocationDraft] = useState('')
  const [genderDraft, setGenderDraft] = useState('unspecified')
  const [aboutError, setAboutError] = useState('')
  const [savingAbout, setSavingAbout] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    refreshUser()
      .catch(() => {
        if (!cancelled) setError('Could not load your latest profile data.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
    // Only run once on mount - refreshUser identity is stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function startEditingAbout() {
    setBioDraft(user.bio || '')
    setLocationDraft(user.location || '')
    setGenderDraft(user.gender || 'unspecified')
    setAboutError('')
    setIsEditingAbout(true)
  }

  function cancelEditingAbout() {
    setIsEditingAbout(false)
    setAboutError('')
  }

  async function saveAbout(e) {
    e.preventDefault()
    setAboutError('')
    setSavingAbout(true)
    try {
      await authApi.updateProfile(token, { bio: bioDraft, location: locationDraft, gender: genderDraft })
      await refreshUser()
      setIsEditingAbout(false)
    } catch (err) {
      setAboutError(err.error || 'Could not save your changes. Please try again.')
    } finally {
      setSavingAbout(false)
    }
  }

  if (!user) {
    return (
      <div className="page signin-page">
        <Navbar active="Profile" />
        <div className="verify-wrap">
          <p className="verify-message">{loading ? 'Loading your profile…' : 'We could not load your profile.'}</p>
        </div>
      </div>
    )
  }

  const unlockedSet = new Set(user.unlockedAchievements || [])
  const totalAchievements = ACHIEVEMENTS.length
  const unlockedCount = ACHIEVEMENTS.filter((a) => unlockedSet.has(a.id)).length

  const visibleAchievements = ACHIEVEMENTS.filter((a) => {
    if (filter === 'Unlocked') return unlockedSet.has(a.id)
    if (filter === 'Locked') return !unlockedSet.has(a.id)
    return true
  })

  const xpPct = user.xpToNextLevel > 0 ? Math.min(100, Math.round((user.xp / user.xpToNextLevel) * 100)) : 0

  const favouritePlaces = favourites.map((id) => getPlaceById(id)).filter(Boolean)

  return (
    <div className="page profile-page">
      <Navbar active="Profile" />

      <div className="profile-wrap">
        {error && <p className="form-error">{error}</p>}

        <div className="profile-top-grid">
          <div className="profile-card profile-summary-card">
            <div className="profile-header-row">
              <img
                src={avatarUrlFor(user.username, user.gender)}
                alt={`${user.username}'s avatar`}
                className="profile-avatar"
              />
              <div>
                <h2 className="profile-name">{user.fullName}</h2>
                <p className="profile-username">@{user.username}</p>
                <p className="profile-level-row">
                  Level {user.level} <span className="dot">•</span> {user.title}
                </p>
              </div>
            </div>

            <div className="xp-bar-wrap">
              <div className="xp-bar-track">
                <div className="xp-bar-fill" style={{ width: `${xpPct}%` }} />
              </div>
              <p className="xp-bar-label">
                {user.xp.toLocaleString()} / {user.xpToNextLevel.toLocaleString()} XP
              </p>
            </div>

            <div className="profile-stat-grid">
              <div className="profile-stat">
                <p className="profile-stat-value">{user.countriesExplored}</p>
                <p className="profile-stat-label">Countries Explored</p>
              </div>
              <div className="profile-stat">
                <p className="profile-stat-value">{user.eventsDiscovered}</p>
                <p className="profile-stat-label">Events Discovered</p>
              </div>
              <div className="profile-stat">
                <p className="profile-stat-value">{user.quizzesCompleted}</p>
                <p className="profile-stat-label">Quizzes Completed</p>
              </div>
              <div className="profile-stat">
                <p className="profile-stat-value">{user.currentStreak}</p>
                <p className="profile-stat-label">Current Streak</p>
              </div>
            </div>
          </div>

          <div className="profile-card profile-about-card">
            <div className="profile-about-header">
              <h3 className="profile-about-title">About Me</h3>
              {!isEditingAbout && (
                <button
                  type="button"
                  className="icon-btn"
                  onClick={startEditingAbout}
                  aria-label="Edit About Me"
                >
                  <EditIcon />
                </button>
              )}
            </div>

            {isEditingAbout ? (
              <form onSubmit={saveAbout} className="about-edit-form">
                {aboutError && <p className="field-error" style={{ margin: '0 0 10px' }}>{aboutError}</p>}

                <label className="field-label" htmlFor="about-bio">Bio</label>
                <textarea
                  id="about-bio"
                  className="about-textarea"
                  value={bioDraft}
                  onChange={(e) => setBioDraft(e.target.value)}
                  maxLength={280}
                  rows={4}
                  placeholder="Tell other explorers about yourself…"
                />
                <p className="about-char-count">{bioDraft.length}/280</p>

                <label className="field-label" htmlFor="about-location">Location</label>
                <div className="field">
                  <input
                    id="about-location"
                    type="text"
                    value={locationDraft}
                    onChange={(e) => setLocationDraft(e.target.value)}
                    maxLength={120}
                    placeholder="City, Country"
                  />
                  <span className="field-icon"><MapPinIcon /></span>
                </div>

                <label className="field-label" htmlFor="about-gender">Avatar style</label>
                <div className="avatar-style-row">
                  <img
                    src={avatarUrlFor(user.username, genderDraft)}
                    alt="Avatar preview"
                    className="avatar-style-preview"
                  />
                  <div className="field avatar-style-field">
                    <select
                      id="about-gender"
                      value={genderDraft}
                      onChange={(e) => setGenderDraft(e.target.value)}
                    >
                      <option value="unspecified">Prefer not to say</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>
                {genderDraft === 'unspecified' && (
                  <p className="about-char-count" style={{ marginTop: -8, marginBottom: 14 }}>
                    We'll pick a consistent look for you automatically. Choose Male or Female above for
                    more control over the style.
                  </p>
                )}

                <div className="about-edit-actions">
                  <button type="submit" className="icon-btn icon-btn-save" disabled={savingAbout} aria-label="Save">
                    <CheckIcon /> {savingAbout ? 'Saving…' : 'Save'}
                  </button>
                  <button
                    type="button"
                    className="icon-btn icon-btn-cancel"
                    onClick={cancelEditingAbout}
                    disabled={savingAbout}
                    aria-label="Cancel"
                  >
                    <XIcon /> Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <p className="profile-about-bio">
                  {user.bio ? user.bio : `I'm ${user.fullName.split(' ')[0]} and I'm an explorer.`}
                </p>

                {user.location && (
                  <p className="profile-meta-row">
                    <MapPinIcon /> <span>{user.location}</span>
                  </p>
                )}
                <p className="profile-meta-row">
                  <CalendarIcon /> <span>Joined on {formatJoinedDate(user.joinedAt)}</span>
                </p>
              </>
            )}
          </div>
        </div>

        <div className="favourites-header-row">
          <h3 className="favourites-title">Favourites</h3>
          <p className="favourites-count">
            <span className="favourites-count-strong">{favouritePlaces.length}</span> Saved Places
          </p>
        </div>

        {favouritePlaces.length === 0 ? (
          <p className="favourites-empty">
            You haven't saved any places yet. Head to <Link to="/explore">Explore</Link> and tap the
            heart on a place to add it here.
          </p>
        ) : (
          <div className="favourites-grid">
            {favouritePlaces.map((place) => (
              <div key={place.id} className="favourite-card">
                <Link to={`/place/${place.id}`} className="favourite-card-media">
                  <img src={place.image} alt={place.name} />
                </Link>
                <div className="favourite-card-body">
                  <Link to={`/place/${place.id}`} className="favourite-card-name">
                    {place.name}
                  </Link>
                  <p className="favourite-card-location">
                    <MapPinIcon size={13} /> {place.location}
                  </p>
                </div>
                <button
                  type="button"
                  className="favourite-card-remove"
                  aria-label={`Remove ${place.name} from favourites`}
                  onClick={() => removeFavourite(place.id)}
                >
                  <HeartIcon />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="achievements-header-row">
          <h3 className="achievements-title">Achievements</h3>
          <p className="achievements-count">
            <span className="achievements-count-strong">{unlockedCount}/{totalAchievements}</span> Achievements Unlocked
          </p>
        </div>

        <div className="achievements-filter-row">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className={f === filter ? 'filter-pill active' : 'filter-pill'}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="achievements-grid">
          {visibleAchievements.map((a) => {
            const Icon = ACHIEVEMENT_ICONS[a.icon]
            const isUnlocked = unlockedSet.has(a.id)
            const progress = achievementProgress(a, user)
            return (
              <div
                key={a.id}
                className={isUnlocked ? 'achievement-card unlocked' : 'achievement-card locked'}
                style={{ '--progress': progress, '--progress-color': a.color }}
                title={`${progress}% complete`}
              >
                <div
                  className="achievement-icon-badge"
                  style={isUnlocked ? { background: a.color, color: '#151527' } : undefined}
                >
                  {isUnlocked ? <Icon /> : <LockIcon />}
                </div>
                <p className="achievement-title">{a.title}</p>
                <p className="achievement-description">{a.description}</p>
                <p className="achievement-progress">{progress}%</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
