import { useRef } from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/motion/Hero'
import RevealHeading from '../components/motion/RevealHeading'
import ScrollHeading from '../components/motion/ScrollHeading'
import ScrubHeading from '../components/motion/ScrubHeading'
import ScrollReveal from '../components/motion/ScrollReveal'
import { Reveal } from '../components/motion/Reveal'
import CountUp from '../components/motion/CountUp'
import TiltCard from '../components/motion/TiltCard'
import Parallax from '../components/motion/Parallax'
import HorizontalScroll from '../components/motion/HorizontalScroll'
import { SectionKicker, ArrowLink, Marquee } from '../components/ui/Button.jsx'
import Magnetic from '../components/ui/Magnetic'
import PixelArrow from '../components/ui/PixelArrow'
import PixelWipe from '../components/ui/PixelWipe'
import RippleDistortion from '../components/ui/RippleDistortion'
import LineDraw from '../components/ui/LineDraw'
import Spotlight from '../components/ui/Spotlight'
import CardSpotlight from '../components/ui/CardSpotlight'
import TestimonialCarousel from '../components/ui/TestimonialCarousel'
import logoWhiteUrl from '../assets/logo-crop-white.png'
import { services } from '../data/services'
import { portfolio } from '../data/portfolio'
import { testimonials, stats, processSteps, marqueeTags } from '../data/content'

