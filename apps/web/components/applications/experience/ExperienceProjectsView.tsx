'use client';

import { PROJECTS } from '@izhar-os/config';
import type { Project } from '@izhar-os/types';
import { cn, OSButton } from '@izhar-os/ui';
import {
  ArrowUpRight,
  Boxes,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Zap,
} from 'lucide-react';
import React, { useState } from 'react';

import { useWindowStore } from '@/lib/store/window-store';

interface ExperienceProjectsViewProps {
  onSelectProject: (project: Project) => void;
  searchQuery: string;
  activeTech: string;
}

export function ExperienceProjectsView({
  onSelectProject,
  searchQuery,
  activeTech,
}: ExperienceProjectsViewProps) {
  const openWindow = useWindowStore((state) => state.openWindow);
  const [expandedId, setExpandedId] = useState<string | null>(PROJECTS[0]?.id ?? null);

  // Filter projects matching search query and active technology
  const filteredProjects = PROJECTS.filter((proj) => {
    const matchesTech =
      activeTech === 'all' ||
      proj.technologies.some((t) => t.toLowerCase() === activeTech.toLowerCase());
    if (!matchesTech) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      proj.name.toLowerCase().includes(q) ||
      proj.description.toLowerCase().includes(q) ||
      proj.shortDescription.toLowerCase().includes(q) ||
      proj.role.toLowerCase().includes(q) ||
      proj.technologies.some((t) => t.toLowerCase().includes(q))
    );
  });

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="os-scroll flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
      {/* Top Banner Notice */}
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles size={15} className="text-emerald-400" />
            <h3 className="text-[13.5px] font-bold text-fg">
              Major Engineering Project Experience
            </h3>
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 font-mono text-[10px] text-emerald-300 border border-emerald-500/30">
              Mobiloitte & Systems
            </span>
          </div>
          <p className="text-[12px] text-muted leading-relaxed">
            Core production systems, AI search engines, microservices architectures, and real-time platforms engineered during my tenure.
          </p>
        </div>

        <OSButton
          size="sm"
          variant="subtle"
          onClick={() => openWindow('projects')}
          className="shrink-0 text-[11.5px] hover:border-emerald-500/50 hover:text-emerald-300"
        >
          <span>Open Full Projects Explorer</span>
          <ChevronRight size={13} />
        </OSButton>
      </div>

      {/* Projects Grid / Accordion */}
      <div className="space-y-4">
        {filteredProjects.map((project, idx) => {
          const isExpanded = expandedId === project.id;

          return (
            <article
              key={project.id}
              className={cn(
                'rounded-xl border transition-all duration-200 bg-surface/35 overflow-hidden',
                isExpanded
                  ? 'border-emerald-500/40 shadow-md bg-surface/50'
                  : 'border-line/70 hover:border-line hover:bg-surface/40',
              )}
            >
              {/* Project Card Header */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => toggleExpand(project.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleExpand(project.id);
                  }
                }}
                className="flex items-start justify-between gap-3 p-4 md:p-5 cursor-pointer select-none"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] text-emerald-400/90 font-semibold">
                      0{idx + 1}.
                    </span>
                    <h4 className="text-[15px] md:text-[16px] font-bold text-fg tracking-tight">
                      {project.name}
                    </h4>
                    <span className="rounded-md border border-line/60 bg-void/50 px-2 py-0.5 font-mono text-[10px] text-muted">
                      {project.categoryName}
                    </span>
                    {project.featured ? (
                      <span className="rounded-full bg-emerald-500/15 px-2 py-0.2 text-[10px] font-semibold text-emerald-300 border border-emerald-500/30">
                        Featured System
                      </span>
                    ) : null}
                  </div>

                  <p className="text-[12.5px] text-fg/80 leading-relaxed">
                    {project.shortDescription}
                  </p>

                  {/* Technology Badges Preview */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {project.technologies.slice(0, 6).map((tech) => (
                      <span
                        key={tech}
                        className={cn(
                          'rounded-md border px-2 py-0.5 font-mono text-[10.5px]',
                          activeTech.toLowerCase() === tech.toLowerCase()
                            ? 'bg-emerald-500/25 text-emerald-200 border-emerald-500/50 font-semibold'
                            : 'border-line/60 bg-void/40 text-fg/75',
                        )}
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 6 ? (
                      <span className="rounded-md border border-line/40 bg-void/20 px-1.5 py-0.5 font-mono text-[10px] text-faint">
                        +{project.technologies.length - 6} more
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-0.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProject(project);
                    }}
                    className="hidden sm:flex items-center gap-1 rounded-lg border border-line/60 bg-void/60 px-2.5 py-1 text-[11px] font-medium text-muted hover:text-fg hover:border-emerald-500/40 hover:bg-emerald-500/10 transition-all"
                    title="Deep Dive Inspector"
                  >
                    <span>Inspect</span>
                    <ArrowUpRight size={12} />
                  </button>

                  <div className="rounded-lg p-1.5 text-muted hover:text-fg transition-colors">
                    {isExpanded ? <ChevronDown size={17} /> : <ChevronRight size={17} />}
                  </div>
                </div>
              </div>

              {/* Expandable Project Details Body */}
              {isExpanded ? (
                <div className="border-t border-line/60 bg-void/20 p-4 md:p-5 space-y-4 animate-in fade-in-50 duration-200">
                  {/* Problem & Solution */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-3.5 space-y-1.5">
                      <div className="flex items-center gap-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-wider text-amber-300">
                        <Zap size={13} /> Engineering Challenge
                      </div>
                      <p className="text-[12px] text-fg/85 leading-relaxed">
                        {project.problem}
                      </p>
                    </div>

                    <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-3.5 space-y-1.5">
                      <div className="flex items-center gap-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-wider text-emerald-300">
                        <CheckCircle2 size={13} /> Architectural Solution
                      </div>
                      <p className="text-[12px] text-fg/85 leading-relaxed">
                        {project.solution}
                      </p>
                    </div>
                  </div>

                  {/* Contributions */}
                  {project.myContribution?.length ? (
                    <div className="space-y-2">
                      <h5 className="font-mono text-[10.5px] font-semibold uppercase tracking-wider text-faint flex items-center gap-1.5">
                        <Briefcase size={12} className="text-emerald-400" />
                        Key Engineering Outcomes
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {project.myContribution.map((contribution, cIdx) => (
                          <div
                            key={cIdx}
                            className="flex items-start gap-2 rounded-lg border border-line/40 bg-surface/30 p-2.5 text-[12px] text-fg/85 leading-relaxed"
                          >
                            <span className="mt-1 size-1.5 shrink-0 rounded-full bg-emerald-400" />
                            <span>{contribution}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {/* Complete Tech Stack */}
                  <div className="space-y-1.5 pt-1">
                    <h5 className="font-mono text-[10.5px] font-semibold uppercase tracking-wider text-faint">
                      Complete Technology Stack
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.map((t) => (
                        <span
                          key={t}
                          className="rounded-md border border-line/80 bg-void/60 px-2 py-0.5 font-mono text-[11px] text-fg font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-line/50">
                    <div className="flex items-center gap-2 text-[11.5px] text-muted">
                      <span className="font-medium text-emerald-400">Role: {project.role}</span>
                      <span>·</span>
                      <span className="text-faint">{project.duration}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <OSButton
                        size="sm"
                        variant="subtle"
                        onClick={() => onSelectProject(project)}
                        className="text-[11.5px]"
                      >
                        <span>Full Deep Dive</span>
                        <ArrowUpRight size={12} />
                      </OSButton>

                      <OSButton
                        size="sm"
                        variant="accent"
                        onClick={() => openWindow('projects')}
                        className="text-[11.5px]"
                      >
                        <span>Open in Projects Explorer</span>
                        <ExternalLink size={12} />
                      </OSButton>
                    </div>
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}

        {filteredProjects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line p-8 text-center space-y-2">
            <Boxes size={24} className="mx-auto text-faint" />
            <p className="text-[13px] font-medium text-fg">No projects match the current filter</p>
            <p className="text-[12px] text-muted">
              Try selecting "All Technologies" or clearing the search query.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
