// ───────── 오마이북 3D · 공간 ─────────
// 19장의 실제 매장 사진을 바탕으로 재구성한 한 층 평면.
// 좌표: x(동쪽+), z(남쪽+), y(위+). 단위 m.
import * as THREE from 'three';
import {
  concreteWall, polishedFloor, floorRoughness, wood, textTexture, bookCover,
  postcardWallTexture, menuBoardTexture, posterTexture, signTexture, outsideTexture,
  softCircleTexture, cupLabelTexture, mountainViewTexture, lightEpoxyFloor,
} from './tex.js';
import { BOOKS } from './data.js';

export const ZONES = {
  entrance: { pos: [-8.35, 1.62, 7.9], target: [-8.5, 1.42, 3.0] },
  counter: { pos: [1.05, 1.60, 4.35], target: [1.0, 1.20, 1.85] },
  postcard: { pos: [5.3, 1.60, 4.5], target: [9.9, 1.45, 2.4] },
  ondal: { pos: [-7.35, 1.55, -0.7], target: [-8.5, 0.85, -3.4] },
  library: { pos: [2.15, 1.74, -0.9], target: [7.2, 3.05, -6.3] },
  cafe2: { pos: [-4.25, 5.45, -8.2], target: [0.1, 4.9, 1.5] },
};

const r2 = (v) => Math.round(v * 100) / 100;
const rand = (a, b) => a + Math.random() * (b - a);

/* 재질 */
function makeMaterials() {
  const wallTex = concreteWall({ base: [150, 143, 131], panels: 2 });
  const wallTex2 = concreteWall({ base: [139, 132, 121], panels: 2 });
  wallTex2.repeat.set(1.6, 1);
  const floorTex = polishedFloor();
  const floorRough = floorRoughness();

  const mats = {
    floor: new THREE.MeshStandardMaterial({ map: floorTex, roughnessMap: floorRough, roughness: 0.34, metalness: 0.22, envMapIntensity: 0.9 }),
    concrete: new THREE.MeshStandardMaterial({ map: wallTex, roughness: 0.92, metalness: 0.02 }),
    concrete2: new THREE.MeshStandardMaterial({ map: wallTex2, roughness: 0.95, metalness: 0.02 }),
    plaster: new THREE.MeshStandardMaterial({ color: 0xb9b0a2, roughness: 0.96 }),
    plasterWarm: new THREE.MeshStandardMaterial({ color: 0xc4b7a3, roughness: 0.96 }),
    black: new THREE.MeshStandardMaterial({ color: 0x14120f, roughness: 0.62, metalness: 0.28 }),
    blackMatte: new THREE.MeshStandardMaterial({ color: 0x17150f, roughness: 0.9, metalness: 0.05 }),
    steel: new THREE.MeshStandardMaterial({ color: 0x8d8b86, roughness: 0.32, metalness: 0.85 }),
    steelDark: new THREE.MeshStandardMaterial({ color: 0x4a4741, roughness: 0.4, metalness: 0.8 }),
    warmWood: new THREE.MeshStandardMaterial({ map: wood({ base: [146, 96, 54], dark: [72, 42, 20], lines: 120 }), roughness: 0.62 }),
    oak: new THREE.MeshStandardMaterial({ map: wood({ base: [172, 122, 72], dark: [92, 56, 28], lines: 90 }), roughness: 0.6 }),
    darkWood: new THREE.MeshStandardMaterial({ map: wood({ base: [62, 44, 30], dark: [24, 16, 10], lines: 110 }), roughness: 0.55 }),
    greyPanel: new THREE.MeshStandardMaterial({ map: wood({ base: [104, 101, 94], dark: [52, 50, 45], lines: 160, knots: 1 }), roughness: 0.86 }),
    paper: new THREE.MeshStandardMaterial({ color: 0xf2ece0, roughness: 0.95 }),
    fabricGrey: new THREE.MeshStandardMaterial({ color: 0x8d8b90, roughness: 0.96 }),
    fabricPale: new THREE.MeshStandardMaterial({ color: 0xd9d3c6, roughness: 0.95 }),
    cream: new THREE.MeshStandardMaterial({ color: 0xd8c9ad, roughness: 0.92 }),
    orange: new THREE.MeshStandardMaterial({ color: 0xd4622c, roughness: 0.8 }),
    red: new THREE.MeshStandardMaterial({ color: 0xb5322a, roughness: 0.7 }),
    glass: new THREE.MeshPhysicalMaterial({ color: 0xdfe7e4, roughness: 0.06, metalness: 0, transparent: true, opacity: 0.24, side: THREE.DoubleSide, depthWrite: false }),
    acrylic: new THREE.MeshPhysicalMaterial({ color: 0xe8f0ec, roughness: 0.04, metalness: 0, transparent: true, opacity: 0.18, side: THREE.DoubleSide }),
    lightStrip: new THREE.MeshBasicMaterial({ color: 0xfff0d4 }),
    trackBlack: new THREE.MeshStandardMaterial({ color: 0x1b1916, roughness: 0.5, metalness: 0.4 }),

    /* ── 2층 카페 ── */
    floor2: new THREE.MeshStandardMaterial({ map: lightEpoxyFloor(), color: 0xc7c0ae, roughnessMap: floorRough, roughness: 0.32, metalness: 0.09, envMapIntensity: 0.5 }),
    whiteCeil: new THREE.MeshStandardMaterial({ color: 0xdad6ce, roughness: 0.97 }),
    whiteWall: new THREE.MeshStandardMaterial({ color: 0xd2cec5, roughness: 0.95 }),
    concreteLight: new THREE.MeshStandardMaterial({ map: concreteWall({ base: [168, 166, 160], panels: 2 }), roughness: 0.93, metalness: 0.02 }),
    slabEdge: new THREE.MeshStandardMaterial({ color: 0xbfbab0, roughness: 0.9 }),
    ceil1F: new THREE.MeshStandardMaterial({ map: concreteWall({ base: [126, 120, 110], panels: 3 }), roughness: 0.95, metalness: 0.02 }),
    whiteTable: new THREE.MeshStandardMaterial({ color: 0xefeee9, roughness: 0.44, metalness: 0.03 }),
    mint: new THREE.MeshStandardMaterial({ color: 0x9fc4b4, roughness: 0.9 }),
    teal: new THREE.MeshStandardMaterial({ color: 0x0f5a4f, roughness: 0.38, metalness: 0.06 }),
    tealDark: new THREE.MeshStandardMaterial({ color: 0x0a3d38, roughness: 0.4, metalness: 0.06 }),
    shellBlack: new THREE.MeshStandardMaterial({ color: 0x17181a, roughness: 0.4, metalness: 0.08 }),
    greenTable: new THREE.MeshStandardMaterial({ color: 0x1c7a53, roughness: 0.42, metalness: 0.05 }),
    coral: new THREE.MeshStandardMaterial({ color: 0xe0916b, roughness: 0.8 }),
    chrome: new THREE.MeshStandardMaterial({ color: 0xc9cccd, roughness: 0.16, metalness: 0.95, envMapIntensity: 1.2 }),
    burgundy: new THREE.MeshStandardMaterial({ color: 0x4e1f2c, roughness: 0.5, metalness: 0.05 }),
    fabricWarmGrey: new THREE.MeshStandardMaterial({ color: 0xa9a49c, roughness: 0.97 }),
    warmLight: new THREE.MeshBasicMaterial({ color: 0xffab48 }),
    downLight: new THREE.MeshBasicMaterial({ color: 0xffc169 }),
    woodCeil: new THREE.MeshStandardMaterial({ map: wood({ base: [176, 108, 48], dark: [96, 50, 18], lines: 90 }), roughness: 0.66 }),
  };
  return mats;
}

/* 유틸 */
function meshBox(w, h, d, mat, pos, parent, rot = [0, 0, 0]) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(pos[0], pos[1], pos[2]);
  m.rotation.set(rot[0], rot[1], rot[2]);
  if (parent) parent.add(m);
  return m;
}

function contactShadow(parent, x, z, w, d, opacity = 0.5, y = 0.006) {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(64, 64, 4, 64, 64, 62);
  grd.addColorStop(0, `rgba(0,0,0,${opacity})`);
  grd.addColorStop(0.55, `rgba(0,0,0,${opacity * 0.35})`);
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false }));
  m.rotation.x = -Math.PI / 2;
  m.position.set(x, y, z);
  parent.add(m);
  return m;
}

/* 책이 꽂힌 책장 한 세트 (로컬: 폭 x, 높이 y, 깊이 z, 등면 -z) */
function makeShelf({ width, height, depth = 0.34, rows = 6, cols = 4, mats, frame = 'black', palette = 'adult', faceOut = false }) {
  const g = new THREE.Group();
  const frameMat = frame === 'wood' ? mats.warmWood : mats.black;
  // 뒷판
  meshBox(width, height, 0.03, frameMat, [0, height / 2, -depth / 2], g);
  // 양옆
  meshBox(0.035, height, depth, frameMat, [-width / 2 + 0.017, height / 2, 0], g);
  meshBox(0.035, height, depth, frameMat, [width / 2 - 0.017, height / 2, 0], g);
  // 선반
  const rowH = height / rows;
  for (let i = 0; i <= rows; i++) {
    meshBox(width, 0.03, depth, frameMat, [0, i * rowH, 0], g);
  }
  // 칸막이
  for (let c = 1; c < cols; c++) {
    meshBox(0.025, height, depth, frameMat, [-width / 2 + c * (width / cols), height / 2, 0], g);
  }

  // 책 (인스턴스)
  const palettes = {
    adult: [0xf1e7d4, 0xe6ddc9, 0xd8cfbb, 0xf6f1e4, 0xcfc6b3, 0x2f3b44, 0x8f3b32, 0x3f5a45, 0x2b2a28, 0xb08a45, 0x8a9aa8, 0xc9a25a, 0x5a4a6a, 0x9a5540],
    kids: [0xf3d34a, 0xe2724a, 0x4fa3c7, 0x8fc45a, 0xf28fa8, 0xf6f0e2, 0xd94a3a, 0x5a6ec9, 0xf0a83c, 0x77bfa3],
    muted: [0xe8e0d0, 0xdcd3c1, 0xc9c0ae, 0xefe8d8, 0xb8ae9c, 0x33312c, 0x6d6455],
  };
  const pal = palettes[palette] || palettes.adult;
  const items = [];
  for (let r = 0; r < rows; r++) {
    const yBottom = r * rowH + 0.018;
    for (let c = 0; c < cols; c++) {
      let x = -width / 2 + c * (width / cols) + 0.02;
      const xEnd = -width / 2 + (c + 1) * (width / cols) - 0.02;
      while (x < xEnd - 0.03) {
        const bw = Math.min(rand(0.026, 0.052), xEnd - x - 0.006);
        if (bw < 0.015) break;
        const bh = Math.min(rowH * rand(0.68, 0.9), rowH - 0.03);
        const bd = depth * rand(0.6, 0.84);
        items.push({ x: x + bw / 2, y: yBottom + bh / 2, bw, bh, bd, c: pal[(Math.random() * pal.length) | 0], rot: rand(-0.02, 0.02) });
        x += bw + 0.003;
        if (Math.random() < 0.02) x += rand(0.02, 0.08); // 가끔 빈 자리
      }
    }
  }
  const geo = new THREE.BoxGeometry(1, 1, 1);
  const mat = new THREE.MeshStandardMaterial({ roughness: 0.78, metalness: 0.02 });
  const inst = new THREE.InstancedMesh(geo, mat, items.length);
  const dummy = new THREE.Object3D();
  const col = new THREE.Color();
  items.forEach((it, i) => {
    dummy.position.set(it.x, it.y, rand(-0.01, 0.01));
    dummy.rotation.set(0, it.rot, 0);
    dummy.scale.set(it.bw, it.bh, it.bd);
    dummy.updateMatrix();
    inst.setMatrixAt(i, dummy.matrix);
    col.setHex(it.c);
    col.offsetHSL(rand(-0.01, 0.01), rand(-0.05, 0.05), rand(-0.04, 0.04));
    inst.setColorAt(i, col);
  });
  inst.instanceMatrix.needsUpdate = true;
  if (inst.instanceColor) inst.instanceColor.needsUpdate = true;
  g.add(inst);

  // 층별 조명 띠 (은은한 발광)
  if (faceOut) {
    for (let r = 0; r < rows; r++) {
      const s = new THREE.Mesh(new THREE.BoxGeometry(width * 0.96, 0.012, 0.02), mats.lightStrip);
      s.position.set(0, r * rowH + rowH - 0.03, depth / 2 - 0.05);
      g.add(s);
    }
  }
  return g;
}

/* 벽에 매립된 3단 조명 서가 (복도 · 지적 호기심) */
function recessedShelfWall({ width, rows = 3, rowH = 0.42, mats, books = true }) {
  const g = new THREE.Group();
  const h = rows * rowH;
  // 틀
  meshBox(width, 0.045, 0.3, mats.oak, [0, h, 0], g);
  for (let i = 0; i < rows; i++) {
    meshBox(width, 0.03, 0.28, mats.oak, [0, i * rowH, 0], g);
    // 뒤 조명
    const back = new THREE.Mesh(new THREE.PlaneGeometry(width * 0.99, rowH * 0.78), new THREE.MeshBasicMaterial({ color: 0xffe9c8 }));
    back.position.set(0, i * rowH + rowH * 0.5, -0.12);
    g.add(back);
  }
  // 앞쪽 책 (얼굴 꽂이)
  if (books) {
    for (let i = 0; i < rows; i++) {
      const n = Math.max(3, Math.round(width / 0.3));
      for (let k = 0; k < n; k++) {
        const bw = 0.19, bh = 0.27;
        const b = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, 0.035), new THREE.MeshStandardMaterial({ color: new THREE.Color().setHSL(rand(0, 1), rand(0.1, 0.4), rand(0.35, 0.8)), roughness: 0.8 }));
        b.position.set(-width / 2 + (k + 0.5) * (width / n), i * rowH + 0.045 + bh / 2, 0.06);
        b.rotation.z = rand(-0.01, 0.01);
        g.add(b);
      }
    }
  }
  return g;
}

