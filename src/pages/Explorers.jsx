import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import FollowButton from '../components/FollowButton.jsx'
import CountryFlag from '../components/CountryFlag.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { usersApi } from '../lib/api.js'
import { avatarUrlFor } from '../lib/avatar.js'

const TABS = [
  { key: 'find', label: 'Find explorers' },
  { key: 'following', label: 'Following' },
  { key: 'followers', label: 'Followers' },
]

function ExplorerRow({ person, showFollow, onFollowChange }) {
  return (
    <div className="explorer-row">
      <Link to={`/u/${encodeURIComponent(person.username)}`} className="explorer-row-main">
        <img src={avatarUrlFor(person.username, person.avatar)} alt="" className="explorer-avatar" />
        <span className="explorer-names">
          <span className="explorer-fullname">{person.fullName}</span>
          <span className="explorer-username">@{person.username}</span>
        </span>
        <span className="explorer-level">
          Level {person.level} <span className="dot">•</span> {person.title}
        </span>
        {person.country && <CountryFlag code={person.country} size={18} className="explorer-flag" />}
      </Link>
      {showFollow && (
        <FollowButton
          username={person.username}
          isFollowing={person.isFollowing}
          onChange={(next) => onFollowChange(person.id, next)}
        />
      )}
    </div>
  )
}

export default function Explorers() {
  const { token, user } = useAuth()
  const [params, setParams] = useSearchParams()
  const tab = TABS.some((t) => t.key === params.get('tab')) ? params.get('tab') : 'find'

  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searched, setSearched] = useState('')
  const [tooShort, setTooShort] = useState(false)
  const [listUsers, setListUsers] = useState([])
  const [counts, setCounts] = useState({ followersCount: 0, followingCount: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const latest = useRef(0)

  const isAdmin = Boolean(user?.isAdmin)

  // Debounced search: wait for a pause in typing, and ignore any response
  // that has been overtaken by a newer request.
  useEffect(() => {
    if (tab !== 'find') return undefined
    const q = query.trim()
    if (q.length < 2) {
      setResults([])
      setSearched('')
      setTooShort(q.length > 0)
      setError('')
      return undefined
    }
    setTooShort(false)
    const ticket = ++latest.current
    const timer = setTimeout(async () => {
      setLoading(true)
      setError('')
      try {
        const data = await usersApi.search(token, q)
        if (ticket !== latest.current) return
        setResults(data.users)
        setSearched(q)
      } catch (err) {
        if (ticket === latest.current) setError(err.error || 'Search failed. Please try again.')
      } finally {
        if (ticket === latest.current) setLoading(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query, tab, token])

  // Following / Followers lists for the signed-in explorer.
  useEffect(() => {
    if (tab === 'find' || isAdmin || !user) return
    let cancelled = false
    setLoading(true)
    setError('')
    const load = tab === 'following' ? usersApi.following : usersApi.followers
    load(token, user.username)
      .then((data) => {
        if (cancelled) return
        setListUsers(data.users)
        setCounts({ followersCount: data.followersCount, followingCount: data.followingCount })
      })
      .catch((err) => !cancelled && setError(err.error || 'Could not load this list.'))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [tab, token, user, isAdmin])

  function setTab(key) {
    setParams(key === 'find' ? {} : { tab: key })
  }

  function updateFollow(setter) {
    return (id, next) => setter((list) => list.map((p) => (p.id === id ? { ...p, isFollowing: next } : p)))
  }

  // On the Following tab, unfollowing removes the row straight away.
  function onFollowingTabChange(id, next) {
    if (tab === 'following' && !next) {
      setListUsers((list) => list.filter((p) => p.id !== id))
      setCounts((c) => ({ ...c, followingCount: Math.max(0, c.followingCount - 1) }))
    } else {
      updateFollow(setListUsers)(id, next)
    }
  }

  return (
    <div className="page explorers-page">
      <Navbar active="Explorers" />
      <div className="explorers-wrap">
        <h1 className="explorers-title">Explorers</h1>
        <p className="explorers-sub">
          Find other explorers and follow the ones you want to keep an eye on. Following is optional.
        </p>

        <div className="leaderboard-tabs explorers-tabs" role="tablist">
          {TABS.filter((t) => !(isAdmin && t.key !== 'find')).map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={tab === t.key}
              className={tab === t.key ? 'leaderboard-tab active' : 'leaderboard-tab'}
              onClick={() => setTab(t.key)}
            >
              {t.label}
              {t.key === 'following' && tab !== 'find' && ` (${counts.followingCount})`}
              {t.key === 'followers' && tab !== 'find' && ` (${counts.followersCount})`}
            </button>
          ))}
        </div>

        {tab === 'find' && (
          <div className="explorers-search field">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by username or name…"
              aria-label="Search explorers"
              autoFocus
            />
          </div>
        )}

        {error && <p className="form-error" role="alert">{error}</p>}

        <div className="explorers-list">
          {tab === 'find' && (
            <>
              {tooShort && <p className="explorers-hint">Type at least 2 characters to search.</p>}
              {!tooShort && query.trim().length === 0 && (
                <p className="explorers-hint">Start typing a username or name to find other explorers.</p>
              )}
              {loading && <p className="explorers-hint">Searching…</p>}
              {!loading && searched && results.length === 0 && (
                <p className="explorers-hint">No explorers found for “{searched}”.</p>
              )}
              {results.map((p) => (
                <ExplorerRow
                  key={p.id}
                  person={p}
                  showFollow={!isAdmin}
                  onFollowChange={updateFollow(setResults)}
                />
              ))}
            </>
          )}

          {tab !== 'find' && (
            <>
              {loading && <p className="explorers-hint">Loading…</p>}
              {!loading && !error && listUsers.length === 0 && (
                <p className="explorers-hint">
                  {tab === 'following'
                    ? "You're not following anyone yet. Use “Find explorers” to get started."
                    : 'No followers yet.'}
                </p>
              )}
              {listUsers.map((p) => (
                <ExplorerRow key={p.id} person={p} showFollow onFollowChange={onFollowingTabChange} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
