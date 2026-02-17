import { useTheme } from "../../context/ThemeContext";

/* ────────────────────────────────────────────────────────────
 *  ParallaxBackground — TEMPORARY plain color fallback
 *  The full HD parallax implementation is commented out below
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

/* =================================================================
 *  COMMENTED OUT — HD Parallax (to be restored next update)
 * =================================================================
 *
 * import { useEffect, useRef } from "react";
 * import { useTheme } from "../../context/ThemeContext";
 *
 * const IMG_W = 6144;
 * const IMG_H = 11008;
 * const IMG_RATIO = IMG_H / IMG_W; // ≈ 1.792
 *
 * const LAYER1_RATE = 1.0;
 * const LAYER2_RATE = 0.55;
 *
 * const LAYER1_OPACITY_DARK = 0.42;
 * const LAYER1_OPACITY_LIGHT = 0.28;
 * const LAYER2_OPACITY_DARK = 0.35;
 * const LAYER2_OPACITY_LIGHT = 0.18;
 *
 * const ParallaxBackground = () => {
 *   const { isDarkMode } = useTheme();
 *   const layer1WrapRef = useRef(null);
 *   const layer2WrapRef = useRef(null);
 *   const rafId = useRef(null);
 *
 *   useEffect(() => {
 *     const prefersReduced =
 *       window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 *     let ticking = false;
 *
 *     const update = () => {
 *       ticking = false;
 *       if (prefersReduced) return;
 *       const scrollY = window.scrollY;
 *       const maxScroll =
 *         document.documentElement.scrollHeight - window.innerHeight;
 *       if (maxScroll <= 0) return;
 *       const progress = Math.min(scrollY / maxScroll, 1);
 *       const vw = window.innerWidth;
 *       const vh = window.innerHeight;
 *       const imgDisplayH = vw * IMG_RATIO;
 *       const maxTravel = imgDisplayH - vh;
 *       if (maxTravel <= 0) return;
 *
 *       const y1 = -(progress * maxTravel * LAYER1_RATE);
 *       if (layer1WrapRef.current) {
 *         layer1WrapRef.current.style.transform = `translate3d(0, ${y1}px, 0)`;
 *       }
 *       const y2 = -(progress * maxTravel * LAYER2_RATE);
 *       if (layer2WrapRef.current) {
 *         layer2WrapRef.current.style.transform = `translate3d(0, ${y2}px, 0)`;
 *       }
 *     };
 *
 *     const onScroll = () => {
 *       if (!ticking) {
 *         rafId.current = requestAnimationFrame(update);
 *         ticking = true;
 *       }
 *     };
 *
 *     window.addEventListener("scroll", onScroll, { passive: true });
 *     window.addEventListener("resize", onScroll, { passive: true });
 *     update();
 *
 *     return () => {
 *       window.removeEventListener("scroll", onScroll);
 *       window.removeEventListener("resize", onScroll);
 *       if (rafId.current) cancelAnimationFrame(rafId.current);
 *     };
 *   }, []);
 *
 *   const layer1Src = isDarkMode
 *     ? "/parallax/layer1-dark.png"
 *     : "/parallax/layer1-light.png";
 *   const layer2Src = isDarkMode
 *     ? "/parallax/layer2-dark.png"
 *     : "/parallax/layer2-light.png";
 *   const imgHeight = `calc(100vw * ${IMG_RATIO})`;
 *
 *   return (
 *     <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
 *       <div
 *         ref={layer2WrapRef}
 *         className="absolute top-0 left-0 w-full will-change-transform"
 *         style={{
 *           zIndex: 0,
 *           height: imgHeight,
 *           opacity: isDarkMode ? LAYER2_OPACITY_DARK : LAYER2_OPACITY_LIGHT,
 *         }}
 *       >
 *         <div
 *           className="absolute inset-0"
 *           style={{
 *             backgroundImage: `url(${layer2Src})`,
 *             backgroundSize: "100% auto",
 *             backgroundPosition: "top center",
 *             backgroundRepeat: "no-repeat",
 *           }}
 *         />
 *       </div>
 *       <div
 *         ref={layer1WrapRef}
 *         className="absolute top-0 left-0 w-full will-change-transform mix-blend-screen"
 *         style={{
 *           zIndex: 1,
 *           height: imgHeight,
 *           opacity: isDarkMode ? LAYER1_OPACITY_DARK : LAYER1_OPACITY_LIGHT,
 *         }}
 *       >
 *         <div
 *           className="absolute inset-0"
 *           style={{
 *             backgroundImage: `url(${layer1Src})`,
 *             backgroundSize: "100% auto",
 *             backgroundPosition: "top center",
 *             backgroundRepeat: "no-repeat",
 *           }}
 *         />
 *       </div>
 *     </div>
 *   );
 * };
 *
 * export default ParallaxBackground;
 *
 * ================================================================= */
