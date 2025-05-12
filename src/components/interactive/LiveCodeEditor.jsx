import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Editor from '@monaco-editor/react';
import { 
  NeumorphicContainer, 
  NeumorphicButton, 
  FlexContainer,
  SubHeading,
  Text
} from '../../styles/StyledComponents';
import { useTheme } from '../../context/ThemeContext';

// Editor container with neumorphic styling
const EditorContainer = styled(NeumorphicContainer)`
  padding: ${props => props.theme.spacing.lg};
  margin: ${props => props.theme.spacing.xl} 0;
`;

// Editor title and controls
const EditorHeader = styled(FlexContainer)`
  margin-bottom: ${props => props.theme.spacing.md};
`;

// Title for the editor
const EditorTitle = styled(SubHeading)`
  margin: 0;
`;

// Container for the Monaco editor
const MonacoContainer = styled.div`
  border-radius: ${props => props.theme.borderRadius.medium};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.inset};
  height: 400px;
  margin-bottom: ${props => props.theme.spacing.md};
`;

// Console output container
const ConsoleOutput = styled.div`
  background-color: ${props => props.theme.colors.background};
  box-shadow: ${props => props.theme.shadows.inset};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.md};
  min-height: 100px;
  font-family: 'Consolas', monospace;
  color: ${props => props.theme.colors.text};
  position: relative;
`;

// Console output header
const ConsoleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.sm};
  padding-bottom: ${props => props.theme.spacing.xs};
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

// Console title
const ConsoleTitle = styled.div`
  font-weight: ${props => props.theme.typography.fontWeights.semiBold};
  color: ${props => props.theme.colors.primary};
`;

// Clear button for console
const ClearButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.secondary};
  cursor: pointer;
  font-size: ${props => props.theme.typography.fontSizes.sm};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

// Console log message
const ConsoleMessage = styled.div`
  margin: ${props => props.theme.spacing.xs} 0;
  word-wrap: break-word;
  font-size: ${props => props.theme.typography.fontSizes.sm};
  
  &.error {
    color: ${props => props.theme.colors.danger};
  }
  
  &.warn {
    color: ${props => props.theme.colors.warning};
  }
  
  &.info {
    color: ${props => props.theme.colors.info};
  }
`;

// Button group for run/reset
const ButtonGroup = styled(FlexContainer)`
  margin-top: ${props => props.theme.spacing.md};
`;

// Code example options
const CodeExampleSelect = styled.select`
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  border: none;
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  box-shadow: ${props => props.theme.shadows.small};
  cursor: pointer;
  font-family: ${props => props.theme.typography.fontFamily};
  
  &:focus {
    outline: none;
    box-shadow: ${props => props.theme.shadows.medium};
  }
`;

// Sample code examples
const codeExamples = {
  fibonacci: `// Fibonacci Sequence
function fibonacci(n) {
  if (n <= 1) {
    return n;
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Calculate first 10 Fibonacci numbers
for (let i = 0; i < 10; i++) {
  console.log(\`Fibonacci(\${i}) = \${fibonacci(i)}\`);
}`,

  sorting: `// Bubble Sort Implementation
function bubbleSort(arr) {
  let swapped;
  do {
    swapped = false;
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        // Swap elements
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
      }
    }
  } while (swapped);
  
  return arr;
}

// Test with a random array
const numbers = [64, 34, 25, 12, 22, 11, 90];
console.log('Original array:', numbers);
console.log('Sorted array:', bubbleSort([...numbers]));`,

  palindrome: `// Check if a string is a palindrome
function isPalindrome(str) {
  // Remove non-alphanumeric characters and convert to lowercase
  const cleanStr = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Compare with reversed string
  return cleanStr === cleanStr.split('').reverse().join('');
}

// Test with some examples
const testStrings = [
  'A man, a plan, a canal: Panama',
  'race a car',
  'hello world',
  'Madam In Eden, I'm Adam'
];

testStrings.forEach(str => {
  console.log(\`"\${str}" is \${isPalindrome(str) ? 'a palindrome' : 'not a palindrome'}\`);
});`,

  promises: `// Asynchronous Programming with Promises
function fetchUserData(userId) {
  return new Promise((resolve, reject) => {
    // Simulate API call
    setTimeout(() => {
      if (userId > 0) {
        resolve({
          id: userId,
          name: 'John Doe',
          email: 'john.doe@example.com'
        });
      } else {
        reject(new Error('Invalid user ID'));
      }
    }, 1000);
  });
}

// Using the promise
console.log('Fetching user data...');
fetchUserData(1)
  .then(user => {
    console.log('User data:', user);
    return fetchUserData(0); // This will cause an error
  })
  .then(user => {
    console.log('Another user:', user);
  })
  .catch(error => {
    console.error('Error:', error.message);
  })
  .finally(() => {
    console.log('Promise chain completed');
  });

// Note: In this editor, you'll need to run this code to see the results
// as they appear after a delay`
};

