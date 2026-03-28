const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  console.log('Testing ads with V3 thorough diagnostics...');

  const violations = [];
  const errors = [];

  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('Content Security Policy') || text.includes('CSP')) {
      violations.push({ type: 'Console - CSP', text });
      console.log('Detected violation:', text);
    } else if (msg.type() === 'error') {
      errors.push({ type: 'Console - Error', text });
    }
  });

  page.on('pageerror', exc => {
    errors.push({ type: 'PageError', text: exc.toString() });
  });

  page.on('requestfailed', request => {
    const url = request.url();
    if (!url.includes('google-analytics') && !url.includes('googletagmanager')) {
        errors.push({ type: 'RequestFailed', url, error: request.failure()?.errorText });
        console.log('Request failed:', url, request.failure()?.errorText);
    }
  });

  try {
    // Navigate and wait
    await page.goto('https://tecnomais.online/en/article/architecting-ai-driven-automation-with-the-github-copilot-sdk', { waitUntil: 'networkidle', timeout: 90000 });
    
    // Additional wait for dynamic ad content
    await page.waitForTimeout(15000);
    
    // Check for ad iframe presence
    const framesCount = page.frames().length;
    console.log('Total Frames found:', framesCount);

    const adContainers = await page.$$eval('.ad-container', containers => {
        return containers.map(c => ({
            id: c.getAttribute('id'),
            innerHTML: c.innerHTML.trim().substring(0, 100) + '...',
            hasIframe: c.querySelector('iframe') !== null
        }));
    });

    console.log('Ad Containers:', JSON.stringify(adContainers, null, 2));

    console.log('\n--- Headless Diag Results V3 ---');
    console.log('Total CSP Violations:', violations.length);
    console.log('Total Failed Ad Requests:', errors.length);

    if (violations.length > 0 || errors.length > 0) {
        process.exit(1); 
    } else {
        process.exit(0);
    }
  } catch (err) {
    console.error('Diagnostic error:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
