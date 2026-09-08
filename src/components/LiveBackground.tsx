"use client";

import { useEffect, useState } from "react";

const IDLE_MS = 3000;

/**
 * macOS-style "dynamic wallpaper" background.
 *
 * Image: "Svitjordbreen on Svalbard calving" — photo by AWeith,
 * CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0),
 * via Wikimedia Commons. Served from /background.jpg (3840×2160).
 *
 * The same photo is re-graded to match the local time of day (dawn / day /
 * sunset / dusk / night). While the user is interacting, the scene is blurred
 * and darkened for readability; when idle, it's shown clean.
 */
export default function LiveBackground() {
  const [hidden, setHidden] = useState(false);
  const [idle, setIdle] = useState(false);
  const [phase, setPhase] = useState("day");

  const active = !hidden && !idle;

  useEffect(() => {
    const phaseFor = (h: number) => {
      if (h >= 5 && h < 8) return "dawn";
      if (h >= 8 && h < 16) return "day";
      if (h >= 16 && h < 19) return "sunset";
      if (h >= 19 && h < 21) return "dusk";
      return "night";
    };

    const updatePhase = () => setPhase(phaseFor(new Date().getHours()));
    updatePhase();
    const phaseTimer = setInterval(updatePhase, 60_000);

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
      clearInterval(phaseTimer);
      events.forEach((e) => window.removeEventListener(e, wake));
      document.removeEventListener("visibilitychange", onVisibility);
      if (idleTimer) clearTimeout(idleTimer);
    };
  }, []);

  return (
    <div
      className={`live-bg tod-${phase} ${active ? "is-active" : ""}`}
      aria-hidden="true"
    >
      <div className="live-bg-scene">
        <div className="live-bg-image" />
        <div className="live-bg-tint" />
      </div>
    </div>
  );
}
