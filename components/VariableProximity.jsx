"use client";

import { forwardRef, useEffect, useMemo, useRef } from "react";
import { motion } from "motion/react";
import "./VariableProximity.css";

function useAnimationFrame(callback) {
  useEffect(() => {
    let frameId;
    const loop = () => {
      callback();
      frameId = window.requestAnimationFrame(loop);
    };
    frameId = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(frameId);
  }, [callback]);
}

function usePointerPositionRef(containerRef) {
  const positionRef = useRef({ x: -10000, y: -10000 });

  useEffect(() => {
    const updatePosition = (x, y) => {
      const container = containerRef?.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      positionRef.current = { x: x - rect.left, y: y - rect.top };
    };
    const handlePointerMove = (event) => updatePosition(event.clientX, event.clientY);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [containerRef]);

  return positionRef;
}

const VariableProximity = forwardRef(function VariableProximity(
  {
    label = "",
    fromFontVariationSettings = "'wght' 400, 'opsz' 9",
    toFontVariationSettings = "'wght' 950, 'opsz' 40",
    containerRef,
    radius = 180,
    falloff = "linear",
    className = "",
    style,
    ...restProps
  },
  ref,
) {
  const letterRefs = useRef([]);
  const pointerPositionRef = usePointerPositionRef(containerRef);
  const lastPositionRef = useRef({ x: null, y: null });
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const parsedSettings = useMemo(() => {
    const parseSettings = (settings) =>
      new Map(
        settings.split(",").map((setting) => {
          const [name, value] = setting.trim().split(/\s+/);
          return [name.replace(/["']/g, ""), Number.parseFloat(value)];
        }),
      );
    const fromSettings = parseSettings(fromFontVariationSettings);
    const toSettings = parseSettings(toFontVariationSettings);
    return Array.from(fromSettings.entries()).map(([axis, fromValue]) => ({
      axis,
      fromValue,
      toValue: toSettings.get(axis) ?? fromValue,
    }));
  }, [fromFontVariationSettings, toFontVariationSettings]);

  useAnimationFrame(() => {
    const container = containerRef?.current;
    if (!container || reducedMotionRef.current) return;
    const { x, y } = pointerPositionRef.current;
    if (lastPositionRef.current.x === x && lastPositionRef.current.y === y) return;
    lastPositionRef.current = { x, y };
    const containerRect = container.getBoundingClientRect();

    letterRefs.current.forEach((letter) => {
      if (!letter) return;
      const rect = letter.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2 - containerRect.left;
      const centerY = rect.top + rect.height / 2 - containerRect.top;
      const distance = Math.hypot(x - centerX, y - centerY);
      const normalized = Math.min(Math.max(1 - distance / radius, 0), 1);
      const amount = falloff === "exponential"
        ? normalized ** 2
        : falloff === "gaussian"
          ? Math.exp(-((distance / (radius / 2)) ** 2) / 2)
          : normalized;

      const settings = parsedSettings
        .map(({ axis, fromValue, toValue }) =>
          `'${axis}' ${fromValue + (toValue - fromValue) * amount}`,
        )
        .join(", ");
      letter.style.fontVariationSettings = settings;
      letter.style.setProperty("--proximity", amount.toFixed(3));
    });
  });

  const words = label.split(" ");
  let letterIndex = 0;

  return (
    <span
      ref={ref}
      className={`variable-proximity ${className}`.trim()}
      style={{ display: "inline", ...style }}
      {...restProps}
    >
      {words.map((word, wordIndex) => (
        <span className="variable-proximity-word" key={`${word}-${wordIndex}`}>
          {Array.from(word).map((letter) => {
            const currentIndex = letterIndex++;
            return (
              <motion.span
                className="variable-proximity-letter"
                key={`${letter}-${currentIndex}`}
                ref={(element) => {
                  letterRefs.current[currentIndex] = element;
                }}
                aria-hidden="true"
              >
                {letter}
              </motion.span>
            );
          })}
          {wordIndex < words.length - 1 && <span aria-hidden="true">&nbsp;</span>}
        </span>
      ))}
      <span className="variable-proximity-sr-only">{label}</span>
    </span>
  );
});

export default VariableProximity;
