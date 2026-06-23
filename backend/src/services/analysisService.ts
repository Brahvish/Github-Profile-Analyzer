import {
  fetchUser,
  fetchRepos,
  fetchEvents,
} from './githubService.js';
import {
  computeProfileScore,
  analyzeRepo,
  computeInsights,
  computeLanguageStats,
  computeCommitActivity,
  computeActivityTimeline,
  computeRecruiterReport,
  computeResumePoints,
} from './scoringService.js';
import { getCached, setCached, buildCacheKey } from '../utils/cache.js';
import { FullAnalysis } from '../types/index.js';

export async function analyzeProfile(username: string): Promise<FullAnalysis> {
  const cacheKey = buildCacheKey(['analysis', username]);
  const cached = getCached<FullAnalysis>(cacheKey);
  if (cached) return cached;

  // Fetch raw data in parallel where possible
  const [user, rawRepos, events] = await Promise.all([
    fetchUser(username),
    fetchRepos(username),
    fetchEvents(username),
  ]);

  // Analyze each repo
  const repos = rawRepos.map(analyzeRepo);

  // Compute language statistics
  const languageStats = computeLanguageStats(rawRepos);

  // Compute profile score
  const profileScore = computeProfileScore(user, rawRepos, events);

  // Compute developer insights
  const insights = computeInsights(user, repos, events, languageStats);

  // Compute commit activity from events
  const commitActivity = computeCommitActivity(events);

  // Compute activity timeline
  const activityTimeline = computeActivityTimeline(events);

  // Compute recruiter report
  const recruiterReport = computeRecruiterReport(user, repos, insights, profileScore);

  // Compute resume points
  const resumePoints = computeResumePoints(user, repos, insights);

  const now = new Date();
  const cachedUntil = new Date(now.getTime() + 10 * 60 * 1000).toISOString();

  const result: FullAnalysis = {
    user,
    repos: repos.sort((a, b) => b.healthScore - a.healthScore),
    profileScore,
    insights,
    recruiterReport,
    resumePoints,
    activityTimeline,
    commitActivity,
    languageStats,
    analyzedAt: now.toISOString(),
    cachedUntil,
  };

  // Cache for 10 minutes
  setCached(cacheKey, result, 600);

  return result;
}

export async function compareProfiles(
  username1: string,
  username2: string
): Promise<{ profile1: FullAnalysis; profile2: FullAnalysis }> {
  const [profile1, profile2] = await Promise.all([
    analyzeProfile(username1),
    analyzeProfile(username2),
  ]);
  return { profile1, profile2 };
}
