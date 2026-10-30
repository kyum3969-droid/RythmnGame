// ---------- 하은의 밤: 컷 ----------
// small shared pieces
const bagAt = (x, y) => { R(x, y + 2, 9, 8, '#2f3237'); R(x, y + 2, 9, 1, '#454950'); R(x + 1, y, 1, 3, '#2f3237'); R(x + 7, y, 1, 3, '#2f3237'); R(x + 2, y - 1, 5, 1, '#2f3237'); };
function haeunWalkSide(cx, feetY, t, o = {}) {   // the game's own 하은, walking (or standing); feetY = her soles
  const top = feetY - 55, st = o.stand ? null : Math.floor(t / (o.pace || 0.2)) % 2;
  drawHaeunAt(cx, top + (st === 1 ? -1 : 0), 0, st == null ? { load: true, bob: 0, watch: o.watch, mirror: o.mirror } : { step: st, mirror: o.mirror });
  if (o.bag !== false) { const bx = o.mirror ? cx - 12 : cx + 3; bagAt(bx, top + 30); }
}
// 하은 from behind with legs that stride (lift = 0..1 for each leg)
function haeunBack(x, y, liftL, liftR, o = {}) {
  spr('hBack', x, y, o);
  const leg = (lx, lift) => { const up = Math.round(lift * 5); R(x + lx, y + 32, 6, 14 - up, '#3a3f45'); R(x + lx + 5, y + 32, 1, 14 - up, '#2a2e33'); R(x + lx, y + 46 - up, 6, 8 - Math.round(lift * 3), '#3a3f45'); R(x + lx, y + 53 - up - Math.round(lift * 3), 6, 2, '#1e1a1a'); R(x + lx, y + 55 - up - Math.round(lift * 3), 6, 1, lift > 0.3 ? '#d9d4c6' : '#1e1a1a'); };
  if (o.tint) { g.save(); g.globalAlpha = 1; }
  leg(3, liftL); leg(11, liftR);
  if (o.tint) { g.globalAlpha = o.tint[1]; R(x + 3, y + 32, 14, 24, o.tint[0]); g.restore(); }
}
function clacks(key, S, J, quiet = 1) { const n = Math.floor(S / J); cue(key + n, () => { if (n <= 0) return; noiseS(now(), 'lowpass', 320, 0.16 * quiet, 0.07); noiseS(now() + 0.09, 'lowpass', 280, 0.12 * quiet, 0.07); }); }

