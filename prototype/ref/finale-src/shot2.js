const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 860, height: 1200 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('file://' + process.cwd() + '/finale-sheet.html'); await p.waitForTimeout(800);
  const cards = await p.$$('.card'); for (let i = 0; i < cards.length; i++) await cards[i].screenshot({ path: `fin-${i + 1}.png` });
  console.log('cards', cards.length, 'errors', JSON.stringify(errs)); await b.close(); })();
