'use client';

import { SKILL_CATEGORIES, SKILLS } from '@izhar-os/config';
import type { SkillCategoryId } from '@izhar-os/types';
import { cn } from '@izhar-os/ui';
import {
  Boxes,
  Code2,
  Cpu,
  Database,
  Globe,
  Layers,
  Network,
  Radio,
  Server,
  Sparkles,
  Terminal,
  type LucideIcon,
} from 'lucide-react';
import { motion } from 'motion/react';

import { useApplicationChrome } from '@/hooks/useEnvironment';
import { usePrefersReducedMotion } from '@/hooks/useSystemPreferences';

const CATEGORY_GLYPHS: Record<SkillCategoryId | 'all', LucideIcon> = {
  all: Layers,
  languages: Code2,
  backend: Server,
  'databases-search': Database,
  'ai-llm': Sparkles,
  'realtime-distributed': Radio,
  'cloud-devops': Network,
  frontend: Globe,
  'apis-integrations': Terminal,
};

interface SkillsNavigationProps {
  activeCategory: SkillCategoryId | 'all';
  onSelectCategory: (id: SkillCategoryId | 'all') => void;
  stacked: boolean;
}

export function SkillsNavigation({
  activeCategory,
  onSelectCategory,
  stacked,
}: SkillsNavigationProps) {
  const chrome = useApplicationChrome();
  const reducedMotion = usePrefersReducedMotion();

  // Stacked layout for GNOME or mobile/narrow container
  if (stacked) {
    return (
      <nav
        aria-label="Skill domains"
        className={cn('os-scroll shrink-0 overflow-x-auto border-b border-line/60 bg-void/30 px-3 py-1.5 no-scrollbar')}
      >
        <ul className="flex w-max items-center gap-1.5">
          <li>
            <button
              type="button"
              onClick={() => onSelectCategory('all')}
              aria-current={activeCategory === 'all' ? 'true' : undefined}
              className={cn(
                'relative flex items-center gap-1.5 px-3 py-1 text-[11.5px] font-medium whitespace-nowrap transition-colors',
                activeCategory === 'all'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                  : 'text-muted hover:bg-white/5 hover:text-fg border border-transparent',
              )}
              style={{ borderRadius: chrome.controlRadius }}
            >
              <Layers size={13} className="text-amber-400" />
              <span>All Technologies</span>
              <span className="ms-1 rounded-full bg-void/60 px-1.5 py-0.2 font-mono text-[9.5px] text-faint">
                {SKILLS.length}
              </span>
            </button>
          </li>

          {SKILL_CATEGORIES.map((cat) => {
            const isActive = cat.id === activeCategory;
            const count = SKILLS.filter((s) => s.category === cat.id).length;
            const Icon = CATEGORY_GLYPHS[cat.id] ?? Boxes;

            return (
              <li key={cat.id}>
                <button
                  type="button"
                  onClick={() => onSelectCategory(cat.id)}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'relative flex items-center gap-1.5 px-2.5 py-1 text-[11.5px] font-medium whitespace-nowrap transition-colors',
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                      : 'text-muted hover:bg-white/5 hover:text-fg border border-transparent',
                  )}
                  style={{ borderRadius: chrome.controlRadius }}
                >
                  <Icon size={12.5} className={isActive ? 'text-amber-300' : 'text-faint'} />
                  <span>{cat.shortName}</span>
                  <span className="ms-1 rounded-full bg-void/40 px-1.5 py-0.2 font-mono text-[9.5px] text-faint">
                    {count}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }

  const isSourceList = chrome.navigation === 'source-list';

  return (
    <nav
      aria-label="Skill domains sidebar"
      className={cn('os-scroll shrink-0 overflow-y-auto select-none', chrome.navSurfaceClass)}
      style={{ width: chrome.navWidth || 215 }}
    >
      <div className={isSourceList ? 'px-2.5 py-3.5' : 'px-2 py-3'}>
        <p className={cn(chrome.eyebrowClass, 'px-2.5 pb-2 text-faint')}>
          {isSourceList ? 'Domains' : 'Architecture Domains'}
        </p>

        <ul className="space-y-0.5">
          {/* All item */}
          <li>
            <button
              type="button"
              onClick={() => onSelectCategory('all')}
              aria-current={activeCategory === 'all' ? 'true' : undefined}
              className={cn(
                'relative flex w-full items-center justify-between gap-2 text-[12px] font-medium transition-colors duration-150',
                isSourceList ? 'h-8 px-2.5' : 'h-8.5 ps-3.5 pe-2.5',
                activeCategory === 'all'
                  ? isSourceList
                    ? 'text-white bg-amber-600/70 shadow-xs'
                    : 'bg-white/[0.08] text-amber-300'
                  : 'text-muted hover:bg-white/[0.045] hover:text-fg',
              )}
              style={{ borderRadius: chrome.controlRadius }}
            >
              {/* Fluent selection indicator */}
              {activeCategory === 'all' && !isSourceList ? (
                <motion.span
                  aria-hidden="true"
                  layoutId={reducedMotion ? undefined : 'skills-nav-indicator'}
                  className="absolute start-1 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-amber-400"
                  transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
                />
              ) : null}

              <div className="flex items-center gap-2 truncate">
                <Layers size={13.5} className="shrink-0 text-amber-400" />
                <span className="truncate">All Technologies</span>
              </div>
              <span className="rounded-md bg-void/50 px-1.5 py-0.5 font-mono text-[10px] text-faint">
                {SKILLS.length}
              </span>
            </button>
          </li>

          {SKILL_CATEGORIES.map((cat) => {
            const isActive = cat.id === activeCategory;
            const count = SKILLS.filter((s) => s.category === cat.id).length;
            const Icon = CATEGORY_GLYPHS[cat.id] ?? Boxes;

            return (
              <li key={cat.id}>
                <button
                  type="button"
                  onClick={() => onSelectCategory(cat.id)}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'relative flex w-full items-center justify-between gap-2 text-[12px] font-medium transition-colors duration-150',
                    isSourceList ? 'h-8 px-2.5' : 'h-8.5 ps-3.5 pe-2.5',
                    isActive
                      ? isSourceList
                        ? 'text-white bg-amber-600/70 shadow-xs'
                        : 'bg-white/[0.08] text-amber-300'
                      : 'text-muted hover:bg-white/[0.045] hover:text-fg',
                  )}
                  style={{ borderRadius: chrome.controlRadius }}
                >
                  {/* Fluent selection indicator */}
                  {isActive && !isSourceList ? (
                    <motion.span
                      aria-hidden="true"
                      layoutId={reducedMotion ? undefined : 'skills-nav-indicator'}
                      className="absolute start-1 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-amber-400"
                      transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
                    />
                  ) : null}

                  <div className="flex items-center gap-2 truncate">
                    <Icon size={13.5} className={cn('shrink-0', isActive ? 'text-amber-300' : 'text-muted')} />
                    <span className="truncate">{cat.name}</span>
                  </div>
                  <span className="rounded-md bg-void/50 px-1.5 py-0.5 font-mono text-[10px] text-faint">
                    {count}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Quick summary card */}
        <div className="mt-5 rounded-lg border border-line/50 bg-void/30 p-3 text-[11px] space-y-1.5">
          <div className="font-semibold text-fg flex items-center gap-1.5">
            <Cpu size={12} className="text-amber-400" />
            <span>Stack Overview</span>
          </div>
          <p className="text-faint leading-relaxed text-[10.5px]">
            ~3 years production experience with Golang, Node.js microservices, AI integrations, and real-time systems.
          </p>
        </div>
      </div>
    </nav>
  );
}
