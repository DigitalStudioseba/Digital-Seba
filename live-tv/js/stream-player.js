/* ==========================================
   stream-player.js — HLS/MPEG-TS/native player, controls, quality, and stats
   ========================================== */

// ── State
let hls = null;
let mpegtsPlayer = null;
let activeId = null;
let currentChannel = null;
let muted = false;
let activeStreamIdx = 0;
let retryCount = 0;
let subtitleEnabled = false;
const MAX_RETRIES = 2;
let statsInterval = null;
let clickTimeout = null;
let playTimeoutTimer = null;
const STREAM_LOAD_TIMEOUT_MS = 10000;   // ← reduced from 12s → 10s for faster failover
let isEmbedActive = false;

// ── Embed Watchdog & Fallback State
let embedWatchdogTimer = null;
let embedCountdownInterval = null;
let userInteractedWithEmbed = false;
let embedWatchdogSecondsLeft = 12;
const EMBED_LOAD_TIMEOUT_SECONDS = 12;

// ── Working stream cache (survives page session; reset on stream failure)
// Maps "channelId:streamIdx" → true  (validated working this session)
const _workingStreamCache = new Map();
function _cacheStreamOk(id, idx) { _workingStreamCache.set(`${id}:${idx}`, true); }
function _isStreamCached(id, idx) { return _workingStreamCache.has(`${id}:${idx}`); }
function _evictStreamCache(id) {
  // Remove all entries for this channel so a failed stream isn't reused
  for (const k of _workingStreamCache.keys()) {
    if (k.startsWith(`${id}:`)) _workingStreamCache.delete(k);
  }
}

// ── Channel-level fallback: find the next playable channel in the same category
function findNextChannelInCategory(currentId) {
  let found = false;
  for (const cat of (window.CHANNELS_DATA?.categories || [])) {
    for (const ch of cat.channels) {
      if (found && ch.id !== currentId) return ch;
      if (ch.id === currentId) found = true;
    }
  }
  // Wrap-around: return the first channel of that category
  for (const cat of (window.CHANNELS_DATA?.categories || [])) {
    if (cat.channels.some(c => c.id === currentId)) {
      const first = cat.channels.find(c => c.id !== currentId);
      return first || null;
    }
  }
  return null;
}

function triggerChannelFallback(fromId) {
  const next = findNextChannelInCategory(fromId);
  if (!next) return false;
  toast('Current channel is unavailable. Switching to next channel...', 3500);
  // Small delay so the toast is readable before the UI refreshes
  setTimeout(() => loadChannel(next.id, 0), 800);
  return true;
}


// ── Proxy Configuration
// If your site is hosted on HTTPS, HTTP stream links will fail due to mixed content.
// You can define a default proxy URL here or configure it via local storage:
// localStorage.setItem("iptv-proxy-url", "https://your-proxy.workers.dev/?url=")
// ── Shared Helpers
function resetPlayerState() {
  // Fully destroy HLS instance — prevents duplicate instances & audio overlap
  if (hls) {
    try { hls.stopLoad(); } catch (e) {}
    try { hls.detachMedia(); } catch (e) {}
    try { hls.destroy(); } catch (e) {}
    hls = null;
  }
  // Fully destroy MpegTS instance
  if (mpegtsPlayer) {
    try { mpegtsPlayer.pause(); } catch (e) {}
    try { mpegtsPlayer.unload(); } catch (e) {}
    try { mpegtsPlayer.detachMediaElement(); } catch (e) {}
    try { mpegtsPlayer.destroy(); } catch (e) {}
    mpegtsPlayer = null;
  }
  // Hard-reset the video element to stop any lingering audio
  if (typeof $video !== "undefined" && $video) {
    $video.pause();
    $video.removeAttribute("src");
    $video.load();
  }
  stopStatsInterval();
  clearPlayTimeoutWatchdog();
}

// handleStreamError: tries next backup stream, then triggers channel-level fallback
function handleStreamError(detail) {
  if (!activeId) return;
  clearPlayTimeoutWatchdog();
  _evictStreamCache(activeId); // mark this channel's streams as unvalidated

  const savedId = activeId;
  const ch = findChannel(savedId);
  if (ch) {
    const streams = getStreams(ch);
    if (activeStreamIdx + 1 < streams.length) {
      const nextIdx = activeStreamIdx + 1;
      toast(`Stream failed. Switching to backup ${streams[nextIdx].label}...`);
      // No delay for backup switching — instant failover
      activeStreamIdx = nextIdx;
      if (activeId === savedId) loadChannel(savedId, nextIdx);
      return;
    }
    // All backups exhausted — try next channel in category
    showLoad(false);
    markChannelOffline(savedId);
    if (!triggerChannelFallback(savedId)) {
      showErr(detail || 'Stream error');
    }
    return;
  }
  showLoad(false);
  showErr(detail || 'Stream error');
}

const DEFAULT_PROXY_URL = "https://iptv-proxy.trionine.workers.dev/";

// getProxiedUrl: resolves the correct URL for a stream.
// HTTP streams on an HTTPS page are proxied to avoid mixed-content blocks.
// forceProxy=true bypasses the protocol check (used after a CORS failure).
function getProxiedUrl(url, forceProxy = false) {
  if (!url) return '';
  const proxySetting = localStorage.getItem('iptv-proxy-url') || DEFAULT_PROXY_URL;
  const needsProxy = forceProxy ||
    (window.location.protocol === 'https:' && url.startsWith('http://'));
  if (proxySetting && needsProxy) {
    // Support both ?url= and bare-append proxy patterns
    if (proxySetting.includes('?url=')) return proxySetting + encodeURIComponent(url);
    return proxySetting + url;
  }
  return url;
}

function resetWatchingScrollPosition() {
  // Disabled automatic scroll to prevent abrupt layout jumps on channel select
}

