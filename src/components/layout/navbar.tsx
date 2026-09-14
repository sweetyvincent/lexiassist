'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { Scale, Sun, Moon, Menu } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

/**
 * Global navigation bar for LexiAssist
 */
export function Navbar() {
  const { theme, setTheme } = useTheme();
  // Mock useAuth if not fully implemented yet
  const { user, signOut } = useAuth?.() || { user: null, signOut: () => {} };
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 border-b bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="flex flex-col gap-4 mt-8">
                {user && (
                  <>
                    <a href="/dashboard" className="text-sm font-medium">Dashboard</a>
                    <a href="/documents" className="text-sm font-medium">Documents</a>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          <a href="/" className="flex items-center gap-2">
            <Scale className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              LexiAssist
            </span>
          </a>
        </div>

        {user && (
          <nav className="hidden md:flex items-center gap-6">
            <a href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </a>
            <a href="/documents" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Documents
            </a>
          </nav>
        )}

        <div className="flex items-center gap-4">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL || ''} alt={user.email || 'User'} />
                    <AvatarFallback>{user.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button>Sign In</Button>
          )}
        </div>
      </div>
    </motion.header>
  );
}
