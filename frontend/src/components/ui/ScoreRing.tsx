import { motion } from 'framer-motion';
import { cn, scoreColor } from '@/utils';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  animate?: boolean;
  className?: string;
}

export function ScoreRing({
  score,
  size = 80,
  strokeWidth = 6,
  label,
  sublabel,
  animate = true,
  className,
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const colors = {
    high: { stroke: '#34D399', text: 'text-emerald-400' },
    mid: { stroke: '#6C63FF', text: 'text-accent' },
    low: { stroke: '#FBBF24', text: 'text-amber-400' },
    poor: { stroke: '#FB7185', text: 'text-rose-400' },
  };

  const palette =
    score >= 80 ? colors.high :
    score >= 60 ? colors.mid :
    score >= 40 ? colors.low :
    colors.poor;

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
          />
          {/* Progress */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={palette.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: animate ? offset : offset }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
            style={{ filter: `drop-shadow(0 0 6px ${palette.stroke}60)` }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('font-semibold tabular-nums', palette.text,
            size >= 100 ? 'text-2xl' : size >= 70 ? 'text-lg' : 'text-sm'
          )}>
            {score}
          </span>
        </div>
      </div>

      {label && (
        <div className="text-center">
          <p className="text-xs font-medium text-ink-muted leading-tight">{label}</p>
          {sublabel && <p className="text-xs text-ink-faint mt-0.5">{sublabel}</p>}
        </div>
      )}
    </div>
  );
}
