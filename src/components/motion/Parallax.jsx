import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

export default function Parallax({
  children,
  speed = 0.18,
  from = 0,
  className = '',
  style = {},
}) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const travel = 140 * speed
  const y = useTransform(scrollYProgress, [0, 1], [from + travel, from - travel])

  return (
    <motion.div ref={ref} className={className} style={{ ...style, y: reduce ? from : y }}>
      {children}
    </motion.div>
  )
}
