// ───────── 오마이북 3D · 앱 ─────────
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { buildWorld, ZONES } from './world.js';
import { BOOKS, COFFEE_MENU, POSTCARD_COLORS } from './data.js';
import { CoffeeGame } from './coffee.js';
import { loadState, saveState } from './store.js';
import { bookCover } from './tex.js';

const $ = (id) => document.getElementById(id);
const state = loadState();

/* ───────── 렌더러 ───────── */
const canvas = $('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.05, 80);

const world = buildWorld(renderer);
const scene = world.scene;

/* ───────── 카메라 컨트롤 ───────── */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.075;
controls.rotateSpeed = 0.55;
controls.zoomSpeed = 0.7;
controls.panSpeed = 0.6;
controls.enablePan = true;
controls.screenSpacePanning = true;
controls.minDistance = 0.4;
controls.maxDistance = 14;
controls.maxPolarAngle = Math.PI * 0.52;
controls.minPolarAngle = 0.25;
controls.target.set(...ZONES.entrance.target);
camera.position.set(...ZONES.entrance.pos);
camera.lookAt(controls.target);

const camCtl = {
  from: null, to: null, t: 0, dur: 1, active: false,
  fovFrom: 52, fovTo: 52,
  move(pos, target, fov = 52, dur = 1300) {
    this.from = { pos: camera.position.clone(), target: controls.target.clone(), fov: camera.fov };
    this.to = { pos: new THREE.Vector3(...pos), target: new THREE.Vector3(...target), fov };
    this.t = 0; this.dur = dur / 1000; this.active = true;
    controls.enabled = false;
  },
  zone(key) {
    const z = ZONES[key];
    if (!z) return;
    this.move(z.pos, z.target, 52, 1250);
    setActiveZone(key);
  },
  update(dt) {
    if (!this.active) return;
    this.t = Math.min(1, this.t + dt / this.dur);
    const e = this.t < 0.5 ? 4 * this.t * this.t * this.t : 1 - Math.pow(-2 * this.t + 2, 3) / 2;
    camera.position.lerpVectors(this.from.pos, this.to.pos, e);
    controls.target.lerpVectors(this.from.target, this.to.target, e);
    camera.fov = this.from.fov + (this.to.fov - this.from.fov) * e;
    camera.updateProjectionMatrix();
    camera.lookAt(controls.target);
    if (this.t >= 1) { this.active = false; controls.enabled = true; }
  },
};

/* ───────── 좌표계 도움 ───────── */
function goToBookSpot(book) {
  const s = world.bookSpots[book.spot];
  if (!s) { camCtl.zone(book.viewZone); return; }
  const p = s.pos;
  const dir = new THREE.Vector3(Math.sin(s.rotY), 0, Math.cos(s.rotY));
  const eye = p.clone().add(dir.multiplyScalar(0.95)).add(new THREE.Vector3(0, 0.12, 0));
  camCtl.move([eye.x, Math.max(1.25, eye.y), eye.z], [p.x, p.y, p.z], 46, 1100);
}

/* ───────── UI: 존 ───────── */
const ZONE_LABEL = { entrance: '입구', counter: '카운터 바', postcard: '엽서 벽', ondal: '다락 좌식방', library: '복층 서재', cafe2: '2층 카페' };
function setActiveZone(key) {
  document.querySelectorAll('#zones button, #dock button').forEach((b) => b.classList.toggle('on', b.dataset.zone === key));
  $('coffeeHint').classList.toggle('hidden', key !== 'counter' || coffee.open_ || !state.letters);
}
document.querySelectorAll('#zones button').forEach((b) => b.addEventListener('click', () => camCtl.zone(b.dataset.zone)));

const dock = $('dock');
Object.entries(ZONE_LABEL).forEach(([k, label]) => {
  const b = document.createElement('button');
  b.dataset.zone = k; b.textContent = label;
  b.addEventListener('click', () => camCtl.zone(k));
  dock.appendChild(b);
});
dock.firstChild.classList.add('on');

/* ───────── 토스트 ───────── */
let toastTimer = null;
function toast(msg, ms = 2600) {
  const el = $('toast');
  el.textContent = msg;
  el.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('on'), ms);
}

