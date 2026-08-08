import { motion, useReducedMotion } from 'framer-motion'

export const EASE = [0.76, 0, 0.24, 1]

export function Reveal({ children, delay = 0, y = 28, className = '', once = true, blur = true }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        y: reduce ? 0 : y,
        filter: blur && !reduce ? 'blur(3px)' : 'none',
      }}
      whileInView={{ opacity: 1, y: 0, filter: 'none' }}
      viewport={{ once, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

export function Stagger({
  children,
  className = '',
  stagger = 0.08,
  delayChildren = 0,
  once = true,
}) {
  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren } },
  }
  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-60px' }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = '' }) {
  const reduce = useReducedMotion()
  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 26, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE } },
  }
  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  )
}

export default Reveal