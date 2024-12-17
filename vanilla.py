#!/usr/bin/env python3

def update_files():
    # Update HTML
    html_file = 'index_integrated_2.html'
    try:
        with open(html_file, 'r') as fh:
            html_content = fh.read()

        # Replace head section
        new_head = '''<head>
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
</head>'''

        html_content = re.sub(r'<head>.*?</head>', new_head, html_content, flags=re.DOTALL)

        with open(html_file, 'w') as f:
            f.write(html_content)

        # Update JS
        js_file = 'index_integrated_2.js'
        with open(js_file, 'r') as fh:
            js_content = fh.read()

        # Add initialization wrapper
        init_wrapper = '''document.addEventListener('DOMContentLoaded', async () => {
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
});

'''
        js_content = init_wrapper + js_content

        with open(js_file, 'w') as f:
            f.write(js_content)

        print("Files updated successfully.")
        return True

    except Exception as e:
        print(f"Error: {str(e)}")
        return False

if __name__ == "__main__":
    import re
    import os

    # Create backups first
    for file in ['index_integrated_2.html', 'index_integrated_2.js']:
        if os.path.exists(file):
            backup = file + '.bak'
            try:
                with open(file, 'r') as source:
                    with open(backup, 'w') as target:
                        target.write(source.read())
                print(f"Created backup: {backup}")
            except Exception as e:
                print(f"Error creating backup of {file}: {e}")
                exit(1)

    # Run the update
    update_files()
