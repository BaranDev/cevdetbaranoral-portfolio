import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useTheme } from "../../context/ThemeContext";

const CursorLightOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  transition: opacity 0.3s ease;
  opacity: ${(props) => (props.$isVisible ? 1 : 0)};

  background: ${(props) => {
    const { x, y, isDarkMode } = props;
    if (isDarkMode) {
      // Light source in dark mode - radial gradient with bright center
      return `radial-gradient(
        600px circle at ${x}px ${y}px,
        rgba(255, 255, 255, 0.06) 0%,
        rgba(255, 255, 255, 0.03) 20%,
        rgba(255, 255, 255, 0.01) 40%,
        rgba(255, 255, 255, 0.005) 60%,
        transparent 80%
      )`;
    } else {
      // No effect in light mode
      return "transparent";
    }
  }};
`;

const CursorGlow = styled.div`
  position: fixed;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  pointer-events: none;
  z-index: 10;
  transform: translate(-50%, -50%);
  transition: all 0.1s ease;
  left: ${(props) => props.x}px;
  top: ${(props) => props.y}px;

  background: ${(props) =>
    props.isDarkMode
      ? `radial-gradient(
        circle,
        rgba(75, 112, 226, 0.4) 0%,
        rgba(75, 112, 226, 0.2) 30%,
        rgba(75, 112, 226, 0.1) 60%,
        transparent 100%
      )`
      : "transparent"};

  box-shadow: ${(props) =>
    props.isDarkMode
      ? `0 0 20px rgba(75, 112, 226, 0.3), 0 0 40px rgba(75, 112, 226, 0.1)`
      : "none"};
`;

const EnhancedElements = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;

  &::before {
    content: "";
    position: absolute;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    left: ${(props) => props.x - 50}px;
    top: ${(props) => props.y - 50}px;
    transition: all 0.2s ease;

    background: ${(props) =>
      props.isDarkMode
        ? `radial-gradient(
           circle,
           rgba(75, 112, 226, 0.08) 0%,
           rgba(155, 170, 207, 0.04) 50%,
           transparent 100%
         )`
        : "transparent"};
  }
`;

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
      navigator.userAgent
    );
  if (isMobile) return null;

  return (
    <>
      {isDarkMode && (
        <>
          <CursorLightOverlay
            x={cursorPosition.x}
            y={cursorPosition.y}
            isDarkMode={isDarkMode}
            $isVisible={isVisible}
          />

          {isVisible && (
            <>
              <CursorGlow
                x={cursorPosition.x}
                y={cursorPosition.y}
                isDarkMode={isDarkMode}
              />

              <EnhancedElements
                x={cursorPosition.x}
                y={cursorPosition.y}
                isDarkMode={isDarkMode}
              />
            </>
          )}
        </>
      )}
    </>
  );
};

export default CursorLight;
