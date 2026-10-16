/**
 * DIGITAL SEBA — Authentication & Profile Controller
 * Handles Firebase Authentication with Google Sign-In, Session Persistence,
 * Universal Header Synchronization, and Profile Management (/profile/).
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
    } catch (err) { console.error('[DEBUG_RENDER_ERR]', err); }
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
  let activeUser = null;
  let unauthedRedirectTimer = null;

  function getCurrentUser() {
    return activeUser || (authInstance ? authInstance.currentUser : null);
  }

  function initAuth() {
    if (typeof firebase === 'undefined') {
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
        console.warn('Digital Seba Auth: initializeApp notice:', e);
      }
    }

    if (typeof firebase.auth !== 'function') {
      return null;
    }

    try {
      authInstance = firebase.auth();
      // Configure session persistence
      authInstance.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(() => {
        authInstance.setPersistence(firebase.auth.Auth.Persistence.SESSION).catch(() => {});
      });
      return authInstance;
    } catch (e) {
      console.error('Digital Seba Auth initialization failed:', e);
      return null;
    }
  }

  /**
   * Helper: Get safe redirect target from query parameter
   */
  function getSafeRedirectUrl() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const target = urlParams.get('redirect');
      if (target && target.startsWith('/') && !target.startsWith('//')) {
        return target;
      }
    } catch (_) {}
    return null;
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
      const user = result.user;
      console.log('[DS-AUTH:AUTH-ACCOUNT] Firebase Authentication sign-in successful for:', user.email, 'UID:', user.uid);

      // Immediately ensure user is recorded in Firestore before redirection
      try {
        await ensureUserProfileDoc(user);
      } catch (profileErr) {
        console.warn('[DS-AUTH:FIRESTORE-PROFILE] Profile sync notice during sign-in:', profileErr);
      }

      // Check redirect param
      const redirectUrl = getSafeRedirectUrl();
      if (redirectUrl) {
        window.location.href = redirectUrl;
        return user;
      }

      return user;
    } catch (error) {
      console.warn('Digital Seba Auth: sign-in notice:', error);
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
      if (activeUser) {
        try { sessionStorage.removeItem('ds_role_' + activeUser.uid); } catch (_) {}
      }
      activeUser = null;
      await auth.signOut();
      clearError();
      // If on profile or admin page, redirect cleanly
      if (window.location.pathname.includes('/profile') || window.location.pathname.includes('/admin')) {
        window.location.href = '../login/';
      }
    } catch (error) {
      console.warn('Digital Seba Auth: sign-out notice:', error);
      showError(error);
    } finally {
      setLoadingState(false);
    }
  }

  // Helper: Get environment-aware URLs
  function getProfileUrl() {
    return window.location.protocol === 'file:' ? '../profile/index.html' : '/profile/';
  }
  function getServicesUrl() {
    return window.location.protocol === 'file:' ? '../services/index.html' : '/services/index.html';
  }
  function getAdminUrl() {
    return window.location.protocol === 'file:' ? '../admin/index.html' : '/admin/';
  }

  function getUserPhoto(user) {
    if (!user) return null;
    try {
      const custom = localStorage.getItem('ds_profile_photo_' + user.uid);
      if (custom) return custom;
    } catch (_) {}
    return user.customPhotoURL || user.photoURL || null;
  }

  function getUserName(user) {
    if (!user) return 'User';
    try {
      const customName = localStorage.getItem('ds_profile_name_' + user.uid);
      if (customName) return customName;
    } catch (_) {}
    return user.displayName || (user.email ? user.email.split('@')[0] : 'User');
  }

  function resizeImageToDataUrl(file, maxWidth = 256, maxHeight = 256, quality = 0.88) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const img = new Image();
        img.onerror = reject;
        img.onload = () => {
          const width = img.width;
          const height = img.height;
          const minDim = Math.min(width, height);
          const startX = (width - minDim) / 2;
          const startY = (height - minDim) / 2;

          const canvas = document.createElement('canvas');
          canvas.width = Math.min(minDim, maxWidth);
          canvas.height = Math.min(minDim, maxHeight);

          const ctx = canvas.getContext('2d');
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, canvas.width, canvas.height);

          let dataUrl = canvas.toDataURL('image/webp', quality);
          if (!dataUrl || dataUrl.indexOf('image/webp') === -1) {
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }
          resolve(dataUrl);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  /**
   * Helper: Get or initialize Firestore database instance
   */
  function getDb() {
    if (typeof window !== 'undefined' && window.db) return window.db;
    if (typeof firebase !== 'undefined' && typeof firebase.firestore === 'function') {
      try {
        window.db = firebase.firestore();
        return window.db;
      } catch (e) {
        console.warn('[DS-AUTH:FIRESTORE-INIT] Notice:', e);
      }
    }
    return null;
  }

  /**
   * Ensure user document exists in Firestore ('users' collection)
   */
  async function ensureUserProfileDoc(user) {
    if (!user || !user.uid) return null;
    const db = getDb();
    if (!db || typeof db.collection !== 'function') {
      console.warn('[DS-AUTH:FIRESTORE-PROFILE] Firestore SDK or database instance is not available on this page.');
      return null;
    }

    const isOwner = (user.email === 'digitalsebamail@gmail.com');
    const defaultRole = isOwner ? 'admin' : 'user';

    console.log('[DS-AUTH:FIRESTORE-PROFILE] Synchronizing user profile to Firestore for UID:', user.uid, '(' + (user.email || 'no-email') + ')');

    try {
      const userRef = db.collection('users').doc(user.uid);
      const doc = await userRef.get();

      const baseDoc = {
        email: user.email || null,
        lastLoginAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      if (!doc.exists) {
        console.log('[DS-AUTH:FIRESTORE-PROFILE] New user detected. Creating initial profile in "users/' + user.uid + '"');
        baseDoc.uid = user.uid;
        baseDoc.displayName = user.displayName || (user.email ? user.email.split('@')[0] : 'User');
        baseDoc.photoURL = user.photoURL || null;
        baseDoc.role = defaultRole;
        baseDoc.status = 'active';
        baseDoc.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      } else {
        console.log('[DS-AUTH:FIRESTORE-PROFILE] Existing user profile found in Firestore for UID:', user.uid);
      }

      await userRef.set(baseDoc, { merge: true });
      console.log('[DS-AUTH:FIRESTORE-PROFILE] Successfully synchronized user record to Firestore for UID:', user.uid);

      if (isOwner) {
        await db.collection('admins').doc(user.uid).set({
          uid: user.uid,
          email: user.email,
          role: 'admin',
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        console.log('[DS-AUTH:FIRESTORE-PROFILE] Owner admin document synchronized in "admins/' + user.uid + '"');
      }

      return {
        exists: doc.exists,
        data: doc.exists ? doc.data() : baseDoc
      };
    } catch (err) {
      console.warn('[DS-AUTH:FIRESTORE-PROFILE] FAILED to synchronize user profile to Firestore:', {
        uid: user.uid,
        code: err.code || 'unknown',
        message: err.message || String(err)
      });
      return null;
    }
  }

  async function checkAdminStatus(user) {
    if (!user) return false;
    console.log('[DS-AUTH:ADMIN-AUTH] Checking admin status for:', user.email, 'UID:', user.uid);

    // Official Owner Email Bootstrap Check
    if (user.email === 'digitalsebamail@gmail.com') {
      try { sessionStorage.setItem('ds_role_' + user.uid, 'admin'); } catch (_) {}
      console.log('[DS-AUTH:ADMIN-AUTH] Decision for', user.email, '=> isAdmin: true (Superadmin bootstrap match)');
      return true;
    }

    let cached = null;
    try {
      cached = sessionStorage.getItem('ds_role_' + user.uid);
    } catch (_) {}

    const db = getDb();
    if (db && typeof db.collection === 'function') {
      try {
        const adminDoc = await db.collection('admins').doc(user.uid).get();
        if (adminDoc.exists && adminDoc.data().role === 'admin') {
          try { sessionStorage.setItem('ds_role_' + user.uid, 'admin'); } catch (_) {}
          console.log('[DS-AUTH:ADMIN-AUTH] Decision for', user.email, '=> isAdmin: true (Firestore admins document match)');
          return true;
        }

        const userDoc = await db.collection('users').doc(user.uid).get();
        if (userDoc.exists && userDoc.data().role === 'admin') {
          try { sessionStorage.setItem('ds_role_' + user.uid, 'admin'); } catch (_) {}
          console.log('[DS-AUTH:ADMIN-AUTH] Decision for', user.email, '=> isAdmin: true (Firestore users document role match)');
          return true;
        }
      } catch (err) {
        console.warn('[DS-AUTH:ADMIN-AUTH] Error checking admin collections in Firestore:', err.code, err.message);
        try { sessionStorage.setItem('ds_role_' + user.uid, 'user'); } catch (_) {}
        console.log('[DS-AUTH:ADMIN-AUTH] Decision for', user.email, '=> isAdmin: false (Firestore read error / fallback)');
        return false;
      }
    }

    const isCachedAdmin = (cached === 'admin');
    console.log('[DS-AUTH:ADMIN-AUTH] Decision for', user.email, '=> isAdmin:', isCachedAdmin, '(Session cache fallback)');
    return isCachedAdmin;
  }

  function ensureHeaderUserMenu(container) {
    if (container.querySelector('#headerUserMenu')) return;
    const profileUrl = getProfileUrl();
    const servicesUrl = getServicesUrl();

    const menuHtml = `
      <div class="user-menu-container" id="headerUserMenu">
        <button class="user-menu-btn" id="headerUserMenuBtn" aria-expanded="false" aria-haspopup="true" aria-label="Open user menu">
          <img class="user-avatar-thumb hidden" id="headerUserAvatar" src="" alt="Profile">
          <div class="user-initial-thumb" id="headerUserInitial">U</div>
          <span class="user-menu-name" id="headerUserName">User</span>
          <svg class="user-menu-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="m6 9 6 6 6-6"></path>
          </svg>
        </button>
        <div class="user-dropdown" id="headerUserDropdown" role="menu">
          <div class="user-dropdown-header">
            <img class="user-avatar-thumb hidden" id="dropdownUserAvatar" src="" alt="Profile">
            <div class="user-initial-thumb" id="dropdownUserInitial">U</div>
            <div class="user-dropdown-info">
              <div class="user-dropdown-name" id="dropdownUserName">User</div>
              <div class="user-dropdown-email" id="dropdownUserEmail">user@example.com</div>
            </div>
          </div>
          <a href="${profileUrl}" class="user-dropdown-item" role="menuitem">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span data-en="My Profile" data-bn="আমার প্রোফাইল">My Profile</span>
          </a>
          <a href="${servicesUrl}" class="user-dropdown-item" role="menuitem">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            <span data-en="All Services" data-bn="সকল সেবা">All Services</span>
          </a>
          <a href="${getAdminUrl()}" class="user-dropdown-item admin-dropdown-link hidden" id="dropdownAdminLink" role="menuitem">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            <span data-en="Admin Dashboard" data-bn="অ্যাডমিন ড্যাশবোর্ড">Admin Dashboard</span>
          </a>
          <button type="button" class="user-dropdown-item signout-item" id="headerSignOutBtn" role="menuitem">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span data-en="Sign Out" data-bn="লগআউট">Sign Out</span>
          </button>
        </div>
      </div>
    `;
    const loggedInDiv = document.createElement('div');
    loggedInDiv.className = 'auth-logged-in';
    loggedInDiv.style.display = 'flex';
    loggedInDiv.innerHTML = menuHtml;
    container.appendChild(loggedInDiv);
    wireHeaderDropdown();
  }

  function ensureMobileUserCard(container) {
    if (container.querySelector('.mobile-user-card')) return;
    const profileUrl = getProfileUrl();

    const cardHtml = `
      <div class="mobile-user-card">
        <div class="mobile-user-header">
          <img class="user-avatar-thumb hidden" id="mobileUserAvatar" src="" alt="Profile">
          <div class="user-initial-thumb" id="mobileUserInitial">U</div>
          <div style="min-width:0;flex:1;">
            <div class="mobile-user-name" id="mobileUserName">User</div>
            <div class="mobile-user-email" id="mobileUserEmail">user@example.com</div>
          </div>
        </div>
        <div class="mobile-user-actions">
          <a href="${profileUrl}" class="mobile-btn-profile">
            <span data-en="👤 My Profile" data-bn="👤 আমার প্রোফাইল">👤 My Profile</span>
          </a>
          <a href="${getAdminUrl()}" class="mobile-btn-profile mobile-btn-admin hidden" id="mobileAdminLink">
            <span data-en="⚙️ Admin Dashboard" data-bn="⚙️ অ্যাডমিন ড্যাশবোর্ড">⚙️ Admin Dashboard</span>
          </a>
          <button type="button" class="mobile-btn-signout" id="mobileSignOutBtn">
            <span data-en="🚪 Sign Out" data-bn="🚪 লগআউট">🚪 Sign Out</span>
          </button>
        </div>
      </div>
    `;
    const loggedInDiv = document.createElement('div');
    loggedInDiv.className = 'mobile-logged-in';
    loggedInDiv.style.display = 'flex';
    loggedInDiv.innerHTML = cardHtml;
    container.appendChild(loggedInDiv);
    wireHeaderDropdown();
  }

  // ── Universal Header Authentication State Synchronization
  function updateHeaderAuthState(user) {
    // 1. Desktop Nav Auth Container
    const authLoggedOut = document.querySelectorAll('.auth-logged-out');
    const authLoggedIn = document.querySelectorAll('.auth-logged-in');

    authLoggedOut.forEach((el) => {
      el.style.display = user ? 'none' : 'flex';
    });

    authLoggedIn.forEach((el) => {
      el.style.display = user ? 'flex' : 'none';
    });

    const authContainers = document.querySelectorAll('.auth-buttons');
    authContainers.forEach((container) => {
      const loginBtn = container.querySelector('.btn-login, .nav-auth-login');
      const signupBtn = container.querySelector('.btn-signup, .nav-auth-signup');
      if (loginBtn && !container.querySelector('.auth-logged-out')) {
        loginBtn.style.display = user ? 'none' : '';
      }
      if (signupBtn && !container.querySelector('.auth-logged-out')) {
        signupBtn.style.display = user ? 'none' : '';
      }

      if (user && !container.querySelector('#headerUserMenu')) {
        ensureHeaderUserMenu(container);
      }
    });

    // 2. Mobile Nav Auth Container
    const mobileLoggedOut = document.querySelectorAll('.mobile-logged-out');
    const mobileLoggedIn = document.querySelectorAll('.mobile-logged-in');

    mobileLoggedOut.forEach((el) => {
      el.style.display = user ? 'none' : 'flex';
    });

    mobileLoggedIn.forEach((el) => {
      el.style.display = user ? 'flex' : 'none';
    });

    const mobileContainers = document.querySelectorAll('.mobile-auth');
    mobileContainers.forEach((container) => {
      const loginBtn = container.querySelector('.btn-login, .mobile-auth-login');
      const signupBtn = container.querySelector('.btn-signup, .mobile-auth-signup');
      if (loginBtn && !container.querySelector('.mobile-logged-out')) {
        loginBtn.style.display = user ? 'none' : '';
      }
      if (signupBtn && !container.querySelector('.mobile-logged-out')) {
        signupBtn.style.display = user ? 'none' : '';
      }

      if (user && !container.querySelector('.mobile-user-card')) {
        ensureMobileUserCard(container);
      }
    });

    if (user) {
      const displayName = getUserName(user);
      const photoURL = getUserPhoto(user);
      const initial = (displayName[0] || 'U').toUpperCase();

      // Desktop Avatar & Info
      const headerAvatars = document.querySelectorAll('#headerUserAvatar, #dropdownUserAvatar');
      const headerInitials = document.querySelectorAll('#headerUserInitial, #dropdownUserInitial');
      const headerNames = document.querySelectorAll('#headerUserName, #dropdownUserName');
      const headerEmails = document.querySelectorAll('#dropdownUserEmail');

      headerNames.forEach((el) => { el.textContent = displayName; });
      headerEmails.forEach((el) => { el.textContent = user.email || ''; });

      headerAvatars.forEach((avatar) => {
        if (photoURL) {
          avatar.src = photoURL;
          avatar.classList.remove('hidden');
          avatar.onerror = () => {
            avatar.classList.add('hidden');
            headerInitials.forEach((init) => {
              init.classList.remove('hidden');
              init.textContent = initial;
            });
          };
        } else {
          avatar.classList.add('hidden');
        }
      });

      headerInitials.forEach((init) => {
        init.textContent = initial;
        if (photoURL) {
          init.classList.add('hidden');
        } else {
          init.classList.remove('hidden');
        }
      });

      // Mobile Avatar & Info
      const mobileAvatar = document.getElementById('mobileUserAvatar');
      const mobileInitial = document.getElementById('mobileUserInitial');
      const mobileName = document.getElementById('mobileUserName');
      const mobileEmail = document.getElementById('mobileUserEmail');

      if (mobileName) mobileName.textContent = displayName;
      if (mobileEmail) mobileEmail.textContent = user.email || '';

      if (mobileAvatar && mobileInitial) {
        if (photoURL) {
          mobileAvatar.src = photoURL;
          mobileAvatar.classList.remove('hidden');
          mobileInitial.classList.add('hidden');
          mobileAvatar.onerror = () => {
            mobileAvatar.classList.add('hidden');
            mobileInitial.classList.remove('hidden');
            mobileInitial.textContent = initial;
          };
        } else {
          mobileAvatar.classList.add('hidden');
          mobileInitial.classList.remove('hidden');
          mobileInitial.textContent = initial;
        }
      }

      // Check Admin Privileges for Header Menu
      checkAdminStatus(user).then((isAdmin) => {
        const dropdownAdminLinks = document.querySelectorAll('#dropdownAdminLink');
        const mobileAdminLinks = document.querySelectorAll('#mobileAdminLink');
        dropdownAdminLinks.forEach(el => el.classList.toggle('hidden', !isAdmin));
        mobileAdminLinks.forEach(el => el.classList.toggle('hidden', !isAdmin));
      });
    }
  }

  // ── Header Dropdown Toggling & Outside Click
  function wireHeaderDropdown() {
    const userMenuBtn = document.getElementById('headerUserMenuBtn');
    const userDropdown = document.getElementById('headerUserDropdown');

    if (userMenuBtn && userDropdown) {
      userMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = userDropdown.classList.contains('active');
        userDropdown.classList.toggle('active', !isOpen);
        userMenuBtn.setAttribute('aria-expanded', String(!isOpen));
      });

      document.addEventListener('click', (e) => {
        if (!userMenuBtn.contains(e.target) && !userDropdown.contains(e.target)) {
          userDropdown.classList.remove('active');
          userMenuBtn.setAttribute('aria-expanded', 'false');
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          userDropdown.classList.remove('active');
          userMenuBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }

    const headerSignOutBtn = document.getElementById('headerSignOutBtn');
    if (headerSignOutBtn) {
      headerSignOutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        signOut();
      });
    }

    const mobileSignOutBtn = document.getElementById('mobileSignOutBtn');
    if (mobileSignOutBtn) {
      mobileSignOutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        signOut();
      });
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

  function renderLoginPage(user) {
    const unauthedView = document.getElementById('auth-unauthed-view');
    const authedView = document.getElementById('auth-authed-view');
    const initialLoading = document.getElementById('auth-initial-loading');

    if (initialLoading) {
      initialLoading.classList.add('hidden');
    }

    // Check if a redirect target is present
    const redirectUrl = getSafeRedirectUrl();
    if (user && redirectUrl) {
      window.location.href = redirectUrl;
      return;
    }

    if (user) {
      // Authenticated state on /login/
      if (unauthedView) unauthedView.classList.add('hidden');
      if (authedView) authedView.classList.remove('hidden');

      const nameEl = document.getElementById('user-display-name');
      const emailEl = document.getElementById('user-email');
      const avatarEl = document.getElementById('user-avatar');
      const fallbackEl = document.getElementById('user-avatar-fallback');
      const dateEl = document.getElementById('user-member-since');

      const displayName = user.displayName || (user.email ? user.email.split('@')[0] : 'User');
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
      // Unauthenticated state on /login/
      if (authedView) authedView.classList.add('hidden');
      if (unauthedView) unauthedView.classList.remove('hidden');
    }
  }

  // ── UI Controller for /profile/ page
  async function renderProfilePage(user) {
    const loadingEl = document.getElementById('profile-loading');
    const unauthedEl = document.getElementById('profile-unauthed');
    const contentEl = document.getElementById('profile-content');

    if (!loadingEl && !unauthedEl && !contentEl) return; // Not on profile page

    if (unauthedRedirectTimer) {
      clearTimeout(unauthedRedirectTimer);
      unauthedRedirectTimer = null;
    }

    if (loadingEl) loadingEl.classList.add('hidden');

    if (!user) {
      activeUser = null;
      // Unauthenticated guard
      if (contentEl) contentEl.classList.add('hidden');
      if (unauthedEl) unauthedEl.classList.remove('hidden');

      // Auto-redirect to login after short notice
      if (!window.__disableAutoRedirect && !window.location.search.includes('no_redirect=1')) {
        unauthedRedirectTimer = setTimeout(() => {
          if (!getCurrentUser()) {
            window.location.href = '../login/?redirect=/profile/';
          }
        }, 1200);
      }
      return;
    }

    activeUser = user;

    // Authenticated state
    if (unauthedEl) unauthedEl.classList.add('hidden');
    if (contentEl) contentEl.classList.remove('hidden');

    const displayName = getUserName(user);
    const photoURL = getUserPhoto(user);
    const initial = (displayName[0] || 'U').toUpperCase();
    const lang = getLang();

    // Top Header
    const titleName = document.getElementById('profile-title-name');
    const titleEmail = document.getElementById('profile-title-email');
    const avatarImg = document.getElementById('profile-avatar');
    const avatarFallback = document.getElementById('profile-avatar-fallback');

    if (titleName) titleName.textContent = displayName;
    if (titleEmail) titleEmail.textContent = user.email || '';

    if (avatarImg && avatarFallback) {
      if (photoURL) {
        avatarImg.src = photoURL;
        avatarImg.classList.remove('hidden');
        avatarFallback.classList.add('hidden');
        avatarImg.onerror = () => {
          avatarImg.classList.add('hidden');
          avatarFallback.classList.remove('hidden');
          avatarFallback.textContent = initial;
        };
      } else {
        avatarImg.classList.add('hidden');
        avatarFallback.classList.remove('hidden');
        avatarFallback.textContent = initial;
      }
    }

    // Permanent Unique User ID
    const fieldUidView = document.getElementById('field-uid-view');
    if (fieldUidView) {
      fieldUidView.textContent = user.uid;
    }

    // Role Badge & Admin Dashboard Button
    const badgeRole = document.getElementById('badge-role');
    const badgeRoleIcon = document.getElementById('badge-role-icon');
    const badgeRoleText = document.getElementById('badge-role-text');
    const btnAdminDash = document.getElementById('btn-admin-dashboard');

    try {
      const isAdmin = await checkAdminStatus(user);
      if (activeUser && user && activeUser.uid !== user.uid) return;
      if (badgeRole && badgeRoleText) {
        if (isAdmin) {
          badgeRole.classList.add('admin');
          if (badgeRoleIcon) badgeRoleIcon.textContent = '👑';
          badgeRoleText.setAttribute('data-en', 'Administrator');
          badgeRoleText.setAttribute('data-bn', 'প্রশাসক');
          badgeRoleText.textContent = lang === 'bn' ? 'প্রশাসক' : 'Administrator';
        } else {
          badgeRole.classList.remove('admin');
          if (badgeRoleIcon) badgeRoleIcon.textContent = '👤';
          badgeRoleText.setAttribute('data-en', 'Member');
          badgeRoleText.setAttribute('data-bn', 'সদস্য');
          badgeRoleText.textContent = lang === 'bn' ? 'সদস্য' : 'Member';
        }
      }
      if (btnAdminDash) {
        btnAdminDash.classList.toggle('hidden', !isAdmin);
      }
    } catch (_) {}

    // Details Grid Fields (View Mode)
    const fieldNameView = document.getElementById('field-name-view');
    const fieldEmailView = document.getElementById('field-email-view');
    const fieldPhoneView = document.getElementById('field-phone-view');
    const fieldCreatedView = document.getElementById('field-created-view');

    if (fieldNameView) fieldNameView.textContent = displayName;
    if (fieldEmailView) fieldEmailView.textContent = user.email || '';

    // Phone: Load from user-scoped localStorage + Firestore sync
    let phone = '';
    try {
      phone = localStorage.getItem('ds_profile_phone_' + user.uid) || '';
    } catch (_) {}

    if (fieldPhoneView) {
      if (phone) {
        fieldPhoneView.textContent = phone;
        fieldPhoneView.style.color = '';
      } else {
        fieldPhoneView.innerHTML = lang === 'bn' ? '<span data-en="Not provided" data-bn="যুক্ত করা হয়নি">যুক্ত করা হয়নি</span>' : '<span data-en="Not provided" data-bn="যুক্ত করা হয়নি">Not provided</span>';
        fieldPhoneView.style.color = 'var(--text-muted)';
      }
    }

    // Background sync from Firestore: User profile, Photo, Phone, Role
    const db = getDb();
    if (db && typeof db.collection === 'function') {
      ensureUserProfileDoc(user).then((res) => {
        if (!res || !res.exists) return;
        if (activeUser && user && activeUser.uid !== user.uid) return;
        const data = res.data;
        if (!data) return;

        if (data.phone) {
          try { localStorage.setItem('ds_profile_phone_' + user.uid, data.phone); } catch (_) {}
          if (fieldPhoneView) {
            fieldPhoneView.textContent = data.phone;
            fieldPhoneView.style.color = '';
          }
        }
        if (data.photoURL && !localStorage.getItem('ds_profile_photo_' + user.uid)) {
          try { localStorage.setItem('ds_profile_photo_' + user.uid, data.photoURL); } catch (_) {}
          updateHeaderAuthState(user);
          if (avatarImg && avatarFallback) {
            avatarImg.src = data.photoURL;
            avatarImg.classList.remove('hidden');
            avatarFallback.classList.add('hidden');
          }
        }
        if (data.displayName && data.displayName !== user.displayName) {
          try { localStorage.setItem('ds_profile_name_' + user.uid, data.displayName); } catch (_) {}
        }
        if (data.role) {
          try { sessionStorage.setItem('ds_role_' + user.uid, data.role); } catch (_) {}
        }
      }).catch((err) => {
        console.warn('[DS-AUTH:FIRESTORE-PROFILE] Profile render sync notice:', err);
      });
    }

    // Creation date
    if (fieldCreatedView && user.metadata && user.metadata.creationTime) {
      try {
        const d = new Date(user.metadata.creationTime);
        fieldCreatedView.textContent = d.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch (_) {}
    }
  }

  // ── Profile Page Event Listeners & Edit Flow
  function wireProfileEvents() {
    const btnEditMode = document.getElementById('btn-edit-mode');
    const btnCancelEdit = document.getElementById('btn-cancel-edit');
    const btnSaveProfile = document.getElementById('btn-save-profile');
    const btnSignoutTrigger = document.getElementById('btn-signout-trigger');

    const viewControls = document.getElementById('profile-view-controls');
    const editControls = document.getElementById('profile-edit-controls');

    const fieldNameView = document.getElementById('field-name-view');
    const fieldNameEdit = document.getElementById('field-name-edit');
    const fieldPhoneView = document.getElementById('field-phone-view');
    const fieldPhoneEdit = document.getElementById('field-phone-edit');

    const inputName = document.getElementById('input-display-name');
    const inputPhone = document.getElementById('input-phone');

    const alertBox = document.getElementById('profile-alert');
    const alertText = document.getElementById('profile-alert-text');
    const alertIcon = document.getElementById('profile-alert-icon');
    const alertDismiss = document.getElementById('profile-alert-dismiss');

    function showProfileAlert(msg, isSuccess = true) {
      if (!alertBox || !alertText) return;
      alertBox.classList.remove('hidden', 'success', 'error');
      alertBox.classList.add(isSuccess ? 'success' : 'error');
      if (alertIcon) alertIcon.textContent = isSuccess ? '✓' : '⚠️';
      alertText.textContent = msg;
    }

    function hideProfileAlert() {
      if (alertBox) alertBox.classList.add('hidden');
    }

    if (alertDismiss) {
      alertDismiss.addEventListener('click', hideProfileAlert);
    }

    // Avatar File Upload Handler
    const inputAvatarFile = document.getElementById('input-avatar-file');
    const avatarOverlay = document.getElementById('avatar-loading-overlay');

    if (inputAvatarFile) {
      inputAvatarFile.addEventListener('change', async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        const user = getCurrentUser();
        if (!user) return;
        const lang = getLang();

        // 1. Validate MIME type
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!validTypes.includes(file.type)) {
          showProfileAlert(
            lang === 'bn' 
              ? 'অনুগ্রহ করে একটি বৈধ ছবি ফাইল (JPEG, PNG, WebP) নির্বাচন করুন।' 
              : 'Please select a valid image file (JPEG, PNG, WebP).',
            false
          );
          inputAvatarFile.value = '';
          return;
        }

        // 2. Validate Size (max 3MB)
        if (file.size > 3 * 1024 * 1024) {
          showProfileAlert(
            lang === 'bn' 
              ? 'ছবির সাইজ ৩MB-এর কম হতে হবে।' 
              : 'Image file size must be less than 3MB.',
            false
          );
          inputAvatarFile.value = '';
          return;
        }

        // 3. Show Loading State
        if (avatarOverlay) avatarOverlay.classList.remove('hidden');

        try {
          // 4. Resize and compress via HTML5 Canvas
          const optimizedDataUrl = await resizeImageToDataUrl(file, 256, 256, 0.88);
          let finalPhotoURL = optimizedDataUrl;

          // 5. Attempt Firebase Storage upload if available
          if (typeof firebase.storage === 'function' && window.FIREBASE_CONFIG && window.FIREBASE_CONFIG.storageBucket) {
            try {
              const storageRef = firebase.storage().ref();
              const ext = file.type.split('/')[1] || 'jpg';
              const avatarRef = storageRef.child(`users/${user.uid}/avatar_${Date.now()}.${ext}`);
              const snapshot = await avatarRef.put(file, { contentType: file.type });
              finalPhotoURL = await snapshot.ref.getDownloadURL();
            } catch (storageErr) {
              console.warn('Firebase Storage upload notice, falling back to secure data URL:', storageErr);
            }
          }

          // 6. Update Native Firebase Profile if standard HTTP URL
          if (finalPhotoURL.startsWith('http')) {
            try {
              await user.updateProfile({ photoURL: finalPhotoURL });
            } catch (profileErr) {
              console.warn('user.updateProfile notice:', profileErr);
            }
          }

          // 7. Persist in user-scoped LocalStorage
          try {
            localStorage.setItem('ds_profile_photo_' + user.uid, finalPhotoURL);
          } catch (_) {}

          // 8. Persist in Firestore
          if (window.db && typeof window.db.collection === 'function') {
            try {
              await window.db.collection('users').doc(user.uid).set({
                photoURL: finalPhotoURL,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
              }, { merge: true });
            } catch (_) {}
          }

          // 9. Update UI immediately everywhere
          user.customPhotoURL = finalPhotoURL;
          updateHeaderAuthState(user);
          renderProfilePage(user);

          showProfileAlert(
            lang === 'bn' 
              ? 'প্রোফাইল ছবি সফলভাবে আপডেট করা হয়েছে!' 
              : 'Profile photo updated successfully!',
            true
          );
        } catch (err) {
          console.error('Avatar upload failed:', err);
          showProfileAlert(
            lang === 'bn' 
              ? 'ছবি আপলোড করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।' 
              : 'Failed to upload photo. Please try again.',
            false
          );
        } finally {
          if (avatarOverlay) avatarOverlay.classList.add('hidden');
          inputAvatarFile.value = '';
        }
      });
    }

    // Copy UID Handler
    const btnCopyUid = document.getElementById('btn-copy-uid');
    const copyUidText = document.getElementById('copy-uid-text');

    if (btnCopyUid) {
      btnCopyUid.addEventListener('click', async () => {
        const user = getCurrentUser();
        const fieldUidView = document.getElementById('field-uid-view');
        const uid = (user && user.uid) || (fieldUidView ? fieldUidView.textContent.trim() : null);
        if (!uid || uid === '—') return;
        const lang = getLang();

        try {
          await navigator.clipboard.writeText(uid);
          if (copyUidText) {
            copyUidText.textContent = lang === 'bn' ? 'কপি হয়েছে!' : 'Copied!';
            setTimeout(() => {
              copyUidText.textContent = lang === 'bn' ? 'কপি করুন' : 'Copy ID';
            }, 2000);
          }
        } catch (_) {
          const temp = document.createElement('textarea');
          temp.value = user.uid;
          document.body.appendChild(temp);
          temp.select();
          document.execCommand('copy');
          document.body.removeChild(temp);
          if (copyUidText) {
            copyUidText.textContent = lang === 'bn' ? 'কপি হয়েছে!' : 'Copied!';
            setTimeout(() => {
              copyUidText.textContent = lang === 'bn' ? 'কপি করুন' : 'Copy ID';
            }, 2000);
          }
        }
      });
    }

    // Enter Edit Mode
    if (btnEditMode) {
      btnEditMode.addEventListener('click', () => {
        hideProfileAlert();
        const user = getCurrentUser();
        if (!user) return;

        const currentName = user.displayName || (user.email ? user.email.split('@')[0] : '');
        let currentPhone = '';
        try {
          currentPhone = localStorage.getItem('ds_profile_phone_' + user.uid) || '';
        } catch (_) {}

        if (inputName) inputName.value = currentName;
        if (inputPhone) inputPhone.value = currentPhone;

        if (fieldNameView) fieldNameView.classList.add('hidden');
        if (fieldNameEdit) fieldNameEdit.classList.remove('hidden');

        if (fieldPhoneView) fieldPhoneView.classList.add('hidden');
        if (fieldPhoneEdit) fieldPhoneEdit.classList.remove('hidden');

        if (viewControls) viewControls.classList.add('hidden');
        if (editControls) editControls.classList.remove('hidden');

        if (inputName) inputName.focus();
      });
    }

    // Cancel Edit Mode
    if (btnCancelEdit) {
      btnCancelEdit.addEventListener('click', () => {
        hideProfileAlert();
        if (fieldNameView) fieldNameView.classList.remove('hidden');
        if (fieldNameEdit) fieldNameEdit.classList.add('hidden');

        if (fieldPhoneView) fieldPhoneView.classList.remove('hidden');
        if (fieldPhoneEdit) fieldPhoneEdit.classList.add('hidden');

        if (viewControls) viewControls.classList.remove('hidden');
        if (editControls) editControls.classList.remove('hidden');
      });
    }

    // Save Changes
    if (btnSaveProfile) {
      btnSaveProfile.addEventListener('click', async () => {
        const user = getCurrentUser();
        if (!user) return;

        const newName = inputName ? inputName.value.trim() : '';
        const newPhone = inputPhone ? inputPhone.value.trim() : '';
        const lang = getLang();

        if (!newName) {
          showProfileAlert(
            lang === 'bn' ? 'অনুগ্রহ করে একটি নাম লিখুন।' : 'Please enter a valid display name.',
            false
          );
          if (inputName) inputName.focus();
          return;
        }

        if (newName.length < 2 || newName.length > 60) {
          showProfileAlert(
            lang === 'bn' ? 'নাম ২ থেকে ৬০ অক্ষরের মধ্যে হতে হবে।' : 'Display name must be between 2 and 60 characters.',
            false
          );
          if (inputName) inputName.focus();
          return;
        }

        const saveSpinner = document.getElementById('save-spinner');
        const saveText = document.getElementById('btn-save-text');
        btnSaveProfile.disabled = true;
        if (saveSpinner) saveSpinner.classList.add('active');
        if (saveText) saveText.style.opacity = '0.5';

        try {
          // 1. Update native Firebase Auth displayName
          if (newName !== user.displayName) {
            await user.updateProfile({ displayName: newName });
          }

          // 2. Persist Phone Number safely in user-scoped localStorage
          try {
            if (newPhone) {
              localStorage.setItem('ds_profile_phone_' + user.uid, newPhone);
            } else {
              localStorage.removeItem('ds_profile_phone_' + user.uid);
            }
          } catch (_) {}

          // 3. Optional Firestore Sync if initialized
          if (window.db && typeof window.db.collection === 'function') {
            try {
              window.db.collection('users').doc(user.uid).set({
                displayName: newName,
                phone: newPhone || null,
                email: user.email || null,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
              }, { merge: true }).catch(() => {});
            } catch (_) {}
          }

          // 4. Update UI in view mode
          const titleName = document.getElementById('profile-title-name');
          if (titleName) titleName.textContent = newName;
          if (fieldNameView) fieldNameView.textContent = newName;

          if (fieldPhoneView) {
            if (newPhone) {
              fieldPhoneView.textContent = newPhone;
              fieldPhoneView.style.color = '';
            } else {
              fieldPhoneView.innerHTML = lang === 'bn' ? '<span data-en="Not provided" data-bn="যুক্ত করা হয়নি">যুক্ত করা হয়নি</span>' : '<span data-en="Not provided" data-bn="যুক্ত করা হয়নি">Not provided</span>';
              fieldPhoneView.style.color = 'var(--text-muted)';
            }
          }

          // 5. Update Universal Header Avatar and Name
          updateHeaderAuthState(user);

          showProfileAlert(
            lang === 'bn' ? 'প্রোফাইল সফলভাবে আপডেট করা হয়েছে!' : 'Profile updated successfully!',
            true
          );

          // Exit edit mode
          if (fieldNameView) fieldNameView.classList.remove('hidden');
          if (fieldNameEdit) fieldNameEdit.classList.add('hidden');
          if (fieldPhoneView) fieldPhoneView.classList.remove('hidden');
          if (fieldPhoneEdit) fieldPhoneEdit.classList.add('hidden');
          if (viewControls) viewControls.classList.remove('hidden');
          if (editControls) editControls.classList.add('hidden');

        } catch (err) {
          console.error('Digital Seba Profile update error:', err);
          showProfileAlert(
            lang === 'bn' ? 'প্রোফাইল সংরক্ষণে সমস্যা হয়েছে।' : 'Failed to update profile. Please try again.',
            false
          );
        } finally {
          btnSaveProfile.disabled = false;
          if (saveSpinner) saveSpinner.classList.remove('active');
          if (saveText) saveText.style.opacity = '1';
        }
      });
    }

    // Modal Confirmation for Sign Out
    const signoutModal = document.getElementById('signout-modal');
    const btnCancelModal = document.getElementById('btn-cancel-modal');
    const btnConfirmSignout = document.getElementById('btn-confirm-signout');

    if (btnSignoutTrigger && signoutModal) {
      btnSignoutTrigger.addEventListener('click', () => {
        signoutModal.classList.add('active');
      });
    }

    if (btnCancelModal && signoutModal) {
      btnCancelModal.addEventListener('click', () => {
        signoutModal.classList.remove('active');
      });
    }

    if (signoutModal) {
      signoutModal.addEventListener('click', (e) => {
        if (e.target === signoutModal) {
          signoutModal.classList.remove('active');
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && signoutModal.classList.contains('active')) {
          signoutModal.classList.remove('active');
        }
      });
    }

    if (btnConfirmSignout) {
      btnConfirmSignout.addEventListener('click', () => {
        if (signoutModal) signoutModal.classList.remove('active');
        signOut();
      });
    }
  }

  // ── DOM Wiring for Login & Global Events
  function wireEvents() {
    wireHeaderDropdown();

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

    wireProfileEvents();

    // React to language toggle dynamically
    window.addEventListener('languageChanged', () => {
      const auth = authInstance;
      const user = auth ? auth.currentUser : null;
      updateHeaderAuthState(user);
      renderLoginPage(user);
      renderProfilePage(user);
      checkSignupMode();
    });

    window.addEventListener('hashchange', () => {
      checkSignupMode();
    });
  }

  function checkSignupMode() {
    const isSignup = window.location.hash === '#signup' || window.location.search.includes('mode=signup');
    const title = document.querySelector('.auth-title');
    const subtitle = document.querySelector('.auth-subtitle');
    const btnText = document.getElementById('btn-google-text');
    const lang = getLang();

    if (isSignup) {
      if (title) {
        title.setAttribute('data-en', 'Create Your Account');
        title.setAttribute('data-bn', 'আপনার অ্যাকাউন্ট তৈরি করুন');
        title.textContent = lang === 'bn' ? 'আপনার অ্যাকাউন্ট তৈরি করুন' : 'Create Your Account';
      }
      if (subtitle) {
        subtitle.setAttribute('data-en', 'Sign up in seconds with Google to access all Digital Seba features.');
        subtitle.setAttribute('data-bn', 'গুগল দিয়ে মাত্র কয়েক সেকেন্ডে অ্যাকাউন্ট তৈরি করে সেবা গ্রহণ শুরু করুন।');
        subtitle.textContent = lang === 'bn' ? 'গুগল দিয়ে মাত্র কয়েক সেকেন্ডে অ্যাকাউন্ট তৈরি করে সেবা গ্রহণ শুরু করুন।' : 'Sign up in seconds with Google to access all Digital Seba features.';
      }
      if (btnText) {
        btnText.setAttribute('data-en', 'Sign Up with Google');
        btnText.setAttribute('data-bn', 'গুগল দিয়ে সাইন-আপ করুন');
        btnText.textContent = lang === 'bn' ? 'গুগল দিয়ে সাইন-আপ করুন' : 'Sign Up with Google';
      }
    } else {
      if (title) {
        title.setAttribute('data-en', 'Welcome to Digital Seba');
        title.setAttribute('data-bn', 'ডিজিটাল সেবায় স্বাগতম');
        title.textContent = lang === 'bn' ? 'ডিজিটাল সেবায় স্বাগতম' : 'Welcome to Digital Seba';
      }
      if (subtitle) {
        subtitle.setAttribute('data-en', 'Sign in or create your account using your Google profile.');
        subtitle.setAttribute('data-bn', 'আপনার গুগল প্রোফাইল ব্যবহার করে সাইন-ইন বা অ্যাকাউন্ট তৈরি করুন।');
        subtitle.textContent = lang === 'bn' ? 'আপনার গুগল প্রোফাইল ব্যবহার করে সাইন-ইন বা অ্যাকাউন্ট তৈরি করুন।' : 'Sign in or create your account using your Google profile.';
      }
      if (btnText) {
        btnText.setAttribute('data-en', 'Continue with Google');
        btnText.setAttribute('data-bn', 'গুগল দিয়ে চালিয়ে যান');
        btnText.textContent = lang === 'bn' ? 'গুগল দিয়ে চালিয়ে যান' : 'Continue with Google';
      }
    }
  }

  // ── Startup
  document.addEventListener('DOMContentLoaded', () => {
    wireEvents();
    checkSignupMode();

    const auth = initAuth();
    if (auth) {
      auth.onAuthStateChanged((user) => {
        const u = user || activeUser;
        if (u) {
          ensureUserProfileDoc(u).catch(() => {});
        }
        updateHeaderAuthState(u);
        renderLoginPage(u);
        renderProfilePage(u);
      });
    } else {
      const u = activeUser || null;
      if (u) {
        ensureUserProfileDoc(u).catch(() => {});
      }
      updateHeaderAuthState(u);
      renderLoginPage(u);
      renderProfilePage(u);
    }
  });

  // Export public API
  window.DSAuth = {
    signInWithGoogle,
    signOut,
    getUser: () => getCurrentUser(),
    setUser: (u) => { activeUser = u; },
    init: initAuth,
    updateHeader: updateHeaderAuthState,
    renderProfilePage,
    wireProfileEvents,
    checkAdminStatus,
    getUserPhoto,
    getUserName,
    resizeImageToDataUrl,
    ensureUserProfileDoc
  };
})();
