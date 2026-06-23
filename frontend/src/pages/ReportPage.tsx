import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import {
  Download, Share2, Bookmark, BookmarkCheck, FileText, Briefcase,
  BarChart2, Code2, Activity, GitBranch, CheckCheck, RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProfileSkeleton } from '@/components/ui/Skeleton';
import { ProfileScore } from '@/components/analysis/ProfileScore';
import { InsightPanel } from '@/components/analysis/InsightPanel';
import { RepositoryCard } from '@/components/analysis/RepositoryCard';
import { ResumeMode } from '@/components/analysis/ResumeMode';
import { RecruiterMode } from '@/components/analysis/RecruiterMode';
import { LanguagePieChart } from '@/components/charts/LanguagePieChart';
import { CommitTrendGraph } from '@/components/charts/CommitTrendGraph';
import { ContributionHeatmap } from '@/components/charts/ContributionHeatmap';
import { RepoGrowthGraph, ActivityTimeline } from '@/components/charts/RepoGrowthGraph';
import { Card } from '@/components/ui/Card';
import { useAnalysis } from '@/hooks/useAnalysis';
import { useStore } from '@/store/useStore';
import { useCopyToClipboard } from '@/hooks/useLocalStorage';
import { downloadJSON, generateShareUrl } from '@/utils';
import { FullAnalysis } from '@/types';

type Tab = 'overview' | 'repositories' | 'analytics' | 'insights';

