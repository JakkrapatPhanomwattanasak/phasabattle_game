// ===== Canvas =====
const canvas = document.getElementById('game');
const c = canvas.getContext('2d');
const W = (canvas.width = 1280);
const H = (canvas.height = 768);

// ===== Config =====
const NEXT_WAVE_DELAY_MS = 3500;
const TOAST_CLOSE_MS     = 4500;
const SELL_REFUND_RATE   = 0.7;

let paused = false, animationId = 0;
let hearts = 10, coins = 100, wave = 1;
let selectedUnit = null;
let activeTile = null, mapReady = false;
let nextWaveAt = 0;
let gameOverPlayed = false;

const $coins = document.getElementById('coins');
const $hearts = document.getElementById('hearts');
const $wave  = document.getElementById('wave');
const $dock  = document.getElementById('dock');

const sfxOver = new Audio('audio/over.mp3');

// ===== Map image (โหลดทุกครั้งใน newGame เพื่อให้เปลี่ยนแน่ ๆ) =====
const mapImg = new Image();
mapImg.onload = () => (mapReady = true);

// ===== Entities =====
let buildings = [];
let enemies   = [];
let explosions = [];

// ===== Placement tiles =====
const placementTiles = [];
const placementTilesData2D = [];
for (let i = 0; i < placementTilesData.length; i += 20) {
  placementTilesData2D.push(placementTilesData.slice(i, i + 20));
}
placementTilesData2D.forEach((row, y) =>
  row.forEach((sym, x) => {
    if (sym === 14)
      placementTiles.push(new PlacementTile({ position: { x: x * 64, y: y * 64 } }));
  })
);

// ===== Shop =====
function loadDock() {
  renderDock({
    container: $dock,
    unitSet: AppState.unitSet,
    selectedId: selectedUnit?.id,
    onSelect: (it) => { selectedUnit = it; loadDock(); }
  });
}
loadDock();

// ===== Mouse helpers =====
const mouse = { x: 0, y: 0 };
function getMousePos(e) {
  const r = canvas.getBoundingClientRect();
  const scaleX = canvas.width / r.width;
  const scaleY = canvas.height / r.height;
  return { x: (e.clientX - r.left) * scaleX, y: (e.clientY - r.top) * scaleY };
}
window.addEventListener('mousemove', (e) => {
  const p = getMousePos(e);
  mouse.x = p.x; mouse.y = p.y;

  activeTile = null;
  for (let i = 0; i < placementTiles.length; i++) {
    const t = placementTiles[i];
    if (mouse.x >= t.position.x + 2 && mouse.x <= t.position.x + t.size - 2 &&
        mouse.y >= t.position.y + 2 && mouse.y <= t.position.y + t.size - 2) { activeTile = t; break; }
  }
});

canvas.addEventListener('click', () => {
  if (!activeTile) return;
  if (activeTile.isOccupied) return;
  if (!selectedUnit) return;
  if (coins < selectedUnit.cost) return;

  coins -= selectedUnit.cost;
  $coins.textContent = coins;

  buildings.push(new Building({ position: { x: activeTile.position.x, y: activeTile.position.y }, config: selectedUnit }));
  activeTile.isOccupied = true;
  buildings.sort((a, b) => a.center.y - b.center.y);
});

// คลิกขวาขาย
canvas.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  const p = getMousePos(e);
  const tile = placementTiles.find(t => p.x >= t.position.x && p.x <= t.position.x + 64 &&
                                        p.y >= t.position.y && p.y <= t.position.y + 64);
  if (!tile) return;
  const idx = buildings.findIndex(b => b.position.x === tile.position.x && b.position.y === tile.position.y);
  if (idx >= 0) {
    const b = buildings[idx];
    if (b._sold) return;
    b._sold = true;
    const refund = Math.floor((b.cost || 0) * SELL_REFUND_RATE);
    coins += refund; $coins.textContent = coins;
    buildings.splice(idx, 1);
    tile.isOccupied = false;
  }
});

// ===== Enemy stats =====
function enemyStatsBySet(w){
  const m = AppState.difficultyMul;
  return { hp: (95 + w*15)*m, speed:(0.60 + w*0.03)*m, bounty: 20 + Math.floor(w*2.5) };
}

// ===== Spawner: Chicken → Cat → Dog ตามลำดับความยาก =====
function enemySpriteForWave(w){
  if (w === 1)
    return { sprite: 'img/enemies/Cute Chicken 2 walk.png', tile: 32, scale: 2.2 };
  if (w === 2)
    return { sprite: 'img/enemies/catWalk.png', tile: 48, scale: 1.8 };
  if (w === 3)
    return { sprite: 'img/enemies/dogWalk.png', tile: 48, scale: 1.8 };
  // ถ้าเกิน wave 3 ให้สุ่มวน 3 แบบไปเรื่อย ๆ (ไม่งั้นจะว่าง)
  const types = [
    { sprite: 'img/enemies/Cute Chicken 2 walk.png', tile: 32, scale: 2.2 },
    { sprite: 'img/enemies/catWalk.png', tile: 48, scale: 1.8 },
    { sprite: 'img/enemies/dogWalk.png', tile: 48, scale: 1.8 },
  ];
  return types[(w - 1) % 3];
}


