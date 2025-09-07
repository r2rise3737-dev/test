"use client";

import { useEffect, useRef } from "react";

export default function StarSkyLight() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = canvas.offsetWidth);
    let h = (canvas.height = canvas.offsetHeight);

    // 180 мягких «пылинок»
    const N = 180;
    const stars: { x: number; y: number; r: number; t: number; s: number }[] =
      Array.from({ length: N }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.4 + 0.6,
        t: Math.random() * Math.PI * 2,
        s: 0.004 + Math.random() * 0.008,
      }));

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        s.t += s.s;
        // мягкое «дыхание» яркости
        const intensity = 0.5 + Math.sin(s.t) * 0.25;

        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3.2);
        g.addColorStop(0, `rgba(255,255,255,${0.55 + intensity * 0.45})`);
        g.addColorStop(0.35, `rgba(255,255,255,${0.35 + intensity * 0.3})`);
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    draw();

    const onResize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
