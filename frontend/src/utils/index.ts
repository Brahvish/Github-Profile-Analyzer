import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export function accountAgeYears(createdAt: string): string {
  const months = Math.round(
    (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24 * 30)
  );
  if (months < 12) return `${months} months`;
  const years = (months / 12).toFixed(1);
  return `${years} years`;
}

export function scoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-400';
  if (score >= 60) return 'text-accent';
  if (score >= 40) return 'text-amber-400';
  return 'text-rose-400';
}

export function scoreGradient(score: number): string {
  if (score >= 80) return 'from-emerald-500 to-emerald-400';
  if (score >= 60) return 'from-accent to-sky-400';
  if (score >= 40) return 'from-amber-500 to-amber-400';
  return 'from-rose-500 to-rose-400';
}

export function scoreBg(score: number): string {
  if (score >= 80) return 'bg-emerald-400/10 text-emerald-400';
  if (score >= 60) return 'bg-accent/10 text-accent';
  if (score >= 40) return 'bg-amber-400/10 text-amber-400';
  return 'bg-rose-400/10 text-rose-400';
}

export function careerLevelColor(level: string): string {
  switch (level) {
    case 'Expert': return 'text-amber-400';
    case 'Advanced': return 'text-accent';
    case 'Intermediate': return 'text-emerald-400';
    default: return 'text-ink-muted';
  }
}

export function eventTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    PushEvent: 'Pushed commits',
    PullRequestEvent: 'Opened pull request',
    IssuesEvent: 'Filed issue',
    CreateEvent: 'Created repository',
    ForkEvent: 'Forked repository',
    WatchEvent: 'Starred repository',
    DeleteEvent: 'Deleted branch',
    ReleaseEvent: 'Published release',
    PullRequestReviewEvent: 'Reviewed PR',
    IssueCommentEvent: 'Commented on issue',
  };
  return labels[type] ?? type.replace('Event', '');
}

export function downloadJSON(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function generateShareUrl(username: string): string {
  return `${window.location.origin}/report/${username}`;
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export const TRENDING_DEVELOPERS = [
  'torvalds',
  'gaearon',
  'yyx990803',
  'sindresorhus',
  'addyosmani',
  'tj',
  'mrdoob',
  'paulirish',
  'nicolo-ribaudo',
  'antfu',
];
