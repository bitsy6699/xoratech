import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const INTERACTIVE = 'a, button, select, textarea, input, label, [role="button"], [data-cursor]'

export default function PixelCursor() {
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [hidden, setHidden] = useState(true)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 300, damping: 28, mass: 0.7 })
  const ringY = useSpring(y, { stiffness: 300, damping: 28, mass: 0.7 })

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!fine.matches || reduce.matches) return
    setEnabled(true)

    const onMove = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setHidden(false)
    }
    const onLeave = () => setHidden(true)
    const onDown = () => setPressed(true)
    const onUp = () => setPressed(false)
    const onOver = (e) => {
      setHovering(!!e.target.closest?.(INTERACTIVE))
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    document.documentElement.addEventListener('mousemove', onOver)
    document.documentElement.addEventListener('mousedown', onDown)
    document.documentElement.addEventListener('mouseup', onUp)
    document.documentElement.classList.add('has-custom-cursor')

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.documentElement.removeEventListener('mousemove', onOver)
      document.documentElement.removeEventListener('mousedown', onDown)
      document.documentElement.removeEventListener('mouseup', onUp)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [x, y])

  if (!enabled) return null

  const ringSize = hidden ? 0 : hovering ? (pressed ? 40 : 34) : 20

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60]"
      style={{ opacity: hidden ? 0 : 1, transition: 'opacity 0.2s ease' }}
    >
      {/* inner dot (instant) — blends with the background via difference */}
      <motion.div
        className="absolute left-0 top-0"
        style={{
          x,
          y,
          width: 6,
          height: 6,
          marginLeft: -3,
          marginTop: -3,
          backgroundColor: '#FFFCFB',
          mixBlendMode: 'difference',
        }}
      />
      {/* outer pixel ring (spring lag) — same adaptive blend */}
      <motion.div
        className="absolute left-0 top-0"
        style={{
          x: ringX,
          y: ringY,
          marginLeft: -ringSize / 2,
          marginTop: -ringSize / 2,
          width: ringSize,
          height: ringSize,
          border: '2px solid #FFFCFB',
          backgroundColor: 'rgba(255,252,251,0.15)',
          boxShadow: '0 0 0 1px rgba(255,252,251,0.3)',
          mixBlendMode: 'difference',
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      />
    </div>
  )
}