function spawnWave(w) {
  const n = 6 + Math.floor(w * 1.3);
  const spacing = 120;
  const st = enemyStatsBySet(w);
  const sp = enemySpriteForWave(w);

  const wpArr = (AppState.map === 'map2') ? window.waypoints2 : window.waypoints;

  for (let i = 0; i < n; i++) {
    enemies.push(new Enemy({
      position: { x: wpArr[0].x - (i + 1) * spacing, y: wpArr[0].y },
      hp: st.hp, speed: st.speed, bounty: st.bounty, radius: 26,
      sprite: sp.sprite,
      tileW: sp.tile, tileH: sp.tile, framesMax: 6, scale: sp.scale, row: 0
    }));
  }
}

// ===== Passive income =====
let passiveId = 0;
function startPassive() {
  clearInterval(passiveId);
  if (AppState.passiveIncomePer10s <= 0) return;
  passiveId = setInterval(() => { coins += AppState.passiveIncomePer10s; $coins.textContent = coins; }, 10000);
}

// ===== Toast =====
const toast = document.getElementById('toast');
let toastActive = false;
function showToastQuestion(pool) {
  if (toastActive || !pool || !pool.length) return;
  const q = pool[Math.floor(Math.random() * pool.length)];
  toastActive = true;
  toast.style.display = 'block';
  toast.innerHTML = `
    <div class="q">${q.prompt}</div>
    <div class="choices"></div>
    <div class="explain"></div>
  `;
  const choicesEl = toast.querySelector('.choices');
  q.choices.forEach((ch) => {
    const b = document.createElement('button');
    b.className = 'choice';
    b.textContent = ch.text;
    b.onclick = () => {
      toast.querySelectorAll('.choice').forEach((x) => (x.disabled = true));
      const correctChoice = q.choices.find(c => c.correct);
      let delta = q.reward.wrong;

      if (ch.correct) {
        b.classList.add('correct');
        delta = q.reward.correct;
        toast.querySelector('.explain').innerHTML = `<b>✅ ถูกต้อง!</b> ${ch.explain || ''}`;
      } else {
        b.classList.add('wrong');
        toast.querySelectorAll('.choice').forEach(btn => {
          if (btn.textContent === correctChoice.text) btn.classList.add('correct');
        });
        toast.querySelector('.explain').innerHTML = `❌ ผิดครับ<br>คำตอบที่ถูกคือ: <b>${correctChoice.text}</b><br>${correctChoice.explain || ''}`;
      }

      coins += delta; $coins.textContent = coins;
      setTimeout(() => { toast.style.display = 'none'; toastActive = false; }, TOAST_CLOSE_MS);
    };
    choicesEl.appendChild(b);
  });
}
let questionTimerId = 0;
function startQuestionTimer() {
  clearInterval(questionTimerId);
  const sec = AppState.questionIntervalSec;
  if (!sec) return;
  questionTimerId = setInterval(() => {
    const pool = AppState.mode === 'grammar' ? window.GRAMMAR_QUESTIONS : window.VOCAB_QUESTIONS;
    showToastQuestion(pool);
  }, sec * 1000);
}

// ===== Auto Wave =====
function scheduleNextWave(ms = NEXT_WAVE_DELAY_MS) { nextWaveAt = performance.now() + ms; }
function updateWaveHUD() {
  if (nextWaveAt <= 0) { $wave.textContent = wave; return; }
  const remain = Math.max(0, Math.ceil((nextWaveAt - performance.now()) / 1000));
  $wave.textContent = `${wave} ▶ ${remain}s`;
}

