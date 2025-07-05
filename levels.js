export function getLevels() {
  return [
    // Stereo Madness (déjà défini plus haut)
    {
      name: "Stereo Madness",
      speed: 6,
      obstacles: [
        { type: "classic", x: 200, width: 30, height: 30 },
        { type: "spike", x: 350, size: 30 },
        { type: "spike", x: 400, size: 30 },
        { type: "classic", x: 500, width: 30, height: 30 },
        { type: "classic", x: 550, width: 30, height: 30 },
        { type: "spike", x: 600, size: 30 },
        { type: "classic", x: 700, width: 60, height: 30 },
        { type: "spike", x: 780, size: 30 },
        { type: "spike", x: 810, size: 30 },
        { type: "goal", x: 4200 },
      ],
    },
    {
      name: "Back on Track",
      speed: 7,
      obstacles: Array.from({length: 50}, (_, i) => ({
        type: i % 4 === 0 ? "spike" : i % 5 === 0 ? "movingPlatform" : "classic",
        x: 200 + i * 80,
        ...(i % 4 === 0 ? { size: 30 } : i % 5 === 0 ? { width: 100, height: 15, range: 120, axis: i % 2 === 0 ? "horizontal" : "vertical" } : { width: 30, height: 30 })
      })).concat({ type: "goal", x: 4300 })
    },
    {
      name: "Polargeist",
      speed: 8,
      obstacles: Array.from({length: 55}, (_, i) => ({
        type: i % 6 === 0 ? "movingPlatformSinus" : i % 5 === 0 ? "spike" : "classic",
        x: 250 + i * 75,
        ...(i % 6 === 0 ? { width: 80, height: 15, amplitude: 40, frequency: 0.02 } : i % 5 === 0 ? { size: 30 } : { width: 30, height: 30 })
      })).concat({ type: "goal", x: 4400 })
    },
    {
      name: "Dry Out",
      speed: 9,
      obstacles: Array.from({length: 60}, (_, i) => ({
        type: i % 7 === 0 ? "movingPlatform" : i % 4 === 0 ? "spike" : "classic",
        x: 300 + i * 70,
        ...(i % 7 === 0 ? { width: 100, height: 15, range: 100, axis: i % 2 === 0 ? "vertical" : "horizontal" } : i % 4 === 0 ? { size: 30 } : { width: 30, height: 30 })
      })).concat({ type: "goal", x: 4500 })
    },
    {
      name: "Base After Base",
      speed: 10,
      obstacles: Array.from({length: 65}, (_, i) => ({
        type: i % 3 === 0 ? "spike" : i % 5 === 0 ? "movingPlatformSinus" : "classic",
        x: 200 + i * 65,
        ...(i % 3 === 0 ? { size: 30 } : i % 5 === 0 ? { width: 70, height: 15, amplitude: 35, frequency: 0.03 } : { width: 30, height: 30 })
      })).concat({ type: "goal", x: 4600 })
    },
    {
      name: "Can't Let Go",
      speed: 11,
      obstacles: Array.from({length: 70}, (_, i) => ({
        type: i % 6 === 0 ? "movingPlatform" : i % 2 === 0 ? "spike" : "classic",
        x: 300 + i * 60,
        ...(i % 6 === 0 ? { width: 90, height: 15, range: 100, axis: i % 3 === 0 ? "vertical" : "horizontal" } : i % 2 === 0 ? { size: 30 } : { width: 30, height: 30 })
      })).concat({ type: "goal", x: 4700 })
    },
    {
      name: "Jumping Factory",
      speed: 12,
      obstacles: Array.from({length: 75}, (_, i) => ({
        type: i % 5 === 0 ? "movingPlatformSinus" : i % 4 === 0 ? "spike" : "classic",
        x: 250 + i * 58,
        ...(i % 5 === 0 ? { width: 100, height: 15, amplitude: 45, frequency: 0.025 } : i % 4 === 0 ? { size: 30 } : { width: 30, height: 30 })
      })).concat({ type: "goal", x: 4800 })
    },
    {
      name: "Time Machine",
      speed: 13,
      obstacles: Array.from({length: 80}, (_, i) => ({
        type: i % 3 === 0 ? "spike" : i % 7 === 0 ? "movingPlatform" : "classic",
        x: 220 + i * 55,
        ...(i % 3 === 0 ? { size: 30 } : i % 7 === 0 ? { width: 80, height: 15, range: 140, axis: i % 2 === 0 ? "horizontal" : "vertical" } : { width: 30, height: 30 })
      })).concat({ type: "goal", x: 4900 })
    },
    {
      name: "Cycles",
      speed: 14,
      obstacles: Array.from({length: 85}, (_, i) => ({
        type: i % 4 === 0 ? "movingPlatformSinus" : i % 3 === 0 ? "spike" : "classic",
        x: 180 + i * 53,
        ...(i % 4 === 0 ? { width: 90, height: 15, amplitude: 50, frequency: 0.03 } : i % 3 === 0 ? { size: 30 } : { width: 30, height: 30 })
      })).concat({ type: "goal", x: 5000 })
    },
    {
      name: "xStep",
      speed: 15,
      obstacles: Array.from({length: 90}, (_, i) => ({
        type: i % 6 === 0 ? "movingPlatform" : i % 2 === 0 ? "spike" : "classic",
        x: 160 + i * 50,
        ...(i % 6 === 0 ? { width: 100, height: 15, range: 130, axis: i % 3 === 0 ? "vertical" : "horizontal" } : i % 2 === 0 ? { size: 30 } : { width: 30, height: 30 })
      })).concat({ type: "goal", x: 5100 })
    },
  ];
}
