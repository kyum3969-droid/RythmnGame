const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createMotion, solveTwoBone } = require('./rookie-rig.js');
const close = (a, b, eps = 1e-8) => assert.ok(Math.abs(a - b) < eps, `${a} != ${b}`);

test('scan reaches, lights up and returns without phase discontinuities', () => {
  const m = createMotion();
  assert.equal(m.sample(0).reach, 0);
  m.trigger(100);
  close(m.sample(100).reach, 0);
  close(m.sample(170).reach, 1);
  assert.ok(m.sample(195).pulse > .8);
  close(m.sample(440).reach, 0);
  for (const t of [170, 215, 440]) close(m.sample(t - 1e-4).reach, m.sample(t + 1e-4).reach, 1e-4);
});
test('rapid inputs start from the current pose and lanes are independent', () => {
  const lower = createMotion(), upper = createMotion();
  lower.trigger(0);
  for (const t of [35, 120, 200, 320]) {
    const before = lower.sample(t);
    lower.trigger(t);
    close(lower.sample(t).reach, before.reach);
    close(lower.sample(t).tilt, before.tilt);
    assert.equal(upper.sample(t).reach, 0);
  }
  close(lower.sample(660).reach, 0);
});
test('held scans remain extended and release smoothly; reset clears all state', () => {
  const m = createMotion();
  m.trigger(0); m.setHolding(true, 0);
  for (let t = 105; t <= 200; t++) assert.ok(m.sample(t).pulse >= .55, 'held indicator must not blink off after its initial flash');
  close(m.sample(170 - 1e-4).pulse, m.sample(170 + 1e-4).pulse, 1e-4);
  close(m.sample(1200).reach, 1);
  m.setHolding(false, 1200);
  close(m.sample(1200).reach, 1);
  assert.ok(m.sample(1300).reach > 0 && m.sample(1300).reach < 1);
  close(m.sample(1425).reach, 0);
  m.trigger(1500); m.reset(); close(m.sample(1550).reach, 0);
});
test('IK preserves both bone lengths at close, extended and unreachable targets', () => {
  const s = { x: 10, y: 20 }, a = 8.4, b = 7.7;
  for (const target of [{x:3,y:24},{x:-5,y:23},{x:10,y:20},{x:-90,y:-100}]) {
    const { elbow, wrist } = solveTwoBone(s, target, a, b);
    close(Math.hypot(elbow.x-s.x, elbow.y-s.y), a);
    close(Math.hypot(wrist.x-elbow.x, wrist.y-elbow.y), b);
    assert.ok(Number.isFinite(wrist.x) && Number.isFinite(elbow.y));
  }
});
