'use client';

import { cn } from '@izhar-os/ui';
import {
  Briefcase,
  Code2,
  Database,
  FileText,
  FolderGit2,
  Inbox,
  LayoutDashboard,
  User,
} from 'lucide-react';
import React from 'react';

export type AdminTab =
  | 'overview'
  | 'messages'
  | 'profile'
  | 'projects'
  | 'skills'
  | 'experiences'
  | 'resume'
  | 'database';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  unreadCount?: number;
}

interface AdminNavItem {
  id: AdminTab;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: number;
  accent?: string;
}

export function AdminSidebar({
  activeTab,
  onTabChange,
  unreadCount = 0,
}: AdminSidebarProps) {
  const navItems: AdminNavItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    {
      id: 'messages',
      label: 'Inbox / Inquiries',
      icon: Inbox,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { id: 'profile', label: 'Profile & About', icon: User },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'skills', label: 'Skills & Stack', icon: Code2 },
    { id: 'experiences', label: 'Experience', icon: Briefcase },
    { id: 'resume', label: 'Resume & Edu', icon: FileText },
    { id: 'database', label: 'Database & Sync', icon: Database },
  ];

  return (
    <aside className="w-full md:w-60 lg:w-64 shrink-0 border-r border-line bg-[#090c12]/60 p-3 space-y-1 overflow-x-auto md:overflow-y-auto os-scroll">
      <div className="hidden md:block px-3 py-2 text-[10.5px] font-mono tracking-[0.14em] text-faint uppercase">
        Management Areas
      </div>

      <nav className="flex md:flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={cn(
                'flex items-center justify-between rounded-xl px-3 py-2.5 text-[12.5px] font-medium transition-all text-left whitespace-nowrap',
                isActive
                  ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30 shadow-xs'
                  : 'text-muted hover:bg-white/[0.04] hover:text-fg border border-transparent',
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  size={15}
                  className={cn(
                    'shrink-0',
                    isActive ? 'text-rose-400' : 'text-faint',
                  )}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {typeof item.badge === 'number' && item.badge > 0 ? (
                <span className="ml-2 rounded-full bg-rose-500 px-1.5 py-0.2 text-[10px] font-bold text-white shadow-xs animate-pulse">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
