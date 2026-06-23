import axios, { AxiosInstance } from 'axios';
import { GitHubUser, GitHubRepo, GitHubEvent, GitHubCommit } from '../types/index.js';
import { getCached, setCached, buildCacheKey } from '../utils/cache.js';
import { sleep } from '../utils/helpers.js';

const BASE_URL = 'https://api.github.com';

function createGitHubClient(): AxiosInstance {
  return axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GitInsight-App/1.0',
    },
  });
}

const client = createGitHubClient();

async function githubGet<T>(path: string, ttl = 600): Promise<T> {
  const cacheKey = buildCacheKey(['gh', path]);
  const cached = getCached<T>(cacheKey);
  if (cached) return cached;

  await sleep(100); // small delay to avoid hammering

  const response = await client.get<T>(path);
  setCached(cacheKey, response.data, ttl);
  return response.data;
}

export async function fetchUser(username: string): Promise<GitHubUser> {
  return githubGet<GitHubUser>(`/users/${username}`, 1800);
}

export async function fetchRepos(username: string): Promise<GitHubRepo[]> {
  const all: GitHubRepo[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const path = `/users/${username}/repos?per_page=${perPage}&page=${page}&sort=updated`;
    const repos = await githubGet<GitHubRepo[]>(path, 1200);
    all.push(...repos);
    if (repos.length < perPage) break;
    page++;
    if (page > 5) break; // cap at 500 repos
  }

  return all;
}

export async function fetchEvents(username: string): Promise<GitHubEvent[]> {
  const all: GitHubEvent[] = [];
  for (let page = 1; page <= 3; page++) {
    try {
      const events = await githubGet<GitHubEvent[]>(
        `/users/${username}/events/public?per_page=100&page=${page}`,
        900
      );
      all.push(...events);
      if (events.length < 100) break;
    } catch {
      break;
    }
  }
  return all;
}

export async function fetchRecentCommits(
  username: string,
  repoName: string
): Promise<GitHubCommit[]> {
  try {
    return await githubGet<GitHubCommit[]>(
      `/repos/${username}/${repoName}/commits?author=${username}&per_page=30`,
      1800
    );
  } catch {
    return [];
  }
}

export async function checkReadmeExists(username: string, repoName: string): Promise<boolean> {
  const cacheKey = buildCacheKey(['readme', username, repoName]);
  const cached = getCached<boolean>(cacheKey);
  if (cached !== null) return cached;

  try {
    await client.head(`/repos/${username}/${repoName}/readme`);
    setCached(cacheKey, true, 3600);
    return true;
  } catch {
    setCached(cacheKey, false, 3600);
    return false;
  }
}

export async function fetchRepoLanguages(
  username: string,
  repoName: string
): Promise<Record<string, number>> {
  try {
    return await githubGet<Record<string, number>>(
      `/repos/${username}/${repoName}/languages`,
      3600
    );
  } catch {
    return {};
  }
}

export async function fetchCommitActivity(
  username: string,
  repoName: string
): Promise<Array<{ total: number; week: number; days: number[] }>> {
  try {
    return await githubGet(
      `/repos/${username}/${repoName}/stats/commit_activity`,
      3600
    );
  } catch {
    return [];
  }
}

export async function fetchContributors(
  username: string,
  repoName: string
): Promise<Array<{ login: string; contributions: number }>> {
  try {
    return await githubGet(
      `/repos/${username}/${repoName}/contributors?per_page=10`,
      3600
    );
  } catch {
    return [];
  }
}
