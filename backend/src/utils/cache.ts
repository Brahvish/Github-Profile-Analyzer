import NodeCache from 'node-cache';

const cache = new NodeCache({
  stdTTL: 600, // 10 minutes default
  checkperiod: 120,
  useClones: false,
});

export function getCached<T>(key: string): T | null {
  const value = cache.get<T>(key);
  return value !== undefined ? value : null;
}

export function setCached<T>(key: string, data: T, ttlSeconds = 600): void {
  cache.set(key, data, ttlSeconds);
}

export function deleteCached(key: string): void {
  cache.del(key);
}

export function clearCache(): void {
  cache.flushAll();
}

export function getCacheStats() {
  return cache.getStats();
}

export function buildCacheKey(parts: string[]): string {
  return parts.join(':').toLowerCase().replace(/[^a-z0-9:_-]/g, '_');
}
