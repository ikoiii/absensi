# Rancangan Pengembangan UI Modern - Sistem Absensi QR

## Overview

Dokumen ini berisi rancangan pengembangan tampilan modern, terintegrasi, dan user-friendly untuk sistem absensi QR menggunakan Framer Motion untuk animasi dan loading states yang konsisten.

## Tujuan Pengembangan

### 1. **User Experience (UX)**

- Interface yang intuitif untuk admin dan mahasiswa
- Navigasi yang mudah dan konsisten
- Feedback visual yang jelas pada setiap aksi
- Responsive untuk semua ukuran layar

### 2. **Visual Design**

- Modern, clean, dan professional
- Konsisten brand identity
- Smooth animations dengan Framer Motion
- Loading states yang informatif

### 3. **Performance**

- Fast loading dengan skeleton screens
- Smooth transitions
- Optimized animations (60fps)

---

## Design System

### Color Palette

**Primary Colors:**

- Primary: `hsl(var(--primary))` - Untuk actions, links, highlights
- Primary Foreground: `hsl(var(--primary-foreground))` - Text pada primary
- Secondary: `hsl(var(--secondary))` - Supporting elements
- Accent: `hsl(var(--accent))` - Hover states, highlights

**Semantic Colors:**

- Success: `hsl(142, 76%, 36%)` - Green untuk berhasil
- Warning: `hsl(38, 92%, 50%)` - Orange untuk peringatan
- Error/Destructive: `hsl(var(--destructive))` - Red untuk error
- Info: `hsl(199, 89%, 48%)` - Blue untuk informasi

**Neutral Colors:**

- Background: `hsl(var(--background))`
- Foreground: `hsl(var(--foreground))`
- Muted: `hsl(var(--muted))`
- Border: `hsl(var(--border))`

### Typography

**Font Family:**

- Primary: `Inter, sans-serif` (modern, clean, readable)
- Mono: `'JetBrains Mono', monospace` (untuk code, IDs)

**Font Sizes:**

- Hero: `text-4xl` (36px) - Landing page hero
- H1: `text-3xl` (30px) - Page titles
- H2: `text-2xl` (24px) - Section titles
- H3: `text-xl` (20px) - Card titles
- Body: `text-base` (16px) - Regular text
- Small: `text-sm` (14px) - Metadata, captions
- Tiny: `text-xs` (12px) - Labels, badges

**Font Weights:**

- Bold: `font-bold` (700) - Titles, emphasis
- Semibold: `font-semibold` (600) - Subtitles
- Medium: `font-medium` (500) - Body text
- Normal: `font-normal` (400) - Regular text

### Spacing

**Consistent spacing scale:**

- xs: `0.25rem` (4px)
- sm: `0.5rem` (8px)
- md: `1rem` (16px)
- lg: `1.5rem` (24px)
- xl: `2rem` (32px)
- 2xl: `3rem` (48px)
- 3xl: `4rem` (64px)

### Border Radius

- sm: `0.375rem` (6px) - Small elements, badges
- md: `0.5rem` (8px) - Cards, buttons (default)
- lg: `0.75rem` (12px) - Large cards
- xl: `1rem` (16px) - Modals, dialogs
- full: `9999px` - Pills, avatars

---

## Framer Motion Integration

### Installation

```bash
bun add framer-motion
```

### Animation Patterns

#### 1. **Page Transitions**

Smooth fade and slide for page changes:

```typescript
// app/(auth)/layout.tsx, app/admin/layout.tsx, app/student/layout.tsx
import { motion, AnimatePresence } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4
};

// Wrap page content
<motion.div
  initial="initial"
  animate="animate"
  exit="exit"
  variants={pageVariants}
  transition={pageTransition}
>
  {children}
</motion.div>
```

#### 2. **Card Entrance Animations**

Staggered entrance for lists:

```typescript
// For session lists, attendance lists, etc.
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  {items.map(item => (
    <motion.div key={item.id} variants={itemVariants}>
      <Card>{item.content}</Card>
    </motion.div>
  ))}
</motion.div>
```

#### 3. **Button Interactions**

