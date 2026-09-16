import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryVectorStore, createVectorStore } from '@/lib/vectors/store';

describe('InMemoryVectorStore', () => {
  let store: InMemoryVectorStore;

  beforeEach(() => {
    store = createVectorStore();
  });

  it('starts empty with size 0', () => {
    expect(store.size).toBe(0);
  });

  it('adds vectors and updates size', () => {
    store.addVectors([
      { id: '1', vector: [1, 0, 0], metadata: { text: 'clause 1' } },
      { id: '2', vector: [0, 1, 0], metadata: { text: 'clause 2' } },
    ]);
    expect(store.size).toBe(2);
  });

  it('searches vectors by cosine similarity and returns topK results', () => {
    store.addVectors([
      { id: 'v1', vector: [1, 0, 0], metadata: { name: 'exact match' } },
      { id: 'v2', vector: [0.8, 0.2, 0], metadata: { name: 'close match' } },
      { id: 'v3', vector: [0, 1, 0], metadata: { name: 'orthogonal' } },
    ]);

    const results = store.search([1, 0, 0], 2);
    expect(results).toHaveLength(2);
    expect(results[0].id).toBe('v1');
    expect(results[0].score).toBeCloseTo(1);
    expect(results[1].id).toBe('v2');
  });

  it('handles empty vector search gracefully', () => {
    const results = store.search([1, 2, 3]);
    expect(results).toEqual([]);
  });

  it('clears all entries from store', () => {
    store.addVectors([{ id: '1', vector: [1, 1, 1] }]);
    expect(store.size).toBe(1);
    store.clear();
    expect(store.size).toBe(0);
  });

  it('throws error when comparing vectors of different dimensions', () => {
    store.addVectors([{ id: '1', vector: [1, 0] }]);
    expect(() => store.search([1, 0, 0])).toThrow('Vectors must be of the same length');
  });
});
