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
  SkillCategoryId,
  SkillItem,
  SystemProfile,
} from '@izhar-os/types';
import { getSupabaseAdminClient, getSupabaseClient } from './client';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  topic?: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  created_at: string;
  read_at?: string | null;
}

// ---------------------------------------------------------------------------
// 1. Profile & About Queries
// ---------------------------------------------------------------------------

export async function fetchSystemProfile(): Promise<SystemProfile> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('system_profile')
      .select('*')
      .eq('id', 'main')
      .single();

    if (error || !data) {
      return SYSTEM_PROFILE;
    }

    return {
      name: data.name ?? SYSTEM_PROFILE.name,
      wordmark: data.wordmark ?? SYSTEM_PROFILE.wordmark,
      role: data.role ?? SYSTEM_PROFILE.role,
      disciplines: data.disciplines ?? SYSTEM_PROFILE.disciplines,
      location: data.location ?? SYSTEM_PROFILE.location,
      tagline: data.tagline ?? SYSTEM_PROFILE.tagline,
      statement: data.statement ?? SYSTEM_PROFILE.statement,
      experience: data.experience ?? SYSTEM_PROFILE.experience,
      status: data.status ?? SYSTEM_PROFILE.status,
      links: data.links ?? SYSTEM_PROFILE.links,
    };
  } catch {
    return SYSTEM_PROFILE;
  }
}

export async function updateSystemProfile(profile: Partial<SystemProfile>): Promise<SystemProfile> {
  const supabase = getSupabaseAdminClient();
  const current = await fetchSystemProfile();
  const merged = { ...current, ...profile };

  const { error } = await supabase.from('system_profile').upsert({
    id: 'main',
    name: merged.name,
    wordmark: merged.wordmark,
    role: merged.role,
    disciplines: merged.disciplines,
    location: merged.location,
    tagline: merged.tagline,
    statement: merged.statement,
    experience: merged.experience,
    status: merged.status,
    links: merged.links,
    updated_at: new Date().toISOString(),
  });

  if (error) throw error;
  return merged;
}

export async function fetchAboutProfile(): Promise<AboutProfile> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('about_profile')
      .select('*')
      .eq('id', 'main')
      .single();

    if (error || !data) {
      return ABOUT_PROFILE;
    }

    return {
      positioning: data.positioning ?? ABOUT_PROFILE.positioning,
      introduction: data.introduction ?? ABOUT_PROFILE.introduction,
      stats: data.stats ?? ABOUT_PROFILE.stats,
      journey: data.journey ?? ABOUT_PROFILE.journey,
      buildAreas: data.build_areas ?? ABOUT_PROFILE.buildAreas,
      focusAreas: data.focus_areas ?? ABOUT_PROFILE.focusAreas,
      stack: data.stack ?? ABOUT_PROFILE.stack,
      interests: data.interests ?? ABOUT_PROFILE.interests,
    };
  } catch {
    return ABOUT_PROFILE;
  }
}

export async function updateAboutProfile(about: Partial<AboutProfile>): Promise<AboutProfile> {
  const supabase = getSupabaseAdminClient();
  const current = await fetchAboutProfile();
  const merged = { ...current, ...about };

  const { error } = await supabase.from('about_profile').upsert({
    id: 'main',
    positioning: merged.positioning,
    introduction: merged.introduction,
    stats: merged.stats,
    journey: merged.journey,
    build_areas: merged.buildAreas,
    focus_areas: merged.focusAreas,
    stack: merged.stack,
    interests: merged.interests,
    updated_at: new Date().toISOString(),
  });

  if (error) throw error;
  return merged;
}

// ---------------------------------------------------------------------------
// 2. Skills & Categories Queries
// ---------------------------------------------------------------------------

export async function fetchSkillCategories(): Promise<SkillCategory[]> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('skill_categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return SKILL_CATEGORIES;
    }

    return data.map((d) => ({
      id: d.id as SkillCategoryId,
      name: d.name,
      shortName: d.short_name ?? d.name,
      description: d.description,
      icon: d.icon,
      accent: d.accent,
    }));
  } catch {
    return SKILL_CATEGORIES;
  }
}

