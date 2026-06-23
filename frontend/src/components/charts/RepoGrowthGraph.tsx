import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { RepoAnalysis, ActivityTimelineItem } from '@/types';
import { format } from 'date-fns';
import { eventTypeLabel } from '@/utils';

// --- Repo Growth Graph ---
interface RepoGrowthGraphProps {
  repos: RepoAnalysis[];
}

const BarTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-3 border border-white/10 rounded-xl px-3 py-2 shadow-card text-sm">
      <p className="text-ink-muted mb-1 text-xs">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} className="text-ink font-medium">
          {p.dataKey === 'stars' ? '⭐' : '🍴'} {p.value} {p.dataKey}
        </p>
      ))}
    </div>
  );
};

export function RepoGrowthGraph({ repos }: RepoGrowthGraphProps) {
  const data = repos
    .filter(r => !r.isFork)
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 10)
    .map(r => ({
      name: r.name.length > 14 ? r.name.slice(0, 14) + '…' : r.name,
      stars: r.stars,
      forks: r.forks,
    }));

  if (!data.length) {
    return (
      <div className="h-40 flex items-center justify-center text-ink-faint text-sm">
        No repository data
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: '#8888A8', fontSize: 9 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#8888A8', fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip content={<BarTooltip />} />
        <Bar dataKey="stars" fill="#6C63FF" radius={[4, 4, 0, 0]} opacity={0.9} />
        <Bar dataKey="forks" fill="#34D399" radius={[4, 4, 0, 0]} opacity={0.7} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// --- Activity Timeline ---
interface ActivityTimelineProps {
  data: ActivityTimelineItem[];
}

const EVENT_COLORS: Record<string, string> = {
  PushEvent: 'bg-accent',
  PullRequestEvent: 'bg-emerald-400',
  IssuesEvent: 'bg-amber-400',
  CreateEvent: 'bg-sky-400',
  ForkEvent: 'bg-rose-400',
  WatchEvent: 'bg-pink-400',
  ReleaseEvent: 'bg-orange-400',
};

export function ActivityTimeline({ data }: ActivityTimelineProps) {
  const items = data.slice(0, 20);

  if (!items.length) {
    return (
      <div className="py-8 text-center text-ink-faint text-sm">
        No recent activity
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-3 py-2 border-b border-white/4 last:border-0">
          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${EVENT_COLORS[item.type] ?? 'bg-ink-faint'}`} />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-ink leading-snug">{eventTypeLabel(item.type)}</p>
            <p className="text-xs text-ink-faint mt-0.5 truncate">{item.repo.split('/')[1] ?? item.repo}</p>
          </div>
          <span className="text-xs text-ink-faint shrink-0">
            {format(new Date(item.date), 'MMM d')}
          </span>
        </div>
      ))}
    </div>
  );
}
