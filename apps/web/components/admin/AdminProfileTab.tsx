'use client';

import type { AboutProfile, SystemProfile } from '@izhar-os/types';
import { OSButton } from '@izhar-os/ui';
import { Loader2, Plus, Save, Trash2, User } from 'lucide-react';
import React, { useState } from 'react';

interface AdminProfileTabProps {
  initialProfile: SystemProfile;
  initialAbout: AboutProfile;
  onSaveProfile: (profile: SystemProfile) => Promise<void>;
  onSaveAbout: (about: AboutProfile) => Promise<void>;
}

export function AdminProfileTab({
  initialProfile,
  initialAbout,
  onSaveProfile,
  onSaveAbout,
}: AdminProfileTabProps) {
  const [profile, setProfile] = useState<SystemProfile>(initialProfile);
  const [about, setAbout] = useState<AboutProfile>(initialAbout);
  const [disciplinesInput, setDisciplinesInput] = useState(
    initialProfile.disciplines.join(', '),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      const disciplines = disciplinesInput
        .split(',')
        .map((d) => d.trim())
        .filter(Boolean);

      const updatedProfile = { ...profile, disciplines };
      await Promise.all([
        onSaveProfile(updatedProfile),
        onSaveAbout(about),
      ]);

      setProfile(updatedProfile);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSaveAll} className="space-y-8 max-w-4xl">
      {/* Top Header & Save Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
        <div>
          <h2 className="text-[18px] font-bold text-fg flex items-center gap-2">
            <User size={18} className="text-rose-400" />
            <span>Profile & About Content</span>
          </h2>
          <p className="text-[12px] text-muted">
            Configure system identity, biography, positioning, and featured metrics.
          </p>
        </div>

        <OSButton
          size="md"
          variant="accent"
          type="submit"
          disabled={isSaving}
          className="bg-rose-600 hover:bg-rose-500 text-white font-medium text-[12.5px]"
        >
          {isSaving ? (
            <>
              <Loader2 size={13} className="animate-spin mr-1.5" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save size={13} className="mr-1.5" />
              <span>{savedSuccess ? 'Saved to Supabase!' : 'Save All Changes'}</span>
            </>
          )}
        </OSButton>
      </div>

      {/* 1. Core Identity */}
      <section className="rounded-2xl border border-line bg-surface/30 p-5 space-y-4">
        <h3 className="text-[14px] font-bold text-fg uppercase tracking-wider text-rose-400 font-mono">
          1. System Identity & Headings
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[11.5px] font-semibold text-faint uppercase">Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full h-9 rounded-lg border border-line bg-void/60 px-3 text-[13px] text-fg focus:border-rose-500/60 focus:outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11.5px] font-semibold text-faint uppercase">Wordmark</label>
            <input
              type="text"
              value={profile.wordmark}
              onChange={(e) => setProfile({ ...profile, wordmark: e.target.value })}
              className="w-full h-9 rounded-lg border border-line bg-void/60 px-3 text-[13px] text-fg focus:border-rose-500/60 focus:outline-hidden"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-[11.5px] font-semibold text-faint uppercase">Professional Role / Title</label>
            <input
              type="text"
              value={profile.role}
              onChange={(e) => setProfile({ ...profile, role: e.target.value })}
              className="w-full h-9 rounded-lg border border-line bg-void/60 px-3 text-[13px] text-fg focus:border-rose-500/60 focus:outline-hidden"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-[11.5px] font-semibold text-faint uppercase">
              Core Disciplines (comma separated)
            </label>
            <input
              type="text"
              value={disciplinesInput}
              onChange={(e) => setDisciplinesInput(e.target.value)}
              className="w-full h-9 rounded-lg border border-line bg-void/60 px-3 text-[13px] text-fg focus:border-rose-500/60 focus:outline-hidden font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11.5px] font-semibold text-faint uppercase">Location</label>
            <input
              type="text"
              value={profile.location}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              className="w-full h-9 rounded-lg border border-line bg-void/60 px-3 text-[13px] text-fg focus:border-rose-500/60 focus:outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11.5px] font-semibold text-faint uppercase">Experience String</label>
            <input
              type="text"
              value={profile.experience}
              onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
              className="w-full h-9 rounded-lg border border-line bg-void/60 px-3 text-[13px] text-fg focus:border-rose-500/60 focus:outline-hidden"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-[11.5px] font-semibold text-faint uppercase">Tagline</label>
            <input
              type="text"
              value={profile.tagline}
              onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
              className="w-full h-9 rounded-lg border border-line bg-void/60 px-3 text-[13px] text-fg focus:border-rose-500/60 focus:outline-hidden"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-[11.5px] font-semibold text-faint uppercase">Executive Statement / Bio</label>
            <textarea
              rows={3}
              value={profile.statement}
              onChange={(e) => setProfile({ ...profile, statement: e.target.value })}
              className="w-full rounded-lg border border-line bg-void/60 p-3 text-[13px] text-fg focus:border-rose-500/60 focus:outline-hidden resize-none"
            />
          </div>
        </div>
      </section>

      {/* 2. Availability Status */}
      <section className="rounded-2xl border border-line bg-surface/30 p-5 space-y-4">
        <h3 className="text-[14px] font-bold text-fg uppercase tracking-wider text-emerald-400 font-mono">
          2. Availability & Engagement Notice
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[11.5px] font-semibold text-faint uppercase">Status Label</label>
            <input
              type="text"
              value={profile.status.label}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  status: { ...profile.status, label: e.target.value },
                })
              }
              className="w-full h-9 rounded-lg border border-line bg-void/60 px-3 text-[13px] text-fg focus:border-rose-500/60 focus:outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11.5px] font-semibold text-faint uppercase">State Flag</label>
            <select
              value={profile.status.state}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  status: {
                    ...profile.status,
                    state: e.target.value as 'available' | 'busy' | 'offline',
                  },
                })
              }
              className="w-full h-9 rounded-lg border border-line bg-void/60 px-3 text-[13px] text-fg focus:border-rose-500/60 focus:outline-hidden"
            >
              <option value="available">Available (Green)</option>
              <option value="busy">Busy (Amber)</option>
              <option value="offline">Offline (Gray)</option>
            </select>
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-[11.5px] font-semibold text-faint uppercase">Status Detail Message</label>
            <input
              type="text"
              value={profile.status.detail}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  status: { ...profile.status, detail: e.target.value },
                })
              }
              className="w-full h-9 rounded-lg border border-line bg-void/60 px-3 text-[13px] text-fg focus:border-rose-500/60 focus:outline-hidden"
            />
          </div>
        </div>
      </section>

      {/* 3. About Positioning & Intro */}
      <section className="rounded-2xl border border-line bg-surface/30 p-5 space-y-4">
        <h3 className="text-[14px] font-bold text-fg uppercase tracking-wider text-cyan-400 font-mono">
          3. About Pitch & Introduction
        </h3>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11.5px] font-semibold text-faint uppercase">Pitch Positioning</label>
            <textarea
              rows={3}
              value={about.positioning}
              onChange={(e) => setAbout({ ...about, positioning: e.target.value })}
              className="w-full rounded-lg border border-line bg-void/60 p-3 text-[13px] text-fg focus:border-rose-500/60 focus:outline-hidden resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11.5px] font-semibold text-faint uppercase block">
              Introduction Paragraphs
            </label>
            {about.introduction.map((para, idx) => (
              <div key={idx} className="flex gap-2">
                <textarea
                  rows={2}
                  value={para}
                  onChange={(e) => {
                    const next = [...about.introduction];
                    next[idx] = e.target.value;
                    setAbout({ ...about, introduction: next });
                  }}
                  className="w-full rounded-lg border border-line bg-void/60 p-2.5 text-[12.5px] text-fg focus:border-rose-500/60 focus:outline-hidden resize-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    const next = about.introduction.filter((_, i) => i !== idx);
                    setAbout({ ...about, introduction: next });
                  }}
                  className="p-2 text-muted hover:text-rose-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setAbout({
                  ...about,
                  introduction: [...about.introduction, 'New introductory paragraph...'],
                })
              }
              className="text-[11.5px] text-cyan-400 hover:underline flex items-center gap-1"
            >
              <Plus size={12} /> Add Paragraph
            </button>
          </div>
        </div>
      </section>

      {/* 4. Stats Counters */}
      <section className="rounded-2xl border border-line bg-surface/30 p-5 space-y-4">
        <h3 className="text-[14px] font-bold text-fg uppercase tracking-wider text-amber-400 font-mono">
          4. Stats Cards & Highlight Counters
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {about.stats.map((stat, idx) => (
            <div key={stat.id || idx} className="rounded-xl border border-line/60 bg-void/40 p-3 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10.5px] text-faint uppercase font-mono">Value</label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => {
                      const next = [...about.stats];
                      next[idx] = { ...stat, value: e.target.value };
                      setAbout({ ...about, stats: next });
                    }}
                    className="w-full h-8 rounded-md border border-line bg-void/70 px-2 text-[12.5px] font-bold text-white"
                  />
                </div>
                <div>
                  <label className="text-[10.5px] text-faint uppercase font-mono">Label</label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => {
                      const next = [...about.stats];
                      next[idx] = { ...stat, label: e.target.value };
                      setAbout({ ...about, stats: next });
                    }}
                    className="w-full h-8 rounded-md border border-line bg-void/70 px-2 text-[12.5px] text-fg"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10.5px] text-faint uppercase font-mono">Detail Subtitle</label>
                <input
                  type="text"
                  value={stat.detail}
                  onChange={(e) => {
                    const next = [...about.stats];
                    next[idx] = { ...stat, detail: e.target.value };
                    setAbout({ ...about, stats: next });
                  }}
                  className="w-full h-8 rounded-md border border-line bg-void/70 px-2 text-[11.5px] text-muted"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Save Button Bar */}
      <div className="flex justify-end pt-2">
        <OSButton
          size="md"
          variant="accent"
          type="submit"
          disabled={isSaving}
          className="bg-rose-600 hover:bg-rose-500 text-white font-medium px-8"
        >
          {isSaving ? (
            <>
              <Loader2 size={14} className="animate-spin mr-2" />
              <span>Saving to Supabase...</span>
            </>
          ) : (
            <>
              <Save size={14} className="mr-2" />
              <span>{savedSuccess ? 'Saved Successfully!' : 'Save All Changes'}</span>
            </>
          )}
        </OSButton>
      </div>
    </form>
  );
}
