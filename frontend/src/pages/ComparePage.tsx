import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight, ArrowLeftRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { compareUsers } from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { Badge } from '@/components/ui/Badge';
import { FullAnalysis } from '@/types';
import { careerLevelColor, formatNumber } from '@/utils';
import { getLanguageColor } from '@/services/api';
import { AnimatedSection } from '@/components/ui/AnimatedSection';

interface CompareResult {
  profile1: FullAnalysis;
  profile2: FullAnalysis;
}

function DiffBadge({ a, b }: { a: number; b: number }) {
  const diff = a - b;
  if (Math.abs(diff) < 3) return <Minus className="w-3.5 h-3.5 text-slate-600" />;
  if (diff > 0) return <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />;
  return <TrendingDown className="w-3.5 h-3.5 text-rose-400" />;
}

const SCORE_KEYS = [
  { key: 'overall', label: 'Overall' },
  { key: 'codeQuality', label: 'Code Quality' },
  { key: 'communityEngagement', label: 'Community' },
  { key: 'consistency', label: 'Consistency' },
  { key: 'diversity', label: 'Diversity' },
  { key: 'openSourceActivity', label: 'Open Source' },
] as const;

export function ComparePage() {
  const [user1, setUser1] = useState('');
  const [user2, setUser2] = useState('');
  const [result, setResult] = useState<CompareResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user1.trim() || !user2.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await compareUsers(user1.trim(), user2.trim());
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Comparison failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 relative overflow-hidden bg-[#080A0F]">
      {/* Background orbs */}
      <div className="absolute top-[-10%] right-[-15%] w-[55vw] h-[55vw] rounded-full bg-[#634FFF]/8 blur-[120px] pointer-events-none animate-orb-2 z-0" />
      <div className="absolute bottom-[-10%] left-[-15%] w-[50vw] h-[50vw] rounded-full bg-[#38BDF8]/6 blur-[110px] pointer-events-none animate-orb-1 z-0" />

      <div className="max-w-4xl mx-auto relative z-10">
        <AnimatedSection>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 font-heading tracking-tight">Compare Profiles</h1>
            <p className="text-sm text-[#94A3B8]">Side-by-side developer analysis of two GitHub users.</p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={50}>
          <form onSubmit={handleCompare} className="flex flex-col md:flex-row gap-3 items-center mb-8">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                value={user1}
                onChange={e => setUser1(e.target.value)}
                placeholder="First username"
                className="w-full pl-11 pr-4 min-h-[48px] rounded-xl bg-white/[0.02] backdrop-blur-md border border-white/[0.06] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/40 focus:bg-white/[0.04] transition-all"
              />
            </div>
            <div className="flex items-center justify-center shrink-0">
              <ArrowLeftRight className="w-5 h-5 text-slate-500" />
            </div>
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                value={user2}
                onChange={e => setUser2(e.target.value)}
                placeholder="Second username"
                className="w-full pl-11 pr-4 min-h-[48px] rounded-xl bg-white/[0.02] backdrop-blur-md border border-white/[0.06] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/40 focus:bg-white/[0.04] transition-all"
              />
            </div>
            <Button
              type="submit"
              loading={loading}
              disabled={!user1.trim() || !user2.trim()}
              className="rounded-[10px] min-h-[48px] bg-gradient-to-r from-[#6D5FFA] to-[#4F46E5] text-white font-medium hover:-translate-y-[1px] hover:shadow-[0_4px_20px_rgba(109,95,250,0.4)] transition-all duration-200 shrink-0 w-full md:w-auto px-6"
              iconRight={<ArrowRight className="w-4 h-4" />}
            >
              Compare
            </Button>
          </form>
        </AnimatedSection>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-400/8 border border-rose-400/20">
            <p className="text-sm text-rose-400">{error}</p>
          </div>
        )}

        {result && (
          <AnimatedSection delay={100}>
            <div className="space-y-6">
              {/* Profile headers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[result.profile1, result.profile2].map((profile, idx) => (
                  <Card key={idx} padding="md" className="bg-white/[0.02] border border-white/[0.06]">
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={profile.user.avatar_url}
                        alt={profile.user.login}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{profile.user.name || profile.user.login}</p>
                        <p className="text-xs text-slate-500 font-mono">@{profile.user.login}</p>
                        <Badge variant="outline" className={`mt-1.5 text-[10px] uppercase font-bold tracking-wider ${careerLevelColor(profile.insights.careerLevel)}`}>
                          {profile.insights.careerLevel}
                        </Badge>
                      </div>
                      <div className="ml-auto shrink-0">
                        <ScoreRing score={profile.profileScore.overall} size={56} strokeWidth={5} />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs pt-3 border-t border-white/[0.04]">
                      <div>
                        <p className="font-semibold text-white">{formatNumber(profile.user.followers)}</p>
                        <p className="text-slate-500 text-[10px] uppercase tracking-wider mt-0.5">Followers</p>
                      </div>
                      <div>
                        <p className="font-semibold text-white">{profile.user.public_repos}</p>
                        <p className="text-slate-500 text-[10px] uppercase tracking-wider mt-0.5">Repos</p>
                      </div>
                      <div>
                        <p className="font-semibold text-white">
                          {profile.repos.reduce((s, r) => s + r.stars, 0)}
                        </p>
                        <p className="text-slate-500 text-[10px] uppercase tracking-wider mt-0.5">Stars</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Score comparison */}
              <Card padding="md" className="bg-white/[0.02] border border-white/[0.06]">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-5">Score Comparison</h3>
                <div className="space-y-4">
                  {SCORE_KEYS.map(({ key, label }) => {
                    const s1 = key === 'overall'
                      ? result.profile1.profileScore.overall
                      : result.profile1.profileScore[key];
                    const s2 = key === 'overall'
                      ? result.profile2.profileScore.overall
                      : result.profile2.profileScore[key];
                    return (
                      <div key={key} className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 w-10 justify-end">
                          <span className="text-xs font-semibold text-white tabular-nums">{s1}</span>
                          <DiffBadge a={s1} b={s2} />
                        </div>
                        <div className="flex-1">
                          <div className="text-[11px] text-slate-400 text-center mb-1.5 font-medium">{label}</div>
                          <div className="flex gap-1.5 items-center">
                            <div className="flex-1 h-1.5 rounded-full bg-white/[0.03] overflow-hidden flex justify-end">
                              <div
                                className="h-full bg-gradient-to-l from-[#6C63FF] to-[#7B73FF] rounded-full transition-all duration-700"
                                style={{ width: `${s1}%` }}
                              />
                            </div>
                            <div className="w-[1px] h-3.5 bg-white/[0.08] shrink-0" />
                            <div className="flex-1 h-1.5 rounded-full bg-white/[0.03] overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-700"
                                style={{ width: `${s2}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 w-10">
                          <DiffBadge a={s2} b={s1} />
                          <span className="text-xs font-semibold text-white tabular-nums">{s2}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* Legend */}
                <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-white/[0.04]">
                  <span className="flex items-center gap-1.5 text-xs text-[#94A3B8] font-medium">
                    <div className="w-3 h-1.5 rounded-full bg-accent" />
                    {result.profile1.user.login}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-[#94A3B8] font-medium">
                    <div className="w-3 h-1.5 rounded-full bg-emerald-400" />
                    {result.profile2.user.login}
                  </span>
                </div>
              </Card>

              {/* Language comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[result.profile1, result.profile2].map((profile, idx) => (
                  <Card key={idx} padding="md" className="bg-white/[0.02] border border-white/[0.06]">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Top Languages</h4>
                    <div className="space-y-2.5">
                      {profile.languageStats.slice(0, 5).map(lang => (
                        <div key={lang.language} className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: getLanguageColor(lang.language) }}
                          />
                          <span className="text-xs text-slate-300 font-medium flex-1">{lang.language}</span>
                          <span className="text-xs text-slate-500 font-mono">{lang.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Insights comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[result.profile1, result.profile2].map((profile, idx) => (
                  <Card key={idx} padding="md" className="bg-white/[0.02] border border-white/[0.06]">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Developer Insights</h4>
                    <div className="space-y-3">
                      {[
                        { label: 'Personality', value: profile.insights.codingPersonality },
                        { label: 'Collaboration', value: `${profile.insights.collaborationScore}/100` },
                        { label: 'Hiring Ready', value: `${profile.insights.hiringReadinessScore}/100` },
                        { label: 'Innovation', value: `${profile.insights.innovationScore}/100` },
                      ].map(item => (
                        <div key={item.label} className="flex justify-between text-xs border-b border-white/[0.04] pb-2 last:border-0 last:pb-0">
                          <span className="text-slate-500 font-medium">{item.label}</span>
                          <span className="text-slate-300 font-semibold">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </AnimatedSection>
        )}

        {!result && !loading && (
          <AnimatedSection delay={100}>
            <div className="text-center py-20">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
                <ArrowLeftRight className="w-6 h-6 text-slate-500" />
              </div>
              <p className="text-sm text-slate-400 font-medium mb-1">Ready to compare</p>
              <p className="text-xs text-slate-500">Enter two GitHub usernames to see a side-by-side breakdown</p>
            </div>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}
