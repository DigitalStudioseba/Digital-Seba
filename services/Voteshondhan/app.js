/*
 * VoteSondhan — real browser PDF parser
 * Parser build: v9 column-stream reconstruction
 *
 * The supplied voter-list PDF is a 3-column, 5-row repeating table:
 *   1) Serial + Name
 *   2) Voter ID
 *   3) Father
 *   4) Mother
 *   5) Occupation + DOB
 *   6) Address
 *
 * We reconstruct the physical PDF rows from PDF.js X/Y coordinates first,
 * then map each row to the three physical columns. No server/API is used.
 */

let pdfjsLib = window.pdfjsLib || null;

const PDFJS_CDNS = [
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js',
  'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.min.js'
];
const PDFJS_WORKERS = [
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
  'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js',
  'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js'
];

function loadExternalScript(src) {
  return new Promise((resolve, reject) => {
    const tag = document.createElement('script');
    tag.src = src;
    tag.async = false;
    tag.crossOrigin = 'anonymous';
    tag.onload = () => window.pdfjsLib ? resolve(window.pdfjsLib) : reject(new Error('Loaded but pdfjsLib is unavailable'));
    tag.onerror = () => reject(new Error('Failed to load ' + src));
    document.head.appendChild(tag);
  });
}

async function localFileExists(path) {
  try {
    const r = await fetch(path, { cache: 'no-store' });
    return r.ok;
  } catch (_) { return false; }
}

async function ensurePdfJs() {
  if (!pdfjsLib && window.pdfjsLib) pdfjsLib = window.pdfjsLib;

  if (!pdfjsLib) {
    for (const src of PDFJS_CDNS) {
      try { pdfjsLib = await loadExternalScript(src); break; } catch (_) {}
    }
  }

  if (!pdfjsLib) throw new Error('PDF.js failed to load. Check internet connection or PDF.js CDN access.');

  // Use a local worker when the file really exists; otherwise use the CDN worker.
  if (await localFileExists('vendor/pdf.worker.min.js')) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'vendor/pdf.worker.min.js';
  } else {
    pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKERS[0];
  }
  return pdfjsLib;
}

const $ = id => document.getElementById(id);
const state = { records: [], filtered: [], page: 1, pageSize: 10, fileName: '' };

const BN = '০১২৩৪৫৬৭৮৯';
const EN = '0123456789';
const serialRe = /([০-৯0-9]{3})\.\s*নাম\s*:/g;
const voterLabelRe = /(?:Ï)?ভাটার\s*নং\s*:/i;

function clean(s) {
  return String(s ?? '').replace(/\s+/g, ' ').trim();
}

function asciiDigits(s) {
  return String(s ?? '').replace(/[০-৯]/g, c => EN[BN.indexOf(c)]);
}

function displayBanglaDigits(s) {
  return String(s ?? '').replace(/[0-9]/g, c => BN[Number(c)]);
}

/*
 * The PDF contains mixed legacy Bengali glyph text. These are conservative
 * replacements observed in the supplied real extraction; normal Bengali is
 * left untouched.
 */
