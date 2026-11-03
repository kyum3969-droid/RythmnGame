# Rookie artwork

`rookie-sprites.png` is the transparent production atlas derived from the approved character concept in `docs/art/rookie-approved.png`. Its three columns are idle, scan and flinch; the full-resolution file is 2172×724.

Keep the head/face ratio, hair mass, hood folds and sleeve shape faithful to the approved art. Do not substitute a hand-redrawn rectangle sprite. `../rookie-art.js` owns source frame bounds, foot anchors and in-memory body/arm/tool masks. Use the same renderer in the game and reference pages.

The main game keeps logical 384×216 coordinates but renders at 4× backing density. Do not pre-downsample the atlas to the logical grid. The PNG is local; no remote image service or runtime key is required.

The main, wide-floor, Pocha, camera and transition canvases register their backing scale through `sizeRenderCanvas`. Use `setDrawTransform`/`setContextTransform` for logical transforms, and convert source crop rectangles to backing pixels. The device-resolution overlay canvas keeps its own pixel coordinates.

The scanning arm uses the scan column's original pixels as three overlapping layers: upper arm, forearm, and the hand with its scanner. `../rookie-rig.js` supplies two-bone IK and independent 340ms scan controllers; `../rookie-art.js` supplies the masks and renderer. Normal scans keep bone lengths fixed, retrigger from the current pose, and stay extended during long notes. The far conveyor uses a fixed longer second arm. Gameplay hit timing remains independent of animation timing.

Open `../ref/rookie-rig.html` through the local static server to preview normal/slow playback and the optional joint overlay. Run `node --test prototype/rookie-rig.test.cjs` from the repository root for motion continuity, hold/release and IK checks.
