import { Link } from 'react-router-dom'
import PixelArrow from './PixelArrow'

export default function Button({
  children,
  to,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  const base =
    'btn-sheen inline-flex items-center justify-center gap-2 border-2 font-sans font-semibold uppercase tracking-wide transition-all duration-150 active:translate-x-1 active:translate-y-1 active:shadow-none'
  const variants = {
    primary: 'bg-primary text-cream border-primary-darker shadow-[4px_4px_0_0_#051a66] hover:bg-primary-dark',
    outline:
      'bg-transparent text-primary border-primary-darker shadow-[4px_4px_0_0_#051a66] hover:bg-primary hover:text-cream',
    dark: 'bg-primary-deep text-cream border-ink shadow-[4px_4px_0_0_#000] hover:bg-primary-darker',
    cream: 'bg-cream text-primary border-primary-darker shadow-[4px_4px_0_0_#042d80] hover:bg-pixel',
    pixel: 'bg-pixel text-primary-deep border-primary-darker shadow-[4px_4px_0_0_#042d80] hover:bg-cream',
  }
  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-sm',
  }
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`

  if (to) {
    return (
      <Link to={to} className={cls} {...props}>
        {children}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={cls} {...props}>
        {children}
      </a>
    )
  }
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  )
}

export function PixelTag({ children, className = '', dark = false }) {
  return (
    <span
      className={`inline-flex items-center gap-2 border px-2.5 py-1 font-pixel text-base uppercase tracking-[0.2em] ${
        dark ? 'border-white/25 text-pixel' : 'border-primary/30 text-primary'
      } ${className}`}
    >
      <span className={`h-1.5 w-1.5 ${dark ? 'bg-pixel' : 'bg-primary'}`} />
      {children}
    </span>
  )
}

export function ArrowLink({ to, children, dark = false, className = '' }) {
  return (
    <Link
      to={to}
      className={`group inline-flex items-center gap-2 font-bold tracking-wide ${
        dark ? 'text-pixel' : 'text-primary'
      } ${className}`}
    >
      <span className="border-b-2 border-current pb-0.5">{children}</span>
      <PixelArrow className="h-3 w-3 transition-transform group-hover:translate-x-1" />
    </Link>
  )
}

export function SectionKicker({ children, dark = false, className = '' }) {
  return (
    <p
      className={`mb-4 flex items-center gap-3 font-pixel text-xl uppercase tracking-[0.35em] ${
        dark ? 'text-pixel' : 'text-primary'
      } ${className}`}
    >
      <span className={`h-2 w-2 ${dark ? 'bg-pixel' : 'bg-primary'}`} />
      {children}
      <span className={`h-2 w-2 ${dark ? 'bg-pixel' : 'bg-primary'}`} />
    </p>
  )
}

export function Marquee({ items, dark = false, className = '' }) {
  return (
    <div className={`relative overflow-hidden whitespace-nowrap ${className}`}>
      <div className="animate-marquee inline-flex w-max items-center gap-8">
        {[0, 1].map((dup) => (
          <div key={dup} className="inline-flex items-center gap-8" aria-hidden={dup === 1}>
            {items.map((item, i) => (
              <span key={i} className="inline-flex items-center gap-8">
                <span
                  className={`font-pixel text-2xl uppercase tracking-wider ${
                    dark ? 'text-white/70' : 'text-primary/60'
                  }`}
                >
                  {item}
                </span>
                <span className={`inline-block h-3 w-3 ${dark ? 'bg-pixel' : 'bg-primary'}`} />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}