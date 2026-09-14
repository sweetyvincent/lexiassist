'use client';

import * as React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen } from 'lucide-react';

interface GlossaryPopoverProps {
  term: string;
  context: string;
  children: React.ReactNode;
}

export function GlossaryPopover({ term, context, children }: GlossaryPopoverProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [explanation, setExplanation] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchExplanation = async () => {
    if (explanation || isLoading) return;
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setExplanation(`This is a plain English explanation for "${term}". In this document's context: ${context.substring(0, 50)}...`);
    } catch (e) {
      setExplanation("Failed to load explanation.");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      fetchExplanation();
    }
  }, [isOpen, explanation, isLoading, term, context]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <span 
          className="border-b border-dashed border-primary/50 cursor-help hover:text-primary transition-colors"
          role="tooltip"
          aria-describedby={`glossary-${term.replace(/\s+/g, '-')}`}
        >
          {children}
        </span>
      </PopoverTrigger>
      <PopoverContent 
        id={`glossary-${term.replace(/\s+/g, '-')}`}
        className="w-80 p-4" 
        align="start"
      >
        <div className="space-y-3">
          <div className="flex items-center space-x-2 border-b pb-2">
            <BookOpen className="w-4 h-4 text-primary" />
            <h4 className="font-bold text-sm leading-none">{term}</h4>
          </div>
          
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-4 w-[80%]" />
            </div>
          ) : (
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold text-xs text-muted-foreground uppercase block mb-1">Definition</span>
                <p className="text-foreground/90">{explanation?.split('. In')[0]}.</p>
              </div>
              <div>
                <span className="font-semibold text-xs text-muted-foreground uppercase block mb-1">Context</span>
                <p className="text-muted-foreground">In{explanation?.split('. In')[1]}</p>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
