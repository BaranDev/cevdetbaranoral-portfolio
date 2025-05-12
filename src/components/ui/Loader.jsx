import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useTheme } from '../../context/ThemeContext';

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

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const LoaderWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.theme.colors.background};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: ${props => props.$isExiting ? fadeOut : fadeIn} 0.5s ease forwards;
`;

const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LoadingSpinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: ${props => props.theme.colors.primary};
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.div`
  margin-top: 16px;
  font-size: 14px;
  color: ${props => props.theme.colors.text};
  font-weight: 500;
  letter-spacing: 1px;
`;

const Logo = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
`;

const Loader = ({ minDisplayTime = 1000 }) => {
  const [isExiting, setIsExiting] = useState(false);
  const { theme } = useTheme();
  
  useEffect(() => {
    const startTime = Date.now();
    
    const cleanup = () => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
      
      setTimeout(() => {
        setIsExiting(true);
        
        // Remove the loader after animation completes
        setTimeout(() => {
          document.body.style.overflow = 'auto';
        }, 500);
      }, remainingTime);
    };
    
    // Prevent scrolling while loader is visible
    document.body.style.overflow = 'hidden';
    
    // Load any resources, fonts, etc. here if needed
    
    // Clean up when all resources are loaded
    window.addEventListener('load', cleanup);
    
    // Fallback timeout in case 'load' event doesn't fire
    const fallbackTimeout = setTimeout(cleanup, 2000);
    
    return () => {
      // Make sure to restore scrolling if component unmounts
      document.body.style.overflow = 'auto';
      window.removeEventListener('load', cleanup);
      clearTimeout(fallbackTimeout);
    };
  }, [minDisplayTime]);
  
  // If we're exiting, still render null to ensure the useEffect cleanup runs
  if (isExiting) {
    // Force restore scrolling when component is removed
    document.body.style.overflow = 'auto';
    return null;
  }
  
  return (
    <LoaderWrapper $isExiting={isExiting}>
      <SpinnerContainer>
        <LoadingSpinner />
        <LoadingText>LOADING</LoadingText>
      </SpinnerContainer>
      <Logo>Portfolio</Logo>
    </LoaderWrapper>
  );
};

export default Loader; 