// Constants
const GRID_SIZE = 20;            // Number of cells per row/column
const CELL_SIZE = 20;            // Pixel size of each cell
const INITIAL_SPEED = 5;         // Cells per second
const SNAKE_COLOR = '#00FF00';
const FRUIT_COLOR = '#FF0000';
const BG_COLOR = '#000000';

// Game state
let canvas, ctx;
let snake = [];                  // Array of {x, y}
let direction = { x: 1, y: 0 };  // Starts moving right
let fruit = { x: 0, y: 0 };
let score = 0;
let speed = INITIAL_SPEED;
let lastRenderTime = 0;
let gameOverFlag = false;

// Initialize the game
function initGame() {
  canvas = document.getElementById('gameCanvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'gameCanvas';
    canvas.width = GRID_SIZE * CELL_SIZE;
    canvas.height = GRID_SIZE * CELL_SIZE;
    document.body.appendChild(canvas);
  }
  ctx = canvas.getContext('2d');

  // Reset state
  snake = [{ x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) }];
  direction = { x: 1, y: 0 };
  score = 0;
  speed = INITIAL_SPEED;
  gameOverFlag = false;

  placeFruit();
  lastRenderTime = 0;
  window.requestAnimationFrame(mainLoop);
}

// Place fruit at a random empty cell
function placeFruit() {
  let newPos;
  do {
    newPos = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
  } while (snake.some(seg => seg.x === newPos.x && seg.y === newPos.y));
  fruit = newPos;
}

// Main loop driven by requestAnimationFrame
function mainLoop(timestamp) {
  if (gameOverFlag) return;
  const delta = (timestamp - lastRenderTime) / 1000;
  if (delta >= 1 / speed) {
    update();
    draw();
    lastRenderTime = timestamp;
  }
  window.requestAnimationFrame(mainLoop);
}

// Update game state: move snake, handle collisions, eat fruit
function update() {
  const newHead = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
  };

  // Wall collision
  if (
    newHead.x < 0 ||
    newHead.x >= GRID_SIZE ||
    newHead.y < 0 ||
    newHead.y >= GRID_SIZE
  ) {
    gameOver();
    return;
  }

  // Self collision
  if (snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
    gameOver();
    return;
  }

  // Add new head
  snake.unshift(newHead);

  // Fruit consumption
  if (newHead.x === fruit.x && newHead.y === fruit.y) {
    score++;
    speed += 0.5; // Gradually increase speed
    placeFruit();
  } else {
    // Remove tail segment if no fruit eaten
    snake.pop();
  }
}

// Render the game board
function draw() {
  // Clear background
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw fruit
  ctx.fillStyle = FRUIT_COLOR;
  ctx.fillRect(fruit.x * CELL_SIZE, fruit.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

  // Draw snake
  ctx.fillStyle = SNAKE_COLOR;
  snake.forEach(seg => {
    ctx.fillRect(seg.x * CELL_SIZE, seg.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  });

  // Draw score
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '16px Arial';
  ctx.fillText('Score: ' + score, 5, 15);
}

// Handle keyboard input for direction changes
function handleKey(e) {
  const key = e.key;
  const isOpposite = (dx, dy) => direction.x === -dx && direction.y === -dy;

  if (key === 'ArrowUp' && !isOpposite(0, 1)) {
    direction = { x: 0, y: -1 };
  } else if (key === 'ArrowDown' && !isOpposite(0, -1)) {
    direction = { x: 0, y: 1 };
  } else if (key === 'ArrowLeft' && !isOpposite(1, 0)) {
    direction = { x: -1, y: 0 };
  } else if (key === 'ArrowRight' && !isOpposite(-1, 0)) {
    direction = { x: 1, y: 0 };
  }
}

// End the game
function gameOver() {
  gameOverFlag = true;
  alert('Game Over! Your score: ' + score);
}

// Set up event listeners and start the game when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('keydown', handleKey);
  initGame();
});