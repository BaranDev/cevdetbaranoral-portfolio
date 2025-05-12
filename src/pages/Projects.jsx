import React from 'react';
import styled from 'styled-components';
import { 
  Section, 
  Heading, 
  Text,
  NeumorphicContainer
} from '../styles/StyledComponents';
import ProjectTimeline from '../components/interactive/ProjectTimeline';
import { useTheme } from '../context/ThemeContext';

const ProjectsHeading = styled(Heading)`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xl};
  
  span {
    color: ${props => props.theme.colors.primary};
  }
`;

const IntroSection = styled(NeumorphicContainer)`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const ProjectsPage = () => {
  const { theme } = useTheme();
  
  return (
    <>
      <Section>
        <ProjectsHeading>
          My <span>Projects</span> Journey
        </ProjectsHeading>
        
        <IntroSection>
          <Text size="lg">
            Explore my project timeline below. Each project represents a milestone in my growth as a
            software engineer. Scroll through to see how my skills and approach have evolved over time.
          </Text>
        </IntroSection>
        
        <ProjectTimeline />
      </Section>
    </>
  );
};

export default ProjectsPage; 