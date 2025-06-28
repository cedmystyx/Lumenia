import { Game } from './game.js';
import { getLevels } from './levels.js';

const menu = document.getElementById('menu');
const playBtn = document.getElementById('playBtn');
const levelSelect = document.getElementById('levelSelect');
const levelList = document.getElementById('levelList');
const backBtn = document.getElementById('backBtn');
const gameUI = document.getElementById('gameUI');

let currentGame = null;
let currentLevelIndex = 0;

function showMenu() {
  menu.classList.remove('hidden');
  levelSelect.classList.add('hidden');
  gameUI.classList.add('hidden');
}

function showLevelSelect() {
  menu.classList.add('hidden');
  levelSelect.classList.remove('hidden');
  gameUI.classList.add('hidden');
}

function showGameUI() {
  menu.classList.add('hidden');
  levelSelect.classList.add('hidden');
  gameUI.classList.remove('hidden');
}

// Affiche liste niveaux
function populateLevelList() {
  levelList.innerHTML = '';
  const levels = getLevels();
  levels.forEach((lvl, i) => {
    const li = document.createElement('li');
    li.textContent = `${i + 1} - ${lvl.name}`;
    li.addEventListener('click', () => {
      currentLevelIndex = i;
      startGame(i);
    });
    levelList.appendChild(li);
  });
}

// Démarrer jeu à un niveau
function startGame(levelIndex) {
  showGameUI();

  currentGame = new Game(levelIndex, () => {
    // Fin de niveau : revenir au select
    showLevelSelect();
    currentGame = null;
  });

  currentGame.start();
}

playBtn.addEventListener('click', () => {
  populateLevelList();
  showLevelSelect();
});

backBtn.addEventListener('click', () => {
  showMenu();
});

showMenu();
