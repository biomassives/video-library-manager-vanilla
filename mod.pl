#!/usr/bin/perl
use strict;
use warnings;

# Read input file
my $input_file = $ARGV[0] || die "Usage: $0 input.html\n";
open(my $in, '<', $input_file) or die "Cannot open $input_file: $!";
my $content = do { local $/; <$in> };
close $in;

# Fix the loadVideos function to handle proper querying
my $fixed_load_videos = q{
async function loadVideos(searchTerm = '') {
  try {
    showLoading();
    
    let query = supabase.from('Video').select('*');
    
    if (state.currentCategory) {
      query = query.eq('type', state.currentCategory);
    }
    
    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }

    const { data: videos, error } = await query;
    if (error) throw error;

    // Add small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 300));
    
    renderVideoGrid(videos);
    hideLoading();
  } catch (error) {
    console.error('Error loading videos:', error);
    hideLoading();
  }
}
};

# Add proper video card creation function
my $fixed_create_video_card = q{
function createVideoCard(video) {
  return `
    <div class="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-200 hover:scale-105 hover:shadow-xl">
      <div class="relative group">
        <div class="relative">
          <img src="https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg" 
               alt="${video.title}" 
               class="w-full h-48 object-cover"
               onerror="this.src='https://img.youtube.com/vi/${video.youtubeId}/0.jpg'">
          
          <div class="absolute top-0 right-0 p-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button onclick="handleEditClick('${video.id}')"
                    class="p-2 bg-white/90 hover:bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200">
              <i class="fas fa-edit text-blue-600"></i>
            </button>
            
            <button onclick="handleDeleteClick('${video.id}')"
                    class="p-2 bg-white/90 hover:bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200">
              <i class="fas fa-trash text-red-600"></i>
            </button>
          </div>
        </div>

        <div class="p-6">
          <div class="mb-3">
            <h2 class="text-xl font-semibold mb-2 text-gray-800 line-clamp-2">${video.title}</h2>
            <p class="text-gray-600 text-sm line-clamp-3">${video.description || ''}</p>
          </div>
          
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-2">
              <i class="fas ${categoryStructure[video.type]?.icon || 'fa-tag'} ${categoryStructure[video.type]?.color || 'text-gray-600'}"></i>
              <span class="text-sm font-medium">${video.type || 'Uncategorized'}</span>
            </div>
            <div class="flex flex-wrap gap-2">
              ${(video.tags || []).map(tag => `
                <span class="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
                  ${tag}
                </span>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
};

# Add proper clear filters function
my $clear_filters_function = q{
function clearFilters() {
  state.currentCategory = null;
  state.currentSubcategory = null;
  if (state.activeDropdown) {
    state.activeDropdown.remove();
    state.activeDropdown = null;
  }
  document.getElementById('searchInput').value = '';
  state.searchTerm = '';
  updateActiveFilters();
  loadVideos();
}
};

# Replace the functions in the content
$content =~ s/async function loadVideos.*?}/$fixed_load_videos/s;
$content =~ s/function createVideoCard.*?}/$fixed_create_video_card/s;
$content =~ s/function clearFilters.*?}/$clear_filters_function/s;

# Update the categoryStructure to use 'type' instead of 'category'
$content =~ s/query\.eq\('category'/query.eq('type'/g;

# Write output
my $output_file = $input_file;
$output_file =~ s/\.html$/-fixed.html/;
open(my $out, '>', $output_file) or die "Cannot write to $output_file: $!";
print $out $content;
close $out;

print "Enhanced file written to $output_file\n";