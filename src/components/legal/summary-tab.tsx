'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RiskAnalysis, ReadingLevel, ClauseAnalysis } from '@/types/analysis';

interface SummaryTabProps {
  summary: string | null;
  analysis: RiskAnalysis | null;
  readingLevel: ReadingLevel;
  onReadingLevelChange: (level: ReadingLevel) => void;
  isLoading: boolean;
}

export function SummaryTab({
  summary,
  analysis,
  readingLevel,
  onReadingLevelChange,
  isLoading,
}: SummaryTabProps) {
  const [isSpeaking, setIsSpeaking] = React.useState(false);

  const toggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const textToSpeak = summary || analysis?.summary || '';
    if (!textToSpeak) return;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  React.useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-32" />
        </div>
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="h-4 w-[80%]" />
        <Skeleton className="h-4 w-[60%]" />
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
      aria-live="polite"
    >
      <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Document Summary</h2>
          <p className="text-xs text-muted-foreground">Adjust complexity or listen to key contract takeaways.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={toggleSpeech}
            className={`gap-1.5 text-xs h-8 rounded-lg font-medium transition-colors ${
              isSpeaking ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''
            }`}
            aria-label={isSpeaking ? "Stop reading summary" : "Listen to summary"}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-3.5 h-3.5 animate-pulse text-red-400" />
                <span>Stop Audio</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen (TTS)</span>
              </>
            )}
          </Button>

          <select
            value={readingLevel}
            onChange={(e) => onReadingLevelChange(e.target.value as ReadingLevel)}
            className="text-xs border rounded-lg p-1.5 bg-background font-medium focus:ring-1 focus:ring-primary focus:outline-none"
            aria-label="Reading Level Switcher"
          >
            <option value="plain">Plain English</option>
            <option value="standard">Standard Business</option>
            <option value="attorney">Attorney View</option>
          </select>
        </div>
      </motion.div>

      {analysis && (
        <motion.div variants={itemVariants}>
          <div className={`inline-flex items-center space-x-2 p-3 rounded-lg border ${
            analysis.overallScore > 70 ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-900 dark:text-red-300' :
            analysis.overallScore > 40 ? 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-900 dark:text-amber-300' :
            'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-900 dark:text-green-300'
          }`}>
            <span className="font-bold text-lg">
              {analysis.overallRiskLevel} Risk
            </span>
            <span className="px-2 py-0.5 rounded bg-white/50 dark:bg-black/20 text-sm font-medium">
              {analysis.overallScore}/100
            </span>
          </div>
        </motion.div>
      )}

      {summary && (
        <motion.div variants={itemVariants} className="prose prose-sm dark:prose-invert max-w-none">
          {summary.split('\n').map((paragraph, index) => (
            paragraph.trim() && <p key={index}>{paragraph}</p>
          ))}
        </motion.div>
      )}

      {analysis?.clauses && analysis.clauses.length > 0 && (
        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-semibold mb-3">Key Findings</h3>
          <ul className="space-y-2">
            {analysis.clauses.filter((c: ClauseAnalysis) => c.riskLevel !== 'low').map((clause) => (
              <li key={clause.clauseId} className="flex items-start space-x-2 text-sm">
                <span className="mt-0.5">
                  {clause.riskLevel === 'high' ? (
                    <AlertCircle className="w-4 h-4 text-destructive" />
                  ) : clause.riskLevel === 'medium' ? (
                    <AlertTriangle className="w-4 h-4 text-warning" />
                  ) : (
                    <Info className="w-4 h-4 text-blue-500" />
                  )}
                </span>
                <span>
                  <strong className="font-medium">{clause.title}:</strong> {clause.explanation}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm text-muted-foreground">Document ID</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{analysis?.documentId || 'Unknown'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm text-muted-foreground">Reading Level</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium capitalize">{analysis?.readingLevel || 'Standard'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm text-muted-foreground">Clauses Analyzed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{analysis?.clauses?.length || 0} clauses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm text-muted-foreground">Risk Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{analysis?.categories?.length || 0} categories</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.p variants={itemVariants} className="text-xs text-muted-foreground mt-8 border-t pt-4">
        Disclaimer: This summary is generated by AI and is for informational purposes only. It does not constitute legal advice. Please consult with a qualified attorney for legal matters.
      </motion.p>
    </motion.div>
  );
}
