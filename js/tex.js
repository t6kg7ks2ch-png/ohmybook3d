// ───────────────────────────── 오마이북 3D ─────────────────────────────
// 텍스처는 모두 캔버스로 절차 생성한다. 외부 이미지 파일 없음.
import * as THREE from 'three';

export function canvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
}

export function toTex(c, { repeat = [1, 1], srgb = true, clamp = false } = {}) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.wrapS = t.wrapT = clamp ? THREE.ClampToEdgeWrapping : THREE.RepeatWrapping;
  t.repeat.set(repeat[0], repeat[1]);
  t.anisotropy = 8;
  t.needsUpdate = true;
  return t;
}

const rnd = (a = 0, b = 1) => a + Math.random() * (b - a);
const rgb = (a) => `rgb(${a[0] | 0},${a[1] | 0},${a[2] | 0})`;
const rgba = (a, al) => `rgba(${a[0] | 0},${a[1] | 0},${a[2] | 0},${al})`;

/* ── 노출 콘크리트 (거푸집 격자선 + 철근 구멍) ── */
export function concreteWall({ size = 1024, base = [146, 139, 128], panels = 2 } = {}) {
  const c = canvas(size, size), g = c.getContext('2d');
  g.fillStyle = rgb(base); g.fillRect(0, 0, size, size);

  // 얼룩
  for (let i = 0; i < 420; i++) {
    const x = rnd(0, size), y = rnd(0, size), r = rnd(20, 190);
    const d = rnd(-26, 22);
    const grad = g.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, rgba([base[0] + d, base[1] + d, base[2] + d], rnd(0.02, 0.09)));
    grad.addColorStop(1, rgba([base[0], base[1], base[2]], 0));
    g.fillStyle = grad; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
  }
  // 미세 입자
  for (let i = 0; i < 12000; i++) {
    const a = Math.random();
    g.fillStyle = a > 0.5 ? `rgba(255,255,255,${rnd(0.01, 0.06)})` : `rgba(0,0,0,${rnd(0.01, 0.07)})`;
    g.fillRect(rnd(0, size), rnd(0, size), rnd(0.6, 2.2), rnd(0.6, 2.2));
  }
  // 세로 물자국
  for (let i = 0; i < 26; i++) {
    const x = rnd(0, size), w = rnd(1, 12), h = rnd(size * 0.15, size * 0.8);
    const grad = g.createLinearGradient(x, 0, x + w, 0);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(0.5, `rgba(60,54,46,${rnd(0.02, 0.07)})`);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grad; g.fillRect(x, rnd(0, size - h), w, h);
  }
  // 거푸집 이음선
  const step = size / panels;
  g.strokeStyle = 'rgba(58,52,45,.34)'; g.lineWidth = 2.4;
  for (let i = 1; i < panels; i++) {
    g.beginPath(); g.moveTo(i * step, 0); g.lineTo(i * step, size); g.stroke();
    g.beginPath(); g.moveTo(0, i * step); g.lineTo(size, i * step); g.stroke();
  }
  // 이음선 옆 밝은 하이라이트
  g.strokeStyle = 'rgba(255,255,255,.05)'; g.lineWidth = 3;
  for (let i = 1; i < panels; i++) {
    g.beginPath(); g.moveTo(i * step + 2, 0); g.lineTo(i * step + 2, size); g.stroke();
  }
  // 철근 구멍
  for (let i = 0; i < panels; i++) {
    for (let j = 0; j < panels; j++) {
      const cx = (i + 0.5) * step + rnd(-8, 8), cy = (j + 0.5) * step + rnd(-8, 8);
      g.beginPath(); g.arc(cx, cy, 5.5, 0, 7);
      g.fillStyle = 'rgba(40,36,31,.28)'; g.fill();
      g.beginPath(); g.arc(cx, cy + 1.6, 4.4, 0, 7);
      g.fillStyle = 'rgba(30,27,23,.5)'; g.fill();
      // 녹물
      const grad = g.createLinearGradient(cx, cy, cx, cy + 90);
      grad.addColorStop(0, 'rgba(96,66,40,.16)');
      grad.addColorStop(1, 'rgba(96,66,40,0)');
      g.fillStyle = grad; g.fillRect(cx - 3, cy, 6, 90);
    }
  }
  return toTex(c, { clamp: true });
}

