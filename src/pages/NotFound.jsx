import { Link } from 'react-router-dom'
import PixelArrow from '../components/ui/PixelArrow'

export default function NotFoundPage() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center bg-primary-deep px-4 py-24 text-cream">
      <div className="text-center">
        <p className="font-pixel text-8xl tracking-widest text-pixel">404</p>
        <h1 className="mt-4 text-3xl font-bold">Halaman tidak ditemukan</h1>
        <p className="mx-auto mt-3 max-w-md text-white/60">
          Sepertinya Anda tersesat. Mari kembali ke beranda dan temukan solusi yang Anda butuhkan.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 border-2 border-cream bg-cream px-8 py-4 text-sm font-bold uppercase tracking-wide text-primary shadow-[6px_6px_0_0_#00000080] transition-all hover:bg-pixel hover:text-primary-deep"
        >
          Kembali ke Beranda
          <PixelArrow className="h-4 w-4 text-current" />
        </Link>
      </div>
    </section>
  )
}