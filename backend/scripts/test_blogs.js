const SUPABASE_URL2 = "https://pnfebkenxtqfzfbewyiy.supabase.co";
const SUPABASE_ANON_KEY2 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuZmVia2VueHRxZnpmYmV3eWl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0MDczMjUsImV4cCI6MjA4MTk4MzMyNX0.xGaevgclohcy1Y8w9J83oZ0cQB2rN5WWEJwrDIDwk70";

async function test() {
  try {
    const res = await fetch(`${SUPABASE_URL2}/rest/v1/blog_posts?limit=1`, {
      headers: { apikey: SUPABASE_ANON_KEY2, Authorization: `Bearer ${SUPABASE_ANON_KEY2}` }
    });
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Data:', data);
  } catch (e) {
    console.error('Error:', e.message);
  }
}

test();
