'use client';

import React from 'react';
import { BookOpen, FileText, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export type ReadingLevel = 'simple' | 'standard' | 'legal';

export interface ReadingLevelSwitcherProps {
  value: ReadingLevel;
  onChange: (level: ReadingLevel) => void;
  className?: string;
}

export function ReadingLevelSwitcher({ value, onChange, className }: ReadingLevelSwitcherProps) {
  const levels = [
    {
      id: 'simple',
      label: 'Simple',
      icon: BookOpen,
      tooltip: 'Plain English for non-experts',
    },
    {
      id: 'standard',
      label: 'Standard',
      icon: FileText,
      tooltip: 'Standard business language',
    },
    {
      id: 'legal',
      label: 'Legal',
      icon: Scale,
      tooltip: 'Original legal terminology',
    },
  ];

  return (
    <div 
      className={cn("inline-flex items-center rounded-lg border bg-background p-1", className)}
      role="radiogroup"
      aria-label="Reading level selector"
    >
      <TooltipProvider>
        {levels.map((level) => {
          const Icon = level.icon;
          const isActive = value === level.id;
          
          return (
            <Tooltip key={level.id}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  onClick={() => onChange(level.id as ReadingLevel)}
                  className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    isActive 
                      ? "bg-blue-600 text-white shadow-sm" 
                      : "bg-transparent hover:bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {level.label}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{level.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </TooltipProvider>
    </div>
  );
}
