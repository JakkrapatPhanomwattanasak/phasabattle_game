// js/classes/Enemy.js
class Enemy {
  constructor(opt) {
    this.center = { x: opt.position.x, y: opt.position.y };
    this.velocity = { x: 0, y: 0 };
    this.waypointIndex = 0;

    this.health = opt.hp ?? 100;
    this.maxHealth = this.health;
    this.speed = opt.speed ?? 0.6;
    this.bounty = opt.bounty ?? 20;

    this.radius = opt.radius ?? 26;

    this.image = new Image();
    this.imageLoaded = false;
    this.image.onload = () => (this.imageLoaded = true);
    this.image.src = opt.sprite ?? 'img/orc.png';

    this.useSheet = !!(opt.tileW && opt.tileH);
    this.tileW = opt.tileW ?? 64;
    this.tileH = opt.tileH ?? 64;
    this.scale = opt.scale ?? (this.useSheet ? 2 : 1);
    this.row = opt.row ?? 0;
    this.frames = { max: opt.framesMax ?? 7, current: 0, elapsed: 0, hold: 6 };

    this.drawW = this.tileW * this.scale;
    this.drawH = this.tileH * this.scale;
    this.position = { x: this.center.x - this.drawW / 2, y: this.center.y - this.drawH / 2 };

    this.reachedGoal = false; // <<< สำคัญ: ใช้บอกว่าถึงปลายทางแล้ว
  }

  _ensureSize() {
    this.drawW = this.tileW * this.scale;
    this.drawH = this.tileH * this.scale;
    this.position.x = this.center.x - this.drawW / 2;
    this.position.y = this.center.y - this.drawH / 2;
  }

  step(wps = window.waypoints) {
    if (this.reachedGoal) return;

    const target = wps[this.waypointIndex];
    if (!target) { this.reachedGoal = true; return; }

    const xDist = target.x - this.center.x;
    const yDist = target.y - this.center.y;
    const dist  = Math.hypot(xDist, yDist);

    // เลี้ยวที่ระยะ 8 px
    if (dist < 8) {
      this.waypointIndex++;
      if (this.waypointIndex >= wps.length) { this.reachedGoal = true; return; }
    }

    const angle = Math.atan2(yDist, xDist);
    this.velocity.x = Math.cos(angle) * this.speed;
    this.velocity.y = Math.sin(angle) * this.speed;

    this.center.x += this.velocity.x;
    this.center.y += this.velocity.y;

    this.position.x = this.center.x - this.drawW / 2;
    this.position.y = this.center.y - this.drawH / 2;

    this.frames.elapsed++;
    if (this.frames.elapsed % this.frames.hold === 0) {
      this.frames.current = (this.frames.current + 1) % this.frames.max;
    }
  }

  draw(c) {
    // แถบเลือด
    const w = 48;
    const r = Math.max(0, this.health) / this.maxHealth;
    c.fillStyle = '#000a';
    c.fillRect(this.position.x, this.position.y - 10, w, 5);
    c.fillStyle = '#34d399';
    c.fillRect(this.position.x, this.position.y - 10, w * r, 5);

    if (!this.imageLoaded) return;
    this._ensureSize();

    if (this.useSheet) {
      const sx = this.frames.current * this.tileW;
      const sy = this.row * this.tileH;
      c.drawImage(this.image, sx, sy, this.tileW, this.tileH, this.position.x, this.position.y, this.drawW, this.drawH);
    } else {
      const frameW = this.image.width / this.frames.max;
      c.drawImage(this.image, frameW * this.frames.current, 0, frameW, this.image.height, this.position.x, this.position.y, frameW, this.image.height);
    }
  }
}
window.Enemy = Enemy;
