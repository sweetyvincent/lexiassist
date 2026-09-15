'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { RiskAnalysis, ClauseAnalysis, RiskCategory } from '@/types/analysis';

interface RiskMatrixTabProps {
  analysis: RiskAnalysis | null;
  isLoading: boolean;
  onClauseClick: (clauseId: string) => void;
}

export function RiskMatrixTab({ analysis, isLoading, onClauseClick }: RiskMatrixTabProps) {
  const [expandedRow, setExpandedRow] = React.useState<string | null>(null);
  const [sortBy, setSortBy] = React.useState<'score' | 'category'>('score');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[300px] w-full rounded-xl" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!analysis) {
    return <div>No analysis data available.</div>;
  }

  const chartData = analysis.categories?.map((c: RiskCategory) => ({
    subject: c.label,
    score: c.score,
    threshold: 50,
  })) || [];

  const sortedClauses = [...(analysis.clauses || [])].sort((a, b) => {
    if (sortBy === 'score') return b.riskScore - a.riskScore;
    return a.category.localeCompare(b.category);
  });

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'low': return 'bg-green-500/10 text-green-500 border-green-500/20';
      default: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  return (
    <div className="space-y-6 pb-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-[320px] w-full bg-card rounded-xl border p-4 flex flex-col flex-shrink-0"
      >
        <h3 className="text-base font-semibold mb-2 text-center">Risk Categories</h3>
        <div className="flex-1 min-h-0 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar
              name="Current Risk"
              dataKey="score"
              stroke="#ef4444"
              fill="#ef4444"
              fillOpacity={0.5}
            />
            <Radar
              name="Threshold"
              dataKey="threshold"
              stroke="#3b82f6"
              fill="none"
              strokeDasharray="3 3"
            />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
        </div>
      </motion.div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Clause Risks</h3>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'score' | 'category')}
            className="text-sm border rounded p-1 bg-background"
          >
            <option value="score">Sort by Score</option>
            <option value="category">Sort by Category</option>
          </select>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { transition: { staggerChildren: 0.05 } }
          }}
          className="space-y-2"
        >
          {sortedClauses.map((clause) => (
            <motion.div
              key={clause.clauseId}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 }
              }}
              className="border rounded-lg bg-card overflow-hidden"
            >
              <div 
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50"
                onClick={() => {
                  setExpandedRow(expandedRow === clause.clauseId ? null : clause.clauseId);
                  onClauseClick(clause.clauseId);
                }}
              >
                <div className="flex items-center space-x-4 flex-1">
                  <Badge variant="outline" className={`w-20 justify-center ${getRiskColor(clause.riskLevel)}`}>
                    {clause.riskLevel.toUpperCase()}
                  </Badge>
                  <span className="font-medium flex-1">{clause.title}</span>
                  <Badge variant="secondary">{clause.category}</Badge>
                  <span className="text-sm text-muted-foreground w-12 text-right">{clause.riskScore}/100</span>
                </div>
                <Button variant="ghost" size="icon" className="ml-2 h-8 w-8">
                  {expandedRow === clause.clauseId ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
              
              <AnimatePresence>
                {expandedRow === clause.clauseId && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t"
                  >
                    <div className="p-4 space-y-4 bg-muted/20 text-sm">
                      <div>
                        <h4 className="font-semibold text-xs text-muted-foreground uppercase mb-1">Explanation</h4>
                        <p>{clause.explanation}</p>
                      </div>
                      {clause.recommendations && clause.recommendations.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-xs text-muted-foreground uppercase mb-1">Recommendations</h4>
                          <ul className="list-disc pl-4 space-y-1">
                            {clause.recommendations.map((rec, i) => (
                              <li key={i}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-xs text-muted-foreground uppercase mb-1">Original Text</h4>
                        <p className="font-mono text-xs p-2 bg-muted rounded">{clause.originalText}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
