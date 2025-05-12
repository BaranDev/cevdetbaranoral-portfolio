import React from 'react';
import styled from 'styled-components';
import { 
  Section, 
  Heading,
  Text,
  FlexContainer
} from '../styles/StyledComponents';
import ArchitectureDiagram from '../components/interactive/ArchitectureDiagram';
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

const ArchitectureDiagramsPage = () => {
  const { theme } = useTheme();
  
  return (
    <PageContainer>
      <IntroSection>
        <Heading>
          Architecture <ColoredSpan>Diagrams</ColoredSpan>
        </Heading>
        <Text size="lg" center maxWidth="800px" margin="16px auto">
          Explore interactive visualizations of common software architecture patterns with
          animated data flows and component details.
        </Text>
      </IntroSection>
      
      <Section>
        <ArchitectureDiagram />
      </Section>
      
      <Section>
        <FlexContainer direction="column" align="center" maxWidth="800px" margin="0 auto">
          <Heading size="md" margin="0 0 24px 0" center>
            Understanding Software Architectures
          </Heading>
          
          <Text margin="0 0 16px 0">
            Software architecture defines the high-level structure of a system, establishing how components
            interact with each other. The diagrams above illustrate common patterns used in modern application
            development, each with its own strengths and use cases.
          </Text>
          
          <Text margin="0 0 16px 0">
            These interactive diagrams help visualize how data flows through different architectures.
            Click on individual components to learn more about their role, and use the simulation button
            to see how information moves through the system.
          </Text>
          
          <Text color={theme.colors.secondary} margin="24px 0 0 0" size="sm" center>
            The architecture diagrams represent simplified models of complex systems. Real-world implementations
            may include additional components, security measures, and optimizations.
          </Text>
        </FlexContainer>
      </Section>
    </PageContainer>
  );
};

export default ArchitectureDiagramsPage; 