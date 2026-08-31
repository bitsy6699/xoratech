import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function ScrubHeading({ lines = [], as: Tag = 'h2', className = '', wordClassName = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const words = el.querySelectorAll('[data-scrub-word]')
    if (!words.length) return

    gsap.set(words, { yPercent: 115, opacity: 0 })
    const ctx = gsap.context(() => {
      gsap.to(words, {
        yPercent: 0,
        opacity: 1,
        stagger: 0.06,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          end: 'top 42%',
          scrub: 0.6,
        },
      })
    }, el)

    return () => ctx.revert()
  }, [lines])

  // fallback for reduced: plain render done via CSS, but we still output same markup
  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.split(' ').map((w, wi) => (
            <span key={wi} className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]">
              <span data-scrub-word className={`inline-block will-change-transform ${wordClassName}`}>
                {w}
                {wi < line.split(' ').length - 1 ? '\u00A0' : ''}
              </span>
            </span>
          ))}
        </span>
      ))}
    </Tag>
  )
}
