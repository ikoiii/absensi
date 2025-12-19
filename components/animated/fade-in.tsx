'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { fadeIn, slideUp, scaleIn, prefersReducedMotion } from '@/lib/animations';
import { ReactNode } from 'react';

type AnimationType = 'fade' | 'slideUp' | 'scale';

interface FadeInProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  type?: AnimationType;
  delay?: number;
}

/**
 * Reusable FadeIn component with multiple animation types
 */
export function FadeIn({ 
  children, 
  type = 'fade',
  delay = 0,
  className,
  ...props 
}: FadeInProps) {
  if (prefersReducedMotion()) {
    return <div className={className}>{children}</div>;
  }

  const variants = {
    fade: fadeIn,
    slideUp: slideUp,
    scale: scaleIn,
  }[type];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{ delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
