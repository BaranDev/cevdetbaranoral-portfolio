import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  Section, 
  NeumorphicContainer, 
  NeumorphicButton, 
  FlexContainer,
  Heading,
  SubHeading,
  Text,
  GridContainer
} from '../styles/StyledComponents';
import Modal from '../components/ui/Modal';
import { useTheme } from '../context/ThemeContext';

// Hero Section Styles
const HeroSection = styled(Section)`
  margin-top: 0;
`;

const HeroContainer = styled(NeumorphicContainer)`
  padding: ${props => props.theme.spacing.xxl};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${props => props.theme.spacing.xl};
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    flex-direction: column;
    text-align: center;
    padding: ${props => props.theme.spacing.xl};
  }
`;

const HeroContent = styled.div`
  flex: 1;
`;

const HeroTitle = styled(Heading)`
  font-size: ${props => props.theme.typography.fontSizes.xxxl};
  margin-bottom: ${props => props.theme.spacing.md};
  
  span {
    color: ${props => props.theme.colors.primary};
  }
`;

const HeroSubtitle = styled(SubHeading)`
  margin-bottom: ${props => props.theme.spacing.lg};
  color: ${props => props.theme.colors.secondary};
`;

const HeroImage = styled.div`
  flex: 1;
  position: relative;
  max-width: 500px;
  height: 400px;
  
  &:before {
    content: '';
    position: absolute;
    top: -20px;
    left: -20px;
    width: 100%;
    height: 100%;
    border-radius: ${props => props.theme.borderRadius.medium};
    background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
    opacity: 0.1;
  }
  
  img {
    position: relative;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: ${props => props.theme.borderRadius.medium};
    box-shadow: ${props => props.theme.shadows.large};
  }
`;

const ButtonGroup = styled(FlexContainer)`
  margin-top: ${props => props.theme.spacing.xl};
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    justify-content: center;
  }
`;

const PrimaryButton = styled(NeumorphicButton)`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  font-weight: ${props => props.theme.typography.fontWeights.semiBold};
  
  &:hover {
    transform: translateY(-3px);
  }
`;

const SecondaryButton = styled(NeumorphicButton)`
  color: ${props => props.theme.colors.primary};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  margin-left: ${props => props.theme.spacing.md};
  
  &:hover {
    transform: translateY(-3px);
  }
`;

// Feature Section Styles
const FeatureCard = styled(NeumorphicContainer)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  transition: all ${props => props.theme.animations.normal};
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-10px);
    
    .card-overlay {
      opacity: 1;
    }
  }
`;

const CardOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => `linear-gradient(rgba(0,0,0,0.2), ${props.theme.colors.primary}90)`};
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity ${props => props.theme.animations.normal};
  
  .view-details {
    color: white;
    font-weight: ${props => props.theme.typography.fontWeights.semiBold};
    padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
    border: 2px solid white;
    border-radius: ${props => props.theme.borderRadius.medium};
    backdrop-filter: blur(4px);
  }
`;

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: ${props => props.theme.borderRadius.circle};
  background-color: ${props => props.theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.medium};
  
  i {
    font-size: 2rem;
    color: ${props => props.theme.colors.primary};
  }
`;

const FeatureTitle = styled(SubHeading)`
  margin: ${props => props.theme.spacing.md} 0;
`;

// CTA Section Styles
const CTAContainer = styled(NeumorphicContainer)`
  padding: ${props => props.theme.spacing.xxl};
  text-align: center;
  background: linear-gradient(
    135deg,
    rgba(75, 112, 226, 0.05),
    rgba(155, 170, 207, 0.05)
  );
`;

const CTATitle = styled(Heading)`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ModalContent = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ModalImage = styled.div`
  width: 100%;
  height: 200px;
  margin-bottom: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.medium};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.medium};
  
  i {
    font-size: 4rem;
    color: ${props => props.theme.colors.primary};
  }
`;

