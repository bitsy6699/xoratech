import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useScroll, useTransform } from 'framer-motion'
import Squares from '../components/react-bits/Squares'
import FadeContent from '../components/react-bits/FadeContent'
import RevealHeading from '../components/motion/RevealHeading'
import { Stagger, StaggerItem, Reveal } from '../components/motion/Reveal'
import CountUp from '../components/motion/CountUp'
import TiltCard from '../components/motion/TiltCard'
import { SectionKicker, ArrowLink, Marquee, PixelTag } from '../components/ui/Button.jsx'
import PixelArrow from '../components/ui/PixelArrow'
import PixelWipe from '../components/ui/PixelWipe'
import TypingText from '../components/ui/TypingText'
import XorMark from '../components/ui/XorMark'
import LineDraw from '../components/ui/LineDraw'
import FloatingPixelBlocks from '../components/ui/FloatingPixelBlocks'
import { services } from '../data/services'
import { portfolio } from '../data/portfolio'
import { testimonials, stats, processSteps, marqueeTags } from '../data/content'

export default function HomePage() {
  const heroRef = useRef(null)
  const categoriesRef = useRef(null)

  return (
    <div>
      <Hero sectionRef={heroRef} />
      <PixelWipe start={heroRef} end={categoriesRef} from="#020f2c" to="#fffcfb" />
      <ServicesMarquee />
      <CategoriesSection sectionRef={categoriesRef} />
      <WhySection />
      <PortfolioPreview />
      <ProcessSection />
      <StatsSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  )
}

