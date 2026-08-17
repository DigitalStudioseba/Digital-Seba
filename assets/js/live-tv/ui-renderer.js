// ui-renderer.js
function getFallbackLogo(name, category) {
  const char = (name.trim()[0] || 'C').toUpperCase();
  const colors = { 'Sports': '#ef4444', 'News': '#3b82f6', 'Movies': '#8b5cf6', 'Entertainment': '#ec4899', 'Kids': '#f59e0b', 'Music': '#10b981', 'Documentary': '#14b8a6', 'Islamic': '#059669' };
  let color = '#6366f1';
  for(let k in colors) {
     if (category && category.toLowerCase().includes(k.toLowerCase())) { color = colors[k]; break; }
  }
  const svg = <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" rx="16" fill="" /><text x="50%" y="54%" font-family="sans-serif" font-size="36" font-weight="bold" fill="#ffffff" text-anchor="middle" dominant-baseline="middle"></text></svg>;
  return 'data:image/svg+xml;base64,' + btoa(svg);
}

function renderCategories(channels, categoryTabs, searchInput) {
  const presentGroups = [...new Set(channels.map(c => c.group_priority))].sort((a,b) => a - b);
  categoryTabs.innerHTML = '';
  
  const allBtn = document.createElement('button');
  allBtn.className = 'cat-tab active';
  allBtn.textContent = "All Channels";
  allBtn.onclick = () => {
    document.querySelectorAll('.cat-tab').forEach(b => b.classList.remove('active'));
    allBtn.classList.add('active');
    window.channelCatalog.activeCategoryGroup = 'All';
    searchInput.value = '';
    renderGrid(channels, document.getElementById('channel-grid'));
  };
  categoryTabs.appendChild(allBtn);

  presentGroups.forEach(gp => {
    const groupName = window.channelCatalog.categoryGroupsMap[gp] || "Others";
    const btn = document.createElement('button');
    btn.className = 'cat-tab';
    btn.textContent = groupName;
    btn.onclick = () => {
      document.querySelectorAll('.cat-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      window.channelCatalog.activeCategoryGroup = gp;
      searchInput.value = '';
      const filtered = channels.filter(c => c.group_priority === gp);
      renderGrid(filtered, document.getElementById('channel-grid'));
    };
    categoryTabs.appendChild(btn);
  });
}

function renderGrid(channels, channelGrid) {
  channelGrid.innerHTML = '';
  if (channels.length === 0) {
     channelGrid.innerHTML = '<p style="color:var(--text-muted); grid-column: 1/-1; text-align:center; padding: 40px;">No channels found.</p>';
     return;
  }
  const fragment = document.createDocumentFragment();
  channels.forEach(ch => {
    const isPlaying = window.streamPlayer && window.streamPlayer.currentChannel && window.streamPlayer.currentChannel.url === ch.url;
    const card = document.createElement('div');
    card.className = 'channel-card' + (isPlaying ? ' playing' : '');
    card.onclick = () => {
      if (window.streamPlayer) window.streamPlayer.playChannel(ch, card);
    };
    const safeLogo = ch.logo || getFallbackLogo(ch.name, ch.category);
    card.innerHTML = 
      <img src="" alt="" loading="lazy" onerror="this.src=''">
      <p class="channel-card-name"></p>
      <div style="display:flex; gap:6px; margin-top: auto;">
          <span class="quality-badge"></span>
          <span class="quality-badge" style="background:var(--primary); color:white;"></span>
      </div>
    ;
    fragment.appendChild(card);
  });
  channelGrid.appendChild(fragment);
}

function updateInfoPanel(ch) {
  document.getElementById('info-name').textContent = ch.name;
  const safeLogo = ch.logo || getFallbackLogo(ch.name, ch.category);
  const infoLogo = document.getElementById('info-logo');
  infoLogo.src = safeLogo;
  infoLogo.style.display = 'block';
  
  const c = document.getElementById('info-country');
  const cat = document.getElementById('info-category');
  if (ch.country) { c.textContent = ch.country; c.style.display = 'block'; } else c.style.display = 'none';
  if (ch.category) { cat.textContent = ch.category; cat.style.display = 'block'; } else cat.style.display = 'none';
  document.getElementById('info-live').style.display = 'flex';
}

function showSpinner() { document.getElementById('player-spinner').style.display = 'block'; }
function hideSpinner() { document.getElementById('player-spinner').style.display = 'none'; }
function showError(msg) { const e = document.getElementById('player-error'); e.textContent = msg; e.style.display = 'block'; }
function hideError() { document.getElementById('player-error').style.display = 'none'; }

window.uiRenderer = { renderCategories, renderGrid, updateInfoPanel, showSpinner, hideSpinner, showError, hideError, getFallbackLogo };
