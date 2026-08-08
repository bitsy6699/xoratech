import { useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Reveal, Stagger, StaggerItem } from '../components/motion/Reveal'
import RevealHeading from '../components/motion/RevealHeading'
import TiltCard from '../components/motion/TiltCard'
import { SectionKicker, PixelTag } from '../components/ui/Button.jsx'
import PixelArrow from '../components/ui/PixelArrow'
import { services, findService } from '../data/services'

export default function LayananDetailPage() {
  const { categorySlug, serviceSlug } = useParams()
  const category = services[categorySlug]

  if (!category) {
    return <Navigate to="/layanan" replace />
  }

  if (!serviceSlug) {
    return <CategoryLanding category={category} />
  }

  const service = findService(categorySlug, serviceSlug)
  if (!service) {
    return <Navigate to={`/layanan/${categorySlug}`} replace />
  }

  return <ServiceDetail service={service} category={category} />
}

function CategoryLanding({ category }) {
  const bg =
    category.slug === 'website'
      ? 'bg-primary'
      : category.slug === 'application'
        ? 'bg-primary-dark'
        : 'bg-primary-deep'

  return (
    <div>
      <section data-nav-theme="dark" className={`py-20 text-cream ${bg}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionKicker dark>{category.kicker}</SectionKicker>
          <RevealHeading
            lines={[category.title]}
            className="max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl"
          />
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-2xl text-lg font-light text-white/70">{category.description}</p>
          </Reveal>
        </div>
      </section>

      <section data-nav-theme="light" className="bg-cream py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
            {category.services.map((s) => (
              <StaggerItem key={s.slug}>
                <TiltCard intensity={6} className="h-full">
                  <Link
                    to={`/layanan/${category.slug}/${s.slug}`}
                    className="group flex h-full flex-col justify-between border-2 border-primary-darker bg-card p-6 shadow-[6px_6px_0_0_#051a66] transition-all duration-200 hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_0_#051a66]"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <span className="grid h-12 w-12 place-items-center border-2 border-primary-darker bg-primary font-pixel text-xl text-cream">
                          {s.slug[0].toUpperCase()}
                        </span>
                        <PixelArrow className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                      </div>
                      <h3 className="mt-5 text-xl font-bold">{s.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{s.short}</p>
                    </div>
                    <div className="mt-6 flex items-center gap-2 font-pixel text-lg uppercase tracking-widest text-primary">
                      <span>Buka Detail</span>
                      <span className="h-2 w-2 bg-primary/40" />
                      <span className="h-2 w-2 bg-primary/70" />
                    </div>
                  </Link>
                </TiltCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </div>
  )
}

function ServiceDetail({ service, category }) {
  const [active, setActive] = useState(null)
  const faqs = [
    ['Berapa waktu pengerjaannya?', 'Tergantung cakupan. Kami selalu memberikan estimasi jadwal di awal konsultasi dan update progress secara berkala.'],
    ['Apakah biayanya bisa menyesuaikan budget?', 'Ya, kami menawarkan paket mulai dari yang esensial hingga full-featured sesuai kebutuhan dan skala bisnis Anda.'],
    ['Apakah ada garansi?', 'Ya, semua proyek mendapatkan masa garansi perbaikan serta dukungan maintenance opsional setelah serah terima.'],
    ['Bagaimana proses pembayarannya?', 'Pembayaran bertahap (DP, progress, dan pelunasan) dengan transparansi penuh di setiap milestone.'],
  ]

  return (
    <div>
      <section data-nav-theme="dark" className="bg-primary py-20 text-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-wrap items-center gap-3 font-pixel text-lg uppercase tracking-widest text-pixel">
              <Link to="/layanan" className="hover:text-cream">Layanan</Link>
              <span className="text-white/30">/</span>
              <Link to={`/layanan/${category.slug}`} className="hover:text-cream">{category.title}</Link>
            </div>
            <RevealHeading lines={[service.title]} className="mt-6 max-w-4xl text-5xl font-bold tracking-tight sm:text-7xl" />
            <Reveal delay={0.15}>
              <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-white/75">
                {service.description}
              </p>
            </Reveal>
            <Reveal delay={0.25}>
              <div className="mt-8 flex flex-wrap gap-3">
                {['Fast Response', 'Garansi', 'Transparan'].map((tag) => (
                  <PixelTag key={tag} dark>{tag}</PixelTag>
                ))}
              </div>
            </Reveal>
          </Reveal>
        </div>
      </section>

      <section data-nav-theme="light" className="bg-cream py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Reveal>
                <div className="border-2 bg-card p-8 md:p-10">
                  <SectionKicker>Ketentuan</SectionKicker>
                  <h2 className="text-3xl font-bold tracking-tight">Apa yang Anda dapatkan</h2>
                  <Stagger className="mt-8 grid gap-4 sm:grid-cols-2" stagger={0.05}>
                    {service.features.map((f) => (
                      <StaggerItem key={f}>
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center bg-pixel-dim font-bold text-primary-deep">✓</span>
                          <span className="text-sm leading-relaxed">{f}</span>
                        </div>
                      </StaggerItem>
                    ))}
                  </Stagger>
                  <div className="mt-10 flex flex-wrap gap-4">
                    <Link
                      to={`/kontak?layanan=${encodeURIComponent(service.title)}`}
                      className="btn-sheen inline-flex items-center gap-2 border-2 border-primary-darker bg-primary px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-cream shadow-[4px_4px_0_0_#051a66] transition-all hover:bg-primary-dark active:translate-x-1 active:translate-y-1 active:shadow-none"
                    >
                      Pesan Layanan Ini
                      <PixelArrow className="h-3.5 w-3.5 text-cream" />
                    </Link>
                    <Link
                      to="/portofolio"
                      className="inline-flex items-center border-2 border-primary-darker px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-primary transition-colors hover:bg-primary hover:text-cream"
                    >
                      Lihat Portofolio
                    </Link>
                  </div>
                </div>
              </Reveal>

              <Reveal>
                <div className="mt-12">
                  <SectionKicker>FAQ</SectionKicker>
                  <h2 className="text-2xl font-bold">Pertanyaan umum</h2>
                  <div className="mt-6 border-2 border-primary/10">
                    {faqs.map((faq, i) => (
                      <div key={i} className="border-b border-primary/10 last:border-b-0">
                        <button
                          className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left font-medium transition-colors hover:text-primary"
                          onClick={() => setActive(active === i ? null : i)}
                        >
                          <span>{faq[0]}</span>
                          <motion.span
                            animate={{ rotate: active === i ? 45 : 0 }}
                            className="font-pixel text-2xl text-primary"
                          >
                            +
                          </motion.span>
                        </button>
                        <AnimatePresence initial={false}>
                          {active === i && (
                            <motion.div
                              key="answer"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.32, ease: [0.76, 0, 0.24, 1] }}
                              className="overflow-hidden"
                            >
                              <p className="px-4 pb-4 text-sm leading-relaxed text-muted">{faq[1]}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>

            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <Reveal>
                  <div className="border-2 border-primary-darker bg-primary-deep p-6 text-cream">
                    <div className="flex items-center justify-between">
                      <p className="font-pixel text-sm uppercase tracking-widest text-pixel">Mulai dari</p>
                      <span className="flex gap-1">
                        <span className="h-2 w-2 bg-pixel" />
                        <span className="h-2 w-2 bg-pixel/40" />
                        <span className="h-2 w-2 bg-pixel/20" />
                      </span>
                    </div>
                    <p className="mt-4 text-4xl font-bold">Rp 1,5jt</p>
                    <p className="mt-2 text-sm text-white/50">Harga sesuai kebutuhan. Diskusi gratis di awal.</p>
                    <Link
                      to={`/kontak?layanan=${encodeURIComponent(service.title)}`}
                      className="mt-6 block border-2 border-cream bg-cream py-3 text-center font-sans text-sm font-bold uppercase tracking-wide text-primary transition-all hover:bg-pixel hover:text-primary-deep"
                    >
                      Estimasi Gratis
                    </Link>
                  </div>
                </Reveal>

                <div className="border-2 border-primary-darker bg-card p-6">
                  <h3 className="font-pixel text-lg uppercase tracking-widest text-primary">Kategori</h3>
                  <ul className="mt-4 space-y-1 text-sm">
                    {category.services.map((s) => (
                      <li key={s.slug}>
                        <Link
                          to={`/layanan/${category.slug}/${s.slug}`}
                          className={`flex items-center justify-between rounded-none p-2 transition-colors ${
                            s.slug === service.slug ? 'bg-primary text-cream' : 'hover:bg-primary/5'
                          }`}
                        >
                          <span>{s.title}</span>
                          <PixelArrow className="h-3 w-3" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}