#!/usr/bin/perl
use strict;
use warnings;

# Read the input file
my $input_file = 'index.js';  # Replace with your actual file name
my $output_file = 'index.js.fixed';

open(my $in, '<', $input_file) or die "Cannot open input file: $!";
open(my $out, '>', $output_file) or die "Cannot open output file: $!";

my $in_mondrian_class = 0;
my $found_first_random_color = 0;
my $content = '';

while (my $line = <$in>) {
    # Track when we're inside the MondrianGrid class
    $in_mondrian_class = 1 if $line =~ /class\s+MondrianGrid/;
    
    # Skip the second getRandomColor method
    if ($in_mondrian_class && $line =~ /^\s*getRandomColor\(\)/) {
        if ($found_first_random_color) {
            # Skip until we find the closing brace of the method
            while ($line = <$in>) {
                last if $line =~ /^\s*}\s*$/;
            }
            next;
        }
        $found_first_random_color = 1;
    }
    
    # Write the line to output
    print $out $line;
}

close($in);
close($out);

# Rename the fixed file to replace the original
rename($output_file, $input_file);

print "File has been fixed.\n";
