const CURVE = (() => {
  const fallback = {
    a: 5, b: 7, c: 9, phase: 0.7,
    ramp: ".:-=+*#%@",
    samples: 4, pitch: 0.5, rest: 0.3,
    markerRest: 0.6, markerSteps: 120,
  };
  const el = document.getElementById("curve");
  if (!el || !el.dataset.curve) return fallback;
  try {
    return Object.assign(fallback, JSON.parse(el.dataset.curve));
  } catch {
    return fallback;
  }
})();

(() => {
  const links = document.querySelectorAll(".polaroid-link");

  links.forEach((link) => {
    const anchor = link.querySelector("a");
    const preview = link.querySelector(".polaroid");
    if (!anchor || !preview) return;

    let dismissTimer;

    const position = () => {
      const rect = anchor.getBoundingClientRect();
      preview.style.left = `${rect.left + rect.width / 2}px`;
      preview.style.top = `${rect.top - 12}px`;
    };

    const show = () => {
      clearTimeout(dismissTimer);
      position();
      link.classList.add("is-previewing");
    };

    const hide = () => {
      dismissTimer = setTimeout(
        () => link.classList.remove("is-previewing"),
        80,
      );
    };

    anchor.addEventListener("mouseenter", show);
    anchor.addEventListener("mouseleave", hide);
    anchor.addEventListener("focus", show);
    anchor.addEventListener("blur", hide);
    preview.addEventListener("mouseenter", show);
    preview.addEventListener("mouseleave", hide);
  });

  const graph = document.querySelector(".github-graph");
  if (graph) {
    const counts = (graph.dataset.contributions || "")
      .split(",")
      .filter(Boolean)
      .slice(-112)
      .map(Number);
    const labels = graph.querySelector(".github-month-labels");
    const grid = graph.querySelector(".contribution-grid");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    if (labels) {
      [0, 4, 8, 12].forEach((week) => {
        const label = document.createElement("span");
        const date = new Date();
        date.setDate(date.getDate() - (15 - week) * 7);
        label.textContent = months[date.getMonth()];
        labels.appendChild(label);
      });
    }
    if (grid) {
      for (let week = 0; week < 16; week++) {
        const column = document.createElement("span");
        column.className = "contribution-week";
        for (let day = 0; day < 7; day++) {
          const cell = document.createElement("span");
          const count = counts[week * 7 + day] || 0;
          cell.style.background = levelColor(count);
          cell.title = `${count} contributions on this day`;
          cell.style.setProperty("--cell-delay", `${0.03 * (day + week)}s`);
          column.appendChild(cell);
        }
        grid.appendChild(column);
      }
    }
  }

  function levelColor(count) {
    if (count === 0) return "#e0e3e8";
    if (count <= 2) return "#9be9a8";
    if (count <= 5) return "#40c463";
    if (count <= 10) return "#30a14e";
    return "#216e39";
  }

  document
    .querySelectorAll(".polaroid-banner[data-accent]")
    .forEach((banner) => {
      banner.style.background = banner.dataset.accent;
    });
})();

