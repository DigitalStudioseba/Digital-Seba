/**
 * DIGITAL SEBA - Main Application Module
 * Core application logic and initialization
 * Author: Monir Hossain
 */

'use strict';

const App = (() => {
  const VERSION = '1.0.0';

  // Security: Input sanitization
  const sanitizeInput = (input) => {
    if (typeof input !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  };

  // Security: Validate email
  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  // Security: Validate phone (BD)
  const validatePhone = (phone) => {
    const re = /^(\+880|880|0)[1][3-9]\d{8}$/;
    return re.test(phone.replace(/\s/g, ''));
  };

  // Format number with commas
  const formatNumber = (num) => {
    return num.toLocaleString('en-BD');
  };

  // Format date
  const formatDate = (date, lang = 'en') => {
    const d = new Date(date);
    if (lang === 'bn') {
      return d.toLocaleDateString('bn-BD', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return d.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Debounce utility
  const debounce = (fn, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  // Throttle utility
  const throttle = (fn, limit) => {
    let inThrottle;
    return (...args) => {
      if (!inThrottle) {
        fn(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };

  // Copy to clipboard
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      // Fallback
      const el = document.createElement('textarea');
      el.value = text;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      return true;
    }
  };

  // Download file
  const downloadFile = (content, filename, type = 'text/plain') => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Generate unique ID
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  };

  // Get URL parameter
  const getParam = (key) => {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
  };

  // Update URL without reload
  const updateURL = (params) => {
    const url = new URL(window.location);
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        url.searchParams.delete(key);
      } else {
        url.searchParams.set(key, value);
      }
    });
    history.pushState({}, '', url);
  };

  // Local storage with error handling
  const storage = {
    get: (key, defaultValue = null) => {
      try {
        const val = localStorage.getItem(key);
        return val !== null ? JSON.parse(val) : defaultValue;
      } catch (e) {
        return defaultValue;
      }
    },
    set: (key, value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        return false;
      }
    },
    remove: (key) => {
      try {
        localStorage.removeItem(key);
      } catch (e) {}
    }
  };

  // Session storage
  const session = {
    get: (key, defaultValue = null) => {
      try {
        const val = sessionStorage.getItem(key);
        return val !== null ? JSON.parse(val) : defaultValue;
      } catch (e) {
        return defaultValue;
      }
    },
    set: (key, value) => {
      try {
        sessionStorage.setItem(key, JSON.stringify(value));
      } catch (e) {}
    }
  };

  // Load image with error fallback
  const loadImage = (src, fallback = '') => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(src);
      img.onerror = () => resolve(fallback);
      img.src = src;
    });
  };

  // Lazy load images
  const setupLazyImages = () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      observer.observe(img);
    });
  };

  // Service Worker registration
  const registerSW = () => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(reg => console.log('SW registered'))
          .catch(err => console.log('SW registration failed'));
      });
    }
  };

  // Analytics (placeholder)
  const track = (event, data = {}) => {
    try {
      if (typeof firebase !== 'undefined' && firebase.analytics) {
        firebase.analytics().logEvent(event, data);
      }
    } catch (e) {}
  };

  // Check network status
  const setupNetworkDetection = () => {
    const showOffline = () => {
      Toast.show('⚠️ You are offline. Some features may not work.', 'warning', 5000);
    };

    const showOnline = () => {
      Toast.show('✅ You are back online!', 'success', 3000);
    };

    window.addEventListener('offline', showOffline);
    window.addEventListener('online', showOnline);
  };

  // Keyboard shortcuts
  const setupKeyboardShortcuts = () => {
    document.addEventListener('keydown', (e) => {
      // Escape to close modals
      if (e.key === 'Escape') {
        const modal = document.querySelector('.modal-overlay.active');
        if (modal) {
          modal.classList.remove('active');
        }
      }

      // Ctrl+/ to toggle search focus
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        const search = document.getElementById('globalSearch');
        if (search) search.focus();
      }
    });
  };

  // Page visibility tracking
  const setupVisibilityTracking = () => {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        // Refresh data if needed
      }
    });
  };

  // Initialize all copy buttons
  const setupCopyButtons = () => {
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const text = btn.dataset.copy || btn.previousElementSibling?.textContent || '';
        const success = await copyToClipboard(text);
        if (success) {
          const originalText = btn.textContent;
          btn.textContent = '✅ Copied!';
          btn.classList.add('copied');
          setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove('copied');
          }, 2000);
        }
      });
    });
  };

  // Tab system
  const setupTabs = () => {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        const container = btn.closest('.tabs');
        if (!container) return;

        container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        container.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        const content = container.querySelector(`.tab-content[data-tab="${target}"]`);
        if (content) content.classList.add('active');
      });
    });
  };

  // Modal system
  const openModal = (modalId) => {
    const overlay = document.getElementById(modalId);
    if (overlay) {
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = (modalId) => {
    const overlay = document.getElementById(modalId);
    if (overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  const setupModals = () => {
    // Close on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });

    // Close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-overlay');
        if (modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });

    // Open triggers
    document.querySelectorAll('[data-modal]').forEach(trigger => {
      trigger.addEventListener('click', () => {
        openModal(trigger.dataset.modal);
      });
    });
  };

  // Breadcrumb auto-generate
  const setupBreadcrumb = () => {
    const breadcrumb = document.getElementById('autoBreadcrumb');
    if (!breadcrumb) return;

    const path = window.location.pathname.split('/').filter(Boolean);
    const items = [{ name: 'Home', url: '/index.html' }];

    let currentPath = '';
    path.forEach(segment => {
      currentPath += '/' + segment;
      const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ').replace('.html', '');
      items.push({ name, url: currentPath });
    });

    breadcrumb.innerHTML = items.map((item, i) => `
      <div class="breadcrumb-item ${i === items.length - 1 ? 'active' : ''}">
        ${i === items.length - 1
          ? `<span>${item.name}</span>`
          : `<a href="${item.url}">${item.name}</a>`
        }
      </div>
      ${i < items.length - 1 ? '<span class="breadcrumb-sep">›</span>' : ''}
    `).join('');
  };

  // Initialize the application
  const init = () => {
    setupLazyImages();
    setupNetworkDetection();
    setupKeyboardShortcuts();
    setupVisibilityTracking();
    setupCopyButtons();
    setupTabs();
    setupModals();
    setupBreadcrumb();

    console.log(`🚀 Digital Seba v${VERSION} initialized`);
    console.log('📍 Bangladesh\'s Smart Digital Service Platform');
    console.log('👤 Owner: Monir Hossain');
  };

  return {
    init,
    sanitizeInput,
    validateEmail,
    validatePhone,
    formatNumber,
    formatDate,
    formatFileSize,
    debounce,
    throttle,
    copyToClipboard,
    downloadFile,
    generateId,
    getParam,
    updateURL,
    storage,
    session,
    loadImage,
    openModal,
    closeModal,
    track,
    VERSION
  };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

// Export for global use
window.App = App;
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
        backToTop.style.display = "block";
    } else {
        backToTop.style.display = "none";
    }
});

backToTop.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});