import { createContext, useContext, useEffect, useState } from 'react'

/**
 * Available themes for ChronoMap. Each theme has a dark and a light version
 * (see the [data-theme] / [data-mode] blocks in index.css), so the theme
 * picks the palette and the mode picks light or dark.
 *
 * cosmos   – deep navy / cool blue-white (default)
 * ancient  – warm parchment / papyrus historical theme
 * obsidian – volcanic black + amber embers / warm grey
 * aurora   – northern-lights teal-green / mint
 */
export const THEMES = [
  { id: 'cosmos',   label: 'Cosmos',   icon: '🌌' },
  { id: 'ancient',  label: 'Ancient',  icon: '🏛️' },
  { id: 'obsidian', label: 'Obsidian', icon: '🌋' },
  { id: 'aurora',   label: 'Aurora',   icon: '🌌' },
]

export const MODES = ['dark', 'light']

const ThemeContext = createContext(null)

// First visit: follow the operating system's light/dark preference.
function initialMode() {
  try {
    const saved = localStorage.getItem('chronomap-mode')
    if (MODES.includes(saved)) return saved
  } catch {
    /* storage unavailable */
  }
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: light)').matches) return 'light'
  return 'dark'
}

export function ThemeProvider({ children }) {
  const [themeIndex, setThemeIndex] = useState(() => {
    try {
      const saved = localStorage.getItem('chronomap-theme')
      const idx = THEMES.findIndex((t) => t.id === saved)
      return idx >= 0 ? idx : 0
    } catch {
      return 0
    }
  })
  const [mode, setModeState] = useState(initialMode)

  const theme = THEMES[themeIndex]

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme.id)
    try {
      localStorage.setItem('chronomap-theme', theme.id)
    } catch { /* ignore */ }
  }, [theme.id])

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', mode)
    try {
      localStorage.setItem('chronomap-mode', mode)
    } catch { /* ignore */ }
  }, [mode])

  /** Jump directly to any theme by its id string */
  function setTheme(themeId) {
    const idx = THEMES.findIndex((t) => t.id === themeId)
    if (idx >= 0) setThemeIndex(idx)
  }

  /** Cycle to the next theme (kept for convenience) */
  function cycleTheme() {
    setThemeIndex((i) => (i + 1) % THEMES.length)
  }

  function setMode(next) {
    if (MODES.includes(next)) setModeState(next)
  }

  function toggleMode() {
    setModeState((m) => (m === 'dark' ? 'light' : 'dark'))
  }

  return (
    <ThemeContext.Provider value={{ theme, cycleTheme, setTheme, themes: THEMES, mode, setMode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
