'use client';

import type { ContactMessage } from '@izhar-os/database';
import { OSButton } from '@izhar-os/ui';
import {
  Briefcase,
  Code2,
  FolderGit2,
  Inbox,
  MapPin,
  RefreshCw,
  User,
} from 'lucide-react';
import React from 'react';
import type { AdminTab } from './AdminSidebar';

interface AdminOverviewTabProps {
  skillsCount: number;
  projectsCount: number;
  experiencesCount: number;
  messages: ContactMessage[];
  profileName: string;
  profileRole: string;
  location: string;
  onNavigate: (tab: AdminTab) => void;
  onTriggerSeed: () => void;
  isSeeding: boolean;
}

export function AdminOverviewTab({
  skillsCount,
  projectsCount,
  experiencesCount,
  messages,
  profileName,
  profileRole,
  location,
  onNavigate,
  onTriggerSeed,
  isSeeding,
}: AdminOverviewTabProps) {
  const unreadMessages = messages.filter((m) => m.status === 'unread');
  const recentMessages = messages.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-line bg-linear-to-r from-rose-500/10 via-surface/40 to-cyan-500/10 p-5 sm:p-6 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-block size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11.5px] font-mono tracking-wider text-emerald-400 uppercase font-semibold">
              Live Database Connected
            </span>
          </div>
          <h2 className="text-[18px] sm:text-[22px] font-bold text-white">
            Welcome, {profileName}
          </h2>
          <p className="text-[13px] text-muted max-w-[60ch]">
            All content on the portfolio is dynamically served from Supabase PostgreSQL.
            Any updates made here update immediately across the OS.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <OSButton
            size="md"
            variant="accent"
            onClick={onTriggerSeed}
            disabled={isSeeding}
            className="bg-rose-600 hover:bg-rose-500 text-white text-[12px]"
          >
            <RefreshCw size={13} className={isSeeding ? 'animate-spin' : ''} />
            <span>{isSeeding ? 'Seeding DB...' : 'Auto-Seed Defaults'}</span>
          </OSButton>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Projects Card */}
        <button
          type="button"
          onClick={() => onNavigate('projects')}
          className="text-left rounded-2xl border border-line bg-surface/30 p-4 sm:p-5 hover:border-line-strong hover:bg-surface/50 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="size-9 rounded-xl border border-cyan-500/30 bg-cyan-500/10 grid place-items-center text-cyan-400">
              <FolderGit2 size={18} />
            </span>
            <span className="text-[11px] font-mono text-faint group-hover:text-cyan-300 transition-colors">
              Manage →
            </span>
          </div>
          <p className="text-[26px] font-extrabold text-white mt-3">{projectsCount}</p>
          <p className="text-[12px] font-medium text-muted">Active Projects</p>
        </button>

        {/* Skills Card */}
        <button
          type="button"
          onClick={() => onNavigate('skills')}
          className="text-left rounded-2xl border border-line bg-surface/30 p-4 sm:p-5 hover:border-line-strong hover:bg-surface/50 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="size-9 rounded-xl border border-amber-500/30 bg-amber-500/10 grid place-items-center text-amber-400">
              <Code2 size={18} />
            </span>
            <span className="text-[11px] font-mono text-faint group-hover:text-amber-300 transition-colors">
              Manage →
            </span>
          </div>
          <p className="text-[26px] font-extrabold text-white mt-3">{skillsCount}</p>
          <p className="text-[12px] font-medium text-muted">Skills & Tech Stack</p>
        </button>

        {/* Experience Card */}
        <button
          type="button"
          onClick={() => onNavigate('experiences')}
          className="text-left rounded-2xl border border-line bg-surface/30 p-4 sm:p-5 hover:border-line-strong hover:bg-surface/50 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="size-9 rounded-xl border border-emerald-500/30 bg-emerald-500/10 grid place-items-center text-emerald-400">
              <Briefcase size={18} />
            </span>
            <span className="text-[11px] font-mono text-faint group-hover:text-emerald-300 transition-colors">
              Manage →
            </span>
          </div>
          <p className="text-[26px] font-extrabold text-white mt-3">{experiencesCount}</p>
          <p className="text-[12px] font-medium text-muted">Work Experiences</p>
        </button>

        {/* Inbox Card */}
        <button
          type="button"
          onClick={() => onNavigate('messages')}
          className="text-left rounded-2xl border border-line bg-surface/30 p-4 sm:p-5 hover:border-line-strong hover:bg-surface/50 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="size-9 rounded-xl border border-rose-500/30 bg-rose-500/10 grid place-items-center text-rose-400">
              <Inbox size={18} />
            </span>
            <span className="text-[11px] font-mono text-faint group-hover:text-rose-300 transition-colors">
              Inbox →
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-3">
            <p className="text-[26px] font-extrabold text-white">{messages.length}</p>
            {unreadMessages.length > 0 ? (
              <span className="text-[11.5px] font-semibold text-rose-400">
                ({unreadMessages.length} new)
              </span>
            ) : null}
          </div>
          <p className="text-[12px] font-medium text-muted">Inquiries & Messages</p>
        </button>
      </div>

      {/* Grid of Profile Summary & Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Quick Profile Info */}
        <div className="rounded-2xl border border-line bg-surface/30 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-fg flex items-center gap-2">
              <User size={15} className="text-rose-400" />
              <span>Identity & Status</span>
            </h3>
            <button
              type="button"
              onClick={() => onNavigate('profile')}
              className="text-[11px] text-rose-400 hover:underline"
            >
              Edit Profile
            </button>
          </div>

          <div className="space-y-3 text-[12.5px]">
            <div className="rounded-xl border border-line/60 bg-void/40 p-3 space-y-1">
              <p className="text-[11px] font-mono text-faint uppercase">Name & Role</p>
              <p className="font-bold text-fg">{profileName}</p>
              <p className="text-muted">{profileRole}</p>
            </div>

            <div className="rounded-xl border border-line/60 bg-void/40 p-3 space-y-1">
              <p className="text-[11px] font-mono text-faint uppercase">Location & Status</p>
              <div className="flex items-center gap-1.5 text-fg font-medium">
                <MapPin size={13} className="text-rose-400" />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 text-[11.5px] pt-1">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                <span>Available for Eng Roles & Projects</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Inquiries Inbox */}
        <div className="lg:col-span-2 rounded-2xl border border-line bg-surface/30 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-fg flex items-center gap-2">
              <Inbox size={15} className="text-cyan-400" />
              <span>Recent Contact Inquiries</span>
            </h3>
            <button
              type="button"
              onClick={() => onNavigate('messages')}
              className="text-[11px] text-cyan-400 hover:underline"
            >
              View All ({messages.length})
            </button>
          </div>

          {recentMessages.length === 0 ? (
            <div className="rounded-xl border border-line/60 bg-void/30 p-8 text-center text-muted text-[13px]">
              No messages received yet.
            </div>
          ) : (
            <div className="space-y-2">
              {recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => onNavigate('messages')}
                  className="rounded-xl border border-line/60 bg-void/40 p-3.5 hover:border-line-strong hover:bg-void/70 cursor-pointer transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`size-2 rounded-full ${
                          msg.status === 'unread' ? 'bg-rose-400 animate-pulse' : 'bg-faint'
                        }`}
                      />
                      <span className="font-bold text-[13px] text-white">{msg.name}</span>
                      <span className="text-[11.5px] text-faint font-mono">({msg.email})</span>
                    </div>
                    <span className="text-[11px] text-faint">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-[12px] text-muted line-clamp-1">{msg.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
