import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useSmoothScroll() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return undefined

    const lenis = new Lenis({
      autoRaf: false,
      anchors: true,
      smoothWheel: true,
      syncTouch: false,
      gestureOrientation: 'vertical',
      wheelMultiplier: 1.05,
      touchMultiplier: 1.4,
      duration: 1.35,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      lerp: 0.075,
    })
    window.__lenis = lenis

    lenis.on('scroll', ScrollTrigger.update)

    let rafId
    const loop = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.off('scroll', ScrollTrigger.update)
      lenis.destroy()
      window.__lenis = null
    }
  }, [])
}

export function scrollToTop(immediate = true) {
  const lenis = window.__lenis
  if (lenis) {
    if (immediate) lenis.scrollTo(0, { immediate: true, force: true })
    else lenis.scrollTo(0, { duration: 0.9, easing: (t) => 1 - Math.pow(1 - t, 3) })
  } else {
    window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' })
  }
}

export function lenisStop() {
  window.__lenis?.stop()
}
export function lenisStart() {
  window.__lenis?.start()
}

export function scrollToTarget(target) {
  const lenis = window.__lenis
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.2 })
  } else {
    const el = typeof target === 'string' ? document.querySelector(target) : target
    el?.scrollIntoView({ behavior: 'smooth' })
  }
}

export default function SmoothScroll() {
  useSmoothScroll()
  return null
}