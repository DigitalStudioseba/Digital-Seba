const fs = require("fs");
const path = require("path");

const content = fs.readFileSync("index.html", 'utf8');
const hrefs = content.match(/href="([^"]+)"/g) || [];

let broken = [];
hrefs.forEach(h => {
    const url = h.replace('href="', '').replace('"', '');
    if(url.startsWith('/') && !url.startsWith('//') && !url.startsWith('/_next') && !url.startsWith('/assets') && url !== '/') {
        let localPath = path.join(__dirname, url);
        if (!fs.existsSync(localPath) && !fs.existsSync(localPath + '.html') && !fs.existsSync(localPath + '/index.html')) {
            broken.push(url);
        }
    }
});
console.log("Broken links:", [...new Set(broken)]);
