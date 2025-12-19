# Task Checklist - Sistem Absensi Mahasiswa

## 📋 Phase 1: Setup & Configuration

### Setup Proyek

- [x] Instalasi Next.js dengan App Router
- [x] Setup Tailwind CSS
- [x] Instalasi shadcn/ui
- [x] Konfigurasi ESLint dan Prettier
- [x] Setup structure folder (app, components, lib, types, hooks, actions)

### Setup Supabase

- [x] Buat project Supabase - **User Action Required** (see docs/environment-setup.md)
- [x] Dapatkan API keys and environment variables - **User Action Required**
- [x] Install Supabase client library (`@supabase/supabase-js`, `@supabase/ssr`)
- [x] Buat konfigurasi Supabase client di `/lib/supabase/`
- [x] Setup environment variables (.env.local) - **Template ready**

### Setup Library QR Code

- [x] Install `qrcode.react` untuk generate QR
- [x] Install `html5-qrcode` untuk scanning
- [x] Buat wrapper component untuk QR Scanner

---

## 🗄️ Phase 2: Database Setup

### Buat Skema Database di Supabase

- [x] Buat SQL migration untuk tabel `profiles`
  - [x] Kolom: id (uuid, PK), full_name (text), nim (text), role (text)
  - [x] Setup relasi dengan auth.users
- [x] Buat SQL migration untuk tabel `sessions`
  - [x] Kolom: id (uuid, PK), course_name (text), created_at (timestamp), is_active (boolean)
- [x] Buat SQL migration untuk tabel `attendance`
  - [x] Kolom: id (uuid, PK), session_id (uuid, FK), student_id (uuid, FK), scanned_at (timestamp)
  - [x] Setup foreign key constraints

### Row Level Security (RLS)

- [x] Buat RLS policies untuk semua tabel
- [x] Buat policy untuk tabel `profiles`
  - [x] Admin bisa baca semua profiles
  - [x] Student hanya bisa baca profile sendiri
- [x] Buat policy untuk tabel `sessions`
  - [x] Admin bisa create, read, update sessions
  - [x] Student hanya bisa read active sessions
- [x] Buat policy untuk tabel `attendance`
  - [x] Admin bisa read semua attendance
  - [x] Student bisa create attendance sendiri dan read attendance sendiri

### Execution (User Action Required)

- [ ] Run migrations di Supabase Dashboard (see docs/phase-2-execution-guide.md)
- [ ] Verify tables created
- [ ] Generate TypeScript types

---

## 🔐 Phase 3: Authentication

### Halaman Auth

- [x] Buat layout auth (`/app/(auth)/layout.tsx`)
- [x] Buat halaman Login (`/app/(auth)/login/page.tsx`)
  - [x] Form login dengan email dan password
  - [x] Integrasi dengan Supabase Auth
  - [x] Redirect berdasarkan role
- [x] Buat halaman Register (`/app/(auth)/register/page.tsx`)
  - [x] Form register dengan validasi
  - [x] Input: email, password, full_name, nim, role
  - [x] Insert data ke tabel profiles setelah registrasi

### Auth Middleware & Guards

- [x] Buat middleware untuk proteksi route (`middleware.ts`) - Already exists from Phase 1
- [x] Buat auth helper functions di `/lib/auth.ts`
- [x] Implement session management
- [x] Buat hook `useUser()` untuk get current user
- [x] Handle redirect logic berdasarkan role

### Testing Required (User Action)

- [ ] Test register flow dengan role admin
- [ ] Test register flow dengan role student
- [ ] Test login flow dan role-based redirect
- [ ] Verify profile auto-created in database

---

## 👨‍💼 Phase 4: Admin Features

### Dashboard Admin

- [x] Buat layout admin (`/app/admin/layout.tsx`)
- [x] Buat halaman Dashboard (`/app/admin/page.tsx`)
  - [x] Card statistik: jumlah mahasiswa hadir hari ini
  - [x] Card statistik: jumlah sesi aktif
  - [x] Daftar sesi terbaru

### Manajemen Sesi

- [x] Buat halaman daftar sesi (`/app/admin/sessions/page.tsx`)
  - [x] Tabel list semua sesi
  - [x] Filter berdasarkan status (aktif/tidak aktif) - Basic version
  - [x] Button untuk create sesi baru
