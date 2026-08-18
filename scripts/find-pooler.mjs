import pg from 'pg';

const regions = [
  'ap-south-1',
  'ap-southeast-1',
  'us-east-1',
  'us-west-1',
  'eu-central-1',
  'eu-west-1',
  'ap-northeast-1',
  'sa-east-1',
  'ca-central-1',
];

const pass = 'GbVwUg2iKegugHgQ';
const projectRef = 'rfrjlriegrkovjxzxbrb';

async function findPooler() {
  for (const region of regions) {
    const host = `aws-0-${region}.pooler.supabase.com`;
    const connectionString = `postgresql://postgres.${projectRef}:${pass}@${host}:5432/postgres`;
    console.log(`Checking ${region} (${host})...`);
    const pool = new pg.Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 3000,
    });
    try {
      const res = await pool.query('SELECT 1 as ping');
      if (res.rows?.[0]?.ping === 1) {
        console.log(`🎉 MATCH FOUND! Region: ${region}`);
        console.log(`Connection string: ${connectionString}`);
        await pool.end();
        return connectionString;
      }
    } catch (e) {
      console.log(`Failed for ${region}:`, e.message);
    } finally {
      await pool.end();
    }
  }
}

findPooler();
