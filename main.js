const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const menu = document.getElementById("menu");
const levelMenu = document.getElementById("levelMenu");
const levelsList = document.getElementById("levelsList");
const backBtn = document.getElementById("backBtn");
const hud = document.getElementById("hud");
const scoreEl = document.getElementById("score");
const lifeEl = document.getElementById("life");
const bgMusic = document.getElementById("bgMusic");
const shootSound = document.getElementById("shootSound");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gravity = 1;
let ground = canvas.height - 100;

let score = 0;
let life = 3;
let currentLevel = 0;
let gameRunning = false;

let clouds = [];
let player = {};
let platforms = [];
let enemies = [];

const levels = [
  {
    name: "Niveau 1 : Zephyros Doux",
    music: "assets/sounds/music1.mp3",
    platforms: [
      { x: 150, y: ground - 80, w: 180, h: 20 },
      { x: 400, y: ground - 130, w: 180, h: 20 },
      { x: 700, y: ground - 110, w: 160, h: 20 }
    ],
    enemies: [
      { x: 600, y: ground - 50, w: 40, h: 40, alive: true }
    ]
  },
  {
    name: "Niveau 2 : Brise Légère",
    music: "assets/sounds/music2.mp3",
    platforms: [
      { x: 120, y: ground - 110, w: 170, h: 20 },
      { x: 370, y: ground - 170, w: 210, h: 20 },
      { x: 650, y: ground - 130, w: 140, h: 20 },
      { x: 880, y: ground - 180, w: 190, h: 20 }
    ],
    enemies: [
      { x: 400, y: ground - 50, w: 40, h: 40, alive: true },
      { x: 800, y: ground - 50, w: 40, h: 40, alive: true }
    ]
  },
  {
    name: "Niveau 3 : Rafale",
    music: "assets/sounds/music3.mp3",
    platforms: [
      { x: 100, y: ground - 140, w: 150, h: 20 },
      { x: 330, y: ground - 190, w: 180, h: 20 },
      { x: 580, y: ground - 170, w: 200, h: 20 },
      { x: 850, y: ground - 210, w: 160, h: 20 }
    ],
    enemies: [
      { x: 500, y: ground - 50, w: 40, h: 40, alive: true },
      { x: 750, y: ground - 50, w: 40, h: 40, alive: true },
      { x: 900, y: ground - 50, w: 40, h: 40, alive: true }
    ]
  },
  {
    name: "Niveau 4 : Vent du Crépuscule",
    music: "assets/sounds/music4.mp3",
    platforms: [
      { x: 100, y: ground - 120, w: 140, h: 20 },
      { x: 300, y: ground - 170, w: 160, h: 20 },
      { x: 540, y: ground - 150, w: 190, h: 20 },
      { x: 810, y: ground - 190, w: 200, h: 20 },
      { x: 1050, y: ground - 160, w: 140, h: 20 }
    ],
    enemies: [
      { x: 400, y: ground - 50, w: 40, h: 40, alive: true },
      { x: 720, y: ground - 50, w: 40, h: 40, alive: true },
      { x: 980, y: ground - 50, w: 40, h: 40, alive: true }
    ]
  },
  {
    name: "Niveau 5 : Tempête Naissante",
    music: "assets/sounds/music5.mp3",
    platforms: [
      { x: 120, y: ground - 160, w: 130, h: 20 },
      { x: 310, y: ground - 210, w: 160, h: 20 },
      { x: 570, y: ground - 190, w: 190, h: 20 },
      { x: 820, y: ground - 230, w: 150, h: 20 },
      { x: 1050, y: ground - 200, w: 130, h: 20 },
      { x: 1280, y: ground - 250, w: 180, h: 20 }
    ],
    enemies: [
      { x: 360, y: ground - 50, w: 40, h: 40, alive: true },
      { x: 630, y: ground - 50, w: 40, h: 40, alive: true },
      { x: 900, y: ground - 50, w: 40, h: 40, alive: true },
      { x: 1200, y: ground - 50, w: 40, h: 40, alive: true }
    ]
  },
  {
    name: "Niveau 6 : Cyclone Ascendant",
    music: "assets/sounds/music6.mp3",
    platforms: [
      { x: 130, y: ground - 180, w: 160, h: 20 },
      { x: 370, y: ground - 230, w: 190, h: 20 },
      { x: 620, y: ground - 210, w: 210, h: 20 },
      { x: 870, y: ground - 250, w: 170, h: 20 },
      { x: 1150, y: ground - 220, w: 140, h: 20 },
      { x: 1370, y: ground - 270, w: 200, h: 20 }
    ],
    enemies: [
      { x: 380, y: ground - 50, w: 40, h: 40, alive: true },
      { x: 660, y: ground - 50, w: 40, h: 40, alive: true },
      { x: 950, y: ground - 50, w: 40, h: 40, alive: true },
      { x: 1220, y: ground - 50, w: 40, h: 40, alive: true },
      { x: 1400, y: ground - 50, w: 40, h: 40, alive: true }
    ]
  },
  {
    name: "Niveau 7 : Ouragan Déchaîné",
    music: "assets/sounds/music7.mp3",
    platforms: [
      { x: 150, y: ground - 200, w: 150, h: 20 },
      { x: 400, y: ground - 250, w: 190, h: 20 },
      { x: 660, y: ground - 230, w: 210, h: 20 },
      { x: 920, y: ground - 270, w: 170, h: 20 },
      { x: 1180, y: ground - 240, w: 150, h: 20 },
      { x: 1400, y: ground - 280, w: 190, h: 20 },
      { x: 1650, y: ground - 250, w: 160, h: 20 }
    ],
    enemies: [
      { x: 350, y: ground - 50, w: 40, h: 40, alive: true },
      { x: 640, y: ground - 50, w: 40, h: 40, alive: true },
      { x: 900, y: ground - 50, w: 40, h: 40, alive: true },
      { x: 1170, y: ground - 50, w: 40, h: 40, alive: true },
      { x: 1450, y: ground - 50, w: 40, h: 40, alive: true },
      { x: 1700, y: ground - 50, w: 40, h: 40, alive: true }
    ]
  },
  {
    name: "Niveau 8 : Fureur des Cieux",
    music: "assets/sounds/music8.mp3",
    platforms: [
      { x: 130, y: ground - 230, w: 160, h: 20 },
      { x: 390, y: ground - 280, w: 200, h: 20 },
      { x: 670, y: ground - 260, w: 220, h: 20 },
      { x: 930, y: ground - 300, w: 190, h: 20 },
      { x: 1210, y: ground - 270, w: 160, h: 20 },
      { x: 1460, y: ground - 320, w: 180, h: 20 },
      { x: 1700, y: ground - 290, w: 170, h: 20 }
    ],
    enemies: [
      { x: 370, y: ground - 50, w: 40, h: 40, alive: true },
      { x: 660, y: ground - 50, w: 40, h: 40, alive: true },
      { x: 940, y: ground - 50, w: 40, h: 40, alive: true },
      { x: 1200, y: ground - 50, w: 40, h: 40, alive: true },
      { x: 1470, y: ground - 50, w: 40, h: 40, alive: true },
      { x: 1700, y: ground - 50, w: 40, h: 40, alive: true },
      { x: 1950, y: ground - 50, w: 40, h: 40, alive: true }
    ]
  },
  {
    name: "Niveau 9 : Vent Apocalyptique",
    music: "assets/sounds/music9.mp3",
    platforms: [
      { x: 120, y: ground - 260, w: 140, h: 20 },
      { x: 350, y: ground - 310, w: 190, h: 20 },
      { x: 620, y: ground - 290, w: 210, h: 20 },
      { x: 890, y: ground - 330, w: 170, h: 20 },
      { x: 1160, y: ground - 300, w: 150, h: 20 },
      { x: 1420, y: ground - 350, w: 180, h: 20 },
      { x: 1670, y: ground - 320, w: 160, h: 20 },
      { x: 1900, y: ground - 370, w: 200, h: 20 }
    ],
    enemies: [
      { x: 350, y: ground - 50, w: 40, h: 40, alive: true },
      { x: 630, y: ground - 50, w: 40, h: 40, alive: true },
      { x: 920, y: ground - 50, w: 40, h: 40, alive: true },
      { x: 1190, y: ground - 50, w: 40, h: 40, alive: true },
      { x: 1450, y: ground - 50, w: 40, h: 40, alive: true },
      { x: 1680, y: ground - 50, w: 40, h: 40, alive: true },
      { x: 1920, y: ground - 50, w: 40, h: 40, alive: true },
      { x: 2170, y: ground - 50, w: 40, h: 40, alive: true }
    ]
  },
  {
    name: "Niveau 10 : Zephyros Ultime",
    music: "assets/sounds/music10.mp3",
    platforms: [
      { x: 150, y: ground - 280, w: 160, h: 20 },
      { x: 400, y: ground - 330, w: 180, h: 20 },
      { x: 680, y: ground - 310, w: 210, h: 20 },
      { x: 950, y: ground - 350, w: 180, h: 20 },
      { x: 1220, y: ground - 320, w: 160, h: 20 },
      { x: 1460, y: ground - 370, w: 200, h: 20 },
      { x: 1720, y: ground - 340, w: 170, h: 20 },
      { x: 1950, y: ground - 390, w: 180, h: 20 },
      { x: 2220, y: ground - 360, w: 210, h: 20 }
    ],
    enemies: [
      { x: 400, y: ground - 50, w: 40, h: 40, alive: true },
      { x: 700, y: ground - 50, w: 40, h: 40, alive: true },
      { x: 980, y: ground - 50, w: 40, h: 40, alive: true },
      { x: 1230, y: ground - 50, w: 40, h: 40, alive: true },
      { x: 1470, y: ground - 50, w: 40, h: 40, alive: true },
      { x: 1720, y: ground - 50, w: 40, h: 40, alive: true },
      { x: 1970, y: ground - 50, w: 40, h: 40, alive: true },
      { x: 2200, y: ground - 50, w: 40, h: 40, alive: true },
      { x: 2450, y: ground - 50, w: 40, h: 40, alive: true }
    ]
  }
];

