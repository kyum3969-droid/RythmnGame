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
function arm(sx, sy, hx, hy, c, skin, bendSide = 1, L1 = 8, L2 = 8, minX = -Infinity) {
  const dx = hx - sx, dy = hy - sy, d = Math.min(L1 + L2 - 0.01, Math.hypot(dx, dy)), a = Math.atan2(dy, dx), k = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1));
  let side = bendSide; if (sx + Math.cos(a + side * k) * L1 < minX) side = -side;
  const ex = sx + Math.cos(a + side * k) * L1, ey = sy + Math.sin(a + side * k) * L1, tx = sx + Math.cos(a) * d, ty = sy + Math.sin(a) * d;
  thick(sx, sy, ex, ey, 3, c); thick(ex, ey, tx, ty, 3, c); R(ex - 1, ey - 1, 2, 1, mix(c, '#ffffff', 0.15));
  R(Math.round(tx) - 1, Math.round(ty) - 2, 3, 4, skin); R(Math.round(tx) + 2, Math.round(ty) - 1, 1, 2, skin); R(Math.round(tx) - 1, Math.round(ty) + 2, 3, 1, mix(skin, '#000000', 0.2));
}
// the passengers on the last train home
const PASS = {
  salaryman(t, cx, seat) { // after his own 회식: suit, tie pulled loose, dozing; his head drops and jerks back up
    const drop = (t % 4.2) > 3.1 ? 2 : (t % 4.2) > 2.2 ? 1 : 0;
    R(cx + 8, seat + 9, 12, 9, '#4a3a2a'); R(cx + 8, seat + 9, 12, 1, '#6a5440'); R(cx + 12, seat + 7, 4, 2, '#4a3a2a'); R(cx + 13, seat + 12, 2, 1, '#c9a63a');
    const top = sitF(cx, seat, { w: 18, top: '#3a3e48', pants: '#33363e', spread: 1, dress: (x, y) => { R(x - 3, y + 1, 6, 6, '#e9ecef'); R(x - 1 + 1, y + 2, 2, 8, '#8a2a2a'); R(x + 1, y + 2, 1, 1, '#b84a4a'); R(x - 4, y + 1, 1, 9, '#2a2d35'); R(x + 3, y + 1, 1, 9, '#2a2d35'); } });
    faceF(cx, top - 14 + drop, { eyes: 'closed', blush: true }); HAIR.salary(cx, top - 14 + drop);
  },
  student(t, cx, seat) { // studying: a book open on the lap, head down, a page turns
    const turn = t > 1.4 && t < 1.8;
    R(cx + 9, seat + 8, 10, 10, '#4a5a3a'); R(cx + 9, seat + 8, 10, 2, '#5a6a4a'); R(cx + 12, seat + 11, 4, 3, '#3a4a2a');
    const top = sitF(cx, seat, { w: 16, top: '#9a9488', pants: '#3a3f4a', shoe: '#e9e4da', sole: '#b9b4aa', hands: false, dress: (x, y) => { R(x - 1, y + 1, 1, 5, '#d9d4c6'); R(x + 1, y + 1, 1, 5, '#d9d4c6'); R(x - 4, y + 10, 8, 5, '#8a847a'); } });
    R(cx - 8, seat - 6, 16, 6, '#f4f1ea'); R(cx, seat - 6, 1, 6, '#c9c2b0'); R(cx - 8, seat - 1, 16, 1, '#2f5f8a'); for (let k = 0; k < 4; k++) { R(cx - 6, seat - 5 + k, 5, 1, '#c9c2b0'); R(cx + 2, seat - 5 + k, 5, 1, '#c9c2b0'); }
    if (turn) R(cx + 1, seat - 9, 4, 4, '#ffffff');
    R(cx - 9, seat - 4, 3, 3, '#d9a27a'); R(cx + 7, seat - 4, 3, 3, '#d9a27a');
    faceF(cx, top - 13, { eyes: 'closed', look: 'down' }); HAIR.student(cx, top - 13);
  },
  phoneWoman(t, cx, feet, bar) { // standing in the aisle, one hand on a strap, the other with the phone, its light on her face
    const scroll = Math.floor(t / 0.9) % 2;
    const top = standF(cx, feet, { w: 14, top: '#c9b089', pants: '#4a5a7a', shoe: '#e9e4da', sole: '#c9c4ba', dress: (x, y) => { R(x - 2, y + 1, 4, 10, '#f4f1ea'); R(x - 7, y + 12, 3, 8, '#e0d4b8'); } });
    HAIR.long(cx, top - 14); faceF(cx, top - 14, { eyes: 'open', look: 'down' }); R(cx - 6, top - 14, 12, 3, '#3a2620'); HAIR.long(cx, top - 14);
    R(cx - 9, bar, 1, top - 19 - bar, '#e3e7ea'); R(cx - 12, top - 19, 7, 1, '#eef1f3'); R(cx - 12, top - 19, 1, 6, '#eef1f3'); R(cx - 6, top - 19, 1, 6, '#eef1f3'); R(cx - 12, top - 14, 7, 1, '#c9ced3');
    thick(cx - 7, top + 2, cx - 11, top - 7, 3, '#c9b089'); thick(cx - 11, top - 7, cx - 9, top - 15, 3, '#c9b089'); R(cx - 11, top - 8, 2, 1, '#e0d4b8'); R(cx - 11, top - 18, 4, 4, '#d9a27a'); R(cx - 11, top - 15, 4, 1, '#b98260');
    R(cx + 1, top + 6, 5, 7, '#1b1716'); R(cx + 2, top + 7, 3, 5, scroll ? '#9fd8ec' : '#bfe6f2'); R(cx, top + 9, 3, 4, '#d9a27a'); thick(cx + 6, top + 3, cx + 3, top + 10, 3, '#c9b089');
    light(cx + 3, top + 4, 12, '159,216,236', 0.25);
    R(cx + 6, top + 14, 6, 9, '#8a5a3a'); R(cx + 7, top + 2, 1, 12, '#8a5a3a');
  },
  trackMan(t, cx, feet, bar) { // by the door: track suit, earbuds, a gym bag, nodding to whatever he is listening to
    const nod = Math.floor(t / 0.5) % 2;
    const top = standF(cx, feet, { w: 18, top: '#2a3a6a', pants: '#2a3a6a', stripe: '#e9ecef', shoe: '#e9e4da', sole: '#d8463b', dress: (x, y, w) => { R(x - w / 2, y + 1, 1, 17, '#e9ecef'); R(x + w / 2 - 1, y + 1, 1, 17, '#e9ecef'); R(x, y + 1, 1, 17, '#9aa0a6'); R(x - 3, y, 6, 2, '#1f2c52'); } });
    faceF(cx, top - 14 + nod, { eyes: 'closed' }); HAIR.buzz(cx, top - 14 + nod);
    R(cx - 12, top + 8, 9, 12, '#1e1a1a'); R(cx - 11, top + 11, 4, 2, '#d8463b'); thick(cx - 6, top + 1, cx - 8, top + 9, 2, '#1e1a1a');
    R(cx - 10, bar, 1, top + 2 - bar, '#c9ced3'); R(cx - 11, top + 1, 3, 2, '#d9a27a');
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
  const seat = o.seat || 70, sk = '#d9a27a', pants = '#3a3f45', pd = '#2a2e33';
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
  const feet = seat + 17, legTop = feet - 22, top = legTop - 18;
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
// the car, at the game's own pixel size: the bench and its people across the frame, the window and the tunnel above them,
// the pole, the door on the right
function trainTwoShot(t) {
  const S = trainS(t), v = trainV(t), arrived = clamp((t - 9.6) / 1.4, 0, 1);
  shot(1, (w, h) => {
    const bounce = v > 20 && (S % 68) < 6 ? 1 : 0;
    g.save(); g.translate(0, bounce);
    const BAR = 37, WX0 = 6, WX1 = 244, WY0 = 54, WY1 = 98, SEAT = 140;
    // ceiling with its light panels, the grab bar
    R(0, 0, w, 52, '#d3d9de'); R(0, 24, w, 10, '#c3cad0'); for (let x = 10; x < w; x += 96) { R(x, 26, 70, 3, '#f6fafb'); R(x, 25, 70, 1, '#e3e8eb'); R(x, 29, 70, 1, '#aab2b8'); light(x + 35, 28, 46, '240,248,250', 0.22); }
    R(0, 34, w, 1, '#a9b0b6'); R(0, BAR, w, 2, '#c9ced3'); R(0, BAR, w, 1, '#eef1f3'); R(0, BAR + 2, w, 1, '#8a9097');
    // advertising frames over the window
    for (const [x, c, c2] of [[10, '#c0546a', '#f2d3a0'], [62, '#3f8a7a', '#f4f1ea'], [114, '#e0b84a', '#2b2e33'], [166, '#5a6fa8', '#f4f1ea'], [218, '#d77a4a', '#f4f1ea']]) {
      R(x, 41, 46, 10, '#9aa1a8'); R(x + 1, 42, 44, 8, c); R(x + 3, 44, 18, 1, c2); R(x + 3, 46, 12, 1, c2); R(x + 30, 43, 8, 6, c2); R(x + 31, 44, 6, 4, c); R(x + 1, 42, 44, 1, mix(c, '#ffffff', 0.25));
    }
    // the window: aluminium frame, rubber, three panes; the tunnel streaming past; the platform sliding in at the end
    R(WX0 - 3, WY0 - 3, WX1 - WX0 + 6, WY1 - WY0 + 6, '#a9b0b6'); R(WX0 - 3, WY0 - 3, WX1 - WX0 + 6, 1, '#e3e8eb'); R(WX0 - 1, WY0 - 1, WX1 - WX0 + 2, WY1 - WY0 + 2, '#2b2e33');
    g.save(); g.beginPath(); g.rect(WX0, WY0, WX1 - WX0, WY1 - WY0); g.clip();
    R(WX0, WY0, WX1 - WX0, WY1 - WY0, '#07080c');
    for (let k = -1; k < 10; k++) { const x = WX0 + (((k * 40 - S * 1.6) % 400) + 400) % 400; R(x, WY0, 3, WY1 - WY0, '#10141c'); R(x + 3, WY0, 1, WY1 - WY0, '#0b0e14'); }
    for (const [y, c] of [[60, '#1a1f29'], [62, '#151a23'], [64, '#1a1f29'], [90, '#12161e']]) for (let x = WX0; x < WX1; x += 2) R(x, y + Math.round(Math.sin((x + S * 1.6) / 30) * 1), 2, 1, c);
    for (let k = 0; k < 3; k++) { const x = WX0 + (((k * 168 + 80 - S * 1.6) % 504) + 504) % 504, len = 3 + Math.round(v * 0.3); R(x - len, 57, len + 3, 1, '#fff3c8'); R(x - len, 58, len + 3, 1, '#ffd890'); R(x - len + 2, 56, len - 1, 1, '#c99a54'); light(x, 57, 14 + v * 0.1, '255,216,144', 0.45); }
    const px = WX0 + (PLAT - S) * 2;
    if (px < WX1) {
      R(px, WY0, WX1 - px, WY1 - WY0, '#d7dfdb'); for (let y = WY0; y < WY1; y += 5) R(px, y, WX1 - px, 1, '#c6cfcb'); for (let x = px; x < WX1; x += 8) R(x, WY0, 1, WY1 - WY0, '#c6cfcb');
      R(px, 80, WX1 - px, 4, '#2f6f8a'); R(px, 84, WX1 - px, 1, '#7fb4c8');
      for (const sx of [px + 40, px + 200]) { R(sx, 62, 72, 12, '#1e2a33'); R(sx + 1, 63, 70, 10, '#2f3a4a'); R(sx + 1, 72, 70, 1, '#8fd694'); hospName(sx + 10, 63, '#e9eef0', 8); }
      for (const cx of [px + 150, px + 300]) { R(cx, WY0, 8, WY1 - WY0, '#b9c4c0'); R(cx, WY0, 1, WY1 - WY0, '#e3e8e6'); }
      light(px + 120, WY0, 90, '240,250,255', 0.3);
    }
    g.restore();
    for (const x of [86, 166]) { R(x - 1, WY0, 3, WY1 - WY0, '#a9b0b6'); R(x - 1, WY0, 1, WY1 - WY0, '#e3e8eb'); R(x + 2, WY0, 1, WY1 - WY0, '#2b2e33'); }
    g.save(); g.globalAlpha = 0.14; for (let k = 0; k < 3; k++) R(WX0 + 12 + k * 80, WY0 + 2, 46, 1, '#ffffff'); for (let k = 0; k < 14; k++) { R(WX0 + 30 + k * 2, WY1 - 2 - k * 3, 6, 1, '#ffffff'); R(WX0 + 190 + k * 2, WY1 - 2 - k * 3, 4, 1, '#ffffff'); } g.restore();
    // the door to the right, its windows, the LED board over it, warning stickers, the yellow sill
    R(258, 34, 100, 124, '#b9c0c7'); R(258, 34, 100, 1, '#e3e8eb'); R(261, 44, 46, 114, '#d6dbe0'); R(309, 44, 46, 114, '#d6dbe0'); R(307, 44, 2, 114, '#2b2e33');
    for (const x of [267, 315]) { R(x, 54, 34, 44, '#2b2e33'); R(x + 1, 55, 32, 42, px < x + 30 ? '#cfd8d4' : '#0a0c10'); g.save(); g.globalAlpha = 0.12; for (let k = 0; k < 10; k++) R(x + 6 + k * 2, 94 - k * 3, 4, 1, '#ffffff'); g.restore(); R(x + 2, 116, 8, 8, '#f2d35a'); R(x + 3, 117, 6, 6, '#e0b84a'); R(x + 5, 118, 2, 3, '#1b1716'); R(x + 5, 122, 2, 1, '#1b1716'); }
    R(262, 106, 44, 1, '#aab2b8'); R(310, 106, 44, 1, '#aab2b8'); R(258, 152, 100, 3, '#f2d35a'); R(258, 155, 100, 1, '#b89a2a');
    R(284, 34, 48, 9, '#141414'); R(285, 35, 46, 7, '#2a1209'); for (let k = 0; k < 6; k++) { const on = (Math.floor(t * 4) + k) % 6 < 3; R(289 + k * 7, 37, 4, 1, on ? '#ff8a3d' : '#4a1e0e'); R(290 + k * 7, 38, 2, 1, on ? '#ff8a3d' : '#4a1e0e'); R(289 + k * 7, 39, 4, 1, on ? '#ff8a3d' : '#4a1e0e'); }
    R(358, 34, 26, 124, '#c9d0d5'); R(360, 44, 22, 70, '#9fb4c0'); shade(360, 44, 22, 70, '255,255,255', 0.15); R(358, 34, 1, 124, '#e3e8eb');
    // the bench: the moquette back with its woven pattern and padded top, cushion, steel skirt with its vents
    R(0, 100, 250, 40, '#2f5f8a'); for (let y = 103; y < 138; y += 4) for (let x = (y / 4) % 2 ? 2 : 0; x < 250; x += 4) R(x, y, 2, 1, '#3a6d9a'); R(0, 100, 250, 4, '#4a82b4'); R(0, 100, 250, 1, '#6a9cc6'); R(0, 104, 250, 1, '#284f74');
    for (const x of [90, 170]) R(x, 104, 1, 36, '#284f74');
    R(0, 140, 250, 4, '#3f7fb0'); R(0, 140, 250, 1, '#6aa2cc'); R(0, 144, 250, 6, '#244766'); R(0, 150, 250, 8, '#8e979f'); R(0, 150, 250, 1, '#c5ccd2'); R(0, 157, 250, 1, '#5a6066'); for (let x = 8; x < 250; x += 16) R(x, 152, 10, 1, '#6f777e');
    // the floor: speckled vinyl, the light from the window lying on it
    R(0, 158, w, 40, '#6b7279'); R(0, 158, w, 1, '#4a5056'); for (let y = 160; y < 198; y += 2) for (let x = (y * 7) % 5; x < w; x += 5) if (rnd(x, y) < 0.35) R(x, y, 1, 1, rnd(y, x) < 0.5 ? '#767d84' : '#626970');
    g.save(); g.globalAlpha = 0.12; R(0, 166, 250, 3, '#ffffff'); R(0, 176, 250, 2, '#ffffff'); g.restore();
    // the straps
    const sw = Math.round((v < 150 && v > 0 ? 2 : 0) + Math.sin(t * 3) * (v > 0 ? 1 : 0.4));
    for (const x of [24, 54, 144, 174, 204, 290, 330]) { R(x, BAR + 3, 1, 8, '#e3e7ea'); R(x - 3 + sw, BAR + 11, 7, 1, '#f4f6f7'); R(x - 3 + sw, BAR + 12, 1, 5, '#eef1f3'); R(x + 3 + sw, BAR + 12, 1, 5, '#c9ced3'); R(x - 3 + sw, BAR + 17, 7, 1, '#b9bfc5'); }
    // the pole
    R(249, 24, 4, 168, '#b8bec4'); R(250, 24, 1, 168, '#f2f4f6'); R(252, 24, 1, 168, '#7a8086'); R(247, 156, 8, 2, '#8e979f');
    // the passengers
    PASS.salaryman(t, 36, SEAT); PASS.student(t, 72, SEAT);
    // 하은 and 신입: he sleeps leaning on her, the cheek on her shoulder. She notices and looks a while; her far hand comes
    // across to his head and slowly lifts it off her shoulder; she lets go and he tips onto the pole; she gets up
    const HX = 210, SX = 232, RISE = 10.2;
    const push = ease(clamp((t - 5.0) / 2.4, 0, 1)), fall = clamp((t - 7.6) / 1.0, 0, 1), fe = fall * fall * (3 - 2 * fall);
    const lean = fall > 0 ? lerp(-0.04, 0.24, fe) : lerp(-0.22, -0.04, push), tilt = fall > 0 ? lerp(-0.15, 0.32, fe) : lerp(-0.8, -0.15, push);
    const reach = t < 4.2 ? 0 : t < 5.0 ? ease((t - 4.2) / 0.8) : t < 7.4 ? 1 : t < 8.0 ? 1 - ease((t - 7.4) / 0.6) : 0;
    const [headX, headY] = sinipLean(SX, SEAT, lean, tilt, t);
    const skin = '#d9a27a';
    if (t < RISE) {
      const hTop = haeunFront(HX, 'sit', { turned: t > 3.0 && t < 8.6, seat: SEAT });
      bagAt(HX - 4, SEAT - 9); R(HX + 1, SEAT - 11, 3, 3, skin);
      const a = lean + tilt, txh = headX - Math.cos(a) * 6, tyh = headY - Math.sin(a) * 6 + 1, sx0 = HX - 6 + Math.round(4 * reach), sy0 = hTop + 3;
      arm(sx0, sy0, lerp(HX - 4, txh, reach), lerp(SEAT - 8, tyh, reach), '#1e1a1a', skin, 1, 9, 10, HX - 8);
    } else {
      const r = t - RISE, pose = r < 0.45 ? 'lean' : r < 0.9 ? 'half' : 'stand';
      const top = haeunFront(HX, pose, { turned: r > 1.2, seat: SEAT });
      const [bx, by] = pose === 'lean' ? [HX + 3, SEAT + 4] : pose === 'half' ? [HX + 5, top + 18] : [HX + 6, top + 19];
      bagAt(bx, by); R(bx + 2, by - 3, 3, 3, skin);
    }
    PASS.phoneWoman(t, 116, 184, BAR + 3); PASS.trackMan(t, 330, 186, BAR + 3);
    // tunnel lamps passing light the car for a moment: the beat in the light
    for (let k = 0; k < 3; k++) { const x = WX0 + (((k * 168 + 80 - S * 1.6) % 504) + 504) % 504; if (v > 10) { g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createLinearGradient(x - 50, 0, x + 50, 0); gr.addColorStop(0, 'rgba(255,200,120,0)'); gr.addColorStop(0.5, `rgba(255,200,120,${0.1 * v / 150})`); gr.addColorStop(1, 'rgba(255,200,120,0)'); g.fillStyle = gr; g.fillRect(x - 50, 0, 100, h); g.restore(); } }
    if (arrived > 0) { g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = `rgba(230,240,245,${0.12 * arrived})`; g.fillRect(0, 0, w, h); g.restore(); }
    g.restore();
    vig(w, h, 0.35);
  });
  bars();
}

// 2. 문 — close on the train door from the platform: it opens, she comes out toward us; then her chest and shoulder close in
//    the foreground and, over her shoulder, him asleep against the pole inside; the doors close between them and the train
//    goes, its windows strobing across her; then flat and wide, the empty platform, the clock, her second watch
function shotDoor(u) { doorBust(u); }
// a filled ellipse, crisp
function ellFill(cx, cy, rx, ry, c, yMin = -Infinity, yMax = Infinity) { for (let y = Math.ceil(cy - ry); y <= Math.floor(cy + ry); y++) { if (y < yMin || y > yMax) continue; const d = (y + 0.5 - cy) / ry, half = rx * Math.sqrt(Math.max(0, 1 - d * d)); R(Math.round(cx - half), y, Math.round(half * 2), 1, c); } }
function clipPoly(pts) { g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.clip(); }
function dotLine(x0, y0, x1, y1, c, gap = 3) { const n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / gap)); for (let i = 0; i <= n; i++) R(Math.round(lerp(x0, x1, i / n)), Math.round(lerp(y0, y1, i / n)), 1, 1, c); }
// 하은 as a bust at full resolution (the game's pixel size): the snapback's crown with its seams and stitching, the patch,
// the brim with its highlight; the brim's shadow over the eyes; nose, lips, ears, the hair under the cap; the neck; the
// black long sleeves and the sky-blue vest with its zip, its reflective band and the crossbody strap. Rim light from the
// lit doorway on her left. look < 0 turns her head toward the door behind her.
function haeunBustHD(cx, by, look) {
  const d = Math.round(look * 7), sk = '#d9a27a', skD = '#b98260', skDD = '#9c6a4c', skL = '#e8b890', hair = '#4a3328', hairL = '#6b4a3a';
  const red = '#d8463b', redD = '#a83328', redL = '#ef6a55', rim = '#ffd2a2';
  const s0 = by + 72;
  // shoulders and the long black sleeves
  const body = [[cx - 16, s0], [cx - 34, s0 + 4], [cx - 56, s0 + 12], [cx - 70, s0 + 22], [cx - 77, s0 + 36], [cx - 80, 220], [cx + 80, 220], [cx + 77, s0 + 36], [cx + 70, s0 + 22], [cx + 56, s0 + 12], [cx + 34, s0 + 4], [cx + 16, s0]];
  polyFill(body, '#1e1a1a');
  polyFill([[cx - 34, s0 + 6], [cx - 54, s0 + 14], [cx - 66, s0 + 24], [cx - 62, s0 + 28], [cx - 40, s0 + 14]], '#2c2829');
  polyFill([[cx + 34, s0 + 6], [cx + 54, s0 + 14], [cx + 66, s0 + 24], [cx + 62, s0 + 28], [cx + 40, s0 + 14]], '#2c2829');
  // the vest over the chest, open at the neck in a V
  const vest = [[cx - 14, s0 + 2], [cx - 30, s0 + 8], [cx - 50, s0 + 18], [cx - 58, s0 + 30], [cx - 60, 220], [cx + 60, 220], [cx + 58, s0 + 30], [cx + 50, s0 + 18], [cx + 30, s0 + 8], [cx + 14, s0 + 2], [cx + 2, s0 + 34], [cx - 2, s0 + 34]];
  polyFill(vest, '#7ec8e3');
  polyFill([[cx - 30, s0 + 8], [cx - 50, s0 + 18], [cx - 58, s0 + 30], [cx - 60, 220], [cx - 52, 220], [cx - 50, s0 + 30], [cx - 44, s0 + 18]], '#68b4d0');
  polyFill([[cx + 50, s0 + 18], [cx + 58, s0 + 30], [cx + 60, 220], [cx + 56, 220], [cx + 54, s0 + 30]], '#5aa6c4');
  for (let y = s0 + 34; y < 220; y++) { R(cx - 1, y, 1, 1, '#4a8fb0'); R(cx, y, 1, 1, '#a8e0f2'); if (y % 3 === 0) R(cx + 1, y, 1, 1, '#4a8fb0'); }
  R(cx - 13, s0 + 3, 1, 1, '#b4e6f4'); dotLine(cx - 14, s0 + 3, cx - 2, s0 + 33, '#a8dcef', 2); dotLine(cx + 14, s0 + 3, cx + 2, s0 + 33, '#4a8fb0', 2);
  // the reflective band with its segments
  const bandY = s0 + 46; R(cx - 58, bandY, 116, 9, '#e6e1cc'); R(cx - 58, bandY, 116, 1, '#fffdf2'); R(cx - 58, bandY + 9, 116, 1, '#a8a28a'); for (let x = cx - 56; x < cx + 58; x += 10) R(x, bandY + 1, 1, 8, '#cfc9b0');
  R(cx - 46, bandY + 18, 26, 1, '#5aa6c4'); R(cx + 20, bandY + 18, 26, 1, '#5aa6c4'); R(cx - 46, bandY + 19, 26, 1, '#a8e0f2'); R(cx + 20, bandY + 19, 26, 1, '#a8e0f2');
  // the crossbody strap, right shoulder to left hip, stitched
  polyFill([[cx + 46, s0 + 12], [cx + 54, s0 + 16], [cx - 36, 220], [cx - 46, 220]], '#2f3237');
  for (let k = 0; k <= 40; k++) { const x = lerp(cx + 50, cx - 41, k / 40), y = lerp(s0 + 14, 220, k / 40); if (k % 2) R(Math.round(x), Math.round(y), 1, 1, '#4a4e55'); }
  dotLine(cx + 46, s0 + 12, cx - 46, 220, '#1a1c20', 1); R(cx + 40, s0 + 22, 8, 6, '#9aa0a6'); R(cx + 41, s0 + 23, 6, 4, '#2f3237');
  // rim light from the doorway on her left
  dotLine(cx - 34, s0 + 4, cx - 56, s0 + 12, '#4a4244', 1); dotLine(cx - 56, s0 + 12, cx - 70, s0 + 22, '#4a4244', 1);
  // the neck, shadowed under the jaw
  polyFill([[cx - 14, by + 52], [cx + 14, by + 52], [cx + 15, s0 + 4], [cx - 15, s0 + 4]], sk);
  for (let y = by + 52; y < by + 64; y++) R(cx - 14, y, 28, 1, y < by + 58 ? skDD : skD);
  R(cx - 15, by + 52, 2, 24, skD); R(cx + 13, by + 52, 2, 24, skD);
  // hair under the cap at the sides, the ears
  polyFill([[cx - 40, by + 4], [cx - 33, by + 4], [cx - 33, by + 34], [cx - 38, by + 38], [cx - 41, by + 24]], hair);
  polyFill([[cx + 40, by + 4], [cx + 33, by + 4], [cx + 33, by + 30], [cx + 38, by + 34], [cx + 41, by + 22]], hair);
  for (let k = 0; k < 4; k++) { dotLine(cx - 39 + k, by + 6, cx - 38 + k, by + 30 - k * 3, hairL, 2); dotLine(cx + 37 - k, by + 6, cx + 36 - k, by + 26 - k * 3, '#3a271e', 2); }
  for (const s of [-1, 1]) { const ex = cx + s * 38; ellFill(ex, by + 30, 5, 9, skD); ellFill(ex + s * 0.5, by + 30, 3, 7, sk); R(ex - (s > 0 ? 0 : 1), by + 26, 1, 8, skDD); }
  // the face: wide under the brim, a soft jaw down to the chin
  const face = [[cx - 34, by + 4], [cx + 34, by + 4], [cx + 35, by + 22], [cx + 33, by + 34], [cx + 28, by + 45], [cx + 20, by + 53], [cx + 10, by + 58], [cx, by + 60], [cx - 10, by + 58], [cx - 20, by + 53], [cx - 28, by + 45], [cx - 33, by + 34], [cx - 35, by + 22]];
  // flat shading like the game: a shade colour under everything, the lit face over it a little to the right, the brim's
  // shadow in three hard bands, the jaw's underside
  polyFill(face, '#c08a66');
  polyFill(face.map(([x, y]) => [cx + (x - cx) * 0.9 + 2, by + (y - by) * 0.96]), sk);
  g.save(); clipPoly(face);
  R(cx - 36, by + 4, 72, 9, '#6e4834'); R(cx - 36, by + 13, 72, 4, '#8c5c42'); R(cx - 36, by + 17, 72, 3, '#ad7655');
  polyFill([[cx - 30, by + 44], [cx - 20, by + 53], [cx - 10, by + 58], [cx, by + 60], [cx + 10, by + 58], [cx + 20, by + 53], [cx + 26, by + 47], [cx + 12, by + 54], [cx, by + 56], [cx - 14, by + 53]], '#c08a66');
  ellFill(cx - 20 + d, by + 34, 6, 2.5, '#e09a84'); ellFill(cx + 20 + d, by + 34, 6, 2.5, '#e09a84');
  g.restore();
  // the nose: a highlight down the bridge, the tip, the nostrils' shadow
  R(cx + 1 + d, by + 24, 1, 10, skL); R(cx + d, by + 33, 3, 2, '#f0c8a0'); R(cx - 4 + d, by + 36, 9, 1, skD); R(cx - 3 + d, by + 37, 7, 1, '#c08a64'); R(cx - 4 + d, by + 35, 1, 1, skDD); R(cx + 4 + d, by + 35, 1, 1, skDD);
  // lips
  R(cx - 7 + d, by + 44, 14, 1, '#8a3e3e'); R(cx - 8 + d, by + 44, 1, 1, '#a0604c'); R(cx + 7 + d, by + 44, 1, 1, '#a0604c'); R(cx - 6 + d, by + 43, 12, 1, '#b25a5a'); R(cx - 5 + d, by + 45, 10, 2, '#c87070'); R(cx - 2 + d, by + 45, 3, 1, '#e09a90'); R(cx - 3 + d, by + 49, 6, 1, '#c08a64');
  // the cap's crown (cut by the top of the frame): panels, seams, stitching, a highlight
  g.save(); g.beginPath(); g.rect(cx - 60, 0, 120, by + 1); g.clip();
  ellFill(cx, by + 6, 56, 52, red);
  g.save(); g.beginPath(); g.ellipse(cx, by + 6, 56, 52, 0, 0, Math.PI * 2); g.clip();
  polyFill([[cx - 60, by - 60], [cx - 26 + d, by - 60], [cx - 30 + d, by], [cx - 60, by]], '#c13e33'); polyFill([[cx + 34 + d, by - 60], [cx + 60, by - 60], [cx + 60, by], [cx + 30 + d, by]], '#b8382e');
  polyFill([[cx - 44, by - 40], [cx - 30, by - 46], [cx - 26, by - 36], [cx - 40, by - 30]], redL);
  for (const [x0, x1] of [[-26, -30], [34, 30]]) for (let k = 0; k <= 50; k++) { const x = Math.round(cx + d + lerp(x0, x1, k / 50)), y = by - 50 + k; R(x, y, 1, 1, redD); if (k % 3 === 0) R(x + (x0 < 0 ? 2 : -2), y, 1, 1, '#e05a4c'); }
  g.restore();
  R(cx - 56, by - 2, 112, 1, redD); R(cx - 56, by - 1, 112, 2, '#b83a30');
  // the patch on the front panel, its border and the stitched mark
  const pxl = cx - 18 + d * 2, pyl = by - 30; R(pxl, pyl, 36, 20, '#f4f1ea'); R(pxl, pyl, 36, 1, '#ffffff'); R(pxl, pyl + 19, 36, 1, '#c9c2b0'); R(pxl, pyl, 1, 20, '#d9d4c6'); R(pxl + 35, pyl, 1, 20, '#c9c2b0');
  dotLine(pxl + 2, pyl + 2, pxl + 33, pyl + 2, '#d9d4c6', 2); dotLine(pxl + 2, pyl + 17, pxl + 33, pyl + 17, '#d9d4c6', 2);
  R(pxl + 8, pyl + 8, 20, 5, red); R(pxl + 8, pyl + 8, 20, 1, redL); R(pxl + 8, pyl + 12, 20, 1, redD);
  g.restore();
  // the brim: a gentle curve, top highlight, the underside dark, stitched along its edge
  for (let x = -60; x <= 60; x++) { const yy = by + Math.round((x / 60) * (x / 60) * 4), X = cx + x + d; R(X, yy - 2, 1, 1, '#5a5056'); R(X, yy - 1, 1, 2, '#3a3236'); R(X, yy + 1, 1, 4, '#1e1a1a'); if (x % 3 === 0 && Math.abs(x) < 56) R(X, yy, 1, 1, '#4a4048'); }
}
// the car's inside through its doorway: ceiling lights, the window band with the tunnel, the bench, the pole, him asleep
function carThroughDoor(x0, x1, y0, y1, t) {
  R(x0, y0, x1 - x0, y1 - y0, '#d3d9de');
  R(x0, y0, x1 - x0, 10, '#c3cad0'); R(x0 + 10, y0 + 2, 80, 3, '#f6fafb'); R(x0 + 130, y0 + 2, 80, 3, '#f6fafb'); light(x0 + 50, y0 + 4, 60, '240,248,250', 0.25); light(x0 + 170, y0 + 4, 60, '240,248,250', 0.25);
  R(x0, y0 + 16, x1 - x0, 2, '#c9ced3'); R(x0, y0 + 16, x1 - x0, 1, '#eef1f3');
  for (const ax of [x0 + 20, x0 + 90, x0 + 160]) { R(ax, y0 + 20, 46, 9, '#9aa1a8'); R(ax + 1, y0 + 21, 44, 7, ['#c0546a', '#3f8a7a', '#e0b84a'][((ax - x0) / 70) | 0]); }
  R(x0, y0 + 32, x1 - x0, 46, '#2b2e33'); R(x0, y0 + 33, x1 - x0, 44, '#07080c'); for (let k = 0; k < 6; k++) R(x0 + ((k * 46 + t * 30) % (x1 - x0)), y0 + 33, 2, 44, '#10141c'); R(x0 + 40, y0 + 36, 30, 1, '#c99a54');
  R(x0, y0 + 80, x1 - x0, 40, '#2f5f8a'); for (let y = y0 + 84; y < y0 + 118; y += 4) for (let x = x0 + ((y / 4) % 2 ? 2 : 0); x < x1; x += 4) R(x, y, 2, 1, '#3a6d9a'); R(x0, y0 + 80, x1 - x0, 3, '#4a82b4');
  R(x0, y0 + 120, x1 - x0, 4, '#3f7fb0'); R(x0, y0 + 120, x1 - x0, 1, '#6aa2cc'); R(x0, y0 + 124, x1 - x0, 6, '#244766'); R(x0, y0 + 130, x1 - x0, 8, '#8e979f'); R(x0, y0 + 130, x1 - x0, 1, '#c5ccd2'); R(x0, y0 + 138, x1 - x0, y1 - y0 - 138, '#6b7279');
  const SX = x0 + 30, SEAT = y0 + 120;
  R(SX + 16, y0 + 10, 4, y1 - y0, '#b8bec4'); R(SX + 17, y0 + 10, 1, y1 - y0, '#f2f4f6'); R(SX + 19, y0 + 10, 1, y1 - y0, '#7a8086');
  sinipLean(SX, SEAT, 0.24, 0.32, t);
}
function doorBust(t) {
  // she is out on the platform; behind her the open door and him asleep against the pole. 0.3-1.1 she glances back;
  // 1.2-2.0 the doors close on him; 2.2 the train goes, its windows strobing over her
  const close = ease(clamp((t - 1.2) / 0.8, 0, 1)), dep = Math.max(0, t - 2.2), tx = -Math.round(dep * dep * 90);
  const look = t > 0.3 && t < 1.3 ? -ease(clamp((t - 0.3) / 0.35, 0, 1)) * (t > 0.95 ? 1 - (t - 0.95) / 0.35 : 1) : 0;
  const D0 = 90, D1 = 318, DY0 = 24, DY1 = 174;
  shot(1, (w, h) => {
    // once the train is gone: the far wall across the tracks, its tiles, the station's name
    R(0, 0, w, h, '#1f252c'); R(0, 40, w, 140, '#cfd8d4'); for (let x = 0; x < w; x += 9) R(x, 40, 1, 140, '#c0c9c5'); for (let y = 40; y < 180; y += 6) R(0, y, w, 1, '#c3ccc8'); R(0, 132, w, 6, '#2f6f8a'); R(0, 138, w, 1, '#7fb4c8');
    R(40, 70, 104, 22, '#1e2a33'); R(42, 72, 100, 18, '#2f3a4a'); R(42, 89, 100, 1, '#8fd694'); hospName(54, 74, '#e9eef0', 11);
    g.save(); g.translate(tx, 0);
    // the car's side around the doorway: panels with a sheen, rivets, the door frame and its rubber, the sill
    R(-40, 0, 520, 180, '#d9dee3'); for (let x = -40; x < 480; x += 2) { const v = Math.sin(x / 23) * 0.5 + 0.5; if (v > 0.8) R(x, 0, 1, 180, '#e6eaee'); else if (v < 0.15) R(x, 0, 1, 180, '#ccd2d7'); }
    for (const x of [D0 - 30, D1 + 30]) for (let y = 30; y < 170; y += 12) R(x, y, 1, 1, '#aab2b8');
    R(-40, 150, 520, 6, '#2f6f8a'); R(-40, 156, 520, 1, '#7fb4c8');
    R(D0 - 6, DY0 - 6, D1 - D0 + 12, DY1 - DY0 + 6, '#9aa1a8'); R(D0 - 4, DY0 - 4, D1 - D0 + 8, DY1 - DY0 + 4, '#2b2e33'); R(D0 - 2, DY0 - 2, D1 - D0 + 4, DY1 - DY0 + 2, '#4a4f56');
    g.save(); g.beginPath(); g.rect(D0, DY0, D1 - D0, DY1 - DY0); g.clip();
    carThroughDoor(D0, D1, DY0, DY1, t);
    // the panels slide shut from their pockets; their windows show him still
    const pw = Math.round((D1 - D0) / 2 * close);
    if (pw > 0) for (const [x, s] of [[D0, 1], [D1, -1]]) {
      const px = s > 0 ? x : x - pw; R(px, DY0, pw, DY1 - DY0, '#d6dbe0'); R(px, DY0, pw, 1, '#eef1f3'); R(s > 0 ? px + pw - 3 : px, DY0, 3, DY1 - DY0, '#2b2e33'); R(s > 0 ? px + pw - 4 : px + 3, DY0, 1, DY1 - DY0, '#4a4f56');
      const wx = px + 12, ww = pw - 24; if (ww > 4) { R(wx - 2, DY0 + 14, ww + 4, 80, '#2b2e33'); g.save(); g.beginPath(); g.rect(wx, DY0 + 16, ww, 76); g.clip(); carThroughDoor(D0, D1, DY0, DY1, t); shade(wx, DY0 + 16, ww, 76, '190,208,220', 0.28); g.globalAlpha = 0.18; for (let k = 0; k < 20; k++) R(wx + 6 + k * 2, DY0 + 88 - k * 4, 5, 1, '#ffffff'); g.restore(); }
      R(px + 10, DY0 + 120, Math.max(0, pw - 20), 1, '#aab2b8'); if (pw > 30) { R(px + 14, DY0 + 104, 12, 12, '#f2d35a'); R(px + 19, DY0 + 107, 2, 5, '#1b1716'); R(px + 19, DY0 + 113, 2, 1, '#1b1716'); }
    }
    g.restore();
    R(D0 - 6, DY1, D1 - D0 + 12, 5, '#f2d35a'); for (let x = D0 - 6; x < D1 + 6; x += 3) R(x, DY1 + 1, 1, 3, '#c9a63a');
    g.restore();
    // the platform behind her, low: granite and the tactile strip
    R(0, 180, w, 20, '#9ea7a5'); for (let x = 0; x < w; x += 2) if (rnd(x, 7) < 0.4) R(x, 182 + Math.floor(rnd(7, x) * 10), 1, 1, '#b0b9b7'); R(0, 180, w, 4, '#e8c34a'); for (let x = 1; x < w; x += 4) R(x, 181, 2, 2, '#c9a63a');
    // the train's windows strobing over everything as it goes
    if (dep > 0 && dep < 2.2) for (let k = 0; k < 4; k++) { const x = ((k * 130 - dep * dep * 120) % 560 + 560) % 560 - 90; g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = `rgba(255,236,190,${0.12 * Math.min(1, dep * 1.5) * (1 - dep / 2.2)})`; g.fillRect(x, 0, 66, h); g.restore(); }
    // her, close, in front of it all
    haeunBustHD(246, 36, look);
    vig(w, h, 0.45);
  });
  bars();
  blackout(W, H, t < 0.3 ? 1 - t / 0.3 : t > 3.6 ? (t - 3.6) / 0.4 : 0);
}

