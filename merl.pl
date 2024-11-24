#!/usr/bin/perl -w

use strict;
use warnings;

# Get the filename from the command line arguments
my $filename = shift @ARGV;

# Check if a filename was provided
die "Usage: $0 <filename>\n" unless defined $filename;

# Read the file contents
open my $fh, '<', $filename or die "Could not open file '$filename': $!\n";
my $content = do { local $/; <$fh> };
close $fh;

# Find the sortVideos function
if ($content =~ /(sortVideos\(videos\) \{.*?\})/s) {
    my $sortVideosFunction = $1;

    # Add debug statements to the sortVideos function
    $sortVideosFunction =~ s/switch \(this\.state\.state\.currentSort\) \{$/switch (this.state.state.currentSort) {\n        console.log("Sorting by:", this.state.state.currentSort);\n        console.log("Videos before sorting:", videos);/g;
    $sortVideosFunction =~ s/return \[\.\.\.videos\]\.sort\((a, b\) => \{/return [...videos].sort((a, b) => {\n        console.log("Comparing:", a, b);/g;
    $sortVideosFunction =~ s/}\);/    });\n    console.log("Videos after sorting:", videos);\n    return videos;/g;

    # Add the missing sort cases to the sortVideos function
    my $sortCases = <<'EOF';
        case 'date-asc':
          return new Date(a.created_at || 0) - new Date(b.created_at || 0);
        case 'title-desc':
          return (b.title || '').localeCompare(a.title || '');
        case 'category':
          return (a.category || '').localeCompare(b.category || ''); 
        default:
          console.warn("Unknown sort option:", this.state.state.currentSort);
          return 0; 
EOF

    $sortVideosFunction =~ s/case 'title-asc':\s*return \(a\.title \|\| ''\)\.localeCompare\(b\.title \|\| ''\);(.*?)\s*\}/case 'title-asc':\n          return (a.title || '').localeCompare(b.title || '');\n$sortCases$1    }/s;

    # Replace the original sortVideos function with the modified one
    $content =~ s/sortVideos\(videos\) \{.*?\})/s/$sortVideosFunction/s;
} else {
    warn "Could not find the sortVideos function in the file.\n";
}

# Write the modified content back to the file
open $fh, '>', $filename or die "Could not open file '$filename' for writing: $!\n";
print $fh $content;
close $fh;

print "File '$filename' updated successfully.\n";
