const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  let res
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    // Network failure (server down, CORS, wrong URL, etc.)
    const err = new Error('Could not reach the server. Please check your connection and try again.')
    err.error = err.message
    err.networkError = true
    throw err
  }

  let data = {}
  try {
    data = await res.json()
  } catch {
    // Empty or non-JSON body is fine for some responses.
  }

  if (!res.ok) {
    const err = new Error(data.error || `Request failed with status ${res.status}`)
    Object.assign(err, data, { status: res.status })
    throw err
  }

  return data
}

export const authApi = {
  register: (payload) => request('/api/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/api/auth/login', { method: 'POST', body: payload }),
  me: (token) => request('/api/auth/me', { token }),
  updateProfile: (token, payload) => request('/api/auth/me', { method: 'PATCH', body: payload, token }),
}

export const progressApi = {
  // Records a place visit -- the server recomputes countriesExplored from
  // scratch, so calling this again for a place already visited is a no-op.
  visitPlace: (token, placeId) =>
    request('/api/progress/visit-place', { method: 'POST', body: { placeId }, token }),
  // Records a quiz attempt's score. The server only counts it toward
  // quizzesCompleted the first time this place's quiz is passed (>= 80%);
  // reattempts never increment it again.
  submitQuizResult: (token, placeId, scorePercent) =>
    request('/api/progress/quiz-result', { method: 'POST', body: { placeId, scorePercent }, token }),
}

export const leaderboardApi = {
  // period: 'week' | 'month' | 'year'. Ranking is computed live on the
  // server from each user's XP history, so this always reflects the
  // latest scores -- there's nothing to keep in sync on the client.
  get: (token, period) =>
    request(`/api/leaderboard?period=${encodeURIComponent(period)}`, { token }),
}

export const placesApi = {
  // Public -- the delta (hidden static places + admin-added ones) that
  // every client merges into the bundled static dataset. See
  // src/context/PlacesContext.jsx.
  overrides: () => request('/api/places/overrides'),
}

export const adminApi = {
  listUsers: (token) => request('/api/admin/users', { token }),
  deleteUser: (token, userId) =>
    request(`/api/admin/users/${encodeURIComponent(userId)}`, { method: 'DELETE', token }),
  addPlace: (token, payload) =>
    request('/api/admin/places', { method: 'POST', body: payload, token }),
  removePlace: (token, placeId) =>
    request(`/api/admin/places/${encodeURIComponent(placeId)}`, { method: 'DELETE', token }),
  restorePlace: (token, placeId) =>
    request(`/api/admin/places/${encodeURIComponent(placeId)}/restore`, { method: 'POST', token }),
}

const TOKEN_KEY = 'chronomap_token'
const USER_KEY = 'chronomap_user'

export function saveSession({ token, user }) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
