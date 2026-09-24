import { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { usePlaces } from '../context/PlacesContext.jsx'
import { adminApi } from '../lib/api.js'
import { avatarUrlFor } from '../lib/avatar.js'
import { PLACES as STATIC_PLACES } from '../data/places.js'

const CATEGORY_OPTIONS = ['Battles', 'Kingdoms', 'Discoveries', 'Revolution', 'Monuments', 'Treaties']
const MAX_IMAGE_BYTES = 3 * 1024 * 1024

const EMPTY_FORM = {
  name: '',
  country: '',
  latitude: '',
  longitude: '',
  category: '',
  year: '',
  yearEra: 'CE',
  summary: '',
  image: '',
}

const REQUIRED_CSV_COLUMNS = [
  'place_name',
  'country',
  'latitude',
  'longitude',
  'event_name',
  'event_type',
  'event_date',
  'description',
]

/* ---------- icons ---------- */

// The "three person" icon used for the total-users stat -- three overlapping
// head-and-shoulders silhouettes, distinct from the single/double-person
// icons already used elsewhere in the app (Navbar, Register).
function ThreePeopleIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="7" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M6 20c.9-3.4 3.1-5.2 6-5.2s5.1 1.8 6 5.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="4" cy="9.5" r="2.1" stroke="currentColor" strokeWidth="1.4" />
      <path d="M1 17.2c.6-2.3 1.9-3.5 3-3.5.7 0 1.3.3 1.9.9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="20" cy="9.5" r="2.1" stroke="currentColor" strokeWidth="1.4" />
      <path d="M23 17.2c-.6-2.3-1.9-3.5-3-3.5-.7 0-1.3.3-1.9.9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function MapPinIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="12" cy="9.5" r="2.3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-9 0 1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function RestoreIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M3 11a9 9 0 1 1 2.6 6.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M3 5v6h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 16l4-4-4-4M20 12H9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M12 20h9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function UploadIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M12 16V4m0 0-4 4m4-4 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function FileCsvIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M15 2v5h5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8 14v4M12 14v4M16 14v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

/* ---------- page ---------- */

export default function AdminDashboard() {
  const { logout, token } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('users')

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="page admin-page">
      <header className="admin-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <span>ChronoMap</span>
          <span className="admin-badge">Admin</span>
        </div>
        <div className="admin-header-actions">
          <Link to="/" className="btn-secondary admin-view-site">View Site</Link>
          <button type="button" className="btn-secondary" onClick={handleLogout}>
            <LogoutIcon /> Log Out
          </button>
        </div>
      </header>

      <div className="admin-wrap">
        <h1 className="admin-title">Admin Dashboard</h1>
        <p className="admin-sub">Manage explorer accounts and the historical places dataset.</p>

        <AdminStats />

        <div className="admin-tabs">
          <button
            type="button"
            className={tab === 'users' ? 'admin-tab active' : 'admin-tab'}
            onClick={() => setTab('users')}
          >
            Users
          </button>
          <button
            type="button"
            className={tab === 'dataset' ? 'admin-tab active' : 'admin-tab'}
            onClick={() => setTab('dataset')}
          >
            Dataset
          </button>
        </div>

        {tab === 'users' ? <UsersPanel token={token} /> : <DatasetPanel token={token} />}
      </div>
    </div>
  )
}

/* ---------- stats row ---------- */

function AdminStats() {
  const { places } = usePlaces()
  const [userCount, setUserCount] = useState(null)
  const { token } = useAuth()

  useEffect(() => {
    let cancelled = false
    adminApi
      .listUsers(token)
      .then((data) => {
        if (!cancelled) setUserCount(data.users.length)
      })
      .catch(() => {
        if (!cancelled) setUserCount(null)
      })
    return () => {
      cancelled = true
    }
  }, [token])

  const countryCount = new Set(places.map((p) => p.location?.split(', ').pop()).filter(Boolean)).size

  return (
    <div className="admin-stats-row">
      <div className="admin-stat-card">
        <span className="admin-stat-icon"><ThreePeopleIcon /></span>
        <div>
          <p className="admin-stat-value">{userCount ?? '—'}</p>
          <p className="admin-stat-label">Registered Users</p>
        </div>
      </div>
      <div className="admin-stat-card">
        <span className="admin-stat-icon"><MapPinIcon /></span>
        <div>
          <p className="admin-stat-value">{places.length}</p>
          <p className="admin-stat-label">Places Live</p>
        </div>
      </div>
      <div className="admin-stat-card">
        <span className="admin-stat-icon"><GlobeIcon /></span>
        <div>
          <p className="admin-stat-value">{countryCount}</p>
          <p className="admin-stat-label">Countries Covered</p>
        </div>
      </div>
    </div>
  )
}

