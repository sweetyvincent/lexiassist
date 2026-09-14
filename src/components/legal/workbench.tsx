'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Shield, GitCompare, MessageSquare, Briefcase, Columns, SidebarClose } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { PdfViewer } from './pdf-viewer';
import { DisclaimerBanner } from './disclaimer-banner';
import { LegalDocument, ParsedPage } from '@/types/document';
import { RiskAnalysis } from '@/types/analysis';

export interface WorkbenchProps {
  documentId: string;
  document: LegalDocument | null;
  pages: ParsedPage[];
  analysis: RiskAnalysis | null;
  isAnalyzing: boolean;
}

export function Workbench({ documentId, document, pages, analysis, isAnalyzing }: WorkbenchProps) {
  const [leftWidth, setLeftWidth] = useState(50); // percentage
  const [activeTab, setActiveTab] = useState('summary');
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileView, setMobileView] = useState<'document' | 'analysis'>('document');

  // Simple drag to resize implementation mock
  const handleDrag = (e: React.MouseEvent) => {
    // Resize logic goes here
  };

  if (isAnalyzing) {
    return (
      <div className="w-full h-full p-4 space-y-4 flex flex-col">
        <Skeleton className="w-full h-12 flex-shrink-0" />
        <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
          <Skeleton className="flex-1 h-full rounded-xl" />
          <Skeleton className="flex-1 h-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      <DisclaimerBanner />
      
      {/* Mobile Toggle */}
      <div className="lg:hidden flex p-2 border-b flex-shrink-0">
        <Button 
          variant={mobileView === 'document' ? 'default' : 'outline'} 
          className="flex-1 rounded-r-none"
          onClick={() => setMobileView('document')}
        >
          <FileText className="w-4 h-4 mr-2" /> Document
        </Button>
        <Button 
          variant={mobileView === 'analysis' ? 'default' : 'outline'} 
          className="flex-1 rounded-l-none"
          onClick={() => setMobileView('analysis')}
        >
          <Shield className="w-4 h-4 mr-2" /> Analysis
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden relative min-h-0">
        {/* Left Pane: Document Viewer */}
        <motion.div 
          className="h-full"
          style={{ width: `${leftWidth}%` }}
          initial={false}
          animate={{ 
            width: mobileView === 'document' ? '100%' : '0%', 
            opacity: mobileView === 'document' ? 1 : 0 
          }}
        >
          <div className="h-full p-2 lg:p-4 pr-lg-2">
            <PdfViewer 
              pages={pages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </motion.div>

        {/* Resizer */}
        <div 
          className="hidden lg:block w-1 bg-border hover:bg-blue-500 cursor-col-resize transition-colors z-10 h-full flex-shrink-0"
          onMouseDown={handleDrag}
          aria-label="Resize panels"
        />

        {/* Right Pane: Analysis Tabs */}
        <motion.div 
          className="h-full"
          style={{ width: `${100 - leftWidth}%` }}
          initial={false}
          animate={{ 
            width: mobileView === 'analysis' ? '100%' : '0%',
            opacity: mobileView === 'analysis' ? 1 : 0
          }}
        >
          <div className="h-full p-2 lg:p-4 pl-lg-2 flex flex-col min-h-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
              <TabsList className="grid grid-cols-5 w-full flex-shrink-0">
                <TabsTrigger value="summary" title="Summary"><FileText className="w-4 h-4 lg:mr-2" /><span className="hidden lg:inline">Summary</span></TabsTrigger>
                <TabsTrigger value="risk" title="Risk Matrix"><Shield className="w-4 h-4 lg:mr-2" /><span className="hidden lg:inline">Risk Matrix</span></TabsTrigger>
                <TabsTrigger value="compare" title="Compare"><GitCompare className="w-4 h-4 lg:mr-2" /><span className="hidden lg:inline">Compare</span></TabsTrigger>
                <TabsTrigger value="chat" title="Q&A Chat"><MessageSquare className="w-4 h-4 lg:mr-2" /><span className="hidden lg:inline">Q&A Chat</span></TabsTrigger>
                <TabsTrigger value="brief" title="Attorney Brief"><Briefcase className="w-4 h-4 lg:mr-2" /><span className="hidden lg:inline">Brief</span></TabsTrigger>
              </TabsList>
              
              <div className="flex-1 min-h-0 mt-2 border rounded-xl bg-background">
                <TabsContent value="summary" className="h-full m-0 p-4 overflow-y-auto">
                  <p>Summary View</p>
                </TabsContent>
                <TabsContent value="risk" className="h-full m-0 p-4 overflow-y-auto">
                  <p>Risk Matrix View</p>
                </TabsContent>
                <TabsContent value="compare" className="h-full m-0 p-4 overflow-y-auto">
                  <p>Compare View</p>
                </TabsContent>
                <TabsContent value="chat" className="h-full m-0 p-4 overflow-y-auto">
                  <p>Q&A Chat View</p>
                </TabsContent>
                <TabsContent value="brief" className="h-full m-0 p-4 overflow-y-auto">
                  <p>Attorney Brief View</p>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
