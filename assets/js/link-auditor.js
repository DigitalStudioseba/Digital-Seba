/**
 * Link Auditor PRO - Digital Seba
 * Fully rebuilt core logic for advanced diagnostics, table rendering, bulk actions, and exports.
 */

let auditItems = [];
let activeFilter = 'all';
let searchQuery = '';
let CONCURRENCY_LIMIT = 20;
let isAuditing = false;
let stopRequested = false;
let processedCount = 0;

// Utility functions
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function updateStats() {
    document.getElementById('stat-total').textContent = auditItems.length;
    document.getElementById('stat-progress').textContent = processedCount;
    
    let working = 0, dead = 0, m3u8 = 0, mpd = 0, unknown = 0, totalLatency = 0, latCount = 0;
    
    auditItems.forEach(item => {
        if (item.status === 'online' || item.status === 'cors') working++;
        if (item.status === 'offline') dead++;
        if (item.status === 'timeout') unknown++;
        if (item.type === 'M3U8') m3u8++;
        if (item.type === 'MPD' || item.type === 'Video') mpd++;
        if (item.latency > 0) { totalLatency += item.latency; latCount++; }
    });

    document.getElementById('stat-working').textContent = working;
    document.getElementById('stat-dead').textContent = dead;
    document.getElementById('stat-m3u8').textContent = m3u8;
    document.getElementById('stat-mpd').textContent = mpd;
    document.getElementById('stat-unknown').textContent = unknown;
    
    let avgLat = latCount > 0 ? Math.round(totalLatency / latCount) : 0;
    document.getElementById('stat-latency').textContent = avgLat + 'ms';
    
    let progressPercent = auditItems.length === 0 ? 0 : Math.round((processedCount / auditItems.length) * 100);
    document.getElementById('progress-fill').style.width = progressPercent + '%';
}

function parseM3U(rawText) {
    const lines = rawText.split('\n');
    const items = [];
    let currentName = "";
    let currentLogo = "";
    
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (!line) continue;
        
        if (line.startsWith('#EXTINF:')) {
            let nameMatch = line.match(/,(.*)$/);
            currentName = nameMatch ? nameMatch[1].trim() : "Unknown Stream";
            
            let logoMatch = line.match(/tvg-logo="([^"]+)"/i);
            currentLogo = logoMatch ? logoMatch[1].trim() : "";
        } else if (!line.startsWith('#')) {
            items.push({
                id: 'item_' + Math.random().toString(36).substr(2, 9),
                name: currentName || line.split('/').pop() || 'Untitled',
                url: line,
                logo: currentLogo,
                type: detectTypeFromUrl(line),
                status: 'pending',
                code: '-',
                latency: 0,
                resolution: '-',
                codec: '-',
                selected: false
            });
            currentName = "";
            currentLogo = "";
        }
    }
    return items;
}

function detectTypeFromUrl(url) {
    let lower = url.toLowerCase();
    if (lower.includes('.m3u8')) return 'M3U8';
    if (lower.includes('.mpd')) return 'MPD';
    if (lower.includes('.mp4') || lower.includes('.ts') || lower.includes('.mkv')) return 'Video';
    if (lower.includes('.mp3') || lower.includes('.aac')) return 'Audio';
    return 'Unknown';
}

function startBulkAudit() {
    const input = document.getElementById('m3u-input').value.trim();
    if (!input) {
        alert("Please paste some URLs or an M3U playlist.");
        return;
    }
    
    if (isAuditing) {
        stopRequested = true;
        document.getElementById('run-btn').innerHTML = 'Stopping...';
        return;
    }
    
    auditItems = parseM3U(input);
    if (auditItems.length === 0) {
        alert("No valid URLs found.");
        return;
    }
    
    isAuditing = true;
    stopRequested = false;
    processedCount = 0;
    
    document.getElementById('run-btn').innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg> Stop Audit';
    
    renderTable();
    updateStats();
    processQueue();
}

async function processQueue() {
    let index = 0;
    
    async function worker() {
        while (index < auditItems.length && !stopRequested) {
            let currentIndex = index++;
            let item = auditItems[currentIndex];
            
            if (item.status === 'pending') {
                await checkLink(item);
                processedCount++;
                updateStats();
                updateRowDOM(item);
            } else {
                processedCount++;
            }
        }
    }
    
    const workers = [];
    for (let i = 0; i < CONCURRENCY_LIMIT; i++) {
        workers.push(worker());
    }
    
    await Promise.all(workers);
    
    isAuditing = false;
    document.getElementById('run-btn').innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> Start Audit';
}

