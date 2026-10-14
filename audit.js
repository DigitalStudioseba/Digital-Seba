const fs = require("fs");
const path = require("path");

const filesToAudit = [
    "index.html",
    "tools/index.html",
    "services/Voteshondhan/index.html",
    "resources/index.html",
    "live-tv/index.html"
];

filesToAudit.forEach(f => {
    if (fs.existsSync(f)) {
        const content = fs.readFileSync(f, 'utf8');
        console.log(`\n--- AUDIT: ${f} ---`);
        console.log(`Size: ${(content.length / 1024).toFixed(2)} KB`);
        
        // SEO checks
        const hasTitle = /<title>(.*?)<\/title>/.test(content);
        const hasMetaDesc = /<meta\s+name="description"/.test(content);
        const hasOg = /<meta\s+property="og:/.test(content);
        console.log(`SEO -> Title: ${hasTitle}, Desc: ${hasMetaDesc}, OG: ${hasOg}`);
        
        // Security checks (basic)
        const hasEval = content.includes("eval(");
        const hasLocalStorage = content.includes("localStorage.");
        const hasInlineScripts = (content.match(/<script>/g) || []).length;
        console.log(`Security -> eval: ${hasEval}, localStorage: ${hasLocalStorage}, Inline <script>: ${hasInlineScripts}`);

        // Code Quality
        const inlineStyles = (content.match(/style="/g) || []).length;
        console.log(`Code Quality -> Inline style attributes: ${inlineStyles}`);
    }
});
