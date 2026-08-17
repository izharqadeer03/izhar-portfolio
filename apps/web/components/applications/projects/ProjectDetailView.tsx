'use client';

import type { Project } from '@izhar-os/types';
import { OSButton, cn } from '@izhar-os/ui';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Code2,
  ExternalLink,
  Layers,
  Sparkles,
  UserCheck,
} from 'lucide-react';

import { ProjectArchitectureDiagram } from './ProjectArchitectureDiagram';
import { GithubIcon } from '@/components/system/BrandIcons';

interface ProjectDetailViewProps {
  project: Project;
  onBack: () => void;
}

export function ProjectDetailView({ project, onBack }: ProjectDetailViewProps) {
  return (
    <div className="os-scroll flex h-full min-h-0 flex-1 flex-col overflow-y-auto bg-surface/20">
      {/* Header Banner */}
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-line bg-surface/90 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-3 min-w-0">
          <OSButton size="sm" variant="ghost" onClick={onBack}>
            <ArrowLeft size={14} className="me-1" />
            <span>Back</span>
          </OSButton>
          <span className="h-4 w-px bg-line" role="presentation" />
          <div className="truncate">
            <h3 className="truncate text-[14px] font-semibold text-fg">{project.name}</h3>
            <p className="truncate text-[11px] text-muted">{project.categoryName}</p>
          </div>
        </div>

        {project.links && project.links.length > 0 ? (
          <div className="flex items-center gap-2 shrink-0">
            {project.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer noopener"
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-md border border-line bg-void/40 px-2.5 py-1 text-[12px] font-medium text-fg',
                  'transition-colors duration-150 hover:bg-white/10 hover:text-white',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70',
                )}
              >
                {link.type === 'github' ? (
                  <GithubIcon size={13} />
                ) : (
                  <ExternalLink size={13} />
                )}
                <span>{link.label}</span>
              </a>
            ))}
          </div>
        ) : null}
      </div>

      {/* Main Content Body */}
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 sm:p-6">
        {/* Title & Metadata Header */}
        <div className="flex flex-col gap-3 rounded-xl border border-line bg-surface/40 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="rounded-md bg-accent/15 px-2.5 py-1 font-mono text-[11px] font-medium text-accent">
              {project.categoryName}
            </span>
            <span className="text-[12px] font-medium text-muted">
              Role: <span className="text-fg">{project.role}</span> · {project.duration}
            </span>
          </div>

          <h2 className="text-xl font-bold tracking-tight text-fg sm:text-2xl">{project.name}</h2>
          <p className="text-[13.5px] leading-relaxed text-muted">{project.shortDescription}</p>

          {/* Quick Stats Badges */}
          {project.stats && project.stats.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-3 border-t border-line/60 pt-3">
              {project.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-2 rounded-lg border border-line/50 bg-void/30 px-3 py-1.5"
                >
                  <span className="text-[11px] text-faint">{stat.label}:</span>
                  <span className="font-mono text-[12px] font-bold text-accent">{stat.value}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* Overview & Core Concept */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2 border-b border-line pb-2">
            <Sparkles size={15} className="text-accent" />
            <h3 className="text-[15px] font-semibold text-fg">Overview</h3>
          </div>
          <div className="flex flex-col gap-3 text-[13px] leading-relaxed text-fg/90">
            {project.overview.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </section>

        {/* Problem vs Solution */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
            <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle size={15} />
              <h4 className="text-[13.5px] font-semibold">The Problem</h4>
            </div>
            <p className="text-[12.5px] leading-relaxed text-fg/80">{project.problem}</p>
          </div>

          <div className="flex flex-col gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 size={15} />
              <h4 className="text-[13.5px] font-semibold">The Solution</h4>
            </div>
            <p className="text-[12.5px] leading-relaxed text-fg/80">{project.solution}</p>
          </div>
        </div>

        {/* Technology Stack */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2 border-b border-line pb-2">
            <Code2 size={15} className="text-accent" />
            <h3 className="text-[15px] font-semibold text-fg">Technology Stack</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-1.5 rounded-md border border-line bg-void/50 px-2.5 py-1 text-[12px] font-medium text-fg/90"
              >
                <span className="size-1.5 rounded-full bg-accent" />
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* My Contribution */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2 border-b border-line pb-2">
            <UserCheck size={15} className="text-accent" />
            <h3 className="text-[15px] font-semibold text-fg">My Contribution</h3>
          </div>
          <ul className="flex flex-col gap-2">
            {project.myContribution.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[12.5px] text-fg/90">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Interactive Architecture Diagram */}
        {project.architecture ? (
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b border-line pb-2">
              <Layers size={15} className="text-accent" />
              <h3 className="text-[15px] font-semibold text-fg">System Architecture</h3>
            </div>
            <ProjectArchitectureDiagram architecture={project.architecture} />
          </section>
        ) : null}

        {/* Key Engineering Challenges & Solutions */}
        {project.challenges && project.challenges.length > 0 ? (
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b border-line pb-2">
              <AlertTriangle size={15} className="text-amber-400" />
              <h3 className="text-[15px] font-semibold text-fg">Key Engineering Challenges</h3>
            </div>
            <div className="flex flex-col gap-4">
              {project.challenges.map((challenge, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-2 rounded-xl border border-line bg-surface/30 p-4"
                >
                  <h4 className="text-[13.5px] font-semibold text-accent">{challenge.title}</h4>
                  <div className="text-[12.5px] leading-relaxed text-muted">
                    <strong className="text-fg/90">Challenge:</strong> {challenge.problem}
                  </div>
                  <div className="text-[12.5px] leading-relaxed text-fg/90">
                    <strong className="text-emerald-400">Engineering Solution:</strong>{' '}
                    {challenge.solution}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
