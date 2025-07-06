export function getLevels() {
  return [
    {
      name: "Stereo Madness",
      speed: 6,
      obstacles: [
        // 0‑30 % cube
        { type: "classic", x: 200, width: 60, height: 30 },
        { type: "spike", x: 400, size: 30 },
        { type: "classic", x: 600, width: 30, height: 30 },
        // transitions cube → ship à ~30 %
        { type: "ship_enter", x: 800 },
        { type: "ship_path", x: 900, width: 200, height: 100, pathType: "up-down" },
        // ship 30‑48 %
        { type: "ship_path", x: 1150, width: 200, height: 120, pathType: "zigzag" },
        { type: "ship_exit", x: 1400 },
        // cube 48‑85 %
        { type: "stair", x: 1500, height: 4, stepWidth: 30, stepHeight: 20 },
        { type: "classic", x: 1700, width: 60, height: 30 },
        { type: "spike", x: 1900, size: 30 },
        { type: "stair", x: 2000, height: -3, stepWidth: 30, stepHeight: 20 }, // descend
        // coin routes
        { type: "pillar_pair", x: 2200, spacing: 40, count: 3 },
        // transition cube → ship ~85 %
        { type: "ship_enter", x: 2400 },
        { type: "ship_path", x: 2600, width: 300, height: 100, pathType: "straight" },
        { type: "ship_path", x: 2900, width: 200, height: 120, pathType: "zigzag" },
        { type: "ship_exit", x: 3150 },
        // coin route micro-branch
        { type: "stair", x: 3200, height: 2, stepWidth: 20, stepHeight: 15 },
        // finish
        { type: "classic", x: 3400, width: 60, height: 30 },
        { type: "goal", x: 3600 }
      ]
    }
    // → Autres niveaux officiels seront faits de la même manière : transitions, formes, patterns
  ];
}
