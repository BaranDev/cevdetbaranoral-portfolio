import React from 'react';
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
  background-color: ${props => props.theme.colors.background};
  transition: background-color 0.3s ease;
`;

const SimpleBackground = () => {
  const { theme } = useTheme();
  
  return (
    <BackgroundContainer />
  );
};

export default SimpleBackground; 