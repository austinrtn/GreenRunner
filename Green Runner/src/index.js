import "./styles.css";
import Block from "./block.js";
import Cloud from "./cloud.js";
import Player from "./player.js";
/////////////////
//// VARIABLES //
/////////////////

/////////// DOCUMENT ////////////////
var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
export const WIDTH = c.width;
export const HEIGHT = c.height;
export const FLOOR_HEIGHT = HEIGHT / 1.2;
export const CEILING = -1;
const lblPoints = document.getElementById("points");
const lblLastPoints = document.getElementById("lastPoints");

/////////// GAME ////////////////
var running = true; // If the game is running
var doGameLoop = true; // If the gameloop is eneabled
var points = 0;

export var gravitySpeed = 7;
export var jumpSpeed = 7;
export var moveSpeed = 5;

var player = new Player();
var tracedBlock;
var tracedCloud;
var blockAr = []; // Array of all hostile blocks
var cloudAr = []; // Array of all clouds

//START
start();

function start() {
  lblLastPoints.innerHTML = points;
  points = 0;
  moveSpeed = 5;
  running = true;
  player = new Player();
  blockAr = [];
  cloudAr = [];
  createBlock();
  addToArray(cloudAr, new Cloud());
  tracedBlock = blockAr[0];
  tracedCloud = cloudAr[0];
  if (doGameLoop) gameLoop();
}

//////////
// DRAW //
//////////

function drawFloor() {
  ctx.beginPath();
  ctx.moveTo(0, FLOOR_HEIGHT);
  ctx.lineTo(WIDTH, FLOOR_HEIGHT);
  ctx.stroke();

  draw(new Block(0, FLOOR_HEIGHT, WIDTH, 400, "#FFAE47")); // Draws ground background
}

export function draw(obj) {
  ctx.fillStyle = obj.color;
  ctx.strokeStyle = "#000000";
  ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
  ctx.stroke();
}

function createBlock() {
  let x = Math.floor(750 + Math.random() * 300); // Determines where the block will be on X-axis
  let y = Math.floor(Math.random() * 4); // Determines if block will either be on ground or in air.

  if (y === 0) y = 80;
  else y = FLOOR_HEIGHT - 25;

  let block = new Block(x, y, 25, 25, "#FF0000");
  addToArray(blockAr, block);
  tracedBlock = blockAr[blockAr.length - 1]; // The last block in the array becomes the traced block
}

function createCloud() {
  addToArray(cloudAr, new Cloud());
  tracedCloud = cloudAr[cloudAr.length - 1];
}

function addToArray(array, obj) {
  let i = array.length;
  array[i] = obj;
}

//////////////////////////////
// LOOP, PHYSICS AND CONTROLS
/////////////////////////////

function gameLoop(timeStamp) {
  updateScore();
  ctx.clearRect(0, 0, c.width, c.height);

  //Draw Background
  draw(new Block(0, 0, WIDTH, HEIGHT - (HEIGHT - FLOOR_HEIGHT), "#18FFFB"));
  drawFloor();

  // Moves blocks and clouds
  moveBlocks(cloudAr);
  moveBlocks(blockAr);

  player.fall(); // Draws player and gives the player object gravity.
  checkCollosion();

  if (player.jumping === true) player.jump();

  if (tracedBlock.x < 400) {
    // creates block every 400 pixels
    createBlock();
  }

  if (tracedCloud.x < 200) {
    // creates cloud every 200 pixelsf
    createCloud();
  }

  if (running === true) requestAnimationFrame(gameLoop);
  else start(); // Will reset once player has collided with block and running = false
}

function updateScore() {
  lblPoints.innerHTML = points;
}

// Will move all objects within array with "move()" function (clouds and blocks)
function moveBlocks(array) {
  var i;
  for (i = 0; i < array.length; i++) {
    array[i].move();
  }
}

function checkCollosion() {
  var i;
  for (i = 0; i < blockAr.length; i++) {
    // If collision occurs...
    if (outOfBounds(i, blockAr) !== true) colides(player, blockAr[i], i);
  }
}

function outOfBounds(i, array) {
  let outOfBounds = false;
  if (array[i].x < array[i].w * -1) {
    outOfBounds = true;
    array.splice(i, 1); // removes block from array once out of bounds
  }
  return outOfBounds;
}

function colides(obj1, obj2, i) {
  if (
    //collision detected
    obj1.x + obj1.w > obj2.x &&
    obj1.y + obj1.h > obj2.y &&
    obj2.x + obj2.w > obj1.x &&
    obj2.y + obj2.h > obj1.y
  )
    running = false;
  else if (obj1.x + obj1.w > obj2.x && obj2.jumpedOver !== true) {
    // if the block is jumped over
    obj2.jumpedOver = true;
    points++;
    moveSpeed += 0.1; // increases move speed every time a block is jumped over
  }
}

// CONTROLLER

window.document.addEventListener("keydown", function(event) {
  if (event.keyCode === 32 && player.y > 80 && player.crouching !== true)
    player.jumping = true; // Jump with spacebar
  if (event.keyCode === 16) player.crouch(true); // Crouch with shift
});

window.document.addEventListener("keyup", function(event) {
  // Disables player from crouching while jumping
  if (event.keyCode === 16) player.crouch(false);
});
