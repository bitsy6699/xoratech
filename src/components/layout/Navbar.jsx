import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Logo from '../ui/Logo'
import Button from '../ui/Button'
import Icon from '../ui/Icon'

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
  const compact = scrolled && !dark
  const accent = dark ? 'text-cream' : 'text-primary'
  const navBg = dark
    ? 'bg-primary/90 border-cream/20 backdrop-blur'
    : 'bg-cream/95 border-primary/20 backdrop-blur'

  return (
    <header
      className={`sticky top-0 z-40 border-b-2 transition-all ${navBg} ${
        compact ? 'shadow-[0_4px_0_0_#093FB4]' : ''
      } ${dark ? 'shadow-[0_4px_0_0_#FFFCFB]' : ''}`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-4 transition-all sm:px-6 lg:px-8 ${
          compact ? 'h-14' : 'h-16'
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
                `group relative font-medium tracking-wide transition-colors hover:opacity-70 ${
                  isActive ? accent : dark ? 'text-cream/85' : 'text-primary'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-1 w-4 transition-all ${
                      isActive ? (dark ? 'bg-cream' : 'bg-primary') : 'bg-transparent group-hover:bg-current'
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
            magnetic
            className=""
          >
            Konsultasi Gratis
          </Button>
        </div>

        <button
          className={`flex h-10 w-10 items-center justify-center border-2 ${dark ? 'border-cream/40' : 'border-primary'} lg:hidden`}
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={open}
        >
          <Icon
            name={open ? 'close' : 'menu'}
            className={`h-5 w-5 ${dark && !open ? 'text-cream' : 'text-primary'}`}
          />
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