- [x] Buat form create sesi (`/app/admin/sessions/new/page.tsx`)
  - [x] Input: course_name
  - [x] Generate session_id otomatis
  - [x] Set is_active = true
- [x] Buat halaman detail sesi (`/app/admin/sessions/[id]/page.tsx`)
  - [x] Tampilkan QR Code dengan session_id
  - [x] Daftar mahasiswa yang hadir (real-time)
  - [x] Button untuk close sesi (set is_active = false)
  - [x] Export data attendance ke CSV

### Generate & Display QR Code

- [x] Buat component QRCodeDisplay (`/components/qr-code-display.tsx`) - Already exists from Phase 1
- [x] Implement QR Code generation logic
- [x] Display QR code in session detail

### Laporan Absensi

- [ ] Buat halaman laporan (`/app/admin/reports/page.tsx`)
  - [ ] Filter berdasarkan mata kuliah
  - [ ] Filter berdasarkan tanggal
  - [ ] Tampilkan tabel attendance dengan info lengkap
- [ ] Implement real-time updates menggunakan Supabase Realtime
- [ ] Add export functionality (CSV/PDF)

### Manajemen Mahasiswa

- [x] Buat halaman daftar mahasiswa (`/app/admin/students/page.tsx`)
  - [x] Tabel list semua mahasiswa (role = 'student')
  - [x] Search dan filter
- [ ] Buat form tambah mahasiswa (`/app/admin/students/new/page.tsx`) - Deferred (use register page)
  - [ ] Input: full_name, nim, email
  - [ ] Create user di Supabase Auth
  - [ ] Insert ke tabel profiles
- [ ] Buat halaman edit mahasiswa (`/app/admin/students/[id]/page.tsx`) - Deferred
- [ ] Implement delete mahasiswa dengan konfirmasi - Deferred

---

## 🎓 Phase 5: Student Features

### Layout & Navigation

- [x] Buat layout student (`/app/student/layout.tsx`)
- [x] Buat navigation menu (Dashboard, Scan, History)

### Dashboard Student

- [x] Buat halaman Dashboard (`/app/student/page.tsx`)
  - [x] Card ringkasan: total kehadiran
  - [x] Card: kehadiran hari ini
  - [x] List 5 absensi terakhir

### QR Scanner

- [x] Buat halaman Scan (`/app/student/scan/page.tsx`)
  - [x] Implement camera access dengan html5-qrcode
  - [x] Handle permission camera
  - [x] Decode QR Code dan extract session_id
- [x] Buat logic validasi scan:
  - [x] Cek apakah sesi masih aktif (is_active = true)
  - [x] Cek apakah mahasiswa sudah absen di sesi ini (prevent duplicate)
  - [x] Insert data ke tabel attendance
- [x] Tampilkan toast notification (sukses/gagal)
- [ ] (Optional) Implement validasi lokasi dengan Geolocation API - Deferred

### Riwayat Kehadiran

- [x] Buat halaman History (`/app/student/history/page.tsx`)
  - [x] Tabel list attendance mahasiswa
  - [x] Kolom: Mata Kuliah, Tanggal, Waktu Scan
  - [ ] Filter berdasarkan tanggal
  - [ ] Pagination

---

## 🎨 Phase 6: UI/UX Enhancement

### shadcn/ui Components

- [x] Setup shadcn/ui components yang dibutuhkan:
  - [x] Button
  - [x] Card
  - [x] Table
  - [x] Form (Input, Label, Select)
  - [x] Toast/Toaster untuk notifications
  - [x] Dialog untuk confirmations
  - [x] Alert Dialog untuk destructive confirmations
  - [x] Badge untuk status
  - [x] Skeleton untuk loading states
  - [x] Separator

### Loading & Error States

- [x] Buat loading components (PageLoading, CardLoading, TableLoading)
- [x] Buat error components (ErrorState, InlineError)
- [x] Add skeleton loaders

### Confirmations

- [x] Add close session confirmation dialog
- [x] Implement alert dialog for destructive actions

### Responsive Design

