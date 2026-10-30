// ---------- 1-5 연출 시안: 장면 그리기 (chars.js의 캐릭터 코드를 그대로 씀) ----------
const W = 384, H = 216;
let g = null;
const FX = { react: [{ type: '', at: -1e9 }, { type: '', at: -1e9 }, { type: '', at: -1e9 }], playerNod: -1e9, flinch: -1e9 };
const stats = { combo: 0 }, SPB = 0.6, BOSS_X = 46, PLAYER_X = 340, state = 'play';
const ease = p => p < 0 ? 0 : p > 1 ? 1 : p * p * (3 - 2 * p);
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
  const h = opts.h || 14, bg = opts.bg || '#f2ead6', ink = opts.ink || '#1b1716', shake = opts.shake || 0;
  g.save(); if (shake) g.translate(Math.round(Math.sin(x * 3) * shake), Math.round(Math.cos(y * 7) * shake));
  R(x, y, w, h, bg); R(x + 1, y + h, 3, 2, bg); R(x + 2, y + h + 2, 1, 1, bg);
  if (opts.loud) { R(x, y, w, 1, '#d8463b'); R(x, y + h - 1, w, 1, '#d8463b'); R(x, y, 1, h, '#d8463b'); R(x + w - 1, y, 1, h, '#d8463b'); }
  text(s, x + 3, y + 3, ink, opts.size || 7, 'left', !!opts.loud); g.restore();
}
function judge(s, x, y, c, size = 14, sub = '') { g.save(); g.shadowColor = '#000'; g.shadowOffsetY = 2; text(s, x, y, c, size, 'center', true); g.restore(); if (sub) text(sub, x, y + size + 2, '#efe6d2', 6, 'center'); }
function hud(clock, combo) { R(10, 8, 72, 11, 'rgba(0,0,0,.55)'); text(clock, 13, 10, '#efe6d2', 7); if (combo) { R(W - 46, 8, 36, 11, 'rgba(0,0,0,.55)'); text(combo, W - 28, 10, '#efe6d2', 7, 'center'); } }
function vignette(a) { const gr = g.createRadialGradient(W / 2, H / 2, 70, W / 2, H / 2, 240); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, `rgba(0,0,0,${a})`); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
function caption(a, b) { R(0, 176, W, 40, 'rgba(0,0,0,.6)'); text(a, 12, 184, '#efe6d2', 7); if (b) text(b, 12, 198, '#b8a998', 7); }

// ---------- 벨트와 소품 ----------
const BELT_Y = 146, SCAN_X = 300, SPEED = 60;
function beltAt(y, x0 = 48, dark = 1) {
  R(x0, y, W - x0, 4, C.belt); R(x0, y, W - x0, 1, '#4a403b'); for (let x = x0 + 4; x < W; x += 14) R(x, y + 1, 1, 3, C.slat); for (let x = x0 + 12; x < W; x += 48) { R(x - 1, y, 3, 4, '#a08a3c'); R(x - 1, y, 3, 1, '#c9ad4c'); }
  R(x0 - 2, y + 4, W - x0 + 2, 8, C.face); for (let x = x0 + 2; x < W; x += 14) R(x, y + 6, 8, 3, '#2b2422');
  if (dark < 1) { g.fillStyle = `rgba(8,6,10,${1 - dark})`; g.fillRect(x0 - 2, y, W, 12); }
}
function gate(x, y, h, on) { R(x - 11, y - h, 4, h, '#555a5f'); R(x - 11, y - h - 3, 24, 5, C.metal); R(x + 8, y - h, 4, h + 10, '#7b8288'); R(x, y - h + 5, 1, h - 5, on ? C.laser : '#5a2b27'); }
function boxS(x, bottom, w = 18, h = 14) { R(x - w / 2 + 1, bottom, w, 1, 'rgba(0,0,0,.45)'); R(x - w / 2, bottom - h, w, h, C.kraft); R(x - w / 2, bottom - h, w, 2, C.kraftTop); R(x + w / 2 - 2, bottom - h + 2, 2, h - 2, C.kraftDark); R(x - 1, bottom - h, 3, h, C.tape); R(x - w / 2 + 2, bottom - 6, 7, 4, C.label); }
function playerS() { drawPlayer(0, 0); thick(PLAYER_X - 6, 116, 326, 120, 4, C.hoodie); drawGun(324, 117, 0); }
function haeunBeside(o = {}) { drawHaeunAt(354, 60, 0, { load: true, ...o }); if (!o.watch) { thick(348, 82, 346, 94, 4, '#1e1a1a'); R(344, 93, 4, 3, '#2a2d31'); } }
const PLATE = { red: ['#d8463b', '1,500'], blue: ['#2f6f8a', '2,500'], gold: ['#d9a520', '4,000'], black: ['#2b2e31', '6,000'] };
function sushiPlate(x, y, col, kind = 0, sc = 1) {
  g.save(); g.translate(x, y); g.scale(sc, sc);
  R(-9, -2, 18, 2, '#efe6d2'); R(-10, -3, 20, 1, PLATE[col][0]); R(-8, -4, 16, 1, '#f7f1e2'); R(-6, -7, 12, 3, '#f7f1e2'); R(-5, -8, 10, 1, '#f7f1e2');
  const fish = ['#f08a5d', '#e04a3a', '#f3d5a0', '#c9c9c9'][kind]; R(-7, -10, 14, 3, fish); if (kind === 1) R(-7, -10, 14, 1, '#f7c0b0'); if (kind === 3) R(-6, -11, 12, 1, '#1e2a1a');
  g.restore();
}
function sojuGlass(x, y, sc = 1, fill = 0.7) { g.save(); g.translate(x, y); g.scale(sc, sc); R(-3, -8, 7, 8, 'rgba(230,240,245,.55)'); R(-3, -8, 7, 1, '#e9f3f6'); R(-3, -8, 1, 8, '#e9f3f6'); R(3, -8, 1, 8, '#e9f3f6'); R(-2, -Math.round(7 * fill), 5, Math.round(7 * fill), 'rgba(255,255,255,.6)'); g.restore(); }
const soju = (x, y) => { R(x, y - 14, 5, 14, '#bfe3d2'); R(x + 1, y - 18, 3, 5, '#bfe3d2'); R(x + 1, y - 19, 3, 1, '#2f6f4a'); R(x, y - 10, 5, 1, 'rgba(255,255,255,.35)'); };
function plateStack(x, base, n) { for (let k = 0; k < n; k++) { const c = ['red', 'blue', 'red', 'gold', 'red', 'blue'][k % 6]; R(x - 9, base - k * 3 - 2, 18, 2, '#efe6d2'); R(x - 10, base - k * 3 - 3, 20, 1, PLATE[c][0]); } }

