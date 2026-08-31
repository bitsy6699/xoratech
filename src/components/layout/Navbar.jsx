import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Logo from '../ui/Logo'
import Button from '../ui/Button'
import Icon from '../ui/Icon'
import { lenisStart, lenisStop } from '../../lib/smooth'

const navLinks = [
  { to: '/', label: 'Beranda' },
  { to: '/layanan', label: 'Layanan' },
  { to: '/portofolio', label: 'Portofolio' },
  { to: '/tentang', label: 'Tentang' },
  { to: '/kontak', label: 'Kontak' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [overDark, setOverDark] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  // sync scrolled with Lenis (native scroll fallback for reduced-motion)
  const scrolledRef = useRef(scrolled)
  scrolledRef.current = scrolled
  useEffect(() => {
    const sync = (v) => {
      const next = v > 12
      if (next !== scrolledRef.current) setScrolled(next)
    }
    const onWindowScroll = () => sync(window.scrollY)
    window.addEventListener('scroll', onWindowScroll, { passive: true })
    // Lenis emits its own scroll (fires during smoothed inertia where native scroll lags)
    let off
    const t = window.setTimeout(() => {
      const lenis = window.__lenis
      if (lenis?.on) {
        const handler = ({ scroll }) => sync(scroll)
        lenis.on('scroll', handler)
        off = () => lenis.off('scroll', handler)
      }
    }, 60)
    // run once to set initial state correctly
    onWindowScroll()
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('scroll', onWindowScroll)
      off?.()
    }
  }, [])

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('[data-nav-theme]'))
    if (!sections.length) return

    const io = new IntersectionObserver(
      (entries) => {
        const active = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        setOverDark(Boolean(active?.target.dataset.navTheme === 'dark'))
      },
      { rootMargin: '-80px 0px -55% 0px' }
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [location.pathname])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  // lock scroll when mobile menu is open (matches preloader/route overlay behavior)
  useEffect(() => {
    if (!open) return
    lenisStop()
    const prev = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = prev
      lenisStart()
    }
  }, [open])

  const dark = overDark && !open
  const solid = scrolled
  const accent = dark ? 'text-cream' : 'text-primary'
  // hairline when at top, pixel rail (2px) when scrolled — never double
  const borderCls = solid
    ? 'border-transparent'
    : dark
      ? 'border-cream/10'
      : 'border-primary/10'
  const rail = solid ? (dark ? 'shadow-[0_2px_0_0_#FFFCFB]' : 'shadow-[0_2px_0_0_#093FB4]') : ''
  const navBg = dark
    ? solid
      ? 'bg-primary backdrop-blur'
      : 'bg-primary/90 backdrop-blur-md'
    : solid
      ? 'bg-cream backdrop-blur'
      : 'bg-cream/95 backdrop-blur-md'

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-[background-color,border-color,box-shadow,height] duration-300 ${navBg} ${borderCls} ${rail}`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-4 transition-[height] duration-300 sm:px-6 lg:px-8 ${
          solid ? 'h-14' : 'h-16'
        }`}
      >
        <Logo variant={dark ? 'dark' : 'light'} />

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `group relative font-medium tracking-wide transition-colors ${
                  isActive ? accent : dark ? 'text-cream/85 hover:text-cream' : 'text-primary/80 hover:text-primary'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-1 transition-all duration-300 ${
                      isActive ? `w-4 ${dark ? 'bg-cream' : 'bg-primary'}` : 'w-0 bg-transparent group-hover:w-4 group-hover:bg-current'
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button to="/kontak" size="sm" variant={dark ? 'pixel' : 'primary'} className="">
            Konsultasi Gratis
          </Button>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <button
            className={`flex h-10 w-10 shrink-0 items-center justify-center border-2 transition-colors ${dark ? 'border-cream/50 text-cream hover:border-cream' : 'border-primary/30 text-primary hover:border-primary'}`}
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={open}
          >
            <Icon name={open ? 'close' : 'menu'} className="h-5 w-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
            className="overflow-hidden border-t border-primary/10 bg-cream px-4 lg:hidden"
          >
            <div className="flex flex-col gap-1 pb-6 pt-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `border-l-4 px-3 py-3 font-medium ${
                      isActive ? 'border-primary bg-primary/5 text-primary' : 'border-transparent hover:bg-primary/5'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="mt-4">
                <Button to="/kontak" className="w-full">
                  Konsultasi Gratis
                </Button>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}