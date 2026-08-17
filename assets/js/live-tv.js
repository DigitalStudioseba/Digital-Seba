document.addEventListener('DOMContentLoaded', () => {
  const m3uUrl = '../assets/data/channels.m3u';
  let allChannels = [];
  let currentChannel = null;
  let activeCategoryGroup = 'All';
  let hls = null;
  let uiTimeout = null;
  
  // DOM Elements
  const videoPlayer = document.getElementById('video-player');
  const iframeContainer = document.getElementById('iframe-container');
  const playerWrapper = document.getElementById('player-wrapper');
  
  const channelGrid = document.getElementById('channel-grid');
  const categoryTabs = document.getElementById('category-tabs');
  const searchInput = document.getElementById('tv-search');
  
  // Player UI Elements
  const playPauseBtn = document.getElementById('btn-play-pause');
  const muteBtn = document.getElementById('btn-mute');
  const fullscreenBtn = document.getElementById('btn-fullscreen');
  const volumeSlider = document.getElementById('volume-slider');
  const spinner = document.getElementById('player-spinner');
  const errorMsg = document.getElementById('player-error');

  // Persistent Info Panel
  const infoLogo = document.getElementById('info-logo');
  const infoName = document.getElementById('info-name');
  const infoCountry = document.getElementById('info-country');
  const infoCategory = document.getElementById('info-category');
  const infoLive = document.getElementById('info-live');

  // Parse M3U
  function parseM3U(data) {
    const lines = data.split('\n');
    const channels = [];
    let currentChannel = {};

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      if (line.startsWith('#EXTINF:')) {
        currentChannel = {};
        
        // Extract Logo
        const logoMatch = line.match(/tvg-logo="([^"]*)"/i);
        currentChannel.logo = logoMatch ? logoMatch[1] : '';
        
        // Extract Group/Category
        const groupMatch = line.match(/group-title="([^"]*)"/i);
        currentChannel.category = groupMatch ? groupMatch[1] : 'Others';
        
        // Extract Country
        const countryMatch = line.match(/tvg-country="([^"]*)"/i);
        currentChannel.country = countryMatch ? countryMatch[1] : '';
        
        // Extract Name (after the comma)
        const nameParts = line.split(',');
        currentChannel.name = nameParts.length > 1 ? nameParts[1].trim() : 'Unknown Channel';
        
      } else if (!line.startsWith('#')) {
        // It's a stream URL
        if (currentChannel.name) {
          currentChannel.url = line;
          
          // Determine master priority grouping based on country/category strings
          let prio = 10;
          let catUpper = currentChannel.category.toUpperCase();
          let ctryUpper = currentChannel.country.toUpperCase();
          
          if (ctryUpper.includes('BANGLADESH') || catUpper.includes('BANGLA')) prio = 1;
          else if (ctryUpper.includes('INDIA') || catUpper.includes('INDIA')) prio = 2;
          else if (catUpper.includes('SPORT') || catUpper.includes('CRICKET') || catUpper.includes('FOOTBALL')) prio = 3;
          else if (catUpper.includes('MUSIC')) prio = 4;
          else if (catUpper.includes('MOVIE') || catUpper.includes('ENTERTAIN')) prio = 5;
          else if (catUpper.includes('INTERNAT') || catUpper.includes('WORLD')) prio = 6;
          else if (catUpper.includes('KID') || catUpper.includes('CARTOON')) prio = 7;
          else if (catUpper.includes('RELIGI') || catUpper.includes('ISLAM')) prio = 8;
          else prio = 9;
          
          currentChannel.group_priority = prio;
          channels.push(currentChannel);
          currentChannel = {};
        }
      }
    }
    return channels;
  }

  // Fetch Channels
  fetch(m3uUrl)
    .then(res => res.text())
    .then(data => {
      allChannels = parseM3U(data);
      console.log(Parsed  channels from M3U.);
      renderCategories();
      renderGrid(allChannels); // Default load all
      
      // Load last watched or first
      const lastWatchedId = localStorage.getItem('ds_last_channel_url');
      let startChannel = allChannels.find(c => c.url === lastWatchedId) || allChannels[0];
      if (startChannel) playChannel(startChannel);
    })
    .catch(err => {
      console.error("Failed to load channels", err);
      showError("Failed to load M3U playlist.");
    });

  // Render Categories (Tabs)
  function renderCategories() {
    const categoryGroups = {
      1: "???? Bangladesh",
      2: "???? India",
      3: "? Sports",
      4: "?? Music",
      5: "?? Movies",
      6: "?? International",
      7: "?? Kids",
      8: "?? Religious",
      9: "Others",
      10: "Uncategorized"
    };
    
    const presentGroups = [...new Set(allChannels.map(c => c.group_priority))].sort((a,b) => a - b);
    
    categoryTabs.innerHTML = '';
    
    // "All" tab
    const allBtn = document.createElement('button');
    allBtn.className = 'cat-tab active';
    allBtn.textContent = "All Channels";
    allBtn.onclick = () => {
      document.querySelectorAll('.cat-tab').forEach(b => b.classList.remove('active'));
      allBtn.classList.add('active');
      activeCategoryGroup = 'All';
      searchInput.value = '';
      renderGrid(allChannels);
    };
    categoryTabs.appendChild(allBtn);

    presentGroups.forEach(gp => {
      const groupName = categoryGroups[gp] || "Others";
      const btn = document.createElement('button');
      btn.className = 'cat-tab';
      btn.textContent = groupName;
      btn.onclick = () => {
        document.querySelectorAll('.cat-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategoryGroup = gp;
        searchInput.value = '';
        const filtered = allChannels.filter(c => c.group_priority === gp);
        renderGrid(filtered);
      };
      categoryTabs.appendChild(btn);
    });
  }

  // Fallback Logo Generator
  function getFallbackLogo(name, category) {
    const char = (name.trim()[0] || 'C').toUpperCase();
    const colors = { 'Sports': '#ef4444', 'News': '#3b82f6', 'Movies': '#8b5cf6', 'Entertainment': '#ec4899', 'Kids': '#f59e0b', 'Music': '#10b981', 'Documentary': '#14b8a6', 'Islamic': '#059669' };
    
    let color = '#6366f1';
    for(let k in colors) {
       if (category && category.toLowerCase().includes(k.toLowerCase())) {
          color = colors[k];
          break;
       }
    }
    
    const svg = <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" rx="16" fill="" /><text x="50%" y="54%" font-family="sans-serif" font-size="36" font-weight="bold" fill="#ffffff" text-anchor="middle" dominant-baseline="middle"></text></svg>;
    return 'data:image/svg+xml;base64,' + btoa(svg);
  }

  // Render Grid
  function renderGrid(channels) {
    channelGrid.innerHTML = '';
    
    if (channels.length === 0) {
       channelGrid.innerHTML = '<p style="color:var(--text-muted); grid-column: 1/-1; text-align:center; padding: 40px;">No channels found.</p>';
       return;
    }

    // Use fragment for performance
    const fragment = document.createDocumentFragment();

    channels.forEach(ch => {
      const isPlaying = currentChannel && currentChannel.url === ch.url;
      const card = document.createElement('div');
      card.className = 'channel-card' + (isPlaying ? ' playing' : '');
      card.onclick = () => playChannel(ch, card);
      
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

  // Global Search filter
  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('.cat-tab').forEach(b => b.classList.remove('active'));
    activeCategoryGroup = 'Search';
    
    const filtered = allChannels.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.category.toLowerCase().includes(q) || 
        c.country.toLowerCase().includes(q)
    );
    renderGrid(filtered);
  });

  // Play Channel
  function playChannel(ch, cardElement = null) {
    if (!ch) return;
    currentChannel = ch;
    
    // Update active card styling
    document.querySelectorAll('.channel-card').forEach(c => c.classList.remove('playing'));
    if (cardElement) {
        cardElement.classList.add('playing');
    }
    
    // Update Persistent Info Panel
    infoName.textContent = ch.name;
    const safeLogo = ch.logo || getFallbackLogo(ch.name, ch.category);
    infoLogo.src = safeLogo;
    infoLogo.style.display = 'block';
    
    if (ch.country) {
        infoCountry.textContent = ch.country;
        infoCountry.style.display = 'block';
    } else {
        infoCountry.style.display = 'none';
    }
    
    if (ch.category) {
        infoCategory.textContent = ch.category;
        infoCategory.style.display = 'block';
    } else {
        infoCategory.style.display = 'none';
    }
    infoLive.style.display = 'flex';
    
    // Update old player overlay
    const currentNameOld = document.getElementById('current-name');
    const currentLogoOld = document.getElementById('current-logo');
    if (currentNameOld) currentNameOld.textContent = ch.name;
    if (currentLogoOld) currentLogoOld.src = safeLogo;
    
    localStorage.setItem('ds_last_channel_url', ch.url);
    
    showSpinner();
    hideError();
    
    if (hls) {
      hls.destroy();
      hls = null;
    }

    videoPlayer.muted = true;
    
    if (Hls.isSupported() && ch.url.includes('.m3u8')) {
      hls = new Hls({
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 10,
        maxLiveSyncPlaybackRate: 1.5,
        enableWorker: true,
        lowLatencyMode: true,
        autoStartLoad: true
      });
      
      hls.loadSource(ch.url);
      hls.attachMedia(videoPlayer);
      
      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        console.log("HLS Debug - Manifest Loaded");
        
        let hasVideo = false;
        if (data.levels && data.levels.length > 0) {
           hasVideo = data.levels.some(level => level.videoCodec || (level.width && level.height));
        }
        
        if (!hasVideo && hls.audioTracks && hls.audioTracks.length > 0) {
           hideSpinner();
           showError("Audio only stream");
        } else {
           hideSpinner();
        }
        
        videoPlayer.play().catch(e => console.log("Auto-play prevented", e));
        updatePlayPauseUI(true);
      });
      
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hideSpinner();
              showError("Stream offline.");
              hls.destroy();
              break;
          }
        }
      });
    } 
    else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
      // Native Safari
      videoPlayer.muted = true;
      videoPlayer.src = ch.url;
      videoPlayer.addEventListener('loadedmetadata', () => {
        hideSpinner();
        videoPlayer.play().catch(e => console.log("Auto-play prevented", e));
        updatePlayPauseUI(true);
      });
      videoPlayer.addEventListener('error', () => {
        hideSpinner();
        showError("Stream error.");
      });
    }
  }

  // --- UI CONTROLS ---

  function showSpinner() { spinner.style.display = 'block'; }
  function hideSpinner() { spinner.style.display = 'none'; }
  function showError(msg) { errorMsg.textContent = msg; errorMsg.style.display = 'block'; }
  function hideError() { errorMsg.style.display = 'none'; }

  function updatePlayPauseUI(isPlaying) {
    playPauseBtn.innerHTML = isPlaying 
      ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
      : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>;
  }

  playPauseBtn.onclick = () => {
    if (videoPlayer.paused) {
      videoPlayer.play();
      updatePlayPauseUI(true);
    } else {
      videoPlayer.pause();
      updatePlayPauseUI(false);
    }
  };

  muteBtn.onclick = () => {
    videoPlayer.muted = !videoPlayer.muted;
    if (videoPlayer.muted) {
      muteBtn.innerHTML = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>;
      volumeSlider.value = 0;
    } else {
      muteBtn.innerHTML = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>;
      volumeSlider.value = 1;
      videoPlayer.volume = 1;
    }
  };

  volumeSlider.oninput = (e) => {
    videoPlayer.volume = e.target.value;
    videoPlayer.muted = e.target.value == 0;
  };

  fullscreenBtn.onclick = () => {
    if (!document.fullscreenElement) {
      playerWrapper.requestFullscreen().catch(err => {
        console.error("Fullscreen err", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  playerWrapper.addEventListener('mousemove', () => {
    playerWrapper.classList.add('active-ui');
    clearTimeout(uiTimeout);
    uiTimeout = setTimeout(() => {
      if(!videoPlayer.paused) playerWrapper.classList.remove('active-ui');
    }, 3000);
  });
  
  playerWrapper.addEventListener('mouseleave', () => {
    if(!videoPlayer.paused) playerWrapper.classList.remove('active-ui');
  });

});
