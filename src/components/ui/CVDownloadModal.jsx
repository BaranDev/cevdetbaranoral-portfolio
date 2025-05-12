import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FlexContainer, NeumorphicButton } from '../../styles/StyledComponents';
import cvFile from '../../assets/cv.pdf';
import cvTrFile from '../../assets/cv_tr.pdf';

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
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  background-color: ${props => props.theme.colors.modalBackground};
  backdrop-filter: blur(8px);
  animation: ${fadeIn} 0.3s ease-out;
`;

const ModalContainer = styled.div`
  background: ${props => props.theme.colors.glassMorphism};
  border-radius: ${props => props.theme.borderRadius.large};
  padding: ${props => props.theme.spacing.xl};
  max-width: 400px;
  width: 90%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  border: 1px solid ${props => props.theme.colors.glassMorphismBorder};
  animation: ${slideIn} 0.4s ease-out;
`;

const ModalTitle = styled.h3`
  margin: 0 0 ${props => props.theme.spacing.lg} 0;
  color: ${props => props.theme.colors.text};
  text-align: center;
  font-size: ${props => props.theme.typography.fontSizes.xl};
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.text};
  font-size: 1.5rem;
  cursor: pointer;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const DownloadButton = styled(NeumorphicButton)`
  padding: ${props => props.theme.spacing.md};
  width: 100%;
  text-align: center;
  margin-top: ${props => props.theme.spacing.md};
  
  i {
    margin-right: ${props => props.theme.spacing.sm};
  }
  
  &:hover {
    transform: translateY(-3px);
  }
`;

const CVLanguageOption = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const LanguageFlag = styled.div`
  font-size: 2rem;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const CVDownloadModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  const handleDownload = (file, filename) => {
    // Create a link element to download the CV
    const link = document.createElement('a');
    link.href = file;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };
  
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <ModalTitle>Choose CV Language</ModalTitle>
        
        <FlexContainer gap="lg" justify="center">
          <CVLanguageOption>
            <LanguageFlag>🇬🇧</LanguageFlag>
            <DownloadButton 
              onClick={() => handleDownload(cvFile, 'Cevdet_Baran_Oral_CV_EN.pdf')}
              $primary
            >
              <i className="fas fa-download"></i>
              English
            </DownloadButton>
          </CVLanguageOption>
          
          <CVLanguageOption>
            <LanguageFlag>🇹🇷</LanguageFlag>
            <DownloadButton 
              onClick={() => handleDownload(cvTrFile, 'Cevdet_Baran_Oral_CV_TR.pdf')}
            >
              <i className="fas fa-download"></i>
              Turkish
            </DownloadButton>
          </CVLanguageOption>
        </FlexContainer>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default CVDownloadModal; 