/* ── 광택 에폭시 바닥 ── */
export function polishedFloor() {
  const s = 1024;
  const c = canvas(s, s), g = c.getContext('2d');
  const grd = g.createLinearGradient(0, 0, s, s);
  grd.addColorStop(0, '#2a2018'); grd.addColorStop(0.5, '#33271c'); grd.addColorStop(1, '#241b14');
  g.fillStyle = grd; g.fillRect(0, 0, s, s);

  // 큰 얼룩 (시공 흔적)
  for (let i = 0; i < 90; i++) {
    const x = rnd(0, s), y = rnd(0, s), r = rnd(60, 320);
    const t = rnd(0, 1);
    const col = t > 0.65 ? [70, 50, 32] : t > 0.3 ? [46, 33, 22] : [30, 22, 16];
    const grad = g.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, rgba(col, rnd(0.05, 0.22)));
    grad.addColorStop(1, rgba(col, 0));
    g.fillStyle = grad; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
  }
  // 잔 자갈 눌린 자국
  for (let i = 0; i < 2600; i++) {
    const x = rnd(0, s), y = rnd(0, s), r = rnd(0.6, 3.4);
    g.beginPath(); g.arc(x, y, r, 0, 7);
    g.fillStyle = Math.random() > 0.5 ? `rgba(120,95,66,${rnd(0.03, 0.13)})` : `rgba(10,7,4,${rnd(0.05, 0.18)})`;
    g.fill();
  }
  // 반사 줄
  for (let i = 0; i < 16; i++) {
    g.save(); g.translate(rnd(0, s), rnd(0, s)); g.rotate(rnd(-0.4, 0.4));
    const grad = g.createLinearGradient(0, 0, rnd(120, 420), 0);
    grad.addColorStop(0, 'rgba(255,226,180,0)');
    grad.addColorStop(0.5, `rgba(255,226,180,${rnd(0.012, 0.05)})`);
    grad.addColorStop(1, 'rgba(255,226,180,0)');
    g.fillStyle = grad; g.fillRect(0, 0, 420, rnd(3, 16));
    g.restore();
  }
  return toTex(c, { repeat: [3, 3] });
}

export function floorRoughness() {
  const s = 512;
  const c = canvas(s, s), g = c.getContext('2d');
  g.fillStyle = '#3a3a3a'; g.fillRect(0, 0, s, s);
  for (let i = 0; i < 120; i++) {
    const x = rnd(0, s), y = rnd(0, s), r = rnd(30, 200);
    const grad = g.createRadialGradient(x, y, 0, x, y, r);
    const v = Math.random() > 0.5 ? 90 : 30;
    grad.addColorStop(0, `rgba(${v},${v},${v},${rnd(0.2, 0.6)})`);
    grad.addColorStop(1, 'rgba(60,60,60,0)');
    g.fillStyle = grad; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
  }
  return toTex(c, { repeat: [3, 3], srgb: false });
}

/* ── 나무 (결) ── */
export function wood({ w = 512, h = 512, base = [138, 90, 50], dark = [78, 46, 24], lines = 130, vertical = true, knots = 3 } = {}) {
  const c = canvas(w, h), g = c.getContext('2d');
  g.fillStyle = rgb(base); g.fillRect(0, 0, w, h);
  // 결 흐름
  for (let i = 0; i < lines; i++) {
    const p = rnd(0, vertical ? w : h);
    const lw = rnd(0.5, 3.2);
    g.strokeStyle = rgba(dark, rnd(0.03, 0.16));
    g.lineWidth = lw;
    g.beginPath();
    if (vertical) {
      const amp = rnd(2, 16), ph = rnd(0, 6);
      for (let y = 0; y <= h; y += 12) {
        const x = p + Math.sin(y / h * 5 + ph) * amp;
        y === 0 ? g.moveTo(x, y) : g.lineTo(x, y);
      }
    } else {
      const amp = rnd(2, 16), ph = rnd(0, 6);
      for (let x = 0; x <= w; x += 12) {
        const y = p + Math.sin(x / w * 5 + ph) * amp;
        x === 0 ? g.moveTo(x, y) : g.lineTo(x, y);
      }
    }
    g.stroke();
  }
  // 옹이
  for (let k = 0; k < knots; k++) {
    const x = rnd(0, w), y = rnd(0, h);
    for (let i = 6; i > 0; i--) {
      g.beginPath(); g.ellipse(x, y, i * rnd(4, 7), i * rnd(3, 5), rnd(0, 3), 0, 7);
      g.strokeStyle = rgba(dark, 0.05 + i * 0.012); g.lineWidth = 1.4; g.stroke();
    }
  }
  // 밝은 부분
  for (let i = 0; i < 60; i++) {
    g.fillStyle = `rgba(255,240,215,${rnd(0.01, 0.05)})`;
    g.fillRect(rnd(0, w), rnd(0, h), rnd(20, 140), rnd(1, 4));
  }
  return toTex(c, { clamp: true });
}

