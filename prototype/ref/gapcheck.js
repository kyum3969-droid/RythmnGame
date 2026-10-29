// every hold must be followed by at least half a beat of air before the next box (boxes riding on the crate are exempt)
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  const html = require('fs').readFileSync('belt-beat.html', 'utf8').replace("requestAnimationFrame(frame);\n})();", "requestAnimationFrame(frame); window.__levels = LEVELS;\n})();");
  await p.setContent('<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>'); await p.waitForTimeout(200);
  const out = await p.evaluate(() => {
    const rep = [];
    for (const L of window.__levels) {
      [L.bars, L.bars2 || []].forEach((bars, lane) => {
        const notes = [];
        bars.forEach((bar, bi) => { const div = bar.length / 4; for (let c = 0; c < bar.length; c++) { const ch = bar[c]; if (ch === '.' || ch === '=') continue; let len = 0; if (ch === 'h') { let k = c + 1, cnt = 1; while (bar[k] === '=' || bar[k] === 'o') { cnt++; k++; } len = cnt / div; } notes.push({ beat: bi * 4 + c / div + (ch === 'L' ? 0.5 : 0), len, top: ch === 'o', bar: bi }); } });
        notes.sort((a, b) => a.beat - b.beat);
        notes.forEach((n, i) => { if (!n.len) return; const end = n.beat + n.len; const nx = notes.slice(i + 1).find(m => !m.top && m.beat >= end - 1e-6); if (nx && nx.beat - end < 0.5 - 1e-6) rep.push(`${L.id} lane${lane} bar ${n.bar}: hold ends ${end.toFixed(2)}, next box ${nx.beat.toFixed(2)} (gap ${(nx.beat - end).toFixed(2)})`); });
      });
    }
    return rep;
  });
  console.log(out.length ? out.join('\n') : 'all holds have >= 0.5 beat of air after them'); await b.close();
})();
