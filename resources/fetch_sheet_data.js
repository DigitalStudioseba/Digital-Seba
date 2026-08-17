const fs = require('fs');

// We use the already downloaded temp_sheet.csv
const csvText = fs.readFileSync('temp_sheet.csv', 'utf8');

// Simple CSV parser for quoted fields
function parseCSV(text) {
    const rows = [];
    let currentRow = [];
    let currentCell = '';
    let inQuotes = false;
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        
        if (char === '"' && text[i+1] === '"') {
            currentCell += '"';
            i++;
        } else if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            currentRow.push(currentCell);
            currentCell = '';
        } else if (char === '\n' && !inQuotes) {
            currentRow.push(currentCell);
            rows.push(currentRow);
            currentRow = [];
            currentCell = '';
        } else if (char !== '\r') {
            currentCell += char;
        }
    }
    if (currentCell || currentRow.length) {
        currentRow.push(currentCell);
        rows.push(currentRow);
    }
    return rows;
}

const rows = parseCSV(csvText);
const sheetData = [];

// Skip header (row 0)
for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length < 2) continue;
    
    let collectionName = row[0] ? row[0].trim() : '';
    let rawLinks = row[1] ? row[1].trim() : '';
    
    if (!collectionName || !rawLinks) continue;
    
    // Split multiple links by newline
    const links = rawLinks.split('\n').map(l => l.trim()).filter(l => l && l.startsWith('http'));
    
    links.forEach((url, index) => {
        // Since Title is not in the sheet for individual links, we synthesize one
        let title = collectionName;
        if (links.length > 1) {
            title = `${collectionName} - Link ${index + 1}`;
        }
        
        // Since Category is not in the sheet, we default to 'downloads' as most are software/files
        sheetData.push({
            category: 'downloads', 
            folder: collectionName,
            title: title,
            url: url,
            sourceOrder: 10000 + sheetData.length, // Ensure they appear after the 3204 master links
            source: 'sheet'
        });
    });
}

fs.writeFileSync('sheet_resources.json', JSON.stringify(sheetData, null, 2));
console.log(`Parsed ${sheetData.length} items from Google Sheet.`);
