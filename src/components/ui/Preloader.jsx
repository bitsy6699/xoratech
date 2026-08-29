import { useEffect, useState } from 'react'
import { animate, useMotionValue } from 'framer-motion'
import PixelOverlay from './PixelOverlay'
import logoWhiteUrl from '../../assets/logo-crop-white.png'

const KEY = 'xora-booted'
const BOOT_MS = 900
const PIXELS = 14

export default function Preloader() {
  const [visible, setVisible] = useState(false)
  const [percent, setPercent] = useState(0)
  const [phase, setPhase] = useState('boot') // 'boot' | 'leaving'
  const overlayP = useMotionValue(0)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || sessionStorage.getItem(KEY)) return

    setVisible(true)
    document.documentElement.style.overflow = 'hidden'
    window.__lenis?.stop()
    const t0 = performance.now()
    let raf = 0

    const fallback = window.setTimeout(() => {
      sessionStorage.setItem(KEY, '1')
      setPercent(100)
      setPhase('leaving')
    }, BOOT_MS + 500)

    const finish = (now) => {
      const p = Math.min(1, (now - t0) / BOOT_MS)
      const eased = 1 - Math.pow(1 - p, 2)
      setPercent(Math.round(eased * 100))
      if (p < 1) {
        raf = requestAnimationFrame(finish)
        return
      }
      window.clearTimeout(fallback)
      sessionStorage.setItem(KEY, '1')
      setPhase('leaving')
    }

    raf = requestAnimationFrame(finish)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(fallback)
    }
  }, [])

  useEffect(() => {
    if (phase !== 'leaving') return
    overlayP.set(0.02)
    const controls = animate(overlayP, 1, {
      duration: 0.52,
      ease: [0.76, 0, 0.24, 1],
      onComplete: () => {
        setVisible(false)
        document.documentElement.style.overflow = ''
        window.__lenis?.start()
      },
    })
    const safety = window.setTimeout(() => {
      setVisible(false)
      document.documentElement.style.overflow = ''
      window.__lenis?.start()
    }, 1300)
    return () => {
      controls.stop()
      window.clearTimeout(safety)
    }
  }, [phase, overlayP])

  useEffect(() => {
    if (!visible) {
      document.documentElement.style.overflow = ''
      return
    }
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [visible])

  if (!visible) return null

  return (
    <>
      {phase === 'boot' ? (
        <div className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-primary text-cream">
          <img
            src={logoWhiteUrl}
            alt=""
            aria-hidden="true"
            className="h-20 w-auto"
            style={{ imageRendering: 'pixelated' }}
          />
          <p className="mt-6 font-pixel text-5xl tracking-[0.12em] text-cream">XORA</p>

          <div className="mt-10 flex gap-1.5" role="presentation">
            {Array.from({ length: PIXELS }).map((_, i) => {
              const filled = percent / 100 >= (i + 1) / PIXELS
              return (
                <span
                  key={i}
                  className={`h-4 w-4 border-2 transition-colors duration-100 ${
                    filled ? 'border-cream bg-cream' : 'border-cream/30 bg-transparent'
                  }`}
                />
              )
            })}
          </div>

          <p className="mt-6 font-pixel text-2xl text-cream/80">{percent}%</p>
        </div>
      ) : (
        <div className="pointer-events-none fixed inset-0 z-[70]">
          <PixelOverlay progress={overlayP} mode="reveal" color="#FFFCFB" cols={24} rows={16} />
        </div>
      )}
    </>
  )
}