function settleWatchingScrollPosition() {
  // Disabled automatic scroll
}

// ── SVG Icons
const ICONS = {
  play: `<svg id="icon-play" width="14" height="16" viewBox="0 0 14 16" fill="currentColor" class="hidden"><path d="M0 0L14 8L0 16V0Z"/></svg>
         <svg id="icon-pause" width="12" height="16" viewBox="0 0 12 16" fill="currentColor"><rect x="0" width="4" height="16" rx="1"/><rect x="8" width="4" height="16" rx="1"/></svg>`,
  vol: `<svg id="icon-vol" width="16" height="14" viewBox="0 0 16 14" fill="currentColor"><path d="M0 5v4h2.67L6 12.33V1.67L2.67 5H0zm10.5 2c0-1.77-1-3.29-2.5-4.03v8.05c1.5-.73 2.5-2.25 2.5-4.02z"/><path d="M8 0v1.56c2.37.97 4 3.31 4 6.04s-1.63 5.07-4 6.04V15c3.28-.97 5.5-4 5.5-7.5S11.28.97 8 0z"/></svg>
        <svg id="icon-muted" width="16" height="14" viewBox="0 0 16 14" fill="currentColor" class="hidden"><path d="M6 1.67L2.67 5H0v4h2.67L6 12.33V1.67zm7.5 5.33l1.5-1.5-1.06-1.06L12.44 6l-1.5-1.5L9.88 5.56 11.38 7l-1.5 1.5 1.06 1.06L12.44 8l1.5 1.5 1.06-1.06L13.5 7z"/></svg>`,
  fullscreen: `<svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor"><path d="M1 1h4V0H0v5h1V1zm9-1v1h4v4h1V0h-5zm-9 14v-4H0v5h5v-1H1zm13 0h-4v1h5v-5h-1v4z"/></svg>`,
  cc: `<svg id="icon-cc" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 7H9.5v-.5h-2v3h2V13H11v1c0 .55-.45 1-1 1H6c-.55 0-1-.45-1-1V10c0-.55.45-1 1-1h4c.55 0 1 .45 1 1v1zm8 0h-1.5v-.5h-2v3h2V13H19v1c0 .55-.45 1-1 1h-4c-.55 0-1-.45-1-1V10c0-.55.45-1 1-1h4c.55 0 1 .45 1 1v1z"/></svg>`,
};

function findChannel(id) {
  if (!id) return null;
  const ch = channels.find((c) => c.id === id);
  if (ch) return ch;
  if (id.startsWith("live_")) {
    return channels.find((c) => c.id === "live-sports-automated");
  }
  return null;
}


// ══════════════════════════════════════════
//  STREAM LOAD ENGINE
// ══════════════════════════════════════════

// Public API: Load a channel and push a new history entry (user-initiated clicks)
function loadChannel(id, streamIdx) {
  const ch = findChannel(id);
  if (!ch) return;

  // Push a new history entry ONLY when explicitly clicking a new link manually
  const categorySlug = ch.category
    ? ch.category.toLowerCase().replace(/\s+/g, "-")
    : "tv";
  const cleanPath = `/${categorySlug}/${id}`;
  if (window.location.pathname !== cleanPath) {
    window.history.pushState({ channelId: id }, "", cleanPath);
  }

  executePlayerMount(id, streamIdx);
}

// History-safe bypass: Load a channel WITHOUT pushing a history entry (used by popstate back/forward)
function loadChannelWithoutPush(id, streamIdx) {
  executePlayerMount(id, streamIdx);
}

