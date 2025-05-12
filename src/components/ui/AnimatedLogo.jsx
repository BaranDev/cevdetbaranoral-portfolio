import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import logoImage from '../../assets/logo.png';
import { useTheme } from '../../context/ThemeContext';

// Keyframe animations
const glow = keyframes`
  0% { filter: drop-shadow(0 0 3px rgba(75, 112, 226, 0.3)); }
  50% { filter: drop-shadow(0 0 12px rgba(75, 112, 226, 0.8)); }
  100% { filter: drop-shadow(0 0 3px rgba(75, 112, 226, 0.3)); }
`;

const textReveal = keyframes`
  0% { transform: translateX(-20px); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.xl};
  max-width: 400px;
  margin: 0 auto;
`;

const LogoWrapper = styled.div`
  position: relative;
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.large};
  background-color: ${props => props.theme.colors.background};
  box-shadow: ${props => props.theme.shadows.medium};
  margin-bottom: ${props => props.theme.spacing.lg};
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    right: -50%;
    bottom: -50%;
    background: linear-gradient(45deg, 
      rgba(255,255,255,0) 0%, 
      rgba(255,255,255,0.2) 50%, 
      rgba(255,255,255,0) 100%);
    transform: rotate(45deg);
    animation: ${shimmer} 6s linear infinite;
    background-size: 200% 200%;
    pointer-events: none;
    z-index: 1;
  }
`;

const LogoImage = styled.img`
  width: 100%;
  max-width: ${props => props.size || '200px'};
  height: auto;
  z-index: 2;
  position: relative;
  transition: all 0.3s ease;
  
  /* Apply theme-specific filters directly */
  filter: ${props => props.theme.colors.background === '#1a1f2e' 
    ? 'brightness(0.9) contrast(1.1) saturate(0.9)' 
    : 'brightness(1.02) contrast(1.05) saturate(0.95)'};
  
  /* Hover effect */
  ${LogoWrapper}:hover & {
    filter: brightness(1.05) contrast(1.05) drop-shadow(0 0 8px ${props => props.theme.colors.primary}40);
  }
`;

const LogoText = styled.div`
  font-size: ${props => props.size || props.theme.typography.fontSizes.xxl};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  margin-top: ${props => props.theme.spacing.md};
  background: linear-gradient(135deg, 
    ${props => props.theme.colors.primary} 0%, 
    ${props => props.theme.colors.secondary} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  letter-spacing: 2px;
  opacity: 0;
  animation: ${textReveal} 0.8s forwards 0.5s;
`;

const LogoTagline = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.md};
  color: ${props => props.theme.colors.secondary};
  margin-top: ${props => props.theme.spacing.sm};
  text-align: center;
  opacity: 0;
  animation: ${textReveal} 0.8s forwards 1s;
`;

const AnimatedLogo = ({ showTagline = true, size = 'medium' }) => {
  const { theme } = useTheme();
  
  // Size mappings for responsive display
  const sizes = {
    small: '120px',
    medium: '200px',
    large: '300px'
  };
  
  const fontSizes = {
    small: 'lg',
    medium: 'xxl',
    large: 'xxxl'
  };
  
  return (
    <LogoContainer>
      <LogoWrapper>
        <LogoImage 
          src={logoImage} 
          alt="Barandev Logo" 
          size={sizes[size]}
        />
      </LogoWrapper>
      <LogoText size={fontSizes[size]}>Barandev</LogoText>
      {showTagline && (
        <LogoTagline>
          Full-Stack Developer & AI Specialist
        </LogoTagline>
      )}
    </LogoContainer>
  );
};

export default AnimatedLogo;

 