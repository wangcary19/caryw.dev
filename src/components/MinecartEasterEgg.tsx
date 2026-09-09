/**
 * Small easter egg: a Minecraft-style minecart that rides across a rail track
 * at the top of an opened article.
 */
export default function MinecartEasterEgg() {
  return (
    <div className="minecart-scene" aria-hidden="true">
      <div className="minecart-rails" />
      <div className="minecart">
        <svg viewBox="0 0 48 24" width="48" height="24">
          {/* wheels */}
          <circle cx="12" cy="19" r="4.5" fill="#2f2f2f" />
          <circle cx="36" cy="19" r="4.5" fill="#2f2f2f" />
          <circle cx="12" cy="19" r="1.8" fill="#8a8a8a" />
          <circle cx="36" cy="19" r="1.8" fill="#8a8a8a" />
          {/* cart body */}
          <rect x="4" y="8" width="36" height="8" fill="#717171" />
          <rect x="4" y="8" width="36" height="3" fill="#8f8f8f" />
          <rect x="4" y="8" width="36" height="8" fill="none" stroke="#3a3a3a" strokeWidth="1" />
          {/* front scoop */}
          <path d="M40 8 L48 5 L48 8 Z" fill="#5f5f5f" />
          <path d="M40 8 L48 5 L48 8 Z" fill="none" stroke="#3a3a3a" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
}
