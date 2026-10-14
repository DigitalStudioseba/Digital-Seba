/**
 * DIGITAL SEBA — Authentication Controller
 * Handles Firebase Authentication with Google Sign-In, Session Persistence,
 * and bilingual UI state management.
 *
 * Strict isolation: Does not touch Studio Cloud (tele.js) or Realtime Database.
 */

'use strict';

(function () {
  // ── Error dictionary for localized feedback
  const AUTH_ERRORS = {
    'auth/popup-closed-by-user': {
      en: 'Sign-in was cancelled before completion.',
      bn: 'সাইন-ইন সম্পন্ন করার আগেই উইন্ডো বন্ধ করা হয়েছে।'
    },
    'auth/popup-blocked': {
      en: 'The sign-in popup was blocked by your browser. Please allow popups for this site and try again.',
      bn: 'আপনার ব্রাউজার সাইন-ইন পপআপ ব্লক করেছে। অনুগ্রহ করে এই সাইটের পপআপ অনুমোদন করে আবার চেষ্টা করুন।'
    },
    'auth/cancelled-popup-request': {
      en: 'Another sign-in request is already in progress.',
      bn: 'আরেকটি সাইন-ইন প্রক্রিয়া ইতিমধ্যেই চলমান রয়েছে।'
    },
    'auth/network-request-failed': {
      en: 'Network connection failed. Please check your internet connection.',
      bn: 'নেটওয়ার্ক সংযোগে সমস্যা হয়েছে। আপনার ইন্টারনেট সংযোগ পরীক্ষা করুন।'
    },
    'auth/unauthorized-domain': {
      en: 'This domain is not authorized for Google Sign-In in Firebase Console.',
      bn: 'এই ডোমেনটি ফায়ারবেস কনসোলে অনুমোদিত নয়।'
    },
    'auth/operation-not-allowed': {
      en: 'Google Sign-In is not enabled in Firebase Console.',
      bn: 'গুগল সাইন-ইন ফায়ারবেস কনসোলে সক্রিয় করা নেই।'
    },
    'auth/user-disabled': {
      en: 'This user account has been disabled.',
      bn: 'এই ব্যবহারকারী অ্যাকাউন্টটি নিষ্ক্রিয় করা হয়েছে।'
    },
    'auth/invalid-api-key': {
      en: 'Invalid Firebase configuration or API key.',
      bn: 'ফায়ারবেস কনফিগারেশন বা এপিআই কী সঠিক নয়।'
    }
  };

  function getLang() {
    try {
      const stored = localStorage.getItem('ds_language');
      if (stored === 'bn' || stored === 'en') return stored;
    } catch (_) {}
    return document.documentElement.lang === 'bn' ? 'bn' : 'en';
  }

  function getFriendlyErrorMessage(err) {
    if (!err) return '';
    const code = err.code;
    const lang = getLang();
    if (code && AUTH_ERRORS[code]) {
      return AUTH_ERRORS[code][lang] || AUTH_ERRORS[code].en;
    }
    return lang === 'bn'
      ? (err.message || 'সাইন-ইন ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।')
      : (err.message || 'Authentication failed. Please try again.');
  }

  // ── Firebase Auth Module Definition
  let authInstance = null;
  let isSigningIn = false;

  function initAuth() {
    if (typeof firebase === 'undefined') {
      console.warn('Digital Seba Auth: Firebase SDK is not loaded.');
      return null;
    }

    if (!firebase.apps || firebase.apps.length === 0) {
      const config = (typeof window !== 'undefined' && window.FIREBASE_CONFIG) || {
        apiKey: "AIzaSyCbFoDXWceeNmTE34nph5BQGaWzrgU5jP4",
        authDomain: "digital-seba-92ae6.firebaseapp.com",
        projectId: "digital-seba-92ae6",
        storageBucket: "digital-seba-92ae6.firebasestorage.app",
        messagingSenderId: "201445991120",
        appId: "1:201445991120:web:c6d05f276c72957b605886"
      };
      try {
        firebase.initializeApp(config);
      } catch (e) {
        console.warn('Digital Seba Auth: initializeApp error:', e);
      }
    }

    if (typeof firebase.auth !== 'function') {
      console.warn('Digital Seba Auth: firebase.auth SDK is not loaded.');
      return null;
    }

    try {
      authInstance = firebase.auth();
      // Configure session persistence (scoped to current browser tab/session)
      authInstance.setPersistence(firebase.auth.Auth.Persistence.SESSION).catch((e) => {
        console.warn('Digital Seba Auth: setPersistence warning:', e);
      });
      return authInstance;
    } catch (e) {
      console.error('Digital Seba Auth: initialization failed:', e);
      return null;
    }
  }

  /**
   * Start Google Sign-In with popup
   */
  async function signInWithGoogle() {
    if (isSigningIn) return;
    const auth = authInstance || initAuth();
    if (!auth) {
      showError({ code: 'auth/sdk-not-loaded', message: 'Authentication service is unavailable. Please refresh the page.' });
      return;
    }

    isSigningIn = true;
    setLoadingState(true);
    clearError();

    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const result = await auth.signInWithPopup(provider);
      // Successful sign in: onAuthStateChanged will handle UI updates
      return result.user;
    } catch (error) {
      console.warn('Digital Seba Auth: sign-in error:', error);
      showError(error);
      throw error;
    } finally {
      isSigningIn = false;
      setLoadingState(false);
    }
  }

  /**
   * Sign out current user
   */
  async function signOut() {
    const auth = authInstance || initAuth();
    if (!auth) return;

    setLoadingState(true);
    try {
      await auth.signOut();
      clearError();
    } catch (error) {
      console.warn('Digital Seba Auth: sign-out error:', error);
      showError(error);
    } finally {
      setLoadingState(false);
    }
  }

  // ── UI Controller for /login/ page
  function setLoadingState(loading) {
    const btnLogin = document.getElementById('btn-google-login');
    const spinner = document.getElementById('auth-spinner');
    const btnText = document.getElementById('btn-google-text');

    if (btnLogin) {
      btnLogin.disabled = loading;
      btnLogin.setAttribute('aria-busy', String(loading));
    }
    if (spinner) {
      spinner.classList.toggle('active', loading);
    }
    if (btnText) {
      btnText.style.opacity = loading ? '0.5' : '1';
    }
  }

  function showError(err) {
    const errorBox = document.getElementById('auth-error-alert');
    const errorMsg = document.getElementById('auth-error-message');
    if (!errorBox || !errorMsg) return;

    const message = getFriendlyErrorMessage(err);
    errorMsg.textContent = message;
    errorBox.classList.remove('hidden');
    errorBox.setAttribute('role', 'alert');
  }

  function clearError() {
    const errorBox = document.getElementById('auth-error-alert');
    const errorMsg = document.getElementById('auth-error-message');
    if (errorBox) errorBox.classList.add('hidden');
    if (errorMsg) errorMsg.textContent = '';
  }

  function renderUserState(user) {
    const unauthedView = document.getElementById('auth-unauthed-view');
    const authedView = document.getElementById('auth-authed-view');
    const initialLoading = document.getElementById('auth-initial-loading');

    if (initialLoading) {
      initialLoading.classList.add('hidden');
    }

    if (user) {
      // Authenticated state
      if (unauthedView) unauthedView.classList.add('hidden');
      if (authedView) authedView.classList.remove('hidden');

      const nameEl = document.getElementById('user-display-name');
      const emailEl = document.getElementById('user-email');
      const avatarEl = document.getElementById('user-avatar');
      const fallbackEl = document.getElementById('user-avatar-fallback');
      const dateEl = document.getElementById('user-member-since');

      const displayName = user.displayName || user.email.split('@')[0] || 'User';
      if (nameEl) nameEl.textContent = displayName;
      if (emailEl) emailEl.textContent = user.email || '';

      if (avatarEl && fallbackEl) {
        if (user.photoURL) {
          avatarEl.src = user.photoURL;
          avatarEl.alt = displayName;
          avatarEl.classList.remove('hidden');
          fallbackEl.classList.add('hidden');
          avatarEl.onerror = function () {
            avatarEl.classList.add('hidden');
            fallbackEl.classList.remove('hidden');
            fallbackEl.textContent = (displayName[0] || 'U').toUpperCase();
          };
        } else {
          avatarEl.classList.add('hidden');
          fallbackEl.classList.remove('hidden');
          fallbackEl.textContent = (displayName[0] || 'U').toUpperCase();
        }
      }

      if (dateEl && user.metadata && user.metadata.creationTime) {
        try {
          const d = new Date(user.metadata.creationTime);
          const lang = getLang();
          dateEl.textContent = d.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
        } catch (_) {}
      }
    } else {
      // Unauthenticated state
      if (authedView) authedView.classList.add('hidden');
      if (unauthedView) unauthedView.classList.remove('hidden');
    }
  }

  // ── DOM Wiring
  function wireEvents() {
    const btnLogin = document.getElementById('btn-google-login');
    if (btnLogin) {
      btnLogin.addEventListener('click', (e) => {
        e.preventDefault();
        signInWithGoogle().catch(() => {});
      });
    }

    const btnSignOut = document.getElementById('btn-auth-signout');
    if (btnSignOut) {
      btnSignOut.addEventListener('click', (e) => {
        e.preventDefault();
        signOut();
      });
    }

    const btnDismissError = document.getElementById('auth-error-dismiss');
    if (btnDismissError) {
      btnDismissError.addEventListener('click', () => {
        clearError();
      });
    }

    // React to language toggle dynamically
    window.addEventListener('languageChanged', () => {
      const auth = authInstance;
      if (auth && auth.currentUser) {
        renderUserState(auth.currentUser);
      }
    });
  }

  // ── Startup
  document.addEventListener('DOMContentLoaded', () => {
    wireEvents();
    const auth = initAuth();
    if (auth) {
      auth.onAuthStateChanged((user) => {
        renderUserState(user);
      });
    } else {
      renderUserState(null);
    }
  });

  // Export public API
  window.DSAuth = {
    signInWithGoogle,
    signOut,
    getUser: () => (authInstance ? authInstance.currentUser : null),
    init: initAuth
  };
})();

