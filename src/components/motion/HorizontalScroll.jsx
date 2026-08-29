import { Children, useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from 'framer-motion'

export default function HorizontalScroll({
  children,
  className = '',
  trackClassName = '',
  scrollHeight = '320vh',
}) {
  const ref = useRef(null)
  const trackRef = useRef(null)
  const reduce = useReducedMotion()
  const [max, setMax] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  useEffect(() => {
    if (reduce) return
    const update = () => {
      const track = trackRef.current
      const wrap = ref.current
      if (!track || !wrap) return
      setMax(Math.max(0, track.scrollWidth - wrap.clientWidth))
    }
    update()
    const ro = new ResizeObserver(update)
    if (trackRef.current) ro.observe(trackRef.current)
    if (ref.current) ro.observe(ref.current)
    window.addEventListener('resize', update)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [reduce, children])

  const rawX = useTransform(scrollYProgress, [0, 1], (v) => (reduce ? 0 : -v * max))
  const x = useSpring(rawX, { stiffness: 90, damping: 30, mass: 0.6 })

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
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <motion.div
          ref={trackRef}
          style={{ x, willChange: 'transform', backfaceVisibility: 'hidden' }}
          className={`flex items-stretch gap-8 px-[8vw] will-change-transform sm:gap-10 ${trackClassName}`}
        >
          {panels}
        </motion.div>
      </div>
    </section>
  )
}
