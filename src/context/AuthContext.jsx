import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { authApi, saveSession, getToken, getStoredUser, clearSession } from '../lib/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getToken())
  const [user, setUser] = useState(() => getStoredUser())

  const login = useCallback((data) => {
    saveSession(data)
    setToken(data.token)
    setUser(data.user)
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setToken(null)
    setUser(null)
  }, [])

  // Pulls the latest profile/stats from the server and refreshes local state.
  const refreshUser = useCallback(async () => {
    const current = getToken()
    if (!current) return null
    try {
      const data = await authApi.me(current)
      setUser(data.user)
      localStorage.setItem('chronomap_user', JSON.stringify(data.user))
      return data.user
    } catch {
      // Token expired/invalid - log the user out locally.
      clearSession()
      setToken(null)
      setUser(null)
      return null
    }
  }, [])

  // Keep multiple tabs in sync.
  useEffect(() => {
    function onStorage(e) {
      if (e.key === 'chronomap_token') setToken(getToken())
      if (e.key === 'chronomap_user') setUser(getStoredUser())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated: Boolean(token), login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