// ---------- 도입: 벨트에서 ----------
function warehouse() {
  g.drawImage(bg, 0, 0);
  for (const x of [60, 180, 300]) { R(x + 4, 0, 1, 13, '#3a332c'); R(x + 41, 0, 1, 13, '#3a332c'); R(x - 2, 13, 50, 2, '#3a332c'); R(x, 15, 46, 3, '#fff3c8'); g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createLinearGradient(0, 18, 0, 150); gr.addColorStop(0, 'rgba(255,236,170,.14)'); gr.addColorStop(1, 'rgba(255,236,170,0)'); g.fillStyle = gr; g.beginPath(); g.moveTo(x, 19); g.lineTo(x + 46, 19); g.lineTo(x + 86, 150); g.lineTo(x - 40, 150); g.closePath(); g.fill(); g.restore(); }
}
function drawOpening(phase) {
  warehouse(); gate(SCAN_X, BELT_Y, 38, true);
  if (phase === 0) {
    actor('jiwoo', 46, { bob: -7, vibe: true, noArm: true }, false, top => { thick(BOSS_X + 5, top + 23, BOSS_X + 14, top + 2, 4, '#6b2f3f'); R(BOSS_X + 13, top - 2, 5, 5, C.skin); thick(BOSS_X - 7, top + 23, BOSS_X - 16, top + 4, 4, '#6b2f3f'); R(BOSS_X - 19, top, 5, 5, C.skin); });
    g.save(); g.translate(28, 150); g.rotate(-0.3); boxS(0, 0); g.restore();
    beltAt(BELT_Y); boxS(338, BELT_Y);
    bubble('붙었어요!!!!', 56, 44, 78, { loud: true, size: 10, h: 18, shake: 1 });
    for (let k = 0; k < 4; k++) text('♪', 70 + k * 14, 70 + (k % 2) * 8, k % 2 ? '#f2a6c8' : '#5ad7e8', 9);
    playerS(); haeunBeside(); bubble('…?', 320, 44, 18, { bg: '#d9d0bd' });
    judge('딱!', 300, 84, '#8fd694', 14); hud('3번 라인 · 04:10', '콤보 18');
  } else if (phase === 1) {
    actor('jiwoo', 46, { bob: -2, vibe: true, noArm: true }, false, top => { thick(BOSS_X + 5, top + 23, BOSS_X + 14, top + 2, 4, '#6b2f3f'); R(BOSS_X + 13, top - 2, 5, 5, C.skin); });
    g.save(); g.translate(28, 150); g.rotate(-0.3); boxS(0, 0); g.restore();
    beltAt(BELT_Y);
    actor('boss', 150, { bob: 1, noArm: true }, true, top => { R(BOSS_X + 2, top + 6, 5, 1, C.hair); R(BOSS_X + 1, top + 5, 2, 1, C.hair); R(BOSS_X - 8, top + 4, 2, 3, C.sweat); thick(BOSS_X + 7, top + 22, BOSS_X + 28, top + 14, 4, C.shirt); R(BOSS_X + 27, top + 11, 5, 5, C.skin); });
    bubble('…야! 벨트가 왜 비어!', 104, 64, 92, { loud: true, size: 8, h: 15 });
    bubble('반장님! 저 붙었어요! 반장님 기타 넣은 곡으로요!', 2, 28, 184, { size: 7 });
    playerS(); haeunBeside(); hud('3번 라인 · 04:11', '콤보 18');
    text('(벨트는 돌지만 상자가 안 온다. 롤러 소리만.)', 60, 190, 'rgba(239,230,210,.75)', 6);
  } else {
    actor('jiwoo', 46, { bob: -1, vibe: true, noArm: true }, false, top => { thick(BOSS_X + 5, top + 23, BOSS_X + 13, top + 30, 4, '#6b2f3f'); R(BOSS_X + 12, top + 29, 4, 4, C.skin); });
    beltAt(BELT_Y);
    actor('boss', 150, { nod: 1, noArm: true }, true, top => { R(BOSS_X - 9, top + 25, 18, 5, C.shirt); R(BOSS_X - 9, top + 26, 3, 3, C.skin); R(BOSS_X + 6, top + 26, 3, 3, C.skin); });
    bubble('…회식이다. 오늘. 다 와.', 92, 50, 96, { size: 8, h: 15 });
    playerS(); haeunBeside({ watch: true }); bubble('저도요? …밥은 공짜죠?', 270, 40, 90, { bg: '#d9d0bd' });
    hud('3번 라인 · 04:12', '');
    text('(상자는 끝까지 안 온다. 롤러만 돈다. 형광등 하나가 깜빡.)', 60, 190, 'rgba(239,230,210,.75)', 6);
  }
}

