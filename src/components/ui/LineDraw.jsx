import { motion, useReducedMotion } from 'framer-motion'

export default function LineDraw({ className = '', color = '#3DF0C4', width = '100%' }) {
  const reduce = useReducedMotion()

  return (
    <svg
      viewBox="0 0 600 60"
      preserveAspectRatio="none"
      className={className}
      style={{ width, height: 60 }}
      fill="none"
      aria-hidden="true"
    >
      <motion.path
        d="M8 30 H 592"
        stroke={color}
        strokeWidth="2"
        strokeDasharray="5 5"
        initial={{ pathLength: reduce ? 1 : 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 2.2, ease: 'easeInOut' }}
      />

      {!reduce && (
        <motion.rect
          width="10"
          height="10"
          fill={color}
          initial={{ x: 0, opacity: 0 }}
          animate={{ x: [0, 590], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: 'linear', repeatDelay: 0.6 }}
        />
      )}

      <motion.g
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.4 }}
      >
        <rect x="10" y="12" width="8" height="8" fill={color} opacity="0.7" />
        <rect x="26" y="40" width="8" height="8" fill={color} opacity="0.4" />
        <rect x="592" y="20" width="8" height="8" fill={color} opacity="0.7" />
      </motion.g>
    </svg>
  )
}