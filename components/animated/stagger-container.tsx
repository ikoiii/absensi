'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { staggerContainer, staggerContainerFast, prefersReducedMotion } from '@/lib/animations';
import { ReactNode } from 'react';

interface StaggerChildrenProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  fast?: boolean;
  className?: string;
}

/**
 * Container that staggers the animation of its children
 */
export function StaggerChildren({ 
  children, 
  fast = false,
  className,
  ...props 
}: StaggerChildrenProps) {
  if (prefersReducedMotion()) {
    return <div className={className}>{children}</div>;
  }

  const variants = fast ? staggerContainerFast : staggerContainer;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
