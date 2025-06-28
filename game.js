const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const levelNameEl = document.getElementById('levelName');
const messageEl = document.getElementById('message');
const scoreEl = document.getElementById('score');

class Player {
  constructor() {
    this.width = 30;
    this.height = 30;
    this.x = 50;
    this.y = canvas.height - 40 - this.height;
    this.vy = 0;
    this.gravity = 1;
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
    if (this.y + this.height >= canvas.height - 40) {
      this.y = canvas.height - 40 - this.height;
      this.vy = 0;
      this.onGround = true;
    }
  }
  draw(ctx) {
    ctx.fillStyle = this.isDead ? '#880000' : this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
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
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeStyle = '#aa0000';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }
}

export class Game {
  constructor(levelIndex, onGameEnd) {
    this.levelIndex = levelIndex;
    this.onGameEnd = onGameEnd;
    this.levelData = null;
    this.player = new Player();
    this.obstacles = [];
    this.isGameOver = false;
    this.isLevelComplete = false;
    this.score = 0;
    this.loopId = null;
  }

  init(levelData) {
    this.levelData = levelData;
    this.player = new Player();
    this.obstacles = levelData.obstacles.map(
      x => new Obstacle(x, 30, 30, levelData.speed)
    );
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
    this.score++;
    scoreEl.textContent = `Score: ${this.score}`;

    if (this.obstacles.length === 0) {
      this.levelComplete();
    }
  }

  draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#121212';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw ground
    ctx.fillStyle = '#333';
    ctx.fillRect(0, canvas.height - 40, canvas.width, 40);

    // Draw obstacles
    for (const obs of this.obstacles) {
      obs.draw(ctx);
    }

    // Draw player
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