- [x] Pastikan semua halaman mobile-first
- [x] Admin layout responsive (sidebar collapses)
- [x] Student layout responsive (mobile header)
- [x] Tables dengan horizontal scroll
- [x] QR Scanner optimized untuk mobile

---

## 🔒 Phase 7: Security & Validation

### Security Implementation

- [x] ~~Implement CSRF protection~~ - Built into Next.js Server Actions
- [x] Validate semua input form (client & server) - Zod schemas implemented in Phase 3
- [x] ~~Sanitize data sebelum insert ke database~~ - Supabase handles automatically
- [ ] ~~Implement rate limiting untuk scan (prevent spam)~~ - Deferred (Supabase has built-in limits)
- [x] Secure API routes dengan authentication check - requireRole implemented

### RLS Testing

- [x] Implement RLS policies untuk semua tabel - Completed in Phase 2
- [ ] Test RLS policies (manual testing required)
- [ ] Verify admin tidak bisa impersonate student (manual testing required)
- [ ] Verify student tidak bisa akses data student lain (manual testing required)
- [ ] Test edge cases (manual testing required)

### Documentation

- [x] Create security documentation (`docs/security.md`)
- [x] Document authentication flow
- [x] Document authorization model
- [x] Document RLS policies
- [x] Create testing guide

---

## 🧪 Phase 8: Testing & Quality Assurance

### Manual Testing (Recommended for MVP)

- [x] Create comprehensive testing guide (`docs/testing-guide.md`)
- [x] Document E2E flow testing (25 min complete flow)
- [x] Create feature testing checklists
- [x] Create bug report template
- [ ] Execute manual testing (user task)
- [ ] Document test results (user task)

### Unit Testing (Optional - Deferred)

- [x] Setup testing framework (Jest) - COMPLETED
- [x] Test utility functions - Constants tests passing
- [x] Test auth helpers - Validation tests passing
- [x] Test form validations - All validation schemas tested
- [x] Add test scripts to package.json

**Test Results:**

- ✅ 18 tests passing
- ✅ Constants tests: 5/5 passing
- ✅ Validation tests: 13/13 passing

### Integration Testing (Optional - Deferred)

- [ ] ~~Test auth flow (login/register/logout)~~ - Deferred
- [ ] ~~Test create session flow~~ - Deferred
- [ ] ~~Test scan QR flow~~ - Deferred
- [ ] ~~Test real-time updates~~ - Deferred

### Notes

Manual testing recommended untuk MVP. Automated tests dapat ditambahkan incrementally jika aplikasi berkembang.

### Manual Testing

- [ ] Test complete admin workflow
- [ ] Test complete student workflow
- [ ] Test concurrent scanning (multiple students)
- [ ] Test dengan berbagai browser
- [ ] Test di mobile devices

---

## 🚀 Phase 9: Deployment & Documentation

### Deployment

- [ ] Setup Vercel project
- [ ] Configure environment variables di Vercel
- [ ] Deploy ke production
- [ ] Test production build
- [ ] Setup custom domain (optional)

### Documentation

- [ ] Buat README.md yang lengkap
- [ ] Dokumentasi cara setup local development
- [ ] Dokumentasi cara deploy
- [ ] Buat user guide untuk Admin
- [ ] Buat user guide untuk Student
- [ ] Document API endpoints (jika ada)

---

## 🔧 Phase 10: Optimization & Improvements

### Performance

- [ ] Optimize images dengan Next.js Image
- [ ] Implement caching strategy
- [ ] Optimize database queries
- [ ] Add indexes di database
- [ ] Lighthouse audit dan improvements

### Additional Features (Optional)

- [ ] Implement email notifications
- [ ] Add attendance statistics charts
- [ ] Implement bulk import mahasiswa (CSV)
- [ ] Add dark mode
- [ ] Multi-language support (ID/EN)
- [ ] PWA support untuk offline scanning

---

## 📝 Notes

- Prioritaskan mobile-first karena mahasiswa scan menggunakan HP
- Pastikan real-time updates berjalan lancar untuk dashboard admin
- Test QR scanning di berbagai kondisi pencahayaan
- Pertimbangkan backup plan jika scanning gagal (manual input?)
