// 지우's "A" artwork as it was in the game (commit ac981e3), kept for the video cutscenes. The game went back to the original
// simple dots (2026-11-03), so nothing loads this file: it is the drawing code lifted out of prototype/index.html as it stood,
// and it leans on the game's helpers (R, thick, C, BOSS_X, FX, faceFx's callers, drawActor) and on shared/character-rig.js.
// To see it running, check out ac981e3 and open prototype/index.html.

// ---- the eye style it used (from faceFx) ----
function faceFx(cx, top, ex, ey, pose, nowMs, hairColor, active, eyeStyle = null) {
  const r = FX.react[pose.lane], age = nowMs - r.at;
  if (eyeStyle === 'jiwoo-a') {
    // A's connected upper lid and vertical pupil stay recognizable in reactions.
    const x = ex - (r.type === 'glance' && age < 700 ? 1 : 0);
    if (pose.doze || pose.wince) R(x, ey + 1, 2, 1, '#2d1d21');
    else { R(x, ey, 2, 1, '#2d1d21'); R(x + 1, ey + 1, 1, 1, '#2d1d21'); }
    if (pose.doze) zzz(cx + 10, top + 2, nowMs);
    if (pose.wince) R(cx - 9, top + 5, 2, 3, C.sweat);
  }
  else if (pose.doze) { R(ex - 1, ey + 1, 4, 1, C.ink); zzz(cx + 10, top + 2, nowMs); }
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
function drawJiwooPhone(hand) {
  R(hand.x - 1, hand.y - 6, 4, 7, '#1e1a1a'); R(hand.x, hand.y - 5, 2, 4, '#8fe3f0');
}
// A reference head, traced on its native pixel grid. Eyes, mouth and earbud
// remain separate so expressions and the unplug action share this silhouette.

// ---- the head, the cloth colours, the work-rig profile and the partner drawing ----
const JIWOO_A_HEAD = [
  '.....HHHHHHH......',
  '...HHLLLLHHHHH....',
  '..HHLLLHHHHKllk...',
  '.HHLLHHHHHKKlKKk..',
  '.HLLHHHHHKKKKKKk..',
  'HLLHHHHHHKKKKKKKk.',
  'HLHHHHHHKKkKKSKKk.',
  'HHHHHHHKKKkKKKKKK.',
  'hHHHHHHKKKKSSSSK..',
  'hHHHHHKKKKSSSSS...',
  'hHHHHHKKSKSSSSS...',
  'hhHHHHKKSSSSSSSS..',
  '.hHHHHhKSSSSSSS...',
  '.hhHHHHhsSSSSSS...',
  '..hhHHHHhsSSSSS...',
  '..hhhhHHHhhsh.....',
  '...hhhhHHhHH......',
].flatMap((row, y) => {
  const runs = [];
  for (let x = 0; x < row.length;) {
    const color = row[x], start = x;
    while (x < row.length && row[x] === color) x++;
    if (color !== '.') runs.push({ x: start, y, w: x - start, color });
  }
  return runs;
});
// Same broad light/shadow planes and workwear details as main's RookieArt;
// Jiwoo keeps his own burgundy hoodie, A face geometry, and warm skin palette.
const JIWOO_CLOTH = Object.freeze({ hood: '#6b2f3f', shadow: '#4a2030', light: '#8b4658',
  seam: '#39212d', vest: '#cfe04a', vestLight: '#dfe978', vestShadow: '#8eaa32',
  vestDeep: '#647c30', reflect: '#eee8c4', pants: '#2f3440', pantsShadow: '#20232d', pantsLight: '#424650' });
const JIWOO_A_COLORS = { H: JIWOO_CLOTH.hood, h: JIWOO_CLOTH.shadow, L: JIWOO_CLOTH.light,
  K: '#2d1d21', k: '#44302a', l: '#5b4140', S: '#d99d6f', s: '#ba805d' };
const JIWOO_RIG_PROFILE = CharacterRig.createProfile({
  pivot: { x: 0, y: 56 }, shoulder: { x: -5, y: 25 }, restHand: { x: 8, y: 56 },
  upper: 18, fore: 18, bendSide: 1, carryArc: 0, prepareArc: 0, prepare: 0.24, recover: 0.28,
  // A short waist-level reach spawns the box at the hand on the pickup beat.
  headFollow: false, pickupHand: { x: 2, y: 48 },
  pickup: { lean: 0, shiftX: 0, shiftY: 1 }, place: { lean: 0.16, shiftX: 3, shiftY: 2 }
});
const WORK_RIG_PROFILES = Object.freeze({ jiwoo: JIWOO_RIG_PROFILE });
// Rasterize the original pixels before leaning them, so individual rectangles
// do not acquire blurred edges. Feet and the arm are drawn in world space.
const jiwooBodyLayer = document.createElement('canvas');
jiwooBodyLayer.width = 128; jiwooBodyLayer.height = 192;
const jiwooHeadLayer = document.createElement('canvas');
jiwooHeadLayer.width = 128; jiwooHeadLayer.height = 192;
function drawRigBody(rig, draw) {
  const m = rig.transform;
  if (m.a === 1 && m.b === 0 && m.c === 0 && m.d === 1 && m.e === 0 && m.f === 0) { draw(); return; }
  const target = g, layer = jiwooBodyLayer.getContext('2d');
  layer.clearRect(0, 0, jiwooBodyLayer.width, jiwooBodyLayer.height);
  try { g = layer; draw(); } finally { g = target; }
  g.save(); g.imageSmoothingEnabled = false;
  g.transform(m.a, m.b, m.c, m.d, m.e, m.f); g.drawImage(jiwooBodyLayer, 0, 0); g.restore();
}
function drawRigHead(rig, draw) {
  const m = rig.headTransform;
  if (m.a === 1 && m.b === 0 && m.c === 0 && m.d === 1 && m.e === 0 && m.f === 0) { draw(); return; }
  const target = g, layer = jiwooHeadLayer.getContext('2d');
  layer.clearRect(0, 0, jiwooHeadLayer.width, jiwooHeadLayer.height);
  try { g = layer; draw(); } finally { g = target; }
  g.save(); g.imageSmoothingEnabled = false;
  g.transform(m.a, m.b, m.c, m.d, m.e, m.f); g.drawImage(jiwooHeadLayer, 0, 0); g.restore();
}
// The head, sleeves and props share a pose origin; only the feet stay planted.
function jiwooRig(pose) {
  const top = pose.carryMotion ? 84 : bodyTop(84, pose) + (pose.doze ? 3 : 0), cx = BOSS_X, neckX = cx + 4.5;
  const transform = CharacterRig.torsoTransform({ x: cx, y: top }, JIWOO_RIG_PROFILE, pose.carryMotion?.body || {});
  const world = point => CharacterRig.transformPoint(transform, point);
  const head = pose.carryMotion?.head || { turn: pose.headLeft ? -1 : 1, nod: 0 };
  const direction = head.turn < 0 ? -1 : 1, width = 0.8 + 0.2 * Math.abs(head.turn);
  const scale = direction * width, headCenter = cx + 1.5, neckY = top + 17;
  // Move the head's center continuously around the neck. A brief hood-back
  // pose bridges the two profiles without squeezing the face to zero width.
  const yawOffset = neckX + (headCenter - neckX) * head.turn - scale * headCenter;
  const angle = head.nod * direction, cos = Math.cos(angle), sin = Math.sin(angle);
  const headTransform = { a: cos * scale, b: sin * scale, c: -sin, d: cos,
    e: neckX + cos * (yawOffset - neckX) + sin * neckY,
    f: neckY + sin * (yawOffset - neckX) - cos * neckY };
  const headPoint = point => CharacterRig.transformPoint(headTransform, point);
  return { top, hx: cx - 7, hy: top + 1, neckX, transform, headTransform, headBack: !!pose.away || Math.abs(head.turn) < 0.45,
    hip: world({ x: cx, y: top + 56 }), shoulder: world({ x: cx - 5, y: top + 25 }),
    ear: world(headPoint({ x: cx + 1.5, y: top + 12 })),
    cord: headPoint({ x: cx + 2.5, y: top + 13 }),
    chest: { x: cx + 3.5, y: top + 22 },
    chin: world(headPoint({ x: cx + 6.5, y: top + 18 })),
    phone: pose.phoneHand || world({ x: cx + 14, y: top + 11 }) };
}
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
      const top = bodyTop(90, pose), sx = pose.back ? BOSS_X - 6 : BOSS_X + 7, col = pose.back ? '#4a5560' : C.shirt;
      if (pose.wave && !pose.carry) { thick(sx, top + 22, sx + 3, top + 1, 4, col); R(sx + 1, top - 3, 5, 5, C.skin); return; }
      if (L.lanes === 2) { const h = elbowArm(sx, top + 22, pose.hand.x, pose.hand.y, col); R(h.x - 2, h.y - 2, 4, 4, C.skin); return; }
      thick(BOSS_X + 7, top + 22, pose.hand.x, pose.hand.y, 4, C.shirt); R(pose.hand.x - 2, pose.hand.y - 2, 4, 4, C.skin);
    }
  },
  jiwoo: {
    base: 84,
    draw(pose, nowMs, active) {
      const cx = BOSS_X, rig = jiwooRig(pose), top = rig.top;
      const cloth = JIWOO_CLOTH, hood = cloth.hood, hoodD = cloth.shadow, hoodL = cloth.light;
      // Weight shifts at the hips while the knees still meet the planted legs.
      for (const offset of [-3.5, 3.5]) {
        thick(rig.hip.x + offset, rig.hip.y + 2.5, cx + offset, top + 61.5, 5, cloth.pants);
        thick(rig.hip.x + offset + 1.5, rig.hip.y + 3, cx + offset + 1.5, top + 61.5, 1, cloth.pantsShadow);
      }
      drawRigBody(rig, () => {
      R(cx - 7, top + 23, 14, 33, hood);
      R(cx - 6, top + 19, 12, 3, hood); R(cx - 8, top + 22, 16, 27, hood);
      R(cx - 8, top + 28, 2, 21, hoodD); R(cx - 6, top + 53, 12, 3, hoodD);
      // Raised collar, two vest panels, and the recessed zip follow the same
      // workwear construction as the rookie, at Jiwoo's native sprite scale.
      R(cx - 5, top + 19, 4, 4, cloth.vestLight); R(cx - 6, top + 23, 14, 27, cloth.vest);
      R(cx - 6, top + 26, 2, 24, cloth.vestShadow); R(cx - 5, top + 28, 1, 8, cloth.vestDeep);
      R(cx - 3, top + 23, 2, 12, cloth.vestLight); R(cx + 5, top + 23, 2, 2, cloth.vestLight);
      R(cx + 7, top + 25, 1, 25, cloth.vestShadow);
      R(cx + 3, top + 22, 2, 30, cloth.seam); R(cx + 3, top + 26, 1, 2, '#ac9090');
      R(cx - 6, top + 37, 14, 3, cloth.reflect); R(cx - 6, top + 39, 2, 1, '#b6bd7b');
      R(cx - 6, top + 40, 14, 1, cloth.vestShadow); R(cx + 3, top + 37, 2, 4, cloth.seam);
      // The small ID and pocket are readable blocks, not miniature text.
      R(cx + 4, top + 27, 4, 5, cloth.seam); R(cx + 5, top + 26, 1, 1, '#aeb9b0');
      R(cx + 5, top + 28, 2, 3, '#e2e5d7'); R(cx + 5, top + 28, 1, 1, '#74858b');
      R(cx + 5, top + 30, 2, 1, '#a4b3af');
      R(cx + 4, top + 43, 4, 4, cloth.vestDeep); R(cx + 5, top + 44, 2, 2, cloth.vest);
      R(cx + 4, top + 42, 4, 1, cloth.vestLight);
      R(cx - 6, top + 50, 14, 2, cloth.seam); R(cx - 5, top + 50, 7, 1, hoodL);
      R(cx - 5, top + 53, 1, 2, hoodL); R(cx + 3, top + 53, 2, 2, cloth.seam);
      // The near shoulder is stepped into the sleeve, instead of a square vest corner.
      R(cx - 8, top + 23, 5, 5, hood); R(cx - 8, top + 23, 4, 1, hoodL); R(cx - 9, top + 27, 5, 7, hood);
      R(cx - 5, top + 17, 11, 2, cloth.seam); R(cx - 4, top + 18, 5, 1, hoodL);
      drawRigHead(rig, () => {
      // The study's roughly 18px square head replaces the old 20x23 head.
      const { hx, hy } = rig, hair = JIWOO_A_COLORS.K;
      for (const pixel of JIWOO_A_HEAD) R(hx + pixel.x, hy + pixel.y, pixel.w, 1,
        rig.headBack ? (pixel.y > 13 ? hoodD : hood) : JIWOO_A_COLORS[pixel.color]);
      if (rig.headBack) {
        R(hx + 7, hy + 3, 1, 10, hoodD); R(hx + 8, hy + 2, 1, 11, hoodL);
        return;
      }
      const eyeY = hy + 9 + (pose.lookDown ? 1 : 0);
      if (pose.surprised) {
        R(hx + 12, eyeY - 1, 2, 1, hair); R(hx + 13, eyeY + 1, 1, 2, hair);
        R(hx + 13, hy + 13, 1, 2, '#3c2825');
      } else {
        faceFx(cx, top, hx + 12, eyeY, pose, nowMs, hair, active && !pose.vibe, 'jiwoo-a');
        R(hx + 13, hy + 13, 1, 1, '#3c2825');
      }
      if (pose.vibe) {
        R(hx + 14, hy + 12, 1, 1, '#3c2825');
        for (let k = 0; k < 2; k++) { const p = ((nowMs / 1000) / (SPB * 2) + k * 0.5) % 1; g.globalAlpha = Math.sin(Math.PI * p); eighthNote(cx + 10 + p * 12, top - 4 - p * 16, '#f2a6c8'); g.globalAlpha = 1; }
      }
      if (pose.smit) R(hx + 10, hy + 12, 2, 1, '#ff8fb0');
      if (!pose.nobuds && !pose.unplug) R(hx + 8, hy + 10, 1, 2, '#f4f1ea');
      });
      if (!pose.nobuds) {
        // Turning the head moves the ear, while the cord stays attached at the chest.
        for (let y = rig.cord.y; !rig.headBack && y < rig.chest.y; y++) {
          const p = (y - rig.cord.y) / (rig.chest.y - rig.cord.y - 1);
          R(lerp(rig.cord.x, rig.chest.x, p) - 0.5, y, 1, 1, '#f4f1ea');
        }
        if (pose.unplug) R(rig.chest.x - 0.5, rig.chest.y, 2, 2, '#f4f1ea');
      }
      });
      if (pose.alarm) { const at = CharacterRig.transformPoint(rig.transform, { x: cx + 11, y: top - 12 }); R(at.x, at.y, 2, 6, '#ffe27a'); R(at.x, at.y + 8, 2, 2, '#ffe27a'); }
      if (pose.phone && !pose.phoneHand) drawJiwooPhone(rig.phone);
    },
    arm(pose) {
      const rig = jiwooRig(pose), top = rig.top, { x: sx, y: sy } = rig.shoulder;
      const sleeve = (hand, bendSide = pose.phone ? 1 : (pose.armBend ?? JIWOO_RIG_PROFILE.bendSide)) => {
        const { upper, fore } = JIWOO_RIG_PROFILE;
        // Standard carrying uses fixed lengths and one bend direction throughout.
        // Older stage/dual-belt gestures keep their existing farther prop targets.
        const stretch = pose.carryMotion ? 1 : Math.max(1, Math.hypot(hand.x - sx, hand.y - sy) / (upper + fore));
        const arm = CharacterRig.solveArm(rig.shoulder, hand, { upper, fore, stretch, bendSide });
        const e = arm.elbow, h = arm.wrist;
        const cloth = JIWOO_CLOTH;
        thick(sx, sy, e.x, e.y, 5, cloth.shadow); thick(e.x, e.y, h.x, h.y, 5, cloth.shadow);
        thick(sx, sy, e.x, e.y, 4, cloth.hood); thick(e.x, e.y, h.x, h.y, 4, cloth.hood);
        // Short lit planes follow each bone, so elbow folds and cuffs stay on
        // the sleeve in every pose without changing the solved hand contact.
        for (const [a, b] of [[rig.shoulder, e], [e, h]]) {
          const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy);
          if (len < 1) continue;
          const side = dx > 0 ? -1 : 1, nx = -dy / len * side, ny = dx / len * side;
          thick(lerp(a.x, b.x, 0.18) + nx, lerp(a.y, b.y, 0.18) + ny,
            lerp(a.x, b.x, 0.7) + nx, lerp(a.y, b.y, 0.7) + ny, 1, cloth.light);
        }
        thick(lerp(e.x, h.x, 0.8), lerp(e.y, h.y, 0.8), lerp(e.x, h.x, 0.94), lerp(e.y, h.y, 0.94), 4, cloth.shadow);
        return h;
      };
      if (pose.phone) {
        const h = sleeve(rig.phone);
        if (pose.phoneHand) drawJiwooPhone(h);
        R(h.x - 2, h.y - 2, 4, 4, C.skin); return;
      }
      const atRest = Math.hypot(pose.hand.x - (BOSS_X + 13), pose.hand.y - 134) < 2 ||
        Math.hypot(pose.hand.x - (BOSS_X + JIWOO_RIG_PROFILE.restHand.x), pose.hand.y - (84 + JIWOO_RIG_PROFILE.restHand.y)) < 2;
      const free = pose.hype && !pose.workRig && !pose.carryMotion && !pose.carry && atRest;
      if (free) { const up = pose.bob < 0 ? -6 : 0, h = sleeve({ x: BOSS_X + 13, y: top + 4 + up }, 1); R(h.x - 2, h.y - 3, 5, 5, C.skin); return; }
      const hand = sleeve(pose.hand); R(hand.x - 2, hand.y - 2, 4, 4, C.skin);
    }
  },
