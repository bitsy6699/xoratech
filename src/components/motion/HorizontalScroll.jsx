import { Children, useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

export default function HorizontalScroll({
  children,
  className = '',
  trackClassName = '',
  scrollHeight = '320vh',
}) {
  const ref = useRef(null)
  const trackRef = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  const x = useTransform(scrollYProgress, [0, 1], (v) => {
    if (reduce) return 0
    const track = trackRef.current
    const wrap = ref.current
    if (!track || !wrap) return 0
    const max = track.scrollWidth - wrap.clientWidth
    return -v * max
  })

  const panels = Children.toArray(children).map((child, i) => (
    <div key={i} className="flex-none">
      {child}
    </div>
  ))

  if (reduce) {
    return (
      <section ref={ref} className={`overflow-x-auto bg-cream ${className}`}>
        <div className="flex items-stretch gap-8 px-[8vw] py-24 sm:gap-10">{panels}</div>
      </section>
    )
  }

  return (
    <section ref={ref} className={`relative ${className}`} style={{ height: scrollHeight }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div
          ref={trackRef}
          style={{ x, willChange: 'transform' }}
          className={`flex items-stretch gap-8 px-[8vw] sm:gap-10 ${trackClassName}`}
        >
          {panels}
        </motion.div>
      </div>
    </section>
  )
}