// Core player mounting logic — shared by both loadChannel and loadChannelWithoutPush
function executePlayerMount(id, streamIdx) {
  const ch = findChannel(id);
  if (!ch) return;

  document.body.classList.add("is-watching");
  resetWatchingScrollPosition();

  const $stageHome = document.getElementById("stage-home");
  if ($stageHome) $stageHome.classList.add("hidden");

  const $idle = document.getElementById("idle-screen");
  if ($idle) $idle.style.display = "none";
  document.querySelector(".stage")?.classList.remove("idle");
  settleWatchingScrollPosition();

  const $ccBtn = document.getElementById("ctrl-cc");
  const $ctxCc = document.getElementById("ctx-cc");
  if ($ccBtn) $ccBtn.classList.add("hidden");
  if ($ctxCc) $ctxCc.classList.add("hidden");

  if (ch.category) {
    const isMobileView = window.matchMedia("(max-width: 768px)").matches;
    if (typeof setGuideOpen === "function") setGuideOpen(!isMobileView);
    if (typeof showGuideCategory === "function") showGuideCategory(ch.category);
  }

  document
    .querySelectorAll(".ch-item")
    .forEach((el) => el.classList.remove("active"));
  const el = document.getElementById(`ch-${id}`);
  if (el) {
    el.classList.add("active");
    el.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  activeId = id;
  activeStreamIdx = streamIdx ?? 0;
  localStorage.setItem("iptv-last-channel", id);
  localStorage.setItem("iptv-last-quality", activeStreamIdx);
  $npName.textContent = ch.name;
  $ctrlChName.textContent = ch.name;

  const $statsPanel = document.getElementById("stats-panel");
  if ($statsPanel && !$statsPanel.classList.contains("hidden")) {
    updateStats();
    startStatsInterval();
  }

  const $qualWrap = document.getElementById("qual-wrap");
  if ($qualWrap) $qualWrap.style.display = "none";
  if ($qualBtn) $qualBtn.style.display = "none";

  buildServerMenu(ch);

  // ── Dynamic Sports Stream Interceptor ──
  const clickedCard = window.clickedCard;
  window.clickedCard = null;
  const isLiveSportsAlias = id === "f1-live" || id === "fifa-live" || id === "cricket-live";
  if (id.startsWith("live_") || isLiveSportsAlias || (clickedCard && clickedCard.dataset.streamId)) {
    isEmbedActive = true;
    resetPlayerState();
    $video.classList.add("hidden");
    clearEmbedWatchdog();

    const $existing = document.querySelector(".embed-server-selector");
    if ($existing) $existing.remove();

    showLoad(true);
    hideErr();

    let source = clickedCard?.dataset.streamSource;
    let streamId = clickedCard?.dataset.streamId;
    let matchTitle = clickedCard?.dataset.matchTitle || ch.name;

    if (!source || !streamId) {
      if (isLiveSportsAlias) {
        let targetCategory = "motor-sports";
        if (id === "fifa-live") targetCategory = "football";
        if (id === "cricket-live") targetCategory = "cricket";
        fetchLiveMatchByCategory(targetCategory, id, streamIdx);
        return;
      }

      const parts = id.split("_");
      if (parts.length >= 3) {
        source = parts[1];
        streamId = parts.slice(2).join("_");
        matchTitle = streamId
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
      }
    }

    if (!source || !streamId) {
      fetchFirstLiveMatch(id, streamIdx);
      return;
    }

    $npName.textContent = matchTitle;
    $ctrlChName.textContent = matchTitle;

    fetchStreamAndMount(source, streamId, matchTitle, streamIdx);

    populateWatchMore(id);
    settleWatchingScrollPosition();
    currentChannel = ch;
    if (typeof initLiveChat === "function") {
      initLiveChat();
    }
    return;
  }

  const streams = getStreams(ch);
  const url = streams[activeStreamIdx]?.url || streams[0].url;

  const isYt = isYouTubeUrl(url);
  const youtubeEmbedUrl = getYouTubeEmbedUrl(url);
  const $embedPlayer = document.getElementById("embed-player");
  const $stage = document.querySelector(".stage");

  if (isYt || ch.isEmbed) {
    // ── Embed Mode ──
    isEmbedActive = true;
    resetPlayerState();
    $video.classList.add("hidden");

    if ($embedPlayer) {
      $embedPlayer.setAttribute("scrolling", "no");
      $embedPlayer.setAttribute("marginheight", "0");
      $embedPlayer.setAttribute("marginwidth", "0");
      $embedPlayer.setAttribute("frameborder", "0");
      if (isYt) {
        $embedPlayer.src = youtubeEmbedUrl;
      } else {
        $embedPlayer.src = url;
      }
      $embedPlayer.classList.remove("hidden");
    }
    if ($stage) $stage.classList.add("is-embed");

    if (ch.isEmbed && !isYt) {
      renderEmbedServerSelector(ch);
      startEmbedWatchdog(ch);
    } else {
      clearEmbedWatchdog();
      const $existing = document.querySelector(".embed-server-selector");
      if ($existing) $existing.remove();
    }

    showLoad(false);
    hideErr();
  } else {
    // ── Standard HLS / TS Mode ──
    isEmbedActive = false;
    clearEmbedWatchdog();
    const $existing = document.querySelector(".embed-server-selector");
    if ($existing) $existing.remove();

    if ($embedPlayer) {
      $embedPlayer.src = "";
      $embedPlayer.classList.add("hidden");
    }
    if ($stage) $stage.classList.remove("is-embed");
    $video.classList.remove("hidden");

    showLoad(true);
    hideErr();
    const proxiedUrl = getProxiedUrl(url);
    if (isTsUrl(url)) {
      startMpegTS(proxiedUrl, false, url);
    } else {
      startHLS(proxiedUrl, false, url);
    }
  }

  populateWatchMore(id);
  settleWatchingScrollPosition();

  // Initialize or update the custom YouTube-style live chat
  currentChannel = ch;
  if (typeof initLiveChat === "function") {
    initLiveChat();
  }
}



function isTsUrl(url) {
  if (!url) return false;
  return /\.(ts|mpegts|m2ts)(\?|$)/i.test(url);
}

function getStreams(ch) {
  return ch.streams || [{ label: "Auto", url: ch.stream }];
}

function populateWatchMore(currentId) {
  const $wm = document.getElementById("watch-more");
  if (!$wm) return;

  const relatedOnlyPref = localStorage.getItem("iptv-wm-related-only");
  const isRelatedOnly = relatedOnlyPref === null ? true : relatedOnlyPref === "true";
  const offlineList = getOfflineChannels();

  let currentCategoryName = null;
  CHANNELS_DATA.categories.forEach((cat) => {
    if (cat.channels.some((c) => c.id === currentId)) {
      currentCategoryName = cat.name;
    }
  });

  let html = `
    <div class="wm-header">
      <div class="wm-title">More Channels</div>
      <button id="wm-toggle-btn" class="wm-toggle-btn">${isRelatedOnly ? "Show All Categories" : "Related Only"}</button>
    </div>
  `;

  CHANNELS_DATA.categories.forEach((cat) => {
    if (isRelatedOnly && currentCategoryName && cat.name !== currentCategoryName) {
      return;
    }

    const validChannels = cat.channels.filter((ch) => ch.id !== currentId);
    if (validChannels.length === 0) return;

    html += `
      <div class="wm-category" data-cat="${cat.name}">
        <div class="section-title wm-cat-title">${cat.name}</div>
        <div class="wm-grid">
          ${validChannels.map((ch) => {
      const isOffline = offlineList.includes(ch.id);
      const channelMeta = ch.quality || ch.category || "";
      return `
            <div class="wm-card${isOffline ? " is-offline" : ""}" tabindex="0" data-id="${ch.id}" data-search="${ch.name.toLowerCase()}">
              <div class="wm-thumb">
                ${buildChannelLogo(ch, "tile")}
              </div>
              <div class="wm-name">${ch.name}</div>
              ${channelMeta ? `<div class="wm-meta">${channelMeta}</div>` : ""}
            </div>`;
    }).join("")}
        </div>
      </div>
    `;
  });

  $wm.innerHTML = html;

  const toggleBtn = document.getElementById("wm-toggle-btn");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      localStorage.setItem("iptv-wm-related-only", !isRelatedOnly);
      populateWatchMore(currentId);
    });
  }

  $wm.querySelectorAll(".wm-card").forEach((card) => {
    const openChannel = () => {
      if (typeof clearSearchState === "function") clearSearchState();
      loadChannel(card.dataset.id);
    };
    card.addEventListener("click", openChannel);
    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openChannel();
    });
  });

  if (typeof resetHomeCatalogFilters === "function") resetHomeCatalogFilters();
}

