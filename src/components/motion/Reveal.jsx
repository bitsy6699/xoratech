import { motion, useReducedMotion } from 'framer-motion'

export const EASE = [0.76, 0, 0.24, 1]

export function Reveal({ children, delay = 0, y = 28, scale = 1, className = '', once = true, blur = false }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        y: reduce ? 0 : y,
        scale: reduce ? 1 : scale,
        filter: blur && !reduce ? 'blur(3px)' : 'none',
      }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'none' }}
      viewport={{ once, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

export default Reveal