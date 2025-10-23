// รองรับสี/ขนาดกระสุนต่อยูนิต + ลำแสงสะอาด
class Projectile {
  constructor({ position, enemy, speed = 6, damage = 20, radius = 6, color = '#00ff88' }) {
    this.position = { x: position.x, y: position.y };
    this.enemy = enemy;
    this.speed = speed;
    this.damage = damage;
    this.radius = radius;
    this.color  = color;
    this._hit = false;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }

  update(ctx) {
    if (!this.enemy) return;

    const dx = this.enemy.center.x - this.position.x;
    const dy = this.enemy.center.y - this.position.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 0) {
      this.position.x += (dx / dist) * this.speed;
      this.position.y += (dy / dist) * this.speed;
    }

    // ชน -> ลดเลือด
    const hitDist = (this.enemy.radius || 0) + this.radius;
    if (Math.hypot(this.enemy.center.x - this.position.x, this.enemy.center.y - this.position.y) <= hitDist) {
      if (typeof this.enemy.takeDamage === 'function') this.enemy.takeDamage(this.damage);
      else this.enemy.health = Math.max(0, (this.enemy.health ?? 0) - this.damage);
      this._hit = true;
    }

    this.draw(ctx);
  }
}
window.Projectile = Projectile;
