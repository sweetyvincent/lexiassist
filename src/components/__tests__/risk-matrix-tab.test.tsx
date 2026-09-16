import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RiskMatrixTab } from '@/components/legal/risk-matrix-tab';
import type { RiskAnalysis } from '@/types/analysis';

const mockAnalysis: RiskAnalysis = {
  documentId: 'doc-risk-123',
  overallScore: 80,
  overallRiskLevel: 'high',
  readingLevel: 'standard',
  summary: 'High liability risks detected.',
  keyFindings: ['High liability'],
  disclaimer: 'Disclaimer',
  analyzedAt: new Date(),
  categories: [
    { category: 'liability', label: 'Liability & Risk', score: 85, riskLevel: 'high', clauseCount: 1, description: 'Test' },
    { category: 'payment', label: 'Financial Terms', score: 40, riskLevel: 'low', clauseCount: 1, description: 'Test' },
  ],
  clauses: [
    {
      clauseId: 'c1',
      title: 'Uncapped Liability',
      riskScore: 90,
      riskLevel: 'high',
      category: 'liability',
      explanation: 'No monetary cap on indemnification obligations.',
      originalText: 'Indemnifier shall hold harmless without monetary limit.',
      simplifiedText: 'No cap',
      pageReference: 1,
      paragraphReference: '1',
      recommendations: ['Cap liability at 1x contract value.'],
    },
    {
      clauseId: 'c2',
      title: 'Late Payment Fee',
      riskScore: 35,
      riskLevel: 'low',
      category: 'payment',
      explanation: '1.5% monthly late fee.',
      originalText: 'Late payments accrue interest at 1.5% per month.',
      simplifiedText: 'Late fee',
      pageReference: 1,
      paragraphReference: '2',
      recommendations: ['Standard commercial term.'],
    },
  ],
};

describe('RiskMatrixTab Component', () => {
  it('renders fallback when no analysis is provided', () => {
    render(<RiskMatrixTab analysis={null} isLoading={false} onClauseClick={() => {}} />);
    expect(screen.getByText(/No analysis data available/i)).toBeInTheDocument();
  });

  it('renders risk categories chart section and clause risks table', () => {
    render(<RiskMatrixTab analysis={mockAnalysis} isLoading={false} onClauseClick={() => {}} />);
    expect(screen.getByText(/Risk Categories/i)).toBeInTheDocument();
    expect(screen.getByText(/Clause Risks/i)).toBeInTheDocument();
    expect(screen.getByText(/Uncapped Liability/i)).toBeInTheDocument();
    expect(screen.getByText(/Late Payment Fee/i)).toBeInTheDocument();
  });

  it('triggers onClauseClick and expands row details when clicked', () => {
    const handleClauseClick = vi.fn();
    render(<RiskMatrixTab analysis={mockAnalysis} isLoading={false} onClauseClick={handleClauseClick} />);

    const clauseRow = screen.getByText(/Uncapped Liability/i);
    fireEvent.click(clauseRow);

    expect(handleClauseClick).toHaveBeenCalledWith('c1');
    expect(screen.getByText(/No monetary cap on indemnification obligations/i)).toBeInTheDocument();
    expect(screen.getByText(/Cap liability at 1x contract value/i)).toBeInTheDocument();
  });
});
