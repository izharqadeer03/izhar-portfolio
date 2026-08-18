import pg from 'pg';

const allRegions = [
  'ap-south-1',
  'ap-south-2',
  'ap-southeast-1',
  'ap-southeast-2',
  'ap-northeast-1',
  'ap-northeast-2',
  'us-east-1',
  'us-east-2',
  'us-west-1',
  'us-west-2',
  'eu-central-1',
  'eu-central-2',
  'eu-west-1',
  'eu-west-2',
  'eu-west-3',
  'eu-north-1',
  'eu-south-1',
  'eu-south-2',
  'me-central-1',
  'me-south-1',
  'sa-east-1',
  'ca-central-1',
  'af-south-1',
];

const pass = 'GbVwUg2iKegugHgQ';
const projectRef = 'rfrjlriegrkovjxzxbrb';

async function testAll() {
  for (const region of allRegions) {
    const host = `aws-0-${region}.pooler.supabase.com`;
    const connectionString = `postgresql://postgres.${projectRef}:${pass}@${host}:6543/postgres`;
    const pool = new pg.Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 2500,
    });
    try {
      const res = await pool.query('SELECT 1 as ping');
      if (res.rows?.[0]?.ping === 1) {
        console.log(`\n🎉 MATCH FOUND!\nRegion: ${region}\nHost: ${host}\nConnection: ${connectionString}\n`);
        process.exit(0);
      }
    } catch (e) {
      // console.log(`${region}: ${e.message}`);
    } finally {
      await pool.end();
    }
  }
  console.log('No direct pooler match found in standard regions.');
}

testAll();
