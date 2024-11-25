// api/videos.js
import { supabase, ALLOWED_ORIGINS, CACHE_DURATION } from '../config';
import { VideoService } from '../videoService';

const videoService = new VideoService(supabase);

export default async function handler(req, res) {
  const origin = req.headers.origin;

  // Dynamically handle CORS for allowed origins
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle only GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract query params
    const { limit, offset, category, search } = req.query;

    const videos = await videoService.getVideos({
      limit: parseInt(limit) || 10,
      offset: parseInt(offset) || 0,
      category,
      searchTerm: search,
    });

    // Set caching headers
    res.setHeader(
      'Cache-Control',
      `public, max-age=${CACHE_DURATION.DEFAULT}, s-maxage=${CACHE_DURATION.DEFAULT}, stale-while-revalidate=${CACHE_DURATION.STALE_WHILE_REVALIDATE}`
    );

    // Respond with video data
    return res.status(200).json({
      success: true,
      data: videos.filter(Boolean),
      pagination: {
        limit: parseInt(limit) || 10,
        offset: parseInt(offset) || 0,
      },
    });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

