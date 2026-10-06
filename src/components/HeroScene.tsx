"use client";
import { useState, type CSSProperties, type PointerEvent } from "react";

export default function HeroScene() {
  const [pulse, setPulse] = useState(false);
  function move(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    e.currentTarget.style.setProperty("--tilt-x", `${(0.5 - y) * 10}deg`);
    e.currentTarget.style.setProperty("--tilt-y", `${(x - 0.5) * 12}deg`);
    e.currentTarget.style.setProperty("--light-x", `${x * 100}%`);
    e.currentTarget.style.setProperty("--light-y", `${y * 100}%`);
  }
  function reset(e: PointerEvent<HTMLDivElement>) {
    e.currentTarget.style.setProperty("--tilt-x", "0deg");
    e.currentTarget.style.setProperty("--tilt-y", "0deg");
    e.currentTarget.style.setProperty("--light-x", "50%");
    e.currentTarget.style.setProperty("--light-y", "50%");
  }
  function pulseMap() {
    setPulse(true);
    window.setTimeout(() => setPulse(false), 1250);
  }
  return <div className={`hero-art neural-scene ${pulse ? "is-pulsing" : ""}`} onPointerMove={move} onPointerLeave={reset} aria-label="Interactive abstract research visualization">
    <div className="scene-glass"/>
    <div className="scene-ring scene-ring-a"/><div className="scene-ring scene-ring-b"/><div className="scene-ring scene-ring-c"/>
    <div className="scene-crosshair scene-crosshair-a"/><div className="scene-crosshair scene-crosshair-b"/>
    <div className="scene-core-wrap"><div className="scene-core">
      <div className="scene-liquid scene-liquid-a"/><div className="scene-liquid scene-liquid-b"/><div className="scene-liquid scene-liquid-c"/><div className="scene-core-shine"/>
    </div></div>
    <span className="scene-node scene-node-a"/><span className="scene-node scene-node-b"/><span className="scene-node scene-node-c"/><span className="scene-node scene-node-d"/>
    <div className="scene-label scene-label-a"><span>01 / SIGNAL</span><b>CYBERSECURITY</b></div>
    <div className="scene-label scene-label-b"><span>02 / SYSTEMS</span><b>RESEARCH + BUILD</b></div>
    <div className="scene-caption"><span>INTERACTIVE STUDY / NOT LIVE TELEMETRY</span><button onClick={pulseMap} aria-label="Pulse the research visualization">PULSE MAP <i>↗</i></button></div>
  </div>;
}
