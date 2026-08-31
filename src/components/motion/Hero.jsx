import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import MaskedTextPressure from '../ui/MaskedTextPressure'
import PixelArrow from '../ui/PixelArrow'
import Magnetic from '../ui/Magnetic'
import HeroGrid from './HeroGrid'

export default function Hero({ sectionRef }) {
  const ref = useRef(null)
  const spotlightRef = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const outScale = useTransform(scrollYProgress, [0, 1], [1, 1.06])
  const outOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0])
  const ghostY = useTransform(scrollYProgress, [0, 1], [0, -80])

  useEffect(() => {
    const el = ref.current
    const spot = spotlightRef.current
    if (!el || !spot || reduce) return
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine) return
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const x = ((e.clientX - r.left) / (r.width || 1)) * 100
      const y = ((e.clientY - r.top) / (r.height || 1)) * 100
      spot.style.setProperty('--sx', `${x}%`)
      spot.style.setProperty('--sy', `${y}%`)
      spot.style.opacity = '1'
    }
    const onLeave = () => { spot.style.opacity = '0' }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [reduce])

  return (
    <section
      ref={(el) => {
        ref.current = el
        if (sectionRef) sectionRef.current = el
      }}
      data-nav-theme="dark"
      className="relative grid min-h-screen place-items-center overflow-hidden bg-primary py-28 text-center text-cream"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 8%, rgba(255,252,251,0.1), transparent 60%)',
        }}
      />
      {/* cursor spotlight — very subtle */}
      <div
        ref={spotlightRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] hidden opacity-0 transition-opacity duration-300 lg:block"
        style={{
          background:
            'radial-gradient(420px at var(--sx, 50%) var(--sy, 50%), rgba(255,252,251,0.09), transparent 68%)',
          opacity: 0,
        }}
      />
      {/* scan sweep beam */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-px bg-gradient-to-r from-transparent via-cream/40 to-transparent"
        style={{ animation: reduce ? 'none' : 'scan-sweep 4.2s ease-in-out infinite' }}
      />
      {/* ghost word behind */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 grid place-items-center select-none overflow-hidden"
        style={reduce ? undefined : { y: ghostY }}
      >
        <span
          className="font-pixel text-[32vw] leading-none tracking-[-0.04em] text-cream lg:text-[22vw]"
          style={{ opacity: 0.035 }}
        >
          XORA
        </span>
      </motion.div>
      <HeroGrid />
      <motion.div
        className="relative z-10 mx-auto w-full max-w-6xl px-4"
        style={reduce ? undefined : { scale: outScale, opacity: outOpacity }}
      >
        <p className="font-pixel text-sm uppercase tracking-[0.32em] text-cream/60">
          Xora Tech <span className="mx-3 text-cream/30">·</span> Web / App / Design<span className="animate-caret ml-1 inline-block h-3 w-2 translate-y-px bg-cream/60" />
        </p>

        <MaskedTextPressure
          text="XORA"
          tag="h1"
          mediaType={reduce ? 'image' : 'video'}
          src="/videos/header.mp4"
          poster="/videos/header-poster.jpg"
          className="mx-auto mt-6 w-[min(100%,1100px)]"
          textScale={0.26}
          minFontSize={88}
          fillScale={1.3}
          parallax={22}
          drift={12}
          brightness={1}
          reveal="rise"
          trigger="view"
        />

        <p className="mx-auto mt-7 max-w-2xl text-lg font-light leading-relaxed text-cream/70">
          Kami merekayasa produk digital dari ide hingga diluncurkan — clean, cepat, dan presisi.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Magnetic>
            <Link
              to="/kontak"
              data-cursor="Mulai"
              className="group inline-flex items-center gap-2 border-2 border-cream bg-cream px-9 py-4 font-sans text-sm font-bold uppercase tracking-wide text-primary shadow-[2px_2px_0_0_#FFFCFB] transition-colors hover:bg-cream/90"
            >
              <span className="relative">Mulai Proyek</span>
              <PixelArrow className="h-3.5 w-3.5 text-current transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Magnetic>
          <Magnetic>
            <Link
              to="/layanan"
              data-cursor="Lihat"
              className="inline-flex items-center border-2 border-cream/50 px-9 py-4 font-sans text-sm font-semibold uppercase tracking-wide text-cream transition-colors hover:bg-cream hover:text-primary"
            >
              Lihat Layanan
            </Link>
          </Magnetic>
        </div>
      </motion.div>
    </section>
  )
}
