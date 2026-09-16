import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SummaryTab } from '@/components/legal/summary-tab';
import type { RiskAnalysis } from '@/types/analysis';

const mockAnalysis: RiskAnalysis = {
  documentId: 'doc-test-123',
  overallScore: 65,
  overallRiskLevel: 'medium',
  readingLevel: 'plain',
  summary: 'This contract contains moderate financial obligations.',
  keyFindings: ['Key finding 1'],
  disclaimer: 'Disclaimer text',
  analyzedAt: new Date(),
  categories: [
    { category: 'payment', label: 'Financial Terms', score: 60, riskLevel: 'medium', clauseCount: 1, description: 'Test' },
  ],
  clauses: [
    {
      clauseId: 'c1',
      title: 'Auto-Renewal Notice',
      riskScore: 70,
      riskLevel: 'high',
      category: 'termination',
      explanation: 'Unilateral 60-day auto-renewal clause.',
      originalText: 'Agreement auto-renews unless canceled 60 days prior.',
      simplifiedText: 'Auto renews',
      pageReference: 1,
      paragraphReference: '1',
      recommendations: ['Request 30-day cancellation window.'],
    },
  ],
};

describe('SummaryTab Component', () => {
  it('renders loading skeleton when isLoading is true', () => {
    const { container } = render(
      <SummaryTab
        summary={null}
        analysis={null}
        readingLevel="plain"
        onReadingLevelChange={() => {}}
        isLoading={true}
      />
    );
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });

  it('renders summary text and overall risk score', () => {
    render(
      <SummaryTab
        summary="This is a simplified plain english contract summary."
        analysis={mockAnalysis}
        readingLevel="plain"
        onReadingLevelChange={() => {}}
        isLoading={false}
      />
    );

    expect(screen.getByText(/Document Summary & Navigation/i)).toBeInTheDocument();
    expect(screen.getByText(/medium Risk Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/65\/100/i)).toBeInTheDocument();
    expect(screen.getByText(/This is a simplified plain english contract summary/i)).toBeInTheDocument();
  });

  it('triggers onReadingLevelChange when reading level dropdown changes', () => {
    const handleReadingLevelChange = vi.fn();
    render(
      <SummaryTab
        summary="Summary text"
        analysis={mockAnalysis}
        readingLevel="plain"
        onReadingLevelChange={handleReadingLevelChange}
        isLoading={false}
      />
    );

    const select = screen.getByLabelText(/Reading Level Switcher/i);
    fireEvent.change(select, { target: { value: 'attorney' } });
    expect(handleReadingLevelChange).toHaveBeenCalledWith('attorney');
  });

  it('renders key findings and clause risks', () => {
    render(
      <SummaryTab
        summary="Summary text"
        analysis={mockAnalysis}
        readingLevel="plain"
        onReadingLevelChange={() => {}}
        isLoading={false}
      />
    );

    expect(screen.getByText(/Auto-Renewal Notice/i)).toBeInTheDocument();
    expect(screen.getByText(/Unilateral 60-day auto-renewal clause/i)).toBeInTheDocument();
  });

  it('renders rights & obligations cards and options navigator', () => {
    render(
      <SummaryTab
        summary="Summary text"
        analysis={mockAnalysis}
        readingLevel="plain"
        onReadingLevelChange={() => {}}
        isLoading={false}
      />
    );

    expect(screen.getByText(/Your Key Rights & Protections/i)).toBeInTheDocument();
    expect(screen.getByText(/Your Core Obligations & Deadlines/i)).toBeInTheDocument();
    expect(screen.getByText(/Recommended Next Steps & Action Options/i)).toBeInTheDocument();
  });
});
