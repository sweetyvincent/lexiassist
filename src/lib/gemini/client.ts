import { GoogleGenerativeAI, GenerateContentResult, GenerateContentStreamResult } from '@google/generative-ai';

let geminiClientInstance: GoogleGenerativeAI | null = null;

/**
 * Returns a singleton instance of the GoogleGenerativeAI client.
 * Server-side use only.
 */
export function getGeminiClient(): GoogleGenerativeAI {
  if (!geminiClientInstance) {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_AI_API_KEY is not defined in environment variables');
    }
    geminiClientInstance = new GoogleGenerativeAI(apiKey);
  }
  return geminiClientInstance;
}

/**
 * RateLimitedQueue manages API calls to respect the 15 RPM limit and provides exponential backoff.
 */
class RateLimitedQueue {
  private requests: number[] = [];
  private readonly maxRequestsPerMinute = 15;
  private readonly windowMs = 60 * 1000;

  /**
   * Enqueues a function to be executed when rate limits allow, with exponential backoff on 429s.
   */
  async enqueue<T>(fn: () => Promise<T>): Promise<T> {
    await this.waitIfNeeded();
    return this.executeWithRetry(fn);
  }

  private async waitIfNeeded(): Promise<void> {
    const now = Date.now();
    this.requests = this.requests.filter(t => now - t < this.windowMs);

    if (this.requests.length >= this.maxRequestsPerMinute) {
      const oldestRequest = this.requests[0];
      const waitTime = this.windowMs - (now - oldestRequest);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      // Re-evaluate after waiting
      return this.waitIfNeeded();
    }
    this.requests.push(Date.now());
  }

  private async executeWithRetry<T>(fn: () => Promise<T>, attempt = 0): Promise<T> {
    try {
      return await fn();
    } catch (error: any) {
      // Handle 429 Too Many Requests
      if (error?.status === 429 && attempt < 3) {
        const delays = [2000, 4000, 8000];
        await new Promise(resolve => setTimeout(resolve, delays[attempt]));
        return this.executeWithRetry(fn, attempt + 1);
      }
      throw error;
    }
  }
}

const queue = new RateLimitedQueue();

/**
 * Generates content with rate limiting and exponential backoff retry.
 */
export async function generateWithRetry(model: any, prompt: any, config?: any): Promise<GenerateContentResult> {
  return queue.enqueue(() => model.generateContent(prompt, config));
}

/**
 * Streams content with rate limiting and exponential backoff retry.
 */
export async function streamWithRetry(model: any, prompt: any, config?: any): Promise<GenerateContentStreamResult> {
  return queue.enqueue(() => model.generateContentStream(prompt, config));
}

/**
 * Generates an embedding for a single text using text-embedding-004.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const client = getGeminiClient();
  const model = client.getGenerativeModel({ model: 'text-embedding-004' });
  const result = await queue.enqueue(() => model.embedContent(text));
  return result.embedding.values;
}

/**
 * Generates embeddings for multiple texts with rate limiting.
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const embeddings: number[][] = [];
  for (const text of texts) {
    const embedding = await generateEmbedding(text);
    embeddings.push(embedding);
  }
  return embeddings;
}
