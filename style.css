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

let gravity = 1.3;
let ground = canvas.height - 100;

let score = 0;
let life = 3;
let currentLevel = 0;
let gameRunning = false;
let paused = false;

let scrollSpeed = 3; // Vitesse horizontale du défilement, à adapter par niveau

let player = {};
let platforms = [];
let enemies = [];
let bullets = [];
let clouds = [];

const levels = [
  // Exemple niveau (simplifié, tu peux ajouter jusqu'à 10)
  {
    name: "Zephyros Doux",
    music: "assets/sounds/music1.mp3",
    scrollSpeed: 3,
    durationSec: 210, // ~3.5 minutes
    platforms: [
      { x: 300, y: ground - 80, w: 200, h: 20 },
      { x: 650, y: ground - 120, w: 150, h: 20 },
      { x: 900, y: ground - 100, w: 200, h: 20 },
      { x: 1200, y: ground - 130, w: 150, h: 20 }
    ],
    enemies: [
      { x: 700, y: ground - 50, w: 40, h: 40 },
      { x: 1100, y: ground - 50, w: 40, h: 40 }
    ]
  },
  {
    name: "Brise Légère",
    music: "assets/sounds/music2.mp3",
    scrollSpeed: 3.5,
    durationSec: 240,
    platforms: [
      { x: 250, y: ground - 100, w: 160, h: 20 },
      { x: 520, y: ground - 140, w: 180, h: 20 },
      { x: 800, y: ground - 110, w: 220, h: 20 },
      { x: 1150, y: ground - 150, w: 180, h: 20 }
    ],
    enemies: [
      { x: 600, y: ground - 50, w: 40, h: 40 },
      { x: 1000, y: ground - 50, w: 40, h: 40 },
      { x: 1300, y: ground - 50, w: 40, h: 40 }
    ]
  },
  // Ajoute ici les autres niveaux (3 à 10) avec difficulté croissante...
];

// Player initialisation
function initPlayer() {
  player = {
    x: 100,
    y: ground - 50,
    width: 50,
    height: 50,
    color: "deepskyblue",
    dy: 0,
    jumping: false,
    onGround: true
  };
  bullets = [];
}

// Nuages (pour ambiance)
function initClouds() {
  clouds = Array.from({ length: 12 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * 150,
    w: 120 + Math.random() * 100,
    h: 50,
    dx: 0.3 + Math.random() * 0.3
  }));
}

// Variables pour défilement et durée
let levelLengthPx = 0;
let levelStartTime = 0;

// Créer plateformes/enemies décalés pour simuler défilement
function setupLevel(level) {
  scrollSpeed = level.scrollSpeed;
  platforms = JSON.parse(JSON.stringify(level.platforms));
  enemies = JSON.parse(JSON.stringify(level.enemies));
  levelLengthPx = (scrollSpeed * level.durationSec) + canvas.width; // longueur totale du niveau
  levelStartTime = performance.now();
}

// Gérer le menu sélection niveau
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
  let lvl = levels[levelIndex];

  bgMusic.src = lvl.music;
  bgMusic.play();

  score = 0;
  life = 3;
  scoreEl.textContent = "Score: 0";
  lifeEl.textContent = "Vie: " + "♥".repeat(life);

  initPlayer();
  initClouds();
  setupLevel(lvl);

  levelMenu.classList.add("hidden");
  menu.classList.add("hidden");
  pauseMenu.classList.add("hidden");
  canvas.style.display = "block";
  hud.classList.remove("hidden");
  gameRunning = true;
  paused = false;
  update();
}

// Gestion du saut
function handleJump() {
  if (player.jumping) {
    player.dy += gravity;
    player.y += player.dy;

    if (player.y >= ground - player.height) {
      player.y = ground - player.height;
      player.jumping = false;
      player.dy = 0;
      player.onGround = true;
    }
  }
}

// Gestion des collisions simples plateformes (se pose dessus)
function checkPlatformCollision() {
  player.onGround = false;
  for (let plat of platforms) {
    // Collision horizontale
    if (
      player.x + player.width > plat.x &&
      player.x < plat.x + plat.w
    ) {
      // Collision verticale (atterrissage)
      if (
        player.y + player.height <= plat.y + 10 &&
        player.y + player.height + player.dy >= plat.y
      ) {
        player.y = plat.y - player.height;
        player.dy = 0;
        player.jumping = false;
        player.onGround = true;
      }
    }
  }
}

// Mise à jour jeu
function update(time) {
  if (!gameRunning || paused) {
    requestAnimationFrame(update);
    return;
  }

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Affiche nuages (défilent lentement)
  for (let c of clouds) {
    c.x -= c.dx;
    if (c.x + c.w < 0) c.x = canvas.width + Math.random() * 200;
    ctx.fillStyle = "#ffffffbb";
    ctx.fillRect(c.x, c.y, c.w, c.h);
  }

  // Avance automatique du player horizontalement (fixed x)
  player.x = 100;

  // On décale tout le niveau vers la gauche (scroll horizontal)
  let elapsed = (performance.now() - levelStartTime) / 1000;
  let scrollX = scrollSpeed * elapsed;

  // Dessine sol
  ctx.fillStyle = "#9fc9f3";
  ctx.fillRect(0, ground, canvas.width, canvas.height - ground);

  // Dessine plateformes (avec défilement)
  ctx.fillStyle = "#ffffffcc";
  platforms.forEach(p => {
    let px = p.x - scrollX;
    if (px + p.w > 0 && px < canvas.width) {
      ctx.fillRect(px, p.y, p.w, p.h);
    }
  });

  // Dessine ennemis (avec défilement)
  ctx.fillStyle = "crimson";
  enemies.forEach(e => {
    let ex = e.x - scrollX;
    if (ex + e.w > 0 && ex < canvas.width) {
      ctx.fillRect(ex, e.y, e.w, e.h);
    }
  });

  // Mise à jour saut
  handleJump();

  // Check collisions plateformes
  checkPlatformCollision();

  // Dessine player (fixe horizontal, variable vertical)
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Affiche score et vie
  scoreEl.textContent = "Score: " + score;
  lifeEl.textContent = "Vie: " + "♥".repeat(life);

  // Vérifie fin niveau
  if (scrollX >= levelLengthPx) {
    // Fin de niveau
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

// Saut au clavier (barre espace)
window.addEventListener("keydown", e => {
  if (!gameRunning) return;

  if (e.code === "Space") {
    if (!player.jumping && player.onGround) {
      player.jumping = true;
      player.dy = -18;
      player.onGround = false;
    }
  } else if (e.code === "KeyP") {
    // Pause / Unpause
    if (gameRunning) togglePause();
  }
});

// Gestion du menu pause
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

document.getElementById("playBtn").addEventListener("click", showLevelMenu);
backBtn.addEventListener("click", () => {
  levelMenu.classList.add("hidden");
  menu.classList.remove("hidden");
});
resumeBtn.addEventListener("click", togglePause);
quitBtn.addEventListener("click", () => {
  gameRunning = false;
  bgMusic.pause();
  pauseMenu.classList.add("hidden");
  hud.classList.add("hidden");
  canvas.style.display = "none";
  menu.classList.remove("hidden");
});
