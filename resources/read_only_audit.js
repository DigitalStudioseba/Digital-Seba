const fs = require('fs');
const path = require('path');

const basePath = 'C:/Users/Monir/Downloads/Compressed/main project/digiseba.shop';
const sourcePath = path.join(basePath, 'resources/Drive links name.txt');
const currentHtmlPath = path.join(basePath, 'resources/index.html');
const backupHtmlPath = path.join(basePath, 'temp_zip_backup/workspace Digital Seba/assets/resources/index.html');

console.log("==================================================");
console.log("1-3. FOLDER & RESOURCE COUNTS (SOURCE)");
console.log("==================================================");

const sourceLines = fs.readFileSync(sourcePath, 'utf8').split('\n').map(l => l.trim()).filter(l => l);

const foldersMap = new Map();
let currentFolder = 'Uncategorized';
let currentTitle = '';
const sourcePairs = [];

for (let line of sourceLines) {
    if (line.includes('📁 Folder:')) {
        currentFolder = line.split('📁 Folder:')[1].trim();
        if (!foldersMap.has(currentFolder)) foldersMap.set(currentFolder, 0);
    } else if (line.includes('📄 ')) {
        currentTitle = line.split('📄 ')[1].trim();
    } else if (line.includes('🔗 ')) {
        const url = line.split('🔗 ')[1].trim();
        if (currentTitle && url) {
            foldersMap.set(currentFolder, foldersMap.get(currentFolder) + 1);
            sourcePairs.push({ folder: currentFolder, title: currentTitle, url: url });
            currentTitle = '';
        }
    }
}

console.log(`2. Total unique folder count: ${foldersMap.size}`);
// We will print the full folder counts below
let totalParsedSource = 0;
foldersMap.forEach((count, folder) => {
    totalParsedSource += count;
    // console.log(`   - ${folder}: ${count}`);
});
console.log(`3. Total resources across all folders: ${totalParsedSource}`);


console.log("\n==================================================");
console.log("9-12. MASTER RESOURCE DATA AUDIT");
console.log("==================================================");

function getMasterResData(html) {
    const match = html.match(/const masterResData = \[(.*?)\];/s);
    if (!match) return [];
    try {
        // Simple eval to parse the JS array object safely
        const evalStr = `(function() { const masterResData = [${match[1]}]; return masterResData; })()`;
        return eval(evalStr);
    } catch(e) {
        return [];
    }
}

const backupHtml = fs.readFileSync(backupHtmlPath, 'utf8');
const backupMaster = getMasterResData(backupHtml);
console.log(`9. Original backup masterResData count: ${backupMaster.length}`);

const currentHtml = fs.readFileSync(currentHtmlPath, 'utf8');
const currentMaster = getMasterResData(currentHtml);
console.log(`10. Current page masterResData count: ${currentMaster.length}`);

let missingMaster = 0;
backupMaster.forEach(bm => {
    const found = currentMaster.find(cm => cm.id === bm.id && cm.url === bm.url);
    if (!found) missingMaster++;
});
console.log(`12. Original master resources missing or changed: ${missingMaster}`);


console.log("\n==================================================");
console.log("4-7. CATEGORY DISTRIBUTION (PARSED DATA)");
console.log("==================================================");

const allFilesMatch = currentHtml.match(/window\.allFiles = \[(.*?)\];/s);
let allFiles = [];
if (allFilesMatch) {
    allFiles = JSON.parse('[' + allFilesMatch[1] + ']');
}

const catDist = {};
allFiles.forEach(f => {
    catDist[f.category] = (catDist[f.category] || 0) + 1;
});
console.log(`6. Drive resources category distribution:`);
console.dir(catDist);

if (catDist['downloads'] === 3204) {
    console.log(`7. FAIL: All 3,204 Drive resources are dumped into 'downloads'. Category mapping is NOT solved.`);
}


console.log("\n==================================================");
console.log("13. FIRST 30 AND LAST 30 RESOURCES");
console.log("==================================================");
console.log("--- First 30 ---");
for(let i=0; i<30 && i<allFiles.length; i++) {
    const s = sourcePairs[i];
    const p = allFiles[i];
    console.log(`[${i}] Source Folder: ${s.folder} | Title: ${s.title} | Parsed Cat: ${p.category} | URL: ${s.url}`);
}
console.log("\n--- Last 30 ---");
for(let i=Math.max(0, allFiles.length-30); i<allFiles.length; i++) {
    const s = sourcePairs[i];
    const p = allFiles[i];
    console.log(`[${i}] Source Folder: ${s.folder} | Title: ${s.title} | Parsed Cat: ${p.category} | URL: ${s.url}`);
}


console.log("\n==================================================");
console.log("14. 100 RANDOM SAMPLES VERIFICATION");
console.log("==================================================");
let sampleMatches = 0;
for(let i=0; i<100; i++) {
    const idx = Math.floor(Math.random() * allFiles.length);
    const s = sourcePairs[idx];
    const p = allFiles[idx];
    if (s.folder === p.folder && s.title === p.title && s.url === p.url) {
        sampleMatches++;
    }
}
console.log(`100 Random Samples matched exactly? ${sampleMatches}/100`);


console.log("\n==================================================");
console.log("15. DUPLICATES REPORT");
console.log("==================================================");
const urls = new Set();
const titles = new Set();
let dupUrls = 0;
let dupTitles = 0;
sourcePairs.forEach(p => {
    if (urls.has(p.url)) dupUrls++;
    urls.add(p.url);
    if (titles.has(p.title)) dupTitles++;
    titles.add(p.title);
});
console.log(`Duplicate URL count: ${dupUrls}`);
console.log(`Duplicate Title count: ${dupTitles}`);
console.log("Reason: These duplicates exist natively in the original 'Drive links name.txt' source file. For example, the exact same URL is sometimes pasted multiple times, or the same title is used across different folders.");