/* ───────── 커피 ───────── */
const coffee = new CoffeeGame({
  rig: world.coffee,
  cam: camCtl,
  toast,
  unlocked: state.unlocked,
  onUnlockChange: (n) => { state.unlocked = n; saveState(state); toast(`새 메뉴 해금 · ${COFFEE_MENU[n - 1].name}`); },
});

/* ───────── 책 ───────── */
const coverURLs = {};
function coverURL(book) {
  if (!coverURLs[book.id]) coverURLs[book.id] = bookCover(book).toDataURL('image/jpeg', 0.9);
  return coverURLs[book.id];
}

const bookPanel = $('bookPanel');
let currentBook = null;

function openBook(book) {
  currentBook = book;
  $('bpCover').src = coverURL(book);
  $('bpCover').alt = book.title;
  $('bpTitle').textContent = book.title;
  $('bpAuthor').textContent = book.author ? `${book.author}` : book.byline || '오마이북 큐레이션';
  $('bpNote').textContent = book.note;
  const q = $('bpQuote');
  if (book.quote) {
    q.innerHTML = `${book.quote}<cite>${book.quoteBy || ''}</cite>`;
    q.classList.remove('hidden');
  } else q.classList.add('hidden');
  $('bpShelf').textContent = book.shelf;
  renderPanelReviews(book.id);
  bookPanel.classList.add('open');
  clearHover();
}
function closeBook() { bookPanel.classList.remove('open'); currentBook = null; }
document.querySelectorAll('[data-close="bookPanel"]').forEach((b) => b.addEventListener('click', closeBook));

function stars(n) { return '★'.repeat(n) + '☆'.repeat(5 - n); }

function renderPanelReviews(bookId) {
  const list = state.reviews[bookId] || [];
  $('bpReviewCount').textContent = list.length;
  const el = $('bpReviews');
  if (!list.length) { el.innerHTML = '<p class="empty">아직 이 책의 독후감이 없어요.<br/>첫 번째 문장을 남겨 보세요.</p>'; return; }
  el.innerHTML = list.slice(-3).reverse().map((r) => `
    <div class="review">
      <div class="stars-line">${stars(r.rating || 5)}</div>
      ${r.one ? `<b>${escapeHtml(r.one)}</b>` : ''}
      ${r.text ? `<p>${escapeHtml(r.text)}</p>` : ''}
      <span class="who">${escapeHtml(r.name || '익명')} · ${r.at}</span>
    </div>`).join('');
}

$('bpReview').addEventListener('click', () => { if (currentBook) openWrite(currentBook); });
$('bpBoard').addEventListener('click', () => { if (currentBook) openBoard(currentBook.id); });

/* 독후감 쓰기 */
const writeModal = $('writeModal');
let writeBook = null, writeRating = 5;
function openWrite(book) {
  writeBook = book;
  writeRating = 5;
  $('wmTitle').textContent = book.title;
  $('wOne').value = ''; $('wText').value = ''; $('wName').value = localStorage.getItem('ohmybook3d.name') || '';
  paintStars();
  writeModal.classList.add('open');
}
function paintStars() {
  document.querySelectorAll('#wStars button').forEach((b) => b.classList.toggle('on', Number(b.dataset.v) <= writeRating));
}
document.querySelectorAll('#wStars button').forEach((b) => b.addEventListener('click', () => { writeRating = Number(b.dataset.v); paintStars(); }));