(() => {
  const el = document.getElementById("curve");
  if (!el) return;

  const w = Number(el.dataset.w);
  const h = Number(el.dataset.h);
  if (!w || !h) return;

  const A = CURVE.a,
    B = CURVE.b,
    C = CURVE.c,
    PHASE = CURVE.phase;
  const STEPS = w * h * CURVE.samples;
  const RAMP = CURVE.ramp;

  const shade = (depth) => {
    const level = Math.round(((depth + 1) / 2) * (RAMP.length - 1));
    return RAMP[Math.min(RAMP.length - 1, Math.max(0, level))];
  };

  const MAX_PITCH = CURVE.pitch;

  const bounds = () => {
    let rx = 0, rz = 0;
    for (let i = 0; i <= 4096; i++) {
      const t = (2 * Math.PI * i) / 4096;
      const x = Math.cos(A * t);
      const y = Math.cos(B * t + PHASE);
      const z = Math.cos(C * t + 2 * PHASE);

      const flat = Math.hypot(x, z);
      if (flat > rx) rx = flat;

      const full = Math.hypot(Math.abs(y), flat);
      if (full > rz) rz = full;
    }
    return { rx, rz };
  };

  const reach = bounds();
  const RX = reach.rx, RZ = reach.rz;

  const PROFILE = 2048;
  const profileHigh = new Float64Array(PROFILE + 1);
  const profileFlat = new Float64Array(PROFILE + 1);

  for (let i = 0; i <= PROFILE; i++) {
    const t = (2 * Math.PI * i) / PROFILE;
    const x = Math.cos(A * t);
    const y = Math.cos(B * t + PHASE);
    const z = Math.cos(C * t + 2 * PHASE);
    profileHigh[i] = Math.abs(y);
    profileFlat[i] = Math.hypot(x, z);
  }

  const verticalExtent = (pitch) => {
    const sin = Math.abs(Math.sin(pitch)), cos = Math.abs(Math.cos(pitch));
    let widest = 0;
    for (let i = 0; i <= PROFILE; i++) {
      const reach = profileHigh[i] * cos + profileFlat[i] * sin;
      if (reach > widest) widest = reach;
    }
    return widest;
  };

  const sampleX = new Float64Array(STEPS + 1);
  const sampleY = new Float64Array(STEPS + 1);
  const sampleZ = new Float64Array(STEPS + 1);

  for (let i = 0; i <= STEPS; i++) {
    const t = (2 * Math.PI * i) / STEPS;
    sampleX[i] = Math.cos(A * t);
    sampleY[i] = Math.cos(B * t + PHASE);
    sampleZ[i] = Math.cos(C * t + 2 * PHASE);
  }

  const cells = new Array(w * h);
  const depths = new Float64Array(w * h);

  const render = (yaw, pitch) => {
    cells.fill(" ");
    depths.fill(-Infinity);

    const sinYaw = Math.sin(yaw), cosYaw = Math.cos(yaw);
    const sinPitch = Math.sin(pitch), cosPitch = Math.cos(pitch);
    const tall = verticalExtent(pitch);

    for (let i = 0; i <= STEPS; i++) {
      const px = sampleX[i], py = sampleY[i], pz = sampleZ[i];

      const flatX = px * cosYaw + pz * sinYaw;
      const flatZ = pz * cosYaw - px * sinYaw;

      const x = flatX / RX;
      const y = (py * cosPitch - flatZ * sinPitch) / tall;
      const depth = (py * sinPitch + flatZ * cosPitch) / RZ;

      const col = Math.round(((x + 1) / 2) * (w - 1));
      const row = Math.round((1 - (y + 1) / 2) * (h - 1));
      if (col < 0 || col >= w || row < 0 || row >= h) continue;

      const at = row * w + col;
      if (depth <= depths[at]) continue;

      depths[at] = depth;
      cells[at] = shade(depth);
    }

    const rows = [];
    for (let row = 0; row < h; row++) {
      rows.push(cells.slice(row * w, (row + 1) * w).join(""));
    }
    el.textContent = rows.join("\n");
  };

  const still =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (still) return;

  const TURN = 2 * Math.PI;
  const REST = CURVE.rest;
  const SPIN = 0.01;
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  let yaw = REST, pitch = 0;
  let dragging = false;
  let grabX = 0, grabY = 0, grabYaw = REST, grabPitch = 0;
  let painted = 0;
  let dirty = false;
  let moved = false;
  let swallowClick = false;

  render(yaw, pitch);

  const CONTROLS = "a, button, input, textarea, select, summary, [tabindex]";

  const interactive = (node) =>
    !!(node && node.closest && node.closest(CONTROLS));

  const hold = (on) => {
    const style = document.documentElement.style;
    style.userSelect = on ? "none" : "";
    style.webkitUserSelect = on ? "none" : "";
  };

  window.addEventListener("pointerdown", (event) => {
    swallowClick = false;

    const middle = event.button === 1;
    const held =
      event.button === 0 && event.metaKey && !interactive(event.target);
    if (!middle && !held) return;

    event.preventDefault();
    dragging = true;
    moved = false;
    grabX = event.clientX;
    grabY = event.clientY;
    grabYaw = yaw;
    grabPitch = pitch;
    hold(true);
  });

  const swallowMiddle = (event) => {
    if (event.button === 1) event.preventDefault();
  };
  window.addEventListener("mousedown", swallowMiddle);
  window.addEventListener("auxclick", swallowMiddle);

  window.addEventListener(
    "pointermove",
    (event) => {
      if (!dragging) return;

      const shiftX = event.clientX - grabX;
      const shiftY = event.clientY - grabY;
      if (Math.abs(shiftX) > 3 || Math.abs(shiftY) > 3) moved = true;

      const across = shiftX / window.innerWidth;
      const down = shiftY / window.innerHeight;

      yaw = grabYaw + across * TURN * 1.5;
      pitch = clamp(grabPitch - down * 2 * MAX_PITCH, -MAX_PITCH, MAX_PITCH);
      dirty = true;
    },
    { passive: true },
  );

  const release = () => {
    if (!dragging) return;
    dragging = false;
    swallowClick = moved;
    hold(false);
  };
  window.addEventListener("pointerup", release);
  window.addEventListener("pointercancel", release);
  window.addEventListener("blur", release);

  window.addEventListener(
    "click",
    (event) => {
      if (!swallowClick) return;
      swallowClick = false;
      event.preventDefault();
      event.stopPropagation();
    },
    true,
  );

  const frame = (now) => {
    requestAnimationFrame(frame);

    if (document.visibilityState === "hidden") return;
    if (now - painted < 32) return;
    painted = now;

    if (!dragging) {
      yaw += SPIN;
      dirty = true;
    }

    if (!dirty) return;
    dirty = false;
    render(yaw, pitch);
  };

  requestAnimationFrame(frame);
})();

