const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Testing ads on https://tecnomais.online...');

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
    if (url.includes('onclickads') || url.includes('adsterra') || url.includes('profitablecpm') || url.includes('highperformance')) {
        errors.push({ type: 'RequestFailed', url, error: request.failure()?.errorText });
    }
  });

  try {
    // Navigate and wait for some time to let ads load
    await page.goto('https://tecnomais.online/en/article/architecting-ai-driven-automation-with-the-github-copilot-sdk', { waitUntil: 'networkidle', timeout: 60000 });
    
    // Additional wait for dynamic ad content
    await page.waitForTimeout(10000);
    
    console.log('\n--- Headless Diag Results ---');
    console.log('Total CSP Violations:', violations.length);
    console.log('Total Failed Ad Requests:', errors.length);

    if (violations.length > 0 || errors.length > 0) {
        process.exit(1); // Signal failure
    } else {
        process.exit(0); // Signal success
    }
  } catch (err) {
    console.error('Diagnostic error:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
