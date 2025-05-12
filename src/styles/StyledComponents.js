import styled from 'styled-components';

// Container with neumorphic styling
export const NeumorphicContainer = styled.div`
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius[props.radius || 'medium']};
  padding: ${props => props.theme.spacing[props.padding || 'lg']};
  box-shadow: ${props => props.theme.shadows.medium};
  transition: all ${props => props.theme.animations.normal};
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.large};
  }
`;

// Inset container (pressed in)
export const NeumorphicInsetContainer = styled.div`
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius[props.radius || 'medium']};
  padding: ${props => props.theme.spacing[props.padding || 'lg']};
  box-shadow: ${props => props.theme.shadows.inset};
`;

// Button with neumorphic styling
export const NeumorphicButton = styled.button`
  background-color: ${props => props.$primary ? props.theme.colors.primary : props.theme.colors.background};
  color: ${props => props.$primary ? props.theme.colors.white || '#ffffff' : (props.color || props.theme.colors.text)};
  border: none;
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  font-family: ${props => props.theme.typography.fontFamily};
  font-size: ${props => props.theme.typography.fontSizes.md};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  cursor: pointer;
  box-shadow: ${props => props.$primary ? props.theme.shadows.medium : props.theme.shadows.medium};
  transition: all ${props => props.theme.animations.normal};
  
  &:hover {
    box-shadow: ${props => props.$primary ? props.theme.shadows.large : props.theme.shadows.large};
  }
  
  &:active {
    box-shadow: ${props => props.$primary ? props.theme.shadows.inset : props.theme.shadows.inset};
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.disabled || '#e0e0e0'};
    color: ${props => props.theme.colors.disabledText || '#a0a0a0'};
    box-shadow: none;
    cursor: not-allowed;
  }
`;

// Input field with neumorphic styling
export const NeumorphicInput = styled.input`
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  border: none;
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing.md};
  font-family: ${props => props.theme.typography.fontFamily};
  font-size: ${props => props.theme.typography.fontSizes.md};
  box-shadow: ${props => props.theme.shadows.inset};
  transition: all ${props => props.theme.animations.normal};
  width: ${props => props.width || '100%'};
  
  &:focus {
    outline: none;
    box-shadow: inset 4px 4px 8px rgba(174, 174, 192, 0.5),
                inset -4px -4px 8px rgba(255, 255, 255, 0.8);
  }
`;

// Card component with neumorphic styling
export const NeumorphicCard = styled.div`
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.medium};
  transition: all ${props => props.theme.animations.normal};
  margin: ${props => props.margin || props.theme.spacing.md};
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.large};
    transform: translateY(-2px);
  }
`;

// Section divider
export const Divider = styled.div`
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(174, 174, 192, 0.3),
    transparent
  );
  margin: ${props => props.theme.spacing.lg} 0;
`;

// Typography components
export const Heading = styled.h1`
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.typography.fontFamily};
  font-size: ${props => props.theme.typography.fontSizes[props.size || 'xxl']};
  font-weight: ${props => props.theme.typography.fontWeights[props.weight || 'bold']};
  margin: ${props => props.margin || `${props.theme.spacing.md} 0`};
`;

export const SubHeading = styled.h2`
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.typography.fontFamily};
  font-size: ${props => props.theme.typography.fontSizes[props.size || 'xl']};
  font-weight: ${props => props.theme.typography.fontWeights[props.weight || 'semiBold']};
  margin: ${props => props.margin || `${props.theme.spacing.md} 0`};
`;

export const Text = styled.p`
  color: ${props => props.color || props.theme.colors.text};
  font-family: ${props => props.theme.typography.fontFamily};
  font-size: ${props => props.theme.typography.fontSizes[props.size || 'md']};
  font-weight: ${props => props.theme.typography.fontWeights[props.weight || 'regular']};
  line-height: 1.6;
  margin: ${props => props.margin || `${props.theme.spacing.sm} 0`};
  text-align: ${props => props.$center ? 'center' : 'inherit'};
  max-width: ${props => props.$maxWidth || 'none'};
`;

// Flexible layout components
export const FlexContainer = styled.div`
  display: flex;
  flex-direction: ${props => props.direction || 'row'};
  justify-content: ${props => props.justify || 'flex-start'};
  align-items: ${props => props.align || 'stretch'};
  flex-wrap: ${props => props.wrap || 'nowrap'};
  gap: ${props => props.gap || props.theme.spacing.md};
  width: ${props => props.width || 'auto'};
  height: ${props => props.height || 'auto'};
  margin: ${props => props.margin || '0'};
  padding: ${props => props.padding || '0'};
`;

// Grid layout
export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: ${props => props.columns || 'repeat(auto-fill, minmax(250px, 1fr))'};
  grid-gap: ${props => props.gap || props.theme.spacing.lg};
  width: ${props => props.width || '100%'};
  margin: ${props => props.margin || '0'};
  padding: ${props => props.padding || '0'};
`;

// Icon container
export const NeumorphicIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  border-radius: ${props => props.theme.borderRadius.circle};
  background-color: ${props => props.theme.colors.background};
  box-shadow: ${props => props.theme.shadows.small};
  color: ${props => props.color || props.theme.colors.primary};
  transition: all ${props => props.theme.animations.normal};
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.medium};
    transform: scale(1.05);
  }
`;

// Main page wrapper
export const PageWrapper = styled.div`
  background-color: ${props => props.theme.colors.background};
  min-height: 100vh;
  width: 100%;
  padding: ${props => props.theme.spacing.lg};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: ${props => props.theme.spacing.md};
  }
`;

// Main content container
export const ContentContainer = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.lg} 0;
`;

// Section container
export const Section = styled.section`
  margin: ${props => props.theme.spacing.xxl} 0;
`;

// Animated circle - can be used for skill percentage indicators
export const ProgressCircle = styled.div`
  position: relative;
  width: ${props => props.size || '100px'};
  height: ${props => props.size || '100px'};
  border-radius: ${props => props.theme.borderRadius.circle};
  background: conic-gradient(
    ${props => props.color || props.theme.colors.primary} ${props => props.progress || '0%'},
    ${props => props.theme.colors.background} 0
  );
  box-shadow: ${props => props.theme.shadows.medium};
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: calc(100% - 20px);
    height: calc(100% - 20px);
    background: ${props => props.theme.colors.background};
    border-radius: ${props => props.theme.borderRadius.circle};
    box-shadow: ${props => props.theme.shadows.inset};
  }
`; 