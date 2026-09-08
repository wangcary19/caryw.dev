import TopoCanvas from "./TopoCanvas";

/**
 * Full-screen background: a WebGL topographic-map shader, with a high-res
 * glacier photo as the fallback when WebGL is unavailable.
 *
 * Photo fallback: "Svitjordbreen on Svalbard calving" — AWeith,
 * CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0),
 * via Wikimedia Commons. Served from /background.jpg (3840×2160).
 */
export default function LiveBackground() {
  return (
    <div className="live-bg" aria-hidden="true">
      <div className="live-bg-image" />
      <TopoCanvas className="live-bg-canvas" />
    </div>
  );
}
