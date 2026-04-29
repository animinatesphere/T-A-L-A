const SUPABASE_URL = "https://sunipfnesvzlkcitbhns.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1bmlwZm5lc3Z6bGtjaXRiaG5zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTE2MDA0MCwiZXhwIjoyMDgwNzM2MDQwfQ.h_UMD88A5kTsZfM3JrkU89tMgDfUUrZY1cCEwIuuKtY";

async function test() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?limit=1`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
    });
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Data:', data);
  } catch (e) {
    console.error('Error:', e.message);
  }
}

test();
