import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { animate, useMotionValue } from 'framer-motion'
import PixelOverlay from './PixelOverlay'

export default function RouteTransition({ children }) {
  const { pathname } = useLocation()
  const [active, setActive] = useState(false)
  const [mode, setMode] = useState('cover')
  const [color, setColor] = useState('#FFFCFB')
  const p = useMotionValue(0)
  const lastRef = useRef(pathname)
  const stopRef = useRef(null)

  useEffect(() => {
    if (lastRef.current === pathname) return
    lastRef.current = pathname

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    stopRef.current?.()
    // lock scroll during transition
    window.__lenis?.stop()
    document.documentElement.style.overflow = 'hidden'
    document.body.style.pointerEvents = 'none'

    // determine overlay color from current view (fallback cream)
    const first = document.querySelector('main [data-nav-theme]')
    setColor(first?.dataset.navTheme === 'dark' ? '#FFFCFB' : '#093FB4')

    setActive(true)
    setMode('cover')
    p.set(0)

    let reveal
    const cleanup = () => {
      document.documentElement.style.overflow = ''
      document.body.style.pointerEvents = ''
      window.__lenis?.start()
    }
    const cover = animate(p, 1, {
      duration: 0.32,
      ease: [0.4, 0, 0.2, 1],
      onComplete: () => {
        // seamless: snap scroll to top while fully covered
        window.__lenis?.scrollTo(0, { immediate: true, force: true })
        window.scrollTo(0, 0)
        setMode('reveal')
        p.set(0)
        reveal = animate(p, 1, {
          duration: 0.52,
          ease: [0.76, 0, 0.24, 1],
          onComplete: () => {
            setActive(false)
            cleanup()
          },
        })
      },
    })
    stopRef.current = () => {
      cover.stop()
      reveal?.stop()
      cleanup()
    }
    const fallback = window.setTimeout(() => {
      setActive(false)
      cleanup()
    }, 1700)
    return () => {
      window.clearTimeout(fallback)
      stopRef.current?.()
      stopRef.current = null
    }
  }, [pathname, p])

  return (
    <>
      {children}
      {active && (
        <div className="pointer-events-none fixed inset-0 z-[65]">
          <PixelOverlay progress={p} mode={mode} color={color} cols={24} rows={16} />
        </div>
      )}
    </>
  )
}