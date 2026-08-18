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
import { getPgPool, getSupabaseAdminClient } from './client';
import { SCHEMA_SQL } from './schema';

/**
 * Execute schema migration on Supabase PostgreSQL.
 */
export async function runSchemaMigration(): Promise<{ success: boolean; error?: string }> {
  try {
    const pool = getPgPool();
    await pool.query(SCHEMA_SQL);
    await pool.query("NOTIFY pgrst, 'reload schema';");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Migration failed:', message);
    return { success: false, error: message };
  }
}

/**
 * Seed all default content from @izhar-os/config into Supabase.
 */
export async function seedAllDefaultData(force: boolean = false): Promise<{
  success: boolean;
  seeded: Record<string, number>;
  error?: string;
}> {
  const seededCounts: Record<string, number> = {};
  const supabase = getSupabaseAdminClient();

  try {
    // 1. Run migration first to make sure tables exist
    await runSchemaMigration();

    // 2. System Profile
    const { data: existingProfile } = await supabase
      .from('system_profile')
      .select('id')
      .eq('id', 'main')
      .single();

    if (!existingProfile || force) {
      const { error: profileError } = await supabase.from('system_profile').upsert({
        id: 'main',
        name: SYSTEM_PROFILE.name,
        wordmark: SYSTEM_PROFILE.wordmark,
        role: SYSTEM_PROFILE.role,
        disciplines: SYSTEM_PROFILE.disciplines,
        location: SYSTEM_PROFILE.location,
        tagline: SYSTEM_PROFILE.tagline,
        statement: SYSTEM_PROFILE.statement,
        experience: SYSTEM_PROFILE.experience,
        status: SYSTEM_PROFILE.status,
        links: SYSTEM_PROFILE.links,
        updated_at: new Date().toISOString(),
      });
      if (profileError) console.error('Error seeding system_profile:', profileError);
      else seededCounts.system_profile = 1;
    }

    // 3. About Profile
    const { data: existingAbout } = await supabase
      .from('about_profile')
      .select('id')
      .eq('id', 'main')
      .single();

    if (!existingAbout || force) {
      const { error: aboutError } = await supabase.from('about_profile').upsert({
        id: 'main',
        positioning: ABOUT_PROFILE.positioning,
        introduction: ABOUT_PROFILE.introduction,
        stats: ABOUT_PROFILE.stats,
        journey: ABOUT_PROFILE.journey,
        build_areas: ABOUT_PROFILE.buildAreas,
        focus_areas: ABOUT_PROFILE.focusAreas,
        stack: ABOUT_PROFILE.stack,
        interests: ABOUT_PROFILE.interests,
        updated_at: new Date().toISOString(),
      });
      if (aboutError) console.error('Error seeding about_profile:', aboutError);
      else seededCounts.about_profile = 1;
    }

    // 4. Skill Categories
    for (let i = 0; i < SKILL_CATEGORIES.length; i++) {
      const cat = SKILL_CATEGORIES[i]!;
      const { error } = await supabase.from('skill_categories').upsert({
        id: cat.id,
        name: cat.name,
        short_name: cat.shortName,
        description: cat.description,
        icon: cat.icon,
        accent: cat.accent,
        sort_order: i,
      });
      if (error) console.error(`Error seeding skill category ${cat.id}:`, error);
    }
    seededCounts.skill_categories = SKILL_CATEGORIES.length;

    // 5. Skills
    for (let i = 0; i < SKILLS.length; i++) {
      const skill = SKILLS[i]!;
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
        sort_order: i,
      });
      if (error) console.error(`Error seeding skill ${skill.id}:`, error);
    }
    seededCounts.skills = SKILLS.length;

    // 6. Project Categories
    for (let i = 0; i < PROJECT_CATEGORIES.length; i++) {
      const pcat = PROJECT_CATEGORIES[i]!;
      const { error } = await supabase.from('project_categories').upsert({
        id: pcat.id,
        name: pcat.name,
        short_name: pcat.shortName,
        description: pcat.description,
        icon: pcat.icon,
        accent: pcat.accent,
        count: pcat.count,
        sort_order: i,
      });
      if (error) console.error(`Error seeding project category ${pcat.id}:`, error);
    }
    seededCounts.project_categories = PROJECT_CATEGORIES.length;

    // 7. Projects
    for (let i = 0; i < PROJECTS.length; i++) {
      const proj = PROJECTS[i]!;
      const { error } = await supabase.from('projects').upsert({
        id: proj.id,
        name: proj.name,
        short_description: proj.shortDescription,
        description: proj.description,
        category_id: proj.category,
        category_name: proj.categoryName,
        technologies: proj.technologies,
        role: proj.role,
        duration: proj.duration,
        status: proj.status,
        featured: proj.featured ?? false,
        accent: proj.accent,
        icon: proj.icon,
        overview: proj.overview,
        problem: proj.problem,
        solution: proj.solution,
        my_contribution: proj.myContribution,
        highlights: proj.highlights,
        challenges: proj.challenges ?? [],
        architecture: proj.architecture ?? null,
        stats: proj.stats ?? null,
        links: proj.links ?? null,
        sort_order: i,
      });
      if (error) console.error(`Error seeding project ${proj.id}:`, error);
    }
    seededCounts.projects = PROJECTS.length;

    // 8. Experiences
    for (let i = 0; i < EXPERIENCES.length; i++) {
      const exp = EXPERIENCES[i]!;
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
        sort_order: i,
      });
      if (error) console.error(`Error seeding experience ${exp.id}:`, error);
    }
    seededCounts.experiences = EXPERIENCES.length;

    // 9. Resume Data
    const { data: existingResume } = await supabase
      .from('resume_data')
      .select('id')
      .eq('id', 'main')
      .single();

    if (!existingResume || force) {
      const { error } = await supabase.from('resume_data').upsert({
        id: 'main',
        name: RESUME_DATA.name,
        title: RESUME_DATA.title,
        summary: RESUME_DATA.summary,
        location: RESUME_DATA.location,
        email: RESUME_DATA.email,
        education: RESUME_DATA.education,
        certifications: RESUME_DATA.certifications,
        competencies: RESUME_DATA.competencies,
        updated_at: new Date().toISOString(),
      });
      if (error) console.error('Error seeding resume_data:', error);
      else seededCounts.resume_data = 1;
    }

    // 10. Contact Config
    const { data: existingContact } = await supabase
      .from('contact_config')
      .select('id')
      .eq('id', 'main')
      .single();

    if (!existingContact || force) {
      const { error } = await supabase.from('contact_config').upsert({
        id: 'main',
        email: CONTACT_CONFIG.email,
        location: CONTACT_CONFIG.location,
        timezone: CONTACT_CONFIG.timezone,
        availability: CONTACT_CONFIG.availability,
        channels: CONTACT_CONFIG.channels,
        topics: CONTACT_CONFIG.topics,
        updated_at: new Date().toISOString(),
      });
      if (error) console.error('Error seeding contact_config:', error);
      else seededCounts.contact_config = 1;
    }

    // 11. Initial Sample Message if table is empty
    const { count: msgCount } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true });

    if (msgCount === 0 || msgCount === null) {
      await supabase.from('contact_messages').insert({
        id: 'msg-welcome',
        name: 'System Welcome',
        email: 'hello@izhar-os.dev',
        topic: 'general',
        message: 'Welcome to IZHAR OS! Your dynamic database and inbox are online and connected to Supabase.',
        status: 'read',
        created_at: new Date().toISOString(),
      });
      seededCounts.contact_messages = 1;
    }

    return {
      success: true,
      seeded: seededCounts,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Seeding exception:', message);
    return {
      success: false,
      seeded: seededCounts,
      error: message,
    };
  }
}
