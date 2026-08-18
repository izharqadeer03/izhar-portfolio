import fetch from 'node-fetch';

const SUPABASE_URL = 'https://rfrjlriegrkovjxzxbrb.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmcmpscmllZ3Jrb3ZqeHp4YnJiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Njk4NzAxMywiZXhwIjoyMTAyNTYzMDEzfQ._XwABX6dRfQcEu4DEMxnd6ykWy2y-om4pno3hMm7cR8';

async function testSql() {
  console.log('Testing SQL query endpoint...');
  const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    },
  });
  console.log('Status:', res.status);
}

testSql();
