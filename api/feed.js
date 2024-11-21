// pages/api/feed.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function getVideos() { 
  // ... (your complete getVideos function from the previous response)
}

export default async function handler(req, res) {
  try {
    const videos = await getVideos();
    res.status(200).json(videos); 
  } catch (error) {
    console.error('Error fetching feed:', error);
    res.status(500).json({ error: 'Failed to fetch feed' }); 
  }
}
