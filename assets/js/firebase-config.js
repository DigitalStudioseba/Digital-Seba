/**
 * DIGITAL SEBA - Firebase Configuration
 * Replace with your actual Firebase project credentials
 * Author: Monir Hossain
 *
 * RESERVED / NOT CURRENTLY LOADED on the homepage: Login & Register were
 * removed from the live site. This file is kept as ready-to-wire
 * scaffolding for when authentication is reintroduced. It is still loaded
 * by the Dashboard pages, which pre-date this change and remain
 * unmodified except for their now-dead login redirect targets.
 */

// Firebase SDK imports via CDN (added to HTML pages that need Firebase)
// This file sets up the config and exports Firebase instances

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase (loaded via CDN in HTML)
// Firebase is loaded from CDN scripts in each HTML page

// Firestore Security Rules (deploy via Firebase console)
// These rules ensure privacy:
/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // User files - private
    match /userFiles/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // User history - private
    match /userHistory/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // User settings - private
    match /userSettings/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Public content (tools, categories) - read only
    match /tools/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    match /categories/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    match /announcements/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Newsletter - write only
    match /newsletter/{document} {
      allow create: if true;
      allow read, update, delete: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Contact messages
    match /contacts/{document} {
      allow create: if true;
      allow read, update, delete: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Deny all other reads/writes
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
*/

// Storage Security Rules
/*
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /public/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
*/

// Try to initialize Firebase if available
(function() {
  try {
    if (typeof firebase !== 'undefined') {
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }
      window.db = firebase.firestore();
      window.auth = firebase.auth();
      window.storage = firebase.storage();
      console.log('✅ Firebase initialized');
    }
  } catch (e) {
    console.warn('Firebase not loaded. Running in offline mode.', e);
  }
})();
