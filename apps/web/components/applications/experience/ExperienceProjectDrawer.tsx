'use client';

import type { Project } from '@izhar-os/types';
import { cn, OSButton } from '@izhar-os/ui';
import {
  Briefcase,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Workflow,
  X,
  Zap,
} from 'lucide-react';
import React from 'react';

import { useWindowStore } from '@/lib/store/window-store';

interface ExperienceProjectDrawerProps {
  project: Project | null;
  onClose: () => void;
}

export function ExperienceProjectDrawer({ project, onClose }: ExperienceProjectDrawerProps) {
  const openWindow = useWindowStore((state) => state.openWindow);

  if (!project) return null;

  return (
    <aside
      aria-label="Project Deep Dive Inspector"
      className={cn(
        'os-scroll flex flex-col border-s border-line bg-surface/85 backdrop-blur-2xl shadow-2xl overflow-y-auto select-none transition-all duration-200',
        'w-full md:w-96 lg:w-[420px] shrink-0 z-20',
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line bg-surface/60 px-4 py-3 sticky top-0 backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          <span className="grid size-6.5 place-items-center rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <Sparkles size={13} />
          </span>
          <div>
            <h3 className="text-[12px] font-semibold text-fg">Project Deep Dive</h3>
            <p className="text-[10px] text-faint font-mono">{project.categoryName}</p>
          </div>
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
      <div className="p-4 space-y-5 text-[12.5px]">
        {/* Title & Metadata */}
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="text-[17px] font-bold text-fg tracking-tight leading-snug">
                {project.name}
              </h2>
              <p className="text-[12px] text-emerald-400 font-medium mt-0.5">
                {project.role}
              </p>
            </div>
            <span className="shrink-0 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] text-emerald-300">
              {project.duration}
            </span>
          </div>

          <p className="mt-2.5 text-[12px] text-fg/80 leading-relaxed bg-void/30 p-2.5 rounded-lg border border-line/40">
            {project.shortDescription}
          </p>
        </div>

        {/* Stats Row */}
        {project.stats?.length ? (
          <div className="grid grid-cols-3 gap-2">
            {project.stats.map((st) => (
              <div
                key={st.label}
                className="rounded-lg border border-line/60 bg-void/50 p-2 text-center"
              >
                <div className="font-mono text-[9.5px] uppercase tracking-wider text-faint">
                  {st.label}
                </div>
                <div className="text-[12px] font-bold text-emerald-300 mt-0.5">
                  {st.value}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {/* Problem & Solution Block */}
        <div className="space-y-2.5">
          <div className="rounded-lg border border-amber-500/25 bg-amber-500/5 p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-300 uppercase tracking-wider">
              <Zap size={12} /> The Challenge
            </div>
            <p className="text-[11.5px] text-fg/85 leading-relaxed">{project.problem}</p>
          </div>

          <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/5 p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300 uppercase tracking-wider">
              <CheckCircle2 size={12} /> Engineering Solution
            </div>
            <p className="text-[11.5px] text-fg/85 leading-relaxed">{project.solution}</p>
          </div>
        </div>

        {/* Key Engineering Deliverables */}
        {project.myContribution?.length ? (
          <div className="space-y-2">
            <h4 className="font-mono text-[10.5px] font-semibold uppercase tracking-wider text-faint flex items-center gap-1.5">
              <Briefcase size={12} className="text-emerald-400" />
              Key Architectural Contributions
            </h4>
            <ul className="space-y-1.5">
              {project.myContribution.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 rounded-lg border border-line/40 bg-void/30 p-2 text-[11.5px] text-fg/85 leading-relaxed"
                >
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-emerald-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* Architecture Flow Preview */}
        {project.architecture ? (
          <div className="space-y-2">
            <h4 className="font-mono text-[10.5px] font-semibold uppercase tracking-wider text-faint flex items-center gap-1.5">
              <Workflow size={12} className="text-violet-400" />
              Architecture Nodes ({project.architecture.nodes.length})
            </h4>
            <div className="grid grid-cols-2 gap-1.5">
              {project.architecture.nodes.slice(0, 6).map((node) => (
                <div
                  key={node.id}
                  className="rounded-md border border-line/50 bg-void/40 p-1.5 text-[11px]"
                >
                  <div className="font-semibold text-fg/90 truncate">{node.label}</div>
                  <div className="font-mono text-[9.5px] text-faint truncate">{node.technology}</div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Technologies Grid */}
        <div className="space-y-2">
          <h4 className="font-mono text-[10.5px] font-semibold uppercase tracking-wider text-faint">
            Technologies Used
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-line bg-surface/70 px-2 py-0.5 font-mono text-[11px] text-fg"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Open In Projects Action */}
        <div className="pt-2 border-t border-line/60">
          <OSButton
            size="md"
            variant="accent"
            onClick={() => openWindow('projects')}
            className="w-full justify-center gap-2 text-[12px]"
          >
            <span>Open in Projects Explorer</span>
            <ExternalLink size={13} />
          </OSButton>
        </div>
      </div>
    </aside>
  );
}
