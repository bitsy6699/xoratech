import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { scrollToTop } from '../../lib/smooth'

export default function ScrollToTop() {
  const { pathname } = useLocation()
  // RouteTransition handles the actual scroll reset (mid-cover) for smoothness.
  // This keeps a fallback for reduced-motion / no-Lenis cases.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !window.__lenis) {
      scrollToTop(true)
    }
  }, [pathname])
  return null
}