'use client';

import { OS_META, SYSTEM_PROFILE } from '@izhar-os/config';
import type { EnvironmentId } from '@izhar-os/types';
import { cn } from '@izhar-os/ui';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  completeCommand,
  runCommand,
  type CommandContext,
  type LineTone,
  type TerminalLine,
} from '@/components/applications/terminal/commands';
import { useEnvironmentDefinition } from '@/hooks/useEnvironment';
import { useEnvironmentStore } from '@/lib/store/environment-store';
import { useWindowStore } from '@/lib/store/window-store';

interface HistoryBlock {
  id: number;
  /** The command as typed, or null for the banner. */
  input: string | null;
  lines: TerminalLine[];
}

const TONE_CLASS: Record<LineTone, string> = {
  default: 'text-fg/85',
  muted: 'text-muted',
  accent: 'env-accent',
  error: 'text-rose-300',
  heading: 'font-semibold text-fg',
};

const PROMPT_USER = 'izhar@portfolio';

/**
 * A working shell.
 *
 * Not a decorative block of green text: it parses input, completes on Tab,
 * walks its history with the arrow keys, and every command reads the same
 * manifest the desktop reads. `workspace ubuntu` switches the entire
 * environment from here — which is the clearest possible demonstration that
 * the environment is a layer over the system rather than the system itself.
 */
export function TerminalApp() {
  const environment = useEnvironmentDefinition();
  const requestEnvironment = useEnvironmentStore((state) => state.requestEnvironment);
  const openWindow = useWindowStore((state) => state.openWindow);
  const windows = useWindowStore((state) => state.windows);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);

  const [blocks, setBlocks] = useState<HistoryBlock[]>(() => [
    {
      id: 0,
      input: null,
      lines: [
        { text: `${OS_META.name} ${OS_META.version} — izsh`, tone: 'accent' },
        { text: `${SYSTEM_PROFILE.name} · ${SYSTEM_PROFILE.role}`, tone: 'muted' },
        { text: '', tone: 'muted' },
        { text: 'Type `help` to see what this shell can do.', tone: 'muted' },
      ],
    },
  ]);
  const [draft, setDraft] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  /** -1 means "editing a fresh line" rather than browsing history. */
  const [historyIndex, setHistoryIndex] = useState(-1);

  const context: CommandContext = useMemo(
    () => ({
      environment,
      running: windows.map((instance) => ({
        id: instance.applicationId,
        title: instance.title,
      })),
    }),
    [environment, windows],
  );

  // Always keep the prompt in view after output lands.
  useEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [blocks]);

  const submit = useCallback(
    (raw: string) => {
      const input = raw.trim();
      setDraft('');
      setHistoryIndex(-1);

      if (!input) {
        setBlocks((current) => [...current, { id: nextId.current++, input: '', lines: [] }]);
        return;
      }

      setCommandHistory((current) => [...current, input]);

      const result = runCommand(input, context);

      if (result.effect?.type === 'clear') {
        setBlocks([]);
        return;
      }

      setBlocks((current) => [...current, { id: nextId.current++, input, lines: result.lines }]);

      if (result.effect?.type === 'open' && result.effect.applicationId) {
        openWindow(result.effect.applicationId);
      }

      if (result.effect?.type === 'switch' && result.effect.environment) {
        requestEnvironment(result.effect.environment as EnvironmentId);
      }
    },
    [context, openWindow, requestEnvironment],
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      submit(draft);
      return;
    }

    if (event.key === 'Tab') {
      event.preventDefault();
      const completion = completeCommand(draft);
      if (completion) setDraft(completion);
      return;
    }

    if (event.key === 'l' && event.ctrlKey) {
      event.preventDefault();
      setBlocks([]);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (commandHistory.length === 0) return;
      const next = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(next);
      setDraft(commandHistory[next] ?? '');
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (historyIndex === -1) return;
      const next = historyIndex + 1;
      if (next >= commandHistory.length) {
        setHistoryIndex(-1);
        setDraft('');
        return;
      }
      setHistoryIndex(next);
      setDraft(commandHistory[next] ?? '');
    }
  };

  return (
    <div
      ref={scrollRef}
      className={cn(
        'os-scroll os-selectable h-full overflow-y-auto px-4 py-3 font-mono text-[12.5px] leading-relaxed',
        terminalSurface(environment.id),
      )}
      // Clicking anywhere in the pane focuses the prompt, as a terminal does.
      onPointerDown={(event) => {
        if (window.getSelection()?.toString()) return;
        if (event.target !== inputRef.current) inputRef.current?.focus();
      }}
    >
      {blocks.map((block) => (
        <div
          key={block.id}
          className={block.input !== null ? 'mt-2 first:mt-0' : ''}
          style={{
            animation: block.id > 0 ? 'toast-in 180ms var(--ease-env) backwards' : undefined,
          }}
        >
          {block.input !== null ? (
            <p className="flex flex-wrap items-baseline gap-x-2">
              <Prompt />
              <span className="text-fg">{block.input}</span>
            </p>
          ) : null}

          {block.lines.map((entry, index) => (
            <p
              key={index}
              className={cn('whitespace-pre-wrap', TONE_CLASS[entry.tone ?? 'default'])}
            >
              {entry.text || ' '}
            </p>
          ))}
        </div>
      ))}

      {/* Live prompt. */}
      <div className="mt-2 flex flex-wrap items-baseline gap-x-2">
        <Prompt />

        <span className="relative min-w-0 flex-1">
          <input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Terminal input"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            className="w-full bg-transparent text-fg caret-transparent outline-none min-h-[44px] sm:min-h-0"
          />

          {/* Block caret, positioned from the text width so it tracks the
              cursor without the browser's thin default caret. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-0 flex text-transparent"
          >
            <span className="whitespace-pre">{draft}</span>
            <span className="env-accent-bg inline-block h-[1.15em] w-[0.55em] translate-y-[0.15em] motion-safe:animate-caret" />
          </span>
        </span>
      </div>
    </div>
  );
}

function Prompt() {
  return (
    <span className="shrink-0 whitespace-nowrap">
      <span className="env-accent font-medium">{PROMPT_USER}</span>
      <span className="text-muted">:</span>
      <span className="text-fg/70">~</span>
      <span className="text-muted">$</span>
    </span>
  );
}

/**
 * Terminals are the one place each environment's own colour genuinely belongs,
 * so this is the only surface in the system that changes its ground.
 */
function terminalSurface(environment: EnvironmentId): string {
  if (environment === 'linux') return 'bg-[#2c0a1f]/92';
  if (environment === 'macos') return 'bg-[#0d0f13]/92';
  return 'bg-[#0a0d12]/94';
}
