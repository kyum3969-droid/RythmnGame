# 1-7's cast from docs/art/cast-rookie-style-study.png: the study is drawn as pixel art at about 10 screen pixels a dot, on a
# grid that drifts a little from figure to figure. For each figure this finds its own grid (pitch and phase, on each axis),
# takes the middle of every cell as one dot, keys out the navy background, and writes the figure at its true dot size.
import sys
import numpy as np
from PIL import Image

SRC = 'docs/art/cast-rookie-style-study.png'
FIGS = {'rookie': (60, 90, 420, 880), 'jiwoo': (470, 80, 720, 880), 'haeun': (780, 110, 1060, 880), 'boss': (1100, 90, 1470, 880)}
BG = np.array([41, 50, 67], float)

def grid(e, lo=9.0, hi=11.6):
    best = None
    for p in np.arange(lo, hi, 0.01):
        for ph in np.arange(0, p, 0.25):
            pos = np.arange(ph, len(e) - 1, p); v = e[np.round(pos).astype(int)].mean()
            if best is None or v > best[0]: best = (v, p, ph)
    return best[1], best[2]

def cut(name):
    x0, y0, x1, y1 = FIGS[name]
    im = np.asarray(Image.open(SRC).convert('RGB')).astype(float)[y0:y1, x0:x1]
    ex = np.abs(np.diff(im, axis=1)).sum(2).sum(0); ey = np.abs(np.diff(im, axis=0)).sum(2).sum(1)
    px, fx = grid(ex); py, fy = grid(ey)
    # cell k spans [f + k p, f + (k+1) p): its middle, a 3x3 median there
    nx = int((im.shape[1] - fx) // px); ny = int((im.shape[0] - fy) // py)
    out = np.zeros((ny, nx, 4), np.uint8)
    for j in range(ny):
        for i in range(nx):
            cx = int(round(fx + (i + 0.5) * px)); cy = int(round(fy + (j + 0.5) * py))
            c = np.median(im[max(0, cy - 2):cy + 3, max(0, cx - 2):cx + 3].reshape(-1, 3), 0)
            out[j, i, :3] = c.round(); out[j, i, 3] = 255
    # the background: the navy cells reached from the edge (a flood fill, so the navy inside an outline, 반장's cap, stays)
    near = np.abs(out[..., :3].astype(float) - BG).sum(2) <= 30
    seen = np.zeros(near.shape, bool); stack = [(j, i) for j in range(ny) for i in (0, nx - 1)] + [(j, i) for i in range(nx) for j in (0, ny - 1)]
    while stack:
        j, i = stack.pop()
        if not (0 <= j < ny and 0 <= i < nx) or seen[j, i] or not near[j, i]: continue
        seen[j, i] = True; stack += [(j + 1, i), (j - 1, i), (j, i + 1), (j, i - 1)]
    out[seen, 3] = 0
    a = out[..., 3] > 0; ys, xs = np.nonzero(a)
    out = out[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    return out, (px, py)

if __name__ == '__main__':
    for n in FIGS:
        o, p = cut(n); Image.fromarray(o, 'RGBA').save(sys.argv[1] + f'/{n}.png'); print(n, o.shape[1::-1], 'pitch %.2f %.2f' % p)
