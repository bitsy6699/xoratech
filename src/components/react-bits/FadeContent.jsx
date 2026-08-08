import { useEffect, useRef, useState } from 'react'

export default function FadeContent({
  children,
  className = '',
  blur = false,
  distanceThreshold = 60,
  duration = 600,
  delay = 0,
  easing = 'ease',
}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (hasAnimated) return
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          setHasAnimated(true)
          observer.disconnect()
        }
      },
      { threshold: 0.05 }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [hasAnimated])

  const opacity = inView ? 1 : 0
  const translate = inView ? '0px' : `${distanceThreshold}px`
  const blurValue = blur ? (inView ? '0px' : 'blur(2px)') : 'none'

  const transition = `opacity ${duration}ms ${easing} ${delay}ms, transform ${duration}ms ${easing} ${delay}ms, filter ${duration}ms ${easing} ${delay}ms`

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity,
        transform: `translateY(${translate})`,
        filter: blurValue,
        transition,
        willChange: 'opacity, transform, filter',
      }}
    >
      {children}
    </div>
  )
}