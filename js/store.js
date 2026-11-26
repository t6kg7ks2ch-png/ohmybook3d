// ───────── 오마이북 3D · 저장소 ─────────
const KEY = 'ohmybook3d.v1';

const empty = () => ({ reviews: {}, letters: [], unlocked: 1 });

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty();
    const s = JSON.parse(raw);
    return {
      reviews: s.reviews && typeof s.reviews === 'object' ? s.reviews : {},
      letters: Array.isArray(s.letters) ? s.letters : [],
      unlocked: Math.min(3, Math.max(1, s.unlocked || 1)),
    };
  } catch (e) {
    return empty();
  }
}

export function saveState(s) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch (e) {
    /* 저장 공간이 없어도 화면은 계속 동작한다 */
  }
}