Micro-interactions for better feedback:

```typescript
const buttonVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
};

<motion.button
  variants={buttonVariants}
  initial="rest"
  whileHover="hover"
  whileTap="tap"
>
  Click Me
</motion.button>
```

#### 4. **Modal/Dialog Animations**

Smooth modal entrance:

```typescript
const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 300
    }
  },
  exit: { opacity: 0, scale: 0.8 }
};

<AnimatePresence>
  {isOpen && (
    <motion.div
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Dialog>...</Dialog>
    </motion.div>
  )}
</AnimatePresence>
```

#### 5. **Loading State Transitions**

Smooth skeleton to content transition:

```typescript
const contentVariants = {
  loading: { opacity: 0 },
  loaded: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};

{isLoading ? (
  <Skeleton />
) : (
  <motion.div
    variants={contentVariants}
    initial="loading"
    animate="loaded"
  >
    <Content />
  </motion.div>
)}
```

#### 6. **Real-time Updates**

Pulse animation for new items:

```typescript
<motion.div
  initial={{ scale: 1 }}
  animate={{ scale: [1, 1.02, 1] }}
  transition={{ duration: 0.3 }}
>
  <NewAttendanceItem />
</motion.div>
```

---

## Loading States Strategy

### 1. **Page-Level Loading**

**Suspense Boundaries:**

```typescript
// Every async component should have Suspense
<Suspense fallback={<PageSkeleton />}>
  <AsyncPageContent />
</Suspense>
```

**Components:**

- `DashboardSkeleton` - Admin & Student dashboards
- `SessionListSkeleton` - Sessions page
- `AttendanceListSkeleton` - Attendance lists
- `StudentListSkeleton` - Student lists

### 2. **Component-Level Loading**

**Individual components:**

```typescript
// AttendanceList, SessionList, etc.
if (isLoading) return <AttendanceListSkeleton />;
if (error) return <ErrorState />;
if (isEmpty) return <EmptyState />;
return <Content />;
```

### 3. **Action Loading**

**Button loading states:**

```typescript
<Button disabled={isLoading}>
  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  {isLoading ? 'Processing...' : 'Submit'}
</Button>
```

### 4. **Optimistic Updates**

**Immediate UI feedback:**

```typescript
// Add item optimistically, then update from server
const handleSubmit = async () => {
  // Add to UI immediately
  setItems((prev) => [...prev, newItem]);

  try {
    // Confirm with server
    await createItem(newItem);
  } catch (error) {
    // Rollback on error
    setItems((prev) => prev.filter((i) => i.id !== newItem.id));
    showError();
  }
};
```

---

## Component Enhancement Plan

### Phase 1: Core Animations (Week 1-2)

#### 1.1 Page Transitions

- [ ] Wrap all page layouts with Framer Motion
- [ ] Add route change animations
- [ ] Implement AnimatePresence for conditional rendering

#### 1.2 Loading States

- [ ] Enhance all skeleton components with pulse animations
- [ ] Add smooth skeleton → content transitions
- [ ] Implement progressive loading for large lists

#### 1.3 Button & Form Interactions

- [ ] Add hover/tap animations to all buttons
- [ ] Implement focus animations for form inputs
- [ ] Add success/error state animations

### Phase 2: List & Grid Animations (Week 3)

#### 2.1 Staggered Lists

- [ ] Session lists (admin)
- [ ] Attendance lists (admin & student)
- [ ] Student lists (admin)
- [ ] History cards (student)

#### 2.2 Grid Animations

- [ ] Dashboard stats cards
- [ ] Admin panel cards
- [ ] Student dashboard cards

### Phase 3: Modal & Dialog Enhancements (Week 4)

#### 3.1 Dialog Animations

- [ ] Delete confirmations
- [ ] QR code modal
- [ ] Mobile sheet menu
- [ ] Success/error toasts

#### 3.2 Micro-interactions

- [ ] Badge animations
- [ ] Status indicators
- [ ] Real-time updates pulse
- [ ] Copy to clipboard feedback

---

## Page-Specific Enhancements

### Admin Dashboard (`/admin`)

