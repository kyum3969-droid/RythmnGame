const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const Rig = require('./character-rig.js');

const near = (a, b, tolerance = 1e-8) => assert.ok(Math.abs(a - b) <= tolerance, `${a} != ${b}`);
const pointNear = (a, b, tolerance) => { near(a.x, b.x, tolerance); near(a.y, b.y, tolerance); };
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const profile = Rig.createProfile();
const cycle = { pickTime: 1, placeTime: 1.4, origin: { x: 46, y: 84 }, from: { x: 16, y: 112 }, to: { x: 66, y: 139 }, grip: { x: -9, y: 2 } };
const sample = time => Rig.sampleCarryCycle(profile, { ...cycle, time });

test('profile is copied, deeply immutable, and usable without game globals', () => {
  const options = { shoulder: { x: 4, y: 20 } }, p = Rig.createProfile(options);
  options.shoulder.x = 100;
  assert.equal(p.shoulder.x, 4);
  for (const value of [p, p.shoulder, p.pickup, p.place, p.pivot, p.restHand]) assert.ok(Object.isFrozen(value));
  const browser = vm.createContext({});
  vm.runInContext(fs.readFileSync(require.resolve('./character-rig.js'), 'utf8'), browser);
  assert.equal(typeof browser.CharacterRig.sampleCarryCycle, 'function');
});

test('torso rotates about its hip and inverse restores world points', () => {
  const origin = { x: 46, y: 84 }, motion = { lean: 0.16, shiftX: 3, shiftY: 2 };
  const matrix = Rig.torsoTransform(origin, profile, motion), hip = { x: 46, y: 140 };
  pointNear(Rig.transformPoint(matrix, hip), { x: 49, y: 142 });
  for (const p of [{ x: 41, y: 109 }, { x: 51, y: 92 }, { x: 54, y: 140 }]) {
    pointNear(Rig.inversePoint(matrix, Rig.transformPoint(matrix, p)), p);
  }
  const neutral = Rig.torsoTransform(origin, profile, { lean: 0, shiftX: 0, shiftY: 0 });
  pointNear(Rig.transformPoint(neutral, { x: 51, y: 92 }), { x: 51, y: 92 });
  assert.throws(() => Rig.inversePoint({ a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 }, hip), RangeError);
});

test('reachable arm retains both bone lengths and exact contact', () => {
  for (const lengths of [{ upper: 18, fore: 18 }, { upper: 15, fore: 20 }]) {
    for (let angle = -Math.PI; angle <= Math.PI; angle += 0.15) {
      for (const radius of [8, 16, 26, 33]) {
        const shoulder = { x: 41, y: 109 }, target = { x: 41 + Math.cos(angle) * radius, y: 109 + Math.sin(angle) * radius };
        const arm = Rig.solveArm(shoulder, target, { ...lengths, bendSide: -1 });
        near(distance(arm.shoulder, arm.elbow), lengths.upper);
        near(distance(arm.elbow, arm.wrist), lengths.fore);
        pointNear(arm.wrist, target); near(arm.reachError, 0);
        const dx = target.x - shoulder.x, dy = target.y - shoulder.y;
        const cross = dx * (arm.elbow.y - shoulder.y) - dy * (arm.elbow.x - shoulder.x);
        assert.ok(cross <= 1e-8, 'elbow changed branch');
      }
    }
  }
});

test('impossible targets clamp and report error, bounded stretch is explicit', () => {
  const arm = Rig.solveArm({ x: 0, y: 0 }, { x: 100, y: 0 }, { upper: 18, fore: 18 });
  pointNear(arm.wrist, { x: 36, y: 0 }); near(arm.reachError, 64); near(arm.upper, 18); near(arm.fore, 18);
  const stretched = Rig.solveArm({ x: 0, y: 0 }, { x: 100, y: 0 }, { upper: 18, fore: 18, stretch: 1.1 });
  near(stretched.stretch, 1.1); near(distance(stretched.shoulder, stretched.wrist), 39.6); near(stretched.reachError, 60.4);
  const folded = Rig.solveArm({ x: 2, y: 3 }, { x: 2, y: 3 }, { upper: 20, fore: 12 });
  near(distance(folded.shoulder, folded.elbow), 20); near(distance(folded.elbow, folded.wrist), 12); near(folded.reachError, 8);
});

