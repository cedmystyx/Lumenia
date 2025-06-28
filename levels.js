export function getLevels() {
  return [
    {
      name: "Stereo Madness",
      speed: 6,
      obstacles: [
        { type: "classic", x: 300, width: 30, height: 30 },
        { type: "classic", x: 450, width: 30, height: 30 },
        { type: "spike", x: 600, size: 30 },
        { type: "classic", x: 750, width: 30, height: 30 },
        { type: "classic", x: 900, width: 30, height: 30 },
      ],
    },
    {
      name: "Back on Track",
      speed: 7,
      obstacles: [
        { type: "classic", x: 250, width: 30, height: 30 },
        { type: "movingPlatform", x: 400, width: 80, height: 15, range: 100, axis: "vertical" },
        { type: "spike", x: 600, size: 30 },
        { type: "classic", x: 750, width: 30, height: 30 },
        { type: "movingPlatform", x: 900, width: 60, height: 15, range: 120, axis: "horizontal" },
      ],
    },
    {
      name: "Polargeist",
      speed: 8,
      obstacles: [
        { type: "spike", x: 200, size: 30 },
        { type: "classic", x: 350, width: 30, height: 30 },
        { type: "movingPlatformSinus", x: 500, width: 70, height: 15, amplitude: 40, frequency: 0.025 },
        { type: "spike", x: 700, size: 30 },
        { type: "classic", x: 850, width: 30, height: 30 },
      ],
    },
    {
      name: "Dry Out",
      speed: 9,
      obstacles: [
        { type: "classic", x: 300, width: 30, height: 30 },
        { type: "movingPlatform", x: 450, width: 80, height: 15, range: 120, axis: "horizontal" },
        { type: "spike", x: 650, size: 30 },
        { type: "classic", x: 800, width: 30, height: 30 },
        { type: "movingPlatform", x: 1000, width: 60, height: 15, range: 90, axis: "vertical" },
      ],
    },
    {
      name: "Base After Base",
      speed: 10,
      obstacles: [
        { type: "spike", x: 250, size: 30 },
        { type: "classic", x: 400, width: 30, height: 30 },
        { type: "movingPlatformSinus", x: 550, width: 70, height: 15, amplitude: 35, frequency: 0.03 },
        { type: "spike", x: 700, size: 30 },
        { type: "classic", x: 850, width: 30, height: 30 },
      ],
    },
    {
      name: "Can't Let Go",
      speed: 11,
      obstacles: [
        { type: "classic", x: 300, width: 30, height: 30 },
        { type: "movingPlatform", x: 450, width: 80, height: 15, range: 130, axis: "vertical" },
        { type: "spike", x: 600, size: 30 },
        { type: "classic", x: 750, width: 30, height: 30 },
        { type: "movingPlatform", x: 900, width: 60, height: 15, range: 110, axis: "horizontal" },
      ],
    },
    {
      name: "Jumping Factory",
      speed: 12,
      obstacles: [
        { type: "spike", x: 220, size: 30 },
        { type: "classic", x: 370, width: 30, height: 30 },
        { type: "movingPlatformSinus", x: 520, width: 70, height: 15, amplitude: 45, frequency: 0.02 },
        { type: "spike", x: 740, size: 30 },
        { type: "classic", x: 880, width: 30, height: 30 },
      ],
    },
    {
      name: "Time Machine",
      speed: 13,
      obstacles: [
        { type: "classic", x: 280, width: 30, height: 30 },
        { type: "movingPlatform", x: 430, width: 80, height: 15, range: 100, axis: "horizontal" },
        { type: "spike", x: 620, size: 30 },
        { type: "classic", x: 760, width: 30, height: 30 },
        { type: "movingPlatform", x: 900, width: 60, height: 15, range: 140, axis: "vertical" },
      ],
    },
    {
      name: "Cycles",
      speed: 14,
      obstacles: [
        { type: "spike", x: 240, size: 30 },
        { type: "classic", x: 390, width: 30, height: 30 },
        { type: "movingPlatformSinus", x: 540, width: 70, height: 15, amplitude: 50, frequency: 0.03 },
        { type: "spike", x: 780, size: 30 },
        { type: "classic", x: 920, width: 30, height: 30 },
      ],
    },
    {
      name: "xStep",
      speed: 15,
      obstacles: [
        { type: "classic", x: 320, width: 30, height: 30 },
        { type: "movingPlatform", x: 470, width: 80, height: 15, range: 130, axis: "vertical" },
        { type: "spike", x: 630, size: 30 },
        { type: "classic", x: 770, width: 30, height: 30 },
        { type: "movingPlatform", x: 920, width: 60, height: 15, range: 100, axis: "horizontal" },
      ],
    },
  ];
}
