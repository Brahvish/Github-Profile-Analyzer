import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading,
      iconLeft,
      iconRight,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary: 'bg-gradient-to-r from-[#6D5FFA] to-[#4F46E5] text-white hover:-translate-y-[1px] hover:shadow-[0_4px_20px_rgba(109,95,250,0.3)] transition-all duration-200',
      secondary: 'bg-white/[0.03] hover:bg-white/[0.06] text-ink border border-white/[0.06]',
      ghost: 'hover:bg-white/5 text-ink-muted hover:text-ink',
      danger: 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20',
      outline: 'border border-accent/30 hover:bg-accent/5 text-accent',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-150',
          !className?.includes('rounded-') && 'rounded-[10px]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50',
          'disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : iconLeft}
        {children}
        {!loading && iconRight}
      </button>
    );
  }
);

Button.displayName = 'Button';