// ===== Loop =====
function loop() {
  animationId = requestAnimationFrame(loop);

  if (mapReady) c.drawImage(mapImg, 0, 0, W, H);
  else { c.fillStyle = '#233'; c.fillRect(0, 0, W, H); }

  placementTiles.forEach((t) => t.update(c, mouse));
  if (activeTile) {
    const canPlace = !activeTile.isOccupied && selectedUnit && coins >= selectedUnit.cost;
    c.save(); c.globalAlpha = 0.25; c.fillStyle = canPlace ? '#00ff88' : '#ff5577';
    c.fillRect(activeTile.position.x, activeTile.position.y, 64, 64);
    c.restore();
  }

  if (paused) { updateWaveHUD(); return; }

  enemies.forEach((e) => e.step());        // Enemy.js ใช้ window.waypoints ภายใน
  buildings.forEach((b) => b.update(c, enemies, explosions));

  const drawables = [];
  enemies.forEach((e) => drawables.push({ y: e.center.y, draw: () => e.draw(c) }));
  buildings.forEach((b) => drawables.push({ y: b.center.y, draw: () => b.sprite.draw(c) }));
  drawables.sort((a, b) => a.y - b.y).forEach((d) => d.draw());

  // ตัดศัตรูทิ้ง
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
     if (e.reachedGoal) {
      enemies.splice(i, 1);
      hearts = Math.max(0, hearts - 1);
      $hearts.textContent = hearts;
      if (hearts <= 0 && !gameOverPlayed) {
        gameOverPlayed = true;
        try { sfxOver.currentTime = 0; sfxOver.play().catch(()=>{}); } catch(_) {}
        cancelAnimationFrame(animationId);
        document.getElementById('gameOver').style.display = 'grid';
        clearInterval(passiveId); clearInterval(questionTimerId);
        const g1 = document.getElementById('bgGame');
        const g2 = document.getElementById('bgGame2');
        if (AppState.map === 'map2') { g2 && g2.pause(); } else { g1 && g1.pause(); }
        return;
      }
      continue;
    }
    if (e.health <= 0) {
      coins += e.bounty || 0; $coins.textContent = coins;
      enemies.splice(i, 1);
    }
  }

  // Auto-wave
  if (enemies.length === 0) {
    if (nextWaveAt === 0) {
      scheduleNextWave(NEXT_WAVE_DELAY_MS);
      const pool = AppState.mode === 'grammar' ? window.GRAMMAR_QUESTIONS : window.VOCAB_QUESTIONS;
      showToastQuestion(pool);
    }
  }
  if (nextWaveAt > 0 && performance.now() >= nextWaveAt) {
    nextWaveAt = 0;
    wave++; $wave.textContent = wave;
    if (wave > 10) {
      cancelAnimationFrame(animationId);
      document.getElementById('gameWin').style.display = 'grid';
      clearInterval(passiveId); clearInterval(questionTimerId);
      const g1 = document.getElementById('bgGame');
      const g2 = document.getElementById('bgGame2');
      if (AppState.map === 'map2') { g2 && g2.pause(); } else { g1 && g1.pause(); }
      return;
    }
    spawnWave(wave);
  }
  updateWaveHUD();
}

// ===== Controls =====
document.getElementById('btnExitToMenu')?.addEventListener('click', () => {
  cancelAnimationFrame(animationId);
  const g1 = document.getElementById('bgGame');
  const g2 = document.getElementById('bgGame2');
  if (AppState.map === 'map2') { g2 && g2.pause(); } else { g1 && g1.pause(); }
  AppState.setScreen('menu');
});

// ===== Tutorial (คงเดิมแบบสั้น) =====
function runTutorial() {
  paused = true;
  const pool = AppState.mode === 'grammar' ? window.GRAMMAR_QUESTIONS : window.VOCAB_QUESTIONS;
  showToastQuestion(pool);
  setTimeout(() => { capyGuide.pointTo('#toast', 'แบบฝึกหัดอยู่ข้างบน ลองอ่านคำถามและตอบให้ดีจะได้เงินเพิ่ม2เท่า!'); }, 300);
  setTimeout(() => { capyGuide.pointTo('#dock', 'จากนั้นเลือก Capy ที่อยากวางได้ที่ร้านตรงนี้ กดคลิกขวาที่ Capy ที่วางแล้วเพื่อขายได้'); }, 3000);
  setTimeout(() => { capyGuide.hide(); paused = false; }, 6500);
}

// ===== New game =====
function newGame({ tutorial = false } = {}) {
  paused = false;
  hearts = 10; coins = 100; wave = 1; nextWaveAt = 0; gameOverPlayed = false;
  $hearts.textContent = hearts; $coins.textContent = coins; $wave.textContent = wave;
  enemies = []; buildings = []; explosions = [];
  document.getElementById('gameOver').style.display = 'none';
  document.getElementById('gameWin').style.display  = 'none';

  mapReady = false;
  mapImg.src = (AppState.map === 'map2') ? 'img/gameMap2.png' : 'img/gameMap.png';

  // สลับทางเดิน global ให้ Enemy.js ใช้
  window._wp1 = window._wp1 || window.waypoints;
  window.waypoints = (AppState.map === 'map2') ? window.waypoints2 : window._wp1;

  loadDock();
  startPassive();
  startQuestionTimer();

  spawnWave(wave);
  loop();

  if (tutorial) runTutorial();
}
window.__GAME_START__ = newGame;

let SHOW_WP = false;
window.addEventListener('keydown', (e)=>{ if (e.key.toLowerCase()==='g') SHOW_WP = !SHOW_WP; });

function drawWaypointDebug(ctx){
  if (!SHOW_WP) return;
  const wp = window.waypoints;
  ctx.save();
  ctx.lineWidth = 3; ctx.strokeStyle = '#00e1b4'; ctx.fillStyle = '#00e1b4';
  for (let i=0;i<wp.length;i++){
    const p = wp[i];
    ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI*2); ctx.fill();
    if (i>0){ ctx.beginPath(); ctx.moveTo(wp[i-1].x, wp[i-1].y); ctx.lineTo(p.x, p.y); ctx.stroke(); }
  }
  ctx.restore();
}
// เรียกใช้ใน loop() หลังวาดแผนที่:
if (mapReady) drawWaypointDebug(c);
