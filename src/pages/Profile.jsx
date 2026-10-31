import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useFavourites } from '../context/FavouritesContext.jsx'
import { authApi, progressApi, usersApi } from '../lib/api.js'
import {
  ActivityCalendar,
  AttemptedQuizzes,
  DashboardGreeting,
  computeStreaks,
} from '../components/DashboardActivity.jsx'
import { avatarUrlFor } from '../lib/avatar.js'
import AvatarPicker from '../components/AvatarPicker.jsx'
import OwlNote from '../components/OwlNote.jsx'
import { COUNTRIES, countryNameFor } from '../data/countries.js'
import CountryFlag from '../components/CountryFlag.jsx'
import { ACHIEVEMENTS, achievementProgress } from '../lib/achievements.js'
import { getPlaceById } from '../data/places.js'
import { useLanguage, countryName, richText } from '../i18n/LanguageContext.jsx'
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

function formatJoinedDate(isoString, locale) {
  if (!isoString) return ''
  const d = new Date(isoString)
  return d.toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export default function Profile() {
  const { user, token, refreshUser } = useAuth()
  const { favourites, removeFavourite } = useFavourites()
  const { t, tTitle, locale } = useLanguage()

  const [loading, setLoading] = useState(true)
  const [social, setSocial] = useState(null)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('All')

  const [isEditingAbout, setIsEditingAbout] = useState(false)
  const [bioDraft, setBioDraft] = useState('')
  const [locationDraft, setLocationDraft] = useState('')
  const [genderDraft, setGenderDraft] = useState('unspecified')
  const [avatarDraft, setAvatarDraft] = useState('')
  const [countryDraft, setCountryDraft] = useState('')
  const [aboutError, setAboutError] = useState('')
  const [savingAbout, setSavingAbout] = useState(false)
  // Quiz attempts for the greeting, calendar and attempted-quizzes list.
  const [attempts, setAttempts] = useState([])

  useEffect(() => {
    let cancelled = false

    setLoading(true)

    refreshUser()
      .catch(() => {
        if (!cancelled) {
          setError(t('profile.refreshError'))
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
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
    setAvatarDraft(user.avatar || '')
    setCountryDraft(user.country || '')
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
      await authApi.updateProfile(token, {
        bio: bioDraft,
        location: locationDraft,
        gender: genderDraft,
        avatar: avatarDraft,
        country: countryDraft,
      })

      await refreshUser()
      setIsEditingAbout(false)
    } catch (err) {
      setAboutError(
        err.error || t('profile.saveError')
      )
    } finally {
      setSavingAbout(false)
    }
  }

  useEffect(() => {
    if (!token || user?.isAdmin) return undefined
    let cancelled = false
    progressApi
      .activity(token)
      .then((data) => !cancelled && setAttempts(data.attempts || []))
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [token, user?.isAdmin])

  // Follower / following counts for the header (the admin has none).
  useEffect(() => {
    if (!user || user.isAdmin) return

    let cancelled = false

    usersApi
      .get(token, user.username)
      .then(
        (data) =>
          !cancelled &&
          setSocial({
            followers: data.user.followersCount,
            following: data.user.followingCount,
          })
      )
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [token, user?.username, user?.isAdmin])

  if (!user) {
    return (
      <div className="page signin-page">
        <Navbar active="Profile" />
        <div className="verify-wrap">
          <p className="verify-message">
            {loading ? t('profile.loading') : t('profile.loadError')}
          </p>
        </div>
      </div>
    )
  }

  const unlockedSet = new Set(user.unlockedAchievements || [])
  const totalAchievements = ACHIEVEMENTS.length
  const unlockedCount = ACHIEVEMENTS.filter((a) =>
    unlockedSet.has(a.id)
  ).length

  const visibleAchievements = ACHIEVEMENTS.filter((a) => {
    if (filter === 'Unlocked') return unlockedSet.has(a.id)
    if (filter === 'Locked') return !unlockedSet.has(a.id)
    return true
  })

  const xpPct =
    user.xpToNextLevel > 0
      ? Math.min(100, Math.round((user.xp / user.xpToNextLevel) * 100))
      : 0

  const favouritePlaces = favourites
    .map((id) => getPlaceById(id))
    .filter(Boolean)

  const streak = computeStreaks(attempts)

  return (
    <div className="page profile-page">
      <Navbar active="Profile" />

      <div className="profile-wrap">
        {error && <p className="form-error">{error}</p>}

        {!user.isAdmin && <DashboardGreeting name={user.fullName} streak={streak} />}

        <div className="profile-top-grid">
          <div className="profile-card profile-summary-card">
            <div className="profile-header-row">
              <img
                src={avatarUrlFor(user.username, user.avatar)}
                alt={t('common.avatarOf', { name: user.username })}
                className="profile-avatar"
              />

              <div>
                <h2 className="profile-name">{user.fullName}</h2>
                <p className="profile-username">@{user.username}</p>

                <p className="profile-level-row">
                  {t('common.level', { level: user.level })} <span className="dot">•</span>{' '}
                  {tTitle(user.title)}
                </p>

                {social && (
                  <p className="profile-social-row">
                    <Link to="/explorers?tab=followers">
                      <strong>{social.followers}</strong>{' '}
                      {t('userProfile.followers', { count: social.followers })}
                    </Link>

                    <span className="dot"> • </span>

                    <Link to="/explorers?tab=following">
                      <strong>{social.following}</strong> {t('userProfile.following')}
                    </Link>
                  </p>
                )}
              </div>
            </div>

            <div className="xp-bar-wrap">
              <div className="xp-bar-track">
                <div
                  className="xp-bar-fill"
                  style={{ width: `${xpPct}%` }}
                />
              </div>

              <p className="xp-bar-label">
                {user.xp.toLocaleString(locale)} /{' '}
                {user.xpToNextLevel.toLocaleString(locale)} XP
              </p>
            </div>

            <div className="profile-stat-grid">
              <div className="profile-stat">
                <p className="profile-stat-value">
                  {user.countriesExplored}
                </p>
                <p className="profile-stat-label">{t('stats.countriesExplored')}</p>
              </div>

              <div className="profile-stat">
                <p className="profile-stat-value">
                  {user.eventsDiscovered}
                </p>
                <p className="profile-stat-label">{t('stats.eventsDiscovered')}</p>
              </div>

              <div className="profile-stat">
                <p className="profile-stat-value">
                  {user.quizzesCompleted}
                </p>
                <p className="profile-stat-label">{t('stats.quizzesCompleted')}</p>
              </div>

              <div className="profile-stat">
                <p className="profile-stat-value">
                  {user.currentStreak}
                </p>
                <p className="profile-stat-label">{t('stats.currentStreak')}</p>
              </div>
            </div>
          </div>

          <div className="profile-card profile-about-card">
            <div className="profile-about-header">
              <h3 className="profile-about-title">{t('profile.aboutMe')}</h3>

              {!isEditingAbout && (
                <button
                  type="button"
                  className="icon-btn"
                  onClick={startEditingAbout}
                  aria-label={t('profile.editAboutMe')}
                >
                  <EditIcon />
                </button>
              )}
            </div>

            {isEditingAbout ? (
              <form onSubmit={saveAbout} className="about-edit-form">
                {aboutError && (
                  <p
                    className="field-error"
                    style={{ margin: '0 0 10px' }}
                  >
                    {aboutError}
                  </p>
                )}

                <label className="field-label" htmlFor="about-bio">
                  {t('profile.bio')}
                </label>

                <textarea
                  id="about-bio"
                  className="about-textarea"
                  value={bioDraft}
                  onChange={(e) => setBioDraft(e.target.value)}
                  maxLength={280}
                  rows={4}
                  placeholder={t('profile.bioPlaceholder')}
                />

                <p className="about-char-count">
                  {bioDraft.length}/280
                </p>

                <label className="field-label" htmlFor="about-location">
                  {t('place.facts.location')}
                </label>

                <div className="field">
                  <input
                    id="about-location"
                    type="text"
                    value={locationDraft}
                    onChange={(e) => setLocationDraft(e.target.value)}
                    maxLength={120}
                    placeholder={t('profile.locationPlaceholder')}
                  />
                  <span className="field-icon">
                    <MapPinIcon />
                  </span>
                </div>

                <label className="field-label">{t('register.avatarLabel')}</label>

                <AvatarPicker
                  value={avatarDraft}
                  onChange={setAvatarDraft}
                  seed={user.username}
                />

                <label className="field-label" htmlFor="about-gender">
                  {t('register.genderLabel')}
                </label>

                <div className="avatar-style-row">
                  <div className="field avatar-style-field">
                    <select
                      id="about-gender"
                      value={genderDraft}
                      onChange={(e) => setGenderDraft(e.target.value)}
                    >
                      <option value="unspecified">{t('profile.preferNotToSay')}</option>
                      <option value="male">{t('register.male')}</option>
                      <option value="female">{t('register.female')}</option>
                    </select>
                  </div>
                </div>

                <p
                  className="about-char-count"
                  style={{ marginTop: -8, marginBottom: 14 }}
                >
                  {t('profile.genderHint')}
                </p>

                <label className="field-label" htmlFor="about-country">
                  {t('register.countryLabel')}
                </label>

                <div className="avatar-style-row">
                  <span
                    className="country-flag-preview"
                    aria-hidden="true"
                  >
                    <CountryFlag code={countryDraft} size={48} />
                  </span>

                  <div className="field avatar-style-field">
                    <select
                      id="about-country"
                      value={countryDraft}
                      onChange={(e) => setCountryDraft(e.target.value)}
                    >
                      <option value="">{t('profile.preferNotToSay')}</option>

                      {COUNTRIES.map((c) => ({ ...c, label: countryName(c.code, locale, c.name) }))
                        .sort((a, b) => a.label.localeCompare(b.label, locale))
                        .map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.label}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <p
                  className="about-char-count"
                  style={{ marginTop: -8, marginBottom: 14 }}
                >
                  Shown on the leaderboard next to your name.
                </p>

                <div className="about-edit-actions">
                  <button
                    type="submit"
                    className="icon-btn icon-btn-save"
                    disabled={savingAbout}
                    aria-label={t('common.save')}
                  >
                    <CheckIcon />{' '}
                    {savingAbout ? t('common.saving') : t('common.save')}
                  </button>

                  <button
                    type="button"
                    className="icon-btn icon-btn-cancel"
                    onClick={cancelEditingAbout}
                    disabled={savingAbout}
                    aria-label={t('common.cancel')}
                  >
                    <XIcon /> {t('common.cancel')}
                  </button>
                </div>
              </form>
            ) : (
              <>
                <p className="profile-about-bio">
                  {user.bio
                    ? user.bio
                    : t('profile.defaultBio', { name: user.fullName.split(' ')[0] })}
                </p>

                {user.location && (
                  <p className="profile-meta-row">
                    <MapPinIcon /> <span>{user.location}</span>
                  </p>
                )}

                {user.country && (
                  <p className="profile-meta-row">
                    <CountryFlag code={user.country} size={16} />
                    <span>
                      {countryName(user.country, locale, countryNameFor(user.country) || user.country)}
                    </span>
                  </p>
                )}

                <p className="profile-meta-row">
                  <CalendarIcon />{' '}
                  <span>{t('profile.joinedOn', { date: formatJoinedDate(user.joinedAt, locale) })}</span>
                </p>
              </>
            )}
          </div>
        </div>

        {!user.isAdmin && (
          <div className="dashboard-activity-grid">
            <ActivityCalendar attempts={attempts} streak={streak} />
            <AttemptedQuizzes attempts={attempts} />
          </div>
        )}

        <div className="favourites-header-row">
          <h3 className="favourites-title">{t('profile.favourites')}</h3>

          <p className="favourites-count">
            <span className="favourites-count-strong">
              {favouritePlaces.length}
            </span>{' '}
            {t('profile.savedPlaces', { count: favouritePlaces.length })}
          </p>
        </div>

        {favouritePlaces.length === 0 ? (
          <OwlNote className="favourites-empty">
            {richText(t('profile.noFavourites'), {
              explore: (text) => <Link to="/explore">{text}</Link>,
            })}
          </OwlNote>
        ) : (
          <div className="favourites-grid">
            {favouritePlaces.map((place) => (
              <div key={place.id} className="favourite-card">
                <Link
                  to={`/place/${place.id}`}
                  className="favourite-card-media"
                >
                  <img src={place.image} alt={place.name} />
                </Link>

                <div className="favourite-card-body">
                  <Link
                    to={`/place/${place.id}`}
                    className="favourite-card-name"
                  >
                    {place.name}
                  </Link>

                  <p className="favourite-card-location">
                    <MapPinIcon size={13} /> {place.location}
                  </p>
                </div>

                <button
                  type="button"
                  className="favourite-card-remove"
                  aria-label={t('profile.removeFavourite', { name: place.name })}
                  onClick={() => removeFavourite(place.id)}
                >
                  <HeartIcon />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="achievements-header-row">
          <h3 className="achievements-title">{t('profile.achievements')}</h3>

          <p className="achievements-count">
            <span className="achievements-count-strong">
              {unlockedCount}/{totalAchievements}
            </span>{' '}
            {t('profile.achievementsUnlocked')}
          </p>
        </div>

        <div className="achievements-filter-row">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className={
                f === filter ? 'filter-pill active' : 'filter-pill'
              }
              onClick={() => setFilter(f)}
            >
              {t(`profile.filters.${f.toLowerCase()}`)}
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
                className={
                  isUnlocked
                    ? 'achievement-card unlocked'
                    : 'achievement-card locked'
                }
                style={{
                  '--progress': progress,
                  '--progress-color': a.color,
                }}
                title={t('profile.percentComplete', { percent: progress })}
              >
                <div
                  className="achievement-icon-badge"
                  style={
                    isUnlocked
                      ? { background: a.color, color: '#151527' }
                      : undefined
                  }
                >
                  {isUnlocked ? <Icon /> : <LockIcon />}
                </div>

                <p className="achievement-title">{t(`achievements.${a.id}.title`)}</p>
                <p className="achievement-description">
                  {t(`achievements.${a.id}.description`)}
                </p>
                <p className="achievement-progress">{progress}%</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
