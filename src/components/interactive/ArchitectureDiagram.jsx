import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  NeumorphicContainer, 
  NeumorphicButton, 
  FlexContainer,
  SubHeading,
  Text
} from '../../styles/StyledComponents';
import { useTheme } from '../../context/ThemeContext';

// Diagram container with neumorphic styling
const DiagramContainer = styled(NeumorphicContainer)`
  padding: ${props => props.theme.spacing.lg};
  margin: ${props => props.theme.spacing.xl} 0;
`;

// Diagram header
const DiagramHeader = styled(FlexContainer)`
  margin-bottom: ${props => props.theme.spacing.md};
`;

// Diagram title
const DiagramTitle = styled(SubHeading)`
  margin: 0;
`;

// SVG container
const SVGContainer = styled.div`
  width: 100%;
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.inset};
  padding: ${props => props.theme.spacing.lg};
  margin: ${props => props.theme.spacing.md} 0;
  position: relative;
  overflow: hidden;
`;

// SVG element
const SVG = styled.svg`
  width: 100%;
  height: 100%;
`;

// Diagram controls
const Controls = styled(FlexContainer)`
  margin-top: ${props => props.theme.spacing.md};
`;

// Node styles
const NodeContainer = styled.g`
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

// Description container
const DescriptionContainer = styled.div`
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.medium};
  padding: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.md};
