import { useEffect, useRef } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'

const hexToRgb = (hex) => {
  const v = hex.replace('#', '')
  const full = v.length === 3 ? v.split('').map((c) => c + c).join('') : v
  return [parseInt(full.slice(0, 2), 16), parseInt(full.slice(2, 4), 16), parseInt(full.slice(4, 6), 16)]
}

const mix = (from, to, t) => {
  const a = hexToRgb(from)
  const b = hexToRgb(to)
  return `rgb(${a.map((c, i) => Math.round(c + (b[i] - c) * t)).join(', ')})`
}

const hash = (i) => {
  let v = (i * 2654435761) >>> 0
  v = ((v << 13) ^ v) >>> 0
  v = ((v * 1274126177) >>> 0) * 0.00000000023283064
  return v - Math.floor(v)
}

export default function PixelWipe({
  start,
  end,
  from = '#093fb4',
  to = '#fffcfb',
  cols = 24,
  rows = 16,
  active = true,
  overlap = 80,
}) {
  const containerRef = useRef(null)
  const cellRefs = useRef([])
  const colorsRef = useRef([])
  const { scrollY } = useScroll()
  const n = cols * rows

  const setRef = (i) => (el) => {
    cellRefs.current[i] = el
  }

  const update = (p) => {
    if (!active) return
    const container = containerRef.current
    if (!container) return
    const clamped = Math.max(0, Math.min(1, p))
    const windowRatio = 0.24

    for (let i = 0; i < n; i++) {
      const cell = cellRefs.current[i]
      if (!cell) continue
      const startT = (i / n) * (1 - windowRatio) + hash(i) * 0.06
      const local = (clamped - startT) / windowRatio
      const c = Math.max(0, Math.min(1, local))
      const col = c >= 1 ? to : c <= 0 ? from : mix(from, to, c)
      if (colorsRef.current[i] !== col) {
        colorsRef.current[i] = col
        cell.style.backgroundColor = col
      }
    }
    const visible = clamped > 0.002 && clamped < 0.999
    container.style.opacity = visible ? '1' : '0'
    container.style.visibility = visible ? 'visible' : 'hidden'
  }

  useMotionValueEvent(scrollY, 'change', () => {
    if (!active || !start.current || !end.current) return
    const sTop = start.current.getBoundingClientRect().bottom + window.scrollY
    const eTop = end.current.getBoundingClientRect().top + window.scrollY
    const total = Math.max(1, eTop - sTop - overlap)
    const p = (window.scrollY - sTop) / total
    update(p)
  })

  useEffect(() => {
    update(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, n])

  if (!active) return null

  return (
    <motion.div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 grid opacity-0"
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
        />
      ))}
    </motion.div>
  )
}