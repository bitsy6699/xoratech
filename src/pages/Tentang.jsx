import { Link } from 'react-router-dom'
import ScrollHeading from '../components/motion/ScrollHeading'
import CountUp from '../components/motion/CountUp'
import { SectionKicker, PixelTag } from '../components/ui/Button.jsx'
import Spotlight from '../components/ui/Spotlight'
import Magnetic from '../components/ui/Magnetic'
import Icon from '../components/ui/Icon'
import { stats } from '../data/content'

export default function TentangPage() {
  return (
    <div>
      <section data-nav-theme="dark" className="relative isolate overflow-hidden bg-primary py-24 sm:py-28 text-cream">
        <Spotlight>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionKicker dark>Tentang Kami</SectionKicker>
            <ScrollHeading
              lines={['Xora — partner digital', 'yang bisa dipercaya']}
              className="max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl"
            />
          </div>
        </Spotlight>
      </section>

      <section data-nav-theme="light" className="border-t border-primary/10 bg-cream py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2">
            <div className="relative border-2 border-primary/25 bg-cream p-8 shadow-[4px_4px_0_0_#093FB4]">
              <span className="absolute -top-3 left-6 h-3 w-3 bg-cream" />
              <span className="absolute -top-3 left-14 h-3 w-3 bg-cream/60" />
              <span className="absolute -top-3 left-[5.5rem] h-3 w-3 bg-cream/30" />
              <p className="text-lg font-light leading-relaxed">
                Berawal dari tim kecil yang kerap mengerjakan proyek digital untuk UMKM dan
                pengusaha lokal, Xora kini tumbuh menjadi partner pengembangan digital untuk
                bisnis, sekolah, desa, hingga instansi pemerintah.
              </p>
              <p className="mt-4 text-lg font-light leading-relaxed">
                Kami percaya bahwa teknologi yang baik adalah teknologi yang mudah digunakan,
                dapat dipercaya, dan bertahan lama. Karena itu, selain membangun, kami juga
                merawat — maintenance, support, dan peningkatan berkelanjutan.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <PixelTag>Website</PixelTag>
                <PixelTag>Aplikasi</PixelTag>
                <PixelTag>IT Support</PixelTag>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Visi</h2>
              <p className="text-lg font-light leading-relaxed text-primary/60">
                Menjadi partner digital paling tepercaya untuk bertumbuhnya bisnis dan
                institusi di Indonesia melalui teknologi yang relevan.
              </p>
              <h2 className="pt-4 text-2xl font-bold">Misi</h2>
              <div className="space-y-3">
                {[
                  'Memberikan solusi digital yang efektif, cepat, dan terjangkau.',
                  'Membangun aplikasi dan website yang kokoh dan mudah dikelola.',
                  'Mendukung pertumbuhan UMKM dan layanan publik lewat teknologi.',
                  'Menjaga komunikasi serta kepercayaan di setiap penjualan.',
                ].map((m) => (
                  <div key={m} className="flex items-start gap-3">
                    <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center bg-primary text-cream"><Icon name="check" className="h-4 w-4" /></span>
                    <span className="font-light leading-relaxed text-primary/60">{m}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section data-nav-theme="dark" className="relative isolate overflow-hidden border-y border-primary/10 bg-primary text-cream">
        <Spotlight>
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px py-24 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="border-r border-cream px-6 py-4 text-center last:border-r-0">
              <div className="text-5xl font-bold tracking-tight sm:text-6xl">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="mt-2 font-pixel text-xl uppercase tracking-widest text-cream">{stat.label}</p>
            </div>
          ))}
        </div>
        </Spotlight>
      </section>

      <section data-nav-theme="light" className="border-t border-primary/10 bg-cream py-24 sm:py-28 text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <ScrollHeading
            lines={['Tertarik bekerja', 'bersama kami?']}
            className="text-center text-3xl font-bold tracking-tight sm:text-5xl"
          />
          <p className="mx-auto mt-4 max-w-xl font-light text-primary/60">
            Mari ceritakan proyek Anda. Kami akan merespon dalam satu hari kerja.
          </p>
          <Magnetic>
            <Link
              to="/kontak"
              className="mt-8 inline-flex items-center gap-2 border-2 border-primary/25 bg-primary px-8 py-4 text-sm font-bold uppercase tracking-wide text-cream shadow-[4px_4px_0_0_#093FB4] transition-all hover:brightness-110 active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              Mulai Konsultasi
            </Link>
          </Magnetic>
        </div>
      </section>
    </div>
  )
}