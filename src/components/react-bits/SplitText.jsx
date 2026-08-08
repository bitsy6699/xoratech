import { useRef, useEffect, useState } from 'react'

export default function SplitText({
  text = '',
  className = '',
  delay = 100,
  animationFrom = { opacity: 0, transform: 'translate3d(0,40px,0)' },
  animationTo = { opacity: 1, transform: 'translate3d(0,0,0)' },
  threshold = 0.1,
  rootMargin = '-100px',
  as: Tag = 'h1',
}) {
  const letters = text.split('')
  const [inView, setInView] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (hasAnimated) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          setHasAnimated(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold, rootMargin, hasAnimated])

  return (
    <Tag ref={ref} className={`relative inline-block ${className}`}>
      {letters.map((char, index) => {
        const delayMs = index * delay
        const transition = `opacity 0.5s ${delayMs}ms, transform 0.5s ${delayMs}ms cubic-bezier(0.22, 1, 0.36, 1)`
        const from = animationFrom
        const to = animationTo
        return (
          <span key={index} style={{ display: 'inline-block', whiteSpace: 'pre' }}>
            <span
              style={{
                display: 'inline-block',
                transition,
                opacity: inView ? to.opacity ?? 1 : from.opacity ?? 0,
                transform: inView ? to.transform ?? 'none' : from.transform ?? 'none',
              }}
            >
              {char}
            </span>
          </span>
        )
      })}
    </Tag>
  )
}