const fs = require("fs");
const path = require("path");

function checkFile(f) {
    if (!fs.existsSync(f)) return;
    const content = fs.readFileSync(f, 'utf8');
    const hrefs = content.match(/href="([^"]+)"/g) || [];
    const srcs = content.match(/src="([^"]+)"/g) || [];
    
    console.log(`\n--- Links in ${f} ---`);
    let broken = 0;
    hrefs.forEach(h => {
        const url = h.replace('href="', '').replace('"', '');
        if(url.startsWith('/') && !url.startsWith('//')) {
            // Check if local file exists
            let localPath = path.join(__dirname, url);
            // simple check
            if (!fs.existsSync(localPath) && !fs.existsSync(localPath + '.html') && !fs.existsSync(localPath + '/index.html')) {
                // Next.js chunks or assets might not perfectly map in this quick check, but let's see
                if(!url.startsWith('/_next') && !url.startsWith('/assets') && !url.startsWith('/tools/css')) {
                   // console.log("Missing link: ", url);
                   broken++;
                }
            }
        }
    });
    console.log(`Potential broken internal links (excluding assets/_next): ${broken}`);
}

checkFile("index.html");
checkFile("tools/index.html");
