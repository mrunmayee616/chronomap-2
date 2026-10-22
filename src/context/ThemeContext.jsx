import { createContext, useContext, useEffect, useState } from 'react'

/**
 * Available themes for ChronoMap.
 *
 * cosmos   – original deep-navy dark theme (default)
 * ancient  – warm parchment / papyrus historical theme
 * obsidian – volcanic black + amber-ember accent
 * aurora   – northern-lights teal-green on near-black
 */
export const THEMES = [
  { id: 'cosmos',   label: 'Cosmos',   icon: '🌌' },
  { id: 'ancient',  label: 'Ancient',  icon: '🏛️' },
  { id: 'obsidian', label: 'Obsidian', icon: '🌋' },
  { id: 'aurora',   label: 'Aurora',   icon: '🌌' },
]

const ThemeContext = createContext(null)

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

  const theme = THEMES[themeIndex]

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme.id)
    try {
      localStorage.setItem('chronomap-theme', theme.id)
    } catch { /* ignore */ }
  }, [theme.id])

  /** Jump directly to any theme by its id string */
  function setTheme(themeId) {
    const idx = THEMES.findIndex((t) => t.id === themeId)
    if (idx >= 0) setThemeIndex(idx)
  }

  /** Cycle to the next theme (kept for convenience) */
  function cycleTheme() {
    setThemeIndex((i) => (i + 1) % THEMES.length)
  }

  return (
    <ThemeContext.Provider value={{ theme, cycleTheme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
