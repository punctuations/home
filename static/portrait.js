var VIEW = {
  xCenter: -10 + 0.25,
  xHalf: 65,
  yCenter: 0.35 + 0.25,
  yHalf: 0.4,
  speed: 9,
  aspect: 16 / 9,
};
var G_CA = 4.4;
var G_K = 8;
var G_LEAK = 2;
var E_CA = 120;
var E_K = -84;
var E_LEAK = -60;
var CAP = 20;
var V1 = -1.2;
var V2 = 18;
var V3 = 2;
var V4 = 30;
var PHI = 0.04;
var CURRENT = 100;
function derivative(x, y, out) {
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

var X_CENTER = VIEW.xCenter;
var X_HALF = VIEW.xHalf;
var Y_CENTER = VIEW.yCenter;
var Y_HALF = VIEW.yHalf;
var SPEED = VIEW.speed;
var ASPECT = VIEW.aspect;
var TRAIL_TAU = 1.6;
var BUCKETS = 10;
var LIFE_MIN = 8;
var LIFE_MAX = 30;
var WAIT_MIN = 0.15;
var WAIT_MEAN = 3.5;
var WAIT_START = 9;
var WAIT_CAP = 26;
var FADE_IN = 1.6;
var FADE_OUT = 4;
var MARGIN = 40;
var SAMPLE = 240;
var DEGRADE_MS = 14;
var PROMOTE_MS = 3.5;
var FIELD_PIXELS = 3;
var FIELD_SPACING = 85;
var FIELD_LENGTH = 90;
var ESCAPE = 40;
var TIERS = [
  { dpr: 2, minFrame: 1 / 61, step: 1 / 60, area: 4200, cap: 420 },
  { dpr: 1.5, minFrame: 1 / 61, step: 1 / 60, area: 7000, cap: 260 },
  { dpr: 1, minFrame: 1 / 31, step: 1 / 30, area: 11000, cap: 150 },
  { dpr: 0.75, minFrame: 1 / 31, step: 1 / 30, area: 18000, cap: 90 },
];
var flow = new Float64Array(2);
function field(x, y, index) {
  derivative(x, y, flow);
  return flow[index];
}
function nextWait(mean) {
  const w = -Math.log(1 - Math.random()) * mean;
  return WAIT_MIN + (w > WAIT_CAP ? WAIT_CAP : w);
}
function baseTier() {
  const nav = navigator;
  const cores = nav.hardwareConcurrency || 4;
  const memory = nav.deviceMemory || 4;
  if (window.matchMedia("(update: slow)").matches) return 3;
  if (cores <= 2 || memory <= 2) return 2;
  if (cores <= 4 || memory <= 4) return 1;
  return 0;
}
(() => {
  const canvas = document.getElementById("portrait");
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) return;
  const surface = document.createElement("canvas");
  const surfaceCtx = surface.getContext("2d", { alpha: false });
  if (!surfaceCtx) return;
  const carry = document.createElement("canvas");
  const carryCtx = carry.getContext("2d", { alpha: false });
  if (!carryCtx) return;
  let capacity = 0;
  let active = 0;
  let state = new Float64Array(0);
  let projected = new Float32Array(0);
  let load = new Float32Array(0);
  let age = new Float32Array(0);
  let life = new Float32Array(0);
  let wait = new Float32Array(0);
  let alive = new Uint8Array(0);
  let seen = new Uint8Array(0);
  let bucketOf = new Uint8Array(0);
  let segments = new Float32Array(0);
  const bucketCounts = new Uint16Array(BUCKETS);
  const bucketAlpha = new Float32Array(BUCKETS);
  const bucketWidth = new Float32Array(BUCKETS);
  for (let b = 0; b < BUCKETS; b++) {
    const t = (b + 0.5) / BUCKETS;
    bucketAlpha[b] = 0.1 + t * 0.78;
    bucketWidth[b] = 0.6 + t * 1.7;
  }
  let width = 0;
  let height = 0;
  let xScale = 1;
  let yScale = 1;
  let halfX = X_HALF;
  let halfY = Y_HALF;
  const floor = baseTier();
  let tier = floor;
  let painted = false;
  function toScreenX(cx, x) {
    return cx + (x - X_CENTER) * xScale;
  }
  function toScreenY(cy, y) {
    return cy - (y - Y_CENTER) * yScale;
  }
  function spawn(i) {
    const o = i * 2;
    state[o] = X_CENTER + (Math.random() - 0.5) * 2 * halfX;
    state[o + 1] = Y_CENTER + (Math.random() - 0.5) * 2 * halfY;
    load[i] = 0.5 + Math.random() * 0.5;
    age[i] = 0;
    life[i] = LIFE_MIN + Math.random() * (LIFE_MAX - LIFE_MIN);
    alive[i] = 1;
    seen[i] = 0;
  }
  function kill(i) {
    alive[i] = 0;
    seen[i] = 0;
    wait[i] = nextWait(WAIT_MEAN);
  }
  function grow(n) {
    if (n <= capacity) return;
    capacity = n;
    state = new Float64Array(n * 2);
    projected = new Float32Array(n * 2);
    load = new Float32Array(n);
    age = new Float32Array(n);
    life = new Float32Array(n);
    wait = new Float32Array(n);
    alive = new Uint8Array(n);
    seen = new Uint8Array(n);
    bucketOf = new Uint8Array(n);
    segments = new Float32Array(n * 4 * BUCKETS);
    for (let i = 0; i < n; i++) wait[i] = nextWait(WAIT_START);
  }
  function step(s, h) {
    const x = s[0];
    const y = s[1];
    const h2 = h * 0.5;
    const h6 = h / 6;
    derivative(x, y, flow);
    const k1x = flow[0];
    const k1y = flow[1];
    derivative(x + h2 * k1x, y + h2 * k1y, flow);
    const k2x = flow[0];
    const k2y = flow[1];
    derivative(x + h2 * k2x, y + h2 * k2y, flow);
    const k3x = flow[0];
    const k3y = flow[1];
    derivative(x + h * k3x, y + h * k3y, flow);
    s[0] = x + h6 * (k1x + 2 * k2x + 2 * k3x + flow[0]);
    s[1] = y + h6 * (k1y + 2 * k2y + 2 * k3y + flow[1]);
  }
  function streamStep(s, sign) {
    derivative(s[0], s[1], flow);
    const vx = flow[0] * xScale;
    const vy = flow[1] * yScale;
    const speed = Math.sqrt(vx * vx + vy * vy);
    if (!(speed > 0.000000001)) return false;
    const gain = (sign * FIELD_PIXELS) / speed;
    s[0] += flow[0] * gain;
    s[1] += flow[1] * gain;
    return true;
  }
  const FRAME = (() => {
    try {
      return JSON.parse(canvas.dataset.portrait);
    } catch {
      return null;
    }
  })();

  let structure = null;
  if (FRAME && FRAME.src) {
    const img = new Image();
    img.decoding = "async";
    img.addEventListener("load", () => {
      structure = img;
      configure(true);
    });
    img.src = FRAME.src;
  }

  function drawStructure() {
    if (!surfaceCtx || !structure || !FRAME) return;
    const sx = (FRAME.xHalf - halfX) * (FRAME.width / (2 * FRAME.xHalf));
    const sy = (FRAME.yHalf - halfY) * (FRAME.height / (2 * FRAME.yHalf));
    const sw = FRAME.width - 2 * sx;
    const sh = FRAME.height - 2 * sy;
    if (!(sw > 0) || !(sh > 0)) return;
    surfaceCtx.drawImage(structure, sx, sy, sw, sh, 0, 0, width, height);
  }

  function drawSurface(ratio) {
    if (!surfaceCtx) return;
    surfaceCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
    surfaceCtx.fillStyle = "#ffffff";
    surfaceCtx.fillRect(0, 0, width, height);
    surfaceCtx.lineCap = "round";
    surfaceCtx.lineJoin = "round";
    surfaceCtx.setLineDash([]);
    const cx = width * 0.5;
    const cy = height * 0.5;
    const cols = Math.max(6, Math.round(width / FIELD_SPACING));
    const rows = Math.max(4, Math.round(height / FIELD_SPACING));
    const trace = new Float64Array(2);
    const lines = new Path2D();
    for (let c = 0; c <= cols; c++) {
      for (let r = 0; r <= rows; r++) {
        const seedX = X_CENTER + ((c + 0.5) / cols - 0.5) * 2 * halfX;
        const seedY = Y_CENTER + ((r + 0.5) / rows - 0.5) * 2 * halfY;
        for (const direction of [1, -1]) {
          trace[0] = seedX;
          trace[1] = seedY;
          lines.moveTo(toScreenX(cx, seedX), toScreenY(cy, seedY));
          for (let n = 0; n < FIELD_LENGTH; n++) {
            if (!streamStep(trace, direction)) break;
            if (trace[0] !== trace[0]) break;
            const px = toScreenX(cx, trace[0]);
            const py = toScreenY(cy, trace[1]);
            if (px < -MARGIN || px > width + MARGIN) break;
            if (py < -MARGIN || py > height + MARGIN) break;
            lines.lineTo(px, py);
          }
        }
      }
    }
    surfaceCtx.lineWidth = 1;
    surfaceCtx.strokeStyle = "rgba(0, 0, 0, 0.1)";
    surfaceCtx.stroke(lines);
    drawStructure();
  }
  function configure(clear = false) {
    if (!canvas || !ctx) return;
    const t = TIERS[tier];
    width = window.innerWidth;
    height = window.innerHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, t.dpr);
    const backingWidth = Math.max(1, Math.round(width * ratio));
    const backingHeight = Math.max(1, Math.round(height * ratio));
    const carried = painted && !clear;
    if (carried && carryCtx) {
      carry.width = canvas.width;
      carry.height = canvas.height;
      carryCtx.setTransform(1, 0, 0, 1, 0, 0);
      carryCtx.drawImage(canvas, 0, 0);
    }
    canvas.width = backingWidth;
    canvas.height = backingHeight;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    surface.width = backingWidth;
    surface.height = backingHeight;
    const span = Math.sqrt(width * height * ASPECT);
    xScale = span / (2 * X_HALF);
    yScale = span / ASPECT / (2 * Y_HALF);
    halfX = width / (2 * xScale);
    halfY = height / (2 * yScale);
    drawSurface(ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalAlpha = 1;
    ctx.drawImage(carried ? carry : surface, 0, 0, width, height);
    ctx.strokeStyle = "#000000";
    const wanted = Math.max(
      24,
      Math.min(t.cap, Math.round((width * height) / t.area)),
    );
    grow(Math.max(wanted, capacity));
    active = wanted;
    for (let i = 0; i < capacity; i++) seen[i] = 0;
    workEma = 0;
    samples = -SAMPLE;
    painted = true;
  }
  const walker = new Float64Array(2);
  function advance(dt) {
    const h = dt * SPEED;
    const reachX = halfX * ESCAPE;
    const reachY = halfY * ESCAPE;
    for (let i = 0; i < active; i++) {
      if (alive[i] === 0) {
        wait[i] -= dt;
        if (wait[i] <= 0) spawn(i);
        continue;
      }
      const o = i * 2;
      walker[0] = state[o];
      walker[1] = state[o + 1];
      step(walker, h);
      if (
        walker[0] !== walker[0] ||
        Math.abs(walker[0] - X_CENTER) > reachX ||
        Math.abs(walker[1] - Y_CENTER) > reachY
      ) {
        kill(i);
        continue;
      }
      state[o] = walker[0];
      state[o + 1] = walker[1];
      age[i] += dt;
      if (age[i] >= life[i]) kill(i);
    }
  }
  function paint(dt) {
    if (!ctx) return;
    ctx.globalAlpha = 1 - Math.exp(-dt / TRAIL_TAU);
    ctx.drawImage(surface, 0, 0, width, height);
    for (let b = 0; b < BUCKETS; b++) bucketCounts[b] = 0;
    const stride = active * 4;
    const cx = width * 0.5;
    const cy = height * 0.5;
    const right = width + MARGIN;
    const bottom = height + MARGIN;
    for (let i = 0; i < active; i++) {
      if (alive[i] === 0) continue;
      const o = i * 2;
      const px = toScreenX(cx, state[o]);
      const py = toScreenY(cy, state[o + 1]);
      if (px < -MARGIN || px > right || py < -MARGIN || py > bottom) {
        kill(i);
        continue;
      }
      const remaining = life[i] - age[i];
      const rise = age[i] < FADE_IN ? age[i] / FADE_IN : 1;
      const fall = remaining < FADE_OUT ? remaining / FADE_OUT : 1;
      const t = load[i] * (rise < fall ? rise : fall);
      let b = (t * BUCKETS) | 0;
      if (b >= BUCKETS) b = BUCKETS - 1;
      const p = i * 2;
      if (seen[i] === 1) {
        const slot = bucketOf[i] === b ? b : bucketOf[i];
        const n = slot * stride + bucketCounts[slot] * 4;
        segments[n] = projected[p];
        segments[n + 1] = projected[p + 1];
        segments[n + 2] = px;
        segments[n + 3] = py;
        bucketCounts[slot]++;
      } else {
        seen[i] = 1;
      }
      projected[p] = px;
      projected[p + 1] = py;
      bucketOf[i] = b;
    }
    for (let b = 0; b < BUCKETS; b++) {
      const n = bucketCounts[b];
      if (n === 0) continue;
      const base = b * stride;
      ctx.globalAlpha = bucketAlpha[b];
      ctx.lineWidth = bucketWidth[b];
      ctx.beginPath();
      for (let s = 0; s < n; s++) {
        const o = base + s * 4;
        ctx.moveTo(segments[o], segments[o + 1]);
        ctx.lineTo(segments[o + 2], segments[o + 3]);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  let frame = 0;
  let last = 0;
  let accumulator = 0;
  let running = false;
  let workEma = 0;
  let samples = 0;
  function judge(work) {
    workEma = workEma === 0 ? work : workEma + (work - workEma) * 0.05;
    samples++;
    if (samples < SAMPLE) return;
    samples = 0;
    if (workEma > DEGRADE_MS && tier < TIERS.length - 1) {
      tier++;
      workEma = 0;
      configure();
    } else if (workEma < PROMOTE_MS && tier > floor) {
      tier--;
      workEma = 0;
      configure();
    }
  }
  function loop(now) {
    frame = requestAnimationFrame(loop);
    const t = TIERS[tier];
    const elapsed = (now - last) / 1000;
    if (elapsed < t.minFrame) return;
    last = now;
    const dt = elapsed > 0.25 ? t.step : elapsed;
    const started = performance.now();
    accumulator += dt;
    let steps = 0;
    while (accumulator >= t.step && steps < 2) {
      advance(t.step);
      accumulator -= t.step;
      steps++;
    }
    if (accumulator > t.step) accumulator = 0;
    paint(dt);
    judge(performance.now() - started);
  }
  function start() {
    if (running) return;
    running = true;
    last = performance.now();
    accumulator = 0;
    frame = requestAnimationFrame(loop);
  }
  function stop() {
    if (!running) return;
    running = false;
    cancelAnimationFrame(frame);
  }
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  function settle() {
    const value = TIERS[tier].step;
    for (let i = 0; i < 240; i++) {
      advance(value);
      paint(value);
    }
  }
  function sync() {
    if (document.hidden || reduced.matches) stop();
    else start();
  }
  let resizeTimer;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      configure(true);
      if (reduced.matches) settle();
    }, 150);
  }
  function onMotion() {
    if (reduced.matches) {
      stop();
      settle();
    } else {
      sync();
    }
  }
  configure();
  if (reduced.matches) settle();
  else sync();
  window.addEventListener("resize", onResize, { passive: true });
  document.addEventListener("visibilitychange", sync);
  reduced.addEventListener("change", onMotion);
})();
