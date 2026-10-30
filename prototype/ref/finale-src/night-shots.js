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
// ---- the window shot's people at full resolution: the game's 4-head proportion drawn twice as big with one-pixel detail.
//      A 24x26 face, hair or cap on top, a 36-row torso, a lap, 24-row shins (seated) or 40-row legs (standing)
const SK = '#d9a27a', SKD = '#b98260', SKL = '#e8b890';
function faceHD(cx, top, o = {}) {
  const s = o.skin || SK, sd = o.skinD || SKD;
  for (const e of [-1, 1]) { ellFill(cx + e * 12.5, top + 12, 2.5, 3.5, sd); ellFill(cx + e * 12.3, top + 12, 1.4, 2.4, s); }
  polyFill([[cx - 11, top], [cx + 11, top], [cx + 12, top + 1], [cx + 12, top + 17], [cx + 11, top + 20], [cx + 9, top + 23], [cx + 6, top + 25.5], [cx - 6, top + 25.5], [cx - 9, top + 23], [cx - 11, top + 20], [cx - 12, top + 17], [cx - 12, top + 1]], s);
  polyFill([[cx - 9, top + 23], [cx - 6, top + 25.5], [cx + 6, top + 25.5], [cx + 9, top + 23], [cx + 5, top + 24], [cx - 5, top + 24]], sd);
  R(cx - 12, top + 5, 1, 12, sd); R(cx + 11, top + 5, 1, 12, sd);
  const e = o.eyes || 'open', ey = top + 10 + (o.look === 'down' ? 2 : 0);
  for (const x0 of [cx - 8, cx + 5]) {
    if (e === 'open') { R(x0, ey, 3, 4, INK); R(x0 + 2, ey, 1, 1, '#f4f1ea'); R(x0 - 1, ey - 3, 5, 1, o.brow || '#3a2a22'); }
    else if (e === 'closed') { if (o.look === 'down') R(x0, ey + 3, 4, 1, INK); else { R(x0, ey + 2, 1, 1, INK); R(x0 + 1, ey + 3, 2, 1, INK); R(x0 + 3, ey + 2, 1, 1, INK); } R(x0 - 1, ey - 2, 5, 1, o.brow || '#3a2a22'); }
  }
  if (o.blush) { R(cx - 10, top + 16, 4, 2, '#e8968a'); R(cx + 6, top + 16, 4, 2, '#e8968a'); }
  R(cx - 1, top + 16, 2, 1, sd);
  if (o.mouthOpen) { R(cx - 2, top + 19, 4, 3, '#6a2a2a'); R(cx - 1, top + 21, 2, 1, '#a04a4a'); } else R(cx - 2, top + 20, 4, 1, '#a0524e');
}
const HAIRHD = {
  sinip(cx, top) { const c = '#1e1a1a', l = '#3a3436';
    polyFill([[cx - 13, top + 9], [cx - 13, top - 2], [cx - 10, top - 6], [cx - 3, top - 8], [cx + 5, top - 8], [cx + 11, top - 5], [cx + 13, top - 1], [cx + 13, top + 8], [cx + 11, top + 8], [cx + 11, top + 3], [cx - 11, top + 3], [cx - 11, top + 9]], c);
    for (const [x, d] of [[-10, 6], [-6, 8], [-2, 5], [2, 7], [6, 4]]) polyFill([[cx + x, top + 2], [cx + x + 5, top + 2], [cx + x + 2, top + d]], c);
    for (const x of [-7, -2, 4]) dotLine(cx + x, top - 6, cx + x + 3, top - 1, l, 1);
  },
  salary(cx, top) { const c = '#22201e';
    polyFill([[cx - 13, top + 7], [cx - 13, top - 2], [cx - 10, top - 6], [cx - 2, top - 8], [cx + 6, top - 7], [cx + 11, top - 5], [cx + 13, top - 1], [cx + 13, top + 7], [cx + 11, top + 7], [cx + 11, top + 1], [cx - 3, top + 1], [cx - 6, top + 3], [cx - 11, top + 2], [cx - 11, top + 7]], c);
    dotLine(cx - 4, top - 7, cx - 4, top, '#4a4440', 1); dotLine(cx - 1, top - 7, cx + 8, top - 4, '#3a3632', 1);
    R(cx - 13, top + 4, 2, 3, '#8a8580'); R(cx + 11, top + 4, 2, 3, '#8a8580');
  },
  student(cx, top) { const c = '#2a221e', f = '#2b2e31';
    polyFill([[cx - 13, top + 8], [cx - 13, top - 2], [cx - 10, top - 7], [cx - 6, top - 10], [cx - 2, top - 8], [cx + 1, top - 11], [cx + 5, top - 8], [cx + 9, top - 9], [cx + 13, top - 2], [cx + 13, top + 8], [cx + 11, top + 8], [cx + 11, top + 3], [cx + 2, top + 4], [cx - 5, top + 3], [cx - 11, top + 4], [cx - 11, top + 8]], c);
    dotLine(cx - 6, top - 8, cx - 3, top - 2, '#4a3a32', 1); dotLine(cx + 3, top - 8, cx + 6, top - 2, '#4a3a32', 1);
    for (const x of [cx - 11, cx + 2]) { R(x, top + 8, 9, 1, f); R(x, top + 15, 9, 1, f); R(x, top + 8, 1, 8, f); R(x + 8, top + 8, 1, 8, f); R(x + 2, top + 10, 2, 1, '#c9dbe4'); }
    R(cx - 2, top + 10, 4, 1, f); R(cx - 13, top + 9, 2, 1, f); R(cx + 11, top + 9, 2, 1, f);
  },
  long(cx, top, back) { const c = '#3a2620', l = '#5a3a30';
    if (back) { polyFill([[cx - 16, top + 2], [cx - 13, top - 4], [cx + 13, top - 4], [cx + 16, top + 2], [cx + 17, top + 38], [cx + 11, top + 40], [cx - 11, top + 40], [cx - 17, top + 38]], c); return; }
    polyFill([[cx - 14, top + 30], [cx - 14, top - 2], [cx - 10, top - 7], [cx - 2, top - 9], [cx + 6, top - 8], [cx + 11, top - 6], [cx + 14, top - 2], [cx + 14, top + 30], [cx + 11, top + 30], [cx + 11, top + 6], [cx + 4, top + 1], [cx, top - 1], [cx - 4, top + 1], [cx - 11, top + 6], [cx - 11, top + 30]], c);
    dotLine(cx, top - 8, cx, top - 1, '#24160f', 1); dotLine(cx - 4, top - 7, cx - 12, top + 4, l, 1); dotLine(cx + 4, top - 7, cx + 12, top + 4, l, 1); dotLine(cx - 13, top + 8, cx - 13, top + 28, l, 2);
  },
  buzz(cx, top) { const c = '#2a2420';
    polyFill([[cx - 12, top + 5], [cx - 12, top - 1], [cx - 9, top - 4], [cx - 3, top - 5], [cx + 3, top - 5], [cx + 9, top - 4], [cx + 12, top - 1], [cx + 12, top + 5], [cx + 11, top + 2], [cx - 11, top + 2]], c);
    for (let i = 0; i < 18; i++) R(cx - 10 + rnd(i, 3) * 20, top - 4 + rnd(3, i) * 6, 1, 1, '#4a3e36');
    R(cx - 14, top + 11, 2, 3, '#f4f1ea'); R(cx + 12, top + 11, 2, 3, '#f4f1ea');
  },
  // 하은's snapback pulled down from the front: a six-panel crown a little wider than her head, the patch, the brim seen
  // from level with its dark underside, its shadow over the eyes. turned swings the brim toward her left (screen right)
  cap(cx, top, turned) {
    const d = turned ? 4 : 0, red = '#d8463b', redD = '#a83328';
    R(cx - 14, top + 4, 3, 12, '#4a3328'); R(cx + 11, top + 4, 3, 10, '#4a3328'); R(cx - 13, top + 6, 1, 8, '#6b4a3a');
    if (turned) polyFill([[cx - 17, top + 2], [cx - 13, top + 2], [cx - 13, top + 18], [cx - 16, top + 22], [cx - 18, top + 12]], '#4a3328');
    R(cx - 11, top + 2, 22, 9, '#8a5e44'); R(cx - 11, top + 2, 22, 6, '#6b4631'); R(cx - 11, top + 11, 22, 2, '#b98260');
    const crown = []; for (let i = 0; i <= 16; i++) { const th = Math.PI * i / 16, c = Math.cos(th); crown.push([cx + Math.sign(c) * Math.abs(c) ** 0.8 * 15, top + 2 - Math.sin(th) ** 0.6 * 14]); }
    polyFill(crown, red);
    g.save(); clipPoly(crown); polyFill([[cx + 6 + d, top - 14], [cx + 18, top - 14], [cx + 18, top + 3], [cx + 9 + d, top + 3]], '#b8382e'); polyFill([[cx - 18, top - 14], [cx - 7, top - 14], [cx - 10, top + 3], [cx - 18, top + 3]], '#c43f35'); R(cx - 9, top - 10, 6, 2, '#ef6a55'); g.restore();
    dotLine(cx - 7, top - 11, cx - 10, top + 1, redD, 1); dotLine(cx + 6 + d, top - 11, cx + 9 + d, top + 1, redD, 1); R(cx - 1, top - 13, 3, 1, redD);
    R(cx - 3 + d, top - 7, 7, 5, '#f4f1ea'); R(cx - 1 + d, top - 5, 3, 1, red);
    polyFill([[cx - 16 + d, top + 1], [cx + 16 + d, top + 1], [cx + 17 + d, top + 4], [cx + 13 + d, top + 6], [cx - 13 + d, top + 6], [cx - 17 + d, top + 4]], '#5c2420');
    R(cx - 15 + d, top + 1, 30, 1, '#461a17'); R(cx - 13 + d, top + 5, 26, 1, '#b8382e'); R(cx - 12 + d, top + 6, 24, 1, '#8e2c25');
  }
};
// a seated person from the front: seat = the cushion's top
function sitHD(cx, seat, o) {
  const w = o.w || 34, top = seat - 36, topC = o.top, sh = mix(topC, '#000000', 0.28), sp = o.spread || 0, pants = o.pants, ps = mix(pants, '#000000', 0.25), pl = mix(pants, '#ffffff', 0.14);
  for (const x of [cx - 12 - sp, cx + 2 + sp]) { R(x, seat + 6, 10, 24, pants); R(x + (x < cx ? 9 : 0), seat + 6, 1, 24, ps); R(x, seat + 6, 10, 2, pl); polyFill([[x - 1, seat + 30], [x + 11, seat + 30], [x + 12, seat + 33], [x + 12, seat + 35], [x - 2, seat + 35], [x - 2, seat + 32]], o.shoe || '#1e1a1a'); R(x - 2, seat + 35, 14, 2, o.sole || '#3a3236'); R(x + 1, seat + 31, 6, 1, mix(o.shoe || '#1e1a1a', '#ffffff', 0.2)); }
  polyFill([[cx - w / 2 + 2, seat - 2], [cx + w / 2 - 2, seat - 2], [cx + w / 2 - 1, seat + 7], [cx - w / 2 + 1, seat + 7]], pants); R(cx - w / 2 + 2, seat - 2, w - 4, 1, pl); R(cx, seat, 1, 7, ps); R(cx - w / 2 + 1, seat + 6, w - 2, 1, ps);
  if (o.noTorso) return top;
  R(cx - 4, top - 3, 8, 4, SKD); R(cx - 4, top - 3, 8, 1, '#9c6a4c');
  polyFill([[cx - w / 2 + 4, top], [cx + w / 2 - 4, top], [cx + w / 2, top + 5], [cx + w / 2, top + 36], [cx - w / 2, top + 36], [cx - w / 2, top + 5]], topC);
  polyFill([[cx - w / 2, top + 6], [cx - w / 2 + 3, top + 6], [cx - w / 2 + 3, top + 36], [cx - w / 2, top + 36]], sh); polyFill([[cx + w / 2 - 3, top + 6], [cx + w / 2, top + 6], [cx + w / 2, top + 36], [cx + w / 2 - 3, top + 36]], sh);
  R(cx - w / 2 + 4, top, w - 8, 1, mix(topC, '#ffffff', 0.2));
  if (o.dress) o.dress(cx, top, w);
  if (o.hands !== false) for (const e of [-1, 1]) { const sx = cx + e * (w / 2 - 3), ex = cx + e * (w / 2 - 1), hx = cx + e * 6; limb(sx, top + 6, 8, ex, top + 22, 7, sh); limb(ex, top + 22, 7, hx, seat - 3, 6, sh); limb(sx, top + 6, 8, ex, top + 22, 7, topC, 1, e); ellFill(hx, seat - 1, 4, 3, SK); R(hx - 3, seat + 1, 6, 1, SKD); }
  if (o.extra) o.extra(cx, top, seat);
  return top;
}
function standHD(cx, feet, o) {
  const w = o.w || 32, legTop = feet - 44, top = legTop - 36, pants = o.pants, ps = mix(pants, '#000000', 0.25), sh = mix(o.top, '#000000', 0.28);
  for (const x of [cx - 12, cx + 2]) { R(x, legTop, 10, 40, pants); R(x + (x < cx ? 9 : 0), legTop, 1, 40, ps); if (o.stripe) R(x + (x < cx ? 0 : 9), legTop, 1, 40, o.stripe); polyFill([[x - 1, feet - 4], [x + 11, feet - 4], [x + 12, feet - 1], [x + 12, feet], [x - 2, feet], [x - 2, feet - 2]], o.shoe || '#1e1a1a'); R(x - 2, feet, 14, 2, o.sole || '#d9d4c6'); }
  R(cx - 4, top - 3, 8, 4, SKD);
  polyFill([[cx - w / 2 + 4, top], [cx + w / 2 - 4, top], [cx + w / 2, top + 5], [cx + w / 2, top + 37], [cx - w / 2, top + 37], [cx - w / 2, top + 5]], o.top);
  polyFill([[cx - w / 2, top + 6], [cx - w / 2 + 3, top + 6], [cx - w / 2 + 3, top + 37], [cx - w / 2, top + 37]], sh); polyFill([[cx + w / 2 - 3, top + 6], [cx + w / 2, top + 6], [cx + w / 2, top + 37], [cx + w / 2 - 3, top + 37]], sh);
  R(cx - w / 2 + 4, top, w - 8, 1, mix(o.top, '#ffffff', 0.2));
  if (o.dress) o.dress(cx, top, w);
  if (o.extra) o.extra(cx, top);
  return top;
}
// an arm that cannot stretch: an 18-pixel upper arm and a 20-pixel forearm, the elbow bending outward (or the other way
// if that would put it past minX), a sleeve with its lit edge, a hand
function armHD(sx, sy, hx, hy, c, skin, bendSide = 1, L1 = 18, L2 = 20, minX = -Infinity) {
  const dx = hx - sx, dy = hy - sy, d = Math.min(L1 + L2 - 0.01, Math.hypot(dx, dy)), a = Math.atan2(dy, dx), k = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1));
  let side = bendSide; if (sx + Math.cos(a + side * k) * L1 < minX) side = -side;
  const ex = sx + Math.cos(a + side * k) * L1, ey = sy + Math.sin(a + side * k) * L1, tx = sx + Math.cos(a) * d, ty = sy + Math.sin(a) * d;
  limb(sx, sy, 8, ex, ey, 7, c); blob(ex, ey, 3, c); limb(ex, ey, 7, tx, ty, 6, c); limb(sx, sy, 8, ex, ey, 7, mix(c, '#ffffff', 0.14), 2.5, -1.5);
  const ux = Math.cos(Math.atan2(ty - ey, tx - ex)), uy = Math.sin(Math.atan2(ty - ey, tx - ex));
  ellFill(tx + ux * 3, ty + uy * 3, 3.5, 3.5, skin); R(tx + ux * 3 - 2, ty + uy * 3 + 2, 4, 1, mix(skin, '#000000', 0.2));
}
function bagHD(x, y) {
  R(x + 3, y, 2, 5, '#2f3237'); R(x + 13, y, 2, 5, '#2f3237'); R(x + 4, y - 1, 10, 2, '#2f3237');
  polyFill([[x, y + 4], [x + 18, y + 4], [x + 18, y + 18], [x + 17, y + 19], [x + 1, y + 19], [x, y + 18]], '#2f3237'); R(x, y + 4, 18, 1, '#4a4e55');
  R(x, y + 5, 18, 6, '#3a3e44'); R(x, y + 11, 18, 1, '#1e2024'); R(x + 7, y + 9, 4, 3, '#9aa0a6'); R(x + 8, y + 10, 2, 1, '#2f3237'); R(x + 1, y + 18, 16, 1, '#1e2024');
}
// 하은 seated, leaning forward, half up and standing, from the front
const HAEUN_DRESS_HD = (x, y) => {
  polyFill([[x - 12, y + 2], [x - 4, y + 2], [x, y + 11], [x + 4, y + 2], [x + 12, y + 2], [x + 13, y + 6], [x + 13, y + 33], [x - 13, y + 33], [x - 13, y + 6]], '#7ec8e3');
  polyFill([[x - 13, y + 6], [x - 10, y + 4], [x - 10, y + 33], [x - 13, y + 33]], '#68b4d0'); polyFill([[x + 10, y + 4], [x + 13, y + 6], [x + 13, y + 33], [x + 10, y + 33]], '#5aa6c4');
  dotLine(x - 4, y + 2, x, y + 11, '#a8e0f2', 1); for (let yy = y + 12; yy < y + 33; yy++) R(x, yy, 1, 1, yy % 2 ? '#4a8fb0' : '#a8e0f2');
  R(x - 13, y + 17, 26, 4, '#e6e1cc'); R(x - 13, y + 17, 26, 1, '#fffdf2'); R(x - 13, y + 21, 26, 1, '#a8a28a'); for (let xx = x - 11; xx < x + 13; xx += 5) R(xx, y + 18, 1, 3, '#cfc9b0');
  R(x - 2, y - 1, 4, 2, '#1e1a1a');
  limb(x + 11, y + 2, 3, x - 12, y + 31, 3, '#2f3237'); R(x + 7, y + 7, 4, 3, '#9aa0a6');
};
function haeunHD(cx, pose, o = {}) {
  const seat = o.seat, pants = '#3a3f45', pd = '#2a2e33', blk = '#1e1a1a';
  const torso = (top, h = 36) => { polyFill([[cx - 12, top], [cx + 12, top], [cx + 16, top + 5], [cx + 16, top + h], [cx - 16, top + h], [cx - 16, top + 5]], blk); R(cx - 4, top - 3, 8, 4, SKD); HAEUN_DRESS_HD(cx, top); };
  // her head a size smaller than the others': the cap adds to it
  const head = top => rotated(0, cx, top + 26, cx, top + 26, () => { faceHD(cx, top, { eyes: 'hidden' }); HAIRHD.cap(cx, top, o.turned); }, 0.82);
  const shins = () => { for (const x of [cx - 12, cx + 2]) { R(x, seat + 6, 10, 24, pants); R(x + (x < cx ? 9 : 0), seat + 6, 1, 24, pd); R(x, seat + 6, 10, 2, '#4a5058'); polyFill([[x - 1, seat + 30], [x + 11, seat + 30], [x + 12, seat + 33], [x + 12, seat + 35], [x - 2, seat + 35], [x - 2, seat + 32]], blk); R(x - 2, seat + 35, 14, 2, '#e9e3d6'); } };
  const lap = (y0, hgt) => { polyFill([[cx - 15, y0], [cx + 15, y0], [cx + 16, y0 + hgt], [cx - 16, y0 + hgt]], pants); R(cx - 15, y0, 30, 1, '#545a62'); R(cx, y0 + 1, 1, hgt - 1, pd); };
  if (pose === 'sit') { shins(); lap(seat - 2, 9); torso(seat - 36); head(seat - 62); return seat - 36; }
  if (pose === 'lean') {
    shins(); lap(seat - 2, 9); const top = seat - 30;
    polyFill([[cx - 13, top], [cx + 13, top], [cx + 16, top + 4], [cx + 16, top + 28], [cx - 16, top + 28], [cx - 16, top + 4]], blk); HAEUN_DRESS_HD(cx, top - 4); R(cx - 16, top + 28, 32, 2, blk);
    head(top - 24); R(cx - 12, top - 22, 24, 3, '#a83328');
    for (const e of [-1, 1]) { limb(cx + e * 14, top + 6, 7, cx + e * 13, seat + 3, 6, blk); ellFill(cx + e * 13, seat + 4, 4, 3, SK); }
    return top;
  }
  if (pose === 'half') {
    shins(); lap(seat - 10, 16); const top = seat - 44; torso(top); head(top - 26);
    for (const e of [-1, 1]) { limb(cx + e * 14, top + 6, 7, cx + e * 15, top + 30, 6, blk); ellFill(cx + e * 15, top + 32, 3.5, 3.5, SK); }
    return top;
  }
  const feet = seat + 34, legTop = feet - 44, top = legTop - 36;
  for (const x of [cx - 12, cx + 2]) { R(x, legTop, 10, 40, pants); R(x + (x < cx ? 9 : 0), legTop, 1, 40, pd); polyFill([[x - 1, feet - 4], [x + 11, feet - 4], [x + 12, feet - 1], [x + 12, feet], [x - 2, feet], [x - 2, feet - 2]], blk); R(x - 2, feet, 14, 2, '#e9e3d6'); }
  polyFill([[cx - 16, legTop - 2], [cx + 16, legTop - 2], [cx + 15, legTop + 4], [cx - 15, legTop + 4]], pants);
  torso(top); head(top - 26);
  for (const e of [-1, 1]) { limb(cx + e * 14, top + 6, 7, cx + e * 16, top + 32, 6, blk); ellFill(cx + e * 16, top + 34, 3.5, 3.5, SK); }
  return top;
}
// 신입: seated, the upper body leaning about the hips and the head about the neck (both turned pixel by pixel)
function sinipTorsoHD(cx, hip) {
  const top = hip - 36; R(cx - 4, top - 3, 8, 4, SKD);
  polyFill([[cx - 14, top], [cx + 14, top], [cx + 18, top + 5], [cx + 18, top + 36], [cx - 18, top + 36], [cx - 18, top + 5]], '#2f4f58');
  polyFill([[cx - 14, top + 2], [cx - 3, top + 2], [cx - 3, top + 26], [cx - 15, top + 26], [cx - 15, top + 6]], '#cfe04a'); polyFill([[cx + 3, top + 2], [cx + 14, top + 2], [cx + 15, top + 6], [cx + 15, top + 26], [cx + 3, top + 26]], '#cfe04a');
  R(cx - 15, top + 15, 12, 4, '#ebe5c9'); R(cx + 3, top + 15, 12, 4, '#ebe5c9'); R(cx - 15, top + 15, 12, 1, '#fffdf2'); R(cx + 3, top + 15, 12, 1, '#fffdf2');
  R(cx - 15, top + 6, 2, 20, '#b5c43a'); R(cx + 13, top + 6, 2, 20, '#b5c43a'); R(cx - 6, top - 2, 12, 4, '#213840'); R(cx - 18, top + 6, 3, 30, '#213840'); R(cx + 15, top + 6, 3, 30, '#213840');
  for (const e of [-1, 1]) limb(cx + e * 16, top + 6, 8, cx + e * 12, top + 34, 7, '#284650');
}
// draw rotated (and scaled by k) about (px, py), placed at (x, y): every rectangle and polygon goes through the turn as a shape, so the
// one-pixel detail stays crisp instead of being resampled
let XF = null;
function rotated(ang, px, py, x, y, draw, k = 1) {
  const cs = Math.cos(ang) * k, sn = Math.sin(ang) * k, T = (u, v) => [x + cs * (u - px) - sn * (v - py), y + sn * (u - px) + cs * (v - py)];
  const hook = (rx, ry, rw, rh, c) => {
    if (rw <= 0 || rh <= 0) return;
    if (rw < 1.5 || rh < 1.5) { const n = Math.max(1, Math.round(Math.max(rw, rh))); g.fillStyle = c; for (let i = 0; i < n; i++) { const [qx, qy] = rw >= rh ? T(rx + i + 0.5, ry + 0.5) : T(rx + 0.5, ry + i + 0.5); g.fillRect(Math.floor(qx), Math.floor(qy), 1, 1); } return; }
    polyFill([[rx, ry], [rx + rw, ry], [rx + rw, ry + rh], [rx, ry + rh]], c);
  };
  XF = T; RHOOK = hook; try { draw(); } finally { XF = null; RHOOK = null; }
}
function sinipLeanHD(SX, SEAT, lean, tilt, t) {
  sitHD(SX, SEAT, { w: 36, top: '#2f4f58', pants: '#33415a', spread: 1, hands: false, noTorso: true });
  rotated(lean, 64, 100, SX, SEAT, () => sinipTorsoHD(64, 100));
  const nx = SX + Math.sin(lean) * 38, ny = SEAT - Math.cos(lean) * 38;
  const head = () => rotated(lean + tilt, 64, 77, nx, ny, () => { faceHD(64, 50, { eyes: 'closed', blush: true, mouthOpen: true }); HAIRHD.sinip(64, 50); });
  for (const [x, y] of [[SX - 9, SEAT - 2], [SX + 7, SEAT - 1]]) { ellFill(x, y, 4, 3, SK); R(x - 3, y + 2, 6, 1, SKD); }
  const a = lean + tilt, hx = nx + Math.sin(a) * 14, hy = ny - Math.cos(a) * 14;
  // the head is drawn by the caller, over her shoulder where it rests
  return [hx, hy, () => { head(); zzz(Math.round(hx + 12), Math.round(hy - 24), t * 1000); }];
}
const PASSHD = {
  salaryman(t, cx, seat) {
    const drop = (t % 4.2) > 3.1 ? 4 : (t % 4.2) > 2.2 ? 2 : 0;
    polyFill([[cx + 16, seat + 16], [cx + 40, seat + 16], [cx + 40, seat + 37], [cx + 16, seat + 37]], '#4a3a2a'); R(cx + 16, seat + 16, 24, 2, '#6a5440'); R(cx + 24, seat + 12, 8, 2, '#4a3a2a'); R(cx + 24, seat + 12, 1, 5, '#4a3a2a'); R(cx + 31, seat + 12, 1, 5, '#4a3a2a'); R(cx + 26, seat + 22, 4, 2, '#c9a63a'); R(cx + 16, seat + 26, 24, 1, '#3a2c1e');
    const top = sitHD(cx, seat, { w: 36, top: '#3a3e48', pants: '#33363e', spread: 1, dress: (x, y) => {
      polyFill([[x - 6, y + 1], [x + 6, y + 1], [x, y + 16]], '#e9ecef'); polyFill([[x - 2, y + 3], [x + 2, y + 3], [x + 3, y + 18], [x, y + 21], [x - 3, y + 18]], '#8a2a2a'); R(x - 2, y + 3, 4, 2, '#b84a4a');
      polyFill([[x - 7, y + 1], [x - 2, y + 18], [x - 6, y + 20], [x - 10, y + 6]], '#2a2d35'); polyFill([[x + 7, y + 1], [x + 2, y + 18], [x + 6, y + 20], [x + 10, y + 6]], '#2a2d35');
      R(x - 1, y + 24, 2, 2, '#1e2026'); R(x - 1, y + 30, 2, 2, '#1e2026'); } });
    faceHD(cx, top - 28 + drop, { eyes: 'closed', blush: true }); HAIRHD.salary(cx, top - 28 + drop);
  },
  student(t, cx, seat) {
    const turn = t > 1.4 && t < 1.8;
    polyFill([[cx + 18, seat + 16], [cx + 36, seat + 16], [cx + 37, seat + 37], [cx + 17, seat + 37]], '#4a5a3a'); R(cx + 18, seat + 16, 18, 3, '#5a6a4a'); R(cx + 22, seat + 23, 10, 6, '#3a4a2a'); R(cx + 22, seat + 23, 10, 1, '#6a7a5a');
    const top = sitHD(cx, seat, { w: 32, top: '#9a9488', pants: '#3a4a6a', shoe: '#e9e4da', sole: '#b9b4aa', hands: false, dress: (x, y) => {
      polyFill([[x - 9, y - 1], [x + 9, y - 1], [x + 6, y + 5], [x - 6, y + 5]], '#8a847a'); R(x - 3, y + 2, 1, 10, '#d9d4c6'); R(x + 2, y + 2, 1, 10, '#d9d4c6'); R(x - 3, y + 12, 1, 1, '#b9b4aa'); R(x + 2, y + 12, 1, 1, '#b9b4aa');
      polyFill([[x - 9, y + 20], [x + 9, y + 20], [x + 10, y + 31], [x - 10, y + 31]], '#8a847a'); R(x - 9, y + 20, 18, 1, '#aaa498'); } });
    for (const e of [-1, 1]) { limb(cx + e * 13, top + 6, 8, cx + e * 15, top + 22, 7, '#86806f'); limb(cx + e * 15, top + 22, 7, cx + e * 15, seat - 6, 6, '#86806f'); }
    polyFill([[cx - 16, seat - 12], [cx + 16, seat - 12], [cx + 16, seat - 1], [cx - 16, seat - 1]], '#f4f1ea'); R(cx, seat - 12, 1, 11, '#c9c2b0'); R(cx - 16, seat - 1, 32, 2, '#2f5f8a');
    for (let k = 0; k < 4; k++) { R(cx - 13, seat - 10 + k * 2, 10, 1, '#c9c2b0'); R(cx + 3, seat - 10 + k * 2, 10, 1, '#c9c2b0'); }
    if (turn) polyFill([[cx + 1, seat - 12], [cx + 10, seat - 18], [cx + 12, seat - 8], [cx + 2, seat - 2]], '#ffffff');
    for (const e of [-1, 1]) { ellFill(cx + e * 16, seat - 5, 3.5, 3.5, SK); R(cx + e * 16 - 2, seat - 2, 4, 1, SKD); }
    faceHD(cx, top - 26, { eyes: 'closed', look: 'down' }); HAIRHD.student(cx, top - 26);
  },
  phoneWoman(t, cx, feet, bar) {
    const scroll = Math.floor(t / 0.9) % 2;
    const top = standHD(cx, feet, { w: 28, top: '#c9b089', pants: '#4a5a7a', shoe: '#e9e4da', sole: '#c9c4ba', dress: (x, y) => {
      polyFill([[x - 5, y + 1], [x + 5, y + 1], [x + 4, y + 22], [x - 4, y + 22]], '#f4f1ea'); polyFill([[x - 6, y + 1], [x - 3, y + 24], [x - 6, y + 37], [x - 9, y + 4]], '#b39a74'); polyFill([[x + 6, y + 1], [x + 3, y + 24], [x + 6, y + 37], [x + 9, y + 4]], '#b39a74');
      R(x - 14, y + 22, 28, 2, '#a88f68'); polyFill([[x - 14, y + 37], [x + 14, y + 37], [x + 15, y + 52], [x + 5, y + 52], [x + 4, y + 40], [x - 4, y + 40], [x - 5, y + 52], [x - 15, y + 52]], '#c9b089'); } });
    HAIRHD.long(cx, top - 28, true); faceHD(cx, top - 28, { eyes: 'open', look: 'down' }); HAIRHD.long(cx, top - 28);
    const sx = cx - 20; R(sx, bar, 1, top - 38 - bar, '#e3e7ea'); R(sx - 5, top - 38, 11, 2, '#eef1f3'); R(sx - 5, top - 38, 2, 10, '#eef1f3'); R(sx + 4, top - 38, 2, 10, '#c9ced3'); R(sx - 5, top - 30, 11, 2, '#b9bfc5');
    limb(cx - 12, top + 4, 8, cx - 21, top - 14, 7, '#b39a74'); limb(cx - 21, top - 14, 7, cx - 20, top - 30, 6, '#c9b089'); ellFill(cx - 20, top - 33, 4, 4, SK); R(cx - 23, top - 31, 6, 1, SKD);
    limb(cx + 12, top + 6, 8, cx + 14, top + 20, 7, '#b39a74'); limb(cx + 14, top + 20, 7, cx + 6, top + 18, 6, '#c9b089');
    R(cx + 1, top + 10, 9, 14, '#1b1716'); R(cx + 2, top + 11, 7, 11, scroll ? '#9fd8ec' : '#bfe6f2'); R(cx + 3, top + 13 + scroll * 2, 5, 1, '#5a8aa0'); R(cx + 3, top + 16 + scroll * 2, 4, 1, '#5a8aa0'); ellFill(cx + 5, top + 21, 4, 3, SK);
    light(cx + 5, top + 8, 22, '159,216,236', 0.22);
    polyFill([[cx + 14, top + 26], [cx + 26, top + 26], [cx + 27, top + 44], [cx + 13, top + 44]], '#8a5a3a'); R(cx + 14, top + 26, 12, 2, '#a06c48'); dotLine(cx + 10, top + 2, cx + 16, top + 26, '#6a4428', 1);
  },
  trackMan(t, cx, feet, bar) {
    const nod = Math.floor(t / 0.5) % 2 * 2;
    const top = standHD(cx, feet, { w: 36, top: '#2a3a6a', pants: '#2a3a6a', stripe: '#e9ecef', shoe: '#e9e4da', sole: '#d8463b', dress: (x, y, w) => {
      R(x - w / 2, y + 5, 2, 32, '#e9ecef'); R(x + w / 2 - 2, y + 5, 2, 32, '#e9ecef'); R(x, y + 2, 1, 35, '#9aa0a6'); R(x - 1, y + 4, 3, 3, '#c9ced3'); polyFill([[x - 6, y - 2], [x + 6, y - 2], [x + 5, y + 3], [x - 5, y + 3]], '#1f2c52'); R(x - 14, y + 34, 28, 3, '#1f2c52'); } });
    faceHD(cx, top - 28 + nod, { eyes: 'closed' }); HAIRHD.buzz(cx, top - 28 + nod);
    dotLine(cx - 13, top - 14 + nod, cx - 4, top + 8, '#f4f1ea', 1); dotLine(cx + 13, top - 14 + nod, cx + 4, top + 8, '#f4f1ea', 1);
    polyFill([[cx - 26, top + 16], [cx - 6, top + 16], [cx - 5, top + 40], [cx - 27, top + 40]], '#1e1a1a'); R(cx - 26, top + 16, 20, 2, '#3a3436'); R(cx - 22, top + 24, 8, 4, '#d8463b'); limb(cx - 12, top + 3, 3, cx - 16, top + 17, 3, '#1e1a1a');
    R(cx - 21, bar, 2, top + 4 - bar, '#c9ced3'); limb(cx - 14, top + 6, 8, cx - 19, top - 4, 7, '#2a3a6a'); ellFill(cx - 20, top - 6, 4, 4, SK);
  }
};
// the car from across the aisle, close: the window and the tunnel over the bench, the door to the right, the pole between
// them; the passengers and the two of them big enough to read faces, at the game's own pixel size
function trainTwoShot(t) {
  const S = trainS(t), v = trainV(t), arrived = clamp((t - 9.6) / 1.4, 0, 1);
  shot(1, (w, h) => {
    const bounce = v > 20 && (S % 68) < 6 ? 1 : 0;
    g.save(); g.translate(0, bounce);
    const BAR = 20, WX0 = 8, WX1 = 240, WY0 = 44, WY1 = 92, SEAT = 140;
    // ceiling, light panels, the grab bar; the wall with the ad frames
    R(0, 0, w, 42, '#c9cfd6'); R(0, 0, w, 18, '#d3d9de'); for (let x = 20; x < w; x += 120) { R(x, 4, 80, 4, '#f6fafb'); R(x, 8, 80, 1, '#aab2b8'); light(x + 40, 6, 50, '240,248,250', 0.22); }
    R(0, BAR, w, 3, '#c9ced3'); R(0, BAR, w, 1, '#eef1f3'); R(0, BAR + 3, w, 1, '#8a9097');
    for (const [x, c, c2] of [[16, '#c0546a', '#f2d3a0'], [72, '#3f8a7a', '#f4f1ea'], [128, '#e0b84a', '#2b2e33'], [184, '#5a6fa8', '#f4f1ea']]) { R(x, 26, 48, 14, '#9aa1a8'); R(x + 1, 27, 46, 12, c); R(x + 4, 30, 20, 1, c2); R(x + 4, 33, 14, 1, c2); R(x + 4, 35, 10, 1, c2); R(x + 32, 29, 10, 8, c2); R(x + 33, 30, 8, 6, c); R(x + 1, 27, 46, 1, mix(c, '#ffffff', 0.25)); }
    R(0, 41, 250, 1, '#9aa1a8');
    // the window: frame, rubber, the tunnel streaming past with its cables and lamps; the platform sliding in at the end
    R(WX0 - 3, WY0 - 3, WX1 - WX0 + 6, WY1 - WY0 + 6, '#a9b0b6'); R(WX0 - 3, WY0 - 3, WX1 - WX0 + 6, 1, '#e3e8eb'); R(WX0 - 1, WY0 - 1, WX1 - WX0 + 2, WY1 - WY0 + 2, '#2b2e33');
    g.save(); g.beginPath(); g.rect(WX0, WY0, WX1 - WX0, WY1 - WY0); g.clip();
    R(WX0, WY0, WX1 - WX0, WY1 - WY0, '#07080c');
    for (let k = -1; k < 10; k++) { const x = WX0 + (((k * 48 - S * 2) % 336) + 336) % 336; R(x, WY0, 4, WY1 - WY0, '#10141c'); R(x + 4, WY0, 1, WY1 - WY0, '#0b0e14'); }
    for (const [y, c] of [[52, '#1a1f29'], [54, '#151a23'], [56, '#1a1f29'], [86, '#12161e']]) for (let x = WX0; x < WX1; x += 2) R(x, y + Math.round(Math.sin((x + S * 2) / 34)), 2, 1, c);
    for (let k = 0; k < 3; k++) { const x = WX0 + (((k * 168 + 80 - S * 2) % 504) + 504) % 504, len = 4 + Math.round(v * 0.24); R(x - len, 48, len + 4, 1, '#fff3c8'); R(x - len, 49, len + 4, 2, '#ffd890'); R(x - len + 2, 47, len, 1, '#c99a54'); light(x, 49, 16 + v * 0.1, '255,216,144', 0.45); }
    const px = WX0 + (PLAT - S) * 2;
    if (px < WX1) {
      R(px, WY0, WX1 - px, WY1 - WY0, '#d7dfdb'); for (let y = WY0; y < WY1; y += 5) R(px, y, WX1 - px, 1, '#c6cfcb'); for (let x = px; x < WX1; x += 8) R(x, WY0, 1, WY1 - WY0, '#c6cfcb');
      R(px, 72, WX1 - px, 5, '#2f6f8a'); R(px, 77, WX1 - px, 1, '#7fb4c8');
      for (const sx of [px + 40, px + 200]) { R(sx, 52, 72, 12, '#1e2a33'); R(sx + 1, 53, 70, 10, '#2f3a4a'); R(sx + 1, 62, 70, 1, '#8fd694'); hospName(sx + 10, 53, '#e9eef0', 8); }
      light(px + 120, WY0, 90, '240,250,255', 0.3);
    }
    g.restore();
    for (const x of [86, 164]) { R(x - 1, WY0, 3, WY1 - WY0, '#a9b0b6'); R(x - 1, WY0, 1, WY1 - WY0, '#e3e8eb'); R(x + 2, WY0, 1, WY1 - WY0, '#2b2e33'); }
    g.save(); g.globalAlpha = 0.14; for (let k = 0; k < 3; k++) R(WX0 + 12 + k * 78, WY0 + 2, 44, 1, '#ffffff'); for (let k = 0; k < 14; k++) { R(WX0 + 40 + k * 2, WY1 - 2 - k * 3, 6, 1, '#ffffff'); R(WX0 + 190 + k * 2, WY1 - 2 - k * 3, 4, 1, '#ffffff'); } g.restore();
    // the door: two leaves with their windows, the warning stickers, the LED board over it, the yellow sill
    R(256, 26, 106, 170, '#b9c0c7'); R(256, 26, 106, 1, '#e3e8eb'); R(260, 38, 48, 158, '#d6dbe0'); R(310, 38, 48, 158, '#d6dbe0'); R(308, 38, 2, 158, '#2b2e33');
    for (const x of [268, 318]) { R(x, 50, 32, 56, '#2b2e33'); R(x + 1, 51, 30, 54, px < x + 30 ? '#cfd8d4' : '#0a0c10'); g.save(); g.globalAlpha = 0.12; for (let k = 0; k < 12; k++) R(x + 6 + k * 2, 100 - k * 4, 4, 1, '#ffffff'); g.restore(); R(x + 2, 116, 10, 10, '#f2d35a'); R(x + 3, 117, 8, 8, '#e0b84a'); R(x + 6, 118, 2, 4, '#1b1716'); R(x + 6, 123, 2, 1, '#1b1716'); }
    R(262, 110, 44, 1, '#aab2b8'); R(312, 110, 44, 1, '#aab2b8'); R(256, 160, 106, 3, '#f2d35a'); R(256, 163, 106, 1, '#b89a2a');
    R(282, 27, 54, 10, '#141414'); R(283, 28, 52, 8, '#2a1209'); for (let k = 0; k < 7; k++) { const on = (Math.floor(t * 4) + k) % 7 < 3; R(287 + k * 7, 30, 4, 1, on ? '#ff8a3d' : '#4a1e0e'); R(288 + k * 7, 31, 2, 1, on ? '#ff8a3d' : '#4a1e0e'); R(287 + k * 7, 32, 4, 1, on ? '#ff8a3d' : '#4a1e0e'); }
    R(362, 26, 22, 170, '#c9d0d5'); R(362, 26, 1, 170, '#e3e8eb');
    // the bench: the moquette back with its weave and padded top, the cushion, the steel skirt and its vents
    R(0, 94, 248, 46, '#2f5f8a'); for (let y = 98; y < 138; y += 4) for (let x = (y / 4) % 2 ? 2 : 0; x < 248; x += 4) R(x, y, 2, 1, '#3a6d9a'); R(0, 94, 248, 4, '#4a82b4'); R(0, 94, 248, 1, '#6a9cc6'); R(0, 98, 248, 1, '#284f74');
    for (const x of [58, 102, 146, 190]) R(x, 98, 1, 42, '#284f74');
    R(0, 140, 248, 5, '#3f7fb0'); R(0, 140, 248, 1, '#6aa2cc'); R(0, 145, 248, 7, '#244766'); R(0, 152, 248, 10, '#8e979f'); R(0, 152, 248, 1, '#c5ccd2'); R(0, 161, 248, 1, '#5a6066'); for (let x = 8; x < 248; x += 16) R(x, 155, 10, 1, '#6f777e');
    // the floor: speckled vinyl, the window's light on it
    R(0, 162, w, 54, '#6b7279'); R(0, 162, w, 1, '#4a5056'); for (let y = 164; y < 216; y += 2) for (let x = (y * 7) % 5; x < w; x += 5) if (rnd(x, y) < 0.35) R(x, y, 1, 1, rnd(y, x) < 0.5 ? '#767d84' : '#626970');
    g.save(); g.globalAlpha = 0.12; R(0, 170, 248, 3, '#ffffff'); R(0, 182, 248, 2, '#ffffff'); g.restore();
    // the straps swing forward as the train brakes
    const sw = Math.round((v < 150 && v > 0 ? 3 : 0) + Math.sin(t * 3) * (v > 0 ? 1.5 : 0.5));
    for (const x of [24, 72, 168, 216]) { R(x, BAR + 4, 2, 12, '#e3e7ea'); R(x - 5 + sw, BAR + 16, 12, 2, '#f4f6f7'); R(x - 5 + sw, BAR + 18, 2, 8, '#eef1f3'); R(x + 5 + sw, BAR + 18, 2, 8, '#c9ced3'); R(x - 5 + sw, BAR + 26, 12, 2, '#b9bfc5'); }
    // the pole
    R(243, BAR, 6, 196, '#b8bec4'); R(244, BAR, 1, 196, '#f2f4f6'); R(247, BAR, 1, 196, '#7a8086'); R(240, 160, 12, 3, '#8e979f');
    // the passengers on the bench
    PASSHD.salaryman(t, 36, SEAT); PASSHD.student(t, 82, SEAT);
    // 하은 and 신입: he sleeps leaning on her, the cheek on her shoulder. She notices and looks a while; her far hand comes
    // across to his head and slowly lifts it off her shoulder; she lets go and he tips onto the pole; she gets up
    const HX = 168, SX = 212, RISE = 10.2;
    const push = ease(clamp((t - 5.0) / 2.4, 0, 1)), fall = clamp((t - 7.6) / 1.0, 0, 1), fe = fall * fall * (3 - 2 * fall);
    const lean = fall > 0 ? lerp(-0.04, 0.24, fe) : lerp(-0.22, -0.04, push), tilt = fall > 0 ? lerp(-0.15, 0.32, fe) : lerp(-0.8, -0.15, push);
    const reach = t < 4.2 ? 0 : t < 5.0 ? ease((t - 4.2) / 0.8) : t < 7.4 ? 1 : t < 8.0 ? 1 - ease((t - 7.4) / 0.6) : 0;
    const [headX, headY, sinipHead] = sinipLeanHD(SX, SEAT, lean, tilt, t);
    if (t < RISE) {
      const hTop = haeunHD(HX, 'sit', { turned: t > 3.0 && t < 8.6, seat: SEAT });
      bagHD(HX - 9, SEAT - 18); ellFill(HX + 6, SEAT - 17, 3.5, 3, SK); sinipHead();
      const a = lean + tilt, txh = headX - Math.cos(a) * 12, tyh = headY - Math.sin(a) * 12 + 2, sx0 = HX - 12 + Math.round(8 * reach), sy0 = hTop + 6;
      armHD(sx0, sy0, lerp(HX - 2, txh, reach), lerp(SEAT - 8, tyh, reach), '#1e1a1a', SK, 1, 18, 20, HX - 28);
    } else {
      const r = t - RISE, pose = r < 0.45 ? 'lean' : r < 0.9 ? 'half' : 'stand';
      const top = haeunHD(HX, pose, { turned: r > 1.2, seat: SEAT });
      const [bx, by] = pose === 'lean' ? [HX + 6, SEAT + 6] : pose === 'half' ? [HX + 10, top + 34] : [HX + 12, top + 36];
      bagHD(bx, by); ellFill(bx + 5, by - 2, 3.5, 3, SK); sinipHead();
    }
    // standing, nearer us than the bench
    PASSHD.phoneWoman(t, 126, 188, BAR + 4); PASSHD.trackMan(t, 376, 188, BAR + 4);
    // tunnel lamps passing light the car for a moment: the beat in the light
    for (let k = 0; k < 3; k++) { const x = WX0 + (((k * 168 + 80 - S * 2) % 504) + 504) % 504; if (v > 10) { g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createLinearGradient(x - 50, 0, x + 50, 0); gr.addColorStop(0, 'rgba(255,200,120,0)'); gr.addColorStop(0.5, `rgba(255,200,120,${0.1 * v / 150})`); gr.addColorStop(1, 'rgba(255,200,120,0)'); g.fillStyle = gr; g.fillRect(x - 50, 0, 100, h); g.restore(); } }
    if (arrived > 0) { g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = `rgba(230,240,245,${0.12 * arrived})`; g.fillRect(0, 0, w, h); g.restore(); }
    g.restore();
    vig(w, h, 0.38);
  });
  bars();
}

