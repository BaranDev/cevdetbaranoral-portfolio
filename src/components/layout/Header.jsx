import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { 
  NeumorphicContainer, 
  FlexContainer, 
  NeumorphicButton 
} from '../../styles/StyledComponents';
import ThemeToggle from '../ui/ThemeToggle';
import CVDownloadButton from '../ui/CVDownloadButton';
import { useTheme } from '../../context/ThemeContext';
import logoImage from '../../assets/logo.png';

// Keyframe animations
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const textGlow = keyframes`
  0% { text-shadow: 0 0 5px rgba(75, 112, 226, 0); }
  50% { text-shadow: 0 0 10px rgba(75, 112, 226, 0.5); }
  100% { text-shadow: 0 0 5px rgba(75, 112, 226, 0); }
`;

// Styled components for the header
const HeaderContainer = styled(NeumorphicContainer)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: ${props => props.theme.spacing.md};
  border-radius: 0 0 ${props => props.theme.borderRadius.medium} ${props => props.theme.borderRadius.medium};
  background-color: ${props => props.theme.colors.background};
  transition: all ${props => props.theme.animations.normal};
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    div {
      animation: ${textGlow} 1.5s ease infinite;
      letter-spacing: 1px;
    }
  }
`;

const LogoImage = styled.img`
  height: 40px;
  width: auto;
  margin-right: ${props => props.theme.spacing.sm};
  border-radius: 8px;
  padding: 4px;
  background-color: ${props => props.theme.colors.background};
  box-shadow: ${props => props.theme.shadows.small};
  transition: all 0.3s ease;
  
  /* Apply theme-specific filters directly */
  filter: ${props => props.theme.colors.background === '#1a1f2e' 
    ? 'brightness(0.9) contrast(1.1) saturate(0.9)' 
    : 'brightness(1.02) contrast(1.05) saturate(0.95)'};
  
  /* Hover effect */
  ${LogoContainer}:hover & {
    filter: brightness(1.05) contrast(1.05) drop-shadow(0 0 8px ${props => props.theme.colors.primary}40);
  }
`;

const LogoText = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.xl};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.primary};
  background: linear-gradient(135deg, 
    ${props => props.theme.colors.primary} 0%, 
    ${props => props.theme.colors.secondary} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(to right, 
      transparent 0%, 
      ${props => props.theme.colors.primary}50 50%,
      transparent 100%);
    opacity: 0.6;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: none;
  }
`;

const NavLinks = styled(FlexContainer)`
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: ${props => (props.$isOpen ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: ${props => props.theme.colors.background};
    padding: ${props => props.theme.spacing.md};
    box-shadow: ${props => props.theme.shadows.medium};
  }
`;

const NavLink = styled(Link)`
  position: relative;
  color: ${props => props.$isActive ? props.theme.colors.primary : props.theme.colors.text};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  overflow: hidden;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: ${props => props.$isActive ? '80%' : '0'};
    height: 2px;
    background-color: ${props => props.theme.colors.primary};
    transition: all ${props => props.theme.animations.normal};
    transform: translateX(-50%);
  }
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    
    &:after {
      width: 80%;
    }
  }
`;

const MobileMenuButton = styled(NeumorphicButton)`
  display: none;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: block;
  }
`;

const HeaderActions = styled(FlexContainer)`
  margin-left: ${props => props.theme.spacing.xl};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    margin-top: ${props => props.$isOpen ? props.theme.spacing.md : 0};
    margin-left: 0;
  }
`;

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { theme } = useTheme();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const isLinkActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <HeaderContainer 
      style={{ 
        boxShadow: isScrolled ? theme.shadows.large : theme.shadows.medium,
      }}
    >
      <FlexContainer justify="space-between" align="center">
        <Link to="/">
          <LogoContainer>
            <LogoImage src={logoImage} alt="Barandev Logo" />
            <LogoText>Barandev</LogoText>
          </LogoContainer>
        </Link>
        
        <MobileMenuButton onClick={toggleMobileMenu}>
          <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </MobileMenuButton>
        
        <NavLinks $isOpen={isMobileMenuOpen} gap="xl" align="center">
          <NavLink to="/" $isActive={isLinkActive('/')}>Home</NavLink>
          <NavLink to="/projects" $isActive={isLinkActive('/projects')}>Projects</NavLink>
          <NavLink to="/skills" $isActive={isLinkActive('/skills')}>Skills</NavLink>
          <NavLink to="/case-studies" $isActive={isLinkActive('/case-studies')}>Case Studies</NavLink>
          <NavLink to="/components" $isActive={isLinkActive('/components')}>UI Components</NavLink>
          <NavLink to="/contact" $isActive={isLinkActive('/contact')}>Contact</NavLink>
          
          <HeaderActions $isOpen={isMobileMenuOpen} gap="xl" align="center">
            <CVDownloadButton />
            <ThemeToggle />
          </HeaderActions>
        </NavLinks>
      </FlexContainer>
    </HeaderContainer>
  );
};

export default Header; 