$('wSubmit').addEventListener('click', () => {
  if (!writeBook) return;
  const one = $('wOne').value.trim();
  const text = $('wText').value.trim();
  const name = $('wName').value.trim();
  if (!one && !text) { toast('한 줄 평이나 독후감을 적어 주세요.'); return; }
  if (name) localStorage.setItem('ohmybook3d.name', name);
  const list = state.reviews[writeBook.id] || (state.reviews[writeBook.id] = []);
  list.push({ rating: writeRating, one, text, name, at: new Date().toISOString().slice(0, 10) });
  saveState(state);
  writeModal.classList.remove('open');
  renderPanelReviews(writeBook.id);
  toast('독후감을 남겼어요. 책과 함께 보관됩니다.');
});

/* 독후감 보드 */
const reviewModal = $('reviewModal');
function openBoard(bookId) {
  const book = bookId ? BOOKS.find((b) => b.id === bookId) : null;
  $('rmTitle').textContent = book ? `${book.title} · 독후감` : '독후감 보드';
  const ids = book ? [bookId] : Object.keys(state.reviews);
  let html = '';
  for (const id of ids) {
    const list = state.reviews[id] || [];
    if (!list.length) continue;
    const b = BOOKS.find((x) => x.id === id);
    html += `<div style="margin-bottom:22px">
      <p class="kicker">${b ? b.title : id}</p>
      ${list.slice().reverse().map((r) => `<div class="review" style="margin-bottom:8px">
        <div class="stars-line" style="color:#c9a27a;font-size:11px;letter-spacing:.14em;margin-bottom:6px">${stars(r.rating || 5)}</div>
        ${r.one ? `<b style="display:block;font-size:12.5px;margin-bottom:4px">${escapeHtml(r.one)}</b>` : ''}
        ${r.text ? `<p style="margin:0;font-size:12px;line-height:1.7;color:rgba(244,238,228,.62)">${escapeHtml(r.text)}</p>` : ''}
        <span style="font-size:10.5px;color:rgba(244,238,228,.36);display:block;margin-top:7px">${escapeHtml(r.name || '익명')} · ${r.at}</span>
      </div>`).join('')}
    </div>`;
  }
  $('rmList').innerHTML = html || '<p class="empty">아직 남겨진 독후감이 없어요.<br/>서가의 책을 눌러 첫 문장을 남겨 보세요.</p>';
  reviewModal.classList.add('open');
}
$('btn-reviews').addEventListener('click', () => openBoard(null));
$('btn-books').addEventListener('click', () => { booksModal.classList.add('open'); });

const booksModal = $('booksModal');
$('booksList').innerHTML = BOOKS.map((b) => `
  <button class="book-item" data-book="${b.id}">
    <img src="${coverURL(b)}" alt="" />
    <div>
      <div class="bi-t">${escapeHtml(b.title)}</div>
      <div class="bi-a">${escapeHtml(b.author || b.byline || '')}</div>
      <div class="bi-c">${(state.reviews[b.id] || []).length}개의 독후감</div>
    </div>
  </button>`).join('');
document.querySelectorAll('[data-book]').forEach((b) => b.addEventListener('click', () => {
  const book = BOOKS.find((x) => x.id === b.dataset.book);
  booksModal.classList.remove('open');
  goToBookSpot(book);
  setTimeout(() => openBook(book), 650);
}));

/* ───────── 엽서 ───────── */
const letterModal = $('letterModal');
let letterColor = POSTCARD_COLORS[0];
$('btn-letter').addEventListener('click', () => {
  letterModal.classList.add('open');
  if (state.letters.length) $('lTo').value = '오늘 이 자리에 앉은 누군가에게';
  updatePreview();
});

const sw = $('lSwatches');
POSTCARD_COLORS.forEach((c, i) => {
  const b = document.createElement('button');
  b.style.background = c;
  if (i === 0) b.classList.add('on');
  b.addEventListener('click', () => {
    letterColor = c;
    [...sw.children].forEach((x) => x.classList.remove('on'));
    b.classList.add('on');
    $('lPreview').style.background = c;
  });
  sw.appendChild(b);
});

