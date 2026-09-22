import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext.jsx'

const FavouritesContext = createContext(null)

// Favourites are scoped per signed-in account (falls back to a shared
// "guest" bucket when signed out) so switching users doesn't leak one
// person's saved places into another's dashboard.
function storageKeyFor(user) {
  return `chronomap_favourites_${user?.id ?? user?.username ?? 'guest'}`
}

function loadFavourites(key) {
  try {
    const raw = localStorage.getItem(key)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function FavouritesProvider({ children }) {
  const { user } = useAuth()
  const storageKey = storageKeyFor(user)
  const [favourites, setFavourites] = useState(() => loadFavourites(storageKey))

  // Re-read from storage whenever the signed-in account changes (login,
  // logout, or switching accounts) so the right list is shown.
  useEffect(() => {
    setFavourites(loadFavourites(storageKey))
  }, [storageKey])

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(favourites))
  }, [favourites, storageKey])

  // Keep multiple tabs in sync, same pattern as AuthContext.
  useEffect(() => {
    function onStorage(e) {
      if (e.key === storageKey) setFavourites(loadFavourites(storageKey))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [storageKey])

  const isFavourite = useCallback((placeId) => favourites.includes(placeId), [favourites])

  const toggleFavourite = useCallback((placeId) => {
    setFavourites((prev) =>
      prev.includes(placeId) ? prev.filter((id) => id !== placeId) : [...prev, placeId]
    )
  }, [])

  const removeFavourite = useCallback((placeId) => {
    setFavourites((prev) => prev.filter((id) => id !== placeId))
  }, [])

  return (
    <FavouritesContext.Provider value={{ favourites, isFavourite, toggleFavourite, removeFavourite }}>
      {children}
    </FavouritesContext.Provider>
  )
}

export function useFavourites() {
  const ctx = useContext(FavouritesContext)
  if (!ctx) throw new Error('useFavourites must be used within a FavouritesProvider')
  return ctx
}
