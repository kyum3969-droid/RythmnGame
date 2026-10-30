// ---------- 1-5 애니매틱: 장면이 시간 축 위에서 움직인다 ----------
let g = null;
const FX = { react: [{ type: '', at: -1e9 }, { type: '', at: -1e9 }, { type: '', at: -1e9 }], playerNod: -1e9, flinch: -1e9 };
const stats = { combo: 0 }, SPB = 0.6, BOSS_X = 46, PLAYER_X = 340, state = 'play';
const ease = p => p < 0 ? 0 : p > 1 ? 1 : p * p * (3 - 2 * p);
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const IDLE = () => ({ hand: { x: BOSS_X + 13, y: 134 }, carry: null, wince: false, dip: 0, bob: 0, nod: 0, doze: false, phone: false, lane: 0 });
function actor(id, x, pose, mirrored = false, extra = null) {
  g.save();
  if (mirrored) { g.translate(x, 0); g.scale(-1, 1); g.translate(-BOSS_X, 0); } else g.translate(x - BOSS_X, 0);
  const p = { ...IDLE(), ...pose };
  if (p.hand && !mirrored) p.hand = { x: p.hand.x - (x - BOSS_X), y: p.hand.y };
  PARTNERS[id].draw(p, 0, true);
  if (!p.noArm) PARTNERS[id].arm(p);
  if (extra) extra(bodyTop(PARTNERS[id].base, p));
  g.restore();
}
function text(s, x, y, c = '#efe6d2', size = 8, align = 'left', bold = false) { g.font = `${bold ? 'bold ' : ''}${size}px "Apple SD Gothic Neo","Malgun Gothic","Noto Sans CJK KR",sans-serif`; g.textAlign = align; g.textBaseline = 'top'; g.fillStyle = c; g.fillText(s, x, y); }
function bubble(s, x, y, w, opts = {}) {
  const h = opts.h || 14, bg = opts.bg || '#f2ead6', ink = opts.ink || '#1b1716', shake = opts.shake || 0, a = opts.alpha == null ? 1 : opts.alpha;
  g.save(); g.globalAlpha = a; if (shake) g.translate(Math.round((Math.random() * 2 - 1) * shake), Math.round((Math.random() * 2 - 1) * shake));
  R(x, y, w, h, bg); R(x + 1, y + h, 3, 2, bg); R(x + 2, y + h + 2, 1, 1, bg);
  if (opts.loud) { R(x, y, w, 1, '#d8463b'); R(x, y + h - 1, w, 1, '#d8463b'); R(x, y, 1, h, '#d8463b'); R(x + w - 1, y, 1, h, '#d8463b'); }
  text(s, x + 3, y + 3, ink, opts.size || 7, 'left', !!opts.loud); g.restore();
}
// a line shown between two times, typed out over the first 0.6 s
function say(u, t0, t1, s, x, y, w, opts = {}) { if (u < t0 || u > t1) return; const n = Math.min(s.length, Math.floor((u - t0) / 0.6 * s.length) + 1); bubble(s.slice(0, n), x, y, w, opts); }
function judge(s, x, y, c, size = 14, sub = '', age = 0) { const a = clamp(1 - Math.max(0, age - 0.3) / 0.25, 0, 1); if (a <= 0) return; g.save(); g.globalAlpha = a; g.translate(0, -Math.round(ease(age / 0.15) * 4)); g.shadowColor = '#000'; g.shadowOffsetY = 2; text(s, x, y, c, size, 'center', true); g.restore(); if (sub) { g.save(); g.globalAlpha = a; text(sub, x, y + size + 2, '#efe6d2', 6, 'center'); g.restore(); } }
function hud(clock, combo) { R(10, 8, 72, 11, 'rgba(0,0,0,.55)'); text(clock, 13, 10, '#efe6d2', 7); if (combo) { R(W - 46, 8, 36, 11, 'rgba(0,0,0,.55)'); text(combo, W - 28, 10, '#efe6d2', 7, 'center'); } }
function vignette(a) { const gr = g.createRadialGradient(W / 2, H / 2, 70, W / 2, H / 2, 240); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, `rgba(0,0,0,${a})`); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
function fadeBlack(a) { if (a > 0) { g.fillStyle = `rgba(0,0,0,${clamp(a, 0, 1)})`; g.fillRect(0, 0, W, H); } }
const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const mix = (a, b, p) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], p))).join(',')})`; };

// ---------- 벨트와 소품 ----------
const BELT_Y = 146, SCAN_X = 300, PLACE_X = 66;
function beltAt(y, x0 = 48, dark = 1, off = 0) {
  R(x0, y, W - x0, 4, C.belt); R(x0, y, W - x0, 1, '#4a403b');
  const o = ((off % 48) + 48) % 48;
  for (let x = x0 - 48 + o; x < W; x += 12) { if (x < x0) continue; const q = Math.round((x - x0 - o + 48) / 12) % 4; if (q === 0) { R(x - 1, y, 3, 4, '#a08a3c'); R(x - 1, y, 3, 1, '#c9ad4c'); } else if (q === 2) R(x, y, 1, 4, '#5a4d44'); else R(x, y + 1, 1, 3, C.slat); }
  R(x0 - 2, y + 4, W - x0 + 2, 8, C.face); const ro = ((off % 14) + 14) % 14; for (let x = x0 - 14 + ro; x < W; x += 14) if (x >= x0) R(x, y + 6, 8, 3, '#2b2422');
  if (dark < 1) { g.fillStyle = `rgba(8,6,10,${1 - dark})`; g.fillRect(x0 - 2, y, W, 12); }
}
function gate(x, y, h, on, flash = 0) { R(x - 11, y - h, 4, h, '#555a5f'); R(x - 11, y - h - 3, 24, 5, C.metal); R(x + 8, y - h, 4, h + 10, '#7b8288'); if (flash > 0.4) { g.globalAlpha = (flash - 0.4) * 0.9; R(x - 1, y - h + 1, 3, h, '#f4fff0'); g.globalAlpha = 1; } R(x, y - h + 5, 1, h - 5, flash > 0 ? C.ok : on ? C.laser : '#5a2b27'); }
function boxS(x, bottom, w = 18, h = 14, done = false) { R(x - w / 2 + 1, bottom, w, 1, 'rgba(0,0,0,.45)'); R(x - w / 2, bottom - h, w, h, C.kraft); R(x - w / 2, bottom - h, w, 2, C.kraftTop); R(x + w / 2 - 2, bottom - h + 2, 2, h - 2, C.kraftDark); R(x - 1, bottom - h, 3, h, C.tape); R(x - w / 2 + 2, bottom - 6, 7, 4, C.label); if (done) { g.fillStyle = 'rgba(143,214,148,.35)'; g.fillRect(x - w / 2, bottom - h, w, h); } }
function playerS(kick = 0, cheeks = 0) { drawPlayer(kick, 0); if (cheeks > 0) { g.globalAlpha = cheeks; R(PLAYER_X + 6, 102, 2, 3, '#e07070'); R(PLAYER_X - 8, 102, 2, 3, '#e07070'); g.globalAlpha = 1; } const gx = 324 - kick * 4, gy = 117; thick(PLAYER_X - 6, 116, gx + 2, gy + 3, 4, C.hoodie); drawGun(gx, gy, kick); }
function playerChop(kick = 0, cheeks = 0) { drawPlayer(kick, 0); if (cheeks > 0) { g.globalAlpha = cheeks; R(PLAYER_X + 6, 102, 2, 3, '#e07070'); R(PLAYER_X - 8, 102, 2, 3, '#e07070'); g.globalAlpha = 1; } const hx = 316 - kick * 6, hy = 136 - kick * 4; thick(PLAYER_X - 6, 116, hx, hy, 4, C.hoodie); R(hx - 2, hy - 2, 4, 4, C.skin); R(hx - 3, hy - 8, 1, 8, '#efe6d2'); R(hx - 1, hy - 8, 1, 8, '#efe6d2'); }
function haeunBeside(o = {}) { drawHaeunAt(354, 60 + (o.bob || 0), 0, { load: true, ...o }); if (!o.watch && !o.eat) { thick(348, 82, 346, 94, 4, '#1e1a1a'); R(344, 93, 4, 3, '#2a2d31'); } if (o.eat) { const k = o.eat; thick(348, 82, 342 + k * 2, 70 + k * 10, 4, '#1e1a1a'); R(340 + k * 2, 68 + k * 10, 4, 4, '#2a2d31'); R(343 + k * 2, 64 + k * 10, 1, 6, '#efe6d2'); R(345 + k * 2, 64 + k * 10, 1, 6, '#efe6d2'); if (k < 0.5) R(342 + k * 2, 62 + k * 10, 6, 2, '#f08a5d'); } }
const PLATE = { red: ['#d8463b', '1,500'], blue: ['#2f6f8a', '2,500'], gold: ['#d9a520', '4,000'], black: ['#2b2e31', '6,000'] };
function sushiPlate(x, y, col, kind = 0, sc = 1) {
  g.save(); g.translate(x, y); g.scale(sc, sc);
  R(-9, -2, 18, 2, '#efe6d2'); R(-10, -3, 20, 1, PLATE[col][0]); R(-8, -4, 16, 1, '#f7f1e2'); R(-6, -7, 12, 3, '#f7f1e2'); R(-5, -8, 10, 1, '#f7f1e2');
  const fish = ['#f08a5d', '#e04a3a', '#f3d5a0', '#c9c9c9'][kind]; R(-7, -10, 14, 3, fish); if (kind === 1) R(-7, -10, 14, 1, '#f7c0b0'); if (kind === 3) R(-6, -11, 12, 1, '#1e2a1a');
  g.restore();
}
function sojuGlass(x, y, sc = 1, fill = 0.7) { g.save(); g.translate(x, y); g.scale(sc, sc); R(-4, -10, 9, 10, 'rgba(230,240,245,.5)'); R(-4, -10, 9, 1, '#f4fbff'); R(-4, -10, 1, 10, '#f4fbff'); R(4, -10, 1, 10, '#f4fbff'); R(-3, -Math.round(9 * fill), 7, Math.round(9 * fill), 'rgba(255,255,255,.7)'); R(-2, -9, 1, 4, 'rgba(255,255,255,.9)'); g.restore(); }
const soju = (x, y) => { R(x, y - 14, 5, 14, '#bfe3d2'); R(x + 1, y - 18, 3, 5, '#bfe3d2'); R(x + 1, y - 19, 3, 1, '#2f6f4a'); R(x, y - 10, 5, 1, 'rgba(255,255,255,.35)'); };
function plateStack(x, base, n) { for (let k = 0; k < n; k++) { const c = ['red', 'blue', 'red', 'gold', 'red', 'blue'][k % 6]; R(x - 9, base - k * 3 - 2, 18, 2, '#efe6d2'); R(x - 10, base - k * 3 - 3, 20, 1, PLATE[c][0]); } }

// ---------- 소리 ----------
let ac = null, master = null, roller = null;
function audioOn() { if (ac) return; try { ac = new (window.AudioContext || window.webkitAudioContext)(); master = ac.createGain(); master.gain.value = 0.6; master.connect(ac.destination); } catch (e) { ac = null; } }
const nbufOf = () => { const b = ac.createBuffer(1, ac.sampleRate, ac.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; return b; };
let NB = null;
function noiseS(t, type, f, peak, dec, q = 0.7) { if (!ac) return; NB = NB || nbufOf(); const s = ac.createBufferSource(), fl = ac.createBiquadFilter(), gn = ac.createGain(); s.buffer = NB; fl.type = type; fl.frequency.value = f; fl.Q.value = q; gn.gain.setValueAtTime(0.0001, t); gn.gain.linearRampToValueAtTime(peak, t + 0.003); gn.gain.exponentialRampToValueAtTime(0.0001, t + dec); s.connect(fl); fl.connect(gn); gn.connect(master); s.start(t, Math.random() * 0.5); s.stop(t + dec + 0.05); }
function oscS(type, f, t, peak, dec, f2 = null) { if (!ac) return; const o = ac.createOscillator(), gn = ac.createGain(); o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dec * 0.6); gn.gain.setValueAtTime(0.0001, t); gn.gain.linearRampToValueAtTime(peak, t + 0.004); gn.gain.exponentialRampToValueAtTime(0.0001, t + dec); o.connect(gn); gn.connect(master); o.start(t); o.stop(t + dec + 0.05); return o; }
const SND = {
  tick: () => { if (!ac) return; const t = now(); noiseS(t, 'bandpass', 2600, 0.18, 0.04, 4); oscS('sine', 1320, t, 0.06, 0.08); },
  thud: () => { if (!ac) return; const t = now(); noiseS(t, 'lowpass', 380, 0.5, 0.1); oscS('sine', 90, t, 0.3, 0.14, 50); },
  pick: () => { if (!ac) return; const t = now(); oscS('triangle', 880, t, 0.08, 0.09, 1320); noiseS(t, 'highpass', 5000, 0.06, 0.03); },
  clink: () => { if (!ac) return; const t = now(); oscS('sine', 2400, t, 0.12, 0.25); oscS('sine', 3600, t + 0.01, 0.05, 0.18); noiseS(t, 'highpass', 6000, 0.05, 0.03); },
  rim: () => { if (!ac) return; noiseS(now(), 'bandpass', 2600, 0.3, 0.03, 4); },
  heart: () => { if (!ac) return; const t = now(); oscS('sine', 70, t, 0.35, 0.16, 45); oscS('sine', 60, t + 0.18, 0.25, 0.14, 40); },
  beep: () => { if (!ac) return; oscS('sine', 880, now(), 0.1, 0.1); },
  beep2: () => { if (!ac) return; const t = now(); oscS('square', 660, t, 0.05, 0.08); oscS('square', 660, t + 0.12, 0.05, 0.08); },
  chime: () => { if (!ac) return; const t = now(); [659, 784, 988].forEach((f, i) => oscS('sine', f, t + i * 0.18, 0.08, 0.5)); },
  door: () => { if (!ac) return; noiseS(now(), 'lowpass', 600, 0.3, 0.6); },
  note: (f, d = 1.2, v = 0.07) => { if (!ac) return; const t = now(); oscS('triangle', f, t, v, d); oscS('sine', f * 2, t, v * 0.3, d * 0.6); }
};
function rollerOn(on, vol = 0.05) { if (!ac) return; if (on && !roller) { NB = NB || nbufOf(); const s = ac.createBufferSource(), fl = ac.createBiquadFilter(), gn = ac.createGain(); s.buffer = NB; s.loop = true; fl.type = 'bandpass'; fl.frequency.value = 180; fl.Q.value = 1.2; gn.gain.value = vol; s.connect(fl); fl.connect(gn); gn.connect(master); s.start(); roller = { s, gn }; } if (!on && roller) { roller.gn.gain.setTargetAtTime(0.0001, now(), 0.1); roller.s.stop(now() + 0.5); roller = null; } if (on && roller) roller.gn.gain.setTargetAtTime(vol, now(), 0.1); }
// fire a cue once per timeline pass (keyed), reset on seek
const now = () => ac ? now() : 0;
const fired = new Set();
function cue(key, fn) { if (fired.has(key)) return; fired.add(key); fn(); }

// ---------- 배경 ----------
function warehouse() {
  g.drawImage(bg, 0, 0);
  for (const x of [60, 180, 300]) { R(x + 4, 0, 1, 13, '#3a332c'); R(x + 41, 0, 1, 13, '#3a332c'); R(x - 2, 13, 50, 2, '#3a332c'); R(x, 15, 46, 3, '#fff3c8'); g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createLinearGradient(0, 18, 0, 150); gr.addColorStop(0, 'rgba(255,236,170,.14)'); gr.addColorStop(1, 'rgba(255,236,170,0)'); g.fillStyle = gr; g.beginPath(); g.moveTo(x, 19); g.lineTo(x + 46, 19); g.lineTo(x + 86, 150); g.lineTo(x - 40, 150); g.closePath(); g.fill(); g.restore(); }
}
function sushiRoom() {
  R(0, 0, W, H, '#f0e6d2'); R(0, 0, W, 30, '#2a1d16'); R(0, 30, W, 2, '#8a5a34'); R(0, 80, W, 66, '#c9b48a'); R(0, 80, W, 2, '#8a5a34'); for (let x = 0; x < W; x += 20) R(x, 82, 1, 64, '#b9a47a');
  for (let k = 0; k < 4; k++) { const x = 70 + k * 84; R(x, 30, 1, 6, '#3a2a20'); R(x - 7, 36, 15, 10, '#f2d35a'); R(x - 7, 36, 15, 1, '#fff3c8'); R(x - 6, 46, 13, 1, '#b8762e'); text('寿', x - 3, 37, '#9a2f22', 6); }
  R(240, 40, 100, 36, '#f7f1e2'); R(240, 40, 100, 2, '#8a5a34'); text('접시 가격', 290, 43, '#1b1716', 6, 'center', true);
  Object.entries(PLATE).forEach(([k, [c, won]], i) => { R(246 + (i % 2) * 48, 53 + Math.floor(i / 2) * 11, 14, 2, c); R(246 + (i % 2) * 48, 51 + Math.floor(i / 2) * 11, 14, 1, '#efe6d2'); text(won, 263 + (i % 2) * 48, 49 + Math.floor(i / 2) * 11, '#1b1716', 6); });
  R(0, 158, W, 58, '#d9b98a'); R(0, 158, W, 3, '#8a5a34'); R(0, 176, W, 40, '#1a1210'); for (let x = 0; x < W; x += 36) R(x, 178, 1, 38, '#231a15');
  for (let x = 20; x < W; x += 24) R(x, 172, 2, 2, x % 48 === 20 ? '#ffe9a8' : '#b07a48');
}

// ---------- 0. 벨트에서 ----------
const OPEN = { bpm: 116, boxes: Array.from({ length: 8 }, (_, i) => 1.2 + i * (60 / 116) * 2), speed: 80 };
function drawOpening(u) {
  warehouse();
  const spb = 60 / OPEN.bpm, jumpAt = OPEN.boxes[OPEN.boxes.length - 1] + 0.9;
  const shake = u > jumpAt && u < jumpAt + 0.5 ? 3 * (1 - (u - jumpAt) / 0.5) : 0;
  g.save(); if (shake) g.translate(Math.round((Math.random() * 2 - 1) * shake), Math.round((Math.random() * 2 - 1) * shake));
  // 지우: placing until the jump, then up in the air, then bouncing
  let jPose, jExtra = null;
  if (u < jumpAt) {
    const placing = OPEN.boxes.find(b => Math.abs(u - (b - (SCAN_X - PLACE_X) / OPEN.speed)) < 0.3);
    const p = placing ? (u - (placing - (SCAN_X - PLACE_X) / OPEN.speed) + 0.3) / 0.6 : 0;
    jPose = { hand: placing ? { x: lerp(BOSS_X + 13, PLACE_X - 8, Math.sin(Math.PI * p)), y: lerp(134, 140, Math.sin(Math.PI * p)) } : { x: BOSS_X + 13, y: 134 }, bob: (u % spb) < spb * 0.3 ? 1 : 0, unplug: false };
  } else {
    const j = u - jumpAt, air = j < 0.7 ? -Math.round(14 * Math.sin(Math.PI * j / 0.7)) : -Math.round(3 * Math.abs(Math.sin(j * 4)));
    jPose = { bob: air, vibe: true, noArm: true };
    jExtra = top => { thick(BOSS_X + 5, top + 23, BOSS_X + 14, top + 2, 4, '#6b2f3f'); R(BOSS_X + 13, top - 2, 5, 5, C.skin); thick(BOSS_X - 7, top + 23, BOSS_X - 16, top + 4, 4, '#6b2f3f'); R(BOSS_X - 19, top, 5, 5, C.skin); };
  }
  actor('jiwoo', 46, jPose, false, jExtra);
  if (u >= jumpAt) { const j = u - jumpAt, fy = Math.min(150, 128 + j * j * 400); g.save(); g.translate(28, fy); g.rotate(-0.3 * Math.min(1, j * 2)); boxS(0, 0); g.restore(); }
  // belt and boxes: each box i arrives at the gate at OPEN.boxes[i]; the player takes it there
  const off = u * OPEN.speed; beltAt(BELT_Y, 48, 1, off);
  let kick = 0, lastHit = -9;
  for (const b of OPEN.boxes) { const x = SCAN_X + (u - b) * OPEN.speed; if (x < PLACE_X - 8 || x > W + 10) continue; const done = u >= b; boxS(x - (done ? Math.min(6, (u - b) * 40) : 0), BELT_Y, 18, 14, done); if (done) { kick = Math.max(kick, clamp(1 - (u - b) / 0.14, 0, 1)); lastHit = Math.max(lastHit, b); } }
  for (const b of OPEN.boxes) if (u >= b) cue('open-hit' + b, SND.tick);
  for (const b of OPEN.boxes) { const pl = b - (SCAN_X - PLACE_X) / OPEN.speed; if (u >= pl) cue('open-place' + b, SND.thud); }
  gate(SCAN_X, BELT_Y, 38, true, kick);
  // the player and 하은
  const watch = u > jumpAt + 8.6;
  playerS(kick); haeunBeside({ watch });
  if (u - lastHit < 0.55 && u >= lastHit) judge('딱!', 300, 84, '#8fd694', 14, '', u - lastHit);
  // 반장 walks in from the right after the jump, points, then folds his arms
  const bIn = jumpAt + 2.8, bArr = bIn + 2.4;
  if (u >= bIn) {
    const p = clamp((u - bIn) / (bArr - bIn), 0, 1), x = lerp(410, 150, lerp(p, ease(p), 0.5)), walking = p < 1, bob = walking && Math.floor(u / 0.19) % 2 === 0 ? 1 : 0;
    const fold = u > bArr + 3.2;
    actor('boss', x, { bob, noArm: true, nod: fold && Math.floor((u - bArr - 3.2) / 0.5) === 1 ? 1 : 0 }, true, top => {
      if (!fold) { R(BOSS_X + 2, top + 6, 5, 1, C.hair); R(BOSS_X + 1, top + 5, 2, 1, C.hair); if (!walking) R(BOSS_X - 8, top + 4, 2, 3, C.sweat); }
      if (walking) { thick(BOSS_X + 7, top + 22, BOSS_X + 9 + bob * 2, top + 40, 4, C.shirt); R(BOSS_X + 8, top + 39, 4, 4, C.skin); }
      else if (!fold) { thick(BOSS_X + 7, top + 22, BOSS_X + 28, top + 14, 4, C.shirt); R(BOSS_X + 27, top + 11, 5, 5, C.skin); }
      else { R(BOSS_X - 9, top + 25, 18, 5, C.shirt); R(BOSS_X - 9, top + 26, 3, 3, C.skin); R(BOSS_X + 6, top + 26, 3, 3, C.skin); }
    });
    if (walking) { for (let k = 0; k < 20; k++) { const st = bIn + 0.3 + k * 0.38; if (u >= st && st < bArr) cue('step' + k, () => noiseS(now(), 'lowpass', 420, 0.12, 0.07)); } }
  }
  g.restore();
  // lines
  say(u, jumpAt + 0.2, jumpAt + 2.8, '붙었어요!!!!', 56, 44, 78, { loud: true, size: 10, h: 18, shake: u < jumpAt + 1 ? 2 : 0 });
  if (u > jumpAt + 0.2 && u < jumpAt + 2.8) for (let k = 0; k < 4; k++) text('♪', 70 + k * 14, 70 + (k % 2) * 8 - ((u * 20 + k * 7) % 14), k % 2 ? '#f2a6c8' : '#5ad7e8', 9);
  say(u, jumpAt + 1.2, jumpAt + 2.6, '…?', 320, 44, 18, { bg: '#d9d0bd' });
  say(u, bArr, bArr + 2.2, '…야! 벨트가 왜 비어!', 104, 64, 92, { loud: true, size: 8, h: 15, shake: u < bArr + 0.4 ? 2 : 0 });
  say(u, bArr + 1, bArr + 3.4, '반장님! 저 붙었어요! 반장님 기타 넣은 곡으로요!', 2, 28, 184, { size: 7 });
  say(u, bArr + 4.2, bArr + 7, '…회식이다. 오늘. 다 와.', 92, 50, 96, { size: 8, h: 15 });
  say(u, bArr + 5.6, bArr + 7.6, '저도요? …밥은 공짜죠?', 270, 40, 90, { bg: '#d9d0bd' });
  hud(u < jumpAt ? '3번 라인 · 04:10' : u < bArr ? '3번 라인 · 04:11' : '3번 라인 · 04:12', u < jumpAt + 0.5 ? '콤보 ' + OPEN.boxes.filter(b => u >= b).length : '');
  if (u > jumpAt + 1.5 && u < bIn) text('(벨트는 돌지만 상자가 안 온다. 롤러 소리만.)', 60, 190, `rgba(239,230,210,${0.75 * clamp((u - jumpAt - 1.5) / 0.6, 0, 1)})`, 6);
  cue('open-roller', () => rollerOn(true, 0.05));
}

// ---------- 1·2. 회전초밥집 ----------
const LANES = [{ y: 110, k: 0.7 }, { y: 128, k: 0.85 }, { y: 146, k: 1 }];
const laneX = (x, k) => SCAN_X + k * (x - SCAN_X);
const SUSHI = { bpm: 100, speed: 70, fly: 0.5, landX: 130 };
// one item per throw: thrown at t, flies 0.5 s to lane L at x=130 (lane coords), then rides to the gate
function throwsFor(phase) {
  const spb = 60 / SUSHI.bpm, pat = [2, 0, 1, 2, 1, 0, 2, 2, 0, 1, 2, 0, 1, 2, 1, 2, 0, 2, 1, 2];
  const list = []; for (let i = 0; i < 20; i++) list.push({ t: 1 + i * spb * 1.0, lane: pat[i], col: ['red', 'blue', 'red', 'gold', 'red'][i % 5], kind: i % 4, who: (i % 4 === 3) ? 'haeun' : 'player' });
  // a triple at the end: three at once on all belts
  const t3 = 1 + 21 * spb; for (let l = 0; l < 3; l++) list.push({ t: t3, lane: l, col: 'red', kind: l, who: 'player', triple: true });
  return list;
}
const THROWS = [throwsFor(1), throwsFor(2)];
function itemArrive(it) { return it.t + SUSHI.fly + (SCAN_X - SUSHI.landX) / SUSHI.speed; }
function drawSushi(u, phase) {
  const drunk = phase === 2, spb = 60 / SUSHI.bpm, level = drunk ? clamp(u / 16 * 3, 0, 3) : 0;
  sushiRoom();
  // 지우 behind the far belt
  actor('jiwoo', 232, { hand: { x: 248, y: 104 }, wince: !drunk, bob: drunk ? -Math.round(2 * Math.abs(Math.sin(u * 5))) : ((u % spb) < spb * 0.3 ? 1 : 0), unplug: true, dip: -14 }, false, top => { if (drunk) sojuGlass(248, 102); });
  const items = THROWS[phase - 1];
  let lastPick = -9, lastTriple = -9, kick = 0, haeunStack = drunk ? 8 : 0, lastHaeun = -9, lastClink = -9;
  // belts far to near, then the items riding them, then the gates
  LANES.forEach((L, i) => { beltAt(L.y, Math.round(laneX(48, L.k)), 0.75 + i * 0.125, u * SUSHI.speed * L.k); });
  for (const it of items) {
    const arr = itemArrive(it), L = LANES[it.lane];
    if (u < it.t) continue;
    let sx, sy, sc = L.k;
    if (u < it.t + SUSHI.fly) { const p = (u - it.t) / SUSHI.fly, x0 = 80, y0 = 86, x1 = laneX(SUSHI.landX, L.k), y1 = L.y; sx = lerp(x0, x1, p); sy = lerp(y0, y1, p) - Math.sin(Math.PI * p) * (30 + it.lane * 8); sc = lerp(0.9, L.k, p); if (u > it.t + SUSHI.fly - 0.05) cue('land' + phase + it.t + it.lane, SND.thud); }
    else { const lx = SUSHI.landX + (u - it.t - SUSHI.fly) * SUSHI.speed; sx = laneX(lx, L.k); sy = L.y; if (it.who === 'player' && u >= arr) { if (it.triple) lastTriple = Math.max(lastTriple, arr); else lastPick = Math.max(lastPick, arr); kick = Math.max(kick, clamp(1 - (u - arr) / 0.14, 0, 1)); cue('pick' + phase + it.t + it.lane, drunk ? SND.clink : SND.pick); continue; }
      if (it.who === 'haeun') { if (sx > 346) { haeunStack++; lastHaeun = Math.max(lastHaeun, u - (sx - 346) / (SUSHI.speed * L.k)); cue('haeun' + phase + it.t, SND.pick); continue; } } }
    if (drunk) sojuGlass(sx, sy, sc); else sushiPlate(sx, sy, it.col, it.kind, sc);
  }
  LANES.forEach((L, i) => gate(SCAN_X, L.y, i === 2 ? 38 : 16, true, kick));
  // 반장 at the loading end: the throw is a quick arm swing on each throw time
  let swing = 0; for (const it of items) if (u >= it.t - 0.25 && u < it.t + 0.3) swing = Math.max(swing, Math.sin(Math.PI * clamp((u - it.t + 0.25) / 0.55, 0, 1)));
  actor('boss', 46, { bob: drunk && (u % spb) < spb * 0.3 ? 1 : 0, noArm: true }, false, top => { const hx = lerp(BOSS_X + 14, BOSS_X + 30, swing), hy = lerp(top + 30, top - 2, swing); thick(BOSS_X + 7, top + 22, hx, hy, 4, C.shirt); R(hx - 1, hy - 3, 5, 5, C.skin); if (swing < 0.5) { if (drunk) sojuGlass(hx + 2, hy - 2, 0.9); else sushiPlate(hx + 2, hy - 1, 'red', 0, 0.8); } });
  if (drunk) { soju(20, 146); soju(28, 146); if (u > 6) soju(12, 146); }
  // the player with chopsticks, 하은 eating beside him, the stacks
  const eating = drunk || (u % 1.4) < 0.7; const eatK = (u % 1.4) < 0.7 ? (u % 1.4) / 0.7 : 1 - ((u % 1.4) - 0.7) / 0.7;
  playerChop(kick, level / 3);
  if (!drunk) haeunBeside({ eat: eatK });
  plateStack(326, 172, Math.min(5, Math.floor(u / 4) + 1)); if (drunk) for (let k = 0; k < Math.min(3, Math.floor(u / 5) + 1); k++) sojuGlass(296 + k * 8, 172, 0.9, 0);
  if (!drunk) plateStack(362, 172, 2 + haeunStack);
  // judgements and lines
  if (u - lastPick < 0.55) judge(drunk ? '짠!' : '쏙', 300, drunk ? 84 : 96, drunk ? '#ffe9a8' : '#8fd694', drunk ? 18 : 14, '', u - lastPick);
  if (u - lastTriple < 0.9) { judge(drunk ? '짠!!!' : '세 개!', 300, 60, '#ffe9a8', 24, drunk ? '셋 다 짠' : '셋 다 한 번에', u - lastTriple); if (u - lastTriple < 0.25) { g.fillStyle = `rgba(255,255,255,${0.4 * (1 - (u - lastTriple) / 0.25)})`; g.fillRect(0, 0, W, H); } }
  if (!drunk) { say(u, 2, 5, '회식인데 웬 회전초밥이에요…', 118, 58, 112); say(u, 5.5, 8.5, '…고기는 비싸. 받아라.', 6, 50, 92); say(u, 10, 12.5, '…하은 씨, 그거 다 먹은 거예요?', 118, 58, 126); }
  else { say(u, 1, 4, '(우물우물)', 326, 44, 48, { bg: '#d9d0bd' }); say(u, 4.5, 7.5, '…다음 달까지만 나온다.', 6, 50, 92, { shake: level > 2 ? 1 : 0 }); say(u, 8, 11, '반장님 기타, 진짜 샘플로 썼어요!', 118, 58, 118, { shake: level > 1.5 ? 1 : 0 }); say(u, 11.5, 13.5, '(우물우물)', 326, 44, 48, { bg: '#d9d0bd' }); }
  hud(drunk ? '회전초밥 · 00:30' : '회전초밥 · 23:40', '콤보 ' + items.filter(it => it.who === 'player' && u >= itemArrive(it)).length);
  cue('sushi-roller' + phase, () => rollerOn(true, 0.03));
  return level;
}
// the drunk pass: warm, bloom, a slow lean, a ghost, a vignette; 하은 alone redrawn sharp
let offC = null;
function drunkFx(level, u, sharp) {
  const k = level; if (k <= 0) { if (sharp) sharp(); return; }
  if (!offC) { offC = document.createElement('canvas'); offC.width = W; offC.height = H; }
  const o = offC.getContext('2d'); o.clearRect(0, 0, W, H); o.drawImage(g.canvas, 0, 0);
  g.save(); g.translate(W / 2, H / 2); g.rotate(0.012 * k * Math.sin(u / 1.3)); g.translate(-W / 2, -H / 2); g.drawImage(offC, 0, 0); g.restore();
  g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.14 * k; g.filter = `blur(${(1 + k).toFixed(1)}px)`; g.drawImage(offC, 0, 0); g.filter = 'none'; g.restore();
  g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = `rgba(255,140,60,${0.09 * k})`; g.fillRect(0, 0, W, H); g.restore();
  if (k >= 1.5) { g.save(); g.globalAlpha = 0.2 * (k - 1); g.drawImage(offC, Math.round(2 + Math.sin(u * 2) * 2), 1); g.restore(); }
  if (sharp) sharp();
  vignette(0.2 * k);
}

// ---------- 일반인: 같은 4등신 몸, 옷과 소품만 다르게 ----------
// o: coat, pants, hair, skin, cap (colour or null), bag, step (walking frame or null), sit (legs hidden), mirror, bob, apron, mask
function person(x, top, o = {}) {
  const coat = o.coat || '#6b7073', pants = o.pants || '#3a3f45', hair = o.hair || '#1e1a1a', skin = o.skin || C.skin, shoe = '#1e1a1a';
  g.save(); if (o.mirror) { g.translate(x, 0); g.scale(-1, 1); g.translate(-x, 0); }
  const cx = x, t = top + (o.bob || 0);
  if (!o.sit) { if (o.step != null) { const st = o.step ? 3 : -3; R(cx - 5 + st, t + 38, 5, 16, pants); R(cx + 2 - st, t + 38, 5, 15, pants); R(cx - 6 + st, t + 53, 6, 3, shoe); R(cx + 2 - st, t + 52, 6, 3, shoe); } else { R(cx - 5, t + 38, 5, 16, pants); R(cx + 2, t + 38, 5, 15, pants); R(cx - 6, t + 53, 6, 3, shoe); R(cx + 2, t + 52, 6, 3, shoe); } }
  R(cx - 7, t + 16, 14, 23, coat); if (o.apron) R(cx - 5, t + 22, 10, 16, o.apron); if (o.vest) { R(cx - 7, t + 18, 14, 13, o.vest); R(cx - 7, t + 25, 14, 2, C.reflect); }
  if (o.stripe) R(cx - 7, t + 20, 14, 2, o.stripe);
  R(cx - 6, t + 1, 12, 14, skin); R(cx - 7, t - 1, 14, 5, hair); if (o.longHair) { R(cx - 8, t + 2, 2, 14, hair); R(cx + 6, t + 2, 2, 14, hair); } else { R(cx - 7, t + 3, 2, 6, hair); R(cx + 5, t + 3, 2, 5, hair); }
  if (o.grey) R(cx - 7, t - 1, 14, 5, '#c9c2b0');
  if (o.cap) { R(cx - 7, t - 2, 14, 5, o.cap); R(cx - 7 + (o.mirror ? 0 : -8), t + 2, 9, 2, o.cap); }
  if (o.mask) R(cx - 4, t + 8, 9, 5, '#dfe6ea'); else if (!o.asleep) R(cx - 3 + (o.mirror ? 0 : 1), t + 7, 2, 2, C.ink); else R(cx - 3, t + 8, 3, 1, C.ink);
  if (o.glasses) { R(cx - 4, t + 6, 4, 3, '#2b2e31'); R(cx + 1, t + 6, 4, 3, '#2b2e31'); }
  if (o.phone) { thick(cx + 5, t + 22, cx + 9, t + 14, 4, coat); R(cx + 7, t + 8, 5, 8, '#1b1716'); R(cx + 8, t + 9, 3, 6, '#5ad7e8'); }
  else if (o.step != null) { const st = o.step ? 4 : -2; thick(cx + 6, t + 22, cx + 8 + st, t + 34, 4, coat); R(cx + 7 + st, t + 33, 4, 4, skin); }
  else { thick(cx + 6, t + 22, cx + 8, t + 34, 4, coat); R(cx + 7, t + 33, 4, 4, skin); }
  if (o.bag) { R(cx - 14, t + 26, 8, 12, o.bag); R(cx - 13, t + 23, 6, 3, o.bag); }
  if (o.earbuds) { R(cx + 5, t + 8, 2, 2, '#f4f1ea'); R(cx - 7, t + 8, 2, 2, '#f4f1ea'); }
  g.restore();
}
const cart = (x, y, c = '#8fb0a0') => { R(x, y - 20, 26, 14, c); R(x, y - 22, 26, 2, '#dfe6ea'); R(x + 2, y - 6, 4, 4, '#2b2e31'); R(x + 20, y - 6, 4, 4, '#2b2e31'); R(x + 26, y - 30, 2, 12, '#9aa0a6'); R(x + 20, y - 31, 8, 2, '#9aa0a6'); };
const wheelchair = (x, y) => { g.fillStyle = '#2b2e31'; g.beginPath(); g.arc(x + 4, y - 7, 7, 0, Math.PI * 2); g.fill(); g.fillStyle = '#6a7075'; g.beginPath(); g.arc(x + 4, y - 7, 4, 0, Math.PI * 2); g.fill(); R(x - 10, y - 22, 16, 3, '#2b2e31'); R(x - 10, y - 36, 3, 16, '#2b2e31'); R(x + 14, y - 5, 4, 4, '#2b2e31'); };
const ivPole = (x, y) => { R(x, y - 56, 2, 56, '#9aa0a6'); R(x - 6, y - 2, 14, 2, '#9aa0a6'); R(x - 3, y - 58, 8, 14, '#dfe6ea'); R(x - 1, y - 56, 4, 9, '#bfe3d2'); };

// ---------- 하은의 밤: 컷과 클로즈업 ----------
// The second half is cut like a film: one idea per shot, the camera moves (zoom, pan) instead of the world scrolling, black bars on,
// and the beat motif carries from shot to shot: belt slats -> tunnel lights -> the crossing's beeps and stripes -> seven corridor lamps
// -> the ECG. People appear only where the story needs them.
let silC = null;
function silhouette(draw, dark) { if (!silC) { silC = document.createElement('canvas'); silC.width = W; silC.height = H; } const o = silC.getContext('2d'), g0 = g; o.clearRect(0, 0, W, H); g = o; draw(); g.globalCompositeOperation = 'source-atop'; g.fillStyle = `rgba(16,18,26,${dark})`; g.fillRect(0, 0, W, H); g.globalCompositeOperation = 'source-over'; g = g0; g.drawImage(silC, 0, 0); }
function letterbox() { R(0, 0, W, 22, '#000'); R(0, H - 22, W, 22, '#000'); }
function cam(zoom, cx, cy) { g.translate(W / 2, H / 2); g.scale(zoom, zoom); g.translate(-cx, -cy); }
function sitPlayer(x, tilt, floorY = 146, floorC = '#8d939a') { g.save(); g.translate(x, floorY); g.rotate(tilt); g.translate(-PLAYER_X, -floorY); g.translate(0, floorY - 132); drawPlayer(0, 0); R(PLAYER_X + 6, 102, 2, 3, '#e07070'); R(PLAYER_X - 8, 102, 2, 3, '#e07070'); R(PLAYER_X - 4, 101, 3, 1, C.ink); g.restore(); R(x - 30, floorY, 60, 30, floorC); }
// ---- texture helpers
const grain = (x, y, w, h, c, d = 0.08, seed = 1) => { for (let yy = y; yy < y + h; yy += 2) for (let xx = x; xx < x + w; xx += 2) if (rnd(xx * 7 + seed, yy * 13) < d) R(xx, yy, 2, 1, c); };
const tiles = (x, y, w, h, tw, th, a, b, line) => { for (let yy = y; yy < y + h; yy += th) for (let xx = x; xx < x + w; xx += tw) { R(xx, yy, tw - 1, th - 1, ((xx / tw + yy / th) % 2) ? a : b); } if (line) for (let yy = y; yy < y + h; yy += th) R(x, yy + th - 1, w, 1, line); };
const glow = (x, y, r, c, a) => { g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createRadialGradient(x, y, 1, x, y, r); gr.addColorStop(0, `rgba(${c},${a})`); gr.addColorStop(1, `rgba(${c},0)`); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); g.restore(); };
const cone = (x, y, w0, w1, h, c, a) => { g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, `rgba(${c},${a})`); gr.addColorStop(1, `rgba(${c},0)`); g.fillStyle = gr; g.beginPath(); g.moveTo(x - w0 / 2, y); g.lineTo(x + w0 / 2, y); g.lineTo(x + w1 / 2, y + h); g.lineTo(x - w1 / 2, y + h); g.closePath(); g.fill(); g.restore(); };
// a hand in pixels, palm down, fingers to the right (mirror for the other way); old = thin, veined
function hand(x, y, skin, old, sleeve) {
  const dark = old ? '#b98a6a' : '#c0906a', light = old ? '#e6c4a8' : '#efc9a8';
  if (sleeve) { R(x - 34, y - 2, 30, 22, sleeve); R(x - 6, y - 1, 4, 20, mix(sleeve, '#000000', 0.3)); }
  R(x - 4, y, 36, 20, skin); R(x - 4, y, 36, 2, light); R(x - 4, y + 18, 36, 2, dark);
  for (let k = 0; k < 4; k++) { const fy = y + 1 + k * 5, len = [22, 26, 24, 18][k]; R(x + 30, fy, len, 4, skin); R(x + 30, fy, len, 1, light); R(x + 30, fy + 3, len, 1, dark); R(x + 30 + len - 2, fy + 1, 2, 2, dark); R(x + 30 + 10, fy + 1, 1, 2, dark); }
  R(x + 2, y + 16, 10, 8, skin); R(x + 2, y + 23, 10, 1, dark); R(x + 10, y + 18, 6, 4, skin);   // the thumb
  if (old) { R(x + 6, y + 4, 14, 1, dark); R(x + 10, y + 9, 16, 1, dark); R(x + 4, y + 12, 10, 1, dark); R(x + 30, y + 2, 1, 16, dark); }
}
// 1. the window: close on the pair; the tunnel wall rushes past the glass, the car's lights and her face sit in the reflection,
//    the LED strip over the door reads the next stop, he sleeps on her shoulder, she eases him off and stands
function drawTrainClose(u) {
  const speed = u < 5 ? 1 : Math.max(0, 1 - (u - 5) / 3), sc = u < 5 ? u * 170 : 5 * 170 + 170 * 3 * (1 - Math.pow(1 - Math.min(1, (u - 5) / 3), 2)) / 2;
  g.save(); cam(1.55, 286, 112);
  // wall, window, seats
  R(0, 0, W, H, '#d6dbe1'); R(0, 0, W, 26, '#c3c8d0'); R(0, 26, W, 2, '#9aa0a8'); R(0, 28, W, 6, '#e6eaef');
  // the tunnel through the glass: concrete rings, cables, the lamps every so often, all streaking with speed
  R(196, 34, 190, 58, '#07090e'); g.save(); g.beginPath(); g.rect(196, 34, 190, 58); g.clip();
  for (let k = -1; k < 8; k++) { const rx = 196 + ((k * 64 - sc * 0.6) % 256 + 256) % 256; R(rx, 34, 3, 58, '#12161e'); }
  R(196, 50, 190, 1, '#1a1f28'); R(196, 56, 190, 1, '#1a1f28'); R(196, 74, 190, 1, '#141820');
  for (let j = 0; j < 4; j++) { const lx = 196 + ((j * 118 + 30 - sc) % 236 + 236) % 236; const len = 10 + speed * 36; R(lx - len, 44, len, 3, '#ffd890'); R(lx - len, 43, len, 1, '#fff3c8'); glow(lx, 45, 18 + speed * 10, '255,216,144', 0.25); }
  // reflections: the car's own ceiling lights, and her face, faint
  g.globalAlpha = 0.16; R(196, 36, 190, 4, '#ffffff'); for (let k = 0; k < 3; k++) R(210 + k * 70, 37, 40, 2, '#ffffff'); g.globalAlpha = 0.2; g.translate(2 * 258, 0); g.scale(-1, 1); drawHaeunAt(258, 42, 0, { load: true, bob: 0 }); g.restore();
  R(194, 32, 194, 2, '#8d939a'); R(194, 92, 194, 2, '#8d939a'); R(194, 32, 2, 62, '#8d939a'); R(386, 32, 2, 62, '#8d939a'); R(196, 90, 190, 2, '#2b2e31');
  // LED strip over the window
  R(230, 12, 120, 12, '#1b1716'); R(232, 14, 116, 8, '#0a0c10'); if (u > 2.4) { const n = Math.min(14, Math.floor((u - 2.4) * 9)); text('다음은 ○○대학병원 '.slice(0, n), 236, 14, '#ff8a3d', 7); if (u < 2.6) cue('ann', SND.chime); }
  // seat back and cushion with stitching, the pole
  R(0, 108, W, 38, '#2f5f8a'); R(0, 108, W, 3, '#3f7fb0'); for (let x = 0; x < W; x += 46) { R(x, 111, 1, 35, '#244a6e'); R(x + 6, 118, 34, 1, '#3a6a98'); } R(0, 146, W, 70, '#8d939a'); R(0, 146, W, 3, '#6a7075'); R(0, 149, W, 2, '#7a8085');
  // 하은 seated, hands in her lap; the bag by her feet
  if (u < 7.6) { drawHaeunAt(262, 108, 0, { load: true, bob: 0 }); R(254, 140, 26, 9, '#3a3f45'); R(236, 149, 54, 30, '#8d939a'); R(236, 149, 54, 3, '#6a7075'); thick(268, 130, 278, 140, 4, '#1e1a1a'); R(276, 139, 5, 4, '#2a2d31'); R(275, 136, 3, 3, '#d8dde0'); }
  // 신입 leaning on her shoulder, then eased off against the pole
  const tilt = u < 6 ? -0.26 : lerp(-0.26, 0.1, ease((u - 6) / 1.6));
  sitPlayer(312, tilt); zzz(318, 96 + (tilt < 0 ? 0 : 6), u * 1000);
  R(338, 100, 4, 46, '#9aa0a6'); R(338, 100, 1, 46, '#c9ccd2');
  if (u >= 7.6) { const p = ease((u - 7.6) / 1.2); drawHaeunAt(262 - Math.round(p * 34), Math.round(lerp(108, 70, p)), 0, p < 1 ? { step: Math.floor(u / 0.2) % 2 } : { load: true, bob: 0 }); }
  R(236, 150, 10, 10, '#3a3f45'); R(237, 147, 8, 4, '#2a2d31');
  if (u >= 6 && u < 6.2) cue('ease', () => noiseS(now(), 'lowpass', 400, 0.08, 0.3));
  g.restore();
  vignette(0.35); letterbox();
  cue('tc-rumble', () => rollerOn(true, 0.08)); if (u > 7.5) cue('tc-stop', () => rollerOn(false));
  fadeBlack(u < 0.8 ? 1 - u / 0.8 : 0);
}
// 2. the door from the platform: tiled wall, the yellow line and tactile paving, the train with its livery; the doors open, she
//    steps out, they close on the sleeping 신입, the train pulls out in a blur of light and wind, and she is alone on the platform
function drawDoorOut(u) {
  const open = clamp((u - 0.6) / 1.2, 0, 1) * (u < 4.6 ? 1 : 1 - clamp((u - 4.6) / 1.2, 0, 1)), gone = clamp((u - 6.2) / 2.2, 0, 1);
  const zoom = u > 8 ? lerp(1.4, 1, ease((u - 8) / 2)) : 1.4;
  g.save(); cam(zoom, 192, 118);
  // the far wall behind the tracks: tiles, the station sign, a clock, an ad
  tiles(0, 0, W, 150, 12, 8, '#dfe6e2', '#d2dad6', '#c3cbc7'); R(0, 0, W, 10, '#b9c4c0');
  R(110, 54, 164, 32, '#1e2a33'); R(114, 58, 156, 24, '#2f3a4a'); text('○○대학병원', 192, 63, '#ffffff', 9, 'center', true); R(114, 82, 156, 2, '#8fd694'); text('Univ. Hospital', 192, 74, '#9fb8c8', 5, 'center');
  R(296, 58, 44, 16, '#1b1716'); R(298, 60, 40, 12, '#06140c'); text('05:14', 318, 62, '#8fd694', 8, 'center', true);
  R(20, 58, 60, 40, '#f2a6c8'); R(24, 62, 52, 32, '#fff3c8'); R(28, 66, 30, 3, '#1b1716'); R(28, 74, 44, 2, '#1b1716'); R(28, 80, 20, 2, '#1b1716');
  // platform: tactile paving, the yellow line, the edge
  R(0, 150, W, 66, '#b9c4c0'); R(0, 150, W, 2, '#8a948c'); for (let x = 0; x < W; x += 6) for (let y = 156; y < 164; y += 4) R(x + 1, y, 2, 2, '#9aa39f'); R(0, 164, W, 4, '#f2d35a'); R(0, 168, W, 48, '#a9b4b0'); grain(0, 168, W, 48, '#98a39f', 0.06, 3);
  // the train: body, the lower band, the windows, the door with its windows, light spilling from inside
  const tx = Math.round(gone * gone * 460);
  g.save(); g.translate(tx, 0);
  R(-30, 18, W + 60, 140, '#dfe3e8'); R(-30, 18, W + 60, 4, '#9aa0a8'); R(-30, 112, W + 60, 6, '#2f6f8a'); R(-30, 146, W + 60, 10, '#5a6065'); R(-30, 156, W + 60, 4, '#2b2e31');
  for (const x of [10, 290]) { R(x, 36, 70, 44, '#0a0c12'); R(x - 2, 34, 74, 2, '#8d939a'); R(x - 2, 80, 74, 2, '#8d939a'); R(x + 4, 40, 62, 36, '#141a2a'); glow(x + 35, 58, 30, '255,236,170', 0.12); }
  // the doorway and the car inside: seat, pole, the sleeping 신입
  R(128, 30, 128, 126, '#9aa0a6'); R(132, 34, 120, 122, '#2f5f8a'); R(132, 34, 120, 64, '#d6dbe1'); R(132, 34, 120, 8, '#c3c8d0'); R(132, 98, 120, 36, '#2f5f8a'); R(132, 98, 120, 3, '#3f7fb0'); R(132, 134, 120, 22, '#8d939a');
  R(150, 44, 84, 40, '#0a0c12'); R(154, 48, 76, 32, '#101620');
  sitPlayer(226, 0.1, 134, '#8d939a'); zzz(234, 84, u * 1000); R(176, 34, 4, 122, '#9aa0a6'); R(176, 34, 1, 122, '#c9ccd2');
  glow(192, 100, 60, '255,236,170', 0.18);
  // the two door panels with their windows and rubber seals
  const dw = 60 * (1 - open);
  for (const [x0, dir] of [[132, 1], [252, -1]]) { const x = dir > 0 ? x0 : x0 - dw; if (dw <= 0) continue; R(x, 34, dw, 122, '#e6eaef'); R(x, 34, dw, 2, '#9aa0a8'); R(x + (dir > 0 ? dw - 2 : 0), 34, 2, 122, '#2b2e31'); if (dw > 14) { R(x + 6, 44, dw - 12, 40, '#0a0c12'); R(x + 8, 46, dw - 16, 36, '#101620'); } R(x + 4, 100, Math.max(0, dw - 8), 1, '#9aa0a8'); }
  g.restore();
  // wind as the train leaves: streaks and a scrap of paper
  if (gone > 0 && gone < 1) { g.save(); g.globalAlpha = 0.5 * (1 - gone); for (let k = 0; k < 8; k++) R(((k * 97 + u * 500) % (W + 60)) - 30, 60 + (k * 23) % 80, 30 + k * 4, 1, '#ffffff'); g.restore(); const px = 60 + gone * 200; R(px, 150 - Math.sin(gone * 6) * 20, 6, 4, '#efe6d2'); }
  // 하은 stepping out, then standing alone as the train pulls away
  const out = clamp((u - 1.8) / 2.2, 0, 1), hx = Math.round(lerp(192, 118, ease(out))), hy = Math.round(lerp(88, 100, ease(out)));
  if (u > 1.6) { drawHaeunAt(hx, hy, 0, out < 1 ? { step: Math.floor(u / 0.18) % 2 } : (u > 7 ? { load: true, watch: u > 8.4 } : { load: true })); R(hx + 6, hy + 34, 12, 14, '#3a3f45'); R(hx + 7, hy + 30, 10, 5, '#2a2d31'); g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.ellipse(hx, hy + 56, 12, 3, 0, 0, Math.PI * 2); g.fill(); }
  g.restore();
  vignette(0.25); letterbox();
  if (u >= 0.6) cue('d-open', () => { SND.chime(); SND.door(); }); if (u >= 4.6) cue('d-close', SND.door); if (u >= 6.2) cue('d-go', () => { rollerOn(true, 0.07); setTimeout(() => rollerOn(false), 2200); });
  fadeBlack(u > 9.3 ? (u - 9.3) / 0.7 : 0);
}
// 3. the stairs: tiled stairwell, handrails, the exit sign; light pours down from the street as rays; her silhouette climbs into it
function drawStairs(u) {
  const sky = g.createLinearGradient(0, 0, 0, 90); sky.addColorStop(0, '#5a7aa8'); sky.addColorStop(0.6, '#c9a0a8'); sky.addColorStop(1, '#ffd8a0'); g.fillStyle = sky; g.fillRect(60, 0, 264, 90);
  for (let k = 0; k < 4; k++) { const cx = 90 + k * 70 + u * 3, cy = 20 + (k % 2) * 16; g.fillStyle = 'rgba(255,240,220,.35)'; g.beginPath(); g.ellipse(cx, cy, 22, 5, 0, 0, Math.PI * 2); g.fill(); }
  for (let k = 0; k < 3; k++) { const bx = 120 + k * 70 + u * 12, by = 40 + k * 10 - u * 6, f = Math.floor(u * 6 + k) % 2 ? 2 : 0; R(bx, by, 3, 1, '#2a2a30'); R(bx + 3, by - f, 3, 1, '#2a2a30'); R(bx - 3, by - f, 3, 1, '#2a2a30'); }
  // the walls: tiled, with the exit sign and a handrail each side
  tiles(0, 0, 60, H, 10, 10, '#2a2d38', '#242732', '#1c1f28'); tiles(324, 0, 60, H, 10, 10, '#2a2d38', '#242732', '#1c1f28');
  R(60, 0, 2, H, '#3a3d48'); R(322, 0, 2, H, '#3a3d48');
  R(20, 20, 32, 14, '#1b1716'); R(22, 22, 28, 10, '#2f8a5a'); text('출구 3', 36, 23, '#ffffff', 6, 'center', true);
  for (let k = 0; k < 10; k++) { const y = 70 + k * 15; R(62, y, 260, 15, k % 2 ? '#2a2b35' : '#252630'); R(62, y, 260, 2, '#3b3c48'); R(62, y + 13, 260, 2, '#1a1b24'); R(64, y + 6, 256, 1, '#30313c'); }
  R(70, 60, 4, 156, '#7a8088'); R(310, 60, 4, 156, '#7a8088'); for (let y = 70; y < 216; y += 30) { R(66, y, 12, 2, '#7a8088'); R(306, y, 12, 2, '#7a8088'); }
  // light from the street coming down the stairs
  g.save(); g.globalCompositeOperation = 'lighter'; const lg = g.createLinearGradient(0, 70, 0, 216); lg.addColorStop(0, 'rgba(255,220,180,.35)'); lg.addColorStop(1, 'rgba(255,220,180,0)'); g.fillStyle = lg; g.fillRect(62, 70, 260, 146);
  for (let k = 0; k < 5; k++) { g.fillStyle = `rgba(255,230,200,${0.05 + 0.03 * Math.sin(u * 2 + k)})`; g.beginPath(); g.moveTo(110 + k * 36, 70); g.lineTo(130 + k * 36, 70); g.lineTo(150 + k * 36 + 20, 216); g.lineTo(110 + k * 36 + 20, 216); g.closePath(); g.fill(); }
  g.restore();
  // her silhouette climbing, a rim of light on the cap and shoulder
  const p = clamp(u / 5, 0, 1), sx = 192, sy = Math.round(lerp(150, 46, p));
  silhouette(() => { drawHaeunAt(sx, sy, 0, { step: Math.floor(u / 0.26) % 2, mirror: true }); R(sx - 10, sy + 34, 12, 14, '#3a3f45'); }, 0.88 - p * 0.25);
  R(sx - 2, sy - 3, 12, 1, 'rgba(255,230,200,.6)'); R(sx + 4, sy + 16, 4, 1, 'rgba(255,230,200,.5)');
  letterbox();
  if (u > 0.5) cue('birds', () => { [2600, 3100, 2800, 3300].forEach((f, i) => oscS('sine', f, now() + 0.4 + i * 0.15, 0.03, 0.12, f * 1.2)); });
  for (let k = 0; k < 12; k++) { const st = 0.2 + k * 0.52; if (u >= st) cue('sstep' + k, () => noiseS(now(), 'lowpass', 600, 0.05, 0.08)); }
  fadeBlack(u < 0.5 ? 1 - u / 0.5 : u > 5.4 ? (u - 5.4) / 0.6 : 0);
}
// 4. the last streetlight: shuttered shops, a parked car, power lines, the lamp with its moths; she passes under it and it dies
function drawLamp(u) {
  const dawn = clamp(u / 8, 0, 1);
  const sky = g.createLinearGradient(0, 0, 0, 120); sky.addColorStop(0, mix('#1c2742', '#6a8ab8', dawn)); sky.addColorStop(0.7, mix('#3a4a70', '#b8c8dc', dawn)); sky.addColorStop(1, mix('#b86a44', '#ffd8a0', dawn)); g.fillStyle = sky; g.fillRect(0, 0, W, 120);
  // far buildings, then the shop row with shutters and signs
  for (const [x, w, h] of [[0, 50, 50], [60, 30, 70], [100, 70, 44], [300, 60, 60], [370, 40, 50]]) R(x, 120 - h, w, h, mix('#2a3350', '#8a98b8', dawn));
  R(0, 86, W, 64, mix('#3a3a44', '#8a8a94', dawn)); R(0, 86, W, 4, mix('#4a4a54', '#9a9aa4', dawn));
  for (let k = 0; k < 5; k++) { const x = 8 + k * 78; R(x, 92, 64, 58, '#2b2e36'); for (let yy = 96; yy < 148; yy += 5) R(x + 2, yy, 60, 2, '#3a3d46'); R(x - 2, 88, 68, 6, ['#8a3a2a', '#2f6f4a', '#2c3b57', '#8a5a34', '#5a2a5a'][k]); R(x + 6, 89, 30, 3, '#efe6d2'); }
  for (let x = 0; x < W; x += 1) { R(x, 60 + Math.round(Math.sin(x / 40) * 3), 1, 1, '#1a1a22'); R(x, 66 + Math.round(Math.sin(x / 40 + 1) * 3), 1, 1, '#1a1a22'); }
  R(300, 40, 3, 110, '#1a1a22'); R(298, 40, 7, 3, '#1a1a22');
  // sidewalk, curb, road, a parked car at the curb
  R(0, 150, W, 14, mix('#8a8a90', '#b8b8c0', dawn)); for (let x = 0; x < W; x += 24) R(x, 150, 1, 14, mix('#6a6a70', '#9a9aa0', dawn)); R(0, 164, W, 4, mix('#6a6a70', '#a0a0a8', dawn)); R(0, 168, W, 48, mix('#2e2e34', '#5a5a64', dawn)); grain(0, 168, W, 48, mix('#3a3a40', '#6a6a74', dawn), 0.05);
  R(20, 150, 90, 20, '#3a4a6a'); R(30, 140, 60, 12, '#3a4a6a'); R(34, 142, 24, 8, '#9fb8c8'); R(62, 142, 24, 8, '#9fb8c8'); R(20, 150, 90, 2, '#5a6a8a'); g.fillStyle = '#1b1716'; g.beginPath(); g.arc(38, 170, 6, 0, Math.PI * 2); g.arc(92, 170, 6, 0, Math.PI * 2); g.fill();
  // the lamp
  const off = u > 4.2, flick = u > 3.4 && u < 4.2 && Math.floor(u * 14) % 3 === 0, lampOn = !off && !flick;
  R(190, 40, 5, 110, '#2b2e31'); R(190, 40, 2, 110, '#4a4d52'); R(182, 34, 22, 8, '#3a3d44'); R(184, 32, 18, 3, '#5a5d64'); R(186, 42, 14, 3, lampOn ? '#fff3c8' : '#3a3d44');
  if (lampOn) { cone(193, 44, 14, 150, 110, '255,210,140', 0.3); glow(193, 44, 26, '255,230,170', 0.5); for (let k = 0; k < 4; k++) { const a = u * 7 + k * 1.7; R(193 + Math.cos(a) * (8 + k * 3), 44 + Math.sin(a * 1.3) * 6, 2, 1, '#fff3c8'); } }
  // 하은 crossing under it; her shadow swings away from the lamp
  const hx = Math.round(lerp(-20, 404, u / 8)), stp = Math.floor(u / 0.18) % 2;
  if (lampOn) { const d = hx - 193, L = Math.min(60, 10 + Math.abs(d) * 0.5); g.fillStyle = 'rgba(0,0,0,.35)'; g.beginPath(); g.ellipse(hx + d * 0.5, 150, L, 3, 0, 0, Math.PI * 2); g.fill(); }
  drawHaeunAt(hx, 94 + (stp ? 0 : 1), 0, { step: stp, mirror: true }); R(hx - 10, 128, 12, 14, '#3a3f45');
  if (lampOn && Math.abs(hx - 193) < 60) { g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = `rgba(255,200,120,${0.25 * (1 - Math.abs(hx - 193) / 60)})`; g.fillRect(hx - 14, 88, 30, 62); g.restore(); }
  if (u >= 3.4) cue('buzz', () => { oscS('sawtooth', 120, now(), 0.025, 0.8); }); if (u >= 4.2) cue('lampoff', () => noiseS(now(), 'highpass', 4000, 0.05, 0.05));
  for (let k = 0; k < 24; k++) { const st = 0.2 + k * 0.36; if (u >= st) cue('lstep' + k, () => noiseS(now(), 'lowpass', 500, 0.05, 0.06)); }
  vignette(0.3); letterbox();
  fadeBlack(u < 0.5 ? 1 - u / 0.5 : u > 7.5 ? (u - 7.5) / 0.5 : 0);
}
// 5. the crossing: asphalt with its grain and worn stripes, the curbs with tactile paving, a car waiting at the line with its
//    headlights across the stripes, the green man blinking in time; the stripe under her step lights
function drawCross(u) {
  R(0, 0, W, H, '#33333a'); grain(0, 0, W, H, '#3c3c44', 0.1, 5); grain(0, 0, W, H, '#2a2a30', 0.06, 9);
  for (let k = 0; k < 9; k++) { const x = 40 + k * 36; R(x, 44, 20, 128, '#d9d4c6'); grain(x, 44, 20, 128, '#b8b3a6', 0.18, k); R(x, 44, 20, 2, '#e9e4d6'); }
  R(0, 0, W, 40, '#8a8a90'); R(0, 40, W, 4, '#6a6a70'); for (let x = 2; x < W; x += 6) R(x, 30, 2, 2, '#a0a0a8'); R(0, 176, W, 40, '#8a8a90'); R(0, 172, W, 4, '#6a6a70'); for (let x = 2; x < W; x += 6) R(x, 182, 2, 2, '#a0a0a8');
  R(0, 42, W, 1, '#f2d35a'); R(0, 173, W, 1, '#f2d35a');
  // the car waiting at the line, from above: roof, windscreen, headlights sweeping the stripes
  R(0, 60, 70, 100, '#2c3b57'); R(6, 64, 58, 92, '#3a4a6a'); R(10, 80, 50, 36, '#9fb8c8'); R(14, 120, 42, 22, '#2c3b57'); R(60, 66, 8, 12, '#fff3c8'); R(60, 142, 8, 12, '#fff3c8'); R(60, 80, 4, 8, '#ff8a3d'); R(60, 130, 4, 8, '#ff8a3d');
  g.save(); g.globalCompositeOperation = 'lighter'; const hl = g.createLinearGradient(68, 0, 300, 0); hl.addColorStop(0, 'rgba(255,240,200,.28)'); hl.addColorStop(1, 'rgba(255,240,200,0)'); g.fillStyle = hl; g.beginPath(); g.moveTo(68, 62); g.lineTo(300, 40); g.lineTo(300, 176); g.lineTo(68, 158); g.closePath(); g.fill(); g.restore();
  // the signal: a pixel green man blinking on the beat, the countdown
  const beat = 0.5, on = Math.floor(u / beat) % 2 === 0, late = u > 5.5;
  R(322, 4, 56, 32, '#1b1716'); R(324, 6, 52, 28, '#0f1a14'); const man = ['..x..', '.xxx.', 'x.x.x', '..x..', '.x.x.', 'x...x']; const vis = !late || on; man.forEach((row, j) => [...row].forEach((c, i) => { if (c === 'x') R(330 + i * 3, 9 + j * 3, 3, 3, vis ? '#8fd694' : '#143a1e'); })); text('' + Math.max(0, 9 - Math.floor(u)), 364, 12, '#ff8a3d', 10, 'center', true); if (vis) glow(336, 18, 18, '143,214,148', 0.3);
  // her step lights the stripe beneath it
  const hx = Math.round(lerp(10, 374, u / 8)), stepI = Math.floor(u / 0.36) % 2;
  const stripe = Math.round((hx - 50) / 36); if (stripe >= 0 && stripe < 9 && Math.abs(hx - (50 + stripe * 36)) < 12) { g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = 'rgba(255,233,168,.4)'; g.fillRect(40 + stripe * 36, 44, 20, 128); g.restore(); }
  g.fillStyle = 'rgba(0,0,0,.35)'; g.beginPath(); g.ellipse(hx + 2, 142, 12, 3, 0, 0, Math.PI * 2); g.fill();
  drawHaeunAt(hx, 84 + (stepI ? 0 : 1), 0, { step: stepI, mirror: true }); R(hx - 10, 118, 12, 14, '#3a3f45');
  for (let k = 0; k < 18; k++) { const st = k * beat; if (u >= st && (k % 2 === 0 || late)) cue('beep' + k, () => oscS('sine', late ? 1500 : 1200, now(), 0.04, 0.07)); }
  for (let k = 0; k < 24; k++) { const st = 0.1 + k * 0.36; if (u >= st) cue('cstep' + k, () => noiseS(now(), 'lowpass', 500, 0.05, 0.06)); }
  vignette(0.3); letterbox();
  fadeBlack(u < 0.4 ? 1 - u / 0.4 : u > 7.5 ? (u - 7.5) / 0.5 : 0);
}
// 6. the puddle: wet asphalt, the hospital front upside down in the water (windows, the cross, the lit entrance), her shoe
//    breaks it; the camera tilts up to the real building with its sliding doors glowing
function drawPuddle(u) {
  const tilt = clamp((u - 3.2) / 2, 0, 1);
  g.save(); g.translate(0, Math.round(ease(tilt) * 160));
  // above: the building front
  const sky = g.createLinearGradient(0, -160, 0, 0); sky.addColorStop(0, '#5a7aa8'); sky.addColorStop(1, '#d8c0b0'); g.fillStyle = sky; g.fillRect(0, -160, W, 160);
  R(90, -150, 204, 150, '#dfe6ea'); R(90, -150, 204, 4, '#b9c4c8'); for (let y = -136; y < -40; y += 16) for (let x = 100; x < 284; x += 16) { R(x, y, 10, 11, (x + y) % 3 ? '#2f3a4a' : '#ffe9a8'); R(x, y, 10, 1, '#9fb8c8'); }
  R(176, -150, 32, 90, '#dfe6ea'); R(186, -142, 12, 60, '#d8463b'); R(162, -118, 60, 12, '#d8463b'); glow(192, -112, 40, '216,70,59', 0.25);
  R(150, -40, 84, 40, '#9aa0a6'); R(154, -36, 76, 36, '#fff3c8'); R(191, -36, 2, 36, '#9aa0a6'); glow(192, -10, 60, '255,236,170', 0.3); R(140, -58, 104, 14, '#1b1716'); text('○○대학병원', 192, -56, '#ffffff', 8, 'center', true);
  // below: wet asphalt and the puddle
  R(0, 0, W, 216, '#2e2e34'); grain(0, 0, W, 216, '#3a3a42', 0.08, 2); R(0, 0, W, 2, '#6a6a70');
  g.fillStyle = '#1a2436'; g.beginPath(); g.ellipse(192, 112, 124, 50, 0, 0, Math.PI * 2); g.fill();
  g.save(); g.beginPath(); g.ellipse(192, 112, 124, 50, 0, 0, Math.PI * 2); g.clip();
  const wob = Math.sin(u * 3) * 2; g.globalAlpha = 0.55;
  R(120, 64, 144, 96, '#5a6a7a'); for (let y = 70; y < 150; y += 14) for (let x = 128 + wob, k = 0; x < 256; x += 14, k++) R(x, y, 8, 9, (k + y) % 3 ? '#3a4a5a' : '#ffe9a8');
  R(186 + wob, 70, 12, 50, '#d8463b'); R(168 + wob, 88, 48, 12, '#d8463b'); R(160, 150, 64, 10, '#fff3c8'); glow(192, 100, 50, '216,70,59', 0.2); g.globalAlpha = 1;
  const rip = t0 => { const a = u - t0; if (a < 0 || a > 1.4) return; g.strokeStyle = `rgba(200,225,255,${0.7 * (1 - a / 1.4)})`; g.lineWidth = 1; g.beginPath(); g.ellipse(192, 118, 6 + a * 70, (6 + a * 70) * 0.4, 0, 0, Math.PI * 2); g.stroke(); };
  rip(1.6); rip(2.4); g.restore();
  g.strokeStyle = 'rgba(120,140,170,.5)'; g.beginPath(); g.ellipse(192, 112, 124, 50, 0, 0, Math.PI * 2); g.stroke();
  // her shoe stepping in, with a splash
  if (u > 1.6 && u < 3.2) { const d = u - 1.6; R(174, 92 + Math.min(10, d * 30), 16, 22, '#1e1a1a'); R(172, 112, 20, 6, '#2b2e31'); R(174, 108, 16, 2, '#3a3f45'); if (d < 0.6) for (let k = 0; k < 8; k++) R(182 + Math.cos(k) * d * 40, 116 - Math.abs(Math.sin(k * 1.3)) * d * 30 + d * d * 60, 2, 2, '#cfe6ff'); }
  if (u >= 1.6) cue('splash', () => noiseS(now(), 'bandpass', 1400, 0.1, 0.18, 1));
  g.restore();
  vignette(0.3); letterbox();
  fadeBlack(u < 0.4 ? 1 - u / 0.4 : u > 5.5 ? (u - 5.5) / 0.5 : 0);
}
function drawDoctorAt(cx, top, nod) {
  R(cx - 5, top + 38, 5, 16, '#3a3f45'); R(cx + 2, top + 38, 5, 16, '#3a3f45'); R(cx - 6, top + 53, 6, 3, '#1e1a1a'); R(cx + 2, top + 53, 6, 3, '#1e1a1a');
  R(cx - 8, top + 16, 16, 24, '#f7f7f2'); R(cx - 3, top + 16, 6, 12, '#2b2e31'); R(cx - 8, top + 16, 2, 24, '#dfe6ea'); R(cx + 6, top + 16, 2, 24, '#dfe6ea');
  top += nod;
  R(cx - 6, top + 1, 12, 14, C.skin); R(cx - 7, top - 1, 14, 5, '#3a2a20'); R(cx - 7, top + 3, 2, 5, '#3a2a20');
  R(cx - 5, top + 6, 4, 3, '#1b1716'); R(cx + 1, top + 6, 4, 3, '#1b1716'); R(cx - 1, top + 7, 2, 1, '#1b1716'); R(cx - 4, top + 7, 2, 1, '#9fd0ff'); R(cx + 2, top + 7, 2, 1, '#9fd0ff');
  top -= nod;
  for (let k = 0; k < 10; k++) R(cx - 6 + (k < 5 ? 0 : 12), top + 16 + (k % 5) * 3, 1, 2, '#2b2e31'); R(cx - 6, top + 30, 13, 3, '#2b2e31'); R(cx + 5, top + 33, 3, 3, '#6a7075');
  thick(cx + 6, top + 22, cx + 14, top + 34, 4, '#f7f7f2'); R(cx + 11, top + 28, 10, 13, '#c9b48a'); R(cx + 12, top + 30, 8, 1, '#1b1716'); R(cx + 12, top + 33, 6, 1, '#1b1716'); R(cx + 12, top + 36, 7, 1, '#1b1716');
  thick(cx - 6, top + 22, cx - 10, top + 36, 4, '#f7f7f2'); R(cx - 12, top + 35, 4, 4, C.skin);
}
// 7. the corridor in one-point perspective: dark, the doctor far away; seven ceiling lamps come on toward her, one per count, the
//    seventh over him; then he says the line
function drawCorridor(u) {
  R(0, 0, W, H, '#0e1412');
  const vx = 192, vy = 92;
  const persp = (x, y, z) => ({ x: vx + (x - vx) / z, y: vy + (y - vy) / z });
  // floor, walls, ceiling converging
  g.fillStyle = '#1f2a26'; g.beginPath(); g.moveTo(0, 150); g.lineTo(W, 150); g.lineTo(vx + 20, vy + 8); g.lineTo(vx - 20, vy + 8); g.closePath(); g.fill();
  g.fillStyle = '#16201c'; g.beginPath(); g.moveTo(0, 30); g.lineTo(W, 30); g.lineTo(vx + 20, vy - 10); g.lineTo(vx - 20, vy - 10); g.closePath(); g.fill();
  for (const sgn of [-1, 1]) { g.fillStyle = '#1a2420'; g.beginPath(); g.moveTo(vx + sgn * 192, 30); g.lineTo(vx + sgn * 192, 150); g.lineTo(vx + sgn * 20, vy + 8); g.lineTo(vx + sgn * 20, vy - 10); g.closePath(); g.fill(); }
  // doors on both walls receding
  for (let k = 1; k <= 7; k++) { const z = 1 + k * 0.9; for (const sgn of [-1, 1]) { const a = persp(vx + sgn * 180, 60, z), b = persp(vx + sgn * 180, 150, z); R(Math.min(a.x, a.x + sgn * 10 / z), a.y, 10 / z + 1, b.y - a.y, '#2a3a34'); } }
  // the seven lamps, lit one per count from near to far
  const lit = clamp(Math.floor((u - 1.4) / 0.5) + 1, 0, 7);
  for (let k = 0; k < 7; k++) { const z = 1.2 + k * 0.75, p = persp(vx, 38, z), w = 40 / z, on = k < lit; R(p.x - w / 2, p.y, w, 3 / z + 1, on ? '#fff3c8' : '#2a3a34'); if (on) { g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createRadialGradient(p.x, p.y, 1, p.x, p.y + 30 / z, 60 / z); gr.addColorStop(0, `rgba(255,236,170,${k === 6 ? 0.35 : 0.2})`); gr.addColorStop(1, 'rgba(255,236,170,0)'); g.fillStyle = gr; g.fillRect(p.x - 80 / z, p.y, 160 / z, 120 / z); g.restore(); } if (k < lit) cue('lamp' + k, SND.heart); }
  // the doctor under the far lamp, walking closer once the lamps are on; 하은 near, her back to us (silhouette)
  const dz = u < 5 ? 5.2 : Math.max(1.6, 5.2 - (u - 5) * 1.4), dp = persp(vx + 12, 150, dz), dsc = 1 / dz;
  g.save(); g.translate(dp.x, dp.y); g.scale(dsc, dsc); drawDoctorAt(0, -56, (u % 1.2) < 0.2 ? 1 : 0); g.restore();
  silhouette(() => { drawHaeunAt(120, 80, 0, { load: true, bob: 0 }); R(126, 114, 12, 14, '#3a3f45'); }, 0.6);
  say(u, 7.4, 10.6, '어머님 박자가 오늘 좀 흔들려요. 옆에서 같이 맞춰 주세요.', 150, 44, 196, { size: 7 });
  say(u, 10.6, 11.8, '…네.', 100, 60, 26, { bg: '#d9d0bd' });
  letterbox();
  fadeBlack(u < 0.6 ? 1 - u / 0.6 : u > 11.4 ? (u - 11.4) / 0.6 : 0);
}
// 8. the hands: a close-up over the blanket; her mother's thin hand palm down, hers coming in over it; the monitor's green beats on
//    the skin, the oximeter clip glows red
function drawHands(u) {
  R(0, 0, W, H, '#142028'); R(0, 70, W, 146, '#b9cde0'); for (let y = 74; y < 216; y += 8) R(0, y, W, 1, '#a9bdd0'); for (let x = 0; x < W; x += 12) R(x, 70, 1, 146, '#b0c4d6');
  R(0, 60, W, 12, '#f5f1ea'); R(0, 68, W, 4, '#dfe6ea');
  const pulse = Math.max(0, 1 - ((u * 1.0) % 1) * 3);
  // mother's hand, palm down, fingers to the right, the clip on the index finger, the IV tape on the back
  R(40, 104, 84, 24, '#f5f1ea'); R(40, 112, 84, 2, '#9fb8c8'); R(118, 104, 6, 24, '#e0d8c8');
  hand(120, 112, '#dcb393', true, null); R(172, 110, 12, 8, '#dfe6ea'); R(176, 112, 4, 3, '#ff4a3d'); R(184, 113, 60, 1, '#dfe6ea'); R(130, 104, 14, 8, '#efe6d2'); R(132, 106, 10, 1, '#9fb8c8');
  // her hand coming in from the right and settling over it, the watch on the wrist, the black cuff
  const p = ease(clamp((u - 1.5) / 2.5, 0, 1)), hx = Math.round(lerp(330, 156, p)), hy = Math.round(lerp(46, 98, p));
  g.save(); g.translate(2 * hx, 0); g.scale(-1, 1); hand(hx, hy, '#e0b48e', false, '#1e1a1a'); g.restore();
  R(hx + 6, hy + 4, 10, 10, '#c9ccd2'); R(hx + 7, hy + 5, 8, 8, '#1b1716'); R(hx + 9, hy + 8, 4, 1, '#8fd694'); R(hx + 4, hy + 2, 2, 14, '#2b2e31');
  if (p >= 1) { const sq = (u * 1.0) % 1 < 0.15 ? 1 : 0; if (sq) R(hx - 34, hy + 18, 70, 1, '#c9a080'); }
  g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = `rgba(143,214,148,${0.06 + 0.12 * pulse})`; g.fillRect(0, 0, W, H); g.restore();
  glow(178, 114, 14, '255,74,61', 0.4 + 0.3 * pulse);
  for (let k = 0; k < 10; k++) if (u >= k) cue('hb-close' + k, () => { SND.heart(); });
  say(u, 4.6, 7, '…밥은 먹었니.', 40, 36, 56, { bg: '#f2ead6', size: 6 });
  say(u, 6.2, 8, '회식. 공짜.', 270, 48, 48, { bg: '#d9d0bd', size: 6 });
  vignette(0.35); letterbox();
  fadeBlack(u < 0.6 ? 1 - u / 0.6 : u > 7.4 ? (u - 7.4) / 0.6 : 0);
}
// 10. the last insert: the bedside table in morning light through the blinds; the bill, her watch set down, a paper cup of tea
//     steaming, her cap beside it
function drawTable(u) {
  R(0, 0, W, H, '#e8ede6'); for (let y = 0; y < 120; y += 14) R(0, y, W, 6, 'rgba(255,226,176,.35)');
  R(0, 118, W, 98, '#b8a98e'); for (let y = 122; y < 216; y += 7) R(0, y, W, 1, 'rgba(120,96,70,.25)'); grain(0, 118, W, 98, '#a9997e', 0.08, 4); R(0, 118, W, 3, '#d9cbb0');
  for (let y = 118; y < 216; y += 14) R(0, y, W, 6, 'rgba(255,226,176,.25)');
  // the bill
  g.save(); g.translate(120, 100); g.rotate(-0.06); R(-60, -34, 120, 68, '#f7f1e2'); R(-60, -34, 120, 1, '#e0d8c8'); R(-52, -26, 14, 10, '#2f8a5a'); R(-34, -24, 50, 3, '#8a8a8a'); R(-34, -18, 30, 2, '#8a8a8a'); R(-52, -8, 100, 1, '#c9c2b0'); text('입원비 납부 안내', 0, -4, '#1b1716', 7, 'center', true); text('2,140,000원', 0, 8, '#d8463b', 8, 'center', true); R(-52, 22, 60, 2, '#8a8a8a'); R(-52, 26, 40, 2, '#8a8a8a'); g.restore();
  // the watch, face up, strap open
  R(214, 96, 20, 10, '#2b2e31'); R(296, 96, 20, 10, '#2b2e31'); R(232, 88, 66, 26, '#c9ccd2'); R(236, 92, 58, 18, '#1b1716'); text('06:10', 265, 95, '#8fd694', 9, 'center', true); R(232, 88, 66, 1, '#eef0f2');
  // the tea, steaming
  R(330, 70, 34, 44, '#f7f1e2'); R(330, 70, 34, 3, '#e0d8c8'); R(334, 74, 26, 6, '#8fb0a0'); for (let k = 0; k < 3; k++) { const ph = (u * 0.5 + k * 0.33) % 1; g.fillStyle = `rgba(255,255,255,${0.35 * (1 - ph)})`; g.beginPath(); g.ellipse(347 + Math.sin(ph * 6 + k) * 5, 66 - ph * 40, 4, 8, 0, 0, Math.PI * 2); g.fill(); }
  // her cap, set down
  R(30, 100, 36, 12, '#d8463b'); R(34, 96, 28, 6, '#d8463b'); R(28, 110, 24, 4, '#1e1a1a'); R(40, 98, 10, 4, '#ffffff');
  g.fillStyle = 'rgba(0,0,0,.18)'; for (const [x, y, w] of [[62, 134, 120], [214, 108, 100], [330, 116, 34], [30, 114, 36]]) { g.beginPath(); g.ellipse(x + w / 2, y, w / 2 + 4, 4, 0, 0, Math.PI * 2); g.fill(); }
  letterbox();
  if (u > 7) { const a = clamp((u - 7) / 1.5, 0, 1); fadeBlack(a); text('— 스테이지 1 끝 —', W / 2, 100, `rgba(239,230,210,${a})`, 10, 'center'); }
  fadeBlack(u < 0.6 ? 1 - u / 0.6 : 0);
}
// ---------- 6·7. 병실 ----------
function drawWard(u, dawnK, playing) {
  const wall = mix('#b9c9bd', '#dfe8dc', dawnK), floor = mix('#9aa89e', '#cfd4cf', dawnK);
  R(0, 0, W, H, wall); R(0, 150, W, 66, floor); R(0, 150, W, 2, '#7a8a7e'); R(0, 96, W, 2, mix('#9fb0a3', '#c9d6c8', dawnK));
  R(290, 20, 80, 90, '#2b2b2b'); const sky = g.createLinearGradient(0, 24, 0, 106); sky.addColorStop(0, mix('#0e1a33', '#9ec5e8', dawnK)); sky.addColorStop(0.7, mix('#2a3858', '#d8e6f0', dawnK)); sky.addColorStop(1, mix('#c97a4a', '#ffe2b0', dawnK));
  g.fillStyle = sky; g.fillRect(294, 24, 72, 82); R(329, 24, 2, 82, '#2b2b2b'); R(294, 64, 72, 2, '#2b2b2b'); for (let k = 0; k < 5; k++) R(298 + k * 13, 86 + (k % 2) * 6, 8, 20, mix('#1a2238', '#8fb0c8', dawnK));
  // heartbeat: period eases from 58 to 64 bpm across the scene; spikes flow to the gate at x=238
  const bpm0 = 58, bpm1 = 64, k = clamp(u / 18, 0, 1), bpm = lerp(bpm0, bpm1, k), per = 60 / bpm, pxPerBeat = 14;
  const beatNo = Math.floor(u / per), ph = (u / per) % 1;
  const squeeze = playing && beatNo % 4 === 0 && ph < 0.3 ? 1 : 0;
  // the other bed, behind a curtain, someone asleep
  R(268, 100, 2, 50, '#9aa0a6'); R(270, 96, 100, 4, '#9aa0a6'); for (let x = 272; x < 290; x += 6) R(x, 100, 4, 50, mix('#cfe0f0', '#dfe8f0', dawnK)); R(292, 118, 80, 30, '#e9eef0'); R(300, 110, 20, 14, '#f5f1ea'); R(304, 114, 12, 10, '#d9b59a'); R(302, 112, 16, 3, '#1e1a1a'); R(296, 124, 76, 22, mix('#b9cde0', '#cfe0f0', dawnK));
  drawHaeunAt(130, 94, 0, { load: true, mirror: true });
  R(60, 118, 200, 36, '#e9eef0'); R(60, 118, 200, 3, '#c9d2d6'); R(56, 110, 8, 50, '#9aa0a6'); R(256, 110, 8, 50, '#9aa0a6');
  R(66, 122, 190, 28, mix('#b9cde0', '#cfe0f0', dawnK)); for (let x = 70; x < 250; x += 18) R(x, 134, 12, 1, mix('#a0b4c8', '#b9cde0', dawnK));
  const breath = Math.round(Math.sin(u * 1.2) * 1);
  R(76, 104, 28, 18, '#f5f1ea'); R(82, 108 + breath, 18, 14, '#d9b59a'); R(80, 106 + breath, 22, 4, '#8a8a8a'); R(84, 115 + breath, 12, 6, '#dfe6ea'); R(84, 115 + breath, 12, 1, '#b9c4c8'); R(100, 117 + breath, 10, 1, '#dfe6ea');
  R(240, 60, 2, 60, '#9aa0a6'); R(236, 118, 10, 2, '#9aa0a6'); R(236, 56, 10, 22, '#dfe6ea'); R(238, 58, 6, 14, '#bfe3d2'); R(241, 78, 1, 42, '#dfe6ea');
  const mon = 1 - dawnK * 0.7;
  R(140, 30, 110, 46, '#1b1716'); R(143, 33, 104, 40, mix('#06140c', '#0a1a10', dawnK)); g.globalAlpha = mon; text(String(Math.round(bpm)), 244, 35, '#8fd694', 8, 'right'); text('SpO₂ 9' + (k > 0.6 ? 4 : 1), 147, 35, '#5ad7e8', 6);
  g.save(); g.beginPath(); g.rect(146, 36, 98, 34); g.clip();
  for (let j = beatNo - 1; j <= beatNo + 8; j++) { const x = 238 + (u - j * per) * (pxPerBeat / per); if (x < 140 || x > 250) continue; const seventh = ((j % 4) + 4) % 4 === 0; const c = seventh ? '#ffffff' : '#8fd694'; for (let d = -7; d <= 6; d++) { const xx = Math.round(x + d); const y = d === 0 ? 50 : d === 1 ? 60 : d === 2 ? 55 : 58; R(xx, y, 1, 1, c); } }
  g.restore(); g.globalAlpha = 1;
  R(238, 36, 1, 38, `rgba(255,74,61,${0.6 * mon})`);
  R(140, 76, 110, 4, '#2b2e31'); R(193, 80, 4, 30, '#2b2e31');
  thick(135, 117, 112 - squeeze, 126, 4, '#1e1a1a'); R(108 - squeeze, 124, 6, 4, '#d9b59a'); R(104, 123, 4, 6, '#d9b59a');
  R(16, 126, 34, 24, '#c9bfae'); R(16, 126, 34, 2, '#e0d8c8'); R(20, 118, 20, 9, '#f7f1e2'); R(23, 120, 14, 1, '#8a8a8a'); R(23, 123, 10, 1, '#8a8a8a'); text('납부', 24, 124, '#d8463b', 4); R(42, 122, 6, 4, '#d8dde0');
  if (dawnK < 1) { g.fillStyle = `rgba(10,20,30,${0.28 * (1 - dawnK)})`; g.fillRect(0, 0, W, H); g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createRadialGradient(195, 55, 4, 195, 55, 90); gr.addColorStop(0, `rgba(143,214,148,${(0.16 + 0.1 * (ph < 0.15 ? 1 : 0)) * mon})`); gr.addColorStop(1, 'rgba(143,214,148,0)'); g.fillStyle = gr; g.fillRect(90, 0, 220, 150); g.restore(); }
  if (dawnK > 0) { g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createLinearGradient(366, 0, 200, 0); gr.addColorStop(0, `rgba(255,226,176,${0.4 * dawnK})`); gr.addColorStop(1, 'rgba(255,226,176,0)'); g.fillStyle = gr; g.fillRect(160, 0, 220, 216); g.restore(); }
  if (playing) {
    for (let j = 0; j <= beatNo; j++) cue('hb' + j, () => { SND.heart(); if (j % 4 === 0) SND.beep(); });
    const lastHit = Math.floor(beatNo / 4) * 4, age = u - lastHit * per; if (age < 0.6) judge('·', 238, 20, '#ffffff', 14, '', age);
    if (u > 12 && u < 14.6) drawHaeunAt(130, 94, 0, { load: true, mirror: true, watch: true });
  }
}

// ---------- 타임라인 ----------
let TL = [], TOTAL = 0;
function buildTL() {
  TL = [
    { id: 'open', name: '벨트', dur: 22.5, draw: u => drawOpening(u) },
    { id: 'cut', name: '매치 컷', dur: 2, draw: u => { drawSushi(0, 1); const o = offC || (offC = Object.assign(document.createElement('canvas'), { width: W, height: H })); const oc = o.getContext('2d'); oc.clearRect(0, 0, W, H); const g0 = g; g = oc; drawOpening(22.5); g = g0; g.save(); g.globalAlpha = 1 - ease(u / 2); g.drawImage(o, 0, 0); g.restore(); if (u < 0.1) cue('cut-roller', () => rollerOn(true, 0.04)); } },
    { id: 'sushi1', name: '초밥', dur: 18, draw: u => { drawSushi(u, 1); fadeBlack(0); } },
    { id: 'sushi2', name: '소주잔', dur: 18, draw: u => { const lv = drawSushi(u, 2); drunkFx(lv, u, () => { haeunBeside({ eat: (u % 1.4) < 0.7 ? (u % 1.4) / 0.7 : 1 - ((u % 1.4) - 0.7) / 0.7 }); plateStack(362, 172, 10 + Math.min(6, Math.floor(u / 2.5))); }); fadeBlack(u > 16.6 ? (u - 16.6) / 1.4 : 0); if (u > 16.6) cue('sushi-off', () => rollerOn(false)); } },
    { id: 'train', name: '창', dur: 10, draw: u => drawTrainClose(u) },
    { id: 'door', name: '문', dur: 10, draw: u => drawDoorOut(u) },
    { id: 'stairs', name: '계단', dur: 6, draw: u => drawStairs(u) },
    { id: 'lamp', name: '가로등', dur: 8, draw: u => drawLamp(u) },
    { id: 'cross', name: '횡단보도', dur: 8, draw: u => drawCross(u) },
    { id: 'puddle', name: '웅덩이', dur: 6, draw: u => drawPuddle(u) },
    { id: 'corridor', name: '복도', dur: 12, draw: u => drawCorridor(u) },
    { id: 'hands', name: '손', dur: 8, draw: u => drawHands(u) },
    { id: 'ward', name: '병실', dur: 14, draw: u => { drawWard(u + 5, 0, true); letterbox(); fadeBlack(u < 0.5 ? 1 - u / 0.5 : 0); } },
    { id: 'end', name: '새벽', dur: 10, draw: u => { drawWard(19 + u, clamp(u / 7, 0, 1), false); letterbox(); fadeBlack(u > 9.3 ? (u - 9.3) / 0.7 : 0); if (u >= 0.2) cue('end-bird', () => { [2600, 3100, 2800].forEach((f, i) => oscS('sine', f, now() + 1 + i * 0.12, 0.03, 0.12, f * 1.2)); }); } },
    { id: 'table', name: '탁자', dur: 9, draw: u => drawTable(u) }
  ];
  TOTAL = TL.reduce((a, s) => a + s.dur, 0);
}
buildTL();
function sceneAt(t) { let acc = 0; for (const s of TL) { if (t < acc + s.dur) return { s, u: t - acc, start: acc }; acc += s.dur; } const s = TL[TL.length - 1]; return { s, u: s.dur, start: TOTAL - s.dur }; }
let T = 0, playing = false, lastNow = 0, speed = 1;
const cv = document.getElementById('cv'); g = cv.getContext('2d'); g.imageSmoothingEnabled = false;
const seekEl = document.getElementById('seek'), lbl = document.getElementById('lbl');
function seek(t) { T = clamp(t, 0, TOTAL); fired.clear(); rollerOn(false); }
function frame(now) {
  requestAnimationFrame(frame);
  if (playing) { T += Math.min(0.1, (now - lastNow) / 1000) * speed; if (T >= TOTAL) { T = TOTAL; playing = false; rollerOn(false); document.getElementById('play').textContent = '▶ 재생'; } }
  lastNow = now;
  const { s, u } = sceneAt(T);
  g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W, H);
  try { s.draw(u, s.dur); } catch (e) { text(String(e), 4, 4, '#ff4a3d', 7); }
  seekEl.value = T; lbl.textContent = `${s.name} · ${u.toFixed(1)}s / ${T.toFixed(0)}s`;
}
requestAnimationFrame(frame);
seekEl.max = TOTAL; seekEl.addEventListener('input', () => seek(+seekEl.value));
document.getElementById('play').addEventListener('click', () => { audioOn(); if (ac && ac.state === 'suspended') ac.resume(); playing = !playing; if (T >= TOTAL) seek(0); document.getElementById('play').textContent = playing ? '❚❚ 일시정지' : '▶ 재생'; if (!playing) rollerOn(false); });
document.getElementById('speed').addEventListener('change', e => { speed = +e.target.value; });
const jumps = document.getElementById('jumps');
function buildJumps() { jumps.innerHTML = ''; let acc = 0; for (const s of TL) { const b = document.createElement('button'); b.textContent = s.name; const at = acc; b.addEventListener('click', () => { audioOn(); seek(at); }); jumps.append(b); acc += s.dur; } seekEl.max = TOTAL; }
buildJumps();
