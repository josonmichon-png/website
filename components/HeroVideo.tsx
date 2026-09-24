"use client";

import { useEffect, useRef, useState } from "react";

const FADE_SECONDS = 0.48;
const FADE_MS = FADE_SECONDS * 1000;
const VIDEO_SRC = "/assets/hero-flight-wan.mp4?v=20260906-3";

export default function HeroVideo() {
  const firstRef = useRef<HTMLVideoElement>(null);
  const secondRef = useRef<HTMLVideoElement>(null);
  const [visibleVideo, setVisibleVideo] = useState<0 | 1>(0);

  useEffect(() => {
    const videos = [firstRef.current, secondRef.current];
    if (!videos[0] || !videos[1]) return;

    let activeIndex: 0 | 1 = 0;
    let isCrossfading = false;
    let animationFrame = 0;
    let fadeTimer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    videos.forEach((video) => {
      if (!video) return;
      video.muted = true;
      video.defaultMuted = true;
    });

    const crossfade = async () => {
      if (isCrossfading || cancelled) return;

      const current = videos[activeIndex];
      const nextIndex: 0 | 1 = activeIndex === 0 ? 1 : 0;
      const next = videos[nextIndex];
      if (!current || !next) return;

      isCrossfading = true;
      next.currentTime = 0;

      try {
        await next.play();
      } catch {
        isCrossfading = false;
        return;
      }

      if (cancelled) return;
      setVisibleVideo(nextIndex);

      fadeTimer = setTimeout(() => {
        current.pause();
        current.currentTime = 0;
        activeIndex = nextIndex;
        isCrossfading = false;
      }, FADE_MS);
    };

    const watchLoopPoint = () => {
      const current = videos[activeIndex];
      if (
        current &&
        Number.isFinite(current.duration) &&
        current.duration > 0 &&
        current.currentTime >= current.duration - FADE_SECONDS
      ) {
        void crossfade();
      }
      animationFrame = window.requestAnimationFrame(watchLoopPoint);
    };

    void videos[0].play().catch(() => undefined);
    animationFrame = window.requestAnimationFrame(watchLoopPoint);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(animationFrame);
      if (fadeTimer) clearTimeout(fadeTimer);
      videos.forEach((video) => video?.pause());
    };
  }, []);

  return (
    <div className="hero-video-stack" aria-hidden="true">
      <video
        ref={firstRef}
        className={`flight-sky${visibleVideo === 0 ? " is-visible" : ""}`}
        src={VIDEO_SRC}
        poster="/assets/hero-flight-poster-v2.png"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
      />
      <video
        ref={secondRef}
        className={`flight-sky${visibleVideo === 1 ? " is-visible" : ""}`}
        src={VIDEO_SRC}
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
      />
    </div>
  );
}