/* 화분 */
function makePlant(scale = 1, mats) {
  const g = new THREE.Group();
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.1, 0.22, 16), new THREE.MeshStandardMaterial({ color: 0xcfc9bd, roughness: 0.9 }));
  pot.position.y = 0.11; g.add(pot);
  const soil = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.115, 0.02, 12), new THREE.MeshStandardMaterial({ color: 0x2a2018, roughness: 1 }));
  soil.position.y = 0.22; g.add(soil);
  for (let i = 0; i < 16; i++) {
    const h = rand(0.25, 0.55);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.006, h, 5), new THREE.MeshStandardMaterial({ color: 0x4a5a32, roughness: 0.9 }));
    const a = rand(0, Math.PI * 2), rr = rand(0, 0.05);
    stem.position.set(Math.cos(a) * rr, 0.22 + h / 2, Math.sin(a) * rr);
    stem.rotation.z = rand(-0.3, 0.3); stem.rotation.x = rand(-0.3, 0.3);
    g.add(stem);
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(rand(0.05, 0.095), 7, 5), new THREE.MeshStandardMaterial({ color: new THREE.Color().setHSL(0.28, rand(0.3, 0.5), rand(0.2, 0.36)), roughness: 0.85 }));
    leaf.scale.set(1, 0.62, 0.28);
    leaf.position.set(stem.position.x + Math.cos(a) * 0.05, 0.22 + h + rand(-0.02, 0.05), stem.position.z + Math.sin(a) * 0.05);
    leaf.rotation.y = a; leaf.rotation.z = rand(-0.4, 0.4);
    g.add(leaf);
  }
  g.scale.setScalar(scale);
  return g;
}

/* 원형 스툴 */
function makeStool(mats, h = 0.62, seatMat) {
  const g = new THREE.Group();
  const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.045, 20), seatMat || mats.oak);
  seat.position.y = h; g.add(seat);
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + 0.4;
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, h, 6), mats.trackBlack);
    leg.position.set(Math.cos(a) * 0.12, h / 2, Math.sin(a) * 0.12);
    leg.rotation.set(Math.sin(a) * 0.1, 0, -Math.cos(a) * 0.1);
    g.add(leg);
  }
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.006, 5, 20), mats.trackBlack);
  ring.rotation.x = Math.PI / 2; ring.position.y = h * 0.32; g.add(ring);
  return g;
}

/* 벤트우드 체어 (카페) */
function makeBentwood(mats) {
  const g = new THREE.Group();
  const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.19, 0.035, 22), mats.darkWood);
  seat.position.y = 0.72; g.add(seat);
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + 0.5;
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.72, 6), mats.trackBlack);
    leg.position.set(Math.cos(a) * 0.14, 0.36, Math.sin(a) * 0.14);
    leg.rotation.set(Math.sin(a) * 0.07, 0, -Math.cos(a) * 0.07);
    g.add(leg);
  }
  const back = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.016, 8, 24, Math.PI * 1.05), mats.oak);
  back.position.set(0, 0.86, -0.15); back.rotation.x = 0.12; back.rotation.z = -0.06;
  g.add(back);
  const back2 = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.012, 8, 20, Math.PI), mats.oak);
  back2.position.set(0, 0.82, -0.15); back2.rotation.x = 0.12;
  g.add(back2);
  return g;
}

/* 소파 */
function makeArmchair(mats) {
  const g = new THREE.Group();
  const seat = meshBox(0.72, 0.16, 0.68, mats.fabricGrey, [0, 0.36, 0], g);
  const back = meshBox(0.72, 0.5, 0.16, mats.fabricGrey, [0, 0.62, -0.26], g);
  back.rotation.x = -0.1;
  for (const s of [-1, 1]) {
    const arm = meshBox(0.11, 0.3, 0.68, mats.fabricGrey, [s * 0.3, 0.53, 0], g);
    arm.rotation.z = s * 0.04;
  }
  // 얇은 금속 다리
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.3, 6), mats.steel);
    leg.position.set(sx * 0.3, 0.15, sz * 0.28); g.add(leg);
  }
  return g;
}

/* 원두 봉지 */
function makeBeanBag(color = 0xa98457) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.19, 0.06), new THREE.MeshStandardMaterial({ color, roughness: 0.9 }));
  body.position.y = 0.095; g.add(body);
  const top = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.05, 0.062), new THREE.MeshStandardMaterial({ color: 0x7a5638, roughness: 0.95 }));
  top.position.y = 0.205; g.add(top);
  const label = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 0.075), new THREE.MeshBasicMaterial({ color: 0xf4eee2 }));
  label.position.set(0, 0.1, 0.031); g.add(label);
  return g;
}

/* ─────────────── 커피 리그 (에스프레소 스테이션) ─────────────── */
function buildCoffeeRig(mats) {
  const rig = new THREE.Group();

  // 그라인더
  const grinder = new THREE.Group();
  grinder.position.set(-0.56, 0, -0.02);
  const gBody = meshBox(0.2, 0.34, 0.22, mats.black, [0, 0.17, 0], grinder);
  meshBox(0.22, 0.03, 0.24, mats.steelDark, [0, 0.345, 0], grinder);
  const hopper = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.055, 0.14, 18, 1, true), mats.glass);
  hopper.position.set(0, 0.43, 0); grinder.add(hopper);
  const beans = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.06, 0.09, 16), new THREE.MeshStandardMaterial({ color: 0x3a2317, roughness: 0.95 }));
  beans.position.set(0, 0.4, 0); grinder.add(beans);
  const spout = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.07, 12), mats.steel);
  spout.position.set(0, 0.16, 0.11); spout.rotation.x = Math.PI / 2; grinder.add(spout);
  meshBox(0.14, 0.02, 0.1, mats.steel, [0, 0.03, 0.12], grinder);
  rig.add(grinder);

  // 포터필터 (그라인더 앞 크래들에 걸린 상태)
  const pf = new THREE.Group();
  const basket = new THREE.Mesh(new THREE.CylinderGeometry(0.037, 0.033, 0.045, 20, 1, true), mats.steel);
  basket.position.set(0, 0.025, 0); pf.add(basket);
  const basketBottom = new THREE.Mesh(new THREE.CircleGeometry(0.033, 20), mats.steelDark);
  basketBottom.rotation.x = Math.PI / 2; basketBottom.position.y = 0.004; pf.add(basketBottom);
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.04, 0.012, 20), mats.steel);
  collar.position.y = 0.05; pf.add(collar);
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.018, 0.16, 12), mats.darkWood);
  handle.position.set(0, 0.05, 0.09); handle.rotation.x = Math.PI / 2; pf.add(handle);
  pf.position.set(-0.56, 0.035, 0.16);
  rig.add(pf);

  // 원두 가루 (더미)
  const grounds = new THREE.Mesh(
    new THREE.CylinderGeometry(0.031, 0.028, 0.02, 20),
    new THREE.MeshStandardMaterial({ color: 0x4a3223, roughness: 1 })
  );
  grounds.position.set(0, 0.014, 0);
  grounds.scale.y = 0.02; grounds.visible = false;
  pf.add(grounds);

  // 탬퍼
  const tamper = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.034, 0.012, 20), mats.steel);
  tamper.add(base);
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.075, 12), mats.darkWood);
  stem.position.y = 0.04; tamper.add(stem);
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.019, 12, 10), mats.darkWood);
  knob.position.y = 0.085; tamper.add(knob);
  tamper.position.set(-0.3, 0.02, 0.2);
  rig.add(tamper);

  // 에스프레소 머신
  const machine = new THREE.Group();
  machine.position.set(0.02, 0, -0.04);
  meshBox(0.66, 0.4, 0.36, mats.steelDark, [0, 0.22, 0], machine);
  meshBox(0.68, 0.06, 0.38, mats.black, [0, 0.45, 0], machine);   // 상판
  meshBox(0.5, 0.14, 0.02, mats.black, [0, 0.3, 0.19], machine);    // 전면 패널
  // 게이지
  const gauge = new THREE.Mesh(new THREE.CircleGeometry(0.043, 24), new THREE.MeshBasicMaterial({ map: cupLabelTexture('9 bar', 'PRESSURE'), color: 0xffffff }));
  gauge.position.set(-0.19, 0.31, 0.201); machine.add(gauge);
  // 그룹헤드
  const gh = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.058, 0.07, 20), mats.black);
  gh.position.set(0.03, 0.16, 0.2); machine.add(gh);
  const shower = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.046, 0.012, 20), mats.steel);
  shower.position.set(0.03, 0.125, 0.2); machine.add(shower);
  // 추출 버튼
  const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.017, 0.017, 0.012, 14), new THREE.MeshStandardMaterial({ color: 0xc9a27a, roughness: 0.5, emissive: 0x442c14, emissiveIntensity: 0.6 }));
  btn.rotation.x = Math.PI / 2; btn.position.set(0.2, 0.3, 0.201); machine.add(btn);
  // 스팀 노브
  const knob2 = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.02, 16), mats.steel);
  knob2.rotation.x = Math.PI / 2; knob2.position.set(0.25, 0.14, 0.2); machine.add(knob2);
  // 드립 트레이
  meshBox(0.46, 0.02, 0.16, mats.steelDark, [0.03, 0.012, 0.24], machine);
  // 스팀 완드
  const wandPivot = new THREE.Group();
  wandPivot.position.set(0.33, 0.2, 0.19);
  const wand = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.011, 0.24, 12), mats.steel);
  wand.position.y = -0.11; wandPivot.add(wand);
  const wandTip = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.008, 0.03, 12), mats.steelDark);
  wandTip.position.y = -0.235; wandPivot.add(wandTip);
  machine.add(wandPivot);
  rig.add(machine);

  // 컵 (유리 텀블러)
  const cup = new THREE.Group();
  cup.position.set(0.05, 0.024, 0.27);
  const cupGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.037, 0.105, 24, 1, true), new THREE.MeshPhysicalMaterial({ color: 0xe9f0ec, roughness: 0.03, metalness: 0, transparent: true, opacity: 0.22, side: THREE.DoubleSide, depthWrite: false, envMapIntensity: 1.2 }));
  cupGlass.position.y = 0.053; cup.add(cupGlass);
  const cupBottom = new THREE.Mesh(new THREE.CylinderGeometry(0.037, 0.037, 0.006, 24), new THREE.MeshPhysicalMaterial({ color: 0xe9f0ec, roughness: 0.05, transparent: true, opacity: 0.3 }));
  cupBottom.position.y = 0.003; cup.add(cupBottom);
  const liquid = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.032, 1, 22), new THREE.MeshStandardMaterial({ color: 0x3a2012, roughness: 0.25, metalness: 0.05 }));
  liquid.scale.y = 0.001; liquid.position.y = 0.006; cup.add(liquid);
  const crema = new THREE.Mesh(new THREE.CircleGeometry(0.033, 24), new THREE.MeshStandardMaterial({ color: 0xb98a58, roughness: 0.55 }));
  crema.rotation.x = -Math.PI / 2; crema.position.y = 0.006; crema.visible = false; cup.add(crema);
  const foam = new THREE.Mesh(new THREE.CircleGeometry(0.034, 24), new THREE.MeshStandardMaterial({ color: 0xf6efe1, roughness: 0.7 }));
  foam.rotation.x = -Math.PI / 2; foam.visible = false; cup.add(foam);
  // 얼음
  const iceGroup = new THREE.Group(); cup.add(iceGroup);
  rig.add(cup);

  // 스팀 피처
  const pitcher = new THREE.Group();
  pitcher.position.set(0.34, 0.024, 0.34);
  const pBody = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 0.13, 20, 1, true), mats.steel);
  pBody.position.y = 0.065; pitcher.add(pBody);
  const pBottom = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.008, 20), mats.steel);
  pBottom.position.y = 0.004; pitcher.add(pBottom);
  const pHandle = new THREE.Mesh(new THREE.TorusGeometry(0.036, 0.006, 6, 16, Math.PI * 1.2), mats.steel);
  pHandle.position.set(0.058, 0.075, 0); pHandle.rotation.y = Math.PI / 2; pHandle.rotation.z = Math.PI / 2;
  pitcher.add(pHandle);
  const milk = new THREE.Mesh(new THREE.CylinderGeometry(0.043, 0.052, 1, 20), new THREE.MeshStandardMaterial({ color: 0xf7f2e6, roughness: 0.6 }));
  milk.scale.y = 0.001; milk.position.y = 0.01; pitcher.add(milk);
  rig.add(pitcher);

  // 스팀/물줄기
  const streamMat = () => new THREE.MeshBasicMaterial({ color: 0x8a5a30, transparent: true, opacity: 0 });
  const espressoStream = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.007, 0.13, 8), streamMat());
  espressoStream.position.set(0.08, 0.09, 0.24); espressoStream.visible = false;
  rig.add(espressoStream);

  const waterStream = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.005, 0.16, 8), new THREE.MeshBasicMaterial({ color: 0xcfe4e8, transparent: true, opacity: 0 }));
  waterStream.position.set(0.05, 0.1, 0.30); waterStream.visible = false;
  rig.add(waterStream);

  const milkStream = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.005, 0.14, 8), new THREE.MeshBasicMaterial({ color: 0xfbf6ea, transparent: true, opacity: 0 }));
  milkStream.position.set(0.05, 0.1, 0.30); milkStream.visible = false;
  rig.add(milkStream);

  // 증기 파티클
  const steamTex = softCircleTexture('rgba(255,255,255,.75)', 'rgba(255,255,255,0)');
  const steamGeo = new THREE.BufferGeometry();
  const STEAM_N = 70;
  const pos = new Float32Array(STEAM_N * 3);
  const seed = [];
  for (let i = 0; i < STEAM_N; i++) { pos[i * 3] = 0; pos[i * 3 + 1] = 0; pos[i * 3 + 2] = 0; seed.push({ t: Math.random(), r: rand(0, 0.05), a: rand(0, 6.28), s: rand(0.4, 1.2) }); }
  steamGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const steam = new THREE.Points(steamGeo, new THREE.PointsMaterial({ map: steamTex, size: 0.075, transparent: true, opacity: 0.0, depthWrite: false, blending: THREE.AdditiveBlending, color: 0xfff3e0 }));
  steam.position.set(0.05, 0.14, 0.27);
  rig.add(steam);

  // 흘러내리는 물방울/가루 파티클
  const dustTex = softCircleTexture('rgba(210,180,140,.9)', 'rgba(210,180,140,0)');
  const dustGeo = new THREE.BufferGeometry();
  const DUST_N = 40;
  const dpos = new Float32Array(DUST_N * 3);
  for (let i = 0; i < DUST_N; i++) { dpos[i * 3] = 0; dpos[i * 3 + 1] = 0; dpos[i * 3 + 2] = 0; }
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dpos, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ map: dustTex, size: 0.014, transparent: true, opacity: 0, depthWrite: false, color: 0x6b4a2e }));
  dust.position.set(-0.56, 0.13, 0.14);
  rig.add(dust);

  // 라테아트 디스크
  const artCanvas = document.createElement('canvas');
  artCanvas.width = artCanvas.height = 256;
  const artTex = new THREE.CanvasTexture(artCanvas);
  artTex.colorSpace = THREE.SRGBColorSpace;
  const art = new THREE.Mesh(new THREE.CircleGeometry(0.033, 24), new THREE.MeshStandardMaterial({ map: artTex, transparent: true, roughness: 0.75 }));
  art.rotation.x = -Math.PI / 2; art.position.y = 0.052; art.visible = false;
  cup.add(art);

  return {
    rig, grinder, pf, grounds, tamper, machine, wandPivot, cup, cupGlass, liquid, crema, foam, iceGroup,
    pitcher, milk, espressoStream, waterStream, milkStream, steam, dust, art, artCanvas, artTex, gauge,
  };
}

