import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { CommitActivity } from '@/types';

interface CommitTrendGraphProps {
  data: CommitActivity[];
}

const CustomTooltip = ({
  active, payload, label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-3 border border-white/10 rounded-xl px-3 py-2 shadow-card text-sm">
      <p className="text-ink-muted mb-0.5">{label}</p>
      <p className="text-accent font-semibold">{payload[0].value} commits</p>
    </div>
  );
};

export function CommitTrendGraph({ data }: CommitTrendGraphProps) {
  if (!data.length) {
    return (
      <div className="h-40 flex items-center justify-center text-ink-faint text-sm">
        No commit history available
      </div>
    );
  }

  const chartData = data.slice(-12).map(d => ({
    name: `${d.month} '${String(d.year).slice(2)}`,
    commits: d.commits,
  }));

  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
        <defs>
          <linearGradient id="commitGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6C63FF" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#6C63FF" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fill: '#8888A8', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis tick={{ fill: '#8888A8', fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="commits"
          stroke="#6C63FF"
          strokeWidth={2}
          fill="url(#commitGradient)"
          dot={false}
          activeDot={{ r: 4, fill: '#6C63FF', strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
