import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { PropsWithChildren } from 'react';
import { cn } from '../../lib/cn';

interface RevealProps {
  className?: string;
  delay?: number;
  as?: 'div' | 'li';
}

export function Reveal({ children, className, delay = 0, as = 'div' }: PropsWithChildren<RevealProps>) {
  const reduceMotion = useReducedMotion();

  const variants: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
    },
  };

  const MotionTag = motion[as];

  return (
    <MotionTag
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}

export function Stagger({
  children,
  className,
  staggerDelay = 0.08,
}: PropsWithChildren<{ className?: string; staggerDelay?: number }>) {
  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
    >
      {children}
    </motion.div>
  );
}
