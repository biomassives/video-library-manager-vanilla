// pages/api/feed.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);


async function getVideos() {
  try {
    // 1. Fetch data from the 'Video' table
    const { data: videos, error: videoError } = await supabase
      .from('Video')
      .select('*');
    if (videoError) {
      throw videoError;
    }

    // 2. Fetch data from the 'Step' table
    const { data: stepsData, error: stepsError } = await supabase
      .from('Step') 
      .select('*');
    if (stepsError) {
      throw stepsError;
    }

    // 3. Fetch data from the 'Panel' table
    const { data: panelsData, error: panelsError } = await supabase
      .from('Panel') 
      .select('*');
    if (panelsError) {
      throw panelsError;
    }

    // 4. Transform the data into the desired format (with checks for missing data)
    const formattedVideos = videos.map(video => {
      const videoSteps = stepsData
        .filter(step => step.video_id === video.id)
        .map(step => step.text) || []; 
      const videoPanels = panelsData
        .filter(panel => panel.video_id === video.id)
        .map(panel => ({
          title: panel.title,
          content: panel.content
        })) || []; 

      return {
        id: video.id.toString(), // Ensure ID is a string
        title: video.title,
        categories: video.categories ? video.categories.split(', ') : [],
        description: video.description,
        youtubeId: video.youtubeId,
        tags: video.tags ? video.tags.split(', ') : [],
        rating: video.rating,
        date: video.datePublished, 
        transcript: video.transcript,
        materials: video.materials ? video.materials.split(', ') : [],
        steps: videoSteps,
        panels: videoPanels
      };
    });
    return formattedVideos;

  } catch (error) {
    console.error('Error fetching videos:', error);
    return []; 
  }
}



export default async function handler(req, res) {
  try {
    const videos = await getVideos();
    
    // Set caching headers for idempotent requests
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400'); 
    res.status(200).json(videos);
    
  } catch (error) {
    console.error('Error fetching feed:', error);
    res.status(500).json({ error: 'Failed to fetch feed' }); 
  }
}
