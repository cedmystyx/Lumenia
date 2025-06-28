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

const levels = [
  // Niveau 1: Stereo Madness (facile)
  {
    name: "Stereo Madness",
    music: "https://cdn.pixabay.com/download/audio/2022/03/21/audio_4a3a9f9362.mp3?filename=video-game-intro-loop-12996.mp3",
    scrollSpeed: 2,
    durationSec: 180,
    obstacles: [
      new Obstacle(400, 50, 50),
      new Obstacle(800, 40, 60),
      new Obstacle(1200, 60, 40),
      new Obstacle(1600, 50, 70),
      new Obstacle(2100, 40, 60),
      new Obstacle(2600, 80, 50),
    ]
  },
  // Niveau 2: Back On Track (un peu plus dur)
  {
    name: "Back On Track",
    music: "https://cdn.pixabay.com/download/audio/2021/10/23/audio_3cc6f5755e.mp3?filename=fast-techno-loop-1505.mp3",
    scrollSpeed: 2.3,
    durationSec: 195,
    obstacles: [
      new Obstacle(350, 50, 60),
      new Obstacle(700, 60, 60),
      new Obstacle(1100, 40, 40),
      new Obstacle(1400, 70, 70),
      new Obstacle(1800, 40, 60),
      new Obstacle(2300, 50, 50),
      new Obstacle(2800, 60, 80),
      new Obstacle(3300, 40, 70),
    ]
  },
  // Niveau 3: Polargeist
  {
    name: "Polargeist",
    music: "https://cdn.pixabay.com/download/audio/2021/10/23/audio_21b48b2850.mp3?filename=techno-beat-1486.mp3",
    scrollSpeed: 2.6,
    durationSec: 210,
    obstacles: [
      new Obstacle(400, 60, 60),
      new Obstacle(800, 70, 40),
      new Obstacle(1150, 40, 70),
      new Obstacle(1500, 50, 50),
      new Obstacle(1900, 60, 60),
      new Obstacle(2400, 80, 50),
      new Obstacle(2800, 60, 70),
      new Obstacle(3300, 50, 70),
      new Obstacle(3700, 40, 60),
    ]
  },
  // Niveau 4: Dry Out
  {
    name: "Dry Out",
    music: "https://cdn.pixabay.com/download/audio/2022/01/21/audio_9a3d24a153.mp3?filename=slow-hip-hop-loop-14399.mp3",
    scrollSpeed: 2.9,
    durationSec: 210,
    obstacles: [
      new Obstacle(350, 60, 50),
      new Obstacle(700, 40, 70),
      new Obstacle(1050, 70, 60),
      new Obstacle(1450, 60, 60),
      new Obstacle(1850, 50, 80),
      new Obstacle(2300, 80, 50),
      new Obstacle(2700, 60, 70),
      new Obstacle(3100, 40, 60),
      new Obstacle(3500, 50, 50),
    ]
  },
  // Niveau 5: Base After Base
  {
    name: "Base After Base",
    music: "https://cdn.pixabay.com/download/audio/2021/09/25/audio_f0220d33de.mp3?filename=fast-happy-electro-11006.mp3",
    scrollSpeed: 3.2,
    durationSec: 225,
    obstacles: [
      new Obstacle(400, 50, 70),
      new Obstacle(850, 60, 60),
      new Obstacle(1300, 40, 70),
      new Obstacle(1700, 80, 50),
      new Obstacle(2150, 70, 70),
      new Obstacle(2600, 60, 60),
      new Obstacle(3000, 50, 80),
      new Obstacle(3400, 70, 60),
      new Obstacle(3800, 40, 70),
    ]
  },
  // Niveau 6: Can't Let Go
  {
    name: "Can't Let Go",
    music: "https://cdn.pixabay.com/download/audio/2022/02/03/audio_7baffc2c8b.mp3?filename=slow-techno-13888.mp3",
    scrollSpeed: 3.5,
    durationSec: 240,
    obstacles: [
      new Obstacle(350, 60, 70),
      new Obstacle(750, 40, 80),
      new Obstacle(1200, 80, 60),
      new Obstacle(1600, 50, 70),
      new Obstacle(2000, 70, 80),
      new Obstacle(2500, 60, 70),
      new Obstacle(2900, 40, 70),
      new Obstacle(3300, 70, 60),
      new Obstacle(3700, 80, 50),
      new Obstacle(4100, 40, 70),
    ]
  },
  // Niveau 7: Jumper
  {
    name: "Jumper",
    music: "https://cdn.pixabay.com/download/audio/2022/02/16/audio_1473ae1f17.mp3?filename=video-game-loop-14170.mp3",
    scrollSpeed: 3.8,
    durationSec: 240,
    obstacles: [
      new Obstacle(400, 70, 60),
      new Obstacle(850, 40, 70),
      new Obstacle(1300, 60, 80),
      new Obstacle(1750, 70, 70),
      new Obstacle(2200, 40, 60),
      new Obstacle(2600, 80, 50),
      new Obstacle(3000, 60, 80),
      new Obstacle(3400, 50, 60),
      new Obstacle(3800, 70, 70),
      new Obstacle(4200, 40, 60),
    ]
  },
  // Niveau 8: Time Machine
  {
    name: "Time Machine",
    music: "https://cdn.pixabay.com/download/audio/2021/10/22/audio_bcaea23309.mp3?filename=dark-techno-loop-1476.mp3",
    scrollSpeed: 4.1,
    durationSec: 255,
    obstacles: [
      new Obstacle(350, 60, 80),
      new Obstacle(750, 40, 70),
      new Obstacle(1200, 70, 60),
      new Obstacle(1650, 50, 70),
      new Obstacle(2100, 80, 50),
      new Obstacle(2550, 70, 70),
      new Obstacle(3000, 40, 60),
      new Obstacle(3450, 50, 70),
      new Obstacle(3900, 60, 60),
      new Obstacle(4350, 80, 50),
    ]
  },
  // Niveau 9: Cycles
  {
    name: "Cycles",
    music: "https://cdn.pixabay.com/download/audio/2021/10/23/audio_bfc524b4e7.mp3?filename=hip-hop-beat-1488.mp3",
    scrollSpeed: 4.4,
    durationSec: 270,
    obstacles: [
      new Obstacle(400, 50, 60),
      new Obstacle(850, 70, 70),
      new Obstacle(1300, 40, 80),
      new Obstacle(1750, 60, 70),
      new Obstacle(2200, 50, 60),
      new Obstacle(2650, 70, 70),
      new Obstacle(3100, 40, 80),
      new Obstacle(3550, 60, 70),
      new Obstacle(4000, 50, 60),
      new Obstacle(4450, 70, 70),
    ]
  },
  // Niveau 10: xStep (dur)
  {
    name: "xStep",
    music: "https://cdn.pixabay.com/download/audio/2021/10/22/audio_c3c7e69f27.mp3?filename=techno-1283.mp3",
    scrollSpeed: 4.7,
    durationSec: 300,
    obstacles: [
      new Obstacle(350, 70, 80),
      new Obstacle(750, 40, 70),
      new Obstacle(1200, 80, 60),
      new Obstacle(1650, 60, 80),
      new Obstacle(2100, 50, 70),
      new Obstacle(2550, 70, 80),
      new Obstacle(3000, 40, 70),
      new Obstacle(3450, 60, 60),
      new Obstacle(3900, 80, 80),
      new Obstacle(4350, 50, 70),
      new Obstacle(4800, 70, 60),
    ]
  }
];

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

  // Draw ground
  ctx.fillStyle = "#29214e";
  ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);

  // Scroll
  scrollX += levels[currentLevel].scrollSpeed;

  // Draw obstacles & check collision
  let collided = false;
  for (let obs of levels[currentLevel].obstacles) {
    obs.draw(scrollX);
    if (obs.collide(player)) collided = true;
  }

  // Update player
  player.update();

  // Collision consequences
  if (collided) {
    life--;
    lifeEl.textContent = `Vie: ${"♥".repeat(life)}`;
    if (life <= 0) {
      alert("Game Over !");
      stopGame();
      return;
    }
    // Knockback player on collision
    player.dy = -10;
    player.y -= 10;
  }

  // Draw player
  player.draw();

  // Update score based on scroll
  score = Math.floor(scrollX / 10);
  scoreEl.textContent = `Score: ${score}`;

  // Check level end
  if (scrollX >= levelLengthPx) {
    alert(`Bravo ! Tu as fini le niveau : ${levels[currentLevel].name}`);
    stopGame();
  }

  requestAnimationFrame(update);
}

