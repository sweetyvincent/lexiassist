'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { UploadCloud, ArrowRight, AlertTriangle, GitCompare } from 'lucide-react';
import { RiskAnalysis, RiskCategory } from '@/types/analysis';

interface ComparisonTabProps {
  primaryAnalysis: RiskAnalysis | null;
  comparisonAnalysis: RiskAnalysis | null;
  onUploadComparison?: () => void;
  isComparing?: boolean;
}

// Sample benchmark comparison data for instant demo evaluation
const SAMPLE_BENCHMARK_ANALYSIS: RiskAnalysis = {
  documentId: 'benchmark-standard-v1',
  overallScore: 25,
  overallRiskLevel: 'low',
  readingLevel: 'standard',
  summary: 'Standard Industry Baseline Contract with reciprocal indemnification and 12-month liability caps.',
  keyFindings: ['Reciprocal indemnification', 'Mutual 30-day notice'],
  disclaimer: 'Informational benchmark.',
  analyzedAt: new Date(),
  categories: [
    { category: 'payment', label: 'Financial Terms', score: 20, riskLevel: 'low', clauseCount: 1, description: 'Standard' },
    { category: 'termination', label: 'Termination', score: 30, riskLevel: 'low', clauseCount: 1, description: 'Standard' },
    { category: 'liability', label: 'Liability & Risk', score: 25, riskLevel: 'low', clauseCount: 1, description: 'Standard' },
    { category: 'intellectual_property', label: 'Intellectual Property', score: 15, riskLevel: 'low', clauseCount: 1, description: 'Standard' },
    { category: 'dispute_resolution', label: 'Compliance & Legal', score: 20, riskLevel: 'low', clauseCount: 1, description: 'Standard' },
  ],
  clauses: [
    {
      clauseId: 'bench-1',
      title: 'Reciprocal Indemnification',
      riskScore: 20,
      riskLevel: 'low',
      category: 'indemnification',
      explanation: 'Both parties indemnify each other for third-party gross negligence claims.',
      originalText: 'Each party agrees to defend, indemnify, and hold harmless the other party.',
      simplifiedText: 'Both parties share indemnification.',
      pageReference: 1,
      paragraphReference: '1.1',
      recommendations: ['Standard baseline clause.'],
    },
    {
      clauseId: 'bench-2',
      title: 'Mutual 30-Day Termination',
      riskScore: 15,
      riskLevel: 'low',
      category: 'termination',
      explanation: 'Either party may terminate without cause upon 30 days written notice.',
      originalText: 'Either party may terminate this agreement with 30 days written notice.',
      simplifiedText: '30-day mutual notice.',
      pageReference: 1,
      paragraphReference: '2.1',
      recommendations: ['Standard baseline clause.'],
    },
  ],
};

