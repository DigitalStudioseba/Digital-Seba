/**
 * DIGITAL SEBA - Resources Search Extension
 * Loads assets/data/resources.json and feeds it into the existing
 * global SearchModule via window.EXTRA_SEARCH_DATA.
 * This file is ADDITIVE ONLY — it does not alter any existing feature.
 */

'use strict';

(function () {
  var scriptEl = document.currentScript;
  var base = scriptEl && scriptEl.src
    ? scriptEl.src.replace(/assets\/js\/resources-search\.js.*$/, '')
    : '';

  fetch(base + 'assets/data/resources.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      window.EXTRA_SEARCH_DATA = data.map(function (item) {
        var titleEn = item.title_en || item.title;
        var titleBn = item.title_bn || titleEn;
        return {
          id: 'res-' + item.id,
          name: titleEn,
          namebn: titleBn,
          category: item.category,
          categorybn: item.category,
          icon: item.icon || item.category_icon || '🔗',
          url: item.url,
          tags: [
            item.category.toLowerCase(),
            item.type,
            item.badge.toLowerCase(),
            titleEn.toLowerCase()
          ]
        };
      });
    })
    .catch(function () {
      window.EXTRA_SEARCH_DATA = window.EXTRA_SEARCH_DATA || [];
    });
})();