test('coincident targets, tiny distances and full extension remain finite', () => {
  for (const x of [0, 1e-12, 1e-8, 36, 36 + 1e-8]) {
    const arm = Rig.solveArm({ x: 0, y: 0 }, { x, y: 0 }, profile);
    for (const p of [arm.shoulder, arm.elbow, arm.wrist]) assert.ok(Number.isFinite(p.x) && Number.isFinite(p.y));
    near(distance(arm.shoulder, arm.elbow), 18); near(distance(arm.elbow, arm.wrist), 18);
  }
});

test('mirroring a rig mirrors joints when the pole side is reflected', () => {
  const s = { x: 4, y: 8 }, target = { x: 23, y: 19 };
  const a = Rig.solveArm(s, target, { upper: 18, fore: 16, bendSide: -1 });
  const b = Rig.solveArm({ x: -s.x, y: s.y }, { x: -target.x, y: target.y }, { upper: 18, fore: 16, bendSide: 1 });
  pointNear(b.elbow, { x: -a.elbow.x, y: a.elbow.y });
  pointNear(b.wrist, { x: -a.wrist.x, y: a.wrist.y });
});

test('the default right-facing arm rests down with the elbow behind the wrist', () => {
  const p = Rig.createProfile();
  assert.equal(p.bendSide, 1);
  const shoulder = { x: 41, y: 109 }, hand = { x: 51, y: 129 };
  for (const options of [{}, p]) {
    const arm = Rig.solveArm(shoulder, hand, options);
    assert.ok(arm.elbow.x < arm.wrist.x, 'elbow points forward beyond the hand');
    assert.ok(arm.elbow.y > arm.shoulder.y, 'upper arm points upward at rest');
    pointNear(arm.wrist, hand);
    near(distance(arm.shoulder, arm.elbow), 18);
    near(distance(arm.elbow, arm.wrist), 18);
  }
});

test('carry contact and torso share one deterministic cycle with fixed branch', () => {
  let firstShoulder;
  for (let i = 0; i < 100; i++) {
    const time = cycle.pickTime + (cycle.placeTime - cycle.pickTime) * i / 100;
    const state = sample(time);
    assert.equal(state.phase, 'carry'); assert.equal(state.arm.bendSide, 1);
    pointNear(state.hand, { x: state.box.x + cycle.grip.x, y: state.box.y + cycle.grip.y });
    pointNear(state.arm.wrist, state.hand); near(state.arm.reachError, 0);
    near(distance(state.arm.shoulder, state.arm.elbow), 18); near(distance(state.arm.elbow, state.arm.wrist), 18);
    assert.deepEqual(sample(time), state, 'random access changed the pose');
    firstShoulder ||= state.shoulder;
  }
  assert.ok(distance(firstShoulder, sample(cycle.placeTime).shoulder) > 10, 'body never transfers weight');
});

test('optional head tracking looks toward pickup, then toward placement', () => {
  const follow = Rig.createProfile({ headFollow: true });
  const at = time => Rig.sampleCarryCycle(follow, { ...cycle, time }).head;
  const prepareStart = cycle.pickTime - follow.prepare, carryDuration = cycle.placeTime - cycle.pickTime;
  assert.deepEqual(at(0), { turn: 1, nod: 0 });
  near(at(prepareStart + follow.prepare * 0.65).turn, -1);
  pointNear({ x: at(cycle.pickTime).turn, y: at(cycle.pickTime).nod }, { x: -1, y: 0.04 });
  near(at(cycle.pickTime + carryDuration * 0.12).turn, -1);
  near(at(cycle.pickTime + carryDuration * 0.62).turn, 1);
  near(at(cycle.pickTime + carryDuration * 0.35).nod, 0.04);
  assert.deepEqual(at(cycle.placeTime), { turn: 1, nod: 0.12 });
  assert.deepEqual(at(cycle.placeTime + follow.recover), { turn: 1, nod: 0 });

  let previous = at(cycle.pickTime);
  for (let i = 1; i <= 100; i++) {
    const head = at(cycle.pickTime + carryDuration * i / 100);
    assert.ok(head.turn >= previous.turn - 1e-10, 'head turns away from placement');
    assert.ok(head.nod >= previous.nod - 1e-10, 'placement gaze reverses');
    previous = head;
  }
});

