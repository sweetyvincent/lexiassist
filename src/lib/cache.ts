import { LRUCache } from 'lru-cache';
import crypto from 'crypto';

/**
 * Creates an LRU cache with the specified options.
 * @param options Cache options for max size and TTL
 * @returns LRUCache instance
 */
export function createCache<T extends {}>(options?: { max?: number; ttlMs?: number }): LRUCache<string, T> {
  return new LRUCache<string, T>({
    max: options?.max ?? 100,
    ttl: options?.ttlMs ?? 1000 * 60 * 60,
  });
}

export const embeddingCache = createCache<number[]>({ max: 500, ttlMs: 1000 * 60 * 30 });
export const summaryCache = createCache<string>({ max: 50, ttlMs: 1000 * 60 * 60 });
export const analysisCache = createCache<object>({ max: 20, ttlMs: 1000 * 60 * 60 });

/**
 * Creates a deterministic cache key from a set of string parts.
 * @param parts Strings to include in the cache key
 * @returns A hash string representing the cache key
 */
export function getCacheKey(...parts: string[]): string {
  const hash = crypto.createHash('sha256');
  hash.update(parts.join(':'));
  return hash.digest('hex');
}
