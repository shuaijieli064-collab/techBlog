"use client";

// HeroConstellation — a flowing particle network (constellation) with
// mouse repulsion and a pulsing central core. Replaces the plain orbital rings.

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hue: number; // 0 cyan, 1 violet
  baseAlpha: number;
  phase: number;
};

type Stream = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  hue: number;
};

export function HeroConstellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !wrap) return;

    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fineMq = window.matchMedia("(pointer: fine)");

    let w = 0;
    let h = 0;
    let cx = 0;
    let cy = 0;
    let particles: Particle[] = [];
    let streams: Stream[] = [];
    let raf = 0;
    let running = false;
    let last = 0;
    let t = 0;
    const pointer = { x: -9999, y: -9999, active: false };
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const build = () => {
      const area = w * h;
      const isMobile = w < 640;
      const maxParticles = isMobile ? 45 : 80;
      const divisor = isMobile ? 18000 : 14000;
      const count = Math.min(maxParticles, Math.floor(area / divisor));
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: rand(0, w),
          y: rand(0, h),
          vx: rand(-0.35, 0.35),
          vy: rand(-0.35, 0.35),
          size: rand(0.8, 2.4),
          hue: Math.random() < 0.65 ? 0 : 1,
          baseAlpha: rand(0.4, 0.9),
          phase: rand(0, Math.PI * 2),
        });
      }
      streams = [];
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      const linkDist = Math.min(w, h) * 0.13;
      const linkDist2 = linkDist * linkDist;

      // central nebula glow (soft, no hard dot)
      const pulse = 0.5 + 0.5 * Math.sin(t * 0.0014);
      const coreR = Math.min(w, h) * 0.14;
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
      coreGrad.addColorStop(0, `rgba(92, 225, 255, ${0.14 * pulse})`);
      coreGrad.addColorStop(0.3, `rgba(167, 139, 250, ${0.08 * pulse})`);
      coreGrad.addColorStop(0.6, `rgba(92, 225, 255, ${0.04 * pulse})`);
      coreGrad.addColorStop(1, "rgba(92, 225, 255, 0)");
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
      ctx.fill();

      // connection lines (constellation)
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < linkDist2) {
            const alpha = (1 - d2 / linkDist2) * 0.35;
            const hue = a.hue === 0 && b.hue === 0 ? "92, 225, 255" : a.hue === 1 && b.hue === 1 ? "167, 139, 250" : "92, 200, 255";
            ctx.strokeStyle = `rgba(${hue}, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        // line from core to nearby particles
        const dxc = a.x - cx;
        const dyc = a.y - cy;
        const dc2 = dxc * dxc + dyc * dyc;
        const coreLink = Math.min(w, h) * 0.22;
        if (dc2 < coreLink * coreLink) {
          const alpha = (1 - dc2 / (coreLink * coreLink)) * 0.25 * pulse;
          ctx.strokeStyle = `rgba(92, 225, 255, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(a.x, a.y);
          ctx.stroke();
        }
      }

      // particles
      for (const p of particles) {
        const pPulse = 0.6 + 0.4 * Math.sin(t * 0.002 + p.phase);
        const color = p.hue === 0 ? "92, 225, 255" : "167, 139, 250";
        // glow
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 5);
        g.addColorStop(0, `rgba(${color}, ${0.5 * p.baseAlpha * pPulse})`);
        g.addColorStop(1, `rgba(${color}, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(${color}, ${p.baseAlpha * pPulse})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // data streams
      for (const s of streams) {
        const p = s.life / s.max;
        const color = s.hue === 0 ? "92, 225, 255" : "167, 139, 250";
        ctx.strokeStyle = `rgba(${color}, ${0.6 * p})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * 0.05, s.y - s.vy * 0.05);
        ctx.stroke();
      }
    };

    const frame = (now: number) => {
      if (!running) return;
      const dt = Math.min(48, now - (last || now));
      last = now;
      t = now;
      const speed = dt * 0.016;

      for (const p of particles) {
        // gentle drift
        p.x += p.vx * speed;
        p.y += p.vy * speed;

        // mouse repulsion
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          const repel = 120;
          if (d2 < repel * repel && d2 > 0.1) {
            const d = Math.sqrt(d2);
            const force = (1 - d / repel) * 1.8;
            p.vx += (dx / d) * force * 0.06;
            p.vy += (dy / d) * force * 0.06;
          }
        }

        // friction
        p.vx *= 0.985;
        p.vy *= 0.985;

        // wrap around edges
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
      }

      // spawn streams near the core
      if (Math.random() < 0.08 && streams.length < 30) {
        const a = rand(0, Math.PI * 2);
        const r = rand(20, 80);
        streams.push({
          x: cx + Math.cos(a) * r,
          y: cy + Math.sin(a) * r,
          vx: rand(-20, 20),
          vy: rand(-50, -20),
          life: 0,
          max: rand(700, 1300),
          hue: Math.random() < 0.6 ? 0 : 1,
        });
      }
      for (let i = streams.length - 1; i >= 0; i--) {
        const s = streams[i];
        s.life += dt;
        s.x += (s.vx * dt) / 1000;
        s.y += (s.vy * dt) / 1000;
        if (s.life >= s.max) streams.splice(i, 1);
      }

      draw();
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

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      cx = w / 2;
      cy = h / 2;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
      draw();
    };

    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 140);
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    const onMotion = () => {
      if (reduceMq.matches) {
        stop();
        draw();
      } else {
        start();
      }
    };

    const onPointer = (e: PointerEvent) => {
      if (!fineMq.matches) return;
      const rect = wrap.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };

    const onLeave = () => {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    };

    resize();
    start();

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    reduceMq.addEventListener("change", onMotion);
    wrap.addEventListener("pointermove", onPointer, { passive: true });
    wrap.addEventListener("pointerleave", onLeave, { passive: true });

    return () => {
      stop();
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      reduceMq.removeEventListener("change", onMotion);
      wrap.removeEventListener("pointermove", onPointer);
      wrap.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-auto absolute inset-0 overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full will-change-transform"
      />
    </div>
  );
}
