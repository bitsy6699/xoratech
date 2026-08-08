import { useEffect, useRef } from 'react'
import { motion, useInView, useSpring, useTransform } from 'framer-motion'

export default function CountUp({
  value,
  suffix = '',
  prefix = '',
  className = '',
  format = true,
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const spring = useSpring(0, { stiffness: 50, damping: 18, mass: 0.9 })

  useEffect(() => {
    if (inView) spring.set(value)
  }, [inView, value, spring])

  const text = useTransform(spring, (v) =>
    format ? Math.round(v).toLocaleString('id-ID') : String(Math.round(v))
  )

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{text}</motion.span>
      {suffix}
    </span>
  )
}