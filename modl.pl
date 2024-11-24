#!/usr/bin/perl

use strict;
use warnings;

# Path to your HTML file
my $filename = 'newcreate2b.html'; 

# Read the file content
open(my $fh, '<', $filename) or die "Could not open file '$filename' $!";
my $html_content = do { local $/; <$fh> };
close($fh);

# 1. Get subcategory value: Add this line within the form submission handler
$html_content =~ s/(const category = document\.getElementById\('newCategory'\)\.value;)/$1\n      const subcategory = document\.getElementById\('newSubcategory'\)\.value;/;

# 2. Include in videoData: Add the 'subcategory' field
$html_content =~ s/(\{[\s\S]*?youtubeId,[\s\S]*?category,[\s\S]*?tags,[\s\S]*?datePublished: now,[\s\S]*?createdAt: now,[\s\S]*?updatedAt: now)/$1\n          subcategory: subcategory,/g;

# Write the modified content back to the file
open($fh, '>', $filename) or die "Could not open file '$filename' $!";
print $fh $html_content;
close($fh);

print "File '$filename' updated successfully!\n";
