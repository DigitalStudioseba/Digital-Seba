/**
 * resources-render.js
 * Unified Renderer & Pagination logic for Drive Links
 */

document.addEventListener('DOMContentLoaded', () => {
    if (!window.allFiles) return;

    const driveState = {
        services: { items: [], count: 0 },
        links: { items: [], count: 0 },
        downloads: { items: [], count: 0 },
        jobs: { items: [], count: 0 }
    };

    function getIconForExt(ext) {
        const icons = {
            'PDF': '📑', 'DOC': '📝', 'PPT': '📊', 'XLS': '📈', 'ZIP': '🗂️',
            'IMG': '🖼️', 'VIDEO': '🎬', 'AUDIO': '🎵', 'VECTOR': '🎨', 'FILE': '🔗'
        };
        return icons[ext] || '🔗';
    }

    function getColorForExt(ext) {
        const colors = {
            'PDF': '#ef4444', 'DOC': '#3b82f6', 'PPT': '#f97316', 'XLS': '#10b981', 'ZIP': '#8b5cf6',
            'IMG': '#ec4899', 'VIDEO': '#f43f5e', 'AUDIO': '#8b5cf6', 'VECTOR': '#d946ef', 'FILE': '#64748b'
        };
        return colors[ext] || '#64748b';
    }

    function escapeHTML(str) {
        if (!str) return '';
        return String(str).replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[c]));
    }

    function sanitizeResourceUrl(url) {
        if (!url || typeof url !== 'string') return null;
        const trimmed = url.trim();
        if (!trimmed) return null;

        // Reject backslashes anywhere in the URL (prevents scheme bypass and host confusion)
        if (trimmed.includes('\\')) return null;

        // Reject protocol-relative URLs starting with //
        if (trimmed.startsWith('//')) return null;

        // Reject control characters
        if (/[\x00-\x1F\x7F]/.test(trimmed)) return null;

        // Permit same-origin root-relative paths starting with a single '/' followed by a valid path character
        if (/^\/[a-zA-Z0-9_\-.~%#?&=]/.test(trimmed)) {
            return trimmed;
        }

        // Permit strictly http: or https: absolute URLs
        try {
            const parsed = new URL(trimmed);
            if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
                return null;
            }
            if (!parsed.hostname || parsed.hostname.length === 0) {
                return null;
            }
            return parsed.href;
        } catch (_) {
            return null;
        }
    }

    function highlightTextDrive(text, q) {
        if (!text) return '';
        const str = String(text);
        const trimmedQ = (q || '').trim();
        if (!trimmedQ) return escapeHTML(str);

        try {
            const escapedQ = trimmedQ.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const reg = new RegExp(escapedQ, 'gi');
            let result = '';
            let lastIndex = 0;
            let match;

            while ((match = reg.exec(str)) !== null) {
                result += escapeHTML(str.slice(lastIndex, match.index));
                result += `<mark class="drive-highlight">${escapeHTML(match[0])}</mark>`;
                lastIndex = match.index + match[0].length;
                if (!match[0].length) {
                    reg.lastIndex++;
                }
            }
            result += escapeHTML(str.slice(lastIndex));
            return result;
        } catch (_) {
            return escapeHTML(str);
        }
    }

    function renderDriveCategory(catName, gridId, filterQuery) {
        const grid = document.getElementById(gridId);
        if (!grid || !driveState[catName]) return;

        const q = (filterQuery || '').toLowerCase().trim();

        // 1. Filter the dataset correctly mapped to this category tab
        const items = window.allFiles.filter(item => {
            if (item.category !== catName) return false;
            if (!q) return true;
            const searchStr = `${item.title_en} ${item.title_bn} ${item.title} ${item.folder} ${item.ext}`.toLowerCase();
            return searchStr.includes(q);
        });
        
        // 1.5 Strictly sort by sourceOrder to maintain exact 1-to-1 logical grouping and sequence
        items.sort((a, b) => a.sourceOrder - b.sourceOrder);

        driveState[catName].items = items;
        driveState[catName].count = 0;

        // 2. Remove old load more button
        const block = document.querySelector(`.res-category-block[data-category="${catName}"]`);
        if (block) {
            const oldBtn = block.querySelector('.drive-load-more-container');
            if (oldBtn) oldBtn.remove();
        }

        // 3. Render initial chunk (50 items)
        appendDriveItems(catName, gridId, 50);
    }

    window.appendDriveItems = function(catName, gridId, limit) {
        const grid = document.getElementById(gridId);
        if (!grid) return;

        const state = driveState[catName];
        const itemsToRender = state.items.slice(state.count, state.count + limit);
        const lang = (window.LanguageManager && window.LanguageManager.get()) || 'en';
        const q = (document.getElementById('heroSearch')?.value || '').toLowerCase().trim();

        const fragment = document.createDocumentFragment();

        // We use state to track the last rendered folder for visual grouping
        let lastFolderRendered = state.lastFolder || null;

        itemsToRender.forEach(item => {
            // Check if we need to insert a folder group header
            if (item.folder !== lastFolderRendered) {
                const header = document.createElement('div');
                header.className = 'drive-folder-header';
                header.style.cssText = 'width: 100%; grid-column: 1 / -1; margin-top: 25px; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 2px solid rgba(0,0,0,0.05); font-size: 16px; font-weight: 700; color: #374151; display: flex; align-items: center; gap: 8px;';
                header.innerHTML = `<span>📁</span> ${escapeHTML(item.folder)}`;
                fragment.appendChild(header);
                lastFolderRendered = item.folder;
            }

            const safeUrl = sanitizeResourceUrl(item.url);
            let card;
            if (safeUrl) {
                card = document.createElement('a');
                card.href = safeUrl;
                card.className = 'mode-card-btn drive-link-card';
                card.target = '_blank';
                card.rel = 'noopener noreferrer';
            } else {
                card = document.createElement('div');
                card.className = 'mode-card-btn drive-link-card';
                card.style.setProperty('cursor', 'not-allowed');
                card.style.setProperty('opacity', '0.6');
                card.setAttribute('aria-disabled', 'true');
                card.setAttribute('title', 'Resource link unavailable');
            }
            card.style.setProperty('--btn-color', getColorForExt(item.ext));

            const title = (lang === 'bn' && item.title_bn) ? item.title_bn : (item.title_en || item.title || 'Untitled');
            const highlightedTitle = q.length >= 1 ? highlightTextDrive(title, q) : escapeHTML(title);
            // Removed folder badge from card text since we have folder headers now, making cards cleaner

            card.innerHTML = `
                <i class="mode-icon font-normal" style="font-size: 26px; font-style: normal;">${getIconForExt(item.ext)}</i>
                <span style="font-weight: 800; font-size: 14px; text-align: center; line-height: 1.3; margin-top: 8px; display: block;">
                    ${highlightedTitle}
                </span>
            `;
            fragment.appendChild(card);
        });

        state.lastFolder = lastFolderRendered;

        grid.appendChild(fragment);
        state.count += itemsToRender.length;

        // Update or create Load More button
        const block = document.querySelector(`.res-category-block[data-category="${catName}"]`);
        if (block) {
            let btnContainer = block.querySelector('.drive-load-more-container');

            if (state.count < state.items.length) {
                const remaining = state.items.length - state.count;
                if (!btnContainer) {
                    btnContainer = document.createElement('div');
                    btnContainer.className = 'drive-load-more-container';
                    btnContainer.style.cssText = 'width: 100%; text-align: center; margin: 30px 0 10px; clear: both; display: flex; justify-content: center;';
                    const btn = document.createElement('button');
                    btn.className = 'res-tab-btn active';
                    btn.style.cssText = 'padding: 10px 24px; cursor: pointer;';
                    btn.innerHTML = `<i class="fa-solid fa-angle-down"></i> Load More (${remaining} left)`;
                    btn.onclick = () => window.appendDriveItems(catName, gridId, 50);
                    btnContainer.appendChild(btn);
                    block.appendChild(btnContainer);
                } else {
                    const btn = btnContainer.querySelector('button');
                    if (btn) btn.innerHTML = `<i class="fa-solid fa-angle-down"></i> Load More (${remaining} left)`;
                }
            } else {
                if (btnContainer) btnContainer.remove();
            }
        }
    };

    // Clean Interception of Original renderCategory
    if (typeof window.renderCategory === 'function') {
        const originalRenderCategory = window.renderCategory;
        window.renderCategory = function (catName, gridId, filterQuery = '') {
            // 1. Let the original run (it clears grid & appends Master Items)
            originalRenderCategory(catName, gridId, filterQuery);
            // 2. Reset lastFolder state when re-rendering from scratch
            if (driveState[catName]) driveState[catName].lastFolder = null;
            // 3. Append Drive Items cleanly without wiping
            renderDriveCategory(catName, gridId, filterQuery);
        };
    }

    // Clean Interception of Original filterResourcesMaster
    if (typeof window.filterResourcesMaster === 'function') {
        const originalFilterMaster = window.filterResourcesMaster;
        window.filterResourcesMaster = function () {
            // Let the original function run
            originalFilterMaster();
            
            // Fix the "No matches found" message logic to account for Drive files
            const hasItems = document.querySelectorAll('.mode-card-btn').length > 0;
            const noMsg = document.getElementById('noResMsg');
            if (noMsg) {
                const q = document.getElementById('heroSearch')?.value || '';
                noMsg.style.display = (!hasItems && q.length > 0) ? 'block' : 'none';
            }
        };
    }

    // Since DOMContentLoaded might have already fired for the inline script, trigger initial render
    if (typeof window.filterResourcesMaster === 'function') {
        window.filterResourcesMaster();
    }
});
