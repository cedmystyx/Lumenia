import { showMenu, setupMenuHandlers } from './ui.js';
import { initLevelData } from './levels.js';
import { Game } from './game.js';

let currentGame = null;

// Initialisation app
function init() {
  initLevelData();
  setupMenuHandlers(onLevelSelected, onExitGame);
  showMenu('start-menu');
}

function onLevelSelected(levelIndex) {
  currentGame = new Game(levelIndex, onGameEnd);
  showMenu('game-section');
  currentGame.start();
}

function onExitGame() {
  if(currentGame) {
    currentGame.stop();
    currentGame = null;
  }
  showMenu('level-select-menu');
}

function onGameEnd() {
  // Optionnel : afficher menu fin, score, replay, etc.
  showMenu('level-select-menu');
}

window.onload = init;