function updatePreview() {
  $('lpTo').textContent = ($('lTo').value.trim() || 'To.') .startsWith('To') ? ($('lTo').value.trim() || 'To.') : `To. ${$('lTo').value.trim()}`;
  $('lpBody').textContent = $('lBody').value.trim() || '오늘의 문장을 적어 보세요.';
  $('lpFrom').textContent = $('lFrom').value.trim() ? `— ${$('lFrom').value.trim()}` : '';
}
['lTo', 'lBody', 'lFrom'].forEach((id) => $(id).addEventListener('input', updatePreview));

/* 엽서 텍스처 */
function postcardTexture(letter) {
  const W = 512, H = 330;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = letter.color || '#f4eee4'; g.fillRect(0, 0, W, H);
  // 종이 결
  for (let i = 0; i < 900; i++) {
    g.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,.05)' : 'rgba(120,100,80,.04)';
    g.fillRect(Math.random() * W, Math.random() * H, 2, 2);
  }
  g.strokeStyle = 'rgba(120,104,86,.28)'; g.lineWidth = 1;
  g.strokeRect(14, 14, W - 28, H - 28);
  g.fillStyle = 'rgba(80,64,48,.55)';
  g.font = '500 20px "Apple SD Gothic Neo","Noto Sans KR",sans-serif';
  g.fillText(letter.to ? letter.to.slice(0, 26) : 'To.', 32, 54);
  g.fillStyle = '#382f26';
  g.font = '400 21px "Apple SD Gothic Neo","Noto Sans KR",sans-serif';
  const words = (letter.body || '').split('');
  const perLine = 22;
  let lines = [];
  for (let i = 0; i < words.length; i += perLine) lines.push(words.slice(i, i + perLine).join(''));
  lines = lines.slice(0, 6);
  lines.forEach((ln, i) => g.fillText(ln, 32, 100 + i * 32));
  if (letter.from) {
    g.font = '400 17px "Apple SD Gothic Neo","Noto Sans KR",sans-serif';
    g.fillStyle = 'rgba(70,58,46,.75)';
    g.textAlign = 'right';
    g.fillText(`— ${letter.from}`, W - 32, H - 34);
    g.textAlign = 'left';
  }
  // 테이프
  g.fillStyle = 'rgba(255,255,255,.45)';
  g.fillRect(W / 2 - 40, -6, 80, 22);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

const letterMeshes = [];
function placeLetter(letter) {
  const slot = world.postcardSlots[letter.slot % world.postcardSlots.length];
  if (!slot) return;
  const tex = postcardTexture(letter);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.22), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9, side: THREE.DoubleSide }));
  m.position.set(9.78 - (letter.slot % 3) * 0.004, slot.y, slot.z);
  m.rotation.y = -Math.PI / 2;
  m.rotation.z = ((letter.slot % 5) - 2) * 0.012;
  scene.add(m);
  letterMeshes.push(m);
  return m;
}
state.letters.forEach((l) => placeLetter(l));

$('lSubmit').addEventListener('click', () => {
  const body = $('lBody').value.trim();
  if (!body) { toast('남길 글을 적어 주세요.'); return; }
  const letter = {
    to: $('lTo').value.trim() || '오늘 이 자리에 앉은 누군가에게',
    body,
    from: $('lFrom').value.trim(),
    color: letterColor,
    slot: state.letters.length,
    at: new Date().toISOString().slice(0, 10),
  };
  state.letters.push(letter);
  saveState(state);
  placeLetter(letter);
  letterModal.classList.remove('open');
  $('lBody').value = '';
  camCtl.zone('postcard');
  toast('엽서를 벽에 붙였어요. 이 브라우저에 저장됩니다.');
});

/* 모달 닫기 */
document.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => {
  const id = b.dataset.close;
  if (id === 'bookPanel') closeBook();
  else $(id).classList.remove('open');
}));
document.querySelectorAll('.modal').forEach((m) => m.addEventListener('click', (e) => { if (e.target === m) m.classList.remove('open'); }));
window.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (coffee.open_) { coffee.close(); return; }
  document.querySelectorAll('.modal.open').forEach((m) => m.classList.remove('open'));
  closeBook();
});

