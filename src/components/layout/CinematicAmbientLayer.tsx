/**
 * Fixed full-viewport ambient orbs — pairs with `cinematic-motion.css`.
 */

export function CinematicAmbientLayer() {
  return (
    <div className="lux-cinematic-ambient" aria-hidden>
      <div className="lux-cinematic-ambient__orb lux-cinematic-ambient__orb--a" />
      <div className="lux-cinematic-ambient__orb lux-cinematic-ambient__orb--b" />
      <div className="lux-cinematic-ambient__orb lux-cinematic-ambient__orb--c" />
    </div>
  );
}
