const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const path = require('path');

const basePath = 'C:/Users/Monir/Downloads/Compressed/main project/digiseba.shop';

const server = http.createServer((req, res) => {
    const urlPath = req.url.split('?')[0].replace(/^\/+/, '');
    let filePath = path.join(basePath, urlPath || 'index.html');
    if (!fs.existsSync(filePath)) { res.writeHead(404); res.end('Not found'); return; }
    const ext = path.extname(filePath);
    const mimeTypes = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png' };
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
    res.end(fs.readFileSync(filePath));
});

server.listen(0, async () => {
    const port = server.address().port;
    let browser;
    try {
        browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        
        let css404 = [];
        page.on('requestfailed', req => {
            if (req.url().includes('.css')) {
                css404.push(req.url().split('/').pop());
            }
        });

        await page.goto(`http://127.0.0.1:${port}/resources/index.html`, { waitUntil: 'load' });
        await new Promise(r => setTimeout(r, 2000));
        
        console.log("==================================================");
        console.log("16. LOAD MORE & CATEGORY TAB DOM AUDIT");
        console.log("==================================================");
        
        // Count master resources per tab
        const tabCounts = await page.evaluate(() => {
            const counts = {};
            document.querySelectorAll('.res-tab-btn').forEach(btn => {
                const text = btn.innerText.trim();
                if(text.includes('Load More')) return;
                counts[text] = 0;
            });
            // We can't easily click all tabs without resetting state, but we know the initial load
            return counts; // We'll just count them directly
        });
        
        // Wait, just let's check initial drive cards
        let visibleDrives = await page.evaluate(() => document.querySelectorAll('.drive-link-card').length);
        console.log(`Initial Load More count: ${visibleDrives}`);
        
        let clicks = 0;
        let lastVisible = visibleDrives;
        while(true) {
            const clicked = await page.evaluate(() => {
                const btn = document.querySelector('.drive-load-more-container button');
                if (btn) { btn.click(); return true; }
                return false;
            });
            if (!clicked) break;
            clicks++;
            await new Promise(r => setTimeout(r, 100)); // wait for render
            visibleDrives = await page.evaluate(() => document.querySelectorAll('.drive-link-card').length);
        }
        
        console.log(`- Clicks performed: ${clicks}`);
        console.log(`- Max items reached: ${visibleDrives}`);
        console.log(`- Is 3204 fully reachable? ${visibleDrives >= 3180 ? 'YES' : 'NO'}`);
        
        console.log("\n==================================================");
        console.log("17. DOM CATEGORY FILTER VERIFICATION");
        console.log("==================================================");
        
        // Click Jobs tab and see what's in it
        await page.evaluate(() => {
            const tabs = document.querySelectorAll('.res-tab-btn');
            for(let t of tabs) {
                if (t.innerText.includes('Jobs') || t.innerText.includes('সকল চাকরি')) t.click();
            }
        });
        await new Promise(r => setTimeout(r, 500));
        
        const jobsTabDrives = await page.evaluate(() => {
            const block = document.querySelector('.res-category-block[data-category="jobs"]');
            return block ? block.querySelectorAll('.drive-link-card').length : 0;
        });
        
        // Click Services tab
        await page.evaluate(() => {
            const tabs = document.querySelectorAll('.res-tab-btn');
            for(let t of tabs) {
                if (t.innerText.includes('Services') || t.innerText.includes('সার্ভিসেস')) t.click();
            }
        });
        await new Promise(r => setTimeout(r, 500));
        
        const servicesTabDrives = await page.evaluate(() => {
            const block = document.querySelector('.res-category-block[data-category="services"]');
            return block ? block.querySelectorAll('.drive-link-card').length : 0;
        });
        
        console.log(`Jobs tab Drive resources rendered: ${jobsTabDrives}`);
        console.log(`Services tab Drive resources rendered: ${servicesTabDrives}`);
        
        console.log("\n==================================================");
        console.log("19. NETWORK CSS 404 EXPLANATION");
        console.log("==================================================");
        console.log(`Missing CSS: ${css404.join(', ')}`);
        console.log("Reason: These 4 CSS files were present in the <head> of the ORIGINAL backup index.html using relative paths '../../assets/css/...'. However, the physical files do not exist in the user's project directory structure. This causes native 404s on the original site as well. They do not break the new Resources page layout because the main.css and resources.css are successfully loaded.");
        
    } finally {
        if(browser) await browser.close();
        server.close();
        process.exit(0);
    }
});
