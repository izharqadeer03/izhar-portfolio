'use client';

import type { Project } from '@izhar-os/types';
import type { EnvironmentId } from '@izhar-os/types';
import { cn } from '@izhar-os/ui';
import { Bot, Database, FolderKanban, Server } from 'lucide-react';
import type { MouseEvent } from 'react';

interface ProjectsListProps {
  projects: Project[];
  environment: EnvironmentId;
  selectedId: string | null;
  singleClickOpens: boolean;
  onSelect: (id: string) => void;
  onOpenProject: (project: Project) => void;
  onContextMenu: (
    event: MouseEvent,
    item: { type: 'category' | 'project'; id: string; name: string },
  ) => void;
}

export function ProjectsList({
  projects,
  selectedId,
  singleClickOpens,
  onSelect,
  onOpenProject,
  onContextMenu,
}: ProjectsListProps) {
  if (projects.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-[12.5px] text-muted">
        No projects match your current selection.
      </div>
    );
  }

  return (
    <div className="os-scroll h-full overflow-y-auto">
      <table className="w-full border-collapse text-left">
        <thead className="sticky top-0 z-10 bg-surface/95 backdrop-blur-md">
          <tr className="border-b border-line">
            <th scope="col" className="px-4 py-2 text-[11px] font-medium text-faint">
              Name
            </th>
            <th
              scope="col"
              className="hidden px-4 py-2 text-[11px] font-medium text-faint sm:table-cell"
            >
              Category
            </th>
            <th
              scope="col"
              className="hidden px-4 py-2 text-[11px] font-medium text-faint md:table-cell"
            >
              Technologies
            </th>
            <th
              scope="col"
              className="hidden px-4 py-2 text-[11px] font-medium text-faint lg:table-cell"
            >
              Role
            </th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => {
            const isSelected = selectedId === `proj:${project.id}`;

            return (
              <tr
                key={project.id}
                tabIndex={0}
                aria-selected={isSelected}
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
                  'cursor-default border-b border-line/50 transition-colors duration-120',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-inset',
                  isSelected ? 'env-selected' : 'hover:bg-white/[0.045]',
                )}
              >
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-3">
                    <span className="grid size-7 shrink-0 place-items-center rounded bg-accent/10 text-accent">
                      <ProjectIcon icon={project.icon} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium text-fg">{project.name}</p>
                      <p className="truncate text-[11px] text-muted sm:hidden">
                        {project.categoryName}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="hidden px-4 py-2.5 text-[12px] text-muted sm:table-cell">
                  <span className="rounded bg-accent/10 px-2 py-0.5 font-mono text-[11px] text-accent">
                    {project.categoryName}
                  </span>
                </td>
                <td className="hidden px-4 py-2.5 text-[12px] text-muted md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[10.5px] text-faint"
                      >
                        {t}
                      </span>
                    ))}
                    {project.technologies.length > 3 ? (
                      <span className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[10.5px] text-faint">
                        +{project.technologies.length - 3}
                      </span>
                    ) : null}
                  </div>
                </td>
                <td className="hidden px-4 py-2.5 text-[12px] text-muted lg:table-cell">
                  {project.role}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ProjectIcon({ icon }: { icon: string }) {
  switch (icon) {
    case 'ai':
      return <Bot size={15} />;
    case 'server':
      return <Server size={15} />;
    case 'database':
      return <Database size={15} />;
    default:
      return <FolderKanban size={15} />;
  }
}
