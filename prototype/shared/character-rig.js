(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.CharacterRig = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // Units: native drawing pixels, seconds, and radians. Profile anchors are
  // offsets from origin. Cycle from/to and returned joints are world points;
  // grip is a world-axis offset from the box. All precede the caller's camera,
  // lane placement, or whole-character mirror.
  // This module calculates poses only; art, foot planting and Canvas stay in
  // the caller. Check arm.reachError before drawing a constrained contact.

  const EPS = 1e-9;
  const clamp01 = value => Math.max(0, Math.min(1, value));
  const smoothstep = value => { const p = clamp01(value); return p * p * (3 - 2 * p); };
  const lerp = (a, b, p) => a + (b - a) * p;
  const point = (x, y) => ({ x, y });
  const add = (a, b) => point(a.x + b.x, a.y + b.y);
  const mixPoint = (a, b, p) => point(lerp(a.x, b.x, p), lerp(a.y, b.y, p));

  function number(value, fallback, name) {
    const result = value === undefined ? fallback : value;
    if (!Number.isFinite(result)) throw new TypeError(name + ' must be finite');
    return result;
  }
  function vector(value, fallback, name) {
    const v = value || {};
    return point(number(v.x, fallback.x, name + '.x'), number(v.y, fallback.y, name + '.y'));
  }
  function positive(value, fallback, name) {
    const result = number(value, fallback, name);
    if (result <= 0) throw new RangeError(name + ' must be positive');
    return result;
  }
  function duration(value, fallback, name) {
    const result = number(value, fallback, name);
    if (result < 0) throw new RangeError(name + ' must not be negative');
    return result;
  }
  function body(value, fallback) {
    const v = value || {};
    return {
      lean: number(v.lean, fallback.lean, 'lean'),
      shiftX: number(v.shiftX, fallback.shiftX, 'shiftX'),
      shiftY: number(v.shiftY, fallback.shiftY, 'shiftY')
    };
  }
  function freeze(value) {
    for (const child of Object.values(value)) if (child && typeof child === 'object') freeze(child);
    return Object.freeze(value);
  }
  const REST_BODY = Object.freeze({ lean: 0, shiftX: 0, shiftY: 0 });
  function mixBody(a, b, p) {
    return { lean: lerp(a.lean, b.lean, p), shiftX: lerp(a.shiftX, b.shiftX, p), shiftY: lerp(a.shiftY, b.shiftY, p) };
  }

  function createProfile(options = {}) {
    const stretch = number(options.stretch, 1, 'stretch');
    if (stretch < 1) throw new RangeError('stretch must be at least 1');
    if (options.headFollow !== undefined && typeof options.headFollow !== 'boolean') throw new TypeError('headFollow must be a boolean');
    return freeze({
      pivot: vector(options.pivot, { x: 0, y: 56 }, 'pivot'),
      shoulder: vector(options.shoulder, { x: -5, y: 25 }, 'shoulder'),
      restHand: vector(options.restHand, { x: 8, y: 56 }, 'restHand'),
      pickupHand: options.pickupHand == null ? null : vector(options.pickupHand, { x: 0, y: 0 }, 'pickupHand'),
      upper: positive(options.upper, 18, 'upper'),
      fore: positive(options.fore, 18, 'fore'),
      bendSide: number(options.bendSide, 1, 'bendSide') < 0 ? -1 : 1,
      headFollow: options.headFollow ?? false,
      prepare: duration(options.prepare, 0.24, 'prepare'),
      recover: duration(options.recover, 0.28, 'recover'),
      carryArc: duration(options.carryArc, 6, 'carryArc'),
      prepareArc: duration(options.prepareArc, 6, 'prepareArc'),
      stretch,
      pickup: body(options.pickup, { lean: -0.16, shiftX: -3, shiftY: 2 }),
      place: body(options.place, { lean: 0.16, shiftX: 3, shiftY: 2 })
    });
  }

  // Matrices transform world points. Neutral motion is the identity; profile
  // anchors are local offsets, so add origin before transforming an anchor.
  function torsoTransform(origin, profile, motion = REST_BODY) {
    const o = vector(origin, { x: 0, y: 0 }, 'origin');
    const m = body(motion, REST_BODY), pivot = add(o, profile.pivot);
    const a = Math.cos(m.lean), b = Math.sin(m.lean), c = -b, d = a;
    return { a, b, c, d,
      e: pivot.x + m.shiftX - a * pivot.x - c * pivot.y,
      f: pivot.y + m.shiftY - b * pivot.x - d * pivot.y };
  }
  function transformPoint(matrix, p) {
    return point(matrix.a * p.x + matrix.c * p.y + matrix.e, matrix.b * p.x + matrix.d * p.y + matrix.f);
  }
  function inversePoint(matrix, p) {
    const det = matrix.a * matrix.d - matrix.b * matrix.c;
    if (!Number.isFinite(det) || Math.abs(det) < EPS) throw new RangeError('matrix is not invertible');
    const x = p.x - matrix.e, y = p.y - matrix.f;
    return point((matrix.d * x - matrix.c * y) / det, (-matrix.b * x + matrix.a * y) / det);
  }

  // Fixed-branch, two-bone IK. Unreachable targets are reported, never hidden
  // by unbounded stretching. A caller can move the torso or change its track.
  function solveArm(shoulder, target, options = {}) {
    const s = vector(shoulder, { x: 0, y: 0 }, 'shoulder');
    const t = vector(target, s, 'target');
    const baseUpper = positive(options.upper, 18, 'upper');
    const baseFore = positive(options.fore, 18, 'fore');
    const maxStretch = number(options.stretch, 1, 'stretch');
    if (maxStretch < 1) throw new RangeError('stretch must be at least 1');
    const side = number(options.bendSide, 1, 'bendSide') < 0 ? -1 : 1;
    const dx = t.x - s.x, dy = t.y - s.y, requestedDistance = Math.hypot(dx, dy);
    const stretch = Math.min(maxStretch, Math.max(1, requestedDistance / (baseUpper + baseFore)));
    const upper = baseUpper * stretch, fore = baseFore * stretch;
    const distance = Math.max(Math.abs(upper - fore), Math.min(upper + fore, requestedDistance));
    const ux = requestedDistance > EPS ? dx / requestedDistance : 1;
    const uy = requestedDistance > EPS ? dy / requestedDistance : 0;
    const wrist = point(s.x + ux * distance, s.y + uy * distance);
    let along = 0, height = upper;
    if (distance > EPS) {
      along = (upper * upper - fore * fore + distance * distance) / (2 * distance);
      height = Math.sqrt(Math.max(0, upper * upper - along * along));
    }
    const elbow = point(s.x + ux * along - uy * height * side, s.y + uy * along + ux * height * side);
    return { shoulder: s, elbow, wrist, target: t, upper, fore, stretch, bendSide: side,
      reachError: Math.hypot(wrist.x - t.x, wrist.y - t.y) };
  }

  // Semantic head channels, relative to the torso and before actor mirroring.
  // turn: -1 left, +1 right. nod: positive downward gaze, in radians.
  function sampleHead(phase, progress, prepare) {
    // A rapid chart gap cannot fit a full glance. Use the scheduled duration,
    // not just normalized phase time, and keep the same pickup pose on both sides.
    const glance = smoothstep(prepare / 0.18), pickupTurn = 1 - 2 * glance, pickupNod = 0.04 * glance;
    if (phase === 'prepare') return {
      turn: lerp(1, pickupTurn, smoothstep(progress / 0.65)),
      nod: lerp(0, pickupNod, smoothstep(progress))
    };
    if (phase === 'carry') return {
      turn: lerp(pickupTurn, 1, smoothstep((progress - 0.12) / 0.5)),
      nod: lerp(pickupNod, 0.12, smoothstep((progress - 0.35) / 0.65))
    };
    if (phase === 'recover') return { turn: 1, nod: lerp(0.12, 0, smoothstep(progress)) };
    return { turn: 1, nod: 0 };
  }

  function sampleCarryCycle(profile, options) {
    const time = number(options.time, 0, 'time');
    const pickTime = number(options.pickTime, 0, 'pickTime');
    const placeTime = number(options.placeTime, pickTime + 1, 'placeTime');
    if (placeTime <= pickTime) throw new RangeError('placeTime must be after pickTime');
    const prepare = duration(options.prepare, profile.prepare, 'prepare');
    const recover = duration(options.recover, profile.recover, 'recover');
    const origin = vector(options.origin, { x: 0, y: 0 }, 'origin');
    const grip = vector(options.grip, { x: 0, y: 0 }, 'grip');
    const anchoredHand = profile.pickupHand ? add(origin, profile.pickupHand) : null;
    // Short-reach characters spawn the box at their hand on pickup. The grip
    // offset keeps that hand position stable across different box dimensions.
    const from = anchoredHand ? point(anchoredHand.x - grip.x, anchoredHand.y - grip.y) : vector(options.from, { x: 0, y: 0 }, 'from');
    const to = vector(options.to, from, 'to');
    const start = pickTime - prepare, end = placeTime + recover;
    const restWorld = add(origin, profile.restHand), pickHand = anchoredHand || add(from, grip), placeHand = add(to, grip);
    let phase = 'idle', progress = 0, motion = { ...REST_BODY }, hand = restWorld, box = null;

    if (time >= start && time < pickTime && prepare > 0) {
      phase = 'prepare'; progress = clamp01((time - start) / prepare);
      const p = smoothstep(progress);
      motion = mixBody(REST_BODY, profile.pickup, p);
      hand = mixPoint(restWorld, pickHand, p);
      hand.y += Math.sin(Math.PI * p) * profile.prepareArc;
    } else if (time >= pickTime && time < placeTime) {
      phase = 'carry'; progress = clamp01((time - pickTime) / (placeTime - pickTime));
      const p = smoothstep(progress);
      motion = progress < 0.5
        ? mixBody(profile.pickup, REST_BODY, smoothstep(progress * 2))
        : mixBody(REST_BODY, profile.place, smoothstep(progress * 2 - 1));
      box = mixPoint(from, to, p);
      // Ease the arc's clock too, so the hand does not gain instant vertical
      // speed at pickup or placement.
      box.y -= Math.sin(Math.PI * p) * profile.carryArc;
      hand = add(box, grip);
    } else if (time >= placeTime && time < end && recover > 0) {
      phase = 'recover'; progress = clamp01((time - placeTime) / recover);
      motion = mixBody(profile.place, REST_BODY, smoothstep(progress));
    }

    const transform = torsoTransform(origin, profile, motion);
    const shoulder = transformPoint(transform, add(origin, profile.shoulder));
    if (phase === 'recover') {
      const movingRest = transformPoint(transform, restWorld);
      hand = mixPoint(placeHand, movingRest, smoothstep(progress));
    }
    const arm = solveArm(shoulder, hand, profile);
    const head = profile.headFollow ? sampleHead(phase, progress, prepare) : null;
    return { phase, active: phase !== 'idle', progress, body: motion, transform, shoulder, hand, box, arm, head };
  }

  return Object.freeze({ createProfile, torsoTransform, transformPoint, inversePoint, solveArm, sampleCarryCycle });
});
