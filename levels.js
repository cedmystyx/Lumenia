export function getLevels() {
  return [
    {
      name: "Stereo Madness",
      speed: 6,
      obstacles: [
        { type: "classic", x: 200, width: 60, height: 30 },
        { type: "spike", x: 400, size: 30 },
        { type: "classic", x: 600, width: 30, height: 30 },
        { type: "spike", x: 800, size: 30 },
        { type: "spike", x: 830, size: 30 },
        { type: "movingPlatform", x: 1000, width: 100, height: 15, range: 80, axis: "horizontal" },
        { type: "spike", x: 1200, size: 30 },
        { type: "classic", x: 1400, width: 60, height: 30 },
        { type: "spike", x: 1600, size: 30 },
        { type: "movingPlatformSinus", x: 1800, width: 100, height: 15, amplitude: 30, frequency: 0.02 },
        { type: "spike", x: 2000, size: 30 },
        { type: "classic", x: 2200, width: 30, height: 30 },
        { type: "spike", x: 2400, size: 30 },
        { type: "movingPlatform", x: 2600, width: 100, height: 15, range: 60, axis: "vertical" },
        { type: "classic", x: 2800, width: 60, height: 30 },
        { type: "spike", x: 3000, size: 30 },
        { type: "spike", x: 3030, size: 30 },
        { type: "classic", x: 3200, width: 60, height: 30 },
        { type: "movingPlatformSinus", x: 3400, width: 80, height: 15, amplitude: 50, frequency: 0.03 },
        { type: "spike", x: 3600, size: 30 },
        { type: "spike", x: 3630, size: 30 },
        { type: "spike", x: 3660, size: 30 },
        { type: "classic", x: 3800, width: 40, height: 30 },
        { type: "spike", x: 4000, size: 30 },
        { type: "goal", x: 4200 }
      ]
    },
    {
      name: "Back on Track",
      speed: 7,
      obstacles: [
        { type: "spike", x: 200, size: 30 },
        { type: "classic", x: 350, width: 60, height: 30 },
        { type: "movingPlatform", x: 550, width: 100, height: 15, range: 100, axis: "vertical" },
        { type: "spike", x: 750, size: 30 },
        { type: "spike", x: 800, size: 30 },
        { type: "classic", x: 1000, width: 30, height: 30 },
        { type: "spike", x: 1200, size: 30 },
        { type: "movingPlatformSinus", x: 1400, width: 90, height: 15, amplitude: 40, frequency: 0.025 },
        { type: "classic", x: 1600, width: 30, height: 30 },
        { type: "spike", x: 1800, size: 30 },
        { type: "classic", x: 2000, width: 40, height: 30 },
        { type: "spike", x: 2200, size: 30 },
        { type: "spike", x: 2230, size: 30 },
        { type: "movingPlatform", x: 2400, width: 100, height: 15, range: 80, axis: "horizontal" },
        { type: "spike", x: 2600, size: 30 },
        { type: "spike", x: 2630, size: 30 },
        { type: "classic", x: 2800, width: 60, height: 30 },
        { type: "spike", x: 3000, size: 30 },
        { type: "classic", x: 3200, width: 60, height: 30 },
        { type: "goal", x: 4300 }
      ]
    },
    {
      name: "Polargeist",
      speed: 8,
      obstacles: [
        { type: "classic", x: 300, width: 30, height: 30 },
        { type: "movingPlatformSinus", x: 600, width: 80, height: 15, amplitude: 50, frequency: 0.03 },
        { type: "spike", x: 900, size: 30 },
        { type: "classic", x: 1100, width: 60, height: 30 },
        { type: "spike", x: 1300, size: 30 },
        { type: "movingPlatform", x: 1500, width: 100, height: 15, range: 100, axis: "vertical" },
        { type: "classic", x: 1700, width: 60, height: 30 },
        { type: "spike", x: 1900, size: 30 },
        { type: "spike", x: 1930, size: 30 },
        { type: "movingPlatform", x: 2100, width: 100, height: 15, range: 120, axis: "horizontal" },
        { type: "spike", x: 2300, size: 30 },
        { type: "spike", x: 2330, size: 30 },
        { type: "classic", x: 2500, width: 60, height: 30 },
        { type: "movingPlatformSinus", x: 2700, width: 80, height: 15, amplitude: 60, frequency: 0.025 },
        { type: "spike", x: 2900, size: 30 },
        { type: "spike", x: 2930, size: 30 },
        { type: "goal", x: 4200 }
      ]
    }
    {
      name: "Dry Out",
      speed: 9,
      obstacles: [
        { type: "spike", x: 300, size: 30 },
        { type: "classic", x: 500, width: 60, height: 30 },
        { type: "movingPlatform", x: 700, width: 100, height: 15, range: 100, axis: "horizontal" },
        { type: "spike", x: 900, size: 30 },
        { type: "classic", x: 1100, width: 40, height: 30 },
        { type: "movingPlatformSinus", x: 1300, width: 90, height: 15, amplitude: 40, frequency: 0.02 },
        { type: "spike", x: 1500, size: 30 },
        { type: "spike", x: 1530, size: 30 },
        { type: "classic", x: 1700, width: 60, height: 30 },
        { type: "spike", x: 1900, size: 30 },
        { type: "movingPlatform", x: 2100, width: 100, height: 15, range: 60, axis: "vertical" },
        { type: "classic", x: 2300, width: 60, height: 30 },
        { type: "spike", x: 2500, size: 30 },
        { type: "spike", x: 2530, size: 30 },
        { type: "goal", x: 3700 }
      ]
    },
    {
      name: "Base After Base",
      speed: 10,
      obstacles: [
        { type: "classic", x: 300, width: 40, height: 30 },
        { type: "spike", x: 500, size: 30 },
        { type: "movingPlatformSinus", x: 700, width: 100, height: 15, amplitude: 60, frequency: 0.025 },
        { type: "spike", x: 1000, size: 30 },
        { type: "classic", x: 1200, width: 50, height: 30 },
        { type: "spike", x: 1400, size: 30 },
        { type: "movingPlatform", x: 1600, width: 120, height: 15, range: 70, axis: "horizontal" },
        { type: "spike", x: 1800, size: 30 },
        { type: "classic", x: 2000, width: 60, height: 30 },
        { type: "spike", x: 2200, size: 30 },
        { type: "goal", x: 3300 }
      ]
    },
    {
      name: "Can't Let Go",
      speed: 11,
      obstacles: [
        { type: "spike", x: 300, size: 30 },
        { type: "movingPlatform", x: 600, width: 100, height: 15, range: 110, axis: "vertical" },
        { type: "spike", x: 800, size: 30 },
        { type: "classic", x: 1000, width: 60, height: 30 },
        { type: "movingPlatform", x: 1200, width: 90, height: 15, range: 100, axis: "horizontal" },
        { type: "spike", x: 1400, size: 30 },
        { type: "classic", x: 1600, width: 40, height: 30 },
        { type: "spike", x: 1800, size: 30 },
        { type: "goal", x: 2900 }
      ]
    },
    {
      name: "Jumper",
      speed: 12,
      obstacles: [
        { type: "movingPlatformSinus", x: 300, width: 90, height: 15, amplitude: 70, frequency: 0.03 },
        { type: "classic", x: 600, width: 30, height: 30 },
        { type: "spike", x: 800, size: 30 },
        { type: "spike", x: 830, size: 30 },
        { type: "classic", x: 1000, width: 60, height: 30 },
        { type: "spike", x: 1200, size: 30 },
        { type: "movingPlatform", x: 1400, width: 80, height: 15, range: 100, axis: "vertical" },
        { type: "spike", x: 1600, size: 30 },
        { type: "goal", x: 2700 }
      ]
    },
    {
      name: "Time Machine",
      speed: 13,
      obstacles: [
        { type: "classic", x: 200, width: 30, height: 30 },
        { type: "spike", x: 400, size: 30 },
        { type: "movingPlatform", x: 600, width: 100, height: 15, range: 100, axis: "horizontal" },
        { type: "spike", x: 800, size: 30 },
        { type: "classic", x: 1000, width: 40, height: 30 },
        { type: "spike", x: 1200, size: 30 },
        { type: "movingPlatformSinus", x: 1400, width: 90, height: 15, amplitude: 80, frequency: 0.02 },
        { type: "goal", x: 2600 }
      ]
    },
    {
      name: "Cycles",
      speed: 14,
      obstacles: [
        { type: "spike", x: 300, size: 30 },
        { type: "classic", x: 500, width: 60, height: 30 },
        { type: "spike", x: 700, size: 30 },
        { type: "movingPlatform", x: 900, width: 80, height: 15, range: 80, axis: "vertical" },
        { type: "classic", x: 1100, width: 30, height: 30 },
        { type: "spike", x: 1300, size: 30 },
        { type: "goal", x: 2300 }
      ]
    },
    {
      name: "xStep",
      speed: 15,
      obstacles: [
        { type: "movingPlatformSinus", x: 200, width: 100, height: 15, amplitude: 60, frequency: 0.02 },
        { type: "spike", x: 500, size: 30 },
        { type: "classic", x: 700, width: 60, height: 30 },
        { type: "spike", x: 900, size: 30 },
        { type: "movingPlatform", x: 1100, width: 90, height: 15, range: 100, axis: "horizontal" },
        { type: "classic", x: 1300, width: 30, height: 30 },
        { type: "goal", x: 2400 }
      ]
    },
    {
      name: "Clutterfunk",
      speed: 16,
      obstacles: [
        { type: "spike", x: 300, size: 30 },
        { type: "movingPlatform", x: 500, width: 100, height: 15, range: 80, axis: "horizontal" },
        { type: "classic", x: 700, width: 60, height: 30 },
        { type: "spike", x: 900, size: 30 },
        { type: "movingPlatformSinus", x: 1100, width: 80, height: 15, amplitude: 70, frequency: 0.03 },
        { type: "classic", x: 1300, width: 40, height: 30 },
        { type: "spike", x: 1500, size: 30 },
        { type: "goal", x: 2600 }
      ]
    }
  ];
}
