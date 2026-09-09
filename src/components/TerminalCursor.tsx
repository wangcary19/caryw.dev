"use client";

import { useEffect, useRef } from "react";

type DocWithCaret = Document & {
  caretPositionFromPoint?: (
    x: number,
    y: number,
  ) => {
    offsetNode: Node;
    offset: number;
  } | null;
  caretRangeFromPoint?: (x: number, y: number) => Range | null;
};

/**
 * A blinking terminal-style block cursor that marks the last text position
 * the user clicked on.
 */
export default function TerminalCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const place = (x: number, y: number) => {
      const doc = document as DocWithCaret;
      let rect: DOMRect | null = null;

      if (doc.caretPositionFromPoint) {
        const pos = doc.caretPositionFromPoint(x, y);
        if (pos) {
          const range = document.createRange();
          range.setStart(pos.offsetNode, pos.offset);
          range.collapse(true);
          rect = range.getBoundingClientRect();
        }
      } else if (doc.caretRangeFromPoint) {
        const range = doc.caretRangeFromPoint(x, y);
        if (range) rect = range.getBoundingClientRect();
      }

      if (rect) {
        el.style.left = `${rect.left + window.scrollX}px`;
        el.style.top = `${rect.top + window.scrollY}px`;
        el.style.height = `${rect.height}px`;
        el.style.width = `${Math.max(4, rect.height * 0.6)}px`;
        el.classList.add("is-visible");
      }
    };

    const onClick = (e: MouseEvent) => place(e.clientX, e.clientY);

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return <div ref={ref} className="terminal-cursor" aria-hidden="true" />;
}
