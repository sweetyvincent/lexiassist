'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { Scale, Sun, Moon, Sparkles, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

/**
 * Global navigation bar for LexiAssist with polished SaaS styling
 */
export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { user, signOut, signInWithGoogle, signInAsGuest } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 left-0 right-0 z-50 border-b bg-background/80 dark:bg-zinc-950/80 backdrop-blur-xl transition-colors"
    >
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/lexiassist/" className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Scale className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-300 dark:to-violet-400 bg-clip-text text-transparent">
                  LexiAssist
                </span>
                <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider py-0 px-1.5 h-4 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  Free
                </Badge>
              </div>
            </div>
          </a>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              className="h-9 w-9 rounded-xl border bg-background/50 hover:bg-muted/60 transition-colors"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400 transition-transform" />
              ) : (
                <Moon className="h-4 w-4 text-slate-700 transition-transform" />
              )}
            </Button>
          )}

          {/* User Profile / Auth State */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 rounded-full pl-2 pr-3 flex items-center gap-2 border bg-background/50 hover:bg-muted/60">
                  <Avatar className="h-7 w-7 border">
                    <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                    <AvatarFallback className="text-xs font-bold bg-blue-600 text-white">
                      {user.displayName?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-semibold max-w-[100px] truncate hidden sm:inline">
                    {user.displayName || 'Account'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 p-2 rounded-2xl shadow-xl" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none">{user.displayName || 'Legal Analyst'}</p>
                    <p className="text-xs leading-none text-muted-foreground truncate">{user.email || 'guest@lexiassist.local'}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="rounded-lg text-xs gap-2 py-2 cursor-pointer" onClick={() => window.location.href = '/lexiassist/document/demo'}>
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  Launch Sample Workbench
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="rounded-lg text-xs gap-2 py-2 text-destructive cursor-pointer" onClick={() => signOut()}>
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={signInAsGuest}
                className="text-xs font-semibold h-9 rounded-xl hidden sm:inline-flex"
              >
                Guest Access
              </Button>
              <Button 
                size="sm"
                onClick={signInWithGoogle}
                className="h-9 px-4 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all gap-1.5"
              >
                Sign In
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
