'use client';

import type { ProjectCategory } from '@izhar-os/types';
import type { EnvironmentId } from '@izhar-os/types';
import { cn } from '@izhar-os/ui';
import { Bot, Database, Folder, FolderKanban, Server, Star } from 'lucide-react';

interface ProjectsSidebarProps {
  categories: ProjectCategory[];
  environment: EnvironmentId;
  currentCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export function ProjectsSidebar({
  categories,
  environment,
  currentCategory,
  onSelectCategory,
}: ProjectsSidebarProps) {
  const isMac = environment === 'macos';
  const isLinux = environment === 'linux';

  return (
    <nav
      aria-label="Projects navigation"
      className={cn(
        'os-scroll hidden h-full w-[180px] shrink-0 overflow-y-auto border-e border-line sm:block',
        isMac ? 'bg-white/[0.03] p-2.5' : isLinux ? 'bg-black/25 p-2' : 'bg-void/25 p-2.5',
      )}
    >
      <div className="mb-4">
        <p className="px-2 pb-1.5 text-[10px] font-medium tracking-[0.14em] text-faint uppercase">
          Library
        </p>
        <ul className="flex flex-col gap-0.5">
          <li>
            <SidebarItem
              id="all"
              label="All Projects"
              icon={<FolderKanban size={14} />}
              isCurrent={currentCategory === 'all'}
              isMac={isMac}
              isLinux={isLinux}
              onSelect={onSelectCategory}
            />
          </li>
          <li>
            <SidebarItem
              id="featured"
              label="Featured Work"
              icon={<Star size={14} className="text-amber-400" />}
              isCurrent={currentCategory === 'featured'}
              isMac={isMac}
              isLinux={isLinux}
              onSelect={onSelectCategory}
            />
          </li>
        </ul>
      </div>

      <div>
        <p className="px-2 pb-1.5 text-[10px] font-medium tracking-[0.14em] text-faint uppercase">
          Categories
        </p>
        <ul className="flex flex-col gap-0.5">
          {categories.map((cat) => (
            <li key={cat.id}>
              <SidebarItem
                id={cat.id}
                label={cat.shortName}
                icon={<CategoryGlyph icon={cat.icon} />}
                count={cat.count}
                isCurrent={currentCategory === cat.id}
                isMac={isMac}
                isLinux={isLinux}
                onSelect={onSelectCategory}
              />
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

function SidebarItem({
  id,
  label,
  icon,
  count,
  isCurrent,
  isMac,
  isLinux,
  onSelect,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  count?: number;
  isCurrent: boolean;
  isMac: boolean;
  isLinux: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      type="button"
      aria-current={isCurrent ? 'page' : undefined}
      onClick={() => onSelect(id)}
      className={cn(
        'flex w-full items-center justify-between gap-2 px-2.5 py-1.5 text-left text-[12px]',
        'transition-colors duration-120',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70',
        isMac ? 'rounded-md' : isLinux ? 'rounded-[4px]' : 'rounded-sm',
        isCurrent ? 'env-selected font-medium text-fg' : 'text-muted hover:bg-white/[0.055] hover:text-fg',
      )}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className={cn('shrink-0', isCurrent ? 'text-accent' : 'text-faint')}>{icon}</span>
        <span className="truncate">{label}</span>
      </div>
      {typeof count === 'number' ? (
        <span className="font-mono text-[10px] text-faint">{count}</span>
      ) : null}
    </button>
  );
}

function CategoryGlyph({ icon }: { icon: string }) {
  switch (icon) {
    case 'ai':
      return <Bot size={14} />;
    case 'server':
      return <Server size={14} />;
    case 'database':
      return <Database size={14} />;
    default:
      return <Folder size={14} />;
  }
}