const LiveCodeEditor = () => {
  const [code, setCode] = useState(codeExamples.fibonacci);
  const [output, setOutput] = useState([]);
  const [selectedExample, setSelectedExample] = useState('fibonacci');
  const { theme } = useTheme();
  
  // Reset console log to capture outputs
  useEffect(() => {
    // Save original console methods
    const originalConsole = {
      log: console.log,
      error: console.error,
      warn: console.warn,
      info: console.info
    };
    
    // Override console methods
    console.log = (...args) => {
      originalConsole.log(...args);
      setOutput(prev => [...prev, { type: 'log', content: args.map(arg => formatArgument(arg)).join(' ') }]);
    };
    
    console.error = (...args) => {
      originalConsole.error(...args);
      setOutput(prev => [...prev, { type: 'error', content: args.map(arg => formatArgument(arg)).join(' ') }]);
    };
    
    console.warn = (...args) => {
      originalConsole.warn(...args);
      setOutput(prev => [...prev, { type: 'warn', content: args.map(arg => formatArgument(arg)).join(' ') }]);
    };
    
    console.info = (...args) => {
      originalConsole.info(...args);
      setOutput(prev => [...prev, { type: 'info', content: args.map(arg => formatArgument(arg)).join(' ') }]);
    };
    
    // Restore original console methods on cleanup
    return () => {
      console.log = originalConsole.log;
      console.error = originalConsole.error;
      console.warn = originalConsole.warn;
      console.info = originalConsole.info;
    };
  }, []);
  
  // Format console arguments
  const formatArgument = (arg) => {
    if (typeof arg === 'object') {
      return JSON.stringify(arg, null, 2);
    }
    return String(arg);
  };
  
  // Update code on editor change
  const handleEditorChange = (value) => {
    setCode(value);
  };
  
  // Run the code in the editor
  const runCode = () => {
    setOutput([]);
    try {
      // eslint-disable-next-line no-new-func
      const executeCode = new Function(code);
      executeCode();
    } catch (error) {
      console.error(error.toString());
    }
  };
  
  // Reset to original example
  const resetCode = () => {
    setCode(codeExamples[selectedExample]);
    setOutput([]);
  };
  
  // Clear console output
  const clearConsole = () => {
    setOutput([]);
  };
  
  // Change selected code example
  const handleExampleChange = (e) => {
    const example = e.target.value;
    setSelectedExample(example);
    setCode(codeExamples[example]);
    setOutput([]);
  };
  
  return (
    <EditorContainer>
      <EditorHeader justify="space-between" align="center">
        <EditorTitle>Interactive Code Editor</EditorTitle>
        <CodeExampleSelect value={selectedExample} onChange={handleExampleChange}>
          <option value="fibonacci">Fibonacci Sequence</option>
          <option value="sorting">Bubble Sort</option>
          <option value="palindrome">Palindrome Checker</option>
          <option value="promises">Promises Demo</option>
        </CodeExampleSelect>
      </EditorHeader>
      
      <Text size="sm" margin="0 0 16px 0">
        Edit the code below and run it to see the output in the console.
      </Text>
      
      <MonacoContainer>
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={code}
          onChange={handleEditorChange}
          theme={theme.colors.background === '#1a1f2e' ? 'vs-dark' : 'light'}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
          }}
        />
      </MonacoContainer>
      
      <ButtonGroup gap="md">
        <NeumorphicButton onClick={runCode} primary>
          Run Code
        </NeumorphicButton>
        <NeumorphicButton onClick={resetCode}>
          Reset
        </NeumorphicButton>
      </ButtonGroup>
      
      <ConsoleOutput>
        <ConsoleHeader>
          <ConsoleTitle>Console Output</ConsoleTitle>
          <ClearButton onClick={clearConsole}>Clear</ClearButton>
        </ConsoleHeader>
        
        {output.length === 0 ? (
          <ConsoleMessage>
            Run the code to see output here...
          </ConsoleMessage>
        ) : (
          output.map((item, index) => (
            <ConsoleMessage 
              key={index} 
              className={item.type}
            >
              {item.content}
            </ConsoleMessage>
          ))
        )}
      </ConsoleOutput>
    </EditorContainer>
  );
};

export default LiveCodeEditor; 