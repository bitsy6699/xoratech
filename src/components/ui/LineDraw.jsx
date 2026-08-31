import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

export default function LineDraw({ className = '', color = '#FFFCFB' }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`relative flex h-8 items-center overflow-visible ${className}`.trim()}
    >
      {/* pixel rail: draws once left->right */}
      <motion.div
        className="h-0.5 w-full"
        style={{
          backgroundImage: `repeating-linear-gradient(90deg, ${color} 0 6px, transparent 6px 12px)`,
          transformOrigin: 'left center',
        }}
        initial={reduce ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        animate={inView || reduce ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
      />

      {/* static corner ticks */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-2 w-2"
        style={{ backgroundColor: color, opacity: 0.7 }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-0 h-2 w-2"
        style={{ backgroundColor: color, opacity: 0.35 }}
      />

      {/* looping sweep pixel — calm scanner pass, repeats with a breath */}
      {!reduce && inView && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 -translate-x-1/2"
          style={{ backgroundColor: color, left: '0%' }}
          initial={{ left: '0%', opacity: 0 }}
          animate={{ left: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
          transition={{
            left: { duration: 1.1, delay: 0.9, ease: [0.4, 0, 0.2, 1], repeat: Infinity, repeatDelay: 1.5 },
            opacity: { duration: 1.1, delay: 0.9, times: [0, 0.12, 0.88, 1], repeat: Infinity, repeatDelay: 1.5 },
          }}
        />
      )}
    </div>
  )
}
