'use client';
import { useState } from 'react';
import type { RiskAnalysis } from '@/types/analysis';
import type { ReadingLevel } from '@/types/analysis';
import { FirestoreService } from '@/lib/firebase/firestore';

/**
 * Hook for managing document analysis and summaries
 */
export function useAnalysis(documentId?: string) {
  const [analysis, setAnalysis] = useState<RiskAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [readingLevel, setReadingLevelState] = useState<ReadingLevel>('standard');
  const [summary, setSummary] = useState<string>('');

  const analyzeDocument = async (text: string): Promise<void> => {
    if (!documentId) throw new Error('documentId required to analyze');
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId, text }),
      });
      if (!res.ok) throw new Error('Failed to analyze document');
      const data = await res.json();
      const parsedAnalysis = data as RiskAnalysis;
      setAnalysis(parsedAnalysis);
      await FirestoreService.saveAnalysis(documentId, parsedAnalysis);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  const loadAnalysis = async (docId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const data = await FirestoreService.getAnalysis(docId);
      if (data) {
        setAnalysis(data);
      }
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  const refreshSummary = async (text: string, level: ReadingLevel): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, readingLevel: level }),
      });
      if (!res.ok) throw new Error('Failed to fetch summary');
      const data = await res.json();
      setSummary(data.summary);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  const setReadingLevel = (level: ReadingLevel) => {
    setReadingLevelState(level);
  };

  return { analysis, loading, error, readingLevel, summary, analyzeDocument, loadAnalysis, setReadingLevel, refreshSummary };
}
