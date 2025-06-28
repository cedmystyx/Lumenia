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

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gravity = 1.2;
const groundY = canvas.height - 80;

let score = 0;
let life = 3;
let gameRunning = false;
let paused = false;
let scrollX = 0;
let levelLengthPx = 0;
let levelStartTime = 0;
let currentLevel = 0;

class Player {
  constructor() {
    this.width = 40;
    this.height = 40;
    this.x = 100;
    this.y = groundY - this.height;
    this.dy = 0;
    this.jumping = false;
    this.onGround = true;
    this.color = "#22aaff";
  }
  jump() {
    if (this.onGround) {
      this.dy = -18;
      this.jumping = true;
      this.onGround = false;
    }
  }
  update() {
    this.dy += gravity;
    this.y += this.dy;
    if (this.y > groundY - this.height) {
      this.y = groundY - this.height;
      this.dy = 0;
      this.jumping = false;
      this.onGround = true;
    }
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Obstacle {
  constructor(x, w, h) {
    this.x = x;
    this.y = groundY - h;
    this.w = w;
    this.h = h;
    this.color = "#ee4444";
  }
  draw(scrollX) {
    let px = this.x - scrollX;
    if (px + this.w > 0 && px < canvas.width) {
      ctx.fillStyle = this.color;
      ctx.fillRect(px, this.y, this.w, this.h);
    }
  }
  collide(player) {
    let px = this.x - scrollX;
    return (
      player.x < px + this.w &&
      player.x + player.width > px &&
      player.y < this.y + this.h &&
      player.y + player.height > this.y
    );
  }
}

// On génère 10 niveaux avec difficulté croissante
const levels = [];

for (let i = 1; i <= 10; i++) {
  let speed = 2 + i * 0.6; // vitesse de scroll qui augmente
  let durationSec = 180 + i * 15; // durée ~ 3min+ par niveau
  let name = `Niveau ${i} - Lumenia`;
  let music = `https://cdn.pixabay.com/download/audio/2021/10/15/audio_1a4e9e6d42.mp3?filename=fast-beat-1522.mp3`; // même musique par défaut, tu peux changer

  // Génère obstacles aléatoires mais cohérents
  let obstacles = [];
  let posX = 600;
  while (posX < speed * durationSec * 60) {
    let height = 40 + Math.floor(Math.random() * 80);
    let width = 30 + Math.floor(Math.random() * 20);
    obstacles.push(new Obstacle(posX, width, height));
    posX += 200 + Math.floor(Math.random() * 300) - i * 5; // plus serré et rapide au fil des niveaux
    if (posX < 0) posX = 600;
  }

  levels.push({
    name,
    music,
    scrollSpeed: speed,
    durationSec,
    obstacles
  });
}

let player = new Player();

function resetGame(level) {
  score = 0;
  life = 3;
  scrollX = 0;
  levelLengthPx = levels[level].scrollSpeed * levels[level].durationSec * 60; // assuming 60 FPS
  player = new Player();
  scoreEl.textContent = `Score: ${score}`;
  lifeEl.textContent = `Vie: ${"♥".repeat(life)}`;
  bgMusic.src = levels[level].music;
  bgMusic.play();
}

function update() {
  if (!gameRunning || paused) {
    requestAnimationFrame(update);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background ground
  ctx.fillStyle = "#222244";
  ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);

  // Move scrollX
  let elapsed = (performance.now() - levelStartTime) / 1000;
  scrollX = levels[currentLevel].scrollSpeed * elapsed * 60;

  // Draw obstacles
  levels[currentLevel].obstacles.forEach(obs => obs.draw(scrollX));

  // Update & draw player
  player.update();
  player.draw();

  // Collision check
  for (let obs of levels[currentLevel].obstacles) {
    if (obs.collide(player)) {
      life--;
      lifeEl.textContent = `Vie: ${"♥".repeat(life)}`;
      // Reset player position on hit
      player.y = groundY - player.height;
      player.dy = 0;
      if (life <= 0) {
        alert("Game Over ! Essaie encore !");
        gameRunning = false;
        bgMusic.pause();
        showLevelMenu();
        canvas.style.display = "none";
        hud.classList.add("hidden");
        return;
      }
    }
  }

  // Score update
  score = Math.floor(scrollX / 10);
  scoreEl.textContent = `Score: ${score}`;

  // Level end condition
  if (scrollX >= levelLengthPx) {
    alert("Bravo, niveau terminé !");
    gameRunning = false;
    bgMusic.pause();
    showLevelMenu();
    canvas.style.display = "none";
    hud.classList.add("hidden");
    return;
  }

  requestAnimationFrame(update);
}

// Inputs
window.addEventListener("keydown", e => {
  if (!gameRunning || paused) return;
  if (e.code === "Space" || e.code === "ArrowUp") {
    player.jump();
  } else if (e.code === "KeyP") {
    togglePause();
  }
});

window.addEventListener("click", () => {
  if (gameRunning && !paused) player.jump();
});

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

// Menu handling
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
  resetGame(levelIndex);
  levelMenu.classList.add("hidden");
  menu.classList.add("hidden");
  pauseMenu.classList.add("hidden");
  canvas.style.display = "block";
  hud.classList.remove("hidden");
  gameRunning = true;
  paused = false;
  levelStartTime = performance.now();
  requestAnimationFrame(update);
}

// Buttons event listeners
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

// Responsive canvas
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
