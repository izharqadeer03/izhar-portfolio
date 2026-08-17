'use client';

import { APPLICATIONS, getApplication } from '@izhar-os/config';
import type { ApplicationDefinition, ApplicationId } from '@izhar-os/types';
import { createElement, type ComponentType } from 'react';

import { AboutApp } from '@/components/applications/about/AboutApp';
import { AiLabApp } from '@/components/applications/ai/AiLabApp';
import { ComingSoonApp } from '@/components/applications/ComingSoonApp';
import { ContactApp } from '@/components/applications/contact/ContactApp';
import { ExperienceApp } from '@/components/applications/experience/ExperienceApp';
import { FilesApp } from '@/components/applications/FilesApp';
import { ProjectsApp } from '@/components/applications/projects/ProjectsApp';
import { ResumeApp } from '@/components/applications/resume/ResumeApp';
import { SkillsApp } from '@/components/applications/skills/SkillsApp';
import { SystemInformationApp } from '@/components/applications/SystemInformationApp';
import { TerminalApp } from '@/components/applications/TerminalApp';

export interface ApplicationViewProps {
  application: ApplicationDefinition;
}

/**
 * The view registry: application id → the component rendered inside its window.
 *
 * This is the one place the desktop learns what an application *is*. Everything
 * else — the icon field, the launcher, search, the taskbar, the window manager —
 * works purely from the manifest in `@izhar-os/config`, so shipping a real
 * application later means writing its view and adding one line here. No desktop
 * code changes, and an unregistered application degrades to its placeholder
 * rather than to a blank window.
 */
const APPLICATION_VIEWS: Record<ApplicationId, ComponentType<ApplicationViewProps>> = {
  'system-info': SystemInformationApp,
  about: AboutApp,
  projects: ProjectsApp,
  experience: ExperienceApp,
  skills: SkillsApp,
  'ai-lab': AiLabApp,
  resume: ResumeApp,
  contact: ContactApp,
  files: FilesApp,
  terminal: TerminalApp,
};

/**
 * Renders an application's surface.
 *
 * Built with `createElement` from a module-scope table rather than by resolving
 * a component into a local variable — the table entries are stable references,
 * and this keeps that fact obvious to both readers and the compiler.
 */
export function ApplicationSurface({ application }: ApplicationViewProps) {
  const view = APPLICATION_VIEWS[application.id] ?? ComingSoonApp;
  return createElement(view, { application });
}

/** Whether an application has a real implementation yet. */
export function isApplicationImplemented(id: ApplicationId): boolean {
  return APPLICATION_VIEWS[id] !== undefined;
}

export { APPLICATIONS, getApplication };
