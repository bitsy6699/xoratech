import { useRef, useEffect } from 'react'

export default function Squares({
  direction = 'diagonal',
  speed = 0.5,
  squareSize = 40,
  borderColor = '#c9cddd',
  hoverFillColor = '#0024fc',
}) {
  const canvasRef = useRef(null)
  const numSquaresX = useRef(0)
  const numSquaresY = useRef(0)
  const gridOffset = useRef({ x: 0, y: 0 })
  const hoveredSquareRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let animationFrameId

    const repaintCanvas = () => {
      const width = canvas.width
      const height = canvas.height
      ctx.clearRect(0, 0, width, height)

      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize

      for (let x = startX; x < width + squareSize; x += squareSize) {
        for (let y = startY; y < height + squareSize; y += squareSize) {
          const squareX = x - (gridOffset.current.x % squareSize)
          const squareY = y - (gridOffset.current.y % squareSize)

          const isHovered =
            hoveredSquareRef.current &&
            squareX === hoveredSquareRef.current.x &&
            squareY === hoveredSquareRef.current.y

          ctx.fillStyle = isHovered ? hoverFillColor : 'transparent'
          ctx.fillRect(squareX, squareY, squareSize, squareSize)

          ctx.strokeStyle = borderColor
          ctx.strokeRect(squareX, squareY, squareSize, squareSize)
        }
      }
    }

    const animate = () => {
      const maxOffset = squareSize
      const shouldWrap = Math.abs(gridOffset.current.x) >= maxOffset || Math.abs(gridOffset.current.y) >= maxOffset
      if (shouldWrap) {
        gridOffset.current = { x: 0, y: 0 }
      }

      gridOffset.current.x += speed * (direction.includes('horizontal') ? 1 : 0)
      gridOffset.current.y += speed * (direction.includes('vertical') ? 1 : 0)

      if (direction === 'diagonal') {
        gridOffset.current.x += speed
        gridOffset.current.y += speed
      }

      repaintCanvas()
      animationFrameId = window.requestAnimationFrame(animate)
    }

    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (!parent) return
      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight
      numSquaresX.current = Math.ceil(canvas.width / squareSize)
      numSquaresY.current = Math.ceil(canvas.height / squareSize)
    }

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect()
      const mouseX = event.clientX - rect.left
      const mouseY = event.clientY - rect.top

      const gridX = Math.floor((mouseX + gridOffset.current.x) / squareSize) * squareSize
      const gridY = Math.floor((mouseY + gridOffset.current.y) / squareSize) * squareSize
      const squareX = gridX - (gridOffset.current.x % squareSize)
      const squareY = gridY - (gridOffset.current.y % squareSize)

      hoveredSquareRef.current = { x: squareX, y: squareY }
      repaintCanvas()
    }

    const handleMouseLeave = () => {
      hoveredSquareRef.current = null
      repaintCanvas()
    }

    resizeCanvas()
    animate()
    window.addEventListener('resize', resizeCanvas)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animationFrameId)
    }
  }, [direction, speed, squareSize, borderColor, hoverFillColor])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  )
}