// ---------- 회전초밥집: 벨트 셋, 반장이 뿌린다 ----------
const LANES = [{ y: 110, k: 0.7 }, { y: 128, k: 0.85 }, { y: 146, k: 1 }];
const laneX = (x, k) => SCAN_X + k * (x - SCAN_X);
function sushiRoom() {
  R(0, 0, W, H, '#f0e6d2'); R(0, 0, W, 30, '#2a1d16'); R(0, 30, W, 2, '#8a5a34'); R(0, 80, W, 66, '#c9b48a'); R(0, 80, W, 2, '#8a5a34'); for (let x = 0; x < W; x += 20) R(x, 82, 1, 64, '#b9a47a');
  for (let k = 0; k < 4; k++) { const x = 70 + k * 84; R(x, 30, 1, 6, '#3a2a20'); R(x - 7, 36, 15, 10, '#f2d35a'); R(x - 7, 36, 15, 1, '#fff3c8'); R(x - 6, 46, 13, 1, '#b8762e'); text('寿', x - 3, 37, '#9a2f22', 6); }
  R(240, 40, 100, 36, '#f7f1e2'); R(240, 40, 100, 2, '#8a5a34'); text('접시 가격', 290, 43, '#1b1716', 6, 'center', true);
  Object.entries(PLATE).forEach(([k, [c, won]], i) => { R(246 + (i % 2) * 48, 53 + Math.floor(i / 2) * 11, 14, 2, c); R(246 + (i % 2) * 48, 51 + Math.floor(i / 2) * 11, 14, 1, '#efe6d2'); text(won, 263 + (i % 2) * 48, 49 + Math.floor(i / 2) * 11, '#1b1716', 6); });
  R(0, 158, W, 58, '#d9b98a'); R(0, 158, W, 3, '#8a5a34'); R(0, 176, W, 40, '#1a1210'); for (let x = 0; x < W; x += 36) R(x, 178, 1, 38, '#231a15');
  for (let x = 20; x < W; x += 24) R(x, 172, 2, 2, x % 48 === 20 ? '#ffe9a8' : '#b07a48');
}
function drawSushi(phase) {
  const drunk = phase === 2;
  sushiRoom();
  actor('jiwoo', 232, { hand: { x: 248, y: 104 }, wince: !drunk, bob: drunk ? -2 : 0, unplug: true, dip: -14 }, false, top => { if (drunk) sojuGlass(248, 102); });
  bubble(drunk ? '반장님 기타, 진짜 샘플로 썼어요!' : '회식인데 웬 회전초밥이에요…', 118, 58, drunk ? 118 : 112, { shake: drunk ? 1 : 0 });
  const items = drunk ? [[[150, 'g'], [250, 'g']], [[200, 'g']], [[120, 'g'], [296, 'g'], [346, 's']]] : [[[140, 'red', 0], [250, 'blue', 1]], [[190, 'gold', 2]], [[112, 'red', 0], [296, 'red', 1], [346, 'black', 3]]];
  LANES.forEach((L, i) => {
    const x0 = laneX(48, L.k); beltAt(L.y, Math.round(x0), 0.75 + i * 0.125);
    for (const [x, kind, f] of items[i]) { const sx = laneX(x, L.k); if (kind === 'g') sojuGlass(sx, L.y, L.k); else if (kind === 's') soju(sx, L.y); else sushiPlate(sx, L.y, kind, f, L.k); }
    gate(SCAN_X, L.y, i === 2 ? 38 : 16, true);
  });
  actor('boss', 46, { hand: { x: 78, y: 86 }, bob: drunk ? 1 : 0, noArm: true }, false, top => { thick(BOSS_X + 7, top + 22, BOSS_X + 30, top - 2, 4, C.shirt); R(BOSS_X + 29, top - 5, 5, 5, C.skin); });
  if (drunk) { sojuGlass(92, 74, 0.8); sojuGlass(104, 88, 0.9); sojuGlass(96, 112, 1); soju(20, 146); soju(28, 146); } else { sushiPlate(92, 76, 'red', 0, 0.8); sushiPlate(106, 92, 'blue', 1, 0.9); sushiPlate(98, 114, 'red', 2, 1); }
  for (let k = 0; k < 3; k++) { g.strokeStyle = 'rgba(255,233,168,.5)'; g.setLineDash([2, 3]); g.beginPath(); g.moveTo(80, 86); g.quadraticCurveTo(110, 60 + k * 18, laneX(150, LANES[k].k), LANES[k].y - 6); g.stroke(); g.setLineDash([]); }
  bubble(drunk ? '…다음 달까지만 나온다.' : '…고기는 비싸. 받아라.', 6, 50, 92);
  drawPlayer(0, 0); thick(PLAYER_X - 6, 116, 316, 136, 4, C.hoodie); R(314, 134, 4, 4, C.skin); R(313, 128, 1, 8, '#efe6d2'); R(315, 128, 1, 8, '#efe6d2');
  thick(PLAYER_X - 5, 114, 318, 104, 4, C.hoodie); R(316, 102, 4, 4, C.skin);
  if (drunk) { R(PLAYER_X + 6, 98, 2, 3, '#e07070'); R(PLAYER_X - 8, 98, 2, 3, '#e07070'); }
  haeunSharp(drunk);
  plateStack(326, 172, drunk ? 3 : 1);
  if (drunk) for (let k = 0; k < 3; k++) sojuGlass(296 + k * 8, 172, 0.9, 0);
  hud(drunk ? '회전초밥 · 00:30' : '회전초밥 · 23:40', drunk ? '콤보 24' : '콤보 6');
  judge(drunk ? '짠!!' : '쏙', 300, drunk ? 84 : 96, drunk ? '#ffe9a8' : '#8fd694', drunk ? 22 : 14, drunk ? '24 콤보' : '');
}
function haeunSharp(drunk) { haeunBeside({ watch: false }); thick(348, 82, 342, 70, 4, '#1e1a1a'); R(340, 68, 4, 4, '#2a2d31'); R(343, 64, 1, 6, '#efe6d2'); R(345, 64, 1, 6, '#efe6d2'); R(342, 62, 6, 2, '#f08a5d'); plateStack(362, 172, drunk ? 14 : 4); if (drunk) bubble('(우물우물)', 326, 44, 48, { bg: '#d9d0bd' }); }
function drunkFx(src, level, sharp) {
  const k = level;
  g.save(); g.translate(W / 2, H / 2); g.rotate(0.02 * k); g.translate(-W / 2, -H / 2); g.drawImage(src, 0, 0); g.restore();
  g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.28 * k; g.filter = 'blur(3px)'; g.drawImage(src, 0, 0); g.filter = 'none'; g.restore();
  g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = `rgba(255,140,60,${0.1 * k})`; g.fillRect(0, 0, W, H); g.restore();
  if (k >= 2) { g.save(); g.globalAlpha = 0.22; g.drawImage(src, 3, 1); g.restore(); }
  if (sharp) sharp();
  vignette(0.25 * k);
}