export function ReportPage() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { analyze, isAnalyzing, currentAnalysis } = useAnalysis();
  const { savedReports, saveReport, deleteReport, isResumeMode, isRecruiterMode, toggleResumeMode, toggleRecruiterMode } = useStore();
  const { copy, copied } = useCopyToClipboard();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [analysis, setAnalysis] = useState<FullAnalysis | null>(null);
  const [repoFilter, setRepoFilter] = useState<'all' | 'own' | 'forked'>('own');
  const [showRepoCount, setShowRepoCount] = useState(10);

  const isSaved = username ? savedReports.some(r => r.username === username) : false;

  useEffect(() => {
    if (!username) { navigate('/analyze'); return; }

    if (currentAnalysis?.user.login.toLowerCase() === username.toLowerCase()) {
      setAnalysis(currentAnalysis);
      return;
    }

    const saved = savedReports.find(r => r.username.toLowerCase() === username.toLowerCase());
    if (saved) { setAnalysis(saved.analysis); return; }

    analyze(username, false).then(result => {
      if (result) setAnalysis(result);
    });
  }, [username]);

  useEffect(() => {
    if (currentAnalysis?.user.login.toLowerCase() === username?.toLowerCase()) {
      setAnalysis(currentAnalysis);
    }
  }, [currentAnalysis]);

  const handleSave = () => {
    if (!analysis || !username) return;
    if (isSaved) deleteReport(username);
    else saveReport(username, analysis);
  };

  const handleExportJSON = () => {
    if (!analysis) return;
    downloadJSON(analysis, `gitinsight-${analysis.user.login}.json`);
  };

  const handleShare = () => {
    if (!username) return;
    copy(generateShareUrl(username));
  };

  const handleRefresh = () => {
    if (!username) return;
    analyze(username, false).then(result => {
      if (result) setAnalysis(result);
    });
  };

  if (isAnalyzing && !analysis) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 max-w-5xl mx-auto">
        <div className="mb-6 p-4 rounded-xl bg-accent/5 border border-accent/15">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse-soft" />
            <p className="text-xs text-accent">Analyzing @{username}…</p>
          </div>
        </div>
        <ProfileSkeleton />
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-ink-muted mb-4">Could not load analysis for @{username}</p>
          <Button onClick={() => navigate('/analyze')}>Go back</Button>
        </div>
      </div>
    );
  }

  const { user, repos, profileScore, insights, recruiterReport, resumePoints, commitActivity, activityTimeline, languageStats } = analysis;

  const filteredRepos = repos.filter(r => {
    if (repoFilter === 'own') return !r.isFork;
    if (repoFilter === 'forked') return r.isFork;
    return true;
  });

  const tabs: Array<{ id: Tab; label: string; icon: React.ElementType }> = [
    { id: 'overview', label: 'Overview', icon: BarChart2 },
    { id: 'repositories', label: `Repos (${filteredRepos.length})`, icon: GitBranch },
    { id: 'analytics', label: 'Analytics', icon: Activity },
    { id: 'insights', label: 'Insights', icon: Code2 },
  ];

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 relative overflow-hidden bg-[#080A0F]">
      {/* Background orbs */}
      <div className="absolute top-[-10%] right-[-15%] w-[55vw] h-[55vw] rounded-full bg-[#634FFF]/8 blur-[120px] pointer-events-none animate-orb-2 z-0" />
      <div className="absolute bottom-[5%] left-[-15%] w-[50vw] h-[50vw] rounded-full bg-[#38BDF8]/6 blur-[110px] pointer-events-none animate-orb-1 z-0" />

      <div className="max-w-5xl mx-auto relative z-10">

        {/* Top actions bar */}
        <div className="flex items-center justify-between py-4 mb-6 border-b border-white/[0.06]">
          <p className="text-sm text-ink-muted font-mono">@{user.login}</p>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleRefresh}
              loading={isAnalyzing}
              iconLeft={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Refresh
            </Button>
            <Button
              size="sm"
              variant={isResumeMode ? 'outline' : 'ghost'}
              onClick={toggleResumeMode}
              iconLeft={<FileText className="w-3.5 h-3.5" />}
            >
              Resume
            </Button>
            <Button
              size="sm"
              variant={isRecruiterMode ? 'outline' : 'ghost'}
              onClick={toggleRecruiterMode}
              iconLeft={<Briefcase className="w-3.5 h-3.5" />}
            >
              Recruiter
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleShare}
              iconLeft={copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            >
              {copied ? 'Copied!' : 'Share'}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleExportJSON}
              iconLeft={<Download className="w-3.5 h-3.5" />}
            >
              Export
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleSave}
              iconLeft={isSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-accent" /> : <Bookmark className="w-3.5 h-3.5" />}
            >
              {isSaved ? 'Saved' : 'Save'}
            </Button>
          </div>
        </div>

        {/* Resume / Recruiter overlay panels */}
        <AnimatePresence>
          {isResumeMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <ResumeMode resume={resumePoints} username={user.login} />
            </motion.div>
          )}
          {isRecruiterMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <RecruiterMode report={recruiterReport} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile score header (always visible) */}
        <div className="mb-6">
          <ProfileScore user={user} score={profileScore} insights={insights} />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-white/[0.06]">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px ${
                activeTab === tab.id
                  ? 'border-accent text-accent'
                  : 'border-transparent text-ink-muted hover:text-ink'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ---- OVERVIEW ---- */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-4"
            >
              {/* Languages */}
              <Card padding="md" className="lg:col-span-2">
                <h3 className="text-xs font-semibold text-ink-muted mb-4">Language Breakdown</h3>
                <LanguagePieChart data={languageStats} />
              </Card>

              {/* Personality snapshot */}
              <Card padding="md">
                <h3 className="text-xs font-semibold text-ink-muted mb-4">Developer DNA</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Personality', value: insights.codingPersonality },
                    { label: 'Career Level', value: insights.careerLevel },
                    { label: 'Active Month', value: insights.mostActiveMonth },
                    { label: 'Current Streak', value: `${insights.streakDays} days 🔥` },
                    { label: 'Contributions', value: String(insights.totalContributions) },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between items-center py-1.5 border-b border-white/[0.04] last:border-0">
                      <span className="text-xs text-ink-faint">{item.label}</span>
                      <span className="text-xs font-medium text-ink">{item.value}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Commit trend */}
              <Card padding="md" className="lg:col-span-2">
                <h3 className="text-xs font-semibold text-ink-muted mb-4">Commit Activity (12 months)</h3>
                <CommitTrendGraph data={commitActivity} />
              </Card>

              {/* Activity timeline */}
              <Card padding="md">
                <h3 className="text-xs font-semibold text-ink-muted mb-4">Recent Activity</h3>
                <ActivityTimeline data={activityTimeline} />
              </Card>

              {/* Contribution heatmap (full width) */}
              <Card padding="md" className="lg:col-span-3">
                <h3 className="text-xs font-semibold text-ink-muted mb-4">Contribution Heatmap</h3>
                <ContributionHeatmap data={activityTimeline} />
              </Card>

              {/* Top repos preview */}
              <div className="lg:col-span-3 space-y-3">
                <h3 className="text-xs font-semibold text-ink-muted">Top Repositories</h3>
                {repos.filter(r => !r.isFork).slice(0, 4).map((repo, i) => (
                  <RepositoryCard key={repo.name} repo={repo} index={i} compact />
                ))}
                <button
                  onClick={() => setActiveTab('repositories')}
                  className="text-xs text-accent hover:text-accent-hover transition-colors"
                >
                  View all repositories →
                </button>
              </div>
            </motion.div>
          )}

          {/* ---- REPOSITORIES ---- */}
          {activeTab === 'repositories' && (
            <motion.div
              key="repos"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Filter bar */}
              <div className="flex items-center gap-2">
                {(['own', 'forked', 'all'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => { setRepoFilter(f); setShowRepoCount(10); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      repoFilter === f
                        ? 'bg-accent/10 text-accent border border-accent/20'
                        : 'bg-surface-2 text-ink-muted hover:text-ink border border-white/[0.06]'
                    }`}
                  >
                    {f === 'own' ? 'Own' : f === 'forked' ? 'Forks' : 'All'}
                  </button>
                ))}
                <span className="ml-auto text-xs text-ink-faint">{filteredRepos.length} repos</span>
              </div>

              {filteredRepos.slice(0, showRepoCount).map((repo, i) => (
                <RepositoryCard key={repo.name} repo={repo} index={i} />
              ))}

              {showRepoCount < filteredRepos.length && (
                <div className="text-center pt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowRepoCount(c => c + 10)}
                  >
                    Load more ({filteredRepos.length - showRepoCount} remaining)
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {/* ---- ANALYTICS ---- */}
          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4"
            >
              <Card padding="md">
                <h3 className="text-xs font-semibold text-ink-muted mb-4">Top Repos by Stars</h3>
                <RepoGrowthGraph repos={repos} />
              </Card>

              <Card padding="md">
                <h3 className="text-xs font-semibold text-ink-muted mb-4">Language Distribution</h3>
                <LanguagePieChart data={languageStats} />
              </Card>

              <Card padding="md" className="lg:col-span-2">
                <h3 className="text-xs font-semibold text-ink-muted mb-4">Commit Trend</h3>
                <CommitTrendGraph data={commitActivity} />
              </Card>

              <Card padding="md" className="lg:col-span-2">
                <h3 className="text-xs font-semibold text-ink-muted mb-4">Contribution Heatmap</h3>
                <ContributionHeatmap data={activityTimeline} />
              </Card>
            </motion.div>
          )}

          {/* ---- INSIGHTS ---- */}
          {activeTab === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <InsightPanel insights={insights} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
