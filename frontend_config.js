/**
 * Frontend Configuration for BL-frontend Repository
 * Connects to BL-backend API
 */

// API Configuration
const API_BASE_URL = 'https://bl-backend.onrender.com/api';
const FRONTEND_URL = 'https://hariom0300.github.io/BL-frontend';

// Application Configuration
const APP_CONFIG = {
    name: 'Dongare Fashion',
    description: 'Premium Fashion for the Modern Individual',
    currency: '₹',
    currencyCode: 'INR',
    contact: {
        email: 'hariomvimal33333@gmail.com',
        phone: '+91 98341 34470'
    }
};

// API Endpoints
const API_ENDPOINTS = {
    products: `${API_BASE_URL}/products`,
    categories: `${API_BASE_URL}/categories`,
    auth: {
        login: `${API_BASE_URL}/auth/login`,
        register: `${API_BASE_URL}/auth/register`,
        logout: `${API_BASE_URL}/auth/logout`
    },
    cart: {
        get: `${API_BASE_URL}/cart`,
        add: `${API_BASE_URL}/cart`,
        clear: `${API_BASE_URL}/cart/clear`
    },
    orders: {
        get: `${API_BASE_URL}/orders`,
        create: `${API_BASE_URL}/orders`
    }
};

// Local Storage Keys
const STORAGE_KEYS = {
    AUTH_TOKEN: 'dongare_auth_token',
    USER_INFO: 'dongare_user_info',
    CART_ITEMS: 'dongare_cart_items',
    WISHLIST_ITEMS: 'dongare_wishlist_items'
};

// API Service Class
class ApiService {
    constructor() {
        this.token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        this.baseURL = API_BASE_URL;
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

    // Authentication methods
    async login(credentials) {
        try {
            const response = await this.request(API_ENDPOINTS.auth.login, {
                method: 'POST',
                body: JSON.stringify(credentials)
            });

            if (response.success) {
                localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
                localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(response.data.user));
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
            const response = await this.request(API_ENDPOINTS.auth.register, {
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
            await this.request(API_ENDPOINTS.auth.logout, {
                method: 'POST'
            });

            // Clear local storage
            localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER_INFO);
            this.token = null;
            
            return true;
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    }

    // Products methods
    async getProducts(params = {}) {
        try {
            const queryString = new URLSearchParams(params).toString();
            const endpoint = queryString ? `${API_ENDPOINTS.products}?${queryString}` : API_ENDPOINTS.products;
            
            const response = await this.request(endpoint);
            return response.data;
        } catch (error) {
            console.error('Get products error:', error);
            throw error;
        }
    }

    async getProduct(id) {
        try {
            const response = await this.request(`${API_ENDPOINTS.products}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Get product error:', error);
            throw error;
        }
    }

    // Categories methods
    async getCategories() {
        try {
            const response = await this.request(API_ENDPOINTS.categories);
            return response.data;
        } catch (error) {
            console.error('Get categories error:', error);
            throw error;
        }
    }

    // Cart methods
    async getCart() {
        try {
            const response = await this.request(API_ENDPOINTS.cart.get);
            return response.data;
        } catch (error) {
            console.error('Get cart error:', error);
            throw error;
        }
    }

    async addToCart(productId, quantity = 1) {
        try {
            const response = await this.request(API_ENDPOINTS.cart.add, {
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
            const response = await this.request(API_ENDPOINTS.cart.clear, {
                method: 'POST'
            });

            return response.data;
        } catch (error) {
            console.error('Clear cart error:', error);
            throw error;
        }
    }

    // Orders methods
    async getOrders() {
        try {
            const response = await this.request(API_ENDPOINTS.orders.get);
            return response.data;
        } catch (error) {
            console.error('Get orders error:', error);
            throw error;
        }
    }

    async createOrder(orderData) {
        try {
            const response = await this.request(API_ENDPOINTS.orders.create, {
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
        const userInfo = localStorage.getItem(STORAGE_KEYS.USER_INFO);
        return userInfo ? JSON.parse(userInfo) : null;
    }
}

// Initialize API service
const apiService = new ApiService();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        API_BASE_URL,
        FRONTEND_URL,
        APP_CONFIG,
        API_ENDPOINTS,
        STORAGE_KEYS,
        ApiService,
        apiService
    };
} else {
    window.APP_CONFIG = APP_CONFIG;
    window.API_ENDPOINTS = API_ENDPOINTS;
    window.STORAGE_KEYS = STORAGE_KEYS;
    window.ApiService = ApiService;
    window.apiService = apiService;
}
