'use client';

import { SKILL_CATEGORIES } from '@izhar-os/config';
import type { SkillItem } from '@izhar-os/types';
import { cn } from '@izhar-os/ui';
import {
  Boxes,
  Briefcase,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';

import { useWindowStore } from '@/lib/store/window-store';

interface SkillInspectorDrawerProps {
  skill: SkillItem | null;
  onClose: () => void;
}

export function SkillInspectorDrawer({ skill, onClose }: SkillInspectorDrawerProps) {
  const openWindow = useWindowStore((state) => state.openWindow);

  if (!skill) return null;

  const category = SKILL_CATEGORIES.find((c) => c.id === skill.category);

  const levelColor =
    skill.level === 'Core / Advanced'
      ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
      : skill.level === 'Proficient'
        ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
        : 'bg-slate-500/15 text-slate-300 border-slate-500/30';

  return (
    <aside
      aria-label="Skill Inspector"
      className={cn(
        'os-scroll flex flex-col border-s border-line bg-surface/70 backdrop-blur-xl shadow-2xl overflow-y-auto select-none transition-all duration-200',
        'w-full md:w-80 lg:w-96 shrink-0',
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line bg-surface/50 px-4 py-3 sticky top-0 backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Boxes size={13} />
          </span>
          <span className="text-[12px] font-semibold text-fg">Skill Inspector</span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 text-muted hover:bg-white/10 hover:text-fg transition-colors cursor-pointer"
          title="Close Inspector (Esc)"
        >
          <X size={15} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-5 text-[12px]">
        {/* Title & Metadata */}
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-[16px] font-bold text-fg tracking-tight">{skill.name}</h3>
              <p className="text-[11px] text-amber-400/90 font-medium">
                {category?.name ?? skill.category}
              </p>
            </div>
            <span
              className="shrink-0 rounded-md border border-line/60 bg-void/60 px-2 py-0.5 font-mono text-[11px] text-fg"
              title="Experience"
            >
              {skill.years}
            </span>
          </div>

          <div className="mt-2.5 flex items-center gap-2">
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10.5px] font-medium',
                levelColor,
              )}
            >
              <span className="size-1.5 rounded-full bg-current" />
              {skill.level}
            </span>
          </div>
        </div>

        {/* Architectural Role */}
        {skill.architecturalRole ? (
          <div className="rounded-lg border border-line/60 bg-void/40 p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-300">
              <Zap size={12} />
              <span>Architectural Role</span>
            </div>
            <p className="text-fg/90 text-[11.5px] leading-relaxed">
              {skill.architecturalRole}
            </p>
          </div>
        ) : null}

        {/* Detailed Description */}
        <div className="space-y-1.5">
          <span className="font-semibold text-muted text-[11px] uppercase tracking-wider">
            Technical Scope
          </span>
          <p className="text-fg/90 leading-relaxed text-[12px]">{skill.description}</p>
        </div>

        {/* Production Context Note */}
        {skill.contextNote ? (
          <div className="rounded-lg border border-line/50 bg-white/[0.025] p-3 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
              <Briefcase size={12} />
              <span>Production Context</span>
            </div>
            <p className="text-fg/80 text-[11.5px] leading-relaxed">{skill.contextNote}</p>
          </div>
        ) : null}

        {/* Capabilities list */}
        {skill.capabilities?.length ? (
          <div className="space-y-2">
            <span className="font-semibold text-muted text-[11px] uppercase tracking-wider">
              Core Capabilities
            </span>
            <ul className="space-y-1.5">
              {skill.capabilities.map((cap) => (
                <li key={cap} className="flex items-start gap-2 text-[11.5px] text-fg/90">
                  <CheckCircle2 size={13} className="text-amber-400/90 shrink-0 mt-0.5" />
                  <span>{cap}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* Tags */}
        {skill.tags?.length ? (
          <div className="space-y-2">
            <span className="font-semibold text-muted text-[11px] uppercase tracking-wider">
              Keywords & Tools
            </span>
            <div className="flex flex-wrap gap-1.5">
              {skill.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-line/50 bg-void/50 px-2 py-0.5 font-mono text-[10.5px] text-fg/80"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {/* Related Projects */}
        {skill.relatedProjects?.length ? (
          <div className="space-y-2.5 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
            <div className="flex items-center gap-1.5 text-[11.5px] font-semibold text-amber-300">
              <Sparkles size={12} />
              <span>Related Case Studies</span>
            </div>
            <p className="text-[11px] text-faint">
              Explore how this technology is implemented in real projects:
            </p>
            <div className="flex flex-col gap-1.5">
              {skill.relatedProjects.map((pId) => (
                <button
                  key={pId}
                  type="button"
                  onClick={() => openWindow('projects')}
                  className="flex items-center justify-between rounded-md border border-line bg-surface/60 px-2.5 py-1.5 text-[11.5px] font-medium text-fg hover:border-amber-400/50 hover:bg-surface hover:text-amber-300 transition-colors cursor-pointer"
                >
                  <span className="font-mono">{pId}</span>
                  <ExternalLink size={12} className="text-faint" />
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
