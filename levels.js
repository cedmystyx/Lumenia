let levels = [];

export function initLevelData() {
  levels = [
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
}

export function getLevels() {
  return levels;
}
