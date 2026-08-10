import { useEffect, useRef, useState } from 'react'

export default function ShinyText({
  text = '',
  disabled = false,
  speed = 4,
  className = '',
  baseColor = '#9aa1b5',
  highlightColor = '#093FB4',
}) {
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const animatedStyle = disabled
    ? {}
    : {
        backgroundImage: `linear-gradient(100deg, ${baseColor} 40%, ${highlightColor} 50%, ${baseColor} 60%)`,
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        display: 'inline-block',
        WebkitTextFillColor: 'transparent',
        animation: hasAnimated ? `shine ${speed}s linear infinite` : 'none',
      }

  return (
    <span ref={ref} className={`inline-block ${className}`} style={animatedStyle}>
      {text}
    </span>
  )
}