async function checkLink(item) {
    const startTime = performance.now();
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout
        
        let response = await fetch(item.url, {
            method: 'GET',
            mode: 'cors',
            signal: controller.signal
        });
        clearTimeout(timeout);
        
        item.latency = Math.round(performance.now() - startTime);
        item.code = response.status;
        
        if (response.ok) {
            item.status = 'online';
            
            if (item.type === 'M3U8') {
                try {
                    let text = await response.text();
                    let resMatch = text.match(/RESOLUTION=(\d+x\d+)/);
                    if (resMatch) item.resolution = resMatch[1];
                    let codecMatch = text.match(/CODECS="([^"]+)"/);
                    if (codecMatch) item.codec = codecMatch[1].split(',')[0];
                } catch(e) {}
            }
        } else {
            item.status = 'offline';
        }
    } catch (error) {
        item.latency = Math.round(performance.now() - startTime);
        if (error.name === 'AbortError') {
            item.status = 'timeout';
            item.code = 'TIMEOUT';
        } else {
            try {
                const controller2 = new AbortController();
                const timeout2 = setTimeout(() => controller2.abort(), 5000);
                let fallback = await fetch(item.url, { method: 'GET', mode: 'no-cors', signal: controller2.signal });
                clearTimeout(timeout2);
                item.status = 'cors';
                item.code = 'CORS';
            } catch (err2) {
                item.status = 'offline';
                item.code = 'ERROR';
            }
        }
    }
}

// UI Rendering
function renderTable() {
    const tbody = document.getElementById('console-logs');
    tbody.innerHTML = '';
    
    const filtered = auditItems.filter(item => {
        let matchSearch = item.url.toLowerCase().includes(searchQuery) || item.name.toLowerCase().includes(searchQuery);
        let matchFilter = true;
        if (activeFilter === 'online') matchFilter = (item.status === 'online' || item.status === 'cors');
        else if (activeFilter === 'dead') matchFilter = (item.status === 'offline');
        else if (activeFilter === 'timeout') matchFilter = (item.status === 'timeout');
        else if (activeFilter === 'm3u8') matchFilter = (item.type === 'M3U8');
        else if (activeFilter === 'mpd') matchFilter = (item.type === 'MPD');
        else if (activeFilter === 'video') matchFilter = (item.type === 'Video');
        
        return matchSearch && matchFilter;
    });
    
    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding: 40px; color: var(--text-muted);">No results found.</td></tr>`;
        return;
    }
    
    let html = '';
    filtered.forEach(item => {
        html += generateRowHTML(item);
    });
    
    tbody.innerHTML = html;
}

function updateRowDOM(item) {
    const row = document.getElementById(`row-${item.id}`);
    if (row) {
        row.outerHTML = generateRowHTML(item);
    }
}

function generateRowHTML(item) {
    let statusBadge = '';
    if (item.status === 'pending') statusBadge = `<span class="status-badge" style="background:#27272a; color:#a1a1aa;">Pending</span>`;
    else if (item.status === 'online') statusBadge = `<span class="status-badge online">Online</span>`;
    else if (item.status === 'cors') statusBadge = `<span class="status-badge cors">CORS</span>`;
    else if (item.status === 'offline') statusBadge = `<span class="status-badge offline">Offline</span>`;
    else if (item.status === 'timeout') statusBadge = `<span class="status-badge timeout">Timeout</span>`;
    
    let logoHtml = item.logo ? `<img src="${escapeHtml(item.logo)}" class="logo-img" onerror="this.src='../assets/images/logo.png'">` : `<div class="logo-img"></div>`;
    
    return `
    <tr id="row-${item.id}">
        <td style="text-align:center;"><input type="checkbox" class="row-checkbox" data-id="${item.id}" ${item.selected ? 'checked' : ''} onchange="toggleSelect('${item.id}', this.checked)"></td>
        <td>${logoHtml}</td>
        <td>
            <div style="font-weight:600; font-size:0.9rem;">${escapeHtml(item.name)}</div>
            <div class="text-truncate" title="${escapeHtml(item.url)}" style="font-size:0.75rem; color:var(--text-muted);">${escapeHtml(item.url)}</div>
        </td>
        <td><span class="type-badge">${item.type}</span></td>
        <td>${statusBadge}</td>
        <td style="font-family:monospace; font-size:0.8rem;">${item.code}</td>
        <td>${item.latency > 0 ? item.latency + 'ms' : '-'}</td>
        <td>${item.resolution}</td>
        <td>${item.codec}</td>
        <td style="text-align:right; white-space:nowrap;">
            <button class="btn-icon" title="Preview" onclick="openPreview('${escapeHtml(item.url)}', '${escapeHtml(item.type)}')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            </button>
            <button class="btn-icon" title="Copy URL" onclick="navigator.clipboard.writeText('${escapeHtml(item.url)}')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            </button>
            <button class="btn-icon" title="Retry" onclick="retryItem('${item.id}')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M3 22v-6h6"></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path></svg>
            </button>
            <button class="btn-icon" title="Delete" style="color:var(--text-muted);" onclick="deleteItem('${item.id}')" onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color='var(--text-muted)'">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
        </td>
    </tr>
    `;
}

// Interaction Handlers
function toggleSelectAll() {
    let checked = document.getElementById('selectAllCheckbox').checked;
    auditItems.forEach(item => item.selected = checked);
    renderTable();
}

