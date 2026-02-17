import React, { useState, useEffect } from "react";
import "./Loader.css";

const Loader = ({ minDisplayTime = 1000 }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const startTime = Date.now();

    const cleanup = () => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

      setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          document.body.style.overflow = "auto";
        }, 500);
      }, remainingTime);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("load", cleanup);
    const fallbackTimeout = setTimeout(cleanup, 3000);

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("load", cleanup);
      clearTimeout(fallbackTimeout);
    };
  }, [minDisplayTime]);

  if (isExiting) {
    // We animate out by adding a class, then return null after timeout handled in useEffect
    // But since this component returns null immediately when isExiting is true in original code (wait, original checks isExiting at top but animation logic suggests it stays to animate out?)
    // Original code: if (isExiting) return null; -> This means NO fade out animation was actually visible unless logic was different.
    // Ah, wait. `isExiting` sets `fadeOut` animation on wrapper. BUT line 333 says `if (isExiting) return null`.
    // This implies the fadeOut animation in the original styled component was NEVER used.
    // I will replicate this behavior: return null immediately.
    document.body.style.overflow = "auto";
    return null;
  }

  // Generate particles
  const particles = Array.from({ length: 25 }, (_, i) => {
    const style = {
      left: `${Math.random() * 100}%`,
      animationDuration: `${3 + Math.random() * 4}s`,
      animationDelay: `${Math.random() * 2}s`,
    };
    return <div key={i} className="loader-particle" style={style} />;
  });

  // Generate geometric shapes
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
    };
    const shapeType = Math.random() > 0.5 ? "square" : "triangle";

    return (
      <div
        key={i}
        className={`loader-shape loader-shape-${shapeType}`}
        style={style}
      />
    );
  });

  return (
    <div
      className={`loader-wrapper ${isExiting ? "loader-fade-out" : "loader-fade-in"}`}
    >
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

        <div className="loader-text">INITIALIZING</div>
        <div className="loader-progress" />
      </div>
    </div>
  );
};

export default Loader;