`;

// Architecture types
const architectureTypes = [
  {
    id: 'microservices',
    name: 'Microservices Architecture',
    description: 'A microservices architecture divides an application into a collection of loosely-coupled services. Each service implements a specific business capability and communicates with other services through well-defined APIs.',
    nodes: [
      { id: 'client', name: 'Client App', x: 400, y: 50, type: 'client' },
      { id: 'gateway', name: 'API Gateway', x: 400, y: 150, type: 'gateway' },
      { id: 'auth', name: 'Auth Service', x: 200, y: 250, type: 'service' },
      { id: 'user', name: 'User Service', x: 400, y: 250, type: 'service' },
      { id: 'product', name: 'Product Service', x: 600, y: 250, type: 'service' },
      { id: 'db1', name: 'Auth DB', x: 200, y: 350, type: 'database' },
      { id: 'db2', name: 'User DB', x: 400, y: 350, type: 'database' },
      { id: 'db3', name: 'Product DB', x: 600, y: 350, type: 'database' }
    ],
    connections: [
      { from: 'client', to: 'gateway', animated: true },
      { from: 'gateway', to: 'auth', animated: true },
      { from: 'gateway', to: 'user', animated: true },
      { from: 'gateway', to: 'product', animated: true },
      { from: 'auth', to: 'db1', animated: false },
      { from: 'user', to: 'db2', animated: false },
      { from: 'product', to: 'db3', animated: false }
    ]
  },
  {
    id: 'spa',
    name: 'Single Page Application',
    description: 'A Single Page Application (SPA) is a web application that loads a single HTML page and dynamically updates content as the user interacts with the app. It uses AJAX and HTML5 to create fluid and responsive web applications, without page refreshes.',
    nodes: [
      { id: 'browser', name: 'Browser', x: 400, y: 50, type: 'client' },
      { id: 'react', name: 'React App', x: 400, y: 150, type: 'client' },
      { id: 'api', name: 'REST API', x: 400, y: 250, type: 'gateway' },
      { id: 'db', name: 'Database', x: 400, y: 350, type: 'database' },
      { id: 'storage', name: 'File Storage', x: 200, y: 250, type: 'storage' },
      { id: 'auth', name: 'Auth Provider', x: 600, y: 250, type: 'service' }
    ],
    connections: [
      { from: 'browser', to: 'react', animated: false },
      { from: 'react', to: 'api', animated: true },
      { from: 'react', to: 'storage', animated: true },
      { from: 'react', to: 'auth', animated: true },
      { from: 'api', to: 'db', animated: false }
    ]
  },
  {
    id: 'serverless',
    name: 'Serverless Architecture',
    description: 'Serverless architecture allows developers to build and run applications without managing servers. The cloud provider dynamically allocates machine resources, and charges only for the resources used. This enables automatic scaling and high availability.',
    nodes: [
      { id: 'client', name: 'Client App', x: 400, y: 50, type: 'client' },
      { id: 'apigw', name: 'API Gateway', x: 400, y: 150, type: 'gateway' },
      { id: 'func1', name: 'Auth Lambda', x: 200, y: 250, type: 'function' },
      { id: 'func2', name: 'Data Lambda', x: 400, y: 250, type: 'function' },
      { id: 'func3', name: 'Processing Lambda', x: 600, y: 250, type: 'function' },
      { id: 'db', name: 'Database', x: 300, y: 350, type: 'database' },
      { id: 'storage', name: 'Object Storage', x: 500, y: 350, type: 'storage' }
    ],
    connections: [
      { from: 'client', to: 'apigw', animated: true },
      { from: 'apigw', to: 'func1', animated: true },
      { from: 'apigw', to: 'func2', animated: true },
      { from: 'apigw', to: 'func3', animated: true },
      { from: 'func1', to: 'db', animated: false },
      { from: 'func2', to: 'db', animated: false },
      { from: 'func2', to: 'storage', animated: false },
      { from: 'func3', to: 'storage', animated: false }
    ]
  }
];

const ArchitectureDiagram = () => {
  const [activeArchitecture, setActiveArchitecture] = useState(architectureTypes[0]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [dataPackets, setDataPackets] = useState([]);
  const { theme, isDarkMode } = useTheme();
  
  // Generate a new data packet for an animated connection
  const generateDataPacket = () => {
    const animatedConnections = activeArchitecture.connections.filter(conn => conn.animated);
    
    if (animatedConnections.length === 0) return;
    
    // Pick a random animated connection
    const connection = animatedConnections[Math.floor(Math.random() * animatedConnections.length)];
    
    // Find start and end nodes
    const fromNode = activeArchitecture.nodes.find(node => node.id === connection.from);
    const toNode = activeArchitecture.nodes.find(node => node.id === connection.to);
    
    if (!fromNode || !toNode) return;
    
    // Create a new data packet
    const newPacket = {
      id: `packet-${Date.now()}-${Math.random()}`,
      from: fromNode,
      to: toNode,
      progress: 0,
      color: theme.colors.primary
    };
    
    setDataPackets(prev => [...prev, newPacket]);
  };
  
  // Update data packets animation
  useEffect(() => {
    const interval = setInterval(() => {
      // Generate a new packet occasionally
      if (Math.random() < 0.3) { // 30% chance each interval
        generateDataPacket();
      }
      
      // Update existing packets
      setDataPackets(prev => {
        const updated = prev.map(packet => ({
          ...packet,
          progress: packet.progress + 0.02 // Increment progress
        }));
        
        // Remove packets that completed their journey
        return updated.filter(packet => packet.progress <= 1);
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [activeArchitecture]);
  
  // Get coordinates for a point along a line based on progress (0-1)
  const getPointAlongLine = (x1, y1, x2, y2, progress) => {
    return {
      x: x1 + (x2 - x1) * progress,
      y: y1 + (y2 - y1) * progress
    };
  };
  
  // Render a node based on its type
  const renderNode = (node) => {
    const isSelected = selectedNode && selectedNode.id === node.id;
    const scale = isSelected ? 1.1 : 1;
    const fill = isSelected ? theme.colors.primary : isDarkMode ? '#2a3346' : '#d2dbe8';
    const strokeColor = theme.colors.primary;
    const textColor = isSelected ? 'white' : theme.colors.text;
    
    switch (node.type) {
      case 'client':
        return (
          <NodeContainer 
            onClick={() => setSelectedNode(node)} 
            transform={`translate(${node.x - 50 * scale / 2}, ${node.y - 30 * scale / 2}) scale(${scale})`}
          >
            <rect width="100" height="60" rx="10" ry="10" fill={fill} stroke={strokeColor} strokeWidth="2" />
            <text x="50" y="35" textAnchor="middle" fill={textColor} fontSize="12" fontFamily="sans-serif">{node.name}</text>
            <rect width="20" height="10" x="40" y="45" fill={strokeColor} rx="2" ry="2" />
          </NodeContainer>
        );
      
      case 'service':
        return (
          <NodeContainer 
            onClick={() => setSelectedNode(node)} 
            transform={`translate(${node.x - 40 * scale / 2}, ${node.y - 40 * scale / 2}) scale(${scale})`}
          >
            <rect width="80" height="80" rx="15" ry="15" fill={fill} stroke={strokeColor} strokeWidth="2" />
            <text x="40" y="45" textAnchor="middle" fill={textColor} fontSize="12" fontFamily="sans-serif">{node.name}</text>
            <circle cx="40" cy="65" r="8" fill={strokeColor} />
          </NodeContainer>
        );
      
      case 'gateway':
        return (
          <NodeContainer 
            onClick={() => setSelectedNode(node)} 
            transform={`translate(${node.x - 45 * scale / 2}, ${node.y - 35 * scale / 2}) scale(${scale})`}
          >
            <polygon points="0,40 45,0 90,40 45,80" fill={fill} stroke={strokeColor} strokeWidth="2" />
            <text x="45" y="45" textAnchor="middle" fill={textColor} fontSize="12" fontFamily="sans-serif">{node.name}</text>
          </NodeContainer>
        );
      
      case 'database':
        return (
          <NodeContainer 
            onClick={() => setSelectedNode(node)} 
            transform={`translate(${node.x - 35 * scale / 2}, ${node.y - 40 * scale / 2}) scale(${scale})`}
          >
            <ellipse cx="35" cy="25" rx="35" ry="20" fill={fill} stroke={strokeColor} strokeWidth="2" />
            <ellipse cx="35" cy="75" rx="35" ry="20" fill={fill} stroke={strokeColor} strokeWidth="2" />
            <rect x="0" y="25" width="70" height="50" fill={fill} stroke="none" />
            <line x1="0" y1="25" x2="0" y2="75" stroke={strokeColor} strokeWidth="2" />
            <line x1="70" y1="25" x2="70" y2="75" stroke={strokeColor} strokeWidth="2" />
            <text x="35" y="50" textAnchor="middle" fill={textColor} fontSize="12" fontFamily="sans-serif">{node.name}</text>
          </NodeContainer>
        );
      
      case 'storage':
        return (
          <NodeContainer 
            onClick={() => setSelectedNode(node)} 
            transform={`translate(${node.x - 40 * scale / 2}, ${node.y - 35 * scale / 2}) scale(${scale})`}
          >
            <path d="M10,0 L70,0 L80,20 L80,70 L0,70 L0,20 Z" fill={fill} stroke={strokeColor} strokeWidth="2" />
            <text x="40" y="40" textAnchor="middle" fill={textColor} fontSize="12" fontFamily="sans-serif">{node.name}</text>
          </NodeContainer>
        );
      
      case 'function':
        return (
          <NodeContainer 
            onClick={() => setSelectedNode(node)} 
            transform={`translate(${node.x - 40 * scale / 2}, ${node.y - 35 * scale / 2}) scale(${scale})`}
          >
            <rect width="80" height="70" rx="5" ry="5" fill={fill} stroke={strokeColor} strokeWidth="2" />
            <text x="40" y="30" textAnchor="middle" fill={textColor} fontSize="12" fontFamily="sans-serif">{node.name}</text>
            <text x="40" y="50" textAnchor="middle" fill={strokeColor} fontSize="18" fontFamily="monospace">λ</text>
          </NodeContainer>
        );
      
      default:
        return (
          <NodeContainer 
            onClick={() => setSelectedNode(node)} 
            transform={`translate(${node.x - 40 * scale / 2}, ${node.y - 20 * scale / 2}) scale(${scale})`}
          >
            <rect width="80" height="40" rx="5" ry="5" fill={fill} stroke={strokeColor} strokeWidth="2" />
            <text x="40" y="25" textAnchor="middle" fill={textColor} fontSize="12" fontFamily="sans-serif">{node.name}</text>
          </NodeContainer>
        );
    }
  };
  
  return (
    <DiagramContainer>
      <DiagramHeader justify="space-between" align="center">
        <DiagramTitle>Interactive Architecture Diagrams</DiagramTitle>
        
        <FlexContainer gap="md">
          {architectureTypes.map(arch => (
            <NeumorphicButton 
              key={arch.id}
              onClick={() => {
                setActiveArchitecture(arch);
                setSelectedNode(null);
                setDataPackets([]);
              }}
              active={activeArchitecture.id === arch.id}
            >
              {arch.name}
            </NeumorphicButton>
          ))}
        </FlexContainer>
      </DiagramHeader>
      
      <Text size="sm" margin="0 0 16px 0">
        Explore different architecture patterns. Click on components to view details, and observe
        the animated data flow between services.
      </Text>
      
      <SVGContainer>
        <SVG viewBox="0 0 800 400">
          {/* Render connections */}
          {activeArchitecture.connections.map(conn => {
            const fromNode = activeArchitecture.nodes.find(node => node.id === conn.from);
            const toNode = activeArchitecture.nodes.find(node => node.id === conn.to);
            
            if (!fromNode || !toNode) return null;
            
            return (
              <line 
                key={`${conn.from}-${conn.to}`}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke={isDarkMode ? '#3a4556' : '#c5cfe0'}
                strokeWidth="2"
                strokeDasharray={conn.animated ? "5,5" : "none"}
              />
            );
          })}
          
          {/* Render data packets */}
          {dataPackets.map(packet => {
            const { x, y } = getPointAlongLine(
              packet.from.x,
              packet.from.y,
              packet.to.x,
              packet.to.y,
              packet.progress
            );
            
            return (
              <g key={packet.id} transform={`translate(${x - 5}, ${y - 5})`}>
                <circle cx="5" cy="5" r="5" fill={packet.color} />
              </g>
            );
          })}
          
          {/* Render nodes */}
          {activeArchitecture.nodes.map(node => renderNode(node))}
        </SVG>
      </SVGContainer>
      
      {selectedNode && (
        <DescriptionContainer>
          <SubHeading size="md" margin="0 0 8px 0">{selectedNode.name}</SubHeading>
          <Text size="sm">
            {selectedNode.type === 'client' && 'Client component that interacts with the user and communicates with the backend services.'}
            {selectedNode.type === 'service' && 'A backend service that implements specific business logic and processes requests.'}
            {selectedNode.type === 'gateway' && 'Acts as an entry point for client requests, routing them to appropriate services.'}
            {selectedNode.type === 'database' && 'Persistent storage for application data.'}
            {selectedNode.type === 'storage' && 'Storage service for files and other binary data.'}
            {selectedNode.type === 'function' && 'Serverless function that runs in response to events without managing server infrastructure.'}
          </Text>
        </DescriptionContainer>
      )}
      
      <Controls justify="center" gap="md" margin="24px 0 0 0">
        <NeumorphicButton
          onClick={() => {
            setSelectedNode(null);
            setDataPackets([]);
            generateDataPacket();
          }}
          primary
        >
          Simulate Data Flow
        </NeumorphicButton>
      </Controls>
    </DiagramContainer>
  );
};

export default ArchitectureDiagram; 