// Main Application for Dongare Fashion
class DongareApp {
    constructor() {
        this.init();
    }

    init() {
        this.initEventListeners();
        this.initSmoothScroll();
        this.initNewsletter();
        this.checkAuthStatus();
    }

    initEventListeners() {
        // Mobile menu toggle
        this.initMobileMenu();
        
        // Scroll effects
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Newsletter form
        const newsletterForm = document.getElementById('newsletterForm');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => this.handleNewsletter(e));
        }
    }

    initMobileMenu() {
        // Add mobile menu toggle functionality
        const header = document.getElementById('header');
        if (header) {
            const mobileMenuBtn = document.createElement('button');
            mobileMenuBtn.className = 'mobile-menu-toggle';
            mobileMenuBtn.innerHTML = '☰';
            mobileMenuBtn.style.cssText = `
                display: none;
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: var(--primary-color);
            `;

            const nav = header.querySelector('.main-nav');
            if (nav) {
                nav.parentNode.insertBefore(mobileMenuBtn, nav);

                mobileMenuBtn.addEventListener('click', () => {
                    nav.classList.toggle('mobile-open');
                });
            }
        }
    }

    initSmoothScroll() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    initNewsletter() {
        // Newsletter functionality is handled in handleNewsletter method
    }

    handleScroll() {
        const header = document.getElementById('header');
        if (header) {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    }

    async handleNewsletter(event) {
        event.preventDefault();
        
        const form = event.target;
        const email = form.querySelector('input[type="email"]').value;

        try {
            // In a real implementation, you'd call an API
            console.log('Newsletter subscription:', email);
            this.showNotification('Thank you for subscribing!', 'success');
            form.reset();
        } catch (error) {
            console.error('Newsletter subscription failed:', error);
            this.showNotification('Subscription failed. Please try again.', 'error');
        }
    }

    checkAuthStatus() {
        // Update UI based on authentication status
        if (window.apiService && window.apiService.isAuthenticated()) {
            const user = window.apiService.getCurrentUser();
            const loginBtn = document.getElementById('loginBtn');
            
            if (loginBtn && user) {
                loginBtn.textContent = `Hi, ${user.name}`;
                loginBtn.onclick = () => this.handleLogout();
            }
        }
    }

    async handleLogout() {
        try {
            if (window.apiService) {
                await window.apiService.logout();
                this.showNotification('Logged out successfully!', 'success');
                
                // Update UI
                const loginBtn = document.getElementById('loginBtn');
                if (loginBtn) {
                    loginBtn.textContent = 'Login';
                    loginBtn.onclick = () => {
                        if (window.authManager) {
                            window.authManager.showLoginModal();
                        }
                    };
                }
            }
        } catch (error) {
            console.error('Logout failed:', error);
            this.showNotification('Logout failed. Please try again.', 'error');
        }
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

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new DongareApp();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    .mobile-menu-toggle {
        display: none !important;
    }

    @media (max-width: 768px) {
        .mobile-menu-toggle {
            display: block !important;
        }

        .main-nav {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .main-nav.mobile-open {
            display: block;
        }

        .main-nav ul {
            flex-direction: column;
            padding: 1rem;
        }
    }

    .notification {
        animation: slideIn 0.3s ease;
    }

    .header.scrolled {
        box-shadow: 0 2px 20px rgba(0,0,0,0.1);
    }

    .cart-item {
        display: flex;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid #eee;
    }

    .cart-item-image img {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 5px;
        margin-right: 1rem;
    }

    .cart-item-details {
        flex: 1;
    }

    .cart-item-quantity {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin: 0 1rem;
    }

    .quantity-btn {
        width: 30px;
        height: 30px;
        border: 1px solid #ddd;
        background: white;
        border-radius: 3px;
        cursor: pointer;
    }

    .quantity-btn:hover {
        background: #f8f9fa;
    }

    .remove-btn {
        background: none;
        border: none;
        color: #dc3545;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0.5rem;
    }

    .remove-btn:hover {
        background: #f8f8f8;
        border-radius: 3px;
    }
`;
document.head.appendChild(style);
