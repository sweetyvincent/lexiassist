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
import { ChevronDown, ChevronUp, ShieldAlert, Sparkles } from 'lucide-react';
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
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/30 glow-destructive';
      case 'medium': return 'bg-orange-500/10 text-orange-500 border-orange-500/30';
      case 'low': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30 glow-success';
      default: return 'bg-blue-500/10 text-blue-500 border-blue-500/30 glow-primary';
    }
  };

  return (
    <div className="space-y-6 pb-6 perspective-1000">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-[320px] w-full bg-card glass-3d rounded-2xl border p-4 flex flex-col flex-shrink-0 card-3d shadow-lg"
      >
        <h3 className="text-base font-bold mb-2 text-center flex items-center justify-center gap-2">
          <ShieldAlert className="w-4 h-4 text-primary" />
          <span>Risk Category Multi-Axis Radar</span>
        </h3>
        <div className="flex-1 min-h-0 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
              <PolarGrid stroke="currentColor" strokeOpacity={0.15} />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.8 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar
                name="Current Risk"
                dataKey="score"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.45}
              />
              <Radar
                name="Threshold"
                dataKey="threshold"
                stroke="#3b82f6"
                fill="none"
                strokeDasharray="3 3"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  borderColor: 'rgba(59, 130, 246, 0.4)',
                  borderRadius: '12px',
                  color: '#fff',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold flex items-center gap-2">
            <span>Clause Risks & Breakdown</span>
            <Badge variant="outline" className="text-xs rounded-full px-2.5 py-0.5">
              {sortedClauses.length} Analyzed
            </Badge>
          </h3>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'score' | 'category')}
            className="text-xs border rounded-lg p-1.5 bg-background font-medium focus:ring-2 focus:ring-primary focus:outline-none transition-shadow shadow-sm hover:shadow"
          >
            <option value="score">Sort by Highest Risk</option>
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
          className="space-y-2.5"
        >
          {sortedClauses.map((clause) => (
            <motion.div
              key={clause.clauseId}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 }
              }}
              className="border rounded-xl bg-card card-3d overflow-hidden shadow-sm"
            >
              <div 
                className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-muted/40 transition-colors"
                onClick={() => {
                  setExpandedRow(expandedRow === clause.clauseId ? null : clause.clauseId);
                  onClauseClick(clause.clauseId);
                }}
              >
                <div className="flex items-center space-x-3.5 flex-1 min-w-0">
                  <Badge variant="outline" className={`w-20 justify-center font-bold text-[10px] tracking-wider py-1 rounded-md ${getRiskColor(clause.riskLevel)}`}>
                    {clause.riskLevel.toUpperCase()}
                  </Badge>
                  <span className="font-semibold text-sm flex-1 truncate">{clause.title}</span>
                  <Badge variant="secondary" className="capitalize text-xs rounded-md">
                    {clause.category}
                  </Badge>
                  <span className="text-xs font-bold text-muted-foreground w-14 text-right">
                    {clause.riskScore}/100
                  </span>
                </div>
                <Button variant="ghost" size="icon" className="ml-2 h-8 w-8 rounded-lg shrink-0">
                  {expandedRow === clause.clauseId ? <ChevronUp className="h-4 w-4 text-primary" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
              
              <AnimatePresence>
                {expandedRow === clause.clauseId && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t bg-muted/20"
                  >
                    <div className="p-4 space-y-3.5 text-xs">
                      <div>
                        <h4 className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Explanation</h4>
                        <p className="text-foreground/90 leading-relaxed">{clause.explanation}</p>
                      </div>
                      {clause.recommendations && clause.recommendations.length > 0 && (
                        <div>
                          <h4 className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Recommendations</h4>
                          <ul className="list-disc pl-4 space-y-1 text-emerald-700 dark:text-emerald-300">
                            {clause.recommendations.map((rec, i) => (
                              <li key={i}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Original Text</h4>
                        <p className="font-mono text-[11px] p-2.5 bg-muted/80 rounded-lg border leading-relaxed">{clause.originalText}</p>
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
