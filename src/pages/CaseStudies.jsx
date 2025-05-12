import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  Section, 
  Heading, 
  SubHeading,
  Text, 
  NeumorphicContainer, 
  FlexContainer,
  Divider
} from '../styles/StyledComponents';
import Modal from '../components/ui/Modal';
import { useTheme } from '../context/ThemeContext';

const CaseStudiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${props => props.theme.spacing.xl};
  margin-top: ${props => props.theme.spacing.xl};
`;

const CaseStudyCard = styled(NeumorphicContainer)`
  display: flex;
  flex-direction: column;
  cursor: pointer;
  overflow: hidden;
  transition: all ${props => props.theme.animations.normal};
  position: relative;
  padding: 0;
  
  &:hover {
    transform: translateY(-10px);
    
    .card-overlay {
      opacity: 1;
    }
  }
`;

const CaseStudyImage = styled.div`
  height: 200px;
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
`;

const CaseStudyContent = styled.div`
  padding: ${props => props.theme.spacing.lg};
`;

const CaseStudyTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.xs};
  margin-top: ${props => props.theme.spacing.md};
`;

const CaseStudyTag = styled.span`
  background-color: ${props => props.theme.colors.primary}22;
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.typography.fontSizes.xs};
  padding: 4px 8px;
  border-radius: ${props => props.theme.borderRadius.small};
`;

const CardOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => `linear-gradient(rgba(0,0,0,0.3), ${props.theme.colors.primary}99)`};
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity ${props => props.theme.animations.normal};
  
  .view-case {
    color: white;
    font-weight: ${props => props.theme.typography.fontWeights.semiBold};
    padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
    border: 2px solid white;
    border-radius: ${props => props.theme.borderRadius.medium};
    backdrop-filter: blur(4px);
  }
`;

const ModalImageContainer = styled.div`
  width: 100%;
  height: 250px;
  margin-bottom: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.medium};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.medium};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ModalSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ModalSectionTitle = styled.h3`
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.semiBold};
`;

const ProcessStep = styled(NeumorphicContainer)`
  display: flex;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
`;

const StepNumber = styled.div`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${props => props.theme.spacing.md};
  flex-shrink: 0;
`;

const StepContent = styled.div`
  flex: 1;
`;

const ResultMetric = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.md};
  
  .metric-value {
    font-size: ${props => props.theme.typography.fontSizes.xxl};
    color: ${props => props.theme.colors.primary};
    font-weight: ${props => props.theme.typography.fontWeights.bold};
  }
  
  .metric-label {
    color: ${props => props.theme.colors.text};
    font-size: ${props => props.theme.typography.fontSizes.sm};
  }
