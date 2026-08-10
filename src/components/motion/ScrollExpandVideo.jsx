import { useEffect, useId, useRef } from 'react'
import { useScroll, useMotionValueEvent, useReducedMotion } from 'framer-motion'

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)

const ANCHOR_SELECTOR = '[data-hero-word] .mpt-char:nth-child(3)'

export default function ScrollExpandVideo({
  targetRef,
  src = '/videos/header.mp4',
  poster = '/videos/header-poster.jpg',
  overlay = 'rgba(9, 63, 180, 0.35)',
}) {
  const reduce = useReducedMotion()
  const clipId = `sev-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const boxRef = useRef(null)
  const glyphRef = useRef(null)
  const layerRef = useRef(null)
  const overlayRef = useRef(null)
  const anchorRef = useRef(null)
  const posRef = useRef({ x: 0, y: 0, fs: 0, sx: 1 })

  const { scrollYProgress } = useScroll({ target: targetRef, offset: ['start end', 'start start'] })

  const update = () => {
    const box = boxRef.current
    const glyph = glyphRef.current
    const layer = layerRef.current
    const over = overlayRef.current
    if (!box || !glyph || !layer || !over) return
    const t = reduce ? 1 : clamp01(scrollYProgress.get())
    const vw = window.innerWidth
    const vh = window.innerHeight
    const st = posRef.current

    if (!anchorRef.current) {
      const el = document.querySelector(ANCHOR_SELECTOR)
      if (el) {
        anchorRef.current = el
        const fs = parseFloat(window.getComputedStyle(el).fontSize) || 200
        st.fs = fs
        st.sx = Math.max(vw / (0.62 * fs), vh / fs) * 1.25
      }
    }
    const el = anchorRef.current
    if (el) {
      const r = el.getBoundingClientRect()
      if (r.bottom > 0 && r.top < vh) {
        st.x = r.left + r.width / 2
        st.y = r.top + r.height / 2
        const fs = parseFloat(window.getComputedStyle(el).fontSize) || st.fs
        if (Math.abs(fs - st.fs) > 1) {
          st.fs = fs
          st.sx = Math.max(vw / (0.62 * fs), vh / fs) * 1.25
        }
      } else if (!st.x) {
        st.x = vw / 2
        st.y = vh * 0.5
      }
    }
    if (!st.x) {
      st.x = vw / 2
      st.y = vh * 0.5
      if (!st.fs) st.fs = 200
      if (st.sx === 1) st.sx = Math.max(vw / (0.62 * st.fs), vh / st.fs) * 1.25
    }

    if (t <= 0.02 && !reduce) {
      box.style.opacity = '0'
      return
    }
    box.style.opacity = reduce ? '1' : String(clamp01((t - 0.02) / 0.14))
    over.style.opacity = reduce ? '1' : String(clamp01((t - 0.35) / 0.4))

    const cx = st.x
    const cy = st.y
    glyph.setAttribute('x', String(cx))
    glyph.setAttribute('y', String(cy))
    glyph.setAttribute('font-size', String(st.fs))
    const s = 1 + (st.sx - 1) * t
    glyph.setAttribute('transform', `translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})`)
  }

  useMotionValueEvent(scrollYProgress, 'change', update)

  useEffect(() => {
    update()
    let raf
    const onResize = () => {
      const el = anchorRef.current
      if (el) {
        const fs = parseFloat(window.getComputedStyle(el).fontSize) || 0
        if (fs) {
          posRef.current.fs = fs
          posRef.current.sx = Math.max(innerWidth / (0.62 * fs), innerHeight / fs) * 1.25
        }
      }
      update()
    }
    const tick = () => {
      update()
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('resize', onResize)
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(raf)
    }
  }, [reduce])

  return (
    <div
      ref={boxRef}
      aria-hidden="true"
      className="pointer-events-none sticky top-0 z-[1] h-screen w-full opacity-0"
      style={{ willChange: 'opacity' }}
    >
      <svg className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <text
              ref={glyphRef}
              x="0"
              y="0"
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="'Martian Mono', monospace"
              fontWeight="700"
            >
              O
            </text>
          </clipPath>
        </defs>
      </svg>
      <div ref={layerRef} className="absolute inset-0" style={{ clipPath: `url(#${clipId})` }}>
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
        />
        <div ref={overlayRef} className="absolute inset-0 opacity-0" style={{ background: overlay }} />
      </div>
    </div>
  )
}