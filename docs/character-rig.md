# Character rig

`prototype/shared/character-rig.js` is a dependency-free pose calculator shared
by browser prototypes and Node tests. It contains no Jiwoo art, game globals,
Canvas calls, or rhythm-chart logic. The browser export is `CharacterRig`;
Node can `require()` the same file.

Jiwoo's standard single-belt work currently uses it in `prototype/index.html`.
The renderer still owns the A sprite, colors, clothing, planted legs and props.
Dual-belt throws and stage choreography retain their existing action tracks.

## Motion

A cycle has four parts: prepare, carry, place/recover, and rest. Preparation
moves the empty hand toward its pickup point. The hip and shoulder follow the load;
the hand and box share one grip point. Recovery keeps the same elbow bend
direction instead of blending between opposite IK solutions.

Jiwoo uses 18px upper and lower arm segments, a lower resting hand, and zero
carry/prepare arcs. His head tracking is disabled: he keeps facing the belt
through the short reach. `pickupHand: {x: 2, y: 48}` places the pickup hand near
his resting hand; at the current origin this is `(48,132)`, only 6px back and
8px up from rest. The box appears at that hand at pickup, then moves to the belt.
His pickup stance is `{lean: 0, shiftX: 0, shiftY: 1}`. This is Jiwoo-specific
tuning; the module's generic defaults remain independently configurable.
Pickup, placement and scoring times are unchanged. Preparation/recovery use
the available gap between chart notes.
During this work track, the controller owns the rendered hand even in the
music's hype section. Rhythm is expressed by the body bounce; the old raised
fist must not override the hand just before a pickup. Standalone stage gestures
remain separate authored actions.

## Applying another character

Create a profile using that character's own drawing coordinates:

```js
const profile = CharacterRig.createProfile({
  pivot: {x: 0, y: 58},       // hip, relative to the drawing origin
  shoulder: {x: 6, y: 22},
  restHand: {x: 12, y: 53},
  pickupHand: {x: 2, y: 48}, // optional short-reach pickup anchor
  upper: 20,
  fore: 19,
  bendSide: 1,               // canonical right-facing work pose
  headFollow: false,         // keep the existing forward-facing head
  prepare: 0.24,
  recover: 0.28,
  carryArc: 0,
  prepareArc: 0,
  pickup: {lean: -0.12, shiftX: -2, shiftY: 2},
  place: {lean: 0.12, shiftX: 2, shiftY: 1}
});

const pose = CharacterRig.sampleCarryCycle(profile, {
  time: seconds,
  pickTime: 2,
  placeTime: 2.5,
  origin: {x: 46, y: 84},
  from: {x: 16, y: 112},     // used when pickupHand is null
  to: {x: 66, y: 140},
  grip: {x: -8, y: 2}
});
```

Profile anchors are local offsets from `origin`. `from`, `to`, `pose.hand`,
`pose.box`, and the returned arm joints are world coordinates **before** the
game's lane, camera, or whole-character mirror transforms.

`pickupHand` defaults to `null`, preserving the caller's `from` position.
When supplied, it is an offset from `origin` and overrides the pickup point:
`hand = origin + pickupHand`, `box = hand - grip`. The same anchor works with
different box sizes because the box is positioned from its actual grip offset.
Before `pickTime`, `pose.box` remains null while the empty hand reaches. At
`pickTime` the box first appears at the anchored hand; `to`, `placeTime` and
rhythm-chart timing are unchanged.

Coordinates use the Canvas convention: X increases rightward and Y downward.
The default `bendSide: 1` chooses the positive cross-product solution from the
shoulder-to-hand vector. In Jiwoo's right-facing resting pose, this places the
elbow behind the wrist with the upper arm pointing down. `-1` chooses the other
solution; it is not a generic synonym for bending down. Keep the selected side
fixed through a work cycle. Do not interpolate between these signs: that cuts
through the two solutions and shortens the apparent bones.

