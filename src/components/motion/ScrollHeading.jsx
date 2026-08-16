import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

function Word({ progress, i, n, children, className = '' }) {
  const from = i / n
  const to = Math.min(1, from + 1 / n)
  const y = useTransform(progress, [from, to], ['115%', '0%'])
  const opacity = useTransform(progress, [from, to], [0, 1])

  return (
    <span className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
      <motion.span className={`inline-block will-change-transform ${className}`} style={{ y, opacity }}>
        {children}
        {i < n - 1 ? '\u00A0' : ''}
      </motion.span>
    </span>
  )
}

export default function ScrollHeading({
  lines = [],
  as: Tag = 'h2',
  className = '',
  wordClassName = '',
}) {
  const ref = useRef(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.92', 'start 0.35'],
  })

  const n = lines.flatMap((line) => line.split(' ')).length

  if (reduce) {
    return (
      <Tag ref={ref} className={className}>
        {lines.map((line, li) => (
          <span key={li} className="block">
            {line}
          </span>
        ))}
      </Tag>
    )
  }

  let i = 0
  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.split(' ').map((w, wi) => {
            const idx = i++
            return (
              <Word key={wi} progress={scrollYProgress} i={idx} n={n} className={wordClassName}>
                {w}
              </Word>
            )
          })}
        </span>
      ))}
    </Tag>
  )
}