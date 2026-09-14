'use client';

import React, { useCallback } from 'react';
import { useDropzone, DropzoneOptions } from 'react-dropzone';
import { motion } from 'framer-motion';
import { UploadCloud, AlertCircle, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

/**
 * Props for the UploadZone component.
 */
export interface UploadZoneProps {
  /** Callback fired when a file is accepted */
  onFileAccepted: (file: File) => void;
  /** Whether a file is currently uploading/parsing */
  isUploading?: boolean;
  /** Upload/parse progress (0-100) */
  progress?: number;
  /** Error message to display, if any */
  error?: string | null;
  /** Optional class name */
  className?: string;
}

/**
 * A drag-and-drop file upload zone for legal documents.
 * 
 * @param {UploadZoneProps} props - Component props.
 * @returns {JSX.Element} The rendered UploadZone component.
 */
export function UploadZone({
  onFileAccepted,
  isUploading = false,
  progress = 0,
  error = null,
  className,
}: UploadZoneProps): JSX.Element {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileAccepted(acceptedFiles[0]);
      }
    },
    [onFileAccepted]
  );

  const dropzoneOptions: DropzoneOptions = {
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
    disabled: isUploading,
  };

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone(dropzoneOptions);
  const { onDrag, ...rootProps } = getRootProps() as any;

  return (
    <motion.div
      {...rootProps}
      className={cn(
        'relative flex flex-col items-center justify-center w-full p-12 overflow-hidden border-2 border-dashed rounded-xl transition-colors cursor-pointer',
        isDragActive ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20' : 'border-border bg-background hover:bg-muted/50',
        isUploading ? 'pointer-events-none' : '',
        error ? 'border-destructive/50 bg-destructive/10' : '',
        className
      )}
      animate={{ scale: isDragActive ? 1.02 : 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      role="button"
      aria-label="Upload legal document"
      tabIndex={0}
    >
      <input {...getInputProps()} />
      
      {isUploading ? (
        <div className="flex flex-col items-center justify-center space-y-4 w-full max-w-sm">
          <FileText className="w-10 h-10 text-primary animate-pulse" />
          <div className="w-full space-y-2 text-center">
            <p className="text-sm font-medium">Parsing document...</p>
            {acceptedFiles[0] && (
              <p className="text-xs text-muted-foreground truncate">{acceptedFiles[0].name}</p>
            )}
            <Progress value={progress} className="h-2 w-full" />
          </div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center space-y-2 text-destructive text-center">
          <AlertCircle className="w-10 h-10" />
          <p className="text-sm font-medium">{error}</p>
          <p className="text-xs text-muted-foreground">Click or drag and drop to try again</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <UploadCloud className="w-10 h-10 text-muted-foreground mb-2" />
          <p className="text-base font-medium">Drag & drop your legal document here</p>
          <p className="text-sm text-muted-foreground">or click to browse</p>
          <p className="text-xs text-muted-foreground mt-4">PDF files up to 10MB</p>
        </div>
      )}
    </motion.div>
  );
}
