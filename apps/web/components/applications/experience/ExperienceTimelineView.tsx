'use client';

import { PROJECTS } from '@izhar-os/config';
import type { ExperienceItem, Project } from '@izhar-os/types';
import { cn, OSButton } from '@izhar-os/ui';
import {
  ArrowUpRight,
  Briefcase,
  Calendar,
  ChevronRight,
  ExternalLink,
  MapPin,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import React from 'react';

import { useWindowStore } from '@/lib/store/window-store';

interface ExperienceTimelineViewProps {
  experiences: ExperienceItem[];
  selectedId: string;
  onSelectExperience: (id: string) => void;
  onSelectProject: (project: Project) => void;
  activeTech: string;
}

export function ExperienceTimelineView({
  experiences,
  selectedId,
  onSelectExperience,
  onSelectProject,
  activeTech,
}: ExperienceTimelineViewProps) {
  const openWindow = useWindowStore((state) => state.openWindow);

  const activeExperience =
    experiences.find((exp) => exp.id === selectedId) ||
    experiences[0];

  // Resolve related project objects for the active experience
  const relatedProjectsData = (activeExperience?.relatedProjects || [])
    .map((projId) => PROJECTS.find((p) => p.id === projId))
    .filter((p): p is Project => Boolean(p));

  return (
    <div className="flex min-h-0 flex-1 flex-col md:flex-row">
      {/* Left Sidebar / Career Milestones Rail */}
      <aside className="os-scroll w-full md:w-84 md:border-r border-b md:border-b-0 border-line bg-void/20 overflow-y-auto shrink-0 p-3 md:p-4 space-y-3 select-none">
        <div className="flex items-center justify-between px-1">
          <span className="font-mono text-[10px] tracking-[0.14em] text-faint uppercase">
            Career Milestones ({experiences.length})
          </span>
          <span className="font-mono text-[10px] text-emerald-400">
            3+ Years Total
          </span>
        </div>

        {/* Timeline Items Track */}
        <div className="relative space-y-2.5 pl-3 before:absolute before:left-1 before:top-3 before:bottom-3 before:w-0.5 before:bg-line/80">
          {experiences.map((exp) => {
            const isSelected = exp.id === activeExperience?.id;

            return (
              <div key={exp.id} className="relative">
                {/* Node Milestone Dot */}
                <div
                  className={cn(
                    'absolute -left-3 top-4 size-2 rounded-full ring-4 transition-all duration-200',
                    isSelected
                      ? 'bg-emerald-400 ring-emerald-500/30 scale-125'
                      : 'bg-muted/60 ring-void/80 hover:bg-fg/80',
                  )}
                />

                <button
                  type="button"
                  onClick={() => onSelectExperience(exp.id)}
                  className={cn(
                    'w-full text-left rounded-xl p-3.5 border transition-all duration-150 relative overflow-hidden',
                    isSelected
                      ? 'border-emerald-500/40 bg-emerald-500/10 shadow-sm ring-1 ring-emerald-500/20'
                      : 'border-line/60 bg-surface/30 hover:border-line hover:bg-surface/50 text-muted',
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className={cn(
                        'text-[13px] font-bold leading-tight',
                        isSelected ? 'text-fg' : 'text-fg/90',
                      )}
                    >
                      {exp.role}
                    </h3>
                    {exp.current ? (
                      <span className="shrink-0 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9.5px] font-bold text-emerald-300 border border-emerald-500/30">
                        Active
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-1 text-[12px] font-semibold text-emerald-400/90">
                    {exp.company}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-faint">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} /> {exp.period}
                    </span>
                    <span className="font-mono text-[10.5px] font-medium text-fg/70">
                      {exp.duration}
                    </span>
                  </div>

                  {/* Focus Areas Preview */}
                  {exp.focusAreas?.length ? (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {exp.focusAreas.slice(0, 2).map((fa) => (
                        <span
                          key={fa}
                          className="rounded bg-void/50 px-1.5 py-0.2 font-mono text-[9.5px] text-faint truncate max-w-[130px]"
                        >
                          {fa}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </button>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Right Detail Pane */}
      <main className="os-scroll flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {activeExperience ? (
          <div className="space-y-6 animate-in fade-in-50 duration-150">
            {/* Header Box */}
            <div className="rounded-2xl border border-line bg-surface/30 p-5 md:p-6 space-y-4 shadow-xs">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[19px] md:text-[22px] font-bold text-fg tracking-tight">
                      {activeExperience.role}
                    </h2>
                    {activeExperience.current ? (
                      <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10.5px] font-semibold text-emerald-300 border border-emerald-500/30">
                        Present Role
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-1.5 flex flex-wrap items-center gap-3.5 text-[12.5px] text-muted">
                    <span className="font-semibold text-emerald-400 flex items-center gap-1">
                      <Briefcase size={13} /> {activeExperience.company}
                    </span>
                    <span className="flex items-center gap-1 text-faint">
                      <MapPin size={13} /> {activeExperience.location}
                    </span>
                    <span className="flex items-center gap-1 text-faint">
                      <Calendar size={13} /> {activeExperience.period} ({activeExperience.duration})
                    </span>
                  </div>
                </div>

                {activeExperience.companyUrl ? (
                  <a
                    href={activeExperience.companyUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-1.5 rounded-lg border border-line bg-surface/50 px-3 py-1.5 text-[12px] font-medium text-muted hover:text-fg hover:border-emerald-500/40 hover:bg-emerald-500/10 transition-all shadow-xs"
                  >
                    <span>Company Profile</span>
                    <ExternalLink size={12} />
                  </a>
                ) : null}
              </div>

              <p className="text-[13.5px] leading-relaxed text-fg/85 pt-3 border-t border-line/60">
                {activeExperience.summary}
              </p>

              {/* Focus Areas Chips */}
              {activeExperience.focusAreas?.length ? (
                <div className="space-y-2 pt-1">
                  <span className="font-mono text-[10.5px] uppercase tracking-wider text-faint">
                    Engineering Focus Areas
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeExperience.focusAreas.map((area) => (
                      <span
                        key={area}
                        className="rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[11.5px] font-medium text-emerald-300"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            {/* Metrics Row */}
            {activeExperience.metrics?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {activeExperience.metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-xl border border-line bg-surface/30 p-3.5 flex flex-col justify-between shadow-xs"
                  >
                    <span className="font-mono text-[10px] tracking-[0.12em] text-faint uppercase">
                      {metric.label}
                    </span>
                    <span className="mt-1 text-[17px] font-bold text-emerald-300">
                      {metric.value}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}

            {/* Key Engineering Outcomes */}
            <div className="space-y-3">
              <h4 className="text-[13px] font-bold tracking-wider text-fg uppercase flex items-center gap-2">
                <TrendingUp size={15} className="text-emerald-400" />
                Key Architectural & Engineering Outcomes
              </h4>
              <ul className="space-y-2.5">
                {activeExperience.achievements.map((achievement, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-[13px] leading-relaxed text-fg/85 rounded-xl border border-line/50 bg-void/30 p-3.5"
                  >
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-emerald-400 shadow-xs" />
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technologies & Core Stack */}
            <div className="space-y-2.5">
              <h4 className="font-mono text-[11px] font-semibold tracking-wider text-faint uppercase">
                Technologies & Core Stack
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {activeExperience.technologies.map((tech) => (
                  <span
                    key={tech}
                    className={cn(
                      'rounded-md border px-2.5 py-1 text-[12px] font-mono font-medium transition-colors',
                      activeTech.toLowerCase() === tech.toLowerCase()
                        ? 'bg-emerald-500/25 text-emerald-200 border-emerald-500/50'
                        : 'border-line bg-surface/60 text-fg',
                    )}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Related Major Projects Engineered Section */}
            {relatedProjectsData.length ? (
              <div className="rounded-2xl border border-line bg-surface/30 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-[13.5px] font-bold text-fg flex items-center gap-2">
                      <Sparkles size={15} className="text-violet-400" />
                      Major Systems Built During Tenure ({relatedProjectsData.length})
                    </h4>
                    <p className="text-[12px] text-muted">
                      Direct case studies and production architectures implemented.
                    </p>
                  </div>

                  <OSButton
                    size="sm"
                    variant="subtle"
                    onClick={() => openWindow('projects')}
                    className="shrink-0 text-[11.5px] hover:border-emerald-500/50 hover:text-emerald-300"
                  >
                    <span>All Projects</span>
                    <ChevronRight size={12} />
                  </OSButton>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {relatedProjectsData.map((proj) => (
                    <div
                      key={proj.id}
                      onClick={() => onSelectProject(proj)}
                      className="group cursor-pointer rounded-xl border border-line/60 bg-void/40 p-3.5 space-y-2 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h5 className="text-[13px] font-bold text-fg group-hover:text-emerald-300 transition-colors">
                          {proj.name}
                        </h5>
                        <ArrowUpRight size={13} className="text-muted group-hover:text-emerald-400 transition-colors shrink-0" />
                      </div>

                      <p className="text-[11.5px] text-muted leading-relaxed line-clamp-2">
                        {proj.shortDescription}
                      </p>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {proj.technologies.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="rounded bg-surface/60 border border-line/40 px-1.5 py-0.2 font-mono text-[9.5px] text-faint"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </main>
    </div>
  );
}
