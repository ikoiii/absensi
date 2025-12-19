# Rancangan Struktur Folder - Sistem Absensi Mahasiswa

## 📂 Struktur Folder Proyek

```
absen/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Route group untuk authentication
│   │   ├── login/
│   │   │   └── page.tsx         # Halaman login
│   │   ├── register/
│   │   │   └── page.tsx         # Halaman registrasi
│   │   └── layout.tsx           # Layout khusus auth (centered, no navbar)
│   │
│   ├── (dashboard)/              # Route group untuk authenticated pages
│   │   ├── admin/                # Admin routes
│   │   │   ├── page.tsx         # Dashboard admin
│   │   │   ├── sessions/        # Manajemen sesi
│   │   │   │   ├── page.tsx     # List semua sesi
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx # Buat sesi baru
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx # Detail sesi + QR Code
│   │   │   ├── students/        # Manajemen mahasiswa
│   │   │   │   ├── page.tsx     # List mahasiswa
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx # Tambah mahasiswa
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx # Edit mahasiswa
│   │   │   └── reports/
│   │   │       └── page.tsx     # Laporan absensi
│   │   │
│   │   ├── student/              # Student routes
│   │   │   ├── page.tsx         # Dashboard mahasiswa
│   │   │   ├── scan/
│   │   │   │   └── page.tsx     # Scanner QR
│   │   │   └── history/
│   │   │       └── page.tsx     # Riwayat kehadiran
│   │   │
│   │   └── layout.tsx           # Layout dengan navbar & sidebar
│   │
│   ├── api/                      # API routes (jika diperlukan)
│   │   └── auth/
│   │       └── callback/
│   │           └── route.ts     # Callback Supabase auth
│   │
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page / Homepage
│   ├── globals.css              # Global styles
│   └── favicon.ico              # Favicon
│
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── table.tsx
│   │   ├── dialog.tsx
│   │   ├── toast.tsx
│   │   ├── badge.tsx
│   │   ├── form.tsx
│   │   └── ...
│   │
│   ├── layout/                  # Layout components
│   │   ├── navbar.tsx           # Navigation bar
│   │   ├── sidebar.tsx          # Sidebar navigation
│   │   └── footer.tsx           # Footer
│   │
│   ├── auth/                    # Auth-related components
│   │   ├── login-form.tsx       # Form login
│   │   ├── register-form.tsx    # Form registrasi
│   │   └── auth-guard.tsx       # Protected route wrapper
│   │
│   ├── admin/                   # Admin-specific components
│   │   ├── session-form.tsx     # Form create/edit sesi
│   │   ├── student-form.tsx     # Form create/edit mahasiswa
│   │   ├── attendance-table.tsx # Tabel kehadiran
│   │   └── stats-card.tsx       # Card statistik dashboard
│   │
│   ├── student/                 # Student-specific components
│   │   ├── qr-scanner.tsx       # QR Scanner component
│   │   ├── attendance-list.tsx  # List riwayat kehadiran
│   │   └── attendance-card.tsx  # Card kehadiran
│   │
│   └── shared/                  # Shared components
│       ├── qr-code-display.tsx  # Display QR Code
│       ├── loading-spinner.tsx  # Loading state
│       ├── error-message.tsx    # Error display
│       └── empty-state.tsx      # Empty state placeholder
│
├── lib/                         # Utility functions & configurations
│   ├── supabase/
│   │   ├── client.ts           # Supabase client (browser)
│   │   ├── server.ts           # Supabase server client
│   │   └── middleware.ts       # Auth middleware
│   ├── utils.ts                # Utility functions (cn, etc.)
│   ├── validations.ts          # Zod schemas untuk validasi
│   └── constants.ts            # Constants (roles, status, etc.)
│
├── types/                       # TypeScript types & interfaces
│   ├── database.ts             # Auto-generated Supabase types
│   ├── auth.ts                 # Auth-related types
│   ├── session.ts              # Session types
│   ├── attendance.ts           # Attendance types
│   └── index.ts                # Export semua types
│
├── hooks/                       # Custom React hooks
│   ├── use-user.ts             # Hook untuk get current user
│   ├── use-session.ts          # Hook untuk session data
│   ├── use-attendance.ts       # Hook untuk attendance data
│   └── use-realtime.ts         # Hook untuk Supabase realtime
│
├── actions/                     # Server actions (Next.js)
│   ├── auth.ts                 # Auth server actions
│   ├── session.ts              # Session CRUD actions
│   ├── student.ts              # Student CRUD actions
│   └── attendance.ts           # Attendance actions
│
├── docs/                        # Dokumentasi
│   ├── prd.md                  # Product Requirements Document
│   ├── task-checklist.md       # Task checklist
│   ├── folder-structure.md     # Dokumen ini
│   └── api-reference.md        # API documentation (future)
│
├── public/                      # Static assets
│   ├── images/
│   │   ├── logo.svg
│   │   └── hero.png
│   └── icons/
│       └── ...
│
├── middleware.ts                # Next.js middleware (auth protection)
├── .env.local                   # Environment variables (gitignored)
├── .env.example                 # Example env file
├── tailwind.config.ts           # Tailwind configuration (akan dibuat)
├── components.json              # shadcn/ui config (akan dibuat)
├── tsconfig.json                # TypeScript config
├── next.config.ts               # Next.js config
└── package.json                 # Dependencies
```

## 📝 Penjelasan Struktur

### **app/** - Next.js App Router

Menggunakan struktur App Router dengan route groups untuk memisahkan layout yang berbeda:

- **(auth)**: Halaman authentication tanpa navbar
- **(dashboard)**: Halaman authenticated dengan navbar & sidebar
- **admin/**: Fitur khusus admin
- **student/**: Fitur khusus mahasiswa

### **components/** - React Components

Diorganisir berdasarkan fungsi dan domain:

- **ui/**: shadcn/ui components (reusable UI primitives)
- **layout/**: Layout components (navbar, sidebar, footer)
- **auth/**, **admin/**, **student/**: Domain-specific components
- **shared/**: Components yang digunakan di berbagai domain

### **lib/** - Utilities & Configuration

- **supabase/**: Konfigurasi Supabase client & middleware
- **utils.ts**: Helper functions seperti `cn()` untuk className merging
- **validations.ts**: Zod schemas untuk form & data validation
- **constants.ts**: Centralized constants

### **types/** - TypeScript Types

Semua type definitions untuk type safety:

- **database.ts**: Auto-generated dari Supabase schema
- Domain-specific types untuk auth, session, attendance

### **hooks/** - Custom Hooks

React hooks untuk data fetching dan state management:

- Menggunakan Supabase client
- Implement real-time subscriptions
- Handle loading & error states

### **actions/** - Server Actions

Next.js Server Actions untuk mutations:

- Form submissions
- CRUD operations
- Backend logic yang aman

## 🎯 Prinsip Organisasi

1. **Separation of Concerns**: Setiap folder punya tanggung jawab spesifik
2. **Domain-Driven**: Components diorganisir by domain (admin/student)
3. **Co-location**: Related files ditempatkan berdekatan
4. **Scalability**: Mudah menambah fitur baru tanpa restrukturisasi
5. **Type Safety**: Centralized types untuk consistency

## 🚀 Next Steps

1. Install shadcn/ui dan setup komponen dasar
2. Setup Supabase configuration di `lib/supabase/`
3. Generate database types dari Supabase schema
4. Implement auth middleware
5. Build components by priority (auth → admin → student)