/* ---------- users panel ---------- */

function UsersPanel({ token }) {
  const [users, setUsers] = useState(null)
  const [error, setError] = useState('')
  const [pendingId, setPendingId] = useState(null)

  function load() {
    setError('')
    adminApi
      .listUsers(token)
      .then((data) => setUsers(data.users))
      .catch((err) => setError(err.error || 'Could not load users.'))
  }

  useEffect(load, [token])

  async function handleDelete(u) {
    const ok = window.confirm(`Delete ${u.fullName} (@${u.username})? This can't be undone.`)
    if (!ok) return
    setPendingId(u.id)
    try {
      await adminApi.deleteUser(token, u.id)
      setUsers((list) => list.filter((x) => x.id !== u.id))
    } catch (err) {
      setError(err.error || 'Could not delete that user.')
    } finally {
      setPendingId(null)
    }
  }

  if (error) return <p className="admin-status admin-status-error">{error}</p>
  if (!users) return <p className="admin-status">Loading users…</p>
  if (users.length === 0) return <p className="admin-status">No registered users yet.</p>

  return (
    <div className="admin-table-card">
      <div className="admin-table-header admin-users-grid">
        <span>User</span>
        <span>Email</span>
        <span>Level</span>
        <span>Countries</span>
        <span>Quizzes</span>
        <span />
      </div>
      {users.map((u) => (
        <div className="admin-table-row admin-users-grid" key={u.id}>
          <span className="admin-user-cell">
            <img src={avatarUrlFor(u.username, u.gender)} alt="" className="admin-user-avatar" />
            <span>
              <span className="admin-user-name">{u.fullName}</span>
              <span className="admin-user-handle">@{u.username}</span>
            </span>
          </span>
          <span className="admin-cell-dim">{u.email}</span>
          <span>{u.level}</span>
          <span>{u.countriesExplored}</span>
          <span>{u.quizzesCompleted}</span>
          <span>
            <button
              type="button"
              className="btn-admin-danger"
              disabled={pendingId === u.id}
              onClick={() => handleDelete(u)}
            >
              <TrashIcon /> {pendingId === u.id ? 'Deleting…' : 'Delete'}
            </button>
          </span>
        </div>
      ))}
    </div>
  )
}

/* ---------- dataset panel ---------- */

