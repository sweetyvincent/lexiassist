import * as React from 'react';
import { motion } from 'framer-motion';
import { Download, Printer, Copy, FileText, Calendar, Globe, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { RiskAnalysis } from '@/types/analysis';

interface BriefingTabProps {
  analysis: RiskAnalysis | null;
  documentId: string;
  isLoading: boolean;
}

export function BriefingTab({ analysis, documentId, isLoading }: BriefingTabProps) {
  const [isGenerated, setIsGenerated] = React.useState(false);
  const [checkedItems, setCheckedItems] = React.useState<Record<string, boolean>>({});
  const [jurisdiction, setJurisdiction] = React.useState<string>('delaware');

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

  const handleExportICS = () => {
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//LexiAssist Legal Intelligence//EN',
      'BEGIN:VEVENT',
      'SUMMARY:Contract Renewal Notice Deadline (30 Days Prior)',
      'DESCRIPTION:Extracted Obligation: Written notice of non-renewal required at least 30 days prior to end of term.',
      'DTSTART:20261015T090000Z',
      'DTEND:20261015T100000Z',
      'END:VEVENT',
      'BEGIN:VEVENT',
      'SUMMARY:Contract Payment Due Date (Net 30)',
      'DESCRIPTION:Extracted Obligation: Invoices due within 30 days of receipt.',
      'DTSTART:20261101T090000Z',
      'DTEND:20261101T100000Z',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contract-obligations-${documentId}.ics`;
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
      <div className="flex flex-col items-center justify-center py-16 space-y-4 border rounded-2xl bg-card glass-3d card-3d shadow-lg p-8">
        <FileText className="w-12 h-12 text-primary" />
        <h3 className="text-xl font-bold">Attorney Preparation Briefing & Export Suite</h3>
        <p className="text-sm text-muted-foreground max-w-md text-center">
          Generate a structured briefing document tailored for legal review, including executive summaries, prioritized risks, jurisdiction context, and calendar (.ics) obligations.
        </p>
        <Button onClick={() => setIsGenerated(true)} className="mt-4 shadow-md hover:shadow-lg transition-shadow">
          Generate Full Briefing
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
      className="space-y-8 pb-8 perspective-1000"
    >
      <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="flex justify-between items-center border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span>Attorney Briefing</span>
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
              Jurisdiction Ready
            </Badge>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">Pre-formatted structured audit report for attorney consultation</p>
        </div>
        <div className="flex items-center space-x-2 print:hidden">
          <div className="flex items-center gap-1.5 mr-2 bg-muted/40 p-1 rounded-lg border text-xs font-medium">
            <Globe className="w-3.5 h-3.5 text-primary" />
            <select
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
              className="bg-transparent font-semibold border-none focus:outline-none text-xs"
            >
              <option value="delaware">Delaware (US)</option>
              <option value="california">California (US)</option>
              <option value="newyork">New York (US)</option>
              <option value="federal">US Federal Law</option>
              <option value="uk">UK (England & Wales)</option>
              <option value="general">General Commercial</option>
            </select>
          </div>
          <Button variant="outline" size="sm" onClick={handleExportICS} title="Export Calendar (.ics)" className="gap-1.5 text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5 text-emerald-500" />
            .ICS Calendar
          </Button>
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

      <motion.div
        variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
        className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5"
      >
        <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
        <div>
          <span className="font-bold">Jurisdiction Notice ({jurisdiction.toUpperCase()}): </span>
          Legal standards regarding indemnification caps and non-compete enforceability differ significantly under {jurisdiction.toUpperCase()} law. This analysis provides informational guidance and is not formal legal advice.
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
        <div className="border rounded-xl overflow-hidden shadow-sm bg-card">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="px-4 py-2.5 font-bold w-1/3">Risk Area</th>
                <th className="px-4 py-2.5 font-bold w-24">Level</th>
                <th className="px-4 py-2.5 font-bold">Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {analysis?.clauses?.filter((c: any) => c.riskLevel !== 'low').map((clause: any, index: number) => (
                <tr key={clause.clauseId || clause.id || index} className="bg-card hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-semibold">{clause.title}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                      clause.riskLevel === 'high' ? 'bg-red-500/15 text-red-600 border border-red-500/30' : 'bg-amber-500/15 text-amber-600 border border-amber-500/30'
                    }`}>
                      {clause.riskLevel.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{clause.recommendation || (clause.recommendations && clause.recommendations[0])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>

      <motion.section variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
        <div className="flex items-center justify-between border-b pb-1 mb-3">
          <h3 className="text-lg font-semibold">Contract Obligation & Deadline Checklist</h3>
          <Button variant="ghost" size="sm" onClick={handleExportICS} className="text-xs text-primary gap-1">
            <Calendar className="w-3.5 h-3.5" />
            Sync to Calendar (.ics)
          </Button>
        </div>
        <div className="space-y-2">
          {[
            { id: 'action-0', title: 'Review indemnification carve-outs (30 days before effective date)' },
            { id: 'action-1', title: 'Verify governing law aligns with company policy' },
            { id: 'action-2', title: 'Confirm payment terms (Net 30) with Finance' },
            { id: 'action-3', title: 'Schedule 60-day auto-renewal cancellation window reminder' }
          ].map((item) => (
            <label key={item.id} className="flex items-start space-x-3 cursor-pointer p-3 border rounded-xl hover:bg-muted/30 bg-card transition-colors shadow-sm">
              <input 
                type="checkbox" 
                className="mt-0.5 w-4 h-4 rounded border-input"
                checked={checkedItems[item.id] || false}
                onChange={() => toggleCheck(item.id)}
              />
              <span className={`text-sm font-medium ${checkedItems[item.id] ? 'line-through text-muted-foreground' : ''}`}>{item.title}</span>
            </label>
          ))}
        </div>
      </motion.section>

      <motion.section variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
        <h3 className="text-lg font-semibold mb-3 border-b pb-1">Questions Prepared for Legal Counsel</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-foreground/80 pl-2">
          <li>Does the liability cap adequately cover potential breach scenarios in {jurisdiction.toUpperCase()}?</li>
          <li>Are the termination for convenience clauses reciprocal?</li>
          <li>Is the data processing addendum compliant with our latest security standards?</li>
        </ol>
      </motion.section>
    </motion.div>
  );
}
