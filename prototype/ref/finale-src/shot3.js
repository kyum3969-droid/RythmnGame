const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] }); const p = await b.newPage({ viewport: { width: 900, height: 640 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('file://' + process.cwd() + '/finale-anim.html'); await p.waitForTimeout(500);
  const times = JSON.parse(process.argv[2] || '[3,8,12,16.5,24,36,44,52,60,70,80,96]');
  for (const t of times) { await p.evaluate(t => { seek(t); }, t); await p.waitForTimeout(250); await p.$eval('#cv', c => c.toDataURL()); await (await p.$('#cv')).screenshot({ path: `anim-${t}.png` }); }
  // run the whole thing at 4x to catch runtime errors in every scene
  await p.evaluate(() => { seek(0); speed = 6; playing = true; lastNow = performance.now(); });
  await p.waitForTimeout(18000);
  console.log('errors', JSON.stringify(errs)); await b.close(); })();
