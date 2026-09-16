import { describe, it, expect } from 'vitest';
import { createCache, getCacheKey, embeddingCache, summaryCache, analysisCache } from '@/lib/cache';

describe('Cache Service', () => {
  it('creates an LRU cache with default options', () => {
    const cache = createCache<string>();
    cache.set('key1', 'val1');
    expect(cache.get('key1')).toBe('val1');
  });

  it('evicts old items when max capacity is reached', () => {
    const cache = createCache<number>({ max: 2 });
    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);
    expect(cache.get('a')).toBeUndefined();
    expect(cache.get('b')).toBe(2);
    expect(cache.get('c')).toBe(3);
  });

  it('generates deterministic sha256 cache keys', () => {
    const key1 = getCacheKey('doc-1', 'plain');
    const key2 = getCacheKey('doc-1', 'plain');
    const key3 = getCacheKey('doc-1', 'attorney');

    expect(key1).toBe(key2);
    expect(key1).not.toBe(key3);
    expect(key1).toHaveLength(64); // sha256 hex string
  });

  it('exports pre-configured singleton caches', () => {
    expect(embeddingCache).toBeDefined();
    expect(summaryCache).toBeDefined();
    expect(analysisCache).toBeDefined();
  });
});
