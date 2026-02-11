import React, { useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { useTheme } from "../../context/ThemeContext";

// Floating animation for fireflies
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.8; }
  25% { transform: translateY(-20px) translateX(10px); opacity: 1; }
  50% { transform: translateY(-10px) translateX(-15px); opacity: 0.6; }
  75% { transform: translateY(-30px) translateX(5px); opacity: 1; }
`;

// Gentle sway for trees
const swayAnimation = keyframes`
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(1deg); }
`;

// Twinkling stars
const twinkleAnimation = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
`;

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
  background: linear-gradient(
    to bottom,
    ${(props) => props.theme.colors.background} 0%,
    ${(props) => (props.$isDarkMode ? "#0f1f0f" : "#a8c69a")} 100%
  );
`;

const TreeLayer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 60'%3E%3Cg fill='%23${(
    props,
  ) =>
    props.$isDarkMode
      ? "1a3d1a"
      : "2d5a2d"}'%3E%3Cpolygon points='10,60 15,45 5,45'/%3E%3Cpolygon points='30,60 35,40 25,40'/%3E%3Cpolygon points='50,60 55,35 45,35'/%3E%3Cpolygon points='70,60 75,45 65,45'/%3E%3Cpolygon points='90,60 95,40 85,40'/%3E%3C/g%3E%3C/svg%3E");
  background-repeat: repeat-x;
  background-position: bottom;
  animation: ${swayAnimation} 8s ease-in-out infinite;
`;

const MiddleTreeLayer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 40'%3E%3Cg fill='%23${(
    props,
  ) =>
    props.$isDarkMode
      ? "0d2a0d"
      : "1f4a1f"}'%3E%3Cpolygon points='20,40 27,20 13,20'/%3E%3Cpolygon points='60,40 67,15 53,15'/%3E%3Cpolygon points='100,40 107,25 93,25'/%3E%3C/g%3E%3C/svg%3E");
  background-repeat: repeat-x;
  background-position: bottom;
  animation: ${swayAnimation} 6s ease-in-out infinite reverse;
`;

const Firefly = styled.div`
  position: absolute;
  width: ${(props) => props.size || "3px"};
  height: ${(props) => props.size || "3px"};
  background: ${(props) => props.theme.colors.firefly};
  border-radius: 50%;
  box-shadow: 0 0 10px ${(props) => props.theme.colors.firefly};
  animation: ${floatAnimation} ${(props) => props.duration || "4s"} ease-in-out
    infinite;
  animation-delay: ${(props) => props.delay || "0s"};
  left: ${(props) => props.left || "50%"};
  top: ${(props) => props.top || "50%"};
`;

const Star = styled.div`
  position: absolute;
  width: 2px;
  height: 2px;
  background: ${(props) => (props.$isDarkMode ? "#ffffff" : "#f0f0f0")};
  border-radius: 50%;
  animation: ${twinkleAnimation} ${(props) => props.duration || "3s"}
    ease-in-out infinite;
  animation-delay: ${(props) => props.delay || "0s"};
  left: ${(props) => props.left || "50%"};
  top: ${(props) => props.top || "20%"};
  opacity: ${(props) => (props.$isDarkMode ? "0.8" : "0.3")};
`;

const MushroomCluster = styled.div`
  position: absolute;
  bottom: 20%;
  left: ${(props) => props.left || "10%"};
  width: 30px;
  height: 20px;

  &::before {
    content: "";
    position: absolute;
    width: 12px;
    height: 8px;
    background: ${(props) => props.theme.colors.mushroom};
    border-radius: 50% 50% 0 0;
    left: 0;
    bottom: 0;
  }

  &::after {
    content: "";
    position: absolute;
    width: 8px;
    height: 6px;
    background: ${(props) => props.theme.colors.mushroom};
    border-radius: 50% 50% 0 0;
    right: 0;
    bottom: 2px;
  }
`;

const MagicalOrb = styled.div`
  position: absolute;
  width: 8px;
  height: 8px;
  background: radial-gradient(
    circle,
    ${(props) => props.theme.colors.magical} 0%,
    transparent 70%
  );
  border-radius: 50%;
  animation: ${floatAnimation} 6s ease-in-out infinite;
  animation-delay: ${(props) => props.delay || "0s"};
  left: ${(props) => props.left || "30%"};
  top: ${(props) => props.top || "40%"};
  opacity: 0.6;
`;

const MedievalForestBackground = () => {
  const { isDarkMode, theme } = useTheme();
  const containerRef = useRef(null);

  // Reduced-motion guard
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Generate random positions for animated elements
  const fireflies = prefersReducedMotion
    ? []
    : Array.from({ length: 8 }, (_, i) => ({
        id: i,
        left: Math.random() * 100 + "%",
        top: Math.random() * 60 + 20 + "%",
        delay: Math.random() * 4 + "s",
        duration: Math.random() * 3 + 3 + "s",
        size: Math.random() * 2 + 2 + "px",
      }));

  const stars = prefersReducedMotion
    ? []
    : Array.from({ length: 15 }, (_, i) => ({
        id: i,
        left: Math.random() * 100 + "%",
        top: Math.random() * 40 + "%",
        delay: Math.random() * 3 + "s",
        duration: Math.random() * 2 + 2 + "s",
      }));

  const mushrooms = Array.from({ length: 4 }, (_, i) => ({
    id: i,
    left: Math.random() * 80 + 10 + "%",
  }));

  const orbs = prefersReducedMotion
    ? []
    : Array.from({ length: 3 }, (_, i) => ({
        id: i,
        left: Math.random() * 100 + "%",
        top: Math.random() * 50 + 25 + "%",
        delay: Math.random() * 5 + "s",
      }));

  return (
    <BackgroundContainer ref={containerRef} $isDarkMode={isDarkMode}>
      {/* Stars (more visible in dark mode) */}
      {stars.map((star) => (
        <Star
          key={star.id}
          left={star.left}
          top={star.top}
          delay={star.delay}
          duration={star.duration}
          $isDarkMode={isDarkMode}
        />
      ))}

      {/* Magical orbs */}
      {orbs.map((orb) => (
        <MagicalOrb
          key={orb.id}
          left={orb.left}
          top={orb.top}
          delay={orb.delay}
          theme={theme}
        />
      ))}

      {/* Tree layers for depth */}
      <TreeLayer $isDarkMode={isDarkMode} />
      <MiddleTreeLayer $isDarkMode={isDarkMode} />

      {/* Mushroom clusters */}
      {mushrooms.map((mushroom) => (
        <MushroomCluster key={mushroom.id} left={mushroom.left} theme={theme} />
      ))}

      {/* Fireflies */}
      {fireflies.map((firefly) => (
        <Firefly
          key={firefly.id}
          left={firefly.left}
          top={firefly.top}
          delay={firefly.delay}
          duration={firefly.duration}
          size={firefly.size}
          theme={theme}
        />
      ))}
    </BackgroundContainer>
  );
};

export default MedievalForestBackground;