**Current State:**

- Static cards
- Plain lists
- No loading states

**Enhanced Version:**

```typescript
// components/admin/dashboard.tsx
import { motion } from 'framer-motion';

const statsVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1 }
  })
};

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Cards with stagger */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.id}
            custom={i}
            variants={statsVariants}
            initial="hidden"
            animate="visible"
          >
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Recent Sessions with animation */}
      <Suspense fallback={<SessionListSkeleton />}>
        <RecentSessions />
      </Suspense>
    </div>
  );
}
```

**Features:**

- ✅ Staggered stats card entrance
- ✅ Skeleton loading for sessions
- ✅ Smooth transitions
- ✅ Hover effects on cards

### Session Detail (`/admin/sessions/[id]`)

**Enhanced QR Display:**

```typescript
// components/shared/qr-code-display.tsx
import { motion } from 'framer-motion';

const qrVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20
    }
  }
};

export function QRCodeDisplay({ value }: { value: string }) {
  return (
    <motion.div
      variants={qrVariants}
      initial="hidden"
      animate="visible"
      className="flex justify-center p-6"
    >
      <QRCode value={value} size={256} />
    </motion.div>
  );
}
```

**Real-time Attendance:**

```typescript
// New attendance appears with animation
const newItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  pulse: {
    scale: [1, 1.02, 1],
    transition: { duration: 0.3 }
  }
};

// In AttendanceList, when new item arrives
<motion.div
  variants={newItemVariants}
  initial="hidden"
  animate={["visible", "pulse"]}
>
  <AttendanceItem {...newItem} />
</motion.div>
```

### Student Scanner (`/student/scan`)

**Camera State Transitions:**

```typescript
const cameraStates = {
  loading: { opacity: 0, scale: 0.95 },
  ready: { opacity: 1, scale: 1 },
  scanning: {
    scale: [1, 1.02, 1],
    transition: { repeat: Infinity, duration: 2 },
  },
  success: {
    scale: 1,
    borderColor: '#22c55e',
    transition: { duration: 0.3 },
  },
};
```

**Success Animation:**

```typescript
const successVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20
    }
  }
};

{scanSuccess && (
  <motion.div
    variants={successVariants}
    initial="hidden"
    animate="visible"
  >
    <SuccessCheckmark />
  </motion.div>
)}
```

### Student History (`/student/history`)

**Card Animations:**

```typescript
const historyCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

<motion.div variants={containerVariants}>
  {history.map((record, i) => (
    <motion.div
      key={record.id}
      variants={historyCardVariants}
      transition={{ delay: i * 0.05 }}
    >
      <HistoryCard {...record} />
    </motion.div>
  ))}
</motion.div>
```

---

## Implementation Checklist

### Setup & Configuration

- [ ] Install Framer Motion: `bun add framer-motion`
- [ ] Create animation utilities (`lib/animations.ts`)
- [ ] Define global animation variants
- [ ] Set up animation constants (duration, easing)

### Core Components

- [ ] Create `AnimatedButton` wrapper component
- [ ] Create `AnimatedCard` wrapper component
- [ ] Create `FadeIn` utility component
- [ ] Create `SlideIn` utility component
- [ ] Create `StaggerChildren` container component

### Page Layouts

- [ ] Add motion to auth layout
- [ ] Add motion to admin layout
- [ ] Add motion to student layout
- [ ] Implement page transitions

### Admin Pages

- [ ] Dashboard animations
- [ ] Sessions list animations
- [ ] Session detail animations
- [ ] Students list animations
- [ ] Manage admins animations

### Student Pages

- [ ] Dashboard animations
- [ ] Scanner animations
- [ ] History animations

### Components

- [ ] AttendanceList animations
- [ ] SessionList animations (if exists)
- [ ] QR Code display animation
- [ ] Modal/Dialog animations
- [ ] Toast animations
- [ ] Badge animations

### Loading States

- [ ] Enhance all skeletons with pulse
- [ ] Add skeleton → content transitions
- [ ] Implement progressive loading
- [ ] Add loading button states

### Testing & Optimization

