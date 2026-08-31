import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

export default function Magnetic({ children, strength = 0.28, radius = 140, className = '' }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || reduce) return
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine) return

    let raf = 0
    let target = { x: 0, y: 0 }
    let cur = { x: 0, y: 0 }

    const tick = () => {
      cur.x += (target.x - cur.x) * 0.18
      cur.y += (target.y - cur.y) * 0.18
      el.style.transform = `translate3d(${cur.x.toFixed(2)}px, ${cur.y.toFixed(2)}px, 0)`
      if (Math.abs(cur.x - target.x) > 0.06 || Math.abs(cur.y - target.y) > 0.06) {
        raf = requestAnimationFrame(tick)
      } else {
        raf = 0
      }
    }

    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const d = Math.hypot(e.clientX - cx, e.clientY - cy)
      if (d < radius) {
        const f = 1 - d / radius
        target.x = (e.clientX - cx) * strength * f
        target.y = (e.clientY - cy) * strength * f
      } else {
        target.x = 0
        target.y = 0
      }
      if (!raf) raf = requestAnimationFrame(tick)
    }

    const onLeave = () => {
      target.x = 0
      target.y = 0
      if (!raf) raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    el.addEventListener('mouseleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      el.style.transform = ''
    }
  }, [reduce, strength, radius])

  return (
    <span ref={ref} className={className} style={{ display: 'inline-flex', willChange: reduce ? undefined : 'transform' }}>
      {children}
    </span>
  )
}
