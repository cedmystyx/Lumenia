import { Game } from './game.js';
import { getLevels } from './levels.js';

const menuEl = document.getElementById('menu');
const playBtn = document.getElementById('playBtn');

const levelSelectEl = document.getElementById('levelSelect');
const levelListEl = document.getElementById('levelList');
const backBtn = document.getElementById('backBtn');

const gameUIEl = document.getElementById('gameUI');

let game = null;
let currentLevelIndex = 0;

playBtn.addEventListener('click', () => {
  showLevelSelect();
});

backBtn.addEventListener('click', () => {
  showMenu();
});

function showMenu() {
  menuEl.classList.remove('hidden');
  levelSelectEl.classList.add('hidden');
  gameUIEl.classList.add('hidden');
  if (game) {
    game.stop();
    game = null;
  }
}

function showLevelSelect() {
  menuEl.classList.add('hidden');
  levelSelectEl.classList.remove('hidden');
  gameUIEl.classList.add('hidden');
  levelListEl.innerHTML = '';

  const levels = getLevels();
  levels.forEach((level, i) => {
    const li = document.createElement('li');
    li.textContent = level.name;
    li.addEventListener('click', () => {
      currentLevelIndex = i;
      startGame(i);
    });
    levelListEl.appendChild(li);
  });
}

function startGame(levelIndex) {
  levelSelectEl.classList.add('hidden');
  gameUIEl.classList.remove('hidden');

  game = new Game(levelIndex, () => {
    currentLevelIndex++;
    if (currentLevelIndex >= getLevels().length) {
      alert('Tu as fini tous les niveaux !');
      showMenu();
    } else {
      startGame(currentLevelIndex);
    }
  });
  game.start();
}

showMenu();