(() => {
  const REST = CURVE.markerRest;
  const STEPS = CURVE.markerSteps;
  const SPEED = 0.055;

  const still =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (still) return;

  const radius = (a, c, phase) => {
    let widest = 0;
    for (let i = 0; i <= 4096; i++) {
      const t = (2 * Math.PI * i) / 4096;
      const px = Math.cos(a * t);
      const pz = Math.cos(c * t + 2 * phase);
      const reach = px * px + pz * pz;
      if (reach > widest) widest = reach;
    }
    return Math.sqrt(widest);
  };

  const trace = (a, b, c, phase, theta, reach) => {
    const sin = Math.sin(theta),
      cos = Math.cos(theta);

    let d = "";
    for (let i = 0; i <= STEPS; i++) {
      const t = (2 * Math.PI * i) / STEPS;
      const px = Math.cos(a * t);
      const py = Math.cos(b * t + phase);
      const pz = Math.cos(c * t + 2 * phase);

      const x = ((px * cos + pz * sin) / reach).toFixed(2);
      d += `${i === 0 ? "M" : "L"}${x} ${(-py).toFixed(2)}`;
    }
    return d;
  };

  document.querySelectorAll(".work").forEach((row) => {
    const svg = row.querySelector("svg");
    const path = svg && svg.querySelector("path");
    if (!path) return;

    const a = Number(svg.dataset.a);
    const b = Number(svg.dataset.b);
    const c = Number(svg.dataset.c);
    const phase = Number(svg.dataset.phase);
    if (!a || !b || !c) return;

    const reach = radius(a, c, phase);

    let theta = REST;
    let spinning = false;
    let frame;

    const step = () => {
      if (spinning) {
        theta += SPEED;
      } else {
        const drift =
          (((REST - theta) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        if (drift < 0.04) {
          path.setAttribute("d", trace(a, b, c, phase, REST, reach));
          frame = undefined;
          return;
        }
        theta += Math.max(0.03, drift * 0.12);
      }

      path.setAttribute("d", trace(a, b, c, phase, theta, reach));
      frame = requestAnimationFrame(step);
    };

    const start = () => {
      spinning = true;
      if (!frame) frame = requestAnimationFrame(step);
    };

    const stop = () => {
      spinning = false;
    };

    row.addEventListener("pointerenter", start);
    row.addEventListener("pointerleave", stop);
    row.addEventListener("focusin", start);
    row.addEventListener("focusout", stop);
  });
})();

(() => {
  const el = document.getElementById("clock");
  if (!el) return;

  const zone = el.dataset.zone;
  if (!zone) return;

  const still =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const roll = (slot, glyph) => {
    const out = slot.animate(
      [
        { transform: "translateY(0)", opacity: 1 },
        { transform: "translateY(-0.55em)", opacity: 0 },
      ],
      { duration: 130, easing: "ease-in", fill: "forwards" },
    );

    setTimeout(() => {
      slot.textContent = glyph;
      out.cancel();
      slot.animate(
        [
          { transform: "translateY(0.55em)", opacity: 0 },
          { transform: "translateY(0)", opacity: 1 },
        ],
        { duration: 210, easing: "cubic-bezier(0.34, 1.2, 0.64, 1)" },
      );
    }, 130);
  };

  const show = (text, settled) => {
    const glyphs = [...text];

    while (el.children.length > glyphs.length) el.lastElementChild.remove();
    while (el.children.length < glyphs.length) {
      const slot = document.createElement("span");
      slot.className = "tick";
      el.appendChild(slot);
    }

    glyphs.forEach((glyph, i) => {
      const slot = el.children[i];
      if (slot.textContent === glyph) return;
      if (!settled || still || !slot.animate) {
        slot.textContent = glyph;
        return;
      }
      roll(slot, glyph);
    });
  };

  const tick = (settled) => {
    try {
      const now = new Intl.DateTimeFormat("en-US", {
        timeZone: zone,
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(new Date());

      show(now.replace(" AM", "am").replace(" PM", "pm"), settled);
    } catch {}
  };

  el.textContent = "";
  tick(false);
  setInterval(() => tick(true), 20000);
})();

(() => {
  const signature = document.querySelector(".signature");
  if (!signature) return;

  const draw = () => signature.classList.add("is-drawn");

  if (!("IntersectionObserver" in window)) {
    draw();
    return;
  }

  const watcher = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      draw();
      watcher.disconnect();
    },
    { threshold: 0.4 },
  );

  watcher.observe(signature);
})();
