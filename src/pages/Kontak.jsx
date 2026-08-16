import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import ScrollReveal from '../components/motion/ScrollReveal'
import ScrollHeading from '../components/motion/ScrollHeading'
import { SectionKicker, PixelTag } from '../components/ui/Button.jsx'
import CardSpotlight from '../components/ui/CardSpotlight'
import Icon from '../components/ui/Icon'
import PixelArrow from '../components/ui/PixelArrow'
import { submitMessage, isSupabaseConfigured } from '../lib/supabase'
import { allServices } from '../data/services'

const budgets = ['< 1 Juta', '1 - 5 Juta', '5 - 20 Juta', '> 20 Juta', 'Belum Tahu']

const allServiceOptions = allServices.flatMap((cat) =>
  cat.services.map((s) => `${cat.title} — ${s.title}`)
)

const initialForm = {
  name: '',
  email: '',
  phone: '',
  service: '',
  budget: '',
  message: '',
}

export default function KontakPage() {
  const [params] = useSearchParams()
  const [form, setForm] = useState({ ...initialForm, service: params.get('layanan') || '' })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ type: '', message: '' })
    setSubmitting(true)

    const result = await submitMessage({
      ...form,
      created_at: new Date().toISOString(),
    })

    setSubmitting(false)
    if (result.error) {
      setStatus({ type: 'error', message: result.error.message })
    } else {
      setStatus({
        type: 'success',
        message: 'Terima kasih! Pesan Anda sudah terkirim. Kami akan segera menghubungi Anda.',
      })
      setForm(initialForm)
    }
  }

  const inputCls =
    'w-full border-2 border-primary/25 bg-cream px-4 py-3 text-sm text-primary placeholder:text-primary/60/60 outline-none transition-colors focus:bg-cream focus:shadow-[4px_4px_0_0_#093FB4]'

  return (
    <div>
      <section data-nav-theme="light" className="border-b-2 border-primary/10 bg-cream py-20 text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionKicker className="justify-center">Kontak</SectionKicker>
          <ScrollHeading
            lines={['Mari kita mulai', 'proyek Anda']}
            className="text-center text-4xl font-bold tracking-tight sm:text-6xl"
          />
          <ScrollReveal delay={0.3}>
            <p className="mx-auto mt-5 max-w-2xl text-lg font-light text-primary/60">
              Ceritakan kebutuhan Anda. Tim kami akan menghubungi Anda dalam 1x24 jam kerja.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section data-nav-theme="light" className="bg-cream py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <ScrollReveal>
                <h2 className="text-2xl font-bold">Info Kontak</h2>
                <div className="mt-6 space-y-4">
                  {[
                    ['mail', 'Email', 'halo@xora.id', 'mailto:halo@xora.id'],
                    ['whatsapp', 'WhatsApp', '+62 812 3456 7890', 'https://wa.me/6281234567890'],
                    ['map-pin', 'Alamat', 'Jakarta, Indonesia', '#'],
                  ].map(([icon, label, value, href]) => (
                    <CardSpotlight key={label}>
                      <div className="border-2 border-primary/10 bg-cream p-4">
                        <p className="flex items-center gap-2 font-pixel text-lg uppercase tracking-widest text-primary">
                          <Icon name={icon} className="h-4 w-4" />
                          {label}
                        </p>
                        <a href={href} className="mt-1 block font-medium text-primary hover:underline">
                          {value}
                        </a>
                      </div>
                    </CardSpotlight>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap gap-2">
                  <PixelTag>Fast Response</PixelTag>
                  <PixelTag>Gratis Estimasi</PixelTag>
                </div>
              </ScrollReveal>
            </div>

            <div className="lg:col-span-3">
              <ScrollReveal delay={0.2}>
                <form
                  onSubmit={handleSubmit}
                  className="border-2 border-primary/25 bg-cream p-6 shadow-[4px_4px_0_0_#093FB4] sm:p-8"
                >
                  {!isSupabaseConfigured && (
                    <div className="mb-6 border-2 border-amber-500 bg-amber-50 p-4 text-sm text-amber-800">
                      <strong>Mode demo:</strong> tambahkan VITE_SUPABASE_URL &amp; VITE_SUPABASE_ANON_KEY di file
                      .env untuk menyimpan pesan ke database.
                    </div>
                  )}

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block font-pixel text-lg uppercase tracking-widest text-primary" htmlFor="name">
                        Nama
                      </label>
                      <input id="name" name="name" required value={form.name} onChange={handleChange} className={inputCls} placeholder="Nama lengkap Anda" />
                    </div>
                    <div>
                      <label className="mb-1.5 block font-pixel text-lg uppercase tracking-widest text-primary" htmlFor="email">
                        Email
                      </label>
                      <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} className={inputCls} placeholder="email@perusahaan.com" />
                    </div>
                    <div>
                      <label className="mb-1.5 block font-pixel text-lg uppercase tracking-widest text-primary" htmlFor="phone">
                        No. WhatsApp
                      </label>
                      <input id="phone" name="phone" value={form.phone} onChange={handleChange} className={inputCls} placeholder="+62 812 3456 7890" />
                    </div>
                    <div>
                      <label className="mb-1.5 block font-pixel text-lg uppercase tracking-widest text-primary" htmlFor="budget">
                        Estimasi Budget
                      </label>
                      <select id="budget" name="budget" value={form.budget} onChange={handleChange} className={inputCls}>
                        <option value="">Pilih range budget</option>
                        {budgets.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-5">
                    <label className="mb-1.5 block font-pixel text-lg uppercase tracking-widest text-primary" htmlFor="service">
                      Layanan yang diinginkan
                    </label>
                    <select id="service" name="service" value={form.service} onChange={handleChange} className={inputCls}>
                      <option value="">— Pilih layanan —</option>
                      {allServiceOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-5">
                    <label className="mb-1.5 block font-pixel text-lg uppercase tracking-widest text-primary" htmlFor="message">
                      Keperluan
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      className={inputCls}
                      placeholder="Ceritakan singkat tentang proyek, target, dan deadline yang Anda inginkan..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-6 inline-flex w-full items-center justify-center gap-3 border-2 border-primary/25 bg-primary px-8 py-4 text-sm font-bold uppercase tracking-wide text-cream shadow-[4px_4px_0_0_#093FB4] transition-all hover:brightness-110 active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-60 sm:w-auto"
                  >
                    {submitting ? (
                      <>
                        <span className="h-3 w-3 animate-spin border-2 border-cream/40 border-t-cream" />
                        Mengirim...
                      </>
                    ) : (
                      <>
                        Kirim Pesan
                        <PixelArrow className="h-3.5 w-3.5 text-cream" />
                      </>
                    )}
                  </button>
                </form>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {status.message && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
            className={`fixed bottom-6 right-6 z-[70] flex max-w-sm items-start gap-3 border-2 p-4 shadow-[4px_4px_0_0_#093FB4] ${
              status.type === 'success'
                ? 'border-primary bg-cream text-primary'
                : 'border-red-500 bg-cream text-red-700'
            }`}
          >
            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center bg-primary text-cream">
              {status.type === 'success' ? (
                <Icon name="check" className="h-4 w-4" />
              ) : (
                <span className="text-lg font-bold leading-none">!</span>
              )}
            </span>
            <p className="text-sm font-medium leading-relaxed">{status.message}</p>
            <button
              onClick={() => setStatus({ type: '', message: '' })}
              className="ml-auto opacity-60 transition-opacity hover:opacity-100"
              aria-label="Tutup"
            >
              <Icon name="close" className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}