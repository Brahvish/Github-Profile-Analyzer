import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ArrowRight, TrendingUp, Shield, Zap, BarChart2, GitFork, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAnalysis } from '@/hooks/useAnalysis';
import { useStore } from '@/store/useStore';
import { TRENDING_DEVELOPERS, timeAgo } from '@/utils';
import { AnimatedSection } from '@/components/ui/AnimatedSection';

const features = [
  {
    icon: BarChart2,
    title: 'Deep Profile Analytics',
    description: 'Score your GitHub presence across 7 dimensions — from code quality to community impact.',
    glow: 'bg-purple-500/10 group-hover:bg-purple-500/20',
    iconBg: 'from-purple-500/20 to-purple-500/5 text-purple-400 border border-purple-500/20',
  },
  {
    icon: TrendingUp,
    title: 'Commit Intelligence',
    description: 'Visualize contribution patterns, activity heatmaps, and coding consistency over time.',
    glow: 'bg-teal-500/10 group-hover:bg-teal-500/20',
    iconBg: 'from-teal-500/20 to-teal-500/5 text-teal-400 border border-teal-500/20',
  },
  {
    icon: Shield,
    title: 'Recruiter Mode',
    description: 'Instant hiring signals: strengths, risk analysis, interview focus areas, salary range.',
    glow: 'bg-amber-500/10 group-hover:bg-amber-500/20',
    iconBg: 'from-amber-500/20 to-amber-500/5 text-amber-400 border border-amber-500/20',
  },
  {
    icon: Zap,
    title: 'Resume Generator',
    description: 'Convert your GitHub history into polished, copy-paste-ready resume bullet points.',
    glow: 'bg-emerald-500/10 group-hover:bg-emerald-500/20',
    iconBg: 'from-emerald-500/20 to-emerald-500/5 text-emerald-400 border border-emerald-500/20',
  },
];

