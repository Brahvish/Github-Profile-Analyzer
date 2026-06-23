import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'bordered' | 'elevated';
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = false, padding = 'md', children, ...props }, ref) => {
    const variants = {
      default: 'bg-white/[0.02] backdrop-blur-md border border-white/[0.06]',
      glass: 'bg-white/[0.04] backdrop-blur-xl border border-white/[0.08]',
      bordered: 'bg-white/[0.02] backdrop-blur-md border border-accent/25',
      elevated: 'bg-white/[0.03] backdrop-blur-lg border border-white/[0.06] shadow-card',
    };

    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-5',
      lg: 'p-6 lg:p-8',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl transition-all duration-200',
          variants[variant],
          paddings[padding],
          hover && 'hover:shadow-card-hover hover:-translate-y-[2px] hover:border-white/[0.12] cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
