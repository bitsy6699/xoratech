export default function PixelArrow({ direction = 'r', className = '', color = 'currentColor' }) {
  const paths = {
    r: 'M1 4h4l-2 4 1 1 3-3V4l-3-3-1 1 2 2H1z',
    l: 'M11 4H7l2 4-1 1-3-3V2l3-3 1 1-2 2h4z',
    u: 'M4 11h4l-2 2 1 1 3-3V5l-3 3 1 1-2 2H4z',
    d: 'M4 1h4l-2 2 1 1 3-3V10l-3-3-1 1 2 2H4z',
  }

  const d = paths[direction] || paths.r

  return (
    <svg viewBox="0 0 12 12" className={className} aria-hidden="true" fill={color} shapeRendering="crispEdges">
      <path d={d} />
    </svg>
  )
}