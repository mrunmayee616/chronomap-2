import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { usersApi } from '../lib/api.js'
import { useT } from '../i18n/LanguageContext.jsx'

// Follow / Unfollow toggle for one explorer. The parent owns the truth
// (`isFollowing`) and is told the new state through `onChange(isFollowing,
// counts)`, so lists and profile headers stay in sync. Hidden for the
// admin account, which has no explorer profile to follow from.
export default function FollowButton({ username, isFollowing, onChange, size = 'md' }) {
  const { token, user } = useAuth()
  const t = useT()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  if (user?.isAdmin) return null

  async function toggle(e) {
    e.preventDefault()
    e.stopPropagation()
    if (pending) return
    setPending(true)
    setError('')
    try {
      const data = isFollowing ? await usersApi.unfollow(token, username) : await usersApi.follow(token, username)
      onChange?.(data.isFollowing, data)
    } catch (err) {
      setError(err.error || t('common.genericError'))
    } finally {
      setPending(false)
    }
  }

  const cls = `follow-btn follow-btn-${size}${isFollowing ? ' following' : ''}`
  return (
    <span className="follow-btn-wrap">
      <button
        type="button"
        className={cls}
        onClick={toggle}
        disabled={pending}
        aria-pressed={isFollowing}
      >
        {pending ? '…' : isFollowing ? t('follow.following') : t('follow.follow')}
      </button>
      {error && <span className="follow-btn-error" role="alert">{error}</span>}
    </span>
  )
}