// Feature data
const featuredSections = [
  {
    id: 1,
    title: "Interactive Project Timeline",
    description: "Explore my project journey through an animated, interactive timeline with micro-interactions as you scroll.",
    icon: "fa-project-diagram",
    details: "The interactive project timeline provides a chronological view of my development journey. You can navigate through different projects, see how my skills evolved over time, and learn about key milestones. The timeline features animations triggered by scrolling, with each project card expanding to reveal more information when clicked.",
    path: "/projects"
  },
  {
    id: 2,
    title: "Live Code Editor",
    description: "Try out a mini code editor showing solutions to interesting problems and make small edits to see how the code responds.",
    icon: "fa-code",
    details: "The live code editor lets you experiment with actual code snippets from my projects. You can edit the code directly in the browser, run it to see the results, and explore different solutions. This interactive feature demonstrates my coding style and problem-solving approach while giving you hands-on experience with my work.",
    path: "/code-editor"
  },
  {
    id: 3,
    title: "AI Demo Showcase",
    description: "Experience a TensorFlow.js demo of object recognition and a simplified whiteboard recognition using browser APIs.",
    icon: "fa-brain",
    details: "The AI Demo Showcase features interactive examples of machine learning models running directly in your browser. Explore object recognition through your webcam, test a simple drawing recognition system, and see how TensorFlow.js can be used to create intelligent web applications without requiring server-side processing.",
    path: "/ai-demos"
  },
  {
    id: 4,
    title: "Interactive Architecture Diagrams",
    description: "View animated diagrams showing how my applications work with SVG animations demonstrating data flow.",
    icon: "fa-sitemap",
    details: "These interactive architecture diagrams illustrate the structure and data flow of my more complex applications. Using SVG animations, you can follow the journey of data through different system components, understand how the applications are structured, and see the design patterns implemented in real projects.",
    path: "/architecture-diagrams"
  },
  {
    id: 5,
    title: "3D Tech Stack Visualization",
    description: "Explore a Three.js visualization showing my skills and their relationships, interactive when clicking to reveal projects.",
    icon: "fa-cube",
    details: "The 3D Tech Stack Visualization presents my technical skills in an interactive three-dimensional space. Built with Three.js, this visualization shows relationships between different technologies I use and how they connect in real projects. Click on individual technology nodes to see related projects and delve deeper into my expertise areas.",
    path: "/skills"
  },
  {
    id: 6,
    title: "Micro Case Studies",
    description: "Discover visually rich, interactive case studies for each major project with problem statements and solutions.",
    icon: "fa-file-alt",
    details: "Each micro case study provides an in-depth look at a significant project, outlining the problem addressed, the solution implemented, and the results achieved. These case studies include interactive elements to demonstrate key features, architectural decisions, and the technologies used to create successful solutions.",
    path: "/case-studies"
  }
];

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const { theme, isDarkMode } = useTheme();
  
  const handleFeatureClick = (feature) => {
    setSelectedFeature(feature);
    setShowModal(true);
  };
  
  return (
    <>
      <HeroSection>
        <HeroContainer>
          <HeroContent>
            <HeroTitle>
              Hi, I'm <span>Cevdet Baran Oral</span>
            </HeroTitle>
            <HeroSubtitle>
              Software Developer with AI & Full-Stack Expertise
            </HeroSubtitle>
            <Text size="lg">
              A self-taught programmer who completed two degrees by age 21. Specializing in full-stack development, 
              AI technologies, and cloud computing with a proven track record in building innovative solutions.
            </Text>
            <ButtonGroup>
              <PrimaryButton as={Link} to="/projects">
                View Projects
              </PrimaryButton>
              <SecondaryButton as={Link} to="/contact">
                Contact Me
              </SecondaryButton>
            </ButtonGroup>
          </HeroContent>
          <HeroImage>
            <img src="https://via.placeholder.com/500x400" alt="Developer" />
          </HeroImage>
        </HeroContainer>
      </HeroSection>
      
      <Section>
        <Heading>
          Featured Sections
        </Heading>
        <Text size="lg" margin="0 0 32px 0">
          Explore interactive components showcasing my technical expertise and projects.
        </Text>
        
        <GridContainer>
          {featuredSections.map((feature) => (
            <FeatureCard key={feature.id} onClick={() => handleFeatureClick(feature)}>
              <FeatureIcon>
                <i className={`fas ${feature.icon}`}></i>
              </FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <Text>{feature.description}</Text>
              <CardOverlay className="card-overlay">
                <span className="view-details">View Details</span>
              </CardOverlay>
            </FeatureCard>
          ))}
        </GridContainer>
      </Section>
      
      <Section>
        <CTAContainer>
          <CTATitle>Let's Work Together</CTATitle>
          <Text size="lg" margin="0 0 32px 0" $center $maxWidth="800px">
            I'm currently focused on creating innovative solutions using AI, cloud technologies,
            and modern web frameworks. Looking for new opportunities to apply my skills in
            challenging projects.
          </Text>
          <PrimaryButton as={Link} to="/contact">
            Get In Touch
          </PrimaryButton>
        </CTAContainer>
      </Section>
      
      {showModal && selectedFeature && (
        <Modal
          title={selectedFeature.title}
          onClose={() => setShowModal(false)}
        >
          <ModalContent>
            <ModalImage>
              <i className={`fas ${selectedFeature.icon}`}></i>
            </ModalImage>
            <Text>{selectedFeature.details}</Text>
          </ModalContent>
          <PrimaryButton as={Link} to={selectedFeature.path}>
            Explore
          </PrimaryButton>
        </Modal>
      )}
    </>
  );
};

export default HomePage; 