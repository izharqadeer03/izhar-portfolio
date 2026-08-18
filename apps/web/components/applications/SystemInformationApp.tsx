'use client';

import { OS_META, PLATFORM_ENTRIES, ROADMAP, SYSTEM_PROFILE } from '@izhar-os/config';
import { DataRow, SectionLabel, Separator, StatusDot } from '@izhar-os/ui';
import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';

import { OSMark } from '@/components/system/OSMark';
import { useDeviceCapability } from '@/hooks/useDeviceCapability';
import { useSystemStore } from '@/lib/store/system-store';
import { DEFAULT_THEME_ID, THEME_PRESETS, useThemeStore } from '@/lib/store/theme-store';
import { formatUptime } from '@/lib/utils';

const RENDERER_LABEL: Record<string, string> = {
  high: 'WebGL · Full environment',
  balanced: 'WebGL · Reduced environment',
  minimal: 'CSS environment',
};

interface SessionInfo {
  viewport: string;
  timezone: string;
  locale: string;
}

/**
 * The one fully implemented application in Phase 1.
 *
 * Everything here is either real configuration or genuinely measured from the
 * session — viewport, uptime, which renderer actually won. Nothing is invented
 * to look technical, and nothing reads private device information.
 */
export function SystemInformationApp() {
  const { budget, resolved } = useDeviceCapability();
  const readyAt = useSystemStore((state) => state.readyAt);
  const themeId = useThemeStore((state) => state.themeId);
  const setTheme = useThemeStore((state) => state.setTheme);
  const currentPreset = THEME_PRESETS[themeId] ?? THEME_PRESETS[DEFAULT_THEME_ID]!;

  const [session, setSession] = useState<SessionInfo | null>(null);
  const [uptime, setUptime] = useState('—');

  useEffect(() => {
    const readSession = () =>
      setSession({
        viewport: `${window.innerWidth} × ${window.innerHeight}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'Unknown',
        locale: navigator.language,
      });

    readSession();
    window.addEventListener('resize', readSession);
    return () => window.removeEventListener('resize', readSession);
  }, []);

  useEffect(() => {
    if (readyAt === null) return;

    const tick = () => setUptime(formatUptime(Date.now() - readyAt));
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [readyAt]);

  return (
    <div className="os-scroll os-selectable h-full overflow-y-auto">
      {/* Identity */}
      <header className="px-6 pt-6 pb-5">
        <div className="flex items-start gap-3.5">
          <span className="grid size-11 shrink-0 place-items-center rounded-[13px] border border-line bg-linear-to-b from-white/8 to-white/[0.015] text-accent">
            <OSMark size={22} />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
              <h2 className="text-[15px] font-medium tracking-tight text-fg">{OS_META.name}</h2>
              <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] tracking-[0.1em] text-muted">
                v{OS_META.version}
              </span>
            </div>
            <p className="mt-1 text-[13px] text-muted">{OS_META.description}</p>
            <p className="mt-0.5 font-mono text-[10px] tracking-[0.14em] text-faint uppercase">
              {OS_META.channel}
            </p>
          </div>
        </div>
      </header>

      <Separator />

      {/* Operator */}
      <section className="px-6 py-5">
        <SectionLabel>Operator</SectionLabel>

        <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="text-[15px] font-medium tracking-tight text-fg">{SYSTEM_PROFILE.name}</p>
          <p className="text-[13px] text-muted">{SYSTEM_PROFILE.role}</p>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {SYSTEM_PROFILE.disciplines.map((discipline) => (
            <span
              key={discipline}
              className="rounded-md border border-line bg-white/[0.03] px-2 py-1 text-[11px] text-muted"
            >
              {discipline}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2.5 rounded-lg border border-line bg-void/40 px-3 py-2.5">
          <StatusDot state={SYSTEM_PROFILE.status.state} />
          <div className="min-w-0">
            <p className="text-[12.5px] font-medium text-fg">{SYSTEM_PROFILE.status.label}</p>
            <p className="text-[11.5px] text-muted">{SYSTEM_PROFILE.status.detail}</p>
          </div>
        </div>
      </section>

      <Separator />

      {/* Platform */}
      <section className="px-6 py-5">
        <SectionLabel>Platform & Architecture</SectionLabel>
        <div className="mt-2">
          {PLATFORM_ENTRIES.map((entry) => (
            <DataRow key={entry.label} label={entry.label} value={entry.value} />
          ))}
          <DataRow
            label="Database"
            value="Supabase Cloud · PostgreSQL 15 (Live Sync)"
          />
        </div>
      </section>

      <Separator />

      {/* Personalization & Theme */}
      <section className="px-6 py-5">
        <div className="flex items-center justify-between">
          <SectionLabel>Personalization & Themes</SectionLabel>
          <span
            className="font-mono text-[10.5px] font-medium px-2 py-0.5 rounded-full border border-line"
            style={{ color: currentPreset.accent }}
          >
            {currentPreset.name}
          </span>
        </div>

        <p className="mt-1 text-[12px] text-muted">
          Active accent color applied across taskbar, windows, 3D constellation, and atmosphere.
        </p>

        <div className="mt-3.5 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.values(THEME_PRESETS).map((preset) => {
            const isSelected = themeId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setTheme(preset.id)}
                className={`flex items-center gap-2.5 p-2 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'border-white/30 bg-white/10 shadow-sm ring-1 ring-white/20'
                    : 'border-line bg-white/[0.025] hover:bg-white/[0.06]'
                }`}
              >
                <span
                  className="size-5 rounded-full shrink-0 flex items-center justify-center shadow-inner"
                  style={{ backgroundColor: preset.accent }}
                >
                  {isSelected ? <Check size={11} strokeWidth={3} className="text-black" /> : null}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11.5px] font-medium text-fg truncate">{preset.name}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <Separator />

      {/* Session — the only live data in the OS. */}
      <section className="px-6 py-5">
        <SectionLabel>Session</SectionLabel>
        <div className="mt-2">
          <DataRow
            label="Renderer"
            value={resolved ? (RENDERER_LABEL[budget.tier] ?? budget.tier) : 'Detecting…'}
          />
          <DataRow label="Viewport" value={session?.viewport ?? '—'} />
          <DataRow label="Uptime" value={uptime} />
          <DataRow label="Time zone" value={session?.timezone ?? '—'} />
          <DataRow label="Locale" value={session?.locale ?? '—'} />
        </div>
      </section>

      <Separator />

      {/* Roadmap */}
      <section className="px-6 pt-5 pb-7">
        <SectionLabel>System roadmap</SectionLabel>

        <ol className="mt-3 space-y-2.5">
          {ROADMAP.map((phase) => (
            <li key={phase.label} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className={
                  phase.done
                    ? 'mt-px grid size-4 shrink-0 place-items-center rounded-full border border-accent/40 bg-accent/15 text-accent'
                    : 'mt-px grid size-4 shrink-0 place-items-center rounded-full border border-line text-faint'
                }
              >
                {phase.done ? <Check size={9} strokeWidth={3} /> : null}
              </span>

              <div className="min-w-0">
                <p className="text-[12.5px] text-fg/90">
                  {phase.label}
                  <span className="text-faint"> — </span>
                  <span className="text-muted">{phase.detail}</span>
                </p>
              </div>

              <span className="ms-auto font-mono text-[10px] tracking-[0.1em] text-faint uppercase">
                {phase.done ? 'Shipped' : 'Planned'}
              </span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
