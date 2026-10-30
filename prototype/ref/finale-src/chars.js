const rnd = (i, k) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const lerp = (a, b, p) => a + (b - a) * p;
const C = {
  kraft:'#c48b52', kraftTop:'#d9a468', kraftDark:'#8f6236', tape:'#e6c88f', label:'#efe6d2', ink:'#1b1716',
  vest:'#f07a2a', reflect:'#ebe5c9', shirt:'#6b7073', cap:'#2c3b57', skin:'#d9a27a', skinDark:'#b98260', hair:'#9a948e',
  laser:'#ff4a3d', ok:'#8fd694', hoodie:'#2f4f58', vest2:'#cfe04a', hairDark:'#1e1a1a', crate:'#b48a5c', red:'#d8463b',
  belt:'#38302c', slat:'#2a2320', face:'#171312', metal:'#6a7075', sweat:'#9fd0ff', cyan:'#5ad7e8'
};

const R = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
const thick = (x1, y1, x2, y2, s, c) => {
  const d = Math.max(1, Math.hypot(x2 - x1, y2 - y1));
  for (let k = 0; k <= d; k++) { const p = k / d; R(lerp(x1, x2, p) - s / 2, lerp(y1, y2, p) - s / 2, s, s, c); }
};
const check = (x, y) => [[0,2],[1,3],[2,4],[3,3],[4,2],[5,1],[6,0]].forEach(([a, b]) => { R(x + a, y + b, 1, 2, C.ok); });
const bodyTop = (base, pose) => base + pose.dip + pose.bob + pose.nod;

function eighthNote(x, y, c) { R(x, y + 3, 2, 2, c); R(x + 1, y - 2, 1, 5, c); R(x + 2, y - 2, 2, 1, c); R(x + 3, y - 1, 1, 1, c); }
function zzz(x, y, nowMs) {
  for (let k = 0; k < 2; k++) {
    const p = ((nowMs / 1400) + k * 0.5) % 1;
    g.globalAlpha = Math.sin(Math.PI * p);
    const zx = x + p * 8 + k * 4, zy = y - p * 12;
    R(zx, zy, 3, 1, '#e9e4da'); R(zx + 1, zy + 1, 1, 1, '#e9e4da'); R(zx, zy + 2, 3, 1, '#e9e4da');
    g.globalAlpha = 1;
  }
}
// eye, brow, sweat and breath for a human partner. ex/ey is the eye's top-left; faces right.
function faceFx(cx, top, ex, ey, pose, nowMs, hairColor, active) {
  const r = FX.react[pose.lane], age = nowMs - r.at;
  if (pose.doze) { R(ex - 1, ey + 1, 4, 1, C.ink); zzz(cx + 10, top + 2, nowMs); }
  else if (pose.wince) { R(ex - 1, ey + 1, 4, 1, C.ink); R(cx - 9, top + 5, 2, 3, C.sweat); }
  else if (r.type === 'glance' && age < 700) { R(ex - 2, ey - 1, 5, 1, hairColor); R(ex - 1, ey + 1, 3, 1, C.ink); }
  else R(ex, ey, 2, 2, C.ink);
  if (r.type === 'relief' && age < 900) {
    const p = age / 900, x = cx + 9 + p * 10, y = top + 10 - p * 6;
    g.globalAlpha = 1 - p; R(x, y, 3, 2, '#e9e4da'); R(x + 2, y - 1, 3, 2, '#e9e4da'); R(x + 4, y, 2, 2, '#e9e4da'); g.globalAlpha = 1;
  }
  if (active && stats.combo >= 16 && !pose.doze) {
    for (let k = 0; k < 2; k++) {
      const p = ((nowMs / 1000) / (SPB * 2) + k * 0.5) % 1;
      g.globalAlpha = Math.sin(Math.PI * p); eighthNote(cx + 8 + p * 10, top - 6 - p * 16, '#ffe9a8'); g.globalAlpha = 1;
    }
  }
}

