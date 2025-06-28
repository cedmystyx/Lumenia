// ---------------------
// Variables & setup
// ---------------------

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const menu = document.getElementById("menu");
const levelMenu = document.getElementById("levelMenu");
const levelsList = document.getElementById("levelsList");
const backBtn = document.getElementById("backBtn");
const pauseMenu = document.getElementById("pauseMenu");
const resumeBtn = document.getElementById("resumeBtn");
const quitBtn = document.getElementById("quitBtn");
const hud = document.getElementById("hud");
const scoreEl = document.getElementById("score");
const lifeEl = document.getElementById("life");
const bgMusic = document.getElementById("bgMusic");
const shootSound = document.getElementById("shootSound");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gravity = 1.3;
const groundY = canvas.height - 100;

let score = 0;
let life = 3;
let currentLevel = 0;
let gameRunning = false;
let paused = false;
let scrollSpeed = 3;
let levelLengthPx = 0;
let levelStartTime = 0;

// ---------------
// Classes
// ---------------

class Player {
  constructor() {
    this.width = 50;
    this.height = 50;
    this.x = 100;
    this.y = groundY - this.height;
    this.color = "deepskyblue";
    this.dy = 0;
    this.jumping = false;
    this.onGround = true;
    this.bullets = [];
  }

  jump() {
    if (!this.jumping && this.onGround) {
      this.jumping = true;
      this.dy = -18;
      this.onGround = false;
    }
  }

  update() {
    if (this.jumping) {
      this.dy += gravity;
      this.y += this.dy;
      if (this.y >= groundY - this.height) {
        this.y = groundY - this.height;
        this.jumping = false;
        this.dy = 0;
        this.onGround = true;
      }
    }
    // Bullets movement
    this.bullets.forEach(b => b.update());
    this.bullets = this.bullets.filter(b => b.x < canvas.width);
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    // Bullets
    ctx.fillStyle = "orange";
    this.bullets.forEach(b => b.draw());
  }

  shoot() {
    shootSound.currentTime = 0;
    shootSound.play();
    this.bullets.push(new Bullet(this.x + this.width, this.y + this.height / 2));
  }
}

class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 10;
    this.h = 5;
    this.dx = 10;
  }
  update() {
    this.x += this.dx;
  }
  draw() {
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
}

class Platform {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  draw(scrollX) {
    let px = this.x - scrollX;
    if (px + this.w > 0 && px < canvas.width) {
      ctx.fillStyle = "#ffffffcc";
      ctx.fillRect(px, this.y, this.w, this.h);
    }
  }
}

class Enemy {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.alive = true;
  }
  draw(scrollX) {
    let ex = this.x - scrollX;
    if (ex + this.w > 0 && ex < canvas.width && this.alive) {
      ctx.fillStyle = "crimson";
      ctx.fillRect(ex, this.y, this.w, this.h);
    }
  }
}

// ---------------
// Level data
// ---------------

const levels = [
  {
    name: "Zephyros Doux",
    music: "assets/sounds/music1.mp3",
    scrollSpeed: 3,
    durationSec: 210,
    platforms: [
      new Platform(300, groundY - 80, 200, 20),
      new Platform(650, groundY - 120, 150, 20),
      new Platform(900, groundY - 100, 200, 20),
      new Platform(1200, groundY - 130, 150, 20)
    ],
    enemies: [
      new Enemy(700, groundY - 50, 40, 40),
      new Enemy(1100, groundY - 50, 40, 40)
    ]
  },
  {
    name: "Brise Légère",
    music: "assets/sounds/music2.mp3",
    scrollSpeed: 3.5,
    durationSec: 240,
    platforms: [
      new Platform(250, groundY - 100, 160, 20),
      new Platform(520, groundY - 140, 180, 20),
      new Platform(800, groundY - 110, 220, 20),
      new Platform(1150, groundY - 150, 180, 20)
    ],
    enemies: [
      new Enemy(600, groundY - 50, 40, 40),
      new Enemy(1000, groundY - 50, 40, 40),
      new Enemy(1300, groundY - 50, 40, 40)
    ]
  }
];

// ---------------
// Game variables
// ---------------

let player = new Player();
let platforms = [];
let enemies = [];
let clouds = [];
let levelLengthPx = 0;
let levelStartTime = 0;

// ---------------
// Clouds for ambience
// ---------------

function initClouds() {
  clouds = Array.from({ length: 12 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * 150,
    w: 120 + Math.random() * 100,
    h: 50,
    dx: 0.3 + Math.random() * 0.3
  }));
}

function drawClouds() {
  clouds.forEach(c => {
    c.x -= c.dx;
    if (c.x + c.w < 0) c.x = canvas.width + Math.random() * 200;
    ctx.fillStyle = "#ffffffbb";
    ctx.fillRect(c.x, c.y, c.w, c.h);
  });
}

// ---------------
// Level setup
// ---------------

function setupLevel(level) {
  scrollSpeed = level.scrollSpeed;
  platforms = level.platforms;
  enemies = level.enemies;
  levelLengthPx = scrollSpeed * level.durationSec + canvas.width;
  levelStartTime = performance.now();
  score = 0;
  life = 3;
  player = new Player();
  initClouds();
  scoreEl.textContent = "Score: 0";
  lifeEl.textContent = "Vie: " + "♥".repeat(life);
}

