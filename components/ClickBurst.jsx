"use client";

import { useEffect, useState } from "react";

import "./ClickBurst.css";

const GLYPHS = ["✦", "●", "+", "✦", "●", "+", "✦", "●"];

export default function ClickBurst() {
  const [bursts, setBursts] = useState([]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return undefined;

    const onPointerDown = (event) => {
      if (event.button !== 0) return;
      const id = `${Date.now()}-${Math.random()}`;
      setBursts((current) => [...current.slice(-5), { id, x: event.clientX, y: event.clientY }]);
      window.setTimeout(() => {
        setBursts((current) => current.filter((burst) => burst.id !== id));
      }, 760);
    };

    document.addEventListener("pointerdown", onPointerDown, { passive: true });
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return (
    <div className="click-burst-layer" aria-hidden="true">
      {bursts.map((burst) => (
        <span
          className="click-burst"
          key={burst.id}
          style={{ left: `${burst.x}px`, top: `${burst.y}px` }}
        >
          <i className="click-burst-ring" />
          {GLYPHS.map((glyph, index) => (
            <i
              className="click-burst-particle"
              key={`${burst.id}-${index}`}
              style={{
                "--burst-angle": `${index * 45}deg`,
                "--burst-angle-back": `${index * -45}deg`,
                "--burst-distance": `${52 + index * 2}px`,
              }}
            >
              {glyph}
            </i>
          ))}
        </span>
      ))}
    </div>
  );
}
