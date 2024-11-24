#!/usr/bin/perl
use strict;
use warnings;

my $input_file = $ARGV[0] || die "Usage: $0 input.html\n";
open(my $in, '<', $input_file) or die "Cannot open $input_file: $!";
my $content = do { local $/; <$in> };
close $in;

# Add sorting controls HTML before the video grid
my $sorting_controls = q{
    <!-- Sorting Controls -->
    <div class="mb-6 bg-white rounded-lg shadow-md p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <i class="fas fa-sort text-gray-600"></i>
          <h2 class="text-lg font-semibold text-gray-800">Sort Videos</h2>
        </div>
        <select id="sortSelect" class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="title-asc">Title A-Z</option>
          <option value="title-desc">Title Z-A</option>
          <option value="category">Category</option>
        </select>
      </div>
    </div>
};

# Add the sorting controls before the video grid
$content =~ s/(<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="videoGrid">)/$sorting_controls$1/;

# Add sorting functionality to the JavaScript
my $sorting_functions = q{
    // Sorting state
    let currentSort = 'date-desc';

    // Sorting function
    function sortVideos(videos) {
      const sortedVideos = [...videos];
      
      switch (currentSort) {
        case 'date-desc':
          sortedVideos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          break;
        case 'date-asc':
          sortedVideos.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
          break;
        case 'title-asc':
          sortedVideos.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'title-desc':
          sortedVideos.sort((a, b) => b.title.localeCompare(a.title));
          break;
        case 'category':
          sortedVideos.sort((a, b) => (a.type || '').localeCompare(b.type || ''));
          break;
      }
      
      return sortedVideos;
    }

    // Modified loadVideos function with sorting
    async function loadVideos() {
      try {
        showLoading();
        
        const { data: videos, error } = await supabase
          .from('Video')
          .select('*');

        if (error) {
          console.error('Error loading videos:', error);
          hideLoading();
          return;
        }

        const sortedVideos = sortVideos(videos);
        renderVideoGrid(sortedVideos);
        hideLoading();
      } catch (error) {
        console.error('Error loading videos:', error);
        hideLoading();
      }
    }

    // Loading states
    function showLoading() {
      const videoGrid = document.getElementById('videoGrid');
      videoGrid.classList.add('opacity-50');
    }

    function hideLoading() {
      const videoGrid = document.getElementById('videoGrid');
      videoGrid.classList.remove('opacity-50');
    }

    // Initialize sorting
    document.addEventListener('DOMContentLoaded', () => {
      const sortSelect = document.getElementById('sortSelect');
      sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        loadVideos();
      });
      loadVideos();
    });
};

# Replace the existing loadVideos function
$content =~ s/async function loadVideos\(\).*?}}\s*catch\s*\(error\)\s*{.*?}\s*}/$sorting_functions/s;

# Add Font Awesome if not present
unless ($content =~ /font-awesome/) {
    $content =~ s/(<\/head>)/  <link rel="stylesheet" href="https:\/\/cdnjs.cloudflare.com\/ajax\/libs\/font-awesome\/6.0.0\/css\/all.min.css">\n$1/;
}

# Write the modified content
my $output_file = $input_file;
$output_file =~ s/\.html$/-with-sorting.html/;
open(my $out, '>', $output_file) or die "Cannot write to $output_file: $!";
print $out $content;
close $out;

print "Enhanced file with sorting written to $output_file\n";
