'use client';

import { SKILL_CATEGORIES, SKILLS, SYSTEM_PROFILE } from '@izhar-os/config';
import type { SkillCategoryId, SkillItem } from '@izhar-os/types';
import { cn } from '@izhar-os/ui';
import {
  Boxes,
  Code2,
  Database,
  Globe,
  Network,
  Radio,
  Server,
  Sparkles,
  Terminal,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { ApplicationViewProps } from '@/components/applications/ApplicationRegistry';
import { ArchitectureStackView } from '@/components/applications/skills/ArchitectureStackView';
import { SkillCard } from '@/components/applications/skills/SkillCard';
import { SkillInspectorDrawer } from '@/components/applications/skills/SkillInspectorDrawer';
import { SkillsNavigation } from '@/components/applications/skills/SkillsNavigation';
import {
  SkillsToolbar,
  type LevelFilter,
  type ViewMode,
} from '@/components/applications/skills/SkillsToolbar';
import { useApplicationChrome } from '@/hooks/useEnvironment';
import { useIsNarrow } from '@/hooks/useNarrow';
import { useIsMobile } from '@/hooks/useSystemPreferences';

const NARROW_WIDTH = 680;

export function SkillsApp(_props: ApplicationViewProps) {
  const chrome = useApplicationChrome();
  const isMobile = useIsMobile();
  const rootRef = useRef<HTMLDivElement>(null);
  const isNarrow = useIsNarrow(rootRef, NARROW_WIDTH);

  const [activeCategory, setActiveCategory] = useState<SkillCategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);

  // Stacked navigation for GNOME (header-tabs) or narrow viewports
  const stacked = isMobile || isNarrow || chrome.navigation === 'header-tabs';

  // Filter skills based on category, search query, and competency level
  const filteredSkills = useMemo(() => {
    return SKILLS.filter((skill) => {
      // Category filter
      if (activeCategory !== 'all' && skill.category !== activeCategory) {
        return false;
      }

      // Level filter
      if (levelFilter !== 'all' && skill.level !== levelFilter) {
        return false;
      }

      // Search query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();

      const nameMatch = skill.name.toLowerCase().includes(q);
      const descMatch = skill.description.toLowerCase().includes(q);
      const roleMatch = skill.architecturalRole?.toLowerCase().includes(q);
      const tagsMatch = skill.tags?.some((t) => t.toLowerCase().includes(q));
      const capMatch = skill.capabilities?.some((c) => c.toLowerCase().includes(q));
      const noteMatch = skill.contextNote?.toLowerCase().includes(q);

      return nameMatch || descMatch || roleMatch || tagsMatch || capMatch || noteMatch;
    });
  }, [activeCategory, levelFilter, searchQuery]);

  // Group filtered skills by category
  const groupedSkills = useMemo(() => {
    const map = new Map<SkillCategoryId, SkillItem[]>();
    SKILL_CATEGORIES.forEach((cat) => map.set(cat.id, []));

    filteredSkills.forEach((skill) => {
      const list = map.get(skill.category);
      if (list) list.push(skill);
      else map.set(skill.category, [skill]);
    });

    return SKILL_CATEGORIES.map((cat) => ({
      category: cat,
      skills: map.get(cat.id) || [],
    })).filter((group) => group.skills.length > 0);
  }, [filteredSkills]);

  // Keyboard shortcut listener (Esc to close inspector or clear search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedSkill) {
          setSelectedSkill(null);
        } else if (searchQuery) {
          setSearchQuery('');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedSkill, searchQuery]);

  const handleSelectSkill = useCallback((skill: SkillItem) => {
    setSelectedSkill((prev) => (prev?.id === skill.id ? null : skill));
  }, []);

  return (
    <div
      ref={rootRef}
      className="flex h-full min-h-0 flex-col bg-surface/15 select-none @container"
    >
      {/* Top Application Toolbar */}
      <SkillsToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        levelFilter={levelFilter}
        onLevelFilterChange={setLevelFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalFiltered={filteredSkills.length}
      />

      {/* Main Workspace Area (Nav + Main Content + Inspector) */}
      <div className={cn('flex flex-1 min-h-0 min-w-0 overflow-hidden', stacked ? 'flex-col' : 'flex-row')}>
        {/* Navigation Sidebar / Strip */}
        <SkillsNavigation
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          stacked={stacked}
        />

        {/* Content Scroll View */}
        <main className="os-scroll flex-1 min-h-0 min-w-0 overflow-y-auto p-4 md:p-6 space-y-7">
          {viewMode === 'architecture' ? (
            <ArchitectureStackView
              selectedSkill={selectedSkill}
              onSelectSkill={handleSelectSkill}
            />
          ) : (
            <>
              {groupedSkills.map(({ category, skills }) => (
                <section key={category.id} className="space-y-3.5">
                  {/* Category Header */}
                  <div className="flex items-center justify-between border-b border-line/60 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="grid size-6.5 place-items-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/25">
                        <CategoryGlyph id={category.id} />
                      </span>
                      <div>
                        <h3 className="text-[13.5px] font-bold text-fg tracking-tight">
                          {category.name}
                        </h3>
                        <p className="text-[11px] text-muted">{category.description}</p>
                      </div>
                    </div>
                    <span className="font-mono text-[11px] text-faint">
                      {skills.length} {skills.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>

                  {/* Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {skills.map((skill) => (
                      <SkillCard
                        key={skill.id}
                        skill={skill}
                        isSelected={selectedSkill?.id === skill.id}
                        onSelect={handleSelectSkill}
                      />
                    ))}
                  </div>
                </section>
              ))}

              {groupedSkills.length === 0 ? (
                <div className="py-16 text-center space-y-2">
                  <p className="text-[13px] font-medium text-muted">
                    No technologies found matching &ldquo;{searchQuery}&rdquo;
                  </p>
                  <p className="text-[11.5px] text-faint">
                    Try adjusting your search query or resetting the competency filter.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setLevelFilter('all');
                      setActiveCategory('all');
                    }}
                    className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-line bg-void/50 px-3 py-1 text-[11.5px] text-amber-300 hover:bg-white/5 cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : null}
            </>
          )}
        </main>

        {/* Selected Skill Inspector Drawer */}
        {selectedSkill ? (
          <SkillInspectorDrawer
            skill={selectedSkill}
            onClose={() => setSelectedSkill(null)}
          />
        ) : null}
      </div>

      {/* Footer Status Bar */}
      <footer className="flex shrink-0 items-center justify-between border-t border-line bg-surface/30 px-3 py-1.5 text-[11px] text-muted select-none">
        <div className="flex items-center gap-2">
          <span>{SKILLS.length} Verified Technologies</span>
          <span>·</span>
          <span className="text-amber-400/90 font-medium">
            {SKILLS.filter((s) => s.level === 'Core / Advanced').length} Core & Advanced
          </span>
          <span>·</span>
          <span>
            {SKILLS.filter((s) => s.level === 'Proficient').length} Proficient
          </span>
        </div>
        <span className="hidden sm:block text-faint font-mono">
          {SYSTEM_PROFILE.name} · {SYSTEM_PROFILE.role} (~3 yrs exp)
        </span>
      </footer>
    </div>
  );
}

function CategoryGlyph({ id }: { id: SkillCategoryId }) {
  switch (id) {
    case 'languages':
      return <Code2 size={13} />;
    case 'backend':
      return <Server size={13} />;
    case 'databases-search':
      return <Database size={13} />;
    case 'ai-llm':
      return <Sparkles size={13} />;
    case 'realtime-distributed':
      return <Radio size={13} />;
    case 'cloud-devops':
      return <Network size={13} />;
    case 'frontend':
      return <Globe size={13} />;
    case 'apis-integrations':
      return <Terminal size={13} />;
    default:
      return <Boxes size={13} />;
  }
}
