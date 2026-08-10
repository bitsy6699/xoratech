import { Link } from 'react-router-dom'
import XorMark from './XorMark'
import logoUrl from '../../assets/logo-256.png'

export default function Logo({ className = '', variant = 'light' }) {
  const dark = variant === 'dark'
  return (
    <Link to="/" className={`group inline-flex items-center gap-2.5 ${className}`} aria-label="Xora — beranda">
      {dark ? (
        <XorMark className="h-9 w-9 text-cream" />
      ) : (
        <img
          src={logoUrl}
          alt=""
          aria-hidden="true"
          className="h-9 w-9 mix-blend-multiply"
          style={{ imageRendering: 'pixelated' }}
        />
      )}
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