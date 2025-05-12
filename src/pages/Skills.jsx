import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import styled from 'styled-components';
import { 
  Section, 
  Heading, 
  Text as StyledText, 
  NeumorphicContainer, 
  FlexContainer,
  ProgressCircle
} from '../styles/StyledComponents';
import Modal from '../components/ui/Modal';
import { useTheme } from '../context/ThemeContext';
import * as THREE from 'three';

const CanvasContainer = styled(NeumorphicContainer)`
  height: 500px;
  margin: ${props => props.theme.spacing.xl} 0;
  position: relative;
  overflow: hidden;
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
`;

const SkillCategoriesContainer = styled(FlexContainer)`
  margin-top: ${props => props.theme.spacing.xl};
  flex-wrap: wrap;
`;

const SkillCategory = styled(NeumorphicContainer)`
  flex: 1;
  min-width: 250px;
  margin: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.lg};
`;

const CategoryTitle = styled.h3`
  margin-bottom: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.typography.fontSizes.lg};
`;

const SkillList = styled.ul`
  list-style: none;
  padding: 0;
  margin: ${props => props.theme.spacing.md} 0;
`;

const SkillItem = styled.li`
  margin-bottom: ${props => props.theme.spacing.md};
`;

const SkillName = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const SkillBar = styled.div`
  height: 10px;
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.small};
  box-shadow: ${props => props.theme.shadows.inset};
  overflow: hidden;
`;

const SkillProgress = styled.div`
  height: 100%;
  width: ${props => props.progress}%;
  background-color: ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.small};
  transition: width 1s ease-in-out;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: ${props => props.theme.colors.text};
`;

const ModalDescription = styled(StyledText)`
  margin-bottom: ${props => props.theme.spacing.lg};
  line-height: 1.6;
`;

const ViewMoreButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: ${props => props.theme.spacing.sm} 0;
  margin-top: ${props => props.theme.spacing.md};
  transition: all ${props => props.theme.animations.normal};
  
  &:hover {
    text-decoration: underline;
  }
  
  i {
    margin-left: ${props => props.theme.spacing.xs};
  }
