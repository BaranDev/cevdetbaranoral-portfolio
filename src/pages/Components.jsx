import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  Section, 
  Heading, 
  SubHeading,
  Text, 
  NeumorphicContainer, 
  NeumorphicButton,
  FlexContainer,
  ProgressCircle,
  Divider
} from '../styles/StyledComponents';
import Modal from '../components/ui/Modal';
import ThemeToggle from '../components/ui/ThemeToggle';
import { useTheme } from '../context/ThemeContext';

const ComponentSection = styled(NeumorphicContainer)`
  margin-bottom: ${props => props.theme.spacing.xl};
  padding: ${props => props.theme.spacing.lg};
`;

const ComponentTitle = styled(SubHeading)`
  margin-bottom: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.primary};
`;

const ComponentDemo = styled.div`
  margin-top: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.medium};
  background-color: ${props => props.theme.colors.background};
  box-shadow: ${props => props.theme.shadows.inset};
`;

const ButtonVariation = styled(NeumorphicButton)`
  margin: ${props => props.theme.spacing.sm};
`;

const ColorBox = styled.div`
  width: 100px;
  height: 100px;
  border-radius: ${props => props.theme.borderRadius.medium};
  background-color: ${props => props.color};
  margin: ${props => props.theme.spacing.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${props => props.theme.typography.fontWeights.semiBold};
  box-shadow: ${props => props.theme.shadows.medium};
`;

// Custom ProgressBar component since it's not available in StyledComponents
const ProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.small};
  box-shadow: ${props => props.theme.shadows.inset};
  overflow: hidden;
  margin: ${props => props.theme.spacing.sm} 0;
  
  &::after {
    content: '';
    display: block;
    width: ${props => props.progress || '0%'};
    height: 100%;
    background-color: ${props => props.theme.colors.primary};
    transition: width 0.5s ease-in-out;
  }
