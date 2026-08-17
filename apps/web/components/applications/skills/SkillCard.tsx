'use client';

import type { SkillItem } from '@izhar-os/types';
import { cn } from '@izhar-os/ui';
import {
  Boxes,
  ChevronRight,
  Sparkles,
  Terminal,
} from 'lucide-react';

import { useApplicationChrome } from '@/hooks/useEnvironment';
import { useWindowStore } from '@/lib/store/window-store';

interface SkillCardProps {
  skill: SkillItem;
  isSelected?: boolean;
  onSelect: (skill: SkillItem) => void;
}

export function SkillCard({ skill, isSelected, onSelect }: SkillCardProps) {
  const chrome = useApplicationChrome();
  const openWindow = useWindowStore((state) => state.openWindow);

  const levelColor =
    skill.level === 'Core / Advanced'
      ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
      : skill.level === 'Proficient'
        ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
        : 'bg-slate-500/15 text-slate-300 border-slate-500/30';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(skill)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(skill);
        }
      }}
      style={{ borderRadius: chrome.cardRadius }}
      className={cn(
        'group relative flex flex-col justify-between text-start transition-all duration-150 cursor-pointer select-none p-4',
        chrome.cardClass,
        isSelected
          ? 'ring-2 ring-amber-400/80 bg-white/[0.08] shadow-lg shadow-amber-500/5'
          : 'hover:bg-white/[0.055] hover:border-line-strong',
      )}
    >
      {/* Top Header Row */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'grid size-7 shrink-0 place-items-center rounded-lg border transition-colors',
                isSelected
                  ? 'border-amber-400/60 bg-amber-500/20 text-amber-300'
                  : 'border-line bg-void/50 text-amber-400 group-hover:border-amber-400/40 group-hover:bg-amber-500/10',
              )}
            >
              <Boxes size={14} />
            </span>
            <div>
              <h4 className="text-[13.5px] font-semibold text-fg group-hover:text-amber-300 transition-colors">
                {skill.name}
              </h4>
              {skill.architecturalRole ? (
                <p className="text-[11px] text-faint line-clamp-1">
                  {skill.architecturalRole}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span
              className="rounded-md border border-line/60 bg-void/60 px-2 py-0.5 font-mono text-[10.5px] text-faint"
              title="Defensible professional experience duration"
            >
              {skill.years}
            </span>
          </div>
        </div>

        {/* Competency Level Tag */}
        <div className="mt-2.5 flex items-center gap-2">
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10.5px] font-medium',
              levelColor,
            )}
          >
            <span className="size-1.5 rounded-full bg-current" />
            {skill.level}
          </span>
        </div>

        {/* Description */}
        <p className="mt-2.5 text-[12px] leading-relaxed text-fg/80 line-clamp-2">
          {skill.description}
        </p>
      </div>

      {/* Footer Area: Capabilities / Tags & Project Link */}
      <div className="mt-3.5 space-y-2.5 border-t border-line/40 pt-2.5">
        {/* Tags */}
        {skill.tags?.length ? (
          <div className="flex flex-wrap gap-1">
            {skill.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-line/40 bg-void/40 px-1.5 py-0.5 font-mono text-[10px] text-muted group-hover:text-fg/80 transition-colors"
              >
                {tag}
              </span>
            ))}
            {skill.tags.length > 4 ? (
              <span className="rounded-md bg-void/20 px-1 py-0.5 text-[9.5px] text-faint font-mono">
                +{skill.tags.length - 4}
              </span>
            ) : null}
          </div>
        ) : null}

        {/* Project Link if present */}
        <div className="flex items-center justify-between text-[11px] pt-0.5">
          {skill.relatedProjects?.length ? (
            <div className="flex items-center gap-1.5 text-faint">
              <Sparkles size={11} className="text-amber-400 shrink-0" />
              <span className="text-[10.5px]">Used in:</span>
              <div className="flex flex-wrap gap-1">
                {skill.relatedProjects.map((pId) => (
                  <button
                    key={pId}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openWindow('projects');
                    }}
                    className="font-medium text-amber-300/90 hover:text-amber-200 hover:underline cursor-pointer"
                    title={`Open project ${pId} in Projects Explorer`}
                  >
                    {pId}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-[10.5px] text-faint flex items-center gap-1">
              <Terminal size={10} />
              <span>Production Stack</span>
            </div>
          )}

          <span className="text-faint group-hover:text-amber-300 group-hover:translate-x-0.5 transition-all text-[11px] flex items-center">
            Details
            <ChevronRight size={12} className="ms-0.5" />
          </span>
        </div>
      </div>
    </div>
  );
}
