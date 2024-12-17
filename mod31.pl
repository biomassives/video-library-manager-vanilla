#!/usr/bin/perl
use strict;
use warnings;

# Read the input file
my $file = $ARGV[0] || die "Please provide an input file\n";
open(my $in, '<', $file) || die "Can't open $file: $!";
my $content = do { local $/; <$in> };
close $in;

# CSS Updates - Mondrian Grid Enhancement
my $new_styles = q{
/* Mondrian Grid Enhancements */
.mondrian-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  padding: 24px;
  background: rgba(0, 0, 0, 0.9);
  border-radius: 12px;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 400px;
}

.mondrian-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.mondrian-item:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

.mondrian-item .title {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.2),
    rgba(0, 0, 0, 0.8)
  );
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  text-align: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.mondrian-item:hover .title {
  opacity: 1;
}

/* Dynamic Sizes */
.mondrian-item.size-1 {
  grid-column: span 1;
  grid-row: span 1;
  aspect-ratio: 1;
}

.mondrian-item.size-2 {
  grid-column: span 2;
  grid-row: span 1;
  aspect-ratio: 2/1;
}

.mondrian-item.size-3 {
  grid-column: span 2;
  grid-row: span 2;
  aspect-ratio: 1;
}

/* Vibrant Mondrian Colors */
.mondrian-red { background: #ff0000; }
.mondrian-blue { background: #0000ff; }
.mondrian-yellow { background: #ffde00; }
.mondrian-white { background: #ffffff; }
.mondrian-black { background: #000000; }

/* Header Improvements */
.category-header {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #1a365d 0%, #2563eb 100%);
  padding: 2rem 0;
}

.category-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

/* Enhanced Drop-up Menu */
.drop-up-menu {
  transform: translateY(0);
  opacity: 1;
  visibility: visible;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
              0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.drop-up-menu.hidden {
  transform: translateY(10px);
  opacity: 0;
  visibility: hidden;
}

.drop-up-item {
  position: relative;
  padding: 0.75rem 1.5rem;
  transition: all 0.2s ease;
  color: #374151;
  font-weight: 500;
}

.drop-up-item:hover {
  background: rgba(59, 130, 246, 0.08);
  color: #2563eb;
}

.drop-up-item::before {
  content: '';
  position: absolute;
  left: 0.5rem;
  top: 50%;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  transform: translateY(-50%) scale(0);
  transition: transform 0.2s ease;
}

.drop-up-item:hover::before {
  transform: translateY(-50%) scale(1);
}
};

# Update the existing styles
$content =~ s{<style>.*?</style>}{<style>\n$new_styles\n</style>}s;

# Update MondrianGrid class implementation
my $new_mondrian_js = q{
class MondrianGrid {
  constructor() {
    this.colors = ['mondrian-red', 'mondrian-blue', 'mondrian-yellow', 'mondrian-white', 'mondrian-black'];
    this.sizes = ['size-1', 'size-2', 'size-3'];
    this.setupGrid();
    this.bindEvents();
  }

  setupGrid() {
    const grid = document.getElementById('mondrian-grid');
    if (!grid) return;

    grid.innerHTML = ''; // Clear existing grid
    const categories = this.getCategories();
    
    categories.forEach((category, index) => {
      const item = this.createGridItem(category, index);
      grid.appendChild(item);
    });
  }

  createGridItem(category, index) {
    const item = document.createElement('div');
    const sizeClass = this.sizes[index % this.sizes.length];
    const colorClass = this.colors[Math.floor(Math.random() * this.colors.length)];
    
    item.className = `mondrian-item ${sizeClass} ${colorClass}`;
    item.innerHTML = `
      <div class="title">
        <span>${category.name}</span>
      </div>
    `;
    
    item.addEventListener('click', () => {
      this.handleCategoryClick(category);
    });

    return item;
  }

  handleCategoryClick(category) {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.value = category.name;
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    // Animate transition
    this.animateTransition();
  }

  animateTransition() {
    const overlay = document.getElementById('mondrian-overlay');
    const grid = document.getElementById('mondrian-grid');
    
    grid.style.opacity = '0';
    grid.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
      overlay.classList.add('hidden');
      setTimeout(() => {
        grid.style.opacity = '1';
        grid.style.transform = 'scale(1)';
      }, 300);
    }, 300);
  }

  getCategories() {
    // Extract categories from your existing navigation
    const categories = [];
    document.querySelectorAll('.group > a').forEach(link => {
      const category = {
        name: link.getAttribute('data-category'),
        icon: link.querySelector('i')?.className || '',
        subcategories: []
      };
      
      const subcategories = link.nextElementSibling?.querySelectorAll('.drop-up-item');
      if (subcategories) {
        subcategories.forEach(sub => {
          category.subcategories.push({
            name: sub.textContent,
            value: sub.getAttribute('data-category')
          });
        });
      }
      
      categories.push(category);
    });
    
    return categories;
  }

  bindEvents() {
    document.getElementById('mondrian-close')?.addEventListener('click', () => {
      this.hideGrid();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hideGrid();
      }
    });
  }

  hideGrid() {
    const overlay = document.getElementById('mondrian-overlay');
    this.animateTransition();
  }
}
};

# Update the MondrianGrid implementation
$content =~ s{class MondrianGrid \{.*?\}}{$new_mondrian_js}s;

# Write the modified content back to a new file
my $output_file = $file;
$output_file =~ s/\.html$/_enhanced.html/;
open(my $out, '>', $output_file) || die "Can't write to $output_file: $!";
print $out $content;
close $out;

print "Enhanced file has been created as $output_file\n";
