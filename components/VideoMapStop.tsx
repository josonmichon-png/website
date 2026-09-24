"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MapPin, Maximize2, X } from "lucide-react";
import CometCard from "@/components/CometCard";

type VideoProject = {
  number: string;
  title: string;
  description: string;
  tags: string[];
  video: string;
  location: string;
  className: string;
};

export default function VideoMapStop({ project }: { project: VideoProject }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <article className={`map-stop ${project.className}`}>
        <CometCard
          className="map-photo-comet"
          ariaLabel={`${project.title}项目视频，点击放大观看`}
        >
          <button
            type="button"
            className="map-video-trigger"
            onClick={() => setOpen(true)}
            aria-label={`放大观看${project.title}`}
          >
            <div className="map-photo">
              <video
                src={project.video}
                aria-hidden="true"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
              <span>{project.number}</span>
              <span className="map-video-expand">
                <Maximize2 size={15} aria-hidden="true" />
                点击放大
              </span>
            </div>
          </button>
        </CometCard>
        <div className="map-copy">
          <p><MapPin size={14} strokeWidth={2.4} /> {project.location}</p>
          <h3>{project.title}</h3>
          <small>{project.description}</small>
          <ul aria-label="项目类别">
            {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
          </ul>
        </div>
      </article>

      {mounted && open && createPortal(
        <div
          className="video-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title}视频播放器`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div className="video-lightbox-panel">
            <div className="video-lightbox-header">
              <div>
                <span>{project.number} / AI VIDEO WORK</span>
                <strong>{project.title}</strong>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="关闭视频">
                <X size={24} />
              </button>
            </div>
            <video
              src={project.video}
              controls
              autoPlay
              playsInline
              preload="auto"
              controlsList="nodownload"
            />
            <div className="video-lightbox-meta">
              <span>{project.location}</span>
              <span>按 ESC 关闭</span>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
