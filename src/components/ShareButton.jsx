import { useEffect, useRef, useState } from 'react'

/* ---------- icons ---------- */

function Svg({ children, size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {children}
    </svg>
  )
}

const stroke = { stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }

function ShareIcon() {
  return (
    <Svg>
      <circle cx="18" cy="5" r="2.6" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="6" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="18" cy="19" r="2.6" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8.3 10.7l7.4-4.2M8.3 13.3l7.4 4.2" {...stroke} />
    </Svg>
  )
}

function LinkIcon() {
  return (
    <Svg>
      <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" {...stroke} />
      <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" {...stroke} />
    </Svg>
  )
}

function CheckIcon() {
  return (
    <Svg>
      <path d="M5 12.5l4.5 4.5L19 7.5" {...stroke} />
    </Svg>
  )
}

function WhatsAppIcon() {
  return (
    <Svg>
      <path d="M21 12a8.5 8.5 0 0 1-12.4 7.5L3 21l1.6-5.4A8.5 8.5 0 1 1 21 12z" {...stroke} />
      <path d="M9 8.8c.3 2.6 2.6 5 5.2 5.4l1.2-1.2-1.9-1-.8.7c-.9-.4-1.7-1.2-2.1-2.1l.7-.8-1-1.9L9 8.8z" {...stroke} />
    </Svg>
  )
}

function XIcon() {
  return (
    <Svg>
      <path d="M5 4l14 16M19 4L5 20" {...stroke} />
    </Svg>
  )
}

function FacebookIcon() {
  return (
    <Svg>
      <path d="M14.5 8H17V4.5h-2.5A4 4 0 0 0 10.5 8.5V11H8v3.5h2.5V21h3.5v-6.5h2.6l.4-3.5H14v-2c0-.6.2-1 .5-1z" fill="currentColor" />
    </Svg>
  )
}

function TelegramIcon() {
  return (
    <Svg>
      <path d="M21 4L3 11l6 2.5L11.5 20l3-4.5L19 19 21 4z" {...stroke} />
      <path d="M9 13.5L21 4" {...stroke} />
    </Svg>
  )
}

function MailIcon() {
  return (
    <Svg>
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3.5 7l8.5 6 8.5-6" {...stroke} />
    </Svg>
  )
}

/* ---------- helpers ---------- */

// Clipboard API needs a secure context (https / localhost); fall back to the
// old execCommand route so copying still works elsewhere.
async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // fall through to the legacy method
  }
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch {
    return false
  }
}

/* ---------- component ---------- */

/**
 * Share button + popover menu.
 *   title  - short heading, e.g. "The Colosseum"
 *   text   - one-line description used in the message that gets shared
 *   path   - on-site path to share, e.g. "/place/colosseum"
 */
export default function ShareButton({ title, text, path }) {
  const [open, setOpen] = useState(false)
  const [copyState, setCopyState] = useState('idle') // 'idle' | 'copied' | 'failed'
  const wrapRef = useRef(null)
  const triggerRef = useRef(null)
  const inputRef = useRef(null)
  const menuRef = useRef(null)

  const url = typeof window !== 'undefined' ? new URL(path, window.location.origin).toString() : path
  const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'

  // Close on outside click or Escape while open.
  useEffect(() => {
    if (!open) return undefined
    function onPointerDown(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    function onKeyDown(e) {
      if (e.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  // On small screens the button can sit low on the page, so bring the menu
  // fully into view when it opens.
  useEffect(() => {
    if (open) menuRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [open])

  // Reset the "Copied!" label when the menu closes or the shared page changes.
  useEffect(() => {
    if (!open) setCopyState('idle')
  }, [open, path])

  // Auto-clear the "Copied!" label.
  useEffect(() => {
    if (copyState !== 'copied') return undefined
    const t = setTimeout(() => setCopyState('idle'), 2200)
    return () => clearTimeout(t)
  }, [copyState])

  async function handleCopy() {
    const ok = await copyToClipboard(url)
    if (ok) {
      setCopyState('copied')
    } else {
      setCopyState('failed')
      inputRef.current?.select() // let them press Ctrl/Cmd+C themselves
    }
  }

  async function handleNativeShare() {
    try {
      await navigator.share({ title, text, url })
      setOpen(false)
    } catch (err) {
      // AbortError = the user closed the share sheet; anything else is
      // harmless here because the other options in the menu still work.
      if (err && err.name !== 'AbortError') setCopyState('failed')
    }
  }

  const message = `${text} ${url}`
  const targets = [
    { key: 'whatsapp', label: 'WhatsApp', icon: <WhatsAppIcon />, href: `https://wa.me/?text=${encodeURIComponent(message)}` },
    {
      key: 'x',
      label: 'X (Twitter)',
      icon: <XIcon />,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    },
    {
      key: 'facebook',
      label: 'Facebook',
      icon: <FacebookIcon />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      key: 'telegram',
      label: 'Telegram',
      icon: <TelegramIcon />,
      href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    },
    {
      key: 'email',
      label: 'Email',
      icon: <MailIcon />,
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`,
      external: false,
    },
  ]

  return (
    <div className="share-wrap" ref={wrapRef}>
      <button
        ref={triggerRef}
        type="button"
        className={open ? 'place-icon-btn active' : 'place-icon-btn'}
        aria-label="Share place"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <ShareIcon />
      </button>

      {open && (
        <div className="share-menu" ref={menuRef} role="menu" aria-label={`Share ${title}`}>
          <p className="share-menu-title">Share this place</p>

          <div className="share-link-row">
            <input
              ref={inputRef}
              type="text"
              readOnly
              value={url}
              aria-label="Link to this place"
              className="share-link-input"
              onFocus={(e) => e.target.select()}
            />
            <button
              type="button"
              className={copyState === 'copied' ? 'share-copy-btn copied' : 'share-copy-btn'}
              onClick={handleCopy}
            >
              {copyState === 'copied' ? <CheckIcon /> : <LinkIcon />}
              {copyState === 'copied' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p className="share-status" role="status" aria-live="polite">
            {copyState === 'copied' && 'Link copied to clipboard.'}
            {copyState === 'failed' && 'Couldn’t copy automatically — press Ctrl/Cmd + C.'}
          </p>

          {canNativeShare && (
            <button type="button" className="share-item" role="menuitem" onClick={handleNativeShare}>
              <span className="share-item-icon"><ShareIcon /></span>
              Share via…
            </button>
          )}

          {targets.map((t) => (
            <a
              key={t.key}
              className="share-item"
              role="menuitem"
              href={t.href}
              {...(t.external === false ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
              onClick={() => setOpen(false)}
            >
              <span className="share-item-icon">{t.icon}</span>
              {t.label}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
