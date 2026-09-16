import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDocument } from '@/hooks/use-document';

describe('useDocument Hook', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('loads demo document correctly', async () => {
    const { result } = renderHook(() => useDocument('demo'));

    await act(async () => {
      await result.current.loadDocument('demo');
    });

    expect(result.current.document).not.toBeNull();
    expect(result.current.document?.id).toBe('demo');
    expect(result.current.document?.fileName).toBe('Master_Services_Agreement_Demo.pdf');
    expect(result.current.document?.extractedText).toContain('MASTER SERVICES AGREEMENT');
  });

  it('loads fallback document when ID is unknown and not in storage', async () => {
    const { result } = renderHook(() => useDocument('unknown-id-123'));

    await act(async () => {
      await result.current.loadDocument('unknown-id-123');
    });

    expect(result.current.document).not.toBeNull();
    expect(result.current.document?.id).toBe('unknown-id-123');
  });

  it('deletes document from state and storage', async () => {
    const { result } = renderHook(() => useDocument('demo'));

    await act(async () => {
      await result.current.loadDocument('demo');
    });

    expect(result.current.document).not.toBeNull();

    await act(async () => {
      await result.current.deleteDocument('demo');
    });

    expect(result.current.document).toBeNull();
  });
});
