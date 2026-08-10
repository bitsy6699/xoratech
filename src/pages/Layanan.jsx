import { Link } from 'react-router-dom'
import { Reveal, Stagger, StaggerItem } from '../components/motion/Reveal'
import RevealHeading from '../components/motion/RevealHeading'
import TiltCard from '../components/motion/TiltCard'
import { SectionKicker, ArrowLink } from '../components/ui/Button.jsx'
import PixelArrow from '../components/ui/PixelArrow'
import { services } from '../data/services'

export default function LayananPage() {
  return (
    <div>
      <section data-nav-theme="light" className="border-b-2 border-primary/10 bg-cream py-20 text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionKicker className="justify-center">Layanan</SectionKicker>
          <RevealHeading
            lines={['Solusi digital untuk', 'setiap kebutuhan']}
            className="text-4xl font-bold tracking-tight sm:text-6xl"
          />
          <Reveal delay={0.2}>
            <p className="mx-auto mt-5 max-w-2xl text-lg font-light text-primary/60">
              Dari halaman web sederhana hingga sistem infrastruktur lengkap — semua bisa disatukan
              dalam satu partner.
            </p>
          </Reveal>
        </div>
      </section>

      {Object.values(services).map((cat, idx) => {
        const dark = idx % 2 === 1
        return (
          <section
            key={cat.slug}
            data-nav-theme={dark ? 'dark' : 'light'}
            className={`py-20 ${dark ? 'bg-primary text-cream' : 'bg-cream'}`}
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Reveal>
                <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                  <div>
                    <SectionKicker dark={dark}>{cat.kicker}</SectionKicker>
                    <RevealHeading
                      lines={[cat.title]}
                      className={`text-3xl font-bold tracking-tight sm:text-4xl ${dark ? 'text-cream' : ''}`}
                    />
                    <p className={`mt-3 max-w-xl ${dark ? 'text-cream' : 'text-primary/60'}`}>
                      {cat.description}
                    </p>
                  </div>
                  <ArrowLink to={`/layanan/${cat.slug}`} dark={dark}>
                    Lihat semua {cat.title}
                  </ArrowLink>
                </div>
              </Reveal>

              <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
                {cat.services.map((s) => (
                  <StaggerItem key={s.slug}>
                    <TiltCard intensity={6} className="h-full">
                      <Link
                        to={`/layanan/${cat.slug}/${s.slug}`}
                        className={`group flex h-full flex-col justify-between border-2 p-6 transition-all duration-200 ${
                          dark
                            ? 'border-cream bg-cream hover:border-cream/60'
                            : 'border-primary/25 bg-cream shadow-[4px_4px_0_0_#093FB4] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_0_#093FB4]'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between">
                            <span
                              className={`grid h-12 w-12 place-items-center border-2 font-pixel text-xl ${
                                dark ? 'border-cream/50 text-cream' : 'border-primary/25 bg-primary text-cream'
                              }`}
                            >
                              {s.slug[0].toUpperCase()}
                            </span>
                            <PixelArrow
                              className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${
                                dark ? 'text-cream' : 'text-primary'
                              }`}
                            />
                          </div>
                          <h3 className="mt-5 text-xl font-bold">{s.title}</h3>
                          <p className={`mt-2 text-sm leading-relaxed ${dark ? 'text-cream' : 'text-primary/60'}`}>
                            {s.short}
                          </p>
                        </div>
                        <span
                          className={`mt-6 inline-block font-pixel text-lg uppercase tracking-widest ${
                            dark ? 'text-cream' : 'text-primary'
                          }`}
                        >
                          Lihat Detail →
                        </span>
                      </Link>
                    </TiltCard>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </section>
        )
      })}
    </div>
  )
}