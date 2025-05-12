import React, { useState } from 'react';
import styled from 'styled-components';
import { NeumorphicButton } from '../../styles/StyledComponents';
import CVDownloadModal from './CVDownloadModal';

const DownloadButton = styled(NeumorphicButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  
  i {
    margin-right: 8px;
  }
  
  &:hover {
    transform: translateY(-3px);
  }
`;

const CVDownloadButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <DownloadButton onClick={openModal}>
        <i className="fas fa-download"></i>
        Download CV
      </DownloadButton>
      
      <CVDownloadModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default CVDownloadButton; 