// ---------- 지하철 ----------
function subwayCar() {
  R(0, 0, W, H, '#d9dde3'); R(0, 0, W, 26, '#c3c8d0'); R(0, 26, W, 2, '#9aa0a8');
  R(40, 8, 300, 10, '#f2f4f6'); for (let k = 0; k < 9; k++) R(52 + k * 36, 11, 4, 4, k === 5 ? '#d8463b' : '#2f6f8a'); R(44, 12, 292, 2, '#2f6f8a');
  for (let k = 0; k < 3; k++) { const x = 30 + k * 120; R(x, 34, 100, 54, '#0a0c12'); R(x - 2, 32, 104, 2, '#8d939a'); R(x - 2, 88, 104, 2, '#8d939a'); for (let j = 0; j < 4; j++) R(x + 10 + j * 24 + k * 7, 50 + (j % 2) * 14, 14, 2, j % 2 ? '#ffd890' : '#8fb8e0'); }
  for (let k = 0; k < 7; k++) { const x = 40 + k * 50; R(x, 28, 1, 14, '#6a7075'); R(x - 4, 42, 9, 6, '#f2f4f6'); R(x - 3, 44, 7, 2, '#c3c8d0'); }
  R(0, 110, W, 36, '#2f5f8a'); R(0, 110, W, 3, '#3f7fb0'); for (let x = 0; x < W; x += 46) R(x, 112, 1, 34, '#244a6e'); R(0, 146, W, 70, '#8d939a'); R(0, 146, W, 2, '#6a7075'); R(0, 200, W, 3, '#f2d35a');
}
function drawSubway() {
  subwayCar();
  // 신입 slumped on the seat, asleep, cheeks red; 하은 up with her bag, a hand on the strap, about to step off
  // slumped on the seat: drawn lower, the seat front and floor hiding his legs
  g.save(); g.translate(0, 26); drawPlayer(0, 0); R(PLAYER_X + 6, 102, 2, 3, '#e07070'); R(PLAYER_X - 8, 102, 2, 3, '#e07070'); R(PLAYER_X - 4, 101, 3, 1, C.ink); g.restore();
  R(PLAYER_X - 26, 146, 52, 24, '#8d939a'); R(PLAYER_X - 26, 146, 52, 2, '#6a7075'); zzz(PLAYER_X + 12, 112, 420);
  drawHaeunAt(210, 70, 0, { load: true }); thick(204, 92, 208, 44, 4, '#1e1a1a'); R(206, 42, 4, 4, '#2a2d31');
  R(216, 104, 12, 14, '#3a3f45'); R(217, 100, 10, 5, '#2a2d31');
  bubble('…이제 내려요.', 150, 50, 62, { bg: '#d9d0bd' });
  bubble('zZ…', 352, 96, 24, { size: 6 });
  hud('첫차 · 05:12', '');
  caption('조작 없음. 하은이 일어서고 신입은 자고 있다. 문이 열리고, 하은만 내린다.', '창 너머로 자는 신입을 두고 열차가 떠난다. 여기서부터 하은의 길.');
}
// ---------- 걷기 컷씬: 역에서 병원까지 ----------
function drawWalk() {
  const sky = g.createLinearGradient(0, 0, 0, 150); sky.addColorStop(0, '#1a2440'); sky.addColorStop(0.6, '#3a4a70'); sky.addColorStop(1, '#c97a4a'); g.fillStyle = sky; g.fillRect(0, 0, W, 150);
  for (let k = 0; k < 14; k++) R((k * 53) % W, (k * 29) % 70, 1, 1, '#ffffff');
  for (const [x, w, h, c] of [[0, 60, 80, '#2a3350'], [70, 40, 60, '#303a58'], [120, 70, 96, '#2a3350'], [200, 50, 70, '#303a58'], [262, 60, 50, '#2a3350']]) { R(x, 150 - h, w, h, c); for (let y = 150 - h + 8; y < 142; y += 12) for (let xx = x + 6; xx < x + w - 6; xx += 12) if ((xx + y) % 5 === 0) R(xx, y, 4, 5, '#ffd890'); }
  R(300, 40, 84, 110, '#dfe6ea'); R(300, 40, 84, 3, '#b9c4c8'); for (let y = 52; y < 140; y += 14) for (let x = 308; x < 380; x += 14) R(x, y, 8, 9, (x + y) % 3 ? '#2f3a4a' : '#ffe9a8');
  R(336, 20, 12, 30, '#d8463b'); R(327, 29, 30, 12, '#d8463b'); text('○○대학병원', 342, 56, '#1b1716', 6, 'center', true);
  R(0, 150, W, 66, '#3a3a40'); R(0, 150, W, 2, '#6a6a70'); for (let x = 0; x < W; x += 28) R(x, 182, 16, 3, '#9a9a90');
  for (let x = 30; x < W; x += 110) { R(x, 96, 3, 54, '#2b2e31'); R(x - 6, 92, 15, 5, '#3a3d44'); g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createRadialGradient(x + 1, 98, 2, x + 1, 120, 50); gr.addColorStop(0, 'rgba(255,200,120,.3)'); gr.addColorStop(1, 'rgba(255,200,120,0)'); g.fillStyle = gr; g.fillRect(x - 50, 90, 100, 80); g.restore(); }
  drawHaeunAt(150, 94, 0, { step: 1, mirror: true }); R(140, 128, 12, 14, '#3a3f45');
  for (let k = 0; k < 5; k++) text('♪', 120 + k * 26, 60 + (k % 2) * 10 - k * 3, k % 2 ? 'rgba(242,166,200,.7)' : 'rgba(255,233,168,.7)', 8 + (k % 3));
  caption('리듬 없음, 컷씬. 역에서 나와 병원까지 걷는 동안 감미로운 노래가 시작된다(피아노와 현, 느린 템포).', '카메라가 하은을 따라 옆으로 흐르고(1-3 거리 걷기 재료), 가로등 아래를 지날 때마다 밝아졌다 어두워진다. 새벽이 밝아오기 시작.');
}
// ---------- 병원: 리듬닥터 오마주 ----------
function hospitalHall() {
  R(0, 0, W, H, '#e4ece6'); R(0, 0, W, 24, '#c9d6cc'); R(0, 150, W, 66, '#c9cfc9'); R(0, 150, W, 2, '#8a948c'); R(0, 100, W, 3, '#8fb0a0');
  for (let x = 0; x < W; x += 96) { R(x + 20, 40, 48, 110, '#b9c9bd'); R(x + 24, 44, 40, 106, '#dfe6ea'); R(x + 28, 50, 32, 22, '#9fb8c8'); R(x + 36, 36, 16, 6, '#8fd694'); }
  R(0, 4, W, 14, '#dfe6ea'); for (let x = 30; x < W; x += 140) R(x, 6, 36, 10, '#fff3c8');
}
function drawDoctor() {
  hospitalHall();
  const cx = 150, top = 90;
  R(cx - 5, top + 38, 5, 16, '#3a3f45'); R(cx + 2, top + 38, 5, 16, '#3a3f45'); R(cx - 6, top + 53, 6, 3, '#1e1a1a'); R(cx + 2, top + 53, 6, 3, '#1e1a1a');
  R(cx - 8, top + 16, 16, 24, '#f7f7f2'); R(cx - 3, top + 16, 6, 12, '#2b2e31'); R(cx - 8, top + 16, 2, 24, '#dfe6ea'); R(cx + 6, top + 16, 2, 24, '#dfe6ea');
  R(cx - 6, top + 1, 12, 14, C.skin); R(cx - 7, top - 1, 14, 5, '#3a2a20'); R(cx - 7, top + 3, 2, 5, '#3a2a20');
  R(cx - 5, top + 6, 4, 3, '#1b1716'); R(cx + 1, top + 6, 4, 3, '#1b1716'); R(cx - 1, top + 7, 2, 1, '#1b1716'); R(cx - 4, top + 7, 2, 1, '#9fd0ff'); R(cx + 2, top + 7, 2, 1, '#9fd0ff');
  for (let k = 0; k < 10; k++) R(cx - 6 + (k < 5 ? 0 : 12), top + 16 + (k % 5) * 3, 1, 2, '#2b2e31'); R(cx - 6, top + 30, 13, 3, '#2b2e31'); R(cx + 5, top + 33, 3, 3, '#6a7075');
  thick(cx + 6, top + 22, cx + 14, top + 34, 4, '#f7f7f2'); R(cx + 11, top + 28, 10, 13, '#c9b48a'); R(cx + 12, top + 30, 8, 1, '#1b1716'); R(cx + 12, top + 33, 6, 1, '#1b1716'); R(cx + 12, top + 36, 7, 1, '#1b1716');
  thick(cx - 6, top + 22, cx - 10, top + 36, 4, '#f7f7f2'); R(cx - 12, top + 35, 4, 4, C.skin);
  drawHaeunAt(250, 90, 0, { load: true }); thick(244, 112, 240, 124, 4, '#1e1a1a'); R(238, 123, 4, 3, '#2a2d31'); R(256, 124, 12, 14, '#3a3f45');
  bubble('어머님 리듬이 오늘 좀 흔들려요. 일곱 번째에 맞춰요.', 20, 50, 190, { size: 7 });
  bubble('…일곱.', 240, 58, 34, { bg: '#d9d0bd' });
  for (let k = 0; k < 7; k++) { const x = 100 + k * 22, on = k === 6; R(x - 6, 136, 12, 12, on ? '#8fd694' : '#dfe6ea'); R(x - 6, 136, 12, 1, on ? '#cfe04a' : '#b9c4c8'); text(String(k + 1), x, 138, on ? '#1b1716' : '#6a7075', 7, 'center', on); }
  caption('병원 입구에서 흰 가운의 의사가 기다린다(리듬닥터 오마주: 동그란 안경, 클립보드, 청진기).', '"일곱 번째에 맞춰요." 이 레벨의 마지막 조작 규칙을 한 줄로.');
}
// ---------- 병실: 어머니의 심장박동 ----------
function drawWard(dawn) {
  const wall = dawn ? '#dfe8dc' : '#b9c9bd', floor = dawn ? '#cfd4cf' : '#9aa89e';
  R(0, 0, W, H, wall); R(0, 150, W, 66, floor); R(0, 150, W, 2, '#7a8a7e'); R(0, 96, W, 2, dawn ? '#c9d6c8' : '#9fb0a3');
  R(290, 20, 80, 90, '#2b2b2b'); const sky = g.createLinearGradient(0, 24, 0, 106); if (dawn) { sky.addColorStop(0, '#9ec5e8'); sky.addColorStop(1, '#ffe2b0'); } else { sky.addColorStop(0, '#0e1a33'); sky.addColorStop(0.7, '#2a3858'); sky.addColorStop(1, '#c97a4a'); }
  g.fillStyle = sky; g.fillRect(294, 24, 72, 82); R(329, 24, 2, 82, '#2b2b2b'); R(294, 64, 72, 2, '#2b2b2b'); for (let k = 0; k < 5; k++) R(298 + k * 13, 86 + (k % 2) * 6, 8, 20, dawn ? '#8fb0c8' : '#1a2238');
  drawHaeunAt(130, 94, 0, { load: true, mirror: true });
  R(60, 118, 200, 36, '#e9eef0'); R(60, 118, 200, 3, '#c9d2d6'); R(56, 110, 8, 50, '#9aa0a6'); R(256, 110, 8, 50, '#9aa0a6');
  R(66, 122, 190, 28, dawn ? '#cfe0f0' : '#b9cde0'); for (let x = 70; x < 250; x += 18) R(x, 134, 12, 1, dawn ? '#b9cde0' : '#a0b4c8');
  R(76, 104, 28, 18, '#f5f1ea'); R(82, 108, 18, 14, '#d9b59a'); R(80, 106, 22, 4, '#8a8a8a'); R(84, 115, 12, 6, '#dfe6ea'); R(84, 115, 12, 1, '#b9c4c8'); R(100, 117, 10, 1, '#dfe6ea');
  R(240, 60, 2, 60, '#9aa0a6'); R(236, 118, 10, 2, '#9aa0a6'); R(236, 56, 10, 22, '#dfe6ea'); R(238, 58, 6, 14, '#bfe3d2'); R(241, 78, 1, 42, '#dfe6ea');
  R(140, 30, 110, 46, '#1b1716'); R(143, 33, 104, 40, '#06140c'); text(dawn ? '64' : '58', 244, 35, '#8fd694', 8, 'right'); text('SpO₂ 91', 147, 35, '#5ad7e8', 6);
  for (let x = 146; x < 244; x++) { const ph = (x - 146) % 14; const y = ph === 5 ? 50 : ph === 6 ? 60 : ph === 7 ? 55 : 58; const seventh = Math.floor((x - 146) / 14) === 6; R(x, y, 1, 1, seventh && ph >= 5 && ph <= 7 ? '#ffffff' : '#8fd694'); }
  if (!dawn) for (let k = 0; k < 7; k++) text(String(k + 1), 153 + k * 14, 64, k === 6 ? '#ffffff' : '#4a8a5a', 6, 'center', k === 6);
  R(238, 36, 1, 38, 'rgba(255,74,61,.6)');
  R(140, 76, 110, 4, '#2b2e31'); R(193, 80, 4, 30, '#2b2e31');
  thick(135, 117, 112, 126, 4, '#1e1a1a'); R(108, 124, 6, 4, '#d9b59a'); R(104, 123, 4, 6, '#d9b59a');
  R(16, 126, 34, 24, '#c9bfae'); R(16, 126, 34, 2, '#e0d8c8'); R(20, 118, 20, 9, '#f7f1e2'); R(23, 120, 14, 1, '#8a8a8a'); R(23, 123, 10, 1, '#8a8a8a'); text('납부', 24, 124, '#d8463b', 4); R(42, 122, 6, 4, '#d8dde0');
  if (!dawn) { R(0, 0, W, H, 'rgba(10,20,30,.28)'); g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createRadialGradient(195, 55, 4, 195, 55, 90); gr.addColorStop(0, 'rgba(143,214,148,.22)'); gr.addColorStop(1, 'rgba(143,214,148,0)'); g.fillStyle = gr; g.fillRect(90, 0, 220, 150); g.restore(); }
  else { g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createLinearGradient(366, 0, 200, 0); gr.addColorStop(0, 'rgba(255,226,176,.4)'); gr.addColorStop(1, 'rgba(255,226,176,0)'); g.fillStyle = gr; g.fillRect(160, 0, 220, 216); g.restore(); }
  if (!dawn) { bubble('…밥은 먹었니.', 22, 98, 56, { bg: '#f2ead6', size: 6 }); bubble('회식. 공짜.', 96, 76, 48, { bg: '#d9d0bd', size: 6 }); judge('7', 238, 20, '#ffffff', 12); }
  if (!dawn) caption('리듬닥터 오마주: 모니터가 벨트. 심장박동이 1·2·3·4·5·6·7, 일곱 번째 박에 누른다. 일곱 박이 한 상자.', '맞추면 심박이 고르게, 놓치면 한 마디 흔들린다(부정맥 모양, 소리도). 판정 글자는 숫자 7 하나.');
  else caption('엔딩: 창이 밝아오고 모니터는 어두워진다. 하은 시점에서 끝. 결과 화면 없이 타이틀로.', '마지막 소리: 모니터 삑 하나, 그리고 새 소리. 감미로운 노래가 다시 한 소절.');
}

