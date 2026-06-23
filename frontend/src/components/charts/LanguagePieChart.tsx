import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { LanguageStats } from '@/types';
import { getLanguageColor } from '@/services/api';

interface LanguagePieChartProps {
  data: LanguageStats[];
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: LanguageStats }> }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-surface-3 border border-white/10 rounded-xl px-3 py-2 shadow-card text-sm">
      <span className="font-medium text-ink">{d.language}</span>
      <span className="text-ink-muted ml-2">{d.percentage}%</span>
    </div>
  );
};

export function LanguagePieChart({ data }: LanguagePieChartProps) {
  if (!data.length) {
    return (
      <div className="h-48 flex items-center justify-center text-ink-faint text-sm">
        No language data
      </div>
    );
  }

  return (
    <div className="flex gap-6 items-center">
      <div className="w-36 h-36 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data.slice(0, 8)}
              cx="50%"
              cy="50%"
              innerRadius={38}
              outerRadius={66}
              paddingAngle={2}
              dataKey="percentage"
              strokeWidth={0}
            >
              {data.slice(0, 8).map((entry) => (
                <Cell key={entry.language} fill={getLanguageColor(entry.language)} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-col gap-2 flex-1 min-w-0">
        {data.slice(0, 6).map((lang) => (
          <div key={lang.language} className="flex items-center gap-2.5">
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: getLanguageColor(lang.language) }}
            />
            <span className="text-xs font-medium text-ink truncate flex-1">{lang.language}</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 rounded-full bg-white/6 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${lang.percentage}%`,
                    backgroundColor: getLanguageColor(lang.language),
                  }}
                />
              </div>
              <span className="text-xs text-ink-faint w-8 text-right">{lang.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
