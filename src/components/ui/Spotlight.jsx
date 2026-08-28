import { useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

export default function Spotlight({
  children,
  color = '255, 252, 251',
  opacity = 0.05,
  size = 480,
  className = '',
}) {
  const ref = useRef(null)
  const reduce = useReducedMotion()

  const onMove = (e) => {
    const el = ref.current
    if (!el || reduce) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--sx', `${e.clientX - r.left}px`)
    el.style.setProperty('--sy', `${e.clientY - r.top}px`)
    el.style.setProperty('--so', '1')
  }

  const onLeave = () => {
    ref.current?.style.setProperty('--so', '0')
  }

  return (
    <div ref={ref} className={`relative ${className}`.trim()} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: 'var(--so, 0)',
          background: `radial-gradient(${size}px at var(--sx, 50%) var(--sy, 50%), rgba(${color}, ${opacity}) 0%, transparent 65%)`,
        }}
      />
    </div>
  )
}