'use client';

import { cn } from '@izhar-os/ui';
import { Copy, ExternalLink, FolderOpen, Layers } from 'lucide-react';
import { useEffect, useRef } from 'react';

export interface ContextMenuTarget {
  type: 'category' | 'project';
  id: string;
  name: string;
}

interface ProjectsContextMenuProps {
  x: number;
  y: number;
  target: ContextMenuTarget;
  onClose: () => void;
  onOpen: (target: ContextMenuTarget) => void;
  onOpenNewWindow: (target: ContextMenuTarget) => void;
  onViewArchitecture?: (target: ContextMenuTarget) => void;
  onCopyName: (name: string) => void;
}

export function ProjectsContextMenu({
  x,
  y,
  target,
  onClose,
  onOpen,
  onOpenNewWindow,
  onViewArchitecture,
  onCopyName,
}: ProjectsContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      style={{ top: y, left: x }}
      className={cn(
        'fixed z-50 flex w-48 flex-col rounded-lg border border-line bg-surface/95 p-1 text-[12px] shadow-2xl backdrop-blur-md',
        'animate-in fade-in-0 zoom-in-95 duration-100',
      )}
    >
      <div className="border-b border-line px-2 py-1 text-[10.5px] font-medium text-faint truncate">
        {target.name}
      </div>

      <button
        type="button"
        onClick={() => {
          onOpen(target);
          onClose();
        }}
        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-fg hover:bg-white/10"
      >
        <FolderOpen size={14} className="text-accent" />
        <span>Open</span>
      </button>

      <button
        type="button"
        onClick={() => {
          onOpenNewWindow(target);
          onClose();
        }}
        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-fg hover:bg-white/10"
      >
        <ExternalLink size={14} className="text-muted" />
        <span>Open in New Window</span>
      </button>

      {target.type === 'project' && onViewArchitecture ? (
        <button
          type="button"
          onClick={() => {
            onViewArchitecture(target);
            onClose();
          }}
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-fg hover:bg-white/10"
        >
          <Layers size={14} className="text-muted" />
          <span>View Architecture</span>
        </button>
      ) : null}

      <div className="my-0.5 h-px bg-line" role="separator" />

      <button
        type="button"
        onClick={() => {
          onCopyName(target.name);
          onClose();
        }}
        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-fg hover:bg-white/10"
      >
        <Copy size={14} className="text-muted" />
        <span>Copy Name</span>
      </button>
    </div>
  );
}
