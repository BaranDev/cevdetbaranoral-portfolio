import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { 
  NeumorphicContainer, 
  NeumorphicButton, 
  FlexContainer,
  SubHeading,
  Text
} from '../../styles/StyledComponents';
import { useTheme } from '../../context/ThemeContext';

// Timeline container with neumorphic styling
const TimelineContainer = styled(NeumorphicContainer)`
  padding: ${props => props.theme.spacing.lg};
  margin: ${props => props.theme.spacing.xl} 0;
  position: relative;
`;

// Timeline title
const TimelineTitle = styled(SubHeading)`
  margin-bottom: ${props => props.theme.spacing.lg};
  text-align: center;
`;

// Timeline track
const TimelineTrack = styled.div`
  position: relative;
  width: 6px;
  background-color: ${props => props.isDarkMode 
    ? 'rgba(111, 140, 233, 0.3)' 
    : 'rgba(75, 112, 226, 0.3)'};
  margin: 0 auto;
  height: 100%;
  border-radius: 3px;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 16px;
    height: 16px;
    background-color: ${props => props.theme.colors.primary};
    border-radius: 50%;
    box-shadow: ${props => props.theme.shadows.small};
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 16px;
    height: 16px;
    background-color: ${props => props.theme.colors.primary};
    border-radius: 50%;
    box-shadow: ${props => props.theme.shadows.small};
  }
`;

// Timeline item container
const TimelineItem = styled.div`
  padding-left: ${props => props.isLeft ? '0' : '50%'};
  padding-right: ${props => props.isLeft ? '50%' : '0'};
  position: relative;
  margin-bottom: ${props => props.theme.spacing.xl};
  opacity: ${props => props.isVisible ? 1 : 0};
  transform: translateX(${props => props.isVisible 
    ? '0' 
    : (props.isLeft ? '-50px' : '50px')});
  transition: all 0.5s ease;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding-left: 30px;
    padding-right: 0;
  }
`;

// Timeline content
const TimelineContent = styled(NeumorphicContainer)`
  position: relative;
  padding: ${props => props.theme.spacing.lg};
  margin: 0 ${props => props.theme.spacing.lg};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
  }
  
  // Pointer to timeline
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    width: 20px;
    height: 20px;
    background-color: ${props => props.theme.colors.background};
    border-radius: 50%;
    box-shadow: ${props => props.theme.shadows.small};
    z-index: 1;
    
    // Change position based on left/right
    ${props => props.isLeft 
      ? `right: -10px; transform: translateY(-50%);` 
      : `left: -10px; transform: translateY(-50%);`}
    
    @media (max-width: ${props => props.theme.breakpoints.md}) {
      left: -10px;
      transform: translateY(-50%);
    }
  }
  
  // Line connecting to timeline
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    height: 2px;
    background-color: ${props => props.theme.colors.primary};
    z-index: 0;
    
    // Change position based on left/right
    ${props => props.isLeft 
      ? `right: 10px; width: ${props.theme.spacing.xl};` 
      : `left: 10px; width: ${props.theme.spacing.xl};`}
    
    @media (max-width: ${props => props.theme.breakpoints.md}) {
      left: 10px;
      width: 20px;
    }
  }
`;

// Timeline date badge
const DateBadge = styled.div`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.md};
  display: inline-block;
  margin-bottom: ${props => props.theme.spacing.sm};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  box-shadow: ${props => props.theme.shadows.small};
`;

// Timeline item title
const ItemTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  margin-bottom: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.text};
`;

// Technology pill
const TechPill = styled.span`
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.primary};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: 20px;
  margin-right: 8px;
  margin-bottom: 8px;
  display: inline-block;
  font-size: ${props => props.theme.typography.fontSizes.xs};
  box-shadow: ${props => props.theme.shadows.small};
`;

// Detail modal when clicking a timeline item
const DetailModal = styled(NeumorphicContainer)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  padding: ${props => props.theme.spacing.xl};
  z-index: 1000;
  box-shadow: ${props => props.theme.shadows.large};
  background: ${props => props.theme.colors.glassMorphism};
  backdrop-filter: blur(10px);
  border: 1px solid ${props => props.theme.colors.glassMorphismBorder};
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

// Modal overlay
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  z-index: 999;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

// Modal title
const ModalTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSizes.xl};
  margin-bottom: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.text};
`;

// Modal close button
const CloseButton = styled(NeumorphicButton)`
  position: absolute;
  top: ${props => props.theme.spacing.md};
  right: ${props => props.theme.spacing.md};
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-radius: ${props => props.theme.borderRadius.circle};
`;

// Project image
const ProjectImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.medium};
  margin-bottom: ${props => props.theme.spacing.md};
