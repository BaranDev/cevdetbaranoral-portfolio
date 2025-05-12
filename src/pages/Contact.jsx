import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  Section, 
  Heading, 
  Text, 
  NeumorphicContainer, 
  NeumorphicButton,
  FlexContainer
} from '../styles/StyledComponents';
import { useTheme } from '../context/ThemeContext';

const ContactContainer = styled(FlexContainer)`
  margin-top: ${props => props.theme.spacing.xl};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

const ContactFormContainer = styled(NeumorphicContainer)`
  flex: 1;
  padding: ${props => props.theme.spacing.xl};
  margin-right: ${props => props.theme.spacing.xl};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    margin-right: 0;
    margin-bottom: ${props => props.theme.spacing.xl};
  }
`;

const ContactInfoContainer = styled(NeumorphicContainer)`
  flex: 0.5;
  padding: ${props => props.theme.spacing.xl};
  background-color: ${props => props.theme.colors.card};
`;

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.spacing.sm};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.text};
`;

const FormInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  border: none;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.inset};
  font-family: ${props => props.theme.typography.fontFamily};
  
  &:focus {
    outline: none;
    box-shadow: inset 3px 3px 6px rgba(0, 0, 0, 0.1),
                inset -3px -3px 6px rgba(255, 255, 255, 0.1),
                0 0 0 2px ${props => props.theme.colors.primary}33;
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  min-height: 150px;
  padding: ${props => props.theme.spacing.md};
  border: none;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.inset};
  font-family: ${props => props.theme.typography.fontFamily};
  resize: vertical;
  
  &:focus {
    outline: none;
    box-shadow: inset 3px 3px 6px rgba(0, 0, 0, 0.1),
                inset -3px -3px 6px rgba(255, 255, 255, 0.1),
                0 0 0 2px ${props => props.theme.colors.primary}33;
  }
`;

const ContactInfoItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ContactIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${props => props.theme.spacing.md};
  box-shadow: ${props => props.theme.shadows.small};
`;

const SocialLinks = styled.div`
  display: flex;
  margin-top: ${props => props.theme.spacing.xl};
  justify-content: center;
`;

const SocialButton = styled(NeumorphicButton)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin: 0 ${props => props.theme.spacing.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.theme.typography.fontSizes.lg};
  
  &:hover {
    transform: translateY(-3px);
  }
`;

const SuccessMessage = styled(NeumorphicContainer)`
  padding: ${props => props.theme.spacing.lg};
  background-color: ${props => props.theme.colors.success}22;
  color: ${props => props.theme.colors.success};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { theme } = useTheme();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
    // In a real implementation, you would send this data to your backend
    setIsSubmitted(true);
    
    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    
    // Reset success message after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };
  
  return (
    <Section>
      <Heading style={{ textAlign: 'center' }}>
        Get in <span style={{ color: theme.colors.primary }}>Touch</span>
      </Heading>
      
      <Text style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto', marginBottom: theme.spacing.xl }}>
        Have a question or want to work together? Feel free to reach out using the form below
        or connect with me on social media.
      </Text>
      
      <ContactContainer>
        <ContactFormContainer>
          {isSubmitted && (
            <SuccessMessage>
              <Text size="lg" weight="semiBold">Thank you for your message!</Text>
              <Text>I'll get back to you as soon as possible.</Text>
            </SuccessMessage>
          )}
          
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <FormLabel htmlFor="name">Your Name</FormLabel>
              <FormInput
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <FormLabel htmlFor="email">Email Address</FormLabel>
              <FormInput
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <FormLabel htmlFor="subject">Subject</FormLabel>
              <FormInput
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <FormLabel htmlFor="message">Your Message</FormLabel>
              <FormTextarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </FormGroup>
            
            <NeumorphicButton type="submit" primary style={{ minWidth: '150px' }}>
              Send Message
            </NeumorphicButton>
          </form>
        </ContactFormContainer>
        
        <ContactInfoContainer>
          <Text size="xl" weight="semiBold" style={{ marginBottom: theme.spacing.lg }}>
            Contact Information
          </Text>
          
          <ContactInfoItem>
            <ContactIcon>
              <i className="fas fa-envelope"></i>
            </ContactIcon>
            <div>
              <Text size="sm" color={theme.colors.secondary}>Email</Text>
              <Text>contact@example.com</Text>
            </div>
          </ContactInfoItem>
          
          <ContactInfoItem>
            <ContactIcon>
              <i className="fas fa-phone"></i>
            </ContactIcon>
            <div>
              <Text size="sm" color={theme.colors.secondary}>Phone</Text>
              <Text>+1 (123) 456-7890</Text>
            </div>
          </ContactInfoItem>
          
          <ContactInfoItem>
            <ContactIcon>
              <i className="fas fa-map-marker-alt"></i>
            </ContactIcon>
            <div>
              <Text size="sm" color={theme.colors.secondary}>Location</Text>
              <Text>San Francisco, CA</Text>
            </div>
          </ContactInfoItem>
          
          <Text size="lg" weight="semiBold" style={{ marginTop: theme.spacing.xl, marginBottom: theme.spacing.md, textAlign: 'center' }}>
            Find me on
          </Text>
          
          <SocialLinks>
            <SocialButton as="a" href="https://github.com" target="_blank">
              <i className="fab fa-github"></i>
            </SocialButton>
            <SocialButton as="a" href="https://linkedin.com" target="_blank">
              <i className="fab fa-linkedin-in"></i>
            </SocialButton>
            <SocialButton as="a" href="https://twitter.com" target="_blank">
              <i className="fab fa-twitter"></i>
            </SocialButton>
            <SocialButton as="a" href="https://dribbble.com" target="_blank">
              <i className="fab fa-dribbble"></i>
            </SocialButton>
          </SocialLinks>
        </ContactInfoContainer>
      </ContactContainer>
    </Section>
  );
};

export default ContactPage; 