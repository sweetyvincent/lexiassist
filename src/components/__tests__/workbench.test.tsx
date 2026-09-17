import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Workbench } from '@/components/legal/workbench';
import type { LegalDocument, ParsedPage } from '@/types/document';
import type { RiskAnalysis } from '@/types/analysis';

// Mock next/dynamic to render dynamic components synchronously in Vitest
vi.mock('next/dynamic', () => ({
  default: () => {
    return function DynamicComponent() {
      return <div data-testid="pdf-viewer">PDF Document Viewer</div>;
    };
  },
}));

const mockDoc: LegalDocument = {
  id: 'doc-wb-1',
  userId: 'user-1',
  fileName: 'Employment_Agreement.pdf',
  fileSize: 1024,
  mimeType: 'application/pdf',
  pageCount: 1,
  uploadedAt: new Date(),
  status: 'ready',
  extractedText: 'Sample employment text.',
  chunks: [],
};

const mockPages: ParsedPage[] = [
  { pageNumber: 1, text: 'Sample employment text.', textItems: [] },
];

const mockAnalysis: RiskAnalysis = {
  documentId: 'doc-wb-1',
  overallScore: 40,
  overallRiskLevel: 'medium',
  readingLevel: 'standard',
  summary: 'Workbench summary analysis.',
  keyFindings: ['Finding'],
  disclaimer: 'Disclaimer',
  analyzedAt: new Date(),
  categories: [
    { category: 'liability', label: 'Liability & Risk', score: 50, riskLevel: 'medium', clauseCount: 1, description: 'Test' },
  ],
  clauses: [],
};

describe('Workbench Component', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1280 });
  });

  it('renders loading skeleton when isAnalyzing is true', () => {
    const { container } = render(
      <Workbench
        documentId="doc-wb-1"
        document={mockDoc}
        pages={mockPages}
        analysis={null}
        isAnalyzing={true}
      />
    );

    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });

  it('renders workbench tab triggers', () => {
    render(
      <Workbench
        documentId="doc-wb-1"
        document={mockDoc}
        pages={mockPages}
        analysis={mockAnalysis}
        isAnalyzing={false}
      />
    );

    expect(screen.getByTestId('pdf-viewer')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Summary/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Risk Radar/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Diff/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Q&A Chat/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Briefing/i })).toBeInTheDocument();
  });
});
