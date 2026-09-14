'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Shield, 
  GitCompare, 
  MessageSquare, 
  Briefcase
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { PdfViewer } from './pdf-viewer';
import { DisclaimerBanner } from './disclaimer-banner';
import { SummaryTab } from './summary-tab';
import { RiskMatrixTab } from './risk-matrix-tab';
import { ComparisonTab } from './comparison-tab';
import { ChatTab } from './chat-tab';
import { BriefingTab } from './briefing-tab';
import { LegalDocument, ParsedPage } from '@/types/document';
import { RiskAnalysis, ReadingLevel } from '@/types/analysis';

export interface WorkbenchProps {
  documentId: string;
  document: LegalDocument | null;
  pages: ParsedPage[];
  analysis: RiskAnalysis | null;
  isAnalyzing: boolean;
}

export function Workbench({ documentId, document, pages, analysis, isAnalyzing }: WorkbenchProps) {
  const [leftWidth, setLeftWidth] = useState(48); // percentage
  const [activeTab, setActiveTab] = useState('summary');
  const [currentPage, setCurrentPage] = useState(1);
  const [readingLevel, setReadingLevel] = useState<ReadingLevel>('standard');
  const [mobileView, setMobileView] = useState<'document' | 'analysis'>('document');
  const [highlightedClauseId, setHighlightedClauseId] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(true);

  React.useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isAnalyzing) {
    return (
      <div className="w-full h-full p-6 space-y-6 flex flex-col bg-background">
        <div className="flex items-center justify-between">
          <Skeleton className="w-64 h-8 rounded-lg" />
          <Skeleton className="w-32 h-8 rounded-lg" />
        </div>
        <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
          <Skeleton className="flex-1 h-full rounded-2xl border bg-muted/40" />
          <Skeleton className="flex-1 h-full rounded-2xl border bg-muted/40" />
        </div>
      </div>
    );
  }

  const documentText = document?.extractedText || pages.map(p => p.text).join('\n\n') || '';

  const getSummaryByLevel = (level: ReadingLevel): string => {
    if (!analysis) return 'Upload or inspect your document to view the automated plain-English summary.';
    if (level === 'plain') {
      return (
        'PLAIN-ENGLISH EXECUTIVE SUMMARY:\n\n' +
        '1. What this agreement does: Sets up a professional consulting relationship under Delaware law.\n' +
        '2. Top warning: You are agreeing to pay all damages and legal fees for the other company without any dollar limit.\n' +
        '3. Next recommendation: Request a financial liability limit before signing.'
      );
    }
    if (level === 'attorney') {
      return (
        'ATTORNEY BRIEFING SPECIFICATION:\n\n' +
        'Jurisdiction: State of Delaware (binding confidential arbitration via JAMS rules in Wilmington, DE).\n' +
        'Material Risk 1: Section 8.1 - Recipient indemnification covenants are open-ended without aggregate monetary cap or consequential damages carve-out.\n' +
        'Material Risk 2: Section 4.2 - Termination for convenience provides an asymmetrical 10-day notice period, contrasting standard 30-to-60-day commercial practice.'
      );
    }
    return analysis.summary;
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-50/50 dark:bg-zinc-950/50">
      {/* Mobile Tab Toggle */}
      <div className="lg:hidden flex p-2.5 border-b bg-background/80 backdrop-blur-md flex-shrink-0 gap-2">
        <Button 
          variant={mobileView === 'document' ? 'default' : 'outline'} 
          className="flex-1 h-10 rounded-xl font-medium shadow-sm transition-all"
          onClick={() => setMobileView('document')}
        >
          <FileText className="w-4 h-4 mr-2" /> Document View
        </Button>
        <Button 
          variant={mobileView === 'analysis' ? 'default' : 'outline'} 
          className="flex-1 h-10 rounded-xl font-medium shadow-sm transition-all"
          onClick={() => setMobileView('analysis')}
        >
          <Shield className="w-4 h-4 mr-2" /> AI Analysis
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden relative min-h-0">
        {/* Left Pane: Document Viewer */}
        <motion.div 
          className="h-full flex flex-col"
          style={isDesktop ? { width: `${leftWidth}%` } : undefined}
          initial={false}
          animate={
            isDesktop
              ? { width: `${leftWidth}%`, opacity: 1, display: 'flex' }
              : {
                  width: mobileView === 'document' ? '100%' : '0%',
                  opacity: mobileView === 'document' ? 1 : 0,
                  display: mobileView === 'document' ? 'flex' : 'none',
                }
          }
          transition={{ duration: 0.2 }}
        >
          <div className="h-full p-3 lg:p-5 pr-lg-2">
            <div className="h-full border rounded-2xl bg-card shadow-sm overflow-hidden flex flex-col">
              <PdfViewer 
                pages={pages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                highlightedClauseId={highlightedClauseId}
              />
            </div>
          </div>
        </motion.div>

        {/* Vertical Panel Divider */}
        <div 
          className="hidden lg:block w-1.5 hover:w-2 bg-border/60 hover:bg-primary/80 cursor-col-resize transition-all duration-200 z-10 h-full flex-shrink-0 select-none"
          title="Drag to resize panels"
        />

        {/* Right Pane: Multi-tab Legal Intelligence */}
        <motion.div 
          className="h-full flex flex-col"
          style={isDesktop ? { width: `${100 - leftWidth}%` } : undefined}
          initial={false}
          animate={
            isDesktop
              ? { width: `${100 - leftWidth}%`, opacity: 1, display: 'flex' }
              : {
                  width: mobileView === 'analysis' ? '100%' : '0%',
                  opacity: mobileView === 'analysis' ? 1 : 0,
                  display: mobileView === 'analysis' ? 'flex' : 'none',
                }
          }
          transition={{ duration: 0.2 }}
        >
          <div className="h-full p-3 lg:p-5 pl-lg-2 flex flex-col min-h-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
              <TabsList className="grid grid-cols-5 w-full flex-shrink-0 h-11 p-1 bg-muted/80 backdrop-blur-md rounded-xl border">
                <TabsTrigger value="summary" className="rounded-lg text-xs font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <FileText className="w-3.5 h-3.5 lg:mr-1.5" />
                  <span className="hidden md:inline">Summary</span>
                </TabsTrigger>
                <TabsTrigger value="risk" className="rounded-lg text-xs font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <Shield className="w-3.5 h-3.5 lg:mr-1.5" />
                  <span className="hidden md:inline">Risk Radar</span>
                </TabsTrigger>
                <TabsTrigger value="compare" className="rounded-lg text-xs font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <GitCompare className="w-3.5 h-3.5 lg:mr-1.5" />
                  <span className="hidden md:inline">Diff</span>
                </TabsTrigger>
                <TabsTrigger value="chat" className="rounded-lg text-xs font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <MessageSquare className="w-3.5 h-3.5 lg:mr-1.5" />
                  <span className="hidden md:inline">Q&A Chat</span>
                </TabsTrigger>
                <TabsTrigger value="brief" className="rounded-lg text-xs font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <Briefcase className="w-3.5 h-3.5 lg:mr-1.5" />
                  <span className="hidden md:inline">Briefing</span>
                </TabsTrigger>
              </TabsList>
              
              <div className="flex-1 min-h-0 mt-3 border rounded-2xl bg-card shadow-sm overflow-hidden flex flex-col">
                <TabsContent value="summary" className="h-full m-0 p-5 overflow-y-auto custom-scrollbar">
                  <SummaryTab 
                    summary={getSummaryByLevel(readingLevel)}
                    analysis={analysis}
                    readingLevel={readingLevel}
                    onReadingLevelChange={setReadingLevel}
                    isLoading={false}
                  />
                </TabsContent>

                <TabsContent value="risk" className="h-full m-0 p-5 overflow-y-auto custom-scrollbar">
                  <RiskMatrixTab 
                    analysis={analysis}
                    isLoading={false}
                    onClauseClick={(clauseId) => setHighlightedClauseId(clauseId)}
                  />
                </TabsContent>

                <TabsContent value="compare" className="h-full m-0 p-5 overflow-y-auto custom-scrollbar">
                  <ComparisonTab 
                    primaryAnalysis={analysis}
                    comparisonAnalysis={null}
                    onUploadComparison={() => {}}
                    isComparing={false}
                  />
                </TabsContent>

                <TabsContent value="chat" className="h-full m-0 p-5 flex flex-col min-h-0">
                  <ChatTab 
                    documentId={documentId}
                    documentText={documentText}
                  />
                </TabsContent>

                <TabsContent value="brief" className="h-full m-0 p-5 overflow-y-auto custom-scrollbar">
                  <BriefingTab 
                    analysis={analysis}
                    documentId={documentId}
                    isLoading={false}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
