import { describe, it, expect, vi } from 'vitest';

vi.mock('pdfjs-dist', () => ({
  GlobalWorkerOptions: { workerSrc: '' },
  version: '4.0.0',
  getDocument: vi.fn(),
}));

import { LocalPDFParser } from '@/lib/pdf/parser';

describe('LocalPDFParser', () => {
  it('chunkText with simple text', () => {
    const pages = [{ pageNumber: 1, text: 'word '.repeat(700), textItems: [] }];
    const chunks = LocalPDFParser.chunkText(pages);
    expect(chunks.length).toBeGreaterThan(1);
  });

  it('chunkText overlap', () => {
    const pages = [{ pageNumber: 1, text: 'word '.repeat(700), textItems: [] }];
    const chunks = LocalPDFParser.chunkText(pages);
    expect(chunks.length).toBeGreaterThan(1);
  });

  it('chunkText with multi-page input', () => {
    const pages = [{ pageNumber: 1, text: 'Page 1 text\nPage 2 text', textItems: [] }];
    const chunks = LocalPDFParser.chunkText(pages);
    expect(chunks.length).toBeGreaterThan(0);
  });

  it('estimateTokens', () => {
    const text = 'a'.repeat(400);
    expect(LocalPDFParser.estimateTokens(text)).toBe(100);
  });

  it('empty input handling', () => {
    const pages = [{ pageNumber: 1, text: '', textItems: [] }];
    const chunks = LocalPDFParser.chunkText(pages);
    expect(chunks).toEqual([]);
  });

  it('very short text (shorter than chunk size)', () => {
    const pages = [{ pageNumber: 1, text: 'short text', textItems: [] }];
    const chunks = LocalPDFParser.chunkText(pages);
    expect(chunks.length).toBe(1);
    expect(chunks[0].content).toBe('short text');
  });
});
