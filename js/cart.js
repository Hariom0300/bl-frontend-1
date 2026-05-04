// Cart Module for Dongare Fashion
class CartManager {
    constructor() {
        this.apiService = window.apiService;
        this.cartItems = [];
        this.init();
    }

    async init() {
        await this.loadCart();
        this.initEventListeners();
    }

    async loadCart() {
        try {
            this.cartItems = await this.apiService.getCart();
            this.updateCartUI();
        } catch (error) {
            console.error('Failed to load cart:', error);
        }
    }

    initEventListeners() {
        // Cart button
        const cartBtn = document.getElementById('cartBtn');
        if (cartBtn) {
            cartBtn.addEventListener('click', () => this.showCartModal());
        }

        // Close cart modal
        const closeBtn = document.querySelector('#cartModal .close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeCartModal());
        }

        // Click outside modal to close
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('cartModal');
            if (e.target === modal) {
                this.closeCartModal();
            }
        });
    }

    showCartModal() {
        const modal = document.getElementById('cartModal');
        if (modal) {
            this.renderCartItems();
            modal.style.display = 'block';
        }
    }

    closeCartModal() {
        const modal = document.getElementById('cartModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    renderCartItems() {
        const cartItemsContainer = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        
        if (!cartItemsContainer) return;

        if (this.cartItems.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            if (cartTotal) cartTotal.textContent = '0';
            return;
        }

        cartItemsContainer.innerHTML = this.cartItems.map(item => `
            <div class="cart-item" data-item-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image || 'assets/images/default-product.jpg'}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>₹${item.price}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="cartManager.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="cartManager.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                <div class="cart-item-total">
                    ₹${item.price * item.quantity}
                </div>
                <button class="remove-btn" onclick="cartManager.removeItem(${item.id})">&times;</button>
            </div>
        `).join('');

        this.updateCartTotal();
    }

    updateCartTotal() {
        const cartTotal = document.getElementById('cartTotal');
        if (!cartTotal) return;

        const total = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = total.toFixed(2);
    }

    async updateQuantity(itemId, newQuantity) {
        if (newQuantity <= 0) {
            this.removeItem(itemId);
            return;
        }

        try {
            // In a real implementation, you'd call an API to update quantity
            // For now, update locally
            const item = this.cartItems.find(item => item.id === itemId);
            if (item) {
                item.quantity = newQuantity;
                this.renderCartItems();
            }
        } catch (error) {
            console.error('Failed to update quantity:', error);
            this.showError('Failed to update quantity');
        }
    }

    async removeItem(itemId) {
        try {
            // In a real implementation, you'd call an API to remove item
            // For now, remove locally
            this.cartItems = this.cartItems.filter(item => item.id !== itemId);
            this.renderCartItems();
            this.updateCartCount();
        } catch (error) {
            console.error('Failed to remove item:', error);
            this.showError('Failed to remove item');
        }
    }

    updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const totalItems = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }

    updateCartUI() {
        this.updateCartCount();
    }

    proceedToCheckout() {
        if (this.cartItems.length === 0) {
            this.showError('Your cart is empty');
            return;
        }

        // Redirect to checkout page
        window.location.href = 'checkout.html';
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

// Initialize cart manager
const cartManager = new CartManager();

// Global function for cart modal
function closeCartModal() {
    cartManager.closeCartModal();
}

function proceedToCheckout() {
    cartManager.proceedToCheckout();
}