test('head motion is continuous at phase boundaries and remains optional', () => {
  const follow = Rig.createProfile({ headFollow: true });
  const at = time => Rig.sampleCarryCycle(follow, { ...cycle, time }).head;
  const boundaries = [cycle.pickTime - follow.prepare, cycle.pickTime, cycle.placeTime, cycle.placeTime + follow.recover];
  for (const time of boundaries) {
    const a = at(time - 1e-7), b = at(time), c = at(time + 1e-7);
    for (const key of ['turn', 'nod']) { near(a[key], b[key], 1e-6); near(b[key], c[key], 1e-6); }
  }
  assert.equal(profile.headFollow, false);
  for (const time of [0, 0.9, 1, 1.2, 1.4, 2]) {
    const state = sample(time);
    assert.equal(state.head, null);
    const tracked = Rig.sampleCarryCycle(follow, { ...cycle, time });
    pointNear(tracked.hand, state.hand); pointNear(tracked.shoulder, state.shoulder);
    pointNear(tracked.arm.elbow, state.arm.elbow);
  }
});

test('rapid pickups reduce the glance using the scheduled preparation time', () => {
  const follow = Rig.createProfile({ headFollow: true });
  const prepare = 0.025;
  const at = time => Rig.sampleCarryCycle(follow, { ...cycle, time, prepare }).head;
  const pickup = at(cycle.pickTime);
  assert.ok(pickup.turn > 0.85 && pickup.turn < 1, 'short preparation still forces a full head turn');
  assert.ok(pickup.nod > 0 && pickup.nod < 0.01, 'pickup nod snaps during a short preparation');
  for (let i = 0; i <= 200; i++) {
    const time = cycle.pickTime - prepare + (prepare + cycle.placeTime - cycle.pickTime) * i / 200;
    assert.ok(at(time).turn > 0, 'head crosses to the left on a rapid note');
  }
  for (const time of [cycle.pickTime - prepare, cycle.pickTime, cycle.placeTime]) {
    const a = at(time - 1e-7), b = at(time + 1e-7);
    near(a.turn, b.turn, 1e-6); near(a.nod, b.nod, 1e-6);
  }
  assert.deepEqual(at(cycle.placeTime), { turn: 1, nod: 0.12 });
});

test('zero preparation keeps the head toward the belt without a pickup jump', () => {
  const follow = Rig.createProfile({ headFollow: true });
  const at = time => Rig.sampleCarryCycle(follow, { ...cycle, time, prepare: 0 }).head;
  assert.deepEqual(at(cycle.pickTime - 1e-7), { turn: 1, nod: 0 });
  assert.deepEqual(at(cycle.pickTime), { turn: 1, nod: 0 });
  for (let i = 0; i <= 100; i++) {
    const head = at(cycle.pickTime + (cycle.placeTime - cycle.pickTime) * i / 100);
    near(head.turn, 1);
  }
  near(at(cycle.placeTime).nod, 0.12);
});

test('prepare, pickup, placement and recovery meet without pose jumps', () => {
  const epsilon = 1e-7;
  for (const time of [cycle.pickTime - profile.prepare, cycle.pickTime, cycle.placeTime, cycle.placeTime + profile.recover]) {
    const a = sample(time - epsilon), b = sample(time), c = sample(time + epsilon);
    for (const key of ['shoulder', 'hand']) { pointNear(a[key], b[key], 1e-4); pointNear(b[key], c[key], 1e-4); }
    pointNear(a.arm.elbow, c.arm.elbow, 1e-4);
  }
  pointNear(sample(cycle.pickTime).box, cycle.from);
  pointNear(sample(cycle.placeTime).hand, { x: cycle.to.x + cycle.grip.x, y: cycle.to.y + cycle.grip.y });
  assert.equal(sample(cycle.placeTime).box, null);
  assert.equal(sample(0).active, false); assert.equal(sample(2).phase, 'idle');
  pointNear(sample(0).hand, sample(2).hand);
});