function buildServerMenu(ch) {
  const streams = getStreams(ch);
  const $srvWrap = document.getElementById("srv-wrap");
  const header = $srvMenu.querySelector(".qual-menu-label");
  $srvMenu.innerHTML = "";
  if (header) $srvMenu.appendChild(header);

  if (streams.length <= 1) {
    if ($srvWrap) $srvWrap.style.display = "none";
    if ($srvBtn) $srvBtn.style.display = "none";
    if ($srvLabel) $srvLabel.textContent = streams[0]?.label || "SERVER";
    return;
  }
  if ($srvWrap) $srvWrap.style.display = "";
  if ($srvBtn) $srvBtn.style.display = "";

  streams.forEach((s, i) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "qual-item" + (i === activeStreamIdx ? " active" : "");
    item.innerHTML = `${s.label}${s.bitrate ? `<span class="qual-bitrate">${s.bitrate}</span>` : ""}`;
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      $srvMenu.classList.add("hidden");
      if (i === activeStreamIdx) return;
      activeStreamIdx = i;
      localStorage.setItem("iptv-last-quality", i);
      $srvLabel.textContent = s.label.toUpperCase();
      loadChannel(activeId, i);
      $srvMenu
        .querySelectorAll(".qual-item")
        .forEach((el, j) => el.classList.toggle("active", j === i));
      toast(`Server: ${s.label}`);
    });
    $srvMenu.appendChild(item);
  });
  $srvLabel.textContent = (
    streams[activeStreamIdx]?.label || "SERVER"
  ).toUpperCase();
}

function buildQualMenuFromHlsLevels() {
  const $qualWrap = document.getElementById("qual-wrap");
  if (!hls || !hls.levels || hls.levels.length <= 1) {
    if ($qualWrap) $qualWrap.style.display = "none";
    if ($qualBtn) $qualBtn.style.display = "none";
    return;
  }

  if ($qualWrap) $qualWrap.style.display = "";
  if ($qualBtn) $qualBtn.style.display = "";
  const header = $qualMenu.querySelector(".qual-menu-label");
  $qualMenu.innerHTML = "";
  if (header) $qualMenu.appendChild(header);

  const autoItem = document.createElement("button");
  autoItem.type = "button";
  autoItem.className = "qual-item" + (hls.currentLevel === -1 ? " active" : "");
  autoItem.innerHTML = `Auto<span class="qual-bitrate"></span>`;
  autoItem.addEventListener("click", (e) => {
    e.stopPropagation();
    $qualMenu.classList.add("hidden");
    hls.currentLevel = -1;
    $qualLabel.textContent = "AUTO";
    $qualMenu
      .querySelectorAll(".qual-item")
      .forEach((el) => el.classList.remove("active"));
    autoItem.classList.add("active");
    toast("Auto quality");
  });
  $qualMenu.appendChild(autoItem);

  for (let idx = hls.levels.length - 1; idx >= 0; idx--) {
    const lvl = hls.levels[idx];
    const height =
      lvl.height || (lvl.bitrate ? `${Math.round(lvl.bitrate / 1000)}k` : idx);
    const bitrateMbps = lvl.bitrate
      ? (lvl.bitrate / 1_000_000).toFixed(2)
      : null;
    let label = height ? `${height}p` : `Level ${idx + 1}`;
    let bitrateLabel = bitrateMbps ? `${bitrateMbps} Mbps` : "";

    // "Enhanced bitrate" for high quality
    if (height >= 1080 && bitrateMbps && bitrateMbps > 5) {
      label = `${height}p`;
      bitrateLabel = `${bitrateMbps} Mbps`;
    } else if (height >= 720 && bitrateMbps) {
      bitrateLabel = `${bitrateMbps} Mbps`;
    }

    const item = document.createElement("button");
    item.type = "button";
    item.className = "qual-item" + (hls.currentLevel === idx ? " active" : "");
    item.innerHTML = `${label}<span class="qual-bitrate">${bitrateLabel}</span>`;
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      $qualMenu.classList.add("hidden");
      hls.currentLevel = idx;
      localStorage.setItem("iptv-last-quality", idx);
      $qualLabel.textContent = label.toUpperCase();
      $qualMenu
        .querySelectorAll(".qual-item")
        .forEach((el) => el.classList.remove("active"));
      item.classList.add("active");
      toast(`Quality: ${label}`);
    });
    $qualMenu.appendChild(item);
  }

  if (hls.currentLevel === -1) {
    $qualLabel.textContent = "AUTO";
  } else {
    const lvl = hls.levels[hls.currentLevel];
    const height = lvl ? lvl.height : null;
    $qualLabel.textContent = height ? `${height}P` : "AUTO";
  }
}

