// ---------- 하은의 밤: 컷씬 ----------
// Every shot is drawn into a small buffer at one pixel size (1x, 2x or 3x) and blown up by a whole number, so a shot never mixes
// pixel sizes and nothing is scaled by a fraction. The camera moves by panning whole pixels and by parallax between layers,
// and changes framing by cutting. Letterbox bars and subtitles are drawn on top at screen resolution.
const LB = 24;   // letterbox bar, screen pixels (divisible by 2 and 3)
const SHOT = {};
function shot(px, draw) {
  if (!SHOT[px]) { const c = document.createElement('canvas'); c.width = W / px; c.height = H / px; SHOT[px] = c; }
  const c = SHOT[px], o = c.getContext('2d'), g0 = g;
  o.setTransform(1, 0, 0, 1, 0, 0); o.globalAlpha = 1; o.globalCompositeOperation = 'source-over'; o.filter = 'none'; o.imageSmoothingEnabled = false;
  o.fillStyle = '#000'; o.fillRect(0, 0, c.width, c.height);
  g = o; try { draw(c.width, c.height, LB / px); } finally { g = g0; }
  g.imageSmoothingEnabled = false; g.drawImage(c, 0, 0, W, H);
}
function bars(a = 1) { g.fillStyle = `rgba(0,0,0,${a})`; g.fillRect(0, 0, W, LB); g.fillRect(0, H - LB, W, LB); }
// a subtitle in the lower bar; who: 'haeun' | 'doc' | 'mom' | 'sign'
const SUBC = { haeun: '#9fd8ec', doc: '#efe6d2', mom: '#f2d3a0', sign: '#b8a998', boss: '#efe6d2' };
function subtitle(u, t0, t1, s, who = 'doc') {
  if (u < t0 || u > t1) return; const a = Math.min(1, (u - t0) / 0.18, (t1 - u) / 0.18);
  g.save(); g.globalAlpha = a; text(s, W / 2, H - LB + 6, SUBC[who], 10, 'center'); g.restore();
}

