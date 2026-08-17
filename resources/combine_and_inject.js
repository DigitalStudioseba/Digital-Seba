const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index.html');
const sheetPath = path.join(__dirname, '../sheet_resources.json');

// 1. Extract existing window.allFiles from index.html
let html = fs.readFileSync(htmlPath, 'utf8');
const match = html.match(/window\.allFiles\s*=\s*(\[.*?\]);/s);
if (!match) {
    console.error("Could not find window.allFiles in index.html");
    process.exit(1);
}

let existingFiles = [];
try {
    existingFiles = JSON.parse(match[1]);
    console.log(`Extracted ${existingFiles.length} existing items from index.html`);
} catch (e) {
    console.error("Failed to parse existing window.allFiles array:", e.message);
    process.exit(1);
}

// Ensure we don't duplicate sheet items if this script is run multiple times
// The existing items shouldn't have source = 'sheet' if it's pristine, but let's filter them out just in case
existingFiles = existingFiles.filter(item => item.source !== 'sheet');

// 2. Load the parsed Google Sheet data
let sheetFiles = [];
if (fs.existsSync(sheetPath)) {
    try {
        sheetFiles = JSON.parse(fs.readFileSync(sheetPath, 'utf8'));
        console.log(`Loaded ${sheetFiles.length} items from Google Sheet JSON`);
    } catch (e) {
        console.error("Failed to parse sheet_resources.json:", e.message);
    }
}

// 3. Combine them
const combinedFiles = [...existingFiles, ...sheetFiles];
console.log(`Total combined items: ${combinedFiles.length}`);

// 4. Inject back into index.html
const injectedScript = `window.allFiles = ${JSON.stringify(combinedFiles)};`;
const newHtml = html.replace(/window\.allFiles\s*=\s*\[.*?\];/s, injectedScript);

fs.writeFileSync(htmlPath, newHtml, 'utf8');
console.log("Successfully injected combined data into resources/index.html");