// 3. 계단 — close and from the side on her legs: one sneaker planted on a tread, the knee comes up and the other lands on the
//    next; the camera climbs the slope with her. Then from behind at the waist, the exit's sky opening over her cap
function shotStairs(u) {
  if (u < 3.2) stairsKnee(u); else stairsShoe(u - 3.2);
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
// black long sleeves with the arms swinging a little each step, the vest's back with two reflective bands, the bag strap;
// backlit by the exit ahead of her
function sneakerHD(x, y, k, dim = 0) {
  const P = pts => pts.map(([u, v]) => [x + u * k, y + v * k]);
  const c = (a) => dim ? mix(a, '#0c0c12', dim) : a;
  const sole = P([[0, 0], [17.4, 0], [18.3, -0.9], [18.1, -2.2], [0, -2.2]]);
  const upper = P([[0.3, -2.2], [0.1, -6], [0.9, -8], [4.4, -8.7], [5.6, -7.5], [8, -6.7], [11, -5.7], [14, -4.5], [16.6, -3.4], [17.9, -2.3]]);
  const tongue = P([[4.6, -8.5], [6.3, -9.6], [7.6, -8.3], [6.2, -7.1]]);
  for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) { g.save(); g.translate(dx, dy); polyFill(sole, '#141012'); polyFill(upper, '#141012'); polyFill(tongue, '#141012'); g.restore(); }
  polyFill(upper, c('#2a2a30')); polyFill(tongue, c('#3a3a42'));
  polyFill(P([[0.3, -2.2], [0.1, -6], [0.9, -7.7], [3.3, -7.9], [3.6, -2.2]]), c('#232328'));
  polyFill(P([[12.8, -2.2], [14, -4.5], [16.6, -3.4], [17.9, -2.3]]), c('#34343c'));
  polyFill(P([[1.2, -7.6], [4.2, -8.2], [4.4, -7.7], [1.3, -7.1]]), c('#55555e'));
  polyFill(sole, c('#efe9dc')); polyFill(P([[0, -0.6], [17.6, -0.6], [17.4, 0], [0, 0]]), c('#b9b3a6'));
  for (let u = 0.6; u < 17.5; u += 1.2) R(Math.round(x + u * k), Math.round(y - 1), 1, 1, c('#8a8478'));
  for (let u = 0.6; u < 17; u += 0.9) R(Math.round(x + u * k), Math.round(y - 2.2 * k), 1, 1, c('#d6d0c2'));
  // laces across the throat, eyelets, stitching along the upper's edge and round the toe cap
  for (let i = 0; i < 5; i++) { const u0 = 5.6 + i * 1.3, v0 = -7.4 + i * 0.45; const ax = x + u0 * k, ay = y + v0 * k; for (let q = 0; q <= 4; q++) { R(Math.round(ax + q * k * 0.25), Math.round(ay - k * 0.3 + q * k * 0.1), 1, 1, c('#efe9dc')); R(Math.round(ax + q * k * 0.25), Math.round(ay + k * 0.1 - q * k * 0.1), 1, 1, c('#d6d0c2')); } R(Math.round(ax), Math.round(ay + k * 0.45), 1, 1, c('#9aa0a6')); }
  for (let u = 0.6; u < 13; u += 0.7) R(Math.round(x + u * k), Math.round(y - 2.7 * k), 1, 1, c('#4a4a52'));
  for (let q = 0; q <= 10; q++) { const u = lerp(13, 17.4, q / 10), v = lerp(-2.6, -2.5, q / 10) - Math.sin(q / 10 * Math.PI) * 1.6; R(Math.round(x + u * k), Math.round(y + v * k), 1, 1, c('#4a4a52')); }
  R(Math.round(x + 15.4 * k), Math.round(y - 3.6 * k), Math.round(1.6 * k), 1, c('#5a5a64'));
}
// a trouser leg side on at 1x: thigh, a rounded knee, the shin; shaded back edge, a lit front edge, the side seam, folds
// behind the knee, the hem over a sock
function legHD(hx, hy, kx, ky, ax, ay, K, pal) {
  const [base, dark, lite, fold, seam] = pal;
  limb(hx, hy, 13 * K, kx, ky, 10 * K, dark); limb(kx, ky, 10 * K, ax, ay, 8.4 * K, dark); blob(kx, ky, 5 * K, dark);
  limb(hx, hy, 13 * K, kx, ky, 10 * K, base, 2, -3); limb(kx, ky, 10 * K, ax, ay, 8.4 * K, base, 2, -3); blob(kx - 1, ky - 1, 5 * K - 3, base);
  limb(hx, hy, 13 * K, kx, ky, 10 * K, lite, 13 * K / 2 - 3, -(13 * K / 2 - 4)); limb(kx, ky, 10 * K, ax, ay, 8.4 * K, lite, 8.4 * K / 2 - 2, -(8.4 * K / 2 - 3));
  dotLine(hx, hy, kx, ky, seam, 3); dotLine(kx, ky, ax, ay, seam, 3);
  const bx = kx - 3 * K, by0 = ky + 3; for (let i = 0; i < 2; i++) dotLine(bx + i * 2, by0 + i * 4, bx + i * 2 + 6, by0 + i * 4 - 2, fold, 1);
  R(Math.round(ax) - 14, Math.round(ay) - 4, 28, 6, dark); R(Math.round(ax) - 13, Math.round(ay) - 4, 26, 1, lite); R(Math.round(ax) - 8, Math.round(ay) + 2, 16, 6, '#1e1e24');
}
// the stairs at 1x: stone treads with a nosing overhang, a ribbed metal insert and the yellow line, the risers in the
// overhang's shadow, the stair's side face
function stairsSide(n0, n1, SW, SH) {
  for (let k = n0; k < n1; k++) {
    const x = k * SW, y = -k * SH;
    R(x, y + 10, SW, 300, '#3f414b'); R(x, y + 10, 6, SH, '#34353e'); R(x + 6, y + 10, 2, SH, '#393b44');
    for (let q = 0; q < 9; q++) if (rnd(k, q) < 0.8) R(x + 10 + Math.floor(rnd(q, k) * (SW - 20)), y + 16 + Math.floor(rnd(k * 3, q) * (SH - 10)), 2, 1, '#474954');
    R(x - 6, y, SW + 6, 10, '#8a8d98'); R(x - 6, y, SW + 6, 1, '#c9ccd5'); R(x - 6, y + 9, SW + 6, 1, '#5a5c66'); R(x - 6, y + 1, 1, 9, '#a3a6b0');
    R(x - 6, y - 2, 30, 3, '#a9afb5'); for (let gx = x - 5; gx < x + 24; gx += 3) R(gx, y - 2, 1, 2, '#6a7076'); R(x + 26, y - 1, 14, 2, '#d9b84a'); R(x + 26, y - 1, 14, 1, '#f2d35a');
  }
}
function stairWall(w, h, camX, camY, par) {
  const TW = 40, TH = 24, tx = -(((camX * par) % TW) + TW) % TW, ty = -(((camY * par) % TH) + TH) % TH;
  R(0, 0, w, h, '#5f6663');
  for (let y = ty - TH; y < h + TH; y += TH) for (let x = tx - TW; x < w + TW; x += TW) { const v = rnd(Math.floor((x + camX * par) / TW), Math.floor((y + camY * par) / TH)); R(x, y, TW - 1, TH - 1, v < 0.3 ? '#646b68' : v > 0.8 ? '#5a615e' : '#606764'); R(x, y, TW - 1, 1, '#6e7572'); R(x, y + TH - 2, TW - 1, 1, '#575e5b'); }
  for (let y = ty - TH; y < h + TH; y += TH) R(0, y + TH - 1, w, 1, '#4d5451'); for (let y = ty - TH; y < h + TH; y += TH) for (let x = tx - TW; x < w + TW; x += TW) R(x + TW - 1, y, 1, TH - 1, '#4d5451');
  g.save(); g.globalCompositeOperation = 'lighter'; const lg = g.createLinearGradient(w, 0, 60, h); lg.addColorStop(0, 'rgba(255,200,150,.26)'); lg.addColorStop(1, 'rgba(255,200,150,0)'); g.fillStyle = lg; g.fillRect(0, 0, w, h); g.restore();
  shade(0, 0, w, h, '20,24,40', 0.16);
}
// the knee shot at 1x: the thigh in from the upper left, the knee bent forward, a sneaker on a tread and the other coming up
function stairsKnee(u) {
  const K = 3, SW = 30 * K, SH = 14 * K, rate = 1 / 0.62, s = u * rate, n = Math.floor(s), f = s - n;
  const treadY = k => -k * SH, footAt = k => [k * SW + 14 * K, treadY(k) - 2];
  const bob = Math.sin(f * Math.PI) * 2 * K, hipX = (s + 0.5) * SW - 2 * K, hipY = -(s + 0.5) * SH - 40 * K - bob;
  const planted = footAt(n + 1), from = footAt(n), to = footAt(n + 2), fe = f < 0.5 ? 2 * f * f : 1 - 2 * (1 - f) * (1 - f);
  const swing = [lerp(from[0], to[0], fe), lerp(from[1], to[1], fe) - Math.sin(f * Math.PI) * 12 * K];
  const nearIsPlanted = (n + 1) % 2 === 0, near = nearIsPlanted ? planted : swing, far = nearIsPlanted ? swing : planted;
  const camX = Math.round(hipX - 180), camY = Math.round(hipY - 36);
  const kneeOf = (foot, hx, hy) => { const [ax, ay] = [foot[0], foot[1] - 10], L1 = 23 * K, L2 = 23 * K, dx = ax - hx, dy = ay - hy, d = Math.min(L1 + L2 - 1, Math.hypot(dx, dy)), a = Math.atan2(dy, dx), k = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1)); return [hx + Math.cos(a - k) * L1, hy + Math.sin(a - k) * L1, ax, ay]; };
  shot(1, (w, h) => {
    stairWall(w, h, camX, camY, 0.9);
    g.save(); g.translate(-camX, -camY);
    // the handrail on the wall: a tube with highlight and shadow, brackets, its shadow on the tiles
    const railY = x => -(x / SW) * SH - 150;
    for (let x = camX - 4; x < camX + w + 4; x++) { const y = Math.round(railY(x)); R(x, y + 12, 1, 2, '#4a514e'); R(x, y, 1, 1, '#f2f4f6'); R(x, y + 1, 1, 2, '#c9ced3'); R(x, y + 3, 1, 2, '#9aa0a6'); R(x, y + 5, 1, 1, '#6a7076'); }
    for (let k = Math.floor(camX / 150) - 1; k < Math.floor((camX + w) / 150) + 2; k++) { const x = k * 150, y = Math.round(railY(x)); R(x - 1, y + 6, 4, 10, '#7a8088'); R(x, y + 6, 1, 10, '#b9bfc5'); R(x - 6, y + 16, 14, 4, '#5a6066'); R(x - 6, y + 16, 14, 1, '#8a9097'); }
    // the far leg in shadow, the stairs, then the near leg and its sneaker
    const [fkx, fky, fax, fay] = kneeOf(far, hipX - 8, hipY + 3);
    legHD(hipX - 8, hipY + 3, fkx, fky, fax, fay, K, ['#2c3036', '#1e2126', '#383d44', '#22252a', '#33373d']);
    sneakerHD(far[0] - 14, far[1], K, 0.35);
    stairsSide(n - 3, n + 6, SW, SH);
    for (const ft of [near, far]) { const k = Math.round((ft[0] - 14 * K) / SW), ty0 = treadY(k), lift = ty0 - ft[1]; if (lift >= -3 && lift < 40) { g.fillStyle = `rgba(10,10,20,${0.4 - lift * 0.008})`; g.fillRect(Math.round(ft[0]) - 16 + Math.round(lift * 0.3), ty0, 58 - Math.round(lift * 0.5), 2); } }
    const [nkx, nky, nax, nay] = kneeOf(near, hipX, hipY);
    legHD(hipX, hipY, nkx, nky, nax, nay, K, ['#3a3f45', '#2a2e33', '#56606a', '#2c3036', '#4a5058']);
    sneakerHD(near[0] - 14, near[1], K);
    g.restore();
    light(w + 20, -20, 300, '255,200,150', 0.14);
    vig(w, h, 0.4);
  });
  bars();
  for (let k = 0; k < 8; k++) if (s >= k + 1) cue('kstep' + k, () => noiseS(now(), 'lowpass', 700, 0.07, 0.07));
  blackout(W, H, u < 0.4 ? 1 - u / 0.4 : 0);
}
// closer still, on the sneakers: one comes down onto a tread's ribbed nosing and settles; the other lifts out of frame
function stairsShoe(t) {
  const K = 6, SW = 30 * K, SH = 14 * K, land = ease(clamp(t / 0.7, 0, 1)), lift = clamp((t - 1.0) / 1.1, 0, 1);
  shot(1, (w, h) => {
    const tx = -120 - Math.round(t * 8), ty = 150 + SH + Math.round(t * 4);
    stairWall(w, h, -tx, -ty, 1);
    g.save(); g.translate(tx, ty);
    stairsSide(0, 4, SW, SH);
    // the shoe that stays: down onto tread 1, a contact shadow, the trouser hem over it
    const fx = SW + 40, fy = -SH - Math.round((1 - land) * 70), squash = land > 0.93 && land < 1 ? 1 : 0;
    g.fillStyle = `rgba(10,10,20,${0.15 + 0.25 * land})`; g.fillRect(fx - 4, -SH, 18.5 * K + 8, 3);
    const hx = fx + 6 * K, hy = fy - 9 * K;
    polyFill([[hx - 22, hy - 120], [hx + 34, hy - 120], [hx + 38, hy - 4], [hx - 26, hy - 4]], '#3a3f45');
    polyFill([[hx - 22, hy - 120], [hx - 14, hy - 120], [hx - 18, hy - 4], [hx - 26, hy - 4]], '#2a2e33'); polyFill([[hx + 26, hy - 120], [hx + 34, hy - 120], [hx + 38, hy - 4], [hx + 31, hy - 4]], '#56606a');
    dotLine(hx + 6, hy - 120, hx + 6, hy - 6, '#4a5058', 3); for (let i = 0; i < 3; i++) dotLine(hx - 18, hy - 46 + i * 12, hx + 30, hy - 40 + i * 12, '#2c3036', 1);
    R(hx - 28, hy - 6, 68, 8, '#2a2e33'); R(hx - 27, hy - 6, 66, 1, '#56606a'); R(hx - 18, hy + 2, 46, 10, '#1e1e24');
    sneakerHD(fx, fy + squash, K);
    // the other shoe pushes off tread 0 below the frame and swings up past it onto tread 2
    if (lift > 0) { const p = ease(lift), sx = lerp(30, 2 * SW + 40, p), sy = lerp(0, -2 * SH, p) - Math.sin(lift * Math.PI) * 50; sneakerHD(Math.round(sx), Math.round(sy), K, 0.4); }
    g.restore();
    light(w, 0, 300, '255,200,150', 0.12);
    vig(w, h, 0.45);
  });
  bars();
  if (t > 0.65) cue('shoe-land', () => noiseS(now(), 'lowpass', 600, 0.09, 0.08));
  blackout(W, H, t > 2.0 ? (t - 2.0) / 0.4 : 0);
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
