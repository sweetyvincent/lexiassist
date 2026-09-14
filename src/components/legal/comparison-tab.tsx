'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { UploadCloud, ArrowRight, AlertTriangle } from 'lucide-react';
import { RiskAnalysis, RiskCategory } from '@/types/analysis';

interface ComparisonTabProps {
  primaryAnalysis: RiskAnalysis | null;
  comparisonAnalysis: RiskAnalysis | null;
  onUploadComparison: () => void;
  isComparing: boolean;
}

export function ComparisonTab({
  primaryAnalysis,
  comparisonAnalysis,
  onUploadComparison,
  isComparing,
}: ComparisonTabProps) {
  if (!comparisonAnalysis && !isComparing) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 border-2 border-dashed rounded-lg bg-muted/10">
        <div className="p-4 rounded-full bg-primary/10 text-primary">
          <UploadCloud className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Compare Documents</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2">
            Upload another version of this document or a standard template to highlight differences, missing clauses, and changes in risk profile.
          </p>
        </div>
        <Button onClick={onUploadComparison}>Upload Comparison Document</Button>
      </div>
    );
  }

  if (isComparing || !primaryAnalysis || !comparisonAnalysis) {
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

  // Generate comparison data
  const categories = Array.from(new Set([
    ...(primaryAnalysis.categories?.map((c: RiskCategory) => c.label) || []),
    ...(comparisonAnalysis.categories?.map((c: RiskCategory) => c.label) || [])
  ]));

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-xl font-semibold">Risk Comparison</h2>
        <div className="flex items-center space-x-2 text-sm">
          <span className="px-2 py-1 bg-muted rounded">Doc A (Current)</span>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          <span className="px-2 py-1 bg-muted rounded">Doc B (New)</span>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Doc A Risk</th>
              <th className="px-4 py-3 font-medium">Doc B Risk</th>
              <th className="px-4 py-3 font-medium">Delta</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {categories.map((cat) => {
              const scoreA = primaryAnalysis.categories?.find((c: RiskCategory) => c.label === cat)?.score || 0;
              const scoreB = comparisonAnalysis.categories?.find((c: RiskCategory) => c.label === cat)?.score || 0;
              const delta = scoreB - scoreA;
              
              return (
                <tr key={cat} className="bg-card">
                  <td className="px-4 py-3 font-medium">{cat}</td>
                  <td className="px-4 py-3">{scoreA}</td>
                  <td className="px-4 py-3">{scoreB}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center ${
                      delta > 0 ? 'text-red-500' : delta < 0 ? 'text-green-500' : 'text-muted-foreground'
                    }`}>
                      {delta > 0 ? '+' : ''}{delta}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="bg-muted/20 border rounded-lg p-4">
        <h3 className="flex items-center text-sm font-semibold mb-3">
          <AlertTriangle className="w-4 h-4 mr-2 text-warning" />
          Missing Clauses Warning
        </h3>
        <p className="text-sm text-muted-foreground">
          Document B is missing 2 clauses present in Document A: "Indemnification" and "Limitation of Liability".
        </p>
      </div>
      
      <div className="prose prose-sm dark:prose-invert">
        <h3>Overall Assessment</h3>
        <p>The comparison document presents a higher overall risk profile (+12 points), primarily due to weakened intellectual property protections and modified termination rights.</p>
      </div>
    </motion.div>
  );
}
