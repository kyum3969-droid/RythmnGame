# Builds prototype/assets/cast17.png + cast17.json: 1-7's cast (지우, 하은, 반장, 신입) from the rookie-style pixel study
# (docs/art/cast-rookie-style-study.png, read to its own dot grid by dots.py). One dot of the study is one dot of the game.
# 지우 and 하은 are cut into rig parts (torso, thighs, shins, upper and lower arms); 반장 is a still (the coffee); 신입 is a
# still with his scanner arm as its own layer. The study faces left; the rigs are flipped to face right (the game mirrors).
# Run from the repo root:  python3 prototype/ref/cast17/build.py
import json, re, sys
import numpy as np
from PIL import Image
sys.path.insert(0, 'prototype/ref/cast17')
from dots import cut

OUT_PNG, OUT_JSON = 'prototype/assets/cast17.png', 'prototype/assets/cast17.json'
FIG = {n: cut(n)[0] for n in ['rookie', 'jiwoo', 'haeun', 'boss']}

def rect_mask(shape, rects):
    m = np.zeros(shape[:2], bool)
    for x0, y0, x1, y1 in rects: m[y0:y1 + 1, x0:x1 + 1] = True
    return m

def rig(fig, spec):
    # spec in the study's own (left-facing) dot coordinates; every part is the figure's pixels inside its rects (minus
    # 'not' rects); the torso is what no limb took (plus its own overlap rows). Flipped to face right at the end.
    H, W = fig.shape[:2]; X = lambda x: W - 1 - x
    taken = np.zeros((H, W), bool); parts = {}
    def take(name, rects, minus=(), pivot=None, **pts):
        m = rect_mask(fig.shape, rects) & (fig[..., 3] > 0)
        if minus: m &= ~rect_mask(fig.shape, minus)
        a = np.zeros_like(fig); a[m] = fig[m]
        parts[name] = (a, pivot, pts); return m
    # (arms first; the legs then leave out whatever the arms took, so a hanging hand is not cut into a thigh)
    for name, (rects, minus, pivot, pts) in spec['limbs'].items():
        leg = name.startswith('thigh') or name.startswith('shin')
        if leg: minus = list(minus) + [(x, y, x, y) for y, x in zip(*np.nonzero(taken))]
        m = take(name, rects, minus, pivot, **pts)
        if not leg: taken |= m
    legs_top = spec['legsTop']
    t = fig.copy(); t[taken] = 0; t[legs_top + 2:] = 0
    parts['torso'] = (t, spec['hip'], spec['torsoPts'])
    # the far arm is mostly hidden behind the body in the study (a sliver at its side): drawn as the near arm, shaded, so it
    # keeps its width when it swings out
    for k in ('uarm', 'farm'):
        a, pivot, pts = parts[k + 'N']; f = a.copy(); f[..., :3] = (f[..., :3] * 0.78).astype(np.uint8); parts[k + 'F'] = (f, pivot, pts)
    out = {}
    for name, (a, pivot, pts) in parts.items():
        a = a[:, ::-1]   # face right
        ys, xs = np.nonzero(a[..., 3])
        x0, y0, x1, y1 = xs.min(), ys.min(), xs.max(), ys.max()
        crop = a[y0:y1 + 1, x0:x1 + 1]
        loc = lambda p: [X(p[0]) - x0 + 0.5, p[1] - y0 + 0.5]
        e = {'arr': crop, 'pivot': loc(pivot)}
        for k, v in pts.items(): e[k] = loc(v)
        # a joint cap: the limb's colour at the joint, about half its width
        jy, jx = int(e['pivot'][1]), int(e['pivot'][0])
        if 0 <= jy < crop.shape[0]:
            row = np.nonzero(crop[jy, :, 3])[0]
            if len(row) >= 2:
                c = crop[jy, (row[0] + row[-1]) // 2, :3]
                e['cap'] = ['#%02x%02x%02x' % tuple(int(v) for v in c), round((row[-1] - row[0] + 1) * 0.45, 2), [jx, jy]]
        out[name] = e
    return out

# 지우 (20 x 72): the hood sleeve arms at either side, the legs split down the middle
J = rig(FIG['jiwoo'], {
    'hip': (9.5, 48), 'legsTop': 47,
    'torsoPts': {'nearSh': (16, 22), 'farSh': (2, 22), 'head': (8, 0), 'ear': (11, 11), 'hipN': (13, 48), 'hipF': (6, 48)},
    'limbs': {
        'uarmN': ([(15, 20, 19, 32)], [], (16, 22), {'elbow': (16, 31)}),
        'farmN': ([(15, 30, 19, 40), (14, 41, 17, 45)], [], (16, 31), {'hand': (16, 43)}),
        'uarmF': ([(0, 20, 3, 32)], [], (2, 22), {'elbow': (2, 31)}),
        'farmF': ([(0, 30, 3, 45)], [], (2, 31), {'hand': (2, 43)}),
        'thighN': ([(10, 45, 19, 60)], [], (13, 48), {'knee': (13, 59)}),
        'shinN': ([(10, 58, 19, 71)], [], (13, 59), {'sole': (13, 71), 'toe': (11, 71)}),
        'thighF': ([(0, 45, 9, 60)], [], (6, 48), {'knee': (6, 59)}),
        'shinF': ([(0, 58, 9, 71)], [], (6, 59), {'sole': (6, 71), 'toe': (2, 71)}),
    }})
# 하은 (23 x 64): her hair down her back stays on the torso; the watch is on the back (near) arm
Hh = rig(FIG['haeun'], {
    'hip': (10.5, 37), 'legsTop': 36,
    'torsoPts': {'nearSh': (16, 24), 'farSh': (5, 23), 'head': (11, 0), 'ear': (12, 13), 'hipN': (14, 37), 'hipF': (6, 37)},
    'limbs': {
        'uarmN': ([(15, 22, 18, 31)], [], (16, 24), {'elbow': (16, 30)}),
        'farmN': ([(15, 29, 18, 34), (14, 35, 19, 40)], [], (16, 30), {'hand': (16, 37)}),
        'uarmF': ([(3, 21, 6, 31)], [], (5, 23), {'elbow': (5, 30)}),
        'farmF': ([(3, 29, 6, 40)], [], (5, 30), {'hand': (5, 37)}),
        'thighN': ([(11, 33, 22, 51)], [], (14, 37), {'knee': (14, 50)}),
        'shinN': ([(11, 49, 22, 63)], [], (14, 50), {'sole': (15, 63), 'toe': (12, 63)}),
        'thighF': ([(0, 33, 10, 51)], [], (6, 37), {'knee': (6, 50)}),
        'shinF': ([(0, 49, 10, 63)], [], (6, 50), {'sole': (6, 63), 'toe': (1, 63)}),
    }})
# 반장 (30 x 67): the coffee, standing; his feet at the bottom middle
def still(fig, foot): return {'arr': fig, 'foot': list(foot)}
B = {'coffee': still(FIG['boss'], (FIG['boss'].shape[1] / 2, FIG['boss'].shape[0]))}
# 신입 (30 x 67): the body, and his scanner arm (the gun, the hand, the sleeve to the shoulder) as its own layer
R = FIG['rookie']; arm = rect_mask(R.shape, [(0, 16, 13, 31)]) & (R[..., 3] > 0)
Ra = np.zeros_like(R); Ra[arm] = R[arm]; Rb = R.copy(); Rb[arm] = 0
RK = {'body': still(Rb, (R.shape[1] * 0.6, R.shape[0])), 'arm': still(Ra, (R.shape[1] * 0.6, R.shape[0]))}
red = np.nonzero((Ra[..., 0] > 170) & (Ra[..., 1] < 90) & (Ra[..., 3] > 0)); RK['arm']['light'] = [[int(x), int(y)] for y, x in zip(*red)]   # the scanner's red light

# ---------------- pack ----------------
items = [('jiwoo', n, p) for n, p in J.items()] + [('haeun', n, p) for n, p in Hh.items()] + [('boss', n, p) for n, p in B.items()] + [('rookie', n, p) for n, p in RK.items()]
PAD, ROWW = 1, 160
x = y = rowh = 0; place = []
for who, n, p in sorted(items, key=lambda it: -it[2]['arr'].shape[0]):
    h, w = p['arr'].shape[:2]
    if x + w + PAD > ROWW: x = 0; y += rowh + PAD; rowh = 0
    place.append((who, n, p, x, y)); x += w + PAD; rowh = max(rowh, h)
atlas = Image.new('RGBA', (ROWW, y + rowh), (0, 0, 0, 0))
meta = {w: {'scale': 1, 'parts': {}} for w in ['jiwoo', 'haeun', 'boss', 'rookie']}
for who, n, p, px, py in place:
    atlas.alpha_composite(Image.fromarray(p['arr'], 'RGBA'), (px, py))
    e = {'r': [px, py, p['arr'].shape[1], p['arr'].shape[0]]}; e.update({k: v for k, v in p.items() if k != 'arr'})
    meta[who]['parts'][n] = e
atlas.save(OUT_PNG, optimize=True)
json.dump(meta, open(OUT_JSON, 'w'), separators=(',', ':'))
print(atlas.size, {w: len(m['parts']) for w, m in meta.items()})
p = 'prototype/index.html'; s = open(p, encoding='utf-8').read()
s2, n = re.subn(r'^const CAST17_META = .*;$', lambda m: 'const CAST17_META = ' + json.dumps(meta, separators=(',', ':')) + ';', s, flags=re.M)
if n == 1: open(p, 'w', encoding='utf-8').write(s2); print('index.html: CAST17_META updated')
