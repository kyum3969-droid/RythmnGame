# Rookie scanning rig

Implement the user's requested scan animation on the approved full-body character. Preserve the atlas and face/clothing; animate its pixels with a shoulder–elbow–wrist hierarchy and attach the scanner to the hand.

- Split the existing scan sleeve into overlapping upper-arm, forearm and grip/tool layers in memory. Use two-bone inverse kinematics with constant bone lengths; keep the torso and boots stable.
- Animate a 340ms reach, scan pulse and recovery. Retrigger from the current reach on rapid input. Maintain separate lower/upper controllers, keep long-note extension, and let heavy-note support follow the animated grip.
- Preserve belt occlusion, DAW sleeves and static finale APIs. Keep gameplay judgments and the existing 140ms hit effects unchanged.
- Add a reusable preview with slow playback and optional joint overlay; export the rendered animation for review.
- Verify bone lengths/continuity, real keyboard input, both lanes, long/heavy notes, DAW and reference pages. Inspect enlarged motion frames and the in-game result.

Implemented and verified on 2026-11-03. Motion tests pass with `node --test prototype/rookie-rig.test.cjs`. Chromium checks covered actual Space/F/J inputs, extension/recovery, rapid re-trigger continuity, held-note release and judgment, heavy-note support, handover, DAW, flinch and nod. The 10 reference cards and 15 reference animation scenes render. Live preview controls, slow playback, skeleton overlay, manual re-trigger and deterministic export passed; there were no JavaScript errors. Main rendering remained at a 16.7ms median/p95 frame interval in the local browser check.

The animation preview is `prototype/ref/rookie-rig.html`; `docs/art/rookie-scan-rig.gif` is its 1.4-second loop at normal speed. The production atlas is unchanged.

Integration onto current `main` preserves its newer stages, music and removal of the old finale reference pages. The new left/right floor mode uses independent controllers driven by `QUADFX.press`; the seated Pocha scene uses the cropped body and source sleeve. Per-canvas backing scales preserve the newer camera crops, fades, letterboxing and device-resolution overlays.
