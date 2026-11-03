# Builds prototype/assets/cast17.png + cast17.json: the 1-7 cutscene's cast (지우, 하은, 반장) cut from the approved design
# references in docs/art into rig parts. Parts are kept at 4x the game's dot size (the game draws a pose at that size and
# shrinks it, so joints never seam); 반장's two still frames are shrunk here straight to game size.
# Run from the repo root:  python3 prototype/ref/cast17/build.py
import json
import numpy as np
from PIL import Image, ImageDraw

ART = 'docs/art/'
OUT_PNG, OUT_JSON = 'prototype/assets/cast17.png', 'prototype/assets/cast17.json'

def load(name, flip=False):
    im = Image.open(ART + name).convert('RGBA')
    return im.transpose(Image.FLIP_LEFT_RIGHT) if flip else im

def shrink(im, size):
    # premultiplied resize (no dark fringes), then a hard alpha edge like the rest of the game's dots
    a = np.asarray(im).astype(np.float32) / 255
    a[..., :3] *= a[..., 3:4]
    s = np.asarray(Image.fromarray((a * 255 + 0.5).astype(np.uint8), 'RGBA').resize(size, Image.LANCZOS)).astype(np.float32) / 255
    al = s[..., 3:4]
    rgb = np.where(al > 0.004, s[..., :3] / np.maximum(al, 1e-3), 0)
    return np.clip(np.concatenate([rgb, al], 2), 0, 1)

def to_img(arr, hard=None):
    arr = arr.copy()
    if hard is not None: arr[..., 3] = (arr[..., 3] > hard).astype(np.float32)
    return Image.fromarray((arr * 255 + 0.5).astype(np.uint8), 'RGBA')

def poly_mask(size, polys, off):
    m = Image.new('L', size, 0); d = ImageDraw.Draw(m)
    for p in polys: d.polygon([(x - off[0], y - off[1]) for x, y in p], fill=255)
    return np.asarray(m) > 0

class Char:
    def __init__(self, src, k, flip=False):
        self.im = load(src, flip); self.W = self.im.width; self.k = k; self.flip = flip; self.parts = {}
    def X(self, x): return (self.W - 1 - x) if self.flip else x
    def P(self, p): return (self.X(p[0]), p[1])
    def poly(self, pts): return [self.P(p) for p in pts]

    def part(self, name, rect, pivot, keep=None, cut=None, fill=None, shade=1.0, img=None, **pts):
        # rect/keep/cut/pivot/pts are in the reference's own (unflipped) pixels
        x0, y0, x1, y1 = rect
        if self.flip: x0, x1 = self.X(x1), self.X(x0)
        src = np.asarray((img or self.im).crop((x0, y0, x1, y1))).astype(np.float32) / 255
        src = src.copy()
        if keep is not None:
            m = poly_mask((x1 - x0, y1 - y0), [self.poly(p) for p in keep], (x0, y0)); src[~m, 3] = 0
        if cut is not None:
            m = poly_mask((x1 - x0, y1 - y0), [self.poly(p) for p in cut], (x0, y0)); src[m, 3] = 0
        if fill is not None: fill(src, (x0, y0))
        if shade != 1.0: src[..., :3] *= shade
        w, h = round((x1 - x0) * self.k), round((y1 - y0) * self.k)
        arr = shrink(Image.fromarray((np.clip(src, 0, 1) * 255 + 0.5).astype(np.uint8), 'RGBA'), (w, h))
        loc = lambda p: [round((self.P(p)[0] - x0) * self.k, 2), round((p[1] - y0) * self.k, 2)]
        e = {'arr': arr, 'pivot': loc(pivot), **{k: loc(v) for k, v in pts.items()}}
        # a joint cap (a disc of the cloth's own colour over the joint, so a bent knee or elbow shows no seam): its colour from
        # the middle of the limb at the joint, its radius a little under half the limb's width there
        jy = int(e['pivot'][1]); row = arr[min(arr.shape[0] - 1, jy + 2), :, 3] > 0.5; xs = np.nonzero(row)[0]
        if len(xs):
            mid = (xs[0] + xs[-1]) // 2; win = arr[max(0, jy - 2):jy + 6, max(0, mid - 3):mid + 4]; win = win[win[..., 3] > 0.5]
            if len(win): e['cap'] = ['#%02x%02x%02x' % tuple(int(v * 255 + 0.5) for v in np.median(win[:, :3], 0)), round((xs[-1] - xs[0]) * 0.42, 1), [int(mid), jy]]
        self.parts[name] = e
        return self