export async function fetchSkills(): Promise<SkillItem[]> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return SKILLS;
    }

    return data.map((d) => ({
      id: d.id,
      name: d.name,
      category: (d.category_id || d.category) as SkillCategoryId,
      level: d.level,
      years: d.experience || d.years || '2+ Years',
      description: d.description,
      featured: d.primary_skill ?? d.featured ?? false,
      icon: d.icon,
      tags: d.tags ?? [],
      relatedProjects: d.projects ?? d.related_projects ?? [],
      architecturalRole: d.architectural_role ?? d.metadata?.architecturalRole,
      contextNote: d.context_note ?? d.metadata?.contextNote,
      capabilities: d.capabilities ?? d.metadata?.capabilities,
    }));
  } catch {
    return SKILLS;
  }
}

export async function upsertSkill(skill: SkillItem, sortOrder?: number): Promise<SkillItem> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from('skills').upsert({
    id: skill.id,
    name: skill.name,
    category: skill.category,
    category_id: skill.category,
    level: skill.level,
    experience: skill.years,
    description: skill.description,
    primary_skill: skill.featured ?? false,
    icon: skill.icon,
    projects: skill.relatedProjects ?? [],
    tags: skill.tags ?? [],
    metadata: {
      architecturalRole: skill.architecturalRole,
      contextNote: skill.contextNote,
      capabilities: skill.capabilities,
    },
    sort_order: sortOrder ?? 0,
    created_at: new Date().toISOString(),
  });

  if (error) throw error;
  return skill;
}

export async function deleteSkill(skillId: string): Promise<boolean> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from('skills').delete().eq('id', skillId);
  if (error) throw error;
  return true;
}

export async function upsertSkillCategory(cat: SkillCategory, sortOrder?: number): Promise<SkillCategory> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from('skill_categories').upsert({
    id: cat.id,
    name: cat.name,
    short_name: cat.shortName,
    description: cat.description,
    icon: cat.icon,
    accent: cat.accent,
    sort_order: sortOrder ?? 0,
  });

  if (error) throw error;
  return cat;
}

export async function deleteSkillCategory(categoryId: string): Promise<boolean> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from('skill_categories').delete().eq('id', categoryId);
  if (error) throw error;
  return true;
}

// ---------------------------------------------------------------------------
// 3. Projects & Categories Queries
// ---------------------------------------------------------------------------

export async function fetchProjectCategories(): Promise<ProjectCategory[]> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('project_categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return PROJECT_CATEGORIES;
    }

    return data.map((d) => ({
      id: d.id,
      name: d.name,
      shortName: d.short_name ?? d.name,
      description: d.description,
      icon: d.icon,
      accent: d.accent,
      count: d.count ?? 0,
    }));
  } catch {
    return PROJECT_CATEGORIES;
  }
}

export async function fetchProjects(): Promise<Project[]> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return PROJECTS;
    }

    return data.map((d) => ({
      id: d.id,
      name: d.name,
      shortDescription: d.short_description,
      description: d.description,
      category: d.category_id,
      categoryName: d.category_name,
      technologies: d.technologies ?? [],
      role: d.role,
      duration: d.duration,
      status: d.status,
      featured: d.featured ?? false,
      accent: d.accent,
      icon: d.icon,
      overview: d.overview ?? [],
      problem: d.problem,
      solution: d.solution,
      myContribution: d.my_contribution ?? [],
      highlights: d.highlights ?? [],
      challenges: d.challenges ?? [],
      architecture: d.architecture ?? undefined,
      stats: d.stats ?? undefined,
      links: d.links ?? undefined,
    }));
  } catch {
    return PROJECTS;
  }
}

