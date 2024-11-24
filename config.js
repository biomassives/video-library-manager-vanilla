// config.js
import { createClient } from '@supabase/supabase-js';

const CACHE_DURATION = {
  DEFAULT: 3600,           // 1 hour
  STALE_WHILE_REVALIDATE: 86400  // 24 hours
};

export const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://content.approvideo.org'  // Add your production domain
];

console.log('Supabase URL:', process.env.SUPABASE_URL);
console.log('Supabase key:', process.env.SUPABASE_ANON_KEY);

const supabaseConfig = {
  url: process.env.SUPABASE_URL,
  key: process.env.SUPABASE_ANON_KEY,
  timeout: 20000  // 20 second timeout
};

export const supabase = createClient(supabaseConfig.url, supabaseConfig.key, {
  auth: { persistSession: false },
  db: { timeout: supabaseConfig.timeout }
});
