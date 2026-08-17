'use client';

import type { Project, ProjectCategory } from '@izhar-os/types';
import type { EnvironmentId } from '@izhar-os/types';
import { cn } from '@izhar-os/ui';
import { Bot, Database, Folder, FolderKanban, Server, Sparkles } from 'lucide-react';
import type { MouseEvent } from 'react';

interface ProjectsGridProps {
  categories: ProjectCategory[];
  projects: Project[];
  environment: EnvironmentId;
  selectedId: string | null;
  currentCategoryId: string;
  singleClickOpens: boolean;
  onSelect: (id: string) => void;
  onOpenCategory: (categoryId: string) => void;
  onOpenProject: (project: Project) => void;
  onContextMenu: (event: MouseEvent, item: { type: 'category' | 'project'; id: string; name: string }) => void;
}

export function ProjectsGrid({
  categories,
  projects,
  environment,
  selectedId,
  currentCategoryId,
  singleClickOpens,
  onSelect,
  onOpenCategory,
  onOpenProject,
  onContextMenu,
}: ProjectsGridProps) {
  const isMac = environment === 'macos';
  const showCategoryFolders = currentCategoryId === 'all';

  if (projects.length === 0 && (!showCategoryFolders || categories.length === 0)) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <Folder className="size-12 text-faint" />
        <p className="mt-3 text-[14px] font-medium text-fg">No projects match your filter.</p>
        <p className="mt-1 text-[12px] text-muted">Try resetting search query or selecting another category.</p>
      </div>
    );
  }

  return (
    <div className="os-scroll h-full overflow-y-auto p-4">
      {/* Category Folders Section (when viewing 'all') */}
      {showCategoryFolders ? (
        <div className="mb-6">
          <p className="mb-2.5 text-[11px] font-medium tracking-wider text-faint uppercase">
            Categories
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => {
              const isSelected = selectedId === `cat:${cat.id}`;
              return (
                <button
                  key={cat.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    if (singleClickOpens) onOpenCategory(cat.id);
                    else onSelect(`cat:${cat.id}`);
                  }}
                  onDoubleClick={() => onOpenCategory(cat.id)}
                  onContextMenu={(e) =>
                    onContextMenu(e, { type: 'category', id: cat.id, name: cat.name })
                  }
                  className={cn(
                    'group flex items-center gap-3 border p-3 text-left transition-all duration-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70',
                    'hover:-translate-y-[1px]',
                    isMac ? 'rounded-xl' : 'rounded-lg',
                    isSelected
                      ? 'env-selected border-accent/60'
                      : 'border-line/70 bg-surface/40 hover:border-line hover:bg-white/[0.04]',
                  )}
                >
                  <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent group-hover:scale-105 transition-transform">
                    <CategoryIcon icon={cat.icon} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-fg group-hover:text-accent">
                      {cat.name}
                    </p>
                    <p className="truncate text-[11px] text-muted">
                      {cat.count === 0 ? 'Coming soon' : `${cat.count} project${cat.count > 1 ? 's' : ''}`}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Projects Grid Section */}
      <div>
        {showCategoryFolders ? (
          <p className="mb-2.5 text-[11px] font-medium tracking-wider text-faint uppercase">
            Engineering Projects ({projects.length})
          </p>
        ) : null}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const isSelected = selectedId === `proj:${project.id}`;

            return (
              <div
                key={project.id}
                tabIndex={0}
                role="button"
                aria-pressed={isSelected}
                onClick={() => {
                  if (singleClickOpens) onOpenProject(project);
                  else onSelect(`proj:${project.id}`);
                }}
                onDoubleClick={() => onOpenProject(project)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onOpenProject(project);
                }}
                onContextMenu={(e) =>
                  onContextMenu(e, { type: 'project', id: project.id, name: project.name })
                }
                className={cn(
                  'group relative flex flex-col justify-between gap-3 overflow-hidden rounded-xl border p-4 text-left transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70',
                  'hover:-translate-y-[2px]',
                  isSelected
                    ? 'env-selected border-accent/70 shadow-lg'
                    : 'border-line/70 bg-surface/30 hover:border-accent/40 hover:bg-white/[0.04] hover:shadow-md',
                )}
              >
                {/* Featured shimmer overlay */}
                {project.featured ? (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background:
                        'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.03) 50%, transparent 60%)',
                    }}
                  />
                ) : null}
                {/* Card Top Header */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-accent/10 px-2 py-0.5 text-[10.5px] font-medium text-accent">
                      <Sparkles size={11} />
                      <span>{project.categoryName}</span>
                    </span>
                    {project.featured ? (
                      <span className="rounded bg-amber-500/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-amber-400">
                        FEATURED
                      </span>
                    ) : null}
                  </div>

                  <h3 className="text-[15px] font-bold text-fg group-hover:text-accent">
                    {project.name}
                  </h3>
                  <p className="line-clamp-2 text-[12px] text-muted">{project.shortDescription}</p>
                </div>

                {/* Card Footer: Technologies & Open Button */}
                <div className="flex flex-col gap-3 border-t border-line/50 pt-3">
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[10px] text-faint"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 ? (
                      <span className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[10px] text-faint">
                        +{project.technologies.length - 4}
                      </span>
                    ) : null}
                  </div>

                  <div className="flex items-center justify-between gap-2 text-[11.5px]">
                    <span className="text-faint">{project.role}</span>
                    <span className="font-medium text-accent transition-transform duration-200 group-hover:translate-x-0.5 group-hover:underline">
                      Open Project →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CategoryIcon({ icon }: { icon: string }) {
  switch (icon) {
    case 'ai':
      return <Bot size={20} />;
    case 'server':
      return <Server size={20} />;
    case 'database':
      return <Database size={20} />;
    default:
      return <FolderKanban size={20} />;
  }
}
