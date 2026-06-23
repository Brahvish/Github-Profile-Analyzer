import { motion } from 'framer-motion';
import { Star, GitFork, AlertCircle, Clock, ExternalLink, Bookmark, BookmarkCheck, Shield, Zap, FileText } from 'lucide-react';
import { RepoAnalysis } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { useStore } from '@/store/useStore';
import { getLanguageColor } from '@/services/api';
import { timeAgo, scoreBg } from '@/utils';

interface RepositoryCardProps {
  repo: RepoAnalysis;
  index?: number;
  compact?: boolean;
}

export function RepositoryCard({ repo, index = 0, compact = false }: RepositoryCardProps) {
  const { bookmarkedRepos, toggleBookmark } = useStore();
  const isBookmarked = bookmarkedRepos.includes(repo.fullName);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card hover padding={compact ? 'sm' : 'md'} className="group">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Repo name + badges */}
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-ink hover:text-accent transition-colors flex items-center gap-1.5 group/link"
              >
                {repo.name}
                <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
              </a>
              {repo.isFork && <Badge variant="outline">Fork</Badge>}
              {repo.isArchived && <Badge variant="default">Archived</Badge>}
              {repo.isDead && <Badge variant="warning">Dormant</Badge>}
              {repo.isUnderrated && <Badge variant="accent">Hidden Gem</Badge>}
            </div>

            {/* Description */}
            {repo.description && (
              <p className="text-xs text-ink-muted leading-relaxed mb-2.5 line-clamp-2">
                {repo.description}
              </p>
            )}

            {/* Topics */}
            {!compact && repo.topics.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {repo.topics.slice(0, 4).map(topic => (
                  <span
                    key={topic}
                    className="text-xs px-2 py-0.5 rounded-md bg-accent/8 text-accent/80"
                  >
                    {topic}
                  </span>
                ))}
                {repo.topics.length > 4 && (
                  <span className="text-xs text-ink-faint">+{repo.topics.length - 4}</span>
                )}
              </div>
            )}

            {/* Stats row */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-ink-muted">
              {repo.language && (
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: getLanguageColor(repo.language) }}
                  />
                  {repo.language}
                </span>
              )}
              {repo.stars > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400" />
                  {repo.stars}
                </span>
              )}
              {repo.forks > 0 && (
                <span className="flex items-center gap-1">
                  <GitFork className="w-3 h-3" />
                  {repo.forks}
                </span>
              )}
              {repo.openIssues > 0 && (
                <span className="flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {repo.openIssues}
                </span>
              )}
              <span className="flex items-center gap-1 ml-auto">
                <Clock className="w-3 h-3" />
                {timeAgo(repo.pushedAt)}
              </span>
            </div>
          </div>

          {/* Right side: scores + bookmark */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            <button
              onClick={() => toggleBookmark(repo.fullName)}
              className="text-ink-faint hover:text-accent transition-colors"
              aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
            >
              {isBookmarked
                ? <BookmarkCheck className="w-4 h-4 text-accent" />
                : <Bookmark className="w-4 h-4" />
              }
            </button>

            {!compact && (
              <div className="flex flex-col gap-1.5 items-end">
                <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${scoreBg(repo.healthScore)}`}>
                  Health {repo.healthScore}
                </span>
                <div className="flex gap-1.5">
                  {repo.hasLicense && (
                    <span title="Has license"><Shield className="w-3.5 h-3.5 text-emerald-400" /></span>
                  )}
                  {repo.complexityScore > 60 && (
                    <span title="Complex project"><Zap className="w-3.5 h-3.5 text-amber-400" /></span>
                  )}
                  {repo.documentationScore > 60 && (
                    <span title="Well documented"><FileText className="w-3.5 h-3.5 text-sky-400" /></span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
