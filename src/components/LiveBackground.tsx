"use client";

import { useEffect, useRef, useState } from "react";
import { useReading } from "./reading-context";

const VIDEO_SRC = "/background.mp4";
const IDLE_MS = 3000;

/**
 * Live video background (like a macOS live wallpaper). Plays only while the
 * tab is visible and the user is active; pauses after IDLE_MS of inactivity.
 * Blurs gently when an article is expanded.
 */
export default function LiveBackground() {
  const { isReading } = useReading();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hidden, setHidden] = useState(false);
  const [idle, setIdle] = useState(false);
  const [failed, setFailed] = useState(false);

  const active = !hidden && !idle;

  useEffect(() => {
    let idleTimer: ReturnType<typeof setTimeout> | undefined;

    const onVisibility = () => setHidden(document.hidden);
    const wake = () => {
      setIdle(false);
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => setIdle(true), IDLE_MS);
    };

    const events = ["mousemove", "mousedown", "keydown", "touchmove", "wheel"];
    events.forEach((e) => window.addEventListener(e, wake, { passive: true }));
    document.addEventListener("visibilitychange", onVisibility);

    wake();

    return () => {
      events.forEach((e) => window.removeEventListener(e, wake));
      document.removeEventListener("visibilitychange", onVisibility);
      if (idleTimer) clearTimeout(idleTimer);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (active) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [active]);

  return (
    <div
      className={`live-bg ${isReading ? "is-blurred" : ""}`}
      aria-hidden="true"
    >
      {!failed && (
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          onError={() => setFailed(true)}
          className="live-bg-video"
        />
      )}
    </div>
  );
}
