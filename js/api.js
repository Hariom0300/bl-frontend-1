// API Service for Dongare Fashion Frontend
class ApiService {
    constructor() {
        this.baseURL = window.API_BASE_URL || 'https://bl-backend.onrender.com/api';
        this.token = localStorage.getItem('dongare_auth_token');
    }

    // Generic API request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                ...options.headers
            },
            ...options
        };

        // Add auth token if available
        if (this.token) {
            config.headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Products API
    async getProducts(params = {}) {
        try {
            const queryString = new URLSearchParams(params).toString();
            const endpoint = queryString ? `/products?${queryString}` : '/products';
            const response = await this.request(endpoint);
            return response.data;
        } catch (error) {
            console.error('Get products error:', error);
            throw error;
        }
    }

    async getProduct(id) {
        try {
            const response = await this.request(`/products/${id}`);
            return response.data;
        } catch (error) {
            console.error('Get product error:', error);
            throw error;
        }
    }

    // Categories API
    async getCategories() {
        try {
            const response = await this.request('/categories');
            return response.data;
        } catch (error) {
            console.error('Get categories error:', error);
            throw error;
        }
    }

    // Authentication API
    async login(credentials) {
        try {
            const response = await this.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify(credentials)
            });

            if (response.success) {
                localStorage.setItem('dongare_auth_token', response.data.token);
                localStorage.setItem('dongare_user_info', JSON.stringify(response.data.user));
                this.token = response.data.token;
                return response.data;
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async register(userData) {
        try {
            const response = await this.request('/auth/register', {
                method: 'POST',
                body: JSON.stringify(userData)
            });

            if (response.success) {
                return response.data;
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    async logout() {
        try {
            await this.request('/auth/logout', {
                method: 'POST'
            });

            // Clear local storage
            localStorage.removeItem('dongare_auth_token');
            localStorage.removeItem('dongare_user_info');
            this.token = null;
            
            return true;
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    }

    // Cart API
    async getCart() {
        try {
            const response = await this.request('/cart');
            return response.data;
        } catch (error) {
            console.error('Get cart error:', error);
            throw error;
        }
    }

    async addToCart(productId, quantity = 1) {
        try {
            const response = await this.request('/cart', {
                method: 'POST',
                body: JSON.stringify({
                    product_id: productId,
                    quantity: quantity
                })
            });

            return response.data;
        } catch (error) {
            console.error('Add to cart error:', error);
            throw error;
        }
    }

    async clearCart() {
        try {
            const response = await this.request('/cart/clear', {
                method: 'POST'
            });

            return response.data;
        } catch (error) {
            console.error('Clear cart error:', error);
            throw error;
        }
    }

    // Orders API
    async getOrders() {
        try {
            const response = await this.request('/orders');
            return response.data;
        } catch (error) {
            console.error('Get orders error:', error);
            throw error;
        }
    }

    async createOrder(orderData) {
        try {
            const response = await this.request('/orders', {
                method: 'POST',
                body: JSON.stringify(orderData)
            });

            return response.data;
        } catch (error) {
            console.error('Create order error:', error);
            throw error;
        }
    }

    // Check authentication status
    isAuthenticated() {
        return !!this.token;
    }

    // Get current user info
    getCurrentUser() {
        const userInfo = localStorage.getItem('dongare_user_info');
        return userInfo ? JSON.parse(userInfo) : null;
    }
}

// Initialize API service
const apiService = new ApiService();
