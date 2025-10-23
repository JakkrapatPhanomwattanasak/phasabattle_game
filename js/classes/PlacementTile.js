class PlacementTile {
  constructor({ position }) {
    this.position = position;
    this.size = 64;
    this.isOccupied = false;
  }

  update(ctx, mouse) {
    if (mouse &&
      mouse.x > this.position.x && mouse.x < this.position.x + this.size &&
      mouse.y > this.position.y && mouse.y < this.position.y + this.size
    ) {
      ctx.strokeStyle = 'rgba(0,255,200,.8)';
      ctx.lineWidth = 2;
      ctx.strokeRect(this.position.x + 2, this.position.y + 2, this.size - 4, this.size - 4);
    }
  }
}
window.PlacementTile = PlacementTile;
