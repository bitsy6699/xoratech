import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import MaskedTextPressure from '../ui/MaskedTextPressure'
import PixelArrow from '../ui/PixelArrow'
import HeroGrid from './HeroGrid'

export default function Hero({ sectionRef }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const outScale = useTransform(scrollYProgress, [0, 1], [1, 1.06])
  const outOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0])

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
      <HeroGrid />
      <motion.div
        className="relative z-10 mx-auto w-full max-w-6xl px-4"
        style={reduce ? undefined : { scale: outScale, opacity: outOpacity }}
      >
        <p className="font-pixel text-sm uppercase tracking-[0.32em] text-cream/60">
          Xora Tech <span className="mx-3 text-cream/30">·</span> Web / App / Design
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
          <Link
            to="/kontak"
            className="inline-flex items-center gap-2 border-2 border-cream bg-cream px-9 py-4 font-sans text-sm font-bold uppercase tracking-wide text-primary shadow-[2px_2px_0_0_#FFFCFB] transition-colors hover:bg-cream/90"
          >
            Mulai Proyek
            <PixelArrow className="h-3.5 w-3.5 text-current" />
          </Link>
          <Link
            to="/layanan"
            className="inline-flex items-center border-2 border-cream/50 px-9 py-4 font-sans text-sm font-semibold uppercase tracking-wide text-cream transition-colors hover:bg-cream hover:text-primary"
          >
            Lihat Layanan
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
