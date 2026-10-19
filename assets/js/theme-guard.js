/**
 * DIGITAL SEBA — Theme Access Guard
 * Enforces authentication-based access control for non-Alpha themes and theme galleries.
 *
 * Rules:
 * 1. Logged-out visitors may only access the Alpha theme (main homepage).
 * 2. Any direct URL access to non-Alpha themes or theme selectors by logged-out
 *    visitors is immediately redirected to the Alpha homepage with an auth notice.
 * 3. Authenticated users are permitted access according to their profile settings.
 */

(function () {
  'use strict';
  if (typeof window !== 'undefined') window.__dsThemeGuardLoaded = true;

  function isUserAuthenticated() {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('firebase:authUser:')) {
          const raw = localStorage.getItem(k);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && parsed.uid) {
              return true;
            }
          }
        }
      }
    } catch (_) {}
    return false;
  }

  function getAlphaHomeUrl(authRequired) {
    var query = authRequired ? '?auth_required=theme' : '';
    try {
      if (window.location.protocol === 'file:') {
        var path = window.location.pathname.replace(/\\/g, '/');
        var idx = path.indexOf('/homepage-themes/');
        if (idx !== -1) {
          var rel = path.substring(idx + 1);
          var slashes = (rel.match(/\//g) || []).length;
          var prefix = '';
          for (var i = 0; i < slashes; i++) {
            prefix += '../';
          }
          return prefix + 'index.html' + query;
        }
        if (path.indexOf('/theme-selector/') !== -1) {
          return '../index.html' + query;
        }
        if (path.indexOf('/portal/') !== -1) {
          return '../index.html' + query;
        }
      }
    } catch (_) {}
    return '/' + query;
  }

  function isIntentionalLogout() {
    try {
      if (sessionStorage.getItem('ds_logout_in_progress') === '1') {
        sessionStorage.removeItem('ds_logout_in_progress');
        return true;
      }
    } catch (_) {}
    return false;
  }

  // Hide any floating theme switcher on non-Alpha themes
  try {
    var hideSwitcher = function() {
      var style = document.createElement('style');
      style.id = 'ds-hide-switcher-guard';
      style.textContent = '#ds-theme-switcher { display: none !important; }';
      (document.head || document.documentElement).appendChild(style);
      var el = document.getElementById('ds-theme-switcher');
      if (el) el.style.setProperty('display', 'none', 'important');
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', hideSwitcher);
    } else {
      hideSwitcher();
    }
  } catch (_) {}

  // 1. Immediate synchronous guard check for unauthenticated access
  if (!isUserAuthenticated()) {
    var isLogout = isIntentionalLogout();
    var target = getAlphaHomeUrl(!isLogout);
    try {
      if (window.top && window.top !== window.self) {
        window.top.location.replace(target);
      } else {
        window.location.replace(target);
      }
    } catch (_) {
      window.location.replace(target);
    }
    return;
  }

  // 2. Direct theme URL handling for authenticated users (route top-window access through /portal/)
  try {
    var path = window.location.pathname.replace(/\\/g, '/');
    if (path.indexOf('/homepage-themes/') !== -1) {
      if (window.top && window.top !== window.self) {
        // Theme is safely executing inside portal iframe. Render normally.
      } else {
        // Direct top-window access to non-Alpha theme: route through portal frame
        var match = path.match(/\/homepage-themes\/([^\/]+)/);
        var currentThemeId = match ? match[1] : null;
        var forbiddenThemes = ['theme-nexus', 'theme-horizon', 'theme-vertex', 'theme-aero', 'theme-flux', 'theme-neon', 'theme-ignite'];

        if (currentThemeId && forbiddenThemes.indexOf(currentThemeId) === -1) {
          try {
            localStorage.setItem('activeTheme', currentThemeId);
          } catch (_) {}
        }

        var portalUrl = '/portal/index.html';
        if (window.location.protocol === 'file:') {
          var rel = path.substring(path.indexOf('/homepage-themes/') + 1);
          var slashes = (rel.match(/\//g) || []).length;
          var prefix = '';
          for (var i = 0; i < slashes; i++) {
            prefix += '../';
          }
          portalUrl = prefix + 'portal/index.html';
        }

        window.location.replace(portalUrl);
        return;
      }
    }
  } catch (_) {}

  // 3. Secondary verification if Firebase SDK is present on the page
  if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', function () {
      if (typeof firebase !== 'undefined' && typeof firebase.auth === 'function') {
        try {
          firebase.auth().onAuthStateChanged(function (user) {
            if (!user) {
              var isLogout = isIntentionalLogout();
              var target = getAlphaHomeUrl(!isLogout);
              try {
                if (window.top && window.top !== window.self) {
                  window.top.location.replace(target);
                } else {
                  window.location.replace(target);
                }
              } catch (_) {
                window.location.replace(target);
              }
            }
          });
        } catch (_) {}
      }
    });
  }
})();