/* ─────────────── 2층 카페 가구 ─────────────── */

/* 쉘 체어 (딥그린·블랙 몰드 체어 · 가는 다리) */
function makeShellChair(mats, shellMat, legMat) {
  const g = new THREE.Group();
  const sm = shellMat || mats.teal;
  const lm = legMat || mats.steelDark;
  const seat = meshBox(0.46, 0.055, 0.44, sm, [0, 0.445, 0.01], g, [-0.04, 0, 0]);
  // 등받이: 뒤를 감싸는 곡면 (시트와 살짝 띄움)
  const back = new THREE.Mesh(
    new THREE.CylinderGeometry(0.235, 0.255, 0.3, 22, 1, true, Math.PI * 0.67, Math.PI * 0.66),
    new THREE.MeshStandardMaterial({ color: sm.color, roughness: sm.roughness, metalness: sm.metalness, side: THREE.DoubleSide })
  );
  back.scale.set(1.03, 1, 0.88);
  back.position.set(0, 0.715, -0.05);
  g.add(back);
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.009, 0.45, 6), lm);
    leg.position.set(sx * 0.175, 0.22, sz * 0.16);
    leg.rotation.set(sz * 0.07, 0, -sx * 0.07);
    g.add(leg);
  }
  return g;
}

/* 가죽 슬링 체어 (버건디 · 검정 와이어 프레임) */
function makeSlingChair(mats, fabricMat) {
  const g = new THREE.Group();
  const fm = fabricMat || mats.burgundy;
  const fr = mats.trackBlack;
  const seat = meshBox(0.52, 0.05, 0.5, fm, [0, 0.4, 0.03], g, [-0.06, 0, 0]);
  const back = meshBox(0.56, 0.52, 0.1, fm, [0, 0.67, -0.25], g, [-0.18, 0, 0]);
  for (const s of [-1, 1]) {
    meshBox(0.028, 0.028, 0.64, fr, [s * 0.27, 0.41, 0.02], g);
    meshBox(0.028, 0.56, 0.028, fr, [s * 0.27, 0.62, -0.35], g, [-0.18, 0, 0]);
    meshBox(0.024, 0.42, 0.024, fr, [s * 0.27, 0.21, 0.25], g, [0.08, 0, 0]);
    meshBox(0.024, 0.42, 0.024, fr, [s * 0.27, 0.21, -0.24], g, [-0.06, 0, 0]);
    // 팔걸이
    meshBox(0.026, 0.026, 0.5, fr, [s * 0.29, 0.58, -0.06], g);
    meshBox(0.024, 0.16, 0.024, fr, [s * 0.29, 0.5, 0.19], g);
  }
  // 등 뒤 가로 살
  for (let i = 0; i < 8; i++) {
    meshBox(0.5, 0.01, 0.01, fr, [0, 0.24 + i * 0.072, -0.4 - i * 0.006], g, [-0.18, 0, 0]);
  }
  return g;
}

/* 패브릭 파이프 암체어 (그레이) */
function makePipeArmchair(mats, fabricMat) {
  const g = new THREE.Group();
  const fm = fabricMat || mats.fabricWarmGrey;
  meshBox(0.68, 0.17, 0.64, fm, [0, 0.36, 0], g);
  const back = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.16, 0.64, 16), fm);
  back.rotation.z = Math.PI / 2;
  back.position.set(0, 0.57, -0.27);
  g.add(back);
  for (const s of [-1, 1]) {
    const arm = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.011, 6, 18, Math.PI), mats.trackBlack);
    arm.rotation.y = Math.PI / 2;
    arm.position.set(s * 0.34, 0.44, -0.02);
    g.add(arm);
    meshBox(0.02, 0.44, 0.02, mats.trackBlack, [s * 0.34, 0.22, 0.3], g);
    meshBox(0.02, 0.44, 0.02, mats.trackBlack, [s * 0.34, 0.22, -0.3], g);
  }
  return g;
}

/* 흰 사각 테이블 (슬랜트 스틸 다리) */
function makeWhiteTable(mats, w = 1.5, d = 0.95) {
  const g = new THREE.Group();
  const top = meshBox(w, 0.07, d, mats.whiteTable, [0, 0.72, 0], g);
  // 상판 아래 얇은 스틸 앵글
  meshBox(w - 0.09, 0.05, 0.03, mats.steelDark, [0, 0.665, d / 2 - 0.05], g);
  meshBox(w - 0.09, 0.05, 0.03, mats.steelDark, [0, 0.665, -d / 2 + 0.05], g);
  meshBox(0.03, 0.05, d - 0.1, mats.steelDark, [w / 2 - 0.05, 0.665, 0], g);
  meshBox(0.03, 0.05, d - 0.1, mats.steelDark, [-w / 2 + 0.05, 0.665, 0], g);
  // 네 다리 (살짝 바깥으로 벌어짐)
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.016, 0.72, 8), mats.steelDark);
    leg.position.set(sx * (w / 2 - 0.1), 0.35, sz * (d / 2 - 0.09));
    leg.rotation.set(sz * 0.04, 0, -sx * 0.04);
    g.add(leg);
  }
  // 하단 가로 연결대
  meshBox(w - 0.24, 0.026, 0.026, mats.steelDark, [0, 0.06, d / 2 - 0.14], g);
  meshBox(w - 0.24, 0.026, 0.026, mats.steelDark, [0, 0.06, -d / 2 + 0.14], g);
  return g;
}

/* 초록 원형 테이블 (크롬 튤립 베이스) */
function makeGreenTable(mats) {
  const g = new THREE.Group();
  const top = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.05, 32), mats.greenTable);
  top.position.y = 0.72; top.receiveShadow = true; g.add(top);
  const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.445, 0.445, 0.014, 32), mats.chrome);
  rim.position.y = 0.692; g.add(rim);
  const col = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.052, 0.7, 16), mats.chrome);
  col.position.y = 0.36; g.add(col);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.34, 0.03, 28), mats.chrome);
  base.position.y = 0.016; g.add(base);
  return g;
}

/* 흰 삼각 사이드 테이블 */
function makeTriTable(mats, h = 0.56) {
  const g = new THREE.Group();
  const top = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.045, 3), mats.whiteTable);
  top.position.y = h; top.rotation.y = Math.PI / 6; top.receiveShadow = true; g.add(top);
  const col = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, h, 14), mats.whiteTable);
  col.position.y = h / 2; g.add(col);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.27, 0.028, 3), mats.whiteTable);
  base.position.y = 0.014; base.rotation.y = Math.PI / 6; g.add(base);
  return g;
}

/* 민트 스툴 벤치 */
function makeMintBench(mats) {
  const g = new THREE.Group();
  const body = meshBox(1.42, 0.26, 0.48, mats.mint, [0, 0.4, 0], g);
  body.receiveShadow = true;
  meshBox(1.4, 0.06, 0.46, mats.mint, [0, 0.55, 0], g);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    meshBox(0.035, 0.28, 0.035, mats.warmWood, [sx * 0.62, 0.14, sz * 0.17], g);
  }
  return g;
}

/* 그레이 1인 소파 (둥근 등쿠션) */
function makeSingleSofa(mats) {
  const g = new THREE.Group();
  meshBox(0.8, 0.22, 0.72, mats.fabricWarmGrey, [0, 0.34, 0], g);
  const back = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.36, 6, 16), mats.fabricWarmGrey);
  back.rotation.z = Math.PI / 2;
  back.rotation.x = -0.12;
  back.position.set(0, 0.63, -0.3);
  g.add(back);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    meshBox(0.022, 0.24, 0.022, mats.trackBlack, [sx * 0.33, 0.12, sz * 0.29], g);
  }
  return g;
}

/* 검정 와이어 라운드 테이블 */
function makeWireTable(mats) {
  const g = new THREE.Group();
  const top = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.026, 28), mats.shellBlack);
  top.position.y = 0.52; g.add(top);
  for (let i = 0; i < 3; i++) {
    const a = (i * Math.PI * 2) / 3;
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.52, 6), mats.trackBlack);
    leg.position.set(Math.cos(a) * 0.15, 0.26, Math.sin(a) * 0.15);
    leg.rotation.set(Math.sin(a) * 0.3, 0, -Math.cos(a) * 0.3);
    g.add(leg);
  }
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.006, 5, 22), mats.trackBlack);
  ring.rotation.x = Math.PI / 2; ring.position.y = 0.18; g.add(ring);
  return g;
}

/* 빈티지 트렁크 셀프 바 */
function makeTrunkBar(mats) {
  const g = new THREE.Group();
  // 검은 철제 스탠드
  for (const sx of [-1, 1]) {
    meshBox(0.024, 0.62, 0.024, mats.trackBlack, [sx * 0.42, 0.31, 0.17], g, [0.13, 0, 0]);
    meshBox(0.024, 0.62, 0.024, mats.trackBlack, [sx * 0.42, 0.31, -0.17], g, [-0.13, 0, 0]);
  }
  meshBox(0.9, 0.028, 0.028, mats.trackBlack, [0, 0.07, 0.2], g);
  meshBox(0.9, 0.028, 0.028, mats.trackBlack, [0, 0.07, -0.2], g);
  // 하단 우드 선반
  const shelf = meshBox(0.9, 0.035, 0.42, mats.warmWood, [0, 0.3, 0], g);
  // 트렁크
  const body = meshBox(0.94, 0.34, 0.46, mats.oak, [0, 0.8, 0], g);
  meshBox(0.97, 0.055, 0.49, mats.darkWood, [0, 0.985, 0], g);
  for (const dx of [-0.3, 0.3]) meshBox(0.045, 0.36, 0.475, mats.darkWood, [dx, 0.8, 0], g);
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.011, 6, 14, Math.PI), mats.blackMatte);
  handle.position.set(0, 0.73, 0.238); g.add(handle);
  // 냅킨 · 종이컵 · 물병
  const bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.24, 16), new THREE.MeshPhysicalMaterial({ color: 0xdfe9e4, roughness: 0.08, metalness: 0, transparent: true, opacity: 0.55 }));
  bottle.position.set(-0.3, 1.13, -0.02); g.add(bottle);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.04, 14), mats.black);
  cap.position.set(-0.3, 1.27, -0.02); g.add(cap);
  for (let i = 0; i < 3; i++) {
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.028, 0.085, 14), mats.paper);
    cup.position.set(-0.02, 1.06 + i * 0.012, 0.06); g.add(cup);
  }
  meshBox(0.14, 0.07, 0.1, mats.paper, [0.22, 1.055, 0.05], g);
  // 초록 안내 카드
  for (let i = 0; i < 4; i++) {
    const card = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.15), new THREE.MeshStandardMaterial({ color: 0x2f6b52, roughness: 0.9, side: THREE.DoubleSide }));
    card.position.set(0.31 + i * 0.012, 1.1, -0.02 + i * 0.01);
    card.rotation.y = -0.35 + i * 0.12;
    g.add(card);
  }
  // 왼쪽 물 계량 컵
  const jug = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.065, 0.12, 16), mats.steel);
  jug.position.set(-0.36, 1.08, 0.13); g.add(jug);
  return g;
}

/* 액자 (추상 수채화) */
function makeArtFrame(mats, w, h, seed = 0) {
  const c = document.createElement('canvas');
  c.width = 512; c.height = Math.round((512 * h) / w);
  const g2 = c.getContext('2d');
  g2.fillStyle = '#cfc9ba'; g2.fillRect(0, 0, c.width, c.height);
  const pal = ['rgba(72,96,104,.85)', 'rgba(146,116,74,.72)', 'rgba(48,58,54,.7)', 'rgba(178,142,98,.72)', 'rgba(112,74,60,.65)'];
  for (let i = 0; i < 26; i++) {
    const x = rand(0, c.width), y = rand(0, c.height), r = rand(40, 200);
    const grd = g2.createRadialGradient(x, y, 0, x, y, r);
    grd.addColorStop(0, pal[(Math.random() * pal.length) | 0]);
    grd.addColorStop(1, 'rgba(230,228,218,0)');
    g2.fillStyle = grd; g2.beginPath(); g2.arc(x, y, r, 0, 7); g2.fill();
  }
  g2.strokeStyle = 'rgba(40,46,44,.62)'; g2.lineWidth = 4;
  for (let i = 0; i < 5; i++) {
    g2.beginPath();
    g2.moveTo(rand(20, c.width * 0.4), rand(20, c.height));
    g2.lineTo(rand(c.width * 0.5, c.width - 20), rand(20, c.height));
    g2.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  const g = new THREE.Group();
  meshBox(w + 0.07, h + 0.07, 0.035, mats.darkWood, [0, 0, 0], g);
  const art = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: t, roughness: 0.95 }));
  art.position.z = 0.02; g.add(art);
  return g;
}

