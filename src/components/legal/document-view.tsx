'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDocument } from '@/hooks/use-document';
import { useAnalysis } from '@/hooks/use-analysis';
import { Workbench } from '@/components/legal/workbench';
import { DisclaimerBanner } from '@/components/legal/disclaimer-banner';
import { Sidebar } from '@/components/layout/sidebar';
import { motion } from 'framer-motion';
import type { ParsedPage } from '@/types/document';

interface DocumentViewProps {
  docId: string;
}

export function DocumentView({ docId }: DocumentViewProps) {
  const router = useRouter();
  
  const { document, loading: isDocLoading, error: docError, loadDocument } = useDocument(docId);
  const { analysis, analyzeDocument, loading: isAnalyzing } = useAnalysis(docId);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (docId) {
      loadDocument(docId);
    }
  }, [docId, loadDocument]);

  useEffect(() => {
    if (document?.extractedText && !analysis && !isAnalyzing) {
      analyzeDocument(document.extractedText);
    }
  }, [document, analysis, isAnalyzing, analyzeDocument]);

  // Construct structured pages from chunks or fallback
  const pages: ParsedPage[] = document?.chunks ? Array.from(new Set(document.chunks.map(c => c.pageNumber))).map(pageNum => {
    const pageChunks = document.chunks.filter(c => c.pageNumber === pageNum);
    return {
      pageNumber: pageNum,
      text: pageChunks.map(c => c.content).join('\n\n'),
      textItems: []
    };
  }) : [];

  if (isDocLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center bg-background">
        <div className="space-y-4 w-full max-w-4xl p-8">
          <div className="h-10 w-1/3 bg-muted animate-pulse rounded-md" />
          <div className="h-64 w-full bg-muted animate-pulse rounded-lg" />
          <div className="flex gap-4">
            <div className="h-32 w-1/2 bg-muted animate-pulse rounded-lg" />
            <div className="h-32 w-1/2 bg-muted animate-pulse rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (docError) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-destructive">Error Loading Document</h2>
          <p className="text-muted-foreground">{docError.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      <Sidebar
        documents={document ? [{
          id: document.id,
          title: document.fileName,
          status: document.status,
          createdAt: new Date(document.uploadedAt).toLocaleDateString(),
        }] : []}
        activeDocumentId={docId}
        onSelectDocument={(id) => router.push(`/document/${id}`)}
        onDeleteDocument={() => {}}
        onUploadClick={() => router.push('/')}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <main className="flex-1 flex flex-col min-w-0">
        <DisclaimerBanner />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 overflow-hidden"
        >
          <Workbench 
            documentId={docId}
            document={document}
            pages={pages}
            analysis={analysis}
            isAnalyzing={isAnalyzing}
          />
        </motion.div>
      </main>
    </div>
  );
}
