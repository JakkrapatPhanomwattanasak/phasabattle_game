class Building {
  constructor({ position, config }) {
    this.position = { ...position };
    this.center = { x: position.x + 32, y: position.y + 32 };

    this.range     = config.range;
    this.damage    = config.damage;
    this.fireRate  = config.fireRate;
    this.projSpeed = config.projSpeed;
    this.cost      = config.cost;

    this.projColor  = config.projColor || '#00ff88';
    this.projRadius = config.projRadius || 6;

    // แสดงเฟรมเดียว (idle)
    this.sprite = new Sprite({
      position: { x: this.position.x, y: this.position.y },
      imageSrc: config.sprite,
      tileW: config.tileW ?? 32,
      tileH: config.tileH ?? 32,
      frames: { max: config.framesMax ?? 1, hold: config.framesHold ?? 8 },
      scale: config.scale ?? 2
    });

    this.projectiles = [];
    this._cooldown = 0;
    this.target = null;

    this._sold = false;   // ป้องกันขายซ้ำ
  }

  update(ctx, enemies, explosions) {
    // เลือกเป้าหมายในระยะที่ยังไม่ตาย/ยังไม่ถึงเส้นชัย
    const inRange = enemies.filter(e => !e.dead && !e.reachedGoal &&
      Math.hypot(e.center.x - this.center.x, e.center.y - this.center.y) < this.range);
    this.target = inRange[0] || null;

    if (this._cooldown > 0) this._cooldown--;
    if (this.target && this._cooldown <= 0) {
      this.projectiles.push(new Projectile({
        position: { x: this.center.x, y: this.center.y },
        enemy: this.target,
        speed: this.projSpeed,
        damage: this.damage,
        radius: this.projRadius,
        color:  this.projColor
      }));
      this._cooldown = this.fireRate;
    }

    this.sprite.update(ctx);

    // กระสุน
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      if (!p.enemy) { this.projectiles.splice(i, 1); continue; }
      p.update(ctx);
      if (p._hit) this.projectiles.splice(i, 1);
    }
  }
}
window.Building = Building;
