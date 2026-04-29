const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load models
const Submission = require('../models/Submission');
const AwardBook = require('../models/AwardBook');
const Podcast = require('../models/Podcast');
const Blog = require('../models/Blog');
const Judge = require('../models/Judge');

dotenv.config({ path: path.join(__dirname, '../.env') });

const SUPABASE_URL = "https://sunipfnesvzlkcitbhns.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1bmlwZm5lc3Z6bGtjaXRiaG5zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTE2MDA0MCwiZXhwIjoyMDgwNzM2MDQwfQ.h_UMD88A5kTsZfM3JrkU89tMgDfUUrZY1cCEwIuuKtY";

const SUPABASE_URL2 = "https://pnfebkenxtqfzfbewyiy.supabase.co";
const SUPABASE_ANON_KEY2 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuZmVia2VueHRxZnpmYmV3eWl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0MDczMjUsImV4cCI6MjA4MTk4MzMyNX0.xGaevgclohcy1Y8w9J83oZ0cQB2rN5WWEJwrDIDwk70";

const migrate = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected.');

    // Drop collections to clear indexes and old data
    const collections = ['submissions', 'awardbooks', 'podcasts', 'judges', 'blogs'];
    for (const coll of collections) {
      await mongoose.connection.db.dropCollection(coll).catch(() => console.log(`Collection ${coll} does not exist, skipping drop.`));
    }

    // 1. Migrate Submissions
    console.log('Migrating Submissions...');
    try {
      const subRes = await fetch(`${SUPABASE_URL}/rest/v1/book_submissions`, {
        headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
      });
      const subData = await subRes.json();
      if (Array.isArray(subData)) {
        await Submission.deleteMany({});
        await Submission.insertMany(subData.map(s => {
          const { id, _id, ...rest } = s;
          return rest;
        }));
        console.log(`✅ Migrated ${subData.length} submissions.`);
      } else {
        console.log('❌ Submissions data is not an array:', subData);
      }
    } catch (e) {
      console.error('❌ Submissions migration failed:', e.message);
    }

    // 2. Migrate Award Books
    console.log('Migrating Award Books...');
    try {
      const awardRes = await fetch(`${SUPABASE_URL}/rest/v1/award_winning_books`, {
        headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
      });
      const awardData = await awardRes.json();
      if (Array.isArray(awardData)) {
        await AwardBook.deleteMany({});
        await AwardBook.insertMany(awardData.map(a => {
          const { id, _id, ...rest } = a;
          return rest;
        }));
        console.log(`✅ Migrated ${awardData.length} award books.`);
      } else {
        console.log('❌ Award books data is not an array:', awardData);
      }
    } catch (e) {
      console.error('❌ Award books migration failed:', e.message);
    }

    // 3. Migrate Podcasts
    console.log('Migrating Podcasts...');
    try {
      const podcastRes = await fetch(`${SUPABASE_URL}/rest/v1/podcasts`, {
        headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
      });
      const podcastData = await podcastRes.json();
      if (Array.isArray(podcastData)) {
        await Podcast.deleteMany({});
        await Podcast.insertMany(podcastData.map(p => {
          const { id, _id, ...rest } = p;
          return rest;
        }));
        console.log(`✅ Migrated ${podcastData.length} podcasts.`);
      } else {
        console.log('❌ Podcasts data is not an array:', podcastData);
      }
    } catch (e) {
      console.error('❌ Podcasts migration failed:', e.message);
    }

    // 4. Migrate Judges
    console.log('Migrating Judges...');
    try {
      const judgeRes = await fetch(`${SUPABASE_URL}/rest/v1/judges`, {
        headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
      });
      const judgeData = await judgeRes.json();
      if (Array.isArray(judgeData)) {
        await Judge.deleteMany({});
        await Judge.insertMany(judgeData.map(j => {
          const { id, _id, ...rest } = j;
          return rest;
        }));
        console.log(`✅ Migrated ${judgeData.length} judges.`);
      } else {
        console.log('❌ Judges data is not an array:', judgeData);
      }
    } catch (e) {
      console.error('❌ Judges migration failed:', e.message);
    }

    // 5. Migrate Blogs
    console.log('Migrating Blogs...');
    try {
      // Try project 2 first
      console.log('Attempting fetch from project 2...');
      const blogRes2 = await fetch(`${SUPABASE_URL2}/rest/v1/blog_posts`, {
        headers: { apikey: SUPABASE_ANON_KEY2, Authorization: `Bearer ${SUPABASE_ANON_KEY2}` }
      });
      
      if (blogRes2.ok) {
        const blogData2 = await blogRes2.json();
        if (Array.isArray(blogData2)) {
          await Blog.deleteMany({});
          await Blog.insertMany(blogData2.map(b => {
            const { id, _id, ...rest } = b;
            return rest;
          }));
          console.log(`✅ Migrated ${blogData2.length} blog posts from project 2.`);
        }
      } else {
        throw new Error('Project 2 fetch failed');
      }
    } catch (e) {
      console.log('⚠️ Blogs from project 2 failed, trying main project...');
      try {
        const blogRes1 = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts`, {
          headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
        });
        const blogData1 = await blogRes1.json();
        if (Array.isArray(blogData1)) {
          await Blog.deleteMany({});
          await Blog.insertMany(blogData1.map(b => {
            const { id, _id, ...rest } = b;
            // Map title if needed or use slug
            if (!rest.slug && rest.title) {
              rest.slug = rest.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            }
            return rest;
          }));
          console.log(`✅ Migrated ${blogData1.length} blog posts from main project.`);
        }
      } catch (e1) {
        console.error('❌ Blogs migration failed for both projects:', e1.message);
      }
    }

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();