/* ── 텍스트 (투명 배경 지원) ── */
export function textTexture(lines, opts = {}) {
  const {
    w = 1024, h = 512, bg = null, color = '#2b2724',
    font = '500 92px "Apple SD Gothic Neo","Noto Sans KR",sans-serif',
    align = 'left', baseline = 'top', lineHeight = 1.28, pad = 40,
    letterSpacing = 0, vertical = false, italic = false,
  } = opts;
  const c = canvas(w, h), g = c.getContext('2d');
  if (bg) { g.fillStyle = bg; g.fillRect(0, 0, w, h); }
  g.fillStyle = color;
  g.textBaseline = baseline;
  g.textAlign = align;
  const arr = Array.isArray(lines) ? lines : [lines];
  const lh = parseInt(font.match(/(\d+)px/)[1], 10) * lineHeight;
  const x = align === 'center' ? w / 2 : align === 'right' ? w - pad : pad;
  let y = baseline === 'top' ? pad + parseInt(font.match(/(\d+)px/)[1], 10) * 0.86 : h / 2;
  for (const line of arr) {
    if (vertical) {
      let yy = pad;
      for (const ch of line) {
        g.fillText(ch, x, yy);
        yy += lh;
      }
      break;
    }
    let px = x;
    if (letterSpacing) {
      const total = [...line].reduce((a, ch) => a + g.measureText(ch).width + letterSpacing, 0);
      if (align === 'center') px = (w - total) / 2;
      for (const ch of line) {
        g.fillText(ch, px, y);
        px += g.measureText(ch).width + letterSpacing;
      }
    } else {
      g.fillText(line, px, y);
    }
    y += lh;
  }
  return toTex(c, { clamp: true });
}

