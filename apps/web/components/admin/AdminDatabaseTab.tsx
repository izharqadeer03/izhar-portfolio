'use client';

import { OSButton } from '@izhar-os/ui';
import {
  CheckCircle2,
  Database,
  Download,
  Loader2,
  Play,
  RefreshCw,
  Server,
  Zap,
} from 'lucide-react';
import React, { useState } from 'react';

interface AdminDatabaseTabProps {
  dbConnected: boolean;
  latencyMs?: number;
  onTriggerSeed: (force?: boolean) => Promise<{ success: boolean; message?: string }>;
  fullData: Record<string, unknown>;
}

export function AdminDatabaseTab({
  dbConnected,
  latencyMs,
  onTriggerSeed,
  fullData,
}: AdminDatabaseTabProps) {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);

  const handleSeed = async (force: boolean) => {
    if (
      force &&
      !confirm(
        'Are you sure you want to reset & re-seed database defaults? Any new custom records will be preserved or merged with defaults.',
      )
    ) {
      return;
    }

    setIsSeeding(true);
    setSeedResult(null);

    try {
      const res = await onTriggerSeed(force);
      setSeedResult(res.message || 'Seeding completed successfully!');
    } catch (err) {
      setSeedResult(`Seeding failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleExportJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(fullData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `izhar_portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`,
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Header */}
      <div className="border-b border-line pb-4">
        <h2 className="text-[18px] font-bold text-fg flex items-center gap-2">
          <Database size={18} className="text-rose-400" />
          <span>Database Management & Synchronization</span>
        </h2>
        <p className="text-[12px] text-muted">
          Manage Supabase PostgreSQL persistence, table migrations, and auto-seeding routines.
        </p>
      </div>

      {/* Connection Status Card */}
      <div className="rounded-2xl border border-line bg-surface/30 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[14px] font-bold text-fg flex items-center gap-2">
            <Server size={16} className="text-cyan-400" />
            <span>Supabase Cloud Connection</span>
          </h3>

          <div className="flex items-center gap-2">
            <span
              className={`size-2.5 rounded-full ${
                dbConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span className="text-[12px] font-bold text-white">
              {dbConnected ? 'CONNECTED' : 'DISCONNECTED'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[12px]">
          <div className="rounded-xl border border-line/60 bg-void/40 p-3 space-y-1">
            <p className="text-[10.5px] font-mono text-faint uppercase">Host Service</p>
            <p className="font-bold text-fg">Supabase Cloud (PostgreSQL 15)</p>
          </div>
          <div className="rounded-xl border border-line/60 bg-void/40 p-3 space-y-1">
            <p className="text-[10.5px] font-mono text-faint uppercase">Connection Mode</p>
            <p className="font-bold text-fg">REST API + PgPooler</p>
          </div>
          <div className="rounded-xl border border-line/60 bg-void/40 p-3 space-y-1">
            <p className="text-[10.5px] font-mono text-faint uppercase">Roundtrip Latency</p>
            <p className="font-bold text-fg font-mono">{latencyMs || 24} ms</p>
          </div>
        </div>
      </div>

      {/* Seeding Controls Card */}
      <div className="rounded-2xl border border-line bg-surface/30 p-5 space-y-4">
        <div className="space-y-1">
          <h3 className="text-[14px] font-bold text-fg flex items-center gap-2">
            <Zap size={16} className="text-amber-400" />
            <span>Auto-Seed & Migration Engine</span>
          </h3>
          <p className="text-[12.5px] text-muted">
            Populates or synchronizes all default tables from <code className="text-fg font-mono">@izhar-os/config</code> (System Profile, About, Skills, Projects, Experiences, Resume, Contact Channels) directly into Supabase.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <OSButton
            size="md"
            variant="accent"
            onClick={() => handleSeed(false)}
            disabled={isSeeding}
            className="bg-rose-600 hover:bg-rose-500 text-white font-medium text-[12.5px]"
          >
            {isSeeding ? (
              <>
                <Loader2 size={14} className="animate-spin mr-1.5" />
                <span>Running Seeder...</span>
              </>
            ) : (
              <>
                <Play size={14} className="mr-1.5" />
                <span>Run Safe Auto-Seed</span>
              </>
            )}
          </OSButton>

          <OSButton
            size="md"
            variant="subtle"
            onClick={() => handleSeed(true)}
            disabled={isSeeding}
            className="text-[12.5px] text-amber-300 hover:bg-amber-500/10"
          >
            <RefreshCw size={13} className="mr-1.5" />
            <span>Force Re-seed All Defaults</span>
          </OSButton>
        </div>

        {seedResult ? (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-[12.5px] text-emerald-300 flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{seedResult}</span>
          </div>
        ) : null}
      </div>

      {/* JSON Backup & Raw Data Inspector */}
      <div className="rounded-2xl border border-line bg-surface/30 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-[14px] font-bold text-fg flex items-center gap-2">
              <Download size={16} className="text-cyan-400" />
              <span>Full Portfolio Data Export (JSON)</span>
            </h3>
            <p className="text-[12px] text-muted">
              Download a complete JSON snapshot backup of all live portfolio records.
            </p>
          </div>

          <OSButton
            size="sm"
            variant="subtle"
            onClick={handleExportJson}
            className="text-[12px]"
          >
            <Download size={13} className="mr-1" />
            <span>Export JSON</span>
          </OSButton>
        </div>

        <div className="rounded-xl border border-line/60 bg-void/60 p-3.5 max-h-48 overflow-y-auto">
          <pre className="font-mono text-[11px] text-muted leading-relaxed whitespace-pre-wrap">
            {JSON.stringify(fullData, null, 2).slice(0, 1000)}...
          </pre>
        </div>
      </div>
    </div>
  );
}
