import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ComparisonTab } from '@/components/legal/comparison-tab';
import type { RiskAnalysis } from '@/types/analysis';

const mockPrimary: RiskAnalysis = {
  documentId: 'doc-a',
  overallScore: 70,
  overallRiskLevel: 'high',
  readingLevel: 'standard',
  summary: 'Primary contract analysis.',
  keyFindings: ['Key finding'],
  disclaimer: 'Disclaimer',
  analyzedAt: new Date(),
  categories: [
    { category: 'liability', label: 'Liability & Risk', score: 75, riskLevel: 'high', clauseCount: 1, description: 'Test' },
    { category: 'termination', label: 'Termination', score: 60, riskLevel: 'medium', clauseCount: 1, description: 'Test' },
  ],
  clauses: [],
};

describe('ComparisonTab Component', () => {
  it('renders benchmark comparison load button when no comparison document is loaded', () => {
    render(
      <ComparisonTab
        primaryAnalysis={mockPrimary}
        comparisonAnalysis={null}
        onUploadComparison={() => {}}
        isComparing={false}
      />
    );

    expect(screen.getByText(/Contract & Policy Comparison/i)).toBeInTheDocument();
    expect(screen.getByText(/Load Standard Benchmark Comparison/i)).toBeInTheDocument();
  });

  it('loads benchmark comparison data when Load Benchmark button is clicked', () => {
    render(
      <ComparisonTab
        primaryAnalysis={mockPrimary}
        comparisonAnalysis={null}
        onUploadComparison={() => {}}
        isComparing={false}
      />
    );

    const benchmarkBtn = screen.getByText(/Load Standard Benchmark Comparison/i);
    fireEvent.click(benchmarkBtn);

    expect(screen.getByText(/Contract Comparison & Variance Analysis/i)).toBeInTheDocument();
    expect(screen.getByText(/Category Risk Matrix Comparison/i)).toBeInTheDocument();
    expect(screen.getByText(/Critical Discrepancies & Inconsistencies Detected/i)).toBeInTheDocument();
  });

  it('renders risk deltas table when comparison analysis is provided', () => {
    const mockSecondary: RiskAnalysis = {
      documentId: 'doc-b',
      overallScore: 30,
      overallRiskLevel: 'low',
      readingLevel: 'standard',
      summary: 'Secondary contract.',
      keyFindings: ['Key finding'],
      disclaimer: 'Disclaimer',
      analyzedAt: new Date(),
      categories: [
        { category: 'liability', label: 'Liability & Risk', score: 35, riskLevel: 'low', clauseCount: 1, description: 'Test' },
        { category: 'termination', label: 'Termination', score: 20, riskLevel: 'low', clauseCount: 1, description: 'Test' },
      ],
      clauses: [],
    };

    render(
      <ComparisonTab
        primaryAnalysis={mockPrimary}
        comparisonAnalysis={mockSecondary}
        onUploadComparison={() => {}}
        isComparing={false}
      />
    );

    expect(screen.getByText(/Category Risk Matrix Comparison/i)).toBeInTheDocument();
    expect(screen.getByText(/Liability & Risk/i)).toBeInTheDocument();
  });
});
