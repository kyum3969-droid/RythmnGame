// node sheet.js out.png t0 dt n cols [scale]   a contact sheet of the animatic's frames (native 384x216 each, scaled)
const { chromium } = require('playwright');
(async () => { const [out, t0, dt, n, cols, sc] = [process.argv[2], +process.argv[3], +process.argv[4], +process.argv[5], +process.argv[6], +(process.argv[7] || 1)];
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1600, height: 1200 } });
  await p.goto('file://' + __dirname + '/../finale-anim.html'); await p.waitForTimeout(400);
  const url = await p.evaluate(async ([t0, dt, n, cols, sc]) => { const src = document.getElementById('cv'), rows = Math.ceil(n / cols), c = document.createElement('canvas'); c.width = 384 * sc * cols; c.height = 216 * sc * rows; const x = c.getContext('2d'); x.imageSmoothingEnabled = false; x.fillStyle = '#fff';
    for (let i = 0; i < n; i++) { seek(t0 + i * dt); await new Promise(r => setTimeout(r, 30)); x.drawImage(src, (i % cols) * 384 * sc, Math.floor(i / cols) * 216 * sc, 384 * sc, 216 * sc); x.font = '12px monospace'; x.fillText((t0 + i * dt).toFixed(2), (i % cols) * 384 * sc + 4, Math.floor(i / cols) * 216 * sc + 14); }
    return c.toDataURL(); }, [t0, dt, n, cols, sc]);
  require('fs').writeFileSync(out, Buffer.from(url.split(',')[1], 'base64')); await b.close(); })();
