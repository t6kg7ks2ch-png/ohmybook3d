// ───────── 오마이북 3D · 커피 내리기 ─────────
// 메뉴 순서: 아메리카노 → 라테 → 바닐라라테 (핸드드립 없음)
import * as THREE from 'three';
import { COFFEE_MENU } from './data.js';

const STEP_INFO = {
  grind: { label: '그라인딩', no: '01', guide: '포터필터를 그라인더에 대고 길게 눌러 원두를 채우세요.', btn: '길게 눌러 갈기', hold: true },
  tamp: { label: '탬핑', no: '02', guide: '탬퍼로 원두를 꾹 눌러 고르게 다지세요. 70% 이상 눌러야 합니다.', btn: '꾹 눌러 다지기', hold: true },
  extract: { label: '샷 추출', no: '03', guide: '그룹헤드에 장착하고 추출하세요. 추출량이 초록 구간에 들면 멈추세요.', btn: '추출 시작 · 멈추기', hold: true },
  water: { label: '물 붓기', no: '04', guide: '뜨거운 물을 부으면 아메리카노 완성. 얼음을 넣어 아이스로 즐겨도 좋아요.', btn: '길게 눌러 물 붓기', hold: true },
  syrup: { label: '바닐라 시럽', no: '04', guide: '컵 아래에 바닐라 시럽을 두 번 펌핑하세요.', btn: '시럽 펌핑', hold: false },
  milk: { label: '우유 채우기', no: '05', guide: '스팀 피처에 차가운 우유를 채우세요. 80% 정도가 좋습니다.', btn: '길게 눌러 우유 채우기', hold: true },
  steam: { label: '스티밍', no: '06', guide: '1단계 에어레이션으로 미세 거품을 만든 뒤, 2단계 월풀로 온도를 올리세요.', btn: '길게 눌러 스팀', hold: true },
  pour: { label: '붓기', no: '07', guide: '에스프레소에 스팀 밀크를 부어 라테아트를 완성하세요.', btn: '길게 눌러 붓기', hold: true },
};

function latteArtDraw(canvas, kind, progress) {
  const S = canvas.width;
  const g = canvas.getContext('2d');
  g.clearRect(0, 0, S, S);
  if (progress <= 0.01) return;
  g.save();
  g.translate(S / 2, S / 2);
  const k = 0.55 + 0.45 * Math.min(1, progress);
  g.scale(k, k);
  g.globalAlpha = Math.min(1, progress * 1.25);
  g.fillStyle = 'rgba(253,248,238,0.96)';
  if (kind === 'heart') {
    g.beginPath();
    const s = S * 0.3;
    g.moveTo(0, s * 0.85);
    g.bezierCurveTo(-s * 1.5, -s * 0.1, -s * 0.55, -s * 1.05, 0, -s * 0.42);
    g.bezierCurveTo(s * 0.55, -s * 1.05, s * 1.5, -s * 0.1, 0, s * 0.85);
    g.fill();
    g.strokeStyle = 'rgba(160,108,64,0.35)';
    g.lineWidth = S * 0.012;
    g.stroke();
  } else {
    // 튤립: 겹친 잎 세 장
    for (let i = 0; i < 3; i++) {
      const r = S * (0.26 - i * 0.06);
      g.beginPath();
      g.ellipse(0, S * (0.14 - i * 0.11), r, r * 0.62, 0, 0, Math.PI * 2);
      g.fill();
    }
    g.beginPath();
    g.moveTo(0, S * 0.3);
    g.lineTo(-S * 0.03, S * 0.02);
    g.lineTo(S * 0.03, S * 0.02);
    g.closePath(); g.fill();
    g.strokeStyle = 'rgba(160,108,64,0.3)';
    g.lineWidth = S * 0.012;
    g.stroke();
  }
  g.restore();
}

