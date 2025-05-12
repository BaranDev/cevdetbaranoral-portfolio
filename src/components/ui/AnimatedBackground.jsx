import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
  background: ${props => props.theme.colors.backgroundGradient};
  transition: background 0.3s ease;
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
`;

const AnimatedBackground = () => {
  const canvasRef = useRef(null);
  const { theme, isDarkMode } = useTheme();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Clear existing particles when theme changes
    particles = [];
    
    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1; // Particle size
        this.speedX = Math.random() * 0.5 - 0.25; // Horizontal speed
        this.speedY = Math.random() * 0.5 - 0.25; // Vertical speed
        
        // Color based on theme
        this.color = isDarkMode ? theme.colors.primary : theme.colors.primary;
        this.alpha = Math.random() * 0.5 + 0.1; // Transparency
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Wrap particles around the edges
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
    
    // Create particles
    const createParticles = () => {
      const particleCount = Math.min(60, Math.floor(window.innerWidth / 30));
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };
    
    createParticles();
    
    // Connect particles with lines if they're close enough
    const connectParticles = () => {
      const maxDistance = 150; // Maximum distance for connection
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            // Adjust opacity based on distance
            const opacity = 1 - (distance / maxDistance);
            
            ctx.beginPath();
            ctx.strokeStyle = isDarkMode 
              ? `rgba(111, 140, 233, ${opacity * 0.2})` 
              : `rgba(75, 112, 226, ${opacity * 0.2})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      
      connectParticles();
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Clean up
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, isDarkMode]);
  
  return (
    <BackgroundContainer>
      <Canvas ref={canvasRef} />
    </BackgroundContainer>
  );
};

export default AnimatedBackground; 