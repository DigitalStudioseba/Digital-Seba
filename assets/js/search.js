/**
 * DIGITAL SEBA - Search Module
 * Handles global search with instant results
 * Author: Monir Hossain
 */

'use strict';

const SearchModule = (() => {

  // Search database of all tools and services
  const searchData = [
    // Passport
    { id: 1, name: 'MRP Passport Application', namebn: 'এমআরপি পাসপোর্ট আবেদন', category: 'Passport', categorybn: 'পাসপোর্ট', icon: '🛂', url: 'pages/tools/passport/index.html', tags: ['passport', 'mrp', 'travel'] },
    { id: 2, name: 'ePassport Application', namebn: 'ই-পাসপোর্ট আবেদন', category: 'Passport', categorybn: 'পাসপোর্ট', icon: '🛂', url: 'pages/tools/passport/index.html', tags: ['epassport', 'passport', 'biometric'] },
    { id: 3, name: 'Passport Status Check', namebn: 'পাসপোর্ট স্ট্যাটাস চেক', category: 'Passport', categorybn: 'পাসপোর্ট', icon: '🔍', url: 'pages/tools/passport/index.html', tags: ['passport status', 'track'] },
    { id: 4, name: 'Passport Renewal Guide', namebn: 'পাসপোর্ট নবায়ন গাইড', category: 'Passport', categorybn: 'পাসপোর্ট', icon: '📋', url: 'pages/tools/passport/index.html', tags: ['passport renewal', 'guide'] },
    // NID
    { id: 5, name: 'NID Smart Card Services', namebn: 'এনআইডি স্মার্ট কার্ড সেবা', category: 'NID', categorybn: 'এনআইডি', icon: '🪪', url: 'pages/tools/nid/index.html', tags: ['nid', 'national id', 'smart card'] },
    { id: 6, name: 'NID Correction', namebn: 'এনআইডি সংশোধন', category: 'NID', categorybn: 'এনআইডি', icon: '✏️', url: 'pages/tools/nid/index.html', tags: ['nid correction', 'update'] },
    { id: 7, name: 'NID Download', namebn: 'এনআইডি ডাউনলোড', category: 'NID', categorybn: 'এনআইডি', icon: '⬇️', url: 'pages/tools/nid/index.html', tags: ['nid download', 'digital nid'] },
    { id: 8, name: 'NID Verification', namebn: 'এনআইডি যাচাই', category: 'NID', categorybn: 'এনআইডি', icon: '✅', url: 'pages/tools/nid/index.html', tags: ['nid verify', 'check nid'] },
    // Birth Certificate
    { id: 9, name: 'Birth Certificate', namebn: 'জন্ম নিবন্ধন সনদ', category: 'Birth', categorybn: 'জন্ম', icon: '📜', url: 'pages/tools/birth/index.html', tags: ['birth certificate', 'registration'] },
    { id: 10, name: 'Death Certificate', namebn: 'মৃত্যু সনদ', category: 'Birth', categorybn: 'জন্ম', icon: '📄', url: 'pages/tools/birth/index.html', tags: ['death certificate'] },
    { id: 11, name: 'Marriage Certificate', namebn: 'বিবাহ সনদ', category: 'Birth', categorybn: 'জন্ম', icon: '💍', url: 'pages/tools/birth/index.html', tags: ['marriage certificate'] },
    // Land
    { id: 12, name: 'Land Khatian Search', namebn: 'ভূমি খতিয়ান অনুসন্ধান', category: 'Land', categorybn: 'ভূমি', icon: '🗺️', url: 'pages/tools/land/index.html', tags: ['khatian', 'land', 'record'] },
    { id: 13, name: 'Land Mutation', namebn: 'জমির মিউটেশন', category: 'Land', categorybn: 'ভূমি', icon: '📋', url: 'pages/tools/land/index.html', tags: ['mutation', 'land transfer'] },
    { id: 14, name: 'Mouza Map', namebn: 'মৌজা ম্যাপ', category: 'Land', categorybn: 'ভূমি', icon: '🗺️', url: 'pages/tools/land/index.html', tags: ['mouza', 'map'] },
    // Photo
    { id: 15, name: 'Passport Photo Maker', namebn: 'পাসপোর্ট ফটো মেকার', category: 'Photo', categorybn: 'ফটো', icon: '📷', url: 'pages/tools/photo/index.html', tags: ['passport photo', 'photo'] },
    { id: 16, name: 'Background Remover', namebn: 'ব্যাকগ্রাউন্ড রিমুভার', category: 'Photo', categorybn: 'ফটো', icon: '🖼️', url: 'pages/tools/photo/index.html', tags: ['background remove', 'photo edit'] },
    { id: 17, name: 'Image Resize', namebn: 'ইমেজ রিসাইজ', category: 'Photo', categorybn: 'ফটো', icon: '📐', url: 'pages/tools/photo/index.html', tags: ['resize', 'image'] },
    { id: 18, name: 'Image Compress', namebn: 'ইমেজ কম্প্রেস', category: 'Photo', categorybn: 'ফটো', icon: '🗜️', url: 'pages/tools/photo/index.html', tags: ['compress', 'image'] },
    { id: 19, name: 'Signature Maker', namebn: 'স্বাক্ষর মেকার', category: 'Photo', categorybn: 'ফটো', icon: '✍️', url: 'pages/tools/photo/index.html', tags: ['signature', 'digital signature'] },
    // PDF
    { id: 20, name: 'PDF Merge', namebn: 'পিডিএফ মার্জ', category: 'PDF', categorybn: 'পিডিএফ', icon: '📑', url: 'pages/tools/pdf/index.html', tags: ['pdf merge', 'combine pdf'] },
    { id: 21, name: 'PDF Split', namebn: 'পিডিএফ স্প্লিট', category: 'PDF', categorybn: 'পিডিএফ', icon: '✂️', url: 'pages/tools/pdf/index.html', tags: ['pdf split', 'divide pdf'] },
    { id: 22, name: 'PDF Compress', namebn: 'পিডিএফ কম্প্রেস', category: 'PDF', categorybn: 'পিডিএফ', icon: '🗜️', url: 'pages/tools/pdf/index.html', tags: ['pdf compress', 'reduce pdf size'] },
    { id: 23, name: 'OCR Text Extract', namebn: 'ওসিআর টেক্সট এক্সট্র্যাক্ট', category: 'PDF', categorybn: 'পিডিএফ', icon: '🔤', url: 'pages/tools/pdf/index.html', tags: ['ocr', 'text extract', 'scan'] },
    { id: 24, name: 'Word to PDF', namebn: 'ওয়ার্ড থেকে পিডিএফ', category: 'PDF', categorybn: 'পিডিএফ', icon: '📝', url: 'pages/tools/pdf/index.html', tags: ['word to pdf', 'convert'] },
    { id: 25, name: 'PDF to Word', namebn: 'পিডিএফ থেকে ওয়ার্ড', category: 'PDF', categorybn: 'পিডিএফ', icon: '📄', url: 'pages/tools/pdf/index.html', tags: ['pdf to word', 'convert'] },
    // AI
    { id: 26, name: 'AI Chat Assistant', namebn: 'এআই চ্যাট অ্যাসিস্ট্যান্ট', category: 'AI', categorybn: 'এআই', icon: '🤖', url: 'pages/tools/ai/index.html', tags: ['ai chat', 'assistant', 'chatbot'] },
    { id: 27, name: 'AI Image Generator', namebn: 'এআই ইমেজ জেনারেটর', category: 'AI', categorybn: 'এআই', icon: '🎨', url: 'pages/tools/ai/index.html', tags: ['ai image', 'generate', 'midjourney'] },
    { id: 28, name: 'AI OCR', namebn: 'এআই ওসিআর', category: 'AI', categorybn: 'এআই', icon: '🔍', url: 'pages/tools/ai/index.html', tags: ['ai ocr', 'text recognition'] },
    { id: 29, name: 'AI Content Writer', namebn: 'এআই কন্টেন্ট রাইটার', category: 'AI', categorybn: 'এআই', icon: '✍️', url: 'pages/tools/ai/index.html', tags: ['ai writer', 'content', 'writing'] },
    // Utility
    { id: 30, name: 'Age Calculator', namebn: 'বয়স ক্যালকুলেটর', category: 'Utility', categorybn: 'ইউটিলিটি', icon: '🎂', url: 'pages/tools/utility/index.html', tags: ['age', 'calculator'] },
    { id: 31, name: 'BMI Calculator', namebn: 'বিএমআই ক্যালকুলেটর', category: 'Utility', categorybn: 'ইউটিলিটি', icon: '⚖️', url: 'pages/tools/utility/index.html', tags: ['bmi', 'health', 'calculator'] },
    { id: 32, name: 'Currency Converter', namebn: 'মুদ্রা রূপান্তরকারী', category: 'Utility', categorybn: 'ইউটিলিটি', icon: '💱', url: 'pages/tools/utility/index.html', tags: ['currency', 'exchange', 'taka'] },
    { id: 33, name: 'Unit Converter', namebn: 'একক রূপান্তরকারী', category: 'Utility', categorybn: 'ইউটিলিটি', icon: '📏', url: 'pages/tools/utility/index.html', tags: ['unit', 'converter', 'measurement'] },
    { id: 34, name: 'QR Code Generator', namebn: 'কিউআর কোড জেনারেটর', category: 'Utility', categorybn: 'ইউটিলিটি', icon: '🔲', url: 'pages/tools/utility/index.html', tags: ['qr code', 'generate', 'barcode'] },
    { id: 35, name: 'Barcode Generator', namebn: 'বারকোড জেনারেটর', category: 'Utility', categorybn: 'ইউটিলিটি', icon: '📊', url: 'pages/tools/utility/index.html', tags: ['barcode', 'generate'] },
    // Gov
    { id: 36, name: 'TIN Certificate', namebn: 'টিআইএন সনদ', category: 'Government', categorybn: 'সরকারি', icon: '🏛️', url: '#', tags: ['tin', 'tax', 'income tax'] },
    { id: 37, name: 'BIN Registration', namebn: 'বিআইএন নিবন্ধন', category: 'Government', categorybn: 'সরকারি', icon: '🏛️', url: '#', tags: ['bin', 'vat', 'business'] },
    { id: 38, name: 'Driving License', namebn: 'ড্রাইভিং লাইসেন্স', category: 'Government', categorybn: 'সরকারি', icon: '🚗', url: '#', tags: ['driving license', 'license', 'brta'] },
    { id: 39, name: 'Trade License', namebn: 'ট্রেড লাইসেন্স', category: 'Government', categorybn: 'সরকারি', icon: '💼', url: '#', tags: ['trade license', 'business license'] },
  ];

  let debounceTimer = null;

  // Highlight matching text
  const highlight = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  // Search function
  const search = (query) => {
    if (!query || query.length < 1) return [];

    const q = query.toLowerCase().trim();
    const lang = LanguageManager?.get() || 'en';

    // === Resources Extension (additive, do not remove existing data) ===
    const allData = Array.isArray(window.EXTRA_SEARCH_DATA)
      ? searchData.concat(window.EXTRA_SEARCH_DATA)
      : searchData;

    return allData
      .filter(item => {
        const searchIn = [
          item.name.toLowerCase(),
          item.namebn,
          item.category.toLowerCase(),
          ...item.tags
        ].join(' ');
        return searchIn.includes(q);
      })
      .slice(0, 8);
  };

  // Render results
  const renderResults = (results, container, query) => {
    if (!container) return;

    if (!results.length) {
      container.innerHTML = `
        <div style="padding:20px;text-align:center;color:var(--text-muted)">
          <div style="font-size:32px;margin-bottom:8px">🔍</div>
          <div style="font-size:14px">No results found for "<strong>${query}</strong>"</div>
        </div>
      `;
      return;
    }

    const lang = LanguageManager?.get() || 'en';

    container.innerHTML = results.map(item => `
      <a href="${item.url}" class="search-result-item"${item.url.startsWith('http') ? ' target="_blank" rel="noopener"' : ''}>
        <div class="search-result-icon">${item.icon}</div>
        <div>
          <div class="search-result-name">${highlight(lang === 'bn' ? item.namebn : item.name, query)}</div>
          <div class="search-result-cat">${lang === 'bn' ? item.categorybn : item.category}</div>
        </div>
      </a>
    `).join('');
  };

  // Setup navbar search
  const setupNavSearch = () => {
    const input = document.getElementById('globalSearch');
    const dropdown = document.getElementById('searchDropdown');
    if (!input || !dropdown) return;

    let selectedIndex = -1;

    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const q = input.value.trim();
        if (q.length >= 1) {
          const results = search(q);
          renderResults(results, dropdown, q);
          dropdown.classList.add('active');
          selectedIndex = -1;
        } else {
          dropdown.classList.remove('active');
        }
      }, 200);
    });

    // Keyboard navigation
    input.addEventListener('keydown', (e) => {
      const items = dropdown.querySelectorAll('.search-result-item');
      if (!items.length) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
        items.forEach((item, i) => item.classList.toggle('active', i === selectedIndex));
        if (items[selectedIndex]) items[selectedIndex].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, -1);
        items.forEach((item, i) => item.classList.toggle('active', i === selectedIndex));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex >= 0 && items[selectedIndex]) {
          items[selectedIndex].click();
        } else if (input.value.trim()) {
          dropdown.classList.remove('active');
        }
      } else if (e.key === 'Escape') {
        dropdown.classList.remove('active');
        input.blur();
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!input.closest('.nav-search').contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });

    // Keyboard shortcut
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        input.focus();
        input.select();
      }
    });
  };

  // Setup hero search
  const setupHeroSearch = () => {
    const input = document.getElementById('heroSearch');
    const dropdown = document.getElementById('heroSearchDropdown');
    if (!input) return;

    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const q = input.value.trim();
        if (q.length >= 1 && dropdown) {
          const results = search(q);

          if (results.length) {
            dropdown.innerHTML = `
              <div style="position:absolute;top:8px;left:0;right:0;background:var(--bg-card);border:1px solid var(--border-strong);border-radius:var(--radius-xl);box-shadow:var(--shadow-xl);padding:8px;z-index:100;">
                ${results.map(item => `
                  <a href="${item.url}" class="search-result-item"${item.url.startsWith('http') ? ' target="_blank" rel="noopener"' : ''}>
                    <div class="search-result-icon">${item.icon}</div>
                    <div>
                      <div class="search-result-name">${highlight(item.name, q)}</div>
                      <div class="search-result-cat">${item.category}</div>
                    </div>
                  </a>
                `).join('')}
              </div>
            `;
          } else {
            dropdown.innerHTML = '';
          }
        } else if (dropdown) {
          dropdown.innerHTML = '';
        }
      }, 200);
    });

    // Hero search button
    const heroBtn = document.querySelector('.hero-search-btn');
    if (heroBtn) {
      heroBtn.addEventListener('click', () => {
        const q = input.value.trim();
        if (q) {
          window.location.href = `#search?q=${encodeURIComponent(q)}`;
        }
      });
    }

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.hero-search') && dropdown) {
        dropdown.innerHTML = '';
      }
    });
  };

  // Fill search from tag
  window.fillSearch = (term) => {
    const heroInput = document.getElementById('heroSearch');
    if (heroInput) {
      heroInput.value = term;
      heroInput.dispatchEvent(new Event('input'));
      heroInput.focus();
    }
  };

  // Initialize
  const init = () => {
    setupNavSearch();
    setupHeroSearch();
  };

  return { init, search };
})();

document.addEventListener('DOMContentLoaded', () => {
  SearchModule.init();
});

window.SearchModule = SearchModule;