function startHLS(url, isProxyRetry = false, originalUrl = null) {
  if (!originalUrl) originalUrl = url;
  resetPlayerState();          // destroys any previous instance first
  retryCount = 0;              // reset per-stream retry count on each new load
  startPlayTimeoutWatchdog();

  if (Hls.isSupported()) {
    hls = new Hls({
      enableWorker:              true,
      lowLatencyMode:            true,
      // Buffer tuned for fast startup: small initial buffer, grows if needed
      maxBufferLength:           12,
      maxMaxBufferLength:        40,
      maxBufferSize:             20 * 1000 * 1000,
      maxBufferHole:             0.5,
      // Live latency
      liveSyncDurationCount:     2,
      liveMaxLatencyDurationCount: 8,
      // Aggressive manifest fetch so we fail fast on bad streams
      manifestLoadingMaxRetry:   1,
      manifestLoadingRetryDelay: 500,
      levelLoadingMaxRetry:      1,
      fragLoadingMaxRetry:       2,
      // Tolerate minor gaps without stalling
      nudgeMaxRetry:             3,
    });

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      retryCount = 0;
      clearPlayTimeoutWatchdog(); // manifest loaded → cancel the timeout watchdog
      _cacheStreamOk(activeId, activeStreamIdx); // remember this stream works
      const playPromise = $video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Video play prevented:', err);
          showLoad(false);
          showErr('Playback prevented (click to retry)');
          const retryOverlayBtn = document.getElementById('err-retry');
          if (retryOverlayBtn) retryOverlayBtn.style.display = 'inline-block';
        });
      }
      buildQualMenuFromHlsLevels();
    });

    hls.on(Hls.Events.FRAG_BUFFERED, () => {
      // First fragment buffered → hide loading spinner immediately
      showLoad(false);
    });

    hls.on(Hls.Events.SUBTITLE_TRACKS_UPDATED, (event, data) => {
      updateCCButtonVisibility();
      if (subtitleEnabled && data.subtitleTracks && data.subtitleTracks.length > 0) {
        hls.subtitleTrack = 0;
      }
    });

    hls.attachMedia($video);
    hls.loadSource(url);

    hls.on(Hls.Events.ERROR, (_, data) => {
      if (!data.fatal) return; // ignore non-fatal glitches
      console.warn('HLS Fatal Error:', data.type, data.details);

      switch (data.type) {
        case Hls.ErrorTypes.NETWORK_ERROR: {
          const isManifestErr =
            data.details === Hls.ErrorDetails.MANIFEST_LOAD_ERROR ||
            data.details === Hls.ErrorDetails.MANIFEST_LOAD_TIMEOUT;
          const isFatalHttp = data.response && data.response.code >= 400;

          if (isFatalHttp) {
            // 403/404/5xx — stream is dead, failover immediately
            handleFatalError(data);
          } else if (isManifestErr && !isProxyRetry) {
            // CORS block — retry via proxy once before giving up
            toast('CORS blocked. Trying proxy...');
            startHLS(getProxiedUrl(originalUrl, true), true, originalUrl);
          } else if (retryCount < MAX_RETRIES) {
            retryCount++;
            toast(`Network issue. Retrying (${retryCount}/${MAX_RETRIES})...`);
            hls.startLoad();
          } else {
            handleFatalError(data);
          }
          break;
        }
        case Hls.ErrorTypes.MEDIA_ERROR:
          if (retryCount < MAX_RETRIES) {
            retryCount++;
            toast(`Media issue. Recovering (${retryCount}/${MAX_RETRIES})...`);
            hls.recoverMediaError();
          } else {
            handleFatalError(data);
          }
          break;
        default:
          handleFatalError(data);
          break;
      }
    });

  } else if ($video.canPlayType('application/vnd.apple.mpegurl')) {
    // Native HLS (Safari / iOS)
    retryCount = 0;
    $video.src = url;
    $video.play().catch(err => console.warn('Native video play prevented:', err));
  } else {
    showLoad(false);
    showErr('HLS not supported in this browser');
  }
}

function startMpegTS(url) {
  resetPlayerState();      // fully destroys previous instance
  retryCount = 0;
  startPlayTimeoutWatchdog();

  if (mpegts.getFeatureList().mseLivePlayback) {
    mpegtsPlayer = mpegts.createPlayer(
      { type: 'mpegts', isLive: true, url },
      {
        enableWorker:        true,
        lazyLoadMaxDuration: 3 * 60,
        seekType:            'range',
        // Abort stalled segments faster so the watchdog triggers promptly
        fetchBeforeFeed:     false,
      }
    );
    mpegtsPlayer.attachMediaElement($video);
    mpegtsPlayer.load();

    mpegtsPlayer.play()
      .then(() => {
        retryCount = 0;
        _cacheStreamOk(activeId, activeStreamIdx);
        if ($qualBtn)   $qualBtn.style.display = 'none';
        if ($qualLabel) $qualLabel.textContent = 'ORIGINAL';
      })
      .catch(err => {
        console.warn('MpegTS play error:', err);
        showLoad(false);
        showErr('Playback prevented (click to retry)');
      });

    mpegtsPlayer.on(mpegts.Events.ERROR, (type, detail, info) => {
      console.warn('MpegTS Error:', type, detail, info);
      const isFatalHttp = info && info.code >= 400;
      if (isFatalHttp || retryCount >= MAX_RETRIES) {
        handleStreamError(detail || 'MpegTS error');
      } else {
        retryCount++;
        toast(`MpegTS issue. Retrying (${retryCount}/${MAX_RETRIES})...`);
        try { mpegtsPlayer.unload(); mpegtsPlayer.load(); mpegtsPlayer.play().catch(() => {}); }
        catch (e) { handleStreamError(detail || 'MpegTS error'); }
      }
    });
  } else {
    showLoad(false);
    showErr('MPEG-TS not supported in this browser');
  }
}

function handleMpegTSError(type, detail, info) {
  handleStreamError(detail || 'MpegTS error');
}

function handleFatalError(data) {
  handleStreamError(data.details || 'Stream error');
}

function handleNativeVideoError() {
  handleStreamError('Native playback failed');
}

let playbackWatchdogTimer = null;
let lastCurrentTime = 0;
let stallCount = 0;

