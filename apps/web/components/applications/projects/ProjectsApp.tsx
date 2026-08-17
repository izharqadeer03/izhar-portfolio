'use client';

import {
  PROJECT_CATEGORIES,
  getProjectById,
  searchProjects,
} from '@izhar-os/config';
import type { Project } from '@izhar-os/types';
import { SYSTEM_PROFILE } from '@izhar-os/config';
import { useCallback, useMemo, useState, type MouseEvent } from 'react';

import { ProjectDetailView } from '@/components/applications/projects/ProjectDetailView';
import {
  ProjectsContextMenu,
  type ContextMenuTarget,
} from '@/components/applications/projects/ProjectsContextMenu';
import { ProjectsGrid } from '@/components/applications/projects/ProjectsGrid';
import { ProjectsList } from '@/components/applications/projects/ProjectsList';
import {
  ProjectsSidebar,
} from '@/components/applications/projects/ProjectsSidebar';
import {
  ProjectsToolbar,
  type ListingView,
  type SortOption,
} from '@/components/applications/projects/ProjectsToolbar';
import { useEnvironment } from '@/hooks/useEnvironment';
import { useHasFinePointer } from '@/hooks/useSystemPreferences';
import { useWindowStore } from '@/lib/store/window-store';

interface Location {
  category: string;
  projectId: string | null;
}

const HOME_LOCATION: Location = { category: 'all', projectId: null };

