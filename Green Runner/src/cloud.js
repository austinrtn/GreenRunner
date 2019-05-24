import Block from "./block.js";

export default class Cloud extends Block {
  constructor() {
    // Gives clouds a random x and y-axis
    let w = Math.floor(25 + Math.random() * Math.floor(200));
    let h = w / 2;
    let x = 750;
    let y = Math.floor(Math.random() * 40);
    super(x, y, w, h);

    let transparency = 6 + Math.random() * 3;

    this.color = "rgba(255, 255, 255," + transparency + ")";
  }
}
