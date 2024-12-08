import re

def modify_html(file_path):
    """
    Modifies the HTML file to add a modal popup for video panels.

    Args:
      file_path: The path to the HTML file.
    """

    with open(file_path, 'r') as f:
        html_content = f.read()

    # Add modal structure
    modal_html = """
    <div id="panelModal" class="modal">
      <div class="bg-white rounded-lg overflow-hidden w-full max-w-4xl relative p-4">
        <button id="panelModalCloseButton" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <i class="fas fa-times text-2xl"></i>
        </button>
        <div id="panelModalContent" class="p-4"></div>
      </div>
    </div>
    """
    html_content = html_content.replace('<body class="theme-transition">', '<body class="theme-transition">' + modal_html)

    # Add modal styles
    modal_css = """
    /* Modal Styles */
    .modal {
      @apply hidden fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50;
    }
    """
    html_content = re.sub(r'</style>', modal_css + '\n  </style>', html_content)

    # Modify JavaScript to handle modal
    js_changes = """
      // ... (existing JavaScript code) ...

      async init() {
        // ... (existing init code) ...

        // Close modal when clicking on close button
        const panelModalCloseButton = document.getElementById('panelModalCloseButton');
        panelModalCloseButton.addEventListener('click', () => {
          this.closePanelModal();
        });

        // Close modal when clicking outside the modal content
        const panelModal = document.getElementById('panelModal');
        panelModal.addEventListener('click', (event) => {
          if (event.target === panelModal) {
            this.closePanelModal();
          }
        });
      }

      renderPanels(panels) {
        if (!panels || !panels.length) return '';
        return `
          <div class="mt-4 space-y-2">
            ${panels.map(panel => `
              <div class="bg-gray-50 p-3 rounded-lg cursor-pointer" onclick="window.panelModal.openPanelModal('${this.safeHtml.escape(panel.title)}', '${this.safeHtml.escape(panel.content)}')">
                <h4 class="font-medium text-sm mb-1">${this.safeHtml.escape(panel.title)}</h4>
                <p class="text-sm text-gray-600">${this.safeHtml.escape(panel.content)}</p>
              </div>
            `).join('')}
          </div>
        `;
      }

      openPanelModal(title, content) {
        const modal = document.getElementById('panelModal');
        const modalContent = document.getElementById('panelModalContent');
        modalContent.innerHTML = `
          <h3 class="text-lg font-semibold mb-2">${title}</h3>
          <p class="text-sm">${content}</p>
        `;
        modal.classList.remove('hidden');
      }

      closePanelModal() {
        const modal = document.getElementById('panelModal');
        modal.classList.add('hidden');
      }

      // ... (rest of your JavaScript code) ...
    """
    html_content = re.sub(r'</script>', js_changes + '\n  </script>', html_content)

    with open(file_path, 'w') as f:
        f.write(html_content)

# Example usage:
file_path = 'index_s1.html'  # Replace with the actual path to your HTML file
modify_html(file_path)
