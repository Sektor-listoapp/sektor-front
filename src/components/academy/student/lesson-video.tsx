import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExpand,
  faPause,
  faPlay,
  faVolumeHigh,
  faVolumeXmark,
} from "@fortawesome/free-solid-svg-icons";
import { formatDuration } from "../constants";

interface LessonVideoProps {
  src: string;
  /** Seconds already credited by the server (lets the student resume). */
  initialWatchedSeconds?: number;
  /** Fraction (0-1) of the video watched without skipping. */
  onProgress?: (fraction: number, watchedSeconds: number) => void;
  /** Sent on play, every ~5s while playing, on pause and on end. */
  onHeartbeat?: (positionSeconds: number) => void;
}

const HEARTBEAT_MS = 5_000;
/** Small slack so normal buffering jitter doesn't count as a skip. */
const SEEK_TOLERANCE = 1.5;

/**
 * Same rules as the app's player: only play/pause, no scrubbing forward.
 * The student can rewind, but can never jump past what they already watched.
 */
const LessonVideo = ({
  src,
  initialWatchedSeconds = 0,
  onProgress,
  onHeartbeat,
}: LessonVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const maxWatched = useRef(initialWatchedSeconds);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [watched, setWatched] = useState(initialWatchedSeconds);

  const onProgressRef = useRef(onProgress);
  const onHeartbeatRef = useRef(onHeartbeat);
  onProgressRef.current = onProgress;
  onHeartbeatRef.current = onHeartbeat;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const report = () => {
      if (video.duration > 0)
        onProgressRef.current?.(
          Math.min(1, maxWatched.current / video.duration),
          maxWatched.current
        );
    };

    const onLoaded = () => {
      setDuration(video.duration);
      // Resume where the server says the student got to.
      if (initialWatchedSeconds > 0 && initialWatchedSeconds < video.duration - 2) {
        video.currentTime = initialWatchedSeconds;
      }
      report();
    };
    const onTime = () => {
      const t = video.currentTime;
      setCurrent(t);
      // Only advance the watermark through continuous playback.
      if (!video.seeking && t <= maxWatched.current + SEEK_TOLERANCE && t > maxWatched.current) {
        maxWatched.current = t;
        setWatched(t);
        report();
      }
    };
    const onSeeking = () => {
      if (video.currentTime > maxWatched.current + SEEK_TOLERANCE) {
        video.currentTime = maxWatched.current;
      }
    };
    const onEnded = () => {
      maxWatched.current = video.duration;
      setWatched(video.duration);
      report();
      onHeartbeatRef.current?.(video.duration);
    };
    const onPlay = () => {
      setPlaying(true);
      // Gives the server a starting point, so short videos get credited.
      onHeartbeatRef.current?.(video.currentTime);
    };
    const onPause = () => {
      setPlaying(false);
      if (!video.ended) onHeartbeatRef.current?.(video.currentTime);
    };
    // Block playback-rate tricks (e.g. 16x from the devtools console).
    const onRate = () => {
      if (video.playbackRate > 2) video.playbackRate = 1;
    };

    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("seeking", onSeeking);
    video.addEventListener("ended", onEnded);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("ratechange", onRate);

    const heartbeat = window.setInterval(() => {
      if (!video.paused && !video.ended) onHeartbeatRef.current?.(video.currentTime);
    }, HEARTBEAT_MS);

    return () => {
      window.clearInterval(heartbeat);
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("seeking", onSeeking);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ratechange", onRate);
    };
  }, [src, initialWatchedSeconds]);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => undefined);
    else video.pause();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const fullscreen = () => {
    const el = wrapperRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => undefined);
    else el.requestFullscreen?.().catch(() => undefined);
  };

  const pct = duration ? (current / duration) * 100 : 0;
  const watchedPct = duration ? (watched / duration) * 100 : 0;

  return (
    <div ref={wrapperRef} className="relative bg-black rounded-xl overflow-hidden group">
      <video
        ref={videoRef}
        src={src}
        className="w-full max-h-[70vh] aspect-video bg-black"
        playsInline
        preload="metadata"
        controlsList="nodownload noplaybackrate"
        disablePictureInPicture
        onContextMenu={(e) => e.preventDefault()}
        onClick={toggle}
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-8 text-white">
        <div
          className="h-1.5 rounded-full bg-white/20 relative mb-3"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(watchedPct)}
          aria-label="Progreso del video"
        >
          <div className="absolute inset-y-0 left-0 bg-white/40 rounded-full" style={{ width: `${watchedPct}%` }} />
          <div className="absolute inset-y-0 left-0 bg-white rounded-full" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex items-center gap-4 text-sm">
          <button type="button" onClick={toggle} aria-label={playing ? "Pausar" : "Reproducir"}>
            <FontAwesomeIcon icon={playing ? faPause : faPlay} />
          </button>
          <button type="button" onClick={toggleMute} aria-label={muted ? "Activar sonido" : "Silenciar"}>
            <FontAwesomeIcon icon={muted ? faVolumeXmark : faVolumeHigh} />
          </button>
          <span className="tabular-nums">
            {formatDuration(current) || "00:00"} / {formatDuration(duration) || "00:00"}
          </span>
          <button type="button" onClick={fullscreen} aria-label="Pantalla completa" className="ml-auto">
            <FontAwesomeIcon icon={faExpand} />
          </button>
        </div>
      </div>
      {!playing && current === 0 && (
        <button
          type="button"
          onClick={toggle}
          aria-label="Reproducir"
          className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-white/90 text-blue-500 flex items-center justify-center"
        >
          <FontAwesomeIcon icon={faPlay} size="lg" />
        </button>
      )}
    </div>
  );
};

export default LessonVideo;
