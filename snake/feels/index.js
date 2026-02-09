const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const gridSize = 16;
const tile = canvas.width / gridSize;
const letters = "AMERYN + DAVID";

let snake, dx, dy, heart, gameState;

function startGame() {
  snake = [
    {x: 8, y: 8},
    {x: 7, y: 8}
  ];

  dx = 1;
  dy = 0;
  heart = spawnHeart();
  gameState = "playing";

  document.getElementById("deathScreen").style.display = "none";
  document.getElementById("winScreen").style.display = "none";
}

function spawnHeart() {
  return {
    x: Math.floor(Math.random() * gridSize),
    y: Math.floor(Math.random() * gridSize)
  };
}

function drawGrid() {
  ctx.strokeStyle = "#ffd1e8";
  for (let i = 0; i < gridSize; i++) {
    ctx.beginPath();
    ctx.moveTo(i * tile, 0);
    ctx.lineTo(i * tile, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i * tile);
    ctx.lineTo(canvas.width, i * tile);
    ctx.stroke();
  }
}

function drawHeart() {
  ctx.font = "22px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("♥️", heart.x * tile + tile/2, heart.y * tile + tile/2);
}

function drawSnake() {
  snake.forEach((part, i) => {
    ctx.fillStyle = "#d279e8";
    ctx.fillRect(part.x * tile, part.y * tile, tile, tile);

    if (i < letters.length) {
      ctx.fillStyle = "white";
      ctx.font = "14px Arial";
      ctx.fillText(
        letters[i],
        part.x * tile + tile/2,
        part.y * tile + tile/2
      );
    }
  });
}

function update() {
  if (gameState !== "playing") return;

  const head = {
    x: snake[0].x + dx,
    y: snake[0].y + dy
  };

  // wrap edges
  if (head.x < 0) head.x = gridSize - 1;
  if (head.x >= gridSize) head.x = 0;
  if (head.y < 0) head.y = gridSize - 1;
  if (head.y >= gridSize) head.y = 0;

  // self collision
  for (let part of snake) {
    if (part.x === head.x && part.y === head.y) {
      gameState = "dead";
      document.getElementById("deathScreen").style.display = "flex";
      return;
    }
  }

  snake.unshift(head);

  if (head.x === heart.x && head.y === heart.y) {
    heart = spawnHeart();
  } else {
    snake.pop();
  }

  if (snake.length >= 14) {
    gameState = "win";
    document.getElementById("winScreen").style.display = "flex";
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawHeart();
  drawSnake();
}

function loop() {
  update();
  draw();
}

function resetGame() {
  startGame();
}

document.addEventListener("keydown", e => {
  if (gameState !== "playing") return;

  if (e.key === "ArrowUp" && dy === 0) { dx = 0; dy = -1; }
  if (e.key === "ArrowDown" && dy === 0) { dx = 0; dy = 1; }
  if (e.key === "ArrowLeft" && dx === 0) { dx = -1; dy = 0; }
  if (e.key === "ArrowRight" && dx === 0) { dx = 1; dy = 0; }
});

document.getElementById("exitButton").onclick = () => {
  document.location.href = 'https://davidoats.github.io/ameryn-games/Selection/'
};

startGame();
setInterval(loop, 150);