'use client';

import {
  ABOUT_PROFILE,
  CONTACT_CONFIG,
  EXPERIENCES,
  PROJECT_CATEGORIES,
  PROJECTS,
  RESUME_DATA,
  SKILL_CATEGORIES,
  SKILLS,
  SYSTEM_PROFILE,
} from '@izhar-os/config';
import type {
  AboutProfile,
  ContactConfig,
  ExperienceItem,
  Project,
  ProjectCategory,
  ResumeData,
  SkillCategory,
  SkillItem,
  SystemProfile,
} from '@izhar-os/types';
import { create } from 'zustand';

interface PortfolioState {
  profile: SystemProfile;
  about: AboutProfile;
  skills: SkillItem[];
  skillCategories: SkillCategory[];
  projects: Project[];
  projectCategories: ProjectCategory[];
  experiences: ExperienceItem[];
  resume: ResumeData;
  contactConfig: ContactConfig;

  isDynamic: boolean;
  isLoading: boolean;
  dbConnected: boolean;
  lastSyncedAt: Date | null;

  // Actions
  fetchPortfolioData: () => Promise<void>;
  submitContact: (data: {
    name: string;
    email: string;
    topic?: string;
    message: string;
  }) => Promise<{ success: boolean; message?: string }>;
}

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  // Default values seeded immediately from config for zero latency
  profile: SYSTEM_PROFILE,
  about: ABOUT_PROFILE,
  skills: SKILLS,
  skillCategories: SKILL_CATEGORIES,
  projects: PROJECTS,
  projectCategories: PROJECT_CATEGORIES,
  experiences: EXPERIENCES,
  resume: RESUME_DATA,
  contactConfig: CONTACT_CONFIG,

  isDynamic: false,
  isLoading: false,
  dbConnected: false,
  lastSyncedAt: null,

  fetchPortfolioData: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/portfolio', { cache: 'no-store' });
      if (!res.ok) throw new Error('API request failed');

      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        set({
          profile: d.profile ?? get().profile,
          about: d.about ?? get().about,
          skills: d.skills ?? get().skills,
          skillCategories: d.skillCategories ?? get().skillCategories,
          projects: d.projects ?? get().projects,
          projectCategories: d.projectCategories ?? get().projectCategories,
          experiences: d.experiences ?? get().experiences,
          resume: d.resume ?? get().resume,
          contactConfig: d.contactConfig ?? get().contactConfig,
          isDynamic: true,
          dbConnected: true,
          lastSyncedAt: new Date(),
          isLoading: false,
        });
        return;
      }
    } catch (err) {
      console.warn('Using local fallback portfolio config:', err);
    }
    set({ isLoading: false });
  },

  submitContact: async (payload) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, message: 'Message recorded in database!' };
      }
      return { success: false, message: data.message || 'Submission failed' };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Network error';
      return { success: false, message };
    }
  },
}));