function shotDoor(u) { doorBust(u); }
function ellFill(cx, cy, rx, ry, c, yMin = -Infinity, yMax = Infinity) { if (XF) { const pts = []; for (let i = 0; i < 24; i++) { const a = Math.PI * 2 * i / 24; pts.push([cx + Math.cos(a) * rx, Math.max(yMin, Math.min(yMax, cy + Math.sin(a) * ry))]); } return polyFill(pts, c); } for (let y = Math.ceil(cy - ry); y <= Math.floor(cy + ry); y++) { if (y < yMin || y > yMax) continue; const d = (y + 0.5 - cy) / ry, half = rx * Math.sqrt(Math.max(0, 1 - d * d)); R(Math.round(cx - half), y, Math.round(half * 2), 1, c); } }
function clipPoly(pts) { if (XF) pts = pts.map(([a, b]) => XF(a, b)); g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.clip(); }
function dotLine(x0, y0, x1, y1, c, gap = 3) { const n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / gap)); for (let i = 0; i <= n; i++) R(Math.round(lerp(x0, x1, i / n)), Math.round(lerp(y0, y1, i / n)), 1, 1, c); }
// 2. 문 — drawn like a pixel illustration: one-pixel dark outlines round every shape, flat colours with one shade and one
//    light, the brim's shadow a solid black band over her eyes. She stands on the platform, still, chest up; behind her
//    the car's open door and him asleep on the bench inside; the doors slide shut on him, the train pulls away
const OL = '#16121a';
// a shape with its one-pixel outline
function inked(pts, c) { outlined(pts, c, OL); }
function haeunBustG(cx, by) {
  const sk = '#f2cdb6', skD = '#dcae96', skDD = '#b98877', skL = '#fde6d8', hair = '#1c1a1f', hairL = '#3a3642';
  const capR = '#b8323c', capD = '#8c2430', capL = '#d4505a', capDD = '#5e1620', blue = '#3fa9e0', blueD = '#2f86c4', blueL = '#74c6ef', blk = '#1d1b21', blkL = '#34313a';
  const s0 = by + 72;
  // hair behind the face and neck
  inked([[cx - 30, by - 2], [cx + 30, by - 2], [cx + 32, by + 26], [cx + 30, by + 46], [cx + 25, by + 58], [cx + 17, by + 50], [cx - 17, by + 50], [cx - 25, by + 58], [cx - 30, by + 46], [cx - 32, by + 26]], hair);
  // the body: black raglan sleeves, the blue front, the black crew neck
  inked([[cx - 14, s0 - 3], [cx - 40, s0 + 1], [cx - 62, s0 + 10], [cx - 76, s0 + 26], [cx - 82, 220], [cx + 82, 220], [cx + 76, s0 + 26], [cx + 62, s0 + 10], [cx + 40, s0 + 1], [cx + 14, s0 - 3]], blk);
  polyFill([[cx - 16, s0 - 1], [cx - 38, s0 + 4], [cx - 52, s0 + 30], [cx - 56, 220], [cx + 56, 220], [cx + 52, s0 + 30], [cx + 38, s0 + 4], [cx + 16, s0 - 1]], blue);
  for (const sd of [-1, 1]) { dotLine(cx + sd * 38, s0 + 4, cx + sd * 52, s0 + 30, OL, 1); dotLine(cx + sd * 52, s0 + 30, cx + sd * 56, 216, OL, 1); }
  polyFill([[cx + 40, s0 + 10], [cx + 50, s0 + 30], [cx + 54, 220], [cx + 44, 220], [cx + 42, s0 + 30]], blueD); polyFill([[cx - 34, s0 + 8], [cx - 42, s0 + 24], [cx - 40, s0 + 40], [cx - 34, s0 + 22]], blueL);
  dotLine(cx - 66, s0 + 22, cx - 60, s0 + 44, blkL, 1); dotLine(cx + 64, s0 + 20, cx + 70, s0 + 40, blkL, 1); dotLine(cx - 40, s0 + 3, cx - 62, s0 + 12, blkL, 1);
  inked([[cx - 16, s0 - 3], [cx + 16, s0 - 3], [cx + 13, s0 + 6], [cx, s0 + 10], [cx - 13, s0 + 6]], blk);
  // the bag's strap across her, from her left shoulder, and its buckle
  polyFill([[cx + 38, s0 + 2], [cx + 48, s0 + 6], [cx - 24, 220], [cx - 36, 220]], OL); polyFill([[cx + 39, s0 + 3], [cx + 46, s0 + 6], [cx - 25, 220], [cx - 33, 220]], blk); dotLine(cx + 44, s0 + 5, cx - 27, 218, blkL, 1);
  rotated(-1.12, 0, 0, cx + 20, s0 + 34, () => { R(-8, -6, 16, 12, OL); R(-7, -5, 14, 10, '#c9ced3'); R(-5, -3, 10, 6, OL); R(-4, -2, 8, 4, blk); R(-7, -5, 14, 1, '#eef1f3'); });
  // the neck and the black shadow the jaw throws on it
  polyFill([[cx - 11, by + 40], [cx + 11, by + 40], [cx + 12, s0 - 1], [cx - 12, s0 - 1]], sk); R(cx - 12, by + 44, 1, s0 - by - 44, OL); R(cx + 12, by + 44, 1, s0 - by - 44, OL);
  polyFill([[cx - 11, by + 48], [cx + 11, by + 48], [cx + 11, by + 56], [cx + 4, by + 63], [cx - 4, by + 63], [cx - 11, by + 56]], '#2a1c20'); R(cx + 8, by + 58, 3, s0 - by - 60, skD);
  // the ear, just showing on her left
  inked([[cx + 22, by + 12], [cx + 26, by + 11], [cx + 28, by + 16], [cx + 27, by + 24], [cx + 23, by + 27]], sk); R(cx + 24, by + 15, 1, 8, skD);
  // the face: slim, a V-line to a small chin
  const face = [[cx - 23, by + 2], [cx + 23, by + 2], [cx + 24, by + 14], [cx + 23, by + 24], [cx + 20, by + 34], [cx + 15, by + 43], [cx + 9, by + 50], [cx + 3, by + 55], [cx - 3, by + 55], [cx - 9, by + 50], [cx - 15, by + 43], [cx - 20, by + 34], [cx - 23, by + 24], [cx - 24, by + 14]];
  inked(face, sk);
  g.save(); clipPoly(face);
  // the brim's shadow: solid across the eyes, its lower edge following the brim's curve; a soft step below it
  for (let x = -24; x <= 24; x++) { const y0 = Math.round(by + 21 + (x / 24) ** 2 * 3); R(cx + x, by, 1, y0 - by, '#140e12'); R(cx + x, y0, 1, 1, '#6a4446'); R(cx + x, y0 + 1, 1, 2, skD); }
  R(cx + 19, by + 26, 2, 10, skD);
  g.restore();
  // a small nose: a light on the bridge, the tip, a touch of shade; red lips, parted a little
  R(cx, by + 25, 2, 6, skL); R(cx - 1, by + 32, 4, 1, skD); R(cx + 2, by + 31, 1, 1, skDD);
  polyFill([[cx - 6, by + 39], [cx - 2, by + 37.5], [cx, by + 38.5], [cx + 2, by + 37.5], [cx + 6, by + 39], [cx, by + 40]], '#c42f3c');
  R(cx - 6, by + 39, 13, 1, '#7e1a26'); polyFill([[cx - 5, by + 40], [cx + 5, by + 40], [cx + 3, by + 43], [cx - 3, by + 43]], '#cf3e4a'); R(cx - 1, by + 41, 3, 1, '#ec7a82');
  R(cx - 2, by + 46, 5, 1, skD);
  // hair framing the face, from under the cap to the jaw
  inked([[cx - 27, by], [cx - 15, by], [cx - 16, by + 18], [cx - 19, by + 32], [cx - 17, by + 46], [cx - 22, by + 52], [cx - 26, by + 38], [cx - 27, by + 20]], hair);
  inked([[cx + 27, by], [cx + 17, by], [cx + 18, by + 14], [cx + 21, by + 28], [cx + 19, by + 44], [cx + 24, by + 50], [cx + 27, by + 36], [cx + 28, by + 18]], hair);
  dotLine(cx - 22, by + 4, cx - 21, by + 44, hairL, 1); dotLine(cx + 23, by + 4, cx + 23, by + 42, hairL, 1);
  // the cap: the crown's six panels with their seams, the button, the eyelets; a light on its left panel
  const CR = 33, CT = by - 27, join = x => by - 3 + (x / CR) ** 2 * 4;
  const crown = []; for (let i = 0; i <= 24; i++) { const th = Math.PI * i / 24, c = Math.cos(th), x = Math.sign(c) * Math.abs(c) ** 0.8 * CR; crown.push([cx + x, CT + (1 - Math.sin(th) ** 0.6) * (join(x) - CT)]); }
  inked(crown, capR);
  g.save(); clipPoly(crown);
  const seam = (sd, p) => [cx + sd * 24 * Math.sin(p * Math.PI / 2), lerp(CT + 1, join(24), p)];
  const sideP = sd => { const pts = []; for (let i = 0; i <= 10; i++) pts.push(seam(sd, i / 10)); pts.push([cx + sd * 44, by + 6], [cx + sd * 44, CT - 4]); return pts; };
  polyFill(sideP(1), capD); polyFill([[cx - 24, CT + 8], [cx - 8, CT + 3], [cx - 9, CT + 10], [cx - 22, CT + 16]], capL);
  g.restore();
  for (const sd of [-1, 1]) for (let i = 0; i < 10; i++) { const [x0, y0] = seam(sd, i / 10), [x1, y1] = seam(sd, (i + 1) / 10); dotLine(x0, y0, x1, y1, capDD, 1); }
  dotLine(cx, CT + 2, cx, by - 2, capDD, 1); for (const sd of [-1, 1]) R(cx + sd * 13 - 1, CT + 11, 2, 2, capDD);
  inked([[cx - 4, CT + 1], [cx - 3, CT - 2], [cx + 3, CT - 2], [cx + 4, CT + 1]], capR);
  // the brim, seen from a little above: its curved top, the stitching, the darker front edge
  const fr = x => by + 9 + (x / 41) ** 2 * 9, brim = [];
  for (let x = -38; x <= 38; x += 2) brim.push([cx + x, Math.abs(x) <= CR ? join(x) : join(CR) + (Math.abs(x) - CR) * 1.4]); for (let x = 41; x >= -41; x -= 1) brim.push([cx + x, fr(x)]);
  inked(brim, capR);
  for (let x = -40; x <= 40; x++) { R(cx + x, Math.round(fr(x)) - 2, 1, 2, capD); if (x % 3 === 0 && Math.abs(x) < 34) R(cx + x, Math.round(join(Math.min(CR, Math.abs(x)))) + 2, 1, 1, capDD); }
  for (let x = -30; x <= 30; x += 2) R(cx + x, Math.round(fr(x)) - 4, 1, 1, capL);
}
// the sleeper on the bench inside, drawn the same way: dark green jacket, the safety vest with its bands, his head tipped
function sinipSeatG(x, seat, t) {
  const gr = '#2f4a3a', vest = '#c8dc48', vestD = '#9eb03a', band = '#e8eadf', pants = '#2f3a5a', sk = '#e8b898', skD = '#c99878';
  inked([[x - 9, seat + 6], [x - 2, seat + 6], [x - 2, seat + 21], [x - 9, seat + 21]], pants); inked([[x + 2, seat + 6], [x + 9, seat + 6], [x + 9, seat + 21], [x + 2, seat + 21]], pants);
  inked([[x - 12, seat - 2], [x + 12, seat - 2], [x + 12, seat + 7], [x - 12, seat + 7]], pants); R(x - 11, seat - 1, 22, 1, '#4a5a80'); R(x, seat, 1, 7, '#222c48');
  inked([[x - 10, seat + 21], [x - 2, seat + 21], [x - 1, seat + 25], [x - 11, seat + 25]], '#1d1b21'); inked([[x + 2, seat + 21], [x + 10, seat + 21], [x + 11, seat + 25], [x + 1, seat + 25]], '#1d1b21');
  inked([[x - 10, seat - 30], [x + 10, seat - 30], [x + 13, seat - 26], [x + 13, seat - 2], [x - 13, seat - 2], [x - 13, seat - 26]], gr);
  polyFill([[x - 9, seat - 28], [x - 2, seat - 28], [x - 2, seat - 4], [x - 10, seat - 4], [x - 10, seat - 24]], vest); polyFill([[x + 2, seat - 28], [x + 9, seat - 28], [x + 10, seat - 24], [x + 10, seat - 4], [x + 2, seat - 4]], vest);
  R(x - 10, seat - 16, 8, 3, band); R(x + 2, seat - 16, 8, 3, band); R(x - 10, seat - 9, 8, 2, band); R(x + 2, seat - 9, 8, 2, band); R(x + 8, seat - 26, 2, 22, vestD);
  inked([[x - 8, seat - 1], [x - 2, seat - 1], [x - 2, seat + 3], [x - 8, seat + 3]], sk); inked([[x + 2, seat], [x + 8, seat], [x + 8, seat + 4], [x + 2, seat + 4]], sk);
  rotated(-0.42, 0, 0, x - 1, seat - 29, () => {
    inked([[-8, -2], [8, -2], [9, -12], [7, -18], [-7, -18], [-9, -12]], sk); R(-9, -12, 1, 9, skD);
    inked([[-10, -10], [-9, -20], [-4, -24], [5, -24], [10, -19], [10, -11], [8, -16], [-2, -17], [-8, -14]], '#1d1b21');
    R(-6, -10, 4, 1, OL); R(2, -10, 4, 1, OL); R(-1, -5, 3, 2, '#7e3a3a'); R(-7, -8, 3, 1, '#e89a8a'); R(5, -8, 3, 1, '#e89a8a');
  });
  zzz(x + 8, seat - 52, t * 1000);
}
// the inside of the car through a doorway: ceiling and its light, straps, the dark window band, the blue bench, the floor
function carInsideG(x0, x1, y0, y1, t, withHim) {
  R(x0, y0, x1 - x0, y1 - y0, '#d7dadc');
  R(x0, y0, x1 - x0, 14, '#c3c8cc'); R(x0, y0 + 14, x1 - x0, 1, '#9aa0a6'); R(x0 + 20, y0 + 4, 80, 4, '#f6fafb'); R(x0 + 150, y0 + 4, 80, 4, '#f6fafb');
  R(x0, y0 + 18, x1 - x0, 2, '#b9bfc5');
  for (const sx of [x0 + 40, x0 + 100, x0 + 160, x0 + 220]) { R(sx, y0 + 20, 1, 10, '#8a9097'); inked([[sx - 4, y0 + 30], [sx + 5, y0 + 30], [sx + 5, y0 + 38], [sx - 4, y0 + 38]], '#e3e6e8'); R(sx - 2, y0 + 32, 5, 4, '#d7dadc'); }
  R(x0, y0 + 44, x1 - x0, 52, '#9aa0a6'); R(x0, y0 + 46, x1 - x0, 48, '#20262e'); for (let k = 0; k < 5; k++) R(x0 + ((k * 61 + t * 40) % (x1 - x0)), y0 + 46, 2, 48, '#2a3038'); R(x0 + 30, y0 + 52, 40, 1, '#c99a54');
  R(x0, y0 + 98, x1 - x0, 44, '#2f5f9a'); for (let x = x0 + 4; x < x1; x += 44) { R(x, y0 + 100, 40, 40, '#3a6eaa'); R(x, y0 + 100, 40, 2, '#5a8ec8'); R(x + 39, y0 + 100, 1, 40, '#25507e'); }
  R(x0, y0 + 142, x1 - x0, 8, '#3f78b4'); R(x0, y0 + 142, x1 - x0, 1, '#6a9cd0'); R(x0, y0 + 150, x1 - x0, 14, '#5a5f66'); for (let x = x0 + 6; x < x1; x += 14) R(x, y0 + 156, 8, 1, '#4a4f56');
  R(x0, y0 + 164, x1 - x0, y1 - y0 - 164, '#8a8f94'); R(x0, y0 + 164, x1 - x0, 1, '#6a6f74');
  R(x0 + 36, y0 + 18, 4, y1 - y0, '#b8bec4'); R(x0 + 37, y0 + 18, 1, y1 - y0, '#f2f4f6'); R(x0 + 39, y0 + 18, 1, y1 - y0, '#7a8086');
  if (withHim) sinipSeatG(x0 + 72, y0 + 140, t);
}
// one door leaf, its tall window showing the car inside with the glass's reflections
function doorLeafG(x, y0, y1, wdt, side, t, ix = 76, him = true) {
  inked([[x, y0], [x + wdt, y0], [x + wdt, y1], [x, y1]], '#c3c7cb');
  R(x, y0, wdt, 2, '#dfe2e5'); R(side > 0 ? x + wdt - 3 : x, y0, 3, y1 - y0, '#2a2d31');
  const wx = x + 12, ww = wdt - 24, wy0 = y0 + 14, wy1 = y0 + 128;
  if (ww > 6) {
    inked([[wx, wy0], [wx + ww, wy0], [wx + ww, wy1], [wx, wy1]], '#9aa0a6');
    g.save(); g.beginPath(); g.rect(wx + 1, wy0 + 1, ww - 2, wy1 - wy0 - 2); g.clip();
    carInsideG(ix, ix + 248, 18, 216, t, him); shade(wx, wy0, ww, wy1 - wy0, '200,215,230', 0.22);
    g.globalAlpha = 0.5; for (let k = 0; k < 3; k++) polyFill([[wx + 8 + k * 16, wy1], [wx + 16 + k * 16, wy1], [wx + 60 + k * 16, wy0], [wx + 52 + k * 16, wy0]], '#ffffff'); g.globalAlpha = 1;
    g.restore();
  }
  R(x + (side > 0 ? wdt - 14 : 6), y0 + 150, 8, 14, '#a9aeb3'); R(x + (side > 0 ? wdt - 13 : 7), y0 + 151, 6, 12, '#c9ced3');
}
function doorBust(t) {
  const close = ease(clamp((t - 0.9) / 2.0, 0, 1)), dep = Math.max(0, t - 3.3), tx = -Math.round(dep * dep * 70);
  shot(1, (w, h) => {
    // the car's side: light panels in bands, a seam, the blue stripe; a closed door further along and the next car's
    // coupling as the train pulls away
    g.save(); g.translate(tx, 0);
    const carW = 1400;
    R(-10, 0, carW, h, '#b9bdc1'); R(-10, 0, carW, 60, '#c9cdd0'); R(-10, 60, carW, 2, '#a4a9ae'); R(-10, 128, carW, 2, '#a4a9ae'); R(-10, 130, carW, 50, '#adb1b5'); R(-10, 180, carW, 8, '#2f5f9a'); R(-10, 180, carW, 1, '#5a8ac8'); R(-10, 188, carW, 30, '#9a9ea3');
    for (let x = -10; x < carW; x += 3) if (rnd(x, 1) < 0.2) R(x, 62 + Math.floor(rnd(1, x) * 60), 2, 1, '#c3c7cb');
    for (const dx of [480, 940]) { inked([[66 + dx, 8], [334 + dx, 8], [334 + dx, 216], [66 + dx, 216]], '#d2d5d8'); doorLeafG(76 + dx, 18, 216, 124, 1, t, 76 + dx, false); doorLeafG(200 + dx, 18, 216, 124, -1, t, 76 + dx, false); }
    R(1380, 0, 40, h, '#2a2d31');
    // this door: its frame, the inside through it, the leaves sliding shut
    inked([[66, 8], [334, 8], [334, 216], [66, 216]], '#d2d5d8'); R(68, 10, 264, 2, '#eef0f2'); R(72, 14, 256, 202, '#7d8287'); R(74, 16, 252, 200, '#5a5f64');
    g.save(); g.beginPath(); g.rect(76, 18, 248, 198); g.clip();
    carInsideG(76, 324, 18, 216, t, true);
    const lw = Math.round(124 * close); if (lw > 0) { doorLeafG(76 - 124 + lw, 18, 216, 124, 1, t); doorLeafG(324 - lw, 18, 216, 124, -1, t); }
    g.restore();
    g.restore();
    // the train's windows strobing over her as it goes
    if (dep > 0 && dep < 1.8) { g.save(); g.globalCompositeOperation = 'lighter'; for (let k = 0; k < 3; k++) { const x = ((k * 150 - dep * dep * 140) % 450 + 450) % 450 - 60; g.fillStyle = `rgba(255,240,210,${0.08 * Math.min(1, dep * 2) * (1 - dep / 1.8)})`; g.fillRect(x, 0, 60, h); } g.restore(); }
    // her, close, in front of it all, still
    haeunBustG(244, 70);
    vig(w, h, 0.22);
  });
  bars();
  blackout(W, H, t < 0.3 ? 1 - t / 0.3 : t > 4.6 ? (t - 4.6) / 0.4 : 0);
}

