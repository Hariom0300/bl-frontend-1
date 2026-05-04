// Products Module for Dongare Fashion
class ProductsManager {
    constructor() {
        this.apiService = window.apiService;
        this.products = [];
        this.categories = [];
        this.init();
    }

    async init() {
        await this.loadCategories();
        await this.loadProducts();
        this.initEventListeners();
    }

    async loadCategories() {
        try {
            this.categories = await this.apiService.getCategories();
            this.renderCategories();
            this.populateCategoryFilter();
        } catch (error) {
            console.error('Failed to load categories:', error);
        }
    }

    async loadProducts(params = {}) {
        this.showLoading(true);
        try {
            this.products = await this.apiService.getProducts(params);
            this.renderProducts();
        } catch (error) {
            console.error('Failed to load products:', error);
            this.showError('Failed to load products');
        } finally {
            this.showLoading(false);
        }
    }

    renderCategories() {
        const categoriesGrid = document.getElementById('categoriesGrid');
        if (!categoriesGrid) return;

        categoriesGrid.innerHTML = this.categories.map(category => `
            <div class="category-card">
                <img src="assets/images/category-${category.id}.jpg" alt="${category.name}" onerror="this.src='assets/images/default-category.jpg'">
                <h3>${category.name}</h3>
            </div>
        `).join('');

        // Add click handlers
        categoriesGrid.querySelectorAll('.category-card').forEach((card, index) => {
            card.addEventListener('click', () => {
                this.filterByCategory(this.categories[index].id);
            });
        });
    }

    renderProducts() {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;

        if (this.products.length === 0) {
            productsGrid.innerHTML = '<p class="no-products">No products found.</p>';
            return;
        }

        productsGrid.innerHTML = this.products.map(product => `
            <div class="product-card" data-product-id="${product.id}">
                <img src="${product.image || 'assets/images/default-product.jpg'}" alt="${product.name}" onerror="this.src='assets/images/default-product.jpg'">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-description">${product.description || ''}</p>
                    <div class="product-price">₹${product.price}</div>
                    <div class="product-actions">
                        <button class="btn btn-primary" onclick="productsManager.addToCart(${product.id})">Add to Cart</button>
                        <a href="product-detail.html?id=${product.id}" class="btn btn-outline">View Details</a>
                    </div>
                </div>
            </div>
        `).join('');
    }

    populateCategoryFilter() {
        const categoryFilter = document.getElementById('categoryFilter');
        if (!categoryFilter) return;

        // Add categories to filter
        this.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categoryFilter.appendChild(option);
        });
    }

    initEventListeners() {
        // Search functionality
        const searchBtn = document.getElementById('searchBtn');
        const searchInput = document.getElementById('searchInput');
        
        if (searchBtn && searchInput) {
            searchBtn.addEventListener('click', () => {
                this.searchProducts(searchInput.value);
            });

            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchProducts(searchInput.value);
                }
            });
        }

        // Category filter
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                const categoryId = e.target.value;
                if (categoryId) {
                    this.filterByCategory(categoryId);
                } else {
                    this.loadProducts();
                }
            });
        }

        // Sort filter
        const sortFilter = document.getElementById('sortFilter');
        if (sortFilter) {
            sortFilter.addEventListener('change', (e) => {
                this.sortProducts(e.target.value);
            });
        }
    }

    async searchProducts(query) {
        if (!query.trim()) {
            this.loadProducts();
            return;
        }

        await this.loadProducts({ search: query });
    }

    async filterByCategory(categoryId) {
        await this.loadProducts({ category: categoryId });
    }

    sortProducts(sortBy) {
        let sortedProducts = [...this.products];

        switch (sortBy) {
            case 'price-low':
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                sortedProducts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                break;
        }

        this.products = sortedProducts;
        this.renderProducts();
    }

    async addToCart(productId) {
        try {
            await this.apiService.addToCart(productId);
            this.showSuccess('Product added to cart!');
            this.updateCartCount();
        } catch (error) {
            console.error('Failed to add to cart:', error);
            this.showError('Failed to add product to cart');
        }
    }

    updateCartCount() {
        // This would typically get cart count from API
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            // For now, increment by 1 (in real app, get from API)
            const currentCount = parseInt(cartCount.textContent) || 0;
            cartCount.textContent = currentCount + 1;
        }
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        const productsGrid = document.getElementById('productsGrid');
        
        if (loading) {
            loading.style.display = show ? 'block' : 'none';
        }
        
        if (productsGrid) {
            productsGrid.style.display = show ? 'none' : 'grid';
        }
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem;
            background: ${type === 'success' ? '#28a745' : '#dc3545'};
            color: white;
            border-radius: 5px;
            z-index: 3000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize products manager
const productsManager = new ProductsManager();