`;

// Three.js Skill Node
const SkillNode = ({ name, position, size = 1.5, onClick, color }) => {
  return (
    <group position={position} onClick={onClick}>
      <mesh>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      <Html distanceFactor={15}>
        <div style={{ 
          background: 'rgba(0,0,0,0.5)', 
          padding: '5px 10px', 
          borderRadius: '4px', 
          color: 'white',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          fontSize: '14px',
          fontWeight: 'bold',
          transform: 'translateX(-50%)'
        }}>
          {name}
        </div>
      </Html>
    </group>
  );
};

// Connection between skill nodes
const Connection = ({ start, end, color }) => {
  const points = [
    new THREE.Vector3(...start),
    new THREE.Vector3(...end)
  ];
  
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  
  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial attach="material" color={color} linewidth={1} />
    </line>
  );
};

// 3D Skills Visualization
const SkillsVisualization = ({ onSkillClick }) => {
  const { theme } = useTheme();
  const primaryColor = theme.colors.primary;
  const secondaryColor = theme.colors.secondary;
  
  const skillsData = [
    { id: 1, name: 'JavaScript', position: [0, 0, 0], size: 2, category: 'frontend' },
    { id: 2, name: 'React', position: [4, 2, -3], size: 1.8, category: 'frontend' },
    { id: 3, name: 'Node.js', position: [-4, -2, -2], size: 1.7, category: 'backend' },
    { id: 4, name: 'HTML/CSS', position: [5, -1, 2], size: 1.6, category: 'frontend' },
    { id: 5, name: 'TypeScript', position: [1, 4, 2], size: 1.5, category: 'frontend' },
    { id: 6, name: 'MongoDB', position: [-3, 3, 3], size: 1.5, category: 'backend' },
    { id: 7, name: 'Express', position: [-5, 0, 4], size: 1.4, category: 'backend' },
    { id: 8, name: 'Git', position: [3, -3, -4], size: 1.3, category: 'tools' },
    { id: 9, name: 'TensorFlow', position: [0, -4, 5], size: 1.3, category: 'ai' },
    { id: 10, name: 'Docker', position: [-2, -5, 0], size: 1.2, category: 'devops' },
  ];
  
  // Connections between related skills
  const connections = [
    { start: [0, 0, 0], end: [4, 2, -3] },      // JavaScript -> React
    { start: [0, 0, 0], end: [-4, -2, -2] },    // JavaScript -> Node.js
    { start: [0, 0, 0], end: [1, 4, 2] },       // JavaScript -> TypeScript
    { start: [4, 2, -3], end: [5, -1, 2] },     // React -> HTML/CSS
    { start: [-4, -2, -2], end: [-5, 0, 4] },   // Node.js -> Express
    { start: [-4, -2, -2], end: [-3, 3, 3] },   // Node.js -> MongoDB
    { start: [0, -4, 5], end: [-4, -2, -2] },   // TensorFlow -> Node.js
  ];
  
  return (
    <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <OrbitControls enableZoom={true} enablePan={true} />
      
      {/* Render skills */}
      {skillsData.map((skill) => (
        <SkillNode 
          key={skill.id}
          name={skill.name}
          position={skill.position}
          size={skill.size}
          color={skill.category === 'frontend' ? primaryColor : secondaryColor}
          onClick={() => onSkillClick(skill)}
        />
      ))}
      
      {/* Render connections */}
      {connections.map((connection, index) => (
        <Connection 
          key={index}
          start={connection.start}
          end={connection.end}
          color={secondaryColor}
        />
      ))}
    </Canvas>
  );
};

// Skill category data
const skillCategories = [
  {
    id: 1,
    title: 'Frontend Development',
    skills: [
      { name: 'JavaScript', level: 95 },
      { name: 'React', level: 90 },
      { name: 'TypeScript', level: 85 },
      { name: 'HTML/CSS', level: 90 },
      { name: 'Redux', level: 80 },
    ],
    description: 'Frontend technologies focused on creating responsive, performant, and accessible user interfaces.'
  },
  {
    id: 2,
    title: 'Backend Development',
    skills: [
      { name: 'Node.js', level: 85 },
      { name: 'Express', level: 80 },
      { name: 'MongoDB', level: 75 },
      { name: 'PostgreSQL', level: 70 },
      { name: 'REST API Design', level: 85 },
    ],
    description: 'Backend technologies for building secure, scalable, and efficient server-side applications.'
  },
  {
    id: 3,
    title: 'DevOps & Tools',
    skills: [
      { name: 'Git', level: 90 },
      { name: 'Docker', level: 75 },
      { name: 'CI/CD', level: 70 },
      { name: 'AWS', level: 65 },
      { name: 'Testing', level: 80 },
    ],
    description: 'Tools and practices for improving development workflow, deployment, and maintenance.'
  },
  {
    id: 4,
    title: 'AI & Machine Learning',
    skills: [
      { name: 'TensorFlow', level: 70 },
      { name: 'Python', level: 75 },
      { name: 'Data Analysis', level: 65 },
      { name: 'NLP', level: 60 },
      { name: 'Computer Vision', level: 55 },
    ],
    description: 'AI and machine learning skills for creating intelligent applications and data analysis.'
  }
];

const SkillsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalType, setModalType] = useState('skill');
  const { theme } = useTheme();

  const handleSkillClick = (skill) => {
    setSelectedSkill(skill);
    setModalType('skill');
    setIsModalOpen(true);
  };

  const handleCategoryButtonClick = (category) => {
    setSelectedCategory(category);
    setModalType('category');
    setIsModalOpen(true);
  };

  const handleStartExperience = () => {
    console.log('Starting experience for', modalType === 'skill' ? selectedSkill.name : selectedCategory.title);
    // In a real implementation, this would launch a full experience
  };

  return (
    <>
      <Section>
        <Heading style={{ textAlign: 'center' }}>
          My <span style={{ color: theme.colors.primary }}>Skills</span> & Expertise
        </Heading>
        
        <StyledText style={{ textAlign: 'center', marginBottom: theme.spacing.xl }}>
          Explore my skills and expertise areas in this interactive 3D visualization.
          Click on any skill node to learn more about my experience with that technology.
        </StyledText>
        
        <CanvasContainer>
          <Suspense fallback={<LoadingContainer>Loading Skills Visualization...</LoadingContainer>}>
            <SkillsVisualization onSkillClick={handleSkillClick} />
          </Suspense>
        </CanvasContainer>
        
        <SkillCategoriesContainer>
          {skillCategories.map(category => (
            <SkillCategory key={category.id}>
              <CategoryTitle>{category.title}</CategoryTitle>
              <StyledText size="sm">{category.description}</StyledText>
              
              <SkillList>
                {category.skills.slice(0, 3).map((skill, index) => (
                  <SkillItem key={index}>
                    <SkillName>
                      <StyledText size="sm">{skill.name}</StyledText>
                      <StyledText size="sm" color={theme.colors.primary}>{skill.level}%</StyledText>
                    </SkillName>
                    <SkillBar>
                      <SkillProgress progress={skill.level} />
                    </SkillBar>
                  </SkillItem>
                ))}
              </SkillList>
              
              <ViewMoreButton onClick={() => handleCategoryButtonClick(category)}>
                View more skills <i className="fas fa-arrow-right"></i>
              </ViewMoreButton>
            </SkillCategory>
          ))}
        </SkillCategoriesContainer>
      </Section>
      
      {/* Modal for viewing skill or category details */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalType === 'skill' ? (selectedSkill?.name || '') : (selectedCategory?.title || '')}
        onStart={handleStartExperience}
        startButtonText="Explore Details"
      >
        {modalType === 'skill' && selectedSkill && (
          <div>
            <ModalDescription>
              This is where you can find detailed information about my experience with {selectedSkill.name}. 
              In a real portfolio, this would include projects I've built with this technology, 
              my years of experience, and specific capabilities.
            </ModalDescription>
            
            <NeumorphicContainer style={{ padding: theme.spacing.md, marginBottom: theme.spacing.lg }}>
              <FlexContainer justify="space-between" align="center">
                <div>
                  <StyledText size="lg" weight="semiBold">Experience Level</StyledText>
                  <StyledText>Advanced</StyledText>
                </div>
                <ProgressCircle size="80px" progress="85%" color={theme.colors.primary}>
                  <StyledText style={{ position: 'relative', zIndex: 2, textAlign: 'center', marginTop: '30px' }}>
                    85%
                  </StyledText>
                </ProgressCircle>
              </FlexContainer>
            </NeumorphicContainer>
            
            <StyledText>
              Click "Explore Details" to see a detailed showcase of my {selectedSkill.name} skills,
              including code samples, projects, and achievements.
            </StyledText>
          </div>
        )}
        
        {modalType === 'category' && selectedCategory && (
          <div>
            <ModalDescription>
              {selectedCategory.description}
            </ModalDescription>
            
            <SkillList>
              {selectedCategory.skills.map((skill, index) => (
                <SkillItem key={index}>
                  <SkillName>
                    <StyledText>{skill.name}</StyledText>
                    <StyledText color={theme.colors.primary}>{skill.level}%</StyledText>
                  </SkillName>
                  <SkillBar>
                    <SkillProgress progress={skill.level} />
                  </SkillBar>
                </SkillItem>
              ))}
            </SkillList>
            
            <StyledText style={{ marginTop: theme.spacing.lg }}>
              Click "Explore Details" to see more about my expertise in {selectedCategory.title},
              including related projects and technologies.
            </StyledText>
          </div>
        )}
      </Modal>
    </>
  );
};

export default SkillsPage; 