- [ ] Test animations on low-end devices
- [ ] Optimize animation performance (60fps)
- [ ] Add reduced motion support
- [ ] Test on mobile devices
- [ ] Browser compatibility testing

---

## Animation Utilities

Create reusable animation configurations:

```typescript
// lib/animations.ts
import { Variants, Transition } from 'framer-motion';

// Common transitions
export const transitions = {
  fast: { duration: 0.2, ease: 'easeOut' },
  normal: { duration: 0.3, ease: 'easeInOut' },
  slow: { duration: 0.5, ease: 'easeInOut' },
  spring: { type: 'spring', stiffness: 300, damping: 25 },
} as const;

// Common variants
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const slideDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Button interactions
export const buttonTap = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
};

// Reduced motion support
export const getMotionProps = (variants: Variants, transition?: Transition) => {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  return prefersReducedMotion ? {} : { variants, transition };
};
```

---

## Performance Best Practices

### 1. **Use transform and opacity**

Animate `transform` and `opacity` only for best performance:

```typescript
// ✅ Good - GPU accelerated
animate={{ opacity: 1, scale: 1, x: 0 }}

// ❌ Avoid - causes layout recalculation
animate={{ width: '100%', height: '100%', marginTop: 20 }}
```

### 2. **Limit concurrent animations**

Don't animate too many elements simultaneously:

```typescript
// Limit stagger to reasonable delays
transition: {
  staggerChildren: 0.05;
} // Not 0.5
```

### 3. **Use layout animations sparingly**

`layout` prop is expensive, use only when needed:

```typescript
// Only for complex layout changes
<motion.div layout>...</motion.div>
```

### 4. **Respect reduced motion**

```typescript
// Check user preference
const shouldAnimate = !window.matchMedia('(prefers-reduced-motion: reduce)')
  .matches;
```

---

## Progressive Enhancement

All animations should be **progressive enhancements**:

1. **Core functionality works without animations**
2. **Animations enhance but don't block**
3. **Fallback to instant transitions if needed**
4. **Respect system preferences**

---

## Timeline

**Week 1-2:** Foundation

- Install and configure Framer Motion
- Create animation utilities
- Implement page transitions
- Enhance loading states

**Week 3:** Lists & Grids

- Implement staggered list animations
- Add grid entrance animations
- Enhance card interactions

**Week 4:** Micro-interactions

- Button and form animations
- Modal/dialog enhancements
- Real-time update animations
- Polish and optimization

**Week 5:** Testing & Polish

- Performance optimization
- Cross-browser testing
- Mobile testing
- Accessibility testing

---

## Success Metrics

### User Experience

- ✅ Perceived load time reduction (feels faster)
- ✅ Interaction feedback within 100ms
- ✅ Smooth 60fps animations
- ✅ Reduced bounce rate

### Technical

- ✅ No jank or stuttering
- ✅ Lighthouse performance score > 90
- ✅ First Contentful Paint < 1.5s
- ✅ Time to Interactive < 3s

### User Feedback

- ✅ Positive feedback on UI smoothness
- ✅ Improved task completion rate
- ✅ Reduced support tickets for UI confusion

---

## Resources

**Framer Motion:**

- Docs: https://www.framer.com/motion/
- Examples: https://www.framer.com/motion/examples/
- Animation Guide: https://www.framer.com/motion/animation/

**Performance:**

- Web Vitals: https://web.dev/vitals/
- Animation Performance: https://web.dev/animations/

**Accessibility:**

- Reduced Motion: https://web.dev/prefers-reduced-motion/
- WCAG Guidelines: https://www.w3.org/WAI/WCAG21/quickref/

---

## Conclusion

Implementasi Framer Motion dan loading states yang konsisten akan:

✅ **Meningkatkan UX** - Aplikasi terasa lebih smooth dan responsive
✅ **Professional Look** - Modern animations menunjukkan kualitas
✅ **Better Feedback** - User selalu tahu apa yang terjadi
✅ **Competitive Advantage** - Berbeda dari sistem absensi biasa

**Next Step:** Mulai dari Phase 1 (Page Transitions) dan iterasi bertahap.
