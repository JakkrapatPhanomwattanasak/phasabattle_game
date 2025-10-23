// ร้านยูนิต — ใช้รูป idle 32×32 และให้แสดงเฟรมเดียวเสมอ
// เพิ่ม 3 ตัว: Basic / Brasil / Rich (ค่าสเตตัสต่างกันเล็กน้อย)
// แต่ละตัวกำหนดสี/ขนาดกระสุนให้ต่างกันด้วย
const UNIT_SETS = {
  capy: [
    {
      id: 'capy_basic',
      name: 'Capy Basic',
      sprite: 'img/capy/Capi_Idle_inshop.png',
      cost: 60,
      range: 160,
      damage: 16,
      fireRate: 28,
      projSpeed: 8,
      projColor: '#00ff88', // เขียว
      projRadius: 6,
      scale: 2,
      framesHold: 6,
      framesMax: 1,
      tileW: 32, tileH: 32
    },
    {
      id: 'capy_brasil',
      name: 'Capy Brasil',
      sprite: 'img/capy/CapiBrasil.png',
      cost: 120,
      range: 180,
      damage: 24,
      fireRate: 24,
      projSpeed: 9,
      projColor: '#22a6ff', // น้ำเงิน
      projRadius: 7,
      scale: 2,
      framesHold: 6,
      framesMax: 1,
      tileW: 32, tileH: 32
    },
    {
      id: 'capy_rich',
      name: 'Capy Rich',
      sprite: 'img/capy/capiRich.png',
      cost: 180,
      range: 220,
      damage: 36,
      fireRate: 36,      // ช้ากว่าแต่แรงไกล
      projSpeed: 10,
      projColor: '#ff5fd0', // ชมพูม่วง
      projRadius: 8,
      scale: 2,
      framesHold: 6,
      framesMax: 1,
      tileW: 32, tileH: 32
    }
  ],
  // หมวดอื่นยังคงเดิม (ถ้าต้องการ)
  archer: [],
  mage: []
};

function renderDock({ container, unitSet, onSelect, selectedId }) {
  const list = UNIT_SETS[unitSet] || UNIT_SETS.capy;
  container.innerHTML = '';
  list.forEach(it=>{
    const el = document.createElement('div');
    el.className = 'card' + (selectedId===it.id ? ' active':'');
    el.innerHTML = `<img src="${it.sprite}" alt=""><div>${it.name}</div><small>฿${it.cost}</small>`;
    el.onclick = ()=> onSelect(it);
    container.appendChild(el);
  });
}

function getUnitSet(set){ return UNIT_SETS[set] || UNIT_SETS.capy; }
window.renderDock = renderDock;
window.getUnitSet = getUnitSet;
