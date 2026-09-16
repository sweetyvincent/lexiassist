import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BriefingTab } from '@/components/legal/briefing-tab';
import type { RiskAnalysis } from '@/types/analysis';

const mockAnalysis: RiskAnalysis = {
  documentId: 'doc-brief-99',
  overallScore: 50,
  overallRiskLevel: 'medium',
  readingLevel: 'attorney',
  summary: 'Briefing executive summary text.',
  keyFindings: ['Key finding'],
  disclaimer: 'Disclaimer',
  analyzedAt: new Date(),
  categories: [],
  clauses: [
    {
      clauseId: 'b1',
      title: 'Indemnification Obligations',
      riskScore: 65,
      riskLevel: 'high',
      category: 'indemnification',
      explanation: 'Broad indemnification clause.',
      originalText: 'Indemnify for all losses.',
      simplifiedText: 'Indemnify all',
      pageReference: 1,
      paragraphReference: '1',
      recommendations: ['Request mutual indemnification carve-out.'],
    },
  ],
};

describe('BriefingTab Component', () => {
  it('renders initial Generate Briefing prompt', () => {
    render(<BriefingTab analysis={mockAnalysis} documentId="doc-123" isLoading={false} />);
    expect(screen.getByText(/Attorney Preparation Briefing/i)).toBeInTheDocument();
    expect(screen.getByText(/Generate Briefing/i)).toBeInTheDocument();
  });

  it('renders briefing document sections when generated', () => {
    render(<BriefingTab analysis={mockAnalysis} documentId="doc-123" isLoading={false} />);

    const generateBtn = screen.getByText(/Generate Briefing/i);
    fireEvent.click(generateBtn);

    expect(screen.getByRole('heading', { name: /Attorney Briefing/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Executive Summary/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Key Risks for Review/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Action Items Checklist/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Questions for Attorney/i })).toBeInTheDocument();
  });

  it('allows checking checklist items', () => {
    render(<BriefingTab analysis={mockAnalysis} documentId="doc-123" isLoading={false} />);
    fireEvent.click(screen.getByText(/Generate Briefing/i));

    const checkbox = screen.getByText(/Review indemnification carve-outs/i);
    fireEvent.click(checkbox);
  });
});
