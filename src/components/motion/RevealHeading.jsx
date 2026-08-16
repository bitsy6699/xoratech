import { motion, useReducedMotion } from 'framer-motion'
import { EASE } from './Reveal'

export default function RevealHeading({
  lines = [],
  as: Tag = 'h2',
  className = '',
  wordClassName = '',
  stagger = 0.07,
  delay = 0,
  once = true,
}) {
  const reduce = useReducedMotion()
  const MotionTag = motion(Tag)

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
  }
  const word = {
    hidden: { y: reduce ? 0 : '115%', opacity: reduce ? 0 : 1 },
    visible: { y: '0%', opacity: 1, transition: { duration: 0.9, ease: EASE } },
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-60px' }}
    >
      {lines.map((line, li) => (
        <span key={li} className="block">
          <motion.span className="inline-block" variants={container}>
            {line.split(' ').map((w, wi) => (
              <span
                key={wi}
                className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]"
              >
                <motion.span className={`inline-block will-change-transform ${wordClassName}`} variants={word}>
                  {w}
                  {wi < line.split(' ').length - 1 ? '\u00A0' : ''}
                </motion.span>
              </span>
            ))}
          </motion.span>
          {li < lines.length - 1 && <br />}
        </span>
      ))}
    </MotionTag>
  )
}