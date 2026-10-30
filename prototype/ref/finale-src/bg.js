const bg = document.createElement('canvas'); bg.width = W; bg.height = H;
(() => {
  const b = bg.getContext('2d');
  const r = (x, y, w, h, c) => { b.fillStyle = c; b.fillRect(x, y, w, h); };
  r(0, 0, W, H, '#231b17');
  r(0, 0, W, 34, '#191311');
  for (let x = 0; x < W; x += 48) r(x, 0, 3, 34, '#211915');
  r(0, 34, W, 2, '#2e241f');
  for (let x = 24; x < W; x += 64) r(x, 36, 1, 132, '#2a211c');
  let seed = 1;
  const bays = [[66, 128], [214, 150]];
  for (const [x0, w] of bays) {
    r(x0, 44, 3, 124, '#41332a'); r(x0 + w - 3, 44, 3, 124, '#41332a');
    for (const y of [64, 100, 136]) {
      let x = x0 + 5;
      while (x < x0 + w - 16) {
        const bw = 9 + Math.floor(rnd(seed, 3) * 12), bh = 8 + Math.floor(rnd(seed, 4) * 16);
        const c = ['#5b4330', '#4f3a2a', '#66503a'][Math.floor(rnd(seed, 5) * 3)];
        r(x, y - bh, bw, bh, c); r(x, y - bh, bw, 1, '#76604a'); r(x + (bw >> 1), y - bh, 1, bh, '#6e5a42');
        x += bw + 2 + Math.floor(rnd(seed, 6) * 5); seed++;
      }
      r(x0, y, w, 3, '#4a3a2f'); r(x0, y + 3, w, 1, '#1d1714');
    }
  }
  r(186, 36, 1, 8, '#4a4038'); r(200, 36, 1, 8, '#4a4038');
  r(180, 44, 27, 15, '#d9a520'); r(180, 58, 27, 1, '#8a6a12');
  const three = ['111', '001', '111', '001', '111'];
  three.forEach((row, y) => [...row].forEach((v, x) => { if (v === '1') r(190 + x * 2, 46 + y * 2, 2, 2, '#1d1815'); }));
  r(0, 168, W, 48, '#18120f'); r(0, 168, W, 1, '#2e241f');
  for (let x = 0; x < W; x += 14) r(x, 200, 8, 3, '#c99a1e');
  r(0, 158, 34, 4, '#6b4a2e'); r(0, 162, 34, 2, '#4a3220'); r(2, 164, 4, 4, '#4a3220'); r(28, 164, 4, 4, '#4a3220');
  const sb = (x, y) => { r(x, y, 15, 13, C.kraft); r(x, y, 15, 2, C.kraftTop); r(x + 13, y + 2, 2, 11, C.kraftDark); r(x + 6, y, 3, 13, C.tape); };
  sb(1, 145); sb(17, 145); sb(1, 132); sb(17, 132); sb(9, 119);
})();
