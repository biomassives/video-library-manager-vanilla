// videoService.js
export class VideoService {
  constructor(supabaseClient) {
    this.supabase = supabaseClient;
  }

  async getVideos(options = {}) {
    const { limit, offset, category, searchTerm } = options;
    
    try {
      let query = this.supabase
        .from('Video')
        .select(`
          *,
          panels (*),
          VideoStep ( id, text, videoId, description, orderIndex)
        `);

      // Apply filters if provided
      if (category) {
        query = query.contains('categories', [category]);
      }
      
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      // Apply pagination
      if (limit) {
        query = query.limit(limit);
      }
      
      if (offset) {
        query = query.range(offset, offset + (limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      return data.map(this.formatVideo);
    } catch (error) {
      console.error('VideoService error:', error);
      throw new Error('Failed to fetch videos');
    }
  }

  formatVideo(video) {
    try {
      validateVideo(video);
      
      return {
        id: video.id.toString(),
        title: video.title,
        categories: splitStringToArray(video.categories),
        description: video.description,
        youtubeId: video.youtubeId,
        tags: splitStringToArray(video.tags),
        rating: Number(video.rating) || 0,
        date: video.datePublished,
        transcript: video.transcript,
        materials: splitStringToArray(video.materials),
        steps: video.Step?.map(step => step.text) || [],
        panels: video.Panel?.map(panel => ({
          title: panel.title,
          content: panel.content
        })) || []
      };
    } catch (error) {
      console.error(`Error formatting video ${video.id}:`, error);
      return null;
    }
  }
}

