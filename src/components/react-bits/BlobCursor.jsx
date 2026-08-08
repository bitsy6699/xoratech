import { useEffect, useRef, useState } from 'react'

export default function BlobCursor({ color = '#0024fc' }) {
  const [enabled, setEnabled] = useState(false)
  const blobRef = useRef(null)
  const positionRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef(null)

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (!mq.matches) return
    setEnabled(true)

    const handleMouseMove = (e) => {
      positionRef.current = { x: e.clientX, y: e.clientY }
      if (!rafRef.current) {
        rafRef.current = window.requestAnimationFrame(animate)
      }
    }
    const animate = () => {
      const blob = blobRef.current
      if (blob) {
        blob.style.left = `${positionRef.current.x}px`
        blob.style.top = `${positionRef.current.y}px`
      }
      rafRef.current = null
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  if (!enabled) return null

  return (
    <div
      ref={blobRef}
      aria-hidden="true"
      className="pointer-events-none fixed z-50 h-8 w-8 rounded-full opacity-70"
      style={{
        background: color,
        transform: 'translate(-50%, -50%)',
      }}
    />
  )
}