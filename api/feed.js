import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function getVideos() {
  try {
    const { data, error } = await supabase
      .from('Video')
      .select(`
        *,
        Step (*),
        Panel (*)
      `);

    if (error) {
      console.error('Error fetching videos from Supabase:', error); // Log the Supabase error
      throw error; 
    }

    const formattedVideos = data.map(video => ({
      id: video.id.toString(),
      title: video.title,
      categories: video.categories ? video.categories.split(', ') : [],
      description: video.description,
      youtubeId: video.youtubeId,
      tags: video.tags ? video.tags.split(', ') : [],
      rating: video.rating,
      date: video.datePublished,
      transcript: video.transcript,
      materials: video.materials ? video.materials.split(', ') : [],
      steps: video.Step ? video.Step.map(step => step.text) : [],
      panels: video.Panel ? video.Panel.map(panel => ({ title: panel.title, content: panel.content })) : []
    }));

    return formattedVideos;
  } catch (error) {
    console.error('Error in getVideos:', error); // Log the general error
    return [];
  }
}

export default async function handler(req, res) {
  try {
    const videos = await getVideos();

    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    res.status(200).json(videos);
  } catch (error) {
    console.error('Error fetching feed:', error);
    res.status(500).json({ error: 'Failed to fetch feed' });
  }
}
