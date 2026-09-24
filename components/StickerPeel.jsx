"use client";

import { useEffect, useId, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import "./StickerPeel.css";

gsap.registerPlugin(Draggable);

export default function StickerPeel({
  imageSrc,
  rotate = 0,
  peelBackHoverPct = 18,
  peelBackActivePct = 34,
  width = 150,
  shadowIntensity = 0.38,
  lightingIntensity = 0.08,
  peelDirection = 0,
  className = "",
}) {
  const containerRef = useRef(null);
  const dragTargetRef = useRef(null);
  const pointLightRef = useRef(null);
  const pointLightFlippedRef = useRef(null);
  const rawId = useId().replace(/:/g, "");
  const ids = useMemo(
    () => ({
      light: `sticker-light-${rawId}`,
      flipped: `sticker-flipped-${rawId}`,
      shadow: `sticker-shadow-${rawId}`,
      fill: `sticker-fill-${rawId}`,
    }),
    [rawId],
  );

  useEffect(() => {
    const target = dragTargetRef.current;
    const bounds = target?.parentNode;
    if (!target || !bounds) return undefined;

    const draggable = Draggable.create(target, {
      type: "x,y",
      bounds,
      onDrag() {
        const tilt = gsap.utils.clamp(-18, 18, this.deltaX * 0.35);
        gsap.to(target, { rotation: tilt, duration: 0.14, ease: "power1.out" });
      },
      onDragEnd() {
        gsap.to(target, { rotation: 0, duration: 0.65, ease: "power2.out" });
      },
    })[0];

    const update = () => draggable.update(true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      draggable.kill();
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const updateLight = (event) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      gsap.set(pointLightRef.current, { attr: { x, y } });
      gsap.set(pointLightFlippedRef.current, { attr: { x, y: rect.height - y } });
    };
    const touchOn = () => container.classList.add("touch-active");
    const touchOff = () => container.classList.remove("touch-active");

    container.addEventListener("pointermove", updateLight);
    container.addEventListener("touchstart", touchOn, { passive: true });
    container.addEventListener("touchend", touchOff);
    container.addEventListener("touchcancel", touchOff);
    return () => {
      container.removeEventListener("pointermove", updateLight);
      container.removeEventListener("touchstart", touchOn);
      container.removeEventListener("touchend", touchOff);
      container.removeEventListener("touchcancel", touchOff);
    };
  }, []);

  const cssVars = {
    "--sticker-rotate": `${rotate}deg`,
    "--sticker-peelback-hover": `${peelBackHoverPct}%`,
    "--sticker-peelback-active": `${peelBackActivePct}%`,
    "--sticker-width": `${width}px`,
    "--peel-direction": `${peelDirection}deg`,
  };

  return (
    <div className={`draggable-sticker ${className}`.trim()} ref={dragTargetRef} style={cssVars}>
      <svg width="0" height="0" aria-hidden="true">
        <defs>
          <filter id={ids.light}>
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feSpecularLighting in="blur" result="spec" specularExponent="100" specularConstant={lightingIntensity} lightingColor="white">
              <fePointLight ref={pointLightRef} x="100" y="100" z="300" />
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceGraphic" result="lit" />
            <feComposite in="lit" in2="SourceAlpha" operator="in" />
          </filter>
          <filter id={ids.flipped}>
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feSpecularLighting in="blur" result="spec" specularExponent="90" specularConstant={lightingIntensity * 6} lightingColor="white">
              <fePointLight ref={pointLightFlippedRef} x="100" y="100" z="300" />
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceGraphic" result="lit" />
            <feComposite in="lit" in2="SourceAlpha" operator="in" />
          </filter>
          <filter id={ids.shadow}>
            <feDropShadow dx="2" dy="5" stdDeviation={3 * shadowIntensity} floodColor="#00385d" floodOpacity={shadowIntensity} />
          </filter>
          <filter id={ids.fill}>
            <feFlood floodColor="#b7c4cc" result="flood" />
            <feComposite operator="in" in="flood" in2="SourceAlpha" />
          </filter>
        </defs>
      </svg>
      <div
        className="sticker-peel-container"
        ref={containerRef}
        style={{
          "--sticker-light-filter": `url(#${ids.light})`,
          "--sticker-flipped-filter": `url(#${ids.flipped})`,
          "--sticker-shadow-filter": `url(#${ids.shadow})`,
          "--sticker-fill-filter": `url(#${ids.fill})`,
        }}
      >
        <div className="sticker-main">
          <div className="sticker-lighting">
            <img src={imageSrc} alt="" className="sticker-image" draggable="false" />
          </div>
        </div>
        <div className="sticker-flap">
          <div className="sticker-flap-lighting">
            <img src={imageSrc} alt="" className="sticker-flap-image" draggable="false" />
          </div>
        </div>
      </div>
    </div>
  );
}
