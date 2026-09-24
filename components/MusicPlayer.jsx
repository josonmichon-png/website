"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronRight,
  Heart,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import "./MusicPlayer.css";

const tracks = [
  {
    title: "赤と青",
    artist: "山田小姐",
    src: "/assets/aka-to-ao.m4a",
  },
  {
    title: "そのいのち",
    artist: "中村佳穂",
    src: "/assets/sono-inochi.m4a",
  },
];

const formatTime = (value) => {
  if (!Number.isFinite(value)) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export default function MusicPlayer() {
  const audioRef = useRef(null);
  const didMountTrackRef = useRef(false);
  const resumeOnTrackChangeRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [muted, setMuted] = useState(false);
  const [liked, setLiked] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [trackIndex, setTrackIndex] = useState(0);
  const track = tracks[trackIndex];

  const startPlayback = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return false;
    try {
      await audio.play();
      setPlaying(true);
      setBlocked(false);
      return true;
    } catch {
      setBlocked(true);
      return false;
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;
    audio.volume = 0.42;
    startPlayback();

    const resumeAfterGesture = () => {
      if (!audio.paused) return;
      startPlayback();
    };

    window.addEventListener("pointerdown", resumeAfterGesture, { once: true });
    window.addEventListener("keydown", resumeAfterGesture, { once: true });

    return () => {
      window.removeEventListener("pointerdown", resumeAfterGesture);
      window.removeEventListener("keydown", resumeAfterGesture);
    };
  }, [startPlayback]);

  useEffect(() => {
    if (!didMountTrackRef.current) {
      didMountTrackRef.current = true;
      return;
    }
    const audio = audioRef.current;
    if (!audio) return;
    audio.load();
    setCurrentTime(0);
    setDuration(0);
    if (resumeOnTrackChangeRef.current) startPlayback();
    resumeOnTrackChangeRef.current = false;
  }, [trackIndex, startPlayback]);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      await startPlayback();
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  const changeTrack = (amount, forcePlayback = false) => {
    const audio = audioRef.current;
    resumeOnTrackChangeRef.current = forcePlayback || Boolean(audio && !audio.paused);
    setTrackIndex((value) => (value + amount + tracks.length) % tracks.length);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <aside className={`music-player${collapsed ? " is-collapsed" : ""}`} aria-label="背景音乐播放器">
      <audio
        ref={audioRef}
        src={track.src}
        autoPlay
        preload="metadata"
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => changeTrack(1, true)}
      />

      <div className="music-player-tabs" aria-hidden="true">
        <span>MUSIC</span>
        <i>♪</i>
      </div>

      <button
        type="button"
        className="music-player-collapse"
        onClick={() => setCollapsed((value) => !value)}
        aria-label={collapsed ? "展开音乐播放器" : "收起音乐播放器"}
        aria-expanded={!collapsed}
      >
        {collapsed ? (
          <span className="music-player-expand-mark" aria-hidden="true">♪</span>
        ) : (
          <ChevronRight size={16} strokeWidth={3} />
        )}
      </button>

      <div className="music-player-body">
        <div className="music-player-title">
          <div>
            <strong>{track.title}</strong>
            <span>{track.artist} · {String(trackIndex + 1).padStart(2, "0")}/{String(tracks.length).padStart(2, "0")}</span>
          </div>
          <b>{playing ? "PLAY" : blocked ? "TAP" : "READY"}</b>
        </div>

        <input
          className="music-player-progress"
          type="range"
          min="0"
          max={duration || 0}
          step="0.1"
          value={currentTime}
          style={{ "--music-progress": `${progress}%` }}
          onChange={(event) => {
            const nextTime = Number(event.target.value);
            if (audioRef.current) audioRef.current.currentTime = nextTime;
            setCurrentTime(nextTime);
          }}
          aria-label="音乐播放进度"
        />

        <div className="music-player-time" aria-hidden="true">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        <div className="music-player-controls">
          <button type="button" onClick={toggleMute} aria-label={muted ? "开启声音" : "静音"}>
            {muted ? <VolumeX /> : <Volume2 />}
          </button>
          <button type="button" onClick={() => changeTrack(-1)} aria-label="上一首">
            <SkipBack />
          </button>
          <button className="music-player-play" type="button" onClick={togglePlayback} aria-label={playing ? "暂停" : "播放"}>
            {playing ? <Pause /> : <Play />}
          </button>
          <button type="button" onClick={() => changeTrack(1)} aria-label="下一首">
            <SkipForward />
          </button>
          <button
            type="button"
            className={liked ? "is-liked" : ""}
            onClick={() => setLiked((value) => !value)}
            aria-label={liked ? "取消喜欢" : "标记喜欢"}
            aria-pressed={liked}
          >
            <Heart />
          </button>
        </div>

        {blocked && <p className="music-player-notice">浏览器已拦截自动播放 · 点击页面开始</p>}
      </div>
    </aside>
  );
}
