import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
`;

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(75, 112, 226, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(75, 112, 226, 0.6);
  }
`;

const particleMove = keyframes`
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) rotate(360deg);
    opacity: 0;
  }
`;

const hexagonRotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const ripple = keyframes`
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
`;

const typewriter = keyframes`
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
`;

const LoaderWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.background} 0%,
    ${(props) => props.theme.colors.background}ee 50%,
    ${(props) => props.theme.colors.background} 100%
  );
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: ${(props) => (props.$isExiting ? fadeOut : fadeIn)} 0.5s ease
    forwards;
  overflow: hidden;
`;

const ParticleContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const Particle = styled.div`
  position: absolute;
  width: 4px;
  height: 4px;
  background: ${(props) => props.theme.colors.primary};
  border-radius: 50%;
  animation: ${particleMove} ${(props) => props.duration}s linear infinite;
  animation-delay: ${(props) => props.delay}s;
  left: ${(props) => props.left}%;
  filter: blur(0.5px);
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
`;

const LoadingCore = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${float} 3s ease-in-out infinite;
`;

const HexagonOuter = styled.div`
  position: absolute;
  width: 100px;
  height: 100px;
  border: 2px solid ${(props) => props.theme.colors.primary};
  border-radius: 50%;
  animation: ${hexagonRotate} 4s linear infinite;

  &::before {
    content: "";
    position: absolute;
    top: -10px;
    left: -10px;
    width: 120px;
    height: 120px;
    border: 1px solid ${(props) => props.theme.colors.secondary};
    border-radius: 50%;
    animation: ${hexagonRotate} 3s linear infinite reverse;
  }
`;

const HexagonInner = styled.div`
  position: absolute;
  width: 60px;
  height: 60px;
  background: linear-gradient(
    45deg,
    ${(props) => props.theme.colors.primary}40,
    ${(props) => props.theme.colors.secondary}40
  );
  border-radius: 50%;
  animation: ${pulse} 2s ease-in-out infinite;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    background: ${(props) => props.theme.colors.primary};
    border-radius: 50%;
    animation: ${glow} 1.5s ease-in-out infinite;
  }
`;

const RippleEffect = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid ${(props) => props.theme.colors.primary};
  border-radius: 50%;
  animation: ${ripple} 2s ease-out infinite;
  animation-delay: ${(props) => props.delay}s;
`;

const LoadingText = styled.div`
  margin-top: 40px;
  font-size: 18px;
  color: ${(props) => props.theme.colors.text};
  font-weight: 600;
  letter-spacing: 4px;
  text-transform: uppercase;
  position: relative;
  font-family: "Courier New", monospace;

  &::after {
    content: "";
    position: absolute;
    right: -8px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: ${(props) => props.theme.colors.primary};
    animation: ${pulse} 1s ease-in-out infinite;
  }
`;

const ProgressBar = styled.div`
  width: 200px;
  height: 3px;
  background: ${(props) => props.theme.colors.background};
  border-radius: 2px;
  margin-top: 20px;
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      ${(props) => props.theme.colors.primary},
      transparent
    );
    animation: ${typewriter} 2s ease-in-out infinite;
  }
`;

const GeometricShape = styled.div`
  position: absolute;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border: 1px solid ${(props) => props.theme.colors.secondary}40;
  top: ${(props) => props.top}%;
  left: ${(props) => props.left}%;
  animation: ${rotate} ${(props) => props.duration}s linear infinite;
  animation-delay: ${(props) => props.delay}s;

  ${(props) =>
    props.shape === "square" &&
    `
    transform: rotate(45deg);
  `}

  ${(props) =>
    props.shape === "triangle" &&
    `
    width: 0;
    height: 0;
    border-left: ${props.size / 2}px solid transparent;
    border-right: ${props.size / 2}px solid transparent;
    border-bottom: ${props.size}px solid ${props.theme.colors.secondary}40;
    border-top: none;
    border-right: none;
    border-left: none;
  `}
`;

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
    document.body.style.overflow = "auto";
    return null;
  }

  // Generate particles
  const particles = Array.from({ length: 25 }, (_, i) => (
    <Particle
      key={i}
      left={Math.random() * 100}
      duration={3 + Math.random() * 4}
      delay={Math.random() * 2}
    />
  ));

  // Generate geometric shapes
  const shapes = Array.from({ length: 8 }, (_, i) => {
    const shapeTypes = ["square", "triangle"];
    return (
      <GeometricShape
        key={i}
        size={20 + Math.random() * 30}
        top={Math.random() * 100}
        left={Math.random() * 100}
        duration={10 + Math.random() * 10}
        delay={Math.random() * 5}
        shape={shapeTypes[Math.floor(Math.random() * shapeTypes.length)]}
      />
    );
  });

  return (
    <LoaderWrapper $isExiting={isExiting}>
      <ParticleContainer>
        {particles}
        {shapes}
      </ParticleContainer>

      <MainContainer>
        <LoadingCore>
          <HexagonOuter />
          <HexagonInner />
          <RippleEffect delay={0} />
          <RippleEffect delay={0.5} />
          <RippleEffect delay={1} />
        </LoadingCore>

        <LoadingText>INITIALIZING</LoadingText>
        <ProgressBar />
      </MainContainer>
    </LoaderWrapper>
  );
};

export default Loader;
