import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const INTERACTIVE = 'a, button, select, textarea, input, label, [role="button"], [data-cursor]'

export default function PixelCursor() {
  const [enabled, setEnabled] = useState(false)
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const labelRef = useRef(null)
  const trailRef = useRef(null)
  const stateRef = useRef({ x: -100, y: -100, hovering: false, pressed: false, hidden: true, label: '' })

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!fine.matches || reduce.matches) return
    setEnabled(true)

    let qxDot, qyDot, qxRing, qyRing
    let trailCanvas, trailCtx
    let trailParticles = []
    let lastX = -100
    let lastY = -100
    let velocity = 0
    let raf = 0

    const applyState = () => {
      const s = stateRef.current
      const ring = ringRef.current
      const label = labelRef.current
      if (ring) {
        const size = s.hidden ? 0 : s.hovering ? (s.pressed ? 44 : 38) : 22
        const scale = s.pressed ? 0.86 : 1
        ring.style.width = `${size}px`
        ring.style.height = `${size}px`
        ring.style.marginLeft = `${-size / 2}px`
        ring.style.marginTop = `${-size / 2}px`
        ring.style.transform = `scale(${scale})`
        ring.style.opacity = s.hidden ? '0' : s.hovering ? '1' : '0.9'
        ring.style.borderWidth = s.hovering ? '2px' : '1.5px'
      }
      if (label) {
        label.textContent = s.label
        label.style.opacity = s.hovering && s.label ? '1' : '0'
        label.style.transform = s.hovering && s.label ? 'translate(-50%, -130%) scale(1)' : 'translate(-50%, -110%) scale(0.96)'
      }
    }

    const onMove = (e) => {
      const x = e.clientX
      const y = e.clientY
      const dx = x - lastX
      const dy = y - lastY
      velocity = Math.hypot(dx, dy)
      lastX = x
      lastY = y
      stateRef.current.hidden = false
      if (qxDot) { qxDot(x); qyDot(y) }
      if (qxRing) { qxRing(x); qyRing(y) }
      applyState()

      // trail particles when moving fast
      if (velocity > 8 && trailCtx && trailCanvas) {
        if (trailParticles.length < 18 && Math.random() < 0.65) {
          trailParticles.push({ x, y, vx: dx * 0.08 + (Math.random() - 0.5) * 2, vy: dy * 0.08 + (Math.random() - 0.5) * 2, life: 1, decay: 0.09 + Math.random() * 0.05 })
        }
      }

      // cursor label from [data-cursor]
      const el = e.target.closest?.('[data-cursor]')
      const nextLabel = el?.getAttribute('data-cursor') || ''
      if (nextLabel !== stateRef.current.label) {
        stateRef.current.label = nextLabel
        applyState()
      }
    }

    const onOver = (e) => {
      const hovering = !!e.target.closest?.(INTERACTIVE)
      if (hovering !== stateRef.current.hovering) {
        stateRef.current.hovering = hovering
        applyState()
      }
    }

    const onDown = () => { stateRef.current.pressed = true; applyState() }
    const onUp = () => { stateRef.current.pressed = false; applyState() }
    const onLeave = () => { stateRef.current.hidden = true; applyState() }
    const onEnter = () => { stateRef.current.hidden = false; applyState() }

    // wait for refs to be mounted
    const init = () => {
      if (!dotRef.current || !ringRef.current) {
        requestAnimationFrame(init)
        return
      }
      // GSAP quickTo for buttery physics (retro-premium)
      qxDot = gsap.quickTo(dotRef.current, 'x', { duration: 0.08, ease: 'power2.out' })
      qyDot = gsap.quickTo(dotRef.current, 'y', { duration: 0.08, ease: 'power2.out' })
      qxRing = gsap.quickTo(ringRef.current, 'x', { duration: 0.38, ease: 'power3.out' })
      qyRing = gsap.quickTo(ringRef.current, 'y', { duration: 0.38, ease: 'power3.out' })
      gsap.set([dotRef.current, ringRef.current], { x: -100, y: -100 })

      // trail canvas
      trailCanvas = trailRef.current
      if (trailCanvas) {
        trailCtx = trailCanvas.getContext('2d')
        const dpr = Math.min(2, window.devicePixelRatio || 1)
        const resize = () => {
          trailCanvas.width = Math.round(window.innerWidth * dpr)
          trailCanvas.height = Math.round(window.innerHeight * dpr)
          trailCanvas.style.width = `${window.innerWidth}px`
          trailCanvas.style.height = `${window.innerHeight}px`
          if (trailCtx) trailCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
        }
        resize()
        window.addEventListener('resize', resize)

        const trailFrame = () => {
          if (!trailCtx) return
          trailCtx.clearRect(0, 0, window.innerWidth, window.innerHeight)
          for (let i = trailParticles.length - 1; i >= 0; i--) {
            const p = trailParticles[i]
            p.x += p.vx
            p.y += p.vy
            p.vx *= 0.94
            p.vy *= 0.94
            p.vy += 0.12
            p.life -= p.decay
            if (p.life <= 0) { trailParticles.splice(i, 1); continue }
            trailCtx.globalAlpha = p.life * 0.55
            trailCtx.fillStyle = '#FFFCFB'
            trailCtx.fillRect(p.x - 1, p.y - 1, 2, 2)
          }
          trailCtx.globalAlpha = 1
          raf = requestAnimationFrame(trailFrame)
        }
        raf = requestAnimationFrame(trailFrame)

        // store cleanup
        trailCanvas._cleanup = () => window.removeEventListener('resize', resize)
      }

      window.addEventListener('mousemove', onMove, { passive: true })
      document.documentElement.addEventListener('mousemove', onOver)
      document.documentElement.addEventListener('mousedown', onDown)
      document.documentElement.addEventListener('mouseup', onUp)
      document.documentElement.addEventListener('mouseleave', onLeave)
      window.addEventListener('mouseenter', onEnter)
      document.documentElement.classList.add('has-custom-cursor')
      applyState()
    }

    init()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mousemove', onOver)
      document.documentElement.removeEventListener('mousedown', onDown)
      document.documentElement.removeEventListener('mouseup', onUp)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('mouseenter', onEnter)
      trailRef.current?._cleanup?.()
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [])

  if (!enabled) return null

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60]">
      {/* trail canvas */}
      <canvas ref={trailRef} className="absolute inset-0 h-full w-full" style={{ mixBlendMode: 'difference' }} />
      {/* dot — instant */}
      <div
        ref={dotRef}
        className="absolute left-0 top-0"
        style={{
          width: 6, height: 6, marginLeft: -3, marginTop: -3,
          backgroundColor: '#FFFCFB',
          mixBlendMode: 'difference',
          willChange: 'transform',
        }}
      />
      {/* ring — lagging, pixel square, difference */}
      <div
        ref={ringRef}
        className="absolute left-0 top-0"
        style={{
          width: 22, height: 22, marginLeft: -11, marginTop: -11,
          border: '1.5px solid #FFFCFB',
          backgroundColor: 'transparent',
          mixBlendMode: 'difference',
          willChange: 'transform',
          transition: 'width 0.18s ease, height 0.18s ease, opacity 0.18s ease, border-width 0.18s ease, transform 0.12s ease',
        }}
      >
        {/* crosshair ticks */}
        <span className="absolute left-1/2 top-0 h-1 w-px -translate-x-1/2 bg-[#FFFCFB]" />
        <span className="absolute bottom-0 left-1/2 h-1 w-px -translate-x-1/2 bg-[#FFFCFB]" />
        <span className="absolute left-0 top-1/2 h-px w-1 -translate-y-1/2 bg-[#FFFCFB]" />
        <span className="absolute right-0 top-1/2 h-px w-1 -translate-y-1/2 bg-[#FFFCFB]" />
      </div>
      {/* label chip */}
      <div
        ref={labelRef}
        className="absolute left-0 top-0 whitespace-nowrap border border-[#FFFCFB] bg-[#FFFCFB] px-2 py-0.5 font-pixel text-xs uppercase tracking-widest text-primary"
        style={{
          mixBlendMode: 'difference',
          willChange: 'transform, opacity',
          transition: 'opacity 0.16s ease, transform 0.16s ease',
          opacity: 0,
          transform: 'translate(-50%, -110%) scale(0.96)',
        }}
      />
    </div>
  )
}