function initPlayer() {
  player = {
    x: 100,
    y: ground,
    width: 50,
    height: 50,
    color: "#5e81ac",
    dy: 0,
    dx: 0,
    speed: 6,
    jumping: false,
    bullets: []
  };
}

function selectLevel(levelIndex) {
  currentLevel = levelIndex;
  const level = levels[levelIndex];

  bgMusic.src = level.music;
  bgMusic.play();

  score = 0;
  life = 3;
  scoreEl.textContent = "Score: 0";
  lifeEl.textContent = "Vie: ♥♥♥";

  clouds = Array.from({ length: 12 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * 200,
    w: 120 + Math.random() * 90,
    h: 50,
    dx: 0.2 + Math.random() * 0.4
  }));

  initPlayer();
  platforms = level.platforms;
  enemies = JSON.parse(JSON.stringify(level.enemies));

  levelMenu.classList.add("hidden");
  canvas.style.display = "block";
  hud.classList.remove("hidden");
  menu.classList.add("hidden");
  gameRunning = true;

  update();
}

function showLevelMenu() {
  menu.classList.add("hidden");
  levelsList.innerHTML = "";
  levels.forEach((lvl, i) => {
    const btn = document.createElement("button");
    btn.textContent = lvl.name;
    btn.onclick = () => selectLevel(i);
    levelsList.appendChild(btn);
  });
  levelMenu.classList.remove("hidden");
}