function toggleSelect(id, checked) {
    let item = auditItems.find(i => i.id === id);
    if (item) item.selected = checked;
}

function deleteItem(id) {
    auditItems = auditItems.filter(i => i.id !== id);
    updateStats();
    renderTable();
}

function retryItem(id) {
    let item = auditItems.find(i => i.id === id);
    if (item) {
        item.status = 'pending';
        item.code = '-';
        item.latency = 0;
        updateRowDOM(item);
        checkLink(item).then(() => {
            updateStats();
            updateRowDOM(item);
        });
    }
}

function applyOutputFilters() {
    searchQuery = document.getElementById('search-filter').value.toLowerCase();
    renderTable();
}

function changeActiveFilter(filter, el) {
    activeFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    renderTable();
}

// Bulk Actions
function getTargetItems(target) {
    if (target === 'selected') return auditItems.filter(i => i.selected);
    if (target === 'online') return auditItems.filter(i => i.status === 'online' || i.status === 'cors');
    if (target === 'offline') return auditItems.filter(i => i.status === 'offline');
    if (target === 'timeout') return auditItems.filter(i => i.status === 'timeout');
    if (target === 'invalid') return auditItems.filter(i => i.status === 'offline' || i.status === 'timeout');
    return auditItems;
}

function bulkAction(action, target) {
    let items = getTargetItems(target);
    if (items.length === 0) return alert('No items match this criteria.');
    
    if (action === 'copy') {
        let text = items.map(i => i.url).join('\n');
        navigator.clipboard.writeText(text).then(() => alert(`Copied ${items.length} URLs.`));
    } else if (action === 'remove') {
        let idsToRemove = new Set(items.map(i => i.id));
        auditItems = auditItems.filter(i => !idsToRemove.has(i.id));
        updateStats();
        renderTable();
        document.getElementById('selectAllCheckbox').checked = false;
    }
}

function exportResults(format) {
    if (auditItems.length === 0) return alert('No data to export.');
    
    let content = '';
    let mime = 'text/plain';
    let ext = format;
    
    if (format === 'txt') {
        content = auditItems.map(i => i.url).join('\n');
    } else if (format === 'm3u') {
        content = '#EXTM3U\n' + auditItems.map(i => `#EXTINF:-1 tvg-logo="${i.logo}",${i.name}\n${i.url}`).join('\n');
    } else if (format === 'csv') {
        mime = 'text/csv';
        content = 'Name,URL,Type,Status,Code,Latency,Resolution,Codec\n' + 
                  auditItems.map(i => `"${i.name}","${i.url}","${i.type}","${i.status}","${i.code}","${i.latency}","${i.resolution}","${i.codec}"`).join('\n');
    } else if (format === 'json') {
        mime = 'application/json';
        content = JSON.stringify(auditItems, null, 2);
    }
    
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `link_auditor_export_${new Date().toISOString().slice(0,10)}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Live Preview
let hlsInstance = null;
let mpegtsInstance = null;

function openPreview(url, type) {
    const modal = document.getElementById('preview-modal');
    const video = document.getElementById('preview-video');
    const loading = document.getElementById('preview-loading');
    
    document.getElementById('preview-modal-title').textContent = 'Preview: ' + url;
    modal.style.display = 'flex';
    loading.style.display = 'block';
    
    cleanupPlayer();
    
    if (type === 'M3U8' && window.Hls && Hls.isSupported()) {
        hlsInstance = new Hls();
        hlsInstance.loadSource(url);
        hlsInstance.attachMedia(video);
        hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
            loading.style.display = 'none';
            video.play().catch(e => console.log('Autoplay blocked', e));
        });
        hlsInstance.on(Hls.Events.ERROR, () => {
            loading.textContent = 'Playback Error';
        });
    } else if ((type === 'MPD' || type === 'Video') && window.mpegts && mpegts.isSupported()) {
        if(url.endsWith('.mp4')) {
            video.src = url;
            video.onloadeddata = () => { loading.style.display = 'none'; video.play(); };
        } else {
            mpegtsInstance = mpegts.createPlayer({ type: type === 'MPD' ? 'dash' : 'mse', url: url, isLive: true });
            mpegtsInstance.attachMediaElement(video);
            mpegtsInstance.load();
            mpegtsInstance.play().then(() => loading.style.display = 'none').catch(e => loading.textContent = 'Error');
        }
    } else {
        video.src = url;
        video.onloadeddata = () => { loading.style.display = 'none'; video.play(); };
        video.onerror = () => { loading.textContent = 'Format not supported or CORS blocked.'; };
    }
}

function cleanupPlayer() {
    const video = document.getElementById('preview-video');
    if (hlsInstance) { hlsInstance.destroy(); hlsInstance = null; }
    if (mpegtsInstance) { mpegtsInstance.destroy(); mpegtsInstance = null; }
    video.src = '';
    video.removeAttribute('src');
    video.load();
}

function closePreviewModal() {
    document.getElementById('preview-modal').style.display = 'none';
    cleanupPlayer();
}