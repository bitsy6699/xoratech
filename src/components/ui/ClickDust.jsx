import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const DUST_COLORS = ['#0024fc', '#3DF0C4', '#051a66', '#0024fc', '#1FCC9F']

export default function ClickDust() {
  const [bursts, setBursts] = useState([])
  const idRef = useRef(0)

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (!mq.matches) return

    const onPointerDown = (e) => {
      if (e.defaultPrevented) return
      const count = 6
      const particles = Array.from({ length: count }).map((_, i) => {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.6
        const dist = 12 + Math.random() * 26
        return {
          key: `${idRef.current}-${i}`,
          x: e.clientX,
          y: e.clientY,
          tx: Math.cos(angle) * dist,
          ty: Math.sin(angle) * dist,
          size: 3 + Math.random() * 4,
          color: DUST_COLORS[i % DUST_COLORS.length],
        }
      })
      const id = ++idRef.current
      setBursts((prev) => [...prev.slice(-24), { id, particles }])
      setTimeout(() => {
        setBursts((prev) => prev.filter((b) => b.id !== id))
      }, 650)
    }

    window.addEventListener('pointerdown', onPointerDown)
    return () => window.removeEventListener('pointerdown', onPointerDown)
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[55]">
      <AnimatePresence>
        {bursts.map((burst) => (
          <div key={burst.id}>
            {burst.particles.map((p) => (
              <motion.span
                key={p.key}
                initial={{ x: p.x, y: p.y, opacity: 0.9, scale: 1 }}
                animate={{ x: p.x + p.tx, y: p.y + p.ty, opacity: 0, scale: 0.3 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                className="absolute left-0 top-0"
                style={{
                  width: p.size,
                  height: p.size,
                  backgroundColor: p.color,
                  marginLeft: -p.size / 2,
                  marginTop: -p.size / 2,
                }}
              />
            ))}
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}