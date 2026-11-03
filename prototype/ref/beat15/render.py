# 1-5 phase 2: 지우's bedroom beat, 4 a.m. — a cozy lo-fi loop that builds one layer at a time.
# 90 BPM, 4/4, C# major (I - vi - IV - V7: C#maj7, A#m7, F#maj7, G#7), 32 bars, then a clean stop.
# Writes the wav/mp3 and a JSON of every note it played (for the chart).
import json, sys
import numpy as np
from scipy import signal

SR = 44100
BPM = 90.0
SPB = 60.0 / BPM
BAR = 4 * SPB
LEAD = 0.10                      # the first downbeat, seconds into the file
BARS = 32
END = LEAD + BARS * BAR          # the stop
TOTAL = END + 1.6
N = int(TOTAL * SR)
rng = np.random.default_rng(15)

L_ = np.zeros(N); R_ = np.zeros(N)
notes = []   # (layer, bar, beat-in-bar, what)

def t_of(bar, beat):
    return LEAD + bar * BAR + beat * SPB

def add(sig, t, gain=1.0, pan=0.0):
    i = int(round(t * SR))
    if i >= N: return
    j = min(N, i + len(sig))
    s = sig[: j - i] * gain
    L_[i:j] += s * (1 - max(0, pan)) ; R_[i:j] += s * (1 + min(0, pan))

def env(n, a, d):
    """attack a s, exponential decay d s"""
    t = np.arange(n) / SR
    e = np.exp(-t / d)
    na = max(1, int(a * SR)); e[:na] *= np.linspace(0, 1, na)
    return e

def mfreq(m): return 440.0 * 2 ** ((m - 69) / 12)

def lp(x, f, order=2):
    b, a = signal.butter(order, f / (SR / 2), 'low'); return signal.lfilter(b, a, x)
def hp(x, f, order=2):
    b, a = signal.butter(order, f / (SR / 2), 'high'); return signal.lfilter(b, a, x)
def bp(x, f1, f2, order=2):
    b, a = signal.butter(order, [f1 / (SR / 2), f2 / (SR / 2)], 'band'); return signal.lfilter(b, a, x)

# ---------- instruments ----------
def clock(high):
    n = int(0.05 * SR); t = np.arange(n) / SR
    tone = np.sin(2 * np.pi * (3300 if high else 2500) * t) * np.exp(-t / 0.006)
    nz = bp(rng.standard_normal(n), 1800, 7000) * np.exp(-t / 0.004)
    body = np.sin(2 * np.pi * (900 if high else 700) * t) * np.exp(-t / 0.012) * 0.3
    return (tone * 0.5 + nz * 0.35 + body)

def ks_pluck(f, dur, damp=0.996, bright=0.5):
    """Karplus-Strong string"""
    n = int(dur * SR); p = max(2, int(SR / f))
    buf = rng.uniform(-1, 1, p); buf = lp(buf, 2500 + 4000 * bright, 1)
    out = np.zeros(n); idx = 0
    b = buf.copy()
    for i in range(n):
        out[i] = b[idx]
        nxt = (idx + 1) % p
        b[idx] = damp * 0.5 * (b[idx] + b[nxt])
        idx = nxt
    return out

def strum(midis, dur, muted, down=True, vel=1.0):
    order = midis if down else midis[::-1]
    n = int((dur + 0.1) * SR); out = np.zeros(n)
    for k, m in enumerate(order):
        s = ks_pluck(mfreq(m), dur, damp=0.990 if muted else 0.9975, bright=0.35 if muted else 0.6)
        s *= env(len(s), 0.002, 0.11 if muted else 0.9)
        o = int(k * 0.011 * SR)
        out[o:o + len(s)] += s[: n - o] * (0.9 - 0.08 * k)
    out = lp(out, 3200 if muted else 4500)
    return out * vel

def kick(v=1.0):
    n = int(0.42 * SR); t = np.arange(n) / SR
    f = 46 + 70 * np.exp(-t / 0.035)
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = np.sin(ph) * np.exp(-t / 0.16)
    click = lp(rng.standard_normal(n), 2500) * np.exp(-t / 0.004) * 0.25
    # a soft cardboard thump under it (a box set down)
    thump = lp(rng.standard_normal(n), 400) * np.exp(-t / 0.03) * 0.5
    return np.tanh((s + click + thump) * 1.4) * v

def snare(v=1.0):
    n = int(0.3 * SR); t = np.arange(n) / SR
    nz = bp(rng.standard_normal(n), 1400, 6500) * np.exp(-t / 0.09)
    tone = np.sin(2 * np.pi * 185 * t) * np.exp(-t / 0.05) * 0.5
    brush = bp(rng.standard_normal(n), 3000, 9000) * np.exp(-t / 0.16) * 0.35
    return (nz * 0.7 + tone + brush) * v

def hat(v=1.0, open_=False):
    n = int((0.18 if open_ else 0.05) * SR); t = np.arange(n) / SR
    return hp(rng.standard_normal(n), 7000) * np.exp(-t / (0.06 if open_ else 0.014)) * v

def bass(m, dur, v=1.0):
    n = int(dur * SR); t = np.arange(n) / SR; f = mfreq(m)
    s = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * 2 * f * t) + 0.1 * signal.sawtooth(2 * np.pi * f * t, 0.5)
    e = env(n, 0.006, dur * 0.55); e[-int(0.02 * SR):] *= np.linspace(1, 0, int(0.02 * SR))
    return lp(s * e, 900) * v

def glock(m, v=1.0):
    n = int(1.6 * SR); t = np.arange(n) / SR; f = mfreq(m)
    s = (np.sin(2 * np.pi * f * t) * np.exp(-t / 0.7) + 0.35 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t / 0.18)
         + 0.12 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t / 0.07))
    s[: int(0.002 * SR)] *= np.linspace(0, 1, int(0.002 * SR))
    return s * v

