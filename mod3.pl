#!/usr/bin/perl

use strict;
use warnings;

# Input HTML file
my $input_file = 'dec2b.html';
# Output HTML file
my $output_file = '_a.html';

# Read the input HTML file
open my $fh, '<', $input_file or die "Cannot open $input_file: $!";
my $html = do { local $/; <$fh> };
close $fh;

# 1. Header Refinement
#   - Replace spaced out "A P P R O V I D E O" with "ApproVideo"
$html =~ s/<div class="flex justify-center space-x-8 py-4">A P P R O V I D E O<\/div>/<div class="flex justify-center space-x-8 py-4 font-bold text-xl">ApproVideo<\/div>/;
#   - Make subheader more prominent
$html =~ s/<div class="subheader">(.+?)<\/div>/<div class="subheader text-lg font-semibold">$1<\/div>/;

# 2. Category Icons
#   - Remove floating icons for now (we'll add them back later if needed)
$html =~ s/<div class="floating-icons">.+?<\/div>//gs;

# 3. Mondrian Grid Refinement
#   - This requires more complex logic, so we'll leave it for later

# Write the modified HTML to the output file
open $fh, '>', $output_file or die "Cannot open $output_file: $!";
print $fh $html;
close $fh;

print "Modified HTML written to $output_file\n";
