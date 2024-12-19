    import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
    import safeHtml from './safeHtmlUtils.js';


// Mondrian Grid Implementation
class MondrianGrid {
  constructor() {
    this.colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-yellow-400',
      'bg-white',
      'bg-gray-100'
    ];
    
    this.sizes = [
      'col-span-1 row-span-1',
      'col-span-2 row-span-1',
      'col-span-1 row-span-2',
      'col-span-2 row-span-2'
    ];

    this.icons = {
      'Temporary Shelter': 'fa-home',
      'Permanent Housing': 'fa-building',
      'Insulation': 'fa-temperature-high',
      'Ventilation': 'fa-wind',
      'Natural Building': 'fa-tree',
      'Water Filtration': 'fa-filter',
      'Water Purification': 'fa-tint',
      'Drinking Water Storage': 'fa-box',
      'Water Distribution': 'fa-faucet',
      'Composting': 'fa-recycle',
      'Recycling': 'fa-sync',
      'Upcycling': 'fa-trash-restore',
      'Healthcare': 'fa-heartbeat',
      'Education': 'fa-graduation-cap',
      'Agriculture': 'fa-seedling',
      'default': 'fa-circle'
    };


    this.createOverlay();
    this.setupEventListeners();
  }

  getRandomColor() {
    // Using HSL color space for more vibrant colors
    const hue = Math.random() * 360;
    const saturation = Math.random() * 50 + 50; // 50-100% for more vibrant colors
    const lightness = Math.random() * 30 + 35;  // 35-65% for better visibility
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

    getRandomSize(min, max) {
    if (min !== undefined && max !== undefined) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    return this.sizes[Math.floor(Math.random() * this.sizes.length)];
  }

   getIconForSubcategory(subcategory) {
    return this.icons[subcategory] || this.icons.default;
  }


  generateGridItems(subcategories) {
    const grid = document.getElementById('mondrian-grid');
    grid.innerHTML = '';

    const sizes = ['large', 'medium', 'small'];
    const colors = ['red', 'blue', 'yellow', 'white', 'black'];

    subcategories.forEach(subcategory => {
      const sizeClass = sizes[Math.floor(Math.random() * sizes.length)];
      const colorClass = colors[Math.floor(Math.random() * colors.length)];

      const gridItem = document.createElement('div');
      gridItem.className = `mondrian-item ${sizeClass} ${colorClass}`;
      
      const titleDiv = document.createElement('div');
      titleDiv.className = 'title';
      titleDiv.textContent = subcategory;
      gridItem.appendChild(titleDiv);

      grid.appendChild(gridItem);
    });
  }


  createOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'mondrian-overlay';
    overlay.className = 'fixed inset-0 bg-black bg-opacity-75 hidden z-50';
    
    overlay.innerHTML = `
      <div class="absolute inset-0 p-8">
        <div id="mondrian-grid" class="w-full h-full grid gap-4 opacity-0 transform scale-95 transition-all duration-300">
          <!-- Grid items will be inserted here -->
        </div>
      </div>
      <button id="mondrian-close" class="absolute top-4 right-4 text-white text-2xl hover:text-gray-300">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    document.body.appendChild(overlay);
  }

  setupEventListeners() {
    // Close button handler
    document.getElementById('mondrian-close').addEventListener('click', () => {
      this.hideGrid();
    });

    // Category click handlers
    document.querySelectorAll('.category-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const category = e.target.getAttribute('data-category');
        if (category) {
          this.showGridForCategory(category);
        }
      });
    });

    // ESC key handler
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hideGrid();
      }
    });
  }




  getRandomSize() {
    return this.sizes[Math.floor(Math.random() * this.sizes.length)];
  }

  getIconForSubcategory(subcategory) {
    return this.icons[subcategory] || this.icons.default;
  }



showGridForCategory(category) {
    const overlay = document.getElementById('mondrian-overlay');
    const grid = document.getElementById('mondrian-grid');

    // Get subcategories from the matching dropdown menu
    const categoryButton = document.querySelector(`[data-category="${category}"]`);
    const dropUpMenu = categoryButton?.closest('.group')?.querySelector('.drop-up-menu');
    const subcategories = Array.from(dropUpMenu?.querySelectorAll('.drop-up-item') || [])
      .map(item => item.textContent.trim());

    if (subcategories.length) {
      this.generateGridItems(subcategories); // Generate styled grid items
      overlay.classList.remove('hidden');
      setTimeout(() => {
        grid.classList.remove('opacity-0', 'scale-95');
      }, 10);
    }
  }



  hideGrid() {
    const overlay = document.getElementById('mondrian-overlay');
    const grid = document.getElementById('mondrian-grid');
    grid.classList.add('opacity-0', 'scale-95');
    setTimeout(() => {
      overlay.classList.add('hidden');
    }, 300);
  }


  getRandomSize(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}




    class PublicVideoPortal {
  constructor() {
    // Initialize properties
    this.supabase = createClient(
      'https://vlvbodwrtblttvwnxkjx.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsdmJvZHdydGJsdHR2d254a2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODY3NDk2NzIsImV4cCI6MjAwMjMyNTY3Mn0.TRT1HeX85vP1zDxnU7qBz5GqNPgYZUj-BOdek4qmtEg'
    );
    this.safeHtml = safeHtml;
    this.currentPage = 0;
    this.isLoading = false;
    this.hasMore = true;
    this.BATCH_SIZE = 12;
    this.selectedCategory = null;
    this.searchQuery = '';

    // Start initialization
    this.init();
  }


      async loadInitialCats() {
          try {
              this.isLoading = true;
              this.emit('loading', true);

              const { data: categories, error } = await this.supabase
                  .from('categories')
                  .select('*, subcategories(*)');

              if (error) throw error;
              this.categories = categories || [];
              this.emit('dataLoaded', { categories: this.categories });
          } catch (error) {
              console.error('Error loading data:', error);
              this.error = error.message;
              this.emit('error', error.message);
          } finally {
              this.isLoading = false;
              this.emit('loading', false);
          }
      }





  async init() {
    this.setupEventListeners();
    this.showSkeletonLoader();
    await this.loadVideos();
  }

  setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.resetAndReload();
      });
    }

    const categoryButtons = document.querySelectorAll('.category-icon');
    categoryButtons.forEach(button => {
      button.addEventListener('click', () => this.handleCategoryClick(button));
    });

    // Sort select
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.handleSort(e.target.value);
      });
    }

    // Infinite scroll
    this.setupInfiniteScroll();
  }

  setupInfiniteScroll() {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !this.isLoading && this.hasMore) {
          this.loadVideos();
        }
      },
      { threshold: 0.1 }
    );

    const trigger = document.getElementById('infiniteScrollTrigger');
    if (trigger) {
      observer.observe(trigger);
    }
  }

  showSkeletonLoader() {
    const loader = document.getElementById('skeletonLoader');
    if (!loader) return;

    const skeletons = Array(6).fill().map(() => this.createSkeletonCard()).join('');
    loader.innerHTML = skeletons;
    loader.classList.remove('hidden');
    
    const videoGrid = document.getElementById('videoGrid');
    if (videoGrid) {
      videoGrid.classList.add('hidden');
    }
  }

  createSkeletonCard() {
    return `
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="w-full h-48 shimmer"></div>
        <div class="p-4">
          <div class="h-6 w-3/4 shimmer rounded mb-2"></div>
          <div class="h-4 w-full shimmer rounded mb-4"></div>
          <div class="flex gap-2 mb-4">
            <div class="h-6 w-20 shimmer rounded-full"></div>
            <div class="h-6 w-20 shimmer rounded-full"></div>
          </div>
        </div>
      </div>
    `;
  }

  async loadVideos() {
    if (this.isLoading || !this.hasMore) return;
    
    this.isLoading = true;
    
    try {
      // Start building the query
    



      const expansions = `
        *,
        panels(*)
      `;

      let query = this.supabase
        .from('Video')
        .select(expansions.trim()) // `.trim()` to remove newline whitespace
        .is('status', null);



      // Apply search filter if present
      if (this.searchQuery) {
        query = query.or(`title.ilike.%${this.searchQuery}%,category.ilike.%${this.searchQuery}%`);
      }

      // Complete the query with range and order
      query = query
        .range(this.currentPage * this.BATCH_SIZE, (this.currentPage + 1) * this.BATCH_SIZE - 1)
        .order('createdAt', { ascending: false });

      const { data: videos, error } = await query;

      if (error) throw error;

      if (videos.length < this.BATCH_SIZE) {
        this.hasMore = false;
      }

      this.renderVideos(videos);
      this.currentPage++;
      
    } catch (error) {
      console.error('Error loading videos:', error);
      this.showError('Failed to load videos');
    } finally {
      this.isLoading = false;
      document.getElementById('skeletonLoader').classList.add('hidden');
      document.getElementById('videoGrid').classList.remove('hidden');
    }
  }

  renderVideos(videos) {
    const videoGrid = document.getElementById('videoGrid');
    if (!videoGrid) return;

    const videoHTML = videos.map(video => this.createVideoCard(video)).join('');
    
    if (this.currentPage === 0) {
      videoGrid.innerHTML = videoHTML;
    } else {
      videoGrid.insertAdjacentHTML('beforeend', videoHTML);
    }
  }

  resetAndReload() {
    this.currentPage = 0;
    this.hasMore = true;
    const videoGrid = document.getElementById('videoGrid');
    if (videoGrid) {
      videoGrid.innerHTML = ''; // Clear existing videos
    }
    this.showSkeletonLoader();
    this.loadVideos();
  }

  createVideoCard(video) {
    const safeVideo = this.safeHtml.escapeObject(video);
    
    return `
      <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div class="relative aspect-video">
          <A target=new href="https://www.youtube.com/watch?v=${safeVideo.youtubeId}"><img 
            src="https://img.youtube.com/vi/${safeVideo.youtubeId}/maxresdefault.jpg"
            alt="${safeVideo.title}"
            class="w-full h-full object-cover"
            onerror="this.src='https://img.youtube.com/vi/${safeVideo.youtubeId}/0.jpg'"
          ></a>
        </div>
        
        <div class="p-4">
          <h3 class="text-lg font-semibold mb-2 line-clamp-2">${safeVideo.title}</h3>
          <p class="text-gray-600 text-sm mb-3 line-clamp-2">${safeVideo.description}</p>
          
          <div class="flex items-center gap-2 mb-3">
            <i class="fas ${this.getCategoryIcon(safeVideo.category)} text-gray-500"></i>
            <span class="text-sm text-gray-600">${safeVideo.category || 'DIY'}</span>
            <i class="fas ${this.getCategoryIcon(safeVideo.category)} text-gray-500"></i>
            <span class="text-sm text-gray-600">${safeVideo.subcategory || 'DIY'}</span>
          </div>
          
          ${this.renderPanels(safeVideo.panels)}
          
          <div class="flex flex-wrap gap-2 mt-3">
            ${this.renderTags(safeVideo.tags)}
          </div>
        </div>
      </div>
    `;
  }

  renderPanels(panels) {
    if (!panels || !panels.length) return '';
    
    return `
      <div class="mt-4 space-y-2">
        ${panels.map(panel => `
          <div class="bg-gray-50 p-3 rounded-lg">
            <h4 class="font-medium text-sm mb-1">${this.safeHtml.escape(panel.title)}</h4>
            <p class="text-sm text-gray-600">${this.safeHtml.escape(panel.content)}</p>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderTags(tags) {
    if (!tags) return '';
    
    const processedTags = Array.isArray(tags) 
      ? tags 
      : tags.toString().replace(/[{}]/g, '').split(',');

    return processedTags.map(tag => `
      <span class="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
        ${this.safeHtml.escape(tag.trim())}
      </span>
    `).join('');
  }

  getCategoryIcon(category) {
    const icons = {
      'diy': 'fa-home',
      'water': 'fa-tint',
      'waste': 'fa-recycle',
      'energy': 'fa-solar-panel',
      'agriculture': 'fa-seedling',
      'health': 'fa-heart'
    };
    return icons[category?.toLowerCase()] || 'fa-tag';
  }


  handleCategoryClick(button) {
  // Get the category from the data attribute
  const newCategory = button.dataset.category;
  console.log('Clicking category:', newCategory);
  
  // Remove active class from all buttons
  document.querySelectorAll('.category-icon').forEach(btn => {
    btn.classList.remove('active', 'bg-gray-100');
    btn.classList.add('bg-white');
  });
  
  // Toggle category selection
  if (this.selectedCategory === newCategory) {
    // If clicking the same category, deselect it
    this.selectedCategory = null;
    if (this.searchQuery) {
      this.searchQuery = '';
      document.getElementById('searchInput').value = '';
    }
    console.log('Deselected category, now null');
  } else {
    // Select the new category
    this.selectedCategory = newCategory;
    button.classList.add('active', 'bg-gray-100');
    button.classList.remove('bg-white');
    this.searchQuery = newCategory;
    document.getElementById('searchInput').value = newCategory;
    console.log('Selected new category:', this.selectedCategory);
  }

  // Reset and reload videos with new category
  this.resetAndReload();
}




handleSort(sortValue) {
  switch (sortValue) {
    case 'newest':
      this.sortKey = 'createdAt';
      this.sortDirection = 'desc';
      break;
    case 'popular':
      this.sortKey = 'views';
      this.sortDirection = 'desc';
      break;
    case 'az':
      this.sortKey = 'title';
      this.sortDirection = 'asc';
      break;
  }
  this.resetAndReload();
}


  showError(message) {
    const videoGrid = document.getElementById('videoGrid');
    if (!videoGrid) return;

    videoGrid.innerHTML = `
      <div class="col-span-full text-center py-8">
        <div class="text-red-600 mb-2">${this.safeHtml.escape(message)}</div>
        <button 
          onclick="location.reload()" 
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    `;
  }
}


document.addEventListener('DOMContentLoaded', () => {
  // Initialize PublicVideoPortal
  new PublicVideoPortal();
  
  // Setup category navigation
  const mainCategories = document.querySelectorAll('.group > a');
  const mondrianBox = document.getElementById('mondrian-box');
  const subcategoryLinks = document.getElementById('subcategory-links');
  const searchInput = document.getElementById('searchInput');
  let currentCategory = null;

  // 1. Category Navigation Events
  mainCategories.forEach(category => {
    category.addEventListener('click', (e) => {
      e.preventDefault();
      const categoryValue = category.getAttribute('data-category');
      
      // Toggle category selection
      if (currentCategory === category) {
        mondrianBox.classList.add('hidden');
        currentCategory = null;
      } else {
        // Show subcategories for selected category
        const dropUpMenu = category.nextElementSibling;
        const subcategories = dropUpMenu.querySelectorAll('.drop-up-item');
        
        subcategoryLinks.innerHTML = '';
        subcategories.forEach(subcategory => {
          subcategoryLinks.appendChild(subcategory.cloneNode(true));
        });
        
        mondrianBox.classList.remove('hidden');
        currentCategory = category;
      }
    });
  });

  // 2. Search Input Events
  if (searchInput) {
    // Real-time search
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const videoGrid = document.getElementById('videoGrid');
      
      // Filter visible videos based on search term
      const videos = videoGrid.querySelectorAll('.video-card');
      videos.forEach(video => {
        const title = video.querySelector('.video-title').textContent.toLowerCase();
        const description = video.querySelector('.video-description').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
          video.classList.remove('hidden');
        } else {
          video.classList.add('hidden');
        }
      });
    });
  }

  // 3. Sort Select Events
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      const sortValue = e.target.value;
      const videoGrid = document.getElementById('videoGrid');
      const videos = Array.from(videoGrid.querySelectorAll('.video-card'));
      
      videos.sort((a, b) => {
        const aValue = a.getAttribute(`data-${sortValue}`);
        const bValue = b.getAttribute(`data-${sortValue}`);
        return bValue.localeCompare(aValue);
      });
      
      videos.forEach(video => videoGrid.appendChild(video));
    });
  }

  // 4. Dark Mode Toggle Events
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
      const isDark = document.documentElement.classList.contains('dark');
      localStorage.setItem('darkMode', isDark);
    });
  }

  // 5. Profile Dropdown Events
  const profileButton = document.getElementById('profileButton');
  const profileDropdown = document.getElementById('profileDropdown');
  
  if (profileButton && profileDropdown) {
    profileButton.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('dropdown-active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
      profileDropdown.classList.remove('dropdown-active');
    });
  }

  // 6. Subcategory Link Events
  subcategoryLinks.addEventListener('click', (e) => {
    if (e.target.matches('.drop-up-item')) {
      e.preventDefault();
      const category = e.target.getAttribute('data-category');
      updateCategory(category);
      mondrianBox.classList.add('hidden');
      currentCategory = null;
    }
  });

  // 7. Window Resize Events (for responsive handling)
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const width = window.innerWidth;
      document.body.classList.toggle('mobile', width < 768);
      adjustLayout();
    }, 250);
  });

  // 8. Infinite Scroll Events
  const observerOptions = {
    root: null,
    rootMargin: '100px',
    threshold: 0.1
  };

  const infiniteScrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadMoreContent();
      }
    });
  }, observerOptions);

  const scrollTrigger = document.getElementById('infiniteScrollTrigger');
  if (scrollTrigger) {
    infiniteScrollObserver.observe(scrollTrigger);
  }

  // 9. Video Detail View Events
  document.addEventListener('click', (e) => {
    if (e.target.matches('.video-card') || e.target.closest('.video-card')) {
      const videoId = e.target.closest('.video-card').getAttribute('data-video-id');
      showVideoDetail(videoId);
    }
  });

  // Helper Functions
  function updateCategory(category) {
    if (searchInput) {
      searchInput.value = category;
      searchInput.dispatchEvent(new Event('input'));
    }
  }

  function adjustLayout() {
    if (mondrianBox && !mondrianBox.classList.contains('hidden')) {
      const links = subcategoryLinks.querySelectorAll('a');
      const isMobile = window.innerWidth < 768;
      
      links.forEach(link => {
        link.classList.toggle('w-full', isMobile);
        link.classList.toggle('w-auto', !isMobile);
      });
    }
  }

  function loadMoreContent() {
    // Implement your content loading logic here
    console.log('Loading more content...');
  }

  function showVideoDetail(videoId) {
    // Implement your video detail view logic here
    console.log('Showing video detail for:', videoId);
  }

  // Initial setup
  adjustLayout();
  const savedDarkMode = localStorage.getItem('darkMode') === 'true';
  document.documentElement.classList.toggle('dark', savedDarkMode);



  class ErrorHandler {
  constructor() {
    this.errorContainer = document.createElement('div');
    this.errorContainer.className = 'fixed bottom-4 right-4 max-w-sm';
    document.body.appendChild(this.errorContainer);
  }

  showError(message, duration = 5000) {
    const errorElement = document.createElement('div');
    errorElement.className = 'bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg mb-2 transform transition-all duration-300 translate-x-0';
    errorElement.textContent = message;

    this.errorContainer.appendChild(errorElement);

    // Fade out and remove after duration
    setTimeout(() => {
      errorElement.classList.add('translate-x-full', 'opacity-0');
      setTimeout(() => errorElement.remove(), 300);
    }, duration);
  }
}



class LoadingState {
  constructor() {
    this.loadingOverlay = document.createElement('div');
    this.loadingOverlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden z-50';
    this.loadingOverlay.innerHTML = `
      <div class="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-3">
        <div class="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        <span class="text-gray-700">Loading...</span>
      </div>
    `;
    document.body.appendChild(this.loadingOverlay);
  }

  show() {
    this.loadingOverlay.classList.remove('hidden');
  }

  hide() {
    this.loadingOverlay.classList.add('hidden');
  }
}



});

const themeToggleHtml = `
<div class="absolute right-4 top-4">
  <button id="themeToggle" class="p-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors">
    <i class="fas fa-moon dark:hidden"></i>
    <i class="fas fa-sun hidden dark:block"></i>
  </button>
</div>`;

// Enhanced category management
class CategoryManager {
  constructor() {
    this.activeCategory = null;
    this.init();
  }

  init() {
    // Initialize theme
    this.setupThemeToggle();
    this.setupCategoryListeners();
    this.initializeDropUpState();
  }

  setupThemeToggle() {
    const header = document.querySelector('.container.mx-auto.px-4');
    header.insertAdjacentHTML('beforeend', themeToggleHtml);
    
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', 
        document.documentElement.classList.contains('dark') ? 'dark' : 'light'
      );
    });

    // Set initial theme
    if (localStorage.theme === 'dark' || 
        (!('theme' in localStorage) && 
         window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  }

  setupCategoryListeners() {
    const categoryLinks = document.querySelectorAll('.group > a');
    
    categoryLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleCategoryClick(link);
      });
    });

    // Prevent closing when clicking inside drop-up menu
    document.querySelectorAll('.drop-up-menu').forEach(menu => {
      menu.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    });
  }

  handleCategoryClick(categoryLink) {
    const dropUpMenu = categoryLink.nextElementSibling;
    const category = categoryLink.getAttribute('data-category');

    // Keep other menus open, just toggle this one
    if (this.activeCategory === category) {
      dropUpMenu.classList.toggle('hidden');
      this.activeCategory = dropUpMenu.classList.contains('hidden') ? null : category;
    } else {
      dropUpMenu.classList.remove('hidden');
      this.activeCategory = category;
    }

    // Update styles
    this.updateCategoryStyles(categoryLink);
  }

  updateCategoryStyles(activeLink) {
    // Add active styles to current category
    document.querySelectorAll('.group > a').forEach(link => {
      if (link === activeLink) {
        link.classList.add('bg-opacity-20', 'bg-white');
      } else {
        link.classList.remove('bg-opacity-20', 'bg-white');
      }
    });
  }

  initializeDropUpState() {
    // Add initial states and styles to drop-up menus
    document.querySelectorAll('.drop-up-menu').forEach(menu => {
      menu.classList.add(
        'absolute',
        'bg-white',
        'dark:bg-gray-800',
        'shadow-lg',
        'rounded-md',
        'mt-2',
        'py-2',
        'z-50',
        'transition-all',
        'duration-200',
        'ease-in-out'
      );

      // Style the menu items
      menu.querySelectorAll('.drop-up-item').forEach(item => {
        item.classList.add(
          'block',
          'px-4',
          'py-2',
          'text-sm',
          'text-gray-700',
          'dark:text-gray-200',
          'hover:bg-gray-100',
          'dark:hover:bg-gray-700',
          'transition-colors'
        );
      });
    });
  }
}

// Initialize the manager
document.addEventListener('DOMContentLoaded', () => {
  const categoryManager = new CategoryManager();
});

