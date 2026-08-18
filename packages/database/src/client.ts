import { createClient, SupabaseClient } from '@supabase/supabase-js';
import pg from 'pg';

const { Pool } = pg;

// Supabase environment keys
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  'https://rfrjlriegrkovjxzxbrb.supabase.co';

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmcmpscmllZ3Jrb3ZqeHp4YnJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5ODcwMTMsImV4cCI6MjEwMjU2MzAxM30._zBcu3Vqvfcgtf7bhYZhpkZsRmy7fTp-8lcDdzz0agU';

export const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmcmpscmllZ3Jrb3ZqeHp4YnJiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Njk4NzAxMywiZXhwIjoyMTAyNTYzMDEzfQ._XwABX6dRfQcEu4DEMxnd6ykWy2y-om4pno3hMm7cR8';

export const DATABASE_URL =
  process.env.DATABASE_URL ||
  process.env.DATABASE_DIRECT_URL ||
  'postgresql://postgres.rfrjlriegrkovjxzxbrb:GbVwUg2iKegugHgQ@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres';

export const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'admin123';

/** Whether Supabase is configured */
export const DATABASE_ENABLED = Boolean(SUPABASE_URL && (SUPABASE_ANON_KEY || SUPABASE_SERVICE_ROLE_KEY));

let cachedAnonClient: SupabaseClient | null = null;
let cachedAdminClient: SupabaseClient | null = null;
let cachedPgPool: pg.Pool | null = null;

/**
 * Public/Anon Supabase Client for client-side or public server queries.
 */
export function getSupabaseClient(): SupabaseClient {
  if (!cachedAnonClient) {
    cachedAnonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
      },
    });
  }
  return cachedAnonClient;
}

/**
 * Admin Service Role Supabase Client for backend API operations and mutations.
 */
export function getSupabaseAdminClient(): SupabaseClient {
  if (!cachedAdminClient) {
    cachedAdminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return cachedAdminClient;
}

/**
 * PostgreSQL Direct Connection Pool for executing DDL schema migrations.
 */
export function getPgPool(): pg.Pool {
  if (!cachedPgPool) {
    cachedPgPool = new Pool({
      connectionString: DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
      connectionTimeoutMillis: 10000,
      max: 5,
    });
  }
  return cachedPgPool;
}

export type DatabaseStatus = 'not-configured' | 'connected' | 'error';

/**
 * Test database connectivity.
 */
export async function checkDatabaseConnection(): Promise<{
  connected: boolean;
  status: DatabaseStatus;
  message: string;
  latencyMs: number;
}> {
  const start = Date.now();
  try {
    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.from('system_profile').select('id').limit(1);
    
    // If the table doesn't exist yet, try basic auth/rpc or postgres pool ping
    if (error && error.code !== 'PGRST116') {
      const pool = getPgPool();
      const res = await pool.query('SELECT 1 as ping');
      if (res.rows?.[0]?.ping === 1) {
        return {
          connected: true,
          status: 'connected',
          message: 'Direct PostgreSQL connected',
          latencyMs: Date.now() - start,
        };
      }
    }

    return {
      connected: true,
      status: 'connected',
      message: 'Supabase Cloud connected successfully',
      latencyMs: Date.now() - start,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      connected: false,
      status: 'error',
      message: `Connection failed: ${message}`,
      latencyMs: Date.now() - start,
    };
  }
}

/**
 * Reported by System Information and other components.
 */
export function getDatabaseStatus(): DatabaseStatus {
  return DATABASE_ENABLED ? 'connected' : 'not-configured';
}
