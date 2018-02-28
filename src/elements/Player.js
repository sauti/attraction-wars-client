import Phaser from 'phaser';

export default class {
  constructor(scene) {
    this.scene = scene;
    this.graphics = null;
    this.circle = null;
  }

  spawn(x, y, r) {
    this.circle = new Phaser.Geom.Circle(x, y, r);
    this.graphics = this.scene.add.graphics({ fillStyle: { color: 0x303331 } });
    this.graphics.fillCircleShape(this.circle);
  }

  move(dX, dY) {
    if (!this.graphics) {
      throw 'Call move before spawn';
    }

    this.circle.x += dX;
    this.circle.y += dY;
    this.graphics.clear();
    this.graphics.fillCircleShape(this.circle);
  }
}
