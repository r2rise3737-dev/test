// src/components/StarSky.tsx
"use client";

import React, { useEffect, useRef } from "react";

/**
 * Полупрозрачное «звёздное небо» для оверлея над видео/хедерами.
 * Без зависимостей, аккуратно к DPR и resize.
 */
type Star = {
  x: number;
  y: number;
  r: number;        // базовый «радиус» свечения
  breathing: boolean;
  phase: number;
};

type Shooting = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;     // 1 -> 0
};

export default function StarSky({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctxRef.current = ctx;

    let width = 0;
    let height = 0;

    // Звёзды и «метеоры»
    let stars: Star[] = [];
    let shootings: Shooting[] = [];

    function rand(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    function makeStars(n: number): Star[] {
      const arr: Star[] = [];
      for (let i = 0; i < n; i++) {
        arr.push({
          x: rand(0, width),
          y: rand(0, height),
          r: rand(0.5, 1.2),
          breathing: Math.random() < 0.6,
          phase: rand(0, Math.PI * 2),
        });
      }
      return arr;
    }

    function resize() {
      // Берём актуальный canvas из ref — так TS не будет считать его possibly null
      const cnv = canvasRef.current;
      const context = ctxRef.current;
      if (!cnv || !context) return;

      const parent = cnv.parentElement ?? document.body;
      const rect = parent.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));

      cnv.width = Math.floor(width * dpr);
      cnv.height = Math.floor(height * dpr);
      cnv.style.width = `${width}px`;
      cnv.style.height = `${height}px`;

      // масштаб под DPR
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Перегенерация звёзд под новую площадь
      const density = 0.00022;
      const count = Math.max(40, Math.floor(width * height * density));
      stars = makeStars(count);
    }

    function spawnShooting() {
      // небольшая вероятность «падающей»
      if (Math.random() < 0.01) {
        const fromTop = Math.random() < 0.5;
        const x = fromTop ? rand(width * 0.2, width * 0.8) : -20;
        const y = fromTop ? -20 : rand(height * 0.1, height * 0.4);
        const speed = rand(2.5, 4.2);
        shootings.push({
          x,
          y,
          vx: speed,
          vy: speed * rand(0.35, 0.6),
          life: 1,
        });
      }
    }

    function draw() {
      const context = ctxRef.current;
      if (!context) return;

      context.clearRect(0, 0, width, height);

      // Мягкие звёзды
      for (const s of stars) {
        if (s.breathing) s.phase += 0.01;
        const rr = s.r + (s.breathing ? Math.sin(s.phase) * 0.15 : 0);
        const glowR = rr * 4.2;

        const g = context.createRadialGradient(s.x, s.y, 0, s.x, s.y, glowR);
        g.addColorStop(0.0, "rgba(255,255,255,1)");
        g.addColorStop(0.35, "rgba(255,255,255,0.85)");
        g.addColorStop(1.0, "rgba(255,255,255,0)");

        context.fillStyle = g;
        context.beginPath();
        context.arc(s.x, s.y, glowR, 0, Math.PI * 2);
        context.fill();
      }

      // Падающие
      spawnShooting();
      shootings = shootings.filter((m) => m.life > 0);
      for (const m of shootings) {
        m.x += m.vx;
        m.y += m.vy;
        m.life -= 0.01;

        const trailLen = 80;
        const grad = context.createLinearGradient(
          m.x,
          m.y,
          m.x - m.vx * trailLen,
          m.y - m.vy * trailLen
        );
        grad.addColorStop(0, `rgba(255,255,255,${0.9 * m.life})`);
        grad.addColorStop(1, "rgba(255,255,255,0)");

        context.strokeStyle = grad;
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(m.x - m.vx * trailLen, m.y - m.vy * trailLen);
        context.lineTo(m.x, m.y);
        context.stroke();
      }
    }

    function loop() {
      draw();
      rafRef.current = window.requestAnimationFrame(loop);
    }

    // init
    resize();
    loop();
    window.addEventListener("resize", resize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      ctxRef.current = null;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`block w-full h-full ${className ?? ""}`}
      aria-hidden="true"
    />
  );
}
