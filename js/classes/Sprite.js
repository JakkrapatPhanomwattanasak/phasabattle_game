// Global Sprite (no ES modules)
class Sprite {
  constructor({
    position, imageSrc,
    tileW, tileH, cols, rows,
    scale = 1,
    frames = { max: 1, hold: 8 },
    row = 0, offset = { x: 0, y: 0 }
  }) {
    this.position = position;
    this.scale = scale;
    this.frames = { max: frames.max || 1, hold: frames.hold ?? 8 };
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.row = row;
    this.offset = offset;

    this.image = new Image();
    this.image.onload = () => {
      if (!tileW && cols) this.tileW = this.image.width / cols; else this.tileW = tileW ?? this.image.width;
      if (!tileH && rows) this.tileH = this.image.height / rows; else this.tileH = tileH ?? this.image.height;
      const ctx = document.getElementById('game').getContext('2d');
      ctx.imageSmoothingEnabled = false;
    };
    this.image.src = imageSrc;
  }

  draw(c) {
    if (!this.image.complete) return;
    const sx = Math.floor(this.framesCurrent) * this.tileW;
    const sy = this.row * this.tileH;
    c.drawImage(
      this.image,
      sx, sy, this.tileW, this.tileH,
      this.position.x + this.offset.x,
      this.position.y + this.offset.y,
      this.tileW * this.scale,
      this.tileH * this.scale
    );
  }

  update(c) {
    this.draw(c);
    if (this.frames.max <= 1) return;
    this.framesElapsed++;
    if (this.framesElapsed % this.frames.hold === 0) {
      this.framesCurrent = (this.framesCurrent + 1) % this.frames.max;
    }
  }
}
window.Sprite = Sprite;