/* ─────────────── 전체 공간 ─────────────── */
export function buildWorld(renderer) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0d0b09);
  scene.fog = new THREE.FogExp2(0x0d0b09, 0.008);

  const mats = makeMaterials();
  const root = new THREE.Group();
  scene.add(root);

  /* 환경맵 (반사용) */
  const envCanvas = document.createElement('canvas');
  envCanvas.width = 512; envCanvas.height = 256;
  const eg = envCanvas.getContext('2d');
  const egr = eg.createLinearGradient(0, 0, 0, 256);
  egr.addColorStop(0, '#2a1f16'); egr.addColorStop(0.45, '#6a5a46'); egr.addColorStop(0.52, '#c9b28d'); egr.addColorStop(0.7, '#3a2e22'); egr.addColorStop(1, '#14100c');
  eg.fillStyle = egr; eg.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 22; i++) {
    eg.fillStyle = `rgba(255,231,196,${rand(0.05, 0.22)})`;
    eg.fillRect(rand(0, 512), rand(30, 90), rand(6, 22), rand(2, 5));
  }
  const envTex = new THREE.CanvasTexture(envCanvas);
  envTex.mapping = THREE.EquirectangularReflectionMapping;
  envTex.colorSpace = THREE.SRGBColorSpace;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envMap = pmrem.fromEquirectangular(envTex).texture;
  scene.environment = envMap;
  pmrem.dispose();

  /* 바닥 */
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 18), mats.floor);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  root.add(floor);

  /* 천장 */
  const ceilMain = new THREE.Mesh(new THREE.PlaneGeometry(11.2, 18), new THREE.MeshStandardMaterial({ map: concreteWall({ base: [120, 114, 104], panels: 3 }), roughness: 0.95 }));
  ceilMain.rotation.x = Math.PI / 2;
  ceilMain.position.set(-4.4, 3.82, z0(0));
  root.add(ceilMain);
  function z0() { return 0; }

  const ceilSouth = new THREE.Mesh(new THREE.PlaneGeometry(8.8, 10.2), new THREE.MeshStandardMaterial({ map: concreteWall({ base: [120, 114, 104], panels: 3 }), roughness: 0.95 }));
  ceilSouth.rotation.x = Math.PI / 2;
  ceilSouth.position.set(5.6, 3.82, 3.9);
  root.add(ceilSouth);

  // 복층(높은) 천장
  const ceilHigh = new THREE.Mesh(new THREE.PlaneGeometry(8.8, 7.8), new THREE.MeshStandardMaterial({ map: concreteWall({ base: [116, 110, 100], panels: 4 }), roughness: 0.95 }));
  ceilHigh.rotation.x = Math.PI / 2;
  ceilHigh.position.set(5.6, 7.05, -5.1);
  root.add(ceilHigh);

  // 복층 단차 벽면
  meshBox(8.8, 3.2, 0.2, mats.concrete2, [5.6, 5.45, -1.2], root);

  /* 벽 */
  // 남쪽 벽 (입구)
  meshBox(20, 3.85, 0.22, mats.concrete, [0, 1.92, 9], root);
  // 서쪽 벽
  meshBox(0.22, 3.85, 18, mats.concrete, [-10, 1.92, 0], root);
  // 동쪽 벽 (엽서 벽 구간)
  meshBox(0.22, 3.85, 10.2, mats.plasterWarm, [10, 1.92, 3.9], root);
  // 동쪽 벽 (복층 서재 구간은 책장이 덮음)
  meshBox(0.22, 7.1, 7.8, mats.concrete2, [10, 3.55, -5.1], root);
  // 북쪽 벽
  meshBox(8.8, 7.1, 0.22, mats.concrete, [5.6, 3.55, -9], root);
  meshBox(8.8, 3.85, 0.22, mats.concrete, [-5.6, 1.92, -9], root);
  // 다락방 벽 (북서)
  // (다락방은 별도 그룹으로 만든다)

  // 복도 칸막이 (x=-6.6, z 3.2~9)
  meshBox(0.2, 3.85, 5.8, mats.concrete2, [-6.6, 1.92, 6.1], root);

  // 'With tea, Stay book' 벽 (z=0.2, x 2.6~10)
  const teaWall = meshBox(7.4, 3.85, 0.16, mats.plasterWarm, [6.3, 1.92, 0.2], root);
  teaWall.material = new THREE.MeshStandardMaterial({ color: 0xcac2b4, roughness: 0.95 });

  // 지적 호기심 벽 (z=-6.9, x -6.4~1.2)
  meshBox(7.6, 3.85, 0.16, mats.plaster, [-2.6, 1.92, -6.9], root);

  // 아이 서가 벽 (z=1.35, x -6.4~-2.9)
  meshBox(3.5, 3.85, 0.16, mats.concrete2, [-4.65, 1.92, 1.35], root);

  /* 바닥 접지 그림자 */
  contactShadow(root, 1.0, 1.95, 3.6, 1.6, 0.55);
  contactShadow(root, -3.9, -3.7, 4.2, 2.6, 0.5);
  contactShadow(root, 5.3, -5.0, 4.0, 3.0, 0.45);
  contactShadow(root, -8.3, 5.5, 3.0, 6.0, 0.4);
  contactShadow(root, 6.6, 2.4, 3.4, 3.0, 0.45);

  /* ── 입구 & 복도 ── */
  const corridor = new THREE.Group(); root.add(corridor);

  // 유리문 (남쪽 벽, x=-7.6)
  const doorGroup = new THREE.Group(); doorGroup.position.set(-7.6, 0, 8.9); corridor.add(doorGroup);
  for (const dx of [-0.62, 0.62]) {
    meshBox(0.07, 2.5, 0.08, mats.black, [dx * 2 - 0.62 + 0.62, 1.25, 0], doorGroup);
  }
  meshBox(2.44, 0.09, 0.1, mats.black, [0, 2.5, 0], doorGroup);
  meshBox(2.44, 0.06, 0.1, mats.black, [0, 0.03, 0], doorGroup);
  for (const dx of [-1.2, 0, 1.2]) meshBox(0.06, 2.5, 0.08, mats.black, [dx, 1.25, 0], doorGroup);
  const doorGlass = new THREE.Mesh(new THREE.PlaneGeometry(2.36, 2.4), mats.glass);
  doorGlass.position.set(0, 1.25, 0.01); doorGroup.add(doorGlass);
  // 문밖 자갈 마당
  const yard = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 3), new THREE.MeshStandardMaterial({ map: concreteWall({ base: [92, 88, 82], panels: 2 }), roughness: 1 }));
  yard.rotation.x = -Math.PI / 2; yard.position.set(-7.6, 0.02, 11.4); root.add(yard);

  // 복도 왼쪽 3단 조명 서가
  const west1 = recessedShelfWall({ width: 4.6, rows: 3, rowH: 0.46, mats, books: true });
  west1.rotation.y = Math.PI / 2;
  west1.position.set(-9.86, 0.95, 5.6);
  corridor.add(west1);
  const west2 = recessedShelfWall({ width: 2.4, rows: 3, rowH: 0.46, mats, books: true });
  west2.rotation.y = Math.PI / 2;
  west2.position.set(-9.86, 0.95, 2.4);
  corridor.add(west2);

  // 오른쪽 Oh My Menu 타공판
  const menu = new THREE.Mesh(new THREE.PlaneGeometry(1.35, 1.9), new THREE.MeshStandardMaterial({ map: menuBoardTexture(), roughness: 0.8 }));
  menu.rotation.y = -Math.PI / 2;
  menu.position.set(-6.71, 1.62, 6.2);
  corridor.add(menu);
  // 액자 테두리
  meshBox(0.03, 2.0, 1.45, mats.black, [-6.73, 1.62, 6.2], corridor);

  // 낮은 벤치
  meshBox(0.42, 0.34, 1.8, mats.fabricPale, [-6.34, 0.17, 4.6], corridor);

  // Welcome 액자
  const welcome = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.3), new THREE.MeshStandardMaterial({ map: signTexture(['Welcome to', 'StayOnPage'], { w: 620, h: 300, bg: '#f2ecdf', color: '#2a251e', font: '500 74px "Inter",sans-serif' }), roughness: 0.9 }));
  welcome.rotation.y = -Math.PI / 2;
  welcome.position.set(-6.71, 1.75, 3.55);
  corridor.add(welcome);

  // 필사의 산책 포스터 (서쪽 벽, 복도 끝)
  const poster = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.8), new THREE.MeshStandardMaterial({ map: posterTexture(), roughness: 0.9 }));
  poster.rotation.y = Math.PI / 2;
  poster.position.set(-9.94, 1.62, 1.55);
  root.add(poster);

  // 복도 끝 작은 창
  const smallWin = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.75), new THREE.MeshStandardMaterial({ map: outsideTexture(), roughness: 0.9 }));
  smallWin.rotation.y = Math.PI / 2;
  smallWin.position.set(-9.93, 1.55, 0.45);
  root.add(smallWin);
  meshBox(0.14, 0.85, 1.0, mats.paper, [-9.99, 1.55, 0.45], root);

  // 벽 부착 진열 선반 (필사 서가)
  const leafShelf = meshBox(0.9, 0.03, 0.14, mats.darkWood, [-9.9, 1.12, 0.95], root);
  leafShelf.rotation.y = Math.PI / 2;
  for (let i = 0; i < 3; i++) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.26, 0.2), new THREE.MeshStandardMaterial({ color: [0xe8dcc2, 0x2f4a3a, 0xb44b3a][i], roughness: 0.85 }));
    b.position.set(-9.88, 1.26, 0.7 + i * 0.28);
    b.rotation.y = Math.PI / 2; root.add(b);
  }

  /* 철제 공중 계단 (서쪽 벽 → 2층 카페) */
  const stairs = new THREE.Group(); root.add(stairs);
  const STEPS = 13;
  for (let i = 0; i < STEPS; i++) {
    const y = 0.19 + i * 0.29;
    const z = 2.15 - i * 0.3;
    const t = meshBox(1.05, 0.055, 0.32, mats.black, [-9.42, y, z], stairs);
    t.receiveShadow = true;
  }
  // 스트링거
  const stringer = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.25, 4.7), mats.black);
  stringer.position.set(-9.96, 1.95, 0.35); stringer.rotation.x = Math.atan2(3.8, 3.9);
  stairs.add(stringer);
  const stringer2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.25, 4.7), mats.black);
  stringer2.position.set(-8.9, 1.95, 0.35); stringer2.rotation.x = Math.atan2(3.8, 3.9);
  stairs.add(stringer2);
  const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 5.0, 8), mats.black);
  rail.position.set(-8.92, 2.6, 0.35); rail.rotation.x = Math.PI / 2 - Math.atan2(3.8, 3.9);
  stairs.add(rail);
  // 난간 세로 살대
  for (let i = 0; i < 13; i++) {
    const y = 0.19 + i * 0.29;
    const z = 2.15 - i * 0.3;
    meshBox(0.018, 0.92, 0.018, mats.black, [-8.92, y + 0.5, z], stairs);
  }

  /* ── 카운터 & 굿즈 ── */
  const cafe = new THREE.Group(); root.add(cafe);
  // 카운터 바
  const bar = meshBox(3.2, 1.0, 0.8, mats.darkWood, [1.0, 0.5, 1.95], cafe);
  const barTop = meshBox(3.3, 0.06, 0.9, mats.black, [1.0, 1.03, 1.95], cafe);
  barTop.receiveShadow = true;
  // 카운터 하부 라인 (검정)
  meshBox(3.24, 0.1, 0.82, mats.black, [1.0, 0.06, 1.95], cafe);
  // 쇼케이스 (빵)
  const caseG = new THREE.Group(); caseG.position.set(-1.75, 0, 1.9); cafe.add(caseG);
  meshBox(1.5, 0.92, 0.8, mats.black, [0, 0.46, 0], caseG);
  meshBox(1.56, 0.05, 0.86, mats.black, [0, 0.95, 0], caseG);
  const caseGlass = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.62, 0.72), mats.glass);
  caseGlass.position.set(0, 1.28, 0); caseG.add(caseGlass);
  meshBox(1.46, 0.02, 0.76, mats.glass, [0, 1.6, 0], caseG);
  // 빵
  for (let i = 0; i < 7; i++) {
    const bread = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.14, 4, 8), new THREE.MeshStandardMaterial({ color: new THREE.Color().setHSL(0.08, 0.45, rand(0.3, 0.45)), roughness: 0.95 }));
    bread.rotation.z = Math.PI / 2; bread.rotation.y = rand(-0.3, 0.3);
    bread.position.set(rand(-0.55, 0.55), 1.02 + (i > 3 ? 0.02 : 0), rand(-0.2, 0.2));
    bread.scale.set(1, 1, rand(0.8, 1.2));
    caseG.add(bread);
  }
  // 컵더미 · 머그
  for (let i = 0; i < 5; i++) {
    const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.09, 14), mats.cream);
    mug.position.set(2.2 + (i % 2) * 0.11, 1.11, 1.88 + Math.floor(i / 2) * 0.11);
    cafe.add(mug);
  }

  // 커피 리그
  const coffee = buildCoffeeRig(mats);
  coffee.rig.position.set(1.06, 1.06, 2.02);
  cafe.add(coffee.rig);

  // 굿즈 테이블
  const goodsTop = meshBox(1.5, 0.07, 2.4, mats.darkWood, [4.5, 0.99, 2.3], cafe);
  goodsTop.receiveShadow = true;
  meshBox(1.3, 0.96, 2.2, mats.black, [4.5, 0.48, 2.3], cafe);
  // 굿즈: 엽서 뭉치 · 스탬프 · 노트
  for (let i = 0; i < 26; i++) {
    const w = rand(0.09, 0.17), h = rand(0.005, 0.02), d = rand(0.1, 0.16);
    const g = meshBox(w, h, d, new THREE.MeshStandardMaterial({ color: new THREE.Color().setHSL(rand(0.06, 0.14), rand(0.05, 0.25), rand(0.62, 0.9)), roughness: 0.95 }), [rand(3.95, 5.05), 1.03 + h, rand(1.25, 3.35)], cafe, [0, rand(-0.4, 0.4), 0]);
  }
  // 우드 트레이
  meshBox(0.42, 0.05, 0.3, mats.oak, [4.9, 1.05, 1.7], cafe);
  // 드링크웨어 박스
  for (let i = 0; i < 5; i++) {
    const b = meshBox(0.24, 0.11, 0.16, mats.paper, [4.05 + (i % 3) * 0.26, 1.08, 2.9 + Math.floor(i / 3) * 0.2], cafe);
  }
  // 미니 선반 (굿즈 뒤)
  meshBox(1.4, 0.9, 0.3, mats.oak, [4.6, 1.45, 1.2], cafe);
  // 화분
  const plant1 = makePlant(1.35, mats); plant1.position.set(3.9, 1.06, 2.0); cafe.add(plant1);
  const plant2 = makePlant(1.1, mats); plant2.position.set(9.4, 0, 3.0); cafe.add(plant2);

  // 벤트우드 체어 + 벽 선반 테이블
  const bw1 = makeBentwood(mats); bw1.position.set(6.6, 0, 2.2); bw1.rotation.y = -0.4; cafe.add(bw1);
  const bw2 = makeBentwood(mats); bw2.position.set(7.35, 0, 2.35); bw2.rotation.y = 0.2; cafe.add(bw2);
  const ledge = meshBox(2.2, 0.07, 0.5, mats.darkWood, [6.9, 0.98, 1.55], cafe);
  meshBox(0.1, 0.95, 0.4, mats.black, [6.1, 0.48, 1.55], cafe);
  meshBox(0.1, 0.95, 0.4, mats.black, [7.7, 0.48, 1.55], cafe);

  // 'With tea, Stay book' 레터링
  const letteringTex = textTexture(['With tea,', 'Stay book'], { w: 1024, h: 512, color: '#2f2a24', font: '300 128px "Helvetica Neue","Inter",sans-serif', align: 'left', pad: 60, lineHeight: 1.1, letterSpacing: 1 });
  const lettering = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.3), new THREE.MeshBasicMaterial({ map: letteringTex, transparent: true, depthWrite: false }));
  lettering.position.set(7.4, 2.32, 0.295);
  root.add(lettering);

  // 한 줄 조명 선반
  meshBox(4.2, 0.05, 0.22, mats.oak, [7.2, 1.62, 0.43], root);
  const shelfGlow = new THREE.Mesh(new THREE.BoxGeometry(4.1, 0.02, 0.02), mats.lightStrip);
  shelfGlow.position.set(7.2, 1.66, 0.33); root.add(shelfGlow);
  // 선반 위 엽서 꽂이
  for (let i = 0; i < 9; i++) {
    const p = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.22), new THREE.MeshStandardMaterial({ map: textTexture([''], { w: 128, h: 160, bg: `hsl(${rand(20, 50)},20%,${rand(70, 88)}%)` }), roughness: 0.95, side: THREE.DoubleSide }));
    p.position.set(5.25 + i * 0.44, 1.76, 0.45); root.add(p);
  }

  // 바닥 오렌지 파우치
  const pouf = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.3, 0.42, 18), mats.orange);
  pouf.position.set(3.6, 0.21, 0.95); root.add(pouf);
  const pouf2 = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.28, 0.4, 18), mats.orange);
  pouf2.position.set(-5.4, 0.2, 0.55); root.add(pouf2);

  /* ── 엽서 벽 ── */
  const postcardWall = new THREE.Group(); root.add(postcardWall);
  const pwTex = postcardWallTexture();
  const pw = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 3.4), new THREE.MeshStandardMaterial({ map: pwTex, roughness: 0.95 }));
  pw.rotation.y = -Math.PI / 2;
  pw.position.set(9.86, 1.72, 3.4);
  postcardWall.add(pw);
  // 엽서 붙는 슬롯
  const postcardSlots = [];
  for (let col = 0; col < 6; col++) {
    for (let row = 0; row < 6; row++) {
      postcardSlots.push(new THREE.Vector3(9.8, 0.55 + row * 0.42, 1.9 + col * 0.55));
    }
  }

  /* ── 다락 좌식방 ── */
  const ondal = new THREE.Group(); root.add(ondal);
  const OX0 = -10, OX1 = -6.4, OZ0 = -6.8, OZ1 = -2.6;
  // 올린 마루
  meshBox(OX1 - OX0, 0.35, OZ1 - OZ0, mats.greyPanel, [(OX0 + OX1) / 2, 0.17, (OZ0 + OZ1) / 2], ondal);
  const ondalFloor = new THREE.Mesh(new THREE.PlaneGeometry(OX1 - OX0 - 0.2, OZ1 - OZ0 - 0.2), mats.oak);
  ondalFloor.rotation.x = -Math.PI / 2;
  ondalFloor.position.set((OX0 + OX1) / 2, 0.355, (OZ0 + OZ1) / 2);
  ondal.add(ondalFloor);
  // 벽 (남쪽 반벽 + 상부)
  meshBox(OX1 - OX0, 0.95, 0.14, mats.greyPanel, [(OX0 + OX1) / 2, 0.47, OZ1], ondal);
  meshBox(OX1 - OX0, 0.9, 0.14, mats.greyPanel, [(OX0 + OX1) / 2, 3.0, OZ1], ondal);
  meshBox(0.9, 1.25, 0.14, mats.greyPanel, [OX0 + 0.45, 2.05, OZ1], ondal);
  meshBox(0.9, 1.25, 0.14, mats.greyPanel, [OX1 - 0.45, 2.05, OZ1], ondal);
  // 세로 우드 살창
  for (let i = 0; i < 15; i++) {
    const x = OX0 + 1.0 + i * 0.195;
    meshBox(0.045, 1.55, 0.07, mats.warmWood, [x, 1.75, OZ1], ondal);
  }
  meshBox(3.1, 0.07, 0.1, mats.warmWood, [OX0 + 2.4, 2.52, OZ1], ondal);
  // 내부 벽
  meshBox(0.14, 2.8, OZ1 - OZ0, mats.greyPanel, [OX1, 1.75, (OZ0 + OZ1) / 2], ondal);
  meshBox(OX1 - OX0, 2.8, 0.14, mats.greyPanel, [(OX0 + OX1) / 2, 1.75, OZ0], ondal);
  // 천장(낮은 다락)
  const ondalCeil = new THREE.Mesh(new THREE.PlaneGeometry(OX1 - OX0, OZ1 - OZ0), mats.warmWood);
  ondalCeil.rotation.x = Math.PI / 2;
  ondalCeil.position.set((OX0 + OX1) / 2, 2.55, (OZ0 + OZ1) / 2);
  ondal.add(ondalCeil);
  // 조명
  const ondalLight = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.04, 0.06), mats.lightStrip);
  ondalLight.position.set(-8.2, 2.5, -4.6); ondal.add(ondalLight);
  // 벽 글씨
  const ondalText = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 1.1), new THREE.MeshBasicMaterial({ map: textTexture(['책남의', '토요일'], { w: 256, h: 560, color: '#3a332a', font: '400 64px "Nanum Myeongjo","Noto Serif KR",serif', align: 'center', lineHeight: 1.6 }), transparent: true }));
  ondalText.position.set(-9.0, 1.9, -6.72); ondal.add(ondalText);
  // 쿠션
  for (const [cx, cz, rot] of [[-9.2, -3.4, 0.2], [-8.3, -3.2, -0.1], [-7.3, -4.4, 0.3], [-9.0, -5.4, -0.2]]) {
    const cu = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.14, 0.62), mats.cream);
    cu.position.set(cx, 0.42, cz); cu.rotation.y = rot; cu.rotation.z = rand(-0.03, 0.03); ondal.add(cu);
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.34, 0.12), mats.cream);
    back.position.set(cx, 0.6, cz - 0.24); back.rotation.x = -0.18; ondal.add(back);
  }
  // 낮은 테이블
  meshBox(0.7, 0.09, 0.5, mats.warmWood, [-8.3, 0.6, -4.5], ondal);
  meshBox(0.08, 0.22, 0.08, mats.darkWood, [-8.55, 0.46, -4.3], ondal);
  meshBox(0.08, 0.22, 0.08, mats.darkWood, [-8.05, 0.46, -4.3], ondal);
  // 액자 2개 (벽)
  for (let i = 0; i < 3; i++) {
    const artTex = textTexture([''], { w: 256, h: 320, bg: `hsl(${rand(0, 40)},30%,${rand(60, 80)}%)` });
    const fr = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.42), new THREE.MeshStandardMaterial({ map: artTex, roughness: 0.9 }));
    fr.position.set(-7.0 + i * 0.5, 1.95, -6.72); ondal.add(fr);
  }

  /* 책의 잔상 편지함 (다락방 오른쪽) */
  const letterBox = new THREE.Group(); letterBox.position.set(-6.05, 0, -2.2); root.add(letterBox);
  meshBox(0.95, 2.0, 0.35, mats.warmWood, [0, 1.0, 0], letterBox);
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 3; c++) {
        meshBox(0.26, 0.4, 0.02, mats.darkWood, [-0.3 + c * 0.3, 0.3 + r * 0.46, 0.17], letterBox);
    }
  }
  // 크라프트 봉투
  for (let i = 0; i < 8; i++) {
    const bag = makeBeanBag(0xbf9a6a);
    bag.position.set(-0.3 + (i % 3) * 0.3, 0.32 + Math.floor(i / 3) * 0.46, 0.2);
    bag.scale.setScalar(0.9); bag.rotation.y = rand(-0.2, 0.2);
    letterBox.add(bag);
  }
  const label = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.09), new THREE.MeshStandardMaterial({ map: signTexture('책의 잔상', { w: 300, h: 90, bg: '#8d6238', color: '#f6efdf', font: '500 46px "Apple SD Gothic Neo",sans-serif' }), roughness: 0.9 }));
  label.position.set(0, 2.08, 0.02); letterBox.add(label);

  /* ── 중앙 홀 ── */
  const hall = new THREE.Group(); root.add(hall);
  // 긴 공용 테이블
  const tableTop = meshBox(3.4, 0.11, 1.35, mats.darkWood, [-3.9, 1.0, -3.6], hall);
  tableTop.receiveShadow = true;
  meshBox(3.2, 0.94, 1.15, mats.black, [-3.9, 0.47, -3.6], hall);
  // 테이블 위 스탠드 · 책
  for (let i = 0; i < 3; i++) {
    const b = meshBox(0.2, 0.28, 0.03, new THREE.MeshStandardMaterial({ color: [0xf2ecdf, 0x3a4a3f, 0xc08c46][i], roughness: 0.85 }), [-5.0 + i * 0.6, 1.2, -3.9], hall, [0.1, rand(-0.3, 0.3), 0]);
  }
  const stand = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.26, 4), mats.paper);
  stand.rotation.y = 0.7; stand.position.set(-3.0, 1.19, -3.5); hall.add(stand);
  // 스툴
  for (let i = 0; i < 5; i++) {
    const s = makeStool(mats, 0.62); s.position.set(-5.2 + i * 0.62, 0, -2.75); hall.add(s);
  }
  for (let i = 0; i < 3; i++) {
    const s = makeStool(mats, 0.62); s.position.set(-4.6 + i * 0.7, 0, -4.45); hall.add(s);
  }
  // 테이블 끝 기둥 서가
  const colShelf = makeShelf({ width: 0.55, height: 1.5, depth: 0.5, rows: 5, cols: 1, mats, palette: 'adult' });
  colShelf.position.set(-2.05, 0, -3.6); hall.add(colShelf);
  // 서가 위 얼굴 꽂이 책
  const faceBook = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.32, 0.03), new THREE.MeshStandardMaterial({ color: 0xd9cfb8, roughness: 0.8 }));
  faceBook.position.set(-2.05, 1.68, -3.55); faceBook.rotation.y = 0.2; hall.add(faceBook);

  // 아동 아일랜드 서가 (낮은 유닛 + 나무 진열 큐브)
  const island = new THREE.Group(); island.position.set(-3.5, 0, -0.9); island.rotation.y = 0.08; hall.add(island);
  const islandShelf = makeShelf({ width: 1.5, height: 1.0, depth: 0.62, rows: 2, cols: 3, mats, palette: 'kids' });
  island.add(islandShelf);
  // 앞면 그림책 진열
  for (let i = 0; i < 5; i++) {
    const bk = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.26, 0.02), new THREE.MeshStandardMaterial({ color: new THREE.Color().setHSL(rand(0, 1), 0.5, 0.6), roughness: 0.85 }));
    bk.position.set(-0.62 + i * 0.31, 1.14, 0.32); bk.rotation.x = -0.12; island.add(bk);
  }
  // 나무 진열 큐브
  meshBox(0.5, 0.16, 0.42, mats.oak, [-0.35, 1.08, 0.05], island);
  // 아이 키 작은 의자
  const kidChair = new THREE.Group(); kidChair.position.set(-1.9, 0, 0.4); hall.add(kidChair);
  meshBox(0.38, 0.04, 0.34, mats.oak, [0, 0.34, 0], kidChair);
  meshBox(0.38, 0.4, 0.04, mats.oak, [0, 0.54, -0.15], kidChair);

  // 아이 서가 벽 (남쪽 벽 z=1.35 안쪽)
  const kidsWallShelf = makeShelf({ width: 3.3, height: 2.9, depth: 0.36, rows: 7, cols: 5, mats, palette: 'kids' });
  kidsWallShelf.position.set(-4.65, 0, 1.16);
  kidsWallShelf.rotation.y = Math.PI;
  hall.add(kidsWallShelf);
  // 아이 서가 앞 낮은 진열
  const kidBin = makeShelf({ width: 2.6, height: 0.8, depth: 0.4, rows: 2, cols: 4, mats, palette: 'kids' });
  kidBin.position.set(-4.65, 0, 0.72); hall.add(kidBin);
  // '여기는 서점입니다' 표찰
  const shopSign = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.22), new THREE.MeshStandardMaterial({ map: signTexture(['여기는 서점입니다! 책을 보시는 건 언제나 환영이에요.'], { w: 1200, h: 180, bg: '#f4efe4', color: '#2b261f', font: '500 44px "Apple SD Gothic Neo","Noto Sans KR",sans-serif' }), roughness: 0.9 }));
  shopSign.position.set(-4.65, 3.05, 0.75); hall.add(shopSign);

  // '당신의 지적 호기심' 벽
  const curiosityWall = new THREE.Group(); curiosityWall.position.set(-2.6, 0, -6.82); root.add(curiosityWall);
  const cwText = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.2), new THREE.MeshBasicMaterial({ map: textTexture('당신의 지적 호기심', { w: 900, h: 120, color: '#3b352c', font: '400 62px "Apple SD Gothic Neo","Noto Sans KR",sans-serif', align: 'center' }), transparent: true }));
  cwText.position.set(0, 2.62, 0.02); curiosityWall.add(cwText);
  for (let r = 0; r < 3; r++) {
    const shelfRow = recessedShelfWall({ width: 5.2, rows: 1, rowH: 0.5, mats, books: true });
    shelfRow.position.set(0, 1.2 + r * 0.62, 0.05);
    curiosityWall.add(shelfRow);
  }

  /* ── 복층 서재 & 라운지 ── */
  const lib = new THREE.Group(); root.add(lib);
  // 동쪽 대형 책장 (복층 높이)
  const eastShelf = makeShelf({ width: 7.4, height: 6.6, depth: 0.4, rows: 12, cols: 12, mats, palette: 'adult' });
  eastShelf.position.set(9.72, 0.1, -5.2);
  eastShelf.rotation.y = -Math.PI / 2;
  lib.add(eastShelf);

  // 북쪽 벽 책장 (창 양옆)
  const northShelfL = makeShelf({ width: 2.6, height: 3.4, depth: 0.36, rows: 8, cols: 4, mats, palette: 'adult' });
  northShelfL.position.set(3.0, 0, -8.78); lib.add(northShelfL);
  const northShelfR = makeShelf({ width: 3.9, height: 3.4, depth: 0.36, rows: 8, cols: 6, mats, palette: 'adult' });
  northShelfR.position.set(7.6, 0, -8.78); lib.add(northShelfR);

  // 세로 통창
  const winGroup = new THREE.Group(); winGroup.position.set(4.45, 0, -8.86); lib.add(winGroup);
  const outside = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 3.2), new THREE.MeshStandardMaterial({ map: outsideTexture(), roughness: 0.9, emissive: 0x3a3630, emissiveIntensity: 0.35 }));
  outside.position.set(0, 1.7, -0.02); winGroup.add(outside);
  meshBox(1.1, 0.1, 0.16, mats.black, [0, 3.34, 0.04], winGroup);
  meshBox(0.06, 3.3, 0.16, mats.black, [-0.55, 1.7, 0.04], winGroup);
  meshBox(0.06, 3.3, 0.16, mats.black, [0.55, 1.7, 0.04], winGroup);
  // 창가 화분
  const p3 = makePlant(1.25, mats); p3.position.set(3.85, 0, -8.5); lib.add(p3);
  const p4 = makePlant(1.0, mats); p4.position.set(5.05, 0, -8.45); lib.add(p4);

  // 2층 메자닌
  meshBox(8.6, 0.2, 1.5, mats.black, [5.6, 3.5, -8.2], lib);
  for (let i = 0; i < 22; i++) {
    meshBox(0.02, 0.95, 0.02, mats.black, [1.4 + i * 0.4, 4.05, -7.5], lib);
  }
  meshBox(8.6, 0.05, 0.05, mats.black, [5.6, 4.54, -7.5], lib);

  // 링 LED 펜던트
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xfff3dc });
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.028, 10, 64), ringMat);
  ring1.position.set(5.6, 3.55, -5.4); ring1.rotation.x = Math.PI / 2; lib.add(ring1);
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.024, 10, 48), ringMat);
  ring2.position.set(5.6, 3.55, -5.4); ring2.rotation.x = Math.PI / 2; lib.add(ring2);
  for (const dz of [-0.6, 0.6]) {
    const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 3.4, 5), mats.trackBlack);
    wire.position.set(5.6 + dz, 5.3, -5.4); lib.add(wire);
  }

  // 라운지 소파 · 아크릴 테이블 · 빨간 스툴
  const ch1 = makeArmchair(mats); ch1.position.set(4.3, 0, -4.9); ch1.rotation.y = 0.35; lib.add(ch1);
  const ch2 = makeArmchair(mats); ch2.position.set(6.1, 0, -5.1); ch2.rotation.y = -0.3; lib.add(ch2);
  const acryl = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.45, 0.55), mats.acrylic);
  acryl.position.set(5.2, 0.22, -3.9); lib.add(acryl);
  const acrylTop = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.03, 0.57), mats.acrylic);
  acrylTop.position.set(5.2, 0.45, -3.9); lib.add(acrylTop);
  const redStool = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.4, 0.3), mats.red);
  redStool.position.set(3.3, 0.2, -4.3); lib.add(redStool);
  // 러그
  const rug = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 2.6), new THREE.MeshStandardMaterial({ color: 0x3b3730, roughness: 1 }));
  rug.rotation.x = -Math.PI / 2; rug.position.set(5.2, 0.008, -4.9); lib.add(rug);
  // 낮은 원형 스툴 2개
  for (const [sx, sz, c] of [[2.3, -4.0, 0xdcd6c8], [2.5, -3.3, 0xb8b2a5]]) {
    const st = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.25, 0.38, 18), new THREE.MeshStandardMaterial({ color: c, roughness: 0.95 }));
    st.position.set(sx, 0.19, sz); lib.add(st);
  }

  // 카운터 뒤쪽 병렬 책장 (홀과 복층 사이)
  const midShelf = makeShelf({ width: 2.2, height: 2.6, depth: 0.36, rows: 6, cols: 4, mats, palette: 'adult' });
  midShelf.position.set(-0.4, 0, -0.2);
  midShelf.rotation.y = Math.PI / 2;
  root.add(midShelf);

  /* ── 남동쪽 작은 카페 테이블 (창가) ── */
  const winS = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.0), new THREE.MeshStandardMaterial({ map: outsideTexture(), roughness: 0.9, emissive: 0x5a5648, emissiveIntensity: 0.4 }));
  winS.position.set(5.5, 1.9, 8.86); winS.rotation.y = Math.PI;
  root.add(winS);
  meshBox(2.8, 0.08, 0.16, mats.black, [5.5, 0.95, 8.84], root);
  meshBox(2.8, 0.08, 0.16, mats.black, [5.5, 2.85, 8.84], root);
  meshBox(0.08, 2.0, 0.16, mats.black, [4.1, 1.9, 8.84], root);
  meshBox(0.08, 2.0, 0.16, mats.black, [6.9, 1.9, 8.84], root);

  const cafeTable = new THREE.Group(); cafeTable.position.set(6.6, 0, 7.6); root.add(cafeTable);
  const ct = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.05, 26), mats.darkWood);
  ct.position.y = 0.74; cafeTable.add(ct);
  const ctl = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.09, 0.72, 12), mats.black);
  ctl.position.y = 0.36; cafeTable.add(ctl);
  for (const [dx, dz, ry] of [[-0.75, 0.1, 1.4], [0.75, -0.1, -1.5]]) {
    const ch = makeBentwood(mats); ch.position.set(6.6 + dx, 0, 7.6 + dz); ch.rotation.y = ry; root.add(ch);
  }

  /* ── 조명 ── */
  const hemi = new THREE.HemisphereLight(0xffe6c6, 0x120f0b, 1.15);
  scene.add(hemi);
  scene.add(new THREE.AmbientLight(0x3a3026, 0.9));

  const addSpot = (pos, target, intensity, angle, color, shadow = false, dist = 14) => {
    const s = new THREE.SpotLight(color, intensity, dist, angle, 0.75, 1.6);
    s.position.set(...pos);
    s.target.position.set(...target);
    scene.add(s); scene.add(s.target);
    if (shadow) {
      s.castShadow = true;
      s.shadow.mapSize.set(1024, 1024);
      s.shadow.bias = -0.0012;
      s.shadow.camera.near = 0.4; s.shadow.camera.far = 16;
    }
    return s;
  };
  addSpot([-8.6, 3.7, 5.6], [-9.4, 1.5, 5.6], 55, 0.85, 0xffdcb0);
  addSpot([-8.4, 3.7, 2.6], [-8.8, 1.4, 2.4], 40, 0.9, 0xffd8a8);
  addSpot([1.0, 3.7, 2.9], [1.0, 1.1, 1.95], 90, 0.8, 0xffe0b8, true);
  addSpot([-3.7, 3.75, -3.0], [-3.9, 1.0, -3.6], 60, 0.9, 0xffdfb6);
  addSpot([6.6, 3.4, 2.4], [7.0, 1.7, 1.0], 55, 0.85, 0xffdcae);
  addSpot([5.8, 6.4, -5.2], [6.4, 1.2, -5.4], 170, 0.85, 0xfff0d6, true);
  addSpot([2.0, 3.7, -1.5], [1.0, 0.9, -2.0], 45, 0.9, 0xffdcb0);

  // 다락방 · 엽서벽 보조광
  const ondalPoint = new THREE.PointLight(0xffb877, 14, 7, 2);
  ondalPoint.position.set(-8.2, 2.3, -4.6); scene.add(ondalPoint);
  const postPoint = new THREE.PointLight(0xffe3bb, 22, 8, 2);
  postPoint.position.set(8.0, 2.6, 3.2); scene.add(postPoint);
  const libPoint = new THREE.PointLight(0xfff0d6, 30, 10, 2);
  libPoint.position.set(5.6, 3.3, -5.4); scene.add(libPoint);
  const entryPoint = new THREE.PointLight(0xffdfb4, 16, 8, 2);
  entryPoint.position.set(-8.2, 2.7, 7.0); scene.add(entryPoint);

  /* ── 천장 디테일: 빔 · 선형 조명 · 트랙 ── */
  const beamMat = new THREE.MeshStandardMaterial({ map: concreteWall({ base: [124, 118, 108], panels: 2 }), roughness: 0.95 });
  for (let i = 0; i < 5; i++) {
    meshBox(11.0, 0.3, 0.35, beamMat, [-4.4, 3.66, -7 + i * 3.4], root);
  }
  for (let i = 0; i < 3; i++) {
    meshBox(0.28, 0.3, 10.0, beamMat, [3.0 + i * 3.4, 3.66, 4.0], root);
  }
  // 선형 조명
  for (const [lx, lz, len] of [[-3.0, -4.9, 3.2], [-3.0, -1.2, 2.6], [1.2, 3.0, 2.4], [6.2, 6.8, 3.0], [-8.3, 5.2, 2.4]]) {
    const l = new THREE.Mesh(new THREE.BoxGeometry(len, 0.05, 0.1), mats.lightStrip);
    l.position.set(lx, 3.6, lz); root.add(l);
    const g = new THREE.PointLight(0xfff2dc, 6, 5, 2);
    g.position.set(lx, 3.4, lz); scene.add(g);
  }
  // 트랙 조명 (카운터 · 서재)
  for (const [tx, tz, ry, n] of [[1.0, 3.2, 0, 3], [6.8, 2.0, 0, 2], [4.6, -1.0, 0, 3]]) {
    meshBox(1.9, 0.05, 0.06, mats.trackBlack, [tx, 3.58, tz], root, [0, ry, 0]);
    for (let i = 0; i < n; i++) {
      const head = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.14, 12), mats.trackBlack);
      head.position.set(tx - 0.7 + i * 0.7, 3.46, tz);
      head.rotation.x = 0.5; root.add(head);
      const lens = new THREE.Mesh(new THREE.CircleGeometry(0.032, 12), mats.lightStrip);
      lens.position.set(tx - 0.7 + i * 0.7, 3.39, tz + 0.04);
      lens.rotation.x = -0.9; root.add(lens);
    }
  }

  /* ── 얼굴 꽂이 도서 (실제 책) ── */
  const bookSpots = {};
  const clickables = [];

  function placeHeroBook(book, pos, rotY, scale = 1) {
    const coverTex = new THREE.CanvasTexture(bookCover(book));
    coverTex.colorSpace = THREE.SRGBColorSpace;
    coverTex.anisotropy = 8;
    const W = 0.24 * scale, H = 0.34 * scale, D = 0.022;
    const coverMat = new THREE.MeshStandardMaterial({ map: coverTex, roughness: 0.55, metalness: 0.02 });
    const paperMat = new THREE.MeshStandardMaterial({ color: 0xf0e9db, roughness: 0.9 });
    const matsArr = [paperMat, paperMat, paperMat, paperMat, coverMat, paperMat];
    const m = new THREE.Mesh(new THREE.BoxGeometry(W, H, D), matsArr);
    m.position.set(...pos);
    m.rotation.y = rotY;
    m.castShadow = true;
    m.userData.bookId = book.id;
    root.add(m);
    clickables.push(m);
    // 살짝 기대는 받침 선반
    const stand = new THREE.Mesh(new THREE.BoxGeometry(W * 1.35, 0.028, 0.14), mats.oak);
    stand.position.set(pos[0], pos[1] - H / 2 - 0.014, pos[2] + 0.02);
    stand.rotation.y = rotY;
    root.add(stand);
    bookSpots[book.spot] = { mesh: m, pos: new THREE.Vector3(...pos), rotY, book };
    return m;
  }

  // 복층 서재 동쪽 책장 앞 (동쪽 벽을 보고 서 있음 → 표지는 -x 방향)
  placeHeroBook(BOOKS[0], [9.4, 1.42, -3.0], -Math.PI / 2);
  placeHeroBook(BOOKS[1], [9.4, 1.97, -3.9], -Math.PI / 2);
  placeHeroBook(BOOKS[3], [9.4, 3.62, -4.7], -Math.PI / 2);
  // 카운터 맞은편 매대 (표지는 +x 방향)
  placeHeroBook(BOOKS[4], [-0.16, 1.5, -0.9], Math.PI / 2);
  // 카운터 위 · 에스프레소 옆
  placeHeroBook(BOOKS[6], [2.18, 1.26, 2.32], 0.12, 1.0);
  // 입구 복도 3단 조명 서가 (표지는 동쪽 +x)
  placeHeroBook(BOOKS[5], [-9.7, 2.15, 4.6], Math.PI / 2);
  // 그림책 아일랜드 위
  placeHeroBook(BOOKS[2], [-3.5, 1.45, -0.6], 0.16, 0.92);
  // 엽서 벽 한 줄 선반
  placeHeroBook(BOOKS[7], [6.4, 1.8, 0.52], 0.08, 0.85);

  /* ══════════════ 2층 카페 (복층 위 카페 층) ══════════════ */
  const f2 = new THREE.Group(); root.add(f2);
  const F2 = 3.92;            // 2층 바닥면 높이
  const F2C = 6.5;            // 2층 천장
  const WTOP = 6.55;          // 벽 상단
  const CX0 = -9.85, CX1 = 1.0, CZ0 = -8.85, CZ1 = 2.6;
  const HZ0 = -1.5, HX1 = -8.85;   // 계단 개구부 (서쪽 벽 · 남쪽 벽에 붙음)

  const wallZ2 = (x0, x1, y0, y1, z, mat, th = 0.2) =>
    meshBox(x1 - x0, y1 - y0, th, mat, [(x0 + x1) / 2, (y0 + y1) / 2, z], f2);
  const wallX2 = (z0, z1, y0, y1, x, mat, th = 0.2) =>
    meshBox(th, y1 - y0, z1 - z0, mat, [x, (y0 + y1) / 2, (z0 + z1) / 2], f2);

  /* 바닥 슬래브 (계단 개구부 비움 · 아래면은 1층 천장 마감) */
  const slab2 = (x0, x1, z0, z1) => {
    const geo = new THREE.BoxGeometry(x1 - x0, 0.2, z1 - z0);
    const m = new THREE.Mesh(geo, [mats.slabEdge, mats.slabEdge, mats.floor2, mats.ceil1F, mats.slabEdge, mats.slabEdge]);
    m.position.set((x0 + x1) / 2, F2 - 0.1, (z0 + z1) / 2);
    f2.add(m);
    return m;
  };
  slab2(CX0, CX1, CZ0, HZ0);
  slab2(HX1, CX1, HZ0, CZ1);
  // 슬래브 마감 엣지 (보이드 쪽 · 계단 개구부)
  meshBox(0.07, 0.22, HZ0 - CZ0, mats.slabEdge, [CX1 + 0.03, F2 - 0.1, (CZ0 + HZ0) / 2], f2);
  meshBox(CX1 - HX1, 0.22, 0.07, mats.slabEdge, [(HX1 + CX1) / 2, F2 - 0.1, HZ0 - 0.03], f2);

  /* 천장 (화이트) */
  const ceil2 = new THREE.Mesh(new THREE.PlaneGeometry(CX1 - CX0 + 0.7, CZ1 - CZ0 + 0.6), mats.whiteCeil);
  ceil2.rotation.x = Math.PI / 2;
  ceil2.position.set((CX0 + CX1) / 2, F2C, (CZ0 + CZ1) / 2);
  f2.add(ceil2);

  /* 벽체 — 북쪽(창 2개) */
  const NW = -8.95;
  wallZ2(CX0, -6.0, 3.85, WTOP, NW, mats.concreteLight);
  wallZ2(-3.4, -1.2, 3.85, WTOP, NW, mats.concreteLight);
  wallZ2(-0.4, CX1, 3.85, WTOP, NW, mats.concreteLight);
  wallZ2(-6.0, -3.4, 3.85, 4.82, NW, mats.concreteLight);
  wallZ2(-6.0, -3.4, 6.22, WTOP, NW, mats.concreteLight);
  wallZ2(-1.2, -0.4, 3.85, 4.42, NW, mats.concreteLight);
  wallZ2(-1.2, -0.4, 6.27, WTOP, NW, mats.concreteLight);

  /* 벽체 — 서쪽(세로 창) */
  const WW = -9.95;
  wallX2(-9.0, -6.4, 3.85, WTOP, WW, mats.concreteLight);
  wallX2(-5.4, 2.7, 3.85, WTOP, WW, mats.concreteLight);
  wallX2(-6.4, -5.4, 3.85, 4.5, WW, mats.concreteLight);
  wallX2(-6.4, -5.4, 6.25, WTOP, WW, mats.concreteLight);

  /* 벽체 — 남쪽(발코니 문 + 통창) */
  const SW = 2.72;
  wallZ2(CX0, -8.5, 3.85, WTOP, SW, mats.concreteLight);
  wallZ2(-8.5, -7.1, 6.02, WTOP, SW, mats.concreteLight);
  wallZ2(-7.1, -4.0, 3.85, WTOP, SW, mats.concreteLight);
  wallZ2(-4.0, -0.8, 3.85, 4.47, SW, mats.concreteLight);
  wallZ2(-4.0, -0.8, 6.27, WTOP, SW, mats.concreteLight);
  wallZ2(-0.8, CX1, 3.85, WTOP, SW, mats.concreteLight);

  /* 벽체 — 동쪽 칸막이 (보이드 구간은 난간) */
  wallX2(-1.55, 2.72, 3.85, WTOP, 1.11, mats.concreteLight, 0.22);
  // 난간 위 천장 단차 마감
  wallX2(-9.0, -1.2, F2C, 7.06, 1.11, mats.concreteLight, 0.22);

  /* 창 — 북쪽 통창 (청도 마을·산) */
  const viewN = mountainViewTexture(1100, 540);
  const winN1 = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.4), new THREE.MeshBasicMaterial({ map: viewN }));
  winN1.position.set(-4.7, 5.52, -9.07);
  f2.add(winN1);
  meshBox(2.72, 0.07, 0.14, mats.whiteWall, [-4.7, 6.24, -8.88], f2);
  meshBox(2.72, 0.07, 0.22, mats.whiteWall, [-4.7, 4.8, -8.86], f2);
  meshBox(0.07, 1.44, 0.14, mats.whiteWall, [-6.02, 5.52, -8.88], f2);
  meshBox(0.07, 1.44, 0.14, mats.whiteWall, [-3.38, 5.52, -8.88], f2);
  meshBox(0.045, 1.4, 0.1, mats.whiteWall, [-4.7, 5.52, -8.9], f2);

  /* 창 — 북쪽 작은 창 */
  const viewW = mountainViewTexture(760, 1180);
  const winN2 = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 1.85), new THREE.MeshBasicMaterial({ map: viewW }));
  winN2.position.set(-0.8, 5.345, -9.07);
  f2.add(winN2);
  meshBox(0.92, 0.06, 0.14, mats.whiteWall, [-0.8, 6.28, -8.88], f2);
  meshBox(0.92, 0.07, 0.2, mats.whiteWall, [-0.8, 4.4, -8.86], f2);
  meshBox(0.06, 1.88, 0.14, mats.whiteWall, [-1.22, 5.345, -8.88], f2);
  meshBox(0.06, 1.88, 0.14, mats.whiteWall, [-0.38, 5.345, -8.88], f2);

  /* 창 — 서쪽 세로 창 */
  const winW = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.75), new THREE.MeshBasicMaterial({ map: viewW }));
  winW.rotation.y = Math.PI / 2;
  winW.position.set(-10.07, 5.375, -5.9);
  f2.add(winW);
  meshBox(0.14, 0.06, 1.1, mats.whiteWall, [-9.88, 6.27, -5.9], f2);
  meshBox(0.2, 0.07, 1.1, mats.whiteWall, [-9.86, 4.48, -5.9], f2);
  meshBox(0.14, 1.79, 0.06, mats.whiteWall, [-9.88, 5.375, -6.42], f2);
  meshBox(0.14, 1.79, 0.06, mats.whiteWall, [-9.88, 5.375, -5.38], f2);

  /* 발코니 — 유리문 */
  meshBox(1.48, 0.08, 0.18, mats.whiteWall, [-7.8, 6.0, SW], f2);
  meshBox(1.48, 0.1, 0.2, mats.whiteWall, [-7.8, 3.96, SW], f2);
  meshBox(0.08, 2.14, 0.18, mats.whiteWall, [-8.5, 4.97, SW], f2);
  meshBox(0.08, 2.14, 0.18, mats.whiteWall, [-7.1, 4.97, SW], f2);
  meshBox(0.06, 2.06, 0.16, mats.whiteWall, [-7.8, 4.97, SW], f2);
  const doorGlass2 = new THREE.Mesh(new THREE.PlaneGeometry(1.36, 2.0), mats.glass);
  doorGlass2.position.set(-7.8, 4.97, SW + 0.02);
  f2.add(doorGlass2);
  meshBox(0.028, 0.5, 0.028, mats.steel, [-7.87, 4.9, SW - 0.06], f2);
  // 비상구 표시
  meshBox(0.3, 0.16, 0.03, new THREE.MeshStandardMaterial({ color: 0x2f8a52, roughness: 0.6, emissive: 0x1d5a34, emissiveIntensity: 0.7 }), [-7.8, 6.24, SW - 0.11], f2);

  /* 통창 (남쪽 · 청도 산과 마을) */
  meshBox(3.26, 0.07, 0.16, mats.whiteWall, [-2.4, 6.29, SW - 0.04], f2);
  meshBox(3.26, 0.08, 0.26, mats.whiteWall, [-2.4, 4.44, SW - 0.06], f2);
  meshBox(0.07, 1.84, 0.16, mats.whiteWall, [-4.02, 5.37, SW - 0.04], f2);
  meshBox(0.07, 1.84, 0.16, mats.whiteWall, [-0.78, 5.37, SW - 0.04], f2);
  meshBox(0.05, 1.8, 0.12, mats.whiteWall, [-2.4, 5.37, SW - 0.05], f2);
  // 창턱 위 화분
  for (let i = 0; i < 3; i++) {
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.042, 0.09, 12), new THREE.MeshStandardMaterial({ color: [0xc9bda9, 0xf0ece2, 0xb9ae9c][i], roughness: 0.9 }));
    pot.position.set(-3.3 + i * 0.5, 4.52, SW - 0.1);
    f2.add(pot);
  }

  /* 발코니 데크 (야외 우드) */
  const deck = new THREE.Group(); f2.add(deck);
  const deckFloor = meshBox(8.6, 0.1, 1.75, mats.oak, [-4.5, F2 - 0.07, 3.72], deck);
  for (let i = 0; i < 18; i++) meshBox(0.02, 0.014, 1.75, mats.darkWood, [-8.7 + i * 0.48, F2 - 0.012, 3.72], deck);
  // 난간
  meshBox(8.6, 0.05, 0.05, mats.trackBlack, [-4.5, F2 + 1.05, 4.55], deck);
  for (let i = 0; i < 15; i++) meshBox(0.028, 1.05, 0.028, mats.trackBlack, [-8.7 + i * 0.61, F2 + 0.52, 4.55], deck);
  meshBox(8.6, 0.022, 0.022, mats.steel, [-4.5, F2 + 0.5, 4.55], deck);
  // 양 끝 세로 우드 루버
  for (let i = 0; i < 11; i++) {
    meshBox(0.05, 2.35, 0.02, mats.warmWood, [-8.78 + i * 0.1, F2 + 1.18, 4.4], deck);
    meshBox(0.05, 2.35, 0.02, mats.warmWood, [-1.25 + i * 0.1, F2 + 1.18, 4.4], deck);
  }
  // 데크 화분
  for (const [px, pz, s] of [[-6.4, 3.05, 1.2], [-3.1, 3.02, 1.0], [-1.7, 3.06, 1.15]]) {
    const pl = makePlant(s, mats); pl.position.set(px, F2 - 0.02, pz); deck.add(pl);
  }
  // 발코니 밖 청도 파노라마 (산릉선이 창 높이에 오도록)
  const viewS = mountainViewTexture(1400, 560);
  const backS = new THREE.Mesh(new THREE.PlaneGeometry(15, 3.6), new THREE.MeshBasicMaterial({ map: viewS }));
  backS.rotation.y = Math.PI;
  backS.position.set(-4.6, 5.45, 5.3);
  f2.add(backS);

  /* 복층 보이드 난간 (검정 세로 살대) */
  const railG = new THREE.Group(); f2.add(railG);
  const SLATS = 68;
  const slatMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(0.03, 1.02, 0.03), mats.black, SLATS);
  const dmy = new THREE.Object3D();
  for (let i = 0; i < SLATS; i++) {
    dmy.position.set(1.03, F2 + 0.53, -8.72 + i * (7.14 / (SLATS - 1)));
    dmy.updateMatrix();
    slatMesh.setMatrixAt(i, dmy.matrix);
  }
  slatMesh.instanceMatrix.needsUpdate = true;
  railG.add(slatMesh);
  meshBox(0.09, 0.055, 7.36, mats.black, [1.03, F2 + 1.06, -5.17], railG);
  meshBox(0.06, 0.04, 7.36, mats.black, [1.03, F2 + 0.05, -5.17], railG);
  // 계단 개구부 난간
  for (let i = 0; i < 9; i++) meshBox(0.026, 1.0, 0.026, mats.black, [-8.87, F2 + 0.52, -1.35 + i * 0.49], railG);
  meshBox(0.05, 0.05, 4.14, mats.black, [-8.87, F2 + 1.03, 0.58], railG);
  meshBox(0.04, 0.04, 4.14, mats.black, [-8.87, F2 + 0.09, 0.58], railG);

  /* 천장 — 사각 웜톤 매입등 */
  const downlight2 = (x, z) => {
    meshBox(0.46, 0.07, 0.46, mats.whiteWall, [x, F2C - 0.035, z], f2);
    const p = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.34), mats.downLight);
    p.rotation.x = Math.PI / 2;
    p.position.set(x, F2C - 0.078, z);
    f2.add(p);
  };
  [[-7.6, -6.8], [-4.6, -6.8], [-1.6, -6.8], [-7.6, -3.9], [-4.6, -3.9], [-1.6, -3.9],
   [-4.6, -1.5], [-1.6, -1.5], [-4.6, 0.8], [-1.6, 0.8]].forEach(([x, z]) => downlight2(x, z));

  /* 우드 천장 포인트 (계단 위) */
  const woodCeil = meshBox(3.0, 0.14, 3.6, mats.woodCeil, [-8.2, F2C - 0.08, 0.6], f2);
  for (let i = 0; i < 12; i++) meshBox(0.02, 0.02, 3.6, mats.darkWood, [-9.65 + i * 0.27, F2C - 0.16, 0.6], f2);
  meshBox(3.05, 0.03, 0.04, mats.lightStrip, [-8.2, F2C - 0.165, -1.12], f2);
  meshBox(3.05, 0.03, 0.04, mats.lightStrip, [-8.2, F2C - 0.165, 2.32], f2);
  // 시스템 에어컨
  meshBox(0.94, 0.1, 0.94, mats.whiteWall, [-1.6, F2C - 0.05, -2.5], f2);
  for (let i = 0; i < 9; i++) meshBox(0.82, 0.012, 0.012, mats.blackMatte, [-1.6, F2C - 0.104, -2.86 + i * 0.09], f2);

  /* 가구 — 중앙 화이트 테이블 2개 + 딥그린·블랙 쉘 체어 */
  const seatAt = (obj, x, z, tx, tz) => {
    obj.position.set(x, F2, z);
    obj.rotation.y = Math.atan2(tx - x, tz - z);
    f2.add(obj);
    return obj;
  };
  const t1 = makeWhiteTable(mats, 1.5, 0.95); t1.position.set(-3.5, F2, -1.4); f2.add(t1);
  const t2 = makeWhiteTable(mats, 1.5, 0.95); t2.position.set(-3.5, F2, -3.6); f2.add(t2);
  seatAt(makeShellChair(mats, mats.teal), -4.45, -1.05, -3.5, -1.4);
  seatAt(makeShellChair(mats, mats.teal), -2.55, -1.05, -3.5, -1.4);
  seatAt(makeShellChair(mats, mats.shellBlack), -4.4, -1.98, -3.5, -1.4);
  seatAt(makeShellChair(mats, mats.teal), -2.6, -1.98, -3.5, -1.4);
  seatAt(makeShellChair(mats, mats.tealDark), -4.45, -3.25, -3.5, -3.6);
  seatAt(makeShellChair(mats, mats.teal), -2.55, -3.25, -3.5, -3.6);
  seatAt(makeShellChair(mats, mats.teal), -4.4, -4.2, -3.5, -3.6);
  seatAt(makeShellChair(mats, mats.shellBlack), -2.6, -4.2, -3.5, -3.6);

  /* 가구 — 난간 옛 초록 원형 테이블 + 코랄·우드 체어 */
  const greenT = makeGreenTable(mats); greenT.position.set(0.3, F2, -5.9); f2.add(greenT);
  seatAt(makeShellChair(mats, mats.coral, mats.chrome), -0.55, -5.42, 0.3, -5.9);
  seatAt(makeBentwood(mats), 0.52, -6.78, 0.3, -5.9);

  /* 가구 — 창가 라운지 (버건디·그레이 암체어 + 검정 원형 테이블) */
  const wireT = makeWireTable(mats); wireT.position.set(-2.2, F2, 0.5); f2.add(wireT);
  seatAt(makeSlingChair(mats, mats.burgundy), -3.2, 0.1, -2.2, 0.5);
  seatAt(makeSlingChair(mats, mats.burgundy), -1.25, 0.0, -2.2, 0.5);
  seatAt(makePipeArmchair(mats, mats.fabricWarmGrey), -2.55, 1.6, -2.2, 0.5);

  /* 가구 — 계단 입구 (민트 스툴 + 화이트 삼각 테이블 + 그레이 1인 소파) */
  const mintB = makeMintBench(mats); mintB.position.set(-7.7, F2, 2.24); f2.add(mintB);
  const triT = makeTriTable(mats); triT.position.set(-6.68, F2, 2.02); f2.add(triT);
  seatAt(makeSingleSofa(mats), -5.78, 2.16, -5.78, 0.0);
  const art2 = makeArtFrame(mats, 1.15, 1.5);
  art2.position.set(-5.78, 5.32, 2.6);
  art2.rotation.y = Math.PI;
  f2.add(art2);

  /* 셀프 바 — 빈티지 트렁크 (물·냅킨·안내문) */
  const trunkBar = makeTrunkBar(mats);
  trunkBar.position.set(0.74, F2, 1.15);
  trunkBar.rotation.y = -Math.PI / 2;
  f2.add(trunkBar);
  // 셀프 바 안내 포스터 (빈티지 트렁크 위 벽면)
  const pcv = document.createElement('canvas'); pcv.width = 520; pcv.height = 720;
  const pcg = pcv.getContext('2d');
  pcg.fillStyle = '#f4f0e4'; pcg.fillRect(0, 0, 520, 720);
  const phg = pcg.createLinearGradient(0, 56, 0, 306);
  phg.addColorStop(0, '#5f3f26'); phg.addColorStop(0.6, '#3c2516'); phg.addColorStop(1, '#2a1a0e');
  pcg.fillStyle = phg; pcg.fillRect(40, 56, 440, 250);
  for (let i = 0; i < 110; i++) {
    pcg.beginPath();
    pcg.ellipse(rand(48, 472), rand(64, 298), rand(5, 13), rand(4, 10), rand(0, 3), 0, 7);
    pcg.fillStyle = `rgba(${120 + rand(-30, 60) | 0},${82 + rand(-20, 40) | 0},${50 + rand(-20, 30) | 0},${rand(0.12, 0.45)})`;
    pcg.fill();
  }
  pcg.fillStyle = '#3a3128';
  pcg.font = '600 36px "Apple SD Gothic Neo","Noto Sans KR",sans-serif';
  pcg.fillText('OH MY COFFEE', 42, 372);
  pcg.font = '400 20px "Apple SD Gothic Neo","Noto Sans KR",sans-serif';
  pcg.fillStyle = 'rgba(58,49,40,.6)';
  pcg.fillText('STAY ON PAGE · CHEONGDO', 42, 404);
  pcg.fillStyle = '#3a3128';
  pcg.font = '500 26px "Apple SD Gothic Neo","Noto Sans KR",sans-serif';
  pcg.fillText('오늘의 원두', 42, 462);
  pcg.font = '400 24px "Apple SD Gothic Neo","Noto Sans KR",sans-serif';
  pcg.fillText('청도 블렌드 · 에티오피아 내추럴', 42, 500);
  pcg.font = '400 24px "Apple SD Gothic Neo","Noto Sans KR",sans-serif';
  pcg.fillStyle = 'rgba(58,49,40,.85)';
  pcg.fillText('물 · 냅킨 · 컵은', 42, 580);
  pcg.fillText('셀프로 이용해 주세요', 42, 616);
  pcg.strokeStyle = 'rgba(58,49,40,.25)'; pcg.lineWidth = 2;
  pcg.beginPath(); pcg.moveTo(42, 644); pcg.lineTo(478, 644); pcg.stroke();
  pcg.font = '400 19px "Apple SD Gothic Neo","Noto Sans KR",sans-serif';
  pcg.fillStyle = 'rgba(58,49,40,.5)';
  pcg.fillText('다 쓴 컵은 아래 선반에 두고 가 주세요', 42, 682);
  const posterTexC = new THREE.CanvasTexture(pcv);
  posterTexC.colorSpace = THREE.SRGBColorSpace;
  posterTexC.anisotropy = 8;
  const posterC = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.84), new THREE.MeshStandardMaterial({ map: posterTexC, roughness: 0.92 }));
  posterC.rotation.y = -Math.PI / 2;
  posterC.position.set(0.975, 5.3, 1.15);
  f2.add(posterC);
  meshBox(0.03, 0.9, 0.66, mats.whiteWall, [1.0, 5.3, 1.15], f2);

  /* 벽 선반 · 블랙 책장 (2층 독서용) */
  const shelf2 = makeShelf({ width: 2.6, height: 2.32, depth: 0.36, rows: 5, cols: 5, mats, palette: 'adult' });
  shelf2.position.set(-8.3, F2, -8.66);
  f2.add(shelf2);
  // 난간 옛 사이드 선반
  meshBox(0.9, 0.05, 0.24, mats.warmWood, [0.72, F2 + 1.05, -3.4], f2);
  // 화분 · 소품
  const pL = makePlant(1.25, mats); pL.position.set(-9.45, F2, -6.9); f2.add(pL);
  const pL2 = makePlant(1.4, mats); pL2.position.set(-0.15, F2, 2.2); f2.add(pL2);
  // 소화기
  const ext = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.46, 14), new THREE.MeshStandardMaterial({ color: 0xb4302a, roughness: 0.55 }));
  ext.position.set(0.82, F2 + 0.23, -1.95); f2.add(ext);
  const extTop = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.1, 8), mats.black);
  extTop.position.set(0.82, F2 + 0.51, -1.95); f2.add(extTop);

  /* 2층 테이블 위 펼친 책 (눌러서 읽기) */
  const f2Book = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.025, 0.32),
    new THREE.MeshStandardMaterial({ color: 0xe8dcc4, roughness: 0.9 })
  );
  f2Book.position.set(-3.35, F2 + 0.77, -1.45);
  f2Book.rotation.y = 0.22;
  f2Book.userData.bookId = BOOKS[3].id;
  f2.add(f2Book);
  clickables.push(f2Book);
  const f2Cup = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.037, 0.1, 18), new THREE.MeshPhysicalMaterial({ color: 0xe9f0ec, roughness: 0.06, transparent: true, opacity: 0.4 }));
  f2Cup.position.set(-3.05, F2 + 0.81, -1.2); f2.add(f2Cup);
  const f2Coffee = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.031, 0.062, 18), new THREE.MeshStandardMaterial({ color: 0x3a2012, roughness: 0.3 }));
  f2Coffee.position.set(-3.05, F2 + 0.79, -1.2); f2.add(f2Coffee);

  /* 2층 조명 */
  // 가구 밑 접지 그림자 (공간감)
  contactShadow(f2, -3.5, -1.4, 2.6, 1.9, 0.4, F2 + 0.008);
  contactShadow(f2, -3.5, -3.6, 2.6, 1.9, 0.4, F2 + 0.008);
  contactShadow(f2, 0.3, -5.9, 1.5, 1.5, 0.38, F2 + 0.008);
  contactShadow(f2, -2.2, 0.6, 3.0, 2.2, 0.36, F2 + 0.008);
  contactShadow(f2, -6.8, 2.15, 3.4, 1.2, 0.34, F2 + 0.008);
  contactShadow(f2, 0.6, 1.15, 1.5, 1.4, 0.34, F2 + 0.008);
  contactShadow(f2, -8.3, -8.3, 2.8, 1.0, 0.4, F2 + 0.008);
  const f2Lights = [
    [[-7.4, 5.8, -6.2], 0xfff2e2, 20, 7.6],
    [[-4.2, 5.8, -4.6], 0xfff4e6, 26, 8.0],
    [[-1.4, 5.8, -3.2], 0xfff2e2, 20, 7.0],
    [[-4.0, 5.8, 1.4], 0xfff0d8, 24, 7.2],
  ];
  f2Lights.forEach(([pos, color, intensity, dist]) => {
    const l = new THREE.PointLight(color, intensity, dist, 2);
    l.position.set(...pos);
    scene.add(l);
  });

  /* ── 커피 머신 클릭 영역 ── */
  const coffeeHotspot = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.55, 0.5),
    new THREE.MeshBasicMaterial({ color: 0xffd9a0, transparent: true, opacity: 0.0 })
  );
  coffeeHotspot.position.set(1.1, 1.32, 2.02);
  coffeeHotspot.userData.action = 'coffee';
  root.add(coffeeHotspot);
  clickables.push(coffeeHotspot);

  // 카운터 위 은은한 표시 링
  const ringHint = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.006, 8, 32), new THREE.MeshBasicMaterial({ color: 0xd9b184, transparent: true, opacity: 0.55 }));
  ringHint.rotation.x = -Math.PI / 2;
  ringHint.position.set(1.06, 1.075, 2.3);
  root.add(ringHint);

  /* ── 업데이트 ── */
  let t = 0;
  function update(dt) {
    t += dt;
    ringHint.material.opacity = 0.28 + Math.sin(t * 2.2) * 0.2;
    if (coffee.steamParticles) { /* handled in coffee.js */ }
  }

  return {
    scene, root, mats, zones: ZONES, coffee, bookSpots, clickables, postcardSlots,
    update, ringHint, coffeeHotspot, teaWall, ondalPoint,
  };
}
