"use client";

import { useCallback, useRef } from "react";
import "./CometCard.css";

export default function CometCard({ children, className = "", ariaLabel }) {
  const cardRef = useRef(null);

  const resetCard = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--comet-rx", "0deg");
    card.style.setProperty("--comet-ry", "0deg");
    card.style.setProperty("--comet-x", "50%");
    card.style.setProperty("--comet-y", "50%");
    card.style.setProperty("--comet-strength", "0");
  }, []);

  const handlePointerMove = useCallback((event) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = Math.min(Math.max(event.clientX - rect.left, 0), rect.width);
    const y = Math.min(Math.max(event.clientY - rect.top, 0), rect.height);
    const normalizedX = x / rect.width - 0.5;
    const normalizedY = y / rect.height - 0.5;

    card.style.setProperty("--comet-rx", `${(-normalizedY * 10).toFixed(2)}deg`);
    card.style.setProperty("--comet-ry", `${(normalizedX * 12).toFixed(2)}deg`);
    card.style.setProperty("--comet-x", `${((x / rect.width) * 100).toFixed(1)}%`);
    card.style.setProperty("--comet-y", `${((y / rect.height) * 100).toFixed(1)}%`);
    card.style.setProperty("--comet-strength", "1");
  }, []);

  return (
    <div
      ref={cardRef}
      className={`comet-card ${className}`.trim()}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetCard}
      onBlur={resetCard}
      tabIndex={0}
      aria-label={ariaLabel}
    >
      <div className="comet-card-surface">{children}</div>
      <span className="comet-card-glow" aria-hidden="true" />
    </div>
  );
}
