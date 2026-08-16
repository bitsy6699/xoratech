# XORA — Website Development, Aplikasi & IT Support

Website company profile & landing untuk **Xora**, penyedia jasa pengembangan website, aplikasi
mobile/web, dan solusi IT — dengan gaya desain *minimalism + pixelated*.

## Tech Stack

- **React + Vite**
- **Tailwind CSS v4**
- **React Router v7**
- **Supabase** (PostgreSQL) untuk form pesan & login admin
- **Animasi scroll-driven** (Framer Motion `useScroll`/`useTransform` + GSAP): `ScrollReveal`, `ScrollHeading`, `MaskedTextPressure`, horizontal scroll, parallax

## Struktur Halaman

| Rute | Halaman |
|------|---------|
| `/` | Beranda (hero, layanan, keunggulan, portofolio, proses, statistik, testimoni, CTA) |
| `/layanan` | Indeks semua layanan (3 kategori, 18 sub-layanan) |
| `/layanan/:kategori` | Landing per kategori (website/aplikasi/software) |
| `/layanan/:kategori/:slug` | Detail layanan + FAQ |
| `/portofolio` | Grid portofolio dengan filter |
| `/tentang` | Profil, visi & misi |
| `/kontak` | Form pesan proyek → Supabase |
| `/admin` | Login admin & list pesan masuk |

## Setup Lokal

```bash
npm install
cp .env.example .env   # lalu isi kredensial Supabase
npm run dev
```

### 1. Buat Project di Supabase

1. Buat project baru di [supabase.com](https://supabase.com)
2. Buka **SQL Editor** dan jalankan isi `supabase/migrations/001_messages.sql`
3. Salin `Project URL` & `anon public key` → isi ke `.env`

### 2. Aktifkan form kontak & admin

- **Form kontak**: otomatis aktif setelah `.env` terisi (tabel `messages`).
- **Login admin**:
  - Buat user di **Authentication → Users → Add user** (email/password).
  - Karena tabel `messages` memakai RLS `to authenticated`, user login tersebut otomatis bisa
    melihat & mengubah status pesan.
- **Halaman admin**: `/admin` untuk login dan melihat daftar pesan.

> Catatan: data portofolio/layanan/testimoni diisi via file `src/data/*.js` (mudah diedit),
> bukan dari database.

## Perintah

```bash
npm run dev      # dev server
npm run build    # production build
npm run preview  # preview build
npm run lint     # oxlint
```

## Warna

| Token | Nilai | Penggunaan |
|-------|-------|-----------|
| `primary` | `#093FB4` | Aksen, tombol, border |
| `cream` | `#FFFCFB` | Background utama |
| `primary-deep` | `#020F2C` | Section gelap |
| `pixel` | `#3DF0C4` | Highlight pada background gelap |

Semua token warna bisa diubah di `src/index.css` (blok `@theme`).