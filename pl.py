import re

def update_html(html_content):
    """
    Updates the provided HTML content with the changes to combine API and local data.
    """

    # 1. Add the fetchData function
    fetch_data_function = """
    async function fetchData() {
      try {
        const response = await fetch('/api/videos');
        const apiData = await response.json();
    
        // Create a Set of video IDs from the API data
        const apiVideoIds = new Set(apiData.map(video => video.id));
    
        // Process videos from videoData2b.js
        const processedVideos = window.videoData.map(video => {
          // Check if the video ID exists in the API data
          if (apiVideoIds.has(video.id)) {
            // Get the corresponding video from the API data
            const apiVideo = apiData.find(v => v.id === video.id);
    
            // Merge data, prioritizing API data but using local data as fallback
            return {
              ...video, // Start with the local video data
              ...apiVideo, // Overwrite with API data if available
              panels: apiVideo.panels || video.panels || [], // Use API panels, fallback to local, or default to empty
              steps: apiVideo.steps || video.steps || [],  // Use API steps, fallback to local, or default to empty
              materials: apiVideo.materials || video.materials || [] // Use API materials, fallback to local, or default to empty
            };
          } else {
            // Video not found in API data, use local data
            return video;
          }
        });
    
        // Update window.videoData with the processed videos
        window.videoData = processedVideos;
      } catch (error) {
        console.error('Error fetching or processing video data:', error);
        // Handle the error appropriately (e.g., display an error message)
      }
    }
    """

    # 2. Find the place to insert the fetchData function (before initializeApp)
    insert_position = html_content.find("async function initializeApp()")
    html_content = html_content[:insert_position] + fetch_data_function + html_content[insert_position:]

    # 3. Call fetchData() after window.videoData is loaded (inside initializeApp)
    initializeApp_start = html_content.find("async function initializeApp() {") + len("async function initializeApp() {")
    initializeApp_end = html_content.find("}", initializeApp_start)
    html_content = (
        html_content[:initializeApp_start]
        + "\n  // Call fetchData() after your window.videoData is loaded\n  fetchData();\n"
        + html_content[initializeApp_start:initializeApp_end]
        + html_content[initializeApp_end:]
    )

    return html_content


if __name__ == "__main__":
    with open("indexfeed.html", "r") as f:  # Replace 'your_html_file.html'
        html_content = f.read()

    updated_html = update_html(html_content)

    with open("updated_html_file.html", "w") as f:  # Replace 'updated_html_file.html'
        f.write(updated_html)