export async function upsertProject(project: Project, sortOrder?: number): Promise<Project> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from('projects').upsert({
    id: project.id,
    name: project.name,
    short_description: project.shortDescription,
    description: project.description,
    category_id: project.category,
    category_name: project.categoryName,
    technologies: project.technologies,
    role: project.role,
    duration: project.duration,
    status: project.status,
    featured: project.featured ?? false,
    accent: project.accent,
    icon: project.icon,
    overview: project.overview,
    problem: project.problem,
    solution: project.solution,
    my_contribution: project.myContribution,
    highlights: project.highlights,
    challenges: project.challenges ?? [],
    architecture: project.architecture ?? null,
    stats: project.stats ?? null,
    links: project.links ?? null,
    sort_order: sortOrder ?? 0,
    created_at: new Date().toISOString(),
  });

  if (error) throw error;
  return project;
}

export async function deleteProject(projectId: string): Promise<boolean> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from('projects').delete().eq('id', projectId);
  if (error) throw error;
  return true;
}

export async function upsertProjectCategory(category: ProjectCategory, sortOrder?: number): Promise<ProjectCategory> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from('project_categories').upsert({
    id: category.id,
    name: category.name,
    short_name: category.shortName,
    description: category.description,
    icon: category.icon,
    accent: category.accent,
    count: category.count,
    sort_order: sortOrder ?? 0,
  });

  if (error) throw error;
  return category;
}

export async function deleteProjectCategory(categoryId: string): Promise<boolean> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from('project_categories').delete().eq('id', categoryId);
  if (error) throw error;
  return true;
}

// ---------------------------------------------------------------------------
// 4. Experiences Queries
// ---------------------------------------------------------------------------

export async function fetchExperiences(): Promise<ExperienceItem[]> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return EXPERIENCES;
    }

    return data.map((d) => ({
      id: d.id,
      role: d.role,
      company: d.company,
      companyUrl: d.company_url,
      location: d.location,
      period: d.period,
      duration: d.duration,
      current: d.is_current ?? false,
      summary: d.description || d.summary || '',
      focusAreas: d.focus_areas ?? [],
      achievements: d.achievements ?? [],
      technologies: d.technologies ?? [],
      metrics: d.metrics ?? [],
      relatedProjects: d.related_projects ?? [],
    }));
  } catch {
    return EXPERIENCES;
  }
}

export async function upsertExperience(exp: ExperienceItem, sortOrder?: number): Promise<ExperienceItem> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from('experiences').upsert({
    id: exp.id,
    role: exp.role,
    company: exp.company,
    company_url: exp.companyUrl,
    location: exp.location,
    period: exp.period,
    duration: exp.duration,
    is_current: exp.current ?? false,
    description: exp.summary,
    focus_areas: exp.focusAreas ?? [],
    achievements: exp.achievements ?? [],
    technologies: exp.technologies ?? [],
    metrics: exp.metrics ?? [],
    related_projects: exp.relatedProjects ?? [],
    sort_order: sortOrder ?? 0,
    created_at: new Date().toISOString(),
  });

  if (error) throw error;
  return exp;
}

export async function deleteExperience(expId: string): Promise<boolean> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from('experiences').delete().eq('id', expId);
  if (error) throw error;
  return true;
}

// ---------------------------------------------------------------------------
// 5. Resume Data Queries
// ---------------------------------------------------------------------------

export async function fetchResumeData(): Promise<ResumeData> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('resume_data')
      .select('*')
      .eq('id', 'main')
      .single();

    if (error || !data) {
      return RESUME_DATA;
    }

    return {
      name: data.name ?? RESUME_DATA.name,
      title: data.title ?? RESUME_DATA.title,
      summary: data.summary ?? RESUME_DATA.summary,
      location: data.location ?? RESUME_DATA.location,
      email: data.email ?? RESUME_DATA.email,
      education: data.education ?? RESUME_DATA.education,
      certifications: data.certifications ?? RESUME_DATA.certifications,
      competencies: data.competencies ?? RESUME_DATA.competencies,
    };
  } catch {
    return RESUME_DATA;
  }
}

