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
  if (!opts.loud) { R(x - 1, y - 1, w + 2, h + 2, '#1b1716'); R(x, y + h, 5, 3, '#1b1716'); R(x + 1, y + h + 3, 3, 1, '#1b1716'); }
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
// 하은 standing on the floor: beside him at the belt, or at the counter between the belts in the sushi bar. eat: 0..1 chopsticks
// to the mouth; reach: 0..1 her hand down to the near belt for a plate
function haeunAt(cx, top, o = {}) {
  drawHaeunAt(cx, top, 0, { load: true, bob: 0, watch: o.watch });
  if (o.reach > 0) { const hx = cx - 8 - Math.round(o.reach * 6), hy = top + 26 + Math.round(o.reach * 20); thick(cx - 6, top + 22, hx, hy, 3, '#1e1a1a'); R(hx - 2, hy - 1, 4, 3, '#d9a27a'); }
  else if (o.eat != null) { const k = o.eat, hx = cx - 9, hy = top + 30 - Math.round(k * 17); thick(cx - 6, top + 22, hx, hy, 3, '#1e1a1a'); R(hx - 2, hy - 1, 3, 3, '#d9a27a'); R(hx - 4, hy - 6, 1, 7, '#efe6d2'); R(hx - 2, hy - 6, 1, 7, '#efe6d2'); if (k < 0.5) R(hx - 5, hy - 7, 5, 2, '#f08a5d'); }
}
const PLATE = { red: ['#d8463b', '1,500'], blue: ['#2f6f8a', '2,500'], gold: ['#d9a520', '4,000'], black: ['#2b2e31', '6,000'] };
function sushiPlate(x, y, col, kind = 0, sc = 1) {
  g.save(); g.translate(x, y); g.scale(sc, sc);
  R(-9, -2, 18, 2, '#efe6d2'); R(-10, -3, 20, 1, PLATE[col][0]); R(-8, -4, 16, 1, '#f7f1e2'); R(-6, -7, 12, 3, '#f7f1e2'); R(-5, -8, 10, 1, '#f7f1e2');
  const fish = ['#f08a5d', '#e04a3a', '#f3d5a0', '#c9c9c9'][kind]; R(-7, -10, 14, 3, fish); if (kind === 1) R(-7, -10, 14, 1, '#f7c0b0'); if (kind === 3) R(-6, -11, 12, 1, '#1e2a1a');
  g.restore();
}
function sojuGlass(x, y, sc = 1, fill = 0.7) { g.save(); g.translate(x, y); g.scale(sc, sc); R(-5, -11, 11, 12, 'rgba(40,50,60,.55)'); R(-4, -10, 9, 10, 'rgba(230,240,245,.5)'); R(-4, -10, 9, 1, '#f4fbff'); R(-4, -10, 1, 10, '#f4fbff'); R(4, -10, 1, 10, '#f4fbff'); R(-3, -Math.round(9 * fill), 7, Math.round(9 * fill), 'rgba(255,255,255,.7)'); R(-2, -9, 1, 4, 'rgba(255,255,255,.9)'); g.restore(); }
const soju = (x, y) => { R(x, y - 14, 5, 14, '#bfe3d2'); R(x + 1, y - 18, 3, 5, '#bfe3d2'); R(x + 1, y - 19, 3, 1, '#2f6f4a'); R(x, y - 10, 5, 1, 'rgba(255,255,255,.35)'); };
function plateStack(x, base, n) { for (let k = 0; k < n; k++) { const c = ['red', 'blue', 'red', 'gold', 'red', 'blue'][k % 6]; R(x - 9, base - k * 3 - 2, 18, 2, '#efe6d2'); R(x - 10, base - k * 3 - 3, 20, 1, PLATE[c][0]); } }

