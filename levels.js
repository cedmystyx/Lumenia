export function getLevels() {
  return [
    {
      name: "Niveau 1 - Facile",
      speed: 5,
      obstacles: [
        { type: "classic", x: 400, width: 30, height: 30 },
        { type: "classic", x: 600, width: 30, height: 30 },
        { type: "classic", x: 800, width: 30, height: 30 }
      ]
    },
    {
      name: "Niveau 2 - Moyen",
      speed: 6,
      obstacles: [
        { type: "classic", x: 300, width: 30, height: 30 },
        { type: "spike", x: 450, size: 30 },
        { type: "movingPlatform", x: 600, width: 60, height: 15, range: 120, axis: "vertical" },
        { type: "classic", x: 800, width: 30, height: 30 }
      ]
    },
    {
      name: "Niveau 3 - Difficile",
      speed: 7,
      obstacles: [
        { type: "spike", x: 350, size: 30 },
        { type: "movingPlatform", x: 500, width: 80, height: 15, range: 150, axis: "horizontal" },
        { type: "movingPlatformSinus", x: 700, width: 70, height: 15, amplitude: 40, frequency: 0.02 },
        { type: "spike", x: 900, size: 30 },
        { type: "classic", x: 1100, width: 30, height: 30 }
      ]
    }
  ];
}
