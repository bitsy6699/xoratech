import { Link } from 'react-router-dom'
import PixelArrow from './PixelArrow'
import Magnetic from './Magnetic'

export default function Button({
  children,
  to,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  magnetic = false,
  ...props
}) {
  const base =
    ' inline-flex items-center justify-center gap-2 border-2 font-sans font-semibold uppercase tracking-wide transition-all duration-150 active:translate-x-1 active:translate-y-1 active:shadow-none'
  const variants = {
    primary: 'bg-primary text-cream border-primary/25 shadow-[4px_4px_0_0_#093FB4] hover:brightness-110',
    outline:
      'bg-transparent text-primary border-primary/25 shadow-[4px_4px_0_0_#093FB4] hover:bg-primary hover:text-cream',
    dark: 'bg-primary text-cream border-primary/25 shadow-[4px_4px_0_0_#093FB4] hover:bg-primary',
    cream: 'bg-cream text-primary border-primary/25 shadow-[4px_4px_0_0_#fffcfb] hover:bg-primary',
    pixel: 'bg-cream text-primary border-primary/25 shadow-[4px_4px_0_0_#fffcfb] hover:bg-cream',
  }
  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-sm',
  }
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`

  let el
  if (to) {
    el = (
      <Link to={to} className={cls} {...props}>
        {children}
      </Link>
    )
  } else if (href) {
    el = (
      <a href={href} className={cls} {...props}>
        {children}
      </a>
    )
  } else {
    el = (
      <button className={cls} {...props}>
        {children}
      </button>
    )
  }

  return magnetic ? <Magnetic>{el}</Magnetic> : el
}

export function PixelTag({ children, className = '', dark = false }) {
  return (
    <span
      className={`inline-flex items-center gap-2 border px-2.5 py-1 font-pixel text-base uppercase tracking-[0.2em] ${
        dark ? 'border-cream text-cream' : 'border-primary/30 text-primary'
      } ${className}`}
    >
      <span className={`h-1.5 w-1.5 ${dark ? 'bg-cream' : 'bg-primary'}`} />
      {children}
    </span>
  )
}

export function ArrowLink({ to, children, dark = false, className = '' }) {
  return (
    <Link
      to={to}
      className={`group inline-flex items-center gap-2 font-bold tracking-wide ${
        dark ? 'text-cream' : 'text-primary'
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
        dark ? 'text-cream' : 'text-primary'
      } ${className}`}
    >
      <span className={`h-2 w-2 ${dark ? 'bg-cream' : 'bg-primary'}`} />
      {children}
      <span className={`h-2 w-2 ${dark ? 'bg-cream' : 'bg-primary'}`} />
    </p>
  )
}

export function Marquee({ items, dark = false, className = '' }) {
  return (
    <div className={`marquee-fade relative overflow-hidden whitespace-nowrap ${className}`}>
      <div className="animate-marquee inline-flex w-max items-center gap-8">
        {[0, 1].map((dup) => (
          <div key={dup} className="inline-flex items-center gap-8" aria-hidden={dup === 1}>
            {items.map((item, i) => (
              <span key={i} className="inline-flex items-center gap-8">
                <span
                  className={`font-pixel text-2xl uppercase tracking-wider transition-transform duration-200 hover:scale-110 ${
                    dark ? 'text-cream' : 'text-primary/60'
                  }`}
                >
                  {item}
                </span>
                <span className={`inline-block h-3 w-3 ${dark ? 'bg-cream' : 'bg-primary'}`} />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}