/* ───────── 레이캐스트 ───────── */
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

const tooltip = document.createElement('div');
tooltip.id = 'bookTip';
tooltip.style.cssText = 'position:fixed;z-index:25;pointer-events:none;padding:7px 12px;border-radius:999px;background:rgba(18,15,12,.9);border:1px solid rgba(201,162,122,.4);color:#e6caa6;font-size:11.5px;opacity:0;transition:opacity .2s;white-space:nowrap;backdrop-filter:blur(8px)';
document.body.appendChild(tooltip);

let hovered = null;
function clearHover() {
  if (hovered) { hovered.scale.setScalar(1); hovered = null; }
  tooltip.style.opacity = 0;
  canvas.classList.remove('pointing');
}

function pick(ev) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(world.clickables, false);
  return hits.length ? hits[0].object : null;
}

canvas.addEventListener('pointermove', (ev) => {
  if (ev.pointerType === 'touch') return;
  const hit = pick(ev);
  if (hit !== hovered) {
    if (hovered) hovered.scale.setScalar(1);
    hovered = hit && hit.userData.bookId ? hit : null;
    if (hovered) hovered.scale.setScalar(1.06);
  }
  if (hit) {
    const book = BOOKS.find((b) => b.id === hit.userData.bookId);
    tooltip.textContent = book ? `『${book.title}』 · 눌러서 읽기` : '에스프레소 머신 · 눌러서 커피 내리기';
    tooltip.style.left = `${ev.clientX + 14}px`;
    tooltip.style.top = `${ev.clientY + 14}px`;
    tooltip.style.opacity = 1;
    canvas.classList.add('pointing');
  } else {
    tooltip.style.opacity = 0;
    canvas.classList.remove('pointing');
  }
});

let downPos = null;
canvas.addEventListener('pointerdown', (ev) => { downPos = { x: ev.clientX, y: ev.clientY }; canvas.classList.add('dragging'); });
window.addEventListener('pointerup', (ev) => {
  canvas.classList.remove('dragging');
  if (!downPos) return;
  const moved = Math.hypot(ev.clientX - downPos.x, ev.clientY - downPos.y);
  downPos = null;
  if (moved > 7) return;
  if (ev.target !== canvas) return;
  if (coffee.open_) return;
  const hit = pick(ev);
  if (!hit) return;
  if (hit.userData.bookId) {
    const book = BOOKS.find((b) => b.id === hit.userData.bookId);
    if (book) openBook(book);
  } else if (hit.userData.action === 'coffee') {
    coffee.open();
  }
});

/* ───────── 루프 ───────── */
const clock = new THREE.Clock();
let started = false;

function animate() {
  const dt = Math.min(0.05, clock.getDelta());
  camCtl.update(dt);
  controls.update();
  world.update(dt);
  coffee.update(dt);
  renderer.render(scene, camera);
  if (!started) {
    started = true;
    const loader = $('loader');
    $('loaderBar').style.width = '100%';
    setTimeout(() => {
      loader.classList.add('done');
      setTimeout(() => { loader.style.display = 'none'; }, 1100);
    }, 300);
  }
  requestAnimationFrame(animate);
}

$('loaderBar').style.width = '60%';
requestAnimationFrame(() => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  animate();
  setTimeout(() => {
    camCtl.zone('entrance');
    $('coffeeHint').classList.add('hidden');
  }, 1200);
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

/* 첫 상호작용 후 힌트 흐리게 */
let hinted = false;
canvas.addEventListener('pointerdown', () => {
  if (hinted) return;
  hinted = true;
  $('hint').style.opacity = '0';
}, { once: false });

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

/* 디버그용 훅 (검증 스크립트에서 사용) */
window.__ohmy = { world, camera, controls, camCtl, coffee, state, scene, renderer, ZONES, THREE };
