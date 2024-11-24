import re

def enhance_html(input_file, output_file):
    # Read the input file
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Define the category structure to inject
    category_structure = """
    const categoryStructure = {
      Shelter: {
        icon: 'fa-home',
        color: 'text-blue-600',
        subcategories: ['Temporary Shelter', 'Permanent Housing', 'Insulation', 'Ventilation', 'Natural Building']
      },
      Water: {
        icon: 'fa-tint',
        color: 'text-cyan-600',
        subcategories: ['Water Filtration', 'Urban Water', 'Water Purification', 'Drinking Water Storage', 'Water Distribution']
      },
      'Waste Management': {
        icon: 'fa-recycle',
        color: 'text-green-600',
        subcategories: ['Composting', 'Recycling', 'Upcycling', 'Hygiene', 'Zero Waste']
      },
      Energy: {
        icon: 'fa-solar-panel',
        color: 'text-yellow-600',
        subcategories: ['Solar', 'Wind', 'Hydropower', 'Biogas', 'Motors', 'Wiring', 'Compressors', 'HVAC', 'Plumbing', 'Design']
      },
      'Appropriate Tech': {
        icon: 'fa-tools',
        color: 'text-purple-600',
        subcategories: ['Agriculture', 'Construction', 'People', 'Healthcare', 'PTSD Care', 'Field Medicine', 'Education']
      },
      Agronomy: {
        icon: 'fa-seedling',
        color: 'text-emerald-600',
        subcategories: ['Integrated Pest Management', 'Soil Improvement', 'Cover Cropping', 'Diversified Agriculture', 'Specialty Crops', 'Organic Techniques']
      }
    };
    """

    # Define the video card function
    video_card_function = """
    function createVideoCard(video) {
      const categoryInfo = categoryStructure[video.type] || { icon: 'fa-tag', color: 'text-gray-600' };
      const colorClass = categoryInfo.color.replace('text-', 'bg-');
      
      return `
        <div class="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-200 hover:scale-105 hover:shadow-xl">
          <div class="relative group">
            <div class="relative">
              <img src="https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg" 
                   alt="${video.title}" 
                   class="w-full h-48 object-cover"
                   onerror="this.src='https://img.youtube.com/vi/${video.youtubeId}/0.jpg'">
              
              <div class="absolute top-0 right-0 p-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button onclick="handleEditClick('${video.id}')"
                        class="p-2 bg-white/90 hover:bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200">
                  <i class="fas fa-edit text-blue-600"></i>
                </button>
                
                <button onclick="handleDeleteClick('${video.id}')"
                        class="p-2 bg-white/90 hover:bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200">
                  <i class="fas fa-trash text-red-600"></i>
                </button>
              </div>
            </div>

            <div class="p-6">
              <div class="mb-4">
                <h2 class="text-xl font-semibold mb-2 text-gray-800 line-clamp-2">${video.title || 'Untitled'}</h2>
                <p class="text-gray-600 text-sm line-clamp-3">${video.description || ''}</p>
              </div>
              
              <div class="flex flex-col gap-4">
                <button onclick="handleCategoryClick('${video.type}')" 
                        class="flex items-center gap-2 self-start px-3 py-1.5 rounded-full 
                               ${colorClass} bg-opacity-10 hover:bg-opacity-20 
                               transition-all duration-200 group/cat">
                  <i class="fas ${categoryInfo.icon} ${categoryInfo.color} text-lg 
                            group-hover/cat:scale-110 transform transition-transform"></i>
                  <span class="text-sm font-medium ${categoryInfo.color}">${video.type || 'Uncategorized'}</span>
                </button>

                <div class="flex flex-wrap gap-2">
                  ${Array.isArray(video.tags) ? video.tags.map(tag => `
                    <button onclick="handleTagClick('${tag}')"
                            class="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 
                                   rounded-full text-xs transition-colors duration-200 
                                   flex items-center gap-1 hover:shadow-sm group/tag">
                      <i class="fas fa-tag text-blue-400 text-xs group-hover/tag:scale-110 
                               transform transition-transform"></i>
                      <span>${tag}</span>
                    </button>
                  `).join('') : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // Click handlers
    function handleCategoryClick(category) {
      localforage.setItem('searchCategory', category).then(() => {
        window.location.href = 'tags.html';
      });
    }

    function handleTagClick(tag) {
      localforage.setItem('searchTag', tag).then(() => {
        window.location.href = 'tags.html';
      });
    }

    // Make handlers globally available
    window.handleCategoryClick = handleCategoryClick;
    window.handleTagClick = handleTagClick;
    """

    # Find the script section and inject our new code
    script_pattern = r'<script type="module">(.*?)</script>'
    script_content = re.search(script_pattern, content, re.DOTALL).group(1)
    
    # Add our new code after the Supabase initialization
    enhanced_script = script_content.replace(
        'const supabase = createClient(',
        f'{category_structure}\nconst supabase = createClient('
    )
    
    # Add the video card function before the initialize function
    enhanced_script = enhanced_script.replace(
        'async function initialize()',
        f'{video_card_function}\nasync function initialize()'
    )

    # Replace the original script with our enhanced version
    enhanced_content = re.sub(script_pattern, f'<script type="module">{enhanced_script}</script>', content, flags=re.DOTALL)

    # Write the enhanced content to the output file
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(enhanced_content)

if __name__ == "__main__":
    import sys
    if len(sys.argv) != 3:
        print("Usage: python script.py input.html output.html")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    enhance_html(input_file, output_file)
    print(f"Enhanced HTML written to {output_file}")
