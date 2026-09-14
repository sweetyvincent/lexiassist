'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

// Define LegalDocument locally or import from types if available
export interface LegalDocument {
  id: string;
  title: string;
  status: string;
  createdAt: string;
}

interface SidebarProps {
  documents: LegalDocument[];
  activeDocumentId: string | null;
  onSelectDocument: (id: string) => void;
  onDeleteDocument: (id: string) => void;
  onUploadClick: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isLoading?: boolean;
}

/**
 * Sidebar for document navigation and management
 */
export function Sidebar({
  documents,
  activeDocumentId,
  onSelectDocument,
  onDeleteDocument,
  onUploadClick,
  isCollapsed,
  onToggleCollapse,
  isLoading = false,
}: SidebarProps) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="hidden md:flex flex-col h-full border-r bg-white dark:bg-zinc-950 transition-all duration-300 z-10"
    >
      <div className="p-4 flex items-center justify-between border-b">
        {!isCollapsed && <h2 className="font-semibold text-lg">Documents</h2>}
        <div className="flex items-center gap-2">
          {!isCollapsed && (
            <Button variant="outline" size="icon" onClick={onUploadClick} aria-label="Upload New">
              <Plus className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={onToggleCollapse} aria-label="Toggle Sidebar">
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : documents.length === 0 ? (
          !isCollapsed && (
            <p className="text-sm text-muted-foreground text-center mt-4">
              No documents yet. Upload your first document to get started.
            </p>
          )
        ) : (
          <ul className="space-y-2">
            <AnimatePresence>
              {documents.map((doc) => (
                <motion.li
                  key={doc.id}
                  layoutId={`doc-${doc.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <button
                    onClick={() => onSelectDocument(doc.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors text-left ${
                      activeDocumentId === doc.id
                        ? 'bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900'
                        : 'hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                      {!isCollapsed && (
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-sm font-medium truncate">{doc.title}</span>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                            <span className="px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800">
                              {doc.status}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    {!isCollapsed && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Are you sure you want to delete this document?')) {
                            onDeleteDocument(doc.id);
                          }
                        }}
                        aria-label="Delete document"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </motion.aside>
  );
}
