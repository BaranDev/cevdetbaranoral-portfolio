import React, { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";

const CursorLight = () => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    let isInitialized = false;

    const handleMouseMove = (e) => {
      if (!isInitialized) {
        setIsVisible(true);
        isInitialized = true;
      }

      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      if (isInitialized) {
        setIsVisible(true);
      }
    };

    // Add event listeners
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    // Cleanup
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  // Don't render on mobile devices
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
  if (isMobile) return null;

  if (!isDarkMode) return null;

  return (
    <>
      <div
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-10 transition-opacity duration-300 ease-out"
        style={{
          opacity: isVisible ? 1 : 0,
          background: `radial-gradient(
            600px circle at ${cursorPosition.x}px ${cursorPosition.y}px,
            rgba(255, 255, 255, 0.06) 0%,
            rgba(255, 255, 255, 0.03) 20%,
            rgba(255, 255, 255, 0.01) 40%,
            rgba(255, 255, 255, 0.005) 60%,
            transparent 80%
          )`,
        }}
      />

      {isVisible && (
        <>
          <div
            className="fixed w-5 h-5 rounded-full pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-100 ease-out"
            style={{
              left: cursorPosition.x,
              top: cursorPosition.y,
              background: `radial-gradient(
                circle,
                rgba(75, 112, 226, 0.4) 0%,
                rgba(75, 112, 226, 0.2) 30%,
                rgba(75, 112, 226, 0.1) 60%,
                transparent 100%
              )`,
              boxShadow: `0 0 20px rgba(75, 112, 226, 0.3), 0 0 40px rgba(75, 112, 226, 0.1)`,
            }}
          />

          <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-20">
            <div
              className="absolute w-[100px] h-[100px] rounded-full transition-all duration-200 ease-out"
              style={{
                left: cursorPosition.x - 50,
                top: cursorPosition.y - 50,
                background: `radial-gradient(
                  circle,
                  rgba(75, 112, 226, 0.08) 0%,
                  rgba(155, 170, 207, 0.04) 50%,
                  transparent 100%
                )`,
              }}
            />
          </div>
        </>
      )}
    </>
  );
};

export default CursorLight;
