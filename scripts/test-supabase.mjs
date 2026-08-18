import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rfrjlriegrkovjxzxbrb.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmcmpscmllZ3Jrb3ZqeHp4YnJiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Njk4NzAxMywiZXhwIjoyMTAyNTYzMDEzfQ._XwABX6dRfQcEu4DEMxnd6ykWy2y-om4pno3hMm7cR8';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function test() {
  console.log('Testing Supabase REST Client...');
  const { data, error } = await supabase.from('system_profile').select('*');
  console.log('Result:', { data, error });
}

test();
