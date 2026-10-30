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
  if (u < 2.8) return ledInsert(u);
  trainTwoShot(u - 2.8);
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
    if (u < 1.2) lit(a, Math.round((cols - a.w) / 2));
    else { const p = ease(clamp((u - 1.2) / 0.9, 0, 1)); lit(b, Math.round(lerp(cols, (cols - b.w) / 2, p))); }
    light(192, y0 + 46, 150, '255,138,61', 0.16);
    // a glint crossing the glass
    g.save(); g.globalAlpha = 0.07; for (let k = 0; k < 26; k++) R(250 + k * 3, y0 + 84 - k * 3, 10, 2, '#ffffff'); g.restore();
    R(178, y0 + 92, 28, 22, '#202227'); R(178, y0 + 92, 28, 1, '#4c5058');
    vig(w, h, 0.5);
  });
  bars();
  if (u >= 0.1) cue('w-chime', SND.chime);
  rollerOn(true, 0.07); clacks('w-led', u * 150, 68, 0.8);
  subtitle(u, 1.4, 2.7, '다음 역은 ○○대학병원입니다.', 'sign');
  blackout(W, H, u < 0.4 ? 1 - u / 0.4 : 0);
}
// the train's position along the tunnel: cruising, then braking into the station
const trainS = t => t < 3.2 ? 150 * t : 480 + 150 * (Math.min(t - 3.2, 2.8) - Math.min(t - 3.2, 2.8) ** 2 / 5.6);
const trainV = t => t < 3.2 ? 150 : Math.max(0, 150 * (1 - (t - 3.2) / 2.8));
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
    if (turned) { R(cx - 9, top - 1, 2, 9, '#4a3328'); R(cx - 9, top + 3, 1, 5, '#6b4a3a'); }
    R(cx - 7, top + 4, 1, 4, '#4a3328'); R(cx + 6, top + 4, 1, 3, '#4a3328');
    R(cx - 5, top - 6, 10, 1, redD); R(cx - 7, top - 5, 14, 7, red); R(cx - 7, top - 5, 1, 7, redD); R(cx + 6, top - 5, 1, 7, redD); R(cx - 4, top - 5, 3, 1, '#ef6a55');
    R(cx - 3 + d, top - 4, 6, 4, '#f4f1ea'); R(cx - 2 + d, top - 3, 4, 2, red); R(cx - 2 + d, top - 3, 4, 1, '#f4f1ea');
    R(cx - 8 + d, top + 2, 16, 1, '#3a3236'); R(cx - 8 + d, top + 3, 16, 1, '#1e1a1a');
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
function arm(sx, sy, hx, hy, c, skin, bendSide = 1) {
  const L1 = 8, L2 = 8, dx = hx - sx, dy = hy - sy, d = Math.min(L1 + L2 - 0.01, Math.hypot(dx, dy)), a = Math.atan2(dy, dx), k = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1));
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
    R(cx - 8, 21, 2, top - 20, '#c9b089'); R(cx - 9, 18, 3, 4, '#d9a27a'); R(cx - 9, 17, 3, 1, '#b98260');
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
function trainTwoShot(t) {
  const S = trainS(t), v = trainV(t), arrived = clamp((t - 4.6) / 1.4, 0, 1);
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
    const px = wx0 + (690 - S);
    if (px < wx1) { R(px, wy0, wx1 - px, wy1 - wy0, '#d7dfdb'); for (let y = wy0; y < wy1; y += 4) R(px, y, wx1 - px, 1, '#c6cfcb'); for (let x = px; x < wx1; x += 6) R(x, wy0, 1, wy1 - wy0, '#c6cfcb'); R(px, 34, wx1 - px, 3, '#2f6f8a'); R(px + 30, 25, 40, 8, '#1e2a33'); R(px + 32, 27, 36, 4, '#2f3a4a'); R(px + 34, 28, 20, 2, '#e9eef0'); light(px + 50, 24, 50, '240,250,255', 0.35); }
    g.restore();
    g.save(); g.globalAlpha = 0.16; for (let k = 0; k < 3; k++) R(wx0 + 6 + k * 38, wy0 + 1, 20, 1, '#ffffff'); for (let k = 0; k < 8; k++) R(wx0 + 74 + k, wy1 - 1 - k * 3, 6, 1, '#ffffff'); g.restore();
    // the door to the right
    R(128, 18, 52, 78, '#b9c0c7'); R(130, 20, 23, 76, '#d3d8dd'); R(155, 20, 23, 76, '#d3d8dd'); R(153, 20, 2, 76, '#2b2e33'); for (const x of [134, 159]) { R(x, 26, 15, 26, '#2b2e33'); R(x + 1, 27, 13, 24, px < x + 14 ? '#cfd8d4' : '#0a0c10'); }
    R(128, 18, 52, 1, '#8a9097'); R(130, 70, 48, 2, '#f2d35a');
    if (t > 6.2) { const o = ease(clamp((t - 6.2) / 0.6, 0, 1)) * 22; g.save(); g.beginPath(); g.rect(130, 20, 48, 76); g.clip(); R(130, 20, 48, 76, '#c9d2ce'); R(130, 60, 48, 36, '#a9b4b0'); R(130, 68, 48, 3, '#f2d35a'); light(154, 50, 40, '255,255,255', 0.3); R(130 - o, 20, 23, 76, '#d3d8dd'); R(155 + o, 20, 23, 76, '#d3d8dd'); R(153 - o, 20, 1, 76, '#2b2e33'); R(155 + o, 20, 1, 76, '#2b2e33'); g.restore(); }
    // the bench: moquette back, cushion, the steel skirt, the floor
    R(0, 46, 124, 24, '#2f5f8a'); dfill(0, 47, 124, 22, '#3a6d9a', 0.32); dfill(0, 62, 124, 8, '#284f74', 0.5); R(0, 46, 124, 2, '#4a82b4');
    for (const x of [29, 51, 73, 95]) R(x, 48, 1, 22, '#284f74');
    R(0, 70, 124, 3, '#3f7fb0'); R(0, 70, 124, 1, '#5b97c6'); R(0, 73, 124, 4, '#244766'); R(0, 77, 124, 4, '#8e979f'); R(0, 77, 124, 1, '#b5bdc4'); R(0, 80, 124, 1, '#6f777e');
    R(0, 81, w, 15, '#6b7279'); dfill(0, 81, w, 15, '#7a8188', 0.3); R(0, 81, w, 1, '#5a6066'); dfill(0, 88, w, 8, '#5f666d', 0.4);
    // the straps, swinging forward as the train brakes
    R(0, 10, w, 2, '#9aa1a8'); const sw = Math.round((v < 150 && v > 0 ? 2 : 0) + Math.sin(t * 3) * (v > 0 ? 1 : 0.4));
    for (const x of [12, 36, 56, 84, 108]) { R(x, 12, 1, 5, '#e3e7ea'); R(x - 2 + sw, 17, 5, 1, '#eef1f3'); R(x - 2 + sw, 17, 1, 4, '#eef1f3'); R(x + 2 + sw, 17, 1, 4, '#eef1f3'); R(x - 2 + sw, 20, 5, 1, '#c9ced3'); }
    R(122, 10, 3, 86, '#b8bec4'); R(123, 10, 1, 86, '#eef1f3'); R(124, 10, 1, 86, '#7a8086');
    // the other passengers on the bench
    PASS.salaryman(t); PASS.student(t);
    // 신입, asleep: on her shoulder, then moved over against the pole
    const SX = 108, SEAT = 70, move = ease(clamp((t - 3.1) / 1.2, 0, 1)), ang = lerp(-0.62, 0.62, move);
    const [headX, headY] = sinipAsleep(SX, SEAT, ang, t);
    // 하은: looks at him, takes his head in her hand and moves it over to the pole, stands, goes to the door
    const HX = 86, stood = t > 5.2;
    if (!stood) {
      const hTop = sitF(HX, SEAT, { w: 16, top: '#1e1a1a', pants: '#3a3f45', dress: (x, y) => { R(x - 6, y + 1, 12, 15, '#7ec8e3'); R(x - 6, y + 8, 12, 2, '#ebe5c9'); R(x - 1, y + 1, 2, 15, '#5aa6c4'); R(x - 2, y - 1, 4, 2, '#1e1a1a'); } });
      const turned = t > 1.8 && t < 4.9;
      faceF(HX, hTop - 14, { eyes: 'hidden', skin: '#d9a27a' }); HAIR.cap(HX, hTop - 14, turned);
      bagAt(64, 84);
      const reach = t < 2.6 ? 0 : t < 3.1 ? ease((t - 2.6) / 0.5) : t < 4.3 ? 1 : t < 4.7 ? 1 - ease((t - 4.3) / 0.4) : 0;
      if (reach > 0) {
        // her hand goes to the left side of his head and stays with it while it turns
        const side = ang - Math.PI / 2, tx = headX + Math.cos(side) * 6 - 1, ty = headY + Math.sin(side) * 6 + 1, rx = HX + 4, ry = SEAT - 3;
        arm(HX + 7, hTop + 2, lerp(rx, tx, reach), lerp(ry, ty, reach), '#1e1a1a', '#d9a27a', 1);
      }
    } else {
      const p = clamp((t - 5.4) / 1.5, 0, 1), x = Math.round(lerp(88, 150, ease(p)));
      haeunWalkSide(x, 95, t, { mirror: true, stand: p <= 0 || p >= 1 });
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

// 2. 문 — from the platform, through the screen doors: she steps out, turns back; two layers of glass close on him; the train
//    pulls out in a strobe of its windows; then flat and wide, the empty platform, the hanging clock, her second watch
function shotDoor(u) {
  if (u < 7.4) doorClose(u); else platformWide(u - 7.4);
}
function trainSide(x0, inside) {   // the car as seen from the platform, its left end at x0 (buffer coords)
  R(x0, 16, 260, 70, '#e3e7eb'); R(x0, 16, 260, 2, '#c9ced3'); R(x0, 58, 260, 4, '#2f6f8a'); R(x0, 62, 260, 1, '#7fb4c8'); R(x0, 80, 260, 6, '#5a6065');
  for (const wx of [8, 160, 210]) { R(x0 + wx, 24, 40, 26, '#2b2e33'); R(x0 + wx + 1, 25, 38, 24, '#e8eef0'); R(x0 + wx + 1, 37, 38, 12, '#3f7fb0'); R(x0 + wx + 1, 37, 38, 1, '#5b97c6'); for (let k = 0; k < 3; k++) R(x0 + wx + 6 + k * 12, 25, 1, 4, '#c9ced3'); }
  inside(x0);
}
function doorClose(u) {
  const open = clamp((u - 0.5) / 0.8, 0, 1) * (1 - clamp((u - 4.4) / 0.9, 0, 1)), dep = Math.max(0, u - 5.9), tx = -Math.round(dep * dep * 46);
  shot(2, (w, h) => {
    // behind the train: the far wall across the tracks, with the station's name and a clock (seen once it leaves)
    R(0, 0, w, h, '#1d2328'); R(0, 22, w, 50, '#d5ddd9'); for (let x = 0; x < w; x += 6) R(x, 22, 1, 50, '#c4ccc8'); for (let y = 22; y < 72; y += 5) R(0, y, w, 1, '#c4ccc8');
    R(46, 32, 70, 16, '#1e2a33'); R(48, 34, 66, 12, '#2f3a4a'); R(48, 46, 66, 1, '#8fd694'); R(52, 37, 3, 6, '#e9eef0'); R(57, 37, 3, 6, '#e9eef0'); for (let k = 0; k < 4; k++) R(64 + k * 10, 36, 7, 8, '#e9eef0');
    R(132, 34, 26, 12, '#141414'); R(133, 35, 24, 10, '#06140c'); digits('05:14', 135, 37, '#8fd694');
    R(0, 72, w, 12, '#2a2622');
    // the train: body, livery, the door, what is inside; she is inside it until she steps out
    trainSide(tx - 34, x0 => {
      // the same passengers, through the windows
      g.save(); g.beginPath(); g.rect(x0 + 9, 25, 38, 24); g.rect(x0 + 161, 25, 38, 24); g.rect(x0 + 211, 25, 38, 24); g.clip();
      for (const [px, f, hair, top] of [[x0 + 19, 'salary', '#3a3e48', 42], [x0 + 38, 'student', '#9a9488', 42], [x0 + 178, 'long', '#c9b089', 38], [x0 + 228, 'buzz', '#2a3a6a', 36]]) { R(px - 8, top, 16, 14, top === 42 ? hair : hair); faceF(px, top - 14, { eyes: f === 'long' ? 'open' : 'closed', look: f === 'long' || f === 'student' ? 'down' : '' }); HAIR[f](px, top - 14); }
      R(x0 + 172, 38, 6, 6, '#1b1716'); R(x0 + 173, 39, 4, 4, '#9fd8ec');
      g.restore();
      const dx = x0 + 104;   // the train door, 44 wide
      R(dx, 20, 44, 66, '#2b2e33'); R(dx + 1, 21, 42, 64, '#f2efe6'); R(dx + 1, 21, 42, 30, '#e8eef0'); R(dx + 1, 51, 42, 18, '#3f7fb0'); R(dx + 1, 51, 42, 1, '#5b97c6'); R(dx + 1, 69, 42, 16, '#8a9198');
      R(dx + 36, 21, 2, 64, '#b8bec4'); R(dx + 36, 21, 1, 64, '#eef1f3');
      // 신입 against the pole inside, asleep
      sinipAsleep(dx + 22, 63, 0.62, u);
      light(dx + 22, 40, 40, '255,240,210', 0.25);
      const dw = Math.round(21 * (1 - open)); R(dx + 1, 21, dw, 64, '#d3d8dd'); R(dx + 43 - dw, 21, dw, 64, '#d3d8dd');
      if (dw > 6) { R(dx + 4, 27, dw - 6, 24, '#2b2e33'); R(dx + 5, 28, dw - 8, 22, '#cfe0e8'); R(dx + 43 - dw + 2, 27, dw - 6, 24, '#2b2e33'); R(dx + 43 - dw + 3, 28, dw - 8, 22, '#cfe0e8'); }
      if (dw > 0) { R(dx + dw, 21, 1, 64, '#2b2e33'); R(dx + 43 - dw, 21, 1, 64, '#2b2e33'); }
      if (dw > 12) { g.save(); g.beginPath(); g.rect(dx + 5, 28, dw - 8, 22); g.rect(dx + 43 - dw + 3, 28, dw - 8, 22); g.clip(); sinipAsleep(dx + 22, 63, 0.62, u); shade(dx, 21, 44, 64, '207,224,232', 0.35); g.restore(); }
    });
    // the windows streak past as it leaves; their light strobes across the platform
    if (dep > 0) { const sp = dep * 92; for (let k = 0; k < 6; k++) { const x = ((k * 70 - sp * 1.6) % 420 + 420) % 420 - 60; g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = `rgba(255,236,190,${Math.min(0.16, dep * 0.12)})`; g.fillRect(x, 84, 40, 12); g.restore(); } }
    // the platform screen doors: header, frames, glass that reflects, the sliding panels
    R(0, 12, w, 9, '#2a2f36'); R(0, 20, w, 1, '#4a525c'); R(88, 14, 22, 5, '#111'); digits('4-2', 91, 14, '#ff8a3d'); R(140, 14, 30, 5, '#111'); R(142, 15, 26, 3, '#2f6f4a');
    const pw = Math.round(22 * (1 - open));
    for (const [x0, x1] of [[0, 74], [126, w]]) { R(x0, 21, x1 - x0, 63, 'rgba(180,205,215,0.18)'); }
    const post = x => { R(x, 21, 4, 63, '#9aa3ab'); R(x, 21, 1, 63, '#d5dade'); R(x + 3, 21, 1, 63, '#6f777e'); };
    for (const x of [0, 30, 74, 122, 160]) post(x);
    R(78, 21, pw, 63, 'rgba(190,215,225,0.22)'); R(122 - pw, 21, pw, 63, 'rgba(190,215,225,0.22)'); if (pw > 0) { R(78 + pw - 1, 21, 1, 63, '#9aa3ab'); R(122 - pw, 21, 1, 63, '#9aa3ab'); R(78, 21, pw, 1, '#c9d0d4'); R(122 - pw, 21, pw, 1, '#c9d0d4'); }
    g.save(); g.globalAlpha = 0.12; for (let k = 0; k < 18; k++) R(34 + k * 2, 80 - k * 3, 6, 1, '#ffffff'); for (let k = 0; k < 18; k++) R(164 + k, 80 - k * 3, 6, 1, '#ffffff'); g.restore();
    R(34, 40, 26, 30, '#f2a6c8'); R(36, 42, 22, 26, '#fff3c8'); R(38, 45, 12, 2, '#1b1716'); R(38, 50, 18, 1, '#1b1716'); R(38, 53, 10, 1, '#1b1716'); R(40, 58, 14, 8, '#d8463b');
    // the platform floor: granite, the yellow tactile strip
    R(0, 84, w, 12, '#aab3b1'); dfill(0, 84, w, 12, '#bcc5c3', 0.3); R(0, 84, w, 3, '#e8c34a'); for (let x = 1; x < w; x += 3) R(x, 85, 1, 1, '#c9a63a');
    // 하은: out of the door, a few steps right, she turns back to look
    if (u > 1.2) {
      const p = clamp((u - 1.3) / 1.8, 0, 1), x = Math.round(lerp(126, 152, ease(p))), feet = Math.round(lerp(86, 95, clamp(p * 2.5, 0, 1)));
      if (u > 1.3 && p < 1) haeunWalkSide(x, feet, u, { mirror: true, pace: 0.22 });
      else haeunWalkSide(x, 95, u, { stand: true, mirror: u < 3.5 });
    }
    light(100, 50, 70, '255,240,210', 0.12 * (1 - clamp(dep, 0, 1)));
    vig(w, h, 0.4);
  });
  bars();
  if (u >= 0.5) cue('d-open', () => { SND.chime(); SND.door(); }); if (u >= 4.4) cue('d-close', () => { SND.door(); noiseS(now() + 0.6, 'lowpass', 300, 0.12, 0.08); });
  if (u >= 5.9) { cue('d-go', () => rollerOn(true, 0.08)); clacks('d-go', dep * dep * 46, 40); } else rollerOn(true, 0.015);
  blackout(W, H, u < 0.3 ? 1 - u / 0.3 : 0);
}
function platformWide(t) {
  shot(1, (w, h) => {
    // flat and symmetrical: the screen-door wall across, the clock hanging, the ceiling's lamp rows, her alone at the right third
    R(0, 0, w, h, '#1a1e22'); R(0, 24, w, 30, '#2a2f36'); for (let x = 12; x < w; x += 48) { R(x, 30, 32, 4, '#eef6f2'); light(x + 16, 34, 30, '240,250,245', 0.18); }
    R(0, 54, w, 4, '#3a4048'); R(0, 58, w, 104, '#141a20');
    // the tunnel beyond the glass: the far wall, the station name, the red tail lights far off in the dark
    R(0, 66, w, 70, '#cfd8d4'); for (let x = 0; x < w; x += 8) R(x, 66, 1, 70, '#c0c9c5'); for (let y = 66; y < 136; y += 6) R(0, y, w, 1, '#c0c9c5'); R(0, 116, w, 4, '#2f6f8a');
    for (const sx of [60, 260]) { R(sx, 82, 70, 18, '#1e2a33'); R(sx + 2, 84, 66, 14, '#2f3a4a'); R(sx + 2, 97, 66, 1, '#8fd694'); hospName(sx + 8, 84, '#e9eef0', 9); }
    R(0, 136, w, 26, '#262220');
    // screen doors: posts every 64, glass, a faint reflection of the platform lights
    for (let x = 0; x < w; x += 64) { R(x, 58, 5, 104, '#8e979f'); R(x, 58, 1, 104, '#c9d0d4'); R(x + 30, 60, 4, 6, '#111'); }
    shade(0, 58, w, 104, '190,215,225', 0.1); g.save(); g.globalAlpha = 0.08; for (let x = 12; x < w; x += 48) R(x, 140, 32, 2, '#ffffff'); g.restore();
    // platform floor and its edge strip
    R(0, 162, w, 30, '#9ea7a5'); dfill(0, 162, w, 30, '#b0b9b7', 0.25); R(0, 162, w, 4, '#e8c34a'); for (let x = 1; x < w; x += 3) R(x, 163, 1, 2, '#c9a63a');
    for (let x = 12; x < w; x += 48) shade(x, 166, 32, 26, '240,250,245', 0.05);
    // the hanging clock
    R(110, 24, 2, 26, '#5a6066'); R(130, 24, 2, 26, '#5a6066'); R(94, 48, 54, 22, '#141414'); R(96, 50, 50, 18, '#06140c'); digits('05:14', 99, 53, '#8fd694', 2); light(121, 59, 40, '143,214,148', 0.18);
    // her: stands, the bag, looks at the watch
    haeunWalkSide(262, 190, t, { stand: true, watch: t > 0.8 });
    g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.ellipse(262, 191, 12, 2, 0, 0, Math.PI * 2); g.fill();
    vig(w, h, 0.45);
  });
  bars();
  rollerOn(true, Math.max(0, 0.06 - t * 0.03));
  blackout(W, H, Math.max(t < 0.15 ? 1 - t / 0.15 : 0, t > 2.0 ? (t - 2.0) / 0.6 : 0));
}

// 3. 계단 — a steadicam behind her up the exit stairs: the treads roll under the camera, the opening of sky grows, she steps out
function shotStairs(u) {
  const climb = Math.min(u, 4.4) * 2.3, done = Math.max(0, u - 4.4);
  shot(2, (w, h) => {
    const VX = 96, VY = 22, Y = z => VY + 74 / (1 + 0.32 * z), X = (z, side) => VX + side * 84 / (1 + 0.32 * z), CY = z => VY - 60 / (1 + 0.32 * z);
    const ztop = 12.5 - climb;
    // the sky through the opening
    dgrad(0, 0, w, h, ['#3a4f86', '#6f7fae', '#c99aa6', '#f2c49a']);
    for (let k = 0; k < 3; k++) { const bx = 70 + k * 18 + u * 6, by = 18 + (k % 2) * 4 - u * 2, f = Math.floor(u * 7 + k) % 2; R(bx, by, 2, 1, '#2a2a38'); R(bx + 2, by - f, 2, 1, '#2a2a38'); R(bx - 2, by - f, 2, 1, '#2a2a38'); }
    for (const [x, ww, hh] of [[20, 26, 18], [52, 18, 26], [120, 30, 16], [156, 22, 24]]) { R(x, Y(ztop) - hh, ww, hh, '#3a3f5e'); for (let j = 3; j < hh - 2; j += 4) for (let i = 2; i < ww - 2; i += 4) if (rnd(x + i, j) < 0.3) R(x + i, Y(ztop) - hh + j, 1, 1, '#ffd890'); }
    // the stairwell up to the opening: ceiling, two tiled walls, the treads
    g.fillStyle = '#16171f'; g.beginPath(); g.moveTo(0, 0); g.lineTo(w, 0); g.lineTo(X(ztop, 1), CY(ztop)); g.lineTo(X(ztop, -1), CY(ztop)); g.closePath(); g.fill();
    for (const s of [-1, 1]) { g.fillStyle = '#23252f'; g.beginPath(); g.moveTo(s < 0 ? 0 : w, 0); g.lineTo(X(ztop, s), CY(ztop)); g.lineTo(X(ztop, s), Y(ztop)); g.lineTo(s < 0 ? 0 : w, h + 40); g.closePath(); g.fill(); }
    for (let k = 0; k < 40; k++) { const z = k * 0.5 - (climb % 0.5); if (z > ztop) break; for (const s of [-1, 1]) { const x = X(z, s), y0 = CY(z), y1 = Y(z); if (z >= 0) R(Math.round(x) - (s > 0 ? 0 : 0), y0, 1, y1 - y0, '#2c2f3a'); } }
    const treads = [];
    for (let k = -2; k < 30; k++) { const z = k - (climb % 1), zk = z; if (zk > ztop) break; if (zk < -1.2) continue; treads.push(zk); }
    for (const z of treads.reverse()) {
      const ya = Y(z + 1), yb = Y(z), xl = X(z, -1), xr = X(z, 1), mid = ya + (yb - ya) * 0.42;
      R(xl, ya, xr - xl, mid - ya + 1, '#33343f'); R(xl, mid, xr - xl, yb - mid + 1, '#545663'); R(xl, mid, xr - xl, 1, '#8a8c98');
      dfill(xl, mid + 1, xr - xl, yb - mid, '#4b4d59', 0.3);
    }
    // handrails
    for (const s of [-1, 1]) { g.strokeStyle = '#8a8f98'; g.lineWidth = 1; g.beginPath(); for (let z = -1; z <= ztop; z += 0.25) { const x = X(z, s) - s * 5 / (1 + 0.32 * z), y = Y(z) - 30 / (1 + 0.32 * z); z === -1 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke(); }
    // the exit sign on the left wall
    R(10, 13, 26, 13, '#111'); R(11, 14, 24, 11, '#2f8a5a'); R(16, 16, 1, 7, '#fff'); R(15, 17, 3, 1, '#fff'); R(14, 18, 1, 1, '#fff'); R(18, 18, 1, 1, '#fff');
    g.fillStyle = '#f2d35a'; g.beginPath(); g.arc(28, 19.5, 4.5, 0, Math.PI * 2); g.fill(); digits('3', 27, 17, '#1b1716'); light(22, 19, 18, '120,220,160', 0.2);
    // light pouring down from the street
    light(VX, Y(ztop) - 4, 110, '255,214,170', 0.35 + done * 0.1);
    g.save(); g.globalCompositeOperation = 'lighter'; for (let k = 0; k < 4; k++) { g.fillStyle = `rgba(255,220,180,${0.05 + 0.02 * Math.sin(u * 2 + k)})`; g.beginPath(); g.moveTo(X(ztop, -1) + 10 + k * 18, Y(ztop)); g.lineTo(X(ztop, -1) + 18 + k * 18, Y(ztop)); g.lineTo(30 + k * 46 + 30, h); g.lineTo(10 + k * 46, h); g.closePath(); g.fill(); } g.restore();
    // her, from behind, one step per tread; at the top she walks on into the light
    const ph = (climb % 1), up = done * 26, sil = 0.35 + 0.4 * clamp(done / 1.2, 0, 1);
    const bob = ph < 0.5 ? 0 : -1, lift = Math.sin(ph * Math.PI);
    haeunBack(86, 36 + bob - Math.round(up), Math.floor(climb) % 2 ? lift : 0, Math.floor(climb) % 2 ? 0 : lift, { tint: ['#20222e', sil] });
    R(89, 35 + bob - Math.round(up), 14, 1, '#ffd8a0'); R(88, 51 + bob - Math.round(up), 2, 1, '#ffc890'); R(104, 51 + bob - Math.round(up), 2, 1, '#ffc890');
    vig(w, h, 0.35);
  });
  bars();
  if (u > 0.4) cue('birds', () => { [2600, 3100, 2800, 3300].forEach((f, i) => oscS('sine', f, now() + 0.6 + i * 0.15, 0.03, 0.12, f * 1.2)); });
  for (let k = 0; k < 12; k++) if (u * 2.3 >= k + 0.5 && u < 4.4) cue('sstep' + k, () => noiseS(now(), 'lowpass', 700, 0.06, 0.07));
  blackout(W, H, fadeIO(u, 6, 0.5, 0.5));
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
