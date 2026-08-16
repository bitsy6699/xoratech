import { useEffect, useRef } from 'react'
import { motion, useMotionValueEvent } from 'framer-motion'

const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v)

const smoothing = (t) => t * t * (3 - 2 * t)

const hash = (i) => {
  let v = (i * 2654435761) >>> 0
  v = ((v << 13) ^ v) >>> 0
  v = ((v * 1274126177) >>> 0) * 0.00000000023283064
  return v - Math.floor(v)
}

export default function PixelOverlay({
  progress,
  color = '#093FB4',
  mode = 'reveal',
  cols = 40,
  rows = 24,
  className = '',
}) {
  const containerRef = useRef(null)
  const cellRefs = useRef([])
  const n = cols * rows

  const setRef = (i) => (el) => {
    cellRefs.current[i] = el
  }

  const update = (raw) => {
    const container = containerRef.current
    if (!container) return
    const p = clamp(raw)
    const windowRatio = 0.2

    for (let i = 0; i < n; i++) {
      const cell = cellRefs.current[i]
      if (!cell) continue
      const startT = (i / n) * (1 - windowRatio) + hash(i) * 0.06
      const local = clamp((p - startT) / windowRatio)
      const step = smoothing(local)
      const alpha = mode === 'cover' ? step : 1 - step
      const current = cell.style.opacity
      const next = alpha.toFixed(3)
      if (current !== next) cell.style.opacity = next
    }

    const visible = p > 0.001 && p < 0.999
    container.style.opacity = visible ? '1' : '0'
    container.style.visibility = visible ? 'visible' : 'hidden'
  }

  useMotionValueEvent(progress, 'change', update)

  useEffect(() => {
    update(progress.get())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n, mode])

  return (
    <motion.div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-[65] grid opacity-0 ${mode === 'reveal' ? '' : ''} ${className}`.trim()}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridAutoRows: '1fr',
        visibility: 'hidden',
      }}
    >
      {Array.from({ length: n }).map((_, i) => (
        <span
          key={i}
          ref={setRef(i)}
          className="h-full w-full"
          style={{ backgroundColor: color, opacity: mode === 'reveal' ? 1 : 0 }}
        />
      ))}
    </motion.div>
  )
}