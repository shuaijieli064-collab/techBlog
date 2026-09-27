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
};

type Meteor = { x: number; y: number; vx: number; vy: number; life: number; max: number };

const TINTS = ["#dce9ff", "#5ce1ff", "#ffb454"] as const;

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

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const buildStars = () => {
      const scaled = Math.round(((w * h) / 12000) * (fineMq.matches ? 1 : 0.55));
      const count = Math.max(50, Math.min(160, scaled));
      stars = Array.from({ length: count }, () => {
        const depth = rand(0.25, 1);
        const roll = Math.random();
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.4 + depth * 1.15,
          depth,
          alpha: 0.22 + depth * 0.48,
          tw: rand(0.5, 2),
          phase: rand(0, Math.PI * 2),
          tint: (roll < 0.06 ? 1 : roll < 0.09 ? 2 : 0) as 0 | 1 | 2,
        };
      });
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const frozen = reduceMq.matches;
      for (const s of stars) {
        const tw = frozen ? 1 : 0.68 + 0.32 * Math.sin(t * 0.001 * s.tw + s.phase);
        ctx.globalAlpha = Math.min(1, s.alpha * tw);
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

      meteorClock += dt;
      if (meteorClock >= meteorGap) {
        meteorClock = 0;
        meteorGap = rand(8000, 14000);
        meteors.push({
          x: rand(w * 0.4, w + 60),
          y: rand(h * 0.04, h * 0.45),
          vx: -rand(280, 430),
          vy: rand(140, 250),
          life: 0,
          max: rand(700, 1000),
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
      <div className="glow-top" />
      <div className="aurora aurora-a" />
      <div className="aurora aurora-b" />

      <div className="absolute inset-0 overflow-hidden">
        <div ref={gridRef} className="bg-grid absolute inset-x-0 -inset-y-8" />
      </div>

      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      <div className="horizon-band">
        <div className="horizon">
          <div className="horizon-grid" />
        </div>
      </div>
      <div className="horizon-glow" />

      <div ref={spotRef} className="spotlight" />
      <div className="vignette" />
    </div>
  );
}
