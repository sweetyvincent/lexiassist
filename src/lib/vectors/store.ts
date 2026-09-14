/**
 * Represents an entry in the vector store.
 */
export interface VectorEntry {
  id: string;
  vector: number[];
  metadata: Record<string, unknown>;
}

/**
 * A pure TypeScript in-memory vector store for cosine similarity search.
 */
export class InMemoryVectorStore {
  private entries: VectorEntry[] = [];

  /**
   * Adds vectors to the store.
   * @param entries Array of entries containing id, vector, and optional metadata
   */
  public addVectors(
    entries: { id: string; vector: number[]; metadata?: Record<string, unknown> }[]
  ): void {
    for (const entry of entries) {
      this.entries.push({
        id: entry.id,
        vector: entry.vector,
        metadata: entry.metadata || {},
      });
    }
  }

  /**
   * Searches for the most similar vectors using cosine similarity.
   * @param queryVector The vector to search against
   * @param topK Number of results to return
   * @returns Array of matching results sorted by score descending
   */
  public search(
    queryVector: number[],
    topK: number = 5
  ): { id: string; score: number; metadata: Record<string, unknown> }[] {
    const results = this.entries.map(entry => ({
      id: entry.id,
      score: this.cosineSimilarity(queryVector, entry.vector),
      metadata: entry.metadata,
    }));

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, topK);
  }

  /**
   * Clears all entries from the store.
   */
  public clear(): void {
    this.entries = [];
  }

  /**
   * Gets the number of entries in the store.
   */
  public get size(): number {
    return this.entries.length;
  }

  /**
   * Calculates cosine similarity between two vectors.
   * @param a First vector
   * @param b Second vector
   * @returns Cosine similarity score
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Vectors must be of the same length');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}

/**
 * Factory function to create a new InMemoryVectorStore.
 * @returns A new InMemoryVectorStore instance
 */
export function createVectorStore(): InMemoryVectorStore {
  return new InMemoryVectorStore();
}