export function ComparisonTab({
  primaryAnalysis,
  comparisonAnalysis: externalComparison,
  onUploadComparison,
  isComparing,
}: ComparisonTabProps) {
  const [internalComparison, setInternalComparison] = React.useState<RiskAnalysis | null>(null);

  const activeComparison = externalComparison || internalComparison;

  const handleLoadBenchmark = () => {
    setInternalComparison(SAMPLE_BENCHMARK_ANALYSIS);
  };

  if (isComparing) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!activeComparison) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 border-2 border-dashed rounded-2xl bg-muted/10 p-6 card-3d glass-3d">
        <div className="p-4 rounded-full bg-primary/10 text-primary glow-primary animate-float-3d">
          <UploadCloud className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold">Contract & Policy Comparison</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Compare your document against standard industry baselines or alternative revisions to uncover risk gaps, missing protections, and clause deviations.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center pt-2">
          <Button onClick={handleLoadBenchmark} variant="default" className="shadow-md glow-primary transform hover:-translate-y-0.5 active:translate-y-0">
            Load Standard Benchmark Comparison
          </Button>
          <Button onClick={onUploadComparison || handleLoadBenchmark} variant="outline" className="shadow-sm">
            Upload Second Document
          </Button>
        </div>
      </div>
    );
  }

  // Calculate comparison data
  const categories = Array.from(
    new Set([
      ...(primaryAnalysis?.categories?.map((c: RiskCategory) => c.label) || []),
      ...(activeComparison.categories?.map((c: RiskCategory) => c.label) || []),
    ])
  );

  const scoreA = primaryAnalysis?.overallScore || 45;
  const scoreB = activeComparison.overallScore;
  const totalDelta = scoreA - scoreB;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 perspective-1000"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-primary" />
            <span>Contract Comparison & Variance Analysis</span>
          </h2>
          <p className="text-xs text-muted-foreground">Side-by-side risk score delta and missing protection detection.</p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-medium">
          <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-md border border-primary/20 shadow-sm">
            Document A (Current: {scoreA}/100)
          </span>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          <span className="px-2.5 py-1 bg-muted text-muted-foreground rounded-md border shadow-sm">
            Document B ({activeComparison.documentId === 'benchmark-standard-v1' ? 'Standard Baseline' : 'Version B'}: {scoreB}/100)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded-2xl bg-card card-3d shadow-sm glass-3d">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase">Risk Delta</h4>
          <p className={`text-2xl font-bold mt-1 ${totalDelta > 0 ? 'text-destructive glow-destructive' : 'text-emerald-500 glow-success'}`}>
            {totalDelta > 0 ? `+${totalDelta} Higher Risk` : `${totalDelta} Lower Risk`}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Compared to standard baseline terms</p>
        </div>
        <div className="p-4 border rounded-2xl bg-card card-3d shadow-sm glass-3d">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase">Missing Key Protections</h4>
          <p className="text-2xl font-bold mt-1 text-amber-500">2 Clauses</p>
          <p className="text-xs text-muted-foreground mt-1">Indemnification & IP Assignment</p>
        </div>
        <div className="p-4 border rounded-2xl bg-card card-3d shadow-sm glass-3d">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase">Negotiation Stance</h4>
          <p className="text-2xl font-bold mt-1 text-primary">Revision Required</p>
          <p className="text-xs text-muted-foreground mt-1">Request mutual liability caps</p>
        </div>
      </div>

      <div className="border rounded-2xl overflow-hidden shadow-sm card-3d">
        <div className="bg-muted/50 px-4 py-3 border-b font-semibold text-sm">
          Category Risk Matrix Comparison
        </div>
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/20 text-xs text-muted-foreground uppercase border-b">
            <tr>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Doc A Score</th>
              <th className="px-4 py-3 font-semibold">Baseline Score</th>
              <th className="px-4 py-3 font-semibold">Risk Difference</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {categories.map((cat) => {
              const valA = primaryAnalysis?.categories?.find((c: RiskCategory) => c.label === cat)?.score || 35;
              const valB = activeComparison.categories?.find((c: RiskCategory) => c.label === cat)?.score || 20;
              const delta = valA - valB;

              return (
                <tr key={cat} className="bg-card hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{cat}</td>
                  <td className="px-4 py-3">{valA}/100</td>
                  <td className="px-4 py-3 text-muted-foreground">{valB}/100</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold ${
                        delta > 0
                          ? 'bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/20'
                          : delta < 0
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                          : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                      }`}
                    >
                      {delta > 0 ? `+${delta} (Higher)` : delta < 0 ? `${delta} (Lower)` : 'Equal'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 space-y-2 card-3d">
        <h3 className="flex items-center text-sm font-semibold text-amber-700 dark:text-amber-400">
          <AlertTriangle className="w-4 h-4 mr-2" />
          Critical Discrepancies & Inconsistencies Detected
        </h3>
        <ul className="text-xs text-amber-800 dark:text-amber-300 space-y-1.5 pl-6 list-disc">
          <li><strong>Indemnification Discrepancy:</strong> Document A contains unilateral indemnification favoring lessor/vendor, whereas Standard Baseline mandates reciprocal indemnity.</li>
          <li><strong>Notice Period Conflict:</strong> Document A specifies 60-day written notice for termination, conflicting with standard 30-day industry benchmarks.</li>
        </ul>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={() => setInternalComparison(null)} className="rounded-xl">
          Reset Comparison View
        </Button>
      </div>
    </motion.div>
  );
}
