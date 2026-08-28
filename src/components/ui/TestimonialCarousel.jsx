import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import PixelArrow from './PixelArrow'

export default function TestimonialCarousel({ items = [] }) {
  const trackRef = useRef(null)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduce = useReducedMotion()

  const count = items.length

  const scrollToIndex = useCallback((i) => {
    const track = trackRef.current
    if (!track) return
    const idx = ((i % count) + count) % count
    const children = Array.from(track.children)
    const target = children[idx]
    if (!target) return
    track.scrollTo({ left: target.offsetLeft - track.offsetLeft, behavior: reduce ? 'auto' : 'smooth' })
    setIndex(idx)
  }, [count, reduce])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let t = 0
    const onScroll = () => {
      window.clearTimeout(t)
      t = window.setTimeout(() => {
        const slides = Array.from(track.children)
        if (!slides.length) return
        const mid = track.scrollLeft + track.clientWidth / 2
        let best = 0
        let bestDist = Infinity
        slides.forEach((el, i) => {
          const c = el.offsetLeft - track.offsetLeft + el.clientWidth / 2
          const d = Math.abs(c - mid)
          if (d < bestDist) {
            bestDist = d
            best = i
          }
        })
        setIndex(best)
      }, 80)
    }
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      track.removeEventListener('scroll', onScroll)
      window.clearTimeout(t)
    }
  }, [])

  useEffect(() => {
    if (reduce || paused || count < 2) return
    const id = window.setInterval(() => {
      scrollToIndex(index + 1)
    }, 5000)
    return () => window.clearInterval(id)
  }, [reduce, paused, count, index, scrollToIndex])

  const pauseOn = () => setPaused(true)
  const pauseOff = () => setPaused(false)

  return (
    <div onMouseEnter={pauseOn} onMouseLeave={pauseOff} onFocusCapture={pauseOn} onBlurCapture={pauseOff}>
      <div
        ref={trackRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-8 overflow-x-auto scroll-px-4 px-4 pb-4" data-lenis-prevent
      >
        {items.map((t) => (
          <figure
            key={t.name}
            className="h-full w-[88vw] shrink-0 snap-start border-2 border-primary/25 bg-cream p-6 shadow-[4px_4px_0_0_#093FB4] transition-all hover:-translate-y-0.5 md:w-[46%] lg:w-[31%]"
          >
            <div className="flex gap-1 text-primary/40">
              {Array.from({ length: t.rating || 5 }).map((_, s) => (
                <span key={s}>★</span>
              ))}
            </div>
            <blockquote className="mt-4 text-lg font-light leading-relaxed">"{t.quote}"</blockquote>
            <figcaption className="mt-6">
              <div className="font-bold">{t.name}</div>
              <div className="text-sm text-primary/60">{t.role}</div>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center gap-5">
        <button
          onClick={() => scrollToIndex(index - 1)}
          aria-label="Testimoni sebelumnya"
          className="grid h-10 w-10 place-items-center border-2 border-primary text-primary transition-colors hover:bg-primary hover:text-cream"
        >
          <PixelArrow direction="l" className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              aria-label={`Ke testimoni ${i + 1}`}
              className={`h-2.5 w-2.5 transition-colors ${
                i === index ? 'bg-primary' : 'bg-primary/30 hover:bg-primary/60'
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => scrollToIndex(index + 1)}
          aria-label="Testimoni berikutnya"
          className="grid h-10 w-10 place-items-center border-2 border-primary text-primary transition-colors hover:bg-primary hover:text-cream"
        >
          <PixelArrow direction="r" className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}