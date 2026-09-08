/**
 * Full-screen holographic blue background: a dark base with three blurred
 * "gel" blobs that drift slowly and cycle through the color spectrum.
 * Pure CSS — see .holo-bg / .holo-blob styles in globals.css.
 */
export default function BlueHaze() {
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