function DatasetPanel({ token }) {
  const { removedIds, addedPlaces, refresh, getPlaceById } = usePlaces()
  const [pendingId, setPendingId] = useState(null)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)

  const rows = [
    ...STATIC_PLACES.map((p) => ({
      id: p.id,
      name: p.name,
      location: p.location,
      category: p.category,
      source: 'static',
      removed: removedIds.includes(p.id),
    })),
    ...addedPlaces.map((p) => ({
      id: p.id,
      name: p.name,
      location: p.location,
      category: p.category,
      source: 'custom',
      removed: false,
    })),
  ].sort((a, b) => a.name.localeCompare(b.name))

  async function handleRemove(row) {
    setError('')
    setPendingId(row.id)
    try {
      await adminApi.removePlace(token, row.id)
      await refresh()
    } catch (err) {
      setError(err.error || 'Could not update that place.')
    } finally {
      setPendingId(null)
    }
  }

  async function handleRestore(row) {
    setError('')
    setPendingId(row.id)
    try {
      await adminApi.restorePlace(token, row.id)
      await refresh()
    } catch (err) {
      setError(err.error || 'Could not restore that place.')
    } finally {
      setPendingId(null)
    }
  }

  const editingPlace = editingId ? getPlaceById(editingId) : null

  return (
    <div>
      <AddPlaceForm token={token} onAdded={refresh} />
      <CsvImportCard token={token} onImported={refresh} />

      {error && <p className="admin-status admin-status-error">{error}</p>}

      <div className="admin-table-card">
        <div className="admin-table-header admin-places-grid">
          <span>Place</span>
          <span>Category</span>
          <span>Source</span>
          <span>Status</span>
          <span />
        </div>
        {rows.map((row) => (
          <div className="admin-table-row admin-places-grid" key={row.id}>
            <span>
              <span className="admin-user-name">{row.name}</span>
              <span className="admin-user-handle">{row.location}</span>
            </span>
            <span>{row.category}</span>
            <span className="admin-cell-dim">{row.source === 'custom' ? 'Admin-added' : 'Static'}</span>
            <span className={row.removed ? 'admin-status-pill removed' : 'admin-status-pill active'}>
              {row.removed ? 'Removed' : 'Active'}
            </span>
            <span className="admin-row-actions">
              {!row.removed && (
                <button
                  type="button"
                  className="btn-admin-secondary"
                  disabled={pendingId === row.id}
                  onClick={() => setEditingId(row.id)}
                >
                  <EditIcon /> Edit
                </button>
              )}
              {row.removed ? (
                <button
                  type="button"
                  className="btn-admin-secondary"
                  disabled={pendingId === row.id}
                  onClick={() => handleRestore(row)}
                >
                  <RestoreIcon /> {pendingId === row.id ? 'Restoring…' : 'Restore'}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-admin-danger"
                  disabled={pendingId === row.id}
                  onClick={() => handleRemove(row)}
                >
                  <TrashIcon /> {pendingId === row.id ? 'Removing…' : row.source === 'custom' ? 'Delete' : 'Remove'}
                </button>
              )}
            </span>
          </div>
        ))}
      </div>

      {editingPlace && (
        <EditPlaceModal
          place={editingPlace}
          token={token}
          onClose={() => setEditingId(null)}
          onSaved={refresh}
        />
      )}
    </div>
  )
}

