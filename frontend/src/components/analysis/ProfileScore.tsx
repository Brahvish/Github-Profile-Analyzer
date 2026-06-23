import { motion } from 'framer-motion';
import {
  MapPin, Link2, Twitter, Building2, Calendar, Users, GitBranch,
  Star, ExternalLink,
} from 'lucide-react';
import { GitHubUser, ProfileScore as ProfileScoreType, DeveloperInsights } from '@/types';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { accountAgeYears, careerLevelColor, formatNumber } from '@/utils';

interface ProfileScoreProps {
  user: GitHubUser;
  score: ProfileScoreType;
  insights: DeveloperInsights;
}

const scoreDimensions: Array<{
  key: keyof ProfileScoreType;
  label: string;
}> = [
  { key: 'profileCompleteness', label: 'Profile' },
  { key: 'codeQuality', label: 'Code Quality' },
  { key: 'communityEngagement', label: 'Community' },
  { key: 'consistency', label: 'Consistency' },
  { key: 'diversity', label: 'Diversity' },
  { key: 'openSourceActivity', label: 'Open Source' },
];

export function ProfileScore({ user, score, insights }: ProfileScoreProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Main profile card */}
      <Card padding="lg" className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row gap-6 items-start">
          {/* Avatar */}
          <div className="relative shrink-0">
            <img
              src={user.avatar_url}
              alt={user.login}
              className="w-20 h-20 rounded-2xl ring-2 ring-white/10 object-cover"
              loading="lazy"
            />
            <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-lg bg-white/[0.04] backdrop-blur-md border border-white/[0.06] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start gap-3 mb-2">
              <div>
                <h1 className="text-xl font-semibold text-ink leading-tight">
                  {user.name || user.login}
                </h1>
                <a
                  href={user.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-ink-muted hover:text-accent transition-colors flex items-center gap-1 mt-0.5"
                >
                  @{user.login}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <Badge
                variant="accent"
                className={`ml-auto sm:ml-0 ${careerLevelColor(insights.careerLevel)}`}
              >
                {insights.careerLevel}
              </Badge>
            </div>

            {user.bio && (
              <p className="text-sm text-ink-muted leading-relaxed mb-3 max-w-xl">{user.bio}</p>
            )}

            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-ink-muted">
              {user.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" /> {user.location}
                </span>
              )}
              {user.company && (
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3 h-3" /> {user.company}
                </span>
              )}
              {user.blog && (
                <a
                  href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-accent transition-colors"
                >
                  <Link2 className="w-3 h-3" /> {user.blog.replace(/^https?:\/\//, '')}
                </a>
              )}
              {user.twitter_username && (
                <a
                  href={`https://twitter.com/${user.twitter_username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-accent transition-colors"
                >
                  <Twitter className="w-3 h-3" /> @{user.twitter_username}
                </a>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3" /> {accountAgeYears(user.created_at)} on GitHub
              </span>
            </div>

            {/* Stats row */}
            <div className="flex gap-5 mt-4 pt-4 border-t border-white/[0.06]">
              <div>
                <div className="text-base font-semibold text-ink">{formatNumber(user.followers)}</div>
                <div className="text-xs text-ink-faint flex items-center gap-1"><Users className="w-3 h-3" />Followers</div>
              </div>
              <div>
                <div className="text-base font-semibold text-ink">{formatNumber(user.following)}</div>
                <div className="text-xs text-ink-faint">Following</div>
              </div>
              <div>
                <div className="text-base font-semibold text-ink">{user.public_repos}</div>
                <div className="text-xs text-ink-faint flex items-center gap-1"><GitBranch className="w-3 h-3" />Repos</div>
              </div>
              <div>
                <div className="text-base font-semibold text-ink">{insights.streakDays}</div>
                <div className="text-xs text-ink-faint">🔥 Streak</div>
              </div>
            </div>
          </div>

          {/* Overall score */}
          <div className="shrink-0">
            <ScoreRing
              score={score.overall}
              size={100}
              strokeWidth={8}
              label="Overall"
              sublabel="Score"
            />
          </div>
        </div>
      </Card>

      {/* Score breakdown */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {scoreDimensions.map(({ key, label }) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card padding="sm" className="flex flex-col items-center text-center">
              <ScoreRing score={score[key] as number} size={52} strokeWidth={5} />
              <span className="text-xs text-ink-faint mt-2 leading-tight">{label}</span>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