function normalizeBangla(input) {
  let x = clean(input);

  // The supplied voter-list PDFs use a legacy Bengali PDF font encoding.
  // PDF.js extracts some glyphs in a visually equivalent but textually
  // corrupted form (for example: Ïভাটার, িনবÎাচন, চħ, িদলরুবা).
  // Keep the repair conservative: phrase/glyph repairs first, then Bengali
  // vowel-sign ordering. Avoid broad one-character substitutions that can
  // silently damage legitimate Bengali words.

  const map = [
    // Structural/header text.
    ['িনবÎাচন', 'নির্বাচন'], ['িসিট', 'সিটি'], ['কিমশন', 'কমিশন'],
    ['Ïভাটার', 'ভোটার'], ['Ïজলা', 'জেলা'], ['Ïমাছাঃ', 'মোছাঃ'],
    ['Ïমাঃ', 'মোঃ'], ['Ïপৗরসভা', 'পৌরসভা'], ['উপেজলা', 'উপজেলা'],
    ['নńর', 'নম্বর'], ['ÏপাŞেকাড', 'পোস্টকোড'], ['ÏপাŞ', 'পোস্ট'],
    ['অûল', 'অঞ্চল'], ['চূড়াĢ', 'চূড়ান্ত'], ['চূড়াĢ', 'চূড়ান্ত'],
    ['সবÎেমাট', 'সর্বমোট'], ['মিহলা', 'মহিলা'], ['পুƁষ', 'পুরুষ'],
    ['Ïভাটার তািলকা', 'ভোটার তালিকা'], ['Ĵকােশর', 'প্রকাশের'],
    ['ওয়াডÎ', 'ওয়ার্ড'], ['ওয়াডÎ', 'ওয়ার্ড'], ['ইউিনয়ন', 'ইউনিয়ন'],
    ['কËাটনেমট', 'ক্যান্টনমেন্ট'], ['িপতা', 'পিতা'], ['িঠকানা', 'ঠিকানা'],
    ['জĥ তািরখ', 'জন্ম তারিখ'], ['Ïপশা', 'পেশা'],

    // Frequent words / names seen in the real voter-list PDFs.
    ['Ïবগম', 'বেগম'], ['Ïগালাপ', 'গোলাপ'], ['Ïগালাপী', 'গোলাপী'],
    ['Ïবসরকারী', 'বেসরকারী'], ['Ïবকার', 'বেকার'], ['Ïরজাউল', 'রেজাউল'],
    ['Ïমাশারফ', 'মোশারফ'], ['Ïমাসেলম', 'মোসলেম'], ['Ïমাকেছদ', 'মোকছেদ'],
    ['Ïমাকসেদ', 'মোকছেদ'], ['ÏমাজােŇল', 'মোজাম্মেল'], ['Ïমাতােলব', 'মোতালেব'],
    ['Ïহােসন', 'হোসেন'], ['Ïহেলûা', 'হেলেঞ্চা'], ['Ïফরেদাসী', 'ফেরদৌসী'],
    ['Ïনছা', 'নেছা'], ['Ïতইমুদীন', 'তাইমুদ্দীন'], ['ওেহদা', 'ওহেদা'],
    ['মুিমর', 'মুমিন'], ['Ïখাজামুদীন', 'খাজামুদ্দীন'], ['মডল', 'মন্ডল'],
    ['পĐীতলা', 'পত্নীতলা'], ['নওগঁা', 'নওগাঁ'],
    ['ƀলতানা', 'সুলতানা'], ['ƀĤর', 'সুন্দর'], ['ƁƆল', 'রুহুল'],
    ['ƀমী', 'সুমি'], ['Űিমক', 'শ্রমিক'], ['Řিমক', 'শ্রমিক'],
    ['িশÙক', 'শিক্ষক'], ['দিজÎ', 'দর্জি'], ['বËবসা', 'ব্যবসা'],
    ['িরÔা/ভËান চালক', 'রিকশা/ভ্যান চালক'],

    // Exact malformed forms observed in the current female voter-list PDF.
    ['িদলরুবা', 'দিলরুবা'], ['িদদার বyস', 'দিদার বক্স'],
    ['হািলমা', 'হালিমা'], ['গৃিহনী', 'গৃহিণী'],
    ['মাসুদা আ×ার', 'মাসুদা আক্তার'], ['Ïমাকেছদ', 'মোকছেদ'],
    ['মােজদা', 'মাজেদা'], ['Ïববী', 'বেবী'], ['িবজয় চħ', 'বিজয় চন্দ্র'],
    ['মায়া রাণী', 'মায়া রাণী'], ['সুিমĔা', 'সুমিত্রা'],
    ['উেপন চħ', 'উপেন চন্দ্র'], ['কপূিল', 'কপূরি'], ['Řীষ চħ', 'কৃষ্ণ চন্দ্র'],
    ['িবমল চħ', 'বিমল চন্দ্র'], ['কািলপদ চħ', 'কালিপদ চন্দ্র'],
    ['Ïশফালী', 'শেফালী'], ['অনকুল চħ', 'অনুকুল চন্দ্র'],
    ['িনভাসী', 'নিবাসী'], ['সুেবাধ চħ', 'সুবোধ চন্দ্র'],
    ['িদপালী', 'দীপালী'], ['মনেমাহন চħ', 'মনমোহন চন্দ্র'],
    ['বাষিরয়া', 'বাশরিয়া'], ['পিŔম', 'পশ্চিম']
  ];

  for (const [a, b] of map) x = x.split(a).join(b);

  // Only after phrase-level repairs, apply isolated legacy glyph repairs.
  // This ordering is intentional: a blanket Ï -> '' before phrase repairs
  // would make patterns such as Ïবেগম impossible to match.
  const glyphs = [
    ['Ï', 'ে'], ['ĺ', 'ব্দ'], ['Ĩ', 'ন্ন'], ['ſ', 'নূ'], ['Ð', 'আ'],
    ['Î', 'র্'], ['ė', 'দ'], ['å', 'ড়'], ['Ž', 'ষ'],
    ['ƀ', 'সু'], ['Ɓ', 'রু'], ['Ň', 'ম'], ['', ''], ['', 'হ'],
    ['Ĵ', 'প্র'], ['Ō', 'ল্ল'], ['ļ', 'জ্জ'], ['õ', 'জ্জ'],
    ['ý', 'দ'], ['þ', 'ৎ'], ['Ŝ', 'শ'], ['ƃ', 'দু'], ['ƣ', 'কু'],
    ['Ɨ', 'শ'], ['Ś', 'শ'], ['Ƙ', 'ক'], ['Ƃ', 'রু'], ['Ɔ', 'শ'],
    ['ê', 'ঙ্গ'], ['×', 'ক্ত'], ['Ĕ', 'ত্র'], ['œ', '্ন']
  ];
  for (const [a, b] of glyphs) x = x.split(a).join(b);

  // PDF.js may expose Bengali ই-কার before its base consonant. Move the
  // pre-base i-kar only across its immediately following consonant. The
  // preceding base/vowel sign is retained, so `িদল` -> `দিল` and
  // `হািল` -> `হালি`, without scrambling already-correct Bengali.
  // Only repair a genuinely pre-base ই-কার. A previous broad rule moved the
  // normal vowel sign in words such as `পিতা`, `ঠিকানা`, and `তারিখ`, which
  // produced new spelling errors. Keep the two real legacy layouts only:
  //   `িদল` -> `দিল` (i-kar at a token start)
  //   `হািল` -> `হালি` (i-kar after an existing vowel sign)
  // Map legacy split characters
  const exactLegacy = [
    ['েভাটার', 'ভোটার'], ['েপশা', 'পেশা'], ['েজলা', 'জেলা'],
    ['েমাঃ', 'মোঃ'], ['েপৗরসভা', 'পৌরসভা'], ['েবগম', 'বেগম'],
    ['েমাছাঃ', 'মোছাঃ'], ['মাসাঃ', 'মোছাঃ'], ['মেোছাঃ', 'মোছাঃ'],
    ['ফেরদৗস', 'ফেরদৌস']
  ];
  for (const [a, b] of exactLegacy) x = x.split(a).join(b);

  x = x.replace(/(^|[\s,:;()\[\]\-])([িেৈ])([ক-হড়ঢ়য়])/g, '$1$3$2');
  x = x.replace(/([ক-হড়ঢ়য়][া-ৌৃ])([িেৈ])([ক-হড়ঢ়য়])/g, '$1$3$2');

  // Exact repairs after i-kar normalization, so the repair strings are
  // stable and are not modified again by the ordering pass.
  const exact = [
    ['দলিরুবা', 'দিলরুবা'], ['দদিার', 'দিদার'], ['হালমিা', 'হালিমা'],
    ['গৃহণিী', 'গৃহিণী'], ['বজিয়', 'বিজয়'], ['সুমতি্রা', 'সুমিত্রা'],
    ['কালপিদ', 'কালিপদ'], ['নবিাসী', 'নিবাসী'],
    ['বাশরয়িা', 'বাশরিয়া'], ['পশ্চমি', 'পশ্চিম']
  ];
  for (const [a, b] of exact) x = x.split(a).join(b);

  // Repair common conjuncts produced as a visible legacy marker.
  x = x.replace(/চ(?=ন|দ|র)/g, 'চ');
  x = x.replace(/ন্দ্র/g, 'ন্দ্র');

  // Clean duplicated whitespace/punctuation introduced by extraction.
  x = x.replace(/\s*:\s*/g, ': ')
       .replace(/\s*,\s*/g, ', ')
       .replace(/\s{2,}/g, ' ')
       .trim();

  return x;
}