// ---------------
// Collision detection helper (AABB)
function checkCollision(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.w &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.h &&
    rect1.y + rect1.height > rect2.y
  );
}

// ---------------
// Platform collision
function checkPlatformCollision() {
  player.onGround = false;
  platforms.forEach(plat => {
    let platRect = { x: plat.x - scrollX, y: plat.y, width: plat.w, height: plat.h };
    let playerRect = { x: player.x, y: player.y, width: player.width, height: player.height };

    // On vérifie si le player atterrit sur la plateforme (en Y seulement)
    if (
      player.x + player.width > platRect.x &&
      player.x < platRect.x + platRect.width &&
      player.y + player.height <= platRect.y + 10 &&
      player.y + player.height + player.dy >= platRect.y
    ) {
      player.y = platRect.y - player.height;
      player.dy = 0;
      player.jumping = false;
      player.onGround = true;
    }
  });
}

// ---------------
// Ennemis & tirs
function checkBulletEnemyCollision() {
  player.bullets.forEach(bullet => {
    enemies.forEach(enemy => {
      if (!enemy.alive) return;
      let enemyRect = { x: enemy.x - scrollX, y: enemy.y, width: enemy.w, height: enemy.h };
      let bulletRect = { x: bullet.x, y: bullet.y, width: bullet.w, height: bullet.h };

      if (
        bulletRect.x < enemyRect.x + enemyRect.width &&
        bulletRect.x + bulletRect.width > enemyRect.x &&
        bulletRect.y < enemyRect.y + enemyRect.height &&
        bulletRect.y + bulletRect.height > enemyRect.y
      ) {
        enemy.alive = false;
        bullet.x = canvas.width + 1;
        score += 100;
        scoreEl.textContent = "Score: " + score;
      }
    });
  });
}

// ---------------
// Variables pour défilement & timer
let scrollX = 0;

// ---------------
// Main update loop
function update() {
  if (!gameRunning || paused) {
    requestAnimationFrame(update);
    return;
  }

  // Efface canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dessine nuages
  drawClouds();

  // Calcule scroll (décalage du niveau)
  let elapsed = (performance.now() - levelStartTime) / 1000;
  scrollX = scrollSpeed * elapsed;

  // Dessine sol
  ctx.fillStyle = "#28284d";
  ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);

  // Dessine plateformes
  platforms.forEach(p => p.draw(scrollX));

  // Dessine ennemis
  enemies.forEach(e => e.draw(scrollX));

  // Mise à jour joueur
  player.update();

  // Check collisions plateformes
  checkPlatformCollision();

  // Check collisions bullets/ennemis
  checkBulletEnemyCollision();

  // Dessine joueur
  player.draw();

  // Affiche HUD
  scoreEl.textContent = "Score: " + score;
  lifeEl.textContent = "Vie: " + "♥".repeat(life);

  // Vérifie fin niveau
  if (scrollX >= levelLengthPx) {
    gameRunning = false;
    bgMusic.pause();
    alert("Bravo, tu as terminé le niveau ! 🎉");
    showLevelMenu();
    canvas.style.display = "none";
    hud.classList.add("hidden");
    return;
  }

  requestAnimationFrame(update);
}

// ---------------
// Input handling
window.addEventListener("keydown", e => {
  if (!gameRunning) return;

  if (e.code === "Space") {
    player.jump();
  } else if (e.code === "KeyP") {
    togglePause();
  }
});

window.addEventListener("click", () => {
  if (gameRunning && !paused) player.shoot();
});

// ---------------
// Pause menu
function togglePause() {
  if (!gameRunning) return;
  paused = !paused;
  if (paused) {
    bgMusic.pause();
    pauseMenu.classList.remove("hidden");
    hud.classList.add("hidden");
  } else {
    bgMusic.play();
    pauseMenu.classList.add("hidden");
    hud.classList.remove("hidden");
  }
}

// ---------------
// Menu gestion
function showLevelMenu() {
  menu.classList.add("hidden");
  pauseMenu.classList.add("hidden");
  hud.classList.add("hidden");
  levelMenu.classList.remove("hidden");
  levelsList.innerHTML = "";
  levels.forEach((lvl, i) => {
    let btn = document.createElement("button");
    btn.textContent = lvl.name;
    btn.onclick = () => startGame(i);
    levelsList.appendChild(btn);
  });
}

function startGame(levelIndex) {
  currentLevel = levelIndex;
  const lvl = levels[levelIndex];
  setupLevel(lvl);

  bgMusic.src = lvl.music;
  bgMusic.play();

  levelMenu.classList.add("hidden");
  menu.classList.add("hidden");
  pauseMenu.classList.add("hidden");
  canvas.style.display = "block";
  hud.classList.remove("hidden");

  gameRunning = true;
  paused = false;
  levelStartTime = performance.now();
  scrollX = 0;

  update();
}

// ---------------
// Boutons menu
document.getElementById("playBtn").addEventListener("click", showLevelMenu);
backBtn.addEventListener("click", () => {
  levelMenu.classList.add("hidden");
  menu.classList.remove("hidden");
});
resumeBtn.addEventListener("click", togglePause);
quitBtn.addEventListener("click", () => {
  gameRunning = false;
  paused = false;
  bgMusic.pause();
  pauseMenu.classList.add("hidden");
  hud.classList.add("hidden");
  canvas.style.display = "none";
  menu.classList.remove("hidden");
});

// ---------------
// Resize canvas adaptatif
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
