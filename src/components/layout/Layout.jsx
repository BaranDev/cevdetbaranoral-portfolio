import { useEffect } from 'react';
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';
import { PageWrapper, ContentContainer } from '../../styles/StyledComponents';
import Theme from '../../styles/Theme';

const MainContent = styled(ContentContainer)`
  padding-top: calc(80px + ${Theme.spacing.xl}); // Adjusted for fixed header
  min-height: calc(100vh - 300px); // Ensure footer stays at bottom
`;

// Add Font Awesome for icons
const FontAwesomeScript = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/js/all.min.js';
    script.crossOrigin = 'anonymous';
    script.referrerPolicy = 'no-referrer';
    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);
  
  return null;
};

const Layout = ({ children }) => {
  return (
    <PageWrapper>
      <FontAwesomeScript />
      <Header />
      <MainContent>
        {children}
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default Layout; 