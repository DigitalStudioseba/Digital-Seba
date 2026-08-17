const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '..');

const server = http.createServer((req, res) => {
    const urlPath = req.url.split('?')[0].replace(/^\/+/, '');
    let filePath = path.join(BASE_DIR, urlPath || 'index.html');
    if (!fs.existsSync(filePath)) { res.writeHead(404); res.end('Not found'); return; }
    const ext = path.extname(filePath);
    const mimeTypes = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
    res.end(fs.readFileSync(filePath));
});

server.listen(0, async () => {
    const port = server.address().port;
    console.log(`[SERVER] Running at http://127.0.0.1:${port}`);
    let browser;
    let consoleErrors = 0;
    let networkErrors = 0;
    
    try {
        browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        
        page.on('console', msg => { if (msg.type() === 'error') consoleErrors++; });
        page.on('pageerror', err => consoleErrors++);
        page.on('requestfailed', req => {
            // Ignore trivial favicon or analytic request failures in test
            if(!req.url().includes('favicon')) networkErrors++;
        });
        
        async function testLink(index, desc) {
            const targetPromise = new Promise(resolve => browser.once('targetcreated', resolve));
            const cardHtml = await page.evaluate((idx) => {
                const el = document.querySelectorAll('.drive-link-card')[idx];
                if (!el) return null;
                return el.outerHTML;
            }, index);
            
            if(!cardHtml) throw new Error('Card not found for ' + desc);
            if(cardHtml.includes('undefined')) throw new Error('Undefined title found in ' + desc);
            
            await page.evaluate((idx) => document.querySelectorAll('.drive-link-card')[idx].click(), index);
            const newTarget = await targetPromise;
            const newPage = await newTarget.page();
            const url = newPage ? newPage.url() : newTarget.url();
            
            console.log(`[PASS] ${desc} -> ${url.substring(0, 45)}...`);
            if (newPage) await newPage.close();
        }

        // DESKTOP TESTS
        await page.setViewport({ width: 1366, height: 768 });
        await page.goto(`http://127.0.0.1:${port}/resources/index.html`, { waitUntil: 'load' });
        await new Promise(r => setTimeout(r, 1000));
        
        console.log("--- DESKTOP TESTS ---");
        // Test 1: Initial load link
        await testLink(0, 'Desktop Initial Link 1');
        await testLink(1, 'Desktop Initial Link 2');
        
        // Test 2: Search Link
        await page.type('#heroSearch', 'CV');
        await new Promise(r => setTimeout(r, 800));
        await testLink(0, 'Desktop Search Link (CV)');
        
        // Clear search
        await page.evaluate(() => { document.getElementById('heroSearch').value = ''; });
        await page.type('#heroSearch', ' ');
        await page.keyboard.press('Backspace');
        await new Promise(r => setTimeout(r, 800));
        
        // MOBILE TESTS
        console.log("--- MOBILE TESTS ---");
        await page.setViewport({ width: 390, height: 844 });
        await testLink(2, 'Mobile Initial Link 3');
        await testLink(3, 'Mobile Initial Link 4');
        
        // Category Link Test (Old design specific)
        await page.click("button[onclick*='services']");
        await new Promise(r => setTimeout(r, 500));
        
        // We will just evaluate a click on the first old design card
        await page.evaluate(() => {
            const el = document.querySelector('#grid-services .mode-card-btn');
            if (el) el.click();
        });
        
        console.log(`\nRESULTS: ConsoleErrors=${consoleErrors}, NetworkErrors=${networkErrors}`);
        
    } catch (e) {
        console.error("TEST FAILED:", e);
    } finally {
        if(browser) await browser.close();
        server.close();
        process.exit(0);
    }
});