// ---------- 소리 ----------
let ac = null, master = null, roller = null;
// sound is off in this animatic for now (the cues stay in the code; set SOUND = true to hear them)
const SOUND = false;
function audioOn() { if (ac || !SOUND) return; try { ac = new (window.AudioContext || window.webkitAudioContext)(); master = ac.createGain(); master.gain.value = 0.6; master.connect(ac.destination); } catch (e) { ac = null; } }
const nbufOf = () => { const b = ac.createBuffer(1, ac.sampleRate, ac.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; return b; };
let NB = null;
let silent = false;
function noiseS(t, type, f, peak, dec, q = 0.7) { if (!ac || silent) return; NB = NB || nbufOf(); const s = ac.createBufferSource(), fl = ac.createBiquadFilter(), gn = ac.createGain(); s.buffer = NB; fl.type = type; fl.frequency.value = f; fl.Q.value = q; gn.gain.setValueAtTime(0.0001, t); gn.gain.linearRampToValueAtTime(peak, t + 0.003); gn.gain.exponentialRampToValueAtTime(0.0001, t + dec); s.connect(fl); fl.connect(gn); gn.connect(master); s.start(t, Math.random() * 0.5); s.stop(t + dec + 0.05); }
function oscS(type, f, t, peak, dec, f2 = null) { if (!ac || silent) return; const o = ac.createOscillator(), gn = ac.createGain(); o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dec * 0.6); gn.gain.setValueAtTime(0.0001, t); gn.gain.linearRampToValueAtTime(peak, t + 0.004); gn.gain.exponentialRampToValueAtTime(0.0001, t + dec); o.connect(gn); gn.connect(master); o.start(t); o.stop(t + dec + 0.05); return o; }
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
const now = () => ac ? ac.currentTime : 0;
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
const OPEN_DUR = 25.2;
function drawOpening(u) {
  warehouse();
  const spb = 60 / OPEN.bpm, jumpAt = OPEN.boxes[OPEN.boxes.length - 1] + 0.9, bIn = jumpAt + 2.8, bArr = bIn + 2.4;
  const shake = u > jumpAt && u < jumpAt + 0.5 ? 3 * (1 - (u - jumpAt) / 0.5) : 0;
  g.save(); if (shake) g.translate(Math.round((Math.random() * 2 - 1) * shake), Math.round((Math.random() * 2 - 1) * shake));
  // 지우: placing; jumping; caught out when 반장 shouts; cheering again once the 회식 is called
  let jPose, jExtra = null;
  const armsUp = top => { thick(BOSS_X + 5, top + 23, BOSS_X + 14, top + 2, 4, '#6b2f3f'); R(BOSS_X + 13, top - 2, 5, 5, C.skin); thick(BOSS_X - 7, top + 23, BOSS_X - 16, top + 4, 4, '#6b2f3f'); R(BOSS_X - 19, top, 5, 5, C.skin); };
  if (u < jumpAt) {
    const placing = OPEN.boxes.find(b => Math.abs(u - (b - (SCAN_X - PLACE_X) / OPEN.speed)) < 0.3);
    const p = placing ? (u - (placing - (SCAN_X - PLACE_X) / OPEN.speed) + 0.3) / 0.6 : 0;
    jPose = { hand: placing ? { x: lerp(BOSS_X + 13, PLACE_X - 8, Math.sin(Math.PI * p)), y: lerp(134, 140, Math.sin(Math.PI * p)) } : { x: BOSS_X + 13, y: 134 }, bob: (u % spb) < spb * 0.3 ? 1 : 0, unplug: false };
  } else if (u < bArr) {
    const j = u - jumpAt, air = j < 0.7 ? -Math.round(14 * Math.sin(Math.PI * j / 0.7)) : -Math.round(3 * Math.abs(Math.sin(j * 4)));
    jPose = { bob: air, vibe: true, noArm: true }; jExtra = armsUp;
  } else if (u < bArr + 6.0) jPose = { wince: u < bArr + 1.9, unplug: true };
  else { const j = u - bArr - 6.0; jPose = { bob: -Math.round(4 * Math.abs(Math.sin(j * 5))), vibe: true, noArm: true }; jExtra = armsUp; }
  actor('jiwoo', 46, jPose, false, jExtra);
  if (u >= jumpAt) { const j = u - jumpAt, fy = Math.min(150, 128 + j * j * 400); g.save(); g.translate(28, fy); g.rotate(-0.3 * Math.min(1, j * 2)); boxS(0, 0); g.restore(); }
  // 반장 walks in behind the belt from the right, points, goes quiet, folds his arms, nods once
  if (u >= bIn) {
    const p = clamp((u - bIn) / (bArr - bIn), 0, 1), x = lerp(410, 150, lerp(p, ease(p), 0.5)), walking = p < 1, bob = walking && Math.floor(u / 0.19) % 2 === 0 ? 1 : 0;
    const fold = u > bArr + 4.2;
    actor('boss', x, { bob, noArm: true, nod: fold && Math.floor((u - bArr - 4.2) / 0.5) === 1 ? 1 : 0 }, true, top => {
      if (!fold) { R(BOSS_X + 2, top + 6, 5, 1, C.hair); R(BOSS_X + 1, top + 5, 2, 1, C.hair); if (!walking) R(BOSS_X - 8, top + 4, 2, 3, C.sweat); }
      if (walking) { thick(BOSS_X + 7, top + 22, BOSS_X + 9 + bob * 2, top + 40, 4, C.shirt); R(BOSS_X + 8, top + 39, 4, 4, C.skin); }
      else if (!fold) { thick(BOSS_X + 7, top + 22, BOSS_X + 28, top + 14, 4, C.shirt); R(BOSS_X + 27, top + 11, 5, 5, C.skin); }
      else { R(BOSS_X - 9, top + 25, 18, 5, C.shirt); R(BOSS_X - 9, top + 26, 3, 3, C.skin); R(BOSS_X + 6, top + 26, 3, 3, C.skin); }
    });
    if (walking) { for (let k = 0; k < 20; k++) { const st = bIn + 0.3 + k * 0.38; if (u >= st && st < bArr) cue('step' + k, () => noiseS(now(), 'lowpass', 420, 0.12, 0.07)); } }
  }
  // belt and boxes: each box i arrives at the gate at OPEN.boxes[i]; the player takes it there
  const off = u * OPEN.speed; beltAt(BELT_Y, 48, 1, off);
  let kick = 0, lastHit = -9;
  for (const b of OPEN.boxes) { const x = SCAN_X + (u - b) * OPEN.speed; if (x < PLACE_X - 8 || x > W + 10) continue; const done = u >= b; boxS(x - (done ? Math.min(6, (u - b) * 40) : 0), BELT_Y, 18, 14, done); if (done) { kick = Math.max(kick, clamp(1 - (u - b) / 0.14, 0, 1)); lastHit = Math.max(lastHit, b); } }
  for (const b of OPEN.boxes) if (u >= b) cue('open-hit' + b, SND.tick);
  for (const b of OPEN.boxes) { const pl = b - (SCAN_X - PLACE_X) / OPEN.speed; if (u >= pl) cue('open-place' + b, SND.thud); }
  gate(SCAN_X, BELT_Y, 38, true, kick);
  // 하은 on the floor beside him; her first look at the watch comes after she has her answer
  haeunAt(368, 94, { watch: u > bArr + 9.0 });
  playerS(kick);
  if (u - lastHit < 0.55 && u >= lastHit) judge('딱!', 300, 84, '#8fd694', 14, '', u - lastHit);
  g.restore();
  // lines
  say(u, jumpAt + 0.2, jumpAt + 2.8, '붙었어요!!!!', 56, 44, 78, { loud: true, size: 10, h: 18, shake: u < jumpAt + 1 ? 2 : 0 });
  if (u > jumpAt + 0.2 && u < jumpAt + 2.8) for (let k = 0; k < 4; k++) text('♪', 70 + k * 14, 70 + (k % 2) * 8 - ((u * 20 + k * 7) % 14), k % 2 ? '#f2a6c8' : '#5ad7e8', 9);
  say(u, jumpAt + 1.2, jumpAt + 2.6, '…?', 352, 70, 18, { bg: '#d9d0bd' });
  say(u, bArr, bArr + 1.8, '…야! 벨트가 왜 비어!', 112, 62, 92, { loud: true, size: 8, h: 15, shake: u < bArr + 0.4 ? 2 : 0 });
  say(u, bArr + 1.9, bArr + 4.2, '반장님! 저 붙었어요! 반장님 기타 넣은 곡으로요!', 4, 28, 184, { size: 7 });
  say(u, bArr + 4.9, bArr + 6.7, '…회식이다. 오늘. 다 와.', 100, 56, 96, { size: 8, h: 15 });
  say(u, bArr + 6.4, bArr + 8.3, '저도요? …밥은 공짜죠?', 286, 70, 92, { bg: '#d9d0bd' });
  say(u, bArr + 8.3, bArr + 9.8, '공짜다.', 120, 58, 36, { size: 8, h: 15 });
  hud(u < jumpAt ? '3번 라인 · 04:10' : u < bArr ? '3번 라인 · 04:11' : '3번 라인 · 04:12', u < jumpAt + 0.5 ? '콤보 ' + OPEN.boxes.filter(b => u >= b).length : '');
  if (u > jumpAt + 1.5 && u < bIn) text('(벨트는 돌지만 상자가 안 온다. 롤러 소리만.)', 60, 190, `rgba(239,230,210,${0.75 * clamp((u - jumpAt - 1.5) / 0.6, 0, 1)})`, 7);
  cue('open-roller', () => rollerOn(true, 0.05));
}

