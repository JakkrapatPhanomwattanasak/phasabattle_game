class CapyGuide {
  constructor() {
    this.el = document.createElement('div');
    this.el.className = 'guide-box';
    this.el.style.position = 'fixed';
    this.el.style.display = 'none';
    this.el.style.zIndex = '1000';
    this.el.innerHTML = `
      <img src="img/capy/Capi_Idle.png" class="capy-avatar" alt="CapyPara">
      <div class="bubble">
        <p id="capyText">สวัสดี! ฉันคือ CapyPara จะสอนเธอเองนะ~</p>
        <div class="arrow-down"></div>
      </div>`;
    document.body.appendChild(this.el);
    this.textEl = this.el.querySelector('#capyText');
  }
  say(text){
    this.textEl.textContent = text;
    this.el.style.display='flex';
    this.el.style.left='50px';
    this.el.style.bottom='60px';
    this.el.style.top='';
  }
  // ชี้ไปยัง element ตาม selector (วางบับเบิลเหนือเป้าหมาย ถ้าไม่พอพื้นที่ จะวางด้านล่าง)
  pointTo(selectorOrEl, text = '', { offsetX = 8, offsetY = 8 } = {}){
    let target = null;
    if (typeof selectorOrEl === 'string') target = document.querySelector(selectorOrEl);
    else target = selectorOrEl;
    if (!target) { this.say(text || 'หาเป้าหมายไม่เจอ 😅'); return; }

    const r = target.getBoundingClientRect();
    this.textEl.textContent = text || '';
    this.el.style.display = 'flex';

    const topWanted = r.top - this.el.offsetHeight - 10;
    this.el.style.left = Math.max(8, r.left + offsetX) + 'px';
    this.el.style.top  = (topWanted > 8 ? topWanted : (r.bottom + offsetY)) + 'px';
  }
  hide(){ this.el.style.display='none'; }
}
window.capyGuide = new CapyGuide();
