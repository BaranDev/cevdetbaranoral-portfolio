import React from 'react';
import styled from 'styled-components';
import { 
  Section, 
  Heading,
  Text,
  FlexContainer,
  NeumorphicContainer
} from '../styles/StyledComponents';
import AIDemo from '../components/interactive/AIDemo';
import { useTheme } from '../context/ThemeContext';

// Page container
const PageContainer = styled.div`
  padding: ${props => props.theme.spacing.lg} 0;
`;

// Intro section
const IntroSection = styled(Section)`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

// Colored span for highlighting
const ColoredSpan = styled.span`
  color: ${props => props.theme.colors.primary};
`;

// Info card
const InfoCard = styled(NeumorphicContainer)`
  padding: ${props => props.theme.spacing.lg};
  margin-top: ${props => props.theme.spacing.xl};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: ${props => props.theme.spacing.md};
  }
`;

// Feature section
const FeatureSection = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing.lg};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

// Feature icon
const FeatureIcon = styled.div`
  width: 50px;
  min-width: 50px;
  height: 50px;
  border-radius: ${props => props.theme.borderRadius.circle};
  background-color: ${props => props.theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${props => props.theme.spacing.md};
  box-shadow: ${props => props.theme.shadows.small};
  font-size: 24px;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    margin-bottom: ${props => props.theme.spacing.sm};
  }
`;

// Feature content
const FeatureContent = styled.div`
  flex: 1;
`;

const AIDemosPage = () => {
  const { theme } = useTheme();
  
  return (
    <PageContainer>
      <IntroSection>
        <Heading>
          AI <ColoredSpan>Demonstrations</ColoredSpan>
        </Heading>
        <Text size="lg" $center $maxWidth="800px" margin="16px auto">
          Explore interactive AI demos powered by TensorFlow.js, running directly in your browser
          without requiring server-side processing.
        </Text>
      </IntroSection>
      
      <Section>
        <AIDemo />
      </Section>
      
      <Section>
        <InfoCard>
          <Heading size="md" margin="0 0 24px 0">
            About These AI Demos
          </Heading>
          
          <FeatureSection>
            <FeatureIcon>
              <i className="fas fa-camera"></i>
            </FeatureIcon>
            <FeatureContent>
              <Text weight="semiBold" margin="0 0 8px 0">
                Object Detection
              </Text>
              <Text size="sm">
                The object detection demo uses COCO-SSD (Common Objects in Context - Single Shot MultiBox Detector), 
                a pre-trained model capable of identifying 80 different common objects. The model has been 
                optimized to run efficiently in web browsers through TensorFlow.js.
              </Text>
            </FeatureContent>
          </FeatureSection>
          
          <FeatureSection>
            <FeatureIcon>
              <i className="fas fa-pencil-alt"></i>
            </FeatureIcon>
            <FeatureContent>
              <Text weight="semiBold" margin="0 0 8px 0">
                Drawing Recognition
              </Text>
              <Text size="sm">
                The drawing recognition component demonstrates the concept of sketch recognition.
                In a full implementation, it would use a model like SketchRNN or a CNN trained on the 
                Quick Draw dataset to recognize hand-drawn sketches in real-time.
              </Text>
            </FeatureContent>
          </FeatureSection>
          
          <FeatureSection>
            <FeatureIcon>
              <i className="fas fa-lock"></i>
            </FeatureIcon>
            <FeatureContent>
              <Text weight="semiBold" margin="0 0 8px 0">
                Privacy-First Machine Learning
              </Text>
              <Text size="sm">
                All processing happens locally in your browser - your camera feed and drawings never 
                leave your device. This is a powerful example of how modern web technologies 
                can deliver AI capabilities while preserving user privacy.
              </Text>
            </FeatureContent>
          </FeatureSection>
          
          <FeatureSection>
            <FeatureIcon>
              <i className="fas fa-code"></i>
            </FeatureIcon>
            <FeatureContent>
              <Text weight="semiBold" margin="0 0 8px 0">
                Technical Implementation
              </Text>
              <Text size="sm" margin="0 0 8px 0">
                These demos showcase several technical capabilities:
              </Text>
              <ul>
                <li>Integration of TensorFlow.js for in-browser machine learning</li>
                <li>Real-time video processing using the browser's MediaDevices API</li>
                <li>Canvas manipulation for drawing tools and visualization</li>
                <li>Reactive UI with styled-components that adapts to theme changes</li>
              </ul>
            </FeatureContent>
          </FeatureSection>
          
          <Text color={theme.colors.secondary} margin="24px 0 0 0" size="sm" $center>
            Note: For the best experience, please use a modern browser and allow camera access when prompted.
            The TensorFlow.js model may take a few moments to load on slower connections.
          </Text>
        </InfoCard>
      </Section>
    </PageContainer>
  );
};

export default AIDemosPage; 