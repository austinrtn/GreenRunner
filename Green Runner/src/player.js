import {
  gravitySpeed,
  jumpSpeed,
  draw,
  CEILING,
  FLOOR_HEIGHT
} from "./index.js";
import Block from "./block.js";

let x = 20;
let y = FLOOR_HEIGHT;
let w = 25;
let h = 75;

export default class Player extends Block {
  constructor() {
    super(x, y, w, h, "#00FF2B");

    this.jumping = false;
    this.falling = false;
    this.crouching = false;
  }

  jump() {
    this.y -= jumpSpeed;

    if (this.y <= CEILING) this.jumping = false;

    draw(this);
  }

  fall() {
    if (this.jumping === false) {
      this.falling = true;

      if (this.y + this.h < FLOOR_HEIGHT) this.y += gravitySpeed;
      else {
        this.y = FLOOR_HEIGHT - this.h;
      }
    }
    draw(this);
  }

  crouch(down) {
    if (down === true && this.crouching === false) {
      this.crouching = true;
      this.h = this.h / 2;
      this.falling = true;
      this.jumping = false;
    } else if (down === false) {
      this.crouching = false;
      this.h = this.h * 2;
    }
    draw(this);
  }
}
