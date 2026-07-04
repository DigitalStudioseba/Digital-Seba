/**
 * DIGITAL SEBA - Resource Validator (Developer Utility)
 * ----------------------------------------------------------------------
 * Not loaded on any live page. Run this manually in two ways:
 *
 * 1) In a browser console on any page of the site:
 *      fetch('assets/data/resources.json').then(r=>r.json()).then(ResourceValidator.run)
 *
 * 2) In Node.js from the project root:
 *      node -e "const d=require('./assets/data/resources.json'); require('./assets/js/resource-validator.js').run(d);"
 *
 * It never modifies resources.json — it only prints a readable report.
 */

'use strict';

(function (root) {
  const URL_RE = /^https?:\/\/[^\s]+$/i;

  function isValidUrl(u) {
    if (!u || typeof u !== 'string') return false;
    if (!URL_RE.test(u)) return false;
    try { new URL(u); return true; } catch (e) { return false; }
  }

  function run(resources) {
    const report = {
      total: 0,
      duplicateTitles: [],
      duplicateUrls: [],
      invalidJson: false,
      missingIcon: [],
      missingBanglaTitle: [],
      missingEnglishTitle: [],
      emptyDescription: [],
      emptyCategory: [],
      invalidUrl: []
    };

    if (!Array.isArray(resources)) {
      report.invalidJson = true;
      console.error('❌ Resource Validator: input is not a valid array of resources.');
      return report;
    }

    report.total = resources.length;

    const titleSeen = new Map();
    const urlSeen = new Map();

    resources.forEach((r, idx) => {
      const label = `#${r.id ?? idx} (${r.title || r.title_en || 'untitled'})`;

      const titleEn = r.title_en || r.title;
      const titleKey = (titleEn || '').trim().toLowerCase();
      if (titleKey) {
        if (titleSeen.has(titleKey)) {
          report.duplicateTitles.push([titleSeen.get(titleKey), label]);
        } else {
          titleSeen.set(titleKey, label);
        }
      }

      const urlKey = (r.url || '').trim().toLowerCase();
      if (urlKey) {
        if (urlSeen.has(urlKey)) {
          report.duplicateUrls.push([urlSeen.get(urlKey), label]);
        } else {
          urlSeen.set(urlKey, label);
        }
      }

      if (!r.icon && !r.category_icon) report.missingIcon.push(label);
      if (!r.title_bn) report.missingBanglaTitle.push(label);
      if (!titleEn) report.missingEnglishTitle.push(label);
      if (!(r.description_en || r.description) && !r.description_bn) report.emptyDescription.push(label);
      if (!r.category) report.emptyCategory.push(label);
      if (!isValidUrl(r.url)) report.invalidUrl.push(label + ' -> ' + r.url);
    });

    printReport(report);
    return report;
  }

  function printReport(r) {
    const line = (label, arr) => {
      const ok = arr.length === 0;
      console.log(`${ok ? '✅' : '⚠️ '} ${label}: ${arr.length}`);
      if (!ok) arr.slice(0, 20).forEach(item => console.log('    -', Array.isArray(item) ? item.join('  <->  ') : item));
      if (arr.length > 20) console.log(`    ...and ${arr.length - 20} more`);
    };

    console.log('%c=== DIGITAL SEBA — Resource Validator Report ===', 'font-weight:bold;');
    console.log('Total resources scanned:', r.total);
    console.log(r.invalidJson ? '❌ Invalid JSON structure' : '✅ Valid JSON structure');
    line('Duplicate titles', r.duplicateTitles);
    line('Duplicate URLs', r.duplicateUrls);
    line('Missing icon', r.missingIcon);
    line('Missing Bangla title', r.missingBanglaTitle);
    line('Missing English title', r.missingEnglishTitle);
    line('Empty description', r.emptyDescription);
    line('Empty category', r.emptyCategory);
    line('Invalid URL', r.invalidUrl);
    console.log('=================================================');
  }

  const ResourceValidator = { run };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResourceValidator;
  }
  if (typeof window !== 'undefined') {
    window.ResourceValidator = ResourceValidator;
  }
})(this);
