// Geometry Dash Clone Avancé - moteur JS complet

(() => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  const levelNameEl = document.getElementById('levelName');
  const messageEl = document.getElementById('message');
  const scoreEl = document.getElementById('score');
  const bgMusic = document.getElementById('bgMusic');

  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;
  const GROUND_Y = HEIGHT - 40;

  // Player class
  class Player {
    constructor() {
      this.width = 30;
      this.height = 30;
      this.x = 50;
      this.y = GROUND_Y - this.height;
      this.vy = 0;
      this.gravity = 1.0;
      this.jumpForce = -17;
      this.onGround = true;
      this.color = '#00ffff';
      this.isDead = false;
    }

    jump() {
      if (this.onGround && !this.isDead) {
        this.vy = this.jumpForce;
        this.onGround = false;
      }
    }

    update() {
      this.vy += this.gravity;
      this.y += this.vy;

      if (this.y + this.height >= GROUND_Y) {
        this.y = GROUND_Y - this.height;
        this.vy = 0;
        this.onGround = true;
      }
    }

    draw(ctx) {
      ctx.fillStyle = this.isDead ? '#880000' : this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);

      // Outline glow
      ctx.strokeStyle = this.isDead ? '#ff0000' : '#00ffff';
      ctx.lineWidth = 3;
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
  }

  // Obstacle class
  class Obstacle {
    constructor(x, width, height, speed) {
      this.x = x;
      this.width = width;
      this.height = height;
      this.y = GROUND_Y - height;
      this.speed = speed;
      this.color = '#ff4444';
    }

    update() {
      this.x -= this.speed;
    }

    draw(ctx) {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.strokeStyle = '#aa0000';
      ctx.lineWidth = 2;
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
  }

  // Levels data
  const levels = [
    {
      name: 'Stereo Madness',
      speed: 5,
      obstacles: [300, 600, 900, 1200],
    },
    {
      name: 'Back On Track',
      speed: 6,
      obstacles: [280, 530, 780, 1030, 1280],
    },
    {
      name: 'Polargeist',
      speed: 7,
      obstacles: [250, 470, 690, 910, 1130, 1350],
    },
    {
      name: 'Dry Out',
      speed: 8,
      obstacles: [220, 430, 640, 850, 1060, 1270, 1480],
    },
  ];

  // Game state
  let player = new Player();
  let obstacles = [];
  let currentLevelIndex = 0;
  let isGameOver = false;
  let isLevelComplete = false;
  let score = 0;

  function initLevel(index) {
    currentLevelIndex = index;
    const level = levels[index];

    player = new Player();
    obstacles = level.obstacles.map(
      x => new Obstacle(x, 30, 30, level.speed)
    );
    isGameOver = false;
    isLevelComplete = false;
    score = 0;

    levelNameEl.textContent = `Niveau ${index + 1} : ${level.name}`;
    messageEl.textContent = '';
    scoreEl.textContent = 'Score: 0';

    // Jouer musique si disponible
    if (bgMusic) {
      bgMusic.pause();
      bgMusic.currentTime = 0;
      bgMusic.play().catch(() => {});
    }
  }

  function rectsCollide(r1, r2) {
    return (
      r1.x < r2.x + r2.width &&
      r1.x + r1.width > r2.x &&
      r1.y < r2.y + r2.height &&
      r1.height + r1.y > r2.y
    );
  }

  function update() {
    if (isGameOver || isLevelComplete) return;

    player.update();

    for (const obs of obstacles) {
      obs.update();

      if (rectsCollide(player, obs)) {
        gameOver();
      }
    }

    // Nettoyer les obstacles hors écran
    obstacles = obstacles.filter(o => o.x + o.width > 0);

    // Score calculé par distance parcourue
    score += 1;
    scoreEl.textContent = `Score: ${score}`;

    if (obstacles.length === 0) {
      levelComplete();
    }
  }

  function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Fond dégradé
    let gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    gradient.addColorStop(0, '#121212');
    gradient.addColorStop(1, '#000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Sol
    ctx.fillStyle = '#333';
    ctx.fillRect(0, GROUND_Y, WIDTH, HEIGHT - GROUND_Y);

    // Dessiner obstacles
    for (const obs of obstacles) {
      obs.draw(ctx);
    }

    // Dessiner joueur
    player.draw(ctx);

    // Messages Game Over / Level Complete
    if (isGameOver) {
      ctx.fillStyle = '#ff4444';
      ctx.font = '36px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over! Appuie sur R pour rejouer', WIDTH / 2, HEIGHT / 2);
    } else if (isLevelComplete) {
      ctx.fillStyle = '#44ff44';
      ctx.font = '36px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Niveau terminé ! Appuie sur N pour suivant', WIDTH / 2, HEIGHT / 2);
    }
  }

  function gameOver() {
    isGameOver = true;
    player.isDead = true;
    messageEl.textContent = 'Game Over ! Appuie sur R pour recommencer.';
    if (bgMusic) bgMusic.pause();
  }

  function levelComplete() {
    isLevelComplete = true;
    messageEl.textContent = 'Bravo ! Niveau terminé. Appuie sur N pour passer au suivant.';
    if (bgMusic) bgMusic.pause();
  }

  // Contrôles clavier et tactile
  window.addEventListener('keydown', e => {
    if ((e.code === 'Space' || e.code === 'ArrowUp') && !isGameOver && !isLevelComplete) {
      player.jump();
    } else if (e.code === 'KeyR' && isGameOver) {
      initLevel(currentLevelIndex);
    } else if (e.code === 'KeyN' && isLevelComplete) {
      currentLevelIndex++;
      if (currentLevelIndex >= levels.length) currentLevelIndex = 0;
      initLevel(currentLevelIndex);
    }
  });

  window.addEventListener('mousedown', () => {
    if (!isGameOver && !isLevelComplete) player.jump();
  });

  window.addEventListener('touchstart', e => {
    e.preventDefault();
    if (!isGameOver && !isLevelComplete) player.jump();
  }, { passive: false });

  // Boucle principale
  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  // Initialisation
  initLevel(currentLevelIndex);
  loop();
})();