export class CoffeeGame {
  constructor({ rig, cam, toast, onUnlockChange, unlocked = 1 }) {
    this.rig = rig;
    this.cam = cam;
    this.toast = toast;
    this.onUnlockChange = onUnlockChange;
    this.unlocked = unlocked;
    this.open_ = false;
    this.drink = COFFEE_MENU[0];
    this.i = 0;
    this.phase = null;
    this.holding = false;
    this.val = 0;
    this.temp = 8;
    this.foam = 0;
    this.sub = 'aer';
    this.pumps = 0;
    this.quality = {};
    this.ice = false;
    this.t = 0;
    this.scores = [];

    // DOM
    this.el = {
      hud: document.getElementById('coffeeHud'),
      name: document.getElementById('cfName'),
      stepLabel: document.getElementById('cfStepLabel'),
      steps: document.getElementById('cfSteps'),
      guide: document.getElementById('cfGuide'),
      gauges: document.getElementById('cfGauges'),
      action: document.getElementById('cfAction'),
      alt: document.getElementById('cfAlt'),
      reset: document.getElementById('cfReset'),
      result: document.getElementById('cfResult'),
      resultTitle: document.getElementById('cfResultTitle'),
      resultText: document.getElementById('cfResultText'),
      exit: document.getElementById('cfExit'),
      hint: document.getElementById('coffeeHint'),
    };
    this.buildMenu();
    this.bind();
    this.resetPoses();
  }

  /* ── 메뉴 스트립 ── */
  buildMenu() {
    const wrap = document.createElement('div');
    wrap.className = 'cf-menu';
    this.menuEl = wrap;
    COFFEE_MENU.forEach((d, idx) => {
      const b = document.createElement('button');
      b.dataset.idx = idx;
      b.textContent = d.name;
      b.addEventListener('click', () => {
        if (idx + 1 > this.unlocked) { this.toast(`아직 잠겨 있어요. ${COFFEE_MENU[idx - 1].name}을(를) 먼저 내려 주세요.`); return; }
        this.startDrink(d.id);
      });
      wrap.appendChild(b);
    });
    this.el.steps.parentNode.insertBefore(wrap, this.el.steps);
    this.syncMenu();
  }

  syncMenu() {
    [...this.menuEl.children].forEach((b, i) => {
      b.classList.toggle('on', this.drink && this.drink.id === COFFEE_MENU[i].id);
      b.classList.toggle('locked', i + 1 > this.unlocked);
      b.innerHTML = `${COFFEE_MENU[i].name}<em>${i + 1 > this.unlocked ? '잠김' : ''}</em>`;
    });
  }

  /* ── 입력 ── */
  bind() {
    const a = this.el.action;
    const down = (e) => {
      e.preventDefault();
      if (!this.open_ || !this.phase) return;
      this.holding = true;
      a.classList.add('active');
      this.onDown();
    };
    const up = () => {
      if (!this.holding) return;
      this.holding = false;
      a.classList.remove('active');
      this.onUp();
    };
    a.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    this.el.alt.addEventListener('click', () => {
      if (this.phase === 'water') {
        this.ice = !this.ice;
        this.spawnIce();
        this.el.alt.textContent = this.ice ? '얼음 넣음 ✓' : '얼음 추가';
      }
    });
    this.el.reset.addEventListener('click', () => this.startDrink(this.drink.id));
    this.el.exit.addEventListener('click', () => this.close());
    window.addEventListener('keydown', (e) => {
      if (!this.open_ || e.code !== 'Space' || e.repeat) return;
      e.preventDefault();
      this.holding = true; this.el.action.classList.add('active'); this.onDown();
    });
    window.addEventListener('keyup', (e) => {
      if (e.code !== 'Space' || !this.open_) return;
      e.preventDefault();
      this.holding = false; this.el.action.classList.remove('active'); this.onUp();
    });
  }

  onDown() {
    if (this.phase === 'syrup') { this.pump(); return; }
    if (this.phase === 'grind' && this.val >= 1) return;
  }

