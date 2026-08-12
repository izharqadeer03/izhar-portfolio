'use client';

import { APPLICATIONS, getApplication } from '@izhar-os/config';
import type { ApplicationDefinition, ApplicationId } from '@izhar-os/types';
import { createElement, type ComponentType } from 'react';

import { ComingSoonApp } from '@/components/applications/ComingSoonApp';
import { FilesApp } from '@/components/applications/FilesApp';
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
const APPLICATION_VIEWS: Partial<Record<ApplicationId, ComponentType<ApplicationViewProps>>> = {
  'system-info': SystemInformationApp,
  // Both of these render themselves differently per environment, and neither
  // is registered more than once — the environment is read inside the view,
  // not selected out here.
  files: FilesApp,
  terminal: TerminalApp,
  // Phase 2 registers about / projects / experience / skills / resume / contact.
  // Phase 3 registers ai-lab.
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
