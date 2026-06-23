import {
  GitHubUser,
  GitHubRepo,
  GitHubEvent,
  ProfileScore,
  RepoAnalysis,
  LanguageStats,
  DeveloperInsights,
  RecruiterReport,
  ResumePoints,
  CommitActivity,
  ActivityTimelineItem,
} from '../types/index.js';
import {
  daysBetween,
  monthsBetween,
  clamp,
  weightedAverage,
  getMonthName,
  normalize,
  groupBy,
} from '../utils/helpers.js';

// --- Profile Score ---

export function computeProfileScore(
  user: GitHubUser,
  repos: GitHubRepo[],
  events: GitHubEvent[]
): ProfileScore {
  const profileCompleteness = scoreProfileCompleteness(user);
  const codeQuality = scoreCodeQuality(repos);
  const communityEngagement = scoreCommunityEngagement(user, repos);
  const consistency = scoreConsistency(events);
  const diversity = scoreDiversity(repos);
  const openSourceActivity = scoreOpenSourceActivity(repos, events);
  const readmeQuality = scoreReadmeQuality(repos);

  const overall = Math.round(
    weightedAverage([
      { value: profileCompleteness, weight: 10 },
      { value: codeQuality, weight: 25 },
      { value: communityEngagement, weight: 20 },
      { value: consistency, weight: 20 },
      { value: diversity, weight: 10 },
      { value: openSourceActivity, weight: 10 },
      { value: readmeQuality, weight: 5 },
    ])
  );

  return {
    overall: clamp(overall, 0, 100),
    profileCompleteness,
    codeQuality,
    communityEngagement,
    consistency,
    diversity,
    openSourceActivity,
    readmeQuality,
  };
}

function scoreProfileCompleteness(user: GitHubUser): number {
  let score = 0;
  if (user.name) score += 15;
  if (user.bio) score += 20;
  if (user.location) score += 10;
  if (user.email) score += 15;
  if (user.blog) score += 10;
  if (user.company) score += 10;
  if (user.twitter_username) score += 10;
  if (user.public_repos > 0) score += 10;
  return clamp(score, 0, 100);
}

function scoreCodeQuality(repos: GitHubRepo[]): number {
  const ownRepos = repos.filter(r => !r.fork && !r.archived);
  if (ownRepos.length === 0) return 0;

  const hasLicense = ownRepos.filter(r => r.license).length / ownRepos.length;
  const hasTopics = ownRepos.filter(r => r.topics.length > 0).length / ownRepos.length;
  const hasDescription = ownRepos.filter(r => r.description).length / ownRepos.length;
  const avgStars = ownRepos.reduce((s, r) => s + r.stargazers_count, 0) / ownRepos.length;
  const starScore = clamp(normalize(avgStars, 0, 50), 0, 1);
  const repoCountScore = clamp(normalize(ownRepos.length, 0, 30), 0, 1);

  return Math.round(
    weightedAverage([
      { value: hasLicense * 100, weight: 20 },
      { value: hasTopics * 100, weight: 15 },
      { value: hasDescription * 100, weight: 20 },
      { value: starScore * 100, weight: 30 },
      { value: repoCountScore * 100, weight: 15 },
    ])
  );
}

function scoreCommunityEngagement(user: GitHubUser, repos: GitHubRepo[]): number {
  const followerScore = clamp(normalize(user.followers, 0, 500), 0, 1);
  const followingScore = clamp(normalize(user.following, 0, 200), 0, 1);
  const totalForks = repos.reduce((s, r) => s + r.forks_count, 0);
  const forkScore = clamp(normalize(totalForks, 0, 100), 0, 1);
  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
  const starScore = clamp(normalize(totalStars, 0, 500), 0, 1);

  return Math.round(
    weightedAverage([
      { value: followerScore * 100, weight: 40 },
      { value: followingScore * 100, weight: 10 },
      { value: forkScore * 100, weight: 25 },
      { value: starScore * 100, weight: 25 },
    ])
  );
}

function scoreConsistency(events: GitHubEvent[]): number {
  if (events.length === 0) return 10;

  const byWeek = new Map<string, number>();
  events.forEach(e => {
    const d = new Date(e.created_at);
    const week = `${d.getFullYear()}-W${Math.ceil(d.getDate() / 7)}`;
    byWeek.set(week, (byWeek.get(week) ?? 0) + 1);
  });

  const activeWeeks = byWeek.size;
  const weekScore = clamp(normalize(activeWeeks, 0, 20), 0, 1);
  const volumeScore = clamp(normalize(events.length, 0, 300), 0, 1);

  return Math.round(weightedAverage([
    { value: weekScore * 100, weight: 60 },
    { value: volumeScore * 100, weight: 40 },
  ]));
}

