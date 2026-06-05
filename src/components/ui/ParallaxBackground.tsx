import { useTheme } from "../../context/ThemeContext";

/* ────────────────────────────────────────────────────────────
 *  ParallaxBackground - TEMPORARY plain color fallback
 *  The full HD parallax implementation lives in git history
 *  (see ParallaxBackground.jsx prior to the TS migration)
 *  and will be restored in the next update.
 * ──────────────────────────────────────────────────────────── */

const ParallaxBackground = () => {
  const { isDarkMode } = useTheme();

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        backgroundColor: isDarkMode ? "#0a0f0d" : "#f4f7f6",
      }}
    />
  );
};

export default ParallaxBackground;
