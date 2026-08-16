import { Link } from 'react-router-dom'
import logoUrl from '../../assets/logo-crop.png'
import logoWhiteUrl from '../../assets/logo-crop-white.png'

export default function Logo({ className = '', variant = 'light' }) {
  const dark = variant === 'dark'
  return (
    <Link to="/" className={`group inline-flex items-center gap-2.5 ${className}`} aria-label="Xora — beranda">
      <img
        src={dark ? logoWhiteUrl : logoUrl}
        alt=""
        aria-hidden="true"
        className="h-9 w-auto"
        style={{ imageRendering: 'pixelated' }}
      />
      <span
        className={`font-pixel text-2xl leading-none tracking-[0.08em] ${
          dark ? 'text-cream' : 'text-primary'
        }`}
      >
        XORA
      </span>
    </Link>
  )
}