import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { 
  NeumorphicContainer, 
  FlexContainer, 
  Text,
  NeumorphicIcon,
  Divider
} from '../../styles/StyledComponents';
import { useTheme } from '../../context/ThemeContext';

const FooterContainer = styled(NeumorphicContainer)`
  margin-top: ${props => props.theme.spacing.xxl};
  border-radius: ${props => props.theme.borderRadius.medium} ${props => props.theme.borderRadius.medium} 0 0;
  padding: ${props => props.theme.spacing.xl};
`;

const FooterColumn = styled.div`
  flex: 1;
  min-width: 200px;
  padding: ${props => props.theme.spacing.md};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    margin-bottom: ${props => props.theme.spacing.lg};
  }
`;

const FooterHeading = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.semiBold};
  margin-bottom: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.primary};
`;

const FooterLink = styled(Link)`
  display: block;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.xs} 0;
  transition: all ${props => props.theme.animations.fast};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    transform: translateX(5px);
  }
`;

const SocialLinks = styled(FlexContainer)`
  margin-top: ${props => props.theme.spacing.md};
`;

const Copyright = styled(Text)`
  text-align: center;
  margin-top: ${props => props.theme.spacing.lg};
  color: ${props => props.theme.colors.secondary};
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { theme } = useTheme();
  
  return (
    <FooterContainer>
      <FlexContainer wrap="wrap" gap="xl">
        <FooterColumn>
          <FooterHeading>Portfolio</FooterHeading>
          <Text>
            A showcase of my skills, projects, and experience as a Software Engineering undergraduate
            with expertise in AI technologies and full-stack development.
          </Text>
          
          <SocialLinks gap="lg">
            <NeumorphicIcon as="a" href="https://github.com/barandev" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-github"></i>
            </NeumorphicIcon>
            <NeumorphicIcon as="a" href="https://linkedin.com/in/cevdetbaranoral" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin-in"></i>
            </NeumorphicIcon>
            <NeumorphicIcon as="a" href="https://cevdetbaran.com" target="_blank" rel="noopener noreferrer">
              <i className="fas fa-globe"></i>
            </NeumorphicIcon>
            <NeumorphicIcon as="a" href="mailto:cevdetbaranoral@gmail.com">
              <i className="fas fa-envelope"></i>
            </NeumorphicIcon>
          </SocialLinks>
        </FooterColumn>
        
        <FooterColumn>
          <FooterHeading>Quick Links</FooterHeading>
          <FooterLink to="/">Home</FooterLink>
          <FooterLink to="/projects">Projects</FooterLink>
          <FooterLink to="/skills">Skills</FooterLink>
          <FooterLink to="/case-studies">Case Studies</FooterLink>
          <FooterLink to="/components">UI Components</FooterLink>
        </FooterColumn>
        
        <FooterColumn>
          <FooterHeading>Contact</FooterHeading>
          <Text margin="0 0 12px 0">
            <i className="fas fa-map-marker-alt" style={{ marginRight: '12px' }}></i>
            Famagusta, Cyprus
          </Text>
          <Text margin="0 0 12px 0">
            <i className="fas fa-phone" style={{ marginRight: '12px' }}></i>
            +905344583827
          </Text>
          <Text margin="0 0 12px 0">
            <i className="fas fa-envelope" style={{ marginRight: '12px' }}></i>
            cevdetbaranoral@gmail.com
          </Text>
        </FooterColumn>
      </FlexContainer>
      
      <Divider />
      
      <Copyright>
        © {currentYear} Cevdet Baran Oral. All rights reserved. Designed with React and Neumorphism.
      </Copyright>
    </FooterContainer>
  );
};

export default Footer; 