/* ── 책 표지 ── */
export function bookCover(book) {
  const W = 512, H = 760;
  const c = canvas(W, H), g = c.getContext('2d');
  const { bg, ink, accent, motif } = book.cover;
  g.fillStyle = bg; g.fillRect(0, 0, W, H);

  // 종이 질감
  for (let i = 0; i < 2600; i++) {
    g.fillStyle = Math.random() > 0.5 ? `rgba(255,255,255,${rnd(0.008, 0.03)})` : `rgba(0,0,0,${rnd(0.005, 0.025)})`;
    g.fillRect(rnd(0, W), rnd(0, H), rnd(1, 4), rnd(1, 4));
  }

  g.save();
  if (motif === 'sun') {
    const grd = g.createRadialGradient(W * 0.5, H * 0.42, 0, W * 0.5, H * 0.42, 240);
    grd.addColorStop(0, accent); grd.addColorStop(1, 'rgba(0,0,0,0)');
    g.globalAlpha = 0.5; g.fillStyle = grd; g.beginPath(); g.arc(W * 0.5, H * 0.42, 240, 0, 7); g.fill();
    g.globalAlpha = 1; g.beginPath(); g.arc(W * 0.5, H * 0.44, 86, 0, 7); g.fillStyle = accent; g.fill();
    g.strokeStyle = ink; g.globalAlpha = 0.25; g.lineWidth = 1.4;
    for (let i = 1; i < 7; i++) { g.beginPath(); g.arc(W * 0.5, H * 0.44, 86 + i * 26, Math.PI, 2 * Math.PI); g.stroke(); }
  } else if (motif === 'star') {
    g.fillStyle = accent;
    const pts = [[0.72, 0.16, 16], [0.3, 0.1, 7], [0.82, 0.34, 5], [0.22, 0.28, 4], [0.55, 0.05, 3]];
    for (const [px, py, r] of pts) { g.beginPath(); g.arc(W * px, H * py, r, 0, 7); g.fill(); }
    // 작은 왕자 실루엣
    g.globalAlpha = 0.85; g.fillStyle = accent;
    g.beginPath(); g.arc(W * 0.52, H * 0.62, 11, 0, 7); g.fill();
    g.fillRect(W * 0.52 - 8, H * 0.63, 16, 44);
    g.fillRect(W * 0.52 - 26, H * 0.65, 20, 3);
    g.fillRect(W * 0.52 + 6, H * 0.65, 26, 3);
    g.globalAlpha = 1;
    g.strokeStyle = accent; g.globalAlpha = 0.35; g.lineWidth = 1;
    for (let i = 0; i < 40; i++) { g.beginPath(); g.arc(rnd(0, W), rnd(0, H * 0.55), rnd(0.6, 1.8), 0, 7); g.fill(); }
    g.globalAlpha = 1;
  } else if (motif === 'blob') {
    g.fillStyle = accent; g.globalAlpha = 0.9;
    g.beginPath();
    g.ellipse(W * 0.5, H * 0.5, 130, 108, 0.2, 0, 7); g.fill();
    g.globalAlpha = 0.35; g.strokeStyle = ink; g.lineWidth = 3;
    g.beginPath(); g.ellipse(W * 0.5, H * 0.5, 150, 126, 0.2, 0, 7); g.stroke();
    g.globalAlpha = 1;
  } else if (motif === 'line') {
    g.strokeStyle = accent; g.lineWidth = 3;
    for (let i = 0; i < 5; i++) {
      g.beginPath(); g.moveTo(W * 0.18, H * (0.2 + i * 0.13)); g.lineTo(W * (0.62 + i * 0.03), H * (0.2 + i * 0.13)); g.stroke();
    }
    g.globalAlpha = 0.2; g.strokeStyle = ink; g.lineWidth = 1;
    g.strokeRect(28, 28, W - 56, H - 56); g.globalAlpha = 1;
  } else if (motif === 'arch') {
    g.fillStyle = accent; g.globalAlpha = 0.8;
    g.beginPath(); g.moveTo(W * 0.24, H * 0.58); g.arc(W * 0.5, H * 0.58, W * 0.26, Math.PI, 0); g.lineTo(W * 0.76, H * 0.34); g.closePath(); g.fill();
    g.globalAlpha = 1;
  } else if (motif === 'grid') {
    g.strokeStyle = accent; g.globalAlpha = 0.55; g.lineWidth = 1.6;
    for (let i = 0; i < 9; i++) { g.beginPath(); g.moveTo(W * 0.16 + i * 30, H * 0.18); g.lineTo(W * 0.16 + i * 30, H * 0.56); g.stroke(); }
    for (let i = 0; i < 7; i++) { g.beginPath(); g.moveTo(W * 0.16, H * 0.18 + i * 32); g.lineTo(W * 0.16 + 240, H * 0.18 + i * 32); g.stroke(); }
    g.globalAlpha = 1;
  } else if (motif === 'wave') {
    g.strokeStyle = accent; g.lineWidth = 2.4;
    for (let k = 0; k < 4; k++) {
      g.beginPath();
      for (let x = 0; x <= W; x += 8) {
        const y = H * 0.4 + Math.sin(x / 60 + k * 0.9) * 22 + k * 14;
        x === 0 ? g.moveTo(x, y) : g.lineTo(x, y);
      }
      g.stroke();
    }
  } else if (motif === 'dot') {
    g.fillStyle = accent;
    for (let i = 0; i < 9; i++) for (let j = 0; j < 9; j++) {
      const a = 0.5 + 0.5 * Math.sin((i + j) * 0.7);
      g.globalAlpha = 0.25 + a * 0.5;
      g.beginPath(); g.arc(W * 0.2 + i * 32, H * 0.22 + j * 32, 6 * a + 2, 0, 7); g.fill();
    }
    g.globalAlpha = 1;
  }
  g.restore();

  // 제목
  const words = book.title.split(' ');
  const lines = [];
  let cur = '';
  const maxChars = book.title.length > 16 ? 7 : 9;
  for (const wd of words) {
    if ((cur + ' ' + wd).trim().length > maxChars && cur) { lines.push(cur); cur = wd; }
    else cur = (cur + ' ' + wd).trim();
  }
  if (cur) lines.push(cur);
  g.fillStyle = ink;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  const fs = lines.length > 2 ? 46 : 54;
  g.font = `600 ${fs}px "Apple SD Gothic Neo","Noto Sans KR",sans-serif`;
  const startY = H * 0.72 - (lines.length - 1) * fs * 0.62;
  lines.forEach((ln, i) => g.fillText(ln, W / 2, startY + i * fs * 1.28));

  // 저자 / 마크
  g.font = '400 21px "Apple SD Gothic Neo","Noto Sans KR",sans-serif';
  g.globalAlpha = 0.62;
  if (book.author) g.fillText(book.author, W / 2, startY + lines.length * fs * 1.28 + 22);
  g.globalAlpha = 1;
  g.font = '500 17px "Inter",sans-serif';
  g.fillStyle = 'rgba(0,0,0,.34)';
  g.fillText('OH MY BOOK', W / 2, H - 44);

  // 책등 그림자
  const sh = g.createLinearGradient(0, 0, 46, 0);
  sh.addColorStop(0, 'rgba(0,0,0,.42)'); sh.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = sh; g.fillRect(0, 0, 46, H);
  const hl = g.createLinearGradient(W, 0, W - 26, 0);
  hl.addColorStop(0, 'rgba(255,255,255,.14)'); hl.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = hl; g.fillRect(W - 26, 0, 26, H);
  return c;
}

