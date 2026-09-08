/**
 * Holographic background: a dark base with drifting, hue-cycling color blobs.
 * Pure CSS (see .holo-* styles in globals.css) — no WebGL, no per-pixel work.
 */
export default function LiveBackground() {
  return (
    <div className="holo-bg" aria-hidden="true">
      <div className="holo-blobs">
        <div className="holo-blob blob-1" />
        <div className="holo-blob blob-2" />
        <div className="holo-blob blob-3" />
      </div>
    </div>
  );
}