// 1. 창 — an insert of the LED board, then across the aisle: the two of them on the bench, the tunnel lamps sweeping past
function shotWindow(u) {
  if (u < 3.5) return ledInsert(u);
  trainTwoShot(u - 3.5);
  if (u > 9.4) blackout(W, H, 0);
}
function ledInsert(u) {
  shot(1, (w, h) => {
    const sway = Math.floor(u / 0.45) % 2;
    // the ceiling, out of focus: a fluorescent tube's bloom, the ad frames
    dgrad(0, 0, w, h, ['#1d2026', '#2a2e35', '#3a3f47', '#2a2e35']);
    light(110, 30, 120, '235,245,255', 0.35); R(20, 22 + sway, 190, 6, '#e9f2f6'); R(20, 22 + sway, 190, 1, '#ffffff'); light(115, 25, 60, '255,255,255', 0.4);
    R(232, 18 + sway, 120, 30, '#3a3f47'); R(236, 22 + sway, 52, 22, '#c0546a'); R(292, 22 + sway, 56, 22, '#3f8a7a'); shade(232, 18 + sway, 120, 30, '20,22,28', 0.45);
    // the board: housing, bevel, the dot matrix
    const y0 = 64 + sway;
    R(30, y0, 324, 92, '#202227'); R(30, y0, 324, 2, '#4c5058'); R(30, y0 + 90, 324, 2, '#121317'); R(36, y0 + 6, 312, 80, '#0d0a09'); R(36, y0 + 6, 312, 1, '#000');
    const cols = 102, rows = 24, ox = 40, oy = y0 + 10;
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) R(ox + i * 3, oy + j * 3, 2, 2, '#2a1209');
    const lit = (bm, dx) => { for (const [x, y] of bm.on) { const i = x + dx, j = y + 3; if (i >= 0 && i < cols && j < rows) R(ox + i * 3, oy + j * 3, 2, 2, '#ff8a3d'); } };
    const a = bitmap('다음 역', 15), b = bitmap('○○대학병원', 15);
    if (u < 1.6) lit(a, Math.round((cols - a.w) / 2));
    else { const p = ease(clamp((u - 1.6) / 1.0, 0, 1)); lit(b, Math.round(lerp(cols, (cols - b.w) / 2, p))); }
    light(192, y0 + 46, 150, '255,138,61', 0.16);
    // a glint crossing the glass
    g.save(); g.globalAlpha = 0.07; for (let k = 0; k < 26; k++) R(250 + k * 3, y0 + 84 - k * 3, 10, 2, '#ffffff'); g.restore();
    R(178, y0 + 92, 28, 22, '#202227'); R(178, y0 + 92, 28, 1, '#4c5058');
    vig(w, h, 0.5);
  });
  bars();
  if (u >= 0.1) cue('w-chime', SND.chime);
  rollerOn(true, 0.07); clacks('w-led', u * 150, 68, 0.8);
  subtitle(u, 1.8, 3.4, '다음 역은 ○○대학병원입니다.', 'sign');
  blackout(W, H, u < 0.4 ? 1 - u / 0.4 : 0);
}
// the train's position along the tunnel: cruising, then braking into the station
const BRAKE = 8.0, BRAKE_LEN = 3.0, PLAT = 150 * BRAKE + 75 * BRAKE_LEN;
const trainS = t => t < BRAKE ? 150 * t : 150 * BRAKE + 150 * (Math.min(t - BRAKE, BRAKE_LEN) - Math.min(t - BRAKE, BRAKE_LEN) ** 2 / (2 * BRAKE_LEN));
const trainV = t => t < BRAKE ? 150 : Math.max(0, 150 * (1 - (t - BRAKE) / BRAKE_LEN));
// ---- people seen from the front, all on one template so they share the game's 4-head proportion:
//      a 12x13 face, hair or cap on top, an 18-row torso, a lap, 12-row shins
const INK = '#1b1716';
function faceF(cx, top, o = {}) {
  const s = o.skin || '#d9a27a', sd = o.skinD || '#b98260';
  R(cx - 6, top, 12, 11, s); R(cx - 5, top + 11, 10, 1, s); R(cx - 4, top + 12, 8, 1, sd); R(cx - 6, top + 9, 1, 2, sd); R(cx + 5, top + 9, 1, 2, sd);
  R(cx - 7, top + 4, 1, 3, sd); R(cx + 6, top + 4, 1, 3, sd);
  const e = o.eyes || 'open', ey = top + 5 + (o.look === 'down' ? 1 : 0);
  if (e === 'open') { R(cx - 4, ey, 2, 2, INK); R(cx + 2, ey, 2, 2, INK); } else if (e === 'closed') { R(cx - 4, ey + 1, 2, 1, INK); R(cx + 2, ey + 1, 2, 1, INK); }
  if (o.blush) { R(cx - 5, top + 7, 2, 1, '#e07070'); R(cx + 3, top + 7, 2, 1, '#e07070'); }
  R(cx - 1, top + 9, o.mouthOpen ? 2 : 2, o.mouthOpen ? 2 : 1, o.mouthOpen ? '#6a2a2a' : '#a0524e');
}
const HAIR = {
  sinip(cx, top) { const c = '#1e1a1a'; R(cx - 7, top - 3, 14, 5, c); R(cx - 6, top - 4, 11, 1, c); R(cx - 7, top + 2, 2, 5, c); R(cx + 5, top + 2, 2, 4, c); R(cx - 5, top + 2, 5, 2, c); R(cx + 1, top + 2, 3, 1, c); R(cx - 3, top - 3, 4, 1, '#3a3436'); },
  salary(cx, top) { const c = '#22201e'; R(cx - 7, top - 3, 14, 4, c); R(cx - 6, top - 4, 12, 1, c); R(cx - 7, top + 1, 1, 4, c); R(cx + 6, top + 1, 1, 4, c); R(cx - 2, top - 3, 1, 3, '#4a4440'); R(cx - 7, top + 3, 1, 2, '#8a8580'); R(cx + 6, top + 3, 1, 2, '#8a8580'); },
  student(cx, top) { const c = '#2a221e'; R(cx - 7, top - 3, 14, 5, c); R(cx - 5, top - 5, 2, 2, c); R(cx, top - 5, 3, 2, c); R(cx + 4, top - 4, 2, 1, c); R(cx - 7, top + 2, 1, 4, c); R(cx + 6, top + 2, 1, 4, c); R(cx - 6, top + 2, 4, 1, c);
    const f = '#2b2e31'; R(cx - 6, top + 4, 5, 1, f); R(cx + 1, top + 4, 5, 1, f); R(cx - 6, top + 7, 5, 1, f); R(cx + 1, top + 7, 5, 1, f); R(cx - 6, top + 4, 1, 4, f); R(cx - 2, top + 4, 1, 4, f); R(cx + 1, top + 4, 1, 4, f); R(cx + 5, top + 4, 1, 4, f); R(cx - 1, top + 5, 2, 1, f); },
  long(cx, top) { const c = '#3a2620'; R(cx - 7, top - 3, 14, 5, c); R(cx - 6, top - 4, 12, 1, c); R(cx - 8, top, 2, 18, c); R(cx + 6, top, 2, 18, c); R(cx - 6, top + 2, 6, 2, c); R(cx - 6, top + 4, 2, 1, c); R(cx - 4, top - 3, 5, 1, '#5a3a30'); },
  buzz(cx, top) { const c = '#2a2420'; R(cx - 6, top - 2, 12, 3, c); R(cx - 7, top, 1, 3, c); R(cx + 6, top, 1, 3, c); dfill(cx - 6, top - 2, 12, 3, '#4a3e36', 0.3); R(cx - 7, top + 5, 1, 2, '#f4f1ea'); R(cx + 6, top + 5, 1, 2, '#f4f1ea'); R(cx + 6, top + 7, 1, 8, '#e3e7ea'); },
  // 하은's snapback, pulled down: brim and its shadow hide the eyes; turned = the brim swings toward her left (screen right)
  cap(cx, top, turned) {
    const d = turned ? 2 : 0, red = '#d8463b', redD = '#a83328';
    if (turned) { R(cx - 8, top, 2, 8, '#4a3328'); R(cx - 8, top + 3, 1, 5, '#6b4a3a'); }
    R(cx - 7, top + 4, 1, 4, '#4a3328'); R(cx + 6, top + 4, 1, 3, '#4a3328');
    R(cx - 4, top - 3, 8, 1, redD); R(cx - 6, top - 2, 12, 4, red); R(cx - 6, top - 2, 1, 4, redD); R(cx + 5, top - 2, 1, 4, redD); R(cx - 3, top - 2, 2, 1, '#ef6a55');
    R(cx - 2 + d, top - 2, 4, 3, '#f4f1ea'); R(cx - 1 + d, top - 1, 2, 1, red);
    R(cx - 7 + d, top + 2, 14, 1, '#3a3236'); R(cx - 7 + d, top + 3, 14, 1, '#1e1a1a');
    R(cx - 6, top + 4, 12, 3, '#8a5e44'); R(cx - 6, top + 4, 12, 1, '#6b4631');
  }
};
// seated, front: seatY = the cushion top (the lap sits on it)
function sitF(cx, seatY, o) {
  const w = o.w || 16, x0 = cx - w / 2, top = seatY - 18, sk = o.skin || '#d9a27a', topC = o.top, sh = mix(o.top, '#000000', 0.3);
  const spread = o.spread || 0, pants = o.pants, ps = mix(pants, '#000000', 0.25);
  // shins and shoes, then the lap, then the torso over them
  R(cx - 6 - spread, seatY + 3, 5, 12, pants); R(cx + 1 + spread, seatY + 3, 5, 12, pants); R(cx - 2 - spread, seatY + 3, 1, 12, ps); R(cx + 1 + spread, seatY + 3, 1, 12, ps);
  R(cx - 7 - spread, seatY + 15, 6, 2, o.shoe || '#1e1a1a'); R(cx + 1 + spread, seatY + 15, 6, 2, o.shoe || '#1e1a1a'); R(cx - 7 - spread, seatY + 17, 6, 1, o.sole || '#3a3236'); R(cx + 1 + spread, seatY + 17, 6, 1, o.sole || '#3a3236');
  R(x0 + 1, seatY, w - 2, 3, pants); R(x0 + 1, seatY, w - 2, 1, mix(pants, '#ffffff', 0.18)); R(cx, seatY + 1, 1, 2, ps);
  if (o.noTorso) return top;
  R(cx - 2, top - 1, 4, 2, o.skinD || '#b98260');
  R(x0 + 1, top, w - 2, 1, topC); R(x0, top + 1, w, 17, topC); R(x0 + 2, top + 3, 1, 14, sh); R(x0 + w - 3, top + 3, 1, 14, sh);
  if (o.dress) o.dress(cx, top, w);
  // arms: hands in the lap by default
  if (o.hands !== false) { R(cx - 5, seatY - 3, 4, 3, sk); R(cx + 1, seatY - 3, 4, 3, sk); R(cx - 5, seatY - 1, 10, 1, o.skinD || '#b98260'); }
  if (o.extra) o.extra(cx, top, seatY);
  return top;   // the torso's top: the face sits 14 rows above it
}
function standF(cx, feetY, o) {
  const w = o.w || 16, x0 = cx - w / 2, legTop = feetY - 22, top = legTop - 18, pants = o.pants, ps = mix(pants, '#000000', 0.25);
  R(cx - 6, legTop, 5, 20, pants); R(cx + 1, legTop, 5, 20, pants); R(cx - 2, legTop, 1, 20, ps); R(cx + 1, legTop, 1, 20, ps);
  if (o.stripe) { R(cx - 6, legTop, 1, 20, o.stripe); R(cx + 5, legTop, 1, 20, o.stripe); }
  R(cx - 7, feetY - 2, 6, 2, o.shoe || '#1e1a1a'); R(cx + 1, feetY - 2, 6, 2, o.shoe || '#1e1a1a'); R(cx - 7, feetY, 6, 1, o.sole || '#d9d4c6'); R(cx + 1, feetY, 6, 1, o.sole || '#d9d4c6');
  R(cx - 2, top - 1, 4, 2, '#b98260');
  R(x0 + 1, top, w - 2, 1, o.top); R(x0, top + 1, w, 18, o.top); R(x0 + 2, top + 3, 1, 15, mix(o.top, '#000000', 0.3)); R(x0 + w - 3, top + 3, 1, 15, mix(o.top, '#000000', 0.3));
  if (o.dress) o.dress(cx, top, w);
  if (o.extra) o.extra(cx, top);
  return top;
}
// a two-segment arm from shoulder S to hand H, elbow bending downward/outward; sleeve colour c
function arm(sx, sy, hx, hy, c, skin, bendSide = 1, L1 = 8, L2 = 8) {
  const dx = hx - sx, dy = hy - sy, d = Math.min(L1 + L2 - 0.01, Math.hypot(dx, dy)), a = Math.atan2(dy, dx), k = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1));
  const ex = sx + Math.cos(a + bendSide * k) * L1, ey = sy + Math.sin(a + bendSide * k) * L1, tx = sx + Math.cos(a) * d, ty = sy + Math.sin(a) * d;
  thick(sx, sy, ex, ey, 3, c); thick(ex, ey, tx, ty, 3, c); R(ex - 1, ey - 1, 2, 1, mix(c, '#ffffff', 0.15));
  R(Math.round(tx) - 1, Math.round(ty) - 2, 3, 4, skin); R(Math.round(tx) + 2, Math.round(ty) - 1, 1, 2, skin); R(Math.round(tx) - 1, Math.round(ty) + 2, 3, 1, mix(skin, '#000000', 0.2));
}
// the passengers on the last train home
const PASS = {
  salaryman(t) { // after his own 회식: suit, tie pulled loose, dozing; his head drops and jerks back up
    const drop = (t % 4.2) > 3.1 ? 2 : (t % 4.2) > 2.2 ? 1 : 0, cx = 18, seat = 70;
    R(cx + 8, 79, 12, 9, '#4a3a2a'); R(cx + 8, 79, 12, 1, '#6a5440'); R(cx + 12, 77, 4, 2, '#4a3a2a');
    const top = sitF(cx, seat, { w: 18, top: '#3a3e48', pants: '#33363e', spread: 1, dress: (x, y) => { R(x - 3, y + 1, 6, 6, '#e9ecef'); R(x - 1 + 1, y + 2, 2, 8, '#8a2a2a'); R(x + 1, y + 2, 1, 1, '#b84a4a'); R(x - 4, y + 1, 1, 9, '#2a2d35'); R(x + 3, y + 1, 1, 9, '#2a2d35'); } });
    faceF(cx, top - 14 + drop, { eyes: 'closed', blush: true }); HAIR.salary(cx, top - 14 + drop);
  },
  student(t) { // studying: a book open on the lap, head down, a page turns
    const cx = 40, seat = 70, turn = t > 1.4 && t < 1.8;
    R(cx + 9, 78, 10, 10, '#4a5a3a'); R(cx + 9, 78, 10, 2, '#5a6a4a'); R(cx + 12, 81, 4, 3, '#3a4a2a');
    const top = sitF(cx, seat, { w: 16, top: '#9a9488', pants: '#3a3f4a', shoe: '#e9e4da', sole: '#b9b4aa', hands: false, dress: (x, y) => { R(x - 1, y + 1, 1, 5, '#d9d4c6'); R(x + 1, y + 1, 1, 5, '#d9d4c6'); R(x - 4, y + 10, 8, 5, '#8a847a'); } });
    R(cx - 8, seat - 6, 16, 6, '#f4f1ea'); R(cx, seat - 6, 1, 6, '#c9c2b0'); R(cx - 8, seat - 1, 16, 1, '#2f5f8a'); for (let k = 0; k < 4; k++) { R(cx - 6, seat - 5 + k, 5, 1, '#c9c2b0'); R(cx + 2, seat - 5 + k, 5, 1, '#c9c2b0'); }
    if (turn) R(cx + 1, seat - 9, 4, 4, '#ffffff');
    R(cx - 9, seat - 4, 3, 3, '#d9a27a'); R(cx + 7, seat - 4, 3, 3, '#d9a27a');
    faceF(cx, top - 13, { eyes: 'closed', look: 'down' }); HAIR.student(cx, top - 13);
  },
  phoneWoman(t) { // standing in the aisle, one hand on a strap, the other with the phone, its light on her face
    const cx = 64, feet = 93, scroll = Math.floor(t / 0.9) % 2;
    const top = standF(cx, feet, { w: 14, top: '#c9b089', pants: '#4a5a7a', shoe: '#e9e4da', sole: '#c9c4ba', dress: (x, y) => { R(x - 2, y + 1, 4, 10, '#f4f1ea'); R(x - 7, y + 12, 3, 8, '#e0d4b8'); } });
    HAIR.long(cx, top - 14); faceF(cx, top - 14, { eyes: 'open', look: 'down' }); R(cx - 6, top - 14, 12, 3, '#3a2620'); HAIR.long(cx, top - 14);
    R(cx - 9, 12, 1, top - 30, '#e3e7ea'); R(cx - 12, top - 19, 7, 1, '#eef1f3'); R(cx - 12, top - 19, 1, 6, '#eef1f3'); R(cx - 6, top - 19, 1, 6, '#eef1f3'); R(cx - 12, top - 14, 7, 1, '#c9ced3');
    thick(cx - 7, top + 2, cx - 11, top - 7, 3, '#c9b089'); thick(cx - 11, top - 7, cx - 9, top - 15, 3, '#c9b089'); R(cx - 11, top - 8, 2, 1, '#e0d4b8'); R(cx - 11, top - 18, 4, 4, '#d9a27a'); R(cx - 11, top - 15, 4, 1, '#b98260');
    R(cx + 1, top + 6, 5, 7, '#1b1716'); R(cx + 2, top + 7, 3, 5, scroll ? '#9fd8ec' : '#bfe6f2'); R(cx, top + 9, 3, 4, '#d9a27a'); thick(cx + 6, top + 3, cx + 3, top + 10, 3, '#c9b089');
    light(cx + 3, top + 4, 12, '159,216,236', 0.25);
    R(cx + 6, top + 14, 6, 9, '#8a5a3a'); R(cx + 7, top + 2, 1, 12, '#8a5a3a');
  },
  trackMan(t) { // by the door: track suit, earbuds, a gym bag, nodding to whatever he is listening to
    const cx = 184, feet = 93, nod = Math.floor(t / 0.5) % 2;
    const top = standF(cx, feet, { w: 18, top: '#2a3a6a', pants: '#2a3a6a', stripe: '#e9ecef', shoe: '#e9e4da', sole: '#d8463b', dress: (x, y, w) => { R(x - w / 2, y + 1, 1, 17, '#e9ecef'); R(x + w / 2 - 1, y + 1, 1, 17, '#e9ecef'); R(x, y + 1, 1, 17, '#9aa0a6'); R(x - 3, y, 6, 2, '#1f2c52'); } });
    faceF(cx, top - 14 + nod, { eyes: 'closed' }); HAIR.buzz(cx, top - 14 + nod);
    R(cx - 12, top + 8, 9, 12, '#1e1a1a'); R(cx - 11, top + 11, 4, 2, '#d8463b'); thick(cx - 6, top + 1, cx - 8, top + 9, 2, '#1e1a1a');
    R(cx - 10, top - 26, 1, 28, '#c9ced3');
  }
};
function sinipAsleep(SX, SEAT, ang, t) {
  const sTop = sitF(SX, SEAT, { w: 18, top: '#2f4f58', pants: '#33415a', spread: 1, hands: false, dress: (x, y) => { R(x - 7, y + 1, 14, 12, '#cfe04a'); R(x - 7, y + 8, 14, 2, '#ebe5c9'); R(x - 1, y + 1, 2, 12, '#2f4f58'); R(x - 3, y - 1, 6, 2, '#213840'); } });
  R(SX - 10, SEAT - 4, 3, 4, '#d9a27a'); R(SX + 7, SEAT - 4, 3, 4, '#d9a27a');
  const pivX = SX, pivY = sTop - 1;
  rotDraw(() => { faceF(40, 40, { eyes: 'closed', blush: true, mouthOpen: true }); HAIR.sinip(40, 40); }, 96, 72, 40, 53, ang, pivX, pivY);
  const headX = pivX + Math.sin(ang) * 7, headY = pivY - Math.cos(ang) * 7;
  zzz(Math.round(headX + 6), Math.round(headY - 14), t * 1000);
  return [headX, headY];
}
const HAEUN_DRESS = (x, y) => { R(x - 6, y + 1, 12, 15, '#7ec8e3'); R(x - 6, y + 8, 12, 2, '#ebe5c9'); R(x - 1, y + 1, 2, 15, '#5aa6c4'); R(x - 2, y - 1, 4, 2, '#1e1a1a'); };
function haeunFront(cx, pose, o = {}) {
  const seat = 70, sk = '#d9a27a', pants = '#3a3f45', pd = '#2a2e33';
  const torso = (top, dx = 0) => { R(cx - 7 + dx, top, 14, 1, '#1e1a1a'); R(cx - 8 + dx, top + 1, 16, 17, '#1e1a1a'); R(cx - 6 + dx, top + 3, 1, 14, '#121010'); R(cx + 5 + dx, top + 3, 1, 14, '#121010'); HAUN_D(cx + dx, top); R(cx - 2 + dx, top - 1, 4, 2, '#b98260'); };
  const HAUN_D = HAEUN_DRESS;
  const head = (top, dx = 0) => { faceF(cx + dx, top, { eyes: 'hidden' }); HAIR.cap(cx + dx, top, o.turned); };
  const shins = () => { R(cx - 6, seat + 3, 5, 12, pants); R(cx + 1, seat + 3, 5, 12, pants); R(cx - 2, seat + 3, 1, 12, pd); R(cx + 1, seat + 3, 1, 12, pd); R(cx - 7, seat + 15, 6, 2, '#1e1a1a'); R(cx + 1, seat + 15, 6, 2, '#1e1a1a'); R(cx - 7, seat + 17, 6, 1, '#3a3236'); R(cx + 1, seat + 17, 6, 1, '#3a3236'); };
  if (pose === 'sit') { shins(); R(cx - 7, seat, 14, 3, pants); R(cx - 7, seat, 14, 1, '#545a62'); torso(seat - 18); head(seat - 32); return seat - 18; }
  if (pose === 'lean') {   // forward over the knees: the torso drops and shortens, the head bows, hands on the knees
    shins(); R(cx - 7, seat, 14, 3, pants); R(cx - 7, seat, 14, 1, '#545a62');
    const top = seat - 15; R(cx - 8, top + 1, 16, 14, '#1e1a1a'); R(cx - 7, top, 14, 1, '#1e1a1a'); R(cx - 6, top + 1, 12, 12, '#7ec8e3'); R(cx - 6, top + 6, 12, 2, '#ebe5c9'); R(cx - 1, top + 1, 2, 12, '#5aa6c4');
    head(top - 12); R(cx - 6, top - 12, 12, 2, '#a83328');
    thick(cx - 7, top + 3, cx - 6, seat + 1, 3, '#1e1a1a'); thick(cx + 7, top + 3, cx + 6, seat + 1, 3, '#1e1a1a'); R(cx - 8, seat + 1, 4, 3, sk); R(cx + 4, seat + 1, 4, 3, sk);
    return top;
  }
  if (pose === 'half') {   // hips up off the seat, knees still bent: the thighs show, the body is still a little forward
    shins(); R(cx - 7, seat - 5, 14, 8, pants); R(cx - 1, seat - 5, 2, 8, pd); R(cx - 7, seat - 5, 14, 1, '#545a62');
    const top = seat - 22; torso(top); head(top - 13);
    thick(cx - 7, top + 3, cx - 7, top + 15, 3, '#1e1a1a'); thick(cx + 7, top + 3, cx + 7, top + 15, 3, '#1e1a1a'); R(cx - 8, top + 15, 3, 3, sk); R(cx + 6, top + 15, 3, 3, sk);
    return top;
  }
  // standing, feet on the floor
  const feet = 87, legTop = feet - 22, top = legTop - 18;
  R(cx - 6, legTop, 5, 20, pants); R(cx + 1, legTop, 5, 20, pants); R(cx - 2, legTop, 1, 20, pd); R(cx + 1, legTop, 1, 20, pd);
  R(cx - 7, feet - 2, 6, 2, '#1e1a1a'); R(cx + 1, feet - 2, 6, 2, '#1e1a1a'); R(cx - 7, feet, 6, 1, '#3a3236'); R(cx + 1, feet, 6, 1, '#3a3236');
  torso(top); head(top - 14);
  thick(cx - 7, top + 3, cx - 8, top + 16, 3, '#1e1a1a'); thick(cx + 7, top + 3, cx + 8, top + 16, 3, '#1e1a1a'); R(cx - 9, top + 16, 3, 3, sk); R(cx + 7, top + 16, 3, 3, sk);
  return top;
}
function sinipTorso(cx, hip) {
  const top = hip - 18; R(cx - 2, top - 1, 4, 2, '#b98260');
  R(cx - 8, top, 16, 1, '#2f4f58'); R(cx - 9, top + 1, 18, 17, '#2f4f58'); R(cx - 7, top + 3, 1, 14, '#213840'); R(cx + 6, top + 3, 1, 14, '#213840');
  R(cx - 7, top + 1, 14, 12, '#cfe04a'); R(cx - 7, top + 8, 14, 2, '#ebe5c9'); R(cx - 1, top + 1, 2, 12, '#2f4f58'); R(cx - 3, top - 1, 6, 2, '#213840');
}
// lean: the upper body about the hips; tilt: the head about the neck on top of that
function sinipLean(SX, SEAT, lean, tilt, t) {
  sitF(SX, SEAT, { w: 18, top: '#2f4f58', pants: '#33415a', spread: 1, hands: false, noTorso: true });
  rotDraw(() => sinipTorso(40, 70), 96, 72, 40, 70, lean, SX, SEAT);
  const nx = SX + Math.sin(lean) * 19, ny = SEAT - Math.cos(lean) * 19;
  rotDraw(() => { faceF(40, 40, { eyes: 'closed', blush: true, mouthOpen: true }); HAIR.sinip(40, 40); }, 96, 72, 40, 53, lean + tilt, Math.round(nx), Math.round(ny));
  R(SX - 6, SEAT - 3, 4, 3, '#d9a27a'); R(SX + 3, SEAT - 2, 4, 3, '#d9a27a');
  const a = lean + tilt, hx = nx + Math.sin(a) * 7, hy = ny - Math.cos(a) * 7;
  zzz(Math.round(hx + 6), Math.round(hy - 14), t * 1000);
  return [hx, hy];
}
function trainTwoShot(t) {
  const S = trainS(t), v = trainV(t), arrived = clamp((t - 9.6) / 1.4, 0, 1), DOOR = 11.2;
  shot(2, (w, h) => {
    const bounce = v > 20 && (S % 68) < 6 ? 1 : 0;
    g.save(); g.translate(0, bounce);
    // the car: wall, ad frames, the window and what is outside it
    R(0, 0, w, h, '#c9cfd6'); R(0, 12, w, 8, '#d9dee3'); for (const [x, c] of [[18, '#c0546a'], [46, '#3f8a7a'], [74, '#e0b84a'], [102, '#5a6fa8'], [134, '#d77a4a']]) { R(x, 13, 24, 6, '#eef1f3'); R(x + 1, 14, 22, 4, c); R(x + 2, 15, 9, 1, '#f7f1e2'); }
    R(0, 20, w, 1, '#9aa1a8');
    const wx0 = 4, wx1 = 120, wy0 = 22, wy1 = 46;
    R(wx0 - 2, wy0 - 2, wx1 - wx0 + 4, wy1 - wy0 + 4, '#9aa1a8'); R(wx0 - 1, wy0 - 1, wx1 - wx0 + 2, wy1 - wy0 + 2, '#2b2e33');
    g.save(); g.beginPath(); g.rect(wx0, wy0, wx1 - wx0, wy1 - wy0); g.clip();
    R(wx0, wy0, wx1 - wx0, wy1 - wy0, '#07080c');
    for (let k = -1; k < 8; k++) { const x = wx0 + (((k * 24 - S) % 168) + 168) % 168; R(x, wy0, 2, wy1 - wy0, '#121620'); }
    R(wx0, 27, wx1 - wx0, 1, '#171b25'); R(wx0, 29, wx1 - wx0, 1, '#131720'); R(wx0, 42, wx1 - wx0, 1, '#10131b');
    for (let k = 0; k < 3; k++) { const x = wx0 + (((k * 84 + 40 - S) % 252) + 252) % 252, len = 2 + Math.round(v * 0.12); R(x - len, 24, len + 2, 2, '#ffd890'); R(x - len, 24, len + 2, 1, '#fff3c8'); light(x, 25, 10 + v * 0.06, '255,216,144', 0.5); }
    const px = wx0 + (PLAT - S);
    if (px < wx1) { R(px, wy0, wx1 - px, wy1 - wy0, '#d7dfdb'); for (let y = wy0; y < wy1; y += 4) R(px, y, wx1 - px, 1, '#c6cfcb'); for (let x = px; x < wx1; x += 6) R(x, wy0, 1, wy1 - wy0, '#c6cfcb'); R(px, 34, wx1 - px, 3, '#2f6f8a'); R(px + 30, 25, 40, 8, '#1e2a33'); R(px + 32, 27, 36, 4, '#2f3a4a'); R(px + 34, 28, 20, 2, '#e9eef0'); light(px + 50, 24, 50, '240,250,255', 0.35); }
    g.restore();
    g.save(); g.globalAlpha = 0.16; for (let k = 0; k < 3; k++) R(wx0 + 6 + k * 38, wy0 + 1, 20, 1, '#ffffff'); for (let k = 0; k < 8; k++) R(wx0 + 74 + k, wy1 - 1 - k * 3, 6, 1, '#ffffff'); g.restore();
    // the door to the right
    R(128, 18, 52, 78, '#b9c0c7'); R(130, 20, 23, 76, '#d3d8dd'); R(155, 20, 23, 76, '#d3d8dd'); R(153, 20, 2, 76, '#2b2e33'); for (const x of [134, 159]) { R(x, 26, 15, 26, '#2b2e33'); R(x + 1, 27, 13, 24, px < x + 14 ? '#cfd8d4' : '#0a0c10'); }
    R(128, 18, 52, 1, '#8a9097'); R(130, 70, 48, 2, '#f2d35a');
    if (false) { const o = ease(clamp((t - DOOR) / 0.6, 0, 1)) * 22; g.save(); g.beginPath(); g.rect(130, 20, 48, 76); g.clip(); R(130, 20, 48, 76, '#c9d2ce'); R(130, 60, 48, 36, '#a9b4b0'); R(130, 68, 48, 3, '#f2d35a'); light(154, 50, 40, '255,255,255', 0.3); R(130 - o, 20, 23, 76, '#d3d8dd'); R(155 + o, 20, 23, 76, '#d3d8dd'); R(153 - o, 20, 1, 76, '#2b2e33'); R(155 + o, 20, 1, 76, '#2b2e33'); g.restore(); }
    // the bench: moquette back, cushion, the steel skirt, the floor
    R(0, 46, 124, 24, '#2f5f8a'); dfill(0, 47, 124, 22, '#3a6d9a', 0.32); dfill(0, 62, 124, 8, '#284f74', 0.5); R(0, 46, 124, 2, '#4a82b4');
    for (const x of [29, 51, 73, 95]) R(x, 48, 1, 22, '#284f74');
    R(0, 70, 124, 3, '#3f7fb0'); R(0, 70, 124, 1, '#5b97c6'); R(0, 73, 124, 4, '#244766'); R(0, 77, 124, 4, '#8e979f'); R(0, 77, 124, 1, '#b5bdc4'); R(0, 80, 124, 1, '#6f777e');
    R(0, 81, w, 15, '#6b7279'); dfill(0, 81, w, 15, '#7a8188', 0.3); R(0, 81, w, 1, '#5a6066'); dfill(0, 88, w, 8, '#5f666d', 0.4);
    // the straps, swinging forward as the train brakes
    R(0, 10, w, 2, '#9aa1a8'); const sw = Math.round((v < 150 && v > 0 ? 2 : 0) + Math.sin(t * 3) * (v > 0 ? 1 : 0.4));
    for (const x of [12, 36, 84, 108]) { R(x, 12, 1, 5, '#e3e7ea'); R(x - 2 + sw, 17, 5, 1, '#eef1f3'); R(x - 2 + sw, 17, 1, 4, '#eef1f3'); R(x + 2 + sw, 17, 1, 4, '#eef1f3'); R(x - 2 + sw, 20, 5, 1, '#c9ced3'); }
    R(122, 10, 3, 86, '#b8bec4'); R(123, 10, 1, 86, '#eef1f3'); R(124, 10, 1, 86, '#7a8086');
    // the other passengers on the bench
    PASS.salaryman(t); PASS.student(t);
    // 하은 and 신입: he sleeps leaning on her, the cheek on her shoulder. She notices and looks a while; her far hand (the right)
    // comes across her body to his head and slowly tips him over against the pole; the hand goes back; a moment; she gets up
    // (leans forward, hands on her knees, pushes up, stands, takes the bag), turns to the door and goes
    const HX = 84, SX = 106, SEAT = 70, RISE = 10.2;
    // push: her hand slowly lifts his head off her shoulder (2.4 s); she lets go; he tips over onto the pole by himself
    const push = ease(clamp((t - 5.0) / 2.4, 0, 1)), fall = clamp((t - 7.6) / 1.0, 0, 1), fe = fall * fall * (3 - 2 * fall);
    const lean = fall > 0 ? lerp(-0.04, 0.24, fe) : lerp(-0.22, -0.04, push), tilt = fall > 0 ? lerp(-0.15, 0.32, fe) : lerp(-0.8, -0.15, push);
    const reach = t < 4.2 ? 0 : t < 5.0 ? ease((t - 4.2) / 0.8) : t < 7.4 ? 1 : t < 8.0 ? 1 - ease((t - 7.4) / 0.6) : 0;
    const [headX, headY] = sinipLean(SX, SEAT, lean, tilt, t);
    const skin = '#d9a27a';
    if (t < RISE) {
      const hTop = haeunFront(HX, 'sit', { turned: t > 3.0 && t < 8.6 });
      // the bag on her lap, the near hand on its handles
      bagAt(HX - 4, SEAT - 9); R(HX + 1, SEAT - 11, 3, 3, skin);
      // the far arm: a 9-pixel upper arm and a 10-pixel forearm that never stretch; her shoulder turns in a little as she
      // reaches; the hand goes to the side of his head
      const a = lean + tilt, txh = headX - Math.cos(a) * 6, tyh = headY - Math.sin(a) * 6 + 1, sx0 = HX - 6 + Math.round(4 * reach), sy0 = hTop + 3;
      arm(sx0, sy0, lerp(HX - 4, txh, reach), lerp(SEAT - 8, tyh, reach), '#1e1a1a', skin, 1, 9, 10);
    } else {
      // getting up: forward with the hands on her knees, hips up, standing; the bag goes with her near hand
      const r = t - RISE, pose = r < 0.45 ? 'lean' : r < 0.9 ? 'half' : 'stand';
      const top = haeunFront(HX, pose, { turned: r > 1.2 });
      const [bx, by] = pose === 'lean' ? [HX + 3, SEAT + 4] : pose === 'half' ? [HX + 5, top + 18] : [HX + 6, top + 19];
      bagAt(bx, by); R(bx + 2, by - 3, 3, 3, skin);
    }
    // standing passengers, nearer the camera than the bench
    PASS.phoneWoman(t); PASS.trackMan(t);
    // a tunnel lamp passing lights the car for a moment: the beat in the light
    for (let k = 0; k < 3; k++) { const x = wx0 + (((k * 84 + 40 - S) % 252) + 252) % 252; if (v > 10) { g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createLinearGradient(x - 26, 0, x + 26, 0); gr.addColorStop(0, 'rgba(255,200,120,0)'); gr.addColorStop(0.5, `rgba(255,200,120,${0.12 * v / 150})`); gr.addColorStop(1, 'rgba(255,200,120,0)'); g.fillStyle = gr; g.fillRect(x - 26, 0, 52, h); g.restore(); } }
    if (arrived > 0) { g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = `rgba(230,240,245,${0.14 * arrived})`; g.fillRect(0, 0, w, h); g.restore(); }
    g.restore();
    vig(w, h, 0.45);
  });
  bars();
}

