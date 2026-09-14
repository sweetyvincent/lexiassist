'use client';

import { useState } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { useDocument } from '@/hooks/use-document';
import { UploadZone } from '@/components/legal/upload-zone';
import { Sidebar } from '@/components/layout/sidebar';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Scale, Shield, FileText, MessageSquare, Zap, Lock } from 'lucide-react';

export default function Home() {
  const { isAuthenticated, signInWithGoogle, signInAsGuest } = useAuth();
  const router = useRouter();
  const { uploadDocument, loading: isUploading, error: uploadError } = useDocument();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleUploadSuccess = (docId: string) => {
    router.push(`/document/${docId}`);
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
      <div className="flex flex-col min-h-[calc(100vh-4rem)] items-center justify-center p-8 bg-gradient-to-b from-background to-muted/20">
        <div className="text-center max-w-3xl space-y-6 mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            AI-Powered Legal Document Analysis
          </h1>
          <p className="text-xl text-muted-foreground">
            Upload, analyze, and understand complex legal documents with enterprise-grade AI. Get actionable insights, risk assessments, and attorney-ready briefings — all for free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <button
              onClick={signInWithGoogle}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Get Started with Google
            </button>
            <button
              onClick={signInAsGuest}
              className="px-8 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
            >
              Try as Guest
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
          {[
            { icon: Shield, title: 'Risk Analysis', desc: 'Identify high-risk clauses and potential issues' },
            { icon: FileText, title: 'Smart Summaries', desc: 'Get plain-English summaries at any reading level' },
            { icon: MessageSquare, title: 'Document Q&A', desc: 'Ask questions and get cited answers' },
            { icon: Scale, title: 'Contract Comparison', desc: 'Compare documents side by side' },
            { icon: Zap, title: 'Attorney Prep', desc: 'Generate briefing sheets and checklists' },
            { icon: Lock, title: 'Privacy First', desc: 'PII redaction and local processing' },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow"
            >
              <feature.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        <p className="text-sm text-muted-foreground mt-16 text-center max-w-2xl">
          Disclaimer: This tool provides AI-assisted analysis and should not replace professional legal counsel.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <Sidebar 
        documents={[]}
        activeDocumentId={null}
        onSelectDocument={(id) => router.push(`/document/${id}`)}
        onDeleteDocument={() => {}}
        onUploadClick={() => {}}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <UploadZone 
            onFileAccepted={handleFileAccepted}
            isUploading={isUploading}
            error={uploadError?.message}
          />
          
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Recent Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="h-32 rounded-lg border bg-muted/50 animate-pulse" />
              <div className="h-32 rounded-lg border bg-muted/50 animate-pulse" />
              <div className="h-32 rounded-lg border bg-muted/50 animate-pulse" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