function groupRows(items, tolerance = 4) {
  const rows = [];
  const sorted = [...items]
    .filter(i => clean(i.str))
    .sort((a, b) => b.y - a.y || a.x - b.x);

  for (const item of sorted) {
    let row = null;
    for (const candidate of rows) {
      if (Math.abs(candidate.y - item.y) <= tolerance) {
        row = candidate;
        break;
      }
    }
    if (!row) {
      row = { y: item.y, items: [] };
      rows.push(row);
    }
    row.items.push(item);
  }

  rows.sort((a, b) => b.y - a.y);
  for (const row of rows) row.items.sort((a, b) => a.x - b.x);
  return rows;
}

function rowText(row) {
  return clean(row.items.map(i => i.str).join(' '));
}

function findSerialNames(row) {
  const found = [];
  for (const item of row.items) {
    const text = clean(item.str);
    const re = /([০-৯0-9]{3})\.\s*নাম\s*:\s*(.*)$/;
    const m = text.match(re);
    if (m) found.push({ serial: displayBanglaDigits(m[1]), name: clean(m[2]), x: item.x });
  }
  return found;
}

function parseNameCells(row) {
  const text = normalizeBangla(rowText(row));
  const matches = Array.from(text.matchAll(/([০-৯0-9]{3})\s*\.\s*নাম\s*:\s*(.*?)(?=\s+[০-৯0-9]{3}\s*\.\s*নাম|$)/g));
  
  if (matches.length === 0) return [];

  const candidateXs = row.items
    .filter(i => /[০-৯0-9]/.test(i.str) || i.str.includes('নাম'))
    .map(i => i.x);
  
  const xs = uniqueSortedXs(candidateXs, 40);
  
  const names = [];
  for (let i = 0; i < matches.length; i++) {
    names.push({
      serial: displayBanglaDigits(matches[i][1]),
      name: clean(matches[i][2]),
      x: xs[i] || (row.items[0] ? row.items[0].x + i * 200 : 0)
    });
  }
  return names;
}

function uniqueSortedXs(values, minGap = 25) {
  const xs = [...values].filter(Number.isFinite).sort((a, b) => a - b);
  const out = [];
  for (const x of xs) {
    if (!out.length || Math.abs(x - out[out.length - 1]) >= minGap) out.push(x);
  }
  return out;
}

