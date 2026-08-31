import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

const SPACING = 34
const CONNECT_DIST = 108
const CURSOR_RADIUS = 170

const fract = (n) => n - Math.floor(n)

export default function HeroGrid({ className = '' }) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const mqFine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const fine = mqFine.matches
    const dpr = Math.min(2, window.devicePixelRatio || 1)

    let dots = []
    let cursor = { x: -9999, y: -9999 }
    let wave = { r: 0, strength: 0 }
    let clock = 0
    let raf = 0
    let width = 0
    let height = 0

    const hashAt = (x, y) => fract(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453)

    const layout = () => {
      const r = wrap.getBoundingClientRect()
      width = r.width
      height = r.height
      canvas.width = Math.max(1, Math.round(width * dpr))
      canvas.height = Math.max(1, Math.round(height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      dots = []
      for (let x = SPACING / 2; x < width; x += SPACING) {
        for (let y = SPACING / 2; y < height; y += SPACING) {
          dots.push({ x, y, h: hashAt(x, y) })
        }
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      // dots
      ctx.fillStyle = '#FFFCFB'
      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i]
        const dx = cursor.x - dot.x
        const dy = cursor.y - dot.y
        const d = Math.hypot(dx, dy)
        const waveBoost = wave.strength * Math.max(0, 1 - Math.abs(d - wave.r) / 90)
        const idle = 0.11 + 0.06 * Math.sin(clock * 1.6 + dot.h * 6.283)
        const alpha = Math.min(0.85, idle + waveBoost * 0.9 + (d < CURSOR_RADIUS ? (1 - d / CURSOR_RADIUS) * 0.22 : 0))
        if (alpha <= 0.018) continue
        ctx.globalAlpha = alpha
        ctx.fillRect(dot.x - 1, dot.y - 1, 2, 2)
      }
      ctx.globalAlpha = 1
      // constellation lines near cursor
      ctx.strokeStyle = 'rgba(255,252,251,0.22)'
      ctx.lineWidth = 0.7
      for (let i = 0; i < dots.length; i++) {
        const a = dots[i]
        const da = Math.hypot(a.x - cursor.x, a.y - cursor.y)
        if (da > CURSOR_RADIUS) continue
        for (let j = i + 1; j < dots.length; j++) {
          const b = dots[j]
          const db = Math.hypot(b.x - cursor.x, b.y - cursor.y)
          if (db > CURSOR_RADIUS) continue
          const dist = Math.hypot(a.x - b.x, a.y - b.y)
          if (dist > CONNECT_DIST) continue
          // alpha based on avg cursor proximity + dist
          const avg = (da + db) / 2
          const alpha = (1 - avg / CURSOR_RADIUS) * (1 - dist / CONNECT_DIST) * 0.42
          if (alpha <= 0.03) continue
          ctx.globalAlpha = alpha
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
      }
      ctx.globalAlpha = 1
    }

    const frame = () => {
      clock += 0.016
      if (wave.strength > 0.012) {
        wave.r += 3.8
        wave.strength *= 0.94
      } else {
        wave.strength = 0
      }
      draw()
      raf = requestAnimationFrame(frame)
    }

    const onMove = (e) => {
      const r = wrap.getBoundingClientRect()
      cursor.x = e.clientX - r.left
      cursor.y = e.clientY - r.top
      wave.r = 0
      wave.strength = 1
    }

    layout()
    if (!reduce) {
      const host = wrap.parentElement || wrap
      if (fine) host.addEventListener('mousemove', onMove, { passive: true })
      const io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          raf = requestAnimationFrame(frame)
        } else {
          cancelAnimationFrame(raf)
        }
      })
      io.observe(wrap)
      const ro = new ResizeObserver(() => {
        if (!ro) return
        layout()
      })
      ro.observe(wrap)
      return () => {
        cancelAnimationFrame(raf)
        io.disconnect()
        ro.disconnect()
        host.removeEventListener('mousemove', onMove)
      }
    }

    draw()

    const roStatic = new ResizeObserver(() => {
      layout()
      draw()
    })
    roStatic.observe(wrap)
    return () => {
      roStatic.disconnect()
    }
  }, [reduce])

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`.trim()}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  )
}
