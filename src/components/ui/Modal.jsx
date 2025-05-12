import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { NeumorphicButton } from '../../styles/StyledComponents';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.theme.colors.modalBackground};
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ModalContainer = styled.div`
  position: relative;
  background: ${props => props.theme.colors.glassMorphism};
  border-radius: ${props => props.theme.borderRadius.large};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  border: 1px solid ${props => props.theme.colors.glassMorphismBorder};
  max-width: 800px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  animation: ${slideIn} 0.4s ease-out;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.typography.fontSizes.xl};
  font-weight: ${props => props.theme.typography.fontWeights.semiBold};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.typography.fontSizes.lg};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    transform: scale(1.1);
  }
`;

const ModalContent = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
  color: ${props => props.theme.colors.text};
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${props => props.theme.spacing.md};
`;

const StartButton = styled(NeumorphicButton)`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  
  &:hover {
    transform: translateY(-3px);
  }
`;

const CancelButton = styled(NeumorphicButton)`
  color: ${props => props.theme.colors.text};
  
  &:hover {
    transform: translateY(-3px);
  }
`;

const Modal = ({ 
  title, 
  children, 
  isOpen, 
  onClose, 
  onStart, 
  startButtonText = "Start",
  showCancel = true,
  showStartButton = true
}) => {
  // Handle escape key press and scrolling
  useEffect(() => {
    const handleEscPress = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscPress);
    
    // Store original overflow value
    const originalOverflow = document.body.style.overflow;
    
    // Prevent body scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      window.removeEventListener('keydown', handleEscPress);
      // Always restore scrolling on unmount, regardless of isOpen state
      document.body.style.overflow = originalOverflow || 'auto';
    };
  }, [isOpen, onClose]);
  
  // Don't render anything if modal is not open
  if (!isOpen) {
    // Ensure scrolling is restored even if component isn't unmounted
    document.body.style.overflow = 'auto';
    return null;
  }
  
  // Close if overlay is clicked
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  // Handle close button click
  const handleClose = () => {
    // Ensure scrolling is restored before closing
    document.body.style.overflow = 'auto';
    onClose();
  };
  
  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <CloseButton onClick={handleClose}>
            <i className="fas fa-times"></i>
          </CloseButton>
        </ModalHeader>
        
        <ModalContent>{children}</ModalContent>
        
        <ModalActions>
          {showCancel && (
            <CancelButton onClick={handleClose}>Cancel</CancelButton>
          )}
          {showStartButton && (
            <StartButton onClick={onStart}>{startButtonText}</StartButton>
          )}
        </ModalActions>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default Modal; 