// 2. 문 — close on the train door from the platform: it opens, she comes out toward us; then her chest and shoulder close in
//    the foreground and, over her shoulder, him asleep against the pole inside; the doors close between them and the train
//    goes, its windows strobing across her; then flat and wide, the empty platform, the clock, her second watch
function shotDoor(u) { doorBust(u); }
// a tiny 신입 for the far background: slumped against the pole with his head over on it
function sinipFar(x, seatY, t) {
  R(x - 3, seatY + 1, 2, 5, '#33415a'); R(x + 1, seatY + 1, 2, 5, '#33415a'); R(x - 4, seatY - 1, 8, 2, '#33415a');
  R(x - 4, seatY - 4, 8, 3, '#2f4f58'); R(x - 3, seatY - 8, 8, 4, '#2f4f58'); R(x - 2, seatY - 8, 6, 4, '#cfe04a'); R(x - 2, seatY - 5, 6, 1, '#ebe5c9');
  R(x + 1, seatY - 13, 5, 5, '#d9a27a'); R(x + 1, seatY - 14, 5, 2, '#1e1a1a'); R(x + 5, seatY - 13, 1, 3, '#1e1a1a'); R(x + 1, seatY - 12, 1, 3, '#1e1a1a'); R(x + 2, seatY - 10, 1, 1, '#e07070');
  if (Math.floor(t / 0.8) % 2) R(x + 5, seatY - 18, 2, 1, '#e9e4da');
}
// 하은 as a bust, front on, at 3x: the cap's crown cut by the frame, the brim and its shadow over the eyes, the face, the neck,
// wide shoulders in the long black sleeves and the sky-blue vest, the crossbody strap; rim light from the lit doorway behind
function haeunBust(cx, by, t, look) {
  const red = '#d8463b', redD = '#a83328', sk = '#d9a27a', skD = '#b98260', hair = '#4a3328', d = Math.round(look * 3), breath = Math.round(Math.sin(t * 1.5) * 0.6);
  // shoulders and chest
  const s0 = by + 24 + breath;
  for (let y = s0; y < 72; y++) { const half = Math.min(26, 8 + (y - s0) * 3); R(cx - half, y, half * 2, 1, '#1e1a1a'); const vh = half - 5; if (vh > 0) R(cx - vh, y, vh * 2, 1, '#7ec8e3'); const vo = Math.max(0, 5 - Math.floor((y - s0) / 2)); if (vo > 0) R(cx - vo, y, vo * 2, 1, '#1e1a1a'); }
  for (let y = s0 + 6; y < 72; y++) R(cx, y, 1, 1, '#4a8fb0');
  R(cx - 20, s0 + 13, 40, 3, '#ebe5c9'); R(cx - 20, s0 + 16, 40, 1, '#c9c2a8'); R(cx - 21, s0 + 6, 1, 30, '#121010'); R(cx + 20, s0 + 6, 1, 30, '#121010');
  for (let k = 0; k < 34; k++) R(Math.round(cx + 15 - k * 0.95), s0 + 4 + k, 2, 1, '#2f3237');
  // neck
  R(cx - 5, by + 19, 10, 6 + breath, sk); R(cx - 5, by + 19, 10, 2, skD); R(cx - 5, by + 19, 1, 6, skD);
  // hair under the cap at the sides, the ears
  R(cx - 15, by + 1, 3, 13, hair); R(cx + 12, by + 1, 3, 11, hair); R(cx - 15, by + 2, 1, 10, '#6b4a3a');
  R(cx - 14, by + 8, 2, 6, skD); R(cx + 12, by + 8, 2, 6, skD); R(cx - 13, by + 9, 1, 3, sk);
  // the face: wide under the brim, a soft taper to the chin; the brim's shadow over the eyes
  const HW = [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 11, 11, 11, 10, 10, 9, 8, 7, 5];
  HW.forEach((half, r) => { R(cx - half, by + 2 + r, half * 2, 1, sk); R(cx - half, by + 2 + r, 1, 1, skD); R(cx + half - 1, by + 2 + r, 1, 1, '#c99270'); });
  R(cx - 12, by + 2, 24, 6, '#8a5e44'); R(cx - 12, by + 2, 24, 2, '#6b4631'); R(cx - 12, by + 8, 24, 1, '#a0704f');
  R(cx + d, by + 11, 1, 2, '#ecc09a'); R(cx - 1 + d, by + 14, 3, 1, skD);
  R(cx - 2 + d, by + 17, 4, 1, '#a04e4e'); R(cx - 1 + d, by + 18, 2, 1, '#c87070');
  // the cap: crown (cut by the top of the frame), seam, patch, a thick brim
  for (let y = by - 18; y < by; y++) { const k = (by - y) / 18, half = Math.round(17 * Math.sqrt(Math.max(0, 1 - k * k * 0.55))); R(cx - half, y, half * 2, 1, red); R(cx - half, y, 2, 1, redD); R(cx + half - 2, y, 2, 1, redD); }
  R(cx + d * 2, by - 18, 1, 18, redD); R(cx - 6 + d * 2, by - 12, 12, 7, '#f4f1ea'); R(cx - 4 + d * 2, by - 10, 8, 3, red); R(cx - 4 + d * 2, by - 10, 8, 1, '#f4f1ea');
  R(cx - 16, by - 16, 1, 14, '#ffc8a0');
  for (let x = -19; x <= 19; x++) { const yy = by + Math.round((x / 19) * (x / 19) * 2); R(cx + x + d, yy - 1, 1, 1, '#3a3236'); R(cx + x + d, yy, 1, 2, '#1e1a1a'); }
}
function doorBust(t) {
  // she is out on the platform; behind her the open door and him asleep against the pole. 0.3-1.1 she glances back;
  // 1.2-2.0 the doors close on him; 2.2 the train goes, its windows strobing over her; 3.6 she lifts her wrist: 05:14
  const close = ease(clamp((t - 1.2) / 0.8, 0, 1)), dep = Math.max(0, t - 2.2), tx = -Math.round(dep * dep * 30);
  const look = t > 0.3 && t < 1.3 ? -ease(clamp((t - 0.3) / 0.35, 0, 1)) * (t > 0.95 ? 1 - (t - 0.95) / 0.35 : 1) : 0;
  const wrist = ease(clamp((t - 3.6) / 0.6, 0, 1));
  const D0 = 30, D1 = 106;
  const panels = amount => {   // the door panels sliding shut from their pockets; he shows through their glass
    const pw = Math.round(38 * amount); if (pw <= 0) return;
    for (const [x, s] of [[D0, 1], [D1, -1]]) {
      const px = s > 0 ? x : x - pw, wx = px + 4, ww = pw - 8;
      R(px, 0, pw, 58, '#d3d8dd'); if (ww > 0) { R(wx - 1, 6, ww + 2, 26, '#2b2e33'); g.save(); g.beginPath(); g.rect(wx, 7, ww, 24); g.clip(); R(D0, 7, D1 - D0, 4, '#d6dbe1'); R(D0, 10, D1 - D0, 15, '#1a1f28'); R(D0, 25, D1 - D0, 6, '#2f5f8a'); R(60, 0, 2, 58, '#b8bec4'); sinipFar(55, 40, t); shade(wx, 7, ww, 24, '180,200,212', 0.3); R(wx + 2, 28, 5, 1, 'rgba(255,255,255,.35)'); g.restore(); }
      R(s > 0 ? px + pw - 1 : px, 0, 1, 58, '#2b2e33');
    }
  };
  shot(3, (w, h) => {
    // once the train is gone: the far wall across the tracks
    R(0, 0, w, h, '#2a2f36'); R(0, 10, w, 50, '#cfd8d4'); for (let x = 0; x < w; x += 6) R(x, 10, 1, 50, '#c0c9c5'); R(0, 44, w, 3, '#2f6f8a');
    R(14, 18, 34, 10, '#1e2a33'); R(15, 19, 32, 8, '#2f3a4a'); R(15, 27, 32, 1, '#8fd694');
    g.save(); g.translate(tx, 0);
    R(-20, 0, 200, 64, '#d9dee3'); for (let k = 0; k < 9; k++) for (let j = 0; j < 30; j++) R(-14 + k * 22 + j, 62 - j * 2, 2, 1, '#cdd3d8');
    R(D0 - 3, 0, 3, 64, '#2b2e33'); R(D1, 0, 3, 64, '#2b2e33'); R(D0, 58, D1 - D0, 3, '#f2d35a');
    g.save(); g.beginPath(); g.rect(D0, 0, D1 - D0, 58); g.clip();
    R(D0, 0, D1 - D0, 58, '#d6dbe1'); R(D0, 10, D1 - D0, 15, '#1a1f28'); R(D0, 25, D1 - D0, 2, '#9aa1a8'); R(D0, 27, D1 - D0, 13, '#2f5f8a'); R(D0, 27, D1 - D0, 1, '#4a82b4'); R(D0, 40, D1 - D0, 3, '#3f7fb0'); R(D0, 43, D1 - D0, 15, '#8a9198');
    light(64, 4, 50, '255,244,220', 0.25);
    R(60, 0, 2, 58, '#b8bec4'); R(60, 0, 1, 58, '#eef1f3'); sinipFar(55, 40, t);
    panels(close);
    g.restore();
    g.restore();
    R(0, 60, w, 12, '#9ea7a5'); R(0, 60, w, 2, '#e8c34a');
    if (dep > 0 && dep < 2) for (let k = 0; k < 4; k++) { const x = ((k * 42 - dep * dep * 40) % 190 + 190) % 190 - 30; g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = `rgba(255,236,190,${0.13 * Math.min(1, dep * 1.5) * (1 - dep / 2)})`; g.fillRect(x, 0, 22, h); g.restore(); }
    // her, close, in front of it all; at the end her head dips toward the wrist
    haeunBust(82, 12 + (wrist > 0.5 ? 1 : 0), t, look);
    // the wrist comes up into the frame: black cuff, the watch, 05:14
    if (wrist > 0) {
      const wy = Math.round(lerp(76, 44, wrist)), wx = 60;
      thick(wx - 10, wy + 28, wx + 4, wy + 6, 7, '#1e1a1a'); R(wx + 2, wy + 1, 10, 7, '#d9a27a'); R(wx + 2, wy + 7, 10, 1, '#b98260');
      R(wx - 12, wy + 2, 4, 10, '#1e1a1a'); R(wx - 14, wy - 1, 22, 11, '#c9ccd2'); R(wx - 14, wy - 1, 22, 1, '#eef0f2'); R(wx - 13, wy + 1, 20, 7, '#0e130e'); digits('05:14', wx - 12, wy + 2, '#8fd694'); light(wx - 3, wy + 4, 12, '143,214,148', 0.2);
    }
    vig(w, h, 0.5);
  });
  bars();
  blackout(W, H, t < 0.3 ? 1 - t / 0.3 : t > 5.0 ? (t - 5.0) / 0.4 : 0);
}
// 3. 계단 — close and from the side on her legs: one sneaker planted on a tread, the knee comes up and the other lands on the
//    next; the camera climbs the slope with her. Then from behind at the waist, the exit's sky opening over her cap
function shotStairs(u) {
  if (u < 3.4) stairsKnee(u); else stairsWaist(u - 3.4);
}
// crisp polygon fill (no anti-aliasing): scanline spans at pixel centres
function polyFill(pts, c) {
  let y0 = Infinity, y1 = -Infinity; for (const [, y] of pts) { y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  for (let y = Math.floor(y0); y <= Math.ceil(y1); y++) {
    const yc = y + 0.5, xs = [];
    for (let i = 0; i < pts.length; i++) { const [ax, ay] = pts[i], [bx, by] = pts[(i + 1) % pts.length]; if ((ay <= yc && by > yc) || (by <= yc && ay > yc)) xs.push(ax + (yc - ay) / (by - ay) * (bx - ax)); }
    xs.sort((p, q) => p - q);
    for (let i = 0; i + 1 < xs.length; i += 2) { const xa = Math.round(xs[i]), xb = Math.round(xs[i + 1]); if (xb > xa) R(xa, y, xb - xa, 1, c); }
  }
}
// a tapered limb segment from (ax, ay) width wa to (bx, by) width wb; `side` offsets toward the lit (+) or shaded (-) edge
function limb(ax, ay, wa, bx, by, wb, c, shrink = 0, shift = 0) {
  const dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L, ha = wa / 2 - shrink, hb = wb / 2 - shrink;
  polyFill([[ax + nx * (ha + shift), ay + ny * (ha + shift)], [bx + nx * (hb + shift), by + ny * (hb + shift)], [bx - nx * (hb - shift), by - ny * (hb - shift)], [ax - nx * (ha - shift), ay - ny * (ha - shift)]], c);
}
function blob(x, y, r, c) { for (let j = -r; j <= r; j++) { const w = Math.round(Math.sqrt(r * r - j * j)); R(Math.round(x) - w, Math.round(y) + j, w * 2 + 1, 1, c); } }
// a leg in loose work trousers, side on, knee forward (to the right): thigh, knee, shin, a fold behind the knee, the hem
// over a dark sock; light from the upper right lays a highlight down the front edge
function legSide(hx, hy, kx, ky, ax, ay, pal) {
  const [base, dark, lite, fold] = pal;
  limb(hx, hy, 13, kx, ky, 10, dark); limb(kx, ky, 10, ax, ay - 3, 8, dark); blob(kx, ky, 5, dark);
  limb(hx, hy, 13, kx, ky, 10, base, 1, -1); limb(kx, ky, 10, ax, ay - 3, 8, base, 1, -1); blob(kx - 0.5, ky - 0.5, 4, base);
  limb(hx, hy, 13, kx, ky, 10, lite, 5, -5); limb(kx, ky, 10, ax, ay - 3, 8, lite, 3.5, -3.5);
  // the fold behind the knee and two creases on the shin
  const bx = kx - (ky - hy) * 0.08 - 3, by = ky + 3; R(Math.round(bx), Math.round(by), 3, 1, fold); R(Math.round(bx) + 1, Math.round(by) + 1, 3, 1, fold); R(Math.round(bx) + 3, Math.round(by) + 5, 2, 1, fold);
  // the hem, slightly flared, then the sock
  R(Math.round(ax) - 5, Math.round(ay) - 5, 10, 2, dark); R(Math.round(ax) - 4, Math.round(ay) - 4, 8, 1, base); R(Math.round(ax) - 3, Math.round(ay) - 3, 6, 2, '#1a1a1e');
}
defMap('sneaker', [
  '...kkkkk',
  '..knnnnnkk',
  '..knnmmnnnkkk',
  '..knnnnwnwnwnkk',
  '.knnnnnnnnnnnnnk',
  '.kmnnnnnnnnnnnnnk',
  'kwwwwwwwwwwwwwwwwk',
  'kOOOOOOOOOOOOOOOk',
  '.kkkkkkkkkkkkkkk'
]);
const SNEAK = { k: '#141012', n: '#2a2a2e', m: '#4a4a52', w: '#f2efe6', O: '#c9c4b8' };
function stairsKnee(u) {
  const SW = 30, SH = 14, rate = 1 / 0.62, s = u * rate, n = Math.floor(s), f = s - n;
  const treadY = k => -k * SH, footAt = k => [k * SW + 13, treadY(k)];
  // the hip rides up the slope with a little bob; one foot planted, the other swinging two treads up with toe clearance
  const bob = Math.sin(f * Math.PI) * 2, hipX = (s + 0.5) * SW - 2, hipY = -(s + 0.5) * SH - 40 - bob;
  const planted = footAt(n + 1), from = footAt(n), to = footAt(n + 2), fe = f < 0.5 ? 2 * f * f : 1 - 2 * (1 - f) * (1 - f);
  const swing = [lerp(from[0], to[0], fe), lerp(from[1], to[1], fe) - Math.sin(f * Math.PI) * 11];
  const nearIsPlanted = (n + 1) % 2 === 0, near = nearIsPlanted ? planted : swing, far = nearIsPlanted ? swing : planted;
  const camX = Math.round(hipX - 60), camY = Math.round(hipY - 12);
  shot(3, (w, h) => {
    // the wall: big tiles, warm light from the street at the upper right, cool shade below
    const tx = -((camX * 0.9) % 16 + 16) % 16, ty = -((camY * 0.9) % 10 + 10) % 10;
    R(0, 0, w, h, '#5d6461');
    for (let y = ty - 10; y < h + 10; y += 10) for (let x = tx - 16; x < w + 16; x += 16) { const v = rnd(Math.floor((x + camX) / 16), Math.floor((y + camY) / 10)); R(x, y, 15, 9, v < 0.3 ? '#646b68' : v > 0.8 ? '#58605d' : '#5f6663'); R(x, y, 15, 1, '#6c7370'); }
    for (let y = ty - 10; y < h + 10; y += 10) R(0, y + 9, w, 1, '#545b58'); for (let y = ty - 10; y < h + 10; y += 10) for (let x = tx - 16; x < w + 16; x += 16) R(x + 15, y, 1, 9, '#545b58');
    g.save(); g.globalCompositeOperation = 'lighter'; const lg = g.createLinearGradient(w, 0, 20, h); lg.addColorStop(0, 'rgba(255,200,150,.30)'); lg.addColorStop(1, 'rgba(255,200,150,0)'); g.fillStyle = lg; g.fillRect(0, 0, w, h); g.restore();
    shade(0, 0, w, h, '20,24,40', 0.18);
    g.save(); g.translate(-camX, -camY);
    // the handrail on the wall: a tube with its brackets and its shadow, parallel to the stairs
    const railY = x => -(x / SW) * SH - 52;
    for (let x = camX - 4; x < camX + w + 4; x++) { const y = Math.round(railY(x)); R(x, y + 5, 1, 1, '#454c49'); R(x, y, 1, 1, '#e9edf0'); R(x, y + 1, 1, 1, '#b9bfc5'); R(x, y + 2, 1, 1, '#7a8088'); }
    for (let k = Math.floor(camX / 60) - 1; k < Math.floor((camX + w) / 60) + 2; k++) { const x = k * 60, y = Math.round(railY(x)); R(x, y + 3, 2, 4, '#7a8088'); R(x - 2, y + 7, 6, 2, '#5a6066'); }
    // the far leg (in shadow) behind the near one
    const knee = (foot, hx, hy) => { const [ax, ay] = foot, L1 = 23, L2 = 23, dx = ax - hx, dy = ay - 3 - hy, d = Math.min(L1 + L2 - 0.5, Math.hypot(dx, dy)), a = Math.atan2(dy, dx), k = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1)); return [hx + Math.cos(a - k) * L1, hy + Math.sin(a - k) * L1]; };
    const kf = knee(far, hipX - 3, hipY + 1);
    legSide(hipX - 3, hipY + 1, kf[0], kf[1], far[0], far[1], ['#2c3036', '#1e2126', '#383d44', '#191b1f']);
    spr('sneaker', Math.round(far[0]) - 6, Math.round(far[1]) - 9, { pal: { ...SNEAK, n: '#1e1e22', m: '#2e2e34', w: '#c9c4ba', O: '#a9a49a' } });
    // the stairs: stone treads with a ribbed metal nosing and a yellow line, risers in the shadow of the nosing, a little wear
    for (let k = n - 4; k < n + 6; k++) {
      const x = k * SW, y = treadY(k);
      R(x, y, SW, 220, '#4a4c56'); R(x, y + 4, SW, 3, '#34353e'); R(x, y + 7, SW, 6, '#42444e');
      for (let q = 0; q < 5; q++) if (rnd(k, q) < 0.7) R(x + 2 + Math.floor(rnd(q, k) * (SW - 4)), y + 8 + Math.floor(rnd(k * 3, q) * 4), 2, 1, '#50525c');
      R(x, y, SW, 4, '#8a8d98'); R(x, y, SW, 1, '#c3c6cf'); R(x + SW - 6, y + 1, 6, 3, '#7c7f8a');
      R(x, y - 1, 7, 2, '#9aa0a6'); R(x + 1, y - 1, 1, 1, '#5a6066'); R(x + 3, y - 1, 1, 1, '#5a6066'); R(x + 5, y - 1, 1, 1, '#5a6066'); R(x + 8, y, 2, 1, '#d9b84a');
      R(x, y, 1, SH, '#5a5c66');
    }
    // the near foot's shadow on its tread, then the near leg and sneaker
    for (const ft of [near, far]) { const k = Math.round(ft[0] / SW - 0.43), ty0 = treadY(k), lift = ty0 - ft[1]; if (lift >= 0 && lift < 16) { g.fillStyle = `rgba(10,10,20,${0.35 - lift * 0.02})`; g.fillRect(Math.round(ft[0]) - 6 + Math.round(lift * 0.3), ty0, 18 - Math.round(lift * 0.4), 1); } }
    const kn = knee(near, hipX, hipY);
    legSide(hipX, hipY, kn[0], kn[1], near[0], near[1], ['#3a3f45', '#2a2e33', '#56606a', '#22262b']);
    spr('sneaker', Math.round(near[0]) - 6, Math.round(near[1]) - 9, { pal: SNEAK });
    g.restore();
    // the light from the exit on everything, and the corners pulled down
    light(w + 10, -10, 120, '255,200,150', 0.18);
    vig(w, h, 0.5);
  });
  bars();
  for (let k = 0; k < 8; k++) if (s >= k + 1) cue('kstep' + k, () => noiseS(now(), 'lowpass', 700, 0.07, 0.07));
  blackout(W, H, u < 0.4 ? 1 - u / 0.4 : 0);
}
// 하은 from behind, waist up, at 3x: cap from behind (the snapback strap and the ponytail through its opening), the nape,
// black long sleeves with the arms swinging a little each step, the vest's back with two reflective bands, the bag strap;
// backlit by the exit ahead of her
function haeunBackBust(cx, top, t, step, ph) {
  const red = '#c23d33', redD = '#8e2c25', redL = '#e86452', hair = '#3e2a21', hairL = '#5e4434', sleeve = '#19171a', vest = '#5fa3be', vestD = '#4a87a0', band = '#cfc9b0';
  const armL = step ? -2 : 1, armR = step ? 1 : -2;
  // arms at the sides, swinging
  limb(cx - 17, top + 24, 7, cx - 20, top + 44 + armL, 6, sleeve); limb(cx + 17, top + 24, 7, cx + 20, top + 44 + armR, 6, sleeve);
  R(cx - 21, top + 30 + armL, 1, 10, '#3a3436'); R(cx + 20, top + 30 + armR, 1, 10, '#3a3436');
  // shoulders and back: black long sleeve at the shoulders, the vest over the back
  polyFill([[cx - 6, top + 19], [cx + 6, top + 19], [cx + 17, top + 22], [cx + 20, top + 27], [cx + 19, top + 60], [cx - 19, top + 60], [cx - 20, top + 27], [cx - 17, top + 22]], sleeve);
  polyFill([[cx - 7, top + 21], [cx + 7, top + 21], [cx + 14, top + 24], [cx + 15, top + 60], [cx - 15, top + 60], [cx - 14, top + 24]], vest);
  R(cx - 15, top + 24, 1, 36, vestD); R(cx + 14, top + 24, 1, 36, vestD); R(cx, top + 22, 1, 38, vestD);
  R(cx - 15, top + 34, 30, 3, band); R(cx - 15, top + 37, 30, 1, '#a8a28a'); R(cx - 15, top + 44, 30, 3, band); R(cx - 15, top + 47, 30, 1, '#a8a28a');
  for (let k = 0; k < 36; k++) R(Math.round(cx - 15 + k * 0.85), top + 22 + k, 2, 1, '#26282c');
  R(cx - 17, top + 22, 5, 1, '#ffcf9a'); R(cx + 12, top + 22, 5, 1, '#ffcf9a'); R(cx - 20, top + 27, 1, 3, '#ffbf8a'); R(cx + 19, top + 27, 1, 3, '#ffbf8a');
  // the nape and neck, hair at the back of the head below the cap
  R(cx - 4, top + 12, 8, 9, '#b07a5a'); R(cx - 4, top + 12, 8, 1, '#8a5e44'); R(cx - 4, top + 12, 1, 9, '#946448'); R(cx + 3, top + 12, 1, 9, '#946448');
  polyFill([[cx - 10, top + 5], [cx + 10, top + 5], [cx + 9, top + 9], [cx + 6, top + 12], [cx + 2, top + 13], [cx - 2, top + 13], [cx - 6, top + 12], [cx - 9, top + 9]], hair);
  for (const s of [-1, 1]) for (const o of [2, 4, 6]) for (let k = 0; k <= 5; k++) R(Math.round(cx + s * lerp(o, o * 0.4, k / 5)), top + 11 - k, 1, 1, k % 3 === 1 ? hairL : '#33231c');
  R(cx - 11, top + 6, 2, 4, '#c08866'); R(cx + 9, top + 6, 2, 4, '#c08866'); R(cx - 11, top + 7, 1, 2, '#946448'); R(cx + 10, top + 7, 1, 2, '#946448');
  // the cap from behind: crown with seams to the button, the opening's arc, the strap with its snaps
  for (let y = 0; y < 9; y++) { const half = Math.round(12 * Math.sqrt(1 - Math.pow((8 - y) / 9.5, 2))); R(cx - half, top - 3 + y, half * 2, 1, red); }
  R(cx - 1, top - 4, 2, 1, redD); R(cx, top - 3, 1, 9, redD); R(cx - 6, top - 2, 1, 7, redD); R(cx + 6, top - 2, 1, 7, redD); R(cx - 8, top - 2, 6, 1, redL);
  R(cx - 12, top + 4, 24, 1, redD);
  polyFill([[cx - 5, top + 5], [cx + 5, top + 5], [cx + 4, top + 1], [cx - 4, top + 1]], hair); R(cx - 5, top + 4, 10, 1, redD);
  R(cx - 12, top - 1, 1, 6, '#ffcf9a'); R(cx - 9, top - 3, 8, 1, '#ffd8aa'); R(cx + 11, top, 1, 5, '#ffbf8a');
  // the ponytail through the opening, swinging with her steps (a little behind the beat)
  const sw = Math.sin(ph * Math.PI * 2 - 0.8) * 2;
  R(cx - 1, top + 2, 3, 2, '#f4d35e');
  for (let k = 0; k < 20; k++) { const x = cx - 2 + Math.round(sw * k / 20 + Math.sin(k * 0.4) * 0.6), wd = k < 4 ? 5 : k < 14 ? 4 : 3; R(x - (wd > 4 ? 1 : 0), top + 4 + k, wd, 1, hair); R(x + 1, top + 4 + k, 1, 1, hairL); }
}
function stairsWaist(t) {
  const climb = t * 1.6 + 3, done = Math.max(0, t - 2.4), ph = climb % 1, step = Math.floor(climb) % 2;
  shot(3, (w, h) => {
    const VX = 64, VY = 6, P = z => 1 / (1 + 0.3 * z), Y = z => VY + 58 * P(z), X = (z, s) => VX + s * 60 * P(z), CY = z => VY - 46 * P(z);
    const ztop = 9.0 - climb * 0.85;
    // the street at the top: dawn sky, a low sun, the buildings, a street lamp, birds
    dgrad(0, 0, w, h, ['#2e3f74', '#53629a', '#9a88a8', '#e8a88c', '#f6cfa0']);
    light(78, Y(ztop) - 6, 40, '255,220,160', 0.5);
    for (const [x, ww, hh] of [[8, 18, 12], [28, 12, 20], [44, 16, 9], [82, 22, 11], [108, 14, 18]]) { const yb = Y(ztop); R(x, yb - hh, ww, hh, '#433f63'); R(x, yb - hh, ww, 1, '#5a5478'); for (let j = 3; j < hh - 1; j += 3) for (let i = 2; i < ww - 1; i += 3) if (rnd(x + i, j) < 0.25) R(x + i, yb - hh + j, 1, 1, '#ffd890'); }
    R(70, Y(ztop) - 16, 1, 16, '#2a2838'); R(70, Y(ztop) - 16, 4, 1, '#2a2838');
    for (let k = 0; k < 3; k++) { const bx = 50 + k * 10 + t * 4, by = 6 + (k % 2) * 3 - t * 1.5, fl = Math.floor(t * 7 + k) % 2; R(bx, by, 1, 1, '#2a2838'); R(bx + 1, by - fl, 1, 1, '#2a2838'); R(bx - 1, by - fl, 1, 1, '#2a2838'); }
    // the exit's canopy (a lip of steel and glass over the opening)
    const cy0 = CY(ztop), xl0 = X(ztop, -1), xr0 = X(ztop, 1); R(xl0 - 2, cy0 - 3, xr0 - xl0 + 4, 3, '#2e3038'); R(xl0 - 2, cy0, xr0 - xl0 + 4, 1, '#6a6f7a');
    // ceiling, walls (perspective tile seams), fluorescent tubes on the ceiling
    g.fillStyle = '#1a1b22'; g.beginPath(); g.moveTo(-5, -5); g.lineTo(w + 5, -5); g.lineTo(xr0, cy0 - 3); g.lineTo(xl0, cy0 - 3); g.closePath(); g.fill();
    for (const s of [-1, 1]) { g.fillStyle = s < 0 ? '#3c403f' : '#353938'; g.beginPath(); g.moveTo(s < 0 ? -5 : w + 5, -5); g.lineTo(X(ztop, s), cy0 - 3); g.lineTo(X(ztop, s), Y(ztop)); g.lineTo(s < 0 ? -5 : w + 5, h + 40); g.closePath(); g.fill(); }
    for (let k = -2; k < 24; k++) { const z = k * 0.6 - (climb * 0.85 % 0.6); if (z > ztop || z < -1) continue; for (const s of [-1, 1]) { const x = Math.round(X(z, s)), y0 = CY(z), y1 = Y(z); R(x, y0, 1, y1 - y0, '#2c302f'); } }
    for (const s of [-1, 1]) for (let j = 1; j < 6; j++) { g.strokeStyle = '#2f3332'; g.lineWidth = 1; g.beginPath(); for (let z = -1; z <= ztop; z += 0.5) { const x = X(z, s), y = CY(z) + (Y(z) - CY(z)) * j / 6; z === -1 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke(); }
    for (let k = 0; k < 6; k++) { const z = k * 1.6 + 0.6 - (climb * 0.85 % 1.6); if (z > ztop - 0.3 || z < -0.5) continue; const p = P(z), y = Math.round(VY - 44 * p), x = VX, ww = Math.max(2, Math.round(20 * p)); R(x - ww / 2, y, ww, Math.max(1, Math.round(2 * p)), '#eef6f0'); light(x, y + 1, 22 * p + 4, '230,245,235', 0.18); }
    // the treads: stone, a yellow line on each nosing, the risers in shadow
    for (let k = -2; k < 30; k++) { const z = k * 0.85 - (climb * 0.85 % 0.85); if (z > ztop) break; if (z < -1.3) continue;
      const ya = Y(z + 0.85), yb = Y(z), xl = X(z, -1), xr = X(z, 1), mid = ya + (yb - ya) * 0.45;
      R(xl, ya, xr - xl, mid - ya + 1, '#3c3d47'); R(xl, mid, xr - xl, yb - mid + 1, '#6a6c76'); R(xl, mid, xr - xl, 1, '#a3a6b0'); R(xl + 2, mid + 1, xr - xl - 4, 1, '#8a7a44'); }
    // handrails: tubes along the walls with their brackets
    for (const s of [-1, 1]) { for (const [dy, c] of [[0, '#c9ced3'], [1, '#7a8088']]) { g.strokeStyle = c; g.lineWidth = 1; g.beginPath(); for (let z = -1.2; z <= ztop; z += 0.25) { const x = X(z, s) - s * 3 * P(z), y = Y(z) - 22 * P(z) + dy; z === -1.2 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke(); } }
    // the exit sign on the left wall: a green panel, the running figure, the yellow 3
    R(3, 6, 22, 10, '#101114'); R(4, 7, 20, 8, '#2a8a52'); R(8, 8, 1, 6, '#fff'); R(7, 9, 3, 1, '#fff'); R(6, 10, 1, 1, '#fff'); R(10, 10, 1, 1, '#fff'); g.fillStyle = '#f2d35a'; g.beginPath(); g.arc(18.5, 11, 3.2, 0, Math.PI * 2); g.fill(); digits('3', 17, 9, '#1b1716'); light(14, 11, 14, '90,220,150', 0.2);
    // the light pouring down the stairs from the street
    g.save(); g.globalCompositeOperation = 'lighter'; for (let k = 0; k < 4; k++) { g.fillStyle = `rgba(255,214,170,${0.05 + 0.02 * Math.sin(t * 2 + k)})`; g.beginPath(); g.moveTo(xl0 + 8 + k * 9, Y(ztop)); g.lineTo(xl0 + 12 + k * 9, Y(ztop)); g.lineTo(26 + k * 30, h); g.lineTo(14 + k * 30, h); g.closePath(); g.fill(); } g.restore();
    // her, waist up from behind, a bob and a sway with each step; going up into the light at the end
    const bob = ph < 0.5 ? 0 : 1, sway = step ? 1 : 0, up = Math.round(done * 16);
    haeunBackBust(64 + sway, 20 + bob - up, t, step, ph);
    if (done > 0) shade(0, 0, w, h, '255,226,190', 0.12 * done);
    vig(w, h, 0.45);
  });
  bars();
  if (t > 0.3) cue('birds', () => { [2600, 3100, 2800, 3300].forEach((f, i) => oscS('sine', f, now() + 0.6 + i * 0.15, 0.03, 0.12, f * 1.2)); });
  blackout(W, H, t < 0.1 ? 1 - t / 0.1 : t > 2.7 ? (t - 2.7) / 0.5 : 0);
}

// 4. 가로등 — tracking beside her along the shutters at the blue hour; the parallax layers pass at their own speeds;
//    the one streetlight left on dies as she passes beneath it
function shotLamp(u) {
  const cam = u * 30, dawn = Math.round(clamp(u / 8, 0, 1) * 16) / 16;
  shot(1, (w, h) => {
    dgrad(0, 0, w, 150, [mix('#141a33', '#24305a', dawn), mix('#2a3463', '#4a5a8e', dawn), mix('#5a4e7e', '#8a7aa4', dawn), mix('#b06e6e', '#e2a07e', dawn)]);
    for (let k = 0; k < 18; k++) { const sx = (k * 97) % w, sy = 26 + (k * 37) % 50; if ((1 - dawn) > rnd(k, 3)) R(sx, sy, 1, 1, '#c9d2f0'); }
    // far blocks, slow
    for (let k = 0; k < 9; k++) { const bw = 40 + (k * 13) % 26, bh = 40 + (k * 29) % 40, x = Math.round(k * 56 - cam * 0.15) - 20; R(x, 128 - bh, bw, bh + 10, mix('#141a30', '#3a4466', dawn)); for (let j = 0; j < Math.floor(bh / 6); j++) for (let i = 0; i < Math.floor(bw / 6); i++) if (rnd(k * 31 + i, j) < 0.12) R(x + 3 + i * 6, 128 - bh + 4 + j * 6, 2, 2, '#ffd890'); }
    // the shop row, mid speed: shutters, signs, one convenience store still lit
    const mx = cam * 0.55;
    for (let k = -1; k < 10; k++) {
      const x = Math.round(k * 74 - (mx % 74)), idx = k + Math.floor(mx / 74);
      R(x, 100, 72, 60, '#22262e'); R(x, 100, 72, 3, '#3a3d46');
      if (idx % 4 === 2) { R(x + 4, 112, 64, 48, '#f2e6b8'); light(x + 36, 136, 60, '255,236,180', 0.3); R(x + 4, 104, 64, 7, '#2f8a5a'); R(x + 8, 106, 20, 3, '#efe6d2'); for (let s = 0; s < 3; s++) R(x + 10 + s * 18, 120, 12, 30, '#d9cfa0'); }
      else { for (let yy = 112; yy < 160; yy += 3) R(x + 4, yy, 64, 2, '#3a3d46'); R(x + 4, 104, 64, 7, ['#8a3a2a', '#2c3b57', '#8a5a34', '#5a2a5a'][(idx % 4 + 4) % 4]); R(x + 8, 106, 24, 3, '#efe6d2'); }
      R(x + 72, 100, 2, 60, '#14161c');
    }
    // power lines
    for (let x = 0; x < w; x++) { R(x, 52 + Math.round(Math.sin((x + cam * 0.55) / 50) * 3), 1, 1, '#121420'); R(x, 58 + Math.round(Math.sin((x + cam * 0.55) / 50 + 1) * 3), 1, 1, '#121420'); }
    // the sidewalk, at her speed
    R(0, 160, w, 26, mix('#6a6a74', '#9a9aa4', dawn)); for (let x = -((cam) % 24); x < w; x += 24) R(Math.round(x), 160, 1, 26, mix('#56565e', '#86868e', dawn)); R(0, 172, w, 1, mix('#5e5e66', '#8e8e96', dawn)); R(0, 186, w, 6, mix('#4a4a52', '#76767e', dawn));
    // the streetlight
    const lx = Math.round(246 - cam), off = u > 4.3, flick = u > 3.4 && u < 4.3 && (Math.floor(u * 16) % 3 === 0 || (u > 4.0 && Math.floor(u * 30) % 2 === 0)), on = !off && !flick;
    R(lx - 2, 50, 4, 112, '#202228'); R(lx - 2, 50, 1, 112, '#3a3d44'); R(lx - 2, 48, 30, 3, '#202228'); R(lx + 18, 50, 12, 4, '#2a2d34'); R(lx + 19, 54, 10, 2, on ? '#fff3c8' : '#3a3d44');
    if (on) { g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createLinearGradient(0, 56, 0, 172); gr.addColorStop(0, 'rgba(255,206,140,.32)'); gr.addColorStop(1, 'rgba(255,206,140,0)'); g.fillStyle = gr; g.beginPath(); g.moveTo(lx + 19, 56); g.lineTo(lx + 29, 56); g.lineTo(lx + 74, 172); g.lineTo(lx - 26, 172); g.closePath(); g.fill(); g.restore(); light(lx + 24, 56, 30, '255,230,170', 0.55); g.fillStyle = 'rgba(255,214,150,.18)'; g.beginPath(); g.ellipse(lx + 24, 172, 46, 6, 0, 0, Math.PI * 2); g.fill(); for (let k = 0; k < 4; k++) { const a = u * 7 + k * 1.7; R(lx + 24 + Math.cos(a) * (6 + k * 3), 60 + Math.sin(a * 1.3) * 5, 1, 1, '#fff3c8'); } }
    // her, walking right; her shadow from the lamp
    const hx = 150, st = Math.floor(u / 0.27) % 2;
    if (on) { const d = hx - (lx + 24), L = Math.min(44, 8 + Math.abs(d) * 0.5); g.fillStyle = 'rgba(0,0,0,.35)'; g.beginPath(); g.ellipse(hx + Math.sign(d) * L * 0.6, 173, L, 2, 0, 0, Math.PI * 2); g.fill(); }
    haeunWalkSide(hx, 174, u, { mirror: true, pace: 0.27 });
    if (on && Math.abs(hx - lx - 24) < 50) { g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = `rgba(255,200,120,${0.2 * (1 - Math.abs(hx - lx - 24) / 50)})`; g.fillRect(hx - 16, 118, 32, 56); g.restore(); }
    // the foreground, fast and dark: a bollard, a pole
    for (const [wx, kind] of [[120, 0], [260, 1], [420, 0]]) { const x = Math.round(wx - cam * 1.8); if (kind) { R(x, 0, 14, 192, '#08090c'); R(x + 13, 0, 1, 192, '#1a1c24'); } else { R(x, 150, 12, 42, '#0a0b0e'); R(x, 150, 12, 3, '#1c1e26'); } }
    vig(w, h, 0.45);
  });
  bars();
  if (u >= 3.4) cue('buzz', () => oscS('sawtooth', 110, now(), 0.02, 0.9)); if (u >= 4.3) cue('lampoff', () => { noiseS(now(), 'highpass', 4000, 0.06, 0.05); oscS('sine', 60, now(), 0.06, 0.2); });
  for (let k = 0; k < 30; k++) if (u >= k * 0.27) cue('lstep' + k, () => noiseS(now(), 'lowpass', 520, 0.05, 0.06));
  blackout(W, H, fadeIO(u, 8, 0.5, 0.5));
}
// 5. 횡단보도 — an insert of the signal turning green, then straight down from above: one step per beep, each on the next
//    white bar, and the bar she steps on lights up and stays lit a moment, a rhythm track drawn on the road
function shotCross(u) {
  if (u < 1.6) return signalInsert(u);
  crossTop(u - 1.6);
}
function signalInsert(u) {
  const green = u > 0.55, blink = false;
  shot(1, (w, h) => {
    dgrad(0, 0, w, h, ['#1a2238', '#2a3456', '#4a4a6e']);
    light(300, 60, 140, '255,190,150', 0.12);
    R(128, 40, 4, 160, '#3a3d44');
    // the housing: two lamps stacked, each a grid of LEDs, the countdown beside
    const box = (y, on, col, glow, shape) => {
      R(150, y, 84, 70, '#16181c'); R(150, y, 84, 2, '#2c2f36'); R(146, y - 4, 92, 6, '#202227');
      R(158, y + 8, 68, 56, '#060708');
      for (let j = 0; j < 18; j++) for (let i = 0; i < 22; i++) { const lit = on && shape(i, j); R(159 + i * 3, y + 9 + j * 3, 2, 2, lit ? col : '#121416'); }
      if (on) light(192, y + 36, 70, glow, 0.35);
    };
    const man = (i, j) => { const x = i - 11, y = j; if (y >= 1 && y <= 3) return x * x + (y - 2) * (y - 2) <= 3; if (y >= 4 && y <= 10) return Math.abs(x) <= 2 || (y >= 5 && y <= 6 && Math.abs(x) <= 5 && x !== 0); if (y > 10) return (x >= -3 && x <= -1 && y - 10 <= 7 && x <= -1 + (y - 10) * -0.4) || (x >= 1 && x <= 3 + (y - 10) * 0.5 && x >= 1 + (y - 10) * 0.4); return false; };
    const walk = (i, j) => { const x = i - 11, y = j; if (y >= 1 && y <= 3) return (x + 1) * (x + 1) + (y - 2) * (y - 2) <= 3; if (y >= 4 && y <= 10) return Math.abs(x) <= 2 || (y === 5 && x >= -6 && x <= -3) || (y === 6 && x >= -7 && x <= -6) || (y === 6 && x >= 3 && x <= 5) || (y === 7 && x === 6); if (y > 10) { const k = y - 10; return (Math.abs(x + 1 + k * 0.7) <= 1.2) || (Math.abs(x - 1 - k * 0.6) <= 1.2); } return false; };
    box(32, !green, '#ff4a3d', '255,74,61', man);
    box(108, green && !blink, '#3fe08a', '63,224,138', walk);
    // the countdown
    R(242, 112, 34, 40, '#16181c'); R(246, 116, 26, 32, '#060708'); if (green) digits('9', 250, 120, '#ff8a3d', 6);
    vig(w, h, 0.5);
  });
  bars();
  if (u > 0.55) cue('sig-on', () => { oscS('sine', 1200, now(), 0.05, 0.08); oscS('sine', 1200, now() + 0.25, 0.05, 0.08); });
  blackout(W, H, u < 0.3 ? 1 - u / 0.3 : 0);
}
function crossTop(t) {
  const beat = 0.5, start = 0.6, steps = Math.floor((t - start) / beat), ph = ((t - start) / beat) % 1, hurry = t > 5.2;
  shot(2, (w, h) => {
    // asphalt with grain, the kerbs and their tactile paving, the double centre line, the stop line, the crossing's bars
    g.drawImage(layer('asphalt', w, h, () => { R(0, 0, w, h, '#2e2f36'); for (let y = 0; y < h; y += 2) for (let x = (y / 2) % 2; x < w; x += 3) if (rnd(x, y) < 0.18) R(x, y, 1, 1, rnd(y, x) < 0.5 ? '#383a42' : '#26272d'); }), 0, 0);
    R(0, 12, w, 14, '#8d8f96'); dfill(0, 12, w, 14, '#9da0a6', 0.3); R(0, 26, w, 2, '#6a6c72'); R(0, 82, w, 2, '#6a6c72'); R(0, 84, w, 12, '#8d8f96'); dfill(0, 84, w, 12, '#9da0a6', 0.3);
    for (let x = 74; x < 120; x += 3) { R(x, 22, 2, 2, '#d9b84a'); R(x, 86, 2, 2, '#d9b84a'); }
    for (let x = 0; x < w; x += 1) if (x < 66 || x > 126) { R(x, 53, 1, 1, '#d9a83a'); R(x, 56, 1, 1, '#d9a83a'); }
    R(64, 30, 2, 22, '#d9d4c6'); R(126, 58, 2, 22, '#d9d4c6');
    const bars0 = []; for (let y = 31; y < 80; y += 8) bars0.push(y);
    bars0.forEach(y => { R(74, y, 46, 4, '#d4cfc1'); for (let k = 0; k < 10; k++) if (rnd(y, k) < 0.5) R(74 + Math.floor(rnd(k, y) * 44), y + Math.floor(rnd(y * 3, k) * 4), 2, 1, '#b2ad9f'); });
    // the bars she has stepped on, still glowing
    bars0.forEach((y, i) => { const at = start + i * beat + beat, age = t - at; if (age >= 0) { const a = Math.max(0, 0.55 - age * 0.18); g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = `rgba(255,233,168,${a})`; g.fillRect(74, y, 46, 4); g.restore(); if (age < 0.25) light(97, y + 2, 30, '255,233,168', 0.4 * (1 - age / 0.25)); } });
    // a car at the stop line, from above, its headlights across the road
    const car = (x, y, c, flip) => { g.save(); if (flip) { g.translate(x * 2 + 30, 0); g.scale(-1, 1); } R(x, y, 30, 16, c); R(x + 1, y - 1, 28, 1, c); R(x + 1, y + 16, 28, 1, c); R(x + 8, y + 2, 16, 12, mix(c, '#000000', 0.25)); R(x + 19, y + 2, 5, 12, '#9fb8c8'); R(x + 8, y + 2, 3, 12, '#6f8898'); R(x + 29, y + 1, 2, 3, '#fff3c8'); R(x + 29, y + 12, 2, 3, '#fff3c8'); R(x - 1, y + 1, 1, 3, '#d8463b'); R(x - 1, y + 12, 1, 3, '#d8463b'); g.restore(); };
    car(30, 33, '#3a4a6a', false); g.save(); g.globalCompositeOperation = 'lighter'; const hl = g.createLinearGradient(60, 0, 120, 0); hl.addColorStop(0, 'rgba(255,240,200,.22)'); hl.addColorStop(1, 'rgba(255,240,200,0)'); g.fillStyle = hl; g.beginPath(); g.moveTo(60, 34); g.lineTo(120, 28); g.lineTo(120, 54); g.lineTo(60, 48); g.closePath(); g.fill(); g.restore();
    car(140, 60, '#8a3a2a', true);
    // the signal pole on the far kerb, its green glow on the ground, blinking at the end
    const on = !hurry || Math.floor(t / 0.25) % 2 === 0;
    g.fillStyle = '#4a4d54'; g.beginPath(); g.arc(128.5, 89.5, 2.5, 0, Math.PI * 2); g.fill(); if (on) light(128, 89, 14, '63,224,138', 0.45);
    // 하은 from above: shadow, shoulders and vest, the swinging arms, the cap and brim, the ponytail
    const prog = clamp((t - start) / beat, 0, 10.2), y = Math.round(16 + prog * 8 - (ph < 0.5 ? 0 : 0)), x = 97, step = steps % 2;
    g.fillStyle = 'rgba(0,0,0,.35)'; g.beginPath(); g.ellipse(x + 3, y + 3, 7, 5, 0, 0, Math.PI * 2); g.fill();
    const sw = Math.sin(ph * Math.PI) * (step ? 1 : -1), foot = Math.round(4 * Math.cos(ph * Math.PI));
    R(x - 4, y + 2 + (step ? foot : -foot), 3, 4, '#1e1a1a'); R(x + 1, y + 2 + (step ? -foot : foot), 3, 4, '#1e1a1a');
    R(x - 7, y - 3 + Math.round(sw * 2), 3, 6, '#1e1a1a'); R(x - 7, y + 3 + Math.round(sw * 2), 3, 2, '#2a2d31'); R(x + 4, y - 3 - Math.round(sw * 2), 3, 6, '#1e1a1a'); R(x + 4, y + 3 - Math.round(sw * 2), 3, 2, '#2a2d31');
    R(x - 5, y - 4, 10, 7, '#1e1a1a'); R(x - 4, y - 4, 8, 6, '#7ec8e3'); R(x - 4, y - 1, 8, 1, '#ebe5c9'); R(x - 1, y - 4, 2, 6, '#5aa6c4');
    R(x - 1, y - 11 + Math.round(sw), 2, 6, '#4a3328'); R(x, y - 11 + Math.round(sw), 1, 5, '#6b4a3a');
    g.fillStyle = '#a83328'; g.beginPath(); g.arc(x + 0.5, y - 3.5, 4.5, 0, Math.PI * 2); g.fill(); g.fillStyle = '#d8463b'; g.beginPath(); g.arc(x + 0.5, y - 4, 3.6, 0, Math.PI * 2); g.fill(); R(x - 1, y - 6, 2, 2, '#ef6a55'); R(x, y - 4, 1, 1, '#a83328');
    R(x - 3, y + 1, 7, 2, '#1e1a1a'); R(x - 2, y + 3, 5, 1, '#1e1a1a');
    vig(w, h, 0.35);
  });
  bars();
  for (let k = 0; k < 16; k++) { const at = 0.6 + k * 0.5; if (t >= at && (k < 11)) cue('beep' + k, () => oscS('sine', 1200, now(), 0.045, 0.07)); }
  if (t > 5.2) for (let k = 0; k < 6; k++) if (t >= 5.2 + k * 0.25) cue('beepf' + k, () => oscS('sine', 1500, now(), 0.04, 0.05));
  for (let k = 0; k < 11; k++) if (t >= 0.6 + k * 0.5 + 0.5) cue('cstep' + k, () => noiseS(now(), 'lowpass', 520, 0.06, 0.06));
  blackout(W, H, t > 5.9 ? (t - 5.9) / 0.5 : 0);
}

// 6. 웅덩이 — low on the wet road: the hospital upside down in a puddle, her shoe breaks it, the camera tilts up to the real thing
function hospitalFront() {
  return layer('hospital', 192, 104, (w, h) => {
    dgrad(0, 0, w, 104, ['#33467c', '#5a6a9e', '#a890a6', '#e6b496']);
    R(150, 20, 42, 84, '#2a2f44'); R(0, 34, 30, 70, '#2a2f44'); for (let k = 0; k < 14; k++) if (rnd(k, 9) < 0.5) R(154 + (k % 4) * 9, 26 + Math.floor(k / 4) * 10, 3, 3, '#ffd890');
    R(34, 26, 124, 78, '#d9e0e4'); R(34, 26, 124, 2, '#b9c4c8'); R(34, 26, 2, 78, '#eef2f4'); R(156, 26, 2, 78, '#a9b4b8');
    for (let y = 32; y < 66; y += 8) for (let x = 40; x < 152; x += 10) { const lit = rnd(x, y) < 0.3; R(x, y, 7, 5, lit ? '#ffe9a8' : '#2f3a4a'); R(x, y, 7, 1, lit ? '#fff6d8' : '#4a5a6e'); }
    R(84, 4, 24, 20, '#e9eef0'); R(84, 4, 24, 1, '#ffffff'); R(91, 6, 10, 16, '#d8463b'); R(87, 10, 18, 8, '#d8463b'); R(92, 7, 2, 3, '#ef6a55');
    R(58, 68, 76, 11, '#1b1716'); hospName(66, 68, '#ffffff', 8);
    R(66, 82, 60, 22, '#9aa0a6'); R(68, 84, 56, 20, '#fff3c8'); R(95, 84, 2, 20, '#9aa0a6'); R(60, 80, 72, 3, '#5a6066');
  });
}
function shotPuddle(u) {
  const tilt = ease(clamp((u - 3.0) / 2.0, 0, 1)), camY = Math.round(lerp(106, -4, tilt));
  shot(2, (w, h) => {
    const bld = hospitalFront(), GY = 104;
    g.save(); g.translate(0, -camY);
    R(0, -20, w, 20, '#33467c'); g.drawImage(bld, 0, 0); light(96, 14, 34, '216,70,59', 0.4); light(96, 94, 46, '255,236,170', 0.3);
    // the road: wet asphalt, the kerb at the horizon, a sheen from the building's light
    g.drawImage(layer('wetroad', w, 120, () => { R(0, 0, w, 120, '#25262d'); for (let y = 0; y < 120; y += 2) for (let x = (y / 2) % 3; x < w; x += 3) if (rnd(x, y) < 0.16) R(x, y, 1, 1, '#32333b'); }), 0, GY);
    R(0, GY, w, 2, '#4a4c54');
    // the puddle: near rows reflect the top of the building (the cross), far rows its foot; rippled after her step
    const cx = 100, cy = GY + 50, rx = 66, ry = 22;
    for (let y = cy - ry; y <= cy + ry; y++) {
      const dy = (y - cy) / ry, wob = Math.round(Math.sin(y * 1.7) * 2), half = Math.round(rx * Math.sqrt(Math.max(0, 1 - dy * dy))) + wob; if (half <= 2) continue;
      const src = Math.round(GY - 2 - (y - (cy - ry)) * (GY / (2 * ry)));
      let dx = 0; for (const t0 of [1.6, 2.5]) { const a = u - t0; if (a > 0 && a < 2.4) dx += Math.round(Math.sin(y * 0.8 - a * 11) * 3 * Math.exp(-a * 1.3)); }
      if (src >= 0 && src < GY) g.drawImage(bld, cx - half - dx, src, half * 2, 1, cx - half, y, half * 2, 1); else R(cx - half, y, half * 2, 1, '#33467c');
      R(cx - half, y, 1, 1, '#4a5068'); R(cx + half - 1, y, 1, 1, '#4a5068');
    }
    g.save(); g.beginPath(); g.ellipse(cx, cy, rx + 2, ry, 0, 0, Math.PI * 2); g.clip(); shade(cx - rx - 3, cy - ry, rx * 2 + 6, ry * 2 + 1, '16,22,40', 0.38); light(cx, cy + 10, 30, '216,70,59', 0.18); g.restore();
    for (const t0 of [1.6, 2.5]) { const a = u - t0; if (a > 0 && a < 1.8) { g.strokeStyle = `rgba(210,230,255,${0.55 * (1 - a / 1.8)})`; g.lineWidth = 1; g.beginPath(); g.ellipse(112, cy + 8, 3 + a * 40, (3 + a * 40) * 0.3, 0, 0, Math.PI * 2); g.stroke(); } }
    // her shoe, side on: it comes down into the water and lifts away
    if (u > 1.0 && u < 3.3) {
      const d = u - 1.0, down = clamp(d / 0.6, 0, 1), upp = clamp((u - 2.4) / 0.7, 0, 1), sx = Math.round(lerp(84, 98, down) + upp * 50), sy = Math.round(lerp(GY + 10, cy + 10, ease(down)) - upp * 46);
      R(sx + 4, sy - 44, 9, 38, '#3a3f45'); R(sx + 4, sy - 44, 1, 38, '#4a5058'); R(sx + 12, sy - 44, 1, 38, '#2a2e33'); R(sx + 5, sy - 8, 8, 3, '#2a2e33');
      R(sx + 2, sy - 6, 16, 3, '#1e1a1a'); R(sx, sy - 3, 26, 3, '#1e1a1a'); R(sx + 18, sy - 4, 7, 1, '#2a2d31'); R(sx + 21, sy - 5, 3, 1, '#2a2d31');
      for (let k = 0; k < 3; k++) R(sx + 8 + k * 3, sy - 6, 2, 1, '#efe6d2');
      R(sx, sy, 27, 2, '#d9d4c6'); R(sx + 1, sy + 2, 25, 1, '#a9a49a'); R(sx + 2, sy - 2, 3, 1, '#3a3236');
      if (d > 0.55 && d < 1.2) { const s = (d - 0.55) / 0.65; for (let k = 0; k < 10; k++) { const a = -Math.PI * (0.08 + 0.84 * k / 9); R(112 + Math.cos(a) * s * 30, cy + 8 + Math.sin(a) * s * 22 + s * s * 26, 2, 1, '#cfe6ff'); } }
    }
    g.restore();
    vig(w, h, 0.4);
  });
  bars();
  if (u >= 1.6) cue('splash', () => { noiseS(now(), 'bandpass', 1400, 0.14, 0.2, 1); noiseS(now() + 0.05, 'highpass', 3000, 0.05, 0.25); });
  if (u >= 2.5) cue('splash2', () => noiseS(now(), 'bandpass', 1800, 0.06, 0.15, 1));
  blackout(W, H, fadeIO(u, 6, 0.4, 0.5));
}
// 7. 복도 — over her shoulder down a dark ward corridor; the ceiling panels come on one per heartbeat toward the doctor at the
//    far end; then the reverse shot of him, and her profile under the brim for the one word
function shotCorridor(u) {
  if (u < 7.6) corridorOTS(u); else if (u < 10.8) doctorMCU(u - 7.6); else haeunCU(u - 10.8);
  subtitle(u, 7.8, 9.3, '어머님 박자가 오늘 좀 흔들려요.', 'doc');
  subtitle(u, 9.3, 10.8, '옆에서 같이 맞춰 주세요.', 'doc');
  subtitle(u, 11.0, 11.95, '…네.', 'haeun');
}
const LAMP_AT = k => 0.8 + k * 0.9;
function corridorOTS(u) {
  shot(2, (w, h) => {
    const VX = 118, VY = 46, P = z => 1 / (1 + 0.55 * z);
    const lit = k => u >= LAMP_AT(k), litA = k => clamp((u - LAMP_AT(k)) / 0.12, 0, 1);
    // floor, walls, ceiling: four trapezoids into the dark
    const zf = 12, fx = s => VX + s * 90 * P(zf), fyB = VY + 50 * P(zf), fyT = VY - 34 * P(zf);
    R(0, 0, w, h, '#0b100e');
    g.fillStyle = '#18211e'; g.beginPath(); g.moveTo(-20, h); g.lineTo(w + 40, h); g.lineTo(fx(1), fyB); g.lineTo(fx(-1), fyB); g.closePath(); g.fill();
    g.fillStyle = '#111815'; g.beginPath(); g.moveTo(-20, 0); g.lineTo(w + 40, 0); g.lineTo(fx(1), fyT); g.lineTo(fx(-1), fyT); g.closePath(); g.fill();
    for (const s of [-1, 1]) { g.fillStyle = '#141c19'; g.beginPath(); g.moveTo(s < 0 ? -20 : w + 40, 0); g.lineTo(fx(s), fyT); g.lineTo(fx(s), fyB); g.lineTo(s < 0 ? -20 : w + 40, h); g.closePath(); g.fill(); }
    R(fx(-1), fyT, fx(1) - fx(-1), fyB - fyT, '#050706');
    // doors, rails and the floor's seams in perspective
    for (let z = 0.5; z < zf; z += 1.3) { const p = P(z); for (const s of [-1, 1]) { const x = VX + s * 90 * p, y0 = VY - 10 * p, y1 = VY + 50 * p; R(Math.round(x - (s > 0 ? 0 : 0)), y0, Math.max(1, Math.round(10 * p)) * (s > 0 ? 1 : 1), y1 - y0, '#1d2824'); R(Math.round(x + s * 2 * p), y0 + 6 * p, Math.max(1, Math.round(4 * p)), Math.round(8 * p), '#2a3a34'); } }
    for (const s of [-1, 1]) { g.strokeStyle = '#2c3a35'; g.beginPath(); g.moveTo(VX + s * 300, VY + 20 * 3.3); g.lineTo(fx(s), VY + 20 * P(zf)); g.stroke(); }
    for (let z = 0.4; z < zf; z += 0.8) { const y = VY + 50 * P(z); R(VX - 90 * P(z), y, 180 * P(z), 1, '#1c2622'); }
    // the seven ceiling panels, near to far; each one lit lights its stretch of floor and leaves a smear in the polish
    for (let k = 0; k < 7; k++) {
      const z = 0.9 + k * 1.45, p = P(z), x = VX, y = VY - 34 * p, pw = Math.max(2, Math.round(36 * p)), a = litA(k);
      R(x - pw / 2, y, pw, Math.max(1, Math.round(4 * p)), a > 0 ? '#eef6ea' : '#202a26');
      if (a > 0) {
        light(x, y + 2, 40 * p + 6, '220,240,215', 0.14 * a);
        g.save(); g.globalCompositeOperation = 'lighter'; const fy = VY + 50 * p, gr = g.createLinearGradient(0, y, 0, fy); gr.addColorStop(0, `rgba(210,235,205,${0.07 * a})`); gr.addColorStop(1, `rgba(210,235,205,${0.02 * a})`); g.fillStyle = gr; g.beginPath(); g.moveTo(x - pw / 2, y); g.lineTo(x + pw / 2, y); g.lineTo(x + 70 * p, fy); g.lineTo(x - 70 * p, fy); g.closePath(); g.fill(); g.restore();
        const fy2 = Math.round(VY + 50 * p + 1); g.save(); g.globalAlpha = 0.5 * a; R(x - Math.round(pw / 4), fy2, Math.max(1, Math.round(pw / 2)), 1, '#9fb8a8'); R(x - Math.round(pw / 6), fy2 + 2, Math.max(1, Math.round(pw / 3)), 1, '#7f9a88'); g.restore();
      }
    }
    // the doctor, far, under the seventh panel; he starts walking once it is on
    const dz = u < LAMP_AT(6) + 0.3 ? 9.6 : 9.6 - (u - LAMP_AT(6) - 0.3) * 1.9, dp = P(dz), dy = VY + 50 * dp, dh = Math.round(66 * dp), dwid = Math.max(3, Math.round(18 * dp));
    if (u > LAMP_AT(6) - 0.2) { const a = clamp((u - LAMP_AT(6) + 0.2) / 0.3, 0, 1); g.save(); g.globalAlpha = a; R(VX - dwid / 2, dy - dh * 0.62, dwid, dh * 0.5, '#e8ece6'); R(VX - dwid / 2 + 1, dy - dh * 0.62, Math.max(1, dwid - 2), Math.max(1, dh * 0.16), '#3a4a44'); R(VX - dwid / 3, dy - dh, Math.round(dwid * 0.66), Math.round(dh * 0.38), '#d9a27a'); R(VX - dwid / 3, dy - dh, Math.round(dwid * 0.66), Math.max(1, Math.round(dh * 0.12)), '#2a2220'); const st = Math.floor(u / 0.3) % 2; R(VX - dwid / 2 + (st ? 1 : 0), dy - dh * 0.12, Math.max(1, dwid / 3), dh * 0.12, '#3a3f45'); R(VX + dwid / 6 - (st ? 1 : 0), dy - dh * 0.12, Math.max(1, dwid / 3), dh * 0.12, '#3a3f45'); g.restore(); }
    // her, close, from behind and in shadow, the light rimming the cap
    haeunBack(30, 38, 0, 0, { tint: ['#0e1412', 0.62] });
    const rim = clamp((lit(0) ? 0.5 : 0) + (lit(2) ? 0.3 : 0), 0, 1); if (rim > 0) { g.save(); g.globalAlpha = rim; R(36, 38, 8, 1, '#cfe8d0'); R(34, 39, 2, 1, '#cfe8d0'); R(47, 56, 2, 8, '#9fc0a8'); g.restore(); }
    vig(w, h, 0.5);
  });
  bars();
  for (let k = 0; k < 7; k++) if (u >= LAMP_AT(k)) cue('lamp' + k, () => { SND.heart(); noiseS(now(), 'highpass', 5000, 0.03, 0.04); });
  blackout(W, H, u < 0.5 ? 1 - u / 0.5 : 0);
}
function doctorMCU(t) {
  shot(2, (w, h) => {
    // behind him: the corridor, the lit panels as soft discs receding
    dgrad(0, 0, w, h, ['#0d1311', '#1a2420', '#1f2a26', '#141c19']);
    for (let k = 0; k < 6; k++) light(30 + k * 9, 30 - k * 2, 18 - k * 2, '220,240,215', 0.25);
    light(40, 26, 50, '200,230,200', 0.12);
    R(0, 80, w, 16, '#16201c');
    // him: coat shoulders, scrubs, stethoscope, a name tag, the head; light from above
    const x = 108, top = 22, talk = (Math.floor(t * 7) % 3 === 0) && ((t > 0.2 && t < 1.6) || (t > 1.8 && t < 3.1)), blink = t > 1.2 && t < 1.32;
    g.fillStyle = '#e9ece6'; g.beginPath(); g.moveTo(x - 12, top + 20); g.lineTo(x + 12, top + 20); g.lineTo(x + 28, top + 28); g.lineTo(x + 33, top + 40); g.lineTo(x + 34, top + 90); g.lineTo(x - 34, top + 90); g.lineTo(x - 33, top + 40); g.lineTo(x - 28, top + 28); g.closePath(); g.fill(); g.fillStyle = '#c9cdc8'; g.fillRect(x - 34, top + 44, 4, 46); g.fillStyle = '#b9bdb8'; g.fillRect(x + 30, top + 44, 4, 46); R(x - 27, top + 28, 14, 1, '#ffffff'); R(x + 13, top + 28, 14, 1, '#ffffff');
    g.fillStyle = '#4f8f8a'; g.beginPath(); g.moveTo(x - 9, top + 22); g.lineTo(x + 9, top + 22); g.lineTo(x, top + 44); g.closePath(); g.fill();
    g.fillStyle = '#d5d9d3'; g.beginPath(); g.moveTo(x - 9, top + 22); g.lineTo(x - 14, top + 24); g.lineTo(x - 2, top + 60); g.lineTo(x, top + 44); g.closePath(); g.fill(); g.beginPath(); g.moveTo(x + 9, top + 22); g.lineTo(x + 14, top + 24); g.lineTo(x + 2, top + 60); g.lineTo(x, top + 44); g.closePath(); g.fill();
    R(x - 1, top + 50, 2, 2, '#9aa0a6'); R(x - 1, top + 62, 2, 2, '#9aa0a6');
    g.strokeStyle = '#2b2e31'; g.lineWidth = 2; g.beginPath(); g.moveTo(x - 8, top + 20); g.quadraticCurveTo(x - 14, top + 36, x - 12, top + 46); g.moveTo(x + 8, top + 20); g.quadraticCurveTo(x + 13, top + 34, x + 10, top + 42); g.stroke(); g.fillStyle = '#c9ccd2'; g.beginPath(); g.arc(x - 12, top + 48, 3, 0, Math.PI * 2); g.fill(); R(x - 13, top + 47, 2, 1, '#ffffff');
    R(x + 14, top + 34, 10, 6, '#ffffff'); R(x + 15, top + 35, 3, 4, '#2f6f8a'); R(x + 19, top + 36, 4, 1, '#8a8a8a'); R(x + 19, top + 38, 3, 1, '#8a8a8a'); R(x - 24, top + 36, 2, 7, '#2f6f8a'); R(x - 21, top + 36, 2, 6, '#d8463b');
    R(x - 4, top + 17, 8, 6, '#b98260');
    spr('docHead', x - 8, top);
    if (blink) { R(x - 6, top + 9, 4, 1, '#b98260'); R(x + 3, top + 9, 4, 1, '#b98260'); }
    if (talk) R(x - 2, top + 15, 4, 1, '#3a1f1a');
    light(x, top - 6, 40, '230,245,225', 0.22);
    vig(w, h, 0.45);
  });
  bars();
  blackout(W, H, t < 0.12 ? 1 - t / 0.12 : 0);
}
function haeunCU(t) {
  shot(3, (w, h) => {
    dgrad(0, 0, w, h, ['#0b100e', '#141c19', '#18221e']);
    light(118, 20, 30, '220,240,215', 0.3); light(104, 30, 16, '220,240,215', 0.2);
    const nod = t > 0.35 && t < 0.75 ? 1 : 0;
    spr('hProfile', 36, 12 + nod);
    // the light from the corridor catches the brim's edge, the tip of the nose, the lips
    R(64, 22 + nod, 9, 1, '#5a4a48'); R(65, 30 + nod, 1, 1, '#f2c8a8'); R(62, 34 + nod, 1, 1, '#e8a8a0');
    vig(w, h, 0.55);
  });
  bars();
  blackout(W, H, t > 0.8 ? (t - 0.8) / 0.4 : 0);
}

// 8. 손 — straight down onto the blanket: her mother's thin hand with the clip on its finger; hers comes up from below and
//    covers it; the monitor's green pulses over both; the old thumb moves once, twice
function shotHands(u) {
  shot(3, (w, h) => {
    const beatP = (u % 1), pulse = Math.max(0, 1 - beatP * 3);
    // the blanket: weave, two folds
    R(0, 0, w, h, '#a9bfd6'); for (let y = 0; y < h; y += 2) for (let x = (y / 2) % 2; x < w; x += 2) R(x, y, 1, 1, '#b4c9de');
    for (let k = 0; k < 2; k++) { const y0 = 16 + k * 30; for (let x = 0; x < w; x++) { const y = y0 + Math.round(Math.sin(x / 18 + k) * 3 + x * 0.12); R(x, y, 1, 2, '#93aac4'); R(x, y - 1, 1, 1, '#c6d7e8'); } }
    g.save(); g.translate(22, 2);
    // the mother's hand, the IV tape on its back, the clip and its cable
    const thumb = (u > 4.2 && u < 4.6) || (u > 5.4 && u < 5.8) ? 1 : 0;
    const MOM = { Q: '#dcb393', I: '#b98d6e', K: '#8e6650', Z: '#c49a80', N: '#ecd2bf', F: '#cfdfee' };
    spr('hand', 14, 22, { pal: MOM });
    if (thumb) { R(26, 21, 12, 2, '#dcb393'); R(27, 20, 9, 1, '#b98d6e'); }
    for (let y = 22; y < 41; y++) if ((y % 4) < 2) R(14, y, 9, 1, '#bcd0e4');
    R(30, 30, 9, 5, '#f4f1ea'); R(31, 31, 7, 3, '#e6e2d8'); R(33, 32, 3, 1, '#9fb8c8'); R(36, 29, 1, 3, '#dfe6ea');
    R(45, 25, 7, 6, '#d8dde0'); R(45, 25, 7, 2, '#3a3f45'); R(52, 27, 3, 2, '#3a3f45'); for (let x = 55; x < w; x++) R(x, 28 - Math.round((x - 55) * 0.22), 1, 1, '#e3e7ea');
    light(48, 28, 5 + pulse * 2, '255,74,61', 0.3 + 0.25 * pulse);
    // her hand: up from the bottom of the frame, fingers up, the sleeve, the watch
    const p = ease(clamp((u - 1.0) / 1.8, 0, 1)), hx = 38, hy = Math.round(lerp(98, 46, p));
    const HER = { Q: '#e2b48c', I: '#c0906a', K: '#a3765a', Z: '#e2b48c', N: '#f2d6c4', F: '#1e1a1a' };
    sprRot('hand', hx, hy, -Math.PI / 2, 18, 9, { pal: HER });
    R(hx - 9, hy + 10, 20, 5, '#c9ccd2'); R(hx - 6, hy + 11, 14, 3, '#1b1716'); R(hx - 4, hy + 12, 2, 1, '#8fd694'); R(hx - 1, hy + 12, 2, 1, '#8fd694'); R(hx + 2, hy + 12, 2, 1, '#8fd694');
    g.restore();
    // the monitor's green, beating over everything
    g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = `rgba(143,214,148,${0.05 + 0.1 * pulse})`; g.fillRect(0, 0, w, h); g.restore();
    vig(w, h, 0.5);
  });
  bars();
  for (let k = 0; k < 9; k++) if (u >= k) cue('hb-close' + k, SND.heart);
  subtitle(u, 4.3, 5.9, '…밥은 먹었니.', 'mom');
  subtitle(u, 6.0, 7.5, '회식. 공짜.', 'haeun');
  blackout(W, H, fadeIO(u, 8, 0.6, 0.6));
}
// 9·10. 병실 — the ward at night, side on: the bed, her mother asleep, 하은 on a stool holding her hand, the monitor on its arm.
//    Every fourth beat is the one to take (white). At dawn the blinds throw stripes, the monitor dims, she falls asleep on the
//    bed's edge and her mother's hand comes to rest on her cap.
const WARD = { gate: 312, px: 30, b0: 58, b1: 64, T: 24 };
const wardBeats = t => (WARD.b0 * t + (WARD.b1 - WARD.b0) * t * t / (2 * WARD.T)) / 60;
function ecgY(ph) { if (ph > 0.08 && ph < 0.16) return -1; if (ph >= 0.2 && ph < 0.22) return 1; if (ph >= 0.22 && ph < 0.245) return -9; if (ph >= 0.245 && ph < 0.27) return -4; if (ph >= 0.27 && ph < 0.3) return 3; if (ph > 0.42 && ph < 0.56) return -2; return 0; }
// draw something into a scratch canvas, then lay its pixels down turned by ang about (px, py), placed at (x, y)
let ROTC = null;
function rotDraw(draw, cw, ch, px, py, ang, x, y) {
  if (!ROTC) { ROTC = document.createElement('canvas'); ROTC.width = 96; ROTC.height = 96; }
  const o = ROTC.getContext('2d'), g0 = g; o.clearRect(0, 0, 96, 96); g = o; draw(); g = g0;
  const d = o.getImageData(0, 0, cw, ch).data, cs = Math.cos(ang), sn = Math.sin(ang), r = Math.ceil(Math.hypot(cw, ch));
  for (let yy = -r; yy <= r; yy++) for (let xx = -r; xx <= r; xx++) {
    const sx = Math.round(cs * xx + sn * yy + px), sy = Math.round(-sn * xx + cs * yy + py); if (sx < 0 || sy < 0 || sx >= cw || sy >= ch) continue;
    const i = (sy * cw + sx) * 4; if (d[i + 3] < 128) continue; g.fillStyle = `rgb(${d[i]},${d[i + 1]},${d[i + 2]})`; g.fillRect(x + xx, y + yy, 1, 1);
  }
}
function haeunSeated(cx, seatY, o = {}) {   // the game's 하은 from the hips up, facing left, on a stool; thighs forward, shins down
  const top = seatY - 38;
  g.save(); g.beginPath(); g.rect(cx - 30, top - 10, 60, 48); g.clip(); drawHaeunAt(cx, top, 0, { load: true, bob: 0, watch: o.watch }); g.restore();
  R(cx - 13, seatY - 3, 18, 5, '#3a3f45'); R(cx - 13, seatY - 3, 18, 1, '#4a5058'); R(cx - 14, seatY + 2, 6, 16, '#3a3f45'); R(cx - 9, seatY + 2, 1, 16, '#2a2e33');
  R(cx - 17, seatY + 17, 9, 3, '#1e1a1a'); R(cx - 17, seatY + 19, 9, 1, '#d9d4c6');
}
function shotWard(u, dawnK, uEnd = -1) {
  const playing = uEnd < 0, k = Math.round(dawnK * 24) / 24, beats = wardBeats(u), j = Math.floor(beats), ph = beats - j;
  const doze = uEnd > 2.4 ? ease(clamp((uEnd - 2.4) / 1.4, 0, 1)) : 0, momHand = uEnd > 4.8 ? ease(clamp((uEnd - 4.8) / 1.8, 0, 1)) : 0;
  const watch = playing && u > 7 && u < 9.6;
  shot(1, (w, h) => {
    const C2 = (a, b) => mix(a, b, k);
    // wall, wainscot, floor
    R(0, 0, w, h, C2('#1d2829', '#c4d0c8')); R(0, 132, w, 44, C2('#222e2d', '#b0bdb5')); R(0, 132, w, 2, C2('#2c3a38', '#d0dbd3')); R(0, 176, w, 16, C2('#161d1d', '#9aa59e')); R(0, 176, w, 1, C2('#2a3433', '#c0cac3'));
    // the window with its blinds
    R(22, 38, 100, 90, '#2b2f33'); dgrad(26, 42, 92, 82, [C2('#0b1530', '#7fa6d8'), C2('#1a2850', '#c8d8ea'), C2('#4a3a5a', '#f6dcc0'), C2('#8a5a4a', '#ffe8c8')]);
    for (const [x, ww, hh] of [[26, 18, 30], [46, 14, 44], [62, 22, 24], [86, 16, 38], [104, 14, 28]]) { R(x, 124 - hh, ww, hh, C2('#0f1426', '#8a9ab8')); for (let yy = 124 - hh + 3; yy < 122; yy += 5) for (let xx = x + 2; xx < x + ww - 2; xx += 4) if (rnd(xx, yy) < 0.25 * (1 - k)) R(xx, yy, 2, 2, '#ffd890'); }
    for (let y = 42; y < 124; y += 5) { R(26, y, 92, 3, C2('#3a4048', '#e8ecef')); R(26, y + 2, 92, 1, C2('#2a2f36', '#c9cfd4')); }
    R(20, 126, 104, 4, '#3a3f45'); R(70, 30, 1, 10, '#9aa0a6');
    // morning light through the slats, thrown across the wall and the bed
    if (k > 0) { g.save(); g.globalCompositeOperation = 'lighter'; for (let s = 0; s < 9; s++) { const y0 = 46 + s * 9, dx = uEnd * 3; g.fillStyle = `rgba(255,214,160,${0.18 * k})`; g.beginPath(); g.moveTo(126 + dx, y0); g.lineTo(240 + dx, y0 + 40); g.lineTo(240 + dx, y0 + 44); g.lineTo(126 + dx, y0 + 4); g.closePath(); g.fill(); } g.restore(); }
    // the curtain to the next bed
    R(290, 28, w - 290, 2, '#7a8086'); for (let x = 300; x < w; x += 8) { R(x, 30, 8, 146, C2('#26302f', '#d5ddd9')); R(x, 30, 2, 146, C2('#2f3b39', '#e6ecea')); R(x + 6, 30, 2, 146, C2('#1c2423', '#b9c4bf')); }
    R(338, 40, 2, 120, C2('#1a2120', '#a9b4af')); R(334, 40, 10, 14, C2('#1c2423', '#b9c4bf'));
    // the monitor on its arm, the trace, the numbers
    R(282, 24, 3, 22, '#3a3f45'); R(232, 44, 96, 60, '#1b1e21'); R(232, 44, 96, 2, '#3a3f45'); R(236, 48, 88, 52, '#061009');
    const mon = 1 - k * 0.65, bpm = Math.round(WARD.b0 + (WARD.b1 - WARD.b0) * clamp(u / WARD.T, 0, 1));
    g.save(); g.globalAlpha = mon;
    g.beginPath(); g.rect(238, 50, 84, 48); g.clip();
    let py = null;
    for (let x = 238; x < 322; x++) {
      const tt = u + (WARD.gate - x) / WARD.px; if (tt < 0) continue; const bb = wardBeats(tt), jj = Math.floor(bb), take = jj % 4 === 0, y = 84 + Math.round(ecgY(bb - jj) * (take ? 1.6 : 1)), c = x > WARD.gate ? '#2f6a3a' : take ? '#ffffff' : '#8fd694';
      if (py != null) R(x, Math.min(py, y), 1, Math.abs(py - y) + 1, c); else R(x, y, 1, 1, c); py = y;
    }
    g.restore(); g.save(); g.globalAlpha = mon;
    R(WARD.gate, 50, 1, 48, '#8a2a24'); digits(String(bpm), 300, 53, '#8fd694', 2); digits('94', 242, 53, '#5ad7e8');
    g.restore();
    // the IV pole
    R(214, 58, 2, 118, '#9aa0a6'); R(206, 174, 18, 2, '#9aa0a6'); R(208, 56, 14, 4, '#9aa0a6'); R(209, 60, 10, 16, C2('#bcd2d8', '#e6f0f2')); R(211, 64, 6, 10, C2('#9fc8b8', '#cfe8dc')); R(214, 76, 1, 60, '#dfe6ea');
    // the bed: head, mattress, the sleeping mother under the blanket, the rail, the legs
    R(58, 112, 6, 64, '#8e959b'); R(58, 112, 6, 2, '#b8bec4');
    R(64, 138, 190, 10, C2('#cfd8dc', '#f2f5f6'));
    R(66, 126, 36, 13, C2('#d9e0e2', '#f7f9fa')); R(66, 126, 36, 2, C2('#e9eef0', '#ffffff'));
    // her face, turned up: grey hair spread on the pillow, the closed eye, the nose, the cannula
    const br = Math.round(Math.sin(u * 1.1)); 
    R(72, 124, 14, 7, C2('#8e8a80', '#c9c2b0')); R(70, 127, 4, 6, C2('#8e8a80', '#c9c2b0')); R(80, 120, 14, 10, C2('#b38a6e', '#dcb393')); R(92, 118, 3, 4, C2('#b38a6e', '#dcb393')); R(84, 122, 4, 1, C2('#5a4030', '#8e6650')); R(88, 126, 4, 1, C2('#8e6650', '#b98d6e')); R(91, 122, 8, 1, '#dfe6ea'); R(98, 122, 1, 10, '#dfe6ea');
    g.fillStyle = C2('#5a7a96', '#a9c4de'); g.beginPath(); g.moveTo(96, 140); g.lineTo(98, 128 + br); g.lineTo(116, 126 + br); g.lineTo(150, 131); g.lineTo(220, 133); g.lineTo(236, 126); g.lineTo(248, 130); g.lineTo(252, 140); g.closePath(); g.fill();
    R(96, 128 + br, 14, 3, C2('#d9e0e2', '#f7f9fa')); for (let x = 120; x < 240; x += 14) R(x, 134, 8, 1, C2('#4a6a86', '#94b2ce'));
    R(64, 146, 190, 4, '#8e959b'); R(64, 146, 190, 1, '#c9ced3'); R(66, 150, 186, 10, C2('#4a5a66', '#c9d6de')); R(70, 160, 4, 14, '#6a7075'); R(244, 160, 4, 14, '#6a7075'); R(66, 172, 10, 4, '#2b2e31'); R(240, 172, 10, 4, '#2b2e31');
    // the mother's arm on the blanket toward her daughter (later: lifted onto the cap)
    const handX = Math.round(lerp(146, 150, momHand)), handY = Math.round(lerp(132, 122, momHand));
    thick(110, 130 + br, handX - 2, handY + 1, 3, C2('#7a9ab6', '#bcd2e6')); R(handX - 3, handY - 1, 6, 4, C2('#b38a6e', '#dcb393')); R(handX - 3, handY + 2, 6, 1, C2('#8e6650', '#b98d6e'));
    // 하은: on the stool in front of the bed, holding the hand; checks the watch; at dawn, asleep on the bed's edge
    const hx = 176, seat = 156;
    R(hx - 10, seat, 22, 3, '#5a6066'); R(hx - 8, seat + 3, 2, 17, '#4a5056'); R(hx + 8, seat + 3, 2, 17, '#4a5056'); R(hx - 9, seat + 12, 18, 1, '#4a5056');
    if (doze > 0) {
      rotDraw(() => { g.save(); g.beginPath(); g.rect(0, 0, 96, 68); g.clip(); drawHaeunAt(40, 30, 0, { load: true, bob: 0 }); g.restore(); }, 96, 72, 40, 67, -0.95 * doze, hx, seat - 2);
      R(hx - 13, seat - 3, 18, 5, '#3a3f45'); R(hx - 14, seat + 2, 6, 16, '#3a3f45'); R(hx - 17, seat + 17, 9, 3, '#1e1a1a');
    } else {
      haeunSeated(hx, seat, { watch });
      if (!watch) { const sq = playing && j % 4 === 0 && ph < 0.25 ? 1 : 0; thick(hx - 6, seat - 16, 152 - sq, 134, 3, '#1e1a1a'); R(148 - sq, 131, 5, 4, '#d9a27a'); }
    }
    // light: the monitor's green beating on the room at night; the dawn's warmth later
    const pulse = Math.max(0, 1 - ph * 4);
    shade(0, 0, w, h, '8,14,22', 0.32 * (1 - k));
    light(280, 76, 120, '143,214,148', (0.12 + 0.12 * pulse) * mon);
    if (k > 0) light(70, 80, 200, '255,226,180', 0.22 * k);
    if (playing) { const lastTake = Math.floor(beats / 4) * 4, age = (beats - lastTake) * 60 / WARD.b0; if (age < 0.5 && lastTake >= 1) judge('·', WARD.gate, 104, '#ffffff', 16, '', age); }
    vig(w, h, 0.45);
  });
  bars();
  for (let n = 0; n <= j; n++) cue('hb' + n, () => { if (!playing) { const t0 = now(); oscS('sine', 70, t0, 0.14 * (1 - k * 0.6), 0.16, 45); oscS('sine', 60, t0 + 0.18, 0.1 * (1 - k * 0.6), 0.14, 40); } else { SND.heart(); if (n % 4 === 0) SND.beep(); } });
  if (playing) blackout(W, H, u < 0.5 ? 1 - u / 0.5 : 0);
  else { blackout(W, H, uEnd > 9.3 ? (uEnd - 9.3) / 0.7 : 0); if (uEnd >= 0.2) cue('end-bird', () => { [2600, 3100, 2800].forEach((f, i) => oscS('sine', f, now() + 1 + i * 0.12, 0.03, 0.12, f * 1.2)); }); }
}

// 11. 탁자 — the last insert, straight down on the bedside table in the morning: her cap, the bill, the watch she took off,
//     a paper cup of green tea; the blinds' light drifts over them; the camera eases across; then black
function shotTable(u) {
  const cam = Math.round(lerp(0, 22, ease(clamp(u / 6.5, 0, 1))));
  let billAt = null;
  shot(2, (w, h) => {
    g.save(); g.translate(-cam, 0);
    // the wood: three planks, the grain
    for (let p = 0; p < 4; p++) { const y0 = p * 28; R(0, y0, 230, 28, ['#a47c54', '#ab845a', '#9f774f', '#a8805a'][p]); R(0, y0, 230, 1, '#7a5a3a'); for (let k = 0; k < 6; k++) { const yy = y0 + 4 + k * 4; for (let x = 0; x < 230; x++) if (Math.sin(x / (12 + k * 3) + p * 2 + k) > 0.6) R(x, yy + Math.round(Math.sin(x / 20 + k) * 1), 1, 1, '#94704a'); } }
    const shadow = (x, y, ww, hh) => { g.fillStyle = 'rgba(40,24,10,.28)'; g.fillRect(x + 3, y + 3, ww, hh); };
    // the cap, from above
    shadow(18, 28, 30, 26);
    g.fillStyle = '#a83328'; g.beginPath(); g.ellipse(33, 38, 15, 13, 0, 0, Math.PI * 2); g.fill(); g.fillStyle = '#d8463b'; g.beginPath(); g.ellipse(33, 37, 13, 11, 0, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#b83a2e'; g.lineWidth = 1; for (const a of [0.5, 1.6, 2.6, 3.7, 4.7, 5.7]) { g.beginPath(); g.moveTo(33, 37); g.lineTo(33 + Math.cos(a) * 12, 37 + Math.sin(a) * 10); g.stroke(); }
    R(32, 36, 3, 3, '#a83328'); R(28, 29, 4, 2, '#ef6a55'); g.fillStyle = '#1e1a1a'; g.beginPath(); g.ellipse(33, 50, 13, 7, 0, 0, Math.PI); g.fill(); R(28, 45, 10, 4, '#f4f1ea'); R(30, 46, 6, 2, '#d8463b');
    // the bill
    shadow(58, 18, 54, 40); R(58, 18, 54, 40, '#f4efe4'); R(58, 18, 54, 1, '#ffffff'); R(62, 22, 6, 5, '#2f8a5a'); for (let k = 0; k < 3; k++) R(62, 46 + k * 3, 30 - k * 6, 1, '#a8a294'); R(62, 31, 46, 1, '#c9c2b0'); R(84, 46, 22, 1, '#d8463b'); R(84, 48, 18, 1, '#d8463b');
    billAt = [58 - cam, 18];
    // the watch, strap open
    shadow(124, 20, 16, 66); R(126, 20, 12, 66, '#1e1a1a'); for (let y = 24; y < 40; y += 4) R(130, y, 4, 1, '#3a3236'); R(124, 80, 16, 4, '#9aa0a6'); R(128, 81, 8, 2, '#1e1a1a');
    R(120, 44, 24, 18, '#c9ccd2'); R(120, 44, 24, 1, '#eef0f2'); R(122, 46, 20, 14, '#0e130e'); digits('06:10', 123, 50, '#8fd694'); light(132, 53, 12, '143,214,148', 0.15);
    // the paper cup of green tea, the bag's string and tag, the steam
    shadow(160, 38, 26, 26); g.fillStyle = '#e6e2d6'; g.beginPath(); g.arc(173, 51, 13, 0, Math.PI * 2); g.fill(); g.fillStyle = '#f7f4ec'; g.beginPath(); g.arc(173, 50, 12, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#7f9a52'; g.beginPath(); g.arc(173, 51, 10, 0, Math.PI * 2); g.fill(); g.fillStyle = '#9ab36a'; g.beginPath(); g.arc(173, 51, 8, 0, Math.PI * 2); g.fill(); R(168, 46, 4, 1, '#c9d89a');
    R(173, 51, 1, 1, '#f4f1ea'); for (let k = 0; k < 9; k++) R(174 + k, 52 + Math.round(k * 0.6), 1, 1, '#f4f1ea'); R(183, 57, 6, 5, '#e9d9a0'); R(183, 57, 6, 1, '#d8463b');
    for (let k = 0; k < 3; k++) for (let s = 0; s < 22; s++) { const p = ((u * 0.3 + k * 0.33 + s * 0.012) % 1); g.save(); g.globalAlpha = 0.28 * Math.sin(Math.PI * p); R(171 + k * 2 + Math.round(Math.sin(p * 7 + k * 2) * 3), 46 - Math.round(p * 40), 1, 1, '#ffffff'); g.restore(); }
    // the light through the blinds, drifting
    g.save(); g.globalCompositeOperation = 'lighter'; for (let s = 0; s < 7; s++) { const x0 = -40 + s * 34 + u * 2; g.fillStyle = 'rgba(255,220,170,.13)'; g.beginPath(); g.moveTo(x0, 0); g.lineTo(x0 + 14, 0); g.lineTo(x0 + 64, h); g.lineTo(x0 + 50, h); g.closePath(); g.fill(); } g.restore();
    g.restore();
    vig(w, h, 0.4);
  });
  // the bill's text at screen resolution so it reads
  if (billAt) { text('입원비 납부 안내', billAt[0] * 2 + 54, billAt[1] * 2 + 10, '#1b1716', 8, 'center', true); text('2,140,000원', billAt[0] * 2 + 76, billAt[1] * 2 + 66, '#d8463b', 9, 'center', true); }
  bars();
  blackout(W, H, Math.max(u < 0.6 ? 1 - u / 0.6 : 0, u > 6.6 ? (u - 6.6) / 0.8 : 0));
  if (u > 7.2) text('— 스테이지 1 끝 —', W / 2, 102, `rgba(239,230,210,${clamp((u - 7.2) / 0.8, 0, 1)})`, 10, 'center');
  if (u >= 0.3) cue('table-bird', () => { [2900, 3300].forEach((f, i) => oscS('sine', f, now() + 0.8 + i * 0.14, 0.02, 0.1, f * 1.2)); });
}