/* ── 엽서 벽 (수백 장의 엽서 콜라주) ── */
export function postcardWallTexture(w = 1400, h = 1800) {
  const c = canvas(w, h), g = c.getContext('2d');
  g.fillStyle = '#cfc7ba'; g.fillRect(0, 0, w, h);
  // 벽 얼룩
  for (let i = 0; i < 200; i++) {
    const x = rnd(0, w), y = rnd(0, h), r = rnd(40, 220);
    const grd = g.createRadialGradient(x, y, 0, x, y, r);
    grd.addColorStop(0, `rgba(120,110,96,${rnd(0.01, 0.06)})`);
    grd.addColorStop(1, 'rgba(120,110,96,0)');
    g.fillStyle = grd; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
  }
  const palettes = [
    ['#f6f1e6', '#d9cbb3'], ['#efe7d8', '#b9c3bd'], ['#f3e9dd', '#cbb4a4'],
    ['#f7f3ea', '#a8b5b0'], ['#eee3d3', '#c4a48f'], ['#f4efe2', '#8f9c98'],
    ['#e9e0d2', '#b7a58e'], ['#f2ece0', '#9aa7a4'],
  ];
  const marks = ['#6d5b4a', '#8b5b4a', '#40565a', '#7a6a4e', '#5b4a55', '#3d4a3f'];
  // 그리드 + 회전
  for (let row = 0; row < 22; row++) {
    for (let col = 0; col < 14; col++) {
      if (Math.random() < 0.06) continue;
      const cw = rnd(78, 96), ch = cw * rnd(0.66, 0.74);
      const x = col * 100 + rnd(-6, 6) + 12;
      const y = row * 82 + rnd(-8, 8) + 10;
      const rot = rnd(-0.14, 0.14);
      g.save(); g.translate(x + cw / 2, y + ch / 2); g.rotate(rot);
      g.fillStyle = 'rgba(0,0,0,.13)'; g.fillRect(-cw / 2 + 2, -ch / 2 + 3, cw, ch);
      const p = palettes[(Math.random() * palettes.length) | 0];
      g.fillStyle = p[0]; g.fillRect(-cw / 2, -ch / 2, cw, ch);
      const kind = Math.random();
      if (kind < 0.42) {
        // 사진 느낌
        const grd = g.createLinearGradient(0, -ch / 2, 0, ch / 2);
        grd.addColorStop(0, p[1]); grd.addColorStop(1, '#efe6d6');
        g.fillStyle = grd; g.fillRect(-cw / 2 + 4, -ch / 2 + 4, cw - 8, ch - 20);
        g.fillStyle = 'rgba(255,255,255,.35)';
        g.beginPath(); g.arc(rnd(-cw / 4, cw / 4), rnd(-ch / 4, ch / 5), rnd(3, 9), 0, 7); g.fill();
        g.fillStyle = 'rgba(90,80,66,.3)'; g.fillRect(-cw / 2 + 4, ch / 2 - 16, rnd(20, cw - 12), 2);
      } else if (kind < 0.72) {
        // 손글씨
        g.strokeStyle = marks[(Math.random() * marks.length) | 0];
        g.lineWidth = 1;
        g.globalAlpha = 0.65;
        const n = 3 + ((Math.random() * 4) | 0);
        for (let i = 0; i < n; i++) {
          const ly = -ch / 2 + 14 + i * (ch - 24) / n;
          g.beginPath();
          for (let xx = -cw / 2 + 8; xx < cw / 2 - 8; xx += 3) {
            const yy = ly + Math.sin(xx * 0.5 + i) * 1.4 + rnd(-0.6, 0.6);
            xx === -cw / 2 + 8 ? g.moveTo(xx, yy) : g.lineTo(xx, yy);
          }
          g.stroke();
        }
        g.globalAlpha = 1;
      } else {
        // 그림/도형
        g.fillStyle = p[1];
        g.beginPath(); g.arc(rnd(-cw / 5, cw / 5), 0, rnd(8, 20), 0, 7); g.fill();
        g.fillStyle = 'rgba(255,255,255,.4)'; g.fillRect(-cw / 2 + 6, ch / 2 - 12, cw - 12, 4);
      }
      // 테이프
      if (Math.random() < 0.45) {
        g.fillStyle = `rgba(255,255,255,${rnd(0.25, 0.6)})`;
        g.save(); g.rotate(rnd(-0.5, 0.5));
        g.fillRect(-14, -ch / 2 - 6, rnd(14, 26), 12);
        g.restore();
      }
      g.restore();
    }
  }
  return toTex(c, { clamp: true });
}

