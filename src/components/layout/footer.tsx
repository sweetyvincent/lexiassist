'use client';

import { usePathname } from 'next/navigation';

/**
 * Global footer for LexiAssist
 */
export function Footer() {
  const pathname = usePathname();

  // Hide footer on document workbench pages to allow full viewport utilization
  if (pathname?.includes('/document')) {
    return null;
  }

  return (
    <footer className="w-full border-t bg-white dark:bg-zinc-950 py-6 mt-auto">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground whitespace-nowrap">
          @2026LexiAssist
        </p>
        
        <p className="text-xs text-muted-foreground text-center max-w-lg">
          LexiAssist provides informational assistance only. This is not legal advice. Always consult a qualified attorney.
        </p>
      </div>
    </footer>
  );
}
