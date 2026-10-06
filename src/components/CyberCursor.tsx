"use client";
import { useEffect, useRef } from "react";
export default function CyberCursor() {
  const dot = useRef<HTMLSpanElement>(null), ring = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!fine.matches) return;
    let x = -100, y = -100, rx = x, ry = y, frame = 0;
    const move = (e: PointerEvent) => { x = e.clientX; y = e.clientY; document.body.classList.add("cursor-ready"); };
    const hover = (e: PointerEvent) => { if ((e.target as HTMLElement | null)?.closest("a,button,input,textarea,select,[role=button]")) document.body.classList.add("cursor-hover"); else document.body.classList.remove("cursor-hover"); };
    const animate = () => {
      rx += (x - rx) * .24; ry += (y - ry) * .24;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px,${y}px,0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      frame = requestAnimationFrame(animate);
    };
    window.addEventListener("pointermove", move, { passive: true }); window.addEventListener("pointerover", hover, { passive: true });
    animate();
    return () => { cancelAnimationFrame(frame); window.removeEventListener("pointermove", move); window.removeEventListener("pointerover", hover); document.body.classList.remove("cursor-ready","cursor-hover"); };
  }, []);
  return <div className="cursor-layer" aria-hidden="true"><span className="cursor-ring" ref={ring}/><span className="cursor-dot" ref={dot}/></div>;
}
