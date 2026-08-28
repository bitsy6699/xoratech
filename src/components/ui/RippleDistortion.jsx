import { useEffect, useId, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v)

export default function RippleDistortion({
  children,
  radius = 320,
  maxScale = 100,
  className = '',
}) {
  const reduce = useReducedMotion()
  const filterId = `ripple-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const wrapRef = useRef(null)
  const turbRef = useRef(null)
  const mapRef = useRef(null)
  const cursorRef = useRef({ x: -9999, y: -9999 })
  const ampRef = useRef(0)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (reduce || !fine.matches) return

    const onMove = (e) => {
      cursorRef.current.x = e.clientX
      cursorRef.current.y = e.clientY
    }
    const onLeave = () => {
      cursorRef.current.x = -9999
      cursorRef.current.y = -9999
    }

    let raf = 0
    let clock = 0
    let last = performance.now()
    let visible = true
    const frame = (now) => {
      if (!visible) return
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      clock += dt
      const wrap = wrapRef.current
      const turb = turbRef.current
      const map = mapRef.current
      if (wrap && turb && map) {
        const r = wrap.getBoundingClientRect()
        const nx = clamp(cursorRef.current.x, r.left, r.right)
        const ny = clamp(cursorRef.current.y, r.top, r.bottom)
        const d = Math.hypot(cursorRef.current.x - nx, cursorRef.current.y - ny)
        const target = d <= radius ? 1 - d / radius : 0
        const amp = ampRef.current + (target - ampRef.current) * (target > ampRef.current ? 0.18 : 0.12)
        ampRef.current = amp
        const scale = Math.round(amp * maxScale + Math.sin(clock * 2.4) * amp * 4)
        map.setAttribute('scale', String(Math.max(0, scale)))
        const bf = 0.004 + 0.0012 * amp
        turb.setAttribute('baseFrequency', `${bf.toFixed(4)} ${(bf * 1.5).toFixed(4)}`)
      }
      raf = requestAnimationFrame(frame)
    }
    const start = () => {
      if (raf) return
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
      else stop()
    })
    if (wrapRef.current) io.observe(wrapRef.current)
    start()

    window.addEventListener('mousemove', onMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    return () => {
      stop()
      io.disconnect()
      window.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
    }
  }, [reduce, radius, maxScale])

  return (
    <div ref={wrapRef} className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`.trim()}>
      <svg aria-hidden="true" focusable="false" width="0" height="0" className="absolute" style={{ left: 0, top: 0 }}>
        <defs>
          <filter id={filterId}>
            <feTurbulence
              ref={turbRef}
              type="fractalNoise"
              baseFrequency="0.004 0.006"
              numOctaves="2"
              result="noise"
            />
            <feDisplacementMap
              ref={mapRef}
              in="SourceGraphic"
              in2="noise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <div className="absolute inset-0" style={{ filter: `url(#${filterId})`, willChange: 'filter' }}>
        {children}
      </div>
    </div>
  )
}