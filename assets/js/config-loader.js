/**
 * DIGITAL SEBA - Config Loader
 * Loads /config/social-links.json and /config/contact.json and syncs any
 * element marked with data-social="key" or data-contact="key".
 * Elements already carry correct real values in HTML as a static fallback;
 * this script keeps them in sync if the config files are edited later
 * without ever needing an HTML/JS change.
 * ADDITIVE ONLY — does not alter any existing markup structure.
 */

'use strict';

(function () {
  var scriptEl = document.currentScript;
  var base = scriptEl && scriptEl.src
    ? scriptEl.src.replace(/assets\/js\/config-loader\.js.*$/, '')
    : '';

  function applyLinks(data, attr) {
    document.querySelectorAll('[data-' + attr + ']').forEach(function (el) {
      var key = el.getAttribute('data-' + attr);
      var value = data[key];
      if (!value) return;
      if (el.tagName === 'A') {
        el.setAttribute('href', value);
      } else {
        el.textContent = value;
      }
    });
  }

  Promise.all([
    fetch(base + 'config/social-links.json').then(function (r) { return r.json(); }).catch(function () { return {}; }),
    fetch(base + 'config/contact.json').then(function (r) { return r.json(); }).catch(function () { return {}; })
  ]).then(function (results) {
    applyLinks(results[0], 'social');
    applyLinks(results[1], 'contact');
  });
})();
