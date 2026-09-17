'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
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
import { DisclaimerBanner } from './disclaimer-banner';
import { SummaryTab } from './summary-tab';
import { RiskMatrixTab } from './risk-matrix-tab';
import { ComparisonTab } from './comparison-tab';
import { ChatTab } from './chat-tab';
import { BriefingTab } from './briefing-tab';
import { LegalDocument, ParsedPage } from '@/types/document';
import { RiskAnalysis, ReadingLevel } from '@/types/analysis';

// Dynamic import of PDF viewer for optimal code-splitting and zero initial bundle overhead
const PdfViewer = dynamic(
  () => import('./pdf-viewer').then((mod) => mod.PdfViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-muted/20 p-8">
        <Skeleton className="h-full w-full rounded-xl" />
      </div>
    ),
  }
);

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

  const documentText = pages.map(p => p.text).join('\n\n');

  const getSummaryByLevel = (level: ReadingLevel) => {
    if (!analysis) return null;
    switch (level) {
      case 'plain':
        return analysis.summary ? `Plain English Summary:\n${analysis.summary}` : 'Simplifying legal terms into plain English for easy reading.';
      case 'attorney':
        return analysis.summary ? `Detailed Attorney Breakdown:\n${analysis.summary}\n\nKey Findings:\n${analysis.keyFindings.join('\n')}` : 'Detailed legal findings and clause citations.';
      case 'standard':
      default:
        return analysis.summary;
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-50/50 dark:bg-zinc-950/50">
      {/* Mobile view switcher controls */}
      <div className="lg:hidden flex p-2.5 border-b bg-background/80 backdrop-blur-md flex-shrink-0 gap-2">
        <Button
          variant={mobileView === 'document' ? 'default' : 'outline'}
          onClick={() => setMobileView('document')}
          className="flex-1 h-10 rounded-xl font-medium shadow-sm transition-all"
        >
          <FileText className="w-4 h-4 mr-2" /> Document View
        </Button>
        <Button
          variant={mobileView === 'analysis' ? 'default' : 'outline'}
          onClick={() => setMobileView('analysis')}
          className="flex-1 h-10 rounded-xl font-medium shadow-sm transition-all"
        >
          <Shield className="w-4 h-4 mr-2" /> AI Analysis
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden relative min-h-0">
        {/* Left Pane: PDF / Document Viewer */}
        <motion.div 
          className="h-full flex flex-col"
          style={
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

        {/* Resizable Divider (Desktop only) */}
        {isDesktop && (
          <div 
            className="w-1.5 hover:w-2 bg-border/60 hover:bg-primary/80 cursor-col-resize transition-all duration-200 z-10 h-full flex-shrink-0 select-none"
            onMouseDown={(e) => {
              const startX = e.clientX;
              const startLeftWidth = leftWidth;
              
              const handleMouseMove = (moveEvent: MouseEvent) => {
                const containerWidth = window.innerWidth;
                const deltaX = moveEvent.clientX - startX;
                const deltaPercent = (deltaX / containerWidth) * 100;
                const newWidth = Math.min(Math.max(startLeftWidth + deltaPercent, 25), 75);
                setLeftWidth(newWidth);
              };

              const handleMouseUp = () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
              };

              window.addEventListener('mousemove', handleMouseMove);
              window.addEventListener('mouseup', handleMouseUp);
            }}
            title="Drag to resize panels"
          />
        )}

        {/* Right Pane: Intelligence & Analysis Workbench */}
        <motion.div 
          className="h-full flex flex-col"
          style={
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
                <TabsContent value="summary" className="flex-1 min-h-0 m-0 p-5 overflow-y-auto custom-scrollbar focus-visible:outline-none">
                  <SummaryTab 
                    summary={getSummaryByLevel(readingLevel)}
                    analysis={analysis}
                    readingLevel={readingLevel}
                    onReadingLevelChange={setReadingLevel}
                    isLoading={false}
                  />
                </TabsContent>

                <TabsContent value="risk" className="flex-1 min-h-0 m-0 p-5 overflow-y-auto custom-scrollbar focus-visible:outline-none">
                  <RiskMatrixTab 
                    analysis={analysis}
                    isLoading={false}
                    onClauseClick={(clauseId) => setHighlightedClauseId(clauseId)}
                  />
                </TabsContent>

                <TabsContent value="compare" className="flex-1 min-h-0 m-0 p-5 overflow-y-auto custom-scrollbar focus-visible:outline-none">
                  <ComparisonTab 
                    primaryAnalysis={analysis}
                    comparisonAnalysis={null}
                    onUploadComparison={() => {}}
                    isComparing={false}
                  />
                </TabsContent>

                <TabsContent value="chat" className="flex-1 min-h-0 m-0 p-5 flex flex-col min-h-0 focus-visible:outline-none">
                  <ChatTab 
                    documentId={documentId}
                    documentText={documentText}
                  />
                </TabsContent>

                <TabsContent value="brief" className="flex-1 min-h-0 m-0 p-5 overflow-y-auto custom-scrollbar focus-visible:outline-none">
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
