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

    const first = document.querySelector('main [data-nav-theme]')
    setColor(first?.dataset.navTheme === 'dark' ? '#FFFCFB' : '#093FB4')

    stopRef.current?.()
    setActive(true)
    setMode('cover')
    p.set(0)

    let reveal
    const cover = animate(p, 1, {
      duration: 0.28,
      ease: 'easeIn',
      onComplete: () => {
        setMode('reveal')
        p.set(0)
        reveal = animate(p, 1, {
          duration: 0.45,
          ease: [0.76, 0, 0.24, 1],
          onComplete: () => setActive(false),
        })
      },
    })
    stopRef.current = () => {
      cover.stop()
      reveal?.stop()
    }
    const fallback = window.setTimeout(() => setActive(false), 1600)
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
          <PixelOverlay progress={p} mode={mode} color={color} />
        </div>
      )}
    </>
  )
}