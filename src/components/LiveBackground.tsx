"use client";

import { useEffect, useState } from "react";

const IDLE_MS = 3000;

/**
 * High-res glacier photo with a faint, slow-moving holographic sheen layered
 * on top. The scene blurs and darkens while the user is interacting.
 *
 * Image: "Svitjordbreen on Svalbard calving" — photo by AWeith,
 * CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0),
 * via Wikimedia Commons. Served from /background.jpg (3840×2160).
 */
export default function LiveBackground() {
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
      className={`live-bg ${active ? "is-active" : ""}`}
      aria-hidden="true"
    >
      <div className="live-bg-scene">
        <div className="live-bg-image" />
        <div className="live-bg-sheen" />
      </div>
    </div>
  );
}
