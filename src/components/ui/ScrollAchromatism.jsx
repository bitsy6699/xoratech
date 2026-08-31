import { useEffect } from 'react'

export default function ScrollAchromatism() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const coarse = window.matchMedia('(pointer: coarse)').matches
    if (coarse) return

    let cur = 0
    let target = 0
    let raf = 0
    let lastY = window.scrollY
    let lastT = performance.now()

    const tick = () => {
      cur += (target - cur) * 0.12
      const v = Math.abs(cur)
      // clamp subtle: max ~1.6px split; below 0.14 invisible → skip
      if (v > 0.14) {
        const s = v.toFixed(2)
        document.documentElement.style.setProperty('--ab-r', `${s}px`)
        document.documentElement.style.setProperty('--ab-b', `-${s}px`)
        document.documentElement.classList.add('has-aberration')
      } else {
        document.documentElement.classList.remove('has-aberration')
      }
      // decay target slowly so it eases out
      target *= 0.94
      if (Math.abs(target) > 0.02 || Math.abs(cur) > 0.06) {
        raf = requestAnimationFrame(tick)
      } else {
        raf = 0
        document.documentElement.classList.remove('has-aberration')
      }
    }

    const onScroll = () => {
      const now = performance.now()
      const y = window.__lenis ? window.__lenis.scroll : window.scrollY
      const dt = Math.max(16, now - lastT)
      const dy = y - lastY
      const vel = dy / (dt / 16)
      lastY = y
      lastT = now
      // map velocity to split; threshold out micro-jitters
      const next = Math.max(0, Math.min(1, Math.abs(vel) * 0.055 - 0.18))
      if (next > target) target = next
      if (!raf) raf = requestAnimationFrame(tick)
    }

    // Lenis drives scroll; also listen window scroll as fallback
    const lenis = window.__lenis
    if (lenis?.on) lenis.on('scroll', onScroll)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      if (lenis?.off) lenis.off('scroll', onScroll)
      document.documentElement.classList.remove('has-aberration')
      document.documentElement.style.removeProperty('--ab-r')
      document.documentElement.style.removeProperty('--ab-b')
    }
  }, [])

  return null
}
