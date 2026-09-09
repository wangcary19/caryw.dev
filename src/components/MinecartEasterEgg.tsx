/**
 * Small easter egg: a Minecraft-style minecart that rides across a rail track
 * at the top of an opened article.
 */
export default function MinecartEasterEgg() {
  return (
    <div className="minecart-scene" aria-hidden="true">
      <div className="minecart-rails" />
      <div className="minecart">
        <svg
          viewBox="0 0 16 12"
          width="24"
          height="18"
          shapeRendering="crispEdges"
        >
          {/* wheels */}
          <rect x="3" y="9" width="2" height="2" fill="#1c1c1c" />
          <rect x="11" y="9" width="2" height="2" fill="#1c1c1c" />
          {/* cart body */}
          <rect x="1" y="4" width="13" height="5" fill="#787878" />
          <rect x="1" y="4" width="13" height="2" fill="#8d8d8d" />
          {/* open-top interior */}
          <rect x="2" y="4" width="11" height="1" fill="#3a3a3a" />
          {/* outline */}
          <rect
            x="1"
            y="4"
            width="13"
            height="5"
            fill="none"
            stroke="#2f2f2f"
          />
          {/* front scoop */}
          <path d="M14 4 L16 2 L16 4 Z" fill="#787878" />
          <path d="M14 4 L16 2 L16 4 Z" fill="none" stroke="#2f2f2f" />
        </svg>
      </div>
    </div>
  );
}