`;

// Sample case studies data
const caseStudiesData = [
  {
    id: 1,
    title: "E-Commerce Platform Redesign",
    description: "Complete redesign of an online store with focus on UX and conversion rate optimization.",
    tags: ["UX Design", "React", "Node.js", "MongoDB"],
    image: "https://via.placeholder.com/800x400?text=E-Commerce+Platform",
    client: "RetailTech Inc.",
    duration: "3 months",
    role: "Lead Developer & UX Designer",
    challenge: "The client's existing e-commerce platform had a high cart abandonment rate (78%) and poor mobile experience, leading to lost sales and customer frustration.",
    approach: [
      "Conducted extensive user research with existing customers to identify pain points",
      "Created detailed user personas and journey maps",
      "Developed interactive prototypes for A/B testing",
      "Implemented a responsive design optimized for all devices",
      "Rebuilt the checkout process to reduce friction"
    ],
    solution: "Developed a fully responsive React-based frontend with a Node.js backend. Introduced a streamlined one-page checkout process, enhanced product filters, and integrated real-time inventory updates.",
    results: [
      { value: "52%", label: "Decrease in cart abandonment" },
      { value: "35%", label: "Increase in mobile conversions" },
      { value: "28%", label: "Growth in average order value" }
    ],
    testimonial: {
      quote: "Our online sales have dramatically increased since the redesign. The new user experience has received overwhelmingly positive feedback from our customers.",
      author: "Jane Smith, CEO of RetailTech Inc."
    }
  },
  {
    id: 2,
    title: "AI-Powered Content Recommendation Engine",
    description: "Developed a machine learning algorithm to personalize content recommendations based on user behavior.",
    tags: ["Machine Learning", "Python", "TensorFlow", "React"],
    image: "https://via.placeholder.com/800x400?text=AI+Recommendation+Engine",
    client: "MediaStream",
    duration: "5 months",
    role: "ML Engineer & Full Stack Developer",
    challenge: "MediaStream needed to improve user engagement and retention by showing more relevant content to users. Their existing recommendation system was based on simple popularity metrics, not personalized preferences.",
    approach: [
      "Analyzed existing user behavior data to identify patterns",
      "Developed and trained multiple ML models for content similarity",
      "Created a hybrid filtering system combining collaborative and content-based approaches",
      "Implemented A/B testing framework to evaluate algorithm performance",
      "Designed scalable API architecture for real-time recommendations"
    ],
    solution: "Built a TensorFlow-based recommendation engine that analyzes content features and user behavior to provide personalized suggestions. The system continuously learns from user interactions to improve accuracy over time.",
    results: [
      { value: "47%", label: "Increase in content consumption" },
      { value: "23%", label: "Longer average session duration" },
      { value: "18%", label: "Improvement in user retention" }
    ],
    testimonial: {
      quote: "The recommendation engine has transformed how users interact with our platform. The personalized experience has been a game-changer for our business metrics.",
      author: "Michael Chen, CTO of MediaStream"
    }
  },
  {
    id: 3,
    title: "Healthcare Patient Portal",
    description: "Secure patient management system that simplifies appointment scheduling and medical record access.",
    tags: ["React", "Express", "PostgreSQL", "HIPAA Compliance"],
    image: "https://via.placeholder.com/800x400?text=Healthcare+Portal",
    client: "HealthConnect Medical Group",
    duration: "6 months",
    role: "Full Stack Developer & Security Specialist",
    challenge: "HealthConnect needed a HIPAA-compliant platform to streamline patient communications, reduce administrative workload, and enhance patient access to their medical records securely.",
    approach: [
      "Conducted stakeholder interviews with medical staff and patients",
      "Created detailed wireframes and user flows for all portal functions",
      "Implemented end-to-end encryption for all sensitive data",
      "Developed automated testing for security vulnerabilities",
      "Established an audit trail system for compliance requirements"
    ],
    solution: "Developed a secure React-based portal with role-based access control, integrated appointment scheduling system, secure messaging, and electronic health record visualization. The system included two-factor authentication and full encryption of patient data.",
    results: [
      { value: "72%", label: "Reduction in phone calls" },
      { value: "64%", label: "Decrease in no-show appointments" },
      { value: "88%", label: "Patient satisfaction rate" }
    ],
    testimonial: {
      quote: "This portal has revolutionized our practice operations. Our staff saves countless hours, and patients appreciate the convenient access to their information and care team.",
      author: "Dr. Sarah Johnson, Medical Director at HealthConnect"
    }
  },
  {
    id: 4,
    title: "Real-time Analytics Dashboard",
    description: "Interactive data visualization platform that provides business intelligence insights from multiple data sources.",
    tags: ["D3.js", "Vue.js", "GraphQL", "AWS"],
    image: "https://via.placeholder.com/800x400?text=Analytics+Dashboard",
    client: "DataVision Inc.",
    duration: "4 months",
    role: "Frontend Developer & Data Visualization Specialist",
    challenge: "DataVision needed to consolidate data from multiple sources into actionable insights for business stakeholders. Their existing reporting system was fragmented and required manual data collection.",
    approach: [
      "Aggregated data sources through a unified GraphQL API",
      "Designed intuitive dashboard layouts based on user roles",
      "Created custom D3.js visualizations for complex datasets",
      "Implemented real-time updates using WebSockets",
      "Developed customizable report generation"
    ],
    solution: "Created a Vue.js-based dashboard with real-time data visualization, customizable widgets, and automated reporting. The system processed data from multiple sources and provided actionable insights through interactive charts and tables.",
    results: [
      { value: "85%", label: "Reduction in reporting time" },
      { value: "32%", label: "Improvement in data-driven decisions" },
      { value: "4.8/5", label: "User satisfaction rating" }
    ],
    testimonial: {
      quote: "The dashboard has transformed how we make decisions. Having all our data visualized in real-time allows us to identify trends and act quickly on opportunities.",
      author: "Robert Wilson, Data Analytics Lead at DataVision"
    }
  }
];

const CaseStudiesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);
  const { theme } = useTheme();

  const handleCaseStudyClick = (caseStudy) => {
    setSelectedCaseStudy(caseStudy);
    setIsModalOpen(true);
  };

  const handleStartExperience = () => {
    console.log('Starting interactive case study experience for', selectedCaseStudy.title);
    // In a real implementation, this would launch a full interactive experience
  };

  return (
    <>
      <Section>
        <Heading style={{ textAlign: 'center' }}>
          Case <span style={{ color: theme.colors.primary }}>Studies</span>
        </Heading>
        
        <Text style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', marginBottom: theme.spacing.xl }}>
          Dive into detailed explorations of my most significant projects. Each case study provides
          insights into the challenges faced, approaches taken, and results achieved.
        </Text>
        
        <CaseStudiesGrid>
          {caseStudiesData.map(caseStudy => (
            <CaseStudyCard key={caseStudy.id} onClick={() => handleCaseStudyClick(caseStudy)}>
              <CaseStudyImage image={caseStudy.image} />
              <CaseStudyContent>
                <SubHeading>{caseStudy.title}</SubHeading>
                <Text size="sm">{caseStudy.description}</Text>
                
                <CaseStudyTags>
                  {caseStudy.tags.map((tag, index) => (
                    <CaseStudyTag key={index}>{tag}</CaseStudyTag>
                  ))}
                </CaseStudyTags>
              </CaseStudyContent>
              
              <CardOverlay className="card-overlay">
                <div className="view-case">View Case Study</div>
              </CardOverlay>
            </CaseStudyCard>
          ))}
        </CaseStudiesGrid>
      </Section>
      
      {/* Modal for case study details */}
      {selectedCaseStudy && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedCaseStudy.title}
          onStart={handleStartExperience}
          startButtonText="Interactive Experience"
        >
          <ModalImageContainer>
            <img src={selectedCaseStudy.image} alt={selectedCaseStudy.title} />
          </ModalImageContainer>
          
          <FlexContainer justify="space-between" wrap="wrap" gap="md">
            <div>
              <Text size="sm" weight="semiBold">Client</Text>
              <Text>{selectedCaseStudy.client}</Text>
            </div>
            <div>
              <Text size="sm" weight="semiBold">Duration</Text>
              <Text>{selectedCaseStudy.duration}</Text>
            </div>
            <div>
              <Text size="sm" weight="semiBold">Role</Text>
              <Text>{selectedCaseStudy.role}</Text>
            </div>
          </FlexContainer>
          
          <Divider />
          
          <ModalSection>
            <ModalSectionTitle>Challenge</ModalSectionTitle>
            <Text>{selectedCaseStudy.challenge}</Text>
          </ModalSection>
          
          <ModalSection>
            <ModalSectionTitle>Approach</ModalSectionTitle>
            {selectedCaseStudy.approach.map((step, index) => (
              <ProcessStep key={index}>
                <StepNumber>{index + 1}</StepNumber>
                <StepContent>
                  <Text>{step}</Text>
                </StepContent>
              </ProcessStep>
            ))}
          </ModalSection>
          
          <ModalSection>
            <ModalSectionTitle>Solution</ModalSectionTitle>
            <Text>{selectedCaseStudy.solution}</Text>
          </ModalSection>
          
          <ModalSection>
            <ModalSectionTitle>Results</ModalSectionTitle>
            <FlexContainer justify="space-around" wrap="wrap">
              {selectedCaseStudy.results.map((result, index) => (
                <ResultMetric key={index}>
                  <div className="metric-value">{result.value}</div>
                  <div className="metric-label">{result.label}</div>
                </ResultMetric>
              ))}
            </FlexContainer>
          </ModalSection>
          
          <NeumorphicContainer style={{ padding: theme.spacing.lg, backgroundColor: `${theme.colors.primary}11` }}>
            <Text size="lg" weight="semiBold" style={{ marginBottom: theme.spacing.sm, fontStyle: 'italic' }}>
              "{selectedCaseStudy.testimonial.quote}"
            </Text>
            <Text size="sm" weight="medium">
              — {selectedCaseStudy.testimonial.author}
            </Text>
          </NeumorphicContainer>
          
          <Text style={{ marginTop: theme.spacing.lg }}>
            Click the "Interactive Experience" button below to explore this case study in an
            interactive format with detailed visuals, process breakdowns, and results.
          </Text>
        </Modal>
      )}
    </>
  );
};

export default CaseStudiesPage; 