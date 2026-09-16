'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, Volume2, VolumeX, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
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
    hidden: { opacity: 0, y: 12 },
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
      className="space-y-6 perspective-1000"
      aria-live="polite"
    >
      <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <span>Document Summary & Navigation</span>
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          </h2>
          <p className="text-xs text-muted-foreground">Adjust complexity or listen to key contract takeaways.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={toggleSpeech}
            className={`gap-1.5 text-xs h-8 rounded-lg font-medium transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${
              isSpeaking ? 'bg-primary text-primary-foreground hover:bg-primary/90 glow-primary' : ''
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
            className="text-xs border rounded-lg p-1.5 bg-background font-medium focus:ring-2 focus:ring-primary focus:outline-none transition-shadow shadow-sm hover:shadow"
            aria-label="Reading Level Switcher"
          >
            <option value="plain">Plain English View</option>
            <option value="standard">Standard Business View</option>
            <option value="attorney">Attorney Detailed View</option>
          </select>
        </div>
      </motion.div>

      {analysis && (
        <motion.div variants={itemVariants}>
          <div className={`inline-flex items-center space-x-2 p-3 rounded-xl border card-3d ${
            analysis.overallScore > 70 ? 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300 glow-destructive' :
            analysis.overallScore > 40 ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300' :
            'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 glow-success'
          }`}>
            <span className="font-bold text-lg">
              {analysis.overallRiskLevel} Risk Profile
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-white/60 dark:bg-black/40 text-sm font-semibold shadow-inner">
              {analysis.overallScore}/100
            </span>
          </div>
        </motion.div>
      )}

      {summary && (
        <motion.div variants={itemVariants} className="prose prose-sm dark:prose-invert max-w-none glass-3d p-4 rounded-xl border card-3d">
          {summary.split('\n').map((paragraph, index) => (
            paragraph.trim() && <p key={index}>{paragraph}</p>
          ))}
        </motion.div>
      )}

      {/* Rights & Obligations Breakdown with 3D Depth */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-emerald-500/30 bg-emerald-500/5 card-3d backdrop-blur-md">
          <CardHeader className="py-3 border-b border-emerald-500/20">
            <CardTitle className="text-sm font-semibold flex items-center text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4 mr-2" />
              Your Key Rights & Protections
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 text-xs space-y-2 text-foreground/80">
            <p className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 shrink-0" /> Right to terminate with written notice upon breach.</p>
            <p className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 shrink-0" /> Non-exclusive license to use provided deliverables.</p>
            <p className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 shrink-0" /> Ownership retention of pre-existing intellectual property.</p>
          </CardContent>
        </Card>

        <Card className="border-amber-500/30 bg-amber-500/5 card-3d backdrop-blur-md">
          <CardHeader className="py-3 border-b border-amber-500/20">
            <CardTitle className="text-sm font-semibold flex items-center text-amber-700 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Your Core Obligations & Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 text-xs space-y-2 text-foreground/80">
            <p className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2 shrink-0" /> Payment due within Net 30 days of invoice receipt.</p>
            <p className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2 shrink-0" /> Mandatory 60-day advance notice for non-renewal.</p>
            <p className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2 shrink-0" /> Maintaining strict confidentiality of proprietary data.</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Options and Next Steps Navigator with 3D depth */}
      <motion.div variants={itemVariants} className="border rounded-xl p-4 bg-card shadow-sm card-3d glass-3d space-y-3">
        <h3 className="text-sm font-semibold flex items-center">
          <ArrowRight className="w-4 h-4 mr-2 text-primary" />
          Recommended Next Steps & Action Options
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 border rounded-lg bg-emerald-500/5 border-emerald-500/20 text-xs card-3d">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">Option A: Accept Standard Terms</span>
            <p className="text-muted-foreground">Low-risk clauses are clear and aligned with market standards.</p>
          </div>
          <div className="p-3 border rounded-lg bg-amber-500/5 border-amber-500/20 text-xs card-3d">
            <span className="font-semibold text-amber-600 dark:text-amber-400 block mb-1">Option B: Request Clause Edits</span>
            <p className="text-muted-foreground">Propose reciprocal indemnification & liability caps.</p>
          </div>
          <div className="p-3 border rounded-lg bg-red-500/5 border-red-500/20 text-xs card-3d">
            <span className="font-semibold text-red-600 dark:text-red-400 block mb-1">Option C: Attorney Review</span>
            <p className="text-muted-foreground">Export Attorney Briefing sheet for expert consultation.</p>
          </div>
        </div>
      </motion.div>

      {analysis?.clauses && analysis.clauses.length > 0 && (
        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-semibold mb-3">Key Risk Findings & Inconsistencies</h3>
          <ul className="space-y-2.5">
            {analysis.clauses.filter((c: ClauseAnalysis) => c.riskLevel !== 'low').map((clause) => (
              <li key={clause.clauseId} className="flex items-start space-x-3 text-sm p-3.5 border rounded-xl bg-card card-3d shadow-sm">
                <span className="mt-0.5 p-1 rounded-md bg-muted">
                  {clause.riskLevel === 'high' ? (
                    <AlertCircle className="w-4 h-4 text-destructive" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-warning" />
                  )}
                </span>
                <span>
                  <strong className="font-semibold text-foreground">{clause.title}:</strong> {clause.explanation}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      <motion.p variants={itemVariants} className="text-xs text-muted-foreground mt-8 border-t pt-4">
        Disclaimer: Informational assistance only. This platform does not replace professional legal advice. Always consult a qualified attorney for contractual decisions.
      </motion.p>
    </motion.div>
  );
}
