# Remove a constant semi-transparent white logo by undoing its alpha blend: observed = a*255 + (1-a)*orig.
# The logo's alpha is estimated from frames where the patch around it is plain (low spread at the border).
import subprocess, sys, numpy as np
src, dst = sys.argv[1], sys.argv[2]
Wd, Ht = 1280, 720
X0, X1, Y0, Y1 = 1122, 1200, 560, 640          # the patch holding the logo
def frames():
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', src, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
    n = Wd * Ht * 3
    while True:
        b = p.stdout.read(n)
        if len(b) < n: break
        yield np.frombuffer(b, np.uint8).reshape(Ht, Wd, 3)
allf = list(frames())
# alpha from plain frames
ests = []
for f in allf:
    patch = f[Y0:Y1, X0:X1].astype(np.float32)
    ring = np.concatenate([patch[:4].reshape(-1, 3), patch[-4:].reshape(-1, 3), patch[:, :4].reshape(-1, 3), patch[:, -4:].reshape(-1, 3)])
    if ring.std(axis=0).max() > 6: continue
    bg = np.median(ring, axis=0)
    a = ((patch - bg) / np.maximum(1, 255 - bg)).mean(axis=2)
    ests.append(np.clip(a, 0, 0.95))
print('plain frames used:', len(ests))
A = np.median(np.stack(ests), axis=0)
A[A < 0.02] = 0
np.save(dst + '.alpha.npy', A)
print('alpha max', A.max().round(3), 'pixels', int((A > 0.05).sum()))
A *= 0.96                                       # a hair under, so the restored shape doesn't go darker than its surroundings
a3 = A[..., None]
# where the logo was, its edges leave a faint trace (compression); soften just there with a small blur of the restored patch
def box(img, r):
    out = img.copy()
    for ax in (0, 1):
        c = np.cumsum(np.pad(out, [(r + 1, r) if i == ax else (0, 0) for i in range(3)], mode='edge'), axis=ax)
        out = (np.take(c, range(2 * r + 1, c.shape[ax]), axis=ax) - np.take(c, range(0, c.shape[ax] - 2 * r - 1), axis=ax)) / (2 * r + 1)
    return out
m = box(np.repeat((A > 0.015).astype(np.float32)[..., None], 3, axis=2), 2)[..., :1]   # the logo's footprint, a little grown
w = np.clip(m * 1.4, 0, 1) * 0.75
enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{Wd}x{Ht}', '-r', '24', '-i', '-', '-i', src,
                        '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-crf', '15', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-c:a', 'copy', '-shortest', dst], stdin=subprocess.PIPE)
for f in allf:
    g = f.copy()
    patch = g[Y0:Y1, X0:X1].astype(np.float32)
    orig = (patch - a3 * 255) / np.maximum(0.05, 1 - a3)
    orig = orig * (1 - w) + box(orig, 3) * w
    g[Y0:Y1, X0:X1] = np.clip(orig, 0, 255).astype(np.uint8)
    enc.stdin.write(g.tobytes())
enc.stdin.close(); enc.wait()
print('done')