/* ── Oh My Menu 타공판 ── */
export function menuBoardTexture() {
  const W = 640, H = 900;
  const c = canvas(W, H), g = c.getContext('2d');
  g.fillStyle = '#141210'; g.fillRect(0, 0, W, H);
  // 타공 구멍
  g.fillStyle = 'rgba(255,255,255,.06)';
  for (let x = 16; x < W; x += 28) for (let y = 16; y < H; y += 28) { g.beginPath(); g.arc(x, y, 2.2, 0, 7); g.fill(); }
  g.textAlign = 'left';
  g.fillStyle = '#f2ece1';
  g.font = '600 62px "Apple SD Gothic Neo","Noto Sans KR",sans-serif';
  g.fillText('Oh My Menu', 44, 104);
  g.font = '400 22px "Inter",sans-serif';
  g.fillStyle = 'rgba(242,236,225,.45)';
  g.fillText('STAY ON PAGE · CHEONGDO', 46, 140);
  g.strokeStyle = 'rgba(242,236,225,.22)'; g.lineWidth = 1;
  g.beginPath(); g.moveTo(46, 168); g.lineTo(W - 46, 168); g.stroke();

  const items = [
    ['아메리카노', 'Espresso + water'],
    ['라떼', 'Espresso + steamed milk'],
    ['바닐라라떼', 'Vanilla syrup + latte'],
    ['오늘의 차', 'With tea, stay book'],
    ['바게트', 'Baked this morning'],
    ['사워도우', 'Long fermented'],
    ['롤치즈치아바타', 'Chewy & cheesy'],
  ];
  let y = 226;
  g.font = '500 30px "Apple SD Gothic Neo","Noto Sans KR",sans-serif';
  for (const [kr, en] of items) {
    g.fillStyle = '#f2ece1'; g.fillText(kr, 46, y);
    g.font = '400 18px "Inter",sans-serif';
    g.fillStyle = 'rgba(242,236,225,.4)'; g.fillText(en, 46, y + 24);
    g.font = '500 30px "Apple SD Gothic Neo","Noto Sans KR",sans-serif';
    y += 84;
  }
  g.fillStyle = 'rgba(201,162,122,.85)';
  g.font = '500 24px "Apple SD Gothic Neo","Noto Sans KR",sans-serif';
  g.fillText('직접 내려 먹는 커피', 46, H - 70);
  g.font = '400 18px "Inter",sans-serif';
  g.fillStyle = 'rgba(242,236,225,.35)';
  g.fillText('press the machine →', 46, H - 40);
  return toTex(c, { clamp: true });
}

/* ── 필사의 산책 포스터 ── */
export function posterTexture() {
  const W = 420, H = 560;
  const c = canvas(W, H), g = c.getContext('2d');
  g.fillStyle = '#e8a13c'; g.fillRect(0, 0, W, H);
  g.fillStyle = '#2a2118';
  g.font = '700 44px "Apple SD Gothic Neo","Noto Sans KR",sans-serif';
  g.textAlign = 'center';
  g.fillText('필사의 산책', W / 2, 84);
  g.font = '400 19px "Apple SD Gothic Neo","Noto Sans KR",sans-serif';
  g.globalAlpha = 0.8;
  const lines = ['한 줄을 옮겨 쓰는 동안', '마음은 조금 느려집니다.', '', '좋아하는 문장을 적어', '편지함에 넣어 주세요.', '', '오마이북 · 청도'];
  lines.forEach((l, i) => g.fillText(l, W / 2, 150 + i * 34));
  g.globalAlpha = 1;
  // 손글씨 선
  g.strokeStyle = 'rgba(42,33,24,.4)'; g.lineWidth = 1.4;
  for (let i = 0; i < 5; i++) {
    g.beginPath();
    for (let x = 60; x < W - 60; x += 4) {
      const y = 440 + i * 18 + Math.sin(x * 0.4 + i) * 1.6;
      x === 60 ? g.moveTo(x, y) : g.lineTo(x, y);
    }
    g.stroke();
  }
  return toTex(c, { clamp: true });
}

/* ── 안내 표찰 ── */
export function signTexture(text, opts = {}) {
  const { w = 900, h = 200, bg = '#f5f0e6', color = '#26221c', font = '600 52px "Apple SD Gothic Neo","Noto Sans KR",sans-serif', border = false } = opts;
  const c = canvas(w, h), g = c.getContext('2d');
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  if (border) { g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 4; g.strokeRect(6, 6, w - 12, h - 12); }
  g.fillStyle = color; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = font;
  const lines = Array.isArray(text) ? text : [text];
  lines.forEach((l, i) => g.fillText(l, w / 2, h / 2 + (i - (lines.length - 1) / 2) * (parseInt(font.match(/(\d+)px/)[1]) * 1.35)));
  return toTex(c, { clamp: true });
}

/* ── 커피 게이지 요소에 쓰는 원형 라벨 ── */
export function cupLabelTexture(title, sub) {
  const S = 512;
  const c = canvas(S, S), g = c.getContext('2d');
  g.fillStyle = '#efe7da'; g.fillRect(0, 0, S, S);
  g.fillStyle = '#2a231c';
  g.textAlign = 'center';
  g.font = '600 54px "Apple SD Gothic Neo","Noto Sans KR",sans-serif';
  g.fillText(title, S / 2, S / 2 - 10);
  g.font = '400 24px "Inter",sans-serif';
  g.fillStyle = 'rgba(42,35,28,.55)';
  g.fillText(sub, S / 2, S / 2 + 40);
  return toTex(c, { clamp: true });
}

/* ── 파티클 (증기/물방울) ── */
export function softCircleTexture(inner = 'rgba(255,255,255,.9)', outer = 'rgba(255,255,255,0)') {
  const S = 128;
  const c = canvas(S, S), g = c.getContext('2d');
  const grd = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  grd.addColorStop(0, inner); grd.addColorStop(0.45, 'rgba(255,255,255,.35)'); grd.addColorStop(1, outer);
  g.fillStyle = grd; g.fillRect(0, 0, S, S);
  return toTex(c, { clamp: true });
}

