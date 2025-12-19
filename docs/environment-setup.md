# 🔧 Menyambungkan .env.local ke Project

## Status

✅ File `.env.local` sudah dibuat  
✅ Middleware sudah diupdate untuk handle missing env vars  
⏳ Tinggal restart dev server

## Langkah-Langkah

### 1. Pastikan Format .env.local Benar

File `.env.local` harus berisi:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Penting:**

- Tidak boleh ada spasi di sekitar tanda `=`
- URL harus diakhiri dengan `.supabase.co`
- Anon key adalah string panjang (biasanya 100+ karakter)

### 2. Restart Dev Server

Environment variables hanya dibaca saat server start. Jadi perlu restart:

```bash
# Stop server yang sedang running (Ctrl+C jika masih jalan)
# Lalu jalankan ulang:
bun run dev
```

### 3. Verifikasi

Setelah restart:

**✅ Jika berhasil:**

- Server start tanpa error Supabase
- Homepage tampil di `http://localhost:3000`
- Tidak ada error di console

**❌ Jika masih error:**

- Cek format `.env.local` (tidak boleh ada typo)
- Pastikan file ada di root folder (bukan di subfolder)
- Cek apakah Supabase project sudah dibuat

### 4. Cara Mendapatkan Supabase Keys

Jika belum punya project Supabase:

1. **Buat Project**
   - Ke [supabase.com/dashboard](https://supabase.com/dashboard)
   - Click "New Project"
   - Isi nama project & password database
   - Tunggu ~2 menit sampai siap

2. **Copy API Keys**
   - Di dashboard project, buka **Settings** → **API**
   - Copy **Project URL** → masukkan sebagai `NEXT_PUBLIC_SUPABASE_URL`
   - Copy **anon/public key** → masukkan sebagai `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Update .env.local**
   - Paste URL dan key yang sudah dicopy
   - Save file
   - Restart dev server

## Update yang Sudah Dilakukan

✅ **lib/supabase/middleware.ts** - Diupdate untuk:

- Check apakah env vars ada
- Jika tidak ada, skip auth middleware (development mode)
- Tampilkan warning yang jelas di console

Jadi sekarang, kalau env vars belum diset, aplikasi tetap jalan (tanpa auth) dan tidak crash!

## Next Steps

Setelah `.env.local` terhubung:

1. ✅ Server jalan tanpa error
2. 🔜 Lanjut ke Phase 2: Database Setup
3. 🔜 Buat tabel di Supabase
4. 🔜 Setup Row Level Security

## Troubleshooting

**Error: "Your project's URL and Key are required"**

- Solution: Pastikan `.env.local` ada di root folder dan format benar, lalu restart server

**Homepage masih 404**

- Normal! Auth routes (login/register) belum dibuat
- Homepage di `/` seharusnya bisa diakses

**Warning di console**

- `⚠️ Supabase not configured` = normal saat env vars belum diset
- Warning akan hilang setelah `.env.local` terhubung dan server direstart
