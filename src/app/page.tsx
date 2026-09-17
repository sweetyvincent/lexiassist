'use client';

import { useState } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { useDocument } from '@/hooks/use-document';
import { UploadZone } from '@/components/legal/upload-zone';
import { Sidebar } from '@/components/layout/sidebar';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Scale, 
  ShieldCheck, 
  FileText, 
  MessageSquare, 
  Sparkles, 
  Lock, 
  ArrowRight,
  CheckCircle2,
  Zap,
  FileSearch
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Hero3DCanvas } from '@/components/ui/hero-3d-canvas';
import { Card3DTilt } from '@/components/ui/card-3d-tilt';

export default function Home() {
  const { user, isAuthenticated, signInWithGoogle, signInAsGuest } = useAuth();
  const router = useRouter();
  const { uploadDocument, loading: isUploading, error: uploadError } = useDocument();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleUploadSuccess = (docId: string) => {
    router.push(`/document/demo?doc=${docId}`);
  };

  const handleFileAccepted = async (file: File) => {
    try {
      const id = await uploadDocument(file);
      handleUploadSuccess(id);
    } catch {
      // Handled by hook
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="relative overflow-hidden min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6 md:p-12 perspective-1000">
        {/* Interactive 3D Canvas Background */}
        <Hero3DCanvas />

        {/* Ambient Glow Orbs */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-tr from-blue-600/20 via-indigo-500/20 to-purple-500/10 blur-[130px] rounded-full" />
          <div className="absolute top-1/2 -right-40 w-[600px] h-[400px] bg-gradient-to-br from-violet-500/15 to-transparent blur-[120px] rounded-full" />
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-4xl space-y-6 mb-16 pt-8">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2"
          >
            <Badge variant="outline" className="px-4 py-1.5 text-xs font-semibold rounded-full border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 gap-1.5 shadow-sm glow-primary backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Powered by Google AI Studio Free Tier & Gemini 1.5 Flash
            </Badge>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.15] font-display"
          >
            Smarter Contract Insights,{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
              Zero Legal Blindspots.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Upload commercial leases, employment contracts, and NDAs. Interrogate them with our split-screen workbench, uncover hidden liabilities, and export briefing sheets in seconds.
          </motion.p>

          {/* Call to Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
          >
            <Button
              size="lg"
              onClick={signInWithGoogle}
              className="w-full sm:w-auto h-12 px-8 rounded-xl font-semibold shadow-lg shadow-blue-500/25 bg-blue-600 hover:bg-blue-700 text-white transition-all transform hover:-translate-y-1 active:translate-y-0 gap-2.5 glow-primary"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              Get Started with Google
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={signInAsGuest}
              className="w-full sm:w-auto h-12 px-8 rounded-xl font-semibold border-2 hover:bg-muted/60 transition-all transform hover:-translate-y-1 active:translate-y-0 gap-2 glass-3d"
            >
              Explore as Guest
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </Button>
          </motion.div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Client-side PII Scrubbing</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Free Forever</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Local Storage</span>
          </div>
        </div>

        {/* Feature Grid with 3D Tilt Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
          {[
            { 
              icon: ShieldCheck, 
              title: 'Risk Radar & Heatmaps', 
              desc: 'Identifies high-risk indemnification clauses, uncapped damages, and one-sided liabilities.',
              badge: 'Visual Analytics' 
            },
            { 
              icon: FileText, 
              title: 'Triple-Tier Summaries', 
              desc: 'Toggle between Plain English, Standard Business, and Detailed Legal breakdown in real-time.',
              badge: 'Multi-Reading Level' 
            },
            { 
              icon: MessageSquare, 
              title: 'Cited Document Q&A', 
              desc: 'Ask questions with exact paragraph and page citations highlighted automatically in the document.',
              badge: 'RAG Powered' 
            },
            { 
              icon: Scale, 
              title: 'Side-by-Side Comparison', 
              desc: 'Detects redline revisions, missing protections, and shifts in contract balance between two drafts.',
              badge: 'Contract Diff' 
            },
            { 
              icon: Zap, 
              title: 'Attorney Preparation Sheet', 
              desc: 'Export actionable Markdown or print-ready briefing summaries tailored for consultation with counsel.',
              badge: 'Export Ready' 
            },
            { 
              icon: Lock, 
              title: 'Absolute Client Confidentiality', 
              desc: 'Client-side PII redaction strips SSNs, phone numbers, and bank details before passing text to the LLM.',
              badge: 'Privacy First' 
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
            >
              <Card3DTilt className="p-7 h-full flex flex-col justify-between glass-3d">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shadow-inner">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase px-2.5 py-0.5 rounded-full bg-muted/60">
                      {feature.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 tracking-tight font-display">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              </Card3DTilt>
            </motion.div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-16 text-center max-w-2xl border-t pt-6">
          Legal Disclaimer: LexiAssist is an AI-powered legal intelligence system designed for informational analysis only. It does not provide formal legal counsel or replace a licensed attorney.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      <Sidebar 
        documents={[]}
        activeDocumentId={null}
        onSelectDocument={(id) => router.push(`/document/${id}`)}
        onDeleteDocument={() => {}}
        onUploadClick={() => {}}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      <main className="flex-1 p-6 md:p-10 overflow-y-auto custom-scrollbar">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight font-display">Legal Workbench Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Welcome back, {user?.displayName || 'Counsel'}. Upload a contract to begin automated clause risk assessment.
              </p>
            </div>

            <Button 
              variant="outline"
              size="sm"
              onClick={() => router.push('/document/demo')}
              className="gap-2 rounded-xl font-medium border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 shadow-sm"
            >
              <FileSearch className="w-4 h-4" />
              Open Sample Contract
            </Button>
          </div>

          {/* Upload Area */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight">Upload Document for Analysis</h2>
            <UploadZone 
              onFileAccepted={handleFileAccepted}
              isUploading={isUploading}
              error={uploadError?.message}
            />
          </div>
          
          {/* Recent Documents Section */}
          <div className="pt-4 space-y-4">
            <h2 className="text-lg font-semibold tracking-tight">Sample & Recent Analyses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <Card3DTilt 
                className="p-5 cursor-pointer space-y-3 glass-3d"
              >
                <div onClick={() => router.push('/document/demo')} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                      Sample Lease
                    </Badge>
                    <span className="text-xs text-muted-foreground">Demo Doc</span>
                  </div>
                  <h3 className="font-bold text-base line-clamp-1 font-display">Master Services Agreement (Sample Draft)</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    Commercial consulting contract with indemnification and termination clauses.
                  </p>
                  <div className="flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 pt-1">
                    Examine Risk Profile <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </div>
              </Card3DTilt>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
