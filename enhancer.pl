#!/usr/bin/perl
use strict;
use warnings;

# Read input file
my $input_file = $ARGV[0] || die "Usage: $0 input.html\n";
open(my $in, '<', $input_file) or die "Cannot open $input_file: $!";
my $content = do { local $/; <$in> };
close $in;

# Fix duplicate loadVideos function
$content =~ s/async function loadVideos\(\) \{.*?async function loadVideos\(searchTerm = ''\)/async function loadVideos(searchTerm = '')/s;

# Add category structure if missing
unless ($content =~ /categoryStructure/) {
    my $category_structure = q{
    const categoryStructure = {
      Shelter: {
        icon: 'fa-home',
        color: 'text-blue-600',
        subcategories: ['Temporary Shelter', 'Permanent Housing', 'Insulation', 'Ventilation', 'Natural Building']
      },
      Water: {
        icon: 'fa-tint',
        color: 'text-cyan-600',
        subcategories: ['Water Filtration', 'Urban Water', 'Water Purification', 'Drinking Water Storage', 'Water Distribution']
      },
      'Waste Management': {
        icon: 'fa-recycle',
        color: 'text-green-600',
        subcategories: ['Composting', 'Recycling', 'Upcycling', 'Hygiene', 'Zero Waste']
      },
      Energy: {
        icon: 'fa-solar-panel',
        color: 'text-yellow-600',
        subcategories: ['Solar', 'Wind', 'Hydropower', 'Biogas', 'Motors', 'Wiring', 'Compressors', 'HVAC', 'Plumbing', 'Design']
      },
      'Appropriate Tech': {
        icon: 'fa-tools',
        color: 'text-purple-600',
        subcategories: ['Agriculture', 'Construction', 'People', 'Healthcare', 'PTSD Care', 'Field Medicine', 'Education']
      },
      Agronomy: {
        icon: 'fa-seedling',
        color: 'text-emerald-600',
        subcategories: ['Integrated Pest Management', 'Soil Improvement', 'Cover Cropping', 'Diversified Agriculture', 'Specialty Crops', 'Organic Techniques']
      }
    };
    };
    $content =~ s/(const supabase = createClient.*?;)/$1\n$category_structure/s;
}

# Add state management
unless ($content =~ m/let\s+state\s*=/) {
    my $state_management = q{
    let state = {
      currentCategory: null,
      currentSubcategory: null,
      activeDropdown: null,
      searchTerm: ''
    };
    };
    $content =~ s/(const categoryStructure\s*=.*?;)/$1\n$state_management/s;
}

# Fix video card template to include category icons
$content =~ s/(<span class="text-sm text-green-600 font-medium">\$\{video\.category \|\| 'Uncategorized'\}<\/span>)/<i class="fas \$\{categoryStructure[video.category]?.icon || 'fa-tag'\} mr-2 \$\{categoryStructure[video.category]?.color || 'text-gray-600'\}"><\/i>$1/g;

# Add loading state management
$content =~ s/async function loadVideos\(searchTerm = ''\)\s*\{/async function loadVideos(searchTerm = '') {\n    showLoading();\n/;
$content =~ s/renderVideoGrid\(videos\);/renderVideoGrid(videos);\n    hideLoading();\n/;

# Add helper functions
my $helper_functions = q{
function showLoading() {
  document.getElementById('loadingPlaceholder').classList.remove('hidden');
  document.getElementById('videoGrid').classList.add('hidden');
}

function hideLoading() {
  document.getElementById('loadingPlaceholder').classList.add('hidden');
  document.getElementById('videoGrid').classList.remove('hidden');
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
};

# Add helper functions before the event listeners
$content =~ s/(document\.addEventListener\('DOMContentLoaded')/$helper_functions\n$1/;

# Fix search input handler
$content =~ s/searchInput\.addEventListener\('input'.*?\}\);/searchInput.addEventListener('input', debounce((e) => {\n      state.searchTerm = e.target.value.toLowerCase();\n      loadVideos(state.searchTerm);\n    }, 300));/s;

# Write output
my $output_file = $input_file;
$output_file =~ s/\.html$/-enhanced.html/;
open(my $out, '>', $output_file) or die "Cannot write to $output_file: $!";
print $out $content;
close $out;

print "Enhanced file written to $output_file\n";
