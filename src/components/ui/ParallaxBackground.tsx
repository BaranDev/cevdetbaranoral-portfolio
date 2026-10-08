/* ────────────────────────────────────────────────────────────
 *  ParallaxBackground - TEMPORARY plain color fallback
 *  The full HD parallax implementation lives in git history
 *  (see ParallaxBackground.jsx prior to the TS migration)
 *  and will be restored in the next update.
 * ──────────────────────────────────────────────────────────── */

const ParallaxBackground = () => (
  <div
    className="fixed inset-0 pointer-events-none z-0"
    style={{ backgroundColor: "var(--color-background)" }}
  />
);

export default ParallaxBackground;
