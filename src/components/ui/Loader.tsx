import { useEffect, useMemo, type CSSProperties } from "react";
import "./Loader.css";

/**
 * Fullscreen loading overlay. Shows for as long as it is mounted -
 * used as the Suspense fallback while lazy route chunks download.
 */
const Loader = () => {
  // Lock scrolling while the loader covers the page
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow || "auto";
    };
  }, []);

  // Generate particles & shapes once per mount
  const { particles, shapes } = useMemo(() => {
    const particles = Array.from({ length: 25 }, (_, i) => {
      const style: CSSProperties = {
        left: `${Math.random() * 100}%`,
        animationDuration: `${3 + Math.random() * 4}s`,
        animationDelay: `${Math.random() * 2}s`,
      };
      return <div key={i} className="loader-particle" style={style} />;
    });

    const shapes = Array.from({ length: 8 }, (_, i) => {
      const size = 20 + Math.random() * 30;
      const style = {
        width: `${size}px`,
        height: `${size}px`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDuration: `${10 + Math.random() * 10}s`,
        animationDelay: `${Math.random() * 5}s`,
        "--size": `${size}px`, // For triangle calculation in CSS
      } as CSSProperties;
      const shapeType = Math.random() > 0.5 ? "square" : "triangle";

      return (
        <div
          key={i}
          className={`loader-shape loader-shape-${shapeType}`}
          style={style}
        />
      );
    });

    return { particles, shapes };
  }, []);

  return (
    <div className="loader-wrapper loader-fade-in">
      <div className="absolute inset-0 pointer-events-none">
        {particles}
        {shapes}
      </div>

      <div className="flex flex-col items-center justify-center relative z-10">
        <div className="loader-core">
          <div className="loader-hex-outer" />
          <div className="loader-hex-inner" />
          {/* Ripples */}
          <div className="loader-ripple" style={{ animationDelay: "0s" }} />
          <div className="loader-ripple" style={{ animationDelay: "0.5s" }} />
          <div className="loader-ripple" style={{ animationDelay: "1s" }} />
        </div>

        <div className="loader-text">LOADING</div>
        <div className="loader-progress" />
      </div>
    </div>
  );
};

export default Loader;