`;

// Sample project data
const projects = [
  {
    id: 1,
    title: "Personal Portfolio Website",
    date: "June 2023",
    description: "Created a responsive portfolio website to showcase projects and skills",
    technologies: ["React", "Styled Components", "Neumorphism"],
    details: "Designed and developed a modern portfolio website following neumorphic design principles. The site features interactive elements, responsive layouts, and smooth animations to create an engaging user experience.",
    image: "https://via.placeholder.com/600x300"
  },
  {
    id: 2,
    title: "E-Commerce Platform",
    date: "August 2023",
    description: "Built a full-featured online store with payment integration",
    technologies: ["Next.js", "MongoDB", "Stripe", "AWS"],
    details: "Developed a complete e-commerce solution including product catalog, shopping cart, user authentication, and secure payment processing. Implemented a responsive design and optimized performance for fast page loads.",
    image: "https://via.placeholder.com/600x300"
  },
  {
    id: 3,
    title: "AI-Powered Chat Application",
    date: "November 2023",
    description: "Created a real-time chat app with AI-based response suggestions",
    technologies: ["React", "Node.js", "Socket.io", "TensorFlow.js"],
    details: "Built a real-time messaging application that uses machine learning to suggest responses based on conversation context. Features include user authentication, message encryption, and persistent chat history.",
    image: "https://via.placeholder.com/600x300"
  },
  {
    id: 4,
    title: "Health Tracking Mobile App",
    date: "January 2024",
    description: "Developed a mobile application for tracking personal health metrics",
    technologies: ["React Native", "Firebase", "D3.js", "Expo"],
    details: "Created a cross-platform mobile app that helps users track their health metrics including activity, nutrition, and sleep. The app features interactive charts, goal setting, and personalized recommendations.",
    image: "https://via.placeholder.com/600x300"
  },
  {
    id: 5,
    title: "Music Streaming Service",
    date: "March 2024",
    description: "Implemented a feature-rich streaming platform for independent artists",
    technologies: ["Vue.js", "Express", "PostgreSQL", "WebAudio API"],
    details: "Designed and built a music streaming platform focused on independent artists. The service includes features such as playlist creation, artist profiles, recommendation algorithms, and audio visualization.",
    image: "https://via.placeholder.com/600x300"
  },
  {
    id: 6,
    title: "Task Management System",
    date: "May 2024",
    description: "Developed a collaborative project management tool with real-time updates",
    technologies: ["React", "GraphQL", "MongoDB", "WebSockets"],
    details: "Created a comprehensive project management system with features including task assignment, progress tracking, team collaboration, and reporting. The application uses real-time updates to keep team members in sync.",
    image: "https://via.placeholder.com/600x300"
  }
];

const ProjectTimeline = () => {
  const [visibleItems, setVisibleItems] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const timelineRef = useRef(null);
  const { theme, isDarkMode } = useTheme();
  
  useEffect(() => {
    const handleScroll = () => {
      const timelineElement = timelineRef.current;
      if (!timelineElement) return;
      
      const timelineItems = timelineElement.querySelectorAll('.timeline-item');
      const windowHeight = window.innerHeight;
      
      timelineItems.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const isVisible = rect.top < windowHeight * 0.8;
        
        if (isVisible && !visibleItems.includes(index)) {
          setVisibleItems(prev => [...prev, index]);
        }
      });
    };
    
    // Initial check
    handleScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [visibleItems]);
  
  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = ''; // Restore scrolling
  };
  
  // Handle click outside modal to close
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };
  
  return (
    <>
      <TimelineContainer ref={timelineRef}>
        <TimelineTitle>My Project Journey</TimelineTitle>
        
        <div style={{ position: 'relative', minHeight: '800px' }}>
          <TimelineTrack theme={theme} isDarkMode={isDarkMode} />
          
          {projects.map((project, index) => (
            <TimelineItem 
              key={project.id}
              className="timeline-item"
              isLeft={index % 2 === 0}
              isVisible={visibleItems.includes(index)}
              theme={theme}
            >
              <TimelineContent 
                isLeft={index % 2 === 0} 
                onClick={() => handleProjectClick(project)}
                theme={theme}
              >
                <DateBadge theme={theme}>{project.date}</DateBadge>
                <ItemTitle theme={theme}>{project.title}</ItemTitle>
                <Text size="sm" margin="0 0 16px 0">
                  {project.description}
                </Text>
                <div>
                  {project.technologies.map((tech, techIndex) => (
                    <TechPill key={techIndex} theme={theme}>
                      {tech}
                    </TechPill>
                  ))}
                </div>
              </TimelineContent>
            </TimelineItem>
          ))}
        </div>
      </TimelineContainer>
      
      {/* Project detail modal */}
      <Overlay isOpen={isModalOpen} onClick={handleOverlayClick} />
      
      {selectedProject && (
        <DetailModal isOpen={isModalOpen} theme={theme}>
          <CloseButton onClick={closeModal} theme={theme}>
            ✕
          </CloseButton>
          
          <ModalTitle theme={theme}>{selectedProject.title}</ModalTitle>
          <DateBadge theme={theme}>{selectedProject.date}</DateBadge>
          
          <ProjectImage 
            src={selectedProject.image} 
            alt={selectedProject.title}
            theme={theme}
          />
          
          <Text margin="0 0 16px 0">
            {selectedProject.details}
          </Text>
          
          <SubHeading size="md" margin="0 0 8px 0">Technologies</SubHeading>
          <div>
            {selectedProject.technologies.map((tech, techIndex) => (
              <TechPill key={techIndex} theme={theme}>
                {tech}
              </TechPill>
            ))}
          </div>
          
          <FlexContainer justify="center" margin="24px 0 0 0">
            <NeumorphicButton primary theme={theme}>
              View Project
            </NeumorphicButton>
          </FlexContainer>
        </DetailModal>
      )}
    </>
  );
};

export default ProjectTimeline; 