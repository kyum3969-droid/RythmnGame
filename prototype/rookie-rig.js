// Timing and two-bone IK are independent of rendering and the rhythm judgment.
(function (root) {
  'use strict';
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const ease = t => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  function createMotion() {
    let started = -Infinity, from = 0, holding = false, release = null;
    function sample(now) {
      const age = now - started;
      let reach = 0, pulse = 0;
      if (release) reach = release.from * (1 - ease((now - release.at) / 225));
      else if (age >= 0 && Number.isFinite(age)) {
        reach = age < 70 ? from + (1 - from) * ease(age / 70)
          : age < 115 || holding ? 1 : 1 - ease((age - 115) / 225);
        pulse = age > 40 && age < 170 ? Math.sin(Math.PI * (age - 40) / 130) ** 2 : 0;
        if (holding && age >= 105) pulse = .55 + .45 * (1 - ease((age - 105) / 65));
      }
      // Hand rotation follows reach so rapid re-triggers preserve its angle too.
      return { reach, pulse, tilt: -.035 * reach };
    }
    return {
      sample,
      trigger(now) { from = sample(now).reach; started = now; release = null; },
      setHolding(value, now) {
        if (value === holding) return;
        if (!value) release = { from: sample(now).reach, at: now };
        holding = value;
      },
      reset() { started = -Infinity; from = 0; holding = false; release = null; }
    };
  }
  function solveTwoBone(shoulder, target, upperLength, foreLength, bend = -1) {
    const dx = target.x - shoulder.x, dy = target.y - shoulder.y;
    const direction = Math.atan2(dy, dx);
    const distance = clamp(Math.hypot(dx, dy), Math.abs(upperLength - foreLength) + 1e-5, upperLength + foreLength - 1e-5);
    const offset = Math.acos(clamp((upperLength ** 2 + distance ** 2 - foreLength ** 2) / (2 * upperLength * distance), -1, 1));
    const a = direction + bend * offset;
    return {
      shoulder,
      elbow: { x: shoulder.x + Math.cos(a) * upperLength, y: shoulder.y + Math.sin(a) * upperLength },
      wrist: { x: shoulder.x + Math.cos(direction) * distance, y: shoulder.y + Math.sin(direction) * distance }
    };
  }
  const api = { createMotion, solveTwoBone };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.RookieRig = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
