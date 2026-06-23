import axios from 'axios';
import { FullAnalysis, CompareResult } from '@/types';

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 45000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  response => response.data,
  error => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';
    const code = error.response?.data?.code || 'UNKNOWN_ERROR';
    throw Object.assign(new Error(message), { code, status: error.response?.status });
  }
);

export async function analyzeUser(username: string): Promise<FullAnalysis> {
  const res = await api.get<never, { success: boolean; data: FullAnalysis }>(
    `/analyze/${username}`
  );
  return res.data;
}

export async function compareUsers(
  username1: string,
  username2: string
): Promise<CompareResult> {
  const res = await api.get<never, { success: boolean; data: CompareResult }>(
    `/compare/${username1}/${username2}`
  );
  return res.data;
}

export async function quickLookup(
  username: string
): Promise<{ login: string; name: string | null; avatar_url: string }> {
  const res = await api.get(`/user/${username}`);
  return (res as { data: { login: string; name: string | null; avatar_url: string } }).data;
}

export const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#F7DF1E',
  TypeScript: '#3178C6',
  Python: '#3776AB',
  Java: '#007396',
  'C++': '#00599C',
  C: '#A8B9CC',
  'C#': '#239120',
  Go: '#00ADD8',
  Rust: '#CE422B',
  Ruby: '#CC342D',
  PHP: '#777BB4',
  Swift: '#FA7343',
  Kotlin: '#7F52FF',
  Dart: '#0175C2',
  Scala: '#DC322F',
  Shell: '#89E051',
  HTML: '#E34F26',
  CSS: '#1572B6',
  Vue: '#4FC08D',
  Svelte: '#FF3E00',
  R: '#276DC3',
  MATLAB: '#0076A8',
  Lua: '#000080',
  Haskell: '#5E5086',
  Elixir: '#6E4A7E',
  Clojure: '#5881D8',
  Julia: '#9558B2',
  Jupyter: '#DA5B0B',
};

export function getLanguageColor(lang: string): string {
  return LANGUAGE_COLORS[lang] ?? '#6C63FF';
}
