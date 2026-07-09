"use client";

import { useEffect, useRef } from "react";

const THEME_COLOR_VARS = ["--accent", "--teal", "--violet", "--amber", "--rose", "--emerald"];

const DENSITY = 1 / 11000;
const MIN_PARTICLES = 36;
const MAX_PARTICLES = 110;
const CONNECT_DIST = 130;
const CURSOR_RADIUS = 170;
const CURSOR_PUSH = 26;
const DISPLACEMENT_DAMPING = 0.9;
const POINTER_FADE_DELAY = 1100;
const POINTER_FADE_DURATION = 900;
const DOT_MIN_RADIUS = 1.2;
const DOT_MAX_RADIUS = 2.4;
const SPEED_RANGE = 0.012;

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.trim().replace("#", "");
  if (clean.length !== 6) return [255, 255, 255];
  const bigint = parseInt(clean, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function getThemePalette(): [number, number, number][] {
  const styles = getComputedStyle(document.documentElement);
  return THEME_COLOR_VARS.map((name) => hexToRgb(styles.getPropertyValue(name)));
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  dispX: number;
  dispY: number;
  radius: number;
  paletteIndex: number;
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let palette = getThemePalette();
    const themeObserver = new MutationObserver(() => {
      palette = getThemePalette();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];

    function makeParticle(): Particle {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * SPEED_RANGE,
        vy: (Math.random() - 0.5) * SPEED_RANGE,
        dispX: 0,
        dispY: 0,
        radius: DOT_MIN_RADIUS + Math.random() * (DOT_MAX_RADIUS - DOT_MIN_RADIUS),
        paletteIndex: Math.floor(Math.random() * palette.length),
      };
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = canvas!.clientWidth;
      height = canvas!.clientHeight;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const targetCount = Math.round(Math.min(MAX_PARTICLES, Math.max(MIN_PARTICLES, width * height * DENSITY)));
      if (particles.length === 0) {
        particles = Array.from({ length: targetCount }, makeParticle);
      } else if (targetCount > particles.length) {
        particles.push(...Array.from({ length: targetCount - particles.length }, makeParticle));
      } else if (targetCount < particles.length) {
        particles.length = targetCount;
      }
    }

    resize();
    window.addEventListener("resize", resize);

    const pointer = { x: -9999, y: -9999, lastMoveTime: 0 };

    function updatePointer(clientX: number, clientY: number) {
      const rect = canvas!.getBoundingClientRect();
      pointer.x = clientX - rect.left;
      pointer.y = clientY - rect.top;
      pointer.lastMoveTime = performance.now();
    }
    function handlePointerMove(e: PointerEvent) {
      updatePointer(e.clientX, e.clientY);
    }
    function handleTouchMove(e: TouchEvent) {
      if (e.touches.length === 0) return;
      updatePointer(e.touches[0].clientX, e.touches[0].clientY);
    }
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    let paused = false;
    function onVisibilityChange() {
      paused = document.hidden;
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    let rafId = 0;
    let lastTime = performance.now();

    function frame() {
      rafId = requestAnimationFrame(frame);
      if (paused) return;

      const now = performance.now();
      const dt = Math.min(now - lastTime, 48);
      lastTime = now;

      let pointerStrength = 0;
      if (pointer.lastMoveTime > 0) {
        const sinceMove = now - pointer.lastMoveTime;
        if (sinceMove < POINTER_FADE_DELAY) pointerStrength = 1;
        else pointerStrength = Math.max(0, 1 - (sinceMove - POINTER_FADE_DELAY) / POINTER_FADE_DURATION);
      }

      ctx!.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        if (pointerStrength > 0) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CURSOR_RADIUS && dist > 0.001) {
            const force = (1 - dist / CURSOR_RADIUS) * CURSOR_PUSH * pointerStrength;
            p.dispX += (dx / dist) * force * (dt / 16);
            p.dispY += (dy / dist) * force * (dt / 16);
          }
        }
        p.dispX *= DISPLACEMENT_DAMPING;
        p.dispY *= DISPLACEMENT_DAMPING;
      }

      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        const ax = a.x + a.dispX;
        const ay = a.y + a.dispY;
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const bx = b.x + b.dispX;
          const by = b.y + b.dispY;
          const dx = ax - bx;
          const dy = ay - by;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.16;
            const [r, g, bch] = palette[a.paletteIndex];
            ctx!.strokeStyle = `rgba(${r}, ${g}, ${bch}, ${alpha})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(ax, ay);
            ctx!.lineTo(bx, by);
            ctx!.stroke();
          }
        }
      }

      if (pointerStrength > 0) {
        for (const p of particles) {
          const px = p.x + p.dispX;
          const py = p.y + p.dispY;
          const dx = px - pointer.x;
          const dy = py - pointer.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CURSOR_RADIUS) {
            const alpha = (1 - dist / CURSOR_RADIUS) * 0.3 * pointerStrength;
            const [r, g, b] = palette[p.paletteIndex];
            ctx!.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(px, py);
            ctx!.lineTo(pointer.x, pointer.y);
            ctx!.stroke();
          }
        }
      }

      for (const p of particles) {
        const px = p.x + p.dispX;
        const py = p.y + p.dispY;
        const [r, g, b] = palette[p.paletteIndex];
        ctx!.beginPath();
        ctx!.fillStyle = `rgba(${r}, ${g}, ${b}, 0.55)`;
        ctx!.arc(px, py, p.radius, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      themeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 h-full w-full opacity-60"
    />
  );
}
