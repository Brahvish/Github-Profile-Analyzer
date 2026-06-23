export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  size: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  topics: string[];
  fork: boolean;
  archived: boolean;
  disabled: boolean;
  visibility: string;
  license: { name: string } | null;
  has_readme?: boolean;
  default_branch: string;
  homepage: string | null;
}

export interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
}

export interface GitHubEvent {
  id: string;
  type: string;
  created_at: string;
  repo: { name: string };
  payload: Record<string, unknown>;
}

export interface RepoAnalysis {
  name: string;
  fullName: string;
  url: string;
  description: string;
  language: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  size: number;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  topics: string[];
  isFork: boolean;
  isArchived: boolean;
  hasLicense: boolean;
  healthScore: number;
  complexityScore: number;
  documentationScore: number;
  activityScore: number;
  commitFrequency: number;
  daysSinceLastPush: number;
  isDead: boolean;
  isUnderrated: boolean;
  starToForkRatio: number;
}

export interface LanguageStats {
  language: string;
  count: number;
  percentage: number;
  bytes?: number;
}

export interface CommitActivity {
  week: string;
  commits: number;
  month: string;
  year: number;
}

export interface ProfileScore {
  overall: number;
  profileCompleteness: number;
  codeQuality: number;
  communityEngagement: number;
  consistency: number;
  diversity: number;
  openSourceActivity: number;
  readmeQuality: number;
}

export interface DeveloperInsights {
  topLanguages: LanguageStats[];
  techStack: string[];
  codingConsistency: number;
  collaborationScore: number;
  projectCompletionScore: number;
  innovationScore: number;
  hiringReadinessScore: number;
  careerLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  codingPersonality: string;
  mostActiveMonth: string;
  bestProject: RepoAnalysis | null;
  mostUnderratedRepo: RepoAnalysis | null;
  deadRepos: RepoAnalysis[];
  streakDays: number;
  totalContributions: number;
}

export interface RecruiterReport {
  strengths: string[];
  weaknesses: string[];
  interviewFocusAreas: string[];
  riskAnalysis: string[];
  hiringVerdict: string;
  salaryRange: string;
}

export interface ResumePoints {
  summary: string;
  skills: string[];
  achievements: string[];
  projectHighlights: string[];
  openSourceContributions: string[];
}

export interface ActivityTimelineItem {
  date: string;
  type: string;
  repo: string;
  count: number;
}

export interface FullAnalysis {
  user: GitHubUser;
  repos: RepoAnalysis[];
  profileScore: ProfileScore;
  insights: DeveloperInsights;
  recruiterReport: RecruiterReport;
  resumePoints: ResumePoints;
  activityTimeline: ActivityTimelineItem[];
  commitActivity: CommitActivity[];
  languageStats: LanguageStats[];
  analyzedAt: string;
  cachedUntil: string;
}

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
}

export interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}
