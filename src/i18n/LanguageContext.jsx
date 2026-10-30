import { Fragment, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import en from './en.js'
import fr from './fr.js'
import es from './es.js'
import de from './de.js'
import pt from './pt.js'
import ru from './ru.js'
import ar from './ar.js'
import it from './it.js'
import nl from './nl.js'
import ja from './ja.js'
import ko from './ko.js'
import zh from './zh.js'
import hi from './hi.js'
import tr from './tr.js'
import pl from './pl.js'
import id from './id.js'
import sv from './sv.js'
import el from './el.js'
import uk from './uk.js'
import ro from './ro.js'

/**
 * Interface languages. `native` is how each language names itself, which is
 * what the picker shows so people can always find their own language.
 * Sorted alphabetically by native name so the picker is easy to scan.
 */
export const LANGUAGES = [
  { id: 'en', native: 'English',     locale: 'en-GB' },
  { id: 'ar', native: 'العربية',     locale: 'ar-SA' },
  { id: 'zh', native: '中文',         locale: 'zh-CN' },
  { id: 'de', native: 'Deutsch',     locale: 'de-DE' },
  { id: 'el', native: 'Ελληνικά',    locale: 'el-GR' },
  { id: 'es', native: 'Español',     locale: 'es-ES' },
  { id: 'fr', native: 'Français',    locale: 'fr-FR' },
  { id: 'hi', native: 'हिन्दी',      locale: 'hi-IN' },
  { id: 'id', native: 'Indonesia',   locale: 'id-ID' },
  { id: 'it', native: 'Italiano',    locale: 'it-IT' },
  { id: 'ja', native: '日本語',       locale: 'ja-JP' },
  { id: 'ko', native: '한국어',       locale: 'ko-KR' },
  { id: 'nl', native: 'Nederlands',  locale: 'nl-NL' },
  { id: 'pl', native: 'Polski',      locale: 'pl-PL' },
  { id: 'pt', native: 'Português',   locale: 'pt-BR' },
  { id: 'ro', native: 'Română',      locale: 'ro-RO' },
  { id: 'ru', native: 'Русский',     locale: 'ru-RU' },
  { id: 'sv', native: 'Svenska',     locale: 'sv-SE' },
  { id: 'tr', native: 'Türkçe',      locale: 'tr-TR' },
  { id: 'uk', native: 'Українська',  locale: 'uk-UA' },
]

const DICTIONARIES = { en, fr, es, de, pt, ru, ar, it, nl, ja, ko, zh, hi, tr, pl, id, sv, el, uk, ro }
const STORAGE_KEY = 'chronomap-language'

// First visit: use the browser's language if we support it, else English.
function initialLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (DICTIONARIES[saved]) return saved
  } catch {
    /* storage unavailable */
  }
  const browser = (typeof navigator !== 'undefined' && navigator.language) || 'en'
  const code = browser.slice(0, 2).toLowerCase()
  return DICTIONARIES[code] ? code : 'en'
}

function lookup(dict, key) {
  return key.split('.').reduce((node, part) => (node && typeof node === 'object' ? node[part] : undefined), dict)
}

// "Hello {name}" + { name: 'Ada' } -> "Hello Ada"
function interpolate(text, vars) {
  if (!vars) return text
  return text.replace(/\{(\w+)\}/g, (match, name) => (vars[name] !== undefined ? String(vars[name]) : match))
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(initialLanguage)
  const current = LANGUAGES.find((l) => l.id === language) || LANGUAGES[0]

  useEffect(() => {
    document.documentElement.setAttribute('lang', language)
    try {
      localStorage.setItem(STORAGE_KEY, language)
    } catch {
      /* ignore */
    }
  }, [language])

  const setLanguage = useCallback((id) => {
    if (DICTIONARIES[id]) setLanguageState(id)
  }, [])

  /**
   * t('nav.home') -> translated text, falling back to English and then to
   * the key itself, so a missing translation never breaks the page.
   *
   * Plurals: pass `count` and define `key.one` / `key.other` (the forms
   * Intl.PluralRules returns for the language), e.g.
   *   places: { one: '{count} place', other: '{count} places' }
   */
  const t = useCallback(
    (key, vars) => {
      let entry = lookup(DICTIONARIES[language], key)
      if (entry === undefined) entry = lookup(en, key)
      if (entry && typeof entry === 'object' && vars && typeof vars.count === 'number') {
        const form = new Intl.PluralRules(current.locale).select(vars.count)
        entry = entry[form] ?? entry.other ?? lookup(en, key)?.[form] ?? lookup(en, key)?.other
      }
      if (typeof entry !== 'string') return key
      return interpolate(entry, vars)
    },
    [language, current.locale]
  )

  // Level titles ("New Explorer"…) arrive from the server in English; show
  // the translated one when we know it, otherwise the original text.
  const tTitle = useCallback(
    (title) => {
      if (!title) return title
      const key = `titles.${title.replace(/\s+/g, '').toLowerCase()}`
      const translated = t(key)
      return translated === key ? title : translated
    },
    [t]
  )

  // Fixed dataset values such as categories ('Battles') and eras ('Ancient'):
  // tValue('categories', 'Battles') -> 'Batailles', or the value itself if
  // there's no translation for it.
  const tValue = useCallback(
    (group, raw) => {
      if (!raw) return raw
      const key = `${group}.${raw}`
      const translated = t(key)
      return translated === key ? raw : translated
    },
    [t]
  )

  const value = useMemo(
    () => ({ language, locale: current.locale, languages: LANGUAGES, current, setLanguage, t, tTitle, tValue }),
    [language, current, setLanguage, t, tTitle, tValue]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider')
  return ctx
}

/** Shorthand for components that only need the translate function. */
export function useT() {
  return useLanguage().t
}

/**
 * A country's name in the current language, from the browser's built-in
 * translations (Intl.DisplayNames), e.g. countryName('DE', 'fr-FR') ->
 * 'Allemagne'. Falls back to `fallback` (usually the English name) if the
 * browser can't name it.
 */
export function countryName(code, locale, fallback = code) {
  if (!code) return fallback
  try {
    return new Intl.DisplayNames([locale], { type: 'region' }).of(code.toUpperCase()) || fallback
  } catch {
    return fallback
  }
}

/**
 * Renders a translated string that marks up parts of itself, so each
 * language can keep its own word order around highlighted words:
 *   richText('Explore <accent>History.</accent><br/>Understand the World', {
 *     accent: (text) => <span className="accent">{text}</span>,
 *   })
 * Supports <tag>…</tag> (looked up in `tags`) and <br/>.
 */
export function richText(text, tags = {}) {
  const out = []
  const re = /<(\w+)>([\s\S]*?)<\/\1>|<br\s*\/>/g
  let last = 0
  let match
  while ((match = re.exec(text))) {
    if (match.index > last) out.push(text.slice(last, match.index))
    if (match[0].startsWith('<br')) out.push(<br key={out.length} />)
    else {
      const render = tags[match[1]]
      out.push(<Fragment key={out.length}>{render ? render(match[2]) : match[2]}</Fragment>)
    }
    last = re.lastIndex
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}
