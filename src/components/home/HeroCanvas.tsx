"use client";

/**
 * HeroCanvas — animated neural-network particle field.
 * Reads --color-primary at runtime so it respects dark mode.
 */

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  phase: number;
  phaseSpeed: number;
}

function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return "153, 65, 33";
  return `${r}, ${g}, ${b}`;
}

function getPrimaryRgb(): string {
  const hex = getComputedStyle(document.documentElement)
    .getPropertyValue("--color-primary")
    .trim();
  return hexToRgb(hex);
}

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasMaybe = canvasRef.current;
    if (!canvasMaybe) return;
    const ctxMaybe = canvasMaybe.getContext("2d");
    if (!ctxMaybe) return;

    // Non-null aliases used inside closures — TypeScript loses narrowing in closures
    const el: HTMLCanvasElement = canvasMaybe;
    const ctx: CanvasRenderingContext2D = ctxMaybe;

    const COUNT = 60;
    const CONNECT = 190;
    const particles: Particle[] = [];
    let W = 0;
    let H = 0;
    let animId = 0;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      W = el.offsetWidth;
      H = el.offsetHeight;
      el.width = W * dpr;
      el.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function init() {
      particles.length = 0;
      for (let i = 0; i < COUNT; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          r: 1.2 + Math.random() * 2.2,
          phase: Math.random() * Math.PI * 2,
          phaseSpeed: 0.015 + Math.random() * 0.025,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      const rgb = getPrimaryRgb();

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.phase += p.phaseSpeed;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = W + 20;
        else if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20;
        else if (p.y > H + 20) p.y = -20;

        const pulse = 0.75 + 0.25 * Math.sin(p.phase);

        // Connections
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT) {
            const alpha = 0.22 * (1 - dist / CONNECT) * pulse;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(${rgb}, ${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }

        // Glow halo
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5 * pulse);
        grd.addColorStop(0, `rgba(${rgb}, 0.28)`);
        grd.addColorStop(1, `rgba(${rgb}, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 5 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Core node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, 0.7)`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    init();
    draw();

    const ro = new ResizeObserver(() => {
      resize();
      init();
    });
    ro.observe(el);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-35"
      aria-hidden="true"
    />
  );
}