function getColumnAnchors(nameRow, nearbyRows = []) {
  // Primary source: the X coordinate of each serial/name start.
  const names = parseNameCells(nameRow).sort((a, b) => a.x - b.x);
  const primary = uniqueSortedXs(names.map(n => n.x), 40);
  if (primary.length >= 3) return primary.slice(0, 3);

  // Some PDFs split a `serial + নাম:` run into multiple text items. In that
  // case the name-row detector may see fewer than three starts. Look at the
  // labelled rows immediately below it and use the left edge of their labels
  // as additional column anchors.
  const candidates = [];
  const labelRe = /(?:ভোটার\s*নং|পিতা|মাতা|পেশা|জন্ম\s*তারিখ|ঠিকানা)\s*:/;
  for (const row of [nameRow, ...nearbyRows.slice(0, 10)]) {
    for (const item of row.items) {
      const t = normalizeBangla(item.str);
      if (labelRe.test(t)) candidates.push(item.x);
    }
  }

  const merged = uniqueSortedXs([...primary, ...candidates], 40);
  if (merged.length >= 3) return merged.slice(0, 3);

  // Last-resort geometry: cluster all visible X starts into three groups.
  // This is intentionally geometry-only; no text is guessed here.
  const allX = uniqueSortedXs([...(nameRow.items || []).map(i => i.x), ...nearbyRows.flatMap(r => r.items.map(i => i.x))], 12);
  if (allX.length >= 3) {
    const min = allX[0], max = allX[allX.length - 1];
    const width = Math.max(1, max - min);
    const thirds = [min, min + width / 3, min + 2 * width / 3];
    return thirds.map(target => allX.reduce((best, x) => Math.abs(x - target) < Math.abs(best - target) ? x : best, allX[0]));
  }
  return primary.slice(0, 3);
}

function cellsForRow(row, anchors) {
  if (!row || !anchors.length) return [];
  const sortedAnchors = [...anchors].sort((a, b) => a - b).slice(0, 3);
  const cells = sortedAnchors.map(() => []);
  const boundaries = [];
  for (let i = 0; i < sortedAnchors.length - 1; i++) {
    boundaries.push((sortedAnchors[i] + sortedAnchors[i + 1]) / 2);
  }

  for (const item of row.items) {
    const text = clean(item.str);
    if (!text) continue;
    let col = 0;
    while (col < boundaries.length && item.x >= boundaries[col]) col++;
    if (col < cells.length) cells[col].push(text);
  }
  return cells.map(parts => clean(parts.join(' ')));
}

function extractFieldFromColumn(text) {
  const n = normalizeBangla(text);
  const result = { voterId: '', father: '', mother: '', occupation: '', dob: '', address: '' };

  const id = n.match(/(?:ভোটার|ভাটার|েভাটার)\s*নং\s*:\s*([০-৯0-9]{10,17})/);
  if (id) result.voterId = displayBanglaDigits(id[1]);
  if (!id) {
    const fallbackId = n.match(/([০-৯0-9]{10,17})/);
    if (fallbackId) result.voterId = displayBanglaDigits(fallbackId[1]);
  }

  const father = n.match(/পিতা\s*:\s*(.*?)(?=\s+(?:মাতা|পেশা|জন্ম\s*তারিখ|ঠিকানা)\s*:|$)/);
  if (father) result.father = clean(father[1]);

  const mother = n.match(/মাতা\s*:\s*(.*?)(?=\s+(?:পিতা|পেশা|জন্ম\s*তারিখ|ঠিকানা)\s*:|$)/);
  if (mother) result.mother = clean(mother[1]);

  // Occupation and DOB are allowed to be on the same line OR on separate
  // physical rows. Parsing the complete column stream makes both layouts work.
  const occupation = n.match(/পেশা\s*:\s*(.*?)(?=\s+(?:জন্ম\s*তারিখ|ঠিকানা|পিতা|মাতা)\s*:|$)/);
  if (occupation) result.occupation = clean(occupation[1]).replace(/[\s,،]+$/g, '');

  const dob = n.match(/জন্ম\s*তারিখ\s*:\s*([০-৯0-9]{2}\s*\/\s*[০-৯0-9]{2}\s*\/\s*[০-৯0-9]{4})/);
  if (dob) result.dob = dob[1].replace(/\s/g, '');

  const address = n.match(/ঠিকানা\s*:\s*(.*?)(?=\s+(?:ভোটার\s*নং|পিতা|মাতা|পেশা|জন্ম\s*তারিখ)\s*:|$)/);
  if (address) result.address = clean(address[1]);

  return result;
}