test('a second body proportion uses the same module and keeps contact', () => {
  const second = Rig.createProfile({ pivot: { x: 0, y: 45 }, shoulder: { x: 4, y: 18 }, restHand: { x: 6, y: 45 }, upper: 16, fore: 17, carryArc: 3, pickup: { lean: -0.08, shiftX: -1, shiftY: 1 }, place: { lean: 0.08, shiftX: 1, shiftY: 1 } });
  for (let i = 0; i <= 80; i++) {
    const state = Rig.sampleCarryCycle(second, { time: i / 40, pickTime: 0.5, placeTime: 1.2, origin: { x: 120, y: 70 }, from: { x: 107, y: 103 }, to: { x: 140, y: 112 }, grip: { x: -3, y: 2 } });
    near(distance(state.arm.shoulder, state.arm.elbow), 16); near(distance(state.arm.elbow, state.arm.wrist), 17);
    near(state.arm.reachError, 0);
    if (state.box) pointNear(state.arm.wrist, { x: state.box.x - 3, y: state.box.y + 2 });
  }
});

test('a local pickup hand anchors the box spawn after a short empty-hand reach', () => {
  const local = { x: 2, y: 48 }, p = Rig.createProfile({ pickupHand: local });
  local.x = 999;
  assert.deepEqual(p.pickupHand, { x: 2, y: 48 });
  assert.ok(Object.isFrozen(p.pickupHand));
  const at = time => Rig.sampleCarryCycle(p, { ...cycle, time });
  const before = at(cycle.pickTime - 1e-7), pickup = at(cycle.pickTime);
  assert.equal(before.phase, 'prepare'); assert.equal(before.box, null);
  assert.equal(pickup.phase, 'carry');
  pointNear(pickup.hand, { x: 48, y: 132 });
  pointNear(before.hand, pickup.hand, 1e-5);
  pointNear(pickup.box, { x: 57, y: 130 });
  assert.notDeepEqual(pickup.box, cycle.from, 'box still comes from the distant stack');
  assert.equal(at(cycle.placeTime).box, null, 'placement timing changed');
  pointNear(at(cycle.placeTime).hand, { x: cycle.to.x + cycle.grip.x, y: cycle.to.y + cycle.grip.y });
});

test('different box dimensions keep the same pickup grip and preserve carry contact', () => {
  const p = Rig.createProfile({ pickupHand: { x: 2, y: 48 }, carryArc: 0 });
  for (const box of [{ w: 16, h: 12 }, { w: 20, h: 14 }, { w: 22, h: 16 }]) {
    const grip = { x: -box.w / 2 + 1, y: 2 }, to = { x: 66, y: 146 - box.h / 2 };
    for (let i = 0; i < 80; i++) {
      const time = cycle.pickTime + (cycle.placeTime - cycle.pickTime) * i / 80;
      const pose = Rig.sampleCarryCycle(p, { ...cycle, time, grip, to });
      if (i === 0) pointNear(pose.hand, { x: 48, y: 132 });
      pointNear(pose.hand, { x: pose.box.x + grip.x, y: pose.box.y + grip.y });
      pointNear(pose.arm.wrist, pose.hand);
    }
  }
});

test('profiles without a pickup hand retain the caller-supplied stack position', () => {
  for (const p of [Rig.createProfile(), Rig.createProfile({ pickupHand: null })]) {
    assert.equal(p.pickupHand, null);
    const pose = Rig.sampleCarryCycle(p, { ...cycle, time: cycle.pickTime });
    pointNear(pose.box, cycle.from);
    pointNear(pose.hand, { x: cycle.from.x + cycle.grip.x, y: cycle.from.y + cycle.grip.y });
  }
});

test('invalid profiles and timelines fail explicitly instead of producing NaNs', () => {
  assert.throws(() => Rig.createProfile({ upper: 0 }), RangeError);
  assert.throws(() => Rig.createProfile({ carryArc: -1 }), RangeError);
  assert.throws(() => Rig.createProfile({ shoulder: { x: NaN } }), TypeError);
  assert.throws(() => Rig.createProfile({ headFollow: 'false' }), TypeError);
  assert.throws(() => Rig.createProfile({ pickupHand: { x: Infinity, y: 0 } }), TypeError);
  assert.throws(() => Rig.solveArm({ x: 0, y: 0 }, { x: Infinity, y: 1 }), TypeError);
  assert.throws(() => Rig.sampleCarryCycle(profile, { ...cycle, time: 0, placeTime: 0.5 }), RangeError);
});
