import { Variants, Transition } from 'framer-motion';

/**
 * Animation Utilities for Framer Motion
 * Reusable variants, transitions, and helpers
 */

// ============================================================================
// TRANSITIONS
// ============================================================================

export const transitions = {
  fast: { duration: 0.2, ease: 'easeOut' },
  normal: { duration: 0.3, ease: 'easeInOut' },
  slow: { duration: 0.5, ease: 'easeInOut' },
  spring: { type: 'spring', stiffness: 300, damping: 25 } as const,
  springFast: { type: 'spring', stiffness: 400, damping: 30 } as const,
  springSlow: { type: 'spring', stiffness: 200, damping: 20 } as const,
} as const;

// ============================================================================
// COMMON VARIANTS
// ============================================================================

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitions.normal },
};

export const fadeInFast: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitions.fast },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: transitions.normal },
};

export const slideDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: transitions.normal },
};

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: transitions.normal },
};

export const slideRight: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: transitions.normal },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: transitions.spring },
};

export const scaleInFast: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: transitions.springFast },
};

// ============================================================================
// CONTAINER VARIANTS (for staggered children)
// ============================================================================

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

// ============================================================================
// BUTTON INTERACTIONS
// ============================================================================

export const buttonTap = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
};

export const buttonTapSubtle = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
};

export const buttonTapBold = {
  whileHover: { scale: 1.1 },
  whileTap: { scale: 0.9 },
};

// ============================================================================
// CARD INTERACTIONS
// ============================================================================

export const cardHover = {
  whileHover: { 
    y: -4,
    transition: transitions.fast,
  },
};

export const cardHoverScale = {
  whileHover: { 
    scale: 1.02,
    transition: transitions.fast,
  },
};

// ============================================================================
// MODAL/DIALOG VARIANTS
// ============================================================================

export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: transitions.spring,
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: transitions.fast,
  },
};

export const drawerVariants: Variants = {
  hidden: { opacity: 0, x: '100%' },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: transitions.spring,
  },
  exit: { 
    opacity: 0, 
    x: '100%',
    transition: transitions.normal,
  },
};

// ============================================================================
// LOADING/SKELETON VARIANTS
// ============================================================================

export const pulseVariants: Variants = {
  pulse: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const shimmerVariants: Variants = {
  shimmer: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// ============================================================================
// PAGE TRANSITION VARIANTS
// ============================================================================

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const pageTransition: Transition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4,
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get motion props with reduced motion support
 * Returns empty object if user prefers reduced motion
 */
export function getMotionProps(
  variants: Variants,
  transition?: Transition
): { variants?: Variants; transition?: Transition } {
  if (prefersReducedMotion()) return {};
  return { variants, transition };
}

/**
 * Create stagger delay for index
 */
export function staggerDelay(index: number, baseDelay = 0.05): number {
  return index * baseDelay;
}

// ============================================================================
// PRESETS FOR COMMON USE CASES
// ============================================================================

export const presets = {
  // List item entrance
  listItem: slideUp,
  
  // Card entrance
  card: scaleInFast,
  
  // Button interaction
  button: buttonTapSubtle,
  
  // Modal entrance
  modal: modalVariants,
  
  // Success indicator
  success: {
    ...scaleIn,
    visible: {
      ...scaleIn.visible,
      transition: {
        ...transitions.spring,
        delay: 0.1,
      },
    },
  },
  
  // Loading skeleton
  skeleton: pulseVariants,
} as const;