function extractBlockFields(rows, startIndex, endIndex, anchors, expectedCount) {
  const streams = Array.from({ length: Math.max(3, expectedCount) }, () => []);
  for (let j = startIndex; j < endIndex; j++) {
    const cells = cellsForRow(rows[j], anchors);
    for (let c = 0; c < streams.length && c < cells.length; c++) {
      if (cells[c]) streams[c].push(cells[c]);
    }
  }

  const fields = streams.map(parts => extractFieldFromColumn(parts.join(' ')));

  // If geometry was imperfect, use row-wide labelled extraction as a fallback
  // only for fields still missing. This never overwrites a geometry-derived
  // value, so a correct column match always wins.
  const fallback = { voterId: [], father: [], mother: [], occupation: [], dob: [], address: [] };
  for (let j = startIndex; j < endIndex; j++) {
    const t = normalizeBangla(rowText(rows[j]));
    const id = t.match(/(?:ভোটার|ভাটার|েভাটার)\s*নং\s*:\s*([০-৯0-9]{10,17})/g) || [];
    id.forEach(v => { const m = v.match(/([০-৯0-9]{10,17})/); if (m) fallback.voterId.push(displayBanglaDigits(m[1])); });
    const f = Array.from(t.matchAll(/পিতা\s*:\s*(.*?)(?=\s+মাতা\s*:|\s+পেশা\s*:|\s+জন্ম\s*তারিখ\s*:|\s+ঠিকানা\s*:|$)/g));
    const m = Array.from(t.matchAll(/মাতা\s*:\s*(.*?)(?=\s+পিতা\s*:|\s+পেশা\s*:|\s+জন্ম\s*তারিখ\s*:|\s+ঠিকানা\s*:|$)/g));
    const a = Array.from(t.matchAll(/ঠিকানা\s*:\s*(.*?)(?=\s+ভোটার\s*নং\s*:|\s+পিতা\s*:|\s+মাতা\s*:|\s+পেশা\s*:|\s+জন্ম\s*তারিখ\s*:|$)/g));
    f.forEach(x => fallback.father.push(clean(x[1])));
    m.forEach(x => fallback.mother.push(clean(x[1])));
    a.forEach(x => fallback.address.push(clean(x[1])));
    const od = t.match(/পেশা\s*:\s*(.*?)\s*,?\s*জন্ম\s*তারিখ\s*:\s*([০-৯0-9]{2}\s*\/\s*[০-৯0-9]{2}\s*\/\s*[০-৯0-9]{4})/);
    if (od) fallback.occupation.push(clean(od[1])), fallback.dob.push(od[2].replace(/\s/g, ''));
  }

  for (let i = 0; i < fields.length; i++) {
    if (!fields[i].voterId && fallback.voterId[i]) fields[i].voterId = fallback.voterId[i];
    if (!fields[i].father && fallback.father[i]) fields[i].father = fallback.father[i];
    if (!fields[i].mother && fallback.mother[i]) fields[i].mother = fallback.mother[i];
    if (!fields[i].occupation && fallback.occupation[i]) fields[i].occupation = fallback.occupation[i];
    if (!fields[i].dob && fallback.dob[i]) fields[i].dob = fallback.dob[i];
    if (!fields[i].address && fallback.address[i]) fields[i].address = fallback.address[i];
  }
  return fields.slice(0, expectedCount);
}

function parseFullRowValues(row, type) {
  const text = normalizeBangla(rowText(row));
  if (type === 'voter') return Array.from(text.matchAll(/(?:ভোটার|ভাটার|েভাটার)\s*নং\s*:\s*([০-৯0-9]{10,17})/g)).map(m => displayBanglaDigits(m[1]));
  if (type === 'father') return Array.from(text.matchAll(/পিতা\s*:\s*(.*?)(?=\s+মাতা\s*:|\s+পেশা\s*:|\s+জন্ম\s*তারিখ\s*:|\s+ঠিকানা\s*:|$)/g)).map(m => clean(m[1]));
  if (type === 'mother') return Array.from(text.matchAll(/মাতা\s*:\s*(.*?)(?=\s+পিতা\s*:|\s+পেশা\s*:|\s+জন্ম\s*তারিখ\s*:|\s+ঠিকানা\s*:|$)/g)).map(m => clean(m[1]));
  if (type === 'address') return Array.from(text.matchAll(/ঠিকানা\s*:\s*(.*?)(?=\s+ভোটার\s*নং\s*:|\s+পিতা\s*:|\s+মাতা\s*:|\s+পেশা\s*:|\s+জন্ম\s*তারিখ\s*:|$)/g)).map(m => clean(m[1]));
  if (type === 'occupation') return Array.from(text.matchAll(/পেশা\s*:\s*(.*?)\s*,?\s*জন্ম\s*তারিখ\s*:\s*([০-৯0-9]{2}\s*\/\s*[০-৯0-9]{2}\s*\/\s*[০-৯0-9]{4})/g)).map(m => ({ occupation: clean(m[1]), dob: m[2].replace(/\s/g, '') }));
  return [];
}

function parseVoterCells(row, anchors) { return cellsForRow(row, anchors).map(c => extractFieldFromColumn(c).voterId); }
function parseFatherCells(row, anchors) { return cellsForRow(row, anchors).map(c => extractFieldFromColumn(c).father); }
function parseMotherCells(row, anchors) { return cellsForRow(row, anchors).map(c => extractFieldFromColumn(c).mother); }
function parseAddressCells(row, anchors) { return cellsForRow(row, anchors).map(c => extractFieldFromColumn(c).address); }
function parseOccupationDobCells(row, anchors) { return cellsForRow(row, anchors).map(c => { const f = extractFieldFromColumn(c); return { occupation: f.occupation, dob: f.dob }; }); }

function isDataNameRow(row) {
  return /([০-৯0-9]{3})\s*\.\s*নাম\s*:/.test(normalizeBangla(rowText(row)));
}

