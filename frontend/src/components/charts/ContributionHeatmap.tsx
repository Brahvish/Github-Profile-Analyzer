import { ActivityTimelineItem } from '@/types';
import { format, eachDayOfInterval, subDays, startOfWeek } from 'date-fns';

interface ContributionHeatmapProps {
  data: ActivityTimelineItem[];
}

function buildHeatmapData(events: ActivityTimelineItem[]) {
  const today = new Date();
  const startDay = subDays(today, 364);

  const countByDay: Record<string, number> = {};
  events.forEach(e => {
    const day = e.date.slice(0, 10);
    countByDay[day] = (countByDay[day] ?? 0) + 1;
  });

  const days = eachDayOfInterval({ start: startDay, end: today });
  return days.map(day => ({
    date: format(day, 'yyyy-MM-dd'),
    count: countByDay[format(day, 'yyyy-MM-dd')] ?? 0,
  }));
}

function getIntensityClass(count: number): string {
  if (count === 0) return 'bg-white/5';
  if (count === 1) return 'bg-accent/20';
  if (count <= 3) return 'bg-accent/40';
  if (count <= 6) return 'bg-accent/70';
  return 'bg-accent';
}

export function ContributionHeatmap({ data }: ContributionHeatmapProps) {
  const heatmapData = buildHeatmapData(data);

  // Group into weeks
  const weeks: typeof heatmapData[] = [];
  let currentWeek: typeof heatmapData = [];

  const firstDay = heatmapData[0];
  if (firstDay) {
    const startDow = new Date(firstDay.date).getDay();
    for (let i = 0; i < startDow; i++) {
      currentWeek.push({ date: '', count: -1 }); // padding
    }
  }

  heatmapData.forEach(day => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  if (currentWeek.length) weeks.push(currentWeek);

  const totalContributions = heatmapData.reduce((s, d) => s + d.count, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-ink-muted">{totalContributions} contributions in the last year</span>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-ink-faint">Less</span>
          {['bg-white/5', 'bg-accent/20', 'bg-accent/40', 'bg-accent/70', 'bg-accent'].map((cls, i) => (
            <div key={i} className={`w-3 h-3 rounded-sm ${cls}`} />
          ))}
          <span className="text-xs text-ink-faint">More</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-1">
        <div className="flex gap-0.5 min-w-max">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-0.5">
              {week.map((day, di) => (
                <div
                  key={di}
                  title={day.date && day.count >= 0 ? `${day.date}: ${day.count} events` : undefined}
                  className={`w-3 h-3 rounded-sm transition-colors ${
                    day.count === -1
                      ? 'bg-transparent'
                      : day.date === ''
                      ? 'bg-transparent'
                      : getIntensityClass(day.count)
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