export function LandingPage() {
  const [username, setUsername] = useState('');
  const { analyze, isAnalyzing } = useAnalysis();
  const { searchHistory, authUser } = useStore();
  const navigate = useNavigate();

  // GitHub-specific fields only exist when signed in via GitHub
  const isGithubUser = authUser?.provider === 'github' && !!authUser.githubUsername;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) await analyze(username.trim());
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#080A0F]">
      {/* Animated background radial glow orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] md:w-[45vw] md:h-[45vw] rounded-full bg-[#634FFF]/10 blur-[130px] pointer-events-none animate-orb-1 z-0" />
      <div className="absolute top-[25%] right-[-10%] w-[55vw] h-[55vw] md:w-[40vw] md:h-[40vw] rounded-full bg-[#38BDF8]/8 blur-[120px] pointer-events-none animate-orb-2 z-0" />
      <div className="absolute bottom-[-5%] left-[20%] w-[40vw] h-[40vw] md:w-[30vw] md:h-[30vw] rounded-full bg-purple-500/6 blur-[110px] pointer-events-none animate-orb-3 z-0" />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden z-10">
        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Pill-shaped badge with pulsing green dot */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.03] backdrop-blur-md border border-white/[0.06] text-xs text-slate-300 font-medium mb-8 select-none">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              No API keys required · Fully public
            </div>

            <h1 className="text-[clamp(2.25rem,6.5vw,4.25rem)] font-bold text-white leading-[1.05] tracking-tight mb-6 font-heading">
              Read a developer's
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C6FFF] to-[#38BDF8]">
                GitHub story
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed mb-10 max-w-xl mx-auto">
              Deep analysis of any GitHub profile. Scores, visual analytics,
              recruiter reports, and resume points — in seconds.
            </p>

            {/* Search form */}
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto px-4 sm:px-0">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="GitHub username…"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 min-h-[48px] rounded-xl bg-white/[0.02] backdrop-blur-md border border-white/[0.06] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/40 focus:bg-white/[0.04] transition-all"
                  autoFocus
                />
              </div>
              <Button 
                type="submit" 
                loading={isAnalyzing} 
                className="rounded-[10px] min-h-[48px] bg-gradient-to-r from-[#6D5FFA] to-[#4F46E5] text-white font-medium hover:-translate-y-[1px] hover:shadow-[0_4px_20px_rgba(109,95,250,0.4)] transition-all duration-200 shrink-0"
                iconRight={<ArrowRight className="w-4 h-4" />}
              >
                Analyze
              </Button>
            </form>

            {/* Quick suggestions separated by · */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-5 text-xs text-slate-500 select-none">
              <span>Try:</span>
              {['torvalds', 'gaearon', 'sindresorhus', 'antfu'].map((u, idx) => (
                <span key={u} className="inline-flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => analyze(u)}
                    className="text-slate-400 hover:text-accent font-medium transition-colors cursor-pointer"
                  >
                    @{u}
                  </button>
                  {idx < 3 && <span className="text-slate-600 font-semibold">·</span>}
                </span>
              ))}
            </div>

            {/* GitHub profile card — shown when logged in via GitHub */}
            {isGithubUser && authUser && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mt-8 max-w-md mx-auto px-4 sm:px-0"
              >
                <div className="relative rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-accent/20 shadow-[0_0_40px_rgba(109,95,250,0.08)] overflow-hidden group">
                  {/* Top gradient bar */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#7C6FFF] to-[#38BDF8]" />

                  <div className="p-5 flex items-center gap-4">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <img
                        src={authUser.photoURL || `https://github.com/${authUser.githubUsername}.png`}
                        alt={authUser.displayName || authUser.githubUsername || ''}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-accent/30"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#080A0F]" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-0.5">Logged in via GitHub</p>
                      <p className="text-base font-bold text-white truncate">{authUser.displayName || authUser.githubUsername}</p>
                      <p className="text-xs text-slate-500 truncate">@{authUser.githubUsername}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        {authUser.githubPublicRepos !== undefined && (
                          <span className="flex items-center gap-1 text-[11px] text-slate-400">
                            <GitFork className="w-3 h-3 text-slate-500" />
                            {authUser.githubPublicRepos} repos
                          </span>
                        )}
                        {authUser.githubFollowers !== undefined && (
                          <span className="flex items-center gap-1 text-[11px] text-slate-400">
                            <Users className="w-3 h-3 text-slate-500" />
                            {authUser.githubFollowers} followers
                          </span>
                        )}
                      </div>
                    </div>

                    {/* CTA */}
                    <button
                      id="analyze-my-profile-btn"
                      onClick={() => navigate(`/report/${authUser.githubUsername}`)}
                      className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#6D5FFA] to-[#4F46E5] text-white text-xs font-semibold hover:-translate-y-[1px] hover:shadow-[0_4px_16px_rgba(109,95,250,0.4)] active:translate-y-0 transition-all duration-200"
                    >
                      Analyze me
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {authUser.githubBio && (
                    <p className="px-5 pb-4 text-xs text-slate-500 leading-relaxed border-t border-white/[0.04] pt-3">
                      {authUser.githubBio}
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Recent searches */}
      {searchHistory.length > 0 && (
        <AnimatedSection className="max-w-5xl mx-auto px-4 pb-12 relative z-10">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Recent searches</p>
          <div className="flex flex-wrap gap-2">
            {searchHistory.slice(0, 8).map(h => (
              <button
                key={h.username}
                onClick={() => analyze(h.username)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.02] backdrop-blur-md border border-white/[0.06] hover:border-accent/30 hover:bg-white/[0.04] transition-all cursor-pointer"
              >
                <img src={h.avatarUrl} alt={h.username} className="w-5 h-5 rounded-full object-cover" />
                <span className="text-xs text-slate-300 font-medium">{h.username}</span>
                <span className="text-[10px] text-slate-500 font-mono">{timeAgo(h.searchedAt)}</span>
              </button>
            ))}
          </div>
        </AnimatedSection>
      )}

      {/* Features */}
      <AnimatedSection className="max-w-5xl mx-auto px-4 pb-20 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {features.map((f, i) => (
            <div key={f.title} className="h-full group">
              <Card
                className="h-full relative overflow-hidden bg-white/[0.02] backdrop-blur-md border border-white/[0.06] transition-all duration-200 ease-in-out hover:-translate-y-[2px] hover:border-white/[0.12] hover:shadow-card-hover p-6 lg:p-8"
                padding="none"
              >
                {/* Subtle top-left icon background glow */}
                <div className={`absolute -top-6 -left-6 w-24 h-24 rounded-full blur-[40px] transition-all duration-300 opacity-40 group-hover:opacity-75 ${f.glow} pointer-events-none`} />
                
                <div className="relative z-10">
                  {/* Icon container: 40x40px rounded square with gradient */}
                  <div className={`w-10 h-10 rounded-[10px] bg-gradient-to-br ${f.iconBg} flex items-center justify-center mb-4`}>
                    <f.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-2 font-heading tracking-tight">{f.title}</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">{f.description}</p>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* Trending developers */}
      <AnimatedSection className="max-w-5xl mx-auto px-4 pb-24 relative z-10">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Trending developers to analyze</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {TRENDING_DEVELOPERS.map(dev => (
            <button
              key={dev}
              onClick={() => analyze(dev)}
              className="flex flex-col items-center justify-center aspect-square p-4 rounded-[12px] bg-white/[0.02] backdrop-blur-md border border-white/[0.06] hover:border-accent/40 hover:shadow-[0_0_12px_rgba(108,99,255,0.15)] transition-all duration-200 group"
            >
              <img
                src={`https://github.com/${dev}.png`}
                alt={dev}
                className="w-12 h-12 rounded-full object-cover transition-transform duration-200 group-hover:scale-[1.05] mb-2.5"
                onError={e => {
                  e.currentTarget.src = `https://github.com/github.png`;
                }}
              />
              <span className="text-xs text-slate-400 group-hover:text-ink transition-colors font-mono font-medium truncate w-full text-center">
                @{dev}
              </span>
            </button>
          ))}
        </div>
      </AnimatedSection>
    </div>
  );
}
