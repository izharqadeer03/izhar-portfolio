'use client';

import type { SkillCategory, SkillItem } from '@izhar-os/types';
import { cn, OSButton } from '@izhar-os/ui';
import {
  Code2,
  Edit,
  Loader2,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';

interface AdminSkillsTabProps {
  skills: SkillItem[];
  categories: SkillCategory[];
  onSaveSkill: (skill: SkillItem) => Promise<void>;
  onDeleteSkill: (id: string) => Promise<void>;
}

export function AdminSkillsTab({
  skills,
  categories,
  onSaveSkill,
  onDeleteSkill,
}: AdminSkillsTabProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [tagsInput, setTagsInput] = useState('');
  const [projectsInput, setProjectsInput] = useState('');

  const filteredSkills = useMemo(() => {
    return skills.filter((s) => {
      if (activeCategory !== 'all' && s.category !== activeCategory) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.tags?.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [skills, activeCategory, search]);

  const handleOpenCreate = () => {
    const defaultCat = categories[0]?.id || 'backend';
    const newSkill: SkillItem = {
      id: `skill-${Date.now().toString(36)}`,
      name: '',
      category: defaultCat,
      level: 'Proficient',
      years: '2+ Years',
      description: '',
      featured: false,
      icon: 'code',
      tags: [],
      relatedProjects: [],
    };
    setEditingSkill(newSkill);
    setIsNew(true);
    setTagsInput('');
    setProjectsInput('');
  };

  const handleOpenEdit = (s: SkillItem) => {
    setEditingSkill(s);
    setIsNew(false);
    setTagsInput(s.tags?.join(', ') || '');
    setProjectsInput(s.relatedProjects?.join(', ') || '');
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill || !editingSkill.name.trim()) return;

    setIsSaving(true);
    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const projectsList = projectsInput
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean);

      const payload: SkillItem = {
        ...editingSkill,
        tags,
        relatedProjects: projectsList,
      };

      await onSaveSkill(payload);
      setEditingSkill(null);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleFeatured = async (s: SkillItem, e: React.MouseEvent) => {
    e.stopPropagation();
    await onSaveSkill({
      ...s,
      featured: !s.featured,
    });
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4">
        <div>
          <h2 className="text-[18px] font-bold text-fg flex items-center gap-2">
            <Code2 size={18} className="text-amber-400" />
            <span>Skills & Engineering Stack</span>
          </h2>
          <p className="text-[12px] text-muted">
            Manage competencies, levels, proficiency percentages, and primary technology tags.
          </p>
        </div>

        <OSButton
          size="md"
          variant="accent"
          onClick={handleOpenCreate}
          className="bg-amber-600 hover:bg-amber-500 text-white font-medium text-[12px]"
        >
          <Plus size={14} className="mr-1" />
          <span>Add New Skill</span>
        </OSButton>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 bg-void/50 p-1 rounded-xl border border-line text-[11.5px] overflow-x-auto w-full md:w-auto">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={cn(
              'px-3 py-1 rounded-lg font-medium transition-colors whitespace-nowrap',
              activeCategory === 'all'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-muted hover:text-fg',
            )}
          >
            All ({skills.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                'px-3 py-1 rounded-lg font-medium transition-colors whitespace-nowrap',
                activeCategory === cat.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-muted hover:text-fg',
              )}
            >
              {cat.shortName || cat.name} ({skills.filter((s) => s.category === cat.id).length})
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search size={14} className="absolute left-3 top-3 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skills by name, description, tags..."
            className="w-full h-9 rounded-xl border border-line bg-void/50 pl-9 pr-3 text-[12.5px] text-fg placeholder:text-faint focus:border-amber-500/60 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Skills Table / Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredSkills.map((skill) => (
          <div
            key={skill.id}
            className="rounded-xl border border-line/70 bg-surface/30 p-4 space-y-2.5 hover:border-amber-500/40 hover:bg-surface/50 transition-all flex flex-col justify-between"
          >
            <div className="space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-[14px] text-white">{skill.name}</h3>
                    {skill.featured ? (
                      <span className="rounded bg-rose-500/20 px-1 py-0.2 text-[9.5px] font-bold text-rose-300 border border-rose-500/30">
                        Featured
                      </span>
                    ) : null}
                  </div>
                  <p className="text-[11px] font-mono text-amber-400/90">{skill.level} · {skill.years}</p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => handleToggleFeatured(skill, e)}
                    className={cn(
                      'p-1 rounded-md border transition-colors',
                      skill.featured
                        ? 'border-rose-500/40 text-rose-400 bg-rose-500/10'
                        : 'border-line text-muted hover:text-fg',
                    )}
                    title={skill.featured ? 'Unmark featured' : 'Mark as featured skill'}
                  >
                    <Star size={12} className={skill.featured ? 'fill-rose-400' : ''} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(skill)}
                    className="p-1 rounded-md border border-line text-muted hover:text-white hover:bg-white/10"
                    title="Edit Skill"
                  >
                    <Edit size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete skill "${skill.name}"?`)) {
                        onDeleteSkill(skill.id);
                      }
                    }}
                    className="p-1 rounded-md border border-line text-muted hover:text-rose-400 hover:bg-rose-500/10"
                    title="Delete Skill"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              <p className="text-[12px] text-muted line-clamp-2 leading-relaxed">{skill.description}</p>
            </div>

            {/* Skill Tags */}
            {skill.tags && skill.tags.length > 0 ? (
              <div className="flex flex-wrap gap-1 pt-1.5 border-t border-line/40">
                {skill.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-void/60 px-1.5 py-0.2 font-mono text-[10px] text-faint"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {/* Skill Modal */}
      {editingSkill ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg my-8 rounded-2xl border border-line bg-[#0e1218] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="text-[16px] font-bold text-white">
                {isNew ? 'Add New Skill' : `Edit Skill: ${editingSkill.name}`}
              </h3>
              <button
                type="button"
                onClick={() => setEditingSkill(null)}
                className="p-1 rounded-lg text-muted hover:text-fg"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1 admin-scroll">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-semibold text-faint uppercase">Skill / Tech Name</label>
                  <input
                    type="text"
                    required
                    value={editingSkill.name}
                    onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                    placeholder="e.g. Go (Golang), Kafka, PostgreSQL"
                    className="w-full h-9 rounded-lg border border-line bg-void/60 px-3 text-[13px] text-fg focus:border-amber-500/60 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-faint uppercase">Category</label>
                  <select
                    value={editingSkill.category}
                    onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value as any })}
                    className="w-full h-9 rounded-lg border border-line bg-void/60 px-3 text-[13px] text-fg focus:border-amber-500/60 focus:outline-hidden"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-faint uppercase">Competency Level</label>
                  <select
                    value={editingSkill.level}
                    onChange={(e) => setEditingSkill({ ...editingSkill, level: e.target.value as any })}
                    className="w-full h-9 rounded-lg border border-line bg-void/60 px-3 text-[13px] text-fg focus:border-amber-500/60 focus:outline-hidden"
                  >
                    <option value="Core / Advanced">Core / Advanced</option>
                    <option value="Proficient">Proficient</option>
                    <option value="Working Knowledge">Working Knowledge</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-faint uppercase">Years of Experience</label>
                  <input
                    type="text"
                    value={editingSkill.years}
                    onChange={(e) => setEditingSkill({ ...editingSkill, years: e.target.value })}
                    placeholder="e.g. 3+ Years"
                    className="w-full h-9 rounded-lg border border-line bg-void/60 px-3 text-[13px] text-fg focus:border-amber-500/60 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-semibold text-faint uppercase">Description / Production Usage</label>
                  <textarea
                    rows={2}
                    value={editingSkill.description}
                    onChange={(e) => setEditingSkill({ ...editingSkill, description: e.target.value })}
                    placeholder="How this skill is used in production systems..."
                    className="w-full rounded-lg border border-line bg-void/60 p-2.5 text-[12.5px] text-fg focus:border-amber-500/60 focus:outline-hidden resize-none"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-semibold text-faint uppercase">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="goroutines, channels, gRPC, gin..."
                    className="w-full h-9 rounded-lg border border-line bg-void/60 px-3 text-[13px] text-fg focus:border-amber-500/60 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[12.5px] text-fg">
                  <input
                    type="checkbox"
                    checked={editingSkill.featured}
                    onChange={(e) => setEditingSkill({ ...editingSkill, featured: e.target.checked })}
                    className="size-4 rounded accent-amber-500"
                  />
                  <span>Mark as Featured Skill</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-line">
                <OSButton size="sm" variant="subtle" type="button" onClick={() => setEditingSkill(null)}>
                  Cancel
                </OSButton>
                <OSButton
                  size="sm"
                  variant="accent"
                  type="submit"
                  disabled={isSaving}
                  className="bg-amber-600 hover:bg-amber-500 text-white"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={13} className="animate-spin mr-1" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Skill</span>
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
