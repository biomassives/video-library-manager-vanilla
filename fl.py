import re

def update_html(html_content):
    """
    Updates the provided HTML content to prioritize local data for materials, steps, and panels.
    """

    # 1. Define the updated fetchData function
    fetch_data_function = """
    async function fetchData() {
      try {
        const response = await fetch('/api/videos');
        const apiData = await response.json();
    
        // Create a Map of video IDs to API data
        const apiVideoMap = new Map(apiData.map(video => [video.id, video]));
    
        // Process videos from videoData2b.js
        const processedVideos = window.videoData.map(video => {
          // Check if the video ID exists in the API data
          if (apiVideoMap.has(video.id)) {
            // Get the corresponding video from the API data Map
            const apiVideo = apiVideoMap.get(video.id);
    
            // Merge data, prioritizing local data but using API data for some fields
            return {
              ...apiVideo, // Start with the API video data (for id, title, etc.)
              ...video,    // Overwrite with local data (for materials, steps, panels)
              transcript: apiVideo.transcript || video.transcript, // Use API transcript if available
              rating: apiVideo.rating || video.rating,           // Use API rating if available
              // ... add other fields as needed ...
            };
          } else {
            // Video not found in API data, use local data
            return video;
          }
        });
    
        // Update window.videoData with the processed videos
        window.videoData = processedVideos;
    
        // ... (rest of your code to render the videos) ...
    
      } catch (error) {
        console.error('Error fetching or processing video data:', error);
        // Handle the error appropriately (e.g., display an error message)
      }
    }
    """

    # 2. Find the existing fetchData function and replace it
    pattern = r"async function fetchData\(\) {[\s\S]*?}"  # Matches the entire function
    html_content = re.sub(pattern, fetch_data_function, html_content)

    return html_content

if __name__ == "__main__":
    with open("ippro.html", "r") as f:  # Replace 'your_html_file.html'
        html_content = f.read()

    updated_html = update_html(html_content)

    with open("updated_html_file.html", "w") as f:  # Replace 'updated_html_file.html'
        f.write(updated_html)