A whole-character Canvas mirror reflects the solved pose automatically, so
keep its profile unchanged. If an adapter instead reflects the input world
coordinates before solving, negate `bendSide` to reflect the elbow solution.

The drawing adapter must:

1. Draw the torso/head using `pose.transform`. The matrix transforms existing
   world drawing coordinates; do not add `origin` a second time.
2. Draw the arm directly from `pose.arm.shoulder`, `elbow`, and `wrist`.
   Do not apply the torso matrix to these joints again.
3. Draw the carried box at `pose.box` while it is non-null. At `placeTime` the
   box is handed back to the game's belt renderer, with no position jump.
4. Keep feet on the floor and connect the moving hip to the planted legs.
5. Check `pose.arm.reachError`. Change the stance, profile, or path when a
   required grip is out of reach; do not draw a detached hand at the target.

## Optional head tracking

`headFollow` defaults to `false`; disabled profiles return `pose.head === null`
and retain their existing facial animation. Enabled profiles return
`head: {turn, nod}` without changing the arm, box, or torso track:

- `turn` ranges from `-1` (left) to `1` (right), before whole-character mirroring.
- `nod` is a downward-gaze amount in radians relative to the torso. The drawing
  adapter applies it around the neck in the current facing direction.
- Preparation turns from right to left during its first 65% and lowers the
  gaze from `0` to `0.04` radians by pickup.
- Carry turns from left to right between 12% and 62% of the carry duration.
  Between 35% and placement, the downward gaze increases to `0.12` radians.
- Recovery keeps the head facing right and returns the gaze to `0`. Idle is
  `{turn: 1, nod: 0}`.

The full pickup glance requires at least `0.18` seconds of actual preparation.
Short chart gaps attenuate its turn and initial nod by
`smoothstep(prepare / 0.18)`, including per-cycle preparation overrides. The
same reduced pickup pose starts the carry phase, so a rapid note does not force
a backwards snap. A `0.025`-second preparation produces only a slight glance
while still facing the belt; zero preparation keeps the pickup head at
`{turn: 1, nod: 0}`. The placement gaze still reaches `0.12` radians. The default
`0.24`-second preparation preserves the full track described above.

All changes use smoothstep interpolation, meet continuously at phase boundaries,
and depend only on the sampled time. The renderer owns how intermediate turns
are drawn and must keep the neck pivot, face, ear and cord attachment together.

In `index.html`, add the profile to `WORK_RIG_PROFILES` **after** adapting that
character's drawing to `carryMotion`. Adding a profile alone will change its
hand track but will not make an old renderer move its torso.

Pixel art can be drawn to a transparent canvas first, then transformed with
`imageSmoothingEnabled = false`. Jiwoo's adapter uses this to keep the sprite
crisp during leaning. Body textures and arm layering remain character-specific.

## Standalone poses and limits

- `torsoTransform(origin, profile, motion)` / `transformPoint(matrix, point)`
  attach a shoulder, head, or prop to a leaning torso.
- `inversePoint(matrix, point)` maps a world target into a torso's space.
- `solveArm(shoulder, target, {upper, fore, bendSide})` preserves both bone
  lengths and clamps unreachable targets, reporting `reachError`.
- `stretch` is an explicit maximum multiplier, default `1`. Normal Jiwoo
  carrying does not stretch. Older game-specific stage gestures still opt
  into their previous farther hand targets in the adapter.
- Sampling is deterministic and has no frame history, so seeking and DEV
  jumps produce the same pose as normal playback.
- Zero prepare/recover durations are supported, but cannot physically smooth
  a transition that has no time allocated to it. Callers own that scheduling.

## Verification

```sh
node --test prototype/shared/character-rig.test.cjs
```

Tests cover fixed bone lengths, grip contact, unreachable and coincident
targets, profile immutability, mirroring, phase boundaries, deterministic
sampling, default elbow direction, optional head tracking, and a second body
proportion. Visual review must also include
frames immediately before/after pickup and release, not just four carry poses.
