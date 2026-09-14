'use client';
import { useState } from 'react';
import { LocalPDFParser } from '@/lib/pdf/parser';
import { FirestoreService } from '@/lib/firebase/firestore';
import type { LegalDocument } from '@/types/document';
import { v4 as uuidv4 } from 'uuid';

/**
 * Hook for managing legal documents
 */
export function useDocument(documentId?: string) {
  const [document, setDocument] = useState<LegalDocument | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadDocument = async (file: File): Promise<string> => {
    try {
      setLoading(true);
      setError(null);
      const arrayBuffer = await file.arrayBuffer();
      const { pages, metadata } = await LocalPDFParser.parse(arrayBuffer);
      const chunks = LocalPDFParser.chunkText(pages);
      const extractedText = pages.map(p => p.text).join('\n\n');
      
      const docId = uuidv4();
      const doc: LegalDocument = {
        id: docId,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        uploadedAt: new Date(),
        userId: 'temp', // This would typically come from auth state
        pageCount: metadata.pageCount,
        extractedText,
        chunks,
        status: 'ready',
      };
      
      await FirestoreService.saveDocument(doc);
      setDocument(doc);
      return docId;
    } catch (err: any) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  const loadDocument = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const doc = await FirestoreService.getDocument(id);
      setDocument(doc);
    } catch (err: any) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await FirestoreService.deleteDocument(id);
      if (document?.id === id) {
        setDocument(null);
      }
    } catch (err: any) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  return { document, loading, error, uploadDocument, loadDocument, deleteDocument };
}