backBtn.onclick = () => {
  levelMenu.classList.add("hidden");
  menu.classList.remove("hidden");
};

document.getElementById("playBtn").onclick = showLevelMenu;

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
    dx: 12
  });
});

function update() {
  if (!gameRunning) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Clouds
  for (let c of clouds) {
    c.x += c.dx;
    if (c.x > canvas.width) c.x = -c.w;
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.beginPath();
    ctx.ellipse(c.x + c.w / 2, c.y + c.h / 2, c.w / 2, c.h / 2, 0, 0, 2 * Math.PI);
    ctx.fill();
  }

  // Movement
  player.dx = 0;
  if (keys["ArrowRight"]) player.dx = player.speed;
  if (keys["ArrowLeft"]) player.dx = -player.speed;
  if (keys["Space"] && !player.jumping) {
    player.dy = -22;
    player.jumping = true;
  }

  player.x += player.dx;
  player.dy += gravity;
  player.y += player.dy;

  // Ground collision
  if (player.y + player.height >= ground) {
    player.y = ground - player.height;
    player.dy = 0;
    player.jumping = false;
  }

  // Platforms collision
  for (let plat of platforms) {
    if (
      player.x < plat.x + plat.w &&
      player.x + player.width > plat.x &&
      player.y + player.height < plat.y + plat.h &&
      player.y + player.height + player.dy >= plat.y
    ) {
      player.y = plat.y - player.height;
      player.dy = 0;
      player.jumping = false;
    }
  }

  // Bullets move
  for (let b of player.bullets) b.x += b.dx;
  player.bullets = player.bullets.filter(b => b.x < canvas.width);

  // Bullets vs enemies
  for (let e of enemies) {
    for (let b of player.bullets) {
      if (
        e.alive &&
        b.x < e.x + e.w &&
        b.x + b.w > e.x &&
        b.y < e.y + e.h &&
        b.y + b.h > e.y
      ) {
        e.alive = false;
        b.x = canvas.width + 1;
        score += 100;
        scoreEl.textContent = "Score: " + score;
      }
    }
  }

  // Draw ground
  ctx.fillStyle = "#8faedc";
  ctx.fillRect(0, ground, canvas.width, canvas.height - ground);

  // Draw platforms
  ctx.fillStyle = "#d8dee9";
  platforms.forEach(p => ctx.fillRect(p.x, p.y, p.w, p.h));

  // Draw player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Draw bullets
  ctx.fillStyle = "#bf616a";
  player.bullets.forEach(b => ctx.fillRect(b.x, b.y, b.w, b.h));

  // Draw enemies
  ctx.fillStyle = "#d08770";
  enemies.forEach(e => {
    if (e.alive) ctx.fillRect(e.x, e.y, e.w, e.h);
  });

  requestAnimationFrame(update);
}
