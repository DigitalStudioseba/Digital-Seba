// stream-player.js
let hls = null;
let currentChannel = null;

function playChannel(ch, cardElement = null) {
  if (!ch) return;
  currentChannel = ch;
  
  document.querySelectorAll('.channel-card').forEach(c => c.classList.remove('playing'));
  if (cardElement) cardElement.classList.add('playing');
  
  window.uiRenderer.updateInfoPanel(ch);
  localStorage.setItem('ds_last_channel_url', ch.url);
  
  window.uiRenderer.showSpinner();
  window.uiRenderer.hideError();
  
  const videoPlayer = document.getElementById('video-player');
  if (hls) { hls.destroy(); hls = null; }
  videoPlayer.muted = true;
  
  if (Hls.isSupported() && ch.url.includes('.m3u8')) {
    hls = new Hls({ liveSyncDurationCount: 3, liveMaxLatencyDurationCount: 10, maxLiveSyncPlaybackRate: 1.5, enableWorker: true, lowLatencyMode: true, autoStartLoad: true });
    hls.loadSource(ch.url);
    hls.attachMedia(videoPlayer);
    
    hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
      let hasVideo = false;
      if (data.levels && data.levels.length > 0) hasVideo = data.levels.some(level => level.videoCodec || (level.width && level.height));
      if (!hasVideo && hls.audioTracks && hls.audioTracks.length > 0) {
         window.uiRenderer.hideSpinner();
         window.uiRenderer.showError("Audio only stream");
      } else window.uiRenderer.hideSpinner();
      
      videoPlayer.play().catch(e => console.log("Auto-play prevented", e));
      updatePlayPauseUI(true);
    });
    
    hls.on(Hls.Events.ERROR, (event, data) => {
      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR: hls.startLoad(); break;
          case Hls.ErrorTypes.MEDIA_ERROR: hls.recoverMediaError(); break;
          default: window.uiRenderer.hideSpinner(); window.uiRenderer.showError("Stream offline."); hls.destroy(); break;
        }
      }
    });
  } 
  else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
    videoPlayer.src = ch.url;
    videoPlayer.addEventListener('loadedmetadata', () => {
      window.uiRenderer.hideSpinner();
      videoPlayer.play().catch(e => console.log("Auto-play prevented", e));
      updatePlayPauseUI(true);
    });
    videoPlayer.addEventListener('error', () => { window.uiRenderer.hideSpinner(); window.uiRenderer.showError("Stream error."); });
  }
}

function updatePlayPauseUI(isPlaying) {
  const btn = document.getElementById('btn-play-pause');
  btn.innerHTML = isPlaying 
    ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
    : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>;
}

window.streamPlayer = { playChannel, updatePlayPauseUI, get currentChannel() { return currentChannel; } };