function isVoterRow(row) { return /(?:ভোটার|ভাটার|েভাটার)\s*নং\s*:/.test(normalizeBangla(rowText(row))); }
function isFatherRow(row) { return /(?:িপতা|পিতা)\s*:/.test(normalizeBangla(rowText(row))); }
function isMotherRow(row) { return /মাতা\s*:/.test(normalizeBangla(rowText(row))); }
function isOccupationRow(row) { return /(?:Ïপশা|পেশা)\s*:/.test(normalizeBangla(rowText(row))); }
function isAddressRow(row) { return /(?:িঠকানা|ঠিকানা)\s*:/.test(normalizeBangla(rowText(row))); }

function makeRecord(name, fields, page, fileName) {
  const voterKey = asciiDigits(fields.voterId || '');
  return {
    serial: name.serial,
    name: normalizeBangla(name.name),
    voterId: fields.voterId || '',
    father: normalizeBangla(fields.father || ''),
    mother: normalizeBangla(fields.mother || ''),
    occupation: normalizeBangla(fields.occupation || ''),
    dob: displayBanglaDigits(asciiDigits(fields.dob || '')),
    address: normalizeBangla(fields.address || ''),
    status: 'Active',
    sourcePage: page,
    sourceFile: fileName,
    _voterKey: voterKey
  };
}

function extractRecordsFromPage(rows, page, fileName, diagnostics) {
  const records = [];
  for (let i = 0; i < rows.length; i++) {
    if (!isDataNameRow(rows[i])) continue;

    const names = parseNameCells(rows[i]);
    const end = (() => {
      for (let j = i + 1; j < rows.length; j++) if (isDataNameRow(rows[j])) return j;
      return rows.length;
    })();
    const anchors = getColumnAnchors(rows[i], rows.slice(i + 1, Math.min(end, i + 12)));
    const fields = extractBlockFields(rows, i + 1, end, anchors, names.length);
    const block = {
      page,
      rowIndex: i,
      anchors,
      serials: names.map(n => n.serial),
      rawRows: rows.slice(i, end).map(rowText)
    };
    diagnostics.blocks.push(block);
    diagnostics.serialStarts += names.length;

    for (let k = 0; k < names.length; k++) {
      const record = makeRecord(names[k], fields[k] || {}, page, fileName);
      diagnostics.candidateRecords.push(record);
      records.push(record);
    }
  }
  return records;
}

function diagnosticFailure(d) {
  if (!d.pagesWithText) return 'PDF.js Extraction Failed (No text pages)';
  if (!d.serialStarts) return 'Record Start Detection Failed (No serial/name rows)';
  if (!d.candidateRecords.length) return 'Candidate Reconstruction Failed';
  if (!d.validRecords.length) return 'Validation Failed (All candidates rejected)';
  return 'PASS';
}

async function parsePDF(file) {
  if (!pdfjsLib) throw new Error('PDF.js failed to load.');

  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const d = {
    file: file.name,
    pages: pdf.numPages,
    pagesWithText: 0,
    totalTextItems: 0,
    totalExtractedCharacters: 0,
    physicalRows: 0,
    serialStarts: 0,
    candidateBlocks: 0,
    candidateRecords: [],
    validRecords: [],
    invalidRecords: [],
    duplicateRecords: 0,
    pagesData: [],
    blocks: [],
    rawText: ''
  };

  for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {
    const page = await pdf.getPage(pageNo);
    const tc = await page.getTextContent();
    const items = tc.items.map(it => {
      const tr = it.transform || [1, 0, 0, 1, 0, 0];
      return { str: it.str || '', x: tr[4] || 0, y: tr[5] || 0, w: it.width || 0, h: it.height || 0 };
    }).filter(it => clean(it.str));

    if (items.length) d.pagesWithText++;
    d.totalTextItems += items.length;
    d.totalExtractedCharacters += items.reduce((n, it) => n + it.str.length, 0);

    const rows = groupRows(items);
    d.physicalRows += rows.length;
    const pageRaw = rows.map(rowText).join('\n');
    d.rawText += `===== PAGE ${pageNo} =====\n${pageRaw}\n`;
    d.pagesData.push({ page: pageNo, textItems: items.length, physicalRows: rows.length, rows });

    extractRecordsFromPage(rows, pageNo, file.name, d);
  }

  d.candidateBlocks = d.blocks.length;

  const seen = new Set();
  for (const candidate of d.candidateRecords) {
    if (!candidate._voterKey || candidate._voterKey.length < 10) {
      d.invalidRecords.push(candidate);
      continue;
    }
    const dedupKey = candidate._voterKey + '_' + candidate.serial;
    if (seen.has(dedupKey)) {
      d.duplicateRecords++;
      continue;
    }
    seen.add(dedupKey);
    d.validRecords.push(candidate);
  }

  d.failureStage = diagnosticFailure(d);
  d.rawTextSize = d.rawText.length;
  window.__voteDebug = d;
  return d;
}

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
}

