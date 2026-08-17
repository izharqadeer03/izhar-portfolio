'use client';

import { SKILLS } from '@izhar-os/config';
import { cn } from '@izhar-os/ui';
import {
  Grid3X3,
  Layers,
  RotateCcw,
  Search,
  Workflow,
  X,
} from 'lucide-react';

export type ViewMode = 'grid' | 'architecture';
export type LevelFilter = 'all' | 'Core / Advanced' | 'Proficient' | 'Working Knowledge';

interface SkillsToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  levelFilter: LevelFilter;
  onLevelFilterChange: (lvl: LevelFilter) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalFiltered: number;
}

export function SkillsToolbar({
  searchQuery,
  onSearchChange,
  levelFilter,
  onLevelFilterChange,
  viewMode,
  onViewModeChange,
  totalFiltered,
}: SkillsToolbarProps) {
  const hasActiveFilters = Boolean(searchQuery.trim()) || levelFilter !== 'all';

  return (
    <header className="flex flex-wrap items-center justify-between gap-2.5 border-b border-line bg-surface/40 px-3 py-2 backdrop-blur-md select-none shrink-0">
      {/* Left: App Title and View Mode Switcher */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-lg border border-line bg-void/40 px-2.5 py-1 text-[12px] text-fg">
          <Layers size={13} className="text-amber-400" />
          <span className="font-semibold">Skills & Tech Stack</span>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center rounded-lg border border-line bg-void/30 p-0.5 text-[11.5px]">
          <button
            type="button"
            onClick={() => onViewModeChange('grid')}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-2.5 py-0.5 font-medium transition-colors cursor-pointer',
              viewMode === 'grid'
                ? 'bg-white/10 text-fg shadow-xs'
                : 'text-muted hover:text-fg',
            )}
          >
            <Grid3X3 size={12} />
            <span>Category Grid</span>
          </button>

          <button
            type="button"
            onClick={() => onViewModeChange('architecture')}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-2.5 py-0.5 font-medium transition-colors cursor-pointer',
              viewMode === 'architecture'
                ? 'bg-white/10 text-fg shadow-xs'
                : 'text-muted hover:text-fg',
            )}
          >
            <Workflow size={12} />
            <span>Architecture Flow</span>
          </button>
        </div>
      </div>

      {/* Right: Search, Filter, and Stats */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Level filter */}
        <div className="relative flex items-center">
          <select
            value={levelFilter}
            onChange={(e) => onLevelFilterChange(e.target.value as LevelFilter)}
            className="h-7 rounded-md border border-line bg-void/60 px-2 text-[11.5px] text-fg focus:border-line-strong focus:outline-hidden cursor-pointer"
            aria-label="Filter by competency level"
          >
            <option value="all">All Tiers</option>
            <option value="Core / Advanced">Core / Advanced</option>
            <option value="Proficient">Proficient</option>
            <option value="Working Knowledge">Working Knowledge</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative flex items-center">
          <Search size={13} className="pointer-events-none absolute left-2.5 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search skills, tags..."
            className="h-7 w-32 sm:w-48 md:w-56 rounded-md border border-line bg-void/60 pl-8 pr-7 text-[12px] text-fg placeholder:text-faint focus:border-line-strong focus:outline-hidden"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2 text-muted hover:text-fg cursor-pointer"
              title="Clear search"
            >
              <X size={12} />
            </button>
          ) : null}
        </div>

        {/* Reset button if filtered */}
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={() => {
              onSearchChange('');
              onLevelFilterChange('all');
            }}
            className="flex items-center gap-1 rounded-md border border-line bg-void/40 px-2 py-1 text-[11px] text-amber-300 hover:bg-white/5 transition-colors cursor-pointer"
            title="Reset filters"
          >
            <RotateCcw size={11} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        ) : null}

        <span className="hidden lg:inline-block text-[11px] font-mono text-faint ps-1">
          {totalFiltered} / {SKILLS.length} items
        </span>
      </div>
    </header>
  );
}
