# 📱 Sistem Absensi QR Code

> Solusi modern untuk mencatat kehadiran mahasiswa dengan cepat, akurat, dan real-time menggunakan teknologi QR Code.

[![Next.js](https://img.shields.io/badge/Next.js-16.1.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-green)](https://supabase.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.23-purple)](https://www.framer.com/motion/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

![Landing Page Screenshot](docs/screenshots/landing-page.png)

---

## 🎯 Fitur Utama

### 👨‍💼 Admin/Dosen

- ✅ **Dashboard Interaktif** dengan statistik real-time
- ✅ **Manajemen Sesi** - Buat, lihat, dan hapus sesi absensi
- ✅ **QR Code Generator** - Generate QR code unik untuk setiap sesi
- ✅ **Monitoring Real-time** - Lihat mahasiswa yang hadir secara langsung
- ✅ **Manajemen Mahasiswa** - Lihat daftar mahasiswa terdaftar
- ✅ **Manajemen Admin** - Tambah/hapus admin lain
- ✅ **Mobile Responsive** - Dashboard optimal di HP dan tablet

### 👨‍🎓 Mahasiswa

- ✅ **QR Scanner** - Scan QR code untuk absen
- ✅ **Riwayat Kehadiran** - Lihat history absensi dengan animasi
- ✅ **Dashboard Personal** - Statistik kehadiran pribadi
- ✅ **Notifikasi Real-time** - Toast notification saat berhasil absen
- ✅ **Mobile-First Design** - Optimal untuk penggunaan di smartphone

### 🎨 UI/UX Modern

- ✅ **Smooth Animations** - 60fps dengan Framer Motion
- ✅ **Loading States** - Skeleton screens dengan pulse animation
- ✅ **Dark Mode Support** - Tema gelap otomatis
- ✅ **Responsive Design** - Sempurna di semua ukuran layar
- ✅ **Accessibility** - Mendukung reduced motion preferences

---

## 🛠️ Tech Stack

### Core

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Runtime:** [Bun](https://bun.sh/) - Blazing fast JavaScript runtime
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [Supabase](https://supabase.com/) (PostgreSQL + Real-time)

### Frontend

- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Forms:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **QR Code:** [qrcode.react](https://www.npmjs.com/package/qrcode.react)

### Backend

- **Authentication:** Supabase Auth
- **Database:** PostgreSQL (via Supabase)
- **Real-time:** Supabase Realtime
- **RLS:** Row Level Security policies

---

## 🚀 Quick Start

### Prerequisites

Pastikan tools berikut sudah terinstall:

- **Bun** >= 1.3.0 ([Install Bun](https://bun.sh/))
- **Node.js** >= 18.0.0 (optional, jika tidak pakai Bun)
- **Git**
- **Supabase Account** ([Sign up](https://supabase.com/))

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/absen.git
cd absen
```

### 2. Install Dependencies

```bash
bun install
```

Atau jika pakai npm:

```bash
npm install
```

### 3. Setup Environment Variables

Buat file `.env.local` di root project:

```bash
cp .env.example .env.local
```

Edit `.env.local` dan isi dengan kredensial Supabase Anda:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Cara mendapatkan kredensial:**

1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project Anda (atau buat baru)
3. Settings → API → Project URL dan anon/public key

### 4. Setup Database

#### A. Jalankan Migrations

Di Supabase Dashboard:

1. Buka **SQL Editor**
2. Jalankan migration files secara berurutan dari `supabase/migrations/`:
   - `001_create_profiles.sql`
   - `002_create_sessions.sql`
   - `003_create_attendance.sql`
   - `004_setup_rls.sql`
   - `005_add_session_close.sql`
   - `006_complete_rls_fix.sql`
   - `007_add_delete_policy.sql`
   - `008_add_session_delete_policies.sql`

#### B. Buat Admin Pertama (Manual)

Karena registrasi publik hanya untuk mahasiswa, admin pertama harus dibuat manual:

1. Register akun baru melalui `/register` (akan jadi mahasiswa)
2. Buka Supabase Dashboard → Table Editor → `profiles`
3. Cari user yang baru dibuat
4. Edit kolom `role` dari `student` menjadi `admin`
5. Logout dan login kembali

**Setelah admin pertama ada**, bisa menambah admin lain melalui halaman `/admin/manage-admins`.

### 5. Run Development Server

```bash
bun dev
```

Atau dengan npm:

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## 📁 Project Structure

```
absen/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages (login, register)
│   ├── admin/             # Admin dashboard
│   ├── student/           # Student dashboard
│   └── page.tsx           # Landing page
├── components/
│   ├── animated/          # Framer Motion wrappers
│   ├── admin/             # Admin components
│   ├── shared/            # Shared components
│   └── ui/                # shadcn/ui components
├── lib/
│   ├── animations.ts      # Animation utilities
│   ├── auth.ts            # Auth helpers
│   ├── supabase/          # Supabase clients
│   └── validations.ts     # Zod schemas
├── actions/               # Server actions
├── supabase/migrations/   # Database migrations
└── docs/                  # Documentation
```

Lihat [docs/folder-structure.md](docs/folder-structure.md) untuk detail lengkap.

---

## 🔒 Authentication & Authorization

### Roles

Sistem menggunakan 2 role:

- **`admin`** - Dosen/Admin yang mengelola sesi
- **`student`** - Mahasiswa yang melakukan absensi

### Protected Routes

- `/admin/*` - Hanya admin
- `/student/*` - Hanya student
- `/login`, `/register` - Public

### Security

- ✅ **Row Level Security (RLS)** di semua tabel
- ✅ **Server-side validation** dengan Zod
- ✅ **requireRole()** middleware untuk route protection
- ✅ **Encrypted passwords** via Supabase Auth

---

## 🎨 UI/UX Features

### Animations

Semua animasi menggunakan Framer Motion dengan performa 60fps:

```typescript
// Example: Staggered card animation
<StaggerChildren fast>
  {items.map(item => (
    <motion.div variants={slideUp}>
      <Card>{item}</Card>
    </motion.div>
  ))}
</StaggerChildren>
```

### Loading States

5 jenis skeleton dengan pulse animation:

- `SessionListSkeleton`
- `AttendanceListSkeleton`
- `StudentListSkeleton`
- `DashboardSkeleton`
- `AdminListSkeleton`

### UI States

4 komponen state yang konsisten:

- `LoadingState` - Loading dengan spinner
- `EmptyState` - State kosong dengan CTA
- `ErrorState` - Error dengan retry button
- `NotFoundState` - 404 state

---

## 📱 Development

### Available Scripts

```bash
# Development server
bun dev

# Build for production
bun run build

# Start production server
bun start

# Run linter
bun run lint

# Run tests (jika ada)
bun test
```

### Code Style

Project menggunakan:

- **ESLint** untuk linting
- **TypeScript** strict mode
- **Prettier** untuk formatting (opsional)

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/nama-fitur

# Commit dengan conventional commits
git commit -m "feat: tambah fitur X"

# Push dan create PR
git push origin feature/nama-fitur
```

---

## 🌐 Deployment ke Production

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. **Push ke GitHub**

   ```bash
   git push origin main
   ```

2. **Import ke Vercel**
   - Buka [vercel.com](https://vercel.com)
   - Import repository
   - Vercel auto-detect Next.js

3. **Set Environment Variables**
   - Settings → Environment Variables
   - Tambahkan:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. **Deploy**
   - Klik "Deploy"
   - Vercel akan build dan deploy otomatis

### Netlify

1. **Build Settings**
   - Build command: `bun run build`
   - Publish directory: `.next`

2. **Environment Variables**
   - Set `NEXT_PUBLIC_SUPABASE_URL`
   - Set `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Railway / Render

Ikuti dokumentasi platform masing-masing untuk Next.js deployment.

### Custom Server

```bash
# Build
bun run build

# Start production server
bun start
```

---

## 🤝 Contributing

Kontribusi sangat diterima! Berikut cara berkontribusi:

### 1. Fork Repository

Klik tombol **Fork** di GitHub.

### 2. Clone Fork Anda

```bash
git clone https://github.com/your-username/absen.git
cd absen
```

### 3. Create Feature Branch

```bash
git checkout -b feature/amazing-feature
```

### 4. Make Changes

- Ikuti code style yang ada
- Tambahkan tests jika diperlukan
- Update documentation jika perlu

### 5. Commit Changes

Gunakan [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: add amazing feature"
```

Types:

- `feat:` - Fitur baru
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting
- `refactor:` - Code refactoring
- `test:` - Tests
- `chore:` - Maintenance

### 6. Push & Create PR

```bash
git push origin feature/amazing-feature
```

Buat Pull Request di GitHub dengan deskripsi yang jelas.

### Contribution Guidelines

#### Code Style

- Gunakan TypeScript untuk semua file baru
- Follow existing naming conventions
- Components pakai PascalCase
- Functions pakai camelCase
- Files pakai kebab-case

#### Testing

- Test manual semua perubahan di browser
- Test responsive design (mobile, tablet, desktop)
- Test dark mode jika applicable

#### Documentation

- Update README jika menambah fitur
- Tambahkan JSDoc untuk functions kompleks
- Update `docs/` jika perlu

#### Pull Request

- PR title jelas dan deskriptif
- Jelaskan apa yang berubah dan kenapa
- Sertakan screenshots kalau ada visual changes
- Link ke issue yang relevan

---

## 📖 Documentation

- **[Folder Structure](docs/folder-structure.md)** - Penjelasan struktur project
- **[UI Modernization Plan](docs/ui-modernization-plan.md)** - Roadmap UI/UX
- **[Security](docs/security.md)** - Best practices keamanan
- **[Admin Registration](docs/admin-registration.md)** - Cara buat admin

---

## 🐛 Known Issues & Roadmap

### Current Issues

- [ ] Admin pertama harus dibuat manual via database
- [ ] Belum ada export laporan ke CSV/PDF
- [ ] Real-time update bisa lag dengan koneksi lambat

### Roadmap (Future Features)

- [ ] Export attendance ke CSV/Excel
- [ ] Email notifications untuk mahasiswa
- [ ] Attendance analytics dashboard
- [ ] Bulk import mahasiswa
- [ ] PWA support untuk offline access
- [ ] Multi-language support (EN/ID)

---

## 📄 License

Project ini menggunakan **MIT License**. Lihat file [LICENSE](LICENSE) untuk detail.

---

## 👥 Contributors

Terima kasih kepada semua kontributor!

<!-- Tambahkan contributors di sini -->

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Vercel](https://vercel.com/) - Hosting platform

---

## 📞 Support

Butuh bantuan? Buka [GitHub Issues](https://github.com/yourusername/absen/issues)

---

## 🌟 Star History

Jika project ini membantu, beri ⭐ di GitHub!

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/absen&type=Date)](https://star-history.com/#yourusername/absen&Date)

---

**Made with ❤️ for better education**
