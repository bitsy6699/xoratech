import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

export default function ScrollReveal({
  children,
  className = '',
  y = 28,
  scale = 1,
  blur = 0,
  delay = 0,
  duration = 0.4,
}) {
  const ref = useRef(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.92', 'start 0.3'],
  })

  const start = delay
  const end = Math.min(1, delay + duration)
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1])
  const translateY = useTransform(scrollYProgress, [start, end], reduce ? 0 : y)
  const scaleValue = useTransform(scrollYProgress, [start, end], reduce || scale === 1 ? 1 : scale)
  const blurValue = useTransform(scrollYProgress, [start, end], reduce || !blur ? 0 : blur)

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        opacity,
        y: translateY,
        scale: scaleValue,
        filter: blur ? `blur(${blurValue}px)` : undefined,
        willChange: 'transform, opacity',
      }}
    >
      {children}
    </motion.div>
  )
}