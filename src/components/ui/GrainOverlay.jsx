const GRAIN_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>`

const GRAIN_URL = `url("data:image/svg+xml,${encodeURIComponent(GRAIN_SVG)}")`

export default function GrainOverlay({ opacity = 0.03 }) {
  const coarse =
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: coarse)').matches
  if (coarse) return null
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[45]"
      style={{
        opacity,
        backgroundImage: GRAIN_URL,
        backgroundRepeat: 'repeat',
        mixBlendMode: 'overlay',
      }}
    />
  )
}