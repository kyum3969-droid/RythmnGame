// node shot3.js '[63,90,124]'   shots of the animatic at those seconds (anim-<t>.png), then the whole timeline at 8x with sound on
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] }); const p = await b.newPage({ viewport: { width: 900, height: 640 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('file://' + __dirname + '/../finale-anim.html'); await p.waitForTimeout(500);
  const times = JSON.parse(process.argv[2] || '[3,30,62,72,82,90,98,104,110,120,126,136,146,158]');
  for (const t of times) { await p.evaluate(t => { seek(t); }, t); await p.waitForTimeout(250); await (await p.$('#cv')).screenshot({ path: `anim-${t}.png` }); }
  // press play (so the audio graph is live) and run every scene, catching errors thrown while drawing or making sound
  await p.click('#play');
  const bad = await p.evaluate(async () => { seek(0); speed = 8; const out = []; while (T < TOTAL - 0.05) { const { s, u } = sceneAt(T); try { s.draw(u, s.dur); } catch (e) { out.push(s.id + ': ' + e); } await new Promise(r => setTimeout(r, 30)); } return [...new Set(out)]; });
  console.log('errors', JSON.stringify(errs.concat(bad))); await b.close(); })();
