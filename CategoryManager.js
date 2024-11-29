// CategoryManager.js - A vanilla JS implementation of category management
class CategoryManager {
    constructor(store) {
        this.store = store;
        this.containerEl = null;
        this.modal = null;
        
        // Bind methods to preserve context
        this.render = this.render.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        
        // Initialize once DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        // Find or create container element
        this.containerEl = document.getElementById('categories-container');
        if (!this.containerEl) {
            console.error('Categories container not found');
            return;
        }

        // Create reusable modal
        this.createModal();
        
        // Bind store events
        this.bindStoreEvents();
        
        // Initial render
        this.render();
    }

    createModal() {
        // Create modal HTML structure
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 hidden flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md w-full">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold" id="modal-title">Add Category</h2>
                    <button class="modal-close text-gray-500 hover:text-gray-700">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                <form id="category-form" class="space-y-4">
                    <input type="hidden" name="categoryId">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input type="text" name="name" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Icon Class</label>
                        <input type="text" name="icon_class" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" placeholder="fas fa-folder">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea name="description" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" rows="3"></textarea>
                    </div>
                    <div class="flex justify-end gap-3 mt-6">
                        <button type="button" class="modal-close px-4 py-2 border rounded-lg hover:bg-gray-50">
                            Cancel
                        </button>
                        <button type="submit" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                            <span class="submit-text">Add Category</span>
                            <span class="loading-spinner hidden">
                                <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                </svg>
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        `;

        // Add modal to document
        document.body.appendChild(modal);
        this.modal = modal;

        // Bind modal events
        this.bindModalEvents();
    }

    bindModalEvents() {
        // Close modal on backdrop click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hideModal();
            }
        });

        // Close modal on close button click
        this.modal.querySelectorAll('.modal-close').forEach(button => {
            button.addEventListener('click', () => this.hideModal());
        });

        // Handle form submission
        const form = this.modal.querySelector('#category-form');
        form.addEventListener('submit', this.handleSubmit);
    }

    bindStoreEvents() {
        // Handle store loading states
        this.store.on('loading', (isLoading) => {
            if (isLoading) {
                this.containerEl.innerHTML = this.renderLoading();
            }
        });

        // Handle store errors
        this.store.on('error', (message) => {
            this.containerEl.innerHTML = this.renderError(message);
        });

        // Update view when data changes
        this.store.on('dataLoaded', () => {
            this.render();
        });
    }

    showModal(category = null) {
        const form = this.modal.querySelector('#category-form');
        const title = this.modal.querySelector('#modal-title');
        const submitBtn = form.querySelector('button[type="submit"] .submit-text');

        // Reset form
        form.reset();

        // Update modal for edit or add mode
        if (category) {
            title.textContent = 'Edit Category';
            submitBtn.textContent = 'Update Category';
            form.elements.categoryId.value = category.id;
            form.elements.name.value = category.name;
            form.elements.icon_class.value = category.icon_class || '';
            form.elements.description.value = category.description || '';
        } else {
            title.textContent = 'Add Category';
            submitBtn.textContent = 'Add Category';
            form.elements.categoryId.value = '';
        }

        this.modal.classList.remove('hidden');
    }

    hideModal() {
        this.modal.classList.add('hidden');
        const form = this.modal.querySelector('#category-form');
        form.reset();
    }

    async handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const loadingSpinner = submitBtn.querySelector('.loading-spinner');
        const submitText = submitBtn.querySelector('.submit-text');

        try {
            // Show loading state
            submitBtn.disabled = true;
            loadingSpinner.classList.remove('hidden');
            submitText.classList.add('hidden');

            // Get form data
            const formData = new FormData(form);
            const categoryData = {
                name: formData.get('name'),
                icon_class: formData.get('icon_class'),
                description: formData.get('description')
            };

            // Update or create category
            const categoryId = formData.get('categoryId');
            if (categoryId) {
                await this.store.updateCategory(categoryId, categoryData);
            } else {
                await this.store.addCategory(categoryData);
            }

            this.hideModal();
        } catch (error) {
            // Show error in modal
            const errorDiv = form.querySelector('.error-message') || document.createElement('div');
            errorDiv.className = 'error-message bg-red-100 text-red-700 p-3 rounded-md mb-4';
            errorDiv.textContent = error.message;
            form.insertBefore(errorDiv, form.firstChild);
        } finally {
            // Reset loading state
            submitBtn.disabled = false;
            loadingSpinner.classList.add('hidden');
            submitText.classList.remove('hidden');
        }
    }

    async handleDelete(categoryId) {
        if (confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
            try {
                await this.store.deleteCategory(categoryId);
            } catch (error) {
                alert('Error deleting category: ' + error.message);
            }
        }
    }

    handleEdit(category) {
        this.showModal(category);
    }

    render() {
        if (!this.containerEl) return;

        // Add button at the top
        const addButton = `
            <button id="add-category-btn" 
                    class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 mb-6">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                Add Category
            </button>
        `;
        

        const categoriesGrid = `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                ${this.store.categories.map(category => `
                    <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 border" data-category-id="${category.id}">
                        <div class="flex justify-between items-start">
                            <div>
                                <h3 class="font-semibold text-lg">${this.escapeHtml(category.name)}</h3>
                                ${category.description ? 
                                    `<p class="text-gray-600 text-sm mt-1">${this.escapeHtml(category.description)}</p>` 
                                    : ''
                                }
                            </div>
                            <div class="flex gap-2">
                                <button onclick="categoryManager.handleEdit(${JSON.stringify(category)})"
                                        class="p-2 text-blue-500 hover:bg-blue-50 rounded-full">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                    </svg>
                                </button>
                                <button onclick="categoryManager.handleDelete('${category.id}')"
                                        class="p-2 text-red-500 hover:bg-red-50 rounded-full">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mt-4 add-sub-btn"
                                data-category-id="${category.id}">
                            Add Subcategory
                        </button>
                    </div>
                `).join('')}
            </div>
        `;

        this.containerEl.innerHTML = addButton + categoriesGrid;

        // Rebind all Add Subcategory buttons
        const addSubButtons = this.containerEl.querySelectorAll('.add-sub-btn');
        addSubButtons.forEach(button => {
            button.addEventListener('click', () => {
                const categoryId = button.dataset.categoryId;
                if (categoryId) {
                    console.log(`Adding subcategory to category ID: ${categoryId}`);
                    this.addSubcategory(categoryId);
                } else {
                    console.error('No category ID found for Add Subcategory button');
                }
            });
        });

        document.getElementById('add-category-btn').addEventListener('click', () => this.showModal());
    }

    renderLoading() {
        return `
            <div class="flex items-center justify-center p-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                <span class="ml-3 text-gray-600">Loading categories...</span>
            </div>
        `;
    }

    renderError(message) {
        return `
            <div class="bg-red-50 border-l-4 border-red-500 p-4">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" 
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                                  clip-rule="evenodd"/>
                        </svg>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-red-700">Error loading categories: ${this.escapeHtml(message)}</p>
                    </div>
                </div>
            </div>
        `;
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

export class categoryManager {
    constructor(store) {
        this.store = store;
        this.init();
    }

    init() {
        console.log('CategoryManager initialized');
        // Your existing initialization logic
    }
}

