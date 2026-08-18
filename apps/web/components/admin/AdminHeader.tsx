'use client';

import { OSButton } from '@izhar-os/ui';
import {
  ExternalLink,
  LogOut,
  RefreshCw,
} from 'lucide-react';
import React from 'react';

interface AdminHeaderProps {
  dbConnected: boolean;
  latencyMs?: number;
  onRefresh: () => void;
  onLogout: () => void;
  isSyncing: boolean;
}

export function AdminHeader({
  dbConnected,
  latencyMs,
  onRefresh,
  onLogout,
  isSyncing,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-line bg-[#0c1017]/80 px-4 sm:px-6 py-3 backdrop-blur-xl shrink-0">
      <div className="flex items-center gap-3">
        <a href="/" className="flex items-center gap-2 text-fg hover:opacity-80 transition-opacity">
          <div className="size-8 rounded-lg border border-rose-500/40 bg-rose-500/10 grid place-items-center text-rose-400 font-mono font-bold text-xs">
            IQ
          </div>
          <div>
            <h1 className="text-[14px] font-bold tracking-tight text-fg leading-none">
              IZHAR OS
            </h1>
            <p className="text-[10.5px] font-mono text-faint uppercase tracking-wider mt-0.5">
              Portfolio Management Console
            </p>
          </div>
        </a>

        <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-line bg-void/40 px-2.5 py-1 text-[11px]">
          <span
            className={`size-2 rounded-full ${
              dbConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
            }`}
          />
          <span className="text-muted font-medium">
            {dbConnected ? 'Supabase Live' : 'Connecting DB...'}
          </span>
          {latencyMs !== undefined && latencyMs > 0 ? (
            <span className="text-faint font-mono">({latencyMs}ms)</span>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <OSButton
          size="sm"
          variant="ghost"
          onClick={onRefresh}
          disabled={isSyncing}
          className="text-[11.5px] text-muted hover:text-fg"
          title="Reload fresh data from database"
        >
          <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
          <span className="hidden sm:inline">Sync DB</span>
        </OSButton>

        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface/40 px-2.5 py-1.5 text-[11.5px] text-fg hover:bg-surface hover:border-line-strong transition-colors"
        >
          <ExternalLink size={13} />
          <span className="hidden sm:inline">View OS</span>
        </a>

        <OSButton
          size="sm"
          variant="ghost"
          onClick={onLogout}
          className="text-[11.5px] text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
          title="Sign out of admin console"
        >
          <LogOut size={13} />
          <span className="hidden sm:inline">Sign Out</span>
        </OSButton>
      </div>
    </header>
  );
}
