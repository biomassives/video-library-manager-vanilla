#!/usr/bin/perl
use strict;
use warnings;

# Read and modify the JavaScript file
my $js_input = 'index_integrated.js';
my $js_output = 'index_integrated_2.js';
my $html_input = 'index_integrated.html';
my $html_output = 'index_integrated_2.html';

# Process JavaScript file
open(my $in, '<', $js_input) or die "Cannot open $js_input: $!";
open(my $out, '>', $js_output) or die "Cannot open $js_output: $!";

my $in_class = 0;
my $class_level = 0;

while (my $line = <$in>) {
    # Remove problematic getRandomColor function
    next if $line =~ /^\s*getRandomColor\(\)/;
    
    # Track class nesting
    $class_level++ if $line =~ /\{/;
    $class_level-- if $line =~ /\}/;
    
    # Fix class structure
    if ($line =~ /class MondrianGrid/) {
        $in_class = 1;
    }
    
    if ($in_class && $class_level == 0) {
        $in_class = 0;
    }
    
    print $out $line;
}

close($in);
close($out);

# Process HTML file
open($in, '<', $html_input) or die "Cannot open $html_input: $!";
open($out, '>', $html_output) or die "Cannot open $html_output: $!";

while (my $line = <$in>) {
    # Update script source
    if ($line =~ /src="index_integrated\.js"/) {
        $line =~ s/index_integrated\.js/index_integrated_2.js/;
    }
    
    # Remove problematic inline script
    next if $line =~ /getRandomColor\(\)/;
    
    # Add Tailwind config before Tailwind script
    if ($line =~ /cdn\.tailwindcss\.com/) {
        print $out qq{  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {},
      },
      plugins: [],
    }
  </script>\n};
    }
    
    print $out $line;
}

close($in);
close($out);

print "Created $js_output and $html_output with fixes applied.\n";
