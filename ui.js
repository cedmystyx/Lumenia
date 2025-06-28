import { getLevels } from './levels.js';

const menus = document.querySelectorAll('.menu');
const levelListEl = document.getElementById('level-list');

export function showMenu(id) {
  menus.forEach(menu => menu.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

export function setupMenuHandlers(onLevelSelected, onExitGame) {
  document.getElementById('start-button').onclick = () => {
    populateLevelList(onLevelSelected);
    showMenu('level-select-menu');
  };

  document.getElementById('back-to-start').onclick = () => {
    showMenu('start-menu');
  };

  document.getElementById('exit-game').onclick = () => {
    onExitGame();
  };
}

function populateLevelList(onLevelSelected) {
  levelListEl.innerHTML = '';
  getLevels().forEach((level, idx) => {
    const btn = document.createElement('button');
    btn.textContent = level.name;
    btn.classList.add('level-button');
    btn.onclick = () => onLevelSelected(idx);
    levelListEl.appendChild(btn);
  });
}
