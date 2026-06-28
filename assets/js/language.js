/**
 * DIGITAL SEBA - Language Manager
 * Handles Bengali/English language switching
 * Author: Monir Hossain
 */

'use strict';

const LanguageManager = (() => {
  const STORAGE_KEY = 'ds_language';
  let currentLang = 'en';

  // Translations database
  const translations = {
    en: {
      'nav.home': 'Home',
      'nav.tools': 'Tools',
      'nav.services': 'Services',
      'nav.categories': 'Categories',
      'nav.pricing': 'Pricing',
      'nav.about': 'About',
      'nav.contact': 'Contact',
      'nav.login': 'Login',
      'nav.register': 'Register',
      'nav.dashboard': 'Dashboard',
      'nav.profile': 'Profile',
      'nav.settings': 'Settings',
      'nav.logout': 'Logout',
      'hero.badge': "Bangladesh's #1 Digital Platform",
      'hero.title1': 'Your Digital Gateway',
      'hero.title2': "to Bangladesh's Services",
      'hero.subtitle': "Access government services, professional tools, and AI-powered solutions — all in one secure platform.",
      'search.placeholder': 'Search for passport, NID, birth certificate...',
      'search.popular': 'Popular:',
      'search.btn': 'Search',
      'btn.getStarted': 'Get Started Free',
      'btn.learnMore': 'Learn More',
      'btn.viewAll': 'View All',
      'btn.tryNow': 'Try Now',
      'btn.login': 'Login',
      'btn.register': 'Register',
      'btn.logout': 'Logout',
      'btn.save': 'Save',
      'btn.cancel': 'Cancel',
      'btn.delete': 'Delete',
      'btn.edit': 'Edit',
      'btn.upload': 'Upload',
      'btn.download': 'Download',
      'btn.submit': 'Submit',
      'btn.back': 'Back',
      'btn.next': 'Next',
      'label.name': 'Name',
      'label.email': 'Email',
      'label.password': 'Password',
      'label.phone': 'Phone',
      'label.address': 'Address',
      'label.subject': 'Subject',
      'label.message': 'Message',
      'msg.loading': 'Loading...',
      'msg.success': 'Success!',
      'msg.error': 'An error occurred',
      'msg.saved': 'Saved successfully',
      'msg.deleted': 'Deleted successfully',
      'msg.required': 'This field is required',
      'msg.invalidEmail': 'Invalid email address',
      'msg.passwordShort': 'Password must be at least 8 characters',
      'msg.logoutSuccess': 'Logged out successfully',
      'msg.loginRequired': 'Please login to continue',
      'footer.rights': '© 2024 Digital Seba. All rights reserved.',
      'footer.madeIn': 'Made with ❤️ in Bangladesh'
    },
    bn: {
      'nav.home': 'হোম',
      'nav.tools': 'টুলস',
      'nav.services': 'সেবা',
      'nav.categories': 'ক্যাটাগরি',
      'nav.pricing': 'মূল্য',
      'nav.about': 'আমাদের',
      'nav.contact': 'যোগাযোগ',
      'nav.login': 'লগইন',
      'nav.register': 'নিবন্ধন',
      'nav.dashboard': 'ড্যাশবোর্ড',
      'nav.profile': 'প্রোফাইল',
      'nav.settings': 'সেটিংস',
      'nav.logout': 'লগআউট',
      'hero.badge': 'বাংলাদেশের #১ ডিজিটাল প্ল্যাটফর্ম',
      'hero.title1': 'আপনার ডিজিটাল গেটওয়ে',
      'hero.title2': 'বাংলাদেশের সেবার দুয়ারে',
      'hero.subtitle': 'সরকারি সেবা, পেশাদার টুলস এবং এআই-চালিত সমাধান — সব এক নিরাপদ প্ল্যাটফর্মে।',
      'search.placeholder': 'পাসপোর্ট, এনআইডি, জন্ম সনদ খুঁজুন...',
      'search.popular': 'জনপ্রিয়:',
      'search.btn': 'খুঁজুন',
      'btn.getStarted': 'বিনামূল্যে শুরু করুন',
      'btn.learnMore': 'আরও জানুন',
      'btn.viewAll': 'সব দেখুন',
      'btn.tryNow': 'এখনই চেষ্টা করুন',
      'btn.login': 'লগইন',
      'btn.register': 'নিবন্ধন',
      'btn.logout': 'লগআউট',
      'btn.save': 'সংরক্ষণ করুন',
      'btn.cancel': 'বাতিল',
      'btn.delete': 'মুছুন',
      'btn.edit': 'সম্পাদনা',
      'btn.upload': 'আপলোড',
      'btn.download': 'ডাউনলোড',
      'btn.submit': 'জমা দিন',
      'btn.back': 'পিছনে',
      'btn.next': 'পরবর্তী',
      'label.name': 'নাম',
      'label.email': 'ইমেইল',
      'label.password': 'পাসওয়ার্ড',
      'label.phone': 'ফোন',
      'label.address': 'ঠিকানা',
      'label.subject': 'বিষয়',
      'label.message': 'বার্তা',
      'msg.loading': 'লোড হচ্ছে...',
      'msg.success': 'সফলভাবে সম্পন্ন!',
      'msg.error': 'একটি ত্রুটি হয়েছে',
      'msg.saved': 'সফলভাবে সংরক্ষিত হয়েছে',
      'msg.deleted': 'সফলভাবে মুছে ফেলা হয়েছে',
      'msg.required': 'এই ক্ষেত্রটি প্রয়োজনীয়',
      'msg.invalidEmail': 'অবৈধ ইমেইল ঠিকানা',
      'msg.passwordShort': 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে',
      'msg.logoutSuccess': 'সফলভাবে লগআউট হয়েছে',
      'msg.loginRequired': 'চালিয়ে যেতে লগইন করুন',
      'footer.rights': '© ২০২৪ ডিজিটাল সেবা। সর্বস্বত্ব সংরক্ষিত।',
      'footer.madeIn': '❤️ দিয়ে বাংলাদেশে তৈরি'
    }
  };

  // Apply language to all elements with data-en / data-bn
  const applyLanguage = (lang) => {
    currentLang = lang;

    // Update body class for font
    document.body.classList.toggle('bn', lang === 'bn');

    // Update elements with data-en/data-bn attributes
    document.querySelectorAll('[data-en][data-bn]').forEach(el => {
      const text = el.getAttribute(`data-${lang}`);
      if (text) {
        el.textContent = text;
      }
    });

    // Update placeholders
    document.querySelectorAll('[data-placeholder-en][data-placeholder-bn]').forEach(el => {
      const placeholder = el.getAttribute(`data-placeholder-${lang}`);
      if (placeholder) {
        el.placeholder = placeholder;
      }
    });

    // Update HTML lang attribute
    document.documentElement.lang = lang === 'bn' ? 'bn' : 'en';

    // Update language toggle button
    const langText = document.getElementById('langText');
    if (langText) {
      langText.textContent = lang === 'bn' ? 'বাং' : 'EN';
    }

    // Dispatch event
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
  };

  // Toggle language
  const toggle = () => {
    const next = currentLang === 'en' ? 'bn' : 'en';
    set(next);
  };

  // Set language
  const set = (lang) => {
    if (!['en', 'bn'].includes(lang)) return;
    applyLanguage(lang);
    save(lang);
  };

  // Get translation
  const t = (key) => {
    return translations[currentLang]?.[key] || translations.en[key] || key;
  };

  // Save language
  const save = (lang) => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
  };

  // Load language
  const load = () => {
    try {
      // Check URL param first
      const params = new URLSearchParams(window.location.search);
      if (params.get('lang')) return params.get('lang');

      // Check localStorage
      return localStorage.getItem(STORAGE_KEY) || 'en';
    } catch (e) {
      return 'en';
    }
  };

  // Get current language
  const get = () => currentLang;

  // Initialize
  const init = () => {
    const saved = load();
    applyLanguage(saved);

    // Language toggle button
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
      langToggle.addEventListener('click', toggle);
    }
  };

  return { init, toggle, set, get, t, applyLanguage };
})();

// Initialize after DOM
document.addEventListener('DOMContentLoaded', () => {
  LanguageManager.init();
});

window.LanguageManager = LanguageManager;
window.t = LanguageManager.t;
