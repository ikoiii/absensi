# Project Folder Structure

Updated: December 20, 2025

## Root Structure

```
/home/ikoi/Documents/project/absen/
├── app/                    # Next.js 14 App Router
├── components/             # React components
├── lib/                    # Utilities and configurations
├── actions/                # Server actions
├── supabase/              # Database migrations
├── docs/                  # Documentation
├── public/                # Static assets
└── .agent/                # Agent workflows (if exists)
```

---

## `/app` - Application Pages

```
app/
├── (auth)/                # Authentication pages (grouped route)
│   ├── login/
│   │   └── page.tsx      # Login page with form animations
│   ├── register/
│   │   └── page.tsx      # Student registration (role forced)
│   └── layout.tsx         # Auth layout wrapper
│
├── admin/                 # Admin dashboard (protected)
│   ├── manage-admins/
│   │   └── page.tsx      # Admin management page
│   ├── sessions/
│   │   ├── page.tsx      # Sessions list
│   │   ├── [id]/
│   │   │   └── page.tsx  # Session detail with QR code
│   │   └── new/
│   │       └── page.tsx  # Create new session
│   ├── students/
│   │   └── page.tsx      # Students list
│   ├── layout.tsx         # Admin layout with sidebar + mobile nav
│   └── page.tsx           # Admin dashboard with animated stats
│
├── student/               # Student dashboard (protected)
│   ├── history/
│   │   └── page.tsx      # Attendance history with animations
│   ├── scan/
│   │   └── page.tsx      # QR code scanner
│   ├── layout.tsx         # Student layout with mobile nav
│   └── page.tsx           # Student dashboard with stats
│
├── layout.tsx             # Root layout (providers, fonts)
├── globals.css            # Global styles + Tailwind
└── page.tsx               # Landing page with animations
```

---

## `/components` - React Components

```
components/
├── admin/                 # Admin-specific components
│   ├── admin-list.tsx     # Admin accounts list with delete
│   ├── attendance-list.tsx # Real-time attendance with animations
│   ├── create-admin-form.tsx # Admin creation form
│   ├── create-session-form.tsx # Session creation form
│   ├── delete-session-button.tsx # Session deletion with dialog
│   └── stat-card.tsx      # Dashboard stat card
│
├── animated/              # **NEW** Framer Motion wrappers
│   ├── fade-in.tsx        # Reusable fade-in component
│   └── stagger-container.tsx # Staggered children wrapper
│
├── shared/                # Shared components
│   └── qr-code-display.tsx # QR code with spring animation
│
└── ui/                    # shadcn/ui components
    ├── alert-dialog.tsx   # Confirmation dialogs
    ├── badge.tsx
    ├── button.tsx
    ├── card.tsx
    ├── form.tsx
    ├── input.tsx
    ├── label.tsx
    ├── select.tsx
    ├── sheet.tsx          # Mobile hamburger menu
    ├── skeleton.tsx
    ├── skeletons.tsx      # **NEW** Custom loading skeletons with pulse
    ├── states.tsx         # **NEW** UI states (Loading, Empty, Error, NotFound)
    ├── toast.tsx
    └── toaster.tsx
```

---

## `/lib` - Libraries & Utilities

```
lib/
├── animations.ts          # **NEW** Framer Motion utilities
│                          # - 15+ variants (fadeIn, slideUp, scaleIn, etc.)
│                          # - Transitions (fast, normal, slow, spring)
│                          # - Helper functions (prefersReducedMotion)
│
├── auth.ts                # Authentication utilities
│                          # - requireRole() for route protection
│
├── supabase/
│   ├── client.ts          # Client-side Supabase
│   └── server.ts          # Server-side Supabase
│
├── validations.ts         # Zod schemas for forms
└── utils.ts               # General utilities (cn, etc.)
```

---

## `/actions` - Server Actions

```
actions/
├── admin.ts               # Admin management actions
│                          # - createAdminAction
│                          # - listAdminsAction
│                          # - deleteAdminAction
│
├── auth.ts                # Authentication actions
│                          # - loginAction
│                          # - registerAction
│                          # - logoutAction
│
├── attendance.ts          # Attendance actions
│                          # - recordAttendanceAction
│
└── session.ts             # Session management actions
                           # - createSessionAction
                           # - closeSessionAction
                           # - deleteSessionAction
```

---

## `/supabase` - Database

```
supabase/
└── migrations/
    ├── 001_create_profiles.sql
    ├── 002_create_sessions.sql
    ├── 003_create_attendance.sql
    ├── 004_setup_rls.sql
    ├── 005_add_session_close.sql
    ├── 006_complete_rls_fix.sql
    ├── 007_add_delete_policy.sql        # Profiles DELETE policy
    └── 008_add_session_delete_policies.sql # Sessions & Attendance DELETE
```

---

## `/docs` - Documentation

```
docs/
├── admin-registration.md              # Admin account creation guide
├── folder-structure.md                # This file
├── session-deletion-fix.md            # Session deletion RLS fix guide
├── ui-modernization-plan.md           # Full 5-week UI/UX plan
└── ui-modernization-phase1-report.md  # Phase 1 completion report
```

---

## Key Features by Location

### Authentication & Authorization

- **Location:** `lib/auth.ts`, `actions/auth.ts`, `app/(auth)/`
- **Features:** Role-based access, session management, protected routes

### Admin Features

- **Location:** `app/admin/`, `components/admin/`, `actions/admin.ts`
- **Features:**
  - Dashboard with animated stats
  - Session management (CRUD with animations)
  - Student management
  - Admin account management
  - Real-time attendance monitoring

### Student Features

- **Location:** `app/student/`, `actions/attendance.ts`
- **Features:**
  - QR code scanner
  - Attendance history with animations
  - Dashboard with stats
  - Mobile-first design

### UI/UX Enhancements

- **Location:** `components/animated/`, `components/ui/`, `lib/animations.ts`
- **Features:**
  - Framer Motion animations (60fps)
  - Loading skeletons with pulse
  - UI state components
  - Mobile responsive design
  - Reduced motion support

---

## New Additions (Phase 1 & 2)

### Phase 1 (Animation Foundation)

- ✅ `lib/animations.ts` - Animation utilities
- ✅ `components/animated/` - Animated wrappers
- ✅ `components/ui/skeletons.tsx` - Loading skeletons
- ✅ `components/ui/states.tsx` - UI states

### Phase 2 (Page Modernization)

- ✅ `app/page.tsx` - Landing page with animations
- ✅ `app/admin/page.tsx` - Dashboard with staggered cards
- ✅ `app/student/page.tsx` - Dashboard with animations
- ✅ Mobile responsiveness improvements

---

## Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Runtime:** Bun
- **Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Animations:** Framer Motion v12.23.26
- **Forms:** React Hook Form + Zod
- **State:** React Server Components + Server Actions

---

## Development Workflow

1. **Pages** → `app/` routes
2. **Components** → `components/` organized by feature
3. **Logic** → `actions/` server actions
4. **Database** → `supabase/migrations/`
5. **Utilities** → `lib/` shared code
6. **Documentation** → `docs/` guides

---

## Notes

- All admin routes require `requireRole('admin')`
- All student routes require `requireRole('student')`
- Public routes: Landing, Login, Register
- Mobile navigation uses `Sheet` component
- All animations respect `prefers-reduced-motion`
- RLS policies enforced at database level
