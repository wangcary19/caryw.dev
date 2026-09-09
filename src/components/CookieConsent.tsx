"use client";

import { useEffect, useState } from "react";

const CONSENT_KEY = "cookie_consent";

function track() {
  fetch("/api/track", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      page: window.location.pathname,
      screen: `${window.screen.width}x${window.screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }),
  }).catch(() => {});
}

/**
 * Small cookie-consent popup (bottom-left). Analytics only fires after the
 * user accepts.
 */
export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored === "accepted") {
      track();
      return;
    }
    if (!stored) {
      const id = requestAnimationFrame(() => setShow(true));
      return () => cancelAnimationFrame(id);
    }
  }, []);

  const choose = (value: "accepted" | "declined") => {
    localStorage.setItem(CONSENT_KEY, value);
    setShow(false);
    if (value === "accepted") track();
  };

  if (!show) return null;

  return (
    <div className="cookie-popup" role="dialog" aria-label="Cookie policy">
      <p>
        This site uses cookies to measure traffic and improve the experience.
      </p>
      <div className="cookie-actions">
        <button type="button" onClick={() => choose("accepted")}>
          Accept
        </button>
        <button type="button" onClick={() => choose("declined")}>
          Decline
        </button>
      </div>
    </div>
  );
}
