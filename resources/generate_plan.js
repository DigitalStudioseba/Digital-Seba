const fs = require('fs');

const lines = fs.readFileSync('C:/Users/Monir/Downloads/Compressed/main project/digiseba.shop/resources/Drive links name.txt', 'utf8').split('\n').map(l => l.trim()).filter(l => l);

let foldersMap = new Map(); // folder -> []
let currentFolder = 'Uncategorized';
let currentTitle = '';

lines.forEach(line => {
    if (line.includes('📁 Folder:')) {
        currentFolder = line.split('📁 Folder:')[1].trim();
        if (!foldersMap.has(currentFolder)) foldersMap.set(currentFolder, []);
    } else if (line.includes('📄 ')) {
        currentTitle = line.split('📄 ')[1].trim();
    } else if (line.includes('🔗 ')) {
        const url = line.split('🔗 ')[1].trim();
        if (currentTitle && url) {
            if (!foldersMap.has(currentFolder)) foldersMap.set(currentFolder, []);
            foldersMap.get(currentFolder).push({ title: currentTitle, url: url });
            currentTitle = '';
        }
    }
});

let report = `# Implementation Plan: Unified Resource Integration

## Goal Description
The objective is to accurately map and render all 3,204 resource links from the original text file into the Resources page while strictly preserving the existing design, 4 standard tabs, and exact sequence order. We will map folders logically to the 4 existing tabs instead of dumping them all into "Downloads". 

## Open Questions
- Is mapping folders based on keyword heuristics to the 4 tabs acceptable?

## Proposed Changes

### Logic & Architecture
We will update \`parse_resources.js\` to assign a \`sourceOrder\` to each item and a strictly mapped \`category\` based on the folder name.

#### Category Mapping Rules:
1. **jobs**: Folders containing 'job', 'notice', 'circular', 'চাকরি', 'নিয়োগ'.
2. **services**: Folders containing 'software', 'tool', 'driver', 'pc', 'office', 'control', 'fix', 'antivirus', 'setup', 'pc driver'.
3. **links**: Folders containing 'link', 'portal', 'website', 'online'.
4. **downloads**: Everything else (Graphics, Fonts, Vectors, Templates, Banner, Logo, etc.).

#### [MODIFY] assets/js/resources-render.js
- Implement a unified \`allFiles\` renderer that appends DOM cards per tab.
- Group items visually by **Folder** inside the grid! Each folder will have a sub-heading or visual divider IF the user wants folder grouping, or we simply add a visible \`folderBadge\` on the card. Given the constraint "do not change existing design/cards", we will stick to the existing card design but add the folder name as a tiny badge (which was already successful).
- Sort everything by \`sourceOrder\` to guarantee absolute source sequence within each category!

#### [MODIFY] parse_resources.js
- Include \`sourceOrder\` (0 to 3203).
- Implement the comprehensive folder-to-category regex mapping.
- Output \`assets/data/resources.json\` and inject \`window.allFiles\` into \`resources/index.html\`.

## Verification Plan
### Automated Tests
1. \`node deep_dom_audit.js\` to verify 1-to-1 exact matching (DOM cards vs Source txt).
2. Puppeteer visual check of all 4 tabs.
3. Validate total items rendered = 3,204.
`;

fs.writeFileSync('C:/Users/Monir/.gemini/antigravity/brain/f62ddbe0-fe03-4280-9bd0-443ec2ee449a/implementation_plan.md', report);
console.log("Plan generated.");
