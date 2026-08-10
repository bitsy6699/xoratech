import { Link } from 'react-router-dom'
import Logo from '../ui/Logo'
import Icon from '../ui/Icon'
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
    <footer className="relative overflow-hidden bg-primary text-cream">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cream/60 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo variant="dark" />
            <p className="mt-5 max-w-sm font-light leading-relaxed text-cream">
              Xora adalah partner digital Anda — membangun website, aplikasi, dan infrastruktur IT
              yang kokoh untuk bisnis, sekolah, desa, maupun pemerintahan.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                ['instagram', 'Instagram'],
                ['whatsapp', 'WhatsApp'],
                ['linkedin', 'LinkedIn'],
                ['youtube', 'YouTube'],
              ].map(([icon, label]) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="group inline-flex h-9 w-9 items-center justify-center border border-cream/20 text-cream transition-colors hover:border-cream hover:text-cream"
                >
                  <Icon name={icon} className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <h3 className="font-pixel text-xl uppercase tracking-widest text-cream">Layanan</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {allServices.map((cat) => (
                <li key={cat.slug} className="text-cream hover:text-cream">
                  <RevealLink to={`/layanan/${cat.slug}`}>{cat.title}</RevealLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-pixel text-xl uppercase tracking-widest text-cream">Perusahaan</h3>
            <ul className="mt-4 space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.to} className="text-cream">
                  <RevealLink to={link.to}>{link.label}</RevealLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-pixel text-xl uppercase tracking-widest text-cream">Kontak</h3>
            <ul className="mt-4 space-y-3.5 text-sm text-cream">
              {[
                ['mail', 'halo@xora.id', 'mailto:halo@xora.id'],
                ['phone', '+62 812 3456 7890', 'tel:+6281234567890'],
                ['map-pin', 'Jakarta, Indonesia', '#'],
              ].map(([icon, label, href]) => (
                <li key={label}>
                  <a href={href} className="inline-flex items-center gap-2 hover:text-cream">
                    <Icon name={icon} className="h-4 w-4" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-cream pt-6 text-sm text-cream sm:flex-row">
          <p>© 2026 Xora. All rights reserved.</p>
          <div className="flex items-center gap-2 font-pixel uppercase tracking-widest text-cream">
            <span className="h-2 w-2 bg-cream" />
            Buat dengan React &amp; Framer Motion
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-cream">
          Icons by{' '}
          <a href="https://streamlinehq.com/icons/pixel" target="_blank" rel="noreferrer" className="underline">
            Streamline Pixel
          </a>{' '}
          · CC BY 4.0
        </p>
      </div>
    </footer>
  )
}