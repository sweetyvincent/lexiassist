'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DisclaimerBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('lexiassist_disclaimer_dismissed');
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('lexiassist_disclaimer_dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div 
      className="flex items-start sm:items-center justify-between p-3 px-4 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-sm w-full transition-all"
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center mr-4">
        <AlertTriangle className="w-5 h-5 mr-3 shrink-0 text-amber-600 dark:text-amber-500" />
        <p className="font-medium">
          <span className="font-bold mr-1">Disclaimer:</span>
          LexiAssist is an AI tool and does not provide legal advice. Always consult a qualified attorney for legal matters.
        </p>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-6 w-6 text-amber-600 hover:text-amber-900 hover:bg-amber-100 dark:text-amber-500 dark:hover:text-amber-200 dark:hover:bg-amber-900/50 shrink-0" 
        onClick={handleDismiss}
        aria-label="Dismiss disclaimer"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
