"use client";
import { useEffect, useRef } from "react";

type NodePoint = { x: number; y: number; vx: number; vy: number; r: number };

/** Decorative, low-cost moving route map. It never represents live telemetry. */
export default function NetworkCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 700px)").matches;
    let width = 0, height = 0, frame = 0, tick = 0;
    const pointer = { x: 0, y: 0, active: false };
    let points: NodePoint[] = [];
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = rect.width; height = rect.height;
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.max(16, Math.min(mobile ? 32 : 64, Math.floor(width * height / 19000)));
      points = Array.from({ length: count }, (_, i) => ({
        x: ((i * 73.7 + 17) % 100) / 100 * width,
        y: ((i * 41.3 + 9) % 100) / 100 * height,
        vx: (((i * 13) % 11) - 5) * .035,
        vy: (((i * 7) % 9) - 4) * .035,
        r: i % 9 === 0 ? 2.1 : 1.2,
      }));
      pointer.x = width * .72; pointer.y = height * .48;
    };
    const pointMove = (e: PointerEvent) => { const rect=canvas.getBoundingClientRect(); pointer.x=e.clientX-rect.left; pointer.y=e.clientY-rect.top; pointer.active=true; };
    const pointLeave = () => { pointer.active=false; };
    const draw = () => {
      tick += reduced ? 0 : .003;
      ctx.clearRect(0, 0, width, height);
      const max = mobile ? 108 : 148;
      for (let i = 0; i < points.length; i++) {
        const a = points[i];
        if (!reduced) {
          a.x += a.vx; a.y += a.vy;
          if (pointer.active) {
            const dx=pointer.x-a.x, dy=pointer.y-a.y, d=Math.hypot(dx,dy);
            if (d<180 && d>1) { const pull=(1-d/180)*.065; a.vx+=dx/d*pull; a.vy+=dy/d*pull; }
          }
          a.vx*=.993; a.vy*=.993;
          if (a.x < 0 || a.x > width) a.vx *= -1;
          if (a.y < 0 || a.y > height) a.vy *= -1;
          a.x = Math.max(0, Math.min(width, a.x)); a.y = Math.max(0, Math.min(height, a.y));
        }
        for (let j = i + 1; j < points.length; j++) {
          const b = points[j], dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy);
          if (d < max) {
            const pulse = .35 + .65 * (Math.sin(tick * 3 + i * .41 + j * .13) * .5 + .5);
            const color = (i+j)%3===0 ? "112, 229, 255" : (i+j)%3===1 ? "178, 116, 255" : "255, 95, 183";
            ctx.strokeStyle = `rgba(${color}, ${(1 - d / max) * (.30 + (pointer.active ? 0.18 : 0)) * pulse})`;
            ctx.lineWidth = .75; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      points.forEach((p, i) => {
        const shimmer = .55 + .45 * Math.sin(tick * 4 + i * .8);
        const color = i%3===0 ? "112, 229, 255" : i%3===1 ? "178, 116, 255" : "255, 95, 183";
        ctx.fillStyle = i % 9 === 0 ? `rgba(245,248,255,${.8 * shimmer})` : `rgba(${color},${.62 * shimmer})`;
        ctx.shadowColor = `rgba(${color}, .7)`; ctx.shadowBlur = i%9===0 ? 9 : 4;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      });
      ctx.shadowBlur=0;
      // Small signal packets travel along stable curved routes, like a living map.
      if (!reduced) {
        for (let i = 0; i < 4; i++) {
          const phase = ((tick * .32 + i * .247) % 1);
          const x = width * (.54 + .24 * Math.cos(phase * Math.PI * 2 + i));
          const y = height * (.49 + .32 * Math.sin(phase * Math.PI * 2 + i * .7));
          const g = ctx.createRadialGradient(x, y, 0, x, y, 14);
          g.addColorStop(0, "rgba(239,245,255,.95)"); g.addColorStop(.16, i%2 ? "rgba(178,116,255,.55)" : "rgba(112,229,255,.55)"); g.addColorStop(1, "rgba(153,176,200,0)");
          ctx.fillStyle = g; ctx.fillRect(x - 14, y - 14, 28, 28);
        }
      }
      if (!reduced) frame = requestAnimationFrame(draw);
    };
    resize(); draw();
    window.addEventListener("resize", resize, { passive: true });
    canvas.addEventListener("pointermove",pointMove,{passive:true});canvas.addEventListener("pointerleave",pointLeave,{passive:true});
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize);canvas.removeEventListener("pointermove",pointMove);canvas.removeEventListener("pointerleave",pointLeave); };
  }, []);
  return <canvas ref={ref} className="network-canvas" aria-hidden="true" />;
}
