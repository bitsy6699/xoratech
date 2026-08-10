import { useEffect, useId, useRef } from 'react'

const VIDEO_SRC = '/videos/header.mp4'
const POSTER_SRC = '/videos/header-poster.jpg'

export default function VideoMaskedHeading({
  text = 'XORA',
  active = true,
  preferPoster = false,
  className = '',
}) {
  const rawId = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const maskId = `mh-${rawId}`
  const svgRef = useRef(null)
  const letterRefs = useRef([])

  useEffect(() => {
    for (const el of letterRefs.current) {
      el.style.fontVariationSettings = '"wght" 680, "wdth" 100'
    }
    if (preferPoster) return

    let raf = 0
    let running = false
    const target = { x: -9999, y: -9999 }

    const snap = () => {
      for (const el of letterRefs.current) {
        el.style.fontVariationSettings = '"wght" 680, "wdth" 100'
      }
      running = false
      if (raf) {
        cancelAnimationFrame(raf)
        raf = 0
      }
    }

    const loop = () => {
      raf = 0
      running = false
      let settled = true
      for (const el of letterRefs.current) {
        const r = el.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        const dist = Math.hypot(target.x - cx, target.y - cy)
        const n = Math.max(0, Math.min(1, 1 - dist / 380))
        const tw = 480 + 320 * n
        const td = 97 + 15.5 * n
        const curW = el.__w ?? 680
        const curD = el.__d ?? 100
        const w = curW + (tw - curW) * 0.35
        const d = curD + (td - curD) * 0.35
        el.__w = w
        el.__d = d
        if (Math.abs(tw - w) > 0.5 || Math.abs(td - d) > 0.05) settled = false
        el.style.fontVariationSettings = `"wght" ${Math.round(w)}, "wdth" ${d.toFixed(1)}`
      }
      if (!settled) start()
    }

    const start = () => {
      if (!running) {
        running = true
        raf = requestAnimationFrame(loop)
      }
    }

    const onMove = (e) => {
      target.x = e.clientX
      target.y = e.clientY
      if (!active) return
      if (!svgRef.current) return
      const r = svgRef.current.getBoundingClientRect()
      if (target.y < r.top - 80 || target.y > r.bottom + 80) {
        snap()
        return
      }
      start()
    }

    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [active, preferPoster])

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1000 320"
      className={className}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="320">
          <text
            x="500"
            y="172"
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="'Martian Mono', monospace"
            fontSize="248"
            fontWeight="700"
            fill="#fff"
            style={{ letterSpacing: '-0.02em' }}
          >
            {text.split('').map((ch, i) => (
              <tspan
                key={i}
                x="500"
                ref={(el) => {
                  if (el) letterRefs.current[i] = el
                }}
              >
                {ch}
              </tspan>
            ))}
          </text>
        </mask>
      </defs>
      <foreignObject
        x="0"
        y="0"
        width="1000"
        height="320"
        mask={`url(#${maskId})`}
        overflow="hidden"
      >
        <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <img
            src={POSTER_SRC}
            alt=""
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          {!preferPoster && (
            <video
              src={VIDEO_SRC}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              crossOrigin="anonymous"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          )}
        </div>
      </foreignObject>
    </svg>
  )
}