// each partner: draw(pose, nowMs, active) and arm(pose). Same 4-head silhouette as the first mockup, different build and props.
const PARTNERS = {
  boss: {
    base: 90,
    draw(pose, nowMs, active) {
      const cx = BOSS_X, top = bodyTop(90, pose);
      R(cx - 11, top + 20, 3, 18, C.shirt);
      R(cx - 9, top + 18, 18, 40, C.shirt);
      R(cx - 9, top + 18, 6, 40, C.vest); R(cx + 3, top + 18, 6, 40, C.vest);
      R(cx - 9, top + 34, 18, 2, C.reflect);
      R(cx - 2, top + 15, 5, 4, C.skinDark);
      R(cx - 6, top + 2, 12, 14, C.skin);
      R(cx - 6, top + 7, 2, 3, C.skinDark);
      R(cx - 6, top + 4, 3, 5, C.hair);
      R(cx - 7, top - 1, 14, 5, C.cap); R(cx + 3, top + 3, 9, 2, C.cap);
      faceFx(cx, top, cx + 3, top + 7, pose, nowMs, C.hair, active);
      R(cx + 1, top + 11, 6, 2, C.hair);
    },
    arm(pose) {
      const top = bodyTop(90, pose);
      if (pose.wave && !pose.carry) { thick(BOSS_X + 7, top + 22, BOSS_X + 10, top + 1, 4, C.shirt); R(BOSS_X + 8, top - 3, 5, 5, C.skin); return; }
      thick(BOSS_X + 7, top + 22, pose.hand.x, pose.hand.y, 4, C.shirt); R(pose.hand.x - 2, pose.hand.y - 2, 4, 4, C.skin);
    }
  },
  jiwoo: {
    base: 84,
    draw(pose, nowMs, active) {
      const cx = BOSS_X, top = bodyTop(84, pose) + (pose.bob ? 1 : 0) + (pose.doze ? 3 : 0), hood = '#6b2f3f', hoodD = '#4a2030';
      R(cx - 7, top + 18, 14, 46, hood);
      R(cx - 7, top + 20, 14, 20, C.vest2); R(cx - 7, top + 30, 14, 2, C.reflect);
      R(cx - 7, top + 40, 14, 2, hoodD);
      R(cx - 9, top - 2, 18, 20, hood); R(cx - 9, top - 2, 18, 2, hoodD);
      R(cx - 5, top + 3, 10, 12, C.skin);
      R(cx - 5, top + 3, 10, 2, C.hairDark);
      if (pose.vibe) {
        R(cx, top + 9, 3, 1, C.ink); R(cx + 1, top + 12, 2, 1, '#b2565a');
        for (let k = 0; k < 2; k++) { const p = ((nowMs / 1000) / (SPB * 2) + k * 0.5) % 1; g.globalAlpha = Math.sin(Math.PI * p); eighthNote(cx + 8 + p * 12, top - 4 - p * 16, '#f2a6c8'); g.globalAlpha = 1; }
      } else faceFx(cx, top, cx + 1, top + 8, pose, nowMs, C.hairDark, active);
      // earbuds: in both ears, or one out and dangling once 반장 makes her pull them
      if (pose.unplug) { R(cx + 5, top + 18, 2, 2, '#f4f1ea'); for (let k = 0; k < 8; k++) R(cx + 6 + (k % 2), top + 10 + k, 1, 1, '#f4f1ea'); }
      else { R(cx + 5, top + 8, 2, 2, '#f4f1ea'); for (let k = 0; k < 10; k++) R(cx + 6 + (k % 2), top + 10 + k, 1, 1, '#f4f1ea'); }
      R(cx - 8, top + 8, 2, 2, '#f4f1ea');
      if (!pose.doze && active && pose.bob) R(cx - 9, top + 6, 2, 1, hoodD);
    },
    arm(pose) {
      const top = bodyTop(84, pose);
      const free = pose.hype && !pose.carry && Math.abs(pose.hand.x - (BOSS_X + 13)) < 2 && Math.abs(pose.hand.y - 134) < 2;
      if (free) { const up = pose.bob < 0 ? -6 : 0; thick(BOSS_X + 5, top + 23, BOSS_X + 8, top + 4 + up, 4, '#6b2f3f'); R(BOSS_X + 6, top + 1 + up, 5, 5, C.skin); return; }
      thick(BOSS_X + 5, top + 23, pose.hand.x, pose.hand.y, 4, '#6b2f3f'); R(pose.hand.x - 2, pose.hand.y - 2, 4, 4, C.skin);
    }
  },
  haeun: {
    base: 86,
    draw(pose, nowMs, active) {
      const top = bodyTop(86, pose) + (pose.bob ? 1 : 0);
      drawHaeunAt(BOSS_X, top, nowMs, { mirror: true, watch: pose.phone, load: true, bob: 0 });
    },
    arm(pose) {
      const top = bodyTop(86, pose), shirt = '#1e1a1a', glove = '#2a2d31';
      if (pose.phone) return;
      if (pose.wave && !pose.carry) { thick(BOSS_X + 5, top + 23, BOSS_X + 9, top + 2, 4, shirt); R(BOSS_X + 7, top - 2, 5, 5, glove); return; }
      thick(BOSS_X + 5, top + 23, pose.hand.x, pose.hand.y, 4, shirt); R(pose.hand.x - 2, pose.hand.y - 2, 4, 4, glove);
      // the watch on the wrist
      R(lerp(BOSS_X + 5, pose.hand.x, 0.8) - 1, lerp(top + 23, pose.hand.y, 0.8) - 1, 3, 3, '#d8dde0');
    }
  },
  park: {
    base: 92,
    draw(pose, nowMs, active) {
      const cx = BOSS_X, top = bodyTop(92, pose), jacket = '#6e4a33', jacketD = '#4f3424';
      R(cx - 13, top + 18, 26, 38, jacket);
      R(cx - 13, top + 34, 28, 22, jacket);
      R(cx - 11, top + 20, 22, 22, C.vest2); R(cx - 11, top + 31, 22, 2, C.reflect);
      R(cx - 11, top + 42, 24, 2, jacketD);
      R(cx - 7, top + 14, 14, 4, '#e9e4da'); R(cx - 7, top + 17, 3, 6, '#e9e4da');
      R(cx - 6, top + 1, 12, 14, C.skin);
      R(cx - 7, top + 2, 3, 6, '#5a5550'); R(cx + 5, top + 2, 3, 6, '#5a5550'); R(cx - 2, top - 1, 1, 2, '#5a5550'); R(cx + 1, top - 1, 1, 2, '#5a5550');
      faceFx(cx, top, cx + 3, top + 7, pose, nowMs, '#5a5550', active);
      R(cx + 1, top + 6, 7, 1, '#2a2a2a'); R(cx + 1, top + 6, 1, 3, '#2a2a2a'); R(cx + 7, top + 6, 1, 3, '#2a2a2a');
    },
    arm(pose) {
      const top = bodyTop(92, pose), sx = BOSS_X + 9, sy = top + 22, mx = lerp(sx, pose.hand.x, 0.5), my = lerp(sy, pose.hand.y, 0.5);
      thick(sx, sy, mx, my, 5, '#6e4a33'); thick(mx, my, pose.hand.x, pose.hand.y, 4, C.skin); R(pose.hand.x - 2, pose.hand.y - 2, 4, 4, C.skin);
    }
  },
  sunja: {
    base: 100,
    draw(pose, nowMs, active) {
      const cx = BOSS_X, top = bodyTop(100, pose), perm = '#4a2e22', visor = '#6a3d8a', floral = '#8a4a6a';
      R(cx - 8, top + 17, 16, 32, floral);
      R(cx - 6, top + 30, 12, 20, '#e9dcc3');
      R(cx - 8, top + 19, 16, 14, C.vest2); R(cx - 8, top + 26, 16, 2, C.reflect);
      R(cx - 7, top, 14, 8, perm); R(cx - 9, top + 2, 2, 7, perm); R(cx + 7, top + 2, 2, 7, perm); R(cx - 8, top - 1, 4, 2, perm); R(cx + 3, top - 1, 4, 2, perm);
      R(cx - 6, top + 6, 12, 11, C.skin);
      R(cx - 7, top + 4, 14, 2, visor); R(cx - 1, top + 6, 15, 2, visor);
      faceFx(cx, top, cx + 3, top + 9, pose, nowMs, perm, active);
      R(cx + 1, top + 13, 5, 1, C.skinDark);
      if (pose.phone) { R(cx + 5, top + 6, 4, 7, '#1e1a1a'); R(cx + 6, top + 7, 2, 4, '#8fe3f0'); thick(cx - 7, top + 24, cx + 7, top + 13, 3, '#d87a9a'); R(cx + 5, top + 11, 4, 3, C.skin); }
    },
    arm(pose) {
      const top = bodyTop(100, pose), sx = BOSS_X + 6, sy = top + 21;
      thick(sx, sy, pose.hand.x, pose.hand.y, 4, '#d87a9a');
      const d = Math.max(1, Math.hypot(pose.hand.x - sx, pose.hand.y - sy));
      for (let k = 3; k < d; k += 5) { const p = k / d; R(lerp(sx, pose.hand.x, p) - 1, lerp(sy, pose.hand.y, p) - 1, 1, 1, '#f5d0dc'); }
      R(pose.hand.x - 2, pose.hand.y - 2, 4, 4, C.skin);
    }
  },
  chief: {
    base: 88,
    draw(pose, nowMs, active) {
      const cx = BOSS_X, top = bodyTop(88, pose), shirt = '#d8d4cc', vest = '#232f45', tie = '#8a2a2a', hair = '#141110';
      R(cx - 9, top + 18, 18, 42, shirt);
      R(cx - 9, top + 18, 6, 42, vest); R(cx + 3, top + 18, 6, 42, vest); R(cx - 9, top + 34, 18, 2, '#c9ced6');
      R(cx - 1, top + 18, 3, 15, tie); R(cx - 2, top + 18, 5, 2, tie);
      R(cx + 4, top + 22, 3, 6, '#1e1a1a'); R(cx + 5, top + 18, 1, 4, '#1e1a1a'); R(cx + 5, top + 23, 1, 1, '#d8463b');
      R(cx - 8, top + 24, 4, 3, '#efe6d2');
      R(cx - 2, top + 15, 5, 4, C.skinDark);
      R(cx - 6, top + 2, 12, 14, C.skin);
      R(cx - 7, top - 1, 14, 5, hair); R(cx - 7, top + 3, 3, 4, hair); R(cx + 2, top - 1, 6, 2, '#2a2422');
      faceFx(cx, top, cx + 3, top + 7, pose, nowMs, hair, active);
      R(cx + 1, top + 6, 6, 1, '#1b1716'); R(cx + 1, top + 6, 1, 3, '#1b1716'); R(cx + 6, top + 6, 1, 3, '#1b1716');
      R(cx + 2, top + 12, 4, 1, C.skinDark);
    },
    arm(pose) {
      const top = bodyTop(88, pose);
      thick(BOSS_X + 7, top + 22, pose.hand.x, pose.hand.y, 4, '#d8d4cc'); R(pose.hand.x - 2, pose.hand.y - 2, 4, 4, C.skin);
      R(pose.hand.x - 3, pose.hand.y - 7, 6, 6, '#c3c9cd'); R(pose.hand.x - 2, pose.hand.y - 6, 4, 4, '#efe6d2'); R(pose.hand.x, pose.hand.y - 9, 1, 2, '#c3c9cd');
    }
  },
};
function drawActor(id, x, mirrored, pose, nowMs, active, extra) {
  g.save();
  if (mirrored) { g.translate(x, 0); g.scale(-1, 1); g.translate(-BOSS_X, 0); } else g.translate(x - BOSS_X, 0);
  PARTNERS[id].draw(pose, nowMs, active);
  if (extra) extra(bodyTop(PARTNERS[id].base, pose));
  g.restore();
}
// after the shift the cast stays where the song left them (반장 on the line, 지우 behind the belt) through the outro and result
function drawHaeunAt(cx, top, nowMs, o = {}) {
  const kick = o.gun != null ? o.gun : 0, bob = o.bob ? 1 : 0;
  const hair = '#4a3328', hairL = '#6b4a3a', shirt = '#1e1a1a', shirtD = '#121010', cap = '#d8463b', capD = '#a83328', brim = '#1e1a1a', glove = '#2a2d31', sky = '#7ec8e3', leg = '#3a3f45', shoe = '#1e1a1a';
  g.save(); if (o.mirror) { g.translate(cx, 0); g.scale(-1, 1); g.translate(-cx, 0); }
  // legs: weight on the near leg, or a stride
  if (o.step != null) { const st = o.step ? 3 : -3; R(cx - 5 + st, top + 38, 5, 16, leg); R(cx + 2 - st, top + 38, 5, 15, leg); R(cx - 6 + st, top + 53, 6, 3, shoe); R(cx + 2 - st, top + 52, 6, 3, shoe); }
  else { R(cx - 5, top + 38, 5, 16, leg); R(cx + 2, top + 38, 5, 15, leg); R(cx - 6, top + 53, 6, 3, shoe); R(cx + 2, top + 52, 6, 3, shoe); }
  // ponytail out the back (to her right, since she faces left), swinging back when she fires or strides
  const sw = Math.round(kick * 3) + bob + (o.step != null ? 2 : 0);
  R(cx + 8 + sw, top + 1, 5, 6, hair); R(cx + 11 + sw, top + 5, 5, 9, hair); R(cx + 12 + sw, top + 12, 4, 7, hair); R(cx + 10 + sw, top + 17, 3, 4, hair);
  R(cx + 11 + sw, top + 6, 1, 7, hairL); R(cx + 12 + sw, top + 13, 1, 5, hairL);
  R(cx + 7, top + 1, 2, 2, '#f4d35e');   // the tie
  // body: black long sleeve, the sky-blue vest with its stripe
  R(cx - 7, top + 16, 14, 23, shirt); R(cx - 7, top + 18, 14, 13, sky); R(cx - 7, top + 25, 14, 2, C.reflect); R(cx - 7, top + 37, 14, 2, shirtD);
  // the face, the same 12x14 as everyone, hair only behind (a lock in front of the face read as an eye under the brim)
  R(cx - 6, top + 1, 12, 14, C.skin); R(cx + 5, top + 3, 2, 6, hair);
  // the snapback, 14 wide like 반장's cap, pulled down: front panel with a seam and a button, the patch, the brim out to the left
  R(cx - 7, top - 2, 14, 6, cap); R(cx - 6, top - 3, 12, 1, cap); R(cx - 7, top + 3, 14, 1, capD); R(cx - 2, top - 3, 1, 7, capD); R(cx - 1, top - 4, 2, 1, capD);
  R(cx - 6, top - 1, 5, 3, '#ffffff'); R(cx - 5, top, 3, 1, cap);
  R(cx - 16, top + 3, 10, 2, brim); R(cx - 16, top + 3, 10, 1, '#3a3236'); R(cx - 16, top + 5, 10, 1, '#0d0b0b');
  // under the brim: shadow instead of eyes; a scan lights two pinpoints in it for a moment
  R(cx - 6, top + 4, 12, 5, '#8a5e44'); R(cx - 6, top + 4, 12, 2, '#6b4631'); R(cx - 6, top + 8, 12, 1, '#b08366');
  if (kick > 0.4) { R(cx - 4, top + 6, 1, 1, '#f4f1ea'); R(cx + 1, top + 6, 1, 1, '#f4f1ea'); }
  R(cx - 3, top + 11, 2, 1, '#b2565a');
  // front arm: the gun on the upper gate (kicks back toward her when a scan fires there), the watch check, a swing while walking,
  // or nothing (the loading arm is drawn with the belt). The other hand stays in a pocket.
  if (o.watch) { thick(cx - 6, top + 22, cx - 2, top + 30, 4, shirt); R(cx - 4, top + 28, 4, 4, glove); R(cx - 3, top + 26, 3, 3, '#d8dde0'); R(cx - 2, top + 27, 1, 1, C.ink); }
  else if (o.gun != null) {
    const gx = 330 + kick * 3, gy = 84;
    thick(cx - 6, top + 22, gx + 6, gy + 3, 4, shirt);
    R(gx - 9, gy - 3, 12, 5, '#2d2f33'); R(gx - 1, gy + 2, 3, 6, '#2d2f33'); R(gx - 10, gy - 2, 2, 3, kick > 0.2 ? C.ok : C.laser); R(gx, gy + 2, 3, 3, glove);
  }
  else if (o.step != null) { const st = o.step ? 4 : -2; thick(cx - 6, top + 22, cx - 9 + st, top + 33, 4, shirt); R(cx - 11 + st, top + 32, 4, 3, glove); }
  thick(cx + 6, top + 22, cx + 8, top + 32, 4, shirt); R(cx + 6, top + 31, 4, 3, glove);
  g.restore();
}
// at the upper gate beside you, facing the belts the way you do, one level up: your left hand fires her gun in 1-4's first stretch
function drawHaeun(t, kick, nowMs, active) {
  const beat = active ? beatAt(t) : (state === 'outro' || state === 'result') ? END_BEAT : -1;
  const ph = beat - Math.floor(beat), watch = active && inRange(beat, L.phone) && DUO.mode === 'one';
  const bob = active && ph < 0.18 ? 1 : 0, top = 60 + bob + (kick > 0.5 ? 1 : 0);
  drawHaeunAt(HAEUN_X, top, nowMs, { gun: watch ? null : kick, watch });
}
// crossing from the gate to the upper belt's loading end, behind the far belt, in a hurry
function drawHaeunWalk(nowMs) {
  const p = lerp(DUO.p, ease(DUO.p), 0.5), x = Math.round(lerp(HAEUN_X, BOSS_X + LANE_DX[0], p)), top = Math.round(lerp(60, 50, p));
  drawHaeunAt(x, top, nowMs, { step: p < 1 ? Math.floor(nowMs / 150) % 2 : null });
}
const playerTop = (kick, nowMs) => 94 - (kick > 0.5 ? 1 : 0) + (nowMs - FX.playerNod < 160 ? 2 : 0);
function drawPlayer(kick, nowMs) {
  const fl = nowMs - FX.flinch, cx = PLAYER_X + (fl < 160 ? 1 : 0), top = playerTop(kick, nowMs);
  R(cx - 9, top + 18, 18, 36, C.hoodie);
  R(cx - 9, top + 20, 18, 22, C.vest2); R(cx - 9, top + 32, 18, 2, C.reflect);
  R(cx - 7, top + 14, 15, 5, '#264149');
  R(cx - 6, top + 1, 12, 14, C.skin);
  R(cx - 7, top - 1, 14, 5, C.hairDark); R(cx + 1, top + 1, 6, 10, C.hairDark);
  if (fl < 500) { R(cx - 4, top + 6, 2, 3, C.ink); R(cx - 5, top + 5, 3, 1, C.hairDark); R(cx + 6, top + 2 + Math.floor(fl / 120), 2, 3, C.sweat); }
  else R(cx - 4, top + 7, 2, 2, C.ink);
}
function drawGun(gx, gy, kick) {
  R(gx - 9, gy - 3, 12, 5, '#2d2f33'); R(gx - 1, gy + 2, 3, 6, '#2d2f33');
  R(gx - 10, gy - 2, 2, 3, kick > 0.2 ? C.ok : C.laser);
  R(gx, gy + 2, 3, 3, C.skin);
}