# ---------------- 지우 (faces right in the reference; the armless body and the two loose arms) ----------------
J = Char('jiwoo-proportion-concept.png', 4 * 81 / 896)
LEG_SPLIT = 720
J.part('torso', (600, 60, 860, 600), (720, 578), keep=[[(600, 60), (860, 60), (860, 556), (600, 556)], [(630, 556), (810, 556), (810, 600), (630, 600)]],
       nearSh=(660, 342), farSh=(792, 336), head=(745, 70), ear=(722, 212), hipN=(680, 578), hipF=(762, 578))
J.part('thighN', (630, 552, LEG_SPLIT + 1, 745), (680, 578), knee=(680, 732))
J.part('shinN', (630, 720, LEG_SPLIT + 4, 962), (680, 732), sole=(684, 958), toe=(716, 945))
J.part('thighF', (LEG_SPLIT - 1, 552, 808, 745), (762, 578), knee=(762, 732), shade=0.82)
J.part('shinF', (LEG_SPLIT - 1, 720, 836, 962), (762, 732), sole=(770, 958), toe=(826, 945), shade=0.82)
J.part('uarmN', (1028, 294, 1124, 478), (1080, 336), elbow=(1080, 466))
J.part('farmN', (1028, 452, 1124, 664), (1080, 466), hand=(1086, 630))
J.part('uarmF', (1262, 294, 1370, 478), (1304, 336), elbow=(1304, 466), shade=0.8)
J.part('farmF', (1262, 452, 1370, 664), (1304, 466), hand=(1306, 630), shade=0.8)

# ---------------- 하은 (faces left in the reference: flipped here so every rig faces right) ----------------
H = Char('haeun-concept.png', 4 * 74 / 720, flip=True)
near_arm = [(434, 290), (484, 288), (486, 380), (488, 440), (490, 497), (430, 497), (428, 440), (434, 380)]
far_arm = [(316, 290), (349, 292), (350, 330), (350, 400), (354, 440), (354, 497), (310, 497), (314, 420), (318, 330)]
def haeun_fill(src, off):
    # behind her near arm, row by row: blend from what is beside the arm on the body's side to what is on the far side
    # (her hair, over the shoulder); where nothing is on the far side, the body's side carries on a little and stops
    x0, y0 = off; h, w = src.shape[:2]
    m = poly_mask((w, h), [H.poly(near_arm)], off)
    for y in range(h):
        xs = np.nonzero(m[y])[0]
        if not len(xs): continue
        a, z = xs[0], xs[-1]
        # (flipped: the body's side is to the right of the arm in this array)
        inner = src[y, min(w - 1, z + 2)].copy(); outer = src[y, max(0, a - 2)].copy()
        for x in range(a, z + 1):
            q = (z - x) / max(1, z - a)          # 0 at the body's side, 1 at the far side
            if outer[3] > 0.5: src[y, x] = inner if q < 0.45 else outer
            else: src[y, x] = inner if q < 0.55 else [0, 0, 0, 0]
H.part('torso', (270, 40, 525, 445), (405, 432), keep=[[(270, 40), (525, 40), (525, 418), (270, 418)], [(330, 418), (480, 418), (480, 445), (330, 445)]],
       cut=[far_arm], fill=haeun_fill, nearSh=(458, 302), farSh=(338, 302), head=(400, 50), ear=(420, 170), hipN=(437, 432), hipF=(372, 432))
H.part('shinN', (404, 575, 502, 770), (440, 592), sole=(452, 766), toe=(420, 760))
def thighF_fill(src, off):
    # her far hand hangs over the side of this thigh: trouser behind it
    m = poly_mask(src.shape[1::-1], [H.poly(far_arm)], off); ys, xs = np.nonzero(m)
    for y, x in zip(ys, xs):
        rx = (H.W - 1 - (x + off[0])) if H.flip else x + off[0]
        src[y, x] = [0.17, 0.17, 0.20, 1] if rx > 341 else [0, 0, 0, 0]
