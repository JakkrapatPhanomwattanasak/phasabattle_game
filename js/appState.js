// ตั้งค่า + คุมหน้าจอ + เพลงตามแมพ
window.AppState = {
  mode: 'grammar',
  questionIntervalSec: 30,
  difficultyMul: 1.0,
  passiveIncomePer10s: 6,

  enemySet: 'animals', // ใช้ลำดับ Chicken -> Cat -> Dog
  unitSet: 'capy',

  map: 'map1',
  setMap(name){ this.map = name; },

  setScreen(name) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(`screen-${name}`).classList.add('active');

    const m  = document.getElementById('bgMenu');
    const g1 = document.getElementById('bgGame');   // map1
    const g2 = document.getElementById('bgGame2');  // map2
    const tryPlay = (el)=> el && el.play().catch(()=>{});

    if (name === 'menu' || name === 'settings' || name === 'mapselect') {
      g1 && g1.pause();
      g2 && g2.pause();
      m && tryPlay(m);
    }
    if (name === 'game') {
      m && m.pause();
      if (this.map === 'map2') { g1 && g1.pause(); g2 && tryPlay(g2); }
      else { g2 && g2.pause(); g1 && tryPlay(g1); }
    }
  }
};

window.addEventListener('DOMContentLoaded', () => {
  const tryPlay = (el)=> el && el.play().catch(()=>{});

  // ปลดบล็อกเสียง
  const unlock = () => {
    const m  = document.getElementById('bgMenu');
    tryPlay(m);
    window.removeEventListener('pointerdown', unlock);
    window.removeEventListener('keydown', unlock);
  };
  window.addEventListener('pointerdown', unlock);
  window.addEventListener('keydown', unlock);

  // ปุ่มเมนู
  document.getElementById('btnMenuPlay').onclick = () => AppState.setScreen('mapselect');
  document.getElementById('btnBackFromMapSelect').onclick = () => AppState.setScreen('menu');
  document.getElementById('btnPickMap1').onclick = () => { AppState.setMap('map1'); AppState.setScreen('game'); window.__GAME_START__?.(); };
  document.getElementById('btnPickMap2').onclick = () => { AppState.setMap('map2'); AppState.setScreen('game'); window.__GAME_START__?.(); };

  document.getElementById('btnMenuTutorial').onclick = () => { AppState.setScreen('game'); window.__GAME_START__?.({tutorial:true}); };
  document.getElementById('btnMenuSettings').onclick = () => AppState.setScreen('settings');
  document.getElementById('btnBackFromSettings').onclick = () => AppState.setScreen('menu');

  // Settings
  const selRate = document.getElementById('selQuestionRate');
  const selDiff = document.getElementById('selDifficulty');
  const inpPassive = document.getElementById('inpPassiveIncome');
  const selEnemy = document.getElementById('selEnemySet');
  const selUnit = document.getElementById('selUnitSet');

  const apply = () => {
    AppState.questionIntervalSec = parseInt(selRate.value,10);
    AppState.difficultyMul = parseFloat(selDiff.value);
    AppState.passiveIncomePer10s = parseInt(inpPassive.value,10)||0;
    AppState.enemySet = selEnemy.value;
    AppState.unitSet = selUnit.value;
  };
  [selRate, selDiff, inpPassive, selEnemy, selUnit].forEach(el => el.onchange = apply);
  apply();
});