function Hero({ sectionRef }) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const { scrollY } = useScroll()
  const yHero = useTransform(scrollY, [0, 700], [0, 140])

  const onMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const px = useTransform(mx, [-0.5, 0.5], [10, -10])
  const py = useTransform(my, [-0.5, 0.5], [6, -6])

  return (
    <section
      ref={sectionRef}
      data-nav-theme="dark"
      onMouseMove={onMouseMove}
      className="relative isolate overflow-hidden bg-primary-deep text-cream"
    >
      <div className="absolute inset-0 opacity-[0.35]">
        <Squares speed={0.3} squareSize={48} borderColor="rgba(255,252,251,0.12)" hoverFillColor="#3DF0C4" />
      </div>
      <FloatingPixelBlocks />
      <motion.div
        style={{ x: useTransform(my, [-0.5, 0.5], [-40, 40]), y: useTransform(scrollY, [0, 700], [0, 90]) }}
        className="pointer-events-none absolute right-[-12vw] top-1/2 hidden -translate-y-1/2 md:block"
      >
        <XorMark className="h-[52vw] w-[52vw] max-h-[560px] max-w-[560px] text-white/[0.045]" />
      </motion.div>

      <motion.div
        style={{ y: yHero }}
        className="relative mx-auto max-w-7xl px-4 pb-36 pt-24 sm:px-6 sm:pt-32 lg:px-8"
      >
        <motion.div style={{ x: px, y: py }}>
          <FadeContent>
            <PixelTag dark className="mb-8">
              Solusi Digital #1
            </PixelTag>
          </FadeContent>

          <h1 className="max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            <span className="text-white">Kami Bangun Digital</span>
            <br />
            <span className="text-cream">
              <TypingText
                words={['Website Layanan Anda', 'Aplikasi Bisnis Anda', 'E-Commerce Impian', 'Sistem & IT Anda']}
                className="text-pixel"
              />
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-white/70">
            Website development, aplikasi mobile &amp; web, hingga support IT — dikerjakan tim yang
            berpengalaman, transparan, dan selalu menjaga kualitas serta kecepatan.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/kontak"
              className="btn-sheen inline-flex items-center gap-3 border-2 border-cream bg-cream px-8 py-4 font-sans font-bold uppercase tracking-wide text-primary shadow-[6px_6px_0_0_#00000040] transition-all hover:bg-pixel hover:text-primary-deep"
            >
              Mulai Proyek
              <PixelArrow className="h-4 w-4 text-current" />
            </Link>
            <Link
              to="/portofolio"
              className="inline-flex items-center gap-2 border-2 border-white/40 px-8 py-4 font-sans font-semibold uppercase tracking-wide text-cream transition-colors hover:border-pixel hover:text-pixel"
            >
              Lihat Portofolio
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-20 flex flex-wrap items-center gap-3 font-pixel text-lg uppercase tracking-widest text-white/50"
        >
          <span className="h-2 w-2 bg-pixel" />
          <span>Website</span>
          <span>Aplikasi</span>
          <span>E-Commerce</span>
          <span>IT Support</span>
          <span className="h-2 w-2 bg-pixel" />
        </motion.div>
      </motion.div>

      {/* scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 text-white/40">
          <span className="animate-scroll-hint font-pixel text-sm uppercase tracking-[0.3em]">Scroll</span>
          <PixelArrow direction="d" className="h-4 w-4 animate-scroll-hint text-pixel" />
        </div>
      </motion.div>
    </section>
  )
}

function ServicesMarquee() {
  return (
    <div data-nav-theme="light" className="marquee-paused border-y-2 border-primary/10 bg-cream py-5">
      <Marquee items={marqueeTags} />
    </div>
  )
}

const CategoriesSection = ({ sectionRef }) => {
  return (
    <section ref={sectionRef} className="bg-cream py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <SectionKicker>Layanan Kami</SectionKicker>
              <RevealHeading lines={['Digital untuk semua', 'kebutuhan Anda']} className="text-4xl font-bold tracking-tight sm:text-5xl" />
            </div>
            <ArrowLink to="/layanan">Semua layanan</ArrowLink>
          </div>
        </Reveal>

        <Stagger className="grid gap-8 md:grid-cols-3" stagger={0.12}>
          {Object.values(services).map((full) => (
            <StaggerItem key={full.slug}>
              <TiltCard intensity={7}>
                <Link
                  to={`/layanan/${full.slug}`}
                  className="group relative block h-full border-2 border-primary-darker bg-card p-8 shadow-[8px_8px_0_0_#051a66] transition-all duration-200 hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0_0_#051a66]"
                >
                  <div className="mb-8 flex items-start justify-between">
                    <span className="grid h-14 w-14 place-items-center border-2 border-primary-darker bg-primary font-pixel text-2xl text-cream">
                      {full.title[0]}
                    </span>
                    <PixelArrow className="h-5 w-5 text-primary transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                  <h3 className="text-2xl font-bold">{full.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{full.description}</p>
                  <div className="mt-6 flex items-center gap-3 font-pixel text-lg uppercase tracking-widest text-primary">
                    <span>{full.services.length} Layanan</span>
                    <span className="h-2 w-2 bg-primary opacity-30" />
                    <span>Lihat Detail</span>
                  </div>
                </Link>
              </TiltCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

function WhySection() {
  return (
    <section data-nav-theme="dark" className="bg-primary py-24 text-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionKicker dark>Kenapa Xora</SectionKicker>
            <RevealHeading
              lines={['Bukan sekadar', 'bikin kode']}
              className="text-4xl font-bold tracking-tight text-pixel sm:text-5xl"
            />
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-lg text-lg font-light leading-relaxed text-white/70">
                Kepercayaan, kecepatan, dan kualitas adalah tiga hal yang selalu kami pegang dalam
                setiap proyek yang kami kerjakan.
              </p>
            </Reveal>
          </div>
          <Stagger className="space-y-4" stagger={0.12}>
            {[
              ['No.1', 'Keahlian Tim', 'Ekspert di berbagai stack teknologi terkini.'],
              ['No.2', 'Proses Transparan', 'Selalu update progress dari awal sampai launch.'],
              ['No.3', 'Dukungan 24/7', 'Konsultasi dan support sesudah proyek selesai.'],
            ].map(([num, title, desc]) => (
              <StaggerItem key={num}>
                <div className="group flex gap-5 border-2 border-white/15 bg-white/5 p-5 transition-colors hover:border-pixel/60">
                  <span className="font-pixel text-3xl text-pixel">{num}</span>
                  <div>
                    <h3 className="text-lg font-bold">{title}</h3>
                    <p className="mt-1 text-sm text-white/60">{desc}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  )
}

function PortfolioPreview() {
  return (
    <section className="bg-cream py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <SectionKicker>Portofolio</SectionKicker>
              <RevealHeading lines={['Karya yang sudah', 'kami kerjakan']} className="text-4xl font-bold tracking-tight sm:text-5xl" />
            </div>
            <ArrowLink to="/portofolio">Selengkapnya</ArrowLink>
          </div>
        </Reveal>

        <Stagger className="grid gap-8 md:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {portfolio.slice(0, 6).map((item) => (
            <StaggerItem key={item.id}>
              <TiltCard intensity={5} scale={1.015}>
                <Link
                  to="/portofolio"
                  className="group block border-2 border-primary-darker bg-card shadow-[6px_6px_0_0_#051a66] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_0_#051a66]"
                >
                  <div
                    className="relative flex h-44 items-center justify-center overflow-hidden"
                    style={{ backgroundColor: item.color }}
                  >
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
                    <span className="font-pixel text-4xl uppercase tracking-widest text-cream">{item.categoryLabel}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold">{item.title}</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span key={tag} className="border border-primary/20 px-2 py-0.5 font-pixel text-sm uppercase text-primary">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </TiltCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

function ProcessSection() {
  return (
    <section data-nav-theme="dark" className="bg-primary-deep py-24 text-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-14">
            <SectionKicker dark>Proses Kerja</SectionKicker>
            <RevealHeading lines={['Empat langkah menuju', 'selesai']} className="text-4xl font-bold tracking-tight sm:text-5xl" />
          </div>
        </Reveal>

        <Stagger className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4" stagger={0.12}>
          {processSteps.map((step) => (
            <StaggerItem key={step.step}>
              <div className="group relative border-2 border-white/15 bg-white/5 p-6 transition-colors hover:border-pixel/60">
                <span className="font-pixel text-5xl text-pixel">{step.step}</span>
                <h3 className="mt-4 text-xl font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{step.description}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

function StatsSection() {
  return (
    <section className="border-y-2 border-primary/10 bg-cream">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px py-16 sm:grid-cols-4">
        {stats.map((stat) => (
          <StatItem key={stat.label} {...stat} />
        ))}
      </div>
    </section>
  )
}

function StatItem({ value, suffix, label }) {
  return (
    <Reveal className="px-6 py-4 text-center">
      <div className="text-5xl font-bold tracking-tight text-primary sm:text-6xl">
        <CountUp value={value} suffix="" />
        <span className="text-pixel-dim">{suffix}</span>
      </div>
      <p className="mt-2 font-pixel text-xl uppercase tracking-widest text-muted">{label}</p>
    </Reveal>
  )
}

function TestimonialsSection() {
  return (
    <section className="bg-cream py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-14">
            <SectionKicker>Testimoni</SectionKicker>
            <RevealHeading lines={['Kata mereka', 'tentang Xora']} className="text-4xl font-bold tracking-tight sm:text-5xl" />
          </div>
        </Reveal>

        <Stagger className="grid gap-8 md:grid-cols-2" stagger={0.1}>
          {testimonials.map((t) => (
            <StaggerItem key={t.name}>
              <figure className="h-full border-2 border-primary-darker bg-card p-6 shadow-[6px_6px_0_0_#051a66] transition-all hover:-translate-y-0.5 hover:shadow-[6px_8px_0_0_#051a66]">
                <div className="flex gap-1 text-pixel-dim">{"★★★★★"}</div>
                <blockquote className="mt-4 text-lg font-light leading-relaxed">"{t.quote}"</blockquote>
                <figcaption className="mt-6">
                  <div className="font-bold">{t.name}</div>
                  <div className="text-sm text-muted">{t.role}</div>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section data-nav-theme="dark" className="border-t-2 border-primary-deep bg-primary text-cream">
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-24 text-center sm:px-6 lg:px-8">
        <Reveal>
          <SectionKicker dark className="justify-center">
            Let&apos;s Build
          </SectionKicker>
          <RevealHeading
            lines={['Punya ide? Mari', 'wujudkan bersama Xora.']}
            className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl"
          />
          <p className="mx-auto mt-6 max-w-xl text-lg font-light text-white/70">
            Konsultasi gratis tanpa komitmen. Ceritakan kebutuhan Anda, kami susun solusinya.
          </p>

          <div className="mx-auto mt-10 max-w-md">
            <LineDraw className="w-full" />
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/kontak"
              className="btn-sheen inline-flex items-center gap-3 border-2 border-cream bg-cream px-9 py-4 font-sans text-sm font-bold uppercase tracking-wide text-primary shadow-[6px_6px_0_0_#00000080] transition-all hover:bg-pixel hover:text-primary-deep"
            >
              Mulai Proyek
              <PixelArrow className="h-4 w-4 text-current" />
            </Link>
            <a
              href="#"
              className="inline-flex items-center border-2 border-white/40 px-9 py-4 font-sans text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:border-pixel hover:text-pixel"
            >
              WhatsApp Kami
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}