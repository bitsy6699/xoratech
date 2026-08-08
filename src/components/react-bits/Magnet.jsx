import { useEffect, useRef, useState } from 'react'

export default function Magnet({
  children = null,
  padding = 60,
  disabled = false,
  magnetStrength = 2,
  activeStrength = 0.7,
  className = '',
}) {
  const [isActive, setIsActive] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const magnetRef = useRef(null)

  useEffect(() => {
    if (disabled) {
      setPosition({ x: 0, y: 0 })
    }
  }, [disabled])

  const handleMouseMove = (e) => {
    if (disabled) return
    const target = magnetRef.current
    if (!target) return
    const rect = target.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const distX = Math.abs(centerX - e.clientX)
    const distY = Math.abs(centerY - e.clientY)

    if (distX < rect.width / 2 + padding && distY < rect.height / 2 + padding) {
      setIsActive(true)
      const strength = isActive ? activeStrength : magnetStrength
      setPosition({
        x: (e.clientX - centerX) * strength,
        y: (e.clientY - centerY) * strength,
      })
    } else {
      setIsActive(false)
      setPosition({ x: 0, y: 0 })
    }
  }

  const style = { transition: isActive ? 'transform 0.15s ease-out' : 'transform 0.4s ease' }

  return (
    <div
      ref={magnetRef}
      className={className}
      style={{
        ...style,
        transform: isActive ? `translate(${position.x}px, ${position.y}px)` : 'translate(0px, 0px)',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setIsActive(false)
        setPosition({ x: 0, y: 0 })
      }}
    >
      {children}
    </div>
  )
}