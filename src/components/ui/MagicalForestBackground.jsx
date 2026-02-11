import React, { useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useTheme } from "../../context/ThemeContext";

// Keyframes for magical floating particles
const float = keyframes`
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.8;
  }
  25% {
    transform: translateY(-10px) rotate(90deg);
    opacity: 1;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 0.9;
  }
  75% {
    transform: translateY(-10px) rotate(270deg);
    opacity: 1;
  }
`;

const twinkle = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
`;

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
  background: ${(props) => props.theme.colors.background};
  transition: background 0.3s ease;
`;

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

// Magical floating particles
const MagicalParticle = styled.div`
  position: absolute;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  background: ${(props) => props.color};
  border-radius: 50%;
  animation: ${float} ${(props) => props.duration}s ease-in-out infinite;
  animation-delay: ${(props) => props.delay}s;
  left: ${(props) => props.left}%;
  top: ${(props) => props.top}%;
  box-shadow: 0 0 10px ${(props) => props.color}60;

  ${(props) =>
    props.twinkle &&
    `
    animation: ${twinkle} ${props.duration * 0.8}s ease-in-out infinite;
  `}
`;

// Tree silhouettes
const TreeSilhouette = styled.div`
  position: absolute;
  bottom: 0;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  left: ${(props) => props.left}%;
  background: ${(props) => props.theme.colors.primary}40;
  clip-path: polygon(
    30% 100%,
    35% 95%,
    40% 90%,
    45% 85%,
    50% 80%,
    55% 85%,
    60% 90%,
    65% 95%,
    70% 100%
  );
  opacity: 0.3;
  z-index: -1;
`;

const MagicalForestBackground = () => {
  const canvasRef = useRef(null);
  const { theme, isDarkMode } = useTheme();

  // Generate magical particles
  const magicalParticles = React.useMemo(() => {
    const particles = [];
    for (let i = 0; i < 15; i++) {
      particles.push({
        id: i,
        size: Math.random() * 6 + 2,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: Math.random() * 10 + 5,
        delay: Math.random() * 5,
        color: isDarkMode ? theme.colors.magical : theme.colors.accent,
        twinkle: Math.random() > 0.7,
      });
    }
    return particles;
  }, [isDarkMode, theme]);

  // Generate tree silhouettes
  const trees = React.useMemo(() => {
    const treeArray = [];
    for (let i = 0; i < 8; i++) {
      treeArray.push({
        id: i,
        width: Math.random() * 60 + 40,
        height: Math.random() * 150 + 100,
        left: (i / 8) * 100 + Math.random() * 10 - 5,
      });
    }
    return treeArray;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let particles = [];

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Clear existing particles when theme changes
    particles = [];

    // Mystic particle class for canvas animation
    class MysticParticle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.3 - 0.15;
        this.speedY = Math.random() * 0.3 - 0.15;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.life = Math.random() * 100 + 50;
        this.maxLife = this.life;

        // Color based on theme
        this.color = isDarkMode ? "218, 112, 214" : "205, 133, 63"; // Orchid or Peru
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life--;

        // Fade out as life decreases
        this.opacity = (this.life / this.maxLife) * 0.5;

        // Wrap particles around the edges
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        // Respawn particle when life ends
        if (this.life <= 0) {
          this.life = this.maxLife;
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.fill();

        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(${this.color}, ${this.opacity * 0.8})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // Create mystic particles
    const createParticles = () => {
      const particleCount = Math.min(30, Math.floor(window.innerWidth / 40));
      for (let i = 0; i < particleCount; i++) {
        particles.push(new MysticParticle());
      }
    };

    createParticles();

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Clean up
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, isDarkMode]);

  return (
    <BackgroundContainer>
      <Canvas ref={canvasRef} />

      {/* Tree silhouettes */}
      {trees.map((tree) => (
        <TreeSilhouette
          key={tree.id}
          width={tree.width}
          height={tree.height}
          left={tree.left}
        />
      ))}

      {/* Magical floating particles */}
      {magicalParticles.map((particle) => (
        <MagicalParticle
          key={particle.id}
          size={particle.size}
          left={particle.left}
          top={particle.top}
          duration={particle.duration}
          delay={particle.delay}
          color={particle.color}
          twinkle={particle.twinkle}
        />
      ))}
    </BackgroundContainer>
  );
};

export default MagicalForestBackground;