function stopGame() {
  gameRunning = false;
  bgMusic.pause();
  hud.classList.add("hidden");
  canvas.style.display = "none";
  menu.style.display = "block";
  levelMenu.classList.add("hidden");
  pauseMenu.classList.add("hidden");
}

function startLevel(level) {
  currentLevel = level;
  resetGame(level);
  gameRunning = true;
  paused = false;
  menu.style.display = "none";
  levelMenu.classList.add("hidden");
  pauseMenu.classList.add("hidden");
  hud.classList.remove("hidden");
  canvas.style.display = "block";
  canvas.focus();
  update();
}

// Event Listeners

document.getElementById("playBtn").addEventListener("click", () => {
  menu.style.display = "none";
  levelMenu.classList.remove("hidden");
  levelsList.innerHTML = "";
  levels.forEach((lvl, i) => {
    const btn = document.createElement("button");
    btn.textContent = `${i + 1}. ${lvl.name}`;
    btn.addEventListener("click", () => startLevel(i));
    levelsList.appendChild(btn);
  });
});

backBtn.addEventListener("click", () => {
  levelMenu.classList.add("hidden");
  menu.style.display = "block";
});

resumeBtn.addEventListener("click", () => {
  paused = false;
  pauseMenu.classList.add("hidden");
});

quitBtn.addEventListener("click", () => {
  stopGame();
});

window.addEventListener("keydown", (e) => {
  if (!gameRunning) return;

  if (e.code === "Space" || e.code === "ArrowUp") {
    e.preventDefault();
    player.jump();
  }

  if (e.code === "Escape") {
    if (!paused) {
      paused = true;
      pauseMenu.classList.remove("hidden");
    } else {
      paused = false;
      pauseMenu.classList.add("hidden");
    }
  }
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
