/**
 * DIGITAL SEBA - Authentication Module
 * Handles user authentication state management
 * Author: Monir Hossain
 *
 * RESERVED / NOT CURRENTLY LOADED: Login & Register were removed from the
 * live site. This file is kept as ready-to-wire scaffolding for when
 * authentication is reintroduced — it is not <script>-included anywhere
 * right now, so it has no effect on the current build.
 */

'use strict';

const Auth = (() => {
  let currentUser = null;

  // DOM elements
  const authButtons = document.getElementById('authButtons');
  const userMenu = document.getElementById('userMenu');
  const userDisplayName = document.getElementById('userDisplayName');
  const userEmailDisplay = document.getElementById('userEmailDisplay');
  const userAvatarNav = document.getElementById('userAvatarNav');
  const userAvatarDropdown = document.getElementById('userAvatarDropdown');
  const logoutBtn = document.getElementById('logoutBtn');

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Update UI based on auth state
  const updateUI = (user) => {
    currentUser = user;

    if (user) {
      // User is logged in
      if (authButtons) authButtons.classList.add('hidden');
      if (userMenu) userMenu.classList.remove('hidden');

      const displayName = user.displayName || user.email?.split('@')[0] || 'User';
      const initials = getInitials(displayName);

      if (userDisplayName) userDisplayName.textContent = displayName;
      if (userEmailDisplay) userEmailDisplay.textContent = user.email || '';

      // Set avatar
      if (userAvatarNav) {
        if (user.photoURL) {
          userAvatarNav.innerHTML = `<img src="${sanitize(user.photoURL)}" alt="Profile" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
        } else {
          userAvatarNav.textContent = initials;
        }
      }

      if (userAvatarDropdown) {
        if (user.photoURL) {
          userAvatarDropdown.innerHTML = `<img src="${sanitize(user.photoURL)}" alt="Profile" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
        } else {
          userAvatarDropdown.textContent = initials;
        }
      }

      // Save user to localStorage for quick access
      try {
        localStorage.setItem('ds_user', JSON.stringify({
          uid: user.uid,
          displayName: displayName,
          email: user.email,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified
        }));
      } catch (e) {}

    } else {
      // User is logged out
      if (authButtons) authButtons.classList.remove('hidden');
      if (userMenu) userMenu.classList.add('hidden');

      try {
        localStorage.removeItem('ds_user');
      } catch (e) {}
    }

    // Dispatch event for other modules
    window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { user } }));
  };

  // Sanitize HTML to prevent XSS
  const sanitize = (str) => {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  };

  // Logout handler
  const logout = async () => {
    try {
      if (typeof firebase !== 'undefined' && window.auth) {
        await window.auth.signOut();
      }
      updateUI(null);
      Toast.show('Logged out successfully', 'success');

      // Redirect if on protected page
      const protectedPages = ['dashboard', 'profile', 'settings', 'admin'];
      const currentPath = window.location.pathname;
      const isProtected = protectedPages.some(p => currentPath.includes(p));
      if (isProtected) {
        setTimeout(() => {
          window.location.href = '/index.html';
        }, 800);
      }
    } catch (e) {
      Toast.show('Logout failed. Please try again.', 'error');
    }
  };

  // Check if user is logged in (from localStorage for instant UI)
  const quickCheck = () => {
    try {
      const saved = localStorage.getItem('ds_user');
      if (saved) {
        const user = JSON.parse(saved);
        updateUI(user);
      }
    } catch (e) {}
  };

  // Require authentication - redirect if not logged in
  const requireAuth = (redirectTo = '/pages/auth/login.html') => {
    return new Promise((resolve) => {
      try {
        const saved = localStorage.getItem('ds_user');
        if (!saved) {
          window.location.href = redirectTo;
          return;
        }

        if (typeof firebase !== 'undefined' && window.auth) {
          window.auth.onAuthStateChanged((user) => {
            if (user) {
              resolve(user);
            } else {
              window.location.href = redirectTo;
            }
          });
        } else {
          // Offline mode - use localStorage
          const user = JSON.parse(saved);
          resolve(user);
        }
      } catch (e) {
        window.location.href = redirectTo;
      }
    });
  };

  // Get current user
  const getUser = () => currentUser;

  // Get user from localStorage
  const getCachedUser = () => {
    try {
      const saved = localStorage.getItem('ds_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  };

  // Initialize
  const init = () => {
    // Quick UI update from localStorage
    quickCheck();

    // Logout button
    if (logoutBtn) {
      logoutBtn.addEventListener('click', logout);
    }

    // Firebase auth state listener
    try {
      if (typeof firebase !== 'undefined' && window.auth) {
        window.auth.onAuthStateChanged((user) => {
          updateUI(user);
        });
      }
    } catch (e) {}

    // Protect pages with [data-require-auth] attribute
    const requireAuthEl = document.querySelector('[data-require-auth]');
    if (requireAuthEl) {
      requireAuth();
    }
  };

  return { init, logout, getUser, getCachedUser, requireAuth, updateUI, sanitize, getInitials };
})();

// Toast notification system
const Toast = (() => {
  const container = document.getElementById('toastContainer');

  const show = (message, type = 'info', duration = 4000) => {
    if (!container) return;

    const icons = {
      success: '✅',
      error: '❌',
      info: 'ℹ️',
      warning: '⚠️'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span>${icons[type] || icons.info}</span>
      <span>${Auth.sanitize ? Auth.sanitize(message) : message}</span>
    `;

    container.appendChild(toast);

    // Auto remove
    setTimeout(() => {
      toast.classList.add('hiding');
      setTimeout(() => toast.remove(), 300);
    }, duration);

    // Click to remove
    toast.addEventListener('click', () => {
      toast.classList.add('hiding');
      setTimeout(() => toast.remove(), 300);
    });
  };

  return { show };
})();

// Initialize auth when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  Auth.init();
});

// Export for global use
window.Auth = Auth;
window.Toast = Toast;
