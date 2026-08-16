import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ScrollReveal from '../components/motion/ScrollReveal'
import ScrollHeading from '../components/motion/ScrollHeading'
import TiltCard from '../components/motion/TiltCard'
import { SectionKicker, PixelTag } from '../components/ui/Button.jsx'
import CardSpotlight from '../components/ui/CardSpotlight'
import PixelArrow from '../components/ui/PixelArrow'
import { portfolio, portfolioFilters } from '../data/portfolio'

export default function PortofolioPage() {
  const [activeFilter, setActiveFilter] = useState('semua')
  const filtered =
    activeFilter === 'semua'
      ? portfolio
      : portfolio.filter((p) => p.category === activeFilter)

  return (
    <div>
      <section data-nav-theme="light" className="border-b-2 border-primary/10 bg-cream py-20 text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionKicker className="justify-center">Portofolio</SectionKicker>
          <ScrollHeading
            lines={['Beberapa karya yang', 'kami banggakan']}
            className="text-center text-4xl font-bold tracking-tight sm:text-6xl"
          />
          <ScrollReveal delay={0.3}>
            <p className="mx-auto mt-5 max-w-2xl text-lg font-light text-primary/60">
              Website, aplikasi, dan sistem yang telah selesai kami kembangkan untuk berbagai klien.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section data-nav-theme="light" className="bg-cream py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-wrap justify-center gap-3">
            {portfolioFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`relative border-2 px-5 py-2 font-pixel text-lg uppercase tracking-widest transition-all ${
                  activeFilter === filter.value
                    ? 'border-primary/25 bg-primary text-cream shadow-[4px_4px_0_0_#093FB4]'
                    : 'border-primary/30 bg-cream text-primary hover:bg-primary/5'
                }`}
              >
                {filter.label}
                {activeFilter === filter.value && (
                  <motion.span
                    layoutId="filter-caret"
                    className="absolute -bottom-2 left-1/2 h-2 w-2 -translate-x-1/2 bg-primary"
                  />
                )}
              </button>
            ))}
          </div>

          <motion.div layout className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((item) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.32, ease: [0.76, 0, 0.24, 1] }}
                >
                  <TiltCard intensity={7} className="h-full">
                    <CardSpotlight className="h-full">
                      <article className="group relative block h-full overflow-hidden border-2 border-primary/25 bg-cream shadow-[4px_4px_0_0_#093FB4] transition-all duration-200 hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_0_#093FB4]">
                        <div
                          className="relative flex h-48 cursor-pointer items-center justify-center overflow-hidden p-6 text-center"
                          style={{ backgroundColor: item.color }}
                        >
                          <div
                            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                            style={{
                              backgroundImage:
                                'radial-gradient(circle at 50% 120%, rgba(255,252,251,0.35) 0%, transparent 60%)',
                            }}
                          />
                          <div className="pointer-events-none absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(#FFFCFB 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
                          <div className="relative">
                            <p className="font-pixel text-xl uppercase tracking-widest text-cream/90">
                              {item.categoryLabel}
                            </p>
                            <p className="mt-1 font-pixel text-sm text-cream/60">{item.year}</p>
                          </div>
                          <PixelArrow className="absolute bottom-4 right-4 h-4 w-4 text-cream opacity-50 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                        </div>
                        <div className="p-5">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="text-xl font-bold">{item.title}</h3>
                            <span className="mt-1 h-2 w-2 shrink-0 bg-primary" />
                          </div>
                          <p className="mt-2 text-sm leading-relaxed text-primary/60">{item.description}</p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {item.tags.map((tag) => (
                              <PixelTag key={tag} className="border-primary/20 px-2 py-0.5 !text-base">
                                {tag}
                              </PixelTag>
                            ))}
                          </div>
                        </div>
                      </article>
                    </CardSpotlight>
                  </TiltCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </div>
  )
}