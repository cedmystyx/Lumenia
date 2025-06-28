const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const levelNameEl = document.getElementById('levelName');
const messageEl = document.getElementById('message');
const scoreEl = document.getElementById('score');

class Particle {
  constructor(x, y, vx, vy, size, color, life) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.size = size;
    this.color = color;
    this.life = life;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.15;
    this.life--;
  }

  draw(ctx) {
    ctx.globalAlpha = Math.max(this.life / 30, 0);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

class Player {
  constructor(game) {
    this.game = game;
    this.width = 30;
    this.height = 30;
    this.x = 50;
    this.y = canvas.height - 40 - this.height;
    this.vy = 0;
    this.gravity = 1.2;
    this.jumpForce = -18;
    this.onGround = true;
    this.isDead = false;
    this.color = '#00ffff';
  }

  jump() {
    if (this.onGround && !this.isDead) {
      this.vy = this.jumpForce;
      this.onGround = false;
      this.game.spawnJumpParticles(this.x + this.width / 2, this.y + this.height);
    }
  }

  update() {
    this.vy += this.gravity;
    this.y += this.vy;

    if (this.y + this.height >= canvas.height - 40) {
      this.y = canvas.height - 40 - this.height;
      this.vy = 0;
      this.onGround = true;
    }
  }

  draw(ctx) {
    ctx.shadowColor = this.isDead ? '#ff0000' : '#00ffff';
    ctx.shadowBlur = 15;
    ctx.fillStyle = this.isDead ? '#880000' : this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.shadowBlur = 0;
    ctx.strokeStyle = this.isDead ? '#ff0000' : '#00ffff';
    ctx.lineWidth = 3;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }
}

class Obstacle {
  constructor(x, width, height, speed) {
    this.x = x;
    this.width = width;
    this.height = height;
    this.y = canvas.height - 40 - height;
    this.speed = speed;
    this.color = '#ff4444';
  }

  update() {
    this.x -= this.speed;
  }

  draw(ctx) {
    ctx.shadowColor = '#aa0000';
    ctx.shadowBlur = 8;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#aa0000';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }
}

class MovingPlatform extends Obstacle {
  constructor(x, width, height, speed, range, axis = 'horizontal') {
    super(x, width, height, speed);
    this.startX = x;
    this.range = range;
    this.axis = axis;
    this.direction = 1;
    this.speedMove = 2;
    this.startY = this.y;
    this.color = '#44bbff';
  }

  update() {
    this.x -= this.speed;

    if (this.axis === 'horizontal') {
      this.startX += this.speedMove * this.direction;
      if (this.startX > this.x + this.range || this.startX < this.x) {
        this.direction *= -1;
      }
      this.x = this.startX;
    } else {
      this.startY += this.speedMove * this.direction;
      if (this.startY > this.y + this.range || this.startY < this.y) {
        this.direction *= -1;
      }
      this.y = this.startY;
    }
  }

  draw(ctx) {
    ctx.shadowColor = '#2299ff';
    ctx.shadowBlur = 12;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#2299ff';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }
}

class Spike extends Obstacle {
  constructor(x, size, speed) {
    super(x, size, size, speed);
    this.color = '#ff0000';
    this.size = size;
    this.y = canvas.height - 40 - size;
  }

  update() {
    this.x -= this.speed;
  }

  draw(ctx) {
    ctx.shadowColor = '#990000';
    ctx.shadowBlur = 10;
    ctx.fillStyle = this.color;
    ctx.strokeStyle = '#660000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y + this.size);
    ctx.lineTo(this.x + this.size / 2, this.y);
    ctx.lineTo(this.x + this.size, this.y + this.size);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
}

export class Game {
  constructor(levelIndex, onGameEnd) {
    this.levelIndex = levelIndex;
    this.onGameEnd = onGameEnd;
    this.levelData = null;

    this.player = new Player(this);
    this.obstacles = [];
    this.particles = [];

    this.isGameOver = false;
    this.isLevelComplete = false;

    this.score = 0;
    this.loopId = null;
  }

  spawnJumpParticles(x, y) {
    for (let i = 0; i < 10; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1;

      this.particles.push(new Particle(
        x,
        y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed * -1,
        2,
        '#00ffff',
        30
      ));
    }
  }

  init(levelData) {
    this.levelData = levelData;
    this.player = new Player(this);
    this.obstacles = [];

    levelData.obstacles.forEach(obsData => {
      switch (obsData.type) {
        case 'movingPlatform':
          this.obstacles.push(new MovingPlatform(
            obsData.x,
            obsData.width || 60,
            obsData.height || 15,
            levelData.speed,
            obsData.range || 100,
            obsData.axis || 'horizontal'
          ));
          break;

        case 'spike':
          this.obstacles.push(new Spike(
            obsData.x,
            obsData.size || 30,
            levelData.speed
          ));
          break;

        default:
          this.obstacles.push(new Obstacle(
            obsData.x,
            obsData.width || 30,
            obsData.height || 30,
            levelData.speed
          ));
      }
    });

    this.particles = [];

    this.isGameOver = false;
    this.isLevelComplete = false;
    this.score = 0;

    levelNameEl.textContent = `Niveau ${this.levelIndex + 1} : ${levelData.name}`;
    messageEl.textContent = '';
    scoreEl.textContent = 'Score: 0';
  }

  start() {
    import('./levels.js').then(({ getLevels }) => {
      this.init(getLevels()[this.levelIndex]);
      this.loop();
      this.setupControls();
    });
  }

  stop() {
    if (this.loopId) {
      cancelAnimationFrame(this.loopId);
      this.loopId = null;
    }
    this.removeControls();
  }

  loop() {
    this.update();
    this.draw();

    if (!this.isGameOver && !this.isLevelComplete) {
      this.loopId = requestAnimationFrame(() => this.loop());
    }
  }

  update() {
    this.player.update();

    for (const obs of this.obstacles) {
      obs.update();

      if (this.checkCollision(this.player, obs)) {
        this.gameOver();
      }
    }

    this.obstacles = this.obstacles.filter(o => o.x + o.width > 0);

    this.particles = this.particles.filter(p => p.life > 0);
    this.particles.forEach(p => p.update());

    this.score++;
    scoreEl.textContent = `Score: ${this.score}`;

    if (this.obstacles.length === 0) {
      this.levelComplete();
    }
  }

  draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fond noir
    ctx.fillStyle = '#121212';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Sol gris foncé
    ctx.fillStyle = '#333';
    ctx.fillRect(0, canvas.height - 40, canvas.width, 40);

    // Obstacles
    for (const obs of this.obstacles) {
      obs.draw(ctx);
    }

    // Particules
    this.particles.forEach(p => p.draw(ctx));

    // Joueur
    this.player.draw(ctx);

    if (this.isGameOver) {
      this.drawCenteredText('Game Over! Appuie sur R pour rejouer', '#ff4444');
    } else if (this.isLevelComplete) {
      this.drawCenteredText('Niveau terminé ! Appuie sur N pour suivant', '#44ff44');
    }
  }

  drawCenteredText(text, color) {
    ctx.fillStyle = color;
    ctx.font = '36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  }

  checkCollision(r1, r2) {
    return (
      r1.x < r2.x + r2.width &&
      r1.x + r1.width > r2.x &&
      r1.y < r2.y + r2.height &&
      r1.height + r1.y > r2.y
    );
  }

  gameOver() {
    this.isGameOver = true;
    this.player.isDead = true;
    messageEl.textContent = 'Game Over ! Appuie sur R pour recommencer.';
  }

  levelComplete() {
    this.isLevelComplete = true;
    messageEl.textContent = 'Bravo ! Niveau terminé. Appuie sur N pour passer au suivant.';
  }

  setupControls() {
    this.keyDownHandler = e => {
      if ((e.code === 'Space' || e.code === 'ArrowUp') && !this.isGameOver && !this.isLevelComplete) {
        this.player.jump();
      } else if (e.code === 'KeyR' && this.isGameOver) {
        this.init(this.levelData);
        this.isGameOver = false;
        this.player.isDead = false;
        this.loop();
        messageEl.textContent = '';
      } else if (e.code === 'KeyN' && this.isLevelComplete) {
        this.stop();
        this.onGameEnd();
      }
    };
    window.addEventListener('keydown', this.keyDownHandler);

    this.mouseDownHandler = () => {
      if (!this.isGameOver && !this.isLevelComplete) this.player.jump();
    };
    window.addEventListener('mousedown', this.mouseDownHandler);

    this.touchStartHandler = e => {
      e.preventDefault();
      if (!this.isGameOver && !this.isLevelComplete) this.player.jump();
    };
    window.addEventListener('touchstart', this.touchStartHandler, { passive: false });
  }

  removeControls() {
    window.removeEventListener('keydown', this.keyDownHandler);
    window.removeEventListener('mousedown', this.mouseDownHandler);
    window.removeEventListener('touchstart', this.touchStartHandler);
  }
}
