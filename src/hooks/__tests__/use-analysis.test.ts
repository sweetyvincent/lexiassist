import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAnalysis } from '@/hooks/use-analysis';

describe('useAnalysis Hook', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.reject(new Error('Fetch disabled in test environment'))
    );
  });

  it('initializes with null analysis and standard reading level', () => {
    const { result } = renderHook(() => useAnalysis('doc-123'));

    expect(result.current.analysis).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.readingLevel).toBe('standard');
  });

  it('updates reading level when setReadingLevel is called', () => {
    const { result } = renderHook(() => useAnalysis('doc-123'));

    act(() => {
      result.current.setReadingLevel('attorney');
    });

    expect(result.current.readingLevel).toBe('attorney');
  });

  it('analyzes document text and sets fallback analysis on static environment', async () => {
    const { result } = renderHook(() => useAnalysis('doc-test-123'));

    await act(async () => {
      await result.current.analyzeDocument('Sample contract text to analyze.');
    });

    expect(result.current.analysis).not.toBeNull();
    expect(result.current.analysis?.documentId).toBe('doc-test-123');
    expect(result.current.analysis?.clauses.length).toBeGreaterThan(0);
    expect(result.current.analysis?.categories.length).toBeGreaterThan(0);
  });
});
