#!/usr/bin/perl
use strict;
use warnings;
use File::Copy;

# Input and output files
my $input_html = "index__1a.html";
my $output_html = "index__1b.html";
my $input_css = "style.css";
my $output_css = "style_new.css";
my $input_css8 = "style8.css";
my $output_css8 = "style8_new.css";

# Create backups
copy($input_html, $input_html . ".bak") or die "Cannot backup HTML: $!";
copy($input_css, $input_css . ".bak") or die "Cannot backup CSS: $!";
copy($input_css8, $input_css8 . ".bak") or die "Cannot backup CSS8: $!";

# Read files
open(my $in_html, '<', $input_html) or die "Cannot open $input_html: $!";
open(my $out_html, '>', $output_html) or die "Cannot open $output_html: $!";
open(my $in_css, '<', $input_css) or die "Cannot open $input_css: $!";
open(my $out_css, '>', $output_css) or die "Cannot open $output_css: $!";
open(my $in_css8, '<', $input_css8) or die "Cannot open $input_css8: $!";
open(my $out_css8, '>', $output_css8) or die "Cannot open $output_css8: $!";

# Process HTML file
while (my $line = <$in_html>) {
    # Update category icons navigation
    if ($line =~ /<!-- Category Icons Navigation -->/) {
        print $out_html $line;
        print $out_html qq{
  <div class="bg-gradient-to-b from-gray-900 to-gray-800 border-b border-gray-700">
    <div class="container mx-auto px-4">
      <div class="flex justify-center space-x-8 py-6">
        <button class="category-icon-btn group relative" data-category="water">
          <i class="fas fa-tint fa-2x text-blue-500 transition-all duration-300 group-hover:scale-110"></i>
          <span class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-all duration-300">Water</span>
        </button>\n};
        next;
    }

    # Update Mondrian overlay
    if ($line =~ /<!-- Mondrian Overlay -->/) {
        print $out_html $line;
        print $out_html qq{
    <div id="mondrian-overlay" class="fixed inset-0 bg-black bg-opacity-90 hidden z-50">
      <div class="absolute inset-0 p-8">
        <div id="mondrian-grid" class="w-full h-full grid gap-4 opacity-0 transform scale-95 transition-all duration-300">
          <!-- Dynamic subcategories -->
        </div>
      </div>
      <button id="mondrian-close" class="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 transition-colors duration-300">
        <i class="fas fa-times"></i>
      </button>
    </div>\n};
        next;
    }

    # Add new script initialization
    if ($line =~ /new PublicVideoPortal\(\);/) {
        print $out_html "  new PublicVideoPortal();\n";
        print $out_html "  const categoryNav = new CategoryNavigation();\n";
        next;
    }

    # Pass through other lines unchanged
    print $out_html $line;
}

# Process style.css
while (my $line = <$in_css>) {
    # Update floating icons animation
    if ($line =~ /\.floating-icon/) {
        print $out_css qq{
.floating-icon {
  position: absolute;
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.7);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease-out;
  transform-style: preserve-3d;
  opacity: 0;
  animation: floatIn 0.5s ease-out forwards;
}\n};
        next;
    }

    # Add new animations - Note the escaped @ symbol
    if ($line =~ /\@keyframes/) {
        print $out_css $line;
        print $out_css qq{
\@keyframes floatIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 0.25;
    transform: translateY(0);
  }
}\n};
        next;
    }

    # Pass through other lines unchanged
    print $out_css $line;
}

# Process style8.css
while (my $line = <$in_css8>) {
    # Update Mondrian grid styles
    if ($line =~ /#mondrian-grid/) {
        print $out_css8 qq{
#mondrian-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-auto-rows: minmax(100px, auto);
  gap: 1rem;
  height: 100%;
  opacity: 0;
  transform: scale(0.95);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}\n};
        next;
    }

    # Pass through other lines unchanged
    print $out_css8 $line;
}

# Close all files
close($in_html);
close($out_html);
close($in_css);
close($out_css);
close($in_css8);
close($out_css8);

print "Files processed successfully!\n";
print "Backups created with .bak extension\n";
print "New files created:\n";
print "- $output_html\n";
print "- $output_css\n";
print "- $output_css8\n";
