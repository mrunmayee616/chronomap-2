import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useT } from '../i18n/LanguageContext.jsx'

// Site-wide polish, mounted once so no page has to opt in:
//  - a reading-progress bar along the top
//  - cards that fade/slide in as they scroll into view (staggered)
//  - a soft spotlight that follows the cursor across cards
//  - a ripple where buttons are pressed
//  - a back-to-top button once you've scrolled a way down
// Everything is added by script, so if any of it fails the page simply
// renders as before. Users who prefer reduced motion get none of it.

// Cards that slide in on scroll.
const REVEAL = [
  '.profile-card', '.quiz-hub-card', '.favourite-card', '.achievement-card',
  '.attempted-row', '.place-figure-card', '.place-facts-card', '.place-timeline-item',
  '.place-gallery-item', '.hiw-step-card', '.leaderboard-table-card', '.podium-col',
  '.quiz-next-place', '.quiz-review', '.activity-card', '.attempted-card',
].join(',')

// Cards that get the cursor spotlight (a background-image layer, so not
// .achievement-card, whose progress ring is drawn with background images).
const SPOTLIGHT = [
  '.profile-card', '.quiz-hub-card', '.favourite-card',
  '.attempted-row', '.place-figure-card', '.place-facts-card', '.hiw-step-card',
  '.quiz-next-place', '.leaderboard-table-card',
].join(',')

// Things that ripple when pressed.
const RIPPLE = [
  '.btn-primary', '.btn-secondary', '.filter-pill', '.leaderboard-tab',
  '.quiz-option', '.quiz-next-btn', '.quiz-prev-btn', '.view-toggle button',
].join(',')

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export default function InteractionLayer() {
  const t = useT()
  const { pathname } = useLocation()
  const [progress, setProgress] = useState(0)
  const [showTop, setShowTop] = useState(false)

  // Scroll progress + back-to-top visibility.
  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0)
        setShowTop(window.scrollY > 700)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [pathname])

  // Scroll-reveal: watch cards as they're rendered (pages render async, so
  // a MutationObserver picks up anything that appears later).
  useEffect(() => {
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) return undefined
    const seen = new WeakSet()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          e.target.classList.add('revealed')
          io.unobserve(e.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    )
    const scan = () => {
      document.querySelectorAll(REVEAL).forEach((el) => {
        if (seen.has(el)) return
        seen.add(el)
        // stagger siblings a little
        const index = el.parentElement ? [...el.parentElement.children].indexOf(el) : 0
        el.style.setProperty('--reveal-delay', `${Math.min(index, 8) * 60}ms`)
        // already on screen at load? show it without the hidden state flashing
        const r = el.getBoundingClientRect()
        if (r.top < window.innerHeight && r.bottom > 0) {
          el.classList.add('reveal', 'revealed')
          return
        }
        el.classList.add('reveal')
        io.observe(el)
      })
    }
    scan()
    const mo = new MutationObserver(scan)
    mo.observe(document.body, { childList: true, subtree: true })
    return () => {
      mo.disconnect()
      io.disconnect()
    }
  }, [])

  // Cursor spotlight + press ripple, via delegation.
  useEffect(() => {
    if (prefersReducedMotion()) return undefined
    let lit = null
    const onMove = (e) => {
      const card = e.target.closest?.(SPOTLIGHT)
      if (lit && lit !== card) lit.classList.remove('spotlit')
      lit = card
      if (!card) return
      const r = card.getBoundingClientRect()
      card.style.setProperty('--mx', `${e.clientX - r.left}px`)
      card.style.setProperty('--my', `${e.clientY - r.top}px`)
      card.classList.add('spotlit')
    }
    const onLeave = () => {
      lit?.classList.remove('spotlit')
      lit = null
    }
    const onDown = (e) => {
      const host = e.target.closest?.(RIPPLE)
      if (!host || host.disabled) return
      const r = host.getBoundingClientRect()
      const size = Math.max(r.width, r.height) * 2.2
      const wave = document.createElement('span')
      wave.className = 'ripple-wave'
      wave.style.width = wave.style.height = `${size}px`
      wave.style.left = `${e.clientX - r.left - size / 2}px`
      wave.style.top = `${e.clientY - r.top - size / 2}px`
      host.classList.add('ripple-host')
      host.appendChild(wave)
      wave.addEventListener('animationend', () => wave.remove())
    }
    document.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('pointerdown', onDown)
    return () => {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [])

  return (
    <>
      <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
      <button
        type="button"
        className={showTop ? 'back-to-top visible' : 'back-to-top'}
        onClick={() => window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })}
        aria-label={t('common.backToTop')}
        tabIndex={showTop ? 0 : -1}
      >
        ↑
      </button>
    </>
  )
}
