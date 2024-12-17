#!/usr/bin/perl
use strict;
use warnings;
use File::Slurp;  # For reading/writing files

# Input and output file names
my $input_file = "index__1a.html";
my $output_file = "index__1b.html";

# Read the entire input file
my $content = read_file($input_file) or die "Cannot read $input_file: $!";

# Make necessary modifications

# 1. Fix the category icons
$content =~ s/<button class="category-icon-btn group"/<button class="category-icon-btn group relative"/g;

# 2. Add proper subcategories data structure
my $subcategories_data = q{
  getSubcategoriesForCategory(category) {
    const subcategories = {
      water: [
        { name: 'Filtration', description: 'Water filtration systems' },
        { name: 'Urban Water', description: 'Urban water management' },
        { name: 'Purification', description: 'Water purification methods' },
        { name: 'Storage', description: 'Water storage solutions' },
        { name: 'Distribution', description: 'Water distribution systems' }
      ],
      waste: [
        { name: 'Composting', description: 'Composting techniques' },
        { name: 'Recycling', description: 'Recycling methods' },
        { name: 'Upcycling', description: 'Creative reuse strategies' },
        { name: 'Zero Waste', description: 'Zero waste lifestyle' }
      ],
      energy: [
        { name: 'Solar', description: 'Solar power solutions' },
        { name: 'Wind', description: 'Wind energy systems' },
        { name: 'Hydropower', description: 'Water power generation' },
        { name: 'Biogas', description: 'Biogas production' }
      ]
    };
    return subcategories[category] || [];
  }
};

# 3. Insert the subcategories data into the CategoryNavigation class
$content =~ s/class CategoryNavigation \{/class CategoryNavigation {
  $subcategories_data/;

# 4. Fix the initialization
$content =~ s/new PublicVideoPortal\(\);/new PublicVideoPortal();
  new CategoryNavigation();/;

# 5. Ensure proper event handling for category buttons
$content =~ s/querySelector\('.category-icon'\)/querySelectorAll('.category-icon-btn')/g;

# Write the modified content to the output file
write_file($output_file, $content) or die "Cannot write $output_file: $!";

print "File processed successfully!\n";
print "Original file: $input_file\n";
print "Modified file: $output_file\n";
