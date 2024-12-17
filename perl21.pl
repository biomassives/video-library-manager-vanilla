#!/usr/bin/perl
use strict;
use warnings;

# Update HTML
my $html_file = 'index_integrated_2.html';
my $html_content = do {
    local $/;
    open my $fh, '<', $html_file or die "Can't open $html_file: $!";
    <$fh>
};

# Replace head section
$html_content =~ s{<head>.*?</head>}{<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ApproVideo - DIY Solutions Portal</title>
  
  <!-- Load Tailwind first -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    window.tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {},
      },
      plugins: [],
    }
  </script>
  
  <!-- Other resources -->
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
  <link href="stylenew.css" rel="stylesheet">
  
  <!-- Load Supabase -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>}s;

# Write updated HTML
open my $html_out, '>', $html_file or die "Can't write to $html_file: $!";
print $html_out $html_content;
close $html_out;

# Update JS
my $js_file = 'index_integrated_2.js';
my $js_content = do {
    local $/;
    open my $fh, '<', $js_file or die "Can't open $js_file: $!";
    <$fh>
};

# Add initialization wrapper
$js_content = qq{document.addEventListener('DOMContentLoaded', async () => {
  // Wait for external resources to load
  await Promise.all([
    new Promise(resolve => {
      if (window.tailwind) resolve();
      else window.addEventListener('load', resolve);
    }),
    new Promise(resolve => {
      if (window.supabase) resolve();
      else window.addEventListener('load', resolve);
    })
  ]);

  try {
    // Initialize your classes
    const mondrianGrid = new MondrianGrid();
    const videoPortal = new PublicVideoPortal();
    const categoryManager = new CategoryManager();
  } catch (error) {
    console.error('Initialization error:', error);
  }
});\n\n} . $js_content;

# Write updated JS
open my $js_out, '>', $js_file or die "Can't write to $js_file: $!";
print $js_out $js_content;
close $js_out;

print "Files updated successfully.\n";