export async function updateResumeData(resume: Partial<ResumeData>): Promise<ResumeData> {
  const supabase = getSupabaseAdminClient();
  const current = await fetchResumeData();
  const merged = { ...current, ...resume };

  const { error } = await supabase.from('resume_data').upsert({
    id: 'main',
    name: merged.name,
    title: merged.title,
    summary: merged.summary,
    location: merged.location,
    email: merged.email,
    education: merged.education,
    certifications: merged.certifications,
    competencies: merged.competencies,
    updated_at: new Date().toISOString(),
  });

  if (error) throw error;
  return merged;
}

// ---------------------------------------------------------------------------
// 6. Contact Config & Messages Queries
// ---------------------------------------------------------------------------

export async function fetchContactConfig(): Promise<ContactConfig> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('contact_config')
      .select('*')
      .eq('id', 'main')
      .single();

    if (error || !data) {
      return CONTACT_CONFIG;
    }

    return {
      email: data.email ?? CONTACT_CONFIG.email,
      location: data.location ?? CONTACT_CONFIG.location,
      timezone: data.timezone ?? CONTACT_CONFIG.timezone,
      availability: data.availability ?? CONTACT_CONFIG.availability,
      channels: data.channels ?? CONTACT_CONFIG.channels,
      topics: data.topics ?? CONTACT_CONFIG.topics,
    };
  } catch {
    return CONTACT_CONFIG;
  }
}

export async function updateContactConfig(config: Partial<ContactConfig>): Promise<ContactConfig> {
  const supabase = getSupabaseAdminClient();
  const current = await fetchContactConfig();
  const merged = { ...current, ...config };

  const { error } = await supabase.from('contact_config').upsert({
    id: 'main',
    email: merged.email,
    location: merged.location,
    timezone: merged.timezone,
    availability: merged.availability,
    channels: merged.channels,
    topics: merged.topics,
    updated_at: new Date().toISOString(),
  });

  if (error) throw error;
  return merged;
}

export async function fetchContactMessages(): Promise<ContactMessage[]> {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      return [];
    }

    return data as ContactMessage[];
  } catch {
    return [];
  }
}

export async function insertContactMessage(msg: {
  name: string;
  email: string;
  topic?: string;
  message: string;
}): Promise<ContactMessage> {
  const supabase = getSupabaseAdminClient();
  const id = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const record: ContactMessage = {
    id,
    name: msg.name,
    email: msg.email,
    topic: msg.topic ?? 'general',
    message: msg.message,
    status: 'unread',
    created_at: new Date().toISOString(),
  };

  const { error } = await supabase.from('contact_messages').insert({
    id: record.id,
    name: record.name,
    email: record.email,
    topic: record.topic,
    message: record.message,
    status: record.status,
    created_at: record.created_at,
  });

  if (error) throw error;
  return record;
}

export async function updateMessageStatus(
  messageId: string,
  status: 'unread' | 'read' | 'replied' | 'archived',
): Promise<boolean> {
  const supabase = getSupabaseAdminClient();
  const updates: Record<string, unknown> = { status };
  if (status === 'read' || status === 'replied') {
    updates.read_at = new Date().toISOString();
  }

  const { error } = await supabase.from('contact_messages').update(updates).eq('id', messageId);
  if (error) throw error;
  return true;
}

export async function deleteContactMessage(messageId: string): Promise<boolean> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from('contact_messages').delete().eq('id', messageId);
  if (error) throw error;
  return true;
}

// ---------------------------------------------------------------------------
// 7. Full Portfolio Data Bundle
// ---------------------------------------------------------------------------

export async function fetchAllPortfolioData() {
  const [profile, about, skillCategories, skills, projectCategories, projects, experiences, resume, contactConfig] =
    await Promise.all([
      fetchSystemProfile(),
      fetchAboutProfile(),
      fetchSkillCategories(),
      fetchSkills(),
      fetchProjectCategories(),
      fetchProjects(),
      fetchExperiences(),
      fetchResumeData(),
      fetchContactConfig(),
    ]);

  return {
    profile,
    about,
    skillCategories,
    skills,
    projectCategories,
    projects,
    experiences,
    resume,
    contactConfig,
    isDynamic: true,
  };
}
