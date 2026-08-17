// bootstrap.js
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('tv-search');
  const categoryTabs = document.getElementById('category-tabs');
  const channelGrid = document.getElementById('channel-grid');
  const videoPlayer = document.getElementById('video-player');
  
  // Load channels and init UI
  window.channelCatalog.loadCatalog((channels) => {
    window.uiRenderer.renderCategories(channels, categoryTabs, searchInput);
    window.uiRenderer.renderGrid(channels, channelGrid);
    
    const lastUrl = localStorage.getItem('ds_last_channel_url');
    let startChannel = channels.find(c => c.url === lastUrl) || channels[0];
    if (startChannel && window.streamPlayer) window.streamPlayer.playChannel(startChannel);
  });

  // Search logic
  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('.cat-tab').forEach(b => b.classList.remove('active'));
    window.channelCatalog.activeCategoryGroup = 'Search';
    const channels = window.channelCatalog.allChannels;
    const filtered = channels.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.category.toLowerCase().includes(q) || 
        c.country.toLowerCase().includes(q)
    );
    window.uiRenderer.renderGrid(filtered, channelGrid);
  });
  
  // Connect UI controls
  document.getElementById('btn-play-pause').onclick = () => {
    if (videoPlayer.paused) { videoPlayer.play(); window.streamPlayer.updatePlayPauseUI(true); }
    else { videoPlayer.pause(); window.streamPlayer.updatePlayPauseUI(false); }
  };

  const muteBtn = document.getElementById('btn-mute');
  const volSlider = document.getElementById('volume-slider');
  muteBtn.onclick = () => {
    videoPlayer.muted = !videoPlayer.muted;
    if (videoPlayer.muted) {
      muteBtn.innerHTML = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>;
      volSlider.value = 0;
    } else {
      muteBtn.innerHTML = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>;
      volSlider.value = 1;
      videoPlayer.volume = 1;
    }
  };
  volSlider.oninput = (e) => { videoPlayer.volume = e.target.value; videoPlayer.muted = e.target.value == 0; };
  
  document.getElementById('btn-fullscreen').onclick = () => {
    const pw = document.getElementById('player-wrapper');
    if (!document.fullscreenElement) pw.requestFullscreen().catch(err=>console.error(err));
    else document.exitFullscreen();
  };
  
  let uiTimeout = null;
  const pw = document.getElementById('player-wrapper');
  pw.addEventListener('mousemove', () => {
    pw.classList.add('active-ui');
    clearTimeout(uiTimeout);
    uiTimeout = setTimeout(() => { if(!videoPlayer.paused) pw.classList.remove('active-ui'); }, 3000);
  });
  pw.addEventListener('mouseleave', () => { if(!videoPlayer.paused) pw.classList.remove('active-ui'); });
});