function EditPlaceModal({ place, token, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: place.name || '',
    category: place.category || '',
    image: place.image || '',
    summary: place.summary || place.overview || '',
  })
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  function updateField(key) {
    return (e) => {
      setForm((f) => ({ ...f, [key]: e.target.value }))
      setFieldErrors((errs) => {
        if (!errs[key]) return errs
        const next = { ...errs }
        delete next[key]
        return next
      })
    }
  }

  function handleImageFile(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (file.size > MAX_IMAGE_BYTES) {
      setFieldErrors((errs) => ({ ...errs, image: 'Please choose an image under 3MB.' }))
      return
    }
    const reader = new FileReader()
    reader.onload = () => setForm((f) => ({ ...f, image: reader.result }))
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')
    setFieldErrors({})
    setSubmitting(true)
    try {
      await adminApi.editPlace(token, place.id, form)
      await onSaved()
      onClose()
    } catch (err) {
      if (err.fieldErrors) setFieldErrors(err.fieldErrors)
      setFormError(err.error || 'Could not save changes.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h2 className="admin-panel-title">Edit {place.name}</h2>
          <button type="button" className="admin-modal-close" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {formError && <p className="form-error" role="alert">{formError}</p>}

          <div className="admin-form-grid">
            <div>
              <label className="field-label" htmlFor="ep-name">Name</label>
              <div className={`field${fieldErrors.name ? ' field-invalid' : ''}`}>
                <input id="ep-name" type="text" value={form.name} onChange={updateField('name')} />
              </div>
              {fieldErrors.name && <p className="field-error">{fieldErrors.name}</p>}
            </div>

            <div>
              <label className="field-label" htmlFor="ep-category">Category</label>
              <div className={`field${fieldErrors.category ? ' field-invalid' : ''}`}>
                <select id="ep-category" value={form.category} onChange={updateField('category')}>
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              {fieldErrors.category && <p className="field-error">{fieldErrors.category}</p>}
            </div>

            <div className="admin-form-full">
              <label className="field-label">Image</label>
              {form.image && <img src={form.image} alt="" className="admin-image-preview" />}
              <div className="admin-image-row">
                <div className={`field${fieldErrors.image ? ' field-invalid' : ''}`}>
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={form.image?.startsWith('data:') ? '' : form.image}
                    onChange={updateField('image')}
                  />
                </div>
                <button type="button" className="btn-secondary admin-upload-btn" onClick={() => fileInputRef.current?.click()}>
                  <UploadIcon /> Upload
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleImageFile} />
              </div>
              {fieldErrors.image && <p className="field-error">{fieldErrors.image}</p>}
            </div>

            <div className="admin-form-full">
              <label className="field-label" htmlFor="ep-summary">Summary / Overview</label>
              <div className={`field admin-textarea-field${fieldErrors.summary ? ' field-invalid' : ''}`}>
                <textarea id="ep-summary" rows={4} value={form.summary} onChange={updateField('summary')} />
              </div>
              {fieldErrors.summary && <p className="field-error">{fieldErrors.summary}</p>}
            </div>
          </div>

          <div className="admin-modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function CsvImportCard({ token, onImported }) {
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  function handleFileChosen(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setError('')
    setResult(null)
    setImporting(true)

    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const data = await adminApi.bulkImportPlaces(token, reader.result)
        setResult(data)
        await onImported()
      } catch (err) {
        setError(err.error || 'Could not import that file.')
      } finally {
        setImporting(false)
      }
    }
    reader.onerror = () => {
      setError('Could not read that file.')
      setImporting(false)
    }
    reader.readAsText(file)
  }

  return (
    <div className="admin-add-form admin-csv-card">
      <h2 className="admin-panel-title"><FileCsvIcon /> Import a CSV</h2>
      <p className="admin-csv-help">
        Feed in a whole dataset at once. Columns required:{' '}
        <code>{REQUIRED_CSV_COLUMNS.join(', ')}</code>. Rows sharing the same{' '}
        <code>place_name</code> are combined into one place with a multi-event timeline.
      </p>

      {error && <p className="form-error" role="alert">{error}</p>}

      <button type="button" className="btn-primary" disabled={importing} onClick={() => fileInputRef.current?.click()}>
        <UploadIcon /> {importing ? 'Importing…' : 'Choose CSV File'}
      </button>
      <input ref={fileInputRef} type="file" accept=".csv,text/csv" hidden onChange={handleFileChosen} />

      {result && (
        <div className="admin-csv-result">
          <p className="admin-success">
            {result.addedCount} place{result.addedCount === 1 ? '' : 's'} added.
            {result.skipped.length > 0 && ` ${result.skipped.length} skipped (already in the dataset).`}
            {result.errors.length > 0 && ` ${result.errors.length} row error${result.errors.length === 1 ? '' : 's'}.`}
          </p>
          {result.skipped.length > 0 && (
            <details className="admin-csv-details">
              <summary>Skipped places</summary>
              <ul>
                {result.skipped.map((s, i) => (
                  <li key={i}>{s.name} — {s.reason}</li>
                ))}
              </ul>
            </details>
          )}
          {result.errors.length > 0 && (
            <details className="admin-csv-details">
              <summary>Row errors</summary>
              <ul>
                {result.errors.map((e, i) => (
                  <li key={i}>Row {e.row}: {e.message}</li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}
    </div>
  )
}

function AddPlaceForm({ token, onAdded }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  function updateField(key) {
    return (e) => {
      setForm((f) => ({ ...f, [key]: e.target.value }))
      setFieldErrors((errs) => {
        if (!errs[key]) return errs
        const next = { ...errs }
        delete next[key]
        return next
      })
    }
  }

  function handleImageFile(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (file.size > MAX_IMAGE_BYTES) {
      setFieldErrors((errs) => ({ ...errs, image: 'Please choose an image under 3MB.' }))
      return
    }
    const reader = new FileReader()
    reader.onload = () => setForm((f) => ({ ...f, image: reader.result }))
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')
    setSuccessMsg('')
    setSubmitting(true)
    try {
      await adminApi.addPlace(token, {
        name: form.name,
        country: form.country,
        latitude: form.latitude,
        longitude: form.longitude,
        category: form.category,
        year: form.year,
        yearEra: form.yearEra,
        summary: form.summary,
        image: form.image,
      })
      setForm(EMPTY_FORM)
      setSuccessMsg(`${form.name} was added to the dataset.`)
      await onAdded()
    } catch (err) {
      if (err.fieldErrors) setFieldErrors(err.fieldErrors)
      setFormError(err.error || 'Could not add that place.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="admin-add-form" onSubmit={handleSubmit}>
      <h2 className="admin-panel-title"><PlusIcon /> Add a Place</h2>
      {formError && <p className="form-error" role="alert">{formError}</p>}
      {successMsg && <p className="admin-success">{successMsg}</p>}

      <div className="admin-form-grid">
        <div>
          <label className="field-label" htmlFor="ap-name">Name</label>
          <div className={`field${fieldErrors.name ? ' field-invalid' : ''}`}>
            <input id="ap-name" type="text" value={form.name} onChange={updateField('name')} placeholder="e.g. Petra" />
          </div>
          {fieldErrors.name && <p className="field-error">{fieldErrors.name}</p>}
        </div>

        <div>
          <label className="field-label" htmlFor="ap-country">Country</label>
          <div className={`field${fieldErrors.country ? ' field-invalid' : ''}`}>
            <input id="ap-country" type="text" value={form.country} onChange={updateField('country')} placeholder="e.g. Jordan" />
          </div>
          {fieldErrors.country && <p className="field-error">{fieldErrors.country}</p>}
        </div>

        <div>
          <label className="field-label" htmlFor="ap-lat">Latitude</label>
          <div className={`field${fieldErrors.latitude ? ' field-invalid' : ''}`}>
            <input id="ap-lat" type="number" step="any" value={form.latitude} onChange={updateField('latitude')} placeholder="30.33" />
          </div>
          {fieldErrors.latitude && <p className="field-error">{fieldErrors.latitude}</p>}
        </div>

        <div>
          <label className="field-label" htmlFor="ap-lng">Longitude</label>
          <div className={`field${fieldErrors.longitude ? ' field-invalid' : ''}`}>
            <input id="ap-lng" type="number" step="any" value={form.longitude} onChange={updateField('longitude')} placeholder="35.44" />
          </div>
          {fieldErrors.longitude && <p className="field-error">{fieldErrors.longitude}</p>}
        </div>

        <div>
          <label className="field-label" htmlFor="ap-category">Category</label>
          <div className={`field${fieldErrors.category ? ' field-invalid' : ''}`}>
            <select id="ap-category" value={form.category} onChange={updateField('category')}>
              <option value="" disabled>Select a category</option>
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          {fieldErrors.category && <p className="field-error">{fieldErrors.category}</p>}
        </div>

        <div className="admin-year-field">
          <label className="field-label" htmlFor="ap-year">Year</label>
          <div className="admin-year-row">
            <div className={`field${fieldErrors.year ? ' field-invalid' : ''}`}>
              <input id="ap-year" type="number" min="0" value={form.year} onChange={updateField('year')} placeholder="106" />
            </div>
            <div className={`field${fieldErrors.yearEra ? ' field-invalid' : ''}`}>
              <select value={form.yearEra} onChange={updateField('yearEra')}>
                <option value="CE">CE</option>
                <option value="BCE">BCE</option>
              </select>
            </div>
          </div>
          {fieldErrors.year && <p className="field-error">{fieldErrors.year}</p>}
        </div>

        <div className="admin-form-full">
          <label className="field-label" htmlFor="ap-summary">Short Description</label>
          <div className={`field admin-textarea-field${fieldErrors.summary ? ' field-invalid' : ''}`}>
            <textarea
              id="ap-summary"
              rows={3}
              value={form.summary}
              onChange={updateField('summary')}
              placeholder="One or two sentences about what happened here."
            />
          </div>
          {fieldErrors.summary && <p className="field-error">{fieldErrors.summary}</p>}
        </div>

        <div className="admin-form-full">
          <label className="field-label">Image (optional)</label>
          {form.image && <img src={form.image} alt="" className="admin-image-preview" />}
          <div className="admin-image-row">
            <div className={`field${fieldErrors.image ? ' field-invalid' : ''}`}>
              <input
                type="text"
                placeholder="Image URL, or leave blank for a placeholder"
                value={form.image?.startsWith('data:') ? '' : form.image}
                onChange={updateField('image')}
              />
            </div>
            <button type="button" className="btn-secondary admin-upload-btn" onClick={() => fileInputRef.current?.click()}>
              <UploadIcon /> Upload
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleImageFile} />
          </div>
          {fieldErrors.image && <p className="field-error">{fieldErrors.image}</p>}
        </div>
      </div>

      <button type="submit" className="btn-primary admin-add-submit" disabled={submitting}>
        <PlusIcon /> {submitting ? 'Adding…' : 'Add Place'}
      </button>
    </form>
  )
}
