/**
 * DIGITAL SEBA - Resources Hub (Full Resource Center) v3
 * - Fully data-driven from assets/data/resources.json (title_en/title_bn,
 *   description_en/description_bn, category, icon, badge, type).
 * - Bangla/English switches automatically with LanguageManager.
 * - Uses event delegation (one listener on the grid) instead of per-card
 *   inline handlers for better performance and fewer duplicate listeners.
 * - No resource is ever hardcoded in HTML.
 */

'use strict';

const ResourcesModule = (() => {
  let allResources = [];
  let favorites = [];
  let recentlyVisited = [];
  let popularity = {};
  let state = { search: '', categories: [], type: 'All', sort: 'popular', special: null };
  let listenersBound = false;

  // Fallback only — every resource already carries its own icon + category_icon,
  // this exists purely so a malformed future entry can never render blank.
  const CATEGORY_ICON_FALLBACK = {
    'Passport': '🛂', 'NID': '🆔', 'Birth Certificate': '📜', 'Land Services': '🏞️',
    'Police Services': '🚓', 'BRTA': '🚗', 'BMET': '✈️', 'Visa Services': '🌍',
    'Medical Report': '💊', 'Board Result': '📊', 'University Admission': '🎓',
    'Education': '🎓', 'Scholarship': '💰', 'Government Services': '🏛️',
    'PDF Tools': '📄', 'Photo Editing Tools': '🖼️', 'Adobe Software': '🎨',
    'Microsoft Office': '💻', 'Video Editing': '🎬', 'Software Download': '📥',
    'Fonts Collection': '🔤', 'Templates': '📝', 'Google Drive Collections': '📁',
    'File Sharing': '☁️', 'Utility Websites': '🔧', 'Live TV': '📺'
  };

  const QUICK_FILTERS = {
    'software-download': ['Software Download', 'Adobe Software', 'Microsoft Office', 'Video Editing'],
    'government': ['Government Services'],
    'applications': ['Government Services', 'BRTA', 'Police Services', 'BMET'],
    'education': ['Education', 'University Admission', 'Board Result', 'Scholarship'],
    'nid-passport': ['NID', 'Passport'],
    'visa': ['Visa Services'],
    'police': ['Police Services'],
    'land': ['Land Services'],
    'medical': ['Medical Report'],
    'photo-editing': ['Photo Editing Tools'],
    'pdf-tools': ['PDF Tools'],
    'file-sharing': ['File Sharing', 'Google Drive Collections'],
    'fonts': ['Fonts Collection'],
    'adobe': ['Adobe Software'],
    'ai-tools': [],
    'utilities': ['Utility Websites'],
    'templates': ['Templates'],
    'downloads': ['Software Download', 'Adobe Software', 'Microsoft Office', 'Video Editing', 'Fonts Collection', 'Templates', 'Google Drive Collections']
  };

  const isBangla = () => (window.LanguageManager && LanguageManager.get) ? LanguageManager.get() === 'bn' : false;
  const icon = (r) => r.icon || r.category_icon || CATEGORY_ICON_FALLBACK[r.category] || '🔗';
  const title = (r) => (isBangla() ? (r.title_bn || r.title_en || r.title) : (r.title_en || r.title));
  const desc = (r) => (isBangla() ? (r.description_bn || r.description_en || r.description) : (r.description_en || r.description));

  const store = (key, fallback) => (window.App && App.storage) ? App.storage.get(key, fallback) : fallback;
  const persist = (key, val) => { if (window.App && App.storage) App.storage.set(key, val); };

  const loadLocalState = () => {
    favorites = store('ds_resource_favorites', []);
    recentlyVisited = store('ds_resource_recent', []);
    popularity = store('ds_resource_popularity', {});
  };

  const trackVisit = (id) => {
    popularity[id] = (popularity[id] || 0) + 1;
    persist('ds_resource_popularity', popularity);
    recentlyVisited = [id, ...recentlyVisited.filter(x => x !== id)].slice(0, 12);
    persist('ds_resource_recent', recentlyVisited);
  };

  const toggleFavorite = (id, btnEl) => {
    const idx = favorites.indexOf(id);
    if (idx >= 0) favorites.splice(idx, 1);
    else favorites.push(id);
    persist('ds_resource_favorites', favorites);
    if (btnEl) {
      btnEl.classList.remove('pop');
      void btnEl.offsetWidth;
      btnEl.classList.add('pop');
    }
    render();
  };

  const copyLink = (url, btn) => {
    if (window.App && App.copyToClipboard) App.copyToClipboard(url);
    else navigator.clipboard?.writeText(url);
    if (btn) {
      const original = btn.innerHTML;
      btn.innerHTML = '✅ Copied';
      btn.setAttribute('aria-live', 'polite');
      setTimeout(() => { btn.innerHTML = original; }, 1500);
    }
  };

  const shareResource = (t, url) => {
    if (navigator.share) navigator.share({ title: t, url }).catch(() => {});
    else copyLink(url);
  };

  // ---- simple typo tolerance: Levenshtein distance ----
  const levenshtein = (a, b) => {
    if (a === b) return 0;
    const al = a.length, bl = b.length;
    if (!al) return bl;
    if (!bl) return al;
    const dp = Array.from({ length: al + 1 }, (_, i) => [i, ...Array(bl).fill(0)]);
    for (let j = 0; j <= bl; j++) dp[0][j] = j;
    for (let i = 1; i <= al; i++) {
      for (let j = 1; j <= bl; j++) {
        dp[i][j] = a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
      }
    }
    return dp[al][bl];
  };

  const fuzzyMatch = (text, q) => {
    if (!text) return false;
    const lower = text.toLowerCase();
    if (lower.includes(q)) return true;
    if (q.length >= 4) {
      return lower.split(/\s+/).some(word => levenshtein(word, q) <= 1);
    }
    return false;
  };

  const highlight = (text, q) => {
    if (!q || !text) return text;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text;
    return text.slice(0, idx) + '<span class="ds-highlight">' + text.slice(idx, idx + q.length) + '</span>' + text.slice(idx + q.length);
  };

  const buildFilters = () => {
    const categories = ['All', ...new Set(allResources.map(r => r.category))].sort((a, b) => a === 'All' ? -1 : a.localeCompare(b));
    const catWrap = document.getElementById('resourceCategoryFilters');
    if (catWrap) {
      catWrap.innerHTML = categories.map(c => {
        const active = c === 'All' ? state.categories.length === 0 && !state.special : state.categories.length === 1 && state.categories[0] === c;
        const ic = c === 'All' ? '🗂️' : (CATEGORY_ICON_FALLBACK[c] || '🔗');
        return `<button type="button" class="tag${active ? ' active' : ''}" data-cat="${c}" role="button" aria-pressed="${active}">${ic} ${c === 'All' ? 'All Categories' : c}</button>`;
      }).join('');
    }
  };

  const applyFilters = () => {
    let list = allResources.slice();

    if (state.special === 'favorites') {
      list = list.filter(r => favorites.includes(r.id));
    } else if (state.special === 'recent') {
      list = recentlyVisited.map(id => allResources.find(r => r.id === id)).filter(Boolean);
    }

    if (state.categories.length) {
      list = list.filter(r => state.categories.includes(r.category));
    }

    if (state.type !== 'All') {
      list = list.filter(r => r.type === state.type);
    }

    if (state.search.trim()) {
      const q = state.search.toLowerCase().trim();
      list = list.filter(r =>
        fuzzyMatch(r.title_en || r.title, q) ||
        fuzzyMatch(r.title_bn, q) ||
        fuzzyMatch(r.category, q) ||
        fuzzyMatch(r.description_en || r.description, q) ||
        fuzzyMatch(r.description_bn, q) ||
        fuzzyMatch(r.type, q) ||
        fuzzyMatch(r.badge, q)
      );
    }

    if (state.special !== 'recent') {
      if (state.sort === 'alphabetical') {
        list.sort((a, b) => title(a).localeCompare(title(b)));
      } else if (state.sort === 'recent') {
        list.sort((a, b) => b.id - a.id);
      } else {
        list.sort((a, b) => (popularity[b.id] || 0) - (popularity[a.id] || 0) || (favorites.includes(b.id) ? 1 : 0) - (favorites.includes(a.id) ? 1 : 0));
      }
    }

    return list;
  };

  const cardHTML = (r) => {
    const isFav = favorites.includes(r.id);
    const badgeClass = r.type === 'download' ? 'badge-success' : 'badge-primary';
    const q = state.search.trim();
    const t = title(r);
    const d = desc(r);
    const tHtml = q ? highlight(t, q) : t;
    const dHtml = q ? highlight(d, q) : d;
    const favLabel = isFav ? 'Remove from favorites' : 'Add to favorites';
    return `
      <div class="gov-card resource-card" data-id="${r.id}" data-url="${r.url}" data-title="${t.replace(/"/g, '&quot;')}">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;">
          <div class="gov-icon" role="img" aria-label="${r.category}">${icon(r)}</div>
          <button type="button" class="btn-ghost fav-btn" data-action="favorite" aria-label="${favLabel}" aria-pressed="${isFav}" style="font-size:18px;line-height:1;padding:4px 8px;">${isFav ? '⭐' : '☆'}</button>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;">
          <span class="badge ${badgeClass}">${r.badge}</span>
          <span class="badge" style="background:var(--bg-secondary);color:var(--text-muted);">${r.category}</span>
          ${popularity[r.id] ? `<span class="badge" style="background:var(--bg-secondary);color:var(--text-muted);">🔥 ${popularity[r.id]}</span>` : ''}
        </div>
        <h3 title="${t.replace(/"/g, '&quot;')}">${tHtml}</h3>
        <p class="ds-clamp">${dHtml}</p>
        <div class="gov-links" style="flex-wrap:wrap;">
          <a href="${r.url}" target="_blank" rel="noopener" class="gov-link" data-action="open" aria-label="Open ${t} website">🌐 Open Website</a>
          ${r.type === 'download' ? `<a href="${r.url}" target="_blank" rel="noopener" class="gov-link" data-action="open" aria-label="Download ${t}">⬇️ Download</a>` : ''}
          <button type="button" class="gov-link" data-action="copy" aria-label="Copy link for ${t}" style="cursor:pointer;border:1px solid rgba(37,99,235,0.2);">🔗 Copy Link</button>
          <button type="button" class="gov-link" data-action="share" aria-label="Share ${t}" style="cursor:pointer;border:1px solid rgba(37,99,235,0.2);">📤 Share</button>
        </div>
      </div>
    `;
  };

  const renderStats = () => {
    const wrap = document.getElementById('resourceStats');
    if (!wrap) return;
    const total = allResources.length;
    const totalCats = new Set(allResources.map(r => r.category)).size;
    const latest = allResources.reduce((a, b) => (b.id > a.id ? b : a), allResources[0]);
    const popularEntries = Object.entries(popularity).sort((a, b) => b[1] - a[1]);
    const mostPopular = popularEntries.length
      ? allResources.find(r => r.id === Number(popularEntries[0][0]))
      : null;

    wrap.innerHTML = `
      <div class="stat-card">
        <div class="stat-icon" aria-hidden="true">📚</div>
        <div><span class="stat-number">${total}</span></div>
        <div class="stat-label">Total Resources</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" aria-hidden="true">🗂️</div>
        <div><span class="stat-number">${totalCats}</span></div>
        <div class="stat-label">Total Categories</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" aria-hidden="true">🆕</div>
        <div style="font-size:15px;font-weight:700;color:var(--text-primary);">${latest ? title(latest) : '—'}</div>
        <div class="stat-label">Latest Added</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" aria-hidden="true">🔥</div>
        <div style="font-size:15px;font-weight:700;color:var(--text-primary);">${mostPopular ? title(mostPopular) : 'Browse to rank!'}</div>
        <div class="stat-label">Most Popular</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" aria-hidden="true">⏱️</div>
        <div><span class="stat-number" style="font-size:22px;">${recentlyVisited.length}</span></div>
        <div class="stat-label">Recently Visited</div>
      </div>
    `;
  };

  const render = () => {
    const grid = document.getElementById('resourcesGrid');
    const countEl = document.getElementById('resourcesCount');
    if (!grid) return;

    const list = applyFilters();

    if (countEl) countEl.textContent = `${list.length} resource${list.length !== 1 ? 's' : ''} found`;

    if (!list.length) {
      grid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-muted);">
          <div style="font-size:48px;margin-bottom:12px;" aria-hidden="true">🔍</div>
          <div style="font-size:16px;">No resources found. Try a different search or filter.</div>
        </div>
      `;
    } else {
      grid.innerHTML = list.map(cardHTML).join('');
    }

    buildFilters();
    renderStats();

    const favBtn = document.getElementById('resourceFavToggle');
    if (favBtn) { favBtn.classList.toggle('active', state.special === 'favorites'); favBtn.setAttribute('aria-pressed', state.special === 'favorites'); }
    const recentBtn = document.getElementById('resourceRecentToggle');
    if (recentBtn) { recentBtn.classList.toggle('active', state.special === 'recent'); recentBtn.setAttribute('aria-pressed', state.special === 'recent'); }
  };

  // ---- Event delegation: one listener per interactive region, not per card ----
  const bindDelegatedEvents = () => {
    if (listenersBound) return;
    listenersBound = true;

    const grid = document.getElementById('resourcesGrid');
    if (grid) {
      grid.addEventListener('click', (e) => {
        const actionEl = e.target.closest('[data-action]');
        if (!actionEl) return;
        const card = e.target.closest('.resource-card');
        if (!card) return;
        const id = Number(card.dataset.id);
        const url = card.dataset.url;
        const t = card.dataset.title;
        const action = actionEl.dataset.action;

        if (action === 'open') trackVisit(id);
        else if (action === 'favorite') toggleFavorite(id, actionEl);
        else if (action === 'copy') copyLink(url, actionEl);
        else if (action === 'share') shareResource(t, url);
      });
    }

    const catWrap = document.getElementById('resourceCategoryFilters');
    if (catWrap) {
      catWrap.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-cat]');
        if (!btn) return;
        state.special = null;
        state.categories = btn.dataset.cat === 'All' ? [] : [btn.dataset.cat];
        render();
      });
    }

    const typeWrap = document.getElementById('resourceTypeFilters');
    if (typeWrap) {
      typeWrap.addEventListener('click', (e) => {
        const btn = e.target.closest('.tag');
        if (!btn) return;
        typeWrap.querySelectorAll('.tag').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.type = btn.dataset.type;
        render();
      });
    }

    const qfWrap = document.getElementById('resourceQuickFilters');
    if (qfWrap) {
      qfWrap.addEventListener('click', (e) => {
        const btn = e.target.closest('.tag');
        if (!btn) return;
        qfWrap.querySelectorAll('.tag').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.special = null;
        const qf = btn.dataset.qf;
        state.categories = qf === 'all' ? [] : (QUICK_FILTERS[qf] || []);
        render();
      });
    }

    const searchInput = document.getElementById('resourceSearch');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        state.search = searchInput.value;
        render();
      });
    }

    const sortSelect = document.getElementById('resourceSort');
    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        state.sort = sortSelect.value;
        render();
      });
    }

    const favBtn = document.getElementById('resourceFavToggle');
    if (favBtn) {
      favBtn.addEventListener('click', () => {
        state.special = state.special === 'favorites' ? null : 'favorites';
        state.categories = [];
        render();
      });
    }

    const recentBtn = document.getElementById('resourceRecentToggle');
    if (recentBtn) {
      recentBtn.addEventListener('click', () => {
        state.special = state.special === 'recent' ? null : 'recent';
        state.categories = [];
        render();
      });
    }

    // Re-render (language only, not re-fetch) when the existing language toggle fires
    window.addEventListener('languageChanged', render);
  };

  const init = () => {
    loadLocalState();

    const params = new URLSearchParams(window.location.search);
    const catParam = params.get('cat');
    const qfParam = params.get('qf');
    const sortParam = params.get('sort');

    fetch('../../assets/data/resources.json')
      .then(r => r.json())
      .then(data => {
        allResources = data;

        if (catParam) {
          const match = allResources.find(r => r.category.toLowerCase() === catParam.toLowerCase());
          if (match) state.categories = [match.category];
        } else if (qfParam && QUICK_FILTERS[qfParam]) {
          state.categories = QUICK_FILTERS[qfParam];
        }
        if (sortParam) state.sort = sortParam;

        bindDelegatedEvents();
        render();
      })
      .catch(() => {
        const grid = document.getElementById('resourcesGrid');
        if (grid) grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text-muted);">⚠️ Could not load resources. Please refresh the page.</div>';
      });
  };

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => ResourcesModule.init());
