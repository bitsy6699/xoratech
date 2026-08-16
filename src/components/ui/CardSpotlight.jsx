import { useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

export default function CardSpotlight({
  children,
  color = '9, 63, 180',
  opacity = 0.09,
  radius = 280,
  className = '',
}) {
  const ref = useRef(null)
  const reduce = useReducedMotion()

  const onMove = (e) => {
    const el = ref.current
    if (!el || reduce) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--cx', `${e.clientX - r.left}px`)
    el.style.setProperty('--cy', `${e.clientY - r.top}px`)
    el.style.setProperty('--co', '1')
  }

  const onLeave = () => {
    ref.current?.style.setProperty('--co', '0')
  }

  return (
    <div
      ref={ref}
      className={`relative ${className}`.trim()}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: 'var(--co, 0)',
          background: `radial-gradient(${radius}px at var(--cx, 50%) var(--cy, 50%), rgba(${color}, ${opacity}) 0%, transparent 70%)`,
        }}
      />
    </div>
  )
}