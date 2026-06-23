import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAnalysis } from '@/hooks/useAnalysis';
import { useStore } from '@/store/useStore';
import { ProfileSkeleton } from '@/components/ui/Skeleton';
import { Card } from '@/components/ui/Card';
import { timeAgo } from '@/utils';
import { AnimatedSection } from '@/components/ui/AnimatedSection';

export function AnalyzerPage() {
  const [username, setUsername] = useState('');
  const { analyze, isAnalyzing, analysisError } = useAnalysis();
  const { searchHistory, clearHistory } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) await analyze(username.trim());
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 relative overflow-hidden bg-[#080A0F]">
      {/* Background orbs */}
      <div className="absolute top-[-10%] left-[-15%] w-[55vw] h-[55vw] rounded-full bg-[#634FFF]/8 blur-[120px] pointer-events-none animate-orb-1 z-0" />
      <div className="absolute bottom-[10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#38BDF8]/6 blur-[110px] pointer-events-none animate-orb-2 z-0" />

      <div className="max-w-2xl mx-auto relative z-10">
        <AnimatedSection>
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-white mb-2 font-heading tracking-tight">Analyze a Profile</h1>
            <p className="text-sm text-[#94A3B8]">
              Enter any GitHub username to generate a full developer intelligence report.
            </p>
          </div>
        </AnimatedSection>

        {/* Search form */}
        <AnimatedSection delay={50}>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="GitHub username…"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full pl-11 pr-10 min-h-[48px] rounded-xl bg-white/[0.02] backdrop-blur-md border border-white/[0.06] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/40 focus:bg-white/[0.04] transition-all"
                autoFocus
                disabled={isAnalyzing}
              />
              {username && (
                <button
                  type="button"
                  onClick={() => setUsername('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <Button
              type="submit"
              loading={isAnalyzing}
              disabled={!username.trim()}
              className="rounded-[10px] min-h-[48px] bg-gradient-to-r from-[#6D5FFA] to-[#4F46E5] text-white font-medium hover:-translate-y-[1px] hover:shadow-[0_4px_20px_rgba(109,95,250,0.4)] transition-all duration-200 shrink-0"
              iconRight={<ArrowRight className="w-4 h-4" />}
            >
              {isAnalyzing ? 'Analyzing…' : 'Analyze'}
            </Button>
          </form>
        </AnimatedSection>

        {/* Error state */}
        {analysisError && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-rose-400/8 border border-rose-400/20"
          >
            <p className="text-sm text-rose-400">{analysisError}</p>
          </motion.div>
        )}

        {/* Loading skeleton */}
        {isAnalyzing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="mb-4 p-4 rounded-xl bg-accent/5 border border-accent/15">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <p className="text-xs text-accent">
                  Fetching profile, repositories, and events…
                </p>
              </div>
            </div>
            <ProfileSkeleton />
          </motion.div>
        )}

        {/* Search history */}
        {!isAnalyzing && searchHistory.length > 0 && (
          <AnimatedSection delay={100}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Recent searches</p>
                <button
                  onClick={clearHistory}
                  className="text-xs text-slate-500 hover:text-slate-300 font-medium transition-colors"
                >
                  Clear all
                </button>
              </div>
              <div className="space-y-2.5">
                {searchHistory.slice(0, 10).map(h => (
                  <Card
                    key={h.username}
                    hover
                    padding="sm"
                    onClick={() => analyze(h.username)}
                    className="cursor-pointer bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04]"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={h.avatarUrl}
                        alt={h.username}
                        className="w-8 h-8 rounded-xl object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{h.name || h.username}</p>
                        <p className="text-xs text-[#64748B] font-mono">@{h.username}</p>
                      </div>
                      <span className="text-xs text-slate-500 font-mono">{timeAgo(h.searchedAt)}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Empty state */}
        {!isAnalyzing && searchHistory.length === 0 && !analysisError && (
          <AnimatedSection delay={100}>
            <div className="text-center py-16">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-slate-500" />
              </div>
              <p className="text-sm text-slate-400 font-medium mb-1">No searches yet</p>
              <p className="text-xs text-slate-500">Start by entering a GitHub username above</p>
            </div>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}
