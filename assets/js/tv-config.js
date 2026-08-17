/**
 * DIGITAL SEBA - Live TV Config Loader (PLACEHOLDER / SCAFFOLDING ONLY)
 * ----------------------------------------------------------------------
 * This file intentionally contains NO player logic and NO stream handling.
 * It only checks whether config/channels.json has any entries yet, and
 * toggles the "Coming Soon" state on the Live TV placeholder page and
 * the nav badge accordingly.
 *
 * It does NOT fetch from, parse, or reference any external source.
 * When channels are added to /config/channels.json in the future, this
 * file is the ONLY place that should need to grow — no HTML/CSS changes.
 */

'use strict';

(function () {
  var scriptEl = document.currentScript;
  var base = scriptEl && scriptEl.src
    ? scriptEl.src.replace(/assets\/js\/tv-config\.js.*$/, '')
    : '';

  function setStatus(hasChannels, count) {
    var statusEl = document.getElementById('liveTvStatus');
    if (statusEl) {
      statusEl.textContent = hasChannels
        ? count + ' channel(s) configured.'
        : 'No channels are configured yet.';
    }

    var badge = document.querySelectorAll('[data-livetv-badge]');
    badge.forEach(function (el) {
      el.textContent = hasChannels ? '' : 'Coming Soon';
      el.style.display = hasChannels ? 'none' : '';
    });
  }

  fetch(base + 'config/channels.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var channels = (data && Array.isArray(data.channels)) ? data.channels : [];
      setStatus(channels.length > 0, channels.length);
    })
    .catch(function () {
      setStatus(false, 0);
    });
})();