/* ── 2층 밝은 베이지·그레이 에폭시 바닥 ── */
export function lightEpoxyFloor() {
  const s = 1024;
  const c = canvas(s, s), g = c.getContext('2d');
  const grd = g.createLinearGradient(0, 0, s, s);
  grd.addColorStop(0, '#d3ccbb'); grd.addColorStop(0.35, '#dbd5c5'); grd.addColorStop(0.65, '#c8c2b1'); grd.addColorStop(1, '#d6d0bf');
  g.fillStyle = grd; g.fillRect(0, 0, s, s);
  // 큰 얼룩 (시공 흔적)
  for (let i = 0; i < 120; i++) {
    const x = rnd(0, s), y = rnd(0, s), r = rnd(60, 330);
    const t = rnd(0, 1);
    const col = t > 0.6 ? [232, 226, 212] : t > 0.3 ? [190, 184, 170] : [205, 198, 183];
    const grad = g.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, rgba(col, rnd(0.04, 0.18)));
    grad.addColorStop(1, rgba(col, 0));
    g.fillStyle = grad; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
  }
  // 잔 입자
  for (let i = 0; i < 5200; i++) {
    const x = rnd(0, s), y = rnd(0, s), r = rnd(0.5, 2.6);
    g.beginPath(); g.arc(x, y, r, 0, 7);
    g.fillStyle = Math.random() > 0.5 ? `rgba(255,252,244,${rnd(0.04, 0.16)})` : `rgba(120,112,98,${rnd(0.03, 0.11)})`;
    g.fill();
  }
  // 광택 반사 줄
  for (let i = 0; i < 20; i++) {
    g.save(); g.translate(rnd(0, s), rnd(0, s)); g.rotate(rnd(-0.5, 0.5));
    const grad = g.createLinearGradient(0, 0, rnd(140, 460), 0);
    grad.addColorStop(0, 'rgba(255,255,255,0)');
    grad.addColorStop(0.5, `rgba(255,255,255,${rnd(0.05, 0.14)})`);
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grad; g.fillRect(0, 0, 460, rnd(3, 14));
    g.restore();
  }
  // 미세 균열
  g.strokeStyle = 'rgba(120,110,96,.08)'; g.lineWidth = 1;
  for (let i = 0; i < 12; i++) {
    g.beginPath();
    let x = rnd(0, s), y = rnd(0, s);
    g.moveTo(x, y);
    for (let k = 0; k < 8; k++) { x += rnd(-40, 40); y += rnd(-40, 40); g.lineTo(x, y); }
    g.stroke();
  }
  return toTex(c, { repeat: [2.4, 2.4] });
}