// ---------- 시트 ----------
const SCENES = [
  { id: 'open1', title: '0-1. 벨트: 지우가 뛴다', sub: '평소처럼 지우의 상자를 받다가, 지우가 갑자기 점프하면서 소리를 지른다. 오디션에 붙었다.', draw: () => drawOpening(0),
    notes: ['레벨은 1-2 그루브로 시작(지우 곡, 116). 8마디쯤 받다가 상자 하나가 지우 손에서 바닥에 떨어지고, 지우가 뛴다. 외침 말풍선과 화면 흔들림.', '그 순간부터 벨트에 상자가 안 온다. 롤러 소리만 남고 음악은 끊긴다. 플레이어는 스캐너를 들고 서 있고, 판정은 아무것도 안 뜸.', '하은은 1-4 자리(신입 뒤 오른쪽 한 단 위)에 그대로.'] },
  { id: 'open2', title: '0-2. 반장이 뿔나서 온다', sub: '빈 벨트를 보고 반장이 오른쪽에서 걸어 들어온다. "벨트가 왜 비어!" 지우는 아직 뛰고 있다.', draw: () => drawOpening(1),
    notes: ['반장은 1-2처럼 화면 오른쪽 밖에서 걸어 들어와 지우 앞에 선다. 땀 한 방울, 눈썹.', '지우 "반장님! 저 붙었어요! 반장님 기타 넣은 곡으로요!" 반장이 멈춘다. 한 박 정적.', '조작 없음 구간이지만 플레이어는 계속 스캐너를 들고 있음: 손이 놀고 있다는 느낌 자체가 연출.'] },
  { id: 'open3', title: '0-3. "회식이다."', sub: '반장이 팔짱을 끼고 한참 있다가 "…회식이다. 오늘. 다 와." 신입 옆의 하은까지 합류.', draw: () => drawOpening(2),
    notes: ['반장의 뿔이 풀리는 걸 말이 아니라 자세로: 삿대질 → 팔짱 → 고개 한 번 끄덕.', '하은 "저도요? …밥은 공짜죠?" 반장 "공짜다." 하은이 시계를 보고 따라나선다(첫 번째 시계).', '벨트가 그 자리에서 초밥 벨트 셋으로 바뀜(매치 컷). 롤러 소리가 그대로 이어지고 첫 상자 자리에 첫 접시.'] },
  { id: 'sushi1', title: '1. 회전초밥집 1페이즈: 벨트 셋, 반장이 초밥을 뿌린다', sub: '세 벨트가 1-4처럼 원근으로 겹치고 게이트는 한 수직선 위. 반장이 싣는 자리에서 접시를 세 벨트에 던져 넣고, 닿는 쪽을 집는다("쏙").', draw: () => drawSushi(1),
    notes: ['버튼 하나(1-4 그대로). 세 벨트 중 닿아 있는 접시를 집고, 둘이나 셋이 같은 박에 닿으면 한 번에("양쪽!" → "세 개!").', '반장이 접시를 뿌리는 동작은 1-1부터의 "상자 올리기" 팔 그대로. 점선 궤적은 시안용이고 게임에서는 접시가 포물선으로 날아 벨트에 "탁" 하고 앉는다.', '접시 색이 상자 종류: 빨강 보통, 파랑 늦은 접시, 금색 두 손(큰 접시), 검정 긴 화물(장어 한 줄).', '지우는 먼 벨트 뒤에서 "회식인데 웬 회전초밥이에요…" 반장 "…고기는 비싸. 받아라." 하은은 신입 옆(1-4 자리)에서 말없이 먹고, 접시가 쌓이기 시작한다.'] },
  { id: 'sushi2', title: '2. 회전초밥집 2페이즈: 소주잔을 뿌린다', sub: '접시 대신 소주잔이 세 벨트를 타고 온다. 잔이 닿으면 "짠". 취기가 오르고, 하은만 선명하다.', draw: () => { const off = document.createElement('canvas'); off.width = W; off.height = H; const g0 = g; g = off.getContext('2d'); drawSushi(2); g = g0; drunkFx(off, 2, () => haeunSharp(true)); },
    notes: ['2페이즈 전환: 반장이 접시 대신 소주잔을 집어 던지기 시작한다. 첫 잔이 벨트에 앉는 순간 음악이 바뀌고, 잔이 닿을 때마다 "짠"과 함께 취기 한 칸.', '취기는 시간으로 올라가고 되돌아가지 않는다: 1단계 색 온도, 2단계 블룸과 느린 기울기(±1.5도), 3단계 잔상과 말풍선 겹침·흔들림. 신입 볼이 붉어진다.', '하은만 블룸과 잔상에서 뺀다: 화면이 흐려질수록 하은 혼자 또렷하고, 소주잔은 안 받고 접시만 계속 쌓인다(열네 장). 그녀의 말풍선은 끝까지 작고 흔들리지 않는다.', '하은이 시계를 볼 때마다 소리가 반 박 가라앉는다. 반장 "…다음 달까지만 나온다." 지우 "반장님 기타, 진짜 샘플로 썼어요!"', '끝: 화면이 완전히 뭉개지면서 암전. 다음 컷이 지하철.'] },
  { id: 'subway', title: '3. 새벽 첫 지하철: "…이제 내려요."', sub: '취한 신입이 하은 옆자리에서 잔다. 하은이 일어서서 "이제 내려요" 하고 혼자 내린다. 조작 없음.', draw: drawSubway,
    notes: ['노래방은 뺌. 초밥집 암전에서 바로 지하철. 신입은 하은 옆에 기대 자고 있고(볼 붉음, zZ), 하은은 가방을 들고 일어선다.', '"…이제 내려요." 신입은 못 듣는다. 문이 열리고 하은만 내린다. 창 너머로 자는 신입을 두고 열차가 떠나면서 시점이 완전히 하은에게.', '다음 역 표시는 아직 병원이라고 보여주지 않는다(노선도의 빨간 점만).'] },
  { id: 'walk', title: '4. 걷기 컷씬: 역에서 병원까지, 노래가 시작된다', sub: '리듬 없음. 하은이 새벽 거리를 걷는 동안 매우 감미로운 노래가 시작된다. 길 끝에 병원.', draw: drawWalk,
    notes: ['이 레벨에서 처음 나오는 "들려주기만 하는" 음악. 피아노와 현, 느린 템포, 가사 없음(1-3 지우 곡의 선율을 느리게 변주하면 전체가 한 곡으로 묶임).', '카메라가 하은을 따라 옆으로 흐르고(1-3 거리 걷기 재료 재활용), 가로등 아래를 지날 때마다 밝아졌다 어두워진다. 하늘이 밝아오기 시작.', '병원 간판이 보이는 순간까지 어디로 가는지 말하지 않는다. 건물의 빨간 십자가가 먼저 보이고, 이름은 가까이 가서야.', '길이: 노래 한 절(30초 안팎). 플레이어는 보기만 한다. 건너뛰기 없음.'] },
  { id: 'doctor', title: '5. 병원: 리듬닥터 오마주', sub: '입구에서 흰 가운의 의사가 기다린다. "어머님 리듬이 오늘 좀 흔들려요. 일곱 번째에 맞춰요."', draw: drawDoctor,
    notes: ['리듬닥터의 주인공 풍 의사: 동그란 안경, 흰 가운, 클립보드, 청진기. 우리 그림체(4등신, 무외곽선)로 다시 그림. 이름은 부르지 않는다.', '"일곱 번째에 맞춰요"가 다음 장면의 조작 규칙 전부. 공중에 1~7 카운트가 떠서 일곱 번째만 켜진다.', '하은은 단골처럼 고개만 끄덕인다. "…일곱."', '복도에서 간병인과 교대(짧게, 대사 없음). 하은이 시계를 본다(두 번째 시계).'] },
  { id: 'ward', title: '6. 병실: 어머니의 심장박동으로 리듬', sub: '모니터가 벨트. 심장박동 1·2·3·4·5·6·7, 일곱 번째 박에 누른다. 맞추면 심박이 고르게, 놓치면 한 마디 흔들린다.', draw: () => drawWard(false),
    notes: ['리듬닥터 오마주의 핵심: 박 하나가 상자 하나가 아니라 일곱 박이 한 상자. 심전도 스파이크가 왼쪽에서 오른쪽으로 흐르고 일곱 번째가 게이트에 닿을 때 누른다. 템포는 어머니 심박(58 → 맞출수록 64로 고르게).', '놓치면 심전도가 한 마디 부정맥 모양으로 흔들리고 모니터가 한 번 삑삑거린다. 반장 곁눈질 같은 건 없다. 판정 글자는 숫자 7 하나.', '대사 둘뿐: 어머니 "…밥은 먹었니." 하은 "회식. 공짜." 손을 잡는다. 탁자 위 납부서, 벗어 둔 시계(세 번째 시계).', '여기서 돈을 악착같이 모으는 이유가 설명된다. 말로 하지 않는다.', '길이: 16마디 안팎(일곱 박 묶음 × 9~10번). 짧고 조용하게. 효과는 전부 끔, 1-1 정전 구간처럼 소리로만.'] },
  { id: 'end', title: '7. 엔딩', sub: '창이 밝아오고 모니터는 어두워진다. 하은 시점에서 끝. 결과 화면 없이 타이틀로.', draw: () => drawWard(true),
    notes: ['마지막 상자 = 마지막 일곱 번째 삑. 그 뒤 4마디는 상자 없이 창만 밝아지고, 걷기 컷씬의 노래가 한 소절 돌아온다.', '신입 시점으로 돌아오지 않는다. 지하철에서 자던 신입이 어디서 깼는지는 보여주지 않는다(스테이지 2 첫 장면 후보).', '정할 것: 초밥집 두 페이즈의 길이(각 16마디?), 2페이즈 음악, 병실 리듬의 길이, 반장 송별 고백을 초밥집에서 할지.'] }
];
function render() {
  const rows = document.getElementById('rows');
  for (const sc of SCENES) {
    const card = document.createElement('div'); card.className = 'card';
    card.innerHTML = `<h2>${sc.title}</h2><small>${sc.sub}</small><canvas width="${W}" height="${H}"></canvas><ul>${sc.notes.map(n => `<li>${n}</li>`).join('')}</ul>`;
    rows.append(card);
    g = card.querySelector('canvas').getContext('2d'); g.imageSmoothingEnabled = false;
    sc.draw();
  }
}
