import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'

export default function CountUp({
  value,
  suffix = '',
  prefix = '',
  className = '',
  format = true,
}) {
  const ref = useRef(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start 0.3'],
  })
  const spring = useSpring(scrollYProgress, { stiffness: 60, damping: 22, mass: 0.9 })

  const text = useTransform(spring, (p) => {
    const v = Math.round(p * value)
    return format ? v.toLocaleString('id-ID') : String(v)
  })

  return (
    <span ref={ref} className={className}>
      {prefix}
      {reduce ? (
        format ? value.toLocaleString('id-ID') : String(value)
      ) : (
        <motion.span>{text}</motion.span>
      )}
      {suffix}
    </span>
  )
}