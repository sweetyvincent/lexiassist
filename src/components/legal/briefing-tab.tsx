'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Download, Printer, Copy, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { RiskAnalysis } from '@/types/analysis';

interface BriefingTabProps {
  analysis: RiskAnalysis | null;
  documentId: string;
  isLoading: boolean;
}

export function BriefingTab({ analysis, documentId, isLoading }: BriefingTabProps) {
  const [isGenerated, setIsGenerated] = React.useState(false);
  const [checkedItems, setCheckedItems] = React.useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText("# Attorney Briefing\n\nExecutive Summary...");
  };

  const handleDownload = () => {
    const blob = new Blob(["# Attorney Briefing\n\nExecutive Summary..."], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `briefing-${documentId}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-end space-x-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
        </div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-8 w-32 mt-8" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!isGenerated) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4 border rounded-lg bg-muted/10">
        <FileText className="w-12 h-12 text-muted-foreground/50" />
        <h3 className="text-xl font-semibold">Attorney Preparation Briefing</h3>
        <p className="text-sm text-muted-foreground max-w-md text-center">
          Generate a structured briefing document tailored for legal review, including executive summaries, prioritized risks, and action items.
        </p>
        <Button onClick={() => setIsGenerated(true)} className="mt-4">
          Generate Briefing
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { transition: { staggerChildren: 0.1 } }
      }}
      className="space-y-8"
    >
      <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="flex justify-between items-center border-b pb-4">
        <h2 className="text-2xl font-bold">Attorney Briefing</h2>
        <div className="flex space-x-2 print:hidden">
          <Button variant="outline" size="icon" onClick={handleDownload} title="Download Markdown">
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handlePrint} title="Print as PDF">
            <Printer className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleCopy} title="Copy to Clipboard">
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      <motion.section variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
        <h3 className="text-lg font-semibold mb-2 border-b pb-1">Executive Summary</h3>
        <p className="text-sm text-foreground/80 leading-relaxed">
          {analysis?.summary || `This document has an overall risk profile assessed as ${analysis?.overallRiskLevel || 'moderate'} with a score of ${analysis?.overallScore || 0}/100. Primary concerns and key clauses are detailed below.`}
        </p>
      </motion.section>

      <motion.section variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
        <h3 className="text-lg font-semibold mb-3 border-b pb-1">Key Risks for Review</h3>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-2 font-medium w-1/3">Risk Area</th>
                <th className="px-4 py-2 font-medium w-24">Level</th>
                <th className="px-4 py-2 font-medium">Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {analysis?.clauses?.filter((c: any) => c.riskLevel !== 'low').map((clause: any, index: number) => (
                <tr key={clause.clauseId || clause.id || index} className="bg-card">
                  <td className="px-4 py-3 font-medium">{clause.title}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${
                      clause.riskLevel === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                    }`}>
                      {clause.riskLevel.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{clause.recommendation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>

      <motion.section variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
        <h3 className="text-lg font-semibold mb-3 border-b pb-1">Action Items Checklist</h3>
        <div className="space-y-2">
          {['Review indemnification carve-outs', 'Verify governing law aligns with company policy', 'Confirm payment terms with Finance'].map((item, i) => (
            <label key={i} className="flex items-start space-x-3 cursor-pointer p-2 hover:bg-muted/30 rounded">
              <input 
                type="checkbox" 
                className="mt-1 w-4 h-4 rounded border-input"
                checked={checkedItems[`action-${i}`] || false}
                onChange={() => toggleCheck(`action-${i}`)}
              />
              <span className={`text-sm ${checkedItems[`action-${i}`] ? 'line-through text-muted-foreground' : ''}`}>{item}</span>
            </label>
          ))}
        </div>
      </motion.section>

      <motion.section variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
        <h3 className="text-lg font-semibold mb-3 border-b pb-1">Questions for Attorney</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-foreground/80 pl-2">
          <li>Does the liability cap adequately cover potential breach scenarios?</li>
          <li>Are the termination for convenience clauses reciprocal?</li>
          <li>Is the data processing addendum compliant with our latest standard?</li>
        </ol>
      </motion.section>
    </motion.div>
  );
}