// ---- pixel helpers inside a shot
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => (v + 0.5) / 16);
// a vertical gradient through a list of palette colours, ordered-dithered between neighbours (no smooth blends)
// gradients are painted once per (place, size, colours) and reused; the dither pattern is tied to screen position, so it holds still
const DG = new Map();
function dgrad(x, y, w, h, cols0) {
  x = Math.round(x); y = Math.round(y); const key = [x, y, w, h, g.canvas.width, ...cols0].join();
  let c = DG.get(key);
  if (!c) { if (DG.size > 80) DG.clear(); c = document.createElement('canvas'); c.width = w; c.height = h; const g0 = g; g = c.getContext('2d'); g.translate(-x, -y); try { dgradPaint(x, y, w, h, cols0); } finally { g = g0; } DG.set(key, c); }
  g.drawImage(c, x, y);
}
function dgradPaint(x, y, w, h, cols0) {
  const cols = []; for (let i = 0; i < cols0.length - 1; i++) for (let k = 0; k < 4; k++) cols.push(mixRGB(cols0[i], cols0[i + 1], k / 4)); cols.push(mixRGB(cols0[cols0.length - 1], cols0[cols0.length - 1], 0));
  for (let j = 0; j < h; j++) {
    const t = h > 1 ? j / (h - 1) * (cols.length - 1) : 0, i = Math.min(cols.length - 2, Math.floor(t)), f = t - i;
    if (cols.length === 1) { R(x, y + j, w, 1, cols[0]); continue; }
    let run = 0, prev = null;
    for (let k = 0; k <= w; k++) {
      const c = k < w ? (f > BAYER[((y + j) & 3) * 4 + ((x + k) & 3)] ? cols[i + 1] : cols[i]) : null;
      if (c !== prev) { if (prev) R(x + k - run, y + j, run, 1, prev); run = 0; prev = c; }
      run++;
    }
  }
}
function rgbOf(c) { if (c[0] === '#') return hex(c); return c.match(/\d+/g).slice(0, 3).map(Number); }
function mixRGB(a, b, p) { const A = rgbOf(a), B = rgbOf(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * p)).join(',')})`; }
// the hospital's name with the two placeholder rings drawn by hand (a font's ○ falls apart at this size)
function hospName(x, y, c, px = 9) { const b = bitmap('대학병원', px), r = Math.round(px * 0.32); for (let k = 0; k < 2; k++) { const cx = x + r + 1 + k * (2 * r + 3), cy = y + 2 + Math.round(px / 2); g.strokeStyle = c; g.lineWidth = 1; g.beginPath(); g.arc(cx + 0.5, cy + 0.5, r, 0, Math.PI * 2); g.stroke(); } const ox = x + 2 * (2 * r + 3) + 1; for (const [bx, by] of b.on) R(ox + bx, y + by, 1, 1, c); return 2 * (2 * r + 3) + b.w; }
// dithered alpha fill: an ordered-dither "half tone" of colour c at density d (0..1)
function dfill(x, y, w, h, c, d) {
  x = Math.round(x); y = Math.round(y); g.fillStyle = c;
  for (let j = 0; j < h; j++) for (let k = 0; k < w; k++) if (d > BAYER[((y + j) & 3) * 4 + ((x + k) & 3)]) g.fillRect(x + k, y + j, 1, 1);
}
// soft additive light (the only smooth thing allowed: light)
function light(x, y, r, rgb, a) { if (a <= 0) return; g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); g.restore(); }
function shade(x, y, w, h, rgb, a) { if (a <= 0) return; g.fillStyle = `rgba(${rgb},${a})`; g.fillRect(x, y, w, h); }
function vig(w, h, a) { const gr = g.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, w * 0.7); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, `rgba(0,0,0,${a})`); g.fillStyle = gr; g.fillRect(0, 0, w, h); }
function blackout(w, h, a) { if (a > 0) { g.fillStyle = `rgba(0,0,0,${clamp(a, 0, 1)})`; g.fillRect(0, 0, w, h); } }
const fadeIO = (u, dur, fin = 0.4, fout = 0.4) => Math.max(fin > 0 ? 1 - u / fin : 0, fout > 0 ? (u - (dur - fout)) / fout : 0);
// static layers are painted once into their own canvas
const LAYER = {};
function layer(key, w, h, paint) {
  if (!LAYER[key]) { const c = document.createElement('canvas'); c.width = w; c.height = h; const g0 = g; g = c.getContext('2d'); try { paint(w, h); } finally { g = g0; } LAYER[key] = c; }
  return LAYER[key];
}
// 3x5 pixel digits for clocks and countdowns
const DIGF = { '-': '000000111000000', '0': '111101101101111', '1': '010110010010111', '2': '111001111100111', '3': '111001111001111', '4': '101101111001001', '5': '111100111001111', '6': '111100111101111', '7': '111001010010010', '8': '111101111101111', '9': '111101111001111', ':': '000010000010000' };
function digits(s, x, y, c, sc = 1) { let cx = x; for (const ch of s) { const f = DIGF[ch]; if (f) for (let i = 0; i < 15; i++) if (f[i] === '1') R(cx + (i % 3) * sc, y + Math.floor(i / 3) * sc, sc, sc, c); cx += (ch === ':' ? 2 : 4) * sc; } }
// text rendered once into a 1-bit bitmap (for LED boards)
const BITS = {};
function bitmap(s, px = 11) {
  const key = s + px; if (BITS[key]) return BITS[key];
  const c = document.createElement('canvas'); c.width = s.length * px * 1.3 + 8; c.height = px + 6; const o = c.getContext('2d');
  o.font = `bold ${px}px "Apple SD Gothic Neo","Malgun Gothic","Noto Sans CJK KR","Noto Sans KR",sans-serif`; o.textBaseline = 'top'; o.fillStyle = '#fff'; o.fillText(s, 1, 2);
  const w = Math.ceil(o.measureText(s).width) + 3, d = o.getImageData(0, 0, c.width, c.height).data, on = [];
  for (let y = 0; y < c.height; y++) for (let x = 0; x < w; x++) if (d[(y * c.width + x) * 4 + 3] > 120) on.push([x, y]);
  return (BITS[key] = { w, h: c.height, on });
}

// ---- sprites as pixel maps: one character per pixel, '.' is empty. Rows are padded on the right.
const PAL = {
  r: '#d8463b', R: '#a83328', q: '#ef6a55', w: '#f4f1ea', B: '#3a3236', b: '#1e1a1a', s: '#d9a27a', S: '#b98260', z: '#8a5e44', Z: '#6b4631',
  h: '#4a3328', H: '#6b4a3a', y: '#f4d35e', n: '#1e1a1a', N: '#121010', m: '#3a3436', v: '#7ec8e3', V: '#5aa6c4', W: '#b4e6f4', e: '#ebe5c9',
  l: '#3a3f45', L: '#2a2e33', o: '#1e1a1a', O: '#d9d4c6', p: '#b2565a', x: '#d8dde0', g: '#2a2d31', k: '#141012',
  j: '#1e1a1a', J: '#3a3436', c: '#2f4f58', C: '#213840', u: '#cfe04a', U: '#a6b632', f: '#e07070', i: '#1b1716', d: '#33415a', D: '#26324a',
  a: '#f2f2ec', A: '#c9cdc8', T: '#4f8f8a', G: '#2b2e31', E: '#a9cfe6', M: '#2a2220',
  '1': '#545a62', '2': '#4a5b7c', Q: '#dcb393', I: '#b98d6e', K: '#8e6650', F: '#b9cde0', X: '#a9bdd2', Y: '#e8c9ae'
};
const MAPS = {};
function defMap(name, rows) { const w = Math.max(...rows.map(r => r.length)); MAPS[name] = rows.map(r => r.padEnd(w, '.')); }
const TINT = {};
// draw map at (x, y) = its top-left; o.flip mirrors; o.pal overrides colours; o.tint = [rgb hex, amount] darkens/colours every pixel
function spr(name, x, y, o = {}) {
  const map = MAPS[name], w = map[0].length; x = Math.round(x); y = Math.round(y);
  let pal = o.pal ? { ...PAL, ...o.pal } : PAL;
  if (o.tint) { const key = name + o.tint.join() + JSON.stringify(o.pal || 0); if (!TINT[key]) { const t = {}; for (const k in pal) t[k] = mix(pal[k], o.tint[0], o.tint[1]); TINT[key] = t; } pal = TINT[key]; }
  for (let j = 0; j < map.length; j++) {
    const row = map[j]; let i = 0;
    while (i < w) { const ch = row[i]; if (ch === '.') { i++; continue; } let k = i + 1; while (k < w && row[k] === ch) k++; const c = pal[ch]; if (c) R(o.flip ? x + w - k : x + i, y + j, k - i, 1, c); i = k; }
  }
}
// the same, turned by ang (radians) about the map's pivot (px, py), nearest pixel; drawn with its pivot at (x, y)
function sprRot(name, x, y, ang, px, py, o = {}) {
  const map = MAPS[name], w = map[0].length, h = map.length, pal = o.pal ? { ...PAL, ...o.pal } : PAL, cs = Math.cos(ang), sn = Math.sin(ang), r = Math.ceil(Math.hypot(w, h));
  for (let yy = -r; yy <= r; yy++) for (let xx = -r; xx <= r; xx++) {
    const mx = Math.round(cs * xx + sn * yy + px), my = Math.round(-sn * xx + cs * yy + py);
    if (mx < 0 || my < 0 || mx >= w || my >= h) continue; const ch = map[my][mx]; if (ch === '.' || !pal[ch]) continue;
    R(Math.round(x) + xx, Math.round(y) + yy, 1, 1, pal[ch]);
  }
}
