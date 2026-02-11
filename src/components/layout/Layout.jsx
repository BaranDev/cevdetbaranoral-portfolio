import { useEffect } from "react";
import styled from "styled-components";
import Header from "./Header";
import Footer from "./Footer";
import CursorLight from "../ui/CursorLight";
import MedievalForestBackground from "../ui/MedievalForestBackground";
import { PageWrapper, ContentContainer } from "../../styles/StyledComponents";

const MainContent = styled(ContentContainer)`
  padding-left: 76px;
  min-height: calc(100vh - 200px);
  transition: padding-left 0.25s ease;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    padding-left: 0;
    padding-bottom: 70px;
  }
`;

const FooterWrapper = styled.div`
  padding-left: 76px;
  transition: padding-left 0.25s ease;

  @media (max-width: 768px) {
    padding-left: 0;
    margin-bottom: 60px;
  }
`;

// Add Font Awesome for icons
const FontAwesomeScript = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/js/all.min.js";
    script.crossOrigin = "anonymous";
    script.referrerPolicy = "no-referrer";
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
      <MedievalForestBackground />
      <CursorLight />
      <Header />
      <MainContent>{children}</MainContent>
      <FooterWrapper>
        <Footer />
      </FooterWrapper>
    </PageWrapper>
  );
};

export default Layout;
