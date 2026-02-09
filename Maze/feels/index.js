const canvas = document.getElementById("maze");
const ctx = canvas.getContext("2d");

const mini = document.getElementById("minimap");
const mctx = mini.getContext("2d");

let zoom = 1.625;
const basetile = 32;
const tile = basetile * zoom;
const cols = 63;
const rows = 63;

let maze = [];
let stack = [];

let player = { x: 1, y: 1 };
let goal = { x: 1, y: 1 };

const playerImg = new Image();
const goalImg = new Image();

let assetsLoaded = 0;

function checkAssets() {
  assetsLoaded++;
}

playerImg.onload = checkAssets;
goalImg.onload = checkAssets;

playerImg.src = "./looks/ameryn.png";
goalImg.src = "./looks/david.png";

ctx.imageSmoothingEnabled = false;

let camera = { x: 0, y: 0 };
let gameWon = false;

// fill maze
for (let y = 0; y < rows; y++) {
  maze[y] = [];
  for (let x = 0; x < cols; x++) {
    maze[y][x] = 1;
  }
}

function generateMaze() {
  let current = { x: 1, y: 1 };
  maze[1][1] = 0;
  stack = [current];

  while (stack.length > 0) {
    let neighbors = [];

    const dirs = [
      {x: 0, y: -2},
      {x: 2, y: 0},
      {x: 0, y: 2},
      {x: -2, y: 0}
    ];

    for (let d of dirs) {
      let nx = current.x + d.x;
      let ny = current.y + d.y;

      if (nx > 0 && ny > 0 && nx < cols - 1 && ny < rows - 1 && maze[ny][nx] === 1) {
        neighbors.push({x: nx, y: ny, dx: d.x/2, dy: d.y/2});
      }
    }

    if (neighbors.length > 0) {
      let next = neighbors[Math.floor(Math.random() * neighbors.length)];

      maze[current.y + next.dy][current.x + next.dx] = 0;
      maze[next.y][next.x] = 0;

      stack.push(current);
      current = {x: next.x, y: next.y};
    } else {
      current = stack.pop();
    }
  }

  const forkChance = 0.09;

  for (let y = 1; y < rows - 1; y++) {
    for (let x = 1; x < cols - 1; x++) {
      if (maze[y][x] === 1 && Math.random() < forkChance) {
        maze[y][x] = 0;
      }
    }
  }
}

function randomOpenTile() {
  while (true) {
    let x = Math.floor(Math.random() * cols);
    let y = Math.floor(Math.random() * rows);

    if (maze[y][x] === 0) return { x, y };
  }
}

function placePlayerAndGoal() {
  player = randomOpenTile();
  goal = randomOpenTile();

  while (
    Math.abs(player.x - goal.x) + Math.abs(player.y - goal.y) < cols / 2
  ) {
    goal = randomOpenTile();
  }
}

function updateCamera() {
  camera.x = player.x * tile - canvas.width / 2 + tile / 2;
  camera.y = player.y * tile - canvas.height / 2 + tile / 2;

  camera.x = Math.max(0, Math.min(camera.x, cols * tile - canvas.width));
  camera.y = Math.max(0, Math.min(camera.y, rows * tile - canvas.height));
}

function drawMaze() {
  const startCol = Math.floor(camera.x / tile);
  const endCol = startCol + Math.ceil(canvas.width / tile);
  const startRow = Math.floor(camera.y / tile);
  const endRow = startRow + Math.ceil(canvas.height / tile);

  for (let y = startRow; y < endRow; y++) {
    for (let x = startCol; x < endCol; x++) {
      if (!maze[y] || maze[y][x] === 0) continue;

      ctx.fillStyle = "#f1bee7";
      ctx.fillRect(
        x * tile - camera.x,
        y * tile - camera.y,
        tile,
        tile
      );
    }
  }
}

function drawPlayer() {
  ctx.drawImage(
    playerImg,
    player.x * tile - camera.x,
    player.y * tile - camera.y,
    tile,
    tile
  );
}

function drawGoal() {
  ctx.drawImage(
    goalImg,
    goal.x * tile - camera.x,
    goal.y * tile - camera.y,
    tile,
    tile
  );
}

function drawMiniMap() {
  mctx.clearRect(0, 0, mini.width, mini.height);

  const scaleX = mini.width / cols;
  const scaleY = mini.height / rows;

  mctx.fillStyle = "#ff99cc";
  mctx.fillRect(goal.x * scaleX, goal.y * scaleY, 4, 4);

  mctx.fillStyle = "#ff1a75";
  mctx.fillRect(player.x * scaleX, player.y * scaleY, 4, 4);
}

function draw() {
  if (assetsLoaded < 2) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMaze();
  drawGoal();
  drawPlayer();
  drawMiniMap();
}

function gameLoop() {
  draw();
  requestAnimationFrame(gameLoop);
}

function canMove(x, y) {
  return maze[y] && maze[y][x] === 0;
}

document.addEventListener("keydown", e => {
  if (gameWon) return;

  let nx = player.x;
  let ny = player.y;

  if (e.key === "ArrowUp") ny--;
  if (e.key === "ArrowDown") ny++;
  if (e.key === "ArrowLeft") nx--;
  if (e.key === "ArrowRight") nx++;

  if (canMove(nx, ny)) {
    player.x = nx;
    player.y = ny;
  }

  if (player.x === goal.x && player.y === goal.y) {
    gameWon = true;
    document.getElementById("winOverlay").style.display = "flex";
  }

  updateCamera();
});

function restart() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      maze[y][x] = 1;
    }
  }

  generateMaze();
  placePlayerAndGoal();

  gameWon = false;
  document.getElementById("winOverlay").style.display = "none";

  updateCamera();
}

document.getElementById("exitButton").onclick = () => {
  document.location.href = '../../Selection/'
};

generateMaze();
placePlayerAndGoal();
updateCamera();
gameLoop();
