"use client";

import { useEffect, useRef } from "react";

/**
 * Fixed, full-screen background that paints layered blue gradients and a soft
 * "haze" glow that drifts toward the cursor. The glow's shade shifts with the
 * horizontal cursor position (deep blue on the left, cyan-blue on the right).
 */
export default function BlueHaze() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    window.addEventListener("mousemove", onMove);

    let raf = 0;
    const tick = () => {
      // Ease toward the cursor for a soft, hazy drift instead of a hard jump.
      x += (targetX - x) * 0.06;
      y += (targetY - y) * 0.06;

      const t = x / window.innerWidth; // 0 (left) → 1 (right)
      const hue = 205 + t * 25; // shift from deep blue toward cyan-blue

      el.style.background = [
        `radial-gradient(900px circle at ${x}px ${y}px, hsla(${hue}, 90%, 62%, 0.26), transparent 70%)`,
        `radial-gradient(520px circle at ${x}px ${y}px, hsla(${hue + 15}, 95%, 74%, 0.16), transparent 60%)`,
        "linear-gradient(180deg, #08111f 0%, #0d1c36 45%, #0a1830 100%)",
      ].join(", ");

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} aria-hidden className="blue-haze" />;
}
