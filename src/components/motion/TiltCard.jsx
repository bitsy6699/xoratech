import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'

export default function TiltCard({
  children,
  className = '',
  intensity = 9,
  scale = 1.02,
  ...rest
}) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)

  const rotateX = useSpring(useTransform(py, [0, 1], [intensity, -intensity]), {
    stiffness: 180,
    damping: 20,
  })
  const rotateY = useSpring(useTransform(px, [0, 1], [-intensity, intensity]), {
    stiffness: 180,
    damping: 20,
  })

  const glareRef = useRef(null)

  const onMouseMove = (e) => {
    if (reduce) return
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const nx = (e.clientX - rect.left) / rect.width
    const ny = (e.clientY - rect.top) / rect.height
    px.set(nx)
    py.set(ny)
    if (glareRef.current) {
      glareRef.current.style.setProperty('--gx', `${nx * 100}%`)
      glareRef.current.style.setProperty('--gy', `${ny * 100}%`)
      glareRef.current.style.opacity = '1'
    }
  }

  const onMouseLeave = () => {
    px.set(0.5)
    py.set(0.5)
    if (glareRef.current) glareRef.current.style.opacity = '0'
  }

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`.trim()}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        rotateX: reduce ? 0 : rotateX,
        rotateY: reduce ? 0 : rotateY,
        transformStyle: 'preserve-3d',
        transformPerspective: 900,
      }}
      whileHover={reduce ? undefined : { scale }}
      transition={{ type: 'spring', stiffness: 220, damping: 22 }}
      {...rest}
    >
      {children}
      <span
        ref={glareRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(300px at var(--gx, 50%) var(--gy, 50%), rgba(255,252,251,0.18), transparent 68%)',
          mixBlendMode: 'overlay',
        }}
      />
    </motion.div>
  )
}