function render() {
  const q = $('search').value.trim().toLowerCase();
  const field = $('field').value;
  const status = $('status').value;
  state.filtered = state.records.filter(r => {
    if (status !== 'all' && r.status !== status) return false;
    if (!q) return true;
    const values = field === 'all' ? Object.values(r) : [r[field]];
    return values.some(v => String(v ?? '').toLowerCase().includes(q));
  });

  const max = Math.max(1, Math.ceil(state.filtered.length / state.pageSize));
  state.page = Math.min(state.page, max);
  const start = (state.page - 1) * state.pageSize;
  const pageRows = state.filtered.slice(start, start + state.pageSize);

  $('tbody').innerHTML = pageRows.map(r => `
    <tr>
      <td>${esc(r.serial)}</td>
      <td><b>${esc(r.name)}</b></td>
      <td>${esc(r.voterId)}</td>
      <td class="parent"><div>F: ${esc(r.father)}</div><div>M: ${esc(r.mother)}</div></td>
      <td>${esc(r.occupation)}</td>
      <td>${esc(r.dob)}</td>
      <td>${esc(r.address)}</td>
      <td><span class="statusBadge">${esc(r.status)}</span></td>
    </tr>`).join('') || '<tr><td colspan="8" class="empty">No voters match your search</td></tr>';

  $('foundCount').textContent = state.filtered.length;
  $('pageInfo').textContent = `${state.page} / ${max}`;
  $('prev').disabled = state.page <= 1;
  $('next').disabled = state.page >= max;
}