# ---------- the song ----------
CH = [  # C#maj7, A#m7, F#maj7, G#7 (guitar voicings, midi)
    [49, 56, 60, 65], [46, 53, 56, 61], [42, 49, 53, 58], [44, 51, 54, 60]]
ROOT = [37, 34, 30, 32]           # C#2, A#1, F#1, G#1 (bass an octave up below)
STRUM = [(0, True, 1.0), (1.5, False, 0.75), (2.5, True, 0.8), (3.0, True, 0.6)]   # (beat, down, vel); muted chops
MEL = [  # two bars of glockenspiel, (beat, midi)
    [(0, 80), (1, 77), (1.5, 75), (2, 73), (3, 75)],
    [(0, 77), (1, 80), (2, 82), (2.5, 80), (3.5, 77)]]

for bar in range(BARS):
    c = bar % 4
    # 1. the clock, all the way: tick on the beat, tock on the off-beat beats (2 and 4)
    for beat in range(4):
        add(clock(beat % 2 == 0), t_of(bar, beat), 0.8 if bar < 4 else 0.22, 0.2)
        notes.append(('clock', bar, beat, 'tick' if beat % 2 == 0 else 'tock'))
    # 2. guitar from bar 4
    if bar >= 4:
        for beat, down, vel in STRUM:
            sw = 0.04 * SPB if beat % 1 else 0
            add(strum(CH[c], 0.5 if beat else 0.9, muted=beat != 0, down=down, vel=vel), t_of(bar, beat) + sw, 0.62, -0.15)
            notes.append(('guitar', bar, beat, 'strum'))
    # 3. drums from bar 8: ba-dum kick on 1 (and a quarter beat after), kick on 3, brushed snare on 2 and 4, 8th hats swung
    if bar >= 8:
        add(kick(1.0), t_of(bar, 0), 0.42); add(kick(0.6), t_of(bar, 0.25), 0.42)
        add(kick(0.85), t_of(bar, 2), 0.42)
        if bar % 2 == 1: add(kick(0.5), t_of(bar, 3.5), 0.42)
        for beat in (1, 3): add(snare(1.0), t_of(bar, beat), 0.34, 0.05)
        for k in range(8):
            sw = 0.06 * SPB if k % 2 else 0
            add(hat(0.9 if k % 2 == 0 else 0.6, open_=(k == 7 and bar % 4 == 3)), t_of(bar, k / 2) + sw, 0.16, 0.25)
        notes.append(('drums', bar, 0, 'kick')); notes.append(('drums', bar, 0.25, 'kick2')); notes.append(('drums', bar, 1, 'snare'))
        notes.append(('drums', bar, 2, 'kick')); notes.append(('drums', bar, 3, 'snare'))
        if bar % 2 == 1: notes.append(('drums', bar, 3.5, 'kick'))
    # 4. bass from bar 12
    if bar >= 12:
        r = ROOT[c] + 12
        for beat, m, d in ((0, r, 1.3), (2, r, 0.9), (3.5, r + 7 if c % 2 == 0 else r + 5, 0.4)):
            add(bass(m, d), t_of(bar, beat), 0.3)
            notes.append(('bass', bar, beat, 'note'))
    # 5. the glockenspiel melody from bar 16 (an octave up from bar 28)
    if bar >= 16:
        up = 12 if bar >= 28 else 0
        for beat, m in MEL[bar % 2]:
            add(glock(m + up, 1.0), t_of(bar, beat), 0.24 if up == 0 else 0.18, 0.3)
            notes.append(('glock', bar, beat, 'note'))
    # a soft cymbal swell into the full section and into the last four bars
    if bar in (19, 27):
        n = int(BAR * SR); t = np.arange(n) / SR
        sw = hp(rng.standard_normal(n), 5000) * (t / (BAR)) ** 2 * 0.25
        add(sw, t_of(bar, 0), 0.5)

# the vinyl under everything: hiss and crackle
n = int(END * SR)
hiss = lp(hp(rng.standard_normal(n), 2000), 9000) * 0.006
L_[:n] += hiss; R_[:n] += hiss * 0.9
for k in range(int(END * 9)):
    i = rng.integers(0, n - 200); a = rng.uniform(0.02, 0.12) * (1 if rng.random() > 0.1 else 2.5)
    click = rng.standard_normal(40) * np.exp(-np.arange(40) / 6) * a
    L_[i:i + 40] += click; R_[i:i + 40] += click * rng.uniform(0.6, 1)

# tape: warm low-pass, soft saturation; the stop: a clean cut on the downbeat of bar 32 and a little switch click
mix = np.stack([L_, R_])
mix = lp(mix, 11000)
mix = np.tanh(mix * 1.1) / np.tanh(1.1)
ie = int(END * SR)
fade = int(0.008 * SR)
mix[:, ie - fade:ie] *= np.linspace(1, 0, fade)
mix[:, ie:] = 0
clk = hp(rng.standard_normal(int(0.012 * SR)), 1500) * np.exp(-np.arange(int(0.012 * SR)) / 60) * 0.08
mix[:, ie:ie + len(clk)] += clk
mix /= np.max(np.abs(mix)) / 0.89

out = sys.argv[1]
import soundfile as sf
sf.write(out + '.wav', mix.T, SR, subtype='PCM_16')
json.dump({'bpm': BPM, 'lead': LEAD, 'bars': BARS, 'end': END, 'notes': notes}, open(out + '.json', 'w'))
print('rendered', round(TOTAL, 2), 's, stop at', round(END, 3), 's,', len(notes), 'notes')
