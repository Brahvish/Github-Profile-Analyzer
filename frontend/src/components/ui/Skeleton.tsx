import { cn } from '@/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'line' | 'circle' | 'rect';
}

export function Skeleton({ className, variant = 'rect' }: SkeletonProps) {
  const base = 'animate-pulse bg-white/6 rounded-lg';
  const shapes = {
    line: 'h-4 rounded-full',
    circle: 'rounded-full',
    rect: 'rounded-xl',
  };
  return <div className={cn(base, shapes[variant], className)} />;
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface-2 border border-white/5 rounded-2xl p-6">
        <div className="flex gap-5 items-start">
          <Skeleton variant="circle" className="w-20 h-20 shrink-0" />
          <div className="flex-1 space-y-3">
            <Skeleton variant="line" className="w-48 h-6" />
            <Skeleton variant="line" className="w-32 h-4" />
            <Skeleton variant="line" className="w-full h-4 max-w-lg" />
            <div className="flex gap-3 pt-1">
              {[80, 60, 72].map((w, i) => (
                <Skeleton key={i} variant="rect" className={`h-8 w-${w === 80 ? '20' : w === 60 ? '16' : '18'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Score cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-surface-2 border border-white/5 rounded-2xl p-5 space-y-3">
            <Skeleton variant="line" className="w-20 h-3" />
            <Skeleton variant="circle" className="w-16 h-16 mx-auto" />
            <Skeleton variant="line" className="w-12 h-3 mx-auto" />
          </div>
        ))}
      </div>

      {/* Repos */}
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-surface-2 border border-white/5 rounded-2xl p-5 space-y-3">
            <div className="flex justify-between">
              <Skeleton variant="line" className="w-40 h-5" />
              <Skeleton variant="rect" className="w-16 h-6" />
            </div>
            <Skeleton variant="line" className="w-full h-4 max-w-sm" />
            <div className="flex gap-4">
              <Skeleton variant="line" className="w-16 h-3" />
              <Skeleton variant="line" className="w-16 h-3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
