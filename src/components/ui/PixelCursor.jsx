import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const INTERACTIVE = 'a, button, select, textarea, input, label, [role="button"], [data-cursor]'
const CREAM = '#FFFCFB'
const BLUE = '#093FB4'

const parseColor = (str) => {
  const m = str.match(/rgba?\(([\d\s.,]+)\)/)
  if (!m) return null
  const parts = m[1].split(',').map((s) => parseFloat(s))
  if (parts.length >= 3 && (parts.length === 3 || parts[3] > 0)) return { r: parts[0], g: parts[1], b: parts[2] }
  return null
}

const luminance = ({ r, g, b }) => (0.299 * r + 0.587 * g + 0.114 * b) / 255

export default function PixelCursor() {
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [hidden, setHidden] = useState(true)
  const [color, setColor] = useState(CREAM)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 300, damping: 28, mass: 0.7 })
  const ringY = useSpring(y, { stiffness: 300, damping: 28, mass: 0.7 })

  const lastRef = useRef({ x: -100, y: -100, color: CREAM })

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!fine.matches || reduce.matches) return
    setEnabled(true)

    const pickColor = (e) => {
      const cx = e.clientX
      const cy = e.clientY
      const prev = lastRef.current
      if (Math.abs(cx - prev.x) < 3 && Math.abs(cy - prev.y) < 3) return
      lastRef.current.x = cx
      lastRef.current.y = cy

      let chosen = CREAM
      const els = document.elementsFromPoint(cx, cy)
      for (const el of els) {
        const parsed = parseColor(getComputedStyle(el).backgroundColor)
        if (parsed) {
          chosen = luminance(parsed) > 0.5 ? BLUE : CREAM
          break
        }
      }
      if (chosen !== prev.color) {
        lastRef.current.color = chosen
        setColor(chosen)
      }
    }

    const onMove = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setHidden(false)
      pickColor(e)
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
  const softColor = color === BLUE ? 'rgba(9,63,180,0.15)' : 'rgba(255,252,251,0.15)'

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60]"
      style={{ opacity: hidden ? 0 : 1, transition: 'opacity 0.2s ease' }}
    >
      {/* inner dot (instant) — color sampled from the backdrop */}
      <motion.div
        className="absolute left-0 top-0"
        style={{
          x,
          y,
          width: 6,
          height: 6,
          marginLeft: -3,
          marginTop: -3,
          backgroundColor: color,
          transition: 'background-color 0.15s linear',
        }}
      />
      {/* outer pixel ring (spring lag) — same sampled color */}
      <motion.div
        className="absolute left-0 top-0"
        style={{
          x: ringX,
          y: ringY,
          marginLeft: -ringSize / 2,
          marginTop: -ringSize / 2,
          width: ringSize,
          height: ringSize,
          border: `2px solid ${color}`,
          backgroundColor: softColor,
          boxShadow: color === BLUE ? '0 0 0 1px rgba(9,63,180,0.3)' : '0 0 0 1px rgba(255,252,251,0.3)',
          transition: 'border-color 0.15s linear, background-color 0.15s linear, box-shadow 0.15s linear',
        }}
      />
    </div>
  )
}