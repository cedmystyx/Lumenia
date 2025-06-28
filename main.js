const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const lifeEl = document.getElementById("life");
const menu = document.getElementById("menu");
const hud = document.getElementById("hud");
const bgMusic = document.getElementById("bgMusic");
const shootSound = document.getElementById("shootSound");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gravity = 1;
let ground = canvas.height - 100;

let gameRunning = false;
let score = 0;
let life = 3;

// Nuages
let clouds = Array.from({length: 10}, (_, i) => ({
  x: Math.random() * canvas.width,
  y: Math.random() * 200,
  w: 100 + Math.random() * 100,
  h: 50,
  dx: 0.2 + Math.random() * 0.3
}));

let player = {
  x: 100,
  y: ground,
  width: 50,
  height: 50,
  color: "deepskyblue",
  dy: 0,
  dx: 0,
  speed: 5,
  jumping: false,
  bullets: []
};

let platforms = [
  { x: 200, y: ground - 100, w: 150, h: 20 },
  { x: 450, y: ground - 200, w: 200, h: 20 },
  { x: 800, y: ground - 150, w: 150, h: 20 }
];

let enemies = [
  { x: 600, y: ground - 50, w: 40, h: 40, alive: true }
];

let keys = {};
window.addEventListener("keydown", e => keys[e.code] = true);
window.addEventListener("keyup", e => keys[e.code] = false);
window.addEventListener("click", () => {
  if (!gameRunning) return;
  shootSound.currentTime = 0;
  shootSound.play();
  player.bullets.push({
    x: player.x + player.width,
    y: player.y + player.height / 2,
    w: 10,
    h: 5,
    dx: 10
  });
});

function startGame() {
  menu.style.display = "none";
  canvas.style.display = "block";
  hud.style.display = "flex";
  bgMusic.play();
  gameRunning = true;
  update();
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Nuages
  for (let c of clouds) {
    c.x += c.dx;
    if (c.x > canvas.width) c.x = -c.w;
    ctx.fillStyle = "#ffffffaa";
    ctx.fillRect(c.x, c.y, c.w, c.h);
  }

  player.dx = 0;
  if (keys["ArrowRight"]) player.dx = player.speed;
  if (keys["ArrowLeft"]) player.dx = -player.speed;
  if (keys["Space"] && !player.jumping) {
    player.dy = -20;
    player.jumping = true;
  }

  player.x += player.dx;
  player.dy += gravity;
  player.y += player.dy;

  if (player.y + player.height >= ground) {
    player.y = ground - player.height;
    player.dy = 0;
    player.jumping = false;
  }

  for (let plat of platforms) {
    if (player.x < plat.x + plat.w &&
        player.x + player.width > plat.x &&
        player.y + player.height < plat.y + plat.h &&
        player.y + player.height + player.dy >= plat.y) {
      player.y = plat.y - player.height;
      player.dy = 0;
      player.jumping = false;
    }
  }

  for (let b of player.bullets) b.x += b.dx;
  player.bullets = player.bullets.filter(b => b.x < canvas.width);

  for (let e of enemies) {
    for (let b of player.bullets) {
      if (b.x < e.x + e.w && b.x + b.w > e.x && b.y < e.y + e.h && b.y + b.h > e.y) {
        e.alive = false;
        b.x = canvas.width + 1;
        score += 100;
        scoreEl.textContent = "Score: " + score;
      }
    }
  }

  ctx.fillStyle = "#9fc9f3";
  ctx.fillRect(0, ground, canvas.width, canvas.height - ground);

  ctx.fillStyle = "#ffffffdd";
  for (let plat of platforms) ctx.fillRect(plat.x, plat.y, plat.w, plat.h);

  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  ctx.fillStyle = "orange";
  for (let b of player.bullets) ctx.fillRect(b.x, b.y, b.w, b.h);

  ctx.fillStyle = "crimson";
  for (let e of enemies) if (e.alive) ctx.fillRect(e.x, e.y, e.w, e.h);

  requestAnimationFrame(update);
}