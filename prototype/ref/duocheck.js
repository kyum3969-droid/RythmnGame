// 1-4 one-button rules: no box on the other belt while a hold is down (plus half a beat of air either side), no two boxes on
// different belts closer than 0.25 beat unless they land on the same beat (a pair). Boxes 하은 scans herself are ignored.
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  const html = require('fs').readFileSync('belt-beat.html', 'utf8').replace("requestAnimationFrame(frame);\n})();", "requestAnimationFrame(frame); window.__levels = LEVELS;\n})();");
  await p.setContent('<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>'); await p.waitForTimeout(200);
  const out = await p.evaluate(() => {
    const rep = [];
    for (const L of window.__levels) {
      if (!L.oneButton) continue;
      const notes = [];
      [L.bars, L.bars2 || []].forEach((bars, lane) => bars.forEach((bar, bi) => { const div = bar.length / 4; for (let c = 0; c < bar.length; c++) { const ch = bar[c]; if (ch === '.' || ch === '=') continue; let len = 0; if (ch === 'h') { let k = c + 1, cnt = 1; while (bar[k] === '=' || bar[k] === 'o') { cnt++; k++; } len = cnt / div; } notes.push({ beat: bi * 4 + c / div + (ch === 'L' ? 0.5 : 0), len, lane, bar: bi }); } }));
      const mine = notes.filter(n => !(n.lane === L.autoLane && (L.autoUntil == null || n.beat < L.autoUntil)));
      let pairs = 0, flams = [];
      for (const a of mine) for (const c of mine) {
        if (a.lane >= c.lane) continue;
        const d = Math.abs(a.beat - c.beat);
        if (d < 1e-6) { pairs++; if (a.len !== c.len && (a.len || c.len)) rep.push(`${L.id} bar ${a.bar}: tap on one belt at the start of a hold on the other (${a.beat})`); continue; }
        if (d < 0.25) rep.push(`${L.id} bar ${a.bar}: boxes ${a.beat.toFixed(2)} and ${c.beat.toFixed(2)} on different belts only ${d.toFixed(2)} beat apart`);
        else if (d < 0.4) flams.push(`bar ${a.bar} (${a.beat.toFixed(2)} / ${c.beat.toFixed(2)})`);
        for (const [h, o] of [[a, c], [c, a]]) if (h.len && o.beat > h.beat && o.beat < h.beat + h.len + 0.5 - 1e-6) rep.push(`${L.id} bar ${h.bar}: box ${o.beat.toFixed(2)} on the other belt during the hold ${h.beat}-${(h.beat + h.len).toFixed(2)}`);
      }
      rep.push(`${L.id}: ${mine.length} boxes you scan, ${pairs} pairs, tight 1/3-beat spots: ${flams.length ? flams.join(', ') : 'none'}`);
    }
    return rep;
  });
  console.log(out.join('\n')); await b.close();
})();