// ---------- 1·2. 회전초밥집 ----------
const LANES = [{ y: 110, k: 0.7 }, { y: 128, k: 0.85 }, { y: 146, k: 1 }];
const laneX = (x, k) => SCAN_X + k * (x - SCAN_X);
const SUSHI = { bpm: 100, speed: 70, fly: 0.5, landX: 130 };
// one item per throw: thrown at t, flies 0.5 s to lane L at x=130 (lane coords), then rides to the gate
function throwsFor(phase) {
  const spb = 60 / SUSHI.bpm, pat = [2, 0, 1, 2, 1, 0, 2, 2, 0, 1, 2, 0, 1, 2, 1, 2, 0, 2, 1, 2];
  const list = []; for (let i = 0; i < 20; i++) list.push({ t: 1 + i * spb * 1.0, lane: pat[i], col: ['red', 'blue', 'red', 'gold', 'red'][i % 5], kind: i % 4, who: (i % 4 === 3) ? 'haeun' : 'player' }); for (const it of list) if (it.who === 'haeun') it.lane = 2;
  // a triple at the end: three at once on all belts
  const t3 = 1 + 21 * spb; for (let l = 0; l < 3; l++) list.push({ t: t3, lane: l, col: 'red', kind: l, who: 'player', triple: true });
  return list;
}
const THROWS = [throwsFor(1), throwsFor(2)];
function itemArrive(it) { return it.t + SUSHI.fly + (SCAN_X - SUSHI.landX) / SUSHI.speed; }
const HAEUN_SX = 258;   // where 하은 takes her plates off the near belt, before they reach the gate
function haeunState(u, items) {
  let n = 0, reach = 0;
  for (const it of items) { if (it.who !== 'haeun') continue; const at = it.t + SUSHI.fly + (HAEUN_SX - SUSHI.landX) / SUSHI.speed; if (u >= at) n++; if (u > at - 0.3 && u < at + 0.25) reach = Math.max(reach, Math.sin(Math.PI * clamp((u - at + 0.3) / 0.55, 0, 1))); }
  const eat = (u % 1.4) < 0.7 ? (u % 1.4) / 0.7 : 1 - ((u % 1.4) - 0.7) / 0.7;
  return { n, reach, eat };
}
function drawHaeunCounter(u, phase, items) {
  const st = haeunState(u, items), stack = phase === 1 ? 2 + st.n : 7 + st.n + Math.min(2, Math.floor(u / 7));
  g.save(); g.beginPath(); g.rect(0, 0, W, LANES[2].y); g.clip(); haeunAt(262, 88, { reach: st.reach, eat: st.eat }); g.restore();
  plateStack(262, 172, stack);
}
function drawSushi(u, phase) {
  const drunk = phase === 2, spb = 60 / SUSHI.bpm, level = drunk ? clamp(u / 16 * 3, 0, 3) : 0;
  sushiRoom();
  // 지우 behind the far belt
  actor('jiwoo', 170, { hand: { x: 186, y: 104 }, wince: !drunk, bob: drunk ? -Math.round(2 * Math.abs(Math.sin(u * 5))) : ((u % spb) < spb * 0.3 ? 1 : 0), unplug: true, dip: -14 }, false, top => { if (drunk) sojuGlass(186, 102); });
  const items = THROWS[phase - 1];
  let lastPick = -9, lastTriple = -9, kick = 0;
  // belts far to near with their items; 하은 stands between the middle belt and the near one
  const lane = li => {
    const L = LANES[li]; beltAt(L.y, Math.round(laneX(48, L.k)), 0.75 + li * 0.125, u * SUSHI.speed * L.k);
    for (const it of items) {
      if (it.lane !== li || u < it.t) continue;
      const arr = itemArrive(it), plate = !drunk || it.who === 'haeun';
      let sx, sy, sc = L.k;
      if (u < it.t + SUSHI.fly) { const p = (u - it.t) / SUSHI.fly, x0 = 80, y0 = 86, x1 = laneX(SUSHI.landX, L.k), y1 = L.y; sx = lerp(x0, x1, p); sy = lerp(y0, y1, p) - Math.sin(Math.PI * p) * (30 + it.lane * 8); sc = lerp(0.9, L.k, p); if (u > it.t + SUSHI.fly - 0.05) cue('land' + phase + it.t + it.lane, SND.thud); }
      else {
        const lx = SUSHI.landX + (u - it.t - SUSHI.fly) * SUSHI.speed; sx = laneX(lx, L.k); sy = L.y;
        if (it.who === 'player' && u >= arr) { if (it.triple) lastTriple = Math.max(lastTriple, arr); else lastPick = Math.max(lastPick, arr); kick = Math.max(kick, clamp(1 - (u - arr) / 0.14, 0, 1)); cue('pick' + phase + it.t + it.lane, drunk ? SND.clink : SND.pick); continue; }
        if (it.who === 'haeun' && sx >= HAEUN_SX) { cue('haeun' + phase + it.t, SND.pick); continue; }
      }
      if (plate) sushiPlate(sx, sy, it.col, it.kind, sc); else sojuGlass(sx, sy, sc * 1.25);
    }
  };
  lane(0); lane(1);
  if (!drunk) drawHaeunCounter(u, phase, items);
  lane(2);
  LANES.forEach((L, i) => gate(SCAN_X, L.y, i === 2 ? 38 : 16, true, kick));
  // 반장 at the loading end: the throw is a quick arm swing on each throw time
  let swing = 0; for (const it of items) if (u >= it.t - 0.25 && u < it.t + 0.3) swing = Math.max(swing, Math.sin(Math.PI * clamp((u - it.t + 0.25) / 0.55, 0, 1)));
  actor('boss', 46, { bob: drunk && (u % spb) < spb * 0.3 ? 1 : 0, noArm: true }, false, top => { const hx = lerp(BOSS_X + 14, BOSS_X + 30, swing), hy = lerp(top + 30, top - 2, swing); thick(BOSS_X + 7, top + 22, hx, hy, 4, C.shirt); R(hx - 1, hy - 3, 5, 5, C.skin); if (swing < 0.5) { if (drunk) sojuGlass(hx + 2, hy - 2, 0.9); else sushiPlate(hx + 2, hy - 1, 'red', 0, 0.8); } });
  if (drunk) { soju(20, 146); soju(28, 146); if (u > 6) soju(12, 146); }
  // the player with chopsticks and his stack (it keeps growing into the second phase)
  playerChop(kick, level / 3);
  plateStack(326, 172, drunk ? 5 + Math.min(3, Math.floor(u / 6)) : Math.min(5, Math.floor(u / 4) + 1)); if (drunk) for (let k = 0; k < Math.min(3, Math.floor(u / 5) + 1); k++) sojuGlass(296 + k * 8, 172, 0.9, 0);
  // judgements and lines
  if (u - lastPick < 0.55) judge(drunk ? '짠!' : '쏙', 300, drunk ? 84 : 96, drunk ? '#ffe9a8' : '#8fd694', drunk ? 18 : 14, '', u - lastPick);
  if (u - lastTriple < 0.9) { judge(drunk ? '짠!!!' : '세 개!', 300, 80, '#ffe9a8', 24, drunk ? '셋 다 짠' : '셋 다 한 번에', u - lastTriple); if (u - lastTriple < 0.25) { g.fillStyle = `rgba(255,255,255,${0.4 * (1 - (u - lastTriple) / 0.25)})`; g.fillRect(0, 0, W, H); } }
  if (!drunk) { say(u, 2, 5, '회식인데 웬 회전초밥이에요…', 118, 52, 112); say(u, 5.5, 8.5, '…고기는 비싸. 받아라.', 6, 50, 92); say(u, 10, 12.5, '…하은 씨, 그거 다 먹은 거예요?', 118, 52, 126); }
  else { say(u, 1, 4, '(우물우물)', 248, 68, 48, { bg: '#d9d0bd' }); say(u, 4.5, 7.5, '…다음 달까지만 나온다.', 6, 50, 92, { shake: level > 2 ? 1 : 0 }); say(u, 8, 11, '반장님 기타, 진짜 샘플로 썼어요!', 118, 52, 118, { shake: level > 1.5 ? 1 : 0 }); say(u, 11.5, 13.5, '(우물우물)', 248, 68, 48, { bg: '#d9d0bd' }); }
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
  g.save(); g.translate(W / 2, H / 2); g.rotate(0.0087 * k * Math.sin(u / 1.3)); g.scale(1 + 0.027 * k, 1 + 0.027 * k); g.translate(-W / 2, -H / 2); g.drawImage(offC, 0, 0); g.restore();
  g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.08 * k; g.filter = `blur(${(1 + k).toFixed(1)}px)`; g.drawImage(offC, 0, 0); g.filter = 'none'; g.restore();
  g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = `rgba(255,140,60,${0.055 * k})`; g.fillRect(0, 0, W, H); g.restore();
  if (k >= 1.5) { g.save(); g.globalAlpha = 0.14 * (k - 1); g.drawImage(offC, Math.round(2 + Math.sin(u * 2) * 2), 1); g.restore(); }
  if (sharp) sharp();
  vignette(0.2 * k);
}