export default function HomePage() {
  const heroRef = useRef(null)
  const categoriesRef = useRef(null)

  return (
    <div>
      <Hero sectionRef={heroRef} />
      <PixelWipe start={heroRef} end={categoriesRef} from="#093FB4" to="#FFFCFB" />
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

function ServicesMarquee() {
  return (
    <div data-nav-theme="light" className="marquee-paused marquee-fade border-y-2 border-primary/10 bg-cream py-5">
      <Marquee items={marqueeTags} />
    </div>
  )
}

const CategoriesSection = ({ sectionRef }) => {
  return (
    <section ref={sectionRef} data-nav-theme="light" className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0">
        <RippleDistortion>
          <video
            className="h-full w-full object-cover"
            src="/videos/header.mp4"
            poster="/videos/header-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0" style={{ background: 'rgba(9, 63, 180, 0.35)' }} />
        </RippleDistortion>
      </div>
      <div className="relative z-10 py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <SectionKicker dark>Layanan Kami</SectionKicker>
                <ScrollHeading lines={['Digital untuk semua', 'kebutuhan Anda']} className="text-4xl font-bold tracking-tight text-cream sm:text-5xl" />
              </div>
              <ArrowLink to="/layanan" dark>Semua layanan</ArrowLink>
            </div>
            <div aria-hidden="true" className="mb-14 flex items-center gap-4">
              <span className="h-1.5 flex-1 bg-primary shadow-[4px_4px_0_0_rgba(9,63,180,0.25)]" />
              <span className="h-3 w-3 shrink-0 bg-primary" />
              <span className="h-1.5 flex-1 bg-primary shadow-[4px_4px_0_0_rgba(9,63,180,0.25)]" />
            </div>
          </ScrollReveal>

          <div className="grid gap-8 md:grid-cols-3">
            {Object.values(services).map((full) => (
              <TiltCard key={full.slug} intensity={7} className="h-full">
                <CardSpotlight className="h-full">
                  <Link
                    to={`/layanan/${full.slug}`}
                    data-cursor="Lihat"
                    className="group relative flex h-full flex-col border-2 border-primary/25 bg-cream p-8 shadow-[4px_4px_0_0_#093FB4] transition-colors duration-200 hover:border-primary/50"
                  >
                    <div className="mb-8 flex items-start justify-between">
                      <span className="grid h-14 w-14 place-items-center border-2 border-primary/25 bg-primary font-pixel text-2xl text-cream">
                        {full.title[0]}
                      </span>
                      <PixelArrow className="h-5 w-5 text-primary transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>
                    <h3 className="text-2xl font-bold">{full.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-primary/60">{full.description}</p>
                    <div className="mt-6 flex items-center gap-3 font-sans text-sm font-semibold uppercase tracking-wide text-primary">
                      <span>{full.services.length} Layanan</span>
                      <span className="h-2 w-2 bg-primary opacity-30" />
                      <span>Lihat Detail</span>
                    </div>
                  </Link>
                </CardSpotlight>
              </TiltCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function WhySection() {
  return (
    <section data-nav-theme="dark" className="relative isolate overflow-hidden bg-primary py-28 text-cream">
      <Spotlight>
        <Parallax
          speed={0.22}
          className="pointer-events-none absolute -right-16 top-1/2 z-0 hidden -translate-y-1/2 lg:block"
        >
          <img
            src={logoWhiteUrl}
            alt=""
            aria-hidden="true"
            className="h-auto w-[40vw] max-w-[520px] opacity-[0.05]"
            style={{ imageRendering: 'pixelated' }}
          />
        </Parallax>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionKicker dark>Kenapa Xora</SectionKicker>
            <ScrollHeading
              lines={['Bukan sekadar', 'bikin kode']}
              className="text-4xl font-bold tracking-tight text-cream sm:text-5xl"
            />
            <p className="mt-6 max-w-lg text-lg font-light leading-relaxed text-cream/70">
              Kepercayaan, kecepatan, dan kualitas adalah tiga hal yang selalu kami pegang dalam
              setiap proyek yang kami kerjakan.
            </p>
          </div>
          <div className="space-y-4">
            {[
              ['No.1', 'Keahlian Tim', 'Ekspert di berbagai stack teknologi terkini.'],
              ['No.2', 'Proses Transparan', 'Selalu update progress dari awal sampai launch.'],
              ['No.3', 'Dukungan 24/7', 'Konsultasi dan support sesudah proyek selesai.'],
            ].map(([num, title, desc]) => (
              <div
                key={num}
                className="group flex gap-5 border-2 border-cream/15 bg-cream/5 p-5 transition-colors hover:border-cream/60"
              >
                <span className="font-pixel text-3xl text-cream">{num}</span>
                <div>
                  <h3 className="text-lg font-bold">{title}</h3>
                  <p className="mt-1 text-sm text-cream/60">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </Spotlight>
    </section>
  )
}

function PortfolioPreview() {
  return (
    <HorizontalScroll className="bg-cream" scrollHeight="360vh">
      <div className="flex h-[64vh] w-[82vw] flex-col justify-center lg:w-[48vw]">
        <div className="mb-5 flex items-center gap-3 font-sans text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          <span className="h-2 w-2 bg-primary/40" />
          Portofolio
        </div>
        <RevealHeading
          lines={['Karya yang sudah', 'kami kerjakan']}
          className="text-4xl font-bold tracking-tight sm:text-6xl"
        />
        <Reveal delay={0.15}>
          <p className="mt-6 max-w-md text-lg font-light leading-relaxed text-primary/60">
            Gulir terus — galeri bergerak mengikuti scroll Anda, satu proyek demi satu proyek.
          </p>
        </Reveal>
        <Reveal delay={0.25}>
          <div className="mt-8 flex items-center gap-4">
            <ArrowLink to="/portofolio">Selengkapnya</ArrowLink>
              <span className="flex items-center gap-2 font-sans text-sm font-semibold uppercase tracking-wide text-primary/60">
              <PixelArrow direction="r" className="h-4 w-4 animate-scroll-hint" />
              Scroll
            </span>
          </div>
        </Reveal>
      </div>

      {portfolio.slice(0, 6).map((item, i) => (
        <TiltCard key={item.id} intensity={5} className="h-full">
          <CardSpotlight color="255, 252, 251" opacity={0.08} radius={360} className="h-full">
            <Link
              to="/portofolio"
              data-cursor="Buka"
              className="group relative block h-[64vh] w-[80vw] overflow-hidden border-2 border-primary/20 shadow-[4px_4px_0_0_#093FB4] transition-shadow duration-200 hover:-translate-y-1 md:w-[54vw] lg:w-[42vw]"
            >
              <div className="absolute inset-0" style={{ backgroundColor: item.color }}>
                <div className="absolute inset-0 opacity-20 transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: 'radial-gradient(#FFFCFB 1px, transparent 1px)', backgroundSize: '14px 14px', imageRendering: 'pixelated' }} />
                <span className="absolute left-6 top-6 font-pixel text-6xl text-cream/90">{String(i + 1).padStart(2, '0')}</span>
                <span className="absolute right-6 top-6 font-pixel text-2xl text-cream/60">{item.year}</span>
                <img
                  src={logoWhiteUrl}
                  alt=""
                  aria-hidden="true"
                  className="absolute -bottom-12 -right-12 h-56 w-auto opacity-10 transition-transform duration-500 group-hover:rotate-6"
                  style={{ imageRendering: 'pixelated' }}
                />
                <span className="absolute left-6 top-24 font-pixel text-3xl uppercase tracking-widest text-cream/70">
                  {item.categoryLabel}
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 border-t-2 border-cream/20 bg-primary/85 p-6 backdrop-blur-sm">
                <h3 className="text-2xl font-bold text-cream">{item.title}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="border border-cream/25 px-2 py-0.5 font-pixel text-sm uppercase tracking-wide text-cream/80">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </CardSpotlight>
        </TiltCard>
      ))}
    </HorizontalScroll>
  )
}

function ProcessSection() {
  return (
    <section data-nav-theme="dark" className="relative isolate overflow-hidden bg-primary py-28 text-cream">
      <Spotlight>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <SectionKicker dark>Proses Kerja</SectionKicker>
            <ScrubHeading lines={['Empat langkah menuju', 'selesai']} className="text-4xl font-bold tracking-tight sm:text-5xl" />
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step) => (
              <div
                key={step.step}
                data-cursor="Langkah"
                className="group relative border-2 border-cream/15 bg-cream/5 p-6 transition-colors hover:border-cream/60 hover:bg-cream/[0.07]"
              >
                <span className="font-pixel text-5xl text-cream">{step.step}</span>
                <h3 className="mt-4 text-xl font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/60">{step.description}</p>
                <span className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-0 bg-cream transition-all duration-500 group-hover:w-full" />
              </div>
            ))}
          </div>
        </div>
      </Spotlight>
    </section>
  )
}

function StatsSection() {
  return (
    <section className="border-y border-primary/10 bg-cream">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px py-24 sm:grid-cols-4">
        {stats.map((stat) => (
          <StatItem key={stat.label} {...stat} />
        ))}
      </div>
    </section>
  )
}

function StatItem({ value, suffix, label }) {
  return (
    <div className="px-6 py-4 text-center">
      <div className="text-5xl font-bold tracking-tight text-primary sm:text-6xl">
        <CountUp value={value} suffix="" />
        <span className="text-primary/40">{suffix}</span>
      </div>
      <p className="mt-2 font-sans text-xs font-semibold uppercase tracking-wide text-primary/60">{label}</p>
    </div>
  )
}

function TestimonialsSection() {
  return (
    <section className="border-t border-primary/10 bg-cream py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-14">
            <SectionKicker>Testimoni</SectionKicker>
            <ScrollHeading lines={['Kata mereka', 'tentang Xora']} className="text-4xl font-bold tracking-tight sm:text-5xl" />
          </div>
        </ScrollReveal>

        <TestimonialCarousel items={testimonials} />
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section data-nav-theme="dark" className="border-t border-primary bg-primary text-cream">
      <Spotlight>
        <div className="mx-auto max-w-7xl px-4 py-28 text-center sm:px-6 lg:px-8">
        <ScrollReveal>
          <SectionKicker dark className="justify-center">
            Let&apos;s Build
          </SectionKicker>
          <ScrollHeading
            lines={['Punya ide? Mari', 'wujudkan bersama Xora.']}
            className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl"
          />
          <p className="mx-auto mt-6 max-w-xl text-lg font-light text-cream/70">
            Konsultasi gratis tanpa komitmen. Ceritakan kebutuhan Anda, kami susun solusinya.
          </p>

          <div className="mx-auto mt-10 max-w-md">
            <LineDraw className="w-full" />
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Magnetic>
              <Link
                to="/kontak"
                data-cursor="Mulai"
                className="inline-flex items-center gap-3 border-2 border-cream bg-cream px-9 py-4 font-sans text-sm font-bold uppercase tracking-wide text-primary shadow-[2px_2px_0_0_#FFFCFB] transition-colors hover:bg-cream/90"
              >
                Mulai Proyek
                <PixelArrow className="h-4 w-4 text-current" />
              </Link>
            </Magnetic>
            <Magnetic>
              <a
                href="mailto:halo@xora.id"
                data-cursor="Chat"
                className="inline-flex items-center border-2 border-cream/40 px-9 py-4 font-sans text-sm font-semibold uppercase tracking-wide text-cream transition-colors hover:bg-cream hover:text-primary"
              >
                WhatsApp Kami
              </a>
            </Magnetic>
          </div>
        </ScrollReveal>
        </div>
      </Spotlight>
    </section>
  )
}