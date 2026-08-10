import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import VideoMaskedHeading from '../ui/VideoMaskedHeading'
import PixelArrow from '../ui/PixelArrow'

export default function BlueprintHero({ sectionRef }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [stepIdx, setStepIdx] = useState(1)
  const [videoOn, setVideoOn] = useState(false)

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const idx = v < 0.16 ? 0 : v < 0.38 ? 1 : v < 0.56 ? 2 : v < 0.8 ? 3 : 4
    setStepIdx(idx)
    if (!videoOn && v >= 0.75) setVideoOn(true)
  })

  const gridOp = useTransform(scrollYProgress, [0, 0.3], [0.12, 0.28])

  const copyOp = useTransform(scrollYProgress, [0, 0.05, 0.11], [1, 1, 0])
  const copyY = useTransform(scrollYProgress, [0.05, 0.11], [0, -44])

  const scanOp = useTransform(scrollYProgress, [0.12, 0.16, 0.2, 0.25], [0, 1, 1, 0])
  const scanTop = useTransform(scrollYProgress, [0.12, 0.25], ['16%', '74%'])
  const crossOp = useTransform(scrollYProgress, [0.22, 0.27, 0.58, 0.64], [0, 1, 1, 0])

  const bpScale = useTransform(scrollYProgress, [0, 0.1, 0.45], [1, 1.02, 0.78])
  const bpOp = useTransform(scrollYProgress, [0, 0.5, 0.6], [1, 0.92, 0])

  const wfOp = useTransform(scrollYProgress, [0.36, 0.44, 0.7, 0.79], [0, 1, 1, 0])
  const wfScale = useTransform(scrollYProgress, [0.72, 0.79], [1, 1.05])
  const wfClip = useTransform(
    scrollYProgress,
    [0.4, 0.56],
    ['inset(0 50% 0 50%)', 'inset(0 0% 0 0%)']
  )
  const wfNavOp = useTransform(scrollYProgress, [0.38, 0.44], [0, 1])
  const cardsOp = useTransform(scrollYProgress, [0.56, 0.64], [0, 1])
  const cardsY = useTransform(scrollYProgress, [0.56, 0.64], [30, 0])

  const logoOp = useTransform(scrollYProgress, [0.8, 0.86, 0.92, 0.99], [0, 1, 1, 0])
  const logoScale = useTransform(scrollYProgress, [0.8, 0.86, 1], [1.08, 1, 1.5])
  const logoBlur = useTransform(scrollYProgress, [0.94, 1], ['blur(0px)', 'blur(14px)'])
  const logoY = useTransform(scrollYProgress, [0.82, 0.9], [22, 0])

  if (reduce) {
    return <StaticHero sectionRef={sectionRef} />
  }

  return (
    <section ref={ref} data-nav-theme="dark" className="relative h-[500vh] bg-primary">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* technical grid */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ opacity: gridOp }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,252,251,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,252,251,0.35) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
        </motion.div>

        {/* blueprint scene */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 z-[1] grid place-items-center"
          style={{ scale: bpScale, opacity: bpOp }}
        >
          <img
            src="/blueprint.png"
            alt=""
            className="block w-[min(120vw,1400px)] max-w-none select-none"
            draggable="false"
          />
          <motion.div
            className="pointer-events-none absolute left-[4%] right-[4%] h-[2px] bg-cream shadow-[0_0_18px_rgba(255,252,251,0.8)]"
            style={{ top: scanTop, opacity: scanOp }}
          />
          <motion.div
            className="pointer-events-none absolute h-[36px] w-[36px] border border-cream/70"
            style={{ top: '22%', left: '22%', opacity: crossOp }}
          />
          <motion.div
            className="pointer-events-none absolute h-[36px] w-[36px] border border-cream/70"
            style={{ bottom: '22%', right: '22%', opacity: crossOp }}
          />
        </motion.div>

        {/* opening copy */}
        <motion.div
          className="absolute left-[7vw] top-[15vh] z-[2] max-w-[560px] text-cream"
          style={{ opacity: copyOp, y: copyY }}
        >
          <p className="font-pixel text-sm uppercase tracking-[0.2em] text-cream/70">
            Technical Blueprint / 01
          </p>
          <h1 className="mt-4 text-[clamp(44px,7vw,104px)] font-bold leading-[0.9] tracking-[-0.04em]">
            DARI
            <br />
            <span className="text-cream/35">BLUEPRINT</span>
            <br />
            KE DIGITAL.
          </h1>
          <p className="mt-6 font-pixel text-lg uppercase tracking-[0.15em] text-cream/60">
            Gulir untuk merakit pengalamannya
          </p>
        </motion.div>

        {/* wireframe stage */}
        <motion.div
          className="absolute inset-0 z-[3] grid place-items-center"
          style={{ opacity: wfOp }}
        >
          <div className="absolute left-[7vw] top-[9vh]">
            <motion.p
              className="font-pixel text-xl uppercase tracking-[0.12em] text-cream"
              style={{ opacity: wfNavOp }}
            >
              XORA <span className="text-cream/45">TECH</span>
            </motion.p>
          </div>
          <motion.div
            className="relative w-[min(86vw,1100px)] border-2 border-cream/80 p-[8vw_7vw]"
            style={{ scale: wfScale, clipPath: wfClip }}
          >
            <h2 className="text-[clamp(52px,8vw,120px)] font-bold leading-[0.85] tracking-[-0.05em]">
              BUILD
              <br />
              WHAT&apos;S NEXT.
            </h2>
            <p className="mt-7 max-w-[420px] text-lg font-light leading-relaxed text-cream/70">
              Produk digital yang direkayasa dari ide hingga diluncurkan.
            </p>
            <Link
              to="/kontak"
              className="mt-9 inline-flex items-center gap-2 border-2 border-cream bg-cream px-7 py-4 font-sans text-sm font-bold uppercase tracking-wide text-primary shadow-[4px_4px_0_0_#093FB4] transition-transform hover:-translate-y-0.5"
            >
              Mulai Proyek
              <PixelArrow className="h-3.5 w-3.5 text-current" />
            </Link>
          </motion.div>
          <motion.div
            className="absolute bottom-[10vh] right-[7vw] flex gap-2"
            style={{ opacity: cardsOp, y: cardsY }}
          >
            {['WEB', 'APP', 'DESIGN'].map((c) => (
              <span
                key={c}
                className="border border-cream/55 bg-primary/40 px-6 py-3 font-pixel text-base uppercase tracking-[0.18em] text-cream"
              >
                {c}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* logo reveal */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-[4] grid place-items-center text-center text-cream"
          style={{ opacity: logoOp }}
        >
          <motion.div
            className="flex w-[min(94vw,960px)] flex-col items-center"
            style={{ scale: logoScale, filter: logoBlur, y: logoY }}
          >
            <VideoMaskedHeading active={videoOn} className="-mb-[4.5vw] w-[min(100%,960px)]" />
            <p className="font-pixel text-[clamp(18px,3vw,42px)] uppercase tracking-[0.45em] text-cream/80">
              TECH
            </p>
            <p className="mt-8 font-pixel text-sm uppercase tracking-[0.25em] text-cream/60">
              We Build What Comes Next
            </p>
            <div className="pointer-events-auto mt-10 flex flex-wrap justify-center gap-4">
              <Link
                to="/kontak"
                className="inline-flex items-center gap-2 border-2 border-cream bg-cream px-9 py-4 font-sans text-sm font-bold uppercase tracking-wide text-primary shadow-[4px_4px_0_0_#093FB4] transition-transform hover:-translate-y-0.5"
              >
                Mulai Proyek
                <PixelArrow className="h-3.5 w-3.5 text-current" />
              </Link>
              <a
                href="mailto:halo@xora.id"
                className="inline-flex items-center border-2 border-cream/50 px-9 py-4 font-sans text-sm font-semibold uppercase tracking-wide text-cream transition-colors hover:bg-cream hover:text-primary"
              >
                Email Kami
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* scroll / scrub indicator */}
        <div className="pointer-events-none absolute bottom-6 right-5 z-[5] flex flex-col items-end gap-4 md:right-8">
          <div className="flex items-center gap-3 font-pixel text-lg uppercase tracking-[0.25em] text-cream">
            <span className="h-2 w-2 bg-cream" />
            Showreel {String(stepIdx + 1).padStart(2, '0')}/05
          </div>
          <div className="relative h-20 w-1 overflow-hidden bg-cream/20">
            <motion.div
              className="absolute inset-x-0 top-0 h-full origin-top bg-cream"
              style={{ scaleY: scrollYProgress }}
            />
          </div>
          <div className="flex items-center gap-2 font-pixel text-sm uppercase tracking-[0.2em] text-cream/50">
            <PixelArrow direction="d" className="h-3.5 w-3.5 animate-scroll-hint" />
            Scroll
          </div>
        </div>
      </div>
    </section>
  )
}

function StaticHero({ sectionRef }) {
  return (
    <section ref={sectionRef} data-nav-theme="dark" className="relative grid min-h-[92vh] place-items-center overflow-hidden bg-primary py-24 text-center text-cream">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,252,251,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,252,251,0.35) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="relative mx-auto max-w-4xl px-4">
        <VideoMaskedHeading
          active
          preferPoster
          className="mx-auto w-[min(100%,860px)]"
        />
        <p className="mt-4 font-pixel text-xl uppercase tracking-[0.45em] text-cream/80">Tech</p>
        <p className="mt-6 text-lg font-light text-cream/70">
          Produk digital yang direkayasa dari ide hingga diluncurkan.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Link
            to="/kontak"
            className="inline-flex items-center gap-2 border-2 border-cream bg-cream px-9 py-4 font-sans text-sm font-bold uppercase tracking-wide text-primary shadow-[4px_4px_0_0_#093FB4]"
          >
            Mulai Proyek
            <PixelArrow className="h-3.5 w-3.5 text-current" />
          </Link>
          <Link
            to="/layanan"
            className="inline-flex items-center border-2 border-cream/50 px-9 py-4 font-sans text-sm font-semibold uppercase tracking-wide text-cream"
          >
            Lihat Layanan
          </Link>
        </div>
      </div>
    </section>
  )
}