// 3. 계단 — close and from the side on her legs: one sneaker planted on a tread, the knee comes up and the other lands on the
//    next; the camera climbs the slope with her. Then from behind at the waist, the exit's sky opening over her cap
function shotStairs(u) {
  if (u < 2.2) stairsKnee(u); else stairsBack(u - 2.2);
}
// crisp polygon fill (no anti-aliasing): scanline spans at pixel centres
function polyFill(pts, c) {
  if (XF) { const T = XF, hk = RHOOK; XF = null; RHOOK = null; polyFill(pts.map(([a, b]) => T(a, b)), c); XF = T; RHOOK = hk; return; }
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
// ---- climbing stairs, measured: centimetres, y up. Step k's tread is at y = k*SR, from its riser at x = k*ST to (k+1)*ST.
// A 160 cm woman (Winter's segment ratios): thigh 39.5, shank 39 to the ankle, the ankle 8 above the sole, a 26 cm shoe
// with the ball 17 from the heel. Subway stairs: 16 cm rise, 30 cm tread. Each foot lands one step above the other
// (step-over-step), the trailing heel peels up before toe-off, the swing foot lifts first and then reaches, and the pelvis
// rises mostly in the first half of each step (the pull-up), so the body surges and settles.
const ST = 30, SR = 16, THIGH = 39.5, SHANK = 39, ANK = [5.5, 8], BALL = 17, HEEL0 = 3;
const hipAt = s => { const n = Math.floor(s), f = s - n; return [28 + s * ST, 86 + (n + f + (1 - Math.cos(2 * Math.PI * f)) / (2 * Math.PI) * 0.9) * SR]; };
const rotP = (a, b, p) => [a * Math.cos(p) + b * Math.sin(p), -a * Math.sin(p) + b * Math.cos(p)];
// leg L lands on step j at s = j - 1 (j ≡ L mod 2), stays until 1.12 later with the heel peeling up from 0.7, then swings
// to step j + 2. Returns the ball of the foot, the ankle, the rear foot's pitch (toe down +) and the toe box's
function footAt(leg, s) {
  let j = Math.floor(s) + 1; if (((j % 2) + 2) % 2 !== leg) j -= 1; const tau = s - (j - 1);
  const TO = 1.12, RISE0 = 0.7, PMAX = 0.5;
  const stance = (k, ph) => { const b = [k * ST + HEEL0 + BALL, k * SR], [ax, ay] = rotP(ANK[0] - BALL, ANK[1], ph); return { ball: b, ankle: [b[0] + ax, b[1] + ay], pitch: ph, toe: 0, contact: true }; };
  if (tau < TO) return stance(j, PMAX * ease((tau - RISE0) / (TO - RISE0)));
  const p = (tau - TO) / (2 - TO), A0 = stance(j, PMAX).ankle, A1 = stance(j + 2, 0).ankle;
  const pitch = PMAX * (1 - ease((p - 0.2) / 0.35)) - 0.22 * Math.sin(Math.PI * clamp((p - 0.2) / 0.6, 0, 1));
  const ax = lerp(A0[0], A1[0], ease((p - 0.25) / 0.75)) - 1.5 * Math.sin(Math.PI * clamp(p / 0.4, 0, 1)), ay = lerp(A0[1], A1[1], ease(p / 0.38)) + 7 * Math.sin(Math.PI * clamp(p / 0.85, 0, 1));
  const [bx, by] = rotP(ANK[0] - BALL, ANK[1], pitch);
  return { ball: [ax - bx, ay - by], ankle: [ax, ay], pitch, toe: pitch * ease(p / 0.25), contact: false };
}
const shoePt = (F, a, b) => { const [x, y] = rotP(a - BALL, b, a > BALL ? F.toe : F.pitch); return [F.ball[0] + x, F.ball[1] + y]; };
function kneeAt(H, A) { const dx = A[0] - H[0], dy = A[1] - H[1], d = Math.min(THIGH + SHANK - 0.01, Math.hypot(dx, dy)), a = Math.atan2(dy, dx), k = Math.acos(clamp((THIGH * THIGH + d * d - SHANK * SHANK) / (2 * THIGH * d), -1, 1)); return [H[0] + Math.cos(a + k) * THIGH, H[1] + Math.sin(a + k) * THIGH]; }
// a shape outlined one pixel darker all round
function outlined(pts, c, o) { for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) polyFill(pts.map(([x, y]) => [x + dx, y + dy]), o); polyFill(pts, c); }
// the black sneaker side on, in its own frame (a along the sole from the heel, b up), placed by the foot's pose; the rear
// foot pitches about the ball while the toe box stays on the tread. dim darkens the far one
function sneakerSide(F, M, dim) {
  const c = a => dim ? mix(a, '#0c0c12', dim) : a, Q = arr => arr.map(([a, b]) => M(...shoePt(F, a, b)));
  const upper = Q([[-0.6, 2.6], [-1, 6.5], [-0.2, 9.4], [4.2, 10.2], [6.6, 9.1], [10.5, 8.3], [14.5, 7.2], [18.5, 5.9], [22.5, 4.8], [25.2, 3.8], [26.3, 2.6]]);
  const sole = Q([[-0.8, 0], [25, 0], [26.4, 1], [26.4, 2.7], [-0.8, 2.7]]);
  for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) { polyFill(upper.map(([x, y]) => [x + dx, y + dy]), '#0e0c0e'); polyFill(sole.map(([x, y]) => [x + dx, y + dy]), '#0e0c0e'); }
  polyFill(upper, c('#2a2a30'));
  polyFill(Q([[-1, 6.5], [-0.2, 9.4], [2, 9.8], [2, 2.6], [-0.6, 2.6]]), c('#222227'));
  polyFill(Q([[20, 2.6], [20, 5.4], [22.5, 4.8], [25.2, 3.8], [26.3, 2.6]]), c('#383840'));
  polyFill(Q([[0, 9.2], [4, 9.9], [4.2, 9.2], [0.2, 8.6]]), c('#55555e'));
  polyFill(sole, c('#e9e3d6')); polyFill(Q([[-0.8, 0], [25, 0], [25.8, 0.6], [-0.8, 0.8]]), c('#a9a396'));
  for (let i = 0; i < 4; i++) { const [x, y] = M(...shoePt(F, 7.5 + i * 2.6, 8.6 - i * 0.75)); R(x, y, 2, 1, c('#d9d3c4')); }
  const [lx, ly] = M(...shoePt(F, 1, 4.5)); R(lx, ly, 2, 1, c('#8a8478'));
}
// a trouser leg side on: thigh and shank tapering, the knee rounded, the back edge in shade and a lit front edge, folds
// behind the knee when it bends, the hem falling over the shoe's collar
function trouserLeg(H, K, A, q, pal) {
  const [base, dark, lite, fold] = pal, L = Math.hypot(A[0] - K[0], A[1] - K[1]) || 1, E = [A[0] + (A[0] - K[0]) / L * 3 * q, A[1] + (A[1] - K[1]) / L * 3 * q];
  const wt = 15.5 * q, wk = 11.5 * q, wh = 11 * q;
  limb(H[0], H[1], wt, K[0], K[1], wk, dark); limb(K[0], K[1], wk, E[0], E[1], wh, dark); blob(K[0], K[1], Math.round(wk / 2), dark);
  limb(H[0], H[1], wt, K[0], K[1], wk, base, wt * 0.12, -wt * 0.14); limb(K[0], K[1], wk, E[0], E[1], wh, base, wk * 0.12, -wk * 0.14); blob(K[0] + 0.5, K[1] - 0.5, Math.round(wk / 2) - 2, base);
  limb(H[0], H[1], wt, K[0], K[1], wk, lite, wt / 2 - 1, -(wt / 2 - 1.5)); limb(K[0], K[1], wk, E[0], E[1], wh, lite, wk / 2 - 1, -(wk / 2 - 1.5));
  const ang = Math.atan2(K[1] - H[1], K[0] - H[0]) - Math.atan2(E[1] - K[1], E[0] - K[0]);
  if (Math.abs(ang) > 0.5) { const bx = K[0] - wk * 0.35, by = K[1] + 1; dotLine(bx - 3, by - 3, bx + 2, by + 1, fold, 1); dotLine(bx - 2, by + 2, bx + 3, by + 5, fold, 1); }
  limb(E[0] + (K[0] - E[0]) / L * 1.5, E[1] + (K[1] - E[1]) / L * 1.5, wh, E[0], E[1], wh, fold);
}
// the stair's side at 1x: the stone slab of each tread with its top just showing, a ribbed nosing and the yellow line,
// the concrete side face below, speckled
function stairProfile(M, k0, k1, q) {
  const face = []; for (let k = k0; k <= k1; k++) { face.push(M(k * ST, (k - 1) * SR)); face.push(M(k * ST, k * SR)); }
  const [, yb] = M(0, (k0 - 30) * SR); face.push([face[face.length - 1][0], yb], [face[0][0], yb]); polyFill(face, '#3d3f48');
  for (let k = k0; k < k1; k++) {
    const [x0, y0] = M(k * ST - 2.5, k * SR), [x1] = M((k + 1) * ST, k * SR), wq = Math.round(x1 - x0), th = Math.round(3 * q);
    R(x0, y0 - 2, wq, 2, '#9a9da6'); R(x0, y0, wq, th, '#80838d'); R(x0, y0 + th - 1, wq, 1, '#5a5c66'); R(x0, y0, 1, th, '#a9acb5');
    for (let gx = 1; gx < 10; gx += 2) R(x0 + gx, y0 - 2, 1, 2, '#6a7076'); R(x0 + 11, y0 - 1, 8, 1, '#e8c34a');
    const [rx, ry] = M(k * ST, k * SR); R(rx, ry + th, 3, Math.round(SR * q) - th, '#34353e');
    for (let i = 0; i < 6; i++) { const [sx, sy] = M(k * ST + 3 + rnd(k, i) * 24, k * SR - 3 - rnd(i, k) * 26); R(sx, sy, 2, 1, rnd(k * 2, i) < 0.5 ? '#474954' : '#363841'); }
  }
}
// the tiled wall behind the stairs, with a parallax
function stairWall(w, h, camX, camY, par) {
  const TW = 40, TH = 24, tx = -(((camX * par) % TW) + TW) % TW, ty = -(((camY * par) % TH) + TH) % TH;
  R(0, 0, w, h, '#5f6663');
  for (let y = ty - TH; y < h + TH; y += TH) for (let x = tx - TW; x < w + TW; x += TW) { const v = rnd(Math.floor((x + camX * par) / TW), Math.floor((y + camY * par) / TH)); R(x, y, TW - 1, TH - 1, v < 0.3 ? '#646b68' : v > 0.8 ? '#5a615e' : '#606764'); R(x, y, TW - 1, 1, '#6e7572'); R(x, y + TH - 2, TW - 1, 1, '#575e5b'); }
  for (let y = ty - TH; y < h + TH; y += TH) R(0, y + TH - 1, w, 1, '#4d5451'); for (let y = ty - TH; y < h + TH; y += TH) for (let x = tx - TW; x < w + TW; x += TW) R(x + TW - 1, y, 1, TH - 1, '#4d5451');
  g.save(); g.globalCompositeOperation = 'lighter'; const lg = g.createLinearGradient(w, 0, 60, h); lg.addColorStop(0, 'rgba(255,200,150,.26)'); lg.addColorStop(1, 'rgba(255,200,150,0)'); g.fillStyle = lg; g.fillRect(0, 0, w, h); g.restore();
  shade(0, 0, w, h, '20,24,40', 0.16);
}
// 3a. 계단, the knee shot: side on, from the lower chest to the shoes, the camera gliding up the slope with her. Real
//     proportions: the waist and the vest's hem at the top of frame, the hips, both legs, the shoes on the treads
function stairsKnee(u) {
  const q = 1.4, s = 0.55 + u / 0.72, H = hipAt(s), lean = 0.14, ph = Math.cos(Math.PI * s);
  const camX = Math.round((28 + s * ST) * q) - 168, camY = -Math.round((86 + s * SR) * q) - 64;
  const M = (x, y) => [x * q - camX, -y * q - camY];
  // the body's own frame (x forward, y up from the hip joint), leaning into the climb
  const B = (x, y) => M(H[0] + x * Math.cos(lean) + y * Math.sin(lean), H[1] - x * Math.sin(lean) + y * Math.cos(lean));
  const BB = arr => arr.map(([x, y]) => B(x, y));
  // the arms swing a little against the legs: the near arm back while the near leg reaches
  const armNear = 0.2 * ph, armFar = -0.2 * ph;
  const armPts = (a) => { const sh = [0.5, 46], el = [sh[0] + Math.sin(a) * 29, sh[1] - Math.cos(a) * 29], fa = a + 0.22 + 0.25 * Math.max(0, a), wr = [el[0] + Math.sin(fa) * 24, el[1] - Math.cos(fa) * 24], kn = [wr[0] + Math.sin(fa + 0.15) * 9, wr[1] - Math.cos(fa + 0.15) * 9], ft = [kn[0] + Math.sin(fa + 0.9) * 6, kn[1] - Math.cos(fa + 0.9) * 6]; return [sh, el, wr, kn, ft].map(([x, y]) => B(x, y)); };
  const drawArm = (a, sleeve, sleeveL, skin, skinD) => {
    const [S0, E, W, Kn, Ft] = armPts(a);
    limb(S0[0], S0[1], 10.5 * q, E[0], E[1], 9 * q, sleeve); blob(E[0], E[1], Math.round(4.5 * q), sleeve); limb(E[0], E[1], 9 * q, W[0], W[1], 7.5 * q, sleeve);
    limb(S0[0], S0[1], 10.5 * q, E[0], E[1], 9 * q, sleeveL, 10.5 * q / 2 - 1, -(10.5 * q / 2 - 1.5)); limb(E[0], E[1], 9 * q, W[0], W[1], 7.5 * q, sleeveL, 9 * q / 2 - 1, -(9 * q / 2 - 1.5));
    limb(W[0], W[1], 6.5 * q, Kn[0], Kn[1], 7.5 * q, skinD); limb(Kn[0], Kn[1], 6.5 * q, Ft[0], Ft[1], 4.5 * q, skinD);
    limb(W[0], W[1], 6.5 * q, Kn[0], Kn[1], 7.5 * q, skin, 1, -1.2); limb(Kn[0], Kn[1], 6.5 * q, Ft[0], Ft[1], 4.5 * q, skin, 1, -1);
    limb(E[0] + (W[0] - E[0]) * 0.86, E[1] + (W[1] - E[1]) * 0.86, 8 * q, W[0], W[1], 8 * q, '#0e0c0e');
  };
  shot(1, (w, h) => {
    stairWall(w, h, camX, camY, 0.9);
    // the handrail on the wall, 92 cm above the nosings, on brackets every 1.5 m, its shadow on the tiles
    const railY = x => x * SR / ST + 92;
    for (let sx = -2; sx < w + 2; sx++) { const x = (sx + camX) / q, [, y] = M(x, railY(x)), yy = Math.round(y); R(sx, yy + 9, 1, 2, '#4a514e'); R(sx, yy, 1, 1, '#f2f4f6'); R(sx, yy + 1, 1, 2, '#c9ced3'); R(sx, yy + 3, 1, 1, '#9aa0a6'); R(sx, yy + 4, 1, 1, '#6a7076'); }
    for (let k = Math.floor(camX / q / 150) - 1; k < Math.floor((camX + w) / q / 150) + 2; k++) { const [bx, by] = M(k * 150, railY(k * 150)); R(bx - 1, by + 5, 3, 8, '#7a8088'); R(bx, by + 5, 1, 8, '#b9bfc5'); R(bx - 5, by + 13, 11, 3, '#5a6066'); R(bx - 5, by + 13, 11, 1, '#8a9097'); }
    const k0 = Math.floor((camX / q) / ST) - 1, k1 = Math.ceil(((camX + w) / q) / ST) + 1;
    stairProfile(M, k0, k1, q);
    const Hs = B(0, 0), feet = [footAt(0, s), footAt(1, s)];
    // soft contact shadows on the treads
    for (const F of feet) { const [hx, hy] = M(...shoePt(F, 0, 0)), [tx] = M(...shoePt(F, 26, 0)), gy = Math.floor((shoePt(F, 13, 0)[0]) / ST) * SR, [, gyy] = M(0, gy), lift = (F.ball[1] - gy) * q; if (lift < 30) { g.fillStyle = `rgba(8,8,16,${0.42 - lift * 0.012})`; g.fillRect(Math.round(hx) - 2, Math.round(gyy) - 2, Math.round(tx - hx) + 4, 2); } }
    // far side first: the far arm, the far leg in shadow and its shoe
    drawArm(armFar, '#121012', '#1c191b', '#8e6046', '#74503a');
    { const F = feet[1], A = M(...F.ankle), Kn = M(...kneeAt(H, F.ankle)); sneakerSide(F, M, 0.4); trouserLeg(Hs, Kn, A, q, ['#262a2f', '#1b1e22', '#30353b', '#15171a']); }
    // the seat of the trousers and the waistband, the black long sleeve's hem, the vest over it with its two bands
    const seat = BB([[9.5, 12.5], [10.5, 5], [9, -3], [3, -9], [-6, -10.5], [-12.5, -7], [-15, 0], [-14, 7], [-11.5, 12.5]]);
    outlined(seat, '#3a3f45', '#16181b'); polyFill(BB([[-12.5, -7], [-15, 0], [-14, 7], [-11.5, 12.5], [-9.5, 12.5], [-11.5, 4], [-10, -6]]), '#2a2e33');
    polyFill(BB([[-11.5, 9.5], [10, 9.5], [9.8, 12.5], [-11.5, 12.5]]), '#30353b'); polyFill(BB([[-11.5, 9.5], [10, 9.5], [10, 10], [-11.5, 10]]), '#4a5058');
    for (const bx of [-8, 3]) polyFill(BB([[bx, 9], [bx + 1.2, 9], [bx + 1.2, 13], [bx, 13]]), '#262a2f');
    const shirt = BB([[10.5, 11], [11, 20], [12.4, 32], [13, 48], [-12.5, 48], [-11, 32], [-9.8, 22], [-11.8, 11]]);
    outlined(shirt, '#1e1a1a', '#0c0a0a'); polyFill(BB([[10.5, 11], [-11.8, 11], [-11.8, 12.3], [10.6, 12.3]]), '#2c2829');
    const vest = BB([[11.6, 15], [12.2, 21], [13.6, 32], [14.2, 48], [-13.5, 48], [-12, 32], [-10.9, 22], [-12.6, 15]]);
    outlined(vest, '#7ec8e3', '#2c4a58'); polyFill(BB([[-12.6, 15], [-10.9, 22], [-12, 32], [-13.5, 48], [-9.5, 48], [-8.4, 32], [-7.6, 22], [-9, 15]]), '#5aa6c4');
    polyFill(BB([[10.4, 15], [11.6, 15], [12.2, 21], [13.6, 32], [14.2, 48], [12.8, 48], [12.2, 32], [10.9, 21]]), '#a8e0f2');
    polyFill(BB([[-12.6, 15], [11.6, 15], [11.65, 16.2], [-12.5, 16.2]]), '#4a8fb0');
    for (const y0 of [19, 29]) { const xa = -11.5 - (y0 - 19) * 0.05, xb = 12.4 + (y0 - 19) * 0.12; polyFill(BB([[xa, y0], [xb, y0], [xb + 0.2, y0 + 3.5], [xa - 0.1, y0 + 3.5]]), '#e6e1cc'); polyFill(BB([[xa, y0 + 3], [xb + 0.2, y0 + 3], [xb + 0.2, y0 + 3.5], [xa - 0.1, y0 + 3.5]]), '#a8a28a'); polyFill(BB([[xa, y0], [xb, y0], [xb, y0 + 0.6], [xa, y0 + 0.6]]), '#fffdf2'); }
    // the crossbody strap: over the near shoulder, down the back to the bag at her far hip, and across her front
    for (const seg of [[[-5.5, 48], [-11.6, 31], [-13.2, 14]], [[5.5, 48], [12.6, 33]]]) for (let i = 0; i + 1 < seg.length; i++) { const [a0, a1] = [B(...seg[i]), B(...seg[i + 1])]; limb(a0[0], a0[1], 3, a1[0], a1[1], 3, '#2f3237'); dotLine(a0[0], a0[1], a1[0], a1[1], '#4a4e55', 3); }
    { const bob = Math.sin(Math.PI * 2 * s - 0.6) * 0.8, bag = BB([[-13, 12 + bob], [-21, 11 + bob], [-22.5, 3 + bob], [-21.5, -1 + bob], [-13.5, -1.5 + bob]]); outlined(bag, '#2f3237', '#121315'); polyFill(BB([[-13, 12 + bob], [-21, 11 + bob], [-21.6, 7 + bob], [-13.3, 7.4 + bob]]), '#3a3e44'); const [mx, my] = B(-18.8, 7.2 + bob); R(mx, my, 2, 2, '#9aa0a6'); }
    // the near leg, its shoe, then the near arm swinging over the hip
    { const F = feet[0], A = M(...F.ankle), Kn = M(...kneeAt(H, F.ankle)); sneakerSide(F, M, 0); trouserLeg(Hs, Kn, A, q, ['#3a3f45', '#2a2e33', '#56606a', '#22252a']); }
    drawArm(armNear, '#1e1a1a', '#3a3536', '#d9a27a', '#b98260');
    light(w + 20, -20, 300, '255,200,150', 0.12);
    vig(w, h, 0.38);
  });
  bars();
  blackout(W, H, u < 0.35 ? 1 - u / 0.35 : 0);
}
// 하은 from behind at the waist, in proportion (40 cm across the shoulders, a 15 cm head under a 19 cm cap): the cap's
// crown, its seams to the button and the back opening with the strap, the ponytail through it swinging a beat behind
// her steps, hair drawn up from the nape, the ears lit through from the street ahead; the black long sleeves, the vest's
// back with its two bands and the crossbody strap. (cx, hy) is her hip joint on screen, q pixels per centimetre.
function haeunBackHD(cx, hy, q, o) {
  const roll = o.roll || 0, P = (x, y) => [cx + (x * Math.cos(roll) - y * Math.sin(roll)) * q, hy - (x * Math.sin(roll) + y * Math.cos(roll)) * q], PP = arr => arr.map(([x, y]) => P(x, y));
  const mir = half => half.concat(half.slice().reverse().map(([x, y]) => [-x, y]));
  const red = '#c23d33', redD = '#8e2c25', redL = '#e05a4c', hair = '#3e2a21', hairL = '#5e4434', hairD = '#2a1c16', sleeve = '#19171a', vest = '#5fa3be', vestD = '#4a87a0', band = '#d6d0b8', rim = '#ffcf9a';
  // the arms at her sides: a forward swing carries the forearm away from us (shorter, toward her middle)
  for (const [sd, a] of [[-1, o.armL], [1, o.armR]]) {
    const sh = [sd * 17.2, 44.5], el = [sd * (18.2 - Math.max(0, a) * 2), 44.5 - 28.5 * Math.cos(a)], wr = [sd * (17.6 - Math.max(0, a) * 6), el[1] - 24.5 * Math.cos(a + 0.3) * (a > 0 ? 0.9 : 1)];
    const [x0, y0] = P(...sh), [x1, y1] = P(...el), [x2, y2] = P(...wr);
    limb(x0, y0, 10 * q, x1, y1, 8.6 * q, sleeve); blob(x1, y1, Math.round(4.3 * q), sleeve); limb(x1, y1, 8.6 * q, x2, y2, 7.2 * q, sleeve);
    limb(x0, y0, 10 * q, x1, y1, 8.6 * q, '#2a2628', 4 * q, -sd * 1.2 * q);
    polyFill([[x0 + sd * 5 * q, y0], [x1 + sd * 4.3 * q, y1], [x1 + sd * 4.3 * q - sd, y1], [x0 + sd * 5 * q - sd, y0]], '#6a5048');
  }
  // trousers at the bottom edge, the waistband; the black top's hem; the torso: the trapezius sloping from the neck, the
  // rounded deltoids, tapering to the waist
  polyFill(PP(mir([[0, -12], [17, -12], [17.2, 2], [15.6, 12]]).reverse()), '#3a3f45'); polyFill(PP([[-15.6, 9.5], [15.6, 9.5], [15.6, 12], [-15.6, 12]]), '#2a2e33');
  polyFill(PP([[-0.3, -12], [0.3, -12], [0.3, 9.5], [-0.3, 9.5]]), '#2a2e33');
  const torso = PP(mir([[0, 54], [5.6, 53.6], [9.5, 52], [14, 49.8], [17.2, 47.6], [19.3, 44.8], [19.6, 41.5], [17, 38.5], [15.6, 30], [14.4, 18], [15.2, 10.6], [0, 10.4]]).reverse());
  polyFill(torso, sleeve);
  polyFill(PP([[-15.2, 10.6], [15.2, 10.6], [15.2, 11.6], [-15.2, 11.6]]), '#2a2628');
  // the vest's back, shaded toward the sides, its two reflective bands, the hem
  const vestP = mir([[0, 50.6], [6.2, 52.4], [13.6, 49.4], [14.6, 46.5], [14.9, 41.5], [14.4, 37.5], [14.9, 30], [14.3, 20], [14.9, 15.3], [0, 15]]);
  polyFill(PP(vestP), vest); polyFill(PP([[11, 50], [13.6, 49.4], [14.6, 46.5], [14.9, 41.5], [14.4, 37.5], [14.9, 30], [14.3, 20], [14.9, 15.3], [11.8, 15.3], [11.4, 30], [11.6, 42]]), vestD); polyFill(PP([[-11, 50], [-13.6, 49.4], [-14.6, 46.5], [-14.9, 41.5], [-14.4, 37.5], [-14.9, 30], [-14.3, 20], [-14.9, 15.3], [-12.6, 15.3], [-12.2, 30], [-12.4, 42]]), '#6bb0ca');
  polyFill(PP([[-14.9, 15.3], [14.9, 15.3], [14.9, 16.3], [-14.9, 16.3]]), vestD);
  for (const y0 of [19, 29]) { polyFill(PP([[-14.6, y0], [14.6, y0], [14.6, y0 + 3.5], [-14.6, y0 + 3.5]]), band); polyFill(PP([[-14.6, y0 + 3.5], [14.6, y0 + 3.5], [14.6, y0 + 3], [-14.6, y0 + 3]]), '#a8a28a'); const [bx, by] = P(-14.6, y0 + 3.5); R(bx, by, Math.round(29.2 * q), 1, '#fffdf2'); for (let x = -12; x < 14; x += 5) { const [sx, sy] = P(x, y0 + 3.4); R(sx, sy, 1, Math.round(3.2 * q), '#c2bca4'); } }
  // the crossbody strap, her left shoulder to her right hip
  { const [a0, a1] = [P(-11, 51.5), P(15.2, 13)]; limb(a0[0], a0[1], 2.8 * q, a1[0], a1[1], 2.8 * q, '#26282c'); dotLine(a0[0], a0[1] + 1, a1[0], a1[1] + 1, '#3e4248', 3); }
  // rim light from the street ahead along the shoulders
  for (const sd of [-1, 1]) { const a = P(sd * 5.6, 53.8), b = P(sd * 14, 50), c = P(sd * 19.3, 45); dotLine(a[0], a[1], b[0], b[1], rim, 1); dotLine(b[0], b[1], c[0], c[1], '#c89a78', 1); }
  // the neck, the nape in the shade of the hair
  polyFill(PP([[-5, 52.5], [5, 52.5], [5.3, 59.5], [-5.3, 59.5]]), '#a8704f'); polyFill(PP([[-5.3, 57], [5.3, 57], [5.3, 59.5], [-5.3, 59.5]]), '#8a5a3e');
  // the ears, lit through
  for (const sd of [-1, 1]) { const [ex, ey] = P(sd * 7.9, 62.8); ellFill(ex, ey, 1.5 * q, 3.3 * q, '#b07a5a'); ellFill(ex + sd, ey, 0.9 * q, 2.6 * q, '#e0906a'); }
  // the back of the head under the cap: hair drawn up from the nape into the ponytail, strands converging
  const hairP = PP(mir([[0, 57.4], [3.8, 57.7], [6, 59], [7.4, 61.2], [7.8, 64.5], [0, 66]]).reverse()); polyFill(hairP, hair);
  g.save(); clipPoly(hairP); for (let x = -8; x <= 8; x += 1.4) { const [x0, y0] = P(x, 56.8), [x1, y1] = P(x * 0.3, 66); dotLine(x0, y0, x1, y1, Math.round(x / 1.4) % 2 ? hairL : hairD, 1); } g.restore();
  // the cap: the crown's six panels from behind, the button, the arch of the back opening with the snap strap
  const crown = []; for (let i = 0; i <= 20; i++) { const th = Math.PI * i / 20, c = Math.cos(th), sn = Math.sin(th); crown.push([Math.sign(c) * Math.pow(Math.abs(c), 0.85) * 9.8, 64 + Math.pow(sn, 0.7) * 13.2]); }
  const crownS = PP(crown); polyFill(crownS, red);
  g.save(); clipPoly(crownS);
  polyFill(PP([[-11, 63], [-6.6, 63], [-1.6, 77.6], [-11, 77.6]]), '#b0372e'); polyFill(PP([[6.6, 63], [11, 63], [11, 77.6], [1.6, 77.6]]), '#a8342b');
  polyFill(PP([[-11, 75.4], [11, 75.4], [11, 79], [-11, 79]]), redL);
  g.restore();
  for (const sx of [-6.6, 6.6]) { const pts = []; for (let i = 0; i <= 12; i++) { const p = i / 12; pts.push(P(sx * Math.sin(p * Math.PI / 2), 77 - p * 12.8)); } for (let i = 0; i + 1 < pts.length; i++) dotLine(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], redD, 1); }
  { const [x, y] = P(0, 77.4), [x2, y2] = P(0, 70); dotLine(x, y, x2, y2, redD, 1); R(x - 2, y - 2, 5, 2, redD); R(x - 1, y - 2, 3, 1, redL); }
  const open = PP([[-4.2, 64], [-3.6, 67.6], [-2, 69.6], [0, 70.2], [2, 69.6], [3.6, 67.6], [4.2, 64]]); polyFill(open, hairD);
  { const [x0, y0] = P(-4.6, 64.8); R(x0, y0, Math.round(9.2 * q), Math.round(1.3 * q), '#1e1a1a'); for (let i = 0; i < 3; i++) { const [sx, sy] = P(-2.8 + i * 2.4, 64.3); R(sx, sy, 1, 1, '#4a4a52'); } }
  { const [x, y] = P(-9.8, 64); R(x, y - Math.round(10 * q), 1, Math.round(10 * q), rim); const [x2, y2] = P(-6, 77); R(x2, y2, Math.round(9 * q), 1, '#ffd8aa'); }
  // the ponytail out of the opening, a beat behind her steps: a hair tie, fuller, then tapering between her shoulder blades
  const [tx, ty] = P(0, 66.4), len = 27 * q, sw = o.tail || 0; R(tx - 2, ty - 1, 5, 2, '#f4d35e'); R(tx - 2, ty - 1, 5, 1, '#fff0a0');
  for (let k = 0; k < len; k++) { const kk = k / len, x = tx + 0.5 + sw * q * kk * kk + Math.sin(k * 0.3) * 0.4, wd = (kk < 0.12 ? 3.6 + kk * 14 : kk < 0.55 ? 5.3 : 5.3 - (kk - 0.55) * 10) * q; if (wd < 1.2) break; const y = ty + 1 + k, xl = Math.round(x - wd / 2); R(xl, y, Math.round(wd), 1, hair); R(xl, y, 1, 1, hairD); R(xl + Math.round(wd) - 1, y, 1, 1, '#7a5640'); if (k % 3 === 0) R(xl + Math.round(wd * 0.35), y, 1, 1, hairL); if (k % 4 === 1) R(xl + Math.round(wd * 0.65), y, 1, 1, hairD); }
}
// 3b. 계단, the waist shot from behind: the camera follows at her back up the stairs; she surges up each step and sways
//     toward the foot she stands on; the exit's sky opens over her cap and its light comes up as the shot fades
function stairsBack(t) {
  const RATE = 1 / 0.72, s = 2.4 + t * RATE, done = Math.max(0, t - 2.3);
  const climb = s, ph = Math.cos(Math.PI * s);
  shot(1, (w, h) => {
    const VX = 192, VY = 18, P = z => 1 / (1 + 0.3 * z), Y = z => VY + 174 * P(z), X = (z, sd) => VX + sd * 150 * P(z), CY = z => VY - 138 * P(z);
    const ztop = 9.0 - climb * 0.85;
    // the street at the top: the dawn sky, a low sun, buildings with a few lit windows, a street lamp, birds
    dgrad(0, 0, w, Y(ztop) + 2, ['#2e3f74', '#3f4f86', '#53629a', '#7a74a2', '#9a88a8', '#c99a9a', '#e8a88c', '#f6cfa0']);
    light(236, Y(ztop) - 14, 110, '255,220,160', 0.5); ellFill(236, Y(ztop) - 6, 9, 9, '#ffe8c0', -Infinity, Y(ztop));
    for (const [x, ww, hh] of [[24, 54, 36], [84, 36, 60], [132, 48, 27], [246, 66, 33], [324, 42, 54]]) { const yb = Math.round(Y(ztop)); R(x, yb - hh, ww, hh, '#433f63'); R(x, yb - hh, ww, 1, '#5a5478'); for (let j = 5; j < hh - 3; j += 7) for (let i = 4; i < ww - 4; i += 7) if (rnd(x + i, j) < 0.25) R(x + i, yb - hh + j, 3, 3, '#ffd890'); }
    { const lx = 210, yb = Math.round(Y(ztop)); R(lx, yb - 48, 2, 48, '#2a2838'); R(lx, yb - 48, 12, 2, '#2a2838'); R(lx + 10, yb - 46, 4, 2, '#fff3c8'); }
    for (let k = 0; k < 3; k++) { const bx = 150 + k * 30 + t * 12, by = 30 + (k % 2) * 9 - t * 4, fl = Math.floor(t * 7 + k) % 2; R(bx, by, 2, 1, '#2a2838'); R(bx + 2, by - fl - 1, 3, 1, '#2a2838'); R(bx - 3, by - fl - 1, 3, 1, '#2a2838'); }
    const cy0 = CY(ztop), xl0 = X(ztop, -1), xr0 = X(ztop, 1); R(xl0 - 6, cy0 - 9, xr0 - xl0 + 12, 9, '#2e3038'); R(xl0 - 6, cy0, xr0 - xl0 + 12, 2, '#6a6f7a'); R(xl0 - 6, cy0 - 9, xr0 - xl0 + 12, 1, '#4a4f58');
    g.fillStyle = '#1a1b22'; g.beginPath(); g.moveTo(-5, -5); g.lineTo(w + 5, -5); g.lineTo(xr0 + 6, cy0 - 9); g.lineTo(xl0 - 6, cy0 - 9); g.closePath(); g.fill();
    for (const sd of [-1, 1]) { g.fillStyle = sd < 0 ? '#3c403f' : '#353938'; g.beginPath(); g.moveTo(sd < 0 ? -5 : w + 5, -5); g.lineTo(X(ztop, sd), cy0 - 9); g.lineTo(X(ztop, sd), Y(ztop)); g.lineTo(sd < 0 ? -5 : w + 5, h + 120); g.closePath(); g.fill(); }
    for (let k = -2; k < 40; k++) { const z = k * 0.4 - (climb * 0.85 % 0.4); if (z > ztop || z < -1) continue; for (const sd of [-1, 1]) { const x = Math.round(X(z, sd)), y0 = CY(z), y1 = Y(z); R(x, y0, 1, y1 - y0, '#2c302f'); } }
    for (const sd of [-1, 1]) for (let j = 1; j < 9; j++) { g.strokeStyle = '#2f3332'; g.lineWidth = 1; g.beginPath(); for (let z = -1; z <= ztop; z += 0.25) { const x = X(z, sd), y = CY(z) + (Y(z) - CY(z)) * j / 9; z === -1 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke(); }
    for (let k = 0; k < 6; k++) { const z = k * 1.6 + 0.6 - (climb * 0.85 % 1.6); if (z > ztop - 0.3 || z < -0.5) continue; const p = P(z), y = Math.round(VY - 132 * p), ww = Math.max(4, Math.round(60 * p)); R(VX - ww / 2, y, ww, Math.max(1, Math.round(5 * p)), '#eef6f0'); R(VX - ww / 2, y + Math.max(1, Math.round(5 * p)), ww, 1, '#9aa39e'); light(VX, y + 2, 66 * p + 8, '230,245,235', 0.18); }
    for (let k = -2; k < 30; k++) { const z = k * 0.85 - (climb * 0.85 % 0.85); if (z > ztop) break; if (z < -1.3) continue;
      const ya = Y(z + 0.85), yb = Y(z), xl = X(z, -1), xr = X(z, 1), mid = ya + (yb - ya) * 0.45;
      R(xl, ya, xr - xl, mid - ya + 1, '#3c3d47'); R(xl, mid, xr - xl, yb - mid + 1, '#6a6c76'); R(xl, mid, xr - xl, 1, '#a3a6b0'); const gh = Math.max(1, Math.round((yb - mid) * 0.25)); for (let x = Math.round(xl) + 2; x < xr - 2; x += 3) R(x, mid + 1, 1, gh, '#5a5c66'); R(xl + 6, mid + gh + 1, xr - xl - 12, 1, '#8a7a44'); }
    for (const sd of [-1, 1]) { for (const [dy, c] of [[0, '#e3e7ea'], [1, '#b9bfc5'], [2, '#7a8088']]) { g.strokeStyle = c; g.lineWidth = 1; g.beginPath(); for (let z = -1.2; z <= ztop; z += 0.2) { const x = X(z, sd) - sd * 9 * P(z), y = Y(z) - 66 * P(z) + dy * Math.max(0.4, P(z) * 2); z === -1.2 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke(); } }
    // the exit sign fixed to the left wall: it slides toward us and grows in perspective like the wall's own seams
    { const z0 = 6.4 - climb * 0.85, L = 1.5;
      if (z0 > -0.8 && z0 + L < ztop) {
        const Q = (u, v) => { const z = z0 + u * L; return [X(z, -1), CY(z) + (Y(z) - CY(z)) * (0.5 + v * 0.13)]; };
        polyFill([Q(-0.03, -0.12), Q(1.03, -0.12), Q(1.03, 1.12), Q(-0.03, 1.12)], '#101114'); polyFill([Q(0, 0), Q(1, 0), Q(1, 1), Q(0, 1)], '#2a8a52'); polyFill([Q(0, 0), Q(1, 0), Q(1, 0.1), Q(0, 0.1)], '#3aa868');
        polyFill([Q(0.18, 0.14), Q(0.32, 0.5), Q(0.23, 0.5), Q(0.23, 0.86), Q(0.13, 0.86), Q(0.13, 0.5), Q(0.04, 0.5)], '#ffffff');
        polyFill([Q(0.5, 0.12), Q(0.9, 0.12), Q(0.9, 0.88), Q(0.5, 0.88)], '#f2d35a');
        const st = Math.max(1, (Q(0, 1)[1] - Q(0, 0)[1]) * 0.12); for (const [[u0, v0], [u1, v1]] of [[[0.6, 0.28], [0.8, 0.28]], [[0.8, 0.28], [0.8, 0.72]], [[0.63, 0.5], [0.8, 0.5]], [[0.6, 0.72], [0.8, 0.72]]]) { const [ax, ay] = Q(u0, v0), [bx, by] = Q(u1, v1); limb(ax, ay, st, bx, by, st, '#1b1716'); }
        const [lx, ly] = Q(0.5, 0.5); light(lx, ly, Math.abs(Q(1, 0)[0] - Q(0, 0)[0]) + 12, '90,220,150', 0.16);
      } }
    g.save(); g.globalCompositeOperation = 'lighter'; for (let k = 0; k < 4; k++) { g.fillStyle = `rgba(255,214,170,${0.045 + 0.02 * Math.sin(t * 2 + k)})`; g.beginPath(); g.moveTo(xl0 + 24 + k * 27, Y(ztop)); g.lineTo(xl0 + 36 + k * 27, Y(ztop)); g.lineTo(78 + k * 90, h); g.lineTo(42 + k * 90, h); g.closePath(); g.fill(); } g.restore();
    // her: the pelvis's surge each step, a sway toward the standing foot, the shoulders rolling with it
    const surge = hipAt(s)[1] - (86 + s * SR), hx0 = 192 + Math.sin(Math.PI * s) * 1.8 * 2, hy0 = 202 - surge * 2;
    haeunBackHD(hx0, hy0, 2, { roll: Math.sin(Math.PI * s) * 0.025, armL: 0.16 * ph, armR: -0.16 * ph, tail: Math.sin(Math.PI * s - 1.1) * 1.6 });
    if (done > 0) shade(0, 0, w, h, '255,226,190', 0.12 * done);
    vig(w, h, 0.4);
  });
  bars();
  blackout(W, H, t < 0.1 ? 1 - t / 0.1 : t > 2.7 ? (t - 2.7) / 0.5 : 0);
}

// 4. 가로등 — tracking beside her along the shutters at the blue hour before sunrise: the last stars and a thin moon, the
//    horizon going pink, haze off the street, a few kitchen windows coming on, rubbish bags out for collection, crates at the
//    store, a delivery scooter, sparrows on the wire, her breath in the cold; the one streetlight left on dies as she passes
function shotLamp(u) {
  const cam = u * 30, dawn = Math.round((0.25 + 0.75 * clamp(u / 8, 0, 1)) * 16) / 16;
  shot(1, (w, h) => {
    // the sky before sunrise: deep blue overhead, a band of lilac and a pink-orange rim low down, the last stars, a thin
    // waning moon
    dgrad(0, 0, w, 150, [mix('#141a33', '#1f2a52', dawn), mix('#24305a', '#3a4a80', dawn), mix('#4a4a7e', '#7a74a6', dawn), mix('#8a5e7a', '#c48a9a', dawn), mix('#b06e6e', '#f0b088', dawn)]);
    for (let k = 0; k < 22; k++) { const sx = (k * 97 + 13) % w, sy = 26 + (k * 37) % 46; if ((1 - dawn) * 1.3 > rnd(k, 3)) R(sx, sy, 1, 1, rnd(k, 5) < 0.3 ? '#ffffff' : '#c9d2f0'); }
    { const mx = 300 - cam * 0.05, my = 40; ellFill(mx, my, 5, 5, mix('#e8e6f0', '#c9c8dc', dawn)); ellFill(mx + 2.5, my - 1, 4.5, 5, mix('#1f2a52', '#33447a', dawn)); light(mx, my, 18, '220,220,255', 0.12 * (1.2 - dawn)); }
    // far blocks, slow: their windows mostly dark now, a few kitchens lighting up as people wake; the horizon's glow on
    // their roofs, and haze rising off the street between them and the shops
    for (let k = 0; k < 9; k++) { const bw = 40 + (k * 13) % 26, bh = 40 + (k * 29) % 40, x = Math.round(k * 56 - cam * 0.15) - 20; R(x, 128 - bh, bw, bh + 10, mix('#141a30', '#3a4466', dawn)); R(x, 128 - bh, bw, 1, mix('#2a3050', '#8a7aa0', dawn)); for (let j = 0; j < Math.floor(bh / 6); j++) for (let i = 0; i < Math.floor(bw / 6); i++) { const r0 = rnd(k * 31 + i, j); if (r0 < 0.05 || (r0 < 0.09 && u > 1 + rnd(j, k * 31 + i) * 6)) R(x + 3 + i * 6, 128 - bh + 4 + j * 6, 2, 2, r0 < 0.05 ? '#ffd890' : '#fff0c8'); } if (k % 3 === 1) { R(x + bw / 2, 128 - bh - 8, 1, 8, '#1a1e30'); R(x + bw / 2 - 1, 128 - bh - 9, 3, 1, Math.floor(u * 1.5) % 2 ? '#ff5a4a' : '#5a2a2a'); } }
    { const hz = g.createLinearGradient(0, 84, 0, 132); hz.addColorStop(0, 'rgba(190,180,215,0)'); hz.addColorStop(1, `rgba(190,180,215,${0.22 + 0.12 * dawn})`); g.fillStyle = hz; g.fillRect(0, 84, w, 48); }
  // the shop row, mid speed: shutters, signs, one convenience store still lit
    const mx = cam * 0.55;
    for (let k = -1; k < 10; k++) {
      const x = Math.round(k * 74 - (mx % 74)), idx = k + Math.floor(mx / 74);
      R(x, 100, 72, 60, '#22262e'); R(x, 100, 72, 3, '#3a3d46');
      if (idx % 4 === 2) { R(x + 4, 112, 64, 48, '#f2e6b8'); light(x + 36, 136, 60, '255,236,180', 0.3); R(x + 4, 104, 64, 7, '#2f8a5a'); R(x + 8, 106, 20, 3, '#efe6d2'); for (let s = 0; s < 3; s++) R(x + 10 + s * 18, 120, 12, 30, '#d9cfa0'); }
      else { for (let yy = 112; yy < 160; yy += 3) R(x + 4, yy, 64, 2, '#3a3d46'); R(x + 4, 104, 64, 7, ['#8a3a2a', '#2c3b57', '#8a5a34', '#5a2a5a'][(idx % 4 + 4) % 4]); R(x + 8, 106, 24, 3, '#efe6d2'); }
      R(x + 72, 100, 2, 60, '#14161c');
      if (idx % 4 === 2) { for (let c = 0; c < 2; c++) { R(x + 50, 148 - c * 7, 16, 7, ['#3a6aa0', '#d8a03a'][c]); R(x + 50, 148 - c * 7, 16, 1, '#ffffff'); for (let i = 0; i < 4; i++) R(x + 52 + i * 4, 150 - c * 7, 2, 3, '#1e2030'); } }
      else if (idx % 3 === 0) { for (const [bx, bw, bh, c, cd] of [[4, 16, 13, '#d9d5c8', '#aeaa9e'], [24, 14, 11, '#22232a', '#16171c'], [14, 15, 15, '#d9d5c8', '#aeaa9e']]) { const bcx = x + bx + bw / 2; ellFill(bcx, 160 - bh / 2, bw / 2, bh / 2, c); ellFill(bcx + bw * 0.15, 160 - bh / 2 + 1, bw * 0.35, bh * 0.4, cd); polyFill([[bcx - 2, 160 - bh + 1], [bcx + 2, 160 - bh + 1], [bcx + 3, 160 - bh - 3], [bcx, 160 - bh - 1], [bcx - 3, 160 - bh - 3]], c); if (c !== '#22232a') R(bcx - 4, 160 - bh / 2, 6, 2, '#6a8ac0'); } }
      else if (idx % 5 === 1) { const sx = x + 30; R(sx, 146, 26, 3, '#2a2d34'); ellFill(sx + 3, 154, 4, 4, '#14161c'); ellFill(sx + 23, 154, 4, 4, '#14161c'); R(sx + 10, 140, 14, 8, '#b33a2a'); R(sx + 10, 140, 14, 1, '#d85a4a'); R(sx + 2, 140, 2, 8, '#2a2d34'); R(sx, 139, 6, 1, '#3a3d44'); }
    }
    // power lines
    for (let x = 0; x < w; x++) { R(x, 52 + Math.round(Math.sin((x + cam * 0.55) / 50) * 3), 1, 1, '#121420'); R(x, 58 + Math.round(Math.sin((x + cam * 0.55) / 50 + 1) * 3), 1, 1, '#121420'); }
    for (let k = 0; k < 4; k++) { const bx0 = 180 + k * 9 - cam * 0.55, by0 = 56 + Math.round(Math.sin((bx0 + cam * 0.55) / 50) * 3) - 2, go = u > 5.2 + k * 0.12, f = go ? (u - 5.2 - k * 0.12) : 0, bx = bx0 + f * 40, by = by0 - f * 26, fl = Math.floor(u * 10 + k) % 2; if (bx < -4) continue; R(bx, by, 3, 2, '#2a2430'); R(bx + 3, by, 1, 1, '#2a2430'); if (go) { R(bx - 2, by - fl, 2, 1, '#2a2430'); R(bx + 3, by - fl, 2, 1, '#2a2430'); } }
    // the sidewalk, at her speed
    R(0, 160, w, 26, mix('#6a6a74', '#9a9aa4', dawn)); for (let x = -((cam) % 24); x < w; x += 24) R(Math.round(x), 160, 1, 26, mix('#56565e', '#86868e', dawn)); R(0, 172, w, 1, mix('#5e5e66', '#8e8e96', dawn)); R(0, 186, w, 6, mix('#4a4a52', '#76767e', dawn)); g.save(); g.globalAlpha = 0.18; R(0, 161, w, 3, mix('#8a7aa4', '#e2a07e', dawn)); for (let x = -((cam) % 90); x < w; x += 90) R(Math.round(x + 20), 176, 26, 2, mix('#6a6a96', '#c9a0b0', dawn)); g.restore();
    // the streetlight
    const lx = Math.round(246 - cam), off = u > 4.3, flick = u > 3.4 && u < 4.3 && (Math.floor(u * 16) % 3 === 0 || (u > 4.0 && Math.floor(u * 30) % 2 === 0)), on = !off && !flick;
    R(lx - 2, 50, 4, 112, '#202228'); R(lx - 2, 50, 1, 112, '#3a3d44'); R(lx - 2, 48, 30, 3, '#202228'); R(lx + 18, 50, 12, 4, '#2a2d34'); R(lx + 19, 54, 10, 2, on ? '#fff3c8' : '#3a3d44');
    if (on) { g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createLinearGradient(0, 56, 0, 172); gr.addColorStop(0, 'rgba(255,206,140,.32)'); gr.addColorStop(1, 'rgba(255,206,140,0)'); g.fillStyle = gr; g.beginPath(); g.moveTo(lx + 19, 56); g.lineTo(lx + 29, 56); g.lineTo(lx + 74, 172); g.lineTo(lx - 26, 172); g.closePath(); g.fill(); g.restore(); light(lx + 24, 56, 30, '255,230,170', 0.55); g.fillStyle = 'rgba(255,214,150,.18)'; g.beginPath(); g.ellipse(lx + 24, 172, 46, 6, 0, 0, Math.PI * 2); g.fill(); for (let k = 0; k < 4; k++) { const a = u * 7 + k * 1.7; R(lx + 24 + Math.cos(a) * (6 + k * 3), 60 + Math.sin(a * 1.3) * 5, 1, 1, '#fff3c8'); } }
    // her, walking right; her shadow from the lamp
    const hx = 150, st = Math.floor(u / 0.27) % 2;
    if (on) { const d = hx - (lx + 24), L = Math.min(44, 8 + Math.abs(d) * 0.5); g.fillStyle = 'rgba(0,0,0,.35)'; g.beginPath(); g.ellipse(hx + Math.sign(d) * L * 0.6, 173, L, 2, 0, 0, Math.PI * 2); g.fill(); }
    haeunWalkSide(hx, 174, u, { mirror: true, pace: 0.27 });
    { const bp = (u % 1.35) / 1.35; if (bp < 0.6) { g.save(); g.globalAlpha = 0.45 * (1 - bp / 0.6); ellFill(hx + 10 + bp * 12, 128 - bp * 4, 1.5 + bp * 4, 1 + bp * 2.5, '#e8ecf4'); g.restore(); } }
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
//    white bar, the bar she steps on a little brighter for a moment. She is her true size in the street, and the camera keeps
//    climbing so she shrinks into it; it cuts as she passes the middle of the road
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
    // the housing: two lamps stacked, each a grid of LEDs
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
    vig(w, h, 0.5);
  });
  bars();
  if (u > 0.55) cue('sig-on', () => { oscS('sine', 1200, now(), 0.05, 0.08); oscS('sine', 1200, now() + 0.25, 0.05, 0.08); });
  blackout(W, H, u < 0.3 ? 1 - u / 0.3 : 0);
}
// a car from above at 1x: the body with its rounded corners, bonnet and boot creases, the windscreen and rear window, the
// roof, the mirrors, head- and tail-lights. Facing right unless flip
function carTop(x, y, c, flip) {
  const L = 64, Wd = 32, cd = mix(c, '#000000', 0.3), cl = mix(c, '#ffffff', 0.18);
  g.save(); if (flip) { g.translate(x * 2 + L, 0); g.scale(-1, 1); }
  polyFill([[x + 3, y], [x + L - 5, y], [x + L, y + 4], [x + L, y + Wd - 4], [x + L - 5, y + Wd], [x + 3, y + Wd], [x, y + Wd - 3], [x, y + 3]], c);
  R(x + 3, y, L - 8, 1, cl); R(x + 3, y + Wd - 1, L - 8, 1, cd);
  polyFill([[x + 18, y + 3], [x + 44, y + 3], [x + 48, y + 6], [x + 48, y + Wd - 6], [x + 44, y + Wd - 3], [x + 18, y + Wd - 3], [x + 14, y + Wd - 6], [x + 14, y + 6]], '#1c2430');
  polyFill([[x + 22, y + 5], [x + 40, y + 5], [x + 40, y + Wd - 5], [x + 22, y + Wd - 5]], cd); R(x + 22, y + 5, 18, 1, mix(cd, '#ffffff', 0.15));
  polyFill([[x + 41, y + 5], [x + 47, y + 7], [x + 47, y + Wd - 7], [x + 41, y + Wd - 5]], '#6f8ea4'); R(x + 43, y + 9, 1, 8, '#a9c4d4');
  polyFill([[x + 15, y + 7], [x + 21, y + 5], [x + 21, y + Wd - 5], [x + 15, y + Wd - 7]], '#4a5e70');
  R(x + 52, y + 4, 1, Wd - 8, cd); R(x + 8, y + 4, 1, Wd - 8, cd); R(x + 40, y - 2, 4, 2, cd); R(x + 40, y + Wd, 4, 2, cd);
  R(x + L - 2, y + 4, 2, 5, '#fff3c8'); R(x + L - 2, y + Wd - 9, 2, 5, '#fff3c8'); R(x, y + 4, 2, 4, '#d8463b'); R(x, y + Wd - 8, 2, 4, '#d8463b');
  g.restore();
}
// 하은 from straight above, walking down the frame: her shadow, the shoes stepping out ahead and behind, the swinging
// sleeves and hands, the shoulders in the vest with its band and the bag strap, the ponytail behind, the cap's crown with
// its seams and button and the brim ahead of her face
function haeunTop(x, y, ph, step) {
  const sw = Math.sin(ph * Math.PI) * (step ? 1 : -1), foot = 6 * Math.cos(ph * Math.PI) * (step ? 1 : -1);
  g.fillStyle = 'rgba(0,0,0,.33)'; g.beginPath(); g.ellipse(x + 5, y + 6, 15, 11, 0, 0, Math.PI * 2); g.fill();
  for (const [fx, d] of [[-6, foot], [5, -foot]]) { polyFill([[fx - 3, y + 2 + d], [fx + 3, y + 2 + d], [fx + 3.5, y + 13 + d], [fx + 1.5, y + 15 + d], [fx - 1.5, y + 15 + d], [fx - 3.5, y + 13 + d]].map(([a, b]) => [x + a, b]), '#1e1a1a'); R(x + fx - 2, y + 14 + d, 4, 1, '#e9e3d6'); R(x + fx - 1, y + 5 + d, 2, 4, '#3a3a42'); }
  for (const [sx, d] of [[-14, sw * 4], [14, -sw * 4]]) { limb(x + sx * 0.9, y - 4, 7, x + sx, y + 8 + d, 6, '#1e1a1a'); limb(x + sx * 0.9, y - 4, 7, x + sx, y + 8 + d, 6, '#2c2829', 2, sx < 0 ? 1 : -1); ellFill(x + sx, y + 11 + d, 3, 3, SK); }
  ellFill(x, y - 2, 14, 8, '#1e1a1a'); ellFill(x, y - 2, 10, 7, '#7ec8e3'); ellFill(x - 2, y - 3, 6, 4, '#a8e0f2');
  R(x - 10, y + 3, 20, 2, '#e6e1cc'); R(x - 9, y - 8, 18, 1, '#e6e1cc'); limb(x + 9, y - 7, 3, x - 8, y + 4, 3, '#2f3237');
  const tail = Math.round(sw * 2); limb(x, y - 10, 5, x + tail, y - 22, 3, '#4a3328'); dotLine(x, y - 11, x + tail, y - 21, '#6b4a3a', 2);
  ellFill(x, y - 4, 9, 9, '#a83328'); ellFill(x - 0.5, y - 4.5, 8, 8, '#d8463b'); polyFill([[x - 8, y], [x + 8, y], [x + 7, y + 6], [x + 3, y + 8], [x - 3, y + 8], [x - 7, y + 6]], '#b8382e'); R(x - 6, y + 1, 12, 1, '#8e2c25');
  for (const a of [0.5, 1.55, 2.6, 3.65, 4.7, 5.75]) dotLine(x, y - 4, x + Math.cos(a) * 7.5, y - 4 + Math.sin(a) * 7.5, '#a83328', 1);
  R(x - 4, y - 9, 3, 2, '#ef6a55'); R(x - 1, y - 5, 2, 2, '#a83328');
}
// the street from straight above, in world units (16 to the metre): the road between its kerbs, the crossing, the pavements
// with their trees and lamps, the rooftops beyond. Grain and paving are laid in world space so they hold still as the
// camera climbs
let CROSSW = null;
function crossWorld() {
  if (CROSSW) return CROSSW;
  const sp = [], roofs = [];
  for (let i = 0; i < 5200; i++) sp.push([-260 + rnd(i, 1) * 920, 53 + rnd(1, i) * 111, rnd(i, 7) < 0.5 ? '#383a42' : '#26272d']);
  for (let k = 0; k < 9; k++) { const x0 = -300 + k * 120 + rnd(k, 3) * 20; roofs.push([x0, 100 + rnd(3, k) * 20, k]); }
  return (CROSSW = { sp, roofs });
}
// 하은 from above at her true size in the street: a shadow, the shoes stepping, the shoulders in black, the vest, the red cap
// with its brim ahead, the ponytail behind
function haeunTopSmall(S, x, y, z, ph, step) {
  const k = z, foot = 3 * Math.cos(ph * Math.PI) * (step ? 1 : -1), sw = Math.sin(ph * Math.PI) * (step ? 1 : -1);
  const P = (dx, dy) => S(x + dx, y + dy);
  { const [sx, sy] = P(2, 3); g.fillStyle = 'rgba(0,0,0,.35)'; g.beginPath(); g.ellipse(sx, sy, 6 * k, 4 * k, 0, 0, Math.PI * 2); g.fill(); }
  for (const [fx, d] of [[-2, foot], [2, -foot]]) { const [px, py] = P(fx, 3 + d); R(px - k, py - k, Math.max(1, 2 * k), Math.max(1, 3 * k), '#1e1a1a'); }
  for (const [ax, d] of [[-5, sw * 2], [5, -sw * 2]]) { const [px, py] = P(ax, d); R(px - k, py - 1.5 * k, Math.max(1, 2 * k), Math.max(1, 4 * k), '#1e1a1a'); }
  { const [px, py] = P(0, -1); ellFill(px, py, 5 * k, 3 * k, '#1e1a1a'); ellFill(px, py, 3.6 * k, 2.4 * k, '#7ec8e3'); }
  { const [px, py] = P(sw * 0.8, -6); R(px - 0.5 * k, py - 2 * k, Math.max(1, 1.5 * k), Math.max(1, 3 * k), '#4a3328'); }
  { const [px, py] = P(0, -2); ellFill(px, py, 3 * k, 3 * k, '#d8463b'); const [bx, by] = P(0, 0.6); R(bx - 2 * k, by, Math.max(1, 4 * k), Math.max(1, 1.4 * k), '#a83328'); if (k > 1.2) R(px - k, py - 1.5 * k, 1, 1, '#ef6a55'); }
}
function crossTop(t) {
  const beat = 0.5, start = 0.6, steps = Math.floor((t - start) / beat), ph = (((t - start) / beat) % 1 + 1) % 1;
  // the camera climbs the whole shot: she begins small on the road and ends a speck in the city
  const z = lerp(1.15, 0.55, ease(clamp(t / 3.2, 0, 1)) * 0.7 + clamp(t / 3.2, 0, 1) * 0.3), CXw = 194, CYw = 110;
  const S = (x, y) => [192 + (x - CXw) * z, 108 + (y - CYw) * z];
  const RW = (x, y, w0, h0, c) => { const [a, b] = S(x, y); R(a, b, Math.max(1, w0 * z), Math.max(1, h0 * z), c); };
  shot(1, (w, h) => {
    const W0 = (0 - 192) / z + CXw, W1 = (w - 192) / z + CXw;
    R(0, 0, w, h, '#24252c');
    // rooftops beyond both pavements: parapets, air-conditioning units, a water tank, a skylight
    for (const [y0, y1, sd] of [[-400, -44, -1], [261, 600, 1]]) {
      RW(W0 - 10, y0, W1 - W0 + 20, y1 - y0, '#2c2f3a');
      for (const [x0, , k] of crossWorld().roofs) { const yy = sd < 0 ? y1 - 110 : y0 + 6; RW(x0, yy, 112, 104, k % 2 ? '#353846' : '#30333f'); RW(x0, yy, 112, 3, '#4a4e5e'); RW(x0 + 10, yy + 14, 22, 16, '#5a5e6a'); RW(x0 + 12, yy + 16, 10, 10, '#3a3e48'); RW(x0 + 40, yy + 20, 18, 14, '#5a5e6a'); if (k % 3 === 0) { const [cx2, cy2] = S(x0 + 80, yy + 60); ellFill(cx2, cy2, 12 * z, 12 * z, '#4a6a8a'); ellFill(cx2, cy2, 9 * z, 9 * z, '#5a7a9a'); } if (k % 4 === 1) RW(x0 + 60, yy + 70, 30, 18, '#c9b06a'); }
    }
    // the pavements: paving in a grid, the kerbs, tactile paving at the crossing, trees and lamp posts, bollards
    for (const [y0, y1] of [[-44, 52], [165, 261]]) { RW(W0 - 10, y0, W1 - W0 + 20, y1 - y0, '#8d8f96'); const st = 16; for (let x = Math.floor(W0 / st) * st; x < W1; x += st) RW(x, y0, 1, y1 - y0, '#83858c'); for (let y = y0; y < y1; y += st) RW(W0 - 10, y, W1 - W0 + 20, 1, '#83858c'); }
    RW(W0 - 10, 50, W1 - W0 + 20, 3, '#6a6c72'); RW(W0 - 10, 50, W1 - W0 + 20, 1, '#a9abb1'); RW(W0 - 10, 165, W1 - W0 + 20, 3, '#6a6c72'); RW(W0 - 10, 165, W1 - W0 + 20, 1, '#a9abb1');
    for (const y0 of [40, 168]) { RW(148, y0, 92, 10, '#c9a63a'); for (let x = 150; x < 240; x += 4) for (let y = y0 + 2; y < y0 + 10; y += 4) RW(x, y, 2, 2, '#e8c34a'); }
    for (const yb of [44, 172]) for (const x of [140, 248]) { const [bx, by] = S(x, yb); ellFill(bx, by, 2 * z, 2 * z, '#3a3d44'); }
    for (let x = Math.floor(W0 / 160) * 160 + 40; x < W1 + 40; x += 160) for (const yt of [8, 212]) { if (Math.abs(x - 194) < 70) continue; const [tx, ty] = S(x, yt); ellFill(tx + 3 * z, ty + 3 * z, 18 * z, 16 * z, 'rgba(10,16,10,.45)'); ellFill(tx, ty, 18 * z, 16 * z, '#2f4a32'); ellFill(tx - 3 * z, ty - 3 * z, 12 * z, 10 * z, '#3e5e40'); ellFill(tx - 6 * z, ty - 6 * z, 5 * z, 4 * z, '#4e7050'); }
    for (let x = Math.floor(W0 / 160) * 160 + 120; x < W1 + 40; x += 160) for (const [yl, dir] of [[46, 1], [170, -1]]) { const [lx, ly] = S(x, yl); ellFill(lx, ly, 2.5 * z, 2.5 * z, '#3a3d44'); RW(x - 1, yl + (dir > 0 ? 0 : -16), 2, 16, '#3a3d44'); const [hx, hy] = S(x, yl + dir * 16); ellFill(hx, hy, 3 * z, 2 * z, '#fff3c8'); light(hx, hy, 22 * z, '255,226,170', 0.16); }
    // the road: grain, the double centre line, stop lines, the crossing's bars
    for (const [x, y, c] of crossWorld().sp) { if (x < W0 - 2 || x > W1 + 2) continue; const [a, b] = S(x, y); R(a, b, 1, 1, c); }
    for (const yy of [106, 112]) { RW(W0 - 10, yy, 130 - W0 + 10, 2, '#d9a83a'); RW(254, yy, W1 - 254 + 10, 2, '#d9a83a'); }
    for (let x = Math.floor(W0 / 48) * 48; x < W1; x += 48) { if (x > 110 && x < 270) continue; RW(x, 78, 24, 2, '#b9b4a6'); RW(x, 138, 24, 2, '#b9b4a6'); }
    RW(128, 58, 4, 46, '#d9d4c6'); RW(252, 116, 4, 46, '#d9d4c6');
    for (let y = 60, i = 0; y < 166; y += 16, i++) { RW(148, y, 92, 8, '#d4cfc1'); const age = t - (start + i * beat + beat * 0.5); if (age >= 0) { g.save(); g.globalAlpha = Math.max(0, 0.5 - age * 0.15); RW(148, y, 92, 8, '#fff6dc'); g.restore(); } }
    // the cars at the stop lines and the queue behind, headlights across the road
    const car = (x, y, c, flip) => { const [a, b] = S(x, y); rotated(flip ? Math.PI : 0, 0, 0, a + (flip ? 64 * z : 0), b + (flip ? 32 * z : 0), () => carTop(0, 0, c, false), z); };
    car(60, 64, '#3a4a6a'); car(-24, 66, '#5a5e66'); car(-110, 64, '#6a3a3a');
    car(264, 122, '#8a3a2a', true); car(350, 120, '#c9ccd2', true); car(440, 122, '#2a3a4a', true);
    { const [a0, b0] = S(124, 66), [a1, b1] = S(220, 56), [a2, b2] = S(220, 106), [a3, b3] = S(124, 96); g.save(); g.globalCompositeOperation = 'lighter'; const hl = g.createLinearGradient(a0, 0, a1, 0); hl.addColorStop(0, 'rgba(255,240,200,.14)'); hl.addColorStop(1, 'rgba(255,240,200,0)'); g.fillStyle = hl; g.beginPath(); g.moveTo(a0, b0); g.lineTo(a1, b1); g.lineTo(a2, b2); g.lineTo(a3, b3); g.closePath(); g.fill(); g.restore(); }
    { const [px, py] = S(258, 178); ellFill(px, py, 4 * z, 4 * z, '#3a3d44'); }
    // 하은, one bar per beat
    const prog = clamp((t - start) / beat, 0, 10), y = 44 + prog * 16;
    haeunTopSmall(S, 194, y, z, ph, steps % 2);
    vig(w, h, 0.32 + 0.18 * clamp(t / 3.2, 0, 1));
  });
  bars();
  for (let k = 0; k < 8; k++) { const at = 0.6 + k * 0.5; if (t >= at) cue('beep' + k, () => oscS('sine', 1200, now(), 0.045, 0.07)); }
}

// 6. 웅덩이 — low on the wet road: the hospital upside down in a puddle, her shoe breaks it, the camera tilts up to the real thing
function hospitalFront() {
  return layer('hospital1', 384, 208, (w, h) => {
    dgrad(0, 0, w, h, ['#33467c', '#4a5a90', '#7a78a6', '#b890a4', '#e6b496']);
    // the neighbours, dark, a few windows lit
    R(300, 40, 84, 168, '#2a2f44'); R(300, 40, 84, 2, '#3a4058'); R(0, 68, 62, 140, '#262b40'); R(0, 68, 62, 2, '#363c56');
    for (let j = 0; j < 9; j++) for (let i = 0; i < 4; i++) if (rnd(i, j + 9) < 0.35) { R(310 + i * 18, 52 + j * 16, 8, 8, '#ffd890'); R(310 + i * 18, 52 + j * 16, 8, 1, '#fff0c0'); }
    for (let j = 0; j < 7; j++) for (let i = 0; i < 3; i++) if (rnd(i + 5, j) < 0.3) R(8 + i * 18, 80 + j * 16, 8, 8, '#ffd890');
    // the hospital: the pale facade, pilasters between the window bays, floor bands, windows with frames and sills, some lit
    R(68, 52, 248, 156, '#d9e0e4'); R(68, 52, 248, 4, '#b9c4c8'); R(68, 52, 3, 156, '#eef2f4'); R(313, 52, 3, 156, '#a9b4b8');
    for (let x = 76; x < 312; x += 40) R(x, 56, 4, 76, '#ccd4d8');
    for (let y = 60, f = 0; y < 132; y += 18, f++) { R(68, y + 15, 248, 2, '#c4ccd0'); for (let x = 82; x < 306; x += 20) { const lit = rnd(x, y) < 0.32; R(x, y, 14, 11, '#9aa4ac'); R(x + 1, y + 1, 12, 9, lit ? '#ffe9a8' : '#2f3a4a'); R(x + 1, y + 1, 12, 1, lit ? '#fff6d8' : '#4a5a6e'); R(x + 7, y + 1, 1, 9, lit ? '#e8cf88' : '#3a4656'); if (lit && rnd(y, x) < 0.4) R(x + 2, y + 4, 4, 6, '#d9b870'); R(x, y + 11, 14, 1, '#eef2f4'); } }
    // the red cross on the roof, in its lit box
    R(166, 6, 52, 46, '#c9d0d4'); R(168, 8, 48, 42, '#f4f7f8'); R(168, 8, 48, 1, '#ffffff'); R(184, 12, 16, 34, '#d8463b'); R(174, 21, 36, 16, '#d8463b'); R(185, 13, 4, 6, '#ef6a55'); R(175, 22, 6, 3, '#ef6a55'); R(162, 50, 60, 3, '#9aa4ac');
    // the name board and the lit entrance under its canopy
    R(116, 136, 152, 22, '#1b1716'); R(116, 136, 152, 1, '#3a3236'); hospName(134, 139, '#ffffff', 14);
    R(124, 160, 136, 6, '#5a6066'); R(124, 160, 136, 1, '#8a9097');
    R(134, 166, 116, 42, '#9aa0a6'); R(137, 168, 110, 40, '#fff3c8'); for (const x of [164, 191, 218]) R(x, 168, 2, 40, '#9aa0a6'); R(137, 168, 110, 2, '#ffffff');
  });
}
// her shoe and trouser hem side on, for the puddle: the same sneaker as on the stairs, posed flat (or toe down)
function shoeSide(x, y, q, pitch) {
  const F = { ball: [BALL, 0], pitch, toe: pitch * 0.4 }, M = (a, b) => [x + a * q, y - b * q], A = M(...shoePt(F, ANK[0], ANK[1]));
  sneakerSide(F, M, 0); trouserLeg([A[0] - 4, A[1] - 120], [A[0] - 2, A[1] - 60], A, q, ['#3a3f45', '#2a2e33', '#56606a', '#22252a']);
}
function shotPuddle(u) {
  const tilt = ease(clamp((u - 3.0) / 2.0, 0, 1)), camY = Math.round(lerp(212, -8, tilt));
  shot(1, (w, h) => {
    const bld = hospitalFront(), GY = 208;
    g.save(); g.translate(0, -camY);
    R(0, -40, w, 40, '#33467c'); g.drawImage(bld, 0, 0); light(192, 28, 66, '216,70,59', 0.38); light(192, 188, 90, '255,236,170', 0.28);
    // the road: wet asphalt, the kerb at the horizon, the building's light lying on it
    g.drawImage(layer('wetroad1', w, 240, () => { R(0, 0, w, 240, '#25262d'); for (let y = 0; y < 240; y++) for (let x = 0; x < w; x++) if (rnd(x, y) < 0.08) R(x, y, 1, 1, rnd(y, x) < 0.5 ? '#32333b' : '#1e1f25'); }), 0, GY);
    R(0, GY, w, 3, '#4a4c54'); R(0, GY, w, 1, '#6a6c74');
    g.save(); g.globalAlpha = 0.16; for (let k = 0; k < 9; k++) R(150 + k * 9, GY + 6 + k * 3, 80 - k * 6, 1, '#fff3c8'); g.restore();
    // the puddle: near rows reflect the top of the building (the cross), far rows its foot; rippled after her step
    const cx = 200, cy = GY + 100, rx = 132, ry = 44;
    for (let y = cy - ry; y <= cy + ry; y++) {
      const dy = (y - cy) / ry, wob = Math.round(Math.sin(y * 0.85) * 3), half = Math.round(rx * Math.sqrt(Math.max(0, 1 - dy * dy))) + wob; if (half <= 3) continue;
      const src = Math.round(GY - 2 - (y - (cy - ry)) * (GY / (2 * ry)));
      let dx = 0; for (const t0 of [1.6, 2.5]) { const a = u - t0; if (a > 0 && a < 2.4) dx += Math.round(Math.sin(y * 0.4 - a * 11) * 6 * Math.exp(-a * 1.3)); }
      if (src >= 0 && src < GY) g.drawImage(bld, cx - half - dx, src, half * 2, 1, cx - half, y, half * 2, 1); else R(cx - half, y, half * 2, 1, '#33467c');
      R(cx - half, y, 1, 1, '#4a5068'); R(cx + half - 1, y, 1, 1, '#4a5068');
    }
    g.save(); g.beginPath(); g.ellipse(cx, cy, rx + 3, ry, 0, 0, Math.PI * 2); g.clip(); shade(cx - rx - 4, cy - ry, rx * 2 + 8, ry * 2 + 1, '16,22,40', 0.36); light(cx, cy + 20, 60, '216,70,59', 0.16); g.restore();
    for (let k = 0; k < 12; k++) { const a = Math.PI * 2 * k / 12, x = cx + Math.cos(a) * (rx + 2), y = cy + Math.sin(a) * (ry + 1); R(x, y, 2, 1, '#3a3c44'); }
    for (const t0 of [1.6, 2.5]) { const a = u - t0; if (a > 0 && a < 1.8) { g.strokeStyle = `rgba(210,230,255,${0.5 * (1 - a / 1.8)})`; g.lineWidth = 1; g.beginPath(); g.ellipse(224, cy + 16, 6 + a * 80, (6 + a * 80) * 0.3, 0, 0, Math.PI * 2); g.stroke(); } }
    // her shoe: it comes down into the water and lifts away
    if (u > 1.0 && u < 3.3) {
      const d = u - 1.0, down = clamp(d / 0.6, 0, 1), upp = clamp((u - 2.4) / 0.7, 0, 1), sx = lerp(150, 178, down) + upp * 100, sy = lerp(GY + 20, cy + 20, ease(down)) - upp * 92;
      if (down >= 1 && upp === 0) { g.fillStyle = 'rgba(8,10,20,.35)'; g.beginPath(); g.ellipse(sx + 28, sy + 1, 30, 4, 0, 0, Math.PI * 2); g.fill(); }
      shoeSide(sx, sy, 2.1, upp * 0.35);
      if (d > 0.55 && d < 1.2) { const s = (d - 0.55) / 0.65; for (let k = 0; k < 14; k++) { const a = -Math.PI * (0.08 + 0.84 * k / 13); R(224 + Math.cos(a) * s * 60, cy + 16 + Math.sin(a) * s * 44 + s * s * 52, 2, 2, '#cfe6ff'); R(224 + Math.cos(a) * s * 60, cy + 16 + Math.sin(a) * s * 44 + s * s * 52, 1, 1, '#ffffff'); } }
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
// draw into a scratch canvas, darken what was drawn by a tint, and lay it over the frame
let TINTC = null;
function tinted(w, h, rgb, a, draw) {
  if (!TINTC) { TINTC = document.createElement('canvas'); TINTC.width = W; TINTC.height = H; }
  const o = TINTC.getContext('2d'), g0 = g; o.setTransform(1, 0, 0, 1, 0, 0); o.globalCompositeOperation = 'source-over'; o.globalAlpha = 1; o.clearRect(0, 0, W, H); g = o;
  try { draw(); o.globalCompositeOperation = 'source-atop'; o.fillStyle = `rgba(${rgb},${a})`; o.fillRect(0, 0, w, h); o.globalCompositeOperation = 'source-over'; } finally { g = g0; }
  g.drawImage(TINTC, 0, 0, w, h, 0, 0, w, h);
}
function corridorOTS(u) {
  shot(1, (w, h) => {
    const VX = 236, VY = 92, P = z => 1 / (1 + 0.55 * z);
    const lit = k => u >= LAMP_AT(k), litA = k => clamp((u - LAMP_AT(k)) / 0.12, 0, 1);
    // floor, walls, ceiling: four trapezoids into the dark
    const zf = 12, fx = s => VX + s * 180 * P(zf), fyB = VY + 100 * P(zf), fyT = VY - 68 * P(zf);
    R(0, 0, w, h, '#0b100e');
    g.fillStyle = '#18211e'; g.beginPath(); g.moveTo(-40, h); g.lineTo(w + 80, h); g.lineTo(fx(1), fyB); g.lineTo(fx(-1), fyB); g.closePath(); g.fill();
    g.fillStyle = '#111815'; g.beginPath(); g.moveTo(-40, 0); g.lineTo(w + 80, 0); g.lineTo(fx(1), fyT); g.lineTo(fx(-1), fyT); g.closePath(); g.fill();
    for (const s of [-1, 1]) { g.fillStyle = '#141c19'; g.beginPath(); g.moveTo(s < 0 ? -40 : w + 80, 0); g.lineTo(fx(s), fyT); g.lineTo(fx(s), fyB); g.lineTo(s < 0 ? -40 : w + 80, h); g.closePath(); g.fill(); }
    R(fx(-1), fyT, fx(1) - fx(-1), fyB - fyT, '#050706');
    // the doors along both walls, their windows and handles; the handrail; the floor's seams
    for (let z = 0.5; z < zf; z += 1.3) { const p = P(z), p2 = P(z + 0.7); for (const s of [-1, 1]) { const x0 = VX + s * 180 * p, x1 = VX + s * 180 * p2; polyFill([[x0, VY - 20 * p], [x1, VY - 20 * p2], [x1, VY + 100 * p2], [x0, VY + 100 * p]], '#1d2824'); polyFill([[x0 + (x1 - x0) * 0.2, VY - 8 * p], [x0 + (x1 - x0) * 0.6, VY - 8 * lerp(p, p2, 0.6)], [x0 + (x1 - x0) * 0.6, VY + 20 * lerp(p, p2, 0.6)], [x0 + (x1 - x0) * 0.2, VY + 20 * p]], '#2a3a34'); R(x0 + (x1 - x0) * 0.8, VY + 40 * p, Math.max(1, 2 * p), Math.max(1, 6 * p), '#4a5a52'); } }
    for (const s of [-1, 1]) { g.strokeStyle = '#2c3a35'; g.lineWidth = 1; g.beginPath(); g.moveTo(VX + s * 600, VY + 40 * 3.3); g.lineTo(fx(s), VY + 40 * P(zf)); g.stroke(); g.strokeStyle = '#1f2a26'; g.beginPath(); g.moveTo(VX + s * 600, VY + 43 * 3.3); g.lineTo(fx(s), VY + 43 * P(zf)); g.stroke(); }
    for (let z = 0.4; z < zf; z += 0.8) { const y = VY + 100 * P(z); R(VX - 180 * P(z), y, 360 * P(z), 1, '#1c2622'); }
    // the seven ceiling panels, near to far; each one lit lights its stretch of floor and leaves a smear in the polish
    for (let k = 0; k < 7; k++) {
      const z = 0.9 + k * 1.45, p = P(z), x = VX, y = VY - 68 * p, pw = Math.max(3, Math.round(72 * p)), ph = Math.max(1, Math.round(8 * p)), a = litA(k);
      R(x - pw / 2 - 1, y - 1, pw + 2, ph + 2, '#151d1a'); R(x - pw / 2, y, pw, ph, a > 0 ? '#eef6ea' : '#202a26'); if (a > 0 && ph > 2) R(x - pw / 2, y + ph - 1, pw, 1, '#c9dcc8');
      if (a > 0) {
        light(x, y + 3, 80 * p + 10, '220,240,215', 0.14 * a);
        g.save(); g.globalCompositeOperation = 'lighter'; const fy = VY + 100 * p, gr = g.createLinearGradient(0, y, 0, fy); gr.addColorStop(0, `rgba(210,235,205,${0.07 * a})`); gr.addColorStop(1, `rgba(210,235,205,${0.02 * a})`); g.fillStyle = gr; g.beginPath(); g.moveTo(x - pw / 2, y); g.lineTo(x + pw / 2, y); g.lineTo(x + 140 * p, fy); g.lineTo(x - 140 * p, fy); g.closePath(); g.fill(); g.restore();
        const fy2 = Math.round(VY + 100 * p + 1); g.save(); g.globalAlpha = 0.5 * a; R(x - Math.round(pw / 4), fy2, Math.max(1, Math.round(pw / 2)), 1, '#9fb8a8'); R(x - Math.round(pw / 6), fy2 + 3, Math.max(1, Math.round(pw / 3)), 1, '#7f9a88'); g.restore();
      }
    }
    // the doctor, far, under the seventh panel; he starts walking once it is on: coat, scrubs, head, the stride
    const dz = u < LAMP_AT(6) + 0.3 ? 9.6 : 9.6 - (u - LAMP_AT(6) - 0.3) * 1.9, dp = P(dz), dy = VY + 100 * dp, s2 = dp * 2;
    if (u > LAMP_AT(6) - 0.2) { const a = clamp((u - LAMP_AT(6) + 0.2) / 0.3, 0, 1), st = Math.floor(u / 0.3) % 2; g.save(); g.globalAlpha = a;
      for (const [lx, d] of [[-5, st], [1, 1 - st]]) R(VX + lx * s2, dy - 22 * s2 + d * s2, 4 * s2, 22 * s2 - d * s2, '#3a3f45');
      polyFill([[VX - 9 * s2, dy - 50 * s2], [VX + 9 * s2, dy - 50 * s2], [VX + 10 * s2, dy - 20 * s2], [VX - 10 * s2, dy - 20 * s2]], '#e8ece6'); R(VX - 3 * s2, dy - 50 * s2, 6 * s2, 10 * s2, '#4f8f8a');
      ellFill(VX, dy - 56 * s2, 5 * s2, 6 * s2, '#d9a27a'); ellFill(VX, dy - 59 * s2, 5 * s2, 3.5 * s2, '#2a2220'); g.restore(); }
    // her, close, from behind and in shadow: the same 하은 as on the stairs, with her legs, the lit panels rimming her
    tinted(w, h, '14,20,18', 0.6, () => {
      const hy = 114, q = 1.0;
      for (const sd of [-1, 1]) { R(70 + sd * 8 - 5, hy + 10, 11, 74, '#3a3f45'); R(70 + sd * 8 + (sd < 0 ? -5 : 5), hy + 10, 1, 74, '#2a2e33'); R(70 + sd * 8 - 6, hy + 82, 13, 6, '#1e1a1a'); R(70 + sd * 8 - 6, hy + 88, 13, 2, '#e9e3d6'); }
      haeunBackHD(70, hy, q, { armL: 0, armR: 0, tail: 0 });
    });
    const rim = clamp((lit(0) ? 0.55 : 0) + (lit(2) ? 0.3 : 0), 0, 1); if (rim > 0) { g.save(); g.globalAlpha = rim; dotLine(66, 38, 79, 42, '#cfe8d0', 1); dotLine(79, 42, 80, 50, '#cfe8d0', 1); dotLine(84, 66, 89, 70, '#9fc0a8', 1); R(90, 72, 1, 40, '#9fc0a8'); g.restore(); }
    vig(w, h, 0.5);
  });
  bars();
  for (let k = 0; k < 7; k++) if (u >= LAMP_AT(k)) cue('lamp' + k, () => { SND.heart(); noiseS(now(), 'highpass', 5000, 0.03, 0.04); });
  blackout(W, H, u < 0.5 ? 1 - u / 0.5 : 0);
}
// the doctor, chest up at full resolution: the white coat with its lapels and pockets, teal scrubs, the stethoscope, the
// name tag and pens; a tired face: short dark hair, glasses, bags under the eyes; light from the panels above
function doctorMCU(t) {
  shot(1, (w, h) => {
    dgrad(0, 0, w, h, ['#0d1311', '#1a2420', '#1f2a26', '#141c19']);
    for (let k = 0; k < 6; k++) light(60 + k * 18, 60 - k * 4, 36 - k * 4, '220,240,215', 0.25);
    light(80, 52, 100, '200,230,200', 0.12);
    R(0, 160, w, 32, '#16201c');
    const x = 216, top = 40, talk = (Math.floor(t * 7) % 3 === 0) && ((t > 0.2 && t < 1.6) || (t > 1.8 && t < 3.1)), blink = t > 1.2 && t < 1.32;
    const sk = '#d9a27a', skD = '#b98260', skDD = '#9c6a4c', hair = '#2a2220';
    // the coat
    polyFill([[x - 24, top + 46], [x + 24, top + 46], [x + 56, top + 58], [x + 66, top + 82], [x + 68, 200], [x - 68, 200], [x - 66, top + 82], [x - 56, top + 58]], '#e9ece6');
    polyFill([[x - 68, top + 88], [x - 60, top + 88], [x - 60, 200], [x - 68, 200]], '#c9cdc8'); polyFill([[x + 60, top + 88], [x + 68, top + 88], [x + 68, 200], [x + 60, 200]], '#b9bdb8');
    dotLine(x - 54, top + 58, x - 26, top + 48, '#ffffff', 1); dotLine(x + 26, top + 48, x + 54, top + 58, '#ffffff', 1);
    polyFill([[x - 18, top + 48], [x + 18, top + 48], [x, top + 92]], '#4f8f8a'); polyFill([[x - 12, top + 50], [x + 12, top + 50], [x, top + 70]], '#5fa29c');
    polyFill([[x - 18, top + 48], [x - 28, top + 52], [x - 4, top + 124], [x, top + 92]], '#d5d9d3'); polyFill([[x + 18, top + 48], [x + 28, top + 52], [x + 4, top + 124], [x, top + 92]], '#d5d9d3');
    dotLine(x - 28, top + 52, x - 4, top + 124, '#b9bdb8', 1); dotLine(x + 28, top + 52, x + 4, top + 124, '#b9bdb8', 1);
    for (const y of [top + 104, top + 128]) { R(x - 2, y, 4, 4, '#9aa0a6'); R(x - 1, y, 2, 1, '#c9ced3'); }
    R(x - 52, top + 96, 22, 1, '#c9cdc8'); R(x + 30, top + 96, 22, 1, '#c9cdc8');
    // the stethoscope round his neck, the chest piece hanging
    for (const sd of [-1, 1]) { const pts = [[x + sd * 16, top + 44], [x + sd * 24, top + 64], [x + sd * 26, top + 82], [x + sd * 22, top + 92]]; for (let i = 0; i + 1 < pts.length; i++) limb(pts[i][0], pts[i][1], 3, pts[i + 1][0], pts[i + 1][1], 3, '#2b2e31'); }
    ellFill(x - 22, top + 98, 6, 6, '#9aa0a6'); ellFill(x - 22, top + 98, 4.5, 4.5, '#c9ccd2'); R(x - 25, top + 95, 3, 1, '#ffffff');
    // name tag and pens
    R(x + 28, top + 68, 22, 13, '#ffffff'); R(x + 28, top + 80, 22, 1, '#c9cdc8'); R(x + 30, top + 70, 6, 9, '#2f6f8a'); R(x + 38, top + 72, 10, 1, '#6a6a6a'); R(x + 38, top + 75, 8, 1, '#8a8a8a');
    R(x - 46, top + 74, 3, 16, '#2f6f8a'); R(x - 41, top + 74, 3, 14, '#d8463b'); R(x - 46, top + 74, 3, 2, '#c9ced3'); R(x - 41, top + 74, 3, 2, '#c9ced3');
    // the neck, the head
    polyFill([[x - 9, top + 32], [x + 9, top + 32], [x + 10, top + 48], [x - 10, top + 48]], skD); R(x - 9, top + 32, 18, 6, skDD);
    for (const sd of [-1, 1]) { ellFill(x + sd * 17, top + 22, 3.5, 6, skD); ellFill(x + sd * 16.5, top + 22, 2, 4.5, sk); }
    polyFill([[x - 15, top + 2], [x + 15, top + 2], [x + 17, top + 6], [x + 17, top + 26], [x + 14, top + 33], [x + 8, top + 38], [x - 8, top + 38], [x - 14, top + 33], [x - 17, top + 26], [x - 17, top + 6]], sk);
    polyFill([[x - 14, top + 33], [x - 8, top + 38], [x + 8, top + 38], [x + 14, top + 33], [x + 6, top + 35], [x - 6, top + 35]], skD); R(x - 17, top + 10, 1, 16, skD); R(x + 16, top + 10, 1, 16, skD);
    polyFill([[x - 18, top + 12], [x - 18, top + 2], [x - 14, top - 4], [x - 4, top - 7], [x + 8, top - 6], [x + 15, top - 2], [x + 18, top + 4], [x + 18, top + 12], [x + 16, top + 12], [x + 15, top + 5], [x + 2, top + 4], [x - 6, top + 6], [x - 15, top + 6], [x - 16, top + 12]], hair);
    dotLine(x - 6, top - 6, x - 6, top + 5, '#4a3e38', 1); dotLine(x - 3, top - 6, x + 12, top - 1, '#3a302c', 1);
    // brows, tired eyes behind the glasses, the bags under them, the nose, the mouth
    R(x - 12, top + 11, 8, 1, hair); R(x + 4, top + 11, 8, 1, hair);
    for (const ex of [x - 10, x + 6]) { if (blink) R(ex, top + 17, 5, 1, skDD); else { R(ex, top + 15, 5, 1, skDD); R(ex + 1, top + 16, 3, 2, INK); R(ex + 3, top + 16, 1, 1, '#f4f1ea'); } R(ex, top + 20, 5, 1, '#c49072'); }
    for (const gx of [x - 13, x + 3]) { R(gx, top + 13, 11, 1, '#2b2e31'); R(gx, top + 21, 11, 1, '#2b2e31'); R(gx, top + 13, 1, 9, '#2b2e31'); R(gx + 10, top + 13, 1, 9, '#2b2e31'); R(gx + 7, top + 14, 2, 1, '#e8f0f4'); }
    R(x - 2, top + 15, 4, 1, '#2b2e31'); R(x - 17, top + 15, 4, 1, '#2b2e31'); R(x + 13, top + 15, 4, 1, '#2b2e31');
    R(x, top + 19, 1, 6, skD); R(x - 2, top + 25, 4, 1, skD);
    if (talk) { R(x - 4, top + 29, 8, 3, '#3a1f1a'); R(x - 3, top + 31, 6, 1, '#8a4a40'); } else R(x - 4, top + 30, 8, 1, '#8a5a4a');
    for (let i = 0; i < 14; i++) R(x - 10 + rnd(i, 4) * 20, top + 30 + rnd(4, i) * 6, 1, 1, '#c99a78');
    light(x, top - 12, 80, '230,245,225', 0.2);
    vig(w, h, 0.45);
  });
  bars();
  blackout(W, H, t < 0.12 ? 1 - t / 0.12 : 0);
}
// 하은 in profile, close, facing him (right): the cap's crown and the brim's shadow over her eye, the ponytail out of the back,
// the ear, the line of the nose and lips and chin caught by the corridor light, the collar of the black top and the vest
function haeunCU(t) {
  shot(1, (w, h) => {
    dgrad(0, 0, w, h, ['#0b100e', '#141c19', '#18221e']);
    light(354, 60, 90, '220,240,215', 0.3); light(312, 90, 48, '220,240,215', 0.2);
    const n = t > 0.35 && t < 0.75 ? 2 : 0, P = arr => arr.map(([x, y]) => [x, y + n]);
    const sk = '#d9a27a', skD = '#b98260', skDD = '#9c6a4c', skL = '#ecc29a', hair = '#4a3328', hairL = '#6b4a3a', red = '#d8463b', redD = '#a83328', redL = '#ef6a55';
    // the black top and the vest at the bottom of frame
    polyFill([[96, 200], [112, 170], [140, 160], [170, 158], [190, 166], [226, 178], [244, 200]], '#1e1a1a');
    polyFill([[118, 200], [128, 176], [150, 168], [168, 166], [186, 174], [214, 186], [222, 200]], '#7ec8e3'); polyFill([[118, 200], [128, 176], [140, 171], [134, 200]], '#5aa6c4'); dotLine(168, 166, 214, 186, '#a8e0f2', 1);
    // the ponytail, out of the opening and down her back
    for (const [a, b, wa, wb] of [[[126, 80], [114, 110], 13, 12], [[114, 110], [110, 140], 12, 10], [[110, 140], [114, 166], 10, 6]]) { limb(a[0], a[1] + n, wa, b[0], b[1] + n, wb, hair); }
    dotLine(124, 84 + n, 112, 160 + n, hairL, 1); dotLine(128, 86 + n, 116, 150 + n, '#3a271e', 1);
    // the long slim neck and the face in profile: a straight small nose, fuller lips, a V-line jaw to a small chin
    const face = P([[150, 80], [186, 80], [189, 87], [188, 92], [185, 95], [186, 97], [191, 104], [197, 110], [198, 112], [195, 113], [192, 114], [192, 116], [195, 118.5], [192, 121], [195, 123.5], [193, 126], [190, 128], [191, 132], [189, 136], [184, 138.5], [176, 138], [169, 137], [169, 146], [173, 168], [146, 168], [145, 132], [150, 118], [148, 92]]);
    polyFill(face, sk);
    g.save(); clipPoly(face);
    polyFill(P([[189, 136], [184, 138.5], [169, 137], [169, 146], [173, 168], [146, 168], [145, 130], [158, 124], [176, 133]]), skD);
    polyFill(P([[154, 114], [170, 126], [182, 134], [158, 124]]), '#c99470');
    polyFill(P([[146, 76], [194, 76], [194, 86], [146, 90]]), '#7a5038'); polyFill(P([[146, 90], [194, 86], [194, 92], [146, 96]]), '#a06c50');
    g.restore();
    // the eye under the brim: the lid's line and lashes lifting at the corner, the iris, a catchlight; the fold above
    R(178, 95 + n, 7, 1, '#2a1810'); R(184, 94 + n, 2, 1, '#2a1810'); R(180, 96 + n, 3, 2, '#3a2418'); R(181, 96 + n, 1, 1, '#e8d4c4'); R(183, 96 + n, 1, 1, '#d4b49c'); R(179, 93 + n, 5, 1, '#8a5a42'); R(179, 98 + n, 4, 1, '#b07c5c');
    // the light along the nose's bridge and tip, the nostril, the lips, the chin
    dotLine(188, 97 + n, 196, 108 + n, skL, 1); R(196, 109 + n, 2, 2, skL); R(192, 113 + n, 2, 1, '#a8705a');
    polyFill(P([[192, 116], [195, 118.5], [191, 119.5], [189, 119]]), '#b8665e'); R(188, 120 + n, 6, 1, '#8e4a44'); polyFill(P([[189, 121], [194, 121], [195, 123.5], [192, 124.5], [189, 123]]), '#c97a72'); R(192, 122 + n, 2, 1, '#e0a098');
    R(190, 133 + n, 1, 2, skL);
    // hair under the cap at the back and a lock in front of the ear; the ear
    polyFill(P([[112, 76], [152, 76], [152, 86], [148, 90], [146, 118], [140, 124], [126, 114], [116, 96]]), hair); for (let k = 0; k < 4; k++) dotLine(120 + k * 7, 80 + n, 128 + k * 4, 116 + n, k % 2 ? hairL : '#3a271e', 1);
    ellFill(152, 101 + n, 5.5, 9, skD); ellFill(153, 101 + n, 3.5, 7, sk); R(151, 97 + n, 1, 8, skDD); R(154, 95 + n, 2, 1, skL);
    polyFill(P([[156, 80], [162, 80], [163, 96], [161, 112], [158, 122], [156, 112], [157, 96]]), hair); dotLine(159, 82 + n, 159, 116 + n, hairL, 1);
    // the cap: the crown with its seams and eyelet, the back opening and strap, the patch, the brim out over her face
    const crown = P([[108, 80], [109, 64], [118, 50], [136, 40], [158, 37], [176, 41], [188, 52], [194, 66], [195, 80]]); polyFill(crown, red);
    g.save(); clipPoly(crown); polyFill(P([[100, 30], [140, 30], [124, 82], [100, 82]]), '#b8382e'); polyFill(P([[150, 30], [170, 30], [150, 50], [138, 50]]), redL); g.restore();
    dotLine(156, 38 + n, 128, 80 + n, redD, 1); dotLine(158, 38 + n, 178, 80 + n, redD, 1); R(155, 36 + n, 5, 2, redD); R(146, 58 + n, 2, 2, redD);
    polyFill(P([[108, 80], [109, 70], [118, 68], [120, 80]]), '#2a1c16'); R(108, 73 + n, 13, 2, '#1e1a1a'); R(110, 73 + n, 2, 1, '#4a4a52');
    R(182, 56 + n, 6, 12, '#f4f1ea'); R(184, 59 + n, 3, 6, red);
    R(108, 78 + n, 88, 3, redD);
    polyFill(P([[186, 74], [214, 76], [232, 81], [233, 84], [214, 84], [190, 82]]), red); polyFill(P([[190, 82], [214, 84], [233, 84], [231, 87], [212, 88], [188, 85]]), '#5c2420');
    dotLine(188, 75 + n, 230, 81 + n, '#f08070', 1); R(231, 82 + n, 2, 3, redD); for (let x = 192; x < 228; x += 3) R(x, 79 + n + Math.round((x - 192) * 0.08), 1, 1, '#b8382e');
    vig(w, h, 0.55);
  });
  bars();
  blackout(W, H, t > 0.8 ? (t - 0.8) / 0.4 : 0);
}

// 8. 손 — straight down onto the blanket: her mother's thin hand with the clip on its finger; hers comes up from below and
//    covers it; the monitor's green pulses over both; the old thumb moves once, twice
// a hand palm down seen from above, in its own frame: the wrist at (0, 0), fingers toward +x, the thumb toward -y. The sleeve
// runs back from the wrist; tendons and knuckles on the back, creases at the finger joints, nails
function handBack(p, o = {}) {
  const { skin, shade, dark, nail, light: lt } = p;
  if (o.sleeve) { polyFill([[-90, -19], [2, -17], [4, 17], [-90, 19]], o.sleeve); R(-90, -19, 92, 2, o.sleeveL || mix(o.sleeve, '#ffffff', 0.2)); if (o.stripe) for (let x = -86; x < 0; x += 8) R(x, -17, 3, 34, o.stripe); R(-2, -18, 5, 36, mix(o.sleeve, '#000000', 0.25)); }
  const th = o.thumb || 0;
  // the thumb, from the base of the palm out and forward
  limb(10, -11, 11, 26 + th * 2, -24 - th * 4, 9, shade); limb(26 + th * 2, -24 - th * 4, 9, 38 + th * 4, -27 - th * 5, 7.5, shade);
  limb(10, -11, 11, 26 + th * 2, -24 - th * 4, 9, skin, 1, 1); limb(26 + th * 2, -24 - th * 4, 9, 38 + th * 4, -27 - th * 5, 7.5, skin, 1, 1);
  ellFill(37 + th * 4, -27 - th * 5, 3, 2.5, nail);
  // the back of the hand
  polyFill([[0, -14], [14, -16], [38, -15], [44, -10], [45, 11], [40, 15], [12, 15], [0, 13]], shade);
  polyFill([[1, -13], [14, -15], [37, -14], [42, -9], [43, 9], [38, 13], [12, 13], [1, 11]], skin);
  for (const [y0, y1] of [[-6, -9], [0, -3], [6, 3], [11, 9]]) dotLine(6, y0 * 0.6, 38, y1, lt, 2);
  // four fingers: index (top) to little (bottom), each with two joint creases and a nail
  const F = [[-10, 30], [-3.4, 33], [3.2, 31], [9.6, 25]];
  for (const [fy, L] of F) { limb(42, fy, 8.6, 42 + L, fy + fy * 0.08, 7.4, shade); limb(42, fy, 8.6, 42 + L, fy + fy * 0.08, 7.4, skin, 1, 0.8); blob(43, fy, 3, lt); }
  for (const [fy, L] of F) { for (const k of [0.4, 0.72]) { const x = 42 + L * k, y = fy + fy * 0.08 * k; R(x, y - 1, 1, 2, shade); } const tx = 42 + L - 3, ty = fy + fy * 0.08; polyFill([[tx - 4, ty - 2.5], [tx + 2, ty - 2.5], [tx + 3, ty], [tx + 2, ty + 2.5], [tx - 4, ty + 2.5]], nail); R(tx - 4, ty - 2.5, 1, 5, dark); }
  for (const [fy] of F) R(41, fy - 1, 3, 2, dark);
  if (o.veins) { dotLine(4, -4, 30, -7, o.veins, 2); dotLine(8, 5, 26, 2, o.veins, 2); dotLine(16, -6, 22, 4, o.veins, 3); }
  if (o.spots) for (const [x, y] of [[20, -8], [28, 6], [14, 3], [33, -2]]) R(x, y, 2, 1, o.spots);
}
function shotHands(u) {
  shot(1, (w, h) => {
    const beatP = (u % 1), pulse = Math.max(0, 1 - beatP * 3);
    // the blanket: a fine weave, two soft folds running across
    g.drawImage(layer('blanket1', w, h, () => { R(0, 0, w, h, '#a9bfd6'); for (let y = 0; y < h; y++) for (let x = y % 2; x < w; x += 2) if ((x + y) % 4 === 0) R(x, y, 1, 1, '#b4c9de'); for (let y = 0; y < h; y += 3) for (let x = 0; x < w; x++) if (rnd(x, y) < 0.05) R(x, y, 1, 1, '#9fb5cc');
      for (let k = 0; k < 2; k++) { const y0 = 46 + k * 92; for (let x = 0; x < w; x++) { const y = y0 + Math.round(Math.sin(x / 54 + k) * 9 + x * 0.12); R(x, y, 1, 6, '#93aac4'); R(x, y + 6, 1, 3, '#9fb5cc'); R(x, y - 2, 1, 2, '#c6d7e8'); } } }), 0, 0);
    const thumb = (u > 4.2 && u < 4.6) || (u > 5.4 && u < 5.8) ? 1 : 0;
    // the mother's hand: thin and pale, the hospital gown's sleeve, the IV tape on its back, the clip on her index finger
    const MOM = { skin: '#dcb393', shade: '#b98d6e', dark: '#9a7058', nail: '#ecd2bf', light: '#e6c2a6' };
    g.fillStyle = 'rgba(40,60,90,.16)'; g.beginPath(); g.ellipse(150, 120, 110, 26, -0.06, 0, Math.PI * 2); g.fill();
    rotated(-0.06, 0, 0, 66, 112, () => {
      handBack(MOM, { sleeve: '#cfdfee', stripe: '#bcd0e4', veins: '#a99ab8', spots: '#c49a80', thumb });
      R(16, -6, 18, 12, '#f4f1ea'); R(18, -4, 14, 8, '#e6e2d8'); R(22, -2, 6, 3, '#9fb8c8'); R(30, -8, 2, 6, '#dfe6ea');
      R(54, -13, 16, 9, '#d8dde0'); R(54, -13, 16, 3, '#3a3f45'); R(54, -6, 16, 2, '#9aa0a6'); R(70, -10, 4, 3, '#3a3f45');
    }, 1.5);
    for (let x = 177; x < w; x++) R(x, 102 - Math.round((x - 177) * 0.22), 1, 1, '#e3e7ea');
    light(162, 101, 10 + pulse * 5, '255,74,61', 0.3 + 0.25 * pulse);
    // her hand: up from the bottom of the frame, fingers up, onto her mother's; the black sleeve, the watch
    const p = ease(clamp((u - 1.0) / 1.8, 0, 1)), hx = 118, hy = Math.round(lerp(330, 176, p));
    const HER = { skin: '#e2b48c', shade: '#c0906a', dark: '#a3765a', nail: '#f2d6c4', light: '#ecc4a0' };
    g.fillStyle = 'rgba(40,60,90,.2)'; g.beginPath(); g.ellipse(hx + 8, hy - 30, 30, 80, 0, 0, Math.PI * 2); g.fill();
    rotated(-Math.PI / 2, 0, 0, hx, hy, () => {
      handBack(HER, { sleeve: '#1e1a1a', sleeveL: '#2c2829' });
      R(-14, -18, 12, 36, '#c9ccd2'); R(-12, -12, 8, 24, '#1b1716'); for (let k = 0; k < 3; k++) R(-9, -8 + k * 6, 2, 4, '#8fd694');
    }, 1.5);
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
  const cam = Math.round(lerp(0, 44, ease(clamp(u / 6.5, 0, 1))));
  let billAt = null;
  shot(1, (w, h) => {
    g.save(); g.translate(-cam, 0);
    // the wood: four planks with their seams, the grain running along them, a knot or two
    g.drawImage(layer('table1', 460, 216, () => {
      for (let p = 0; p < 4; p++) { const y0 = p * 56; R(0, y0, 460, 56, ['#a47c54', '#ab845a', '#9f774f', '#a8805a'][p]); R(0, y0, 460, 2, '#7a5a3a'); R(0, y0 + 2, 460, 1, '#b8916a');
        for (let k = 0; k < 11; k++) { const yy = y0 + 6 + k * 4.6; for (let x = 0; x < 460; x++) if (Math.sin(x / (24 + k * 5) + p * 2 + k) > 0.55) R(x, Math.round(yy + Math.sin(x / 40 + k) * 2), 1, 1, k % 3 ? '#94704a' : '#8a6642'); }
        const kx = 60 + p * 113 % 400, ky = y0 + 28; ellFill(kx, ky, 7, 4, '#7a5636'); ellFill(kx, ky, 4, 2, '#5e4028'); }
    }), 0, 0);
    const shadow = pts => { g.fillStyle = 'rgba(40,24,10,.28)'; g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x + 6, y + 6) : g.moveTo(x + 6, y + 6)); g.closePath(); g.fill(); };
    // the cap, crown up: six panels to the button, the patch, the brim with its stitching
    g.fillStyle = 'rgba(40,24,10,.28)'; g.beginPath(); g.ellipse(72, 82, 32, 34, 0, 0, Math.PI * 2); g.fill();
    polyFill([[40, 96], [104, 96], [100, 108], [88, 116], [56, 116], [44, 108]], '#1e1a1a'); polyFill([[42, 97], [102, 97], [98, 106], [87, 113], [57, 113], [46, 106]], '#b8382e'); for (let x = 48; x < 98; x += 3) R(x, 108 + Math.round(Math.abs(x - 72) * -0.1 + 2), 1, 1, '#8e2c25');
    ellFill(66, 74, 30, 27, '#a83328'); ellFill(66, 72, 27, 24, '#d8463b');
    for (const a of [0.52, 1.57, 2.62, 3.67, 4.71, 5.76]) dotLine(66, 72, 66 + Math.cos(a) * 26, 72 + Math.sin(a) * 23, '#b03a2e', 1);
    polyFill([[46, 60], [58, 52], [62, 60], [50, 68]], '#ef6a55'); ellFill(66, 72, 3, 3, '#a83328'); R(65, 71, 2, 1, '#ef6a55');
    R(56, 86, 20, 9, '#f4f1ea'); R(56, 94, 20, 1, '#c9c2b0'); R(60, 88, 12, 4, '#d8463b');
    // the bill
    shadow([[116, 36], [224, 36], [224, 116], [116, 116]]); R(116, 36, 108, 80, '#f4efe4'); R(116, 36, 108, 1, '#ffffff'); R(223, 36, 1, 80, '#d9d2c2'); R(116, 115, 108, 1, '#d9d2c2');
    R(124, 44, 12, 10, '#2f8a5a'); R(126, 46, 8, 2, '#e9f4ec'); R(124, 62, 92, 1, '#c9c2b0');
    for (let k = 0; k < 4; k++) R(124, 70 + k * 6, 60 - k * 8, 1, '#a8a294'); for (let k = 0; k < 3; k++) R(124, 92 + k * 6, 54 - k * 12, 1, '#a8a294');
    R(168, 92, 44, 1, '#d8463b'); R(168, 96, 36, 1, '#d8463b');
    billAt = [116 - cam, 36];
    // the watch she took off, its strap open: the holes, the buckle, the digital face with the time
    shadow([[252, 40], [276, 40], [276, 172], [252, 172]]);
    R(254, 40, 20, 132, '#1e1a1a'); R(254, 40, 1, 132, '#2c2829'); R(273, 40, 1, 132, '#121010'); for (let y = 48; y < 84; y += 7) { R(262, y, 4, 2, '#3a3236'); R(263, y, 2, 1, '#0c0a0a'); }
    R(250, 160, 28, 8, '#9aa0a6'); R(252, 161, 24, 6, '#1e1a1a'); R(250, 160, 28, 1, '#c9ced3'); R(262, 156, 3, 8, '#c9ced3');
    R(242, 88, 44, 34, '#c9ccd2'); R(242, 88, 44, 2, '#eef0f2'); R(242, 120, 44, 2, '#9aa0a6'); R(286, 96, 3, 6, '#9aa0a6');
    R(246, 92, 36, 26, '#0e130e'); digits('06:10', 249, 99, '#8fd694', 2); light(264, 105, 22, '143,214,148', 0.15);
    // the paper cup of green tea: the rim, the tea, the bag's string and tag, the steam
    g.fillStyle = 'rgba(40,24,10,.28)'; g.beginPath(); g.ellipse(352, 108, 28, 28, 0, 0, Math.PI * 2); g.fill();
    ellFill(346, 102, 26, 26, '#d9d4c6'); ellFill(346, 100, 25, 25, '#f7f4ec'); ellFill(346, 102, 21, 21, '#7f9a52'); ellFill(346, 102, 17, 17, '#9ab36a'); ellFill(340, 96, 6, 3, '#c9d89a');
    R(345, 101, 2, 2, '#f4f1ea'); for (let k = 0; k < 18; k++) R(347 + k, 103 + Math.round(k * 0.6), 1, 1, '#f4f1ea'); R(364, 112, 12, 10, '#e9d9a0'); R(364, 112, 12, 2, '#d8463b'); R(366, 116, 8, 1, '#c9b980');
    for (let k = 0; k < 3; k++) for (let s = 0; s < 40; s++) { const p = ((u * 0.3 + k * 0.33 + s * 0.007) % 1); g.save(); g.globalAlpha = 0.26 * Math.sin(Math.PI * p); R(342 + k * 4 + Math.round(Math.sin(p * 7 + k * 2) * 6), 92 - Math.round(p * 80), 1, 1, '#ffffff'); g.restore(); }
    // the light through the blinds, drifting
    g.save(); g.globalCompositeOperation = 'lighter'; for (let s = 0; s < 8; s++) { const x0 = -80 + s * 68 + u * 4; g.fillStyle = 'rgba(255,220,170,.12)'; g.beginPath(); g.moveTo(x0, 0); g.lineTo(x0 + 28, 0); g.lineTo(x0 + 128, h); g.lineTo(x0 + 100, h); g.closePath(); g.fill(); } g.restore();
    g.restore();
    vig(w, h, 0.4);
  });
  // the bill's text at screen resolution so it reads
  if (billAt) { text('입원비 납부 안내', billAt[0] + 22, billAt[1] + 8, '#1b1716', 9, 'left', true); text('2,140,000원', billAt[0] + 102, billAt[1] + 64, '#d8463b', 10, 'right', true); }
  bars();
  blackout(W, H, Math.max(u < 0.6 ? 1 - u / 0.6 : 0, u > 6.6 ? (u - 6.6) / 0.8 : 0));
  if (u > 7.2) text('— 스테이지 1 끝 —', W / 2, 102, `rgba(239,230,210,${clamp((u - 7.2) / 0.8, 0, 1)})`, 10, 'center');
  if (u >= 0.3) cue('table-bird', () => { [2900, 3300].forEach((f, i) => oscS('sine', f, now() + 0.8 + i * 0.14, 0.02, 0.1, f * 1.2)); });
}
