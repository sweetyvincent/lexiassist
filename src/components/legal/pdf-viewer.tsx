'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { ParsedPage } from '@/types/document';
import type { RiskLevel } from '@/types/analysis';

export interface HighlightedClause {
  id: string;
  pageNumber: number;
  text: string;
  riskLevel: RiskLevel;
}

export interface PdfViewerProps {
  pages: ParsedPage[];
  currentPage: number;
  onPageChange: (page: number) => void;
  highlightedClauses?: HighlightedClause[];
  highlightedClauseId?: string | null;
  onClauseClick?: (clauseId: string) => void;
  className?: string;
}

const TEXT_SIZES = ['text-sm', 'text-base', 'text-lg', 'text-xl'];

export function PdfViewer({
  pages,
  currentPage,
  onPageChange,
  highlightedClauses = [],
  onClauseClick,
  className,
}: PdfViewerProps) {
  const [textSizeIndex, setTextSizeIndex] = useState(1);

  const handleZoomIn = () => setTextSizeIndex((prev) => Math.min(prev + 1, TEXT_SIZES.length - 1));
  const handleZoomOut = () => setTextSizeIndex((prev) => Math.max(prev - 1, 0));

  const currentTextSize = TEXT_SIZES[textSizeIndex];

  if (!pages || pages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full border rounded-xl bg-muted/20">
        <p className="text-muted-foreground">No pages available.</p>
      </div>
    );
  }

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case 'high':
        return 'bg-red-200 dark:bg-red-900/50 text-red-900 dark:text-red-100 cursor-pointer';
      case 'medium':
        return 'bg-amber-200 dark:bg-amber-900/50 text-amber-900 dark:text-amber-100 cursor-pointer';
      case 'low':
        return 'bg-green-200 dark:bg-green-900/50 text-green-900 dark:text-green-100 cursor-pointer';
      default:
        return 'bg-blue-200 dark:bg-blue-900/50 text-blue-900 dark:text-blue-100 cursor-pointer';
    }
  };

  return (
    <div className={cn("flex flex-col h-full border rounded-xl overflow-hidden bg-background", className)}>
      {/* Header Bar */}
      <div className="flex items-center justify-between p-2 border-b bg-muted/30">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage <= 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium tabular-nums">
            Page {currentPage} of {pages.length}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(Math.min(currentPage + 1, pages.length))}
            disabled={currentPage >= pages.length}
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" onClick={handleZoomOut} disabled={textSizeIndex === 0} aria-label="Zoom out">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleZoomIn} disabled={textSizeIndex === TEXT_SIZES.length - 1} aria-label="Zoom in">
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <ScrollArea className="flex-1 p-6" role="document" aria-label="Document content">
        <div className={cn("max-w-3xl mx-auto font-serif leading-relaxed whitespace-pre-wrap", currentTextSize)}>
          {pages.map((page) => (
            <section
              key={page.pageNumber}
              id={`page-${page.pageNumber}`}
              className={cn("mb-12", currentPage !== page.pageNumber ? "hidden" : "block")}
            >
              <h2 className="sr-only">Page {page.pageNumber}</h2>
              <div>{page.text}</div>
            </section>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
