import pg from 'pg';
import { createClient } from '@supabase/supabase-js';
import { SCHEMA_SQL } from '../packages/database/src/schema.ts';
import {
  SYSTEM_PROFILE,
  ABOUT_PROFILE,
  SKILL_CATEGORIES,
  SKILLS,
  PROJECT_CATEGORIES,
  PROJECTS,
  EXPERIENCES,
  RESUME_DATA,
  CONTACT_CONFIG,
} from '../packages/config/src/index.ts';

const DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://postgres.rfrjlriegrkovjxzxbrb:GbVwUg2iKegugHgQ@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres';

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://rfrjlriegrkovjxzxbrb.supabase.co';

const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmcmpscmllZ3Jrb3ZqeHp4YnJiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Njk4NzAxMywiZXhwIjoyMTAyNTYzMDEzfQ._XwABX6dRfQcEu4DEMxnd6ykWy2y-om4pno3hMm7cR8';

async function main() {
  console.log('🚀 Connecting to Supabase PostgreSQL at:', SUPABASE_URL);

  // 1. Run DDL schema migration via PG pool
  const pool = new pg.Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('📦 Running SQL Schema Migration...');
    await pool.query(SCHEMA_SQL);
    await pool.query("NOTIFY pgrst, 'reload schema';");
    console.log('✅ Schema migration completed successfully!');
  } catch (err) {
    console.error('❌ Schema migration error:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }

  // Wait 2 seconds for PostgREST to reload its schema cache
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // 2. Seed Data via Supabase Admin Client
  console.log('🌱 Seeding default portfolio data into Supabase...');
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  // Profile
  const { error: pErr } = await supabase.from('system_profile').upsert({
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
  if (pErr) console.error('Error seeding system_profile:', pErr);
  else console.log('✅ System profile seeded');

  // About
  const { error: aErr } = await supabase.from('about_profile').upsert({
    id: 'main',
    positioning: ABOUT_PROFILE.positioning,
    introduction: ABOUT_PROFILE.introduction,
    stats: ABOUT_PROFILE.stats,
    journey: ABOUT_PROFILE.journey,
    build_areas: ABOUT_PROFILE.buildAreas,
    updated_at: new Date().toISOString(),
  });
  if (aErr) console.error('Error seeding about_profile:', aErr);
  else console.log('✅ About profile seeded');

  // Skill Categories
  for (let i = 0; i < SKILL_CATEGORIES.length; i++) {
    const cat = SKILL_CATEGORIES[i];
    await supabase.from('skill_categories').upsert({
      id: cat.id,
      name: cat.name,
      short_name: cat.shortName,
      description: cat.description,
      icon: cat.icon,
      accent: cat.accent,
      sort_order: i,
    });
  }
  console.log(`✅ ${SKILL_CATEGORIES.length} Skill categories seeded`);

  // Skills
  for (let i = 0; i < SKILLS.length; i++) {
    const skill = SKILLS[i];
    await supabase.from('skills').upsert({
      id: skill.id,
      name: skill.name,
      category: skill.category,
      category_id: skill.categoryId,
      level: skill.level,
      experience: skill.experience,
      description: skill.description,
      primary_skill: skill.primary ?? false,
      icon: skill.icon,
      proficiency: skill.proficiency ?? 80,
      projects: skill.projects ?? [],
      tags: skill.tags ?? [],
      metadata: skill.metadata ?? {},
      sort_order: i,
    });
  }
  console.log(`✅ ${SKILLS.length} Skills seeded`);

  // Project Categories
  for (let i = 0; i < PROJECT_CATEGORIES.length; i++) {
    const pcat = PROJECT_CATEGORIES[i];
    await supabase.from('project_categories').upsert({
      id: pcat.id,
      name: pcat.name,
      short_name: pcat.shortName,
      description: pcat.description,
      icon: pcat.icon,
      accent: pcat.accent,
      count: pcat.count,
      sort_order: i,
    });
  }
  console.log(`✅ ${PROJECT_CATEGORIES.length} Project categories seeded`);

  // Projects
  for (let i = 0; i < PROJECTS.length; i++) {
    const proj = PROJECTS[i];
    await supabase.from('projects').upsert({
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
  }
  console.log(`✅ ${PROJECTS.length} Projects seeded`);

  // Experiences
  for (let i = 0; i < EXPERIENCES.length; i++) {
    const exp = EXPERIENCES[i];
    await supabase.from('experiences').upsert({
      id: exp.id,
      role: exp.role,
      company: exp.company,
      location: exp.location,
      period: exp.period,
      duration: exp.duration,
      is_current: exp.current ?? false,
      description: exp.description,
      achievements: exp.achievements,
      technologies: exp.technologies,
      sort_order: i,
    });
  }
  console.log(`✅ ${EXPERIENCES.length} Experiences seeded`);

  // Resume Data
  await supabase.from('resume_data').upsert({
    id: 'main',
    summary: RESUME_DATA.summary,
    highlights: RESUME_DATA.highlights,
    education: RESUME_DATA.education,
    certifications: RESUME_DATA.certifications,
    stack_groups: RESUME_DATA.stackGroups,
    download_url: RESUME_DATA.downloadUrl,
    updated_at: new Date().toISOString(),
  });
  console.log('✅ Resume data seeded');

  // Contact Config
  await supabase.from('contact_config').upsert({
    id: 'main',
    email: CONTACT_CONFIG.email,
    location: CONTACT_CONFIG.location,
    timezone: CONTACT_CONFIG.timezone,
    availability: CONTACT_CONFIG.availability,
    channels: CONTACT_CONFIG.channels,
    topics: CONTACT_CONFIG.topics,
    updated_at: new Date().toISOString(),
  });
  console.log('✅ Contact config seeded');

  // Initial Welcome Message
  const { data: msgs } = await supabase.from('contact_messages').select('id').limit(1);
  if (!msgs || msgs.length === 0) {
    await supabase.from('contact_messages').insert({
      id: 'msg-welcome',
      name: 'System Welcome',
      email: 'hello@izhar-os.dev',
      topic: 'general',
      message: 'Welcome to IZHAR OS! Your dynamic database and inbox are online and connected to Supabase.',
      status: 'read',
      created_at: new Date().toISOString(),
    });
    console.log('✅ Welcome contact message seeded');
  }

  console.log('🎉 All default data successfully synchronized with Supabase!');
}

main().catch((err) => {
  console.error('Fatal error seeding database:', err);
  process.exit(1);
});
