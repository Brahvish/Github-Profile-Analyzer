import { HTMLAttributes } from 'react';
import { cn } from '@/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'danger' | 'outline';
  size?: 'sm' | 'md';
}

export function Badge({ className, variant = 'default', size = 'sm', children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-white/8 text-ink-muted',
    accent: 'bg-accent/10 text-accent border border-accent/20',
    success: 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20',
    warning: 'bg-amber-400/10 text-amber-400 border border-amber-400/20',
    danger: 'bg-rose-400/10 text-rose-400 border border-rose-400/20',
    outline: 'border border-white/10 text-ink-muted',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-md',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
