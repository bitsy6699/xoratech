import { Link } from 'react-router-dom'
import PixelArrow from '../components/ui/PixelArrow'

export default function NotFoundPage() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center overflow-hidden bg-primary px-4 py-24 text-cream">
      <div className="text-center">
        <div className="relative mx-auto inline-block select-none">
          <p className="font-pixel text-8xl tracking-widest text-cream">404</p>
          <p aria-hidden="true" className="pointer-events-none absolute inset-0 font-pixel text-8xl tracking-widest text-[#ff3b30] opacity-70 mix-blend-screen" style={{ transform: 'translate(1px, 0)', clipPath: 'inset(0 0 52% 0)' }}>404</p>
          <p aria-hidden="true" className="pointer-events-none absolute inset-0 font-pixel text-8xl tracking-widest text-[#00d8ff] opacity-60 mix-blend-screen" style={{ transform: 'translate(-1px, 0)', clipPath: 'inset(58% 0 0 0)' }}>404</p>
        </div>
        <h1 className="mt-4 text-3xl font-bold">Halaman tidak ditemukan</h1>
        <p className="mx-auto mt-3 max-w-md text-cream">
          Sepertinya Anda tersesat. Mari kembali ke beranda dan temukan solusi yang Anda butuhkan.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 border-2 border-cream bg-cream px-8 py-4 text-sm font-bold uppercase tracking-wide text-primary shadow-[2px_2px_0_0_#fffcfb] transition-colors hover:bg-primary hover:text-cream"
        >
          Kembali ke Beranda
          <PixelArrow className="h-4 w-4 text-current" />
        </Link>
      </div>
    </section>
  )
}