'use client';

import type { Project, ProjectCategory } from '@izhar-os/types';
import { cn, OSButton } from '@izhar-os/ui';
import {
  Edit,
  FolderGit2,
  Loader2,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';

interface AdminProjectsTabProps {
  projects: Project[];
  categories: ProjectCategory[];
  onSaveProject: (project: Project) => Promise<void>;
  onDeleteProject: (id: string) => Promise<void>;
}

export function AdminProjectsTab({
  projects,
  categories,
  onSaveProject,
  onDeleteProject,
}: AdminProjectsTabProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [techInput, setTechInput] = useState('');
  const [overviewInput, setOverviewInput] = useState('');
  const [contributionInput, setContributionInput] = useState('');
  const [highlightsInput, setHighlightsInput] = useState('');

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (activeCategory !== 'all' && p.category !== activeCategory) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.technologies.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [projects, activeCategory, search]);

  const handleOpenCreate = () => {
    const newProj: Project = {
      id: `proj-${Date.now().toString(36)}`,
      name: '',
      shortDescription: '',
      description: '',
      category: categories[0]?.id || 'ai-systems',
      categoryName: categories[0]?.name || 'AI & Intelligent Systems',
      technologies: [],
      role: 'Lead Full Stack / Backend Engineer',
      duration: '3 Months',
      status: 'production',
      featured: true,
      accent: 'cyan',
      icon: 'ai',
      overview: [],
      problem: '',
      solution: '',
      myContribution: [],
      highlights: [],
      challenges: [],
    };
    setEditingProject(newProj);
    setIsNew(true);
    setTechInput('');
    setOverviewInput('');
    setContributionInput('');
    setHighlightsInput('');
  };

  const handleOpenEdit = (p: Project) => {
    setEditingProject(p);
    setIsNew(false);
    setTechInput(p.technologies.join(', '));
    setOverviewInput(p.overview.join('\n\n'));
    setContributionInput(p.myContribution.join('\n'));
    setHighlightsInput(p.highlights.join('\n'));
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.name.trim()) return;

    setIsSaving(true);
    try {
      const selectedCat = categories.find((c) => c.id === editingProject.category);
      const technologies = techInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const overview = overviewInput
        .split('\n\n')
        .map((o) => o.trim())
        .filter(Boolean);

      const myContribution = contributionInput
        .split('\n')
        .map((c) => c.trim())
        .filter(Boolean);

      const highlights = highlightsInput
        .split('\n')
        .map((h) => h.trim())
        .filter(Boolean);

      const payload: Project = {
        ...editingProject,
        categoryName: selectedCat?.name || editingProject.categoryName,
        technologies,
        overview: overview.length > 0 ? overview : [editingProject.description],
        myContribution,
        highlights,
      };

      await onSaveProject(payload);
      setEditingProject(null);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleFeatured = async (p: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    await onSaveProject({
      ...p,
      featured: !p.featured,
    });
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4">
        <div>
          <h2 className="text-[18px] font-bold text-fg flex items-center gap-2">
            <FolderGit2 size={18} className="text-cyan-400" />
            <span>Projects & Architectural Systems</span>
          </h2>
          <p className="text-[12px] text-muted">
            Manage case studies, architecture diagrams, tech stacks, and showcase links.
          </p>
        </div>

        <OSButton
          size="md"
          variant="accent"
          onClick={handleOpenCreate}
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-[12px]"
        >
          <Plus size={14} className="mr-1" />
          <span>Add New Project</span>
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
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-muted hover:text-fg',
            )}
          >
            All ({projects.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                'px-3 py-1 rounded-lg font-medium transition-colors whitespace-nowrap',
                activeCategory === cat.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-muted hover:text-fg',
              )}
            >
              {cat.shortName || cat.name} ({projects.filter((p) => p.category === cat.id).length})
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
            placeholder="Search projects by name, technologies, or keywords..."
            className="w-full h-9 rounded-xl border border-line bg-void/50 pl-9 pr-3 text-[12.5px] text-fg placeholder:text-faint focus:border-cyan-500/60 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Projects Grid / Table */}
      {filteredProjects.length === 0 ? (
        <div className="rounded-2xl border border-line/60 bg-surface/20 p-12 text-center text-muted space-y-2">
          <FolderGit2 size={32} className="mx-auto text-faint opacity-60" />
          <p className="text-[14px] font-medium text-fg">No projects found</p>
          <p className="text-[12px] text-muted">Try changing category filter or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className="rounded-2xl border border-line/70 bg-surface/30 p-5 space-y-3 hover:border-cyan-500/40 hover:bg-surface/50 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[15px] font-bold text-white truncate">{proj.name}</h3>
                      {proj.featured ? (
                        <span className="rounded bg-amber-500/20 px-1.5 py-0.2 text-[10px] font-bold text-amber-300 border border-amber-500/30 flex items-center gap-0.5">
                          <Star size={10} className="fill-amber-400" /> Featured
                        </span>
                      ) : null}
                    </div>
                    <p className="text-[11.5px] text-cyan-400 font-medium">{proj.role}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleToggleFeatured(proj, e)}
                      className={cn(
                        'p-1.5 rounded-lg border transition-colors',
                        proj.featured
                          ? 'border-amber-500/40 text-amber-400 bg-amber-500/10'
                          : 'border-line text-muted hover:text-fg',
                      )}
                      title={proj.featured ? 'Unmark featured' : 'Mark as featured'}
                    >
                      <Star size={13} className={proj.featured ? 'fill-amber-400' : ''} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(proj)}
                      className="p-1.5 rounded-lg border border-line text-muted hover:text-white hover:bg-white/10"
                      title="Edit Project"
                    >
                      <Edit size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete project "${proj.name}" permanently?`)) {
                          onDeleteProject(proj.id);
                        }
                      }}
                      className="p-1.5 rounded-lg border border-line text-muted hover:text-rose-400 hover:bg-rose-500/10"
                      title="Delete Project"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <p className="text-[12.5px] text-muted line-clamp-2">{proj.shortDescription}</p>

                {/* Tech Chips */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {proj.technologies.slice(0, 6).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-line/60 bg-void/50 px-2 py-0.5 font-mono text-[10.5px] text-faint"
                    >
                      {tech}
                    </span>
                  ))}
                  {proj.technologies.length > 6 ? (
                    <span className="rounded-md bg-void/50 px-1.5 py-0.5 font-mono text-[10px] text-muted">
                      +{proj.technologies.length - 6}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-line/50 text-[11.5px] text-faint">
                <span>{proj.duration}</span>
                <span className="capitalize">{proj.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project Editor Modal */}
      {editingProject ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-3xl my-8 rounded-2xl border border-line bg-[#0e1218] p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <h3 className="text-[17px] font-bold text-white">
                  {isNew ? 'Create New Project' : `Edit: ${editingProject.name}`}
                </h3>
                <p className="text-[12px] text-muted">
                  Fill in project case study details, architecture, and tech highlights.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="p-1 rounded-lg text-muted hover:text-fg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 admin-scroll">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11.5px] font-semibold text-faint uppercase">Project Name</label>
                  <input
                    type="text"
                    required
                    value={editingProject.name}
                    onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                    placeholder="e.g. Distributed Ingestion Engine"
                    className="w-full h-9 rounded-lg border border-line bg-void/60 px-3 text-[13px] text-fg focus:border-cyan-500/60 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11.5px] font-semibold text-faint uppercase">Category</label>
                  <select
                    value={editingProject.category}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as any })}
                    className="w-full h-9 rounded-lg border border-line bg-void/60 px-3 text-[13px] text-fg focus:border-cyan-500/60 focus:outline-hidden"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11.5px] font-semibold text-faint uppercase">Role / Title</label>
                  <input
                    type="text"
                    value={editingProject.role}
                    onChange={(e) => setEditingProject({ ...editingProject, role: e.target.value })}
                    className="w-full h-9 rounded-lg border border-line bg-void/60 px-3 text-[13px] text-fg focus:border-cyan-500/60 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11.5px] font-semibold text-faint uppercase">Duration</label>
                  <input
                    type="text"
                    value={editingProject.duration}
                    onChange={(e) => setEditingProject({ ...editingProject, duration: e.target.value })}
                    className="w-full h-9 rounded-lg border border-line bg-void/60 px-3 text-[13px] text-fg focus:border-cyan-500/60 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11.5px] font-semibold text-faint uppercase">Short Description</label>
                  <input
                    type="text"
                    required
                    value={editingProject.shortDescription}
                    onChange={(e) => setEditingProject({ ...editingProject, shortDescription: e.target.value })}
                    placeholder="Brief 1-sentence synopsis"
                    className="w-full h-9 rounded-lg border border-line bg-void/60 px-3 text-[13px] text-fg focus:border-cyan-500/60 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11.5px] font-semibold text-faint uppercase">
                    Technologies (comma separated)
                  </label>
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    placeholder="Golang, Redis, PostgreSQL, Kafka, Docker..."
                    className="w-full h-9 rounded-lg border border-line bg-void/60 px-3 text-[13px] text-fg focus:border-cyan-500/60 focus:outline-hidden font-mono"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11.5px] font-semibold text-faint uppercase">Problem Statement</label>
                  <textarea
                    rows={2}
                    value={editingProject.problem}
                    onChange={(e) => setEditingProject({ ...editingProject, problem: e.target.value })}
                    className="w-full rounded-lg border border-line bg-void/60 p-2.5 text-[12.5px] text-fg focus:border-cyan-500/60 focus:outline-hidden resize-none"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11.5px] font-semibold text-faint uppercase">Architectural Solution</label>
                  <textarea
                    rows={2}
                    value={editingProject.solution}
                    onChange={(e) => setEditingProject({ ...editingProject, solution: e.target.value })}
                    className="w-full rounded-lg border border-line bg-void/60 p-2.5 text-[12.5px] text-fg focus:border-cyan-500/60 focus:outline-hidden resize-none"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11.5px] font-semibold text-faint uppercase">
                    Key Contributions (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={contributionInput}
                    onChange={(e) => setContributionInput(e.target.value)}
                    placeholder="Designed the schema...&#10;Built the API pipeline..."
                    className="w-full rounded-lg border border-line bg-void/60 p-2.5 text-[12.5px] text-fg focus:border-cyan-500/60 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11.5px] font-semibold text-faint uppercase">
                    Key Highlights / Metrics (one per line)
                  </label>
                  <textarea
                    rows={2}
                    value={highlightsInput}
                    onChange={(e) => setHighlightsInput(e.target.value)}
                    placeholder="99.9% uptime&#10;Sub-100ms response time"
                    className="w-full rounded-lg border border-line bg-void/60 p-2.5 text-[12.5px] text-fg focus:border-cyan-500/60 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-[12.5px] text-fg">
                  <input
                    type="checkbox"
                    checked={editingProject.featured}
                    onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                    className="size-4 rounded accent-cyan-500"
                  />
                  <span>Mark as Featured Project</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-line">
                <OSButton
                  size="sm"
                  variant="subtle"
                  type="button"
                  onClick={() => setEditingProject(null)}
                >
                  Cancel
                </OSButton>
                <OSButton
                  size="sm"
                  variant="accent"
                  type="submit"
                  disabled={isSaving}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={13} className="animate-spin mr-1" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Project</span>
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
