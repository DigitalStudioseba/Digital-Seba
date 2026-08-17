const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const path = require('path');

const basePath = 'C:/Users/Monir/Downloads/Compressed/main project/digiseba.shop';
const screenshotsDir = path.join('C:/Users/Monir/.gemini/antigravity/brain/f62ddbe0-fe03-4280-9bd0-443ec2ee449a', 'visual_tests');

if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });

function startServer(dir) {
    return new Promise(resolve => {
        const server = http.createServer((req, res) => {
            let urlPath = req.url.split('?')[0].replace(/^\/+/, '');
            if (!urlPath || urlPath === 'resources/') urlPath = 'resources/index.html';
            let filePath = path.join(dir, urlPath);
            if (!fs.existsSync(filePath)) { res.writeHead(404); res.end(''); return; }
            const ext = path.extname(filePath);
            const mimeTypes = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png' };
            res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
            res.end(fs.readFileSync(filePath));
        });
        server.listen(0, () => resolve({ server, port: server.address().port }));
    });
}

(async () => {
    let browser, srv;
    try {
        srv = await startServer(basePath);
        browser = await puppeteer.launch({ headless: 'new', defaultViewport: { width: 1366, height: 768 } });
        const page = await browser.newPage();
        
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
        
        await page.setRequestInterception(true);
        page.on('request', req => { if (req.resourceType() === 'font') req.abort(); else req.continue(); });

        console.log("Loading page...");
        await page.goto(`http://127.0.0.1:${srv.port}/resources/index.html`, { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(e=>console.log('Navigation warning:', e.message));
        await new Promise(r => setTimeout(r, 2000));
        
        // 1. Initial Load Screenshot
        console.log("Taking initial screenshot...");
        await page.screenshot({ path: path.join(screenshotsDir, 'final_initial_view.png'), fullPage: true });

        // Function to extract first 20 items from a tab
        async function extractFirst20(tabName) {
            console.log("Extracting", tabName);
            return await page.evaluate(async (tab) => {
                const btn = Array.from(document.querySelectorAll('.res-tab-btn')).find(b => b.getAttribute('onclick')?.includes(tab));
                if(btn) btn.click();
                return new Promise(resolve => {
                    setTimeout(() => {
                        const grid = document.querySelector(`.res-category-block[data-category="${tab}"] .res-grid-container`);
                        const results = [];
                        let lastFolder = 'Uncategorized';
                        if (grid) {
                            const children = Array.from(grid.children);
                            for (let child of children) {
                                if (results.length >= 20) break;
                                if (child.classList.contains('drive-folder-header')) {
                                    lastFolder = child.innerText.replace('📁', '').trim();
                                } else if (child.classList.contains('drive-link-card')) {
                                    results.push({
                                        folder: lastFolder,
                                        title: child.querySelector('span')?.innerText.split('\\n')[0].trim() || '',
                                        url: child.href
                                    });
                                }
                            }
                        }
                        resolve(results);
                    }, 500);
                });
            }, tabName);
        }

        const first20Down = await extractFirst20('downloads');
        const first20Serv = await extractFirst20('services');
        const first20Link = await extractFirst20('links');
        const first20Jobs = await extractFirst20('jobs');

        // Tab Reset
        await page.evaluate(() => {
            const btn = Array.from(document.querySelectorAll('.res-tab-btn')).find(b => b.getAttribute('onclick')?.includes('all'));
            if(btn) btn.click();
        });
        await new Promise(r => setTimeout(r, 500));

        // Search Test
        console.log("Taking search screenshot...");
        await page.evaluate(() => {
            const input = document.getElementById('heroSearch');
            input.value = 'Logo';
            input.dispatchEvent(new Event('input'));
        });
        await new Promise(r => setTimeout(r, 1000));
        await page.screenshot({ path: path.join(screenshotsDir, 'final_search_view.png'), fullPage: true });

        // Expand all items to verify DOM
        console.log("Expanding all cards...");
        await page.evaluate(() => {
            const input = document.getElementById('heroSearch');
            input.value = '';
            input.dispatchEvent(new Event('input'));
        });
        await new Promise(r => setTimeout(r, 500));

        await page.evaluate(async () => {
            return new Promise(resolve => {
                const clickAll = () => {
                    const btns = document.querySelectorAll('.drive-load-more-container button');
                    if (btns.length === 0) { resolve(); return; }
                    btns.forEach(btn => btn.click());
                    setTimeout(clickAll, 100);
                };
                clickAll();
            });
        });

        console.log("Extracting all DOM cards...");
        const domCards = await page.evaluate(() => {
            const results = [];
            const grids = document.querySelectorAll('.res-category-block');
            grids.forEach(grid => {
                let lastFolder = 'Uncategorized';
                const children = Array.from(grid.querySelectorAll('.res-grid-container > *'));
                children.forEach(child => {
                    if (child.classList.contains('drive-folder-header')) {
                        lastFolder = child.innerText.replace('📁', '').trim();
                    } else if (child.classList.contains('drive-link-card')) {
                        results.push({
                            folder: lastFolder,
                            title: child.querySelector('span')?.innerText.split('\\n')[0].trim() || '',
                            url: child.href
                        });
                    }
                });
            });
            return results;
        });

        console.log("DOM EXTRACTION COMPLETE. TOTAL:", domCards.length);
        fs.writeFileSync('dom_results.json', JSON.stringify({
            downloads: first20Down,
            services: first20Serv,
            links: first20Link,
            jobs: first20Jobs,
            all: domCards
        }, null, 2));

    } catch(e) {
        console.log("FATAL ERROR:", e);
    } finally {
        if(browser) await browser.close();
        if(srv) srv.server.close();
        process.exit(0);
    }
})();
