"use client";

import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  r: number;
  depth: number;
  alpha: number;
  tw: number;
  phase: number;
  tint: 0 | 1 | 2;
  bright: boolean;
};

type Meteor = { x: number; y: number; vx: number; vy: number; life: number; max: number };

const TINTS = ["#f2f7ff", "#bcd8ff", "#ffd9a8"] as const;

/** Pre-rendered radial glow, blitted for bright stars (no per-frame gradients). */
function makeGlowSprite(): HTMLCanvasElement | null {
  const size = 64;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d");
  if (!g) return null;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(255,255,255,0.95)");
  grad.addColorStop(0.16, "rgba(255,255,255,0.5)");
  grad.addColorStop(0.42, "rgba(255,255,255,0.1)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

/** Gaussian-ish spread via central limit of three uniforms, clamped to ±1. */
const gauss = () => Math.max(-1, Math.min(1, (Math.random() + Math.random() + Math.random() - 1.5) / 1.5));

export function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fineMq = window.matchMedia("(pointer: fine)");
    const glow = makeGlowSprite();

    let w = 0;
    let h = 0;
    let stars: Star[] = [];
    let meteors: Meteor[] = [];
    let raf = 0;
    let running = false;
    let last = 0;
    let meteorClock = 0;
    let meteorGap = 8000;
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;

    // pointer parallax — the canvas eases toward these offsets each frame
    let parX = 0;
    let parY = 0;
    let tgtX = 0;
    let tgtY = 0;

    // Milky Way band: −28° (up to the right) through the viewport centre
    const ANGLE = (-28 * Math.PI) / 180;
    const dirX = Math.cos(ANGLE);
    const dirY = Math.sin(ANGLE);
    const perpX = -dirY;
    const perpY = dirX;

    const buildStars = () => {
      const scaled = Math.round(((w * h) / 6000) * (fineMq.matches ? 1 : 0.5));
      const count = Math.max(70, Math.min(420, scaled));
      const diag = Math.hypot(w, h) / 2;
      const bandCount = Math.round(count * 0.4);

      const pickTint = () => {
        const roll = Math.random();
        if (roll < 0.05) return 1 as const; // ice blue
        if (roll < 0.09) return 2 as const; // warm white
        return 0 as const;
      };

      stars = Array.from({ length: count }, (_, i) => {
        const depth = 0.25 + Math.random() * 0.75;
        const tier = Math.random();
        const bright = tier < 0.07; // 7% bright stars with halo
        const normal = !bright && tier < 0.35;
        let x: number;
        let y: number;
        let rScale = 1;
        let aScale = 1;

        if (i < bandCount) {
          // dense, small, whiter cluster along the galactic band
          const t = gauss() * 0.92;
          const spread = gauss() * 0.075 * diag;
          x = w / 2 + t * diag * dirX + spread * perpX;
          y = h / 2 + t * diag * dirY + spread * perpY;
          rScale = 0.68;
          aScale = 0.8;
        } else {
          x = Math.random() * w;
          y = Math.random() * h;
        }

        const baseR = bright
          ? 1.1 + depth * 0.7
          : normal
            ? 0.5 + depth * 0.6
            : 0.3 + depth * 0.4;
        const baseA = bright
          ? 0.8 + depth * 0.2
          : normal
            ? 0.35 + depth * 0.35
            : 0.15 + depth * 0.2;

        return {
          x,
          y,
          r: baseR * rScale,
          depth,
          alpha: Math.min(1, baseA * aScale),
          tw: 0.5 + Math.random() * 1.5,
          phase: Math.random() * Math.PI * 2,
          tint: i < bandCount ? (Math.random() < 0.12 ? 1 : 0) : pickTint(),
          bright,
        };
      });
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const frozen = reduceMq.matches;
      for (const s of stars) {
        const tw = frozen ? 1 : 0.72 + 0.28 * Math.sin(t * 0.001 * s.tw + s.phase);
        ctx.globalAlpha = Math.min(1, s.alpha * tw);
        if (s.bright && glow) {
          const d = s.r * 7;
          ctx.drawImage(glow, s.x - d / 2, s.y - d / 2, d, d);
        }
        ctx.fillStyle = TINTS[s.tint];
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      for (const m of meteors) {
        const p = Math.max(0, 1 - m.life / m.max);
        const speed = Math.hypot(m.vx, m.vy) || 1;
        const tailX = m.x - (m.vx / speed) * 130;
        const tailY = m.y - (m.vy / speed) * 130;
        const g = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        g.addColorStop(0, `rgba(200, 240, 255, ${0.8 * p})`);
        g.addColorStop(1, "rgba(92, 225, 255, 0)");
        ctx.globalAlpha = 1;
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      if (w === 0 || h === 0) return;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildStars();
      meteors = [];
      draw(0);
    };

    const frame = (now: number) => {
      if (!running) return;
      const dt = Math.min(48, now - (last || now));
      last = now;

      for (const s of stars) {
        s.x -= (0.0015 + s.depth * 0.005) * dt;
        if (s.x < -3) {
          s.x = w + 3;
          s.y = Math.random() * h;
        }
      }

      // ease the whole canvas toward the pointer parallax target
      parX += (tgtX - parX) * 0.04;
      parY += (tgtY - parY) * 0.04;
      canvas.style.transform = `translate3d(${parX.toFixed(2)}px, ${parY.toFixed(2)}px, 0)`;

      meteorClock += dt;
      if (meteorClock >= meteorGap) {
        meteorClock = 0;
        meteorGap = 7000 + Math.random() * 5000;
        meteors.push({
          x: 0.4 * w + Math.random() * (w * 0.6 + 60),
          y: Math.random() * h * 0.45,
          vx: -(280 + Math.random() * 150),
          vy: 140 + Math.random() * 110,
          life: 0,
          max: 700 + Math.random() * 300,
        });
      }
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.life += dt;
        m.x += (m.vx * dt) / 1000;
        m.y += (m.vy * dt) / 1000;
        if (m.life >= m.max || m.y > h + 40) meteors.splice(i, 1);
      }

      draw(now);
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || reduceMq.matches) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 120);
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    const onMotionChange = () => {
      if (reduceMq.matches) {
        stop();
        meteors = [];
        draw(0);
      } else {
        start();
      }
    };

    let scrollTick = false;
    const onScroll = () => {
      if (scrollTick || reduceMq.matches) return;
      scrollTick = true;
      requestAnimationFrame(() => {
        scrollTick = false;
        const offset = -((window.scrollY * 0.06) % 22);
        gridRef.current?.style.setProperty("transform", `translate3d(0, ${offset}px, 0)`);
      });
    };

    let pointerTick = false;
    let pendingX = 0;
    let pendingY = 0;
    const onPointer = (e: PointerEvent) => {
      if (reduceMq.matches || !fineMq.matches) return;
      pendingX = e.clientX;
      pendingY = e.clientY;
      tgtX = (e.clientX - window.innerWidth / 2) * 0.012;
      tgtY = (e.clientY - window.innerHeight / 2) * 0.012;
      if (pointerTick) return;
      pointerTick = true;
      requestAnimationFrame(() => {
        pointerTick = false;
        spotRef.current?.style.setProperty(
          "transform",
          `translate3d(${pendingX}px, ${pendingY}px, 0)`,
        );
      });
    };

    resize();
    start();

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    reduceMq.addEventListener("change", onMotionChange);

    return () => {
      stop();
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      reduceMq.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* night-sky wash — indigo zenith glow instead of a flat cyan HUD tint */}
      <div className="sky-wash" />

      {/* nebula clouds — three slow-drifting colour masses */}
      <div className="nebula nebula-indigo" />
      <div className="nebula nebula-violet" />
      <div className="nebula nebula-teal" />

      <div className="absolute inset-0 overflow-hidden">
        <div ref={gridRef} className="bg-grid absolute inset-x-0 -inset-y-8" />
      </div>

      {/* starfield — three magnitudes, Milky Way band, bright-star halos, meteors */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* planetary limb — atmosphere rim arc anchoring the bottom of the sky */}
      <div className="planet-band">
        <div className="planet-haze" />
        <div className="planet" />
      </div>

      <div ref={spotRef} className="spotlight" />
      <div className="vignette" />
    </div>
  );
}
