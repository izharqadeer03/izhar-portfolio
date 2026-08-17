'use client';

import { cn } from '@izhar-os/ui';
import {
  Calendar,
  Filter,
  Layers,
  Route,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import React from 'react';

export type ExperienceViewMode = 'timeline' | 'projects' | 'overview';

interface ExperienceToolbarProps {
  viewMode: ExperienceViewMode;
  onViewModeChange: (mode: ExperienceViewMode) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  activeTech: string;
  onActiveTechChange: (tech: string) => void;
  allTechnologies: string[];
}

export function ExperienceToolbar({
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchQueryChange,
  activeTech,
  onActiveTechChange,
  allTechnologies,
}: ExperienceToolbarProps) {
  return (
    <div className="flex shrink-0 flex-col border-b border-line bg-surface/40 backdrop-blur-md">
      {/* Primary OS Toolbar */}
      <header className="flex flex-wrap items-center justify-between gap-2.5 px-3.5 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-line bg-void/50 px-2.5 py-1 text-[12px] font-medium text-fg shadow-xs">
            <Route size={14} className="text-emerald-400 shrink-0" />
            <span className="font-semibold tracking-tight">Experience & Career Timeline</span>
            <span className="rounded-md bg-emerald-500/15 px-1.5 py-0.2 font-mono text-[10px] text-emerald-300 border border-emerald-500/30">
              3+ Yrs
            </span>
          </div>

          {/* View Mode Segmented Controls */}
          <div className="flex items-center rounded-lg border border-line bg-void/40 p-0.5 text-[11.5px]">
            <button
              id="exp-view-timeline"
              type="button"
              onClick={() => onViewModeChange('timeline')}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-all duration-150',
                viewMode === 'timeline'
                  ? 'bg-white/12 text-fg shadow-xs border border-white/10 font-semibold'
                  : 'text-muted hover:text-fg hover:bg-white/5 border border-transparent',
              )}
            >
              <Calendar size={12} className={viewMode === 'timeline' ? 'text-emerald-400' : 'text-faint'} />
              <span>Timeline</span>
            </button>

            <button
              id="exp-view-projects"
              type="button"
              onClick={() => onViewModeChange('projects')}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-all duration-150',
                viewMode === 'projects'
                  ? 'bg-white/12 text-fg shadow-xs border border-white/10 font-semibold'
                  : 'text-muted hover:text-fg hover:bg-white/5 border border-transparent',
              )}
            >
              <Sparkles size={12} className={viewMode === 'projects' ? 'text-violet-400' : 'text-faint'} />
              <span>Major Projects</span>
            </button>

            <button
              id="exp-view-overview"
              type="button"
              onClick={() => onViewModeChange('overview')}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-all duration-150',
                viewMode === 'overview'
                  ? 'bg-white/12 text-fg shadow-xs border border-white/10 font-semibold'
                  : 'text-muted hover:text-fg hover:bg-white/5 border border-transparent',
              )}
            >
              <Layers size={12} className={viewMode === 'overview' ? 'text-cyan-400' : 'text-faint'} />
              <span>Full Overview</span>
            </button>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex items-center">
            <Search size={13} className="pointer-events-none absolute left-2.5 text-muted" />
            <input
              id="exp-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              placeholder="Filter roles, projects, tech stack..."
              className="h-7.5 w-40 sm:w-56 rounded-lg border border-line bg-void/70 pl-8 pr-7 text-[12px] text-fg placeholder:text-faint focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 focus:outline-hidden transition-all"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => onSearchQueryChange('')}
                className="absolute right-2 text-faint hover:text-fg transition-colors"
                title="Clear search"
              >
                <X size={12} />
              </button>
            ) : null}
          </div>
        </div>
      </header>

      {/* Technology Filter Horizontal Strip */}
      <div className="flex shrink-0 items-center gap-1.5 overflow-x-auto border-t border-line/50 bg-void/30 px-3.5 py-1.5 text-[11px] no-scrollbar">
        <div className="flex items-center gap-1 text-faint shrink-0 pr-1 font-mono uppercase tracking-wider text-[10px]">
          <Filter size={10} /> Stack Filter:
        </div>

        <button
          type="button"
          onClick={() => onActiveTechChange('all')}
          className={cn(
            'shrink-0 rounded-md px-2 py-0.5 font-medium transition-all duration-150',
            activeTech === 'all'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs'
              : 'text-muted hover:bg-white/5 hover:text-fg border border-line/40',
          )}
        >
          All Technologies
        </button>

        {allTechnologies.filter((t) => t !== 'all').map((tech) => (
          <button
            key={tech}
            type="button"
            onClick={() => onActiveTechChange(activeTech === tech ? 'all' : tech)}
            className={cn(
              'shrink-0 rounded-md px-2 py-0.5 font-mono text-[10.5px] font-medium transition-all duration-150',
              activeTech.toLowerCase() === tech.toLowerCase()
                ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-500/50 shadow-xs'
                : 'text-fg/75 bg-surface/25 hover:bg-white/10 hover:text-fg border border-line/40',
            )}
          >
            {tech}
          </button>
        ))}

        {(activeTech !== 'all' || searchQuery) && (
          <button
            type="button"
            onClick={() => {
              onActiveTechChange('all');
              onSearchQueryChange('');
            }}
            className="shrink-0 flex items-center gap-1 text-[10px] text-faint hover:text-rose-300 ml-1 px-1.5 py-0.5 rounded transition-colors"
          >
            <X size={10} /> Reset
          </button>
        )}
      </div>
    </div>
  );
}
