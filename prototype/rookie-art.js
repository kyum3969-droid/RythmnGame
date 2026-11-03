// Source artwork is kept at full resolution. Parts are masked in memory so the
// same approved pixels can be drawn behind the belt and in front of the boxes.
(() => {
  'use strict';
  const source = new Image();
  const assetUrl = new URL('assets/rookie-sprites.png', document.currentScript.src);
  const SCALE = 80 / 679, FLOOR = 169;
  const definitions = [
    { x: 208, y: 16, w: 320, h: 704, anchor: 425, grip: [304, 274],
      arm: [[212,194],[330,194],[330,240],[350,240],[360,218],[380,218],[380,270],[370,299],[366,345],[308,345],[280,316],[260,291],[260,271],[212,271]] },
    { x: 824, y: 16, w: 400, h: 704, anchor: 1119, grip: [928, 268],
      arm: [[828,190],[960,190],[960,215],[1005,215],[1052,205],[1075,221],[1071,281],[1039,299],[939,311],[879,311],[873,272],[828,272]] },
    { x: 1560, y: 16, w: 352, h: 704, anchor: 1795, grip: [1674, 274],
      arm: [[1570,194],[1688,194],[1688,240],[1710,240],[1720,217],[1740,215],[1742,273],[1735,302],[1729,345],[1670,345],[1640,317],[1615,291],[1615,272],[1570,272]] }
  ];
  let frames = null, tool = null, sleeve = null, rig = null;
  const joints = { shoulder: [1065, 240], elbow: [999, 267], wrist: [934, 266] };
  const canvas = (w, h) => Object.assign(document.createElement('canvas'), { width: w, height: h });
  function copy(original) {
    const result = canvas(original.width, original.height);
    result.getContext('2d').drawImage(original, 0, 0);
    return result;
  }
  function polygonMask(frame) {
    const mask = canvas(frame.w, frame.h), c = mask.getContext('2d');
    c.translate(-frame.x, -frame.y);
    c.beginPath(); frame.arm.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y));
    c.closePath(); c.fill();
    return mask;
  }
  const ready = new Promise((resolve, reject) => {
    source.onload = () => {
      try {
        frames = definitions.map(frame => {
          const full = canvas(frame.w, frame.h), c = full.getContext('2d');
          c.drawImage(source, frame.x, frame.y, frame.w, frame.h, 0, 0, frame.w, frame.h);
          // Discard low-alpha background fringe from the transparent extraction.
          const pixels = c.getImageData(0, 0, frame.w, frame.h);
          for (let i = 3; i < pixels.data.length; i += 4) if (pixels.data[i] < 160) pixels.data[i] = 0;
          c.putImageData(pixels, 0, 0);
          const mask = polygonMask(frame), arm = copy(full), body = copy(full);
          const a = arm.getContext('2d'); a.globalCompositeOperation = 'destination-in'; a.drawImage(mask, 0, 0);
          const b = body.getContext('2d'); b.globalCompositeOperation = 'destination-out'; b.drawImage(mask, 0, 0);
          return { ...frame, full, arm, body };
        });
        const scan = frames[1], mask = canvas(scan.w, scan.h), c = mask.getContext('2d');
        c.fillRect(832 - scan.x, 195 - scan.y, 116, 54);
        c.fillRect(880 - scan.x, 245 - scan.y, 24, 53);
        c.fillRect(832 - scan.x, 245 - scan.y, 72, 20);
        tool = copy(scan.arm);
        const t = tool.getContext('2d'); t.globalCompositeOperation = 'destination-in'; t.drawImage(mask, 0, 0);
        sleeve = copy(scan.arm);
        const s = sleeve.getContext('2d'); s.globalCompositeOperation = 'destination-out'; s.drawImage(mask, 0, 0);
        function section(left, right, layer = scan.arm) {
          const part = copy(layer), p = part.getContext('2d');
          p.globalCompositeOperation = 'destination-in';
          p.fillRect(left - scan.x, 0, right - left, scan.h);
          return part;
        }
        // Overlap at each joint keeps the source sleeve closed while rotating.
        // The grip and scanner form one rigid child of the wrist.
        rig = { upper: section(992, 1080, sleeve), fore: section(931, 1006, sleeve), hand: section(824, 940) };
        resolve();
      } catch (error) {
        reject(error);
      }
    };
    source.onerror = () => reject(new Error('Could not load rookie sprite artwork: ' + assetUrl.pathname));
  });
  // Keep a rejected load observable without an unhandled-rejection loop.
  ready.catch(error => console.error(error.message));
  source.src = assetUrl.href;

  function drawLayer(g, frame, layer, x, top, flinchAge) {
    const sy = (80 - (top - 94)) / 679;
    const dx = x + (flinchAge < 160 ? 1 : 0) - (frame.anchor - frame.x) * SCALE;
    const dy = FLOOR - (704 - frame.y) * sy;
    g.save(); g.imageSmoothingEnabled = false;
    g.drawImage(layer, dx, dy, frame.w * SCALE, frame.h * sy);
    g.restore();
  }
  function drawBody(g, x, top, kick, flinchAge, showLegs = true) {
    // Keep the torso stable throughout a scan; only a miss changes expression.
    const frame = frames && frames[flinchAge < 500 ? 2 : 1]; if (!frame) return;
    g.save();
    if (!showLegs) { g.beginPath(); g.rect(x - 48, 0, 96, top + 44); g.clip(); }
    drawLayer(g, frame, frame.body, x, top, flinchAge);
    g.restore();
  }
  // up: 0 the lower belt's scanner, 1 the upper one's, anything between while the one arm swings from one to the other
  function rigPose(x, top, flinchAge, motion, up = 0) {
    up = Math.max(0, Math.min(1, +up));
    const frame = definitions[1], sy = (80 - (top - 94)) / 679;
    const point = ([px, py]) => ({ x: x + (flinchAge < 160 ? 1 : 0) + (px - frame.anchor) * SCALE, y: FLOOR - (704 - py) * sy });
    const shoulder = point(joints.shoulder), reach = motion.reach;
    // Lower: the box passes the gate below the chest, so the hand drops and the scanner tips down-left onto it.
    // Upper: the far conveyor is higher; the arm rises and reaches further (longer bones, constant through the scan).
    const lo = { x: shoulder.x - 8 - 5 * reach, y: shoulder.y + 9 + 2 * reach }, hi = { x: x - 18 - reach * 4, y: top - 5 };
    const target = { x: lo.x + (hi.x - lo.x) * up, y: lo.y + (hi.y - lo.y) * up };
    const stretch = 1 + 0.75 * up;
    const boneLength = (a, b) => Math.hypot((b[0] - a[0]) * SCALE, (b[1] - a[1]) * sy) * stretch;
    const solved = RookieRig.solveTwoBone(shoulder, target, boneLength(joints.shoulder, joints.elbow), boneLength(joints.elbow, joints.wrist), -1);
    const angle = (-0.12 - 0.32 * reach) * (1 - up) + (motion.tilt || 0) * up;
    const mx = (846 - joints.wrist[0]) * SCALE, my = (228 - joints.wrist[1]) * sy;
    const muzzle = { x: solved.wrist.x + mx * Math.cos(angle) - my * Math.sin(angle), y: solved.wrist.y + mx * Math.sin(angle) + my * Math.cos(angle) };
    return { ...solved, angle, muzzle, pulse: motion.pulse || 0, sy };
  }
  function staticMotion(kick) { return { reach: Math.max(0, Math.min(1, kick)), pulse: kick > .2 ? 1 : 0, tilt: -.035 * kick }; }
  function drawBone(g, layer, start, end, from, to, sy) {
    const frame = frames[1], vx = (to[0] - from[0]) * SCALE, vy = (to[1] - from[1]) * sy;
    g.save(); g.translate(start.x, start.y);
    g.rotate(Math.atan2(end.y - start.y, end.x - start.x));
    g.scale(Math.hypot(end.x - start.x, end.y - start.y) / Math.hypot(vx, vy), 1);
    g.rotate(-Math.atan2(vy, vx));
    g.drawImage(layer, (frame.x - from[0]) * SCALE, (frame.y - from[1]) * sy, frame.w * SCALE, frame.h * sy);
    g.restore();
  }
  function drawRig(g, p) {
    if (!rig) return;
    const frame = frames[1];
    g.save(); g.imageSmoothingEnabled = false;
    drawBone(g, rig.upper, p.shoulder, p.elbow, joints.shoulder, joints.elbow, p.sy);
    drawBone(g, rig.fore, p.elbow, p.wrist, joints.elbow, joints.wrist, p.sy);
    g.save(); g.translate(p.wrist.x, p.wrist.y); g.rotate(p.angle);
    g.drawImage(rig.hand, (frame.x - joints.wrist[0]) * SCALE, (frame.y - joints.wrist[1]) * p.sy, frame.w * SCALE, frame.h * p.sy);
    g.fillStyle = p.pulse > .1 ? '#a6ed62' : '#ed4d4d';
    g.fillRect((847 - joints.wrist[0]) * SCALE, (218 - joints.wrist[1]) * p.sy, 1.3, 2.4);
    g.restore();
    if (p.pulse > .01) {
      // Short scan light belongs to the scanner; existing gate FX judge notes.
      // (it leaves the scanner the way the scanner points)
      g.save(); g.translate(p.muzzle.x, p.muzzle.y); g.rotate(p.angle);
      g.globalAlpha = p.pulse * .55;
      g.fillStyle = '#b5ed77';
      g.beginPath(); g.moveTo(-.5, 0);
      g.lineTo(-11, 3); g.lineTo(-11, 8); g.closePath(); g.fill();
      g.globalAlpha = p.pulse; g.fillRect(-11, 3, .6, 5);
      g.restore();
    }
    g.restore();
  }
  function drawMainArm(g, x, top, kick, flinchAge, motion = staticMotion(kick)) {
    drawRig(g, rigPose(x, top, flinchAge, motion));
  }
  function drawUpperArm(g, x, top, flinchAge, motion) {
    drawRig(g, rigPose(x, top, flinchAge, motion, 1));
  }
  // the one arm, anywhere between the lower scanner (0) and the upper one (1)
  function drawArm(g, x, top, flinchAge, motion, up) {
    drawRig(g, rigPose(x, top, flinchAge, motion, up));
  }
  function gripPosition(x, top, kick, flinchAge, motion = staticMotion(kick)) {
    return rigPose(x, top, flinchAge, motion).wrist;
  }
  function drawSleeve(g, sx, sy, hx, hy) {
    if (!frames) return;
    const frame = frames[1], shoulder = [1065, 240], wrist = [934, 266];
    const vx = (wrist[0] - shoulder[0]) * SCALE, vy = (wrist[1] - shoulder[1]) * SCALE;
    const dx = hx - sx, dy = hy - sy;
    // Stretch only along the reach axis; raised/two-hand sleeves keep their width.
    g.save(); g.imageSmoothingEnabled = false;
    g.translate(sx, sy); g.rotate(Math.atan2(dy, dx));
    g.scale(Math.hypot(dx, dy) / Math.hypot(vx, vy), 1); g.rotate(-Math.atan2(vy, vx));
    g.drawImage(sleeve, (frame.x - shoulder[0]) * SCALE, (frame.y - shoulder[1]) * SCALE, frame.w * SCALE, frame.h * SCALE);
    g.restore();
  }
  function drawTool(g, gx, gy, kick) {
    if (!frames) return;
    const frame = frames[1];
    g.save(); g.imageSmoothingEnabled = false;
    g.drawImage(tool, gx + (frame.x - 930) * SCALE, gy + (frame.y - 230) * SCALE, frame.w * SCALE, frame.h * SCALE);
    // The source tool's indicator is green; idle uses the game's red light.
    if (kick <= 0.2) { g.fillStyle = '#ff4a3d'; g.fillRect(gx - 9.5, gy - 1.5, 1.5, 2.5); }
    g.restore();
  }
  window.RookieArt = { ready, drawBody, drawMainArm, drawUpperArm, drawArm, drawSleeve, drawTool, gripPosition, rigPose };
})();