  onUp() {
    const p = this.phase;
    if (p === 'grind') {
      if (this.val < 0.55) { this.el.guide.textContent = '원두가 너무 적어요. 조금 더 갈아 주세요.'; return; }
      this.quality.dose = this.val;
      this.next();
    } else if (p === 'tamp') {
      if (this.val < 0.7) { this.el.guide.textContent = '조금 더 꾹 눌러 주세요. 고르게 다져야 물길이 고르게 흐릅니다.'; return; }
      this.quality.tamp = this.val;
      this.setPuck();
      this.next();
    } else if (p === 'extract') {
      this.quality.shot = this.val;
      this.stopExtraction();
      this.next();
    } else if (p === 'water') {
      if (this.val < 0.6) { this.el.guide.textContent = '물이 조금 부족해요. 조금 더 부어 주세요.'; return; }
      this.quality.water = this.val;
      this.next();
    } else if (p === 'milk') {
      if (this.val < 0.55) { this.el.guide.textContent = '우유가 부족해요. 피처에 조금 더 채워 주세요.'; return; }
      this.quality.milk = this.val;
      this.next();
    } else if (p === 'steam') {
      if (this.sub === 'aer') {
        this.quality.foam = this.foam;
        this.sub = 'swirl';
        this.val = 0;
        this.setupSteamPhase();
      } else {
        this.quality.temp = this.temp;
        this.endSteam();
        this.next();
      }
    } else if (p === 'pour') {
      if (this.val < 0.45) { this.el.guide.textContent = '조금 더 부어 주세요. 컵이 거의 비어 있어요.'; return; }
      this.quality.pour = this.val;
      this.next();
    }
  }

  /* ── 열기 / 닫기 ── */
  open(drinkId) {
    this.open_ = true;
    this.el.hud.classList.remove('hidden');
    this.el.hint.classList.add('hidden');
    this.cam.move(COFFEE_VIEW.pos, COFFEE_VIEW.target, 42, 1100);
    this.startDrink(drinkId || COFFEE_MENU[Math.min(this.unlocked, 3) - 1].id);
  }

  close() {
    this.open_ = false;
    this.el.hud.classList.add('hidden');
    this.el.hint.classList.remove('hidden');
    this.stopFlows();
    this.cam.zone('counter');
  }

  startDrink(id) {
    this.drink = COFFEE_MENU.find((d) => d.id === id) || COFFEE_MENU[0];
    this.quality = {};
    this.i = 0;
    this.scores = [];
    this.ice = false;
    this.pumps = 0;
    this.temp = 8;
    this.foam = 0;
    this.sub = 'aer';
    this.el.name.textContent = this.drink.name;
    this.el.result.classList.add('hidden');
    this.el.reset.classList.add('hidden');
    this.el.alt.classList.add('hidden');
    this.el.alt.textContent = '얼음 추가';
    this.resetCup();
    this.resetPoses();
    this.syncMenu();
    this.enter(this.drink.steps[0]);
  }

  enter(phase) {
    this.phase = phase;
    this.val = 0;
    this.holding = false;
    const info = STEP_INFO[phase];
    this.el.stepLabel.textContent = `${info.no} · ${info.label}`;
    this.el.action.textContent = info.btn;
    this.el.action.classList.remove('hidden');
    this.el.alt.classList.add('hidden');
    if (phase === 'water') { this.el.alt.classList.remove('hidden'); }
    if (phase === 'steam') this.setupSteamPhase();
    this.el.result.classList.add('hidden');
    this.el.guide.textContent = info.guide;
    // 단계 표시
    this.el.steps.innerHTML = this.drink.steps.map((s, k) => {
      const cls = k < this.i ? 'done' : k === this.i ? 'now' : '';
      return `<li class="${cls}"><i style="width:${k < this.i ? 100 : 0}%"></i></li>`;
    }).join('');
    this.buildGauges();
    this.enterPose(phase);
  }

  next() {
    this.i += 1;
    if (this.i >= this.drink.steps.length) { this.finish(); return; }
    this.enter(this.drink.steps[this.i]);
  }

  setupSteamPhase() {
    this.el.stepLabel.textContent = `06 · 스티밍 (${this.sub === 'aer' ? '1단계 에어레이션' : '2단계 월풀'})`;
    this.el.action.textContent = this.sub === 'aer' ? '길게 눌러 에어레이션' : '길게 눌러 월풀';
  }