// ---------- 타임라인 ----------
let TL = [], TOTAL = 0;
function buildTL() {
  TL = [
    { id: 'open', name: '벨트', dur: OPEN_DUR, draw: u => drawOpening(u) },
    { id: 'cut', name: '매치 컷', dur: 2, draw: u => { drawSushi(0, 1); const o = offC || (offC = Object.assign(document.createElement('canvas'), { width: W, height: H })); const oc = o.getContext('2d'); oc.clearRect(0, 0, W, H); const g0 = g; g = oc; drawOpening(OPEN_DUR); g = g0; g.save(); g.globalAlpha = 1 - ease(u / 2); g.drawImage(o, 0, 0); g.restore(); if (u < 0.1) cue('cut-roller', () => rollerOn(true, 0.04)); } },
    { id: 'sushi1', name: '초밥', dur: 18, draw: u => { drawSushi(u, 1); fadeBlack(0); } },
    { id: 'sushi2', name: '소주잔', dur: 18, draw: u => { const lv = drawSushi(u, 2); drunkFx(lv, u, () => drawHaeunCounter(u, 2, THROWS[1])); fadeBlack(u > 16.6 ? (u - 16.6) / 1.4 : 0); if (u > 16.6) cue('sushi-off', () => rollerOn(false)); } },
    { id: 'train', name: '창', dur: 15.4, draw: u => shotWindow(u) },
    { id: 'door', name: '문', dur: 9.6, draw: u => shotDoor(u) },
    { id: 'stairs', name: '계단', dur: 6, draw: u => shotStairs(u) },
    { id: 'lamp', name: '가로등', dur: 8, draw: u => shotLamp(u) },
    { id: 'cross', name: '횡단보도', dur: 8, draw: u => shotCross(u) },
    { id: 'puddle', name: '웅덩이', dur: 6, draw: u => shotPuddle(u) },
    { id: 'corridor', name: '복도', dur: 12, draw: u => shotCorridor(u) },
    { id: 'hands', name: '손', dur: 8, draw: u => shotHands(u) },
    { id: 'ward', name: '병실', dur: 14, draw: u => shotWard(u, 0) },
    { id: 'end', name: '새벽', dur: 10, draw: u => shotWard(14 + u, clamp(u / 7, 0, 1), u) },
    { id: 'table', name: '탁자', dur: 9, draw: u => shotTable(u) }
  ];
  TOTAL = TL.reduce((a, s) => a + s.dur, 0);
}
buildTL();
function sceneAt(t) { let acc = 0; for (const s of TL) { if (t < acc + s.dur) return { s, u: t - acc, start: acc }; acc += s.dur; } const s = TL[TL.length - 1]; return { s, u: s.dur, start: TOTAL - s.dur }; }
let T = 0, playing = false, lastNow = 0, speed = 1;
const cv = document.getElementById('cv'); g = cv.getContext('2d'); g.imageSmoothingEnabled = false;
const seekEl = document.getElementById('seek'), lbl = document.getElementById('lbl');
function seek(t) { T = clamp(t, 0, TOTAL); fired.clear(); rollerOn(false); const { s, u } = sceneAt(T); silent = true; try { s.draw(u, s.dur); } catch (e) {} silent = false; }
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
document.getElementById('play').addEventListener('click', () => { audioOn(); playing = !playing; if (T >= TOTAL) seek(0); if (ac) { if (playing) ac.resume(); else ac.suspend(); } document.getElementById('play').textContent = playing ? '❚❚ 일시정지' : '▶ 재생'; });
document.getElementById('speed').addEventListener('change', e => { speed = +e.target.value; });
const jumps = document.getElementById('jumps');
function buildJumps() { jumps.innerHTML = ''; let acc = 0; for (const s of TL) { const b = document.createElement('button'); b.textContent = s.name; const at = acc; b.addEventListener('click', () => { audioOn(); seek(at); }); jumps.append(b); acc += s.dur; } seekEl.max = TOTAL; }
buildJumps();
