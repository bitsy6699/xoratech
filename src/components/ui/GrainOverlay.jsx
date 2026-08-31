import { useEffect, useRef } from 'react'

export default function GrainOverlay({ opacity = 0.035 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (coarse) return
    if (reduce) return // keep fallback static scanlines only via CSS, skip canvas

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const dpr = Math.min(1.5, window.devicePixelRatio || 1)
    let raf = 0
    let w = 0
    let h = 0

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.max(1, Math.round(w * dpr))
      canvas.height = Math.max(1, Math.round(h * dpr))
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    let frame = 0
    const draw = () => {
      frame += 1
      // throttle to ~22fps — grain without burning GPU
      if (frame % 3 !== 0) {
        raf = requestAnimationFrame(draw)
        return
      }
      ctx.clearRect(0, 0, w, h)
      ctx.globalAlpha = opacity
      // sparse pixel grain
      const count = Math.round((w * h) / 4200)
      for (let i = 0; i < count; i++) {
        const x = (Math.random() * w) | 0
        const y = (Math.random() * h) | 0
        const v = Math.random() > 0.5 ? 255 : 0
        ctx.fillStyle = `rgb(${v},${v},${v})`
        ctx.fillRect(x, y, 1, 1)
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }

    let visible = true
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !raf) raf = requestAnimationFrame(draw)
      else if (!visible && raf) { cancelAnimationFrame(raf); raf = 0 }
    })
    // grain is fixed — always visible; keep simple
    raf = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [opacity])

  const coarse = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
  if (coarse) return null

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[45]"
        style={{ mixBlendMode: 'overlay', opacity: 1 }}
      />
      {/* CRT scanlines + vignette — light, very subtle */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[46]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent 0 2px, rgba(0,0,0,0.035) 2px 3px)',
          opacity: 0.55,
          mixBlendMode: 'multiply',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[46]"
        style={{
          background: 'radial-gradient(120% 120% at 50% 50%, transparent 62%, rgba(0,0,0,0.16) 100%)',
        }}
      />
    </>
  )
}
