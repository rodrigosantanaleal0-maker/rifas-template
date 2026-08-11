import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
type Size = 'md' | 'lg';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref' | 'children'> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  children?: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-gold-300 to-gold-500 text-[#181103] shadow-[0_8px_30px_-8px_rgba(245,179,1,0.55)] hover:shadow-[0_10px_38px_-6px_rgba(245,179,1,0.7)]',
  secondary:
    'bg-gradient-to-r from-violet-500 to-magenta-500 text-white shadow-[0_8px_30px_-8px_rgba(139,92,246,0.55)] hover:shadow-[0_10px_38px_-6px_rgba(139,92,246,0.7)]',
  ghost: 'bg-surface-2 text-ink hover:bg-surface-3 border border-border',
  outline: 'bg-transparent text-ink border border-border hover:border-gold-400/60 hover:bg-surface-2',
  danger:
    'bg-gradient-to-r from-ruby-400 to-ruby-500 text-white shadow-[0_8px_30px_-8px_rgba(244,63,94,0.55)] hover:shadow-[0_10px_38px_-6px_rgba(244,63,94,0.7)]',
};

const sizeClasses: Record<Size, string> = {
  md: 'text-sm px-5 py-2.5 gap-2',
  lg: 'text-base px-7 py-3.5 gap-2.5',
};

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={cn(
        'inline-flex items-center justify-center rounded-full font-display font-semibold tracking-tight transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {icon && iconPosition === 'left' && icon}
      {children}
      {icon && iconPosition === 'right' && icon}
    </motion.button>
  );
}