/* ── 2층 창밖 파노라마 (청도 산과 마을) ── */
export function mountainViewTexture(w = 1600, h = 700, variant = 'far') {
  const c = canvas(w, h), g = c.getContext('2d');
  const sky = g.createLinearGradient(0, 0, 0, h * 0.75);
  sky.addColorStop(0, '#7fb2d8'); sky.addColorStop(0.45, '#b9d6e6'); sky.addColorStop(1, '#e8e6da');
  g.fillStyle = sky; g.fillRect(0, 0, w, h);
  // 구름
  for (let i = 0; i < 26; i++) {
    const x = rnd(0, w), y = rnd(h * 0.05, h * 0.4), r = rnd(40, 190);
    const grd = g.createRadialGradient(x, y, 0, x, y, r);
    grd.addColorStop(0, `rgba(255,255,255,${rnd(0.25, 0.6)})`);
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd; g.beginPath(); g.ellipse(x, y, r, r * 0.45, 0, 0, 7); g.fill();
  }
  // 먼 산맥 3겹
  const ranges = [
    { y: h * 0.52, amp: h * 0.1, col: '#8fa4b4', step: 220 },
    { y: h * 0.6, amp: h * 0.09, col: '#7d8f9c', step: 160 },
    { y: h * 0.68, amp: h * 0.07, col: '#6e7f83', step: 120 },
  ];
  ranges.forEach((r, idx) => {
    g.beginPath();
    g.moveTo(0, h);
    for (let x = 0; x <= w; x += r.step) {
      const y = r.y - Math.abs(Math.sin(x * 0.004 + idx)) * r.amp - rnd(0, r.amp * 0.4);
      g.lineTo(x, y);
    }
    g.lineTo(w, h);
    g.closePath();
    g.fillStyle = r.col; g.fill();
    // 능선 하이라이트
    g.strokeStyle = 'rgba(255,255,255,.18)'; g.lineWidth = 2; g.stroke();
  });
  // 마을 · 밭
  const ground = g.createLinearGradient(0, h * 0.7, 0, h);
  ground.addColorStop(0, '#b3ac93'); ground.addColorStop(1, '#8d8a72');
  g.fillStyle = ground; g.fillRect(0, h * 0.7, w, h * 0.3);
  for (let i = 0; i < 200; i++) {
    g.fillStyle = `rgba(${120 + rnd(-30, 40) | 0},${110 + rnd(-30, 40) | 0},${80 + rnd(-20, 40) | 0},${rnd(0.06, 0.22)})`;
    g.fillRect(rnd(0, w), h * 0.72 + rnd(0, h * 0.28), rnd(20, 160), rnd(6, 40));
  }
  // 집들
  for (let i = 0; i < 16; i++) {
    const x = rnd(0, w), y = h * (0.72 + rnd(0, 0.16)), ww = rnd(40, 110), hh = rnd(26, 46);
    g.fillStyle = `rgba(${200 + rnd(-20, 20) | 0},${196 + rnd(-20, 20) | 0},${186 + rnd(-20, 20) | 0},.9)`;
    g.fillRect(x, y, ww, hh);
    g.fillStyle = 'rgba(70,74,78,.85)';
    g.beginPath(); g.moveTo(x - 8, y); g.lineTo(x + ww / 2, y - hh * 0.55); g.lineTo(x + ww + 8, y); g.closePath(); g.fill();
  }
  // 나무
  for (let i = 0; i < 90; i++) {
    const x = rnd(0, w), y = h * (0.7 + rnd(0, 0.2)), rr = rnd(10, 34);
    g.fillStyle = `rgba(${150 + rnd(-30, 20) | 0},${110 + rnd(-20, 40) | 0},${70 + rnd(-20, 30) | 0},${rnd(0.3, 0.8)})`;
    g.beginPath(); g.arc(x, y, rr, 0, 7); g.fill();
  }
  // 전주 · 전선
  g.strokeStyle = 'rgba(60,55,50,.55)'; g.lineWidth = 3;
  for (const px of [w * 0.35, w * 0.72]) {
    g.beginPath(); g.moveTo(px, h * 0.66); g.lineTo(px, h * 0.95); g.stroke();
    g.beginPath(); g.moveTo(px - 18, h * 0.7); g.lineTo(px + 18, h * 0.7); g.stroke();
  }
  g.strokeStyle = 'rgba(60,55,50,.28)'; g.lineWidth = 1.2;
  for (let i = 0; i < 4; i++) {
    g.beginPath();
    for (let x = 0; x <= w; x += 20) g.lineTo(x, h * 0.66 + Math.sin(x * 0.01 + i) * 6 + i * 5);
    g.stroke();
  }
  return toTex(c, { clamp: true });
}

/* ── 창밖 배경 (나무 울타리 · 겨울 하늘) ── */
export function outsideTexture() {
  const W = 900, H = 1200;
  const c = canvas(W, H), g = c.getContext('2d');
  const sky = g.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#d9e2e0'); sky.addColorStop(0.45, '#e8e6dc'); sky.addColorStop(1, '#cfcabd');
  g.fillStyle = sky; g.fillRect(0, 0, W, H);
  //远 나무 덩어리
  for (let i = 0; i < 40; i++) {
    const x = rnd(0, W), y = rnd(H * 0.1, H * 0.45), r = rnd(30, 130);
    g.fillStyle = `rgba(${140 + rnd(-20, 30) | 0},${120 + rnd(-20, 20) | 0},90,${rnd(0.05, 0.16)})`;
    g.beginPath(); g.ellipse(x, y, r, r * 0.7, 0, 0, 7); g.fill();
  }
  // 나무 울타리
  const fenceTop = H * 0.52;
  g.fillStyle = '#8a6a46';
  g.fillRect(0, fenceTop, W, H - fenceTop);
  for (let i = 0; i < 60; i++) {
    const x = i * (W / 60);
    g.fillStyle = i % 2 ? 'rgba(0,0,0,.16)' : 'rgba(255,255,255,.05)';
    g.fillRect(x, fenceTop, 2, H - fenceTop);
    g.fillStyle = `rgba(${90 + rnd(-15, 25) | 0},${66 + rnd(-12, 18) | 0},${42 + rnd(-10, 14) | 0},${rnd(0.25, 0.6)})`;
    g.fillRect(x + 2, fenceTop, W / 60 - 2, H - fenceTop);
  }
  g.fillStyle = 'rgba(60,40,26,.4)';
  g.fillRect(0, fenceTop, W, 6);
  g.fillRect(0, fenceTop + (H - fenceTop) * 0.45, W, 5);
  // 눈/겨울 빛
  for (let i = 0; i < 500; i++) {
    g.fillStyle = `rgba(255,255,255,${rnd(0.02, 0.12)})`;
    g.fillRect(rnd(0, W), rnd(0, H), rnd(1, 3), rnd(1, 3));
  }
  return toTex(c, { clamp: true });
}
