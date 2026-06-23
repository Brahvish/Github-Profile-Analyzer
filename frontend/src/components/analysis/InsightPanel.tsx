import { motion } from 'framer-motion';
import {
  TrendingUp, Users, CheckSquare, Lightbulb, Briefcase, Brain,
  Calendar, Trophy, Eye, Skull, Star,
} from 'lucide-react';
import { DeveloperInsights } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { careerLevelColor } from '@/utils';

interface InsightPanelProps {
  insights: DeveloperInsights;
}

const insightMetrics = [
  { key: 'codingConsistency', label: 'Consistency', icon: TrendingUp },
  { key: 'collaborationScore', label: 'Collaboration', icon: Users },
  { key: 'projectCompletionScore', label: 'Completion', icon: CheckSquare },
  { key: 'innovationScore', label: 'Innovation', icon: Lightbulb },
  { key: 'hiringReadinessScore', label: 'Hiring Ready', icon: Briefcase },
] as const;

export function InsightPanel({ insights }: InsightPanelProps) {
  return (
    <div className="space-y-4">
      {/* Metrics grid */}
      <div className="grid grid-cols-5 gap-3">
        {insightMetrics.map(({ key, label, icon: Icon }) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card padding="sm" className="flex flex-col items-center text-center gap-2">
              <Icon className="w-4 h-4 text-ink-muted" />
              <ScoreRing score={insights[key]} size={52} strokeWidth={5} />
              <span className="text-xs text-ink-faint leading-tight">{label}</span>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Personality + Career Level */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card padding="md">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
              <Brain className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-xs text-ink-faint mb-1">Coding Personality</p>
              <p className="text-sm font-semibold text-ink">{insights.codingPersonality}</p>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/10 flex items-center justify-center shrink-0">
              <Trophy className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-ink-faint mb-1">Career Level</p>
              <p className={`text-sm font-semibold ${careerLevelColor(insights.careerLevel)}`}>
                {insights.careerLevel}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-400/10 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-ink-faint mb-1">Most Active Month</p>
              <p className="text-sm font-semibold text-ink">{insights.mostActiveMonth}</p>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-400/10 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <p className="text-xs text-ink-faint mb-1">Total Contributions</p>
              <p className="text-sm font-semibold text-ink">{insights.totalContributions}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Special detectors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {insights.bestProject && (
          <Card padding="md" variant="bordered">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-medium text-ink-muted">Best Project</span>
            </div>
            <p className="text-sm font-semibold text-ink">{insights.bestProject.name}</p>
            {insights.bestProject.language && (
              <p className="text-xs text-ink-faint mt-0.5">{insights.bestProject.language}</p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="warning">Health {insights.bestProject.healthScore}</Badge>
            </div>
          </Card>
        )}

        {insights.mostUnderratedRepo && (
          <Card padding="md" variant="bordered">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-accent" />
              <span className="text-xs font-medium text-ink-muted">Hidden Gem</span>
            </div>
            <p className="text-sm font-semibold text-ink">{insights.mostUnderratedRepo.name}</p>
            {insights.mostUnderratedRepo.language && (
              <p className="text-xs text-ink-faint mt-0.5">{insights.mostUnderratedRepo.language}</p>
            )}
            <p className="text-xs text-ink-faint mt-1.5">Deserves more attention</p>
          </Card>
        )}

        {insights.deadRepos.length > 0 && (
          <Card padding="md">
            <div className="flex items-center gap-2 mb-2">
              <Skull className="w-4 h-4 text-ink-faint" />
              <span className="text-xs font-medium text-ink-muted">Dormant Repos</span>
            </div>
            <p className="text-2xl font-bold text-ink-muted">{insights.deadRepos.length}</p>
            <p className="text-xs text-ink-faint mt-1">Inactive for 1+ year</p>
          </Card>
        )}
      </div>

      {/* Tech stack */}
      {insights.techStack.length > 0 && (
        <Card padding="md">
          <p className="text-xs font-medium text-ink-muted mb-3">Preferred Tech Stack</p>
          <div className="flex flex-wrap gap-2">
            {insights.techStack.map(tech => (
              <Badge key={tech} variant="outline">{tech}</Badge>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
