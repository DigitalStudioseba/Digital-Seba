/**
 * DIGITAL SEBA - PDF Search Tool (Premium UX v2)
 * ----------------------------------------------------------------------
 * 100% client-side. Extracts text from user-uploaded PDFs with pdf.js
 * and lets the user search across them instantly, with Unicode support
 * (Bangla, English, and mixed text — whatever the PDF's own text layer
 * contains). Nothing is uploaded anywhere.
 *
 * NOTE ON "RECENT UPLOADS": true cross-session persistence of PDF
 * binary content is not realistic in a client-only tool (localStorage
 * is capped around 5-10MB and PDFs routinely exceed that). We persist
 * only lightweight METADATA (file name, size, page count, date) for a
 * "previously uploaded on this device" list — re-uploading the actual
 * file is required to search its contents again. This is the honest,
 * correct behavior for a no-backend tool, not a limitation we hide.
 */

'use strict';

(function () {
  if (window.pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }

  const state = {
    files: [],      // { id, name, size, numPages, pdf, thumbDataUrl }
    pages: [],      // { fileId, fileName, pageNum, text }
    activeFileFilter: 'all',
    query: ''
  };

  let uidCounter = 0;
  const nextId = () => 'pdf-' + (++uidCounter);

  const el = (id) => document.getElementById(id);
  const store = (key, fallback) => (window.App && App.storage) ? App.storage.get(key, fallback) : fallback;
  const persist = (key, val) => { if (window.App && App.storage) App.storage.set(key, val); };

  const setStatus = (msg) => { const s = el('pdfIndexingStatus'); if (s) s.textContent = msg; };

  const escapeHtml = (str) => str
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const highlight = (text, q) => {
    if (!q) return escapeHtml(text);
    const lower = text.toLowerCase();
    const ql = q.toLowerCase();
    let result = '', i = 0, idx;
    while ((idx = lower.indexOf(ql, i)) !== -1) {
      result += escapeHtml(text.slice(i, idx));
      result += '<span class="ds-highlight">' + escapeHtml(text.slice(idx, idx + q.length)) + '</span>';
      i = idx + q.length;
    }
    result += escapeHtml(text.slice(i));
    return result;
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // ---------- Progress bar ----------
  const showProgress = (percent, label) => {
    let bar = el('pdfProgressWrap');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'pdfProgressWrap';
      bar.style.marginTop = '14px';
      bar.innerHTML = `
        <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-muted);margin-bottom:6px;">
          <span id="pdfProgressLabel"></span><span id="pdfProgressPct"></span>
        </div>
        <div style="height:6px;border-radius:var(--radius-full);background:var(--bg-secondary);overflow:hidden;">
          <div id="pdfProgressFill" style="height:100%;width:0%;background:var(--gradient-primary);transition:width 0.2s ease;"></div>
        </div>`;
      el('pdfUploadZone').insertAdjacentElement('afterend', bar);
    }
    bar.style.display = 'block';
    el('pdfProgressLabel').textContent = label || '';
    el('pdfProgressPct').textContent = Math.round(percent) + '%';
    el('pdfProgressFill').style.width = Math.round(percent) + '%';
  };

  const hideProgress = () => {
    const bar = el('pdfProgressWrap');
    if (bar) bar.style.display = 'none';
  };

  // ---------- Search history ----------
  const getHistory = () => store('ds_pdf_search_history', []);
  const addToHistory = (q) => {
    if (!q.trim()) return;
    let history = getHistory().filter(h => h.toLowerCase() !== q.toLowerCase());
    history.unshift(q);
    history = history.slice(0, 8);
    persist('ds_pdf_search_history', history);
    renderHistory();
  };

  const renderHistory = () => {
    const wrap = el('pdfSearchHistory');
    if (!wrap) return;
    const history = getHistory();
    if (!history.length) { wrap.innerHTML = ''; return; }
    wrap.innerHTML = `<span style="font-size:12px;color:var(--text-muted);margin-right:4px;">Recent searches:</span>` +
      history.map(h => `<button type="button" class="tag" data-history="${escapeHtml(h)}">${escapeHtml(h)}</button>`).join('');
    wrap.querySelectorAll('[data-history]').forEach(btn => {
      btn.addEventListener('click', () => {
        el('pdfSearchInput').value = btn.dataset.history;
        state.query = btn.dataset.history;
        runSearch();
      });
    });
  };

  // ---------- Recently uploaded (metadata only) ----------
  const getRecentMeta = () => store('ds_pdf_recent_uploads', []);
  const addRecentMeta = (file, numPages) => {
    let recent = getRecentMeta().filter(r => r.name !== file.name);
    recent.unshift({ name: file.name, size: file.size, numPages, date: new Date().toISOString() });
    recent = recent.slice(0, 10);
    persist('ds_pdf_recent_uploads', recent);
    renderRecentMeta();
  };

  const renderRecentMeta = () => {
    const wrap = el('pdfRecentUploads');
    if (!wrap) return;
    const recent = getRecentMeta();
    if (!recent.length) { wrap.innerHTML = ''; return; }
    wrap.innerHTML = `<div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">📂 Previously uploaded on this device (re-upload to search again):</div>` +
      recent.map(r => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 10px;border-radius:var(--radius-md);background:var(--bg-secondary);font-size:12px;margin-bottom:6px;">
          <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:60%;">📄 ${escapeHtml(r.name)}</span>
          <span style="color:var(--text-muted);">${r.numPages}p · ${formatSize(r.size)}</span>
        </div>
      `).join('');
  };

  // ---------- Thumbnails ----------
  const renderThumbnail = async (pdf) => {
    try {
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 0.3 });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
      return canvas.toDataURL('image/png');
    } catch (e) {
      return null;
    }
  };

  // ---------- Rendering ----------
  const renderFileChips = () => {
    const wrap = el('pdfFileFilters');
    if (!wrap) return;
    if (!state.files.length) { wrap.innerHTML = ''; return; }

    const chips = ['all', ...state.files.map(f => f.id)];
    wrap.innerHTML = chips.map(id => {
      const isAll = id === 'all';
      const file = isAll ? null : state.files.find(f => f.id === id);
      const label = isAll ? '📚 All Files' : `📄 ${file.name}`;
      const active = state.activeFileFilter === id;
      return `<button type="button" class="tag${active ? ' active' : ''}" data-file="${id}">${label}</button>`;
    }).join('');

    wrap.querySelectorAll('.tag').forEach(btn => {
      btn.addEventListener('click', () => {
        state.activeFileFilter = btn.dataset.file;
        renderFileChips();
        runSearch();
      });
    });
  };

  const renderUploadedList = () => {
    const list = el('pdfUploadedList');
    const clearBtn = el('pdfClearBtn');
    if (!list) return;

    list.innerHTML = state.files.map(f => `
      <div class="gov-card" style="padding:12px 16px;display:flex;align-items:center;justify-content:space-between;gap:10px;">
        <div style="display:flex;align-items:center;gap:10px;min-width:0;">
          ${f.thumbDataUrl
            ? `<img src="${f.thumbDataUrl}" alt="First page thumbnail of ${escapeHtml(f.name)}" style="width:36px;height:48px;object-fit:cover;border-radius:4px;border:1px solid var(--border);">`
            : `<span style="font-size:20px;">📄</span>`}
          <div style="min-width:0;">
            <div style="font-weight:600;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:200px;">${escapeHtml(f.name)}</div>
            <div style="font-size:11px;color:var(--text-muted);">${f.numPages} page${f.numPages !== 1 ? 's' : ''} · ${formatSize(f.size)}</div>
          </div>
        </div>
        <span class="badge badge-success">Indexed</span>
      </div>
    `).join('');

    if (clearBtn) clearBtn.style.display = state.files.length ? 'inline-flex' : 'none';
  };

  const renderResults = () => {
    const list = el('pdfResultsList');
    const countEl = el('pdfResultsCount');
    if (!list) return;

    if (!state.files.length) {
      list.innerHTML = `<div style="text-align:center;padding:40px 20px;color:var(--text-muted);"><div style="font-size:40px;margin-bottom:10px;">📄</div><div>Upload a PDF and start typing to search.</div></div>`;
      if (countEl) countEl.textContent = '';
      return;
    }

    if (!state.query.trim()) {
      list.innerHTML = `<div style="text-align:center;padding:40px 20px;color:var(--text-muted);"><div style="font-size:40px;margin-bottom:10px;">⌨️</div><div>Type a keyword above to search your uploaded PDFs.</div></div>`;
      if (countEl) countEl.textContent = '';
      return;
    }

    const q = state.query.trim();
    const ql = q.toLowerCase();

    let matches = state.pages.filter(p =>
      (state.activeFileFilter === 'all' || p.fileId === state.activeFileFilter) &&
      p.text.toLowerCase().includes(ql)
    );

    if (countEl) countEl.textContent = `${matches.length} match${matches.length !== 1 ? 'es' : ''} found`;

    if (!matches.length) {
      list.innerHTML = `<div style="text-align:center;padding:40px 20px;color:var(--text-muted);"><div style="font-size:40px;margin-bottom:10px;">🔍</div><div>No matches found.</div></div>`;
      return;
    }

    list.innerHTML = matches.slice(0, 100).map((m, i) => {
      const idx = m.text.toLowerCase().indexOf(ql);
      const start = Math.max(0, idx - 60);
      const end = Math.min(m.text.length, idx + q.length + 60);
      const snippet = (start > 0 ? '… ' : '') + m.text.slice(start, end) + (end < m.text.length ? ' …' : '');

      return `
        <div class="gov-card" style="padding:14px 16px;cursor:pointer;animation-delay:${Math.min(i, 8) * 0.03}s;" data-file-id="${m.fileId}" data-page="${m.pageNum}" data-action="jump" tabindex="0" role="button" aria-label="Jump to page ${m.pageNum} of ${m.fileName}">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <span class="badge badge-primary">📄 ${escapeHtml(m.fileName)}</span>
            <span class="badge" style="background:var(--bg-secondary);color:var(--text-muted);">Page ${m.pageNum}</span>
          </div>
          <div style="font-size:13px;line-height:1.5;">${highlight(snippet, q)}</div>
        </div>
      `;
    }).join('');

    if (matches.length > 100 && countEl) {
      countEl.textContent += ' (showing first 100)';
    }
  };

  const runSearch = () => {
    renderResults();
    if (state.query.trim()) addToHistory(state.query.trim());
  };

  const jumpToPage = async (fileId, pageNum) => {
    const file = state.files.find(f => f.id === fileId);
    if (!file) return;

    const previewCard = el('pdfPreviewCard');
    const info = el('pdfPreviewInfo');
    const canvas = el('pdfPreviewCanvas');
    if (!previewCard || !canvas) return;

    previewCard.style.display = 'block';
    info.textContent = `${file.name} — Page ${pageNum} of ${file.numPages}`;
    previewCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    try {
      const page = await file.pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.4 });
      const ctx = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: ctx, viewport }).promise;
    } catch (e) {
      info.textContent = `Could not render page ${pageNum} of ${file.name}.`;
    }
  };

  const indexFile = async (file, fileIndex, totalFiles) => {
    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    const fileId = nextId();
    const thumbDataUrl = await renderThumbnail(pdf);
    const entry = { id: fileId, name: file.name, size: file.size, numPages: pdf.numPages, pdf, thumbDataUrl };
    state.files.push(entry);

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const text = content.items.map(it => it.str).join(' ');
      state.pages.push({ fileId, fileName: file.name, pageNum: i, text });

      const overallPct = ((fileIndex + i / pdf.numPages) / totalFiles) * 100;
      showProgress(overallPct, `Indexing "${file.name}" — page ${i}/${pdf.numPages}`);
    }

    addRecentMeta(file, pdf.numPages);
    renderUploadedList();
    renderFileChips();
  };

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList).filter(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
    if (!files.length) return;

    el('pdfSearchInput').disabled = true;
    showProgress(0, 'Starting…');

    for (let idx = 0; idx < files.length; idx++) {
      try {
        await indexFile(files[idx], idx, files.length);
      } catch (e) {
        setStatus(`⚠️ Could not read "${files[idx].name}" — it may be corrupted or password-protected.`);
      }
    }

    hideProgress();
    el('pdfSearchInput').disabled = state.files.length === 0;
    runSearch();
  };

  const clearAll = () => {
    state.files = [];
    state.pages = [];
    state.activeFileFilter = 'all';
    state.query = '';
    el('pdfSearchInput').value = '';
    el('pdfSearchInput').disabled = true;
    el('pdfPreviewCard').style.display = 'none';
    renderUploadedList();
    renderFileChips();
    renderResults();
    setStatus('');
    hideProgress();
  };

  const init = () => {
    const zone = el('pdfUploadZone');
    const input = el('pdfFileInput');
    const searchInput = el('pdfSearchInput');
    const resultsList = el('pdfResultsList');
    const clearBtn = el('pdfClearBtn');

    if (!zone || !window.pdfjsLib) return;

    zone.addEventListener('click', () => input.click());
    zone.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); } });
    input.addEventListener('change', (e) => handleFiles(e.target.files));

    ['dragenter', 'dragover'].forEach(evt => {
      zone.addEventListener(evt, (e) => { e.preventDefault(); zone.classList.add('dragover'); });
    });
    ['dragleave', 'drop'].forEach(evt => {
      zone.addEventListener(evt, (e) => { e.preventDefault(); zone.classList.remove('dragover'); });
    });
    zone.addEventListener('drop', (e) => {
      if (e.dataTransfer?.files?.length) handleFiles(e.dataTransfer.files);
    });

    searchInput.addEventListener('input', () => {
      state.query = searchInput.value;
      renderResults();
    });
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') runSearch();
    });

    resultsList.addEventListener('click', (e) => {
      const card = e.target.closest('[data-action="jump"]');
      if (!card) return;
      jumpToPage(card.dataset.fileId, Number(card.dataset.page));
    });
    resultsList.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const card = e.target.closest('[data-action="jump"]');
      if (!card) return;
      e.preventDefault();
      jumpToPage(card.dataset.fileId, Number(card.dataset.page));
    });

    clearBtn.addEventListener('click', clearAll);

    renderHistory();
    renderRecentMeta();
  };

  document.addEventListener('DOMContentLoaded', init);
})();
