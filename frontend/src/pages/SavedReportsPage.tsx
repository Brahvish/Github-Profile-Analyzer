import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Trash2, ExternalLink, Download, Clock } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { downloadJSON, formatDate, careerLevelColor } from '@/utils';
import { AnimatedSection } from '@/components/ui/AnimatedSection';

export function SavedReportsPage() {
  const { savedReports, deleteReport, setCurrentAnalysis } = useStore();
  const navigate = useNavigate();

  const handleView = (username: string) => {
    const report = savedReports.find(r => r.username === username);
    if (report) {
      setCurrentAnalysis(report.analysis);
      navigate(`/report/${username}`);
    }
  };

  const handleExport = (username: string) => {
    const report = savedReports.find(r => r.username === username);
    if (report) downloadJSON(report.analysis, `gitinsight-${username}.json`);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 relative overflow-hidden bg-[#080A0F]">
      {/* Background orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-[#634FFF]/8 blur-[120px] pointer-events-none animate-orb-1 z-0" />
      <div className="absolute bottom-[10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#38BDF8]/6 blur-[110px] pointer-events-none animate-orb-2 z-0" />

      <div className="max-w-3xl mx-auto relative z-10">
        <AnimatedSection>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 font-heading tracking-tight">Saved Reports</h1>
            <p className="text-sm text-[#94A3B8]">
              {savedReports.length} report{savedReports.length !== 1 ? 's' : ''} saved locally
            </p>
          </div>
        </AnimatedSection>

        {savedReports.length === 0 ? (
          <AnimatedSection delay={50}>
            <div className="text-center py-24">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
                <Bookmark className="w-6 h-6 text-slate-500" />
              </div>
              <p className="text-sm text-slate-400 font-medium mb-1">No saved reports yet</p>
              <p className="text-xs text-slate-500 mb-6">
                Analyze a profile and click "Save" to keep it here
              </p>
              <Button variant="outline" className="rounded-[10px]" onClick={() => navigate('/analyze')}>
                Analyze a profile
              </Button>
            </div>
          </AnimatedSection>
        ) : (
          <div className="space-y-3">
            {savedReports.map((report, i) => {
              const { user, profileScore, insights } = report.analysis;
              const totalStars = report.analysis.repos.reduce((s, r) => s + r.stars, 0);

              return (
                <AnimatedSection key={report.username} delay={i * 50}>
                  <Card padding="md" hover className="bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04]">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <img
                          src={user.avatar_url}
                          alt={user.login}
                          className="w-12 h-12 rounded-xl object-cover"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <p className="text-sm font-semibold text-white">
                              {user.name || user.login}
                            </p>
                            <Badge variant="outline" className="text-[10px]">@{user.login}</Badge>
                            <Badge
                              size="sm"
                              className={`text-[10px] uppercase font-bold tracking-wider ${careerLevelColor(insights.careerLevel)}`}
                            >
                              {insights.careerLevel}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                            <span>{user.public_repos} repos</span>
                            <span>⭐ {totalStars} stars</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Saved {formatDate(report.savedAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 self-end sm:self-auto shrink-0 mt-3 sm:mt-0">
                        <div className="shrink-0">
                          <ScoreRing score={profileScore.overall} size={48} strokeWidth={4} />
                        </div>

                        <div className="flex gap-1.5 shrink-0">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleView(report.username)}
                            iconLeft={<ExternalLink className="w-3.5 h-3.5" />}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleExport(report.username)}
                            iconLeft={<Download className="w-3.5 h-3.5" />}
                          />
                          <Button
                            size="sm"
                            variant="danger"
                            className="bg-rose-500/5 border border-rose-500/15 hover:bg-rose-500/15"
                            onClick={() => deleteReport(report.username)}
                            iconLeft={<Trash2 className="w-3.5 h-3.5" />}
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                </AnimatedSection>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