function scoreDiversity(repos: GitHubRepo[]): number {
  const languages = new Set(repos.map(r => r.language).filter(Boolean));
  const langScore = clamp(normalize(languages.size, 0, 10), 0, 1);

  const topicSet = new Set(repos.flatMap(r => r.topics));
  const topicScore = clamp(normalize(topicSet.size, 0, 30), 0, 1);

  return Math.round(weightedAverage([
    { value: langScore * 100, weight: 60 },
    { value: topicScore * 100, weight: 40 },
  ]));
}

function scoreOpenSourceActivity(repos: GitHubRepo[], events: GitHubEvent[]): number {
  const ownRepos = repos.filter(r => !r.fork);
  const publicRepoScore = clamp(normalize(ownRepos.length, 0, 30), 0, 1);
  const prEvents = events.filter(e => e.type === 'PullRequestEvent').length;
  const prScore = clamp(normalize(prEvents, 0, 20), 0, 1);
  const issueEvents = events.filter(e => e.type === 'IssuesEvent').length;
  const issueScore = clamp(normalize(issueEvents, 0, 20), 0, 1);

  return Math.round(weightedAverage([
    { value: publicRepoScore * 100, weight: 50 },
    { value: prScore * 100, weight: 30 },
    { value: issueScore * 100, weight: 20 },
  ]));
}

function scoreReadmeQuality(repos: GitHubRepo[]): number {
  const withDescription = repos.filter(r => r.description && r.description.length > 20).length;
  if (repos.length === 0) return 0;
  return Math.round((withDescription / repos.length) * 100);
}

// --- Repo Analysis ---

export function analyzeRepo(repo: GitHubRepo): RepoAnalysis {
  const daysSincePush = daysBetween(repo.pushed_at);
  const isDead = daysSincePush > 365 && repo.stargazers_count < 5;
  const daysSinceCreated = daysBetween(repo.created_at);

  const healthScore = computeRepoHealth(repo, daysSincePush);
  const complexityScore = computeComplexity(repo);
  const documentationScore = computeDocumentation(repo);
  const activityScore = computeActivity(repo, daysSincePush);

  const starToForkRatio = repo.forks_count > 0
    ? repo.stargazers_count / repo.forks_count
    : repo.stargazers_count;

  // underrated: good stars relative to age but low forks (hidden gem)
  const expectedStars = Math.max(1, daysSinceCreated / 30);
  const isUnderrated = repo.stargazers_count < 5 && !repo.fork &&
    repo.size > 100 && complexityScore > 40;

  return {
    name: repo.name,
    fullName: repo.full_name,
    url: repo.html_url,
    description: repo.description ?? '',
    language: repo.language,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    openIssues: repo.open_issues_count,
    size: repo.size,
    createdAt: repo.created_at,
    updatedAt: repo.updated_at,
    pushedAt: repo.pushed_at,
    topics: repo.topics,
    isFork: repo.fork,
    isArchived: repo.archived,
    hasLicense: !!repo.license,
    healthScore,
    complexityScore,
    documentationScore,
    activityScore,
    commitFrequency: estimateCommitFrequency(repo),
    daysSinceLastPush: daysSincePush,
    isDead,
    isUnderrated,
    starToForkRatio,
  };
}

function computeRepoHealth(repo: GitHubRepo, daysSincePush: number): number {
  let score = 50;
  if (repo.stargazers_count > 0) score += Math.min(20, repo.stargazers_count * 2);
  if (repo.forks_count > 0) score += Math.min(10, repo.forks_count);
  if (repo.license) score += 10;
  if (repo.description) score += 5;
  if (repo.topics.length > 0) score += 5;
  if (daysSincePush < 30) score += 10;
  else if (daysSincePush > 365) score -= 20;
  if (repo.archived) score -= 30;
  return clamp(score, 0, 100);
}

function computeComplexity(repo: GitHubRepo): number {
  let score = 0;
  const sizeScore = clamp(normalize(repo.size, 0, 10000), 0, 1);
  score += sizeScore * 40;
  if (repo.topics.length > 3) score += 20;
  if (repo.open_issues_count > 0) score += Math.min(20, repo.open_issues_count * 2);
  if (repo.forks_count > 5) score += 20;
  return clamp(Math.round(score), 0, 100);
}

