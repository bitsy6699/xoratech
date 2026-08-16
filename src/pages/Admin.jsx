import { useEffect, useState } from 'react'
import {
  isSupabaseConfigured,
  signInAdmin,
  signOutAdmin,
  fetchMessages,
  updateMessageStatus,
  onAuthStateChange,
} from '../lib/supabase'

export default function AdminPage() {
  const [session, setSession] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([])
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    const unsubscribe = onAuthStateChange((s) => setSession(s?.user ?? null))
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (session) loadMessages()
  }, [session])

  const loadMessages = async () => {
    const { data, error } = await fetchMessages()
    if (data) setMessages(data)
    if (error) setError(error.message)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signInAdmin(email, password)
    if (error) setError(error.message)
    setLoading(false)
  }

  const handleStatusChange = async (id, newStatus) => {
    await updateMessageStatus(id, newStatus)
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m)))
  }

  const formatDate = (iso) => {
    if (!iso) return '-'
    return new Date(iso).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
  }

  if (!isSupabaseConfigured) {
    return (
      <section className="border-b-2 border-primary/10 bg-cream py-20">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h1 className="text-3xl font-bold">Halaman Admin</h1>
          <p className="mt-4 text-primary/60">
            Supabase belum dikonfigurasi. Tambahkan <code className="bg-cream px-1">VITE_SUPABASE_URL</code> dan{' '}
            <code className="bg-cream px-1">VITE_SUPABASE_ANON_KEY</code> pada file <code className="bg-cream px-1">.env</code>, lalu
            jalankan migration SQL yang tersedia di <code className="bg-cream px-1">supabase/migrations/</code>.
          </p>
        </div>
      </section>
    )
  }

  if (!session) {
    return (
      <section className="bg-cream py-20">
        <div className="mx-auto max-w-md px-4">
          <div className="border-2 border-primary/25 bg-cream p-8 shadow-[4px_4px_0_0_#093FB4]">
            <p className="font-pixel text-2xl uppercase tracking-widest text-primary">Login Admin</p>
            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold" htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border-2 border-primary/25 bg-cream px-4 py-3 text-sm outline-none focus:shadow-[4px_4px_0_0_#093FB4]"
                  placeholder="admin@xora.id"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold" htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border-2 border-primary/25 bg-cream px-4 py-3 text-sm outline-none focus:shadow-[4px_4px_0_0_#093FB4]"
                  placeholder="••••••••"
                />
              </div>
              {error && <p className="border-2 border-red-400 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full border-2 border-primary/25 bg-primary py-3 text-sm font-bold uppercase tracking-wide text-cream shadow-[4px_4px_0_0_#093FB4] transition-all hover:brightness-110 active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-60"
              >
                {loading ? 'Memproses...' : 'Masuk'}
              </button>
            </form>
            <p className="mt-4 text-xs text-primary/60">
              Buat pengguna baru di Supabase → Authentication → Add user, lalu beri role lewat SQL
              (lihat migration).
            </p>
          </div>
        </div>
      </section>
    )
  }

  const filtered = statusFilter === 'all' ? messages : messages.filter((m) => m.status === statusFilter)

  return (
    <section className="bg-cream py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-pixel text-2xl uppercase tracking-widest text-primary">Dashboard Admin</p>
            <p className="mt-1 text-sm text-primary/60">Selamat datang, {session.email}</p>
          </div>
          <button
            onClick={() => signOutAdmin()}
            className="border-2 border-primary/25 bg-cream px-5 py-2.5 text-sm font-semibold uppercase tracking-wide transition-colors hover:bg-primary hover:text-cream"
          >
            Keluar
          </button>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          {['all', 'new', 'read', 'done'].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`border-2 px-4 py-2 font-pixel text-base uppercase tracking-widest ${
                statusFilter === f ? 'border-primary bg-primary text-cream' : 'border-primary/25 bg-cream text-primary hover:bg-primary/5'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="border-2 border-dashed border-primary/25 bg-cream p-12 text-center text-primary/60">
            Belum ada pesan masuk {statusFilter === 'all' ? '' : `dengan status "${statusFilter}"`}.
          </div>
        ) : (
          <div className="space-y-5">
            {filtered.map((m) => (
              <article key={m.id} className="border-2 border-primary/25 bg-cream p-6 shadow-[4px_4px_0_0_#093FB4]">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-bold">{m.name}</h3>
                      <span
                        className={`px-2 py-0.5 font-pixel text-base uppercase tracking-wider ${
                          m.status === 'new' ? 'bg-cream text-primary' : m.status === 'read' ? 'bg-cream text-primary/60' : 'bg-primary text-cream'
                        }`}
                      >
                        {m.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-primary/60">
                      {m.email} {m.phone && <span>• {m.phone}</span>} • {formatDate(m.created_at)}
                    </p>
                  </div>
                  <select
                    value={m.status}
                    onChange={(e) => handleStatusChange(m.id, e.target.value)}
                    className="border-2 border-primary/25 bg-cream px-3 py-2 text-sm"
                  >
                    <option value="new">Baru (new)</option>
                    <option value="read">Dibaca (read)</option>
                    <option value="done">Selesai (done)</option>
                  </select>
                </div>
                {(m.service || m.budget) && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {m.service && (
                      <span className="border border-primary/30 px-2 py-0.5 text-sm text-primary">Layanan: {m.service}</span>
                    )}
                    {m.budget && (
                      <span className="border border-primary/30 px-2 py-0.5 text-sm text-primary">Budget: {m.budget}</span>
                    )}
                  </div>
                )}
                <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed">{m.message}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}