#!/usr/bin/env node
/**
 * DIGITAL SEBA - Resource Import Tool
 * ----------------------------------------------------------------------
 * Converts CSV / Excel (.xlsx) / a Google Sheet export into
 * assets/data/resources.json — dedupes, sorts alphabetically,
 * generates numeric IDs + URL slugs, and preserves category mapping.
 *
 * USAGE
 *   node tools/import-resources.js <input-file> [--out=assets/data/resources.json] [--merge]
 *
 *   <input-file>   .csv or .xlsx (a Google Sheet export downloaded as
 *                  File > Download > .csv or .xlsx works directly)
 *   --merge        merge into the existing resources.json instead of
 *                  overwriting it (duplicates by URL are skipped)
 *
 * EXPECTED COLUMNS (case-insensitive, extra columns are ignored)
 *   title | title_en | name        (required)
 *   title_bn                        (optional — Bangla title)
 *   url | link                      (required)
 *   category                        (required — must match an existing
 *                                    category name to inherit its icon;
 *                                    unrecognised categories fall back
 *                                    to "Other Useful Websites" + 🔗)
 *   description | description_en    (optional)
 *   description_bn                  (optional)
 *   type                            ("official" or "download", default
 *                                    "official")
 *
 * DEPENDENCIES
 *   CSV import uses only Node's built-in fs/readline — no install needed.
 *   .xlsx import needs the "xlsx" package:
 *       npm install xlsx
 *   If "xlsx" isn't installed and you pass a .xlsx file, the script will
 *   tell you exactly what to run — it will not silently fail.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const CATEGORY_ICON = {
  'Passport': '🛂', 'NID': '🆔', 'Birth Certificate': '📜', 'Land Services': '🏞️',
  'Police Services': '🚓', 'BRTA': '🚗', 'BMET': '✈️', 'Visa Services': '🌍',
  'Medical Report': '💊', 'Board Result': '📊', 'University Admission': '🎓',
  'Education': '🎓', 'Scholarship': '💰', 'Government Services': '🏛️',
  'PDF Tools': '📄', 'Photo Editing Tools': '🖼️', 'Adobe Software': '🎨',
  'Microsoft Office': '💻', 'Video Editing': '🎬', 'Software Download': '📥',
  'Fonts Collection': '🔤', 'Templates': '📝', 'Google Drive Collections': '📁',
  'File Sharing': '☁️', 'Utility Websites': '🔧', 'Other Useful Websites': '🔗'
};

function parseArgs(argv) {
  const args = { _: [] };
  argv.forEach(a => {
    if (a.startsWith('--')) {
      const [k, v] = a.slice(2).split('=');
      args[k] = v === undefined ? true : v;
    } else {
      args._.push(a);
    }
  });
  return args;
}

function parseCsv(text) {
  // Minimal RFC4180-ish CSV parser (handles quoted fields with commas).
  const rows = [];
  let row = [], field = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') { inQuotes = false; }
      else { field += c; }
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') { row.push(field); field = ''; }
      else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
      else if (c === '\r') { /* skip */ }
      else { field += c; }
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter(r => r.length && r.some(c => c.trim() !== ''));
}

function loadXlsx(filePath) {
  let XLSX;
  try {
    XLSX = require('xlsx');
  } catch (e) {
    console.error('\n❌ Reading .xlsx files requires the "xlsx" package.');
    console.error('   Install it once with:\n\n       npm install xlsx\n');
    process.exit(1);
  }
  const wb = XLSX.readFile(filePath);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false });
  return rows.filter(r => r.length && r.some(c => String(c).trim() !== ''));
}

function rowsToObjects(rows) {
  const header = rows[0].map(h => String(h).trim().toLowerCase());
  return rows.slice(1).map(r => {
    const obj = {};
    header.forEach((h, i) => { obj[h] = (r[i] !== undefined ? String(r[i]).trim() : ''); });
    return obj;
  });
}

function pick(obj, keys) {
  for (const k of keys) {
    if (obj[k]) return obj[k];
  }
  return '';
}

function slugify(str) {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function normalizeRows(objs) {
  return objs.map(o => {
    const title = pick(o, ['title_en', 'title', 'name']);
    const category = pick(o, ['category']) || 'Other Useful Websites';
    const url = pick(o, ['url', 'link']);
    const type = (pick(o, ['type']) || 'official').toLowerCase() === 'download' ? 'download' : 'official';
    return {
      title_en: title,
      title: title,
      title_bn: pick(o, ['title_bn']) || title,
      url,
      category,
      category_icon: CATEGORY_ICON[category] || '🔗',
      icon: CATEGORY_ICON[category] || '🔗',
      description_en: pick(o, ['description_en', 'description']) || `${title} — ${category} resource.`,
      description: pick(o, ['description_en', 'description']) || `${title} — ${category} resource.`,
      description_bn: pick(o, ['description_bn']) || `${title} — ${category} সংক্রান্ত রিসোর্স।`,
      type,
      badge: type === 'download' ? 'Download' : 'Official',
      slug: slugify(title)
    };
  }).filter(r => r.title_en && r.url);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const inputFile = args._[0];
  const outFile = args.out || 'assets/data/resources.json';
  const merge = !!args.merge;

  if (!inputFile) {
    console.error('Usage: node tools/import-resources.js <input.csv|input.xlsx> [--out=path] [--merge]');
    process.exit(1);
  }
  if (!fs.existsSync(inputFile)) {
    console.error('❌ File not found:', inputFile);
    process.exit(1);
  }

  const ext = path.extname(inputFile).toLowerCase();
  let rows;
  if (ext === '.csv') {
    rows = parseCsv(fs.readFileSync(inputFile, 'utf8'));
  } else if (ext === '.xlsx' || ext === '.xls') {
    rows = loadXlsx(inputFile);
  } else {
    console.error('❌ Unsupported file type:', ext, '— use .csv or .xlsx (Google Sheets: File > Download > either format)');
    process.exit(1);
  }

  const objs = rowsToObjects(rows);
  let imported = normalizeRows(objs);

  let existing = [];
  if (merge && fs.existsSync(outFile)) {
    existing = JSON.parse(fs.readFileSync(outFile, 'utf8'));
  }

  const seenUrls = new Set(existing.map(r => (r.url || '').toLowerCase()));
  const merged = existing.slice();
  let skipped = 0;

  imported.forEach(r => {
    const key = r.url.toLowerCase();
    if (seenUrls.has(key)) { skipped++; return; }
    seenUrls.add(key);
    merged.push(r);
  });

  merged.sort((a, b) => (a.title_en || '').localeCompare(b.title_en || ''));
  merged.forEach((r, i) => { r.id = i + 1; });

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify(merged, null, 2), 'utf8');

  console.log('✅ Import complete');
  console.log('   Rows read from input:', objs.length);
  console.log('   Valid resources imported:', imported.length);
  console.log('   Skipped as duplicate URL:', skipped);
  console.log('   Total resources in output file:', merged.length);
  console.log('   Output written to:', outFile);
}

main();