H.part('thighF', (334, 412, 407, 600), (372, 432), knee=(370, 592), fill=thighF_fill, shade=0.82)
H.part('shinF', (300, 575, 407, 770), (370, 592), sole=(360, 766), toe=(306, 760), shade=0.82)
H.part('uarmN', (424, 286, 494, 382), (458, 302), keep=[near_arm], elbow=(457, 370))
H.part('farmN', (424, 356, 494, 500), (457, 370), keep=[near_arm], hand=(458, 470))
H.part('uarmF', (306, 286, 360, 382), (338, 302), keep=[far_arm], elbow=(336, 370), shade=0.8)
H.part('farmF', (306, 356, 360, 500), (336, 370), keep=[far_arm], hand=(335, 470), shade=0.8)
# her near thigh: the trouser pocket hidden under her hand, filled with trouser colour
def thigh_fill(src, off):
    m = poly_mask(src.shape[1::-1], [H.poly(near_arm)], off); ys, xs = np.nonzero(m)
    for y, x in zip(ys, xs):
        rx = (H.W - 1 - (x + off[0])) if H.flip else x + off[0]
        src[y, x] = [0.17, 0.17, 0.20, 1] if rx < 470 else [0, 0, 0, 0]
H.part('thighN', (404, 412, 476, 600), (437, 432), knee=(440, 592), fill=thigh_fill)

# ---------------- 반장 (two stills straight at game size: standing, and the coffee) ----------------
B = load('foreman-concept.png')
BOSS_H = 80
def still(rect, foot):
    x0, y0, x1, y1 = rect; k = BOSS_H / (827 - 15)
    arr = shrink(B.crop(rect), (round((x1 - x0) * k), round((y1 - y0) * k)))
    return {'arr': arr, 'foot': [round((foot[0] - x0) * k), round((foot[1] - y0) * k)], 'k': k}
BS = {'stand': still((222, 10, 510, 832), (360, 827)), 'coffee': still((1350, 10, 1710, 832), (1490, 827))}

# ---------------- pack ----------------
items = [('jiwoo', n, p['arr'], p) for n, p in J.parts.items()] + [('haeun', n, p['arr'], p) for n, p in H.parts.items()] + [('boss', n, s['arr'], s) for n, s in BS.items()]
PAD, ROWW = 2, 512
x = y = rowh = 0; place = []
for who, n, arr, p in sorted(items, key=lambda it: -it[2].shape[0]):
    h, w = arr.shape[:2]
    if x + w + PAD > ROWW: x = 0; y += rowh + PAD; rowh = 0
    place.append((who, n, arr, p, x, y)); x += w + PAD; rowh = max(rowh, h)
atlas = Image.new('RGBA', (ROWW, y + rowh), (0, 0, 0, 0))
meta = {'jiwoo': {'scale': 4, 'parts': {}}, 'haeun': {'scale': 4, 'parts': {}}, 'boss': {'scale': 1, 'parts': {}}}
for who, n, arr, p, px, py in place:
    hard = 0.5 if who == 'boss' else None
    atlas.alpha_composite(to_img(arr, hard), (px, py))
    e = {'r': [px, py, arr.shape[1], arr.shape[0]]}
    e.update({k: v for k, v in p.items() if k not in ('arr', 'k')})
    meta[who]['parts'][n] = e
atlas.save(OUT_PNG, optimize=True)
json.dump(meta, open(OUT_JSON, 'w'), separators=(',', ':'))
print(atlas.size, {w: len(m['parts']) for w, m in meta.items()})

# the game keeps the parts' numbers inline (const CAST17_META = ...;): rewrite that line
import re
p = 'prototype/index.html'; s = open(p, encoding='utf-8').read()
s2, n = re.subn(r'^const CAST17_META = .*;$', lambda m: 'const CAST17_META = ' + json.dumps(meta, separators=(',', ':')) + ';', s, flags=re.M)
if n == 1: open(p, 'w', encoding='utf-8').write(s2); print('index.html: CAST17_META updated')
