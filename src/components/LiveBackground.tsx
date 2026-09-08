"use client";

import { useEffect, useState } from "react";
import { useReading } from "./reading-context";

const IDLE_MS = 3000;

/**
 * High-resolution "live wallpaper" background.
 *
 * Image: "Svitjordbreen on Svalbard calving" — photo by AWeith,
 * CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0),
 * via Wikimedia Commons. Served from /background.jpg (3840×2160).
 *
 * A slow Ken Burns pan/zoom gives it subtle motion like a macOS live photo.
 * Motion only runs while the tab is visible and the user is active, and the
 * image blurs gently when an article is expanded.
 */
export default function LiveBackground() {
  const { isReading } = useReading();
  const [hidden, setHidden] = useState(false);
  const [idle, setIdle] = useState(false);

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

  return (
    <div
      className={`live-bg ${isReading ? "is-blurred" : ""} ${active ? "is-live" : ""}`}
      aria-hidden="true"
    >
      <div className="live-bg-image" />
    </div>
  );
}