// startPlayTimeoutWatchdog: polls every 2s.
// After 10 consecutive stalled seconds → trigger stream failover.
// After all streams fail → trigger channel-level fallback.
function startPlayTimeoutWatchdog() {
  clearPlayTimeoutWatchdog();
  lastCurrentTime = 0;
  stallCount = 0;

  playbackWatchdogTimer = setInterval(() => {
    if (!activeId || !$video) return;
    if ($video.paused || isEmbedActive) return; // user-paused or embed → skip

    const ct = $video.currentTime;
    if (ct > lastCurrentTime) {
      // Video is progressing → reset stall counter
      stallCount = 0;
      showLoad(false); // hide spinner once we know it's actually playing
    } else if ($video.readyState < 3) {
      // Not enough data and time isn't advancing → count as a stall tick
      stallCount += 2;
    } else if ($video.readyState === 0) {
      stallCount += 2; // readyState HAVE_NOTHING — dead stream
    }
    lastCurrentTime = ct;

    if (stallCount >= 10) {
      // 10 seconds of continuous stall detected
      console.warn('[Watchdog] Stream stalled 10s, triggering failover...');
      clearPlayTimeoutWatchdog();
      const ch = findChannel(activeId);
      if (ch) {
        const streams = getStreams(ch);
        if (activeStreamIdx + 1 < streams.length) {
          const nextIdx = activeStreamIdx + 1;
          toast(`Stream stalled. Switching to backup ${streams[nextIdx].label}...`);
          activeStreamIdx = nextIdx;
          loadChannel(activeId, nextIdx);
          return;
        }
        // No more backups — channel-level fallback
        showLoad(false);
        markChannelOffline(activeId);
        if (!triggerChannelFallback(activeId)) {
          showErr('Stream timed out or stalled');
        }
        return;
      }
      showLoad(false);
      showErr('Stream timed out or stalled');
      markChannelOffline(activeId);
    }
  }, 2000);
}

function clearPlayTimeoutWatchdog() {
  if (playbackWatchdogTimer) {
    clearInterval(playbackWatchdogTimer);
    playbackWatchdogTimer = null;
  }
}



// ══════════════════════════════════════════
//  UI MEDIA INTERFACES
// ══════════════════════════════════════════
function togglePlay() {
  if ($video.paused) $video.play();
  else $video.pause();
}

function setPaused(paused) {
  $iconPlay.classList.toggle("hidden", !paused);
  $iconPause.classList.toggle("hidden", paused);
}

function toggleMute() {
  setMuted(!muted);
}

function setMuted(val) {
  const changed = muted !== val;
  muted = val;
  $video.muted = muted;
  $iconVol.classList.toggle("hidden", muted);
  $iconMuted.classList.toggle("hidden", !muted);
  if (muted) $volSlider.value = 0;
  else {
    $volSlider.value = $video.volume || 1;
    $video.volume = $video.volume || 1;
  }
  localStorage.setItem("iptv-muted", muted);
  if (changed) {
    showFlashOverlay(muted ? "mute" : "volume");
    toast(muted ? "Muted" : "Unmuted", 1200);
  }
}

function adjustVolume(delta) {
  let vol = $video.volume + delta;
  vol = Math.max(0, Math.min(1, vol));
  $video.volume = vol;
  $volSlider.value = vol;
  localStorage.setItem("iptv-volume", vol);
  if (vol === 0 && !muted) setMuted(true);
  else if (vol > 0 && muted) setMuted(false);
  showFlashOverlay("volume", Math.round(vol * 100));
}

function hasTextTracks() {
  if (!$video) return false;
  if (hls && hls.subtitleTracks && hls.subtitleTracks.length > 0) {
    return true;
  }
  const tracks = Array.from($video.textTracks || []);
  const subTracks = tracks.filter(
    (t) => t.kind === "subtitles" || t.kind === "captions",
  );
  return subTracks.length > 0;
}

function updateCCButtonVisibility() {
  const $ccBtn = document.getElementById("ctrl-cc");
  const $ctxCc = document.getElementById("ctx-cc");
  const hasSubs = hasTextTracks();

  if ($ccBtn) $ccBtn.classList.toggle("hidden", !hasSubs);
  if ($ctxCc) $ctxCc.classList.toggle("hidden", !hasSubs);
}

function toggleSubtitles() {
  setSubtitlesActive(!subtitleEnabled);
}

function setSubtitlesActive(active, skipToast = false) {
  subtitleEnabled = active;
  localStorage.setItem("iptv-subtitle-enabled", active);

  const $ccBtn = document.getElementById("ctrl-cc");
  const $ctxCc = document.getElementById("ctx-cc");

  if ($ccBtn) {
    $ccBtn.classList.toggle("active", active);
    $ccBtn.title = active ? "Turn off captions (c)" : "Turn on captions (c)";
  }
  if ($ctxCc) {
    $ctxCc.textContent = active ? "Subtitles: ON" : "Subtitles: OFF";
    $ctxCc.classList.toggle("active", active);
  }

  if (hls) {
    if (active) {
      if (hls.subtitleTracks && hls.subtitleTracks.length > 0) {
        hls.subtitleTrack = 0;
      }
    } else {
      hls.subtitleTrack = -1;
    }
  } else {
    // Only fall back to manual track mode loop if hls is not active
    if ($video && $video.textTracks) {
      for (let i = 0; i < $video.textTracks.length; i++) {
        const track = $video.textTracks[i];
        if (track.kind === "subtitles" || track.kind === "captions") {
          track.mode = active ? "showing" : "disabled";
        }
      }
    }
  }

  if (!skipToast) {
    toast(active ? "Subtitles enabled" : "Subtitles disabled");
  }
}

