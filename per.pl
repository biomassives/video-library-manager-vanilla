#!/usr/bin/perl

use strict;
use warnings;

# Read the HTML file
my $html = do { local $/; <DATA> };

# Replace the JavaScript code with the corrected version
$html =~ s/<script type=module>.*?<\/script>/<script type=module>
  // Import the Supabase client library
  import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

  // Configure the Supabase connection
  const supabaseUrl = 'https://vlvbodwrtblttvwnxkjx.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsdmJvZHdydGJsdHR2d254a2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODY3NDk2NzIsImV4cCI6MjAwMjMyNTY3Mn0.TRT1HeX85vP1zDxnU7qBz5GqNPgYZUj-BOdek4qmtEg';
  const supabase = createClient(supabaseUrl, supabaseKey);

  async function getVideos() {
    try {
      // Fetch all videos from the 'Video' table
      const { data, error } = await supabase
        .from('Video')
        .select(`
          id, title, description, youtubeId, tags, rating, datePublished, transcript, category
        `);

      if (error) {
        console.error('Error fetching videos from Supabase:', error);
        throw error;
      }

      // Format the data for the API response
      const formattedVideos = data.map(video => ({
        id: video.id.toString(),
        title: video.title,
        description: video.description,
        youtubeId: video.youtubeId,
        tags: video.tags ? video.tags.split(', ') : [], // Assuming tags are comma-separated
        rating: video.rating,
        date: video.datePublished,
        transcript: video.transcript,
        category: video.category
      }));

      return formattedVideos;
    } catch (error) {
      console.error('Error loading videos:', error);
      return [];
    }
  }

  // Call the getVideos function to fetch and display the video data
  getVideos().then(videos => {
    const videoGrid = document.getElementById('videoGrid'); // Replace 'videoGrid' with the actual ID of your video grid container
    videoGrid.innerHTML = JSON.stringify(videos, null, 2); // Display the formatted video data
  });
</script>/s;

# Print the modified HTML
print $html;

__DATA__
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script> 1 
  <script src="https://cdn.jsdelivr.net/npm/localforage@1.10.0/dist/localforage.min.js"></script>
  <title>ApproVideo Video Portal Manager - Output </title>
  
  <link href="style.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
  </head>
 
<style>
/* Add these styles to your HTML head or in a style tag */
.profile-dropdown {
  transform: scale(0.95);
  opacity: 0;
  pointer-events: none;
  transition: all 0.2s ease-in-out;
  background-color: white;
}

.profile-dropdown.dropdown-active {
  transform: scale(1);
  opacity: 1;
  pointer-events: auto;
}

.profile-dropdown.dropdown-inactive {
  transform: scale(0.95);
  opacity: 0;
  pointer-events: none;
}

.profile-dropdown a {
  transition: all 0.2s ease-in-out;
}

.profile-dropdown a:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.icon-button { 
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px; /* Adjust size as needed */
  height: 48px;
  padding: 12px; 
  border-radius: 9999px; /* Extra rounded corners */
  border: 2px solid black; /* Black outline */
  background-color: transparent; 
  color: black; /* Icon color */
  transition: shadow 0.3s ease; /* Smooth shadow transition */
}

.icon-button i {
  font-size: 1.5rem; /* Adjust icon size as needed */
}

.icon-button::before {
  content: '';
  position: absolute;
  inset: 0; /* Cover the entire button */
  border-radius: inherit; 
  background: linear-gradient(to right, black, #FFD700); /* Black to gold gradient */
  opacity: 0;  /* Initially hidden */
  filter: blur(5px); /* Adjust blur as needed */
  z-index: -1; /* Behind the icon */
  transition: opacity 0.3s ease; /* Smooth opacity transition */
}

.icon-button:hover::before {
  opacity: 0.8; /* Show the gold shimmer on hover */
}

.icon-button:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}


  
</style>


</head>
<body class="bg-gray-100">
    
  <div class="bg-gradient-to-r from-green-600 to-blue-600 text-white py-2 px-4 text-center text-sm">
    🎥 Welcome to ApproVideo - DIY Solutions Video Portal 🎥
  </div>



<script type=module>


import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';


const supabaseUrl = 'https://vlvbodwrtblttvwnxkjx.supabase.co',
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsdmJvZHdydGJsdHR2d254a2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODY3NDk2NzIsImV4cCI6MjAwMjMyNTY3Mn0.TRT1HeX85vP1zDxnU7qBz5GqNPgYZUj-BOdek4qmtEg'


const supabase = createClient(supabaseUrl, supabaseKey);

async function getVideos() {
  try {
    // Start with a basic query to fetch all videos
    let query = supabase.from('Video').select(`
      id, title, description, youtubeId, tags, rating, datePublished, transcript, category
    `);

    // Apply any necessary filtering or sorting based on request parameters
    // (e.g., req.query.category, req.query.sort)
    // ...

    const { data: videos, error } = await query;
    if (error) throw error;

    // Format the data for the API response
    const formattedVideos = videos.map(video => ({
      id: video.id.toString(),
      title: video.title,
      description: video.description,
      youtubeId: video.youtubeId,
      tags: video.tags ? video.tags.split(', ') : [], // Assuming tags are comma-separated
      rating: video.rating,
      date: video.datePublished,
      transcript: video.transcript,
      category: video.category
    }));

    return formattedVideos;
  } catch (error) {
    console.error('Error loading videos:', error);
    return []; 
  }
}

export default async function handler(req, res) {
  try {
    const videos = await getVideos();

    // Set caching headers
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    res.status(200).json(videos);
  } catch (error) {
    console.error('Error fetching feed:', error);
    res.status(500).json({ error: 'Failed to fetch feed' });
  }
}


</script>
