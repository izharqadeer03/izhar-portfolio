'use client';

import type { ExperienceItem } from '@izhar-os/types';
import { OSButton } from '@izhar-os/ui';
import {
  Briefcase,
  Calendar,
  Edit,
  Loader2,
  MapPin,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import React, { useState } from 'react';

interface AdminExperiencesTabProps {
  experiences: ExperienceItem[];
  onSaveExperience: (exp: ExperienceItem) => Promise<void>;
  onDeleteExperience: (id: string) => Promise<void>;
}

export function AdminExperiencesTab({
  experiences,
  onSaveExperience,
  onDeleteExperience,
}: AdminExperiencesTabProps) {
  const [editingExp, setEditingExp] = useState<ExperienceItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [techInput, setTechInput] = useState('');
  const [achievementsInput, setAchievementsInput] = useState('');

  const handleOpenCreate = () => {
    const newExp: ExperienceItem = {
      id: `exp-${Date.now().toString(36)}`,
      role: '',
      company: '',
      location: 'New Delhi, India',
      period: '2024 — Present',
      duration: '1 Year',
      current: true,
      summary: '',
      achievements: [],
      technologies: [],
    };
    setEditingExp(newExp);
    setIsNew(true);
    setTechInput('');
    setAchievementsInput('');
  };

  const handleOpenEdit = (exp: ExperienceItem) => {
    setEditingExp(exp);
    setIsNew(false);
    setTechInput(exp.technologies.join(', '));
    setAchievementsInput(exp.achievements.join('\n'));
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp || !editingExp.role.trim() || !editingExp.company.trim()) return;

    setIsSaving(true);
    try {
      const technologies = techInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const achievements = achievementsInput
        .split('\n')
        .map((a) => a.trim())
        .filter(Boolean);

      const payload: ExperienceItem = {
        ...editingExp,
        technologies,
        achievements,
      };

      await onSaveExperience(payload);
      setEditingExp(null);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4">
        <div>
          <h2 className="text-[18px] font-bold text-fg flex items-center gap-2">
            <Briefcase size={18} className="text-emerald-400" />
            <span>Work Experience & Engineering Tenures</span>
          </h2>
          <p className="text-[12px] text-muted">
            Manage career history, achievements, responsibilities, and technologies used.
          </p>
        </div>

        <OSButton
          size="md"
          variant="accent"
          onClick={handleOpenCreate}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[12px]"
        >
          <Plus size={14} className="mr-1" />
          <span>Add Work Experience</span>
        </OSButton>
      </div>

      {/* Experience List */}
      <div className="space-y-4">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="rounded-2xl border border-line bg-surface/30 p-5 space-y-3 hover:border-emerald-500/40 hover:bg-surface/50 transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-[16px] font-bold text-white">{exp.role}</h3>
                  <span className="text-[13px] font-semibold text-emerald-400">@ {exp.company}</span>
                  {exp.current ? (
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.2 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                      Current Role
                    </span>
                  ) : null}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-[11.5px] text-muted">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} className="text-faint" />
                    <span>{exp.period}</span>
                    <span className="font-mono text-faint">({exp.duration})</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MapPin size={12} className="text-faint" />
                    <span>{exp.location}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(exp)}
                  className="p-1.5 rounded-lg border border-line text-muted hover:text-white hover:bg-white/10"
                  title="Edit Experience"
                >
                  <Edit size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Delete experience at "${exp.company}"?`)) {
                      onDeleteExperience(exp.id);
                    }
                  }}
                  className="p-1.5 rounded-lg border border-line text-muted hover:text-rose-400 hover:bg-rose-500/10"
                  title="Delete Experience"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            <p className="text-[13px] text-fg/90 leading-relaxed">{exp.summary}</p>

            {/* Achievements bullets */}
            {exp.achievements.length > 0 ? (
              <ul className="space-y-1 pl-1">
                {exp.achievements.map((ach, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[12px] text-muted">
                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-emerald-400" />
                    <span>{ach}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            {/* Technologies */}
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-line/50">
              {exp.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-md border border-line/60 bg-void/50 px-2 py-0.5 font-mono text-[10.5px] text-faint"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Experience Editor Modal */}
      {editingExp ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl my-8 rounded-2xl border border-line bg-[#0e1218] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="text-[16px] font-bold text-white">
                {isNew ? 'Add Experience' : `Edit: ${editingExp.role} @ ${editingExp.company}`}
              </h3>
              <button
                type="button"
                onClick={() => setEditingExp(null)}
                className="p-1 rounded-lg text-muted hover:text-fg"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1 os-scroll">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-faint uppercase">Job Title / Role</label>
                  <input
                    type="text"
                    required
                    value={editingExp.role}
                    onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
                    placeholder="e.g. Lead Software Engineer"
                    className="w-full h-9 rounded-lg border border-line bg-void/60 px-3 text-[13px] text-fg focus:border-emerald-500/60 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-faint uppercase">Company Name</label>
                  <input
                    type="text"
                    required
                    value={editingExp.company}
                    onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                    placeholder="e.g. Acme Systems"
                    className="w-full h-9 rounded-lg border border-line bg-void/60 px-3 text-[13px] text-fg focus:border-emerald-500/60 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-faint uppercase">Period (Dates)</label>
                  <input
                    type="text"
                    value={editingExp.period}
                    onChange={(e) => setEditingExp({ ...editingExp, period: e.target.value })}
                    placeholder="e.g. 2024 — Present"
                    className="w-full h-9 rounded-lg border border-line bg-void/60 px-3 text-[13px] text-fg focus:border-emerald-500/60 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-faint uppercase">Duration String</label>
                  <input
                    type="text"
                    value={editingExp.duration}
                    onChange={(e) => setEditingExp({ ...editingExp, duration: e.target.value })}
                    placeholder="e.g. 1 Year, 6 Mos"
                    className="w-full h-9 rounded-lg border border-line bg-void/60 px-3 text-[13px] text-fg focus:border-emerald-500/60 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-semibold text-faint uppercase">Location</label>
                  <input
                    type="text"
                    value={editingExp.location}
                    onChange={(e) => setEditingExp({ ...editingExp, location: e.target.value })}
                    placeholder="e.g. New Delhi, India"
                    className="w-full h-9 rounded-lg border border-line bg-void/60 px-3 text-[13px] text-fg focus:border-emerald-500/60 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-semibold text-faint uppercase">Role Description / Summary</label>
                  <textarea
                    rows={2}
                    value={editingExp.summary}
                    onChange={(e) => setEditingExp({ ...editingExp, summary: e.target.value })}
                    className="w-full rounded-lg border border-line bg-void/60 p-2.5 text-[12.5px] text-fg focus:border-emerald-500/60 focus:outline-hidden resize-none"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-semibold text-faint uppercase">
                    Achievements & Bullet Points (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={achievementsInput}
                    onChange={(e) => setAchievementsInput(e.target.value)}
                    placeholder="Reduced latency by 40%...&#10;Engineered real-time sync..."
                    className="w-full rounded-lg border border-line bg-void/60 p-2.5 text-[12.5px] text-fg focus:border-emerald-500/60 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-semibold text-faint uppercase">
                    Technologies (comma separated)
                  </label>
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    placeholder="Golang, PostgreSQL, Redis, Docker..."
                    className="w-full h-9 rounded-lg border border-line bg-void/60 px-3 text-[13px] text-fg focus:border-emerald-500/60 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[12.5px] text-fg">
                  <input
                    type="checkbox"
                    checked={editingExp.current}
                    onChange={(e) => setEditingExp({ ...editingExp, current: e.target.checked })}
                    className="size-4 rounded accent-emerald-500"
                  />
                  <span>Currently working in this role</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-line">
                <OSButton size="sm" variant="subtle" type="button" onClick={() => setEditingExp(null)}>
                  Cancel
                </OSButton>
                <OSButton
                  size="sm"
                  variant="accent"
                  type="submit"
                  disabled={isSaving}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={13} className="animate-spin mr-1" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Experience</span>
                  )}
                </OSButton>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
