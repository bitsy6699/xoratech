/*
 * MaskedTextPressure — merge of two react-bits components:
 *   - MaskedHeading (SVG clipPath video/image fill inside glyphs)
 *   - TextPressure (per-character variable-font pressure via font-variation-settings)
 * Source: https://github.com/DavidHDev/react-bits · License: MIT + Commons Clause
 * TextPressure ported from https://codepen.io/JuanFuentes/full/rgXKGQ
 */
import { useCallback, useEffect, useId, useMemo, useRef } from 'react'
import { gsap } from 'gsap'
import '../reactbits/MaskedHeading.css'
import './MaskedTextPressure.css'

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v)

const getAttr = (distance, maxDist, minVal, maxVal) => {
  const val = maxVal - Math.abs((maxVal * distance) / (maxDist || 1))
  return Math.max(minVal, Math.min(maxVal, val + minVal))
}

export default function MaskedTextPressure({
  text = 'XORA',
  tag = 'h2',
  fontFamily = "'Martian Mono', monospace",
  mediaType = 'video',
  src = '',
  poster = '',
  fillScale = 1.25,
  parallax = 26,
  drift = 18,
  brightness = 1,
  saturation = 1,
  grayscale = false,
  reveal = 'rise',
  duration = 1.1,
  stagger = 0.09,
  trigger = 'view',
  align = 'center',
  weight = 700,
  tracking = -0.03,
  lineHeight = 1.06,
  textScale = 0.115,
  minFontSize = 40,
  className = '',
  style,
  ...rest
}) {
  const rootRef = useRef(null)
  const measureRef = useRef(null)
  const revealRef = useRef(null)
  const mediaRef = useRef(null)
  const charRefs = useRef([])
  const baseRefs = useRef([])
  const glyphRefs = useRef([])
  const tweenRef = useRef(null)
  const offsetRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 })
  const mouseRef = useRef({ x: 0, y: 0 })
  const cursorRef = useRef({ x: 0, y: 0 })

  const clipId = `mpt-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const chars = useMemo(() => String(text).split(''), [text])

  const settingsRef = useRef({})
  settingsRef.current = { fillScale, parallax, drift, brightness, saturation, grayscale, textScale }

  const place = useCallback(() => {
    const root = rootRef.current
    const media = mediaRef.current
    if (!root || !media) return
    const s = settingsRef.current
    const W = root.clientWidth
    const H = root.clientHeight
    const off = offsetRef.current
    const maxX = Math.max(0, ((s.fillScale - 1) / 2) * W)
    const maxY = Math.max(0, ((s.fillScale - 1) / 2) * H)
    media.style.transform = `translate3d(${clamp(off.x, -maxX, maxX).toFixed(2)}px, ${clamp(off.y, -maxY, maxY).toFixed(2)}px, 0) scale(${s.fillScale})`
    media.style.filter = `brightness(${s.brightness}) saturate(${s.saturation})${s.grayscale ? ' grayscale(1)' : ''}`
  }, [])

  const sync = useCallback(() => {
    const root = rootRef.current
    const measure = measureRef.current
    if (!root || !measure) return
    const s = settingsRef.current
    root.style.fontSize = `${clamp(root.clientWidth * s.textScale, minFontSize, 260).toFixed(1)}px`
    const cs = window.getComputedStyle(measure)
    for (let i = 0; i < charRefs.current.length; i += 1) {
      const span = charRefs.current[i]
      const base = baseRefs.current[i]
      const glyph = glyphRefs.current[i]
      if (!span || !base || !glyph) continue
      glyph.setAttribute('x', span.offsetLeft)
      glyph.setAttribute('y', base.offsetTop)
      glyph.style.fontFamily = cs.fontFamily
      glyph.style.fontSize = cs.fontSize
      glyph.style.fontWeight = cs.fontWeight
      glyph.style.fontStyle = cs.fontStyle
      glyph.style.letterSpacing = cs.letterSpacing
      glyph.style.fontVariationSettings = span.style.fontVariationSettings || `'wght' ${weight}, 'wdth' 100`
    }
    place()
  }, [place, minFontSize, weight])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    sync()
    let ro
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(sync)
      ro.observe(root)
    }
    if (document.fonts?.ready) document.fonts.ready.then(sync).catch(() => {})

    let raf = 0
    let last = performance.now()
    let clock = 0
    let visible = true
    const frame = (now) => {
      if (!visible) return
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      clock += dt
      const s = settingsRef.current
      const off = offsetRef.current
      const dx = Math.sin(clock * 0.21) * s.drift
      const dy = Math.cos(clock * 0.17) * s.drift * 0.6
      const ease = 1 - Math.exp(-dt / 0.18)
      off.x += (off.tx + dx - off.x) * ease
      off.y += (off.ty + dy - off.y) * ease
      place()
      raf = requestAnimationFrame(frame)
    }
    const onMove = (e) => {
      const s = settingsRef.current
      if (s.parallax <= 0) return
      const r = root.getBoundingClientRect()
      const nx = ((e.clientX - r.left) / (r.width || 1)) * 2 - 1
      const ny = ((e.clientY - r.top) / (r.height || 1)) * 2 - 1
      offsetRef.current.tx = clamp(nx, -1, 1) * -s.parallax
      offsetRef.current.ty = clamp(ny, -1, 1) * -s.parallax
    }
    const onLeave = () => {
      offsetRef.current.tx = 0
      offsetRef.current.ty = 0
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
    io.observe(root)
    root.addEventListener('pointermove', onMove)
    root.addEventListener('pointerleave', onLeave)
    start()
    return () => {
      stop()
      io.disconnect()
      if (ro) ro.disconnect()
      root.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerleave', onLeave)
    }
  }, [place, sync])

  useEffect(() => {
    const base = `'wght' ${weight}, 'wdth' 100`
    for (const el of charRefs.current) if (el) el.style.fontVariationSettings = base
    for (const el of glyphRefs.current) if (el) el.style.fontVariationSettings = base

    const onMouseMove = (e) => {
      cursorRef.current.x = e.clientX
      cursorRef.current.y = e.clientY
    }
    const onTouchMove = (e) => {
      const t = e.touches[0]
      if (t) {
        cursorRef.current.x = t.clientX
        cursorRef.current.y = t.clientY
      }
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('touchmove', onTouchMove, { passive: true })

    let rafId = 0
    let visibleW = true
    const animate = () => {
      if (!visibleW) return
      mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / 15
      mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / 15
      const title = rootRef.current
      if (title) {
        const titleRect = title.getBoundingClientRect()
        const maxDist = titleRect.width / 2
        charRefs.current.forEach((span, i) => {
          if (!span) return
          const rect = span.getBoundingClientRect()
          const cc = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }
          const d = Math.hypot(mouseRef.current.x - cc.x, mouseRef.current.y - cc.y)
          const wdth = Math.floor(getAttr(d, maxDist, 78, 112.5))
          const wght = Math.floor(getAttr(d, maxDist, 450, 800))
          const fvs = `'wght' ${wght}, 'wdth' ${wdth}`
          if (span.style.fontVariationSettings !== fvs) span.style.fontVariationSettings = fvs
          const glyph = glyphRefs.current[i]
          if (glyph) {
            if (glyph.style.fontVariationSettings !== fvs) glyph.style.fontVariationSettings = fvs
            glyph.setAttribute('x', span.offsetLeft)
          }
        })
      }
      rafId = requestAnimationFrame(animate)
    }
    const startW = () => {
      if (rafId) return
      rafId = requestAnimationFrame(animate)
    }
    const stopW = () => {
      cancelAnimationFrame(rafId)
      rafId = 0
    }
    const ioW = rootRef.current ? new IntersectionObserver(([entry]) => {
      visibleW = entry.isIntersecting
      if (visibleW) startW()
      else stopW()
    }) : null
    if (ioW && rootRef.current) ioW.observe(rootRef.current)
    startW()
    return () => {
      stopW()
      ioW?.disconnect()
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [weight])

  useEffect(() => {
    const root = rootRef.current
    const layer = revealRef.current
    if (!root || !layer) return
    const glyphs = glyphRefs.current.filter(Boolean)
    if (!glyphs.length) return
    const riseDistance = () => (parseFloat(window.getComputedStyle(root).fontSize) || 48) * 1.15
    const settle = () => {
      gsap.set(glyphs, { y: 0 })
      gsap.set(layer, { opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0%)' })
    }
    const rest = () => {
      if (reveal === 'rise') {
        gsap.set(glyphs, { y: riseDistance() })
      } else if (reveal === 'wipe') {
        gsap.set(layer, { clipPath: 'inset(0% 100% 0% 0%)' })
      } else if (reveal === 'fade') {
        gsap.set(layer, { opacity: 0, scale: 1.08 })
      }
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reveal === 'none' || reduce) {
      settle()
      return
    }
    const play = () => {
      tweenRef.current?.kill()
      if (reveal === 'rise') {
        gsap.set(layer, { opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0%)' })
        tweenRef.current = gsap.fromTo(
          glyphs,
          { y: riseDistance() },
          { y: 0, duration, stagger, ease: 'power4.out', overwrite: 'auto' }
        )
      } else if (reveal === 'wipe') {
        gsap.set(glyphs, { y: 0 })
        const state = { p: 100 }
        tweenRef.current = gsap.to(state, {
          p: 0,
          duration,
          ease: 'power3.inOut',
          overwrite: 'auto',
          onUpdate: () => {
            layer.style.clipPath = `inset(0% ${state.p}% 0% 0%)`
          },
        })
      } else {
        gsap.set(glyphs, { y: 0 })
        tweenRef.current = gsap.fromTo(
          layer,
          { opacity: 0, scale: 1.08 },
          { opacity: 1, scale: 1, duration, ease: 'power3.out', overwrite: 'auto' }
        )
      }
    }
    if (trigger === 'hover') {
      settle()
      root.addEventListener('pointerenter', play)
      return () => {
        root.removeEventListener('pointerenter', play)
        tweenRef.current?.kill()
      }
    }
    if (trigger === 'view') {
      settle()
      rest()
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            play()
            io.disconnect()
          }
        },
        { threshold: 0.25 }
      )
      io.observe(root)
      return () => {
        io.disconnect()
        tweenRef.current?.kill()
      }
    }
    play()
    return () => tweenRef.current?.kill()
  }, [reveal, trigger, duration, stagger, chars])

  useEffect(() => {
    sync()
  }, [sync, chars, tag, align, weight, tracking, lineHeight, textScale])

  const Tag = tag
  return (
    <Tag
      ref={rootRef}
      className={`masked-heading mpt ${className}`.trim()}
      style={{
        fontFamily,
        textAlign: align,
        fontWeight: weight,
        letterSpacing: `${tracking}em`,
        lineHeight,
        ...style,
      }}
      {...rest}
    >
      <span ref={measureRef} className="masked-heading__measure">
        {chars.map((ch, i) => (
          <span
            key={`${ch}-${i}`}
            ref={(el) => {
              charRefs.current[i] = el
            }}
            className="mpt-char"
          >
            {ch}
            <i
              ref={(el) => {
                baseRefs.current[i] = el
              }}
              className="masked-heading__baseline"
            />
          </span>
        ))}
      </span>

      <svg className="masked-heading__defs" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            {chars.map((ch, i) => (
              <text
                key={`${ch}-${i}`}
                ref={(el) => {
                  glyphRefs.current[i] = el
                }}
              >
                {ch}
              </text>
            ))}
          </clipPath>
        </defs>
      </svg>

      <span ref={revealRef} className="masked-heading__reveal">
        <span className="masked-heading__clip" style={{ clipPath: `url(#${clipId})` }}>
          <span ref={mediaRef} className="masked-heading__media">
            {mediaType === 'video' ? (
              <video
                className="masked-heading__source"
                src={src}
                poster={poster}
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <img className="masked-heading__source" src={src} alt="" draggable={false} />
            )}
          </span>
        </span>
      </span>
    </Tag>
  )
}