function showFlashOverlay(type, detail = "") {
  const $flash = document.getElementById("flash-overlay");
  const $icon = document.getElementById("flash-icon");
  const $text = document.getElementById("flash-text");
  if (!$flash || !$icon || !$text) return;

  $flash.classList.remove("show");
  void $flash.offsetWidth;

  let iconHtml = "";
  let textStr = "";

  switch (type) {
    case "play":
      iconHtml =
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
      textStr = "";
      break;
    case "pause":
      iconHtml =
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
      textStr = "";
      break;
    case "mute":
      iconHtml =
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>';
      textStr = "";
      break;
    case "volume":
      iconHtml =
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';
      textStr = detail ? `${detail}%` : "";
      break;
    case "cc":
      iconHtml = ICONS.cc;
      textStr = detail ? "ON" : "OFF";
      break;
    case "fullscreen":
      iconHtml =
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M5 5h4V3H5v4zm0 14h4v-4H5v4zM3 5v14h16V5H3zm14 14h4v-4h-4v4zm4-16v4h4V5h-4z"/></svg>';
      textStr = "";
      break;
    case "fullscreen-exit":
      iconHtml =
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M14 9l-5 5 5 5-1.41 1.41-5-5 5-5 1.41 1.41z"/></svg>';
      textStr = "";
      break;
    default:
      return;
  }

  $icon.innerHTML = iconHtml;
  $text.textContent = textStr;
  $flash.classList.add("show");

  clearTimeout(window.flashTimeout);
  window.flashTimeout = setTimeout(() => {
    $flash.classList.remove("show");
  }, 600);
}


function jumpToLive() {
  if ($video.seekable.length) {
    $video.currentTime = $video.seekable.end($video.seekable.length - 1);
    $video.play().catch(() => { });
  }
}

function toggleFullscreen() {
  const stage = document.querySelector(".stage");
  if (!document.fullscreenElement) {
    stage.requestFullscreen?.().then(() => {
      toast("Fullscreen", 1000);
      showFlashOverlay("fullscreen");
    });
  } else {
    document.exitFullscreen?.().then(() => {
      toast("Exited fullscreen", 1000);
      showFlashOverlay("fullscreen-exit");
    });
  }
}

function retryStream() {
  if (isEmbedActive) return;
  const ch = findChannel(activeId);
  if (!ch) return;
  const streams = ch.streams || [{ label: "Auto", url: ch.stream }];
  const url = streams[activeStreamIdx]?.url || streams[0].url;
  hideErr();
  showLoad(true);
  const proxiedUrl = getProxiedUrl(url);
  if (isTsUrl(url)) {
    startMpegTS(proxiedUrl);
  } else {
    startHLS(proxiedUrl);
  }
}

// ── Stats for Nerds Panel
function toggleStats(e) {
  if (e) e.stopPropagation();
  const $stats = document.getElementById("stats-panel");
  if (!$stats) return;

  const isHidden = $stats.classList.toggle("hidden");
  if (!isHidden) startStatsInterval();
  else stopStatsInterval();
}

function startStatsInterval() {
  stopStatsInterval();
  updateStats();
  statsInterval = setInterval(updateStats, 1000);
}

function stopStatsInterval() {
  if (statsInterval) {
    clearInterval(statsInterval);
    statsInterval = null;
  }
}

function generateSCPN() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (i < 3) result += " ";
  }
  return result;
}

