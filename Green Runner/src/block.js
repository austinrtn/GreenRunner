import { draw, moveSpeed } from "./index.js";

export default class Block {
  constructor(x, y, w, h, color) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
  }

  move() {
    this.x -= moveSpeed;
    draw(this);
  }
}