`;

const ComponentsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <Section>
      <Heading style={{ textAlign: 'center' }}>
        UI <span style={{ color: theme.colors.primary }}>Components</span>
      </Heading>
      
      <Text style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', marginBottom: theme.spacing.xl }}>
        Explore the Neumorphic UI components used throughout this portfolio website.
        This showcase demonstrates the consistent design system applied across the site.
      </Text>
      
      {/* Typography */}
      <ComponentSection>
        <ComponentTitle>Typography</ComponentTitle>
        <Text>The typography system uses Poppins and Roboto fonts with consistent sizing and weights.</Text>
        
        <ComponentDemo>
          <Heading>Heading Component (H1)</Heading>
          <SubHeading>SubHeading Component (H2)</SubHeading>
          <h3>Heading 3</h3>
          <h4>Heading 4</h4>
          <Text size="xl" weight="bold">Text Component - Extra Large Bold</Text>
          <Text size="lg">Text Component - Large</Text>
          <Text>Text Component - Default</Text>
          <Text size="sm">Text Component - Small</Text>
          <Text size="xs">Text Component - Extra Small</Text>
        </ComponentDemo>
      </ComponentSection>
      
      {/* Colors */}
      <ComponentSection>
        <ComponentTitle>Color System</ComponentTitle>
        <Text>The color palette is designed to create a soothing, professional experience with proper contrast in both light and dark modes.</Text>
        
        <ComponentDemo>
          <FlexContainer wrap="wrap" justify="center">
            <ColorBox color={theme.colors.primary}>Primary</ColorBox>
            <ColorBox color={theme.colors.secondary}>Secondary</ColorBox>
            <ColorBox color={theme.colors.success}>Success</ColorBox>
            <ColorBox color={theme.colors.danger}>Danger</ColorBox>
            <ColorBox color={theme.colors.warning}>Warning</ColorBox>
            <ColorBox color={theme.colors.info}>Info</ColorBox>
          </FlexContainer>
        </ComponentDemo>
      </ComponentSection>
      
      {/* Containers */}
      <ComponentSection>
        <ComponentTitle>Neumorphic Containers</ComponentTitle>
        <Text>Neumorphic containers create a soft, extruded look with subtle shadows and highlights.</Text>
        
        <ComponentDemo>
          <FlexContainer gap="lg" wrap="wrap">
            <NeumorphicContainer style={{ padding: theme.spacing.md, width: '200px', height: '100px' }}>
              <Text>Standard Container</Text>
            </NeumorphicContainer>
            
            <NeumorphicContainer style={{ padding: theme.spacing.md, width: '200px', height: '100px', boxShadow: theme.shadows.large }}>
              <Text>Large Shadow</Text>
            </NeumorphicContainer>
            
            <NeumorphicContainer style={{ padding: theme.spacing.md, width: '200px', height: '100px', boxShadow: theme.shadows.inset }}>
              <Text>Inset Shadow</Text>
            </NeumorphicContainer>
          </FlexContainer>
        </ComponentDemo>
      </ComponentSection>
      
      {/* Buttons */}
      <ComponentSection>
        <ComponentTitle>Buttons</ComponentTitle>
        <Text>Neumorphic buttons with various states and sizes.</Text>
        
        <ComponentDemo>
          <FlexContainer wrap="wrap" align="center">
            <ButtonVariation size="large">Large Button</ButtonVariation>
            <ButtonVariation>Default Button</ButtonVariation>
            <ButtonVariation size="small">Small Button</ButtonVariation>
            <ButtonVariation disabled>Disabled Button</ButtonVariation>
            <ButtonVariation primary>Primary Button</ButtonVariation>
          </FlexContainer>
        </ComponentDemo>
      </ComponentSection>
      
      {/* Progress Elements */}
      <ComponentSection>
        <ComponentTitle>Progress Elements</ComponentTitle>
        <Text>Visual elements to display progress or metrics.</Text>
        
        <ComponentDemo>
          <Text>Progress Bar:</Text>
          <ProgressBar progress="65%" />
          
          <FlexContainer justify="space-around" style={{ marginTop: theme.spacing.lg }}>
            <div>
              <Text style={{ textAlign: 'center', marginBottom: theme.spacing.sm }}>Progress Circle 25%</Text>
              <ProgressCircle progress="25%" size="100px" color={theme.colors.primary} />
            </div>
            <div>
              <Text style={{ textAlign: 'center', marginBottom: theme.spacing.sm }}>Progress Circle 50%</Text>
              <ProgressCircle progress="50%" size="100px" color={theme.colors.info} />
            </div>
            <div>
              <Text style={{ textAlign: 'center', marginBottom: theme.spacing.sm }}>Progress Circle 75%</Text>
              <ProgressCircle progress="75%" size="100px" color={theme.colors.success} />
            </div>
          </FlexContainer>
        </ComponentDemo>
      </ComponentSection>
      
      {/* Interactive Components */}
      <ComponentSection>
        <ComponentTitle>Interactive Components</ComponentTitle>
        <Text>Components with state and user interactions.</Text>
        
        <ComponentDemo>
          <FlexContainer justify="space-between" wrap="wrap" gap="lg">
            <div>
              <Text style={{ marginBottom: theme.spacing.sm }}>Theme Toggle:</Text>
              <ThemeToggle />
            </div>
            
            <div>
              <Text style={{ marginBottom: theme.spacing.sm }}>Modal Dialog:</Text>
              <NeumorphicButton onClick={() => setIsModalOpen(true)}>
                Open Modal
              </NeumorphicButton>
            </div>
          </FlexContainer>
        </ComponentDemo>
      </ComponentSection>
      
      {/* Dividers */}
      <ComponentSection>
        <ComponentTitle>Dividers</ComponentTitle>
        <Text>Separation elements for visual hierarchy.</Text>
        
        <ComponentDemo>
          <Text>Default Divider:</Text>
          <Divider />
          
          <Text style={{ marginTop: theme.spacing.md }}>Custom Divider:</Text>
          <Divider width="50%" color={theme.colors.primary} thickness="3px" />
        </ComponentDemo>
      </ComponentSection>
      
      {/* Sample Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Modal Component"
        onStart={() => console.log('Modal action triggered')}
      >
        <Text>
          This is a modal component used throughout the portfolio site for detailed information and interactions.
          It features a clean, glassmorphic design that overlays the main content.
        </Text>
        
        <FlexContainer justify="center" style={{ margin: `${theme.spacing.lg} 0` }}>
          <NeumorphicContainer style={{ padding: theme.spacing.md, textAlign: 'center' }}>
            <Text>Neumorphic container inside modal</Text>
          </NeumorphicContainer>
        </FlexContainer>
        
        <Text size="sm">
          Click "Start" to trigger the modal action, or "Cancel" to close this dialog.
        </Text>
      </Modal>
    </Section>
  );
};

export default ComponentsPage; 