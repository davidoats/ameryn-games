const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let zoom = 1.75;

ctx.imageSmoothingEnabled = false;

/* ---------- PLAYER ---------- */

const playerImg = new Image();
playerImg.src = "./looks/ameryn.png"; // your sprite

let player = {
  x: 80,
  y: 200,
  w: 32 * zoom,
  h: 32 * zoom,
  vel: 0
};

const gravity = 0.5;
const flap = -8;

/* ---------- CLOUD IMAGES ---------- */

const cloudImages = [];

for (let i = 1; i <= 4; i++) { // change number to match your files
  const img = new Image();
  img.src = `./looks/clouds/cloud${i}.png`;
  cloudImages.push(img);
}

/* ---------- CLOUD SYSTEM ---------- */

let clouds = [];

function spawnCloud() {
  clouds.push({
    x: canvas.width + Math.random() * 200,
    y: Math.random() * canvas.height * 0.7,
    img: cloudImages[Math.floor(Math.random() * cloudImages.length)],
    speed: 0.5 + Math.random() * 0.5,
    size: 75 * zoom
  });
}

for (let i = 0; i < 8; i++) spawnCloud();

/* ---------- HEARTS ---------- */

let hearts = [];
let spawnTimer = 0;
let score = 0;
let gameOver = false;

function spawnHeart() {
  hearts.push({
    x: canvas.width,
    y: Math.random() * (canvas.height - 40) + 20,
    size: 24 * zoom
  });
}

/* ---------- UPDATE ---------- */

function update() {
  if (gameOver) return;

  // clouds
  for (let i = clouds.length - 1; i >= 0; i--) {
    clouds[i].x -= clouds[i].speed;

    if (clouds[i].x < -150) {
      clouds.splice(i, 1);
      spawnCloud();
    }
  }

  // physics
  player.vel += gravity;
  player.y += player.vel;

  if (player.y < 0 || player.y > canvas.height - player.h) {
    gameOver = true;
  }

  spawnTimer++;
  if (spawnTimer > 80) {
    spawnTimer = 0;
    spawnHeart();
  }

  // heart collision
  for (let i = hearts.length - 1; i >= 0; i--) {
    let h = hearts[i];
    h.x -= 3;

    if (
      player.x < h.x + h.size &&
      player.x + player.w > h.x &&
      player.y < h.y + h.size &&
      player.y + player.h > h.y
    ) {
      hearts.splice(i, 1);
      score++;
      continue;
    }

    if (h.x < -20) hearts.splice(i, 1);
  }
}

/* ---------- DRAW ---------- */

function drawClouds() {
  for (let c of clouds) {
    ctx.drawImage(c.img, c.x, c.y, c.size, c.size * 0.6);
  }
}

function drawHearts() {
  ctx.font = "22px Arial";
  for (let h of hearts) {
    ctx.fillText("♥️", h.x, h.y);
  }
}

function drawPlayer() {
  ctx.drawImage(playerImg, player.x, player.y, player.w, player.h);
}

function drawScore() {
  ctx.fillStyle = "#ff1a75";
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, 20, 40);
}

function drawGameOver() {
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "40px Arial";
  ctx.fillText("Game Over", 120, 280);

  ctx.font = "20px Arial";
  ctx.fillText("Press SPACE to restart", 120, 330);
}

function draw() {
  // sky
  ctx.fillStyle = "#b0ceff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawClouds();
  drawHearts();
  drawPlayer();
  drawScore();

  if (gameOver) drawGameOver();
}

/* ---------- LOOP ---------- */

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

/* ---------- INPUT ---------- */

document.addEventListener("keydown", e => {
  if (e.code === "Space") {
    e.preventDefault();

    if (gameOver) {
      player.y = 200;
      player.vel = 0;
      hearts = [];
      score = 0;
      gameOver = false;
    } else {
      player.vel = flap;
    }
  }
});

document.getElementById("exitButton").onclick = () => {
  document.location.href = 'https://davidoats.github.io/ameryn-games/Selection/'
};

loop();