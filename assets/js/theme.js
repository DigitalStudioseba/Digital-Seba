/**
 * DIGITAL SEBA - Theme Manager
 * Handles dark/light/auto theme switching
 * Author: Monir Hossain
 */

'use strict';

const ThemeManager = (() => {
  const STORAGE_KEY = 'ds_theme';
  const themes = ['dark', 'light', 'auto'];

  let currentTheme = 'dark';

  // Get system preference
  const getSystemTheme = () => {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  };

  // Apply theme to document
  const applyTheme = (theme) => {
    const resolvedTheme = theme === 'auto' ? getSystemTheme() : theme;
    document.documentElement.setAttribute('data-theme', resolvedTheme);

    // Update meta theme-color
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.content = resolvedTheme === 'dark' ? '#0F172A' : '#F8FAFC';
    }

    currentTheme = theme;
  };

  // Save theme preference
  const save = (theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {}
  };

  // Load saved theme
  const load = () => {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'dark';
    } catch (e) {
      return 'dark';
    }
  };

  // Toggle between dark and light
  const toggle = () => {
    const current = currentTheme === 'auto' ? getSystemTheme() : currentTheme;
    const next = current === 'dark' ? 'light' : 'dark';
    set(next);
  };

  // Set specific theme
  const set = (theme) => {
    if (!themes.includes(theme)) return;
    applyTheme(theme);
    save(theme);

    // Dispatch event
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme, resolved: theme === 'auto' ? getSystemTheme() : theme } }));
  };

  // Get current theme
  const get = () => currentTheme;

  // Initialize
  const init = () => {
    const saved = load();
    applyTheme(saved);

    // Theme toggle button
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', toggle);
    }

    // Listen for system theme changes (auto mode)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (currentTheme === 'auto') {
        applyTheme('auto');
      }
    });

    // Keyboard shortcut: Ctrl+Shift+T
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        toggle();
      }
    });
  };

  return { init, toggle, set, get, getSystemTheme };
})();

// Initialize immediately (before DOM for faster rendering)
ThemeManager.init();

window.ThemeManager = ThemeManager;