  /* ── 게이지 ── */
  buildGauges() {
    const p = this.phase;
    let rows = [];
    if (p === 'grind') rows = [{ id: 'dose', label: '원두 양', band: [0.8, 1.0], fmt: (v) => `${Math.round(v * 18)}g` }];
    else if (p === 'tamp') rows = [{ id: 'tamp', label: '압력', band: [0.7, 1.0], fmt: (v) => `${Math.round(v * 22)}kg` }];
    else if (p === 'extract') rows = [{ id: 'shot', label: '추출량', band: [0.55, 0.78], fmt: (v) => `${Math.round(v * 40)}ml` }];
    else if (p === 'water') rows = [{ id: 'water', label: '컵 채움', band: [0.72, 0.95], fmt: (v) => `${Math.round(v * 100)}%` }];
    else if (p === 'syrup') rows = [{ id: 'pump', label: '시럽 펌핑', band: [1, 2], fmt: (v) => `${this.pumps} / 2` }];
    else if (p === 'milk') rows = [{ id: 'milk', label: '우유 양', band: [0.72, 0.95], fmt: (v) => `${Math.round(v * 100)}%` }];
    else if (p === 'steam' && this.sub === 'aer') rows = [{ id: 'foam', label: '미세 거품', band: [0.55, 0.85], fmt: (v) => `${Math.round(v * 100)}%` }];
    else if (p === 'steam') rows = [{ id: 'temp', label: '우유 온도', band: [60, 68], max: 85, fmt: (v) => `${Math.round(v)}℃` }];
    else if (p === 'pour') rows = [{ id: 'pour', label: '컵 채움', band: [0.7, 0.95], fmt: (v) => `${Math.round(v * 100)}%` }];
    this.el.gauges.innerHTML = rows.map((r) => {
      const max = r.max || 1;
      const a = (r.band[0] / max) * 100, b = (r.band[1] / max) * 100;
      const bandCls = r.id === 'temp' ? 'g-band yellow' : 'g-band';
      return `<div class="gauge" data-id="${r.id}" data-max="${max}">
        <div class="g-head"><span>${r.label}</span><span class="g-val">0</span></div>
        <div class="g-track"><div class="${bandCls}" style="left:${a}%;width:${Math.max(2, b - a)}%"></div><div class="g-fill"></div></div>
      </div>`;
    }).join('');
    this.gaugeRows = rows;
  }

  setGauges() {
    if (!this.gaugeRows) return;
    for (const r of this.gaugeRows) {
      const el = this.el.gauges.querySelector(`[data-id="${r.id}"]`);
      if (!el) continue;
      let v = 0;
      if (r.id === 'dose') v = this.val;
      else if (r.id === 'tamp') v = this.val;
      else if (r.id === 'shot') v = this.val;
      else if (r.id === 'water') v = this.val;
      else if (r.id === 'pump') v = this.pumps;
      else if (r.id === 'milk') v = this.val;
      else if (r.id === 'foam') v = this.foam;
      else if (r.id === 'temp') v = this.temp;
      else if (r.id === 'pour') v = this.val;
      const max = r.max || 1;
      el.querySelector('.g-fill').style.width = `${Math.max(0, Math.min(1, v / max)) * 100}%`;
      el.querySelector('.g-val').textContent = r.fmt(v);
    }
  }

  /* ── 3D 포즈 ── */
  resetPoses() {
    const r = this.rig;
    r.pf.position.set(-0.56, 0.035, 0.16);
    r.pf.rotation.set(0, 0, 0);
    r.grounds.visible = false; r.grounds.scale.y = 0.02;
    r.tamper.position.set(-0.30, 0.02, 0.20);
    r.pitcher.position.set(0.34, 0.024, 0.34);
    r.pitcher.rotation.set(0, 0, 0);
    r.milk.scale.y = 0.001;
    r.steam.material.opacity = 0;
    r.dust.material.opacity = 0;
    r.wandPivot.rotation.set(0, 0, 0);
    this.pfAnim = null;
  }

