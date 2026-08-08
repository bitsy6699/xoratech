import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Logo from '../ui/Logo'
import Button from '../ui/Button'

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
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

  const dark = overDark && !open
  const accent = dark ? 'text-cream' : 'text-primary'
  const navBg = dark
    ? 'bg-primary-deep/90 border-primary/20 backdrop-blur'
    : 'bg-cream/95 border-primary/20 backdrop-blur'

  return (
    <header
      className={`sticky top-0 z-40 border-b-2 transition-colors ${navBg} ${
        scrolled && !dark ? 'shadow-[0_4px_0_0_#051a66]' : ''
      } ${dark ? 'shadow-[0_4px_0_0_#0024fc]' : ''}`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo variant={dark ? 'dark' : 'light'} />

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `group relative font-medium tracking-wide transition-colors hover:text-pixel ${
                  isActive ? accent : dark ? 'text-cream/85' : 'text-ink'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-1 w-4 transition-all ${
                      isActive ? (dark ? 'bg-pixel' : 'bg-primary') : 'bg-transparent group-hover:bg-pixel/60'
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button
            to="/kontak"
            size="sm"
            variant={dark ? 'pixel' : 'primary'}
            className="btn-sheen"
          >
            Konsultasi Gratis
          </Button>
        </div>

        <button
          className={`flex h-10 w-10 items-center justify-center border-2 ${dark ? 'border-cream/40' : 'border-primary'} lg:hidden`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <div className="space-y-1.5">
            <span className={`block h-0.5 w-5 transition-transform ${
              open ? 'translate-y-2 rotate-45' : ''
            } ${dark && !open ? 'bg-cream' : 'bg-primary'}`} />
            <span className={`block h-0.5 w-5 transition-opacity ${
              open ? 'opacity-0' : ''
            } ${dark && !open ? 'bg-cream' : 'bg-primary'}`} />
            <span className={`block h-0.5 w-5 transition-transform ${
              open ? '-translate-y-2 -rotate-45' : ''
            } ${dark && !open ? 'bg-cream' : 'bg-primary'}`} />
          </div>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
            className="overflow-hidden border-t-2 border-primary/10 bg-cream px-4 lg:hidden"
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
                <Button to="/kontak" className="w-full btn-sheen">
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