function renderDebug(d) {
  if (new URLSearchParams(location.search).get('debug') !== '1') return;
  const existing = document.getElementById('debugPanel');
  if (existing) existing.remove();

  const panel = document.createElement('section');
  panel.id = 'debugPanel';
  panel.style.cssText = 'position:fixed;z-index:99999;left:0;right:0;top:0;max-height:58vh;overflow:auto;background:#151515;color:#eee;border-bottom:3px solid #f33;padding:14px;font:12px/1.45 Consolas,monospace;box-shadow:0 12px 30px #000;';

  const mask = (s) => {
    if (!s) return '';
    const str = String(s);
    if (str.length <= 4) return '***';
    return str.slice(0, 2) + '***' + str.slice(-2);
  };
  const maskText = (str) => {
    if (!str) return '';
    return String(str)
      .replace(/\b\d{9,17}\b/g, m => m.slice(0, 2) + '***' + m.slice(-2))
      .replace(/\b\d{2}[-/.]\d{2}[-/.]\d{4}\b/g, '**/**/****')
      .replace(/[\u0980-\u09FFa-zA-Z]{3,}/g, w => w.length > 4 ? w.slice(0, 2) + '***' : '***');
  };
  const sanitizeRecord = (r) => {
    if (!r || typeof r !== 'object') return r;
    return {
      serial: r.serial,
      sourcePage: r.sourcePage,
      name: mask(r.name),
      voterId: mask(r.voterId),
      father: mask(r.father),
      mother: mask(r.mother),
      dob: mask(r.dob),
      occupation: mask(r.occupation),
      address: mask(r.address)
    };
  };

  const preview = (d.validRecords || []).slice(0, 20).map(r =>
    `${r.serial} | ${mask(r.name)} | ${mask(r.voterId)} | F:${mask(r.father)} | M:${mask(r.mother)} | ${mask(r.occupation)} | ${mask(r.dob)} | ${mask(r.address)} | P${r.sourcePage}`
  ).join('\n');
  const rawRows = (d.blocks || []).slice(0, 5).map((b, i) =>
    `BLOCK ${i+1} | Page ${b.page} | Anchors ${b.anchors.map(x => Math.round(x)).join(', ')} | Serials ${b.serials.join(', ')}\n${b.rawRows.map(maskText).join('\n')}`
  ).join('\n\n----------------------------------------\n\n');

  const sanitizedDiag = {
    pages: d.pages,
    pagesWithText: d.pagesWithText,
    totalTextItems: d.totalTextItems,
    totalExtractedCharacters: d.totalExtractedCharacters,
    physicalRows: d.physicalRows,
    serialStarts: d.serialStarts,
    candidateBlocks: d.candidateBlocks,
    failureStage: d.failureStage,
    duplicateRecords: d.duplicateRecords,
    counts: {
      candidate: (d.candidateRecords || []).length,
      valid: (d.validRecords || []).length,
      invalid: (d.invalidRecords || []).length
    },
    blocksSummary: (d.blocks || []).map((b, i) => ({
      blockIndex: i + 1,
      page: b.page,
      anchors: b.anchors,
      serials: b.serials,
      rowCount: b.rawRows ? b.rawRows.length : 0
    })),
    sampleRecords: (d.validRecords || []).slice(0, 20).map(sanitizeRecord),
    piiStatus: 'REDACTED_FOR_SECURITY'
  };
  const json = JSON.stringify(sanitizedDiag, null, 2);

  panel.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;gap:12px">
      <b style="color:#ffb84d;font-size:14px">⚠️ DEVELOPER DIAGNOSTIC MODE (REDACTED)</b>
      <button id="closeDebug" style="background:#d33;color:#fff;border:0;padding:7px 12px;cursor:pointer">Close Panel</button>
    </div>
    <div style="margin:10px 0;padding:7px;border:1px solid #e6d000;color:#ffe900"><b>FAILURE STAGE:</b> ${esc(d.failureStage)}</div>
    <div style="margin-bottom:8px">
      <button id="copyDiag" style="background:#1488d8;color:#fff;border:0;padding:7px 10px;margin-right:7px;cursor:pointer">Copy Diagnostic JSON</button>
      <button id="copyRaw" style="background:#1b9aaa;color:#fff;border:0;padding:7px 10px;cursor:pointer">Copy Raw TXT (Redacted)</button>
    </div>
    <div>PDF Pages: ${d.pages} | Pages With Text: ${d.pagesWithText} | Total Text Items: ${d.totalTextItems}</div>
    <div>Total Extracted Characters: ${d.totalExtractedCharacters} | Physical Rows: ${d.physicalRows}</div>
    <div>Detected Serial Starts: ${d.serialStarts} | Candidate Blocks: ${d.candidateBlocks}</div>
    <div>Candidate Records: ${d.candidateRecords.length} | Valid Records: ${d.validRecords.length} | Invalid Records: ${d.invalidRecords.length} | Duplicate Records: ${d.duplicateRecords}</div>
    <h4 style="color:#8bd3ff">FIRST 5 RAW CANDIDATE BLOCKS</h4><pre style="background:#080808;padding:10px;max-height:250px;overflow:auto">${esc(rawRows || 'No candidate blocks')}</pre>
    <h4 style="color:#8bd3ff">FIRST 20 PARSED RECORDS</h4><pre style="background:#080808;padding:10px;max-height:250px;overflow:auto">${esc(preview || 'No valid records')}</pre>
    <h4 style="color:#8bd3ff">FIRST 50 RECONSTRUCTED ROWS</h4><pre style="background:#080808;padding:10px;max-height:250px;overflow:auto">${esc(d.pagesData.flatMap(p => p.rows.slice(0, 50).map(r => `P${p.page} Y=${Math.round(r.y)} X=${Math.round(r.items[0]?.x||0)} ${maskText(rowText(r))}`)).slice(0,50).join('\n'))}</pre>
  `;
  document.body.appendChild(panel);
  $('closeDebug').onclick = () => panel.remove();
  $('copyDiag').onclick = async () => { await navigator.clipboard.writeText(json); $('copyDiag').textContent = 'Copied (Redacted)'; };
  $('copyRaw').onclick = async () => { await navigator.clipboard.writeText(maskText(d.rawText)); $('copyRaw').textContent = 'Copied (Redacted)'; };
}

async function handle(files) {
  $('progress').classList.remove('hidden');
  $('progressBar').style.width = '5%';
  $('statusText').textContent = 'PDF parsing চলছে...';

  try {
    const all = [];
    let combinedDiagnostic = null;
    for (let i = 0; i < files.length; i++) {
      const d = await parsePDF(files[i]);
      combinedDiagnostic = d;
      all.push(...d.validRecords);
      $('progressBar').style.width = `${Math.round(((i + 1) / files.length) * 100)}%`;
    }

    // Multiple PDFs: de-duplicate by voter ID while retaining the first record.
    const seen = new Set();
    state.records = all.filter(r => {
      const k = r._voterKey + '_' + r.serial;
      if (!r._voterKey || seen.has(k)) return false;
      seen.add(k); return true;
    });
    state.filtered = state.records;
    state.page = 1;
    state.pageSize = +$('pageSize').value;
    state.fileName = files.length === 1 ? files[0].name : `${files.length} PDF Files (Combined)`;

    $('fileName').textContent = state.fileName;
    $('sourceName').textContent = state.fileName;
    $('uploadView').classList.add('hidden');
    $('resultsView').classList.remove('hidden');
    $('statusText').textContent = state.records.length ? `${state.records.length} records found.` : 'No valid voter records found.';
    render();
    if (combinedDiagnostic) renderDebug(combinedDiagnostic);
  } catch (err) {
    $('statusText').textContent = `Error processing file: ${err.message}`;
    console.error(err);
  }
}

$('fileInput').addEventListener('change', e => { if (e.target.files.length) handle([...e.target.files]); });
$('dropzone').addEventListener('dragover', e => { e.preventDefault(); $('dropzone').classList.add('active'); });
$('dropzone').addEventListener('dragleave', () => $('dropzone').classList.remove('active'));
$('dropzone').addEventListener('drop', e => {
  e.preventDefault(); $('dropzone').classList.remove('active');
  if (e.dataTransfer.files.length) handle([...e.dataTransfer.files]);
});
$('search').addEventListener('input', () => { state.page = 1; render(); });
$('field').addEventListener('change', () => { state.page = 1; render(); });
$('status').addEventListener('change', () => { state.page = 1; render(); });
$('pageSize').addEventListener('change', () => { state.page = 1; state.pageSize = +$('pageSize').value; render(); });
$('prev').onclick = () => { state.page--; render(); };
$('next').onclick = () => { state.page++; render(); };
$('clear').onclick = () => { state.records = []; state.filtered = []; render(); $('fileName').textContent = '—'; $('sourceName').textContent = '—'; $('foundCount').textContent = '0'; $('resultsView').classList.add('hidden'); $('uploadView').classList.remove('hidden'); };
$('newFile').onclick = () => location.reload();
