import { motion, useReducedMotion } from 'framer-motion'

const BLOCKS = [
  { size: 18, x: '12%', y: 60, dur: 9, delay: 0, color: '#3DF0C4' },
  { size: 10, x: '85%', y: 120, dur: 11, delay: 0.6, color: '#FFFFFF' },
  { size: 7, x: '78%', y: 320, dur: 8, delay: 1.2, color: '#FFFFFF' },
  { size: 5, x: '90%', y: 480, dur: 12, delay: 0.3, color: '#3DF0C4' },
  { size: 8, x: '6%', y: 380, dur: 10, delay: 1.8, color: '#FFFFFF' },
  { size: 4, x: '22%', y: 520, dur: 9.5, delay: 0.9, color: '#3DF0C4' },
  { size: 9, x: '94%', y: 200, dur: 13, delay: 2.1, color: '#FFFFFF' },
]

export default function FloatingPixelBlocks({ className = '' }) {
  const reduce = useReducedMotion()
  if (reduce) return null
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {BLOCKS.map((b, i) => (
        <motion.span
          key={i}
          className="absolute border-2"
          style={{
            top: `${b.y}px`,
            left: b.x,
            width: b.size * 2,
            height: b.size * 2,
            borderColor: b.color,
            backgroundColor: `${b.color}22`,
          }}
          animate={{ y: [0, -14, 0], rotate: [0, 90, 0] }}
          transition={{
            duration: b.dur,
            delay: b.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}