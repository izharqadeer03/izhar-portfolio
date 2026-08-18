'use client';

import type { Project } from '@izhar-os/types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import type { ApplicationViewProps } from '@/components/applications/ApplicationRegistry';
import { ExperienceProjectDrawer } from '@/components/applications/experience/ExperienceProjectDrawer';
import { ExperienceProjectsView } from '@/components/applications/experience/ExperienceProjectsView';
import { ExperienceTimelineView } from '@/components/applications/experience/ExperienceTimelineView';
import {
  ExperienceToolbar,
  type ExperienceViewMode,
} from '@/components/applications/experience/ExperienceToolbar';
import { usePortfolioStore } from '@/lib/store/portfolio-store';

export function ExperienceApp(_props: ApplicationViewProps) {
  const experiences = usePortfolioStore((state) => state.experiences);
  const projects = usePortfolioStore((state) => state.projects);
  const profile = usePortfolioStore((state) => state.profile);

  const [selectedId, setSelectedId] = useState<string>(experiences[0]?.id ?? '');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTech, setActiveTech] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ExperienceViewMode>('timeline');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Collect all unique technologies across all experiences and projects
  const allTechnologies = useMemo(() => {
    const set = new Set<string>();
    experiences.forEach((exp) => exp.technologies.forEach((t) => set.add(t)));
    projects.forEach((proj) => proj.technologies.forEach((t) => set.add(t)));
    return ['all', ...Array.from(set).sort()];
  }, [experiences, projects]);

  // Filter experiences based on search query and active technology
  const filteredExperiences = useMemo(() => {
    return experiences.filter((exp) => {
      const matchesTech =
        activeTech === 'all' ||
        exp.technologies.some((t) => t.toLowerCase() === activeTech.toLowerCase()) ||
        exp.focusAreas?.some((f) => f.toLowerCase().includes(activeTech.toLowerCase()));
      if (!matchesTech) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        exp.role.toLowerCase().includes(q) ||
        exp.company.toLowerCase().includes(q) ||
        exp.summary.toLowerCase().includes(q) ||
        exp.focusAreas?.some((f) => f.toLowerCase().includes(q)) ||
        exp.achievements.some((a) => a.toLowerCase().includes(q)) ||
        exp.technologies.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [experiences, activeTech, searchQuery]);

  // Keyboard shortcut listener (Esc closes project drawer or clears search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedProject) {
          setSelectedProject(null);
        } else if (searchQuery) {
          setSearchQuery('');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, searchQuery]);

  const handleSelectProject = useCallback((project: Project) => {
    setSelectedProject(project);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setSelectedProject(null);
  }, []);

  return (
    <div className="flex h-full min-h-0 flex-col bg-surface/15 select-none @container relative overflow-hidden">
      {/* Top Application Toolbar */}
      <ExperienceToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        activeTech={activeTech}
        onActiveTechChange={setActiveTech}
        allTechnologies={allTechnologies}
      />

      {/* Main Viewport Container */}
      <div className="flex min-h-0 flex-1 relative overflow-hidden">
        {viewMode === 'timeline' ? (
          <ExperienceTimelineView
            experiences={filteredExperiences}
            selectedId={selectedId}
            onSelectExperience={setSelectedId}
            onSelectProject={handleSelectProject}
            activeTech={activeTech}
          />
        ) : viewMode === 'projects' ? (
          <ExperienceProjectsView
            onSelectProject={handleSelectProject}
            searchQuery={searchQuery}
            activeTech={activeTech}
          />
        ) : (
          /* Full Overview / Comprehensive Cards View */
          <main className="os-scroll flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            {filteredExperiences.map((exp) => (
              <article
                key={exp.id}
                className="rounded-2xl border border-line bg-surface/30 p-5 md:p-6 space-y-4 shadow-xs"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[18px] font-bold text-fg">{exp.role}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-[12px] text-muted">
                      <span className="font-semibold text-emerald-400">{exp.company}</span>
                      <span>·</span>
                      <span>{exp.location}</span>
                      <span>·</span>
                      <span className="font-mono">{exp.period}</span>
                      <span className="rounded-md bg-void/50 px-1.5 py-0.2 font-mono text-[10px] text-emerald-300">
                        {exp.duration}
                      </span>
                    </div>
                  </div>
                  {exp.current ? (
                    <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300 border border-emerald-500/40">
                      Active Role
                    </span>
                  ) : null}
                </div>

                <p className="text-[13px] leading-relaxed text-fg/85">{exp.summary}</p>

                {/* Focus areas */}
                {exp.focusAreas?.length ? (
                  <div className="space-y-1.5 pt-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-faint">
                      Key Focus Areas:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {exp.focusAreas.map((fa) => (
                        <span
                          key={fa}
                          className="rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 font-medium text-[11px] text-emerald-300"
                        >
                          {fa}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Achievements */}
                <div className="space-y-2 pt-2 border-t border-line/50">
                  <h4 className="font-mono text-[10.5px] uppercase tracking-wider text-faint">
                    Engineering Achievements:
                  </h4>
                  <ul className="space-y-2">
                    {exp.achievements.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-[12.5px] text-fg/85 leading-relaxed">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-emerald-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technologies */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-line/40">
                  {exp.technologies.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-line/60 bg-void/50 px-2 py-0.5 font-mono text-[11px] text-fg/80"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </main>
        )}

        {/* Project Inspector Slide-Over Drawer */}
        {selectedProject ? (
          <ExperienceProjectDrawer project={selectedProject} onClose={handleCloseDrawer} />
        ) : null}
      </div>

      {/* OS Status Bar */}
      <footer className="flex shrink-0 items-center justify-between border-t border-line bg-surface/30 px-3.5 py-1.5 text-[11px] text-muted backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="inline-block size-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium text-fg/85">
            {experiences.length} Production Tenures · {profile.experience}
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-faint">
          <span>{projects.length} Major Architectural Systems</span>
          <span>·</span>
          <span>{profile.name}</span>
        </div>
      </footer>
    </div>
  );
}