function updateStats() {
  const $channel = document.getElementById("stats-channel");
  const $source = document.getElementById("stats-source");
  const $resolution = document.getElementById("stats-resolution");
  const $buffer = document.getElementById("stats-buffer");
  const $bitrate = document.getElementById("stats-bitrate");
  const $dropped = document.getElementById("stats-dropped");
  const $engine = document.getElementById("stats-engine");
  const $codecs = document.getElementById("stats-codecs");
  const $color = document.getElementById("stats-color");
  const $connection = document.getElementById("stats-connection");
  const $networkActivity = document.getElementById("stats-network-activity");
  const $bufferHealth = document.getElementById("stats-buffer-health");
  const $sCPN = document.getElementById("stats-scpn");
  const $viewport = document.getElementById("stats-viewport");
  const $volumeRow = document.getElementById("stats-volume");

  const ch = findChannel(activeId);
  if ($channel) $channel.textContent = ch ? ch.name : "—";

  if ($source && ch) {
    const streams = getStreams(ch);
    const url = streams[activeStreamIdx]?.url || streams[0]?.url || "-";
    const label = streams[activeStreamIdx]?.label || "";
    try {
      const parsed = new URL(url);
      $source.textContent = (label ? `[${label}] ` : "") + parsed.hostname;
      $source.title = url;
    } catch {
      $source.textContent = url;
    }
  } else if ($source) {
    $source.textContent = "—";
  }

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  if ($viewport) $viewport.textContent = `${viewportWidth}x${viewportHeight}`;

  let videoWidth = $video.videoWidth || 0;
  let videoHeight = $video.videoHeight || 0;
  if ($resolution) {
    $resolution.textContent =
      videoWidth && videoHeight ? `${videoWidth}x${videoHeight}` : "—";
  }

  let droppedFrames = 0;
  let totalFrames = 0;
  if ($video.getVideoPlaybackQuality) {
    const q = $video.getVideoPlaybackQuality();
    droppedFrames = q.droppedVideoFrames;
    totalFrames = q.totalVideoFrames;
  }
  if ($dropped) {
    $dropped.textContent = totalFrames
      ? `${droppedFrames} of ${totalFrames}`
      : "—";
  }

  let bufLen = 0;
  const time = $video.currentTime;
  try {
    for (let i = 0; i < $video.buffered.length; i++) {
      if (time >= $video.buffered.start(i) && time <= $video.buffered.end(i)) {
        bufLen = $video.buffered.end(i) - time;
        break;
      }
    }
  } catch { }
  if ($buffer) $buffer.textContent = `${bufLen.toFixed(1)}s`;
  if ($bufferHealth) $bufferHealth.textContent = `${bufLen.toFixed(1)} s`;

  if (hls && hls.levels && hls.levels.length) {
    if (hls.currentLevel === -1) {
      if (hls.bandwidthEstimate) {
        let currentBitrate = hls.bandwidthEstimate;
        if ($bitrate)
          $bitrate.textContent = `${(currentBitrate / 1_000_000).toFixed(2)} Mbps (Auto)`;
        if ($connection)
          $connection.textContent = `${(currentBitrate / 1000).toFixed(0)} Kbps`;
      } else {
        if ($bitrate) $bitrate.textContent = "Auto";
        if ($connection) $connection.textContent = "—";
      }
    } else {
      const lvl = hls.levels[hls.currentLevel];
      let currentBitrate = lvl?.bitrate || 0;
      if ($bitrate)
        $bitrate.textContent = currentBitrate
          ? `${(currentBitrate / 1_000_000).toFixed(2)} Mbps`
          : "—";
      if ($connection)
        $connection.textContent = currentBitrate
          ? `${(currentBitrate / 1000).toFixed(0)} Kbps`
          : "—";
    }
  } else if (mpegtsPlayer && mpegtsPlayer.statisticsInfo) {
    const stats = mpegtsPlayer.statisticsInfo;
    const speedKbps = stats.speed ? Math.round(stats.speed * 8) : 0;
    const speedMbps = speedKbps ? (speedKbps / 1000).toFixed(2) : null;
    if ($bitrate) {
      $bitrate.textContent = speedMbps ? `${speedMbps} Mbps` : "—";
    }
    if ($connection) {
      $connection.textContent = speedKbps ? `${speedKbps} Kbps` : "—";
    }
  } else {
    if ($bitrate) $bitrate.textContent = hls ? "—" : "N/A";
    if ($connection) $connection.textContent = "—";
  }

  if ($networkActivity)
    $networkActivity.textContent = `${Math.floor(Math.random() * 30 + 10)} s`;

  if ($codecs) {
    let videoCodec = "unknown";
    let audioCodec = "unknown";
    if (hls) {
      videoCodec = "avc1.640028";
      audioCodec = "mp4a.40.2";
    } else if (mpegtsPlayer && mpegtsPlayer.mediaInfo) {
      videoCodec = mpegtsPlayer.mediaInfo.videoCodec || "unknown";
      audioCodec = mpegtsPlayer.mediaInfo.audioCodec || "unknown";
    }
    $codecs.textContent = `${videoCodec} / ${audioCodec}`;
  }

  if ($color) $color.textContent = "bt709 / bt709";

  if ($sCPN && !window._scpn) window._scpn = generateSCPN();
  if ($sCPN) $sCPN.textContent = window._scpn || generateSCPN();

  if ($volumeRow) {
    const volPercent = Math.round(($video.volume || 0) * 100);
    $volumeRow.innerHTML = `<span>Volume / Normalized</span><span>${volPercent}% / 100% DRC (cont.-18.0dB tgt.-14.0dB)</span>`;
  }

  if ($engine) {
    if (hls) $engine.textContent = "HLS.js";
    else if (mpegtsPlayer) $engine.textContent = "MpegTS.js";
    else $engine.textContent = "Native";
  }

  // Control bar quality & buffer indicator
  const $qualityBadge = document.getElementById("ctrl-quality-badge");
  const $bufferFill = document.getElementById("ctrl-buffer-fill");
  const $bufferText = document.getElementById("ctrl-buffer-text");
  const $ctrlQualityInd = document.getElementById("ctrl-quality-indicator");

  if ($qualityBadge && $ctrlQualityInd) {
    let qualityText = "—";
    if (hls && hls.levels && hls.levels.length) {
      if (hls.currentLevel === -1) {
        qualityText = "AUTO";
      } else {
        const lvl = hls.levels[hls.currentLevel];
        qualityText = lvl?.height ? `${lvl.height}p` : "—";
      }
    } else if (mpegtsPlayer) {
      qualityText = "TS";
    } else if ($video.videoHeight) {
      qualityText = `${$video.videoHeight}p`;
    }
    $qualityBadge.textContent = qualityText;
    $qualityBadge.classList.toggle("hidden", qualityText === "—");
    $ctrlQualityInd.classList.toggle("hidden", qualityText === "—");
  }

  if ($bufferFill && $bufferText && $ctrlQualityInd) {
    const bufPercent = Math.min(100, Math.max(0, (bufLen / 30) * 100));
    $bufferFill.style.width = `${bufPercent}%`;
    $bufferText.textContent = `Buffer: ${bufLen.toFixed(1)}s`;
    $bufferFill.classList.toggle("filled", bufLen > 2);
  }

  if ($bufferIndicator && $bufferBars) {
    const bufPercent = Math.min(100, Math.max(0, (bufLen / 30) * 100));
    const filledBars = Math.round((bufPercent / 100) * 3);
    $bufferBars.forEach((bar, i) => {
      bar.classList.toggle("filled", i < filledBars);
    });
    $bufferIndicator.classList.toggle("hidden", bufLen < 0.5);
  }
}

function copyDebugInfo() {
  const stats = {
    channel: document.getElementById("stats-channel")?.textContent,
    videoId: window._scpn || "N/A",
    viewport: document.getElementById("stats-viewport")?.textContent,
    resolution: document.getElementById("stats-resolution")?.textContent,
    dropped: document.getElementById("stats-dropped")?.textContent,
    bitrate: document.getElementById("stats-bitrate")?.textContent,
    codecs: document.getElementById("stats-codecs")?.textContent,
    connection: document.getElementById("stats-connection")?.textContent,
    bufferHealth: document.getElementById("stats-buffer-health")?.textContent,
    date: new Date().toString(),
  };
  const debugString = Object.entries(stats)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
  navigator.clipboard
    .writeText(debugString)
    .then(() => toast("Debug info copied"));
}
