const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const levelNameEl = document.getElementById('levelName');
const messageEl = document.getElementById('message');
const scoreEl = document.getElementById('score');
const volumeRange = document.getElementById('volumeRange');

class AudioManager {
  constructor() {
    this.volume = 0.5;
    this.sounds = {};

    this.loadSound('jump', 'sounds/jump.wav');
    this.loadSound('death', 'sounds/death.wav');
    this.loadSound('levelComplete', 'sounds/levelComplete.wav');

    volumeRange.addEventListener('input', e => {
      this.volume = parseFloat(e.target.value);
    });
  }

  loadSound(name, src) {
    const audio = new Audio(src);
    audio.volume = this.volume;
    this.sounds[name] = audio;
  }

  play(name) {
    if (!this.sounds[name]) return;
    const snd = this.sounds[name].cloneNode();
    snd.volume = this.volume;
    snd.play();
  }
}

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
    this.gravity = 1.3;
    this.jumpForce = -20;
    this.onGround = true;
    this.isDead = false;
    this.color = '#00ffff';
  }

  jump() {
    if (this.onGround && !this.isDead) {
      this.vy = this.jumpForce;
      this.onGround = false;
      this.game.audio.play('jump');
      this.game.spawnJumpParticles(this.x + this.width / 2, this.y + this.height);
    }
  }

  update() {
    this.vy += this.gravity;
    this.y += this.vy;

    if (this.y + this.height >= canvas.height - 40) {
      if (!this.onGround && !this.isDead) {
        this.game.spawnLandParticles(this.x + this.width / 2, canvas.height - 40);
        this.game.audio.play('jump');
      }
      this.y = canvas.height - 40 - this.height;
      this.vy = 0;
      this.onGround = true;
    }
  }

  draw(ctx) {
    const glowIntensity = 10 + 5 * Math.sin(Date.now() / 200);
    ctx.shadowColor = this.isDead ? '#ff0000' : '#00ffff';
    ctx.shadowBlur = glowIntensity;
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
    const glowIntensity = 6 + 3 * Math.sin(Date.now() / 150);
    ctx.shadowColor = '#aa0000';
    ctx.shadowBlur = glowIntensity;
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
    const glowIntensity = 8 + 5 * Math.sin(Date.now() / 120);
    ctx.shadowColor = '#2299ff';
    ctx.shadowBlur = glowIntensity;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#2299ff';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }
}

class MovingPlatformSinus extends MovingPlatform {
  constructor(x, width, height, speed, amplitude = 30, frequency = 0.03) {
    super(x, width, height, speed, 0, 'horizontal');
    this.amplitude = amplitude;
    this.frequency = frequency;
    this.baseY = this.y;
    this.frame = 0;
  }

  update() {
    this.x -= this.speed;
    this.frame++;

    this.y = this.baseY + this.amplitude * Math.sin(this.frame * this.frequency);
  }
}

class Spike extends Obstacle {
  constructor(x, size, speed) {
    super(x, size, size, speed);
    this.color = '#ff0000';
  }

  draw(ctx) {
    const glowIntensity = 10 + 4 * Math.sin(Date.now() / 100);
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur = glowIntensity;
    ctx.fillStyle = this.color;

    ctx.beginPath();
    ctx.moveTo(this.x, this.y + this.height);
    ctx.lineTo(this.x + this.width / 2, this.y);
    ctx.lineTo(this.x + this.width, this.y + this.height);
    ctx.closePath();
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#aa0000';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

export class Game {
  constructor(levelIndex, onGameEnd) {
    this.levelIndex = levelIndex;
    this.onGameEnd = onGameEnd;
    this.levelData = null;
    this.player = null;
    this.obstacles = [];
    this.isGameOver = false;
    this.isLevelComplete = false;
    this.score = 0;
    this.loopId = null;
    this.audio = new AudioManager();
    this.particles = [];
    this.screenShakeDuration = 0;
    this.screenShakeIntensity = 0;
  }

  init(levelData) {
    this.levelData = levelData;
    this.player = new Player(this);
    this.obstacles = levelData.obstacles.map(obs => {
      switch (obs.type) {
        case 'classic':
          return new Obstacle(obs.x, obs.width, obs.height, levelData.speed);
        case 'spike':
          return new Spike(obs.x, obs.size, levelData.speed);
        case 'movingPlatform':
          return new MovingPlatform(obs.x, obs.width, obs.height, levelData.speed, obs.range, obs.axis);
        case 'movingPlatformSinus':
          return new MovingPlatformSinus(obs.x, obs.width, obs.height, levelData.speed, obs.amplitude, obs.frequency);
        default:
          return new Obstacle(obs.x, obs.width, obs.height, levelData.speed);
      }
    });
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
    this.obstacles.forEach(obs => obs.update());

    // Collision detection
    for (const obs of this.obstacles) {
      if (this.checkCollision(this.player, obs)) {
        this.gameOver();
      }
    }

    // Remove obstacles passed
    this.obstacles = this.obstacles.filter(o => o.x + o.width > 0);

    // Update particles
    this.particles.forEach(p => p.update());
    this.particles = this.particles.filter(p => p.life > 0);

    // Update score
    this.score++;
    scoreEl.textContent = `Score: ${this.score}`;

    // Screen shake decrement
    if (this.screenShakeDuration > 0) {
      this.screenShakeDuration--;
    }

    // Level complete check
    if (this.obstacles.length === 0) {
      this.levelComplete();
    }
  }

  draw() {
    // Screen shake offset
    let shakeX = 0, shakeY = 0;
    if (this.screenShakeDuration > 0) {
      shakeX = (Math.random() - 0.5) * this.screenShakeIntensity;
      shakeY = (Math.random() - 0.5) * this.screenShakeIntensity;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(shakeX, shakeY);

    // Background
    ctx.fillStyle = '#121212';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Ground
    ctx.fillStyle = '#333';
    ctx.fillRect(0, canvas.height - 40, canvas.width, 40);

    // Obstacles
    this.obstacles.forEach(obs => obs.draw(ctx));

    // Player
    this.player.draw(ctx);

    // Particles
    this.particles.forEach(p => p.draw(ctx));

    ctx.restore();

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
    if (this.isGameOver) return;
    this.isGameOver = true;
    this.player.isDead = true;
    messageEl.textContent = 'Game Over ! Appuie sur R pour recommencer.';
    this.audio.play('death');
    this.screenShakeDuration = 20;
    this.screenShakeIntensity = 10;
  }

  levelComplete() {
    this.isLevelComplete = true;
    messageEl.textContent = 'Bravo ! Niveau terminé. Appuie sur N pour passer au suivant.';
    this.audio.play('levelComplete');
  }

  spawnJumpParticles(x, y) {
    for (let i = 0; i < 8; i++) {
      this.particles.push(new Particle(
        x,
        y,
        (Math.random() - 0.5) * 4,
        Math.random() * -3 - 1,
        3,
        '#00ffff',
        30
      ));
    }
  }

  spawnLandParticles(x, y) {
    for (let i = 0; i < 12; i++) {
      this.particles.push(new Particle(
        x,
        y,
        (Math.random() - 0.5) * 5,
        Math.random() * -1,
        4,
        '#00bbbb',
        35
      ));
    }
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