  enterPose(phase) {
    const V = (x, y, z) => new THREE.Vector3(x, y, z);
    if (phase === 'grind') this.pfAnim = { to: V(-0.56, 0.1, 0.12) };
    else if (phase === 'tamp') this.pfAnim = { to: V(-0.16, 0.03, 0.24) };
    else if (phase === 'pour') this.pfAnim = { to: V(0.5, 0.02, 0.36) };
    else this.pfAnim = { to: V(0.05, 0.215, 0.18) };
  }

  setPuck() {
    this.rig.grounds.visible = true;
    this.rig.grounds.scale.y = 0.6 + this.quality.tamp * 0.5;
  }

  resetCup() {
    const r = this.rig;
    r.liquid.scale.y = 0.001; r.liquid.position.y = 0.006;
    r.crema.visible = false;
    r.foam.visible = false;
    r.art.visible = false;
    r.iceGroup.clear();
    r.cupGlass.visible = true;
    r.liquid.material.color.setHex(0x3a2012);
    r.crema.position.y = 0.008;
    r.foam.position.y = 0.008;
  }

  spawnIce() {
    const g = this.rig.iceGroup;
    g.position.set(0, 0, 0);
    for (let i = 0; i < 4; i++) {
      const cube = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.028, 0.028), new THREE.MeshPhysicalMaterial({ color: 0xeaf4f6, roughness: 0.1, transparent: true, opacity: 0.6 }));
      cube.position.set(rand(-0.016, 0.016), 0.02 + i * 0.006, rand(-0.016, 0.016));
      cube.rotation.set(rand(0, 3), rand(0, 3), rand(0, 3));
      g.add(cube);
    }
  }

  stopFlows() {
    const r = this.rig;
    r.espressoStream.visible = false;
    r.waterStream.visible = false;
    r.milkStream.visible = false;
    r.steam.material.opacity = 0;
    r.dust.material.opacity = 0;
  }

  stopExtraction() {
    this.rig.espressoStream.visible = false;
    this.flowing = false;
  }

  endSteam() {
    this.rig.steam.material.opacity = 0;
    this.rig.wandPivot.rotation.z = 0;
  }

  pump() {
    if (this.pumps >= 2) return;
    this.pumps += 1;
    const r = this.rig;
    r.liquid.material.color.setHex(0x6a3c14);
    r.liquid.scale.y = 0.012 + this.pumps * 0.008;
    r.liquid.position.y = 0.006 + r.liquid.scale.y / 2;
    this.toast(`바닐라 시럽 ${this.pumps}번째 펌핑`);
    this.setGauges();
    if (this.pumps >= 2) {
      this.quality.syrup = 1;
      this.toast('시럽 완료 · 우유를 채워 주세요');
      setTimeout(() => { if (this.phase === 'syrup') this.next(); }, 450);
    }
  }

  /* ── 결과 ── */
  finish() {
    const r = this.rig;
    const q = this.quality;
    let title = '잘 나왔어요';
    let text = '';
    if (this.drink.id === 'americano') {
      const shotOk = q.shot >= 0.55 && q.shot <= 0.78;
      title = shotOk ? '균형 잡힌 아메리카노' : q.shot > 0.78 ? '진하게 내린 아메리카노' : '가볍게 내린 아메리카노';
      text = shotOk
        ? '크레마가 고르게 올라온 샷에 물을 맞췄어요. 청도 아침에 어울리는 한 잔.'
        : '타이밍이 조금 달랐지만, 내가 내린 커피는 늘 맞는 맛이죠.';
      if (this.ice) text += ' 얼음을 넣어 시원하게.';
    } else {
      const tempOk = q.temp >= 60 && q.temp <= 68;
      const foamOk = q.foam >= 0.5 && q.foam <= 0.9;
      title = tempOk && foamOk ? '결이 고운 라테' : tempOk ? '따뜻한 라테' : q.temp > 72 ? '조금 뜨거운 라테' : '미지근한 라테';
      text = tempOk && foamOk
        ? `${this.drink.id === 'vanilla-latte' ? '바닐라 향 위에 ' : ''}우유 거품이 결을 만들었어요. 하트가 예쁘게 앉았습니다.`
        : '거품과 온도가 조금 아쉽지만, 다음 잔은 더 좋아질 거예요.';
    }
    this.el.resultTitle.textContent = title;
    this.el.resultText.textContent = text;
    this.el.result.classList.remove('hidden');
    this.el.guide.textContent = '완성! 컵을 들어 자리로 가져가세요.';
    this.el.action.classList.add('hidden');
    this.stopFlows();
    // 다음 메뉴 해금
    const idx = COFFEE_MENU.findIndex((d) => d.id === this.drink.id);
    if (idx + 1 === this.unlocked && this.unlocked < 3) {
      this.unlocked += 1;
      this.onUnlockChange && this.onUnlockChange(this.unlocked);
    }
    this.el.reset.classList.remove('hidden');
    this.el.reset.textContent = this.unlocked > idx + 1 && idx + 1 < 3 ? `다음 · ${COFFEE_MENU[idx + 1].name} 내리기` : '다시 내리기';
    this.el.reset.onclick = () => {
      if (this.unlocked > idx + 1 && idx + 1 < 3) this.startDrink(COFFEE_MENU[idx + 1].id);
      else this.startDrink(this.drink.id);
    };
    this.syncMenu();
    // 컵에 스팀
    r.steam.material.opacity = 0.0;
  }

  /* ── 프레임 업데이트 ── */
  update(dt) {
    const r = this.rig;
    this.t += dt;

    // 포터필터 이동
    if (this.pfAnim) {
      r.pf.position.lerp(this.pfAnim.to, Math.min(1, dt * 6));
    }

    if (!this.open_) { this.animateSteam(dt, false); return; }

    const holding = this.holding;
    const p = this.phase;

    if (p === 'grind') {
      const wasFilling = this.val < 1;
      if (holding && this.val < 1) this.val = Math.min(1, this.val + dt * 0.5);
      r.dust.material.opacity = holding ? 0.9 : 0;
      if (holding) this.animateDust(dt);
      if (this.val > 0.02) {
        r.grounds.visible = true;
        r.grounds.scale.y = 0.02 + this.val * 0.035;
      }
      if (this.val >= 1 && wasFilling) this.el.guide.textContent = '가득 찼습니다. 손을 떼고 다음 단계로!';
    } else if (p === 'tamp') {
      if (holding) this.val = Math.min(1, this.val + dt * 0.85);
      const press = this.val;
      r.tamper.position.y = 0.02 + (1 - press) * 0.12;
      r.tamper.position.x = -0.16;
      r.tamper.position.z = 0.24;
      if (press > 0.02) { r.grounds.visible = true; r.grounds.scale.y = 0.6 + press * 0.25; }
    } else if (p === 'extract') {
      if (holding) {
        this.flowing = true;
        this.val = Math.min(1, this.val + dt * 0.185);
        r.espressoStream.visible = true;
        r.espressoStream.material.opacity = 0.55 + Math.sin(this.t * 30) * 0.1;
        const h = Math.max(0.012, this.val * 0.075);
        r.liquid.scale.y = h;
        r.liquid.position.y = 0.006 + h / 2;
        r.liquid.material.color.setHex(0x2c1608);
        r.crema.visible = true;
        r.crema.position.y = 0.008 + h;
        r.crema.scale.setScalar(0.9 + this.val * 0.1);
      } else if (this.flowing) {
        this.flowing = false;
        r.espressoStream.visible = false;
      }
    } else if (p === 'water') {
      if (holding) {
        this.val = Math.min(1, this.val + dt * 0.3);
        r.waterStream.visible = true;
        r.waterStream.material.opacity = 0.6;
        const h = Math.min(0.092, 0.012 + this.val * 0.085);
        r.liquid.scale.y = h;
        r.liquid.position.y = 0.006 + h / 2;
        r.liquid.material.color.setHex(this.ice ? 0x5a3a22 : 0x4a2c19);
        r.crema.visible = false;
        r.steam.material.opacity = Math.min(0.5, r.steam.material.opacity + dt);
      } else {
        r.waterStream.visible = false;
      }
    } else if (p === 'syrup') {
      r.steam.material.opacity = 0;
    } else if (p === 'milk') {
      if (holding) {
        this.val = Math.min(1, this.val + dt * 0.42);
        r.milk.scale.y = 0.01 + this.val * 0.1;
        r.milk.position.y = 0.006 + r.milk.scale.y / 2;
        r.milkStream.visible = true;
        r.milkStream.material.opacity = 0.5;
        r.milkStream.position.set(0.34, 0.16, 0.34);
      } else {
        r.milkStream.visible = false;
      }
    } else if (p === 'steam') {
      // 피처를 완드 아래로
      r.pitcher.position.lerp(new THREE.Vector3(0.36, 0.024, 0.17), Math.min(1, dt * 4));
      r.wandPivot.rotation.z = -0.25;
      if (holding) {
        if (this.sub === 'aer') {
          this.foam = Math.min(1, this.foam + dt * 0.4);
          this.temp = Math.min(85, this.temp + dt * 3.6);
        } else {
          this.temp = Math.min(85, this.temp + dt * 10.5);
        }
        r.steam.material.opacity = 0.55 + Math.sin(this.t * 8) * 0.12;
        r.steam.position.set(0.36, 0.1 + Math.sin(this.t * 3) * 0.01, 0.17);
      } else {
        r.steam.material.opacity = Math.max(0, r.steam.material.opacity - dt * 2);
      }
      this.animateSteam(dt, holding);
      // 우유 소용돌이 (스월)
      if (this.sub === 'swirl' && holding) {
        r.milk.scale.y = 0.01 + (0.72 + this.foam * 0.22) * 0.1;
      }
    } else if (p === 'pour') {
      r.pitcher.position.lerp(new THREE.Vector3(0.05, 0.18, 0.24), Math.min(1, dt * 4));
      r.pitcher.rotation.x = -0.7;
      if (holding) {
        this.val = Math.min(1, this.val + dt * 0.42);
        r.milkStream.visible = true;
        r.milkStream.material.opacity = 0.7;
        r.milkStream.position.set(0.05, 0.16, 0.24);
        const h = Math.min(0.09, 0.014 + this.val * 0.075);
        r.liquid.scale.y = h;
        r.liquid.position.y = 0.006 + h / 2;
        r.liquid.material.color.setHex(0x6b4426);
        r.art.visible = this.val > 0.08;
        latteArtDraw(r.artCanvas, this.drink.id === 'vanilla-latte' ? 'tulip' : 'heart', this.val);
        r.artTex.needsUpdate = true;
        r.art.position.y = 0.008 + h;
        r.steam.material.opacity = Math.min(0.35, r.steam.material.opacity + dt * 0.6);
      } else {
        r.milkStream.visible = false;
      }
    }

    this.setGauges();
    if (this.phase === 'steam') this.el.guide.textContent = this.sub === 'aer'
      ? '에어레이션: 거품이 55~85% 될 때 손을 떼면 2단계 월풀로 넘어갑니다.'
      : '월풀: 노란 구간(60~68℃)에서 멈추세요. 넘으면 우유가 탑니다.';
  }

  animateDust(dt) {
    const geo = this.rig.dust.geometry;
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      pos.array[i * 3 + 1] -= dt * 0.22;
      if (pos.array[i * 3 + 1] < 0) {
        pos.array[i * 3] = rand(-0.02, 0.02);
        pos.array[i * 3 + 1] = 0.03;
        pos.array[i * 3 + 2] = rand(-0.02, 0.02);
      }
    }
    pos.needsUpdate = true;
  }

  animateSteam(dt, on) {
    const geo = this.rig.steam.geometry;
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const ph = (this.t * 0.55 + i * 0.13) % 1;
      const r = 0.01 + ph * 0.05;
      const a = i * 2.4 + this.t * 1.3;
      pos.array[i * 3] = Math.cos(a) * r;
      pos.array[i * 3 + 1] = ph * 0.22;
      pos.array[i * 3 + 2] = Math.sin(a) * r;
    }
    pos.needsUpdate = true;
  }
}

const COFFEE_VIEW = {
  pos: [1.52, 1.98, 3.52],
  target: [1.02, 1.3, 2.02],
};

function rand(a, b) { return a + Math.random() * (b - a); }
