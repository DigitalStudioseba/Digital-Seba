/**
 * Digital Seba - Centralized Firebase Initialization
 * Uses Firebase v8 Namespace / Compat SDK
 */
(function () {
  const FIREBASE_CONFIG = {
    apiKey: "AIzaSyCbFoDXWceeNmTE34nph5BQGaWzrgU5jP4",
    authDomain: "digital-seba-92ae6.firebaseapp.com",
    projectId: "digital-seba-92ae6",
    storageBucket: "digital-seba-92ae6.firebasestorage.app",
    messagingSenderId: "201445991120",
    appId: "1:201445991120:web:c6d05f276c72957b605886",
  };

  if (typeof window.FIREBASE_CONFIG === "undefined") {
    window.FIREBASE_CONFIG = FIREBASE_CONFIG;
  }

  if (typeof firebase !== "undefined") {
    if (!firebase.apps || firebase.apps.length === 0) {
      try {
        firebase.initializeApp(FIREBASE_CONFIG);
      } catch (e) {
        console.warn("Firebase initializeApp:", e);
      }
    }

    if (typeof firebase.firestore === "function" && !window.db) {
      try {
        window.db = firebase.firestore();
      } catch (e) {
        console.warn("Firestore init:", e);
      }
    }

    if (typeof firebase.storage === "function" && !window.storage) {
      try {
        window.storage = firebase.storage();
      } catch (e) {
        console.warn("Firebase Storage init:", e);
      }
    }

    if (typeof firebase.analytics === "function" && !window.analytics) {
      try {
        window.analytics = firebase.analytics();
      } catch (e) {
        // Analytics can fail if storage/cookies blocked, ignore safely
      }
    }
  }
})();
