import { useEffect, useRef, useState } from 'react'

// A number that counts up from zero the first time it scrolls into view.
export default function CountUp({ to, duration = 1400, locale, suffix = '' }) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (!el || reduce || !('IntersectionObserver' in window)) {
      setValue(to)
      return undefined
    }
    let frame = 0
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      io.disconnect()
      const start = performance.now()
      const tick = (now) => {
        const p = Math.min(1, (now - start) / duration)
        setValue(Math.round(to * (1 - (1 - p) ** 3))) // ease-out
        if (p < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    })
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [to, duration])

  return (
    <span ref={ref}>
      {value.toLocaleString(locale)}
      {suffix}
    </span>
  )
}
