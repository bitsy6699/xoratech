import { useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v)

export default function Magnetic({
  children,
  strength = 0.35,
  maxDist = 16,
  scale = 1.05,
  className = '',
}) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 })

  const onMove = (e) => {
    if (reduce) return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const dx = e.clientX - (r.left + r.width / 2)
    const dy = e.clientY - (r.top + r.height / 2)
    x.set(clamp(dx * strength, -maxDist, maxDist))
    y.set(clamp(dy * strength, -maxDist, maxDist))
  }

  const onLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`inline-block ${className}`.trim()}
      style={{ x: sx, y: sy, display: 'inline-block' }}
      whileHover={reduce ? undefined : { scale }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
    >
      {children}
    </motion.span>
  )
}