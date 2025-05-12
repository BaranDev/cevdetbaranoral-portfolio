import React from 'react';
import styled from 'styled-components';
import { 
  Section, 
  Heading, 
  Text,
  NeumorphicContainer
} from '../styles/StyledComponents';
import LiveCodeEditor from '../components/interactive/LiveCodeEditor';
import Theme from '../styles/Theme';

const EditorHeading = styled(Heading)`
  text-align: center;
  margin-bottom: ${Theme.spacing.xl};
  
  span {
    color: ${Theme.colors.primary};
  }
`;

const IntroSection = styled(NeumorphicContainer)`
  text-align: center;
  padding: ${Theme.spacing.xl};
  margin-bottom: ${Theme.spacing.xl};
`;

const CodeEditorPage = () => {
  return (
    <>
      <Section>
        <EditorHeading>
          Live <span>Code Editor</span>
        </EditorHeading>
        
        <IntroSection>
          <Text size="lg">
            Welcome to my interactive code playground! Here you can explore and modify 
            different algorithms and see the results in real-time. This demonstrates my 
            problem-solving approach and coding style.
          </Text>
        </IntroSection>
        
        <LiveCodeEditor />
      </Section>
    </>
  );
};

export default CodeEditorPage; 