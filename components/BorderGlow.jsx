"use client";

import { useCallback, useRef } from "react";
import "./BorderGlow.css";

function parseHSL(value) {
  const match = value.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) return { h: 194, s: 86, l: 74 };
  return { h: Number(match[1]), s: Number(match[2]), l: Number(match[3]) };
}

function buildGlowVars(glowColor, intensity) {
  const { h, s, l } = parseHSL(glowColor);
  const keys = ["", "-60", "-40", "-20", "-10"];
  const opacities = [100, 60, 40, 20, 10];
  return Object.fromEntries(
    keys.map((key, index) => [
      `--glow-color${key}`,
      `hsl(${h}deg ${s}% ${l}% / ${Math.min(opacities[index] * intensity, 100)}%)`,
    ]),
  );
}

export default function BorderGlow({
  children,
  className = "",
  edgeSensitivity = 24,
  glowColor = "194 86 74",
  borderRadius = 13,
  glowRadius = 18,
  glowIntensity = 0.72,
}) {
  const cardRef = useRef(null);

  const handlePointerMove = useCallback(
    (event) => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = x - cx;
      const dy = y - cy;
      const kx = dx === 0 ? Infinity : cx / Math.abs(dx);
      const ky = dy === 0 ? Infinity : cy / Math.abs(dy);
      const edge = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;

      card.style.setProperty("--edge-proximity", (edge * 100).toFixed(3));
      card.style.setProperty("--cursor-angle", `${angle < 0 ? angle + 360 : angle}deg`);
      card.style.setProperty("--pointer-x", `${x}px`);
      card.style.setProperty("--pointer-y", `${y}px`);
    },
    [],
  );

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      className={`border-glow-card ${className}`.trim()}
      style={{
        "--edge-sensitivity": edgeSensitivity,
        "--border-radius": `${borderRadius}px`,
        "--glow-padding": `${glowRadius}px`,
        ...buildGlowVars(glowColor, glowIntensity),
      }}
    >
      <span className="edge-light" aria-hidden="true" />
      <div className="border-glow-inner">{children}</div>
    </div>
  );
}
