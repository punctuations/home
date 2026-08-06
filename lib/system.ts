export const VIEW = {
  xCenter: -10 + 0.25,
  xHalf: 65,
  yCenter: 0.35 + 0.25,
  yHalf: 0.4,
  speed: 9,
  aspect: 16 / 9,
};

const G_CA = 4.4;
const G_K = 8;
const G_LEAK = 2;
const E_CA = 120;
const E_K = -84;
const E_LEAK = -60;
const CAP = 20;
const V1 = -1.2;
const V2 = 18;
const V3 = 2;
const V4 = 30;
const PHI = 0.04;
const CURRENT = 100;

export function derivative(x: number, y: number, out: Float64Array) {
  const opening = 0.5 * (1 + Math.tanh((x - V1) / V2));
  const settled = 0.5 * (1 + Math.tanh((x - V3) / V4));

  out[0] =
    (CURRENT -
      G_LEAK * (Math.tanh(x ** 2) * x - E_LEAK) -
      G_CA * opening * (x - E_CA) -
      G_K * Math.tanh(y ** 2) * y * (x - E_K)) /
    CAP;
  out[1] = (PHI * (settled - y)) / Math.cosh((x - V3) / (2 * V4));
}