export function ProjectsApp() {
  const environment = useEnvironment();
  const hasFinePointer = useHasFinePointer();
  const openWindow = useWindowStore((state) => state.openWindow);

  // History stack navigation
  const [nav, setNav] = useState<{ stack: Location[]; cursor: number }>({
    stack: [HOME_LOCATION],
    cursor: 0,
  });

  const [view, setView] = useState<ListingView>('grid');
  const [sort, setSort] = useState<SortOption>('featured');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    target: ContextMenuTarget;
  } | null>(null);

  const location = nav.stack[nav.cursor] ?? HOME_LOCATION;

  // Navigation helpers
  const navigate = useCallback((next: Location) => {
    setNav((current) => {
      const trimmed = current.stack.slice(0, current.cursor + 1);
      return { stack: [...trimmed, next], cursor: trimmed.length };
    });
    setQuery('');
    setSelectedId(null);
  }, []);

  const step = useCallback((delta: number) => {
    setNav((current) => ({
      ...current,
      cursor: Math.min(current.stack.length - 1, Math.max(0, current.cursor + delta)),
    }));
    setQuery('');
    setSelectedId(null);
  }, []);

  const canGoBack = nav.cursor > 0;
  const canGoForward = nav.cursor < nav.stack.length - 1;
  const canGoUp = location.projectId !== null || location.category !== 'all';

  // Filter & sort projects
  const activeCategory = useMemo(() => {
    return PROJECT_CATEGORIES.find((c) => c.id === location.category);
  }, [location.category]);

  const filteredProjects = useMemo(() => {
    let list = searchProjects(query, location.category);

    if (sort === 'name') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'tech-count') {
      list = [...list].sort((a, b) => b.technologies.length - a.technologies.length);
    } else if (sort === 'featured') {
      list = [...list].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return list;
  }, [location.category, query, sort]);

  const activeProject = useMemo(() => {
    return location.projectId ? getProjectById(location.projectId) : null;
  }, [location.projectId]);

  // Breadcrumbs path segments
  const segments = useMemo(() => {
    const base = ['Projects'];
    if (activeCategory) base.push(activeCategory.name);
    else if (location.category === 'featured') base.push('Featured Work');
    if (activeProject) base.push(activeProject.name);
    return base;
  }, [activeCategory, activeProject, location.category]);

  // Event handlers
  const handleOpenCategory = useCallback(
    (catId: string) => {
      navigate({ category: catId, projectId: null });
    },
    [navigate],
  );

  const handleOpenProject = useCallback(
    (project: Project) => {
      navigate({ category: project.category, projectId: project.id });
    },
    [navigate],
  );

  const handleContextMenu = useCallback(
    (event: MouseEvent, target: ContextMenuTarget) => {
      event.preventDefault();
      event.stopPropagation();
      setContextMenu({ x: event.clientX, y: event.clientY, target });
    },
    [],
  );

  const handleOpenNewWindow = useCallback(
    (target: ContextMenuTarget) => {
      openWindow('projects');
      if (target.type === 'project') {
        const p = getProjectById(target.id);
        if (p) handleOpenProject(p);
      }
    },
    [handleOpenProject, openWindow],
  );

  const handleCopyName = useCallback((name: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(name).catch(() => {});
    }
  }, []);

  return (
    <div className="flex h-full min-h-0 flex-col bg-surface/10 select-none">
      {/* OS Adaptive Toolbar */}
      <ProjectsToolbar
        environment={environment}
        segments={segments}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        canGoUp={canGoUp}
        view={view}
        sort={sort}
        query={query}
        onBack={() => step(-1)}
        onForward={() => step(1)}
        onUp={() => {
          if (location.projectId) navigate({ category: location.category, projectId: null });
          else navigate(HOME_LOCATION);
        }}
        onView={setView}
        onSort={setSort}
        onQuery={setQuery}
        onNavigateSegment={(index) => {
          if (index === 0) navigate(HOME_LOCATION);
          else if (index === 1 && activeCategory) navigate({ category: activeCategory.id, projectId: null });
        }}
      />

      {/* Main Body */}
      <div className="flex min-h-0 flex-1">
        <ProjectsSidebar
          categories={PROJECT_CATEGORIES}
          environment={environment}
          currentCategory={location.category}
          onSelectCategory={(catId) => navigate({ category: catId, projectId: null })}
        />

        <div className="min-w-0 flex-1">
          {activeProject ? (
            <ProjectDetailView
              project={activeProject}
              onBack={() => navigate({ category: location.category, projectId: null })}
            />
          ) : view === 'grid' ? (
            <ProjectsGrid
              categories={PROJECT_CATEGORIES}
              projects={filteredProjects}
              environment={environment}
              selectedId={selectedId}
              currentCategoryId={location.category}
              singleClickOpens={!hasFinePointer}
              onSelect={setSelectedId}
              onOpenCategory={handleOpenCategory}
              onOpenProject={handleOpenProject}
              onContextMenu={handleContextMenu}
            />
          ) : (
            <ProjectsList
              projects={filteredProjects}
              environment={environment}
              selectedId={selectedId}
              singleClickOpens={!hasFinePointer}
              onSelect={setSelectedId}
              onOpenProject={handleOpenProject}
              onContextMenu={handleContextMenu}
            />
          )}
        </div>
      </div>

      {/* Context Menu Popup */}
      {contextMenu ? (
        <ProjectsContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          target={contextMenu.target}
          onClose={() => setContextMenu(null)}
          onOpen={(t) => {
            if (t.type === 'category') handleOpenCategory(t.id);
            else {
              const p = getProjectById(t.id);
              if (p) handleOpenProject(p);
            }
          }}
          onOpenNewWindow={handleOpenNewWindow}
          onViewArchitecture={(t) => {
            const p = getProjectById(t.id);
            if (p) handleOpenProject(p);
          }}
          onCopyName={handleCopyName}
        />
      ) : null}

      {/* Status Bar */}
      <footer className="flex shrink-0 items-center justify-between border-t border-line px-3 py-1.5 text-[11.5px] text-muted">
        <span>
          {activeProject
            ? `${activeProject.name} · ${activeProject.role}`
            : `${filteredProjects.length} projects · Explore engineering portfolio`}
        </span>
        <span className="hidden sm:block text-faint">
          {SYSTEM_PROFILE.name} · {SYSTEM_PROFILE.role}
        </span>
      </footer>
    </div>
  );
}
