// Authentication Module for Dongare Fashion
class AuthManager {
    constructor() {
        this.apiService = window.apiService;
        this.initEventListeners();
    }

    initEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Login button
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.showLoginModal());
        }
    }

    async handleLogin(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        const credentials = {
            email: formData.get('email') || form.email.value,
            password: formData.get('password') || form.password.value
        };

        try {
            const result = await this.apiService.login(credentials);
            this.showSuccess('Login successful!');
            
            // Redirect or update UI
            if (window.location.pathname === '/login.html') {
                window.location.href = 'index.html';
            } else {
                this.updateAuthUI();
                this.closeLoginModal();
            }
        } catch (error) {
            this.showError(error.message);
        }
    }

    async handleRegister(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        
        const userData = {
            username: formData.get('username') || form.username.value,
            full_name: formData.get('fullName') || form.fullName.value,
            email: formData.get('email') || form.email.value,
            phone: formData.get('phone') || form.phone.value,
            password: formData.get('password') || form.password.value
        };

        // Validate passwords match
        const confirmPassword = formData.get('confirmPassword') || form.confirmPassword.value;
        if (userData.password !== confirmPassword) {
            this.showError('Passwords do not match');
            return;
        }

        try {
            const result = await this.apiService.register(userData);
            this.showSuccess('Registration successful! Please login.');
            
            // Redirect to login
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } catch (error) {
            this.showError(error.message);
        }
    }

    showLoginModal() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.style.display = 'block';
        }
    }

    closeLoginModal() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    showRegisterModal() {
        // This would show a register modal or redirect
        window.location.href = 'register.html';
    }

    updateAuthUI() {
        const loginBtn = document.getElementById('loginBtn');
        const user = this.apiService.getCurrentUser();
        
        if (loginBtn && user) {
            loginBtn.textContent = `Hi, ${user.name}`;
            loginBtn.onclick = () => this.handleLogout();
        }
    }

    async handleLogout() {
        try {
            await this.apiService.logout();
            this.showSuccess('Logged out successfully!');
            
            // Update UI
            const loginBtn = document.getElementById('loginBtn');
            if (loginBtn) {
                loginBtn.textContent = 'Login';
                loginBtn.onclick = () => this.showLoginModal();
            }
        } catch (error) {
            this.showError(error.message);
        }
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        // Create notification element
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

        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Check if user is logged in on page load
    checkAuthStatus() {
        if (this.apiService.isAuthenticated()) {
            this.updateAuthUI();
        }
    }
}

// Initialize auth manager
const authManager = new AuthManager();

// Check auth status on page load
document.addEventListener('DOMContentLoaded', () => {
    authManager.checkAuthStatus();
});
