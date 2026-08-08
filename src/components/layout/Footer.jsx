import { Link } from 'react-router-dom'
import Logo from '../ui/Logo'
import { allServices } from '../../data/services'

const companyLinks = [
  { to: '/tentang', label: 'Tentang Kami' },
  { to: '/portofolio', label: 'Portofolio' },
  { to: '/kontak', label: 'Kontak' },
  { to: '/admin', label: 'Admin' },
]

function RevealLink({ to, children }) {
  return (
    <Link to={to} className="group inline-block">
      <span className="line-reveal">
        <span>{children}</span>
        <span>{children}</span>
      </span>
    </Link>
  )
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-primary-deep text-cream">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-pixel/60 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo variant="dark" />
            <p className="mt-5 max-w-sm font-light leading-relaxed text-white/60">
              Xora adalah partner digital Anda — membangun website, aplikasi, dan infrastruktur IT
              yang kokoh untuk bisnis, sekolah, desa, maupun pemerintahan.
            </p>
            <div className="mt-6 flex gap-3">
              {['IG', 'WA', 'LI', 'YT'].map((social) => (
                <a
                  key={social}
                  href="#"
                  aria-label={social}
                  className="group inline-flex h-9 w-9 items-center justify-center border border-white/20 font-pixel text-sm text-cream transition-colors hover:border-pixel hover:text-pixel"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <h3 className="font-pixel text-xl uppercase tracking-widest text-pixel">Layanan</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {allServices.map((cat) => (
                <li key={cat.slug} className="text-white/70 hover:text-white">
                  <RevealLink to={`/layanan/${cat.slug}`}>{cat.title}</RevealLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-pixel text-xl uppercase tracking-widest text-pixel">Perusahaan</h3>
            <ul className="mt-4 space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.to} className="text-white/70">
                  <RevealLink to={link.to}>{link.label}</RevealLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-pixel text-xl uppercase tracking-widest text-pixel">Kontak</h3>
            <ul className="mt-4 space-y-3.5 text-sm text-white/60">
              <li>halo@xora.id</li>
              <li>+62 812 3456 7890</li>
              <li>Jakarta, Indonesia</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-white/40 sm:flex-row">
          <p>© 2026 Xora. All rights reserved.</p>
          <div className="flex items-center gap-2 font-pixel uppercase tracking-widest text-white/30">
            <span className="h-2 w-2 bg-pixel" />
            Buat dengan React &amp; Framer Motion
          </div>
        </div>
      </div>
    </footer>
  )
}