function computeDocumentation(repo: GitHubRepo): number {
  let score = 0;
  if (repo.description && repo.description.length > 30) score += 30;
  if (repo.description && repo.description.length > 100) score += 10;
  if (repo.license) score += 20;
  if (repo.topics.length > 0) score += 20;
  if (repo.topics.length > 3) score += 10;
  if (repo.homepage) score += 10;
  return clamp(score, 0, 100);
}

function computeActivity(repo: GitHubRepo, daysSincePush: number): number {
  if (daysSincePush < 7) return 100;
  if (daysSincePush < 30) return 80;
  if (daysSincePush < 90) return 60;
  if (daysSincePush < 180) return 40;
  if (daysSincePush < 365) return 20;
  return 5;
}

function estimateCommitFrequency(repo: GitHubRepo): number {
  const days = Math.max(1, daysBetween(repo.created_at));
  const ageMonths = days / 30;
  if (ageMonths < 1) return 10;
  // Rough heuristic based on size and activity
  const baseRate = repo.size / Math.max(1, ageMonths) / 100;
  return clamp(Math.round(baseRate), 0, 50);
}

// --- Developer Insights ---

export function computeInsights(
  user: GitHubUser,
  repos: RepoAnalysis[],
  events: GitHubEvent[],
  languageStats: LanguageStats[]
): DeveloperInsights {
  const ownRepos = repos.filter(r => !r.isFork);
  const activeRepos = ownRepos.filter(r => !r.isDead);
  const deadRepos = ownRepos.filter(r => r.isDead);

  const bestProject = ownRepos.sort((a, b) => b.healthScore - a.healthScore)[0] ?? null;
  const mostUnderratedRepo = ownRepos.find(r => r.isUnderrated) ?? null;

  const techStack = deriveTechStack(repos, languageStats);
  const careerLevel = deriveCareerLevel(user, repos, events);
  const codingPersonality = deriveCodingPersonality(repos, languageStats, events);

  const mostActiveMonth = findMostActiveMonth(events);
  const collaborationScore = computeCollaborationScore(repos, events);
  const projectCompletionScore = computeCompletionScore(ownRepos);
  const innovationScore = computeInnovationScore(repos, languageStats);
  const hiringReadinessScore = computeHiringReadiness(user, repos, events, languageStats);
  const codingConsistency = computeCodingConsistency(events);

  const totalContributions = events.filter(
    e => ['PushEvent', 'PullRequestEvent', 'IssuesEvent', 'CreateEvent'].includes(e.type)
  ).length;

  return {
    topLanguages: languageStats.slice(0, 6),
    techStack,
    codingConsistency,
    collaborationScore,
    projectCompletionScore,
    innovationScore,
    hiringReadinessScore,
    careerLevel,
    codingPersonality,
    mostActiveMonth,
    bestProject,
    mostUnderratedRepo,
    deadRepos,
    streakDays: computeStreakDays(events),
    totalContributions,
  };
}

function deriveTechStack(repos: RepoAnalysis[], langs: LanguageStats[]): string[] {
  const stack: string[] = [];
  const topLangs = langs.slice(0, 4).map(l => l.language);
  stack.push(...topLangs);

  const topics = repos.flatMap(r => r.topics);
  const techTopics = topics.filter(t =>
    ['react', 'vue', 'angular', 'nextjs', 'nodejs', 'django', 'flask', 'fastapi',
     'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'tensorflow', 'pytorch',
     'graphql', 'rest-api', 'mongodb', 'postgresql', 'redis'].includes(t.toLowerCase())
  );

  const uniqueTopics = [...new Set(techTopics)].slice(0, 6);
  stack.push(...uniqueTopics);

  return [...new Set(stack)].slice(0, 10);
}

function deriveCareerLevel(
  user: GitHubUser,
  repos: RepoAnalysis[],
  events: GitHubEvent[]
): 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' {
  const accountAgeMonths = monthsBetween(user.created_at);
  const ownRepos = repos.filter(r => !r.isFork);
  const totalStars = ownRepos.reduce((s, r) => s + r.stars, 0);
  const score = accountAgeMonths * 2 + ownRepos.length * 3 + totalStars * 0.5 + events.length * 0.2;

  if (score < 30) return 'Beginner';
  if (score < 120) return 'Intermediate';
  if (score < 400) return 'Advanced';
  return 'Expert';
}

function deriveCodingPersonality(
  repos: RepoAnalysis[],
  langs: LanguageStats[],
  events: GitHubEvent[]
): string {
  const topLang = langs[0]?.language?.toLowerCase() ?? '';
  const ownRepos = repos.filter(r => !r.isFork);
  const avgSize = ownRepos.reduce((s, r) => s + r.size, 0) / Math.max(1, ownRepos.length);
  const topics = repos.flatMap(r => r.topics).join(' ').toLowerCase();

  if (topics.includes('machine-learning') || topics.includes('ai') || topics.includes('deep-learning')) {
    return 'The Data Scientist';
  }
  if (topics.includes('web') || ['javascript', 'typescript', 'css'].includes(topLang)) {
    return 'The Web Artisan';
  }
  if (['python', 'r'].includes(topLang) && topics.includes('data')) {
    return 'The Analyst';
  }
  if (['go', 'rust', 'c', 'c++'].includes(topLang)) {
    return 'The Systems Architect';
  }
  if (avgSize < 200 && ownRepos.length > 15) return 'The Prolific Experimenter';
  if (avgSize > 5000 && ownRepos.length < 10) return 'The Deep Builder';
  if (events.filter(e => e.type === 'PullRequestReviewEvent').length > 10) return 'The Collaborative Reviewer';
  return 'The Versatile Generalist';
}

function findMostActiveMonth(events: GitHubEvent[]): string {
  if (events.length === 0) return 'N/A';

  const monthCounts: Record<string, number> = {};
  events.forEach(e => {
    const d = new Date(e.created_at);
    const key = `${getMonthName(d.getMonth())} ${d.getFullYear()}`;
    monthCounts[key] = (monthCounts[key] ?? 0) + 1;
  });

  return Object.entries(monthCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ?? 'N/A';
}

function computeCollaborationScore(repos: RepoAnalysis[], events: GitHubEvent[]): number {
  const prEvents = events.filter(e => e.type === 'PullRequestEvent').length;
  const forkEvents = events.filter(e => e.type === 'ForkEvent').length;
  const totalForks = repos.reduce((s, r) => s + r.forks, 0);

  const prScore = clamp(normalize(prEvents, 0, 30), 0, 1);
  const forkReceivedScore = clamp(normalize(totalForks, 0, 50), 0, 1);
  const forkMadeScore = clamp(normalize(forkEvents, 0, 20), 0, 1);

  return Math.round(weightedAverage([
    { value: prScore * 100, weight: 50 },
    { value: forkReceivedScore * 100, weight: 30 },
    { value: forkMadeScore * 100, weight: 20 },
  ]));
}

function computeCompletionScore(repos: RepoAnalysis[]): number {
  if (repos.length === 0) return 0;
  const completed = repos.filter(r =>
    r.hasLicense && r.description.length > 20 && r.daysSinceLastPush < 365
  ).length;
  return Math.round((completed / repos.length) * 100);
}

function computeInnovationScore(repos: RepoAnalysis[], langs: LanguageStats[]): number {
  const langDiversity = clamp(normalize(langs.length, 0, 10), 0, 1);
  const topicDiversity = clamp(
    normalize(new Set(repos.flatMap(r => r.topics)).size, 0, 30),
    0, 1
  );
  const avgStars = repos.reduce((s, r) => s + r.stars, 0) / Math.max(1, repos.length);
  const starScore = clamp(normalize(avgStars, 0, 20), 0, 1);

  return Math.round(weightedAverage([
    { value: langDiversity * 100, weight: 30 },
    { value: topicDiversity * 100, weight: 40 },
    { value: starScore * 100, weight: 30 },
  ]));
}

function computeHiringReadiness(
  user: GitHubUser,
  repos: RepoAnalysis[],
  events: GitHubEvent[],
  langs: LanguageStats[]
): number {
  const profileFill = scoreProfileCompletenessRaw(user);
  const repoQuality = repos.filter(r => !r.isFork && r.healthScore > 60).length;
  const repoScore = clamp(normalize(repoQuality, 0, 10), 0, 1);
  const activity = clamp(normalize(events.length, 0, 200), 0, 1);
  const langScore = clamp(normalize(langs.length, 0, 5), 0, 1);
  const communityScore = clamp(normalize(user.followers, 0, 100), 0, 1);

  return Math.round(weightedAverage([
    { value: profileFill, weight: 20 },
    { value: repoScore * 100, weight: 30 },
    { value: activity * 100, weight: 20 },
    { value: langScore * 100, weight: 15 },
    { value: communityScore * 100, weight: 15 },
  ]));
}

function scoreProfileCompletenessRaw(user: GitHubUser): number {
  let score = 0;
  if (user.name) score += 20;
  if (user.bio) score += 25;
  if (user.location) score += 15;
  if (user.email) score += 20;
  if (user.blog) score += 10;
  if (user.twitter_username) score += 10;
  return score;
}

function computeCodingConsistency(events: GitHubEvent[]): number {
  if (events.length === 0) return 0;
  const byDay = new Set(events.map(e => e.created_at.slice(0, 10)));
  return clamp(Math.round(normalize(byDay.size, 0, 90) * 100), 0, 100);
}

function computeStreakDays(events: GitHubEvent[]): number {
  if (events.length === 0) return 0;

  const pushDays = [...new Set(
    events
      .filter(e => e.type === 'PushEvent')
      .map(e => e.created_at.slice(0, 10))
  )].sort().reverse();

  if (pushDays.length === 0) return 0;

  let streak = 1;
  for (let i = 0; i < pushDays.length - 1; i++) {
    const diff = daysBetween(pushDays[i + 1], pushDays[i]);
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

// --- Language Stats ---

export function computeLanguageStats(repos: GitHubRepo[]): LanguageStats[] {
  const counts: Record<string, number> = {};
  repos.filter(r => !r.fork && r.language).forEach(r => {
    counts[r.language!] = (counts[r.language!] ?? 0) + 1;
  });

  const total = Object.values(counts).reduce((s, c) => s + c, 0);
  if (total === 0) return [];

  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .map(([language, count]) => ({
      language,
      count,
      percentage: Math.round((count / total) * 100),
    }));
}

// --- Commit Activity ---

export function computeCommitActivity(events: GitHubEvent[]): CommitActivity[] {
  const pushEvents = events.filter(e => e.type === 'PushEvent');
  const byMonth: Record<string, number> = {};

  pushEvents.forEach(e => {
    const d = new Date(e.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    byMonth[key] = (byMonth[key] ?? 0) + ((e.payload as { size?: number })?.size ?? 1);
  });

  return Object.entries(byMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, commits]) => {
      const [year, month] = key.split('-');
      return {
        week: key,
        commits,
        month: getMonthName(parseInt(month) - 1),
        year: parseInt(year),
      };
    });
}

// --- Activity Timeline ---

export function computeActivityTimeline(events: GitHubEvent[]): ActivityTimelineItem[] {
  const grouped = groupBy(
    events.slice(0, 200),
    'type' as keyof GitHubEvent
  );

  const items: ActivityTimelineItem[] = [];
  events.slice(0, 50).forEach(e => {
    items.push({
      date: e.created_at,
      type: e.type,
      repo: e.repo?.name ?? '',
      count: 1,
    });
  });

  return items;
}

// --- Recruiter Report ---

export function computeRecruiterReport(
  user: GitHubUser,
  repos: RepoAnalysis[],
  insights: DeveloperInsights,
  profileScore: ProfileScore
): RecruiterReport {
  const ownRepos = repos.filter(r => !r.isFork);
  const totalStars = ownRepos.reduce((s, r) => s + r.stars, 0);
  const topLangs = insights.topLanguages.slice(0, 3).map(l => l.language);

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const interviewFocusAreas: string[] = [];
  const riskAnalysis: string[] = [];

  // Strengths
  if (user.followers > 50) strengths.push(`Strong community presence with ${user.followers} followers`);
  if (totalStars > 50) strengths.push(`Proven impact — ${totalStars} total stars across projects`);
  if (insights.careerLevel === 'Advanced' || insights.careerLevel === 'Expert') {
    strengths.push(`${insights.careerLevel}-level developer with deep portfolio`);
  }
  if (topLangs.length > 0) strengths.push(`Proficient in ${topLangs.join(', ')}`);
  if (profileScore.consistency > 70) strengths.push('Demonstrates consistent coding habits');
  if (insights.collaborationScore > 60) strengths.push('Strong open-source collaboration history');
  if (ownRepos.filter(r => r.hasLicense).length > 3) strengths.push('Understands open-source licensing');
  if (strengths.length === 0) strengths.push('Active GitHub presence with public repositories');

  // Weaknesses
  if (!user.bio) weaknesses.push('Profile lacks bio — makes it harder to assess communication skills');
  if (profileScore.consistency < 40) weaknesses.push('Inconsistent coding activity — gaps in contribution history');
  if (insights.deadRepos.length > 5) weaknesses.push(`${insights.deadRepos.length} abandoned repositories suggest difficulty completing long-term projects`);
  if (totalStars < 5 && ownRepos.length > 5) weaknesses.push('Limited community validation (few stars on projects)');
  if (topLangs.length < 2) weaknesses.push('Limited language diversity — may struggle with polyglot environments');
  if (weaknesses.length === 0) weaknesses.push('Minor: Profile could benefit from more detailed project descriptions');

  // Interview Focus
  if (topLangs[0]) interviewFocusAreas.push(`${topLangs[0]} depth — core language assessment`);
  interviewFocusAreas.push('System design and architecture decisions');
  if (insights.collaborationScore > 50) interviewFocusAreas.push('Open-source contribution workflow and PR practices');
  interviewFocusAreas.push('Code review and documentation standards');
  if (insights.bestProject) {
    interviewFocusAreas.push(`Deep dive into "${insights.bestProject.name}" — their most polished project`);
  }

  // Risk
  if (insights.deadRepos.length > ownRepos.length * 0.5) {
    riskAnalysis.push('High project abandonment rate — may struggle with long-term commitment');
  }
  if (profileScore.consistency < 30) {
    riskAnalysis.push('Sporadic activity patterns — may not thrive in deadline-driven environments');
  }
  if (!user.email && !user.blog) {
    riskAnalysis.push('Limited contact information — hard to establish professional credibility');
  }
  if (riskAnalysis.length === 0) riskAnalysis.push('Low risk profile — consistent and engaged developer');

  const hiringScore = insights.hiringReadinessScore;
  const hiringVerdict = hiringScore > 75
    ? 'Strong hire — high signal, consistent output, strong community presence'
    : hiringScore > 50
    ? 'Promising candidate — solid foundation, recommend technical screen'
    : hiringScore > 30
    ? 'Conditional — shows potential, needs further evaluation'
    : 'Low signal — limited public evidence of technical ability';

  const salaryRange = insights.careerLevel === 'Expert'
    ? '$120k – $200k+'
    : insights.careerLevel === 'Advanced'
    ? '$90k – $140k'
    : insights.careerLevel === 'Intermediate'
    ? '$60k – $95k'
    : '$40k – $65k';

  return { strengths, weaknesses, interviewFocusAreas, riskAnalysis, hiringVerdict, salaryRange };
}

// --- Resume Points ---

export function computeResumePoints(
  user: GitHubUser,
  repos: RepoAnalysis[],
  insights: DeveloperInsights
): ResumePoints {
  const ownRepos = repos.filter(r => !r.isFork);
  const topLangs = insights.topLanguages.slice(0, 5).map(l => l.language);
  const totalStars = ownRepos.reduce((s, r) => s + r.stars, 0);
  const accountYears = Math.round(monthsBetween(user.created_at) / 12 * 10) / 10;

  const summary = `${insights.careerLevel} software developer with ${accountYears} years of GitHub activity. ` +
    `Proficient in ${topLangs.slice(0, 3).join(', ')} with ${ownRepos.length} public projects ` +
    `and ${totalStars} stars earned from the developer community.`;

  const skills = [
    ...topLangs,
    ...insights.techStack.filter(t => !topLangs.includes(t)),
  ].slice(0, 12);

  const achievements: string[] = [];
  if (totalStars > 10) {
    achievements.push(`Earned ${totalStars}+ GitHub stars across ${ownRepos.length} open-source projects`);
  }
  if (user.followers > 10) {
    achievements.push(`Built a community of ${user.followers}+ GitHub followers`);
  }
  if (insights.collaborationScore > 50) {
    achievements.push('Active open-source contributor with cross-team collaboration experience');
  }
  if (insights.codingConsistency > 60) {
    achievements.push(`Maintained consistent coding activity over ${accountYears} years`);
  }

  const projectHighlights = ownRepos
    .filter(r => r.healthScore > 50)
    .slice(0, 4)
    .map(r => {
      const lang = r.language ? ` (${r.language})` : '';
      const stars = r.stars > 0 ? ` — ${r.stars} ⭐` : '';
      return `${r.name}${lang}: ${r.description || 'Open-source project'}${stars}`;
    });

  const openSourceContributions: string[] = [];
  if (ownRepos.some(r => r.hasLicense)) {
    openSourceContributions.push('Published open-source libraries under recognized licenses');
  }
  if (insights.collaborationScore > 40) {
    openSourceContributions.push('Contributed to collaborative projects via pull requests and code reviews');
  }

  return { summary, skills, achievements, projectHighlights, openSourceContributions };
}
