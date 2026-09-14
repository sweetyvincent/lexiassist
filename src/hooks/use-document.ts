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
      if (id === 'demo') {
        const demoDoc: LegalDocument = {
          id: 'demo',
          fileName: 'Master_Services_Agreement_Demo.pdf',
          fileSize: 1024 * 145,
          mimeType: 'application/pdf',
          uploadedAt: new Date(),
          userId: 'demo-user',
          pageCount: 2,
          extractedText: `MASTER SERVICES AGREEMENT (SAMPLE DRAFT)

SECTION 1: SERVICES AND SCOPE
1.1 Services. Provider shall render enterprise consulting and software optimization services as detailed in applicable Statements of Work (SOW).
1.2 Standard of Performance. Provider warrants that services will be performed in a professional and workmanlike manner conforming to prevailing commercial industry standards.

SECTION 4: TERM AND TERMINATION
4.1 Term. This Agreement commences on the Effective Date and continues for a period of one (1) year unless terminated earlier in accordance with Section 4.2.
4.2 Termination for Convenience. Either party may terminate this Agreement without cause upon ten (10) days written notice to the other party.
4.3 Termination for Cause. Either party may terminate this Agreement immediately upon written notice if the other party breaches any material term and fails to cure such breach within fifteen (15) days.

SECTION 8: INDEMNIFICATION AND LIABILITY
8.1 Indemnification. Recipient shall indemnify, defend, and hold harmless against any and all claims, losses, damages, liabilities, and expenses (including attorneys' fees) arising out of or related to this Agreement without financial cap.
8.2 Disclaimer of Consequential Damages. In no event shall Provider be liable for any lost profits, exemplary, punitive, or consequential damages.

SECTION 12: GOVERNING LAW AND DISPUTES
12.1 Governing Law. This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to conflict of laws principles.
12.2 Arbitration. Any unresolved dispute arising under this Agreement shall be submitted to confidential binding arbitration under JAMS rules in Wilmington, Delaware.`,
          chunks: [
            {
              id: 'demo-chunk-1',
              pageNumber: 1,
              content: `MASTER SERVICES AGREEMENT (SAMPLE DRAFT)\n\nSECTION 1: SERVICES AND SCOPE\n1.1 Services. Provider shall render enterprise consulting and software optimization services as detailed in applicable Statements of Work (SOW).\n1.2 Standard of Performance. Provider warrants that services will be performed in a professional and workmanlike manner conforming to prevailing commercial industry standards.\n\nSECTION 4: TERM AND TERMINATION\n4.1 Term. This Agreement commences on the Effective Date and continues for a period of one (1) year unless terminated earlier in accordance with Section 4.2.\n4.2 Termination for Convenience. Either party may terminate this Agreement without cause upon ten (10) days written notice to the other party.\n4.3 Termination for Cause. Either party may terminate this Agreement immediately upon written notice if the other party breaches any material term and fails to cure such breach within fifteen (15) days.`,
              startIndex: 0,
              endIndex: 820
            },
            {
              id: 'demo-chunk-2',
              pageNumber: 2,
              content: `SECTION 8: INDEMNIFICATION AND LIABILITY\n8.1 Indemnification. Recipient shall indemnify, defend, and hold harmless against any and all claims, losses, damages, liabilities, and expenses (including attorneys' fees) arising out of or related to this Agreement without financial cap.\n8.2 Disclaimer of Consequential Damages. In no event shall Provider be liable for any lost profits, exemplary, punitive, or consequential damages.\n\nSECTION 12: GOVERNING LAW AND DISPUTES\n12.1 Governing Law. This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to conflict of laws principles.\n12.2 Arbitration. Any unresolved dispute arising under this Agreement shall be submitted to confidential binding arbitration under JAMS rules in Wilmington, Delaware.`,
              startIndex: 821,
              endIndex: 1650
            }
          ],
          status: 'ready',
          documentType: 'other',
          parties: ['Apex Enterprise Solutions LLC', 'Client Partner Global Inc.'],
          effectiveDate: '2025-01-01',
          governingLaw: 'Delaware, USA'
        };
        setDocument(demoDoc);
        return;
      }
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
