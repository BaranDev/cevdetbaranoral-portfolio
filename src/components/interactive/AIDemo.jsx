import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as knnClassifier from '@tensorflow-models/knn-classifier';
import { 
  NeumorphicContainer, 
  NeumorphicButton, 
  FlexContainer,
  SubHeading,
  Text
} from '../../styles/StyledComponents';
import { useTheme } from '../../context/ThemeContext';

// Demo container with neumorphic styling
const DemoContainer = styled(NeumorphicContainer)`
  padding: ${props => props.theme.spacing.lg};
  margin: ${props => props.theme.spacing.xl} 0;
`;

// Demo header
const DemoHeader = styled(FlexContainer)`
  margin-bottom: ${props => props.theme.spacing.md};
`;

// Demo title
const DemoTitle = styled(SubHeading)`
  margin: 0;
`;

// Tabs container
const TabsContainer = styled(FlexContainer)`
  margin-bottom: ${props => props.theme.spacing.md};
  flex-wrap: wrap;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    justify-content: center;
  }
`;

// Tab button
const TabButton = styled(NeumorphicButton)`
  min-width: 150px;
  text-align: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 10px;
    right: 10px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${props => props.$ready ? props.theme.colors.success : 
                              props.$loading ? props.theme.colors.warning : 'transparent'};
    display: ${props => (props.$ready || props.$loading) ? 'block' : 'none'};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    margin-bottom: ${props => props.theme.spacing.sm};
  }
`;

// Video container
const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  border-radius: ${props => props.theme.borderRadius.medium};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.inset};
  margin-bottom: ${props => props.theme.spacing.md};
`;

// Video element
const Video = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

// Canvas for drawing bounding boxes
const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

// Status indicator
const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.md};
  
  &::before {
    content: '';
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${props => props.$active ? props.theme.colors.success : props.theme.colors.danger};
    margin-right: ${props => props.theme.spacing.sm};
  }
`;

// Controls container
const Controls = styled(FlexContainer)`
  margin-top: ${props => props.theme.spacing.md};
`;

// Detection results container
const ResultsContainer = styled.div`
  background-color: ${props => props.theme.colors.background};
  box-shadow: ${props => props.theme.shadows.inset};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.md};
  min-height: 100px;
  max-height: 200px;
  overflow-y: auto;
`;

// Individual detection result
const Result = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.sm} 0;
  border-bottom: 1px solid ${props => props.$isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
  
  &:last-child {
    border-bottom: none;
  }
`;

// Object name
const ObjectName = styled.span`
  font-weight: ${props => props.theme.typography.fontWeights.medium};
`;

// Confidence score
const Confidence = styled.span`
  color: ${props => props.theme.colors.primary};
  font-weight: ${props => props.theme.typography.fontWeights.semiBold};
`;

// Drawing canvas container
const DrawingCanvasContainer = styled.div`
  position: relative;
  width: 100%;
  border-radius: ${props => props.theme.borderRadius.medium};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.inset};
  margin: ${props => props.theme.spacing.md} 0;
  background-color: ${props => props.$isDarkMode ? '#1e2335' : 'white'};
`;

// Drawing canvas for whiteboard recognition
const DrawingCanvas = styled.canvas`
  width: 100%;
  height: 300px;
  display: block;
  cursor: crosshair;
`;

// Button to clear the drawing
const ClearButton = styled(NeumorphicButton)`
  margin-right: ${props => props.theme.spacing.md};
`;

// Drawing tools container
const DrawingTools = styled(FlexContainer)`
  margin-bottom: ${props => props.theme.spacing.md};
  flex-wrap: wrap;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    justify-content: center;
  }
`;

// Color picker button
const ColorButton = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 3px solid ${props => props.isSelected ? props.theme.colors.primary : 'transparent'};
  background-color: ${props => props.color};
  margin-right: ${props => props.theme.spacing.sm};
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

// Brush size button
const BrushSizeButton = styled.button`
  width: ${props => props.size * 2}px;
  height: ${props => props.size * 2}px;
  border-radius: 50%;
  border: 2px solid ${props => props.isSelected ? props.theme.colors.primary : props.$isDarkMode ? '#3a4556' : '#c5cfe0'};
  background-color: ${props => props.$isDarkMode ? 'white' : 'black'};
  margin-left: ${props => props.theme.spacing.sm};
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

// Recognition result container
const RecognitionResult = styled(NeumorphicContainer)`
  margin-top: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  text-align: center;
  transition: all 0.3s ease;
  transform: ${props => props.visible ? 'translateY(0)' : 'translateY(20px)'};
  opacity: ${props => props.visible ? 1 : 0};
`;

// Loading spinner
const Spinner = styled.div`
  width: 40px;
  height: 40px;
  margin: 0 auto;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

// Drawing categories for recognition
const drawingCategories = [
  { id: 'circle', name: 'Circle', description: 'A simple circle or oval shape' },
  { id: 'square', name: 'Square', description: 'A square or rectangular shape' },
  { id: 'triangle', name: 'Triangle', description: 'A triangle with three points' },
  { id: 'star', name: 'Star', description: 'A star shape with points' },
  { id: 'heart', name: 'Heart', description: 'A heart shape' },
  { id: 'smiley', name: 'Smiley Face', description: 'A simple smiley face' },
  { id: 'house', name: 'House', description: 'A simple house with a roof and base' },
  { id: 'tree', name: 'Tree', description: 'A tree with trunk and foliage' }
];

// Training mode components
const TrainingContainer = styled(FlexContainer)`
  flex-direction: column;
  margin-top: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing.md};
  background-color: ${props => props.$isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)'};
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin: ${props => props.theme.spacing.md} 0;
`;

const CategoryCard = styled.div`
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.medium};
  background-color: ${props => props.theme.colors.background};
  box-shadow: ${props => props.isSelected 
    ? `0 0 0 2px ${props.theme.colors.primary}` 
    : props.theme.shadows.small};
  transition: all 0.2s ease;
  cursor: pointer;
  text-align: center;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const CategoryName = styled.div`
  font-weight: ${props => props.theme.typography.fontWeights.semiBold};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const ExampleCount = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.xs};
  color: ${props => props.theme.colors.secondary};
`;

const TrainingProgress = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${props => props.$isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
  border-radius: 4px;
  margin: ${props => props.theme.spacing.md} 0;
  overflow: hidden;
  
  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${props => props.progress}%;
    background-color: ${props => props.theme.colors.primary};
    transition: width 0.3s ease;
  }
`;

const ModelControls = styled(FlexContainer)`
  margin-top: ${props => props.theme.spacing.md};
  justify-content: space-between;
`;

// Detection settings panel
const SettingsPanel = styled.div`
  margin-top: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.medium};
  background-color: ${props => props.$isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)'};
`;

// Settings row
const SettingsRow = styled(FlexContainer)`
  margin-bottom: ${props => props.theme.spacing.sm};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

// Settings label
const SettingsLabel = styled.div`
  min-width: 160px;
`;

// Slider container
const SliderContainer = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
`;

// Slider input
const Slider = styled.input`
  flex-grow: 1;
  height: 3px;
  border-radius: 1.5px;
  background: ${props => props.theme.colors.background};
  outline: none;
  opacity: 0.7;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 1;
  }
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: ${props => props.theme.colors.primary};
    cursor: pointer;
  }
`;

// Slider value
const SliderValue = styled.div`
  min-width: 60px;
  text-align: right;
  margin-left: ${props => props.theme.spacing.sm};
`;

// Performance metrics
const PerformanceMetrics = styled.div`
  margin-top: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  border-radius: ${props => props.theme.borderRadius.medium};
  background-color: ${props => props.$isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)'};
`;

// Metrics row
const MetricsRow = styled(FlexContainer)`
  margin-bottom: ${props => props.theme.spacing.xs};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

// Metrics label
const MetricsLabel = styled.div`
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  min-width: 160px;
`;

// Metrics value
const MetricsValue = styled.div`
  color: ${props => props.theme.colors.primary};
`;

// Class name bubble
const ClassBubble = styled.div`
  display: inline-block;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  margin: 0 ${props => props.theme.spacing.xs} ${props => props.theme.spacing.xs} 0;
  border-radius: 16px;
  background-color: ${props => props.theme.colors.background};
  font-size: ${props => props.theme.typography.fontSizes.xs};
`;

// Info card
const InfoCard = styled(NeumorphicContainer)`
  margin-top: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
`;

// Info title
const InfoTitle = styled(SubHeading)`
  margin-top: 0;
`;

// Info content
const InfoContent = styled.div`
  margin-top: ${props => props.theme.spacing.md};
`;

// Info table
const InfoTable = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: ${props => props.theme.spacing.sm};
  margin-top: ${props => props.theme.spacing.md};
`;

// COCO-SSD common categories
const cocoCategories = [
  "person", "bicycle", "car", "motorcycle", "airplane", "bus", "train", "truck", "boat", 
  "traffic light", "fire hydrant", "stop sign", "parking meter", "bench", "bird", "cat", 
  "dog", "horse", "sheep", "cow", "elephant", "bear", "zebra", "giraffe", "backpack", 
  "umbrella", "handbag", "tie", "suitcase", "frisbee", "skis", "snowboard", "sports ball", 
  "kite", "baseball bat", "baseball glove", "skateboard", "surfboard", "tennis racket", 
  "bottle", "wine glass", "cup", "fork", "knife", "spoon", "bowl", "banana", "apple", 
  "sandwich", "orange", "broccoli", "carrot", "hot dog", "pizza", "donut", "cake", "chair", 
  "couch", "potted plant", "bed", "dining table", "toilet", "tv", "laptop", "mouse", "remote", 
  "keyboard", "cell phone", "microwave", "oven", "toaster", "sink", "refrigerator", "book", 
  "clock", "vase", "scissors", "teddy bear", "hair drier", "toothbrush"
];

const AIDemo = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const drawingCanvasRef = useRef(null);
  const hiddenCanvasRef = useRef(null); // For preprocessing drawing before recognition
  
  // Object Detection States
  const [objectModel, setObjectModel] = useState(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [classifications, setClassifications] = useState([]);
  
  // Drawing Recognition States
  const [mobilenetModel, setMobilenetModel] = useState(null);
  const [classifier, setClassifier] = useState(null);
  const [isDrawingModelLoaded, setIsDrawingModelLoaded] = useState(false);
  const [isClassifierTrained, setIsClassifierTrained] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [recognitionResult, setRecognitionResult] = useState(null);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [drawingMode, setDrawingMode] = useState('draw'); // 'draw' or 'train'
  
  // UI States
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState('objectDetection');
  const [drawingColor, setDrawingColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  
  // Object Detection Settings
  const [confidenceThreshold, setConfidenceThreshold] = useState(50);
  const [maxDetections, setMaxDetections] = useState(20);
  const [showSettings, setShowSettings] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [classesDetected, setClassesDetected] = useState(new Set());
  
  // Performance metrics
  const [fps, setFps] = useState(0);
  const [inferenceTime, setInferenceTime] = useState(0);
  const lastFrameTime = useRef(0);
  
  const { theme, isDarkMode } = useTheme();
  
  // Available drawing colors
  const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFA500', '#800080'];
  // Available brush sizes
  const brushSizes = [3, 5, 8, 12];
  
  // Load the image classification model
  useEffect(() => {
    if (activeTab === 'objectDetection' && !objectModel) {
      const loadModel = async () => {
        try {
          console.log('Starting to load MobileNet model for image classification...');
          setErrorMessage('');
          await tf.ready();
          console.log('TensorFlow.js is ready');
          
          // Load MobileNet for image classification
          const model = await mobilenet.load();
          
          console.log('MobileNet model loaded successfully for image classification');
          setObjectModel(model);
          setIsModelLoaded(true);
        } catch (error) {
          console.error('Error loading image classification model:', error);
          setErrorMessage(`Failed to load the image classification model: ${error.message}`);
        }
      };
      
      loadModel();
    }
  }, [activeTab, objectModel]);
  
  // Setup webcam
  const setupWebcam = async () => {
    if (!videoRef.current) return null;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });
      
      videoRef.current.srcObject = stream;
      
      return new Promise((resolve) => {
        videoRef.current.onloadedmetadata = () => {
          resolve(stream);
        };
      });
    } catch (error) {
      console.error('Error accessing webcam:', error);
      setErrorMessage('Could not access your camera. Please make sure you have granted camera permissions.');
      return null;
    }
  };
  
  // Start image classification instead of object detection
  const startClassification = async () => {
    if (!isModelLoaded || !objectModel) {
      setErrorMessage('Image classification model not loaded yet. Please wait.');
      return;
    }
    
    const stream = await setupWebcam();
    if (!stream) return;
    
    console.log('Starting image classification');
    setIsDetecting(true);
    setErrorMessage('');
    setClassesDetected(new Set());
    setFps(0);
    setInferenceTime(0);
    
    // FPS tracking
    let frameCount = 0;
    let fpsInterval = setInterval(() => {
      setFps(frameCount);
      frameCount = 0;
    }, 1000);
    
    const classifyFrame = async () => {
      if (!videoRef.current || !canvasRef.current || !isDetecting) return;
      
      // Skip this frame if paused
      if (isPaused) {
        requestAnimationFrame(classifyFrame);
        return;
      }
      
      try {
        // Count this frame
        frameCount++;
        
        // Start inference time measurement
        const inferenceStart = performance.now();
        
        // Ensure video is ready
        if (videoRef.current.readyState < 2) {
          requestAnimationFrame(classifyFrame);
          return;
        }
        
        // Classify the current video frame
        const predictions = await objectModel.classify(videoRef.current);
        
        // End inference time measurement
        const currentInferenceTime = Math.round(performance.now() - inferenceStart);
        setInferenceTime(currentInferenceTime);
        
        // Filter predictions based on threshold
        const filteredPredictions = predictions
          .filter(pred => pred.probability >= confidenceThreshold / 100)
          .slice(0, maxDetections);
        
        console.log(`Classified ${filteredPredictions.length} objects`);
        
        // Update detected classes set
        const newClasses = new Set([...classesDetected]);
        let hasNewClasses = false;
        
        filteredPredictions.forEach(pred => {
          if (!newClasses.has(pred.className)) {
            hasNewClasses = true;
            newClasses.add(pred.className);
          }
        });
        
        if (hasNewClasses) {
          setClassesDetected(newClasses);
        }
        
        // Set state with classifications
        setClassifications(filteredPredictions);
        
        // Draw a simple indicator on the canvas
        drawClassificationIndicator(filteredPredictions);
        
        // Continue detecting if still active
        if (isDetecting) {
          requestAnimationFrame(classifyFrame);
        }
      } catch (error) {
        console.error('Classification error:', error);
        setErrorMessage(`An error occurred during classification: ${error.message}`);
      }
    };
    
    classifyFrame();
    
    // Cleanup function
    return () => {
      clearInterval(fpsInterval);
    };
  };
  
  // Stop classification
  const stopClassification = () => {
    console.log('Stopping classification');
    setIsDetecting(false);
    
    // Stop the webcam
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    // Clear the canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    
    // Clear detections
    setClassifications([]);
    setFps(0);
    setInferenceTime(0);
  };
  
  // Draw a simplified indicator for classifications
  const drawClassificationIndicator = (predictions) => {
    if (!canvasRef.current || !videoRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    const videoWidth = videoRef.current.videoWidth;
    const videoHeight = videoRef.current.videoHeight;
    
    // Set canvas dimensions to match video
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;
    
    // Clear previous drawings
    ctx.clearRect(0, 0, videoWidth, videoHeight);
    
    // Generate unique colors based on class names for consistent coloring
    const getColorForClass = (className) => {
      // Simple hash function to generate a hue value from 0-360
      let hash = 0;
      for (let i = 0; i < className.length; i++) {
        hash = className.charCodeAt(i) + ((hash << 5) - hash);
      }
      const hue = hash % 360;
      return `hsl(${hue}, 70%, 50%)`;
    };
    
    // Draw classification indicator - a semi-transparent overlay at the top
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, videoWidth, 60);
    
    // Show top prediction
    if (predictions.length > 0) {
      const topPrediction = predictions[0];
      const className = topPrediction.className;
      const color = getColorForClass(className);
      
      // Draw text
      ctx.fillStyle = color;
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        `${className} (${Math.round(topPrediction.probability * 100)}%)`,
        videoWidth / 2,
        30
      );
    }
  };
  
  // Load MobileNet model for drawing recognition
  useEffect(() => {
    if (activeTab === 'whiteboard' && !mobilenetModel) {
      const loadModels = async () => {
        try {
          console.log('Starting to load MobileNet model...');
          // Load MobileNet
          const model = await mobilenet.load();
          console.log('MobileNet model loaded successfully');
          setMobilenetModel(model);
          
          // Create KNN Classifier
          const newClassifier = knnClassifier.create();
          setClassifier(newClassifier);
          
          setIsDrawingModelLoaded(true);
          console.log('KNN classifier created');
        } catch (error) {
          console.error('Error loading drawing recognition models:', error);
          setErrorMessage(`Failed to load the drawing recognition models: ${error.message}`);
        }
      };
      
      loadModels();
    }
  }, [activeTab, mobilenetModel]);
  
  // Setup hidden canvas for drawing preprocessing
  useEffect(() => {
    if (activeTab === 'whiteboard' && !hiddenCanvasRef.current) {
      // Create a hidden canvas element for preprocessing
      const canvas = document.createElement('canvas');
      canvas.width = 224;  // MobileNet input size
      canvas.height = 224; // MobileNet input size
      canvas.style.display = 'none';
      hiddenCanvasRef.current = canvas;
      document.body.appendChild(canvas);
      
      return () => {
        if (hiddenCanvasRef.current) {
          document.body.removeChild(hiddenCanvasRef.current);
        }
      };
    }
  }, [activeTab]);
  
  // Setup drawing canvas
  useEffect(() => {
    if (activeTab === 'whiteboard' && drawingCanvasRef.current) {
      const canvas = drawingCanvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Set canvas dimensions to match container size
      const resizeCanvas = () => {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = 300; // Fixed height
      };
      
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      
      // Clear canvas initially
      ctx.fillStyle = isDarkMode ? '#1e2335' : 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Set drawing style
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = drawingColor;
      ctx.lineWidth = brushSize;
      
      return () => {
        window.removeEventListener('resize', resizeCanvas);
      };
    }
  }, [activeTab, isDarkMode]);
  
  // Update drawing color and brush size
  useEffect(() => {
    if (drawingCanvasRef.current && activeTab === 'whiteboard') {
      const ctx = drawingCanvasRef.current.getContext('2d');
      ctx.strokeStyle = drawingColor;
      ctx.lineWidth = brushSize;
    }
  }, [drawingColor, brushSize, activeTab]);
  
  // Implement drawing functionality
  useEffect(() => {
    if (activeTab === 'whiteboard' && drawingCanvasRef.current) {
      const canvas = drawingCanvasRef.current;
      const ctx = canvas.getContext('2d');
      
      let isDrawing = false;
      let lastX = 0;
      let lastY = 0;
      
      // Start drawing
      const startDrawing = (e) => {
        isDrawing = true;
        const { offsetX, offsetY } = getCoordinates(e);
        lastX = offsetX;
        lastY = offsetY;
      };
      
      // Draw line
      const draw = (e) => {
        if (!isDrawing) return;
        
        const { offsetX, offsetY } = getCoordinates(e);
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
        
        lastX = offsetX;
        lastY = offsetY;
      };
      
      // Stop drawing
      const stopDrawing = () => {
        isDrawing = false;
      };
      
      // Get coordinates for both mouse and touch events
      const getCoordinates = (event) => {
        let offsetX, offsetY;
        
        if (event.type.includes('mouse')) {
          offsetX = event.offsetX;
          offsetY = event.offsetY;
        } else {
          const rect = canvas.getBoundingClientRect();
          const touch = event.touches[0];
          offsetX = touch.clientX - rect.left;
          offsetY = touch.clientY - rect.top;
        }
        
        return { offsetX, offsetY };
      };
      
      // Add event listeners
      canvas.addEventListener('mousedown', startDrawing);
      canvas.addEventListener('mousemove', draw);
      canvas.addEventListener('mouseup', stopDrawing);
      canvas.addEventListener('mouseout', stopDrawing);
      
      // Touch events
      canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startDrawing(e);
      });
      
      canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        draw(e);
      });
      
      canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        stopDrawing();
      });
      
      // Clean up
      return () => {
        canvas.removeEventListener('mousedown', startDrawing);
        canvas.removeEventListener('mousemove', draw);
        canvas.removeEventListener('mouseup', stopDrawing);
        canvas.removeEventListener('mouseout', stopDrawing);
        canvas.removeEventListener('touchstart', startDrawing);
        canvas.removeEventListener('touchmove', draw);
        canvas.removeEventListener('touchend', stopDrawing);
      };
    }
  }, [activeTab, drawingColor, brushSize]);
  
  // Clear the drawing canvas
  const clearDrawing = () => {
    if (!drawingCanvasRef.current) return;
    
    const canvas = drawingCanvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Fill with background color
    ctx.fillStyle = isDarkMode ? '#1e2335' : 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Reset recognition result
    setRecognitionResult(null);
  };
  
  // Preprocess drawing for recognition
  const preprocessDrawing = () => {
    if (!drawingCanvasRef.current || !hiddenCanvasRef.current) {
      console.error('Drawing canvas or hidden canvas not available');
      return null;
    }
    
    const drawingCanvas = drawingCanvasRef.current;
    const hiddenCanvas = hiddenCanvasRef.current;
    const hiddenCtx = hiddenCanvas.getContext('2d');
    
    // Get canvas dimensions
    const drawingWidth = drawingCanvas.width;
    const drawingHeight = drawingCanvas.height;
    
    console.log(`Drawing canvas dimensions: ${drawingWidth}x${drawingHeight}`);
    console.log(`Hidden canvas dimensions: ${hiddenCanvas.width}x${hiddenCanvas.height}`);
    
    // Clear hidden canvas with white background (for MobileNet)
    hiddenCtx.fillStyle = 'white';
    hiddenCtx.fillRect(0, 0, hiddenCanvas.width, hiddenCanvas.height);
    
    // Get drawing bounds
    const imageData = drawingCanvas.getContext('2d').getImageData(0, 0, drawingWidth, drawingHeight);
    const data = imageData.data;
    
    let minX = drawingWidth, minY = drawingHeight, maxX = 0, maxY = 0;
    let hasDrawing = false;
    
    // Determine if we're in dark mode
    const isDarkMode = document.body.classList.contains('dark');
    
    // Find drawing boundaries
    for (let y = 0; y < drawingHeight; y += 4) { // Sample every 4 pixels for performance
      for (let x = 0; x < drawingWidth; x += 4) {
        const idx = (y * drawingWidth + x) * 4;
        
        // Check if pixel is not background
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const a = data[idx + 3];
        
        let isDrawingPixel = false;
        if (isDarkMode) {
          // In dark mode, lighter pixels are the drawing
          isDrawingPixel = (r > 150 || g > 150 || b > 150) && a > 100;
        } else {
          // In light mode, darker pixels are the drawing
          isDrawingPixel = (r < 200 || g < 200 || b < 200) && a > 100;
        }
        
        if (isDrawingPixel) {
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
          hasDrawing = true;
        }
      }
    }
    
    if (!hasDrawing) {
      console.warn('No drawing detected on canvas');
      return null;
    }
    
    console.log(`Drawing bounds: (${minX},${minY}) to (${maxX},${maxY})`);
    
    // Add padding
    const padding = 20;
    minX = Math.max(0, minX - padding);
    minY = Math.max(0, minY - padding);
    maxX = Math.min(drawingWidth, maxX + padding);
    maxY = Math.min(drawingHeight, maxY + padding);
    
    const drawingBoxWidth = maxX - minX;
    const drawingBoxHeight = maxY - minY;
    
    // If drawing is too small, return null
    if (drawingBoxWidth < 20 || drawingBoxHeight < 20) {
      console.warn('Drawing is too small to process');
      return null;
    }
    
    try {
      // Center and scale drawing to fit in hidden canvas while maintaining aspect ratio
      const scale = Math.min(
        (hiddenCanvas.width - 40) / drawingBoxWidth,
        (hiddenCanvas.height - 40) / drawingBoxHeight
      );
      
      const centerX = (hiddenCanvas.width - drawingBoxWidth * scale) / 2;
      const centerY = (hiddenCanvas.height - drawingBoxHeight * scale) / 2;
      
      // Draw the isolated drawing onto the hidden canvas
      hiddenCtx.drawImage(
        drawingCanvas,
        minX, minY, drawingBoxWidth, drawingBoxHeight,
        centerX, centerY, drawingBoxWidth * scale, drawingBoxHeight * scale
      );
      
      // Invert colors if needed (MobileNet expects black drawing on white background)
      // In dark mode, we're drawing white on dark so we need to invert
      if (isDarkMode) {
        const hiddenData = hiddenCtx.getImageData(0, 0, hiddenCanvas.width, hiddenCanvas.height);
        const hiddenPixels = hiddenData.data;
        
        for (let i = 0; i < hiddenPixels.length; i += 4) {
          // Invert colors
          hiddenPixels[i] = 255 - hiddenPixels[i];       // R
          hiddenPixels[i + 1] = 255 - hiddenPixels[i + 1]; // G
          hiddenPixels[i + 2] = 255 - hiddenPixels[i + 2]; // B
        }
        
        hiddenCtx.putImageData(hiddenData, 0, 0);
      }
      
      // For debugging - Add a border to see the processed area
      hiddenCtx.strokeStyle = 'blue';
      hiddenCtx.lineWidth = 2;
      hiddenCtx.strokeRect(0, 0, hiddenCanvas.width, hiddenCanvas.height);
      
      // Debug to see what we're passing to the model
      console.log('Drawing preprocessed for recognition');
      
      return hiddenCanvas;
    } catch (error) {
      console.error('Error preprocessing drawing:', error);
      return null;
    }
  };
  
  // Add example to classifier - improved error handling
  const addExample = async (classId) => {
    if (!mobilenetModel || !classifier || !isDrawingModelLoaded) {
      setErrorMessage('Drawing recognition model not ready. Please try again.');
      return;
    }
    
    const processedCanvas = preprocessDrawing();
    if (!processedCanvas) {
      setErrorMessage('Please draw something first.');
      return;
    }
    
    try {
      setIsTraining(true);
      console.log(`Adding example for class: ${classId}`);
      
      // Get activation from MobileNet
      const activation = mobilenetModel.infer(processedCanvas, true);
      
      // Add example to classifier
      classifier.addExample(activation, classId);
      
      // Get example counts
      const exampleCounts = classifier.getClassExampleCount();
      console.log('Example counts:', exampleCounts);
      const exampleCount = exampleCounts[classId] || 0;
      
      // Indicate training progress
      setTrainingProgress(exampleCount);
      
      // Clear canvas for next example
      clearDrawing();
      
      // Update classifier state
      const classCount = Object.keys(exampleCounts).length;
      const totalExamples = Object.values(exampleCounts).reduce((a, b) => a + b, 0);
      console.log(`Classes: ${classCount}, Total examples: ${totalExamples}`);
      
      if (classCount >= 2 && totalExamples >= 2) {
        setIsClassifierTrained(true);
        console.log('Classifier is now trained');
      }
      
    } catch (error) {
      console.error('Error adding example:', error);
      setErrorMessage(`Error adding example: ${error.message}`);
    } finally {
      setIsTraining(false);
    }
  };
  
  // Recognize drawing with improved error handling
  const recognizeDrawing = async () => {
    if (!mobilenetModel || !classifier || !isDrawingModelLoaded) {
      setErrorMessage('Drawing recognition model not ready. Please try again.');
      return;
    }
    
    if (!isClassifierTrained) {
      setErrorMessage('Please train the model with examples first.');
      setDrawingMode('train');
      return;
    }
    
    const processedCanvas = preprocessDrawing();
    if (!processedCanvas) {
      setErrorMessage('Please draw something to recognize.');
      return;
    }
    
    setIsRecognizing(true);
    setRecognitionResult(null);
    setErrorMessage('');
    
    try {
      console.log('Starting recognition...');
      
      // Get activation from MobileNet
      const activation = mobilenetModel.infer(processedCanvas, true);
      
      // Check if classifier has examples
      const exampleCounts = classifier.getClassExampleCount();
      const totalExamples = Object.values(exampleCounts).reduce((a, b) => a + b, 0);
      
      if (totalExamples === 0) {
        throw new Error('No training examples available');
      }
      
      // Get prediction from classifier
      const result = await classifier.predictClass(activation);
      console.log('Recognition result:', result);
      
      // Find matching category
      const category = drawingCategories.find(cat => cat.id === result.label);
      
      if (result && result.label) {
        setRecognitionResult({
          name: category ? category.name : result.label,
          confidence: Math.round((result.confidences[result.label] || 0) * 100),
          description: category ? category.description : 'Custom drawing'
        });
      } else {
        throw new Error('Classifier returned invalid result');
      }
      
    } catch (error) {
      console.error('Recognition error:', error);
      setErrorMessage(`Error recognizing drawing: ${error.message}`);
      setRecognitionResult(null);
    } finally {
      setIsRecognizing(false);
    }
  };
  
  // Toggle drawing mode between drawing and training
  const toggleDrawingMode = () => {
    const newMode = drawingMode === 'draw' ? 'train' : 'draw';
    setDrawingMode(newMode);
    
    // If switching to training mode, set the first category as selected by default
    if (newMode === 'train' && !selectedCategory) {
      setSelectedCategory(drawingCategories[0]);
    } else {
      setSelectedCategory(null);
    }
    
    setRecognitionResult(null);
    clearDrawing();
  };
  
  // Switch tabs
  const handleTabChange = (tab) => {
    // Clean up current tab
    if (activeTab === 'objectDetection' && isDetecting) {
      stopClassification();
    } else if (activeTab === 'whiteboard') {
      setRecognitionResult(null);
      setSelectedCategory(null);
    }
    
    setActiveTab(tab);
  };
  
  // Add a function to capture and save the current detection
  const captureClassification = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    try {
      // Create a composite canvas with both video and overlay
      const compositeCanvas = document.createElement('canvas');
      const video = videoRef.current;
      const overlayCanvas = canvasRef.current;
      
      compositeCanvas.width = video.videoWidth;
      compositeCanvas.height = video.videoHeight;
      
      const ctx = compositeCanvas.getContext('2d');
      
      // Draw video frame
      ctx.drawImage(video, 0, 0, compositeCanvas.width, compositeCanvas.height);
      
      // Draw overlay with classifications
      ctx.drawImage(overlayCanvas, 0, 0, compositeCanvas.width, compositeCanvas.height);
      
      // Create download link
      const link = document.createElement('a');
      link.download = `classification-${new Date().toISOString().replace(/:/g, '-')}.png`;
      link.href = compositeCanvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error saving classification:', error);
      setErrorMessage('Failed to save the classification image.');
    }
  };
  
  // Add a toggle for pausing detection
  const togglePause = () => {
    setIsPaused(!isPaused);
  };
  
  // Utility to check model availability
  const checkModelStatus = () => {
    console.log('Checking model status...');
    console.log('Object Detection Model:', objectModel ? 'Loaded' : 'Not loaded');
    console.log('MobileNet Model:', mobilenetModel ? 'Loaded' : 'Not loaded');
    console.log('Classifier:', classifier ? 'Created' : 'Not created');
    
    if (classifier) {
      const counts = classifier.getClassExampleCount();
      console.log('Classifier example counts:', counts);
      console.log('Total examples:', Object.values(counts).reduce((a, b) => a + b, 0));
    }
    
    return {
      objectDetection: !!objectModel,
      drawingRecognition: !!mobilenetModel && !!classifier
    };
  };
  
  // Call the check function when tab changes
  useEffect(() => {
    // Short delay to ensure models have time to initialize
    const timer = setTimeout(() => {
      checkModelStatus();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [activeTab, isModelLoaded, isDrawingModelLoaded]);
  
  return (
    <DemoContainer>
      <DemoHeader justify="space-between" align="center">
        <DemoTitle>AI Demonstrations</DemoTitle>
      </DemoHeader>
      
      <TabsContainer justify="center" gap="md">
        <TabButton 
          onClick={() => handleTabChange('objectDetection')}
          $active={activeTab === 'objectDetection'}
          $ready={isModelLoaded}
          $loading={activeTab === 'objectDetection' && !isModelLoaded}
        >
          Object Detection
        </TabButton>
        <TabButton 
          onClick={() => handleTabChange('whiteboard')}
          $active={activeTab === 'whiteboard'}
          $ready={isDrawingModelLoaded}
          $loading={activeTab === 'whiteboard' && !isDrawingModelLoaded}
        >
          Drawing Recognition
        </TabButton>
      </TabsContainer>
      
      {activeTab === 'objectDetection' && (
        <>
          <Text size="sm" margin="0 0 16px 0">
            This demo uses TensorFlow.js and the MobileNet model to classify objects in real-time using your camera.
            All processing happens locally in your browser - no images are sent to any server.
          </Text>
          
          <StatusIndicator $active={isModelLoaded}>
            Model Status: {isModelLoaded ? 'Loaded' : 'Loading TensorFlow model...'}
          </StatusIndicator>
          
          {errorMessage && (
            <Text color={theme.colors.danger} margin="0 0 16px 0">
              {errorMessage}
            </Text>
          )}
          
          {!isDetecting && isModelLoaded && (
            <InfoCard>
              <InfoTitle size="md">About MobileNet Image Classification</InfoTitle>
              <InfoContent>
                <Text size="sm">
                  The MobileNet model can classify images into 1000 different categories in real-time. 
                  Classifications happen entirely in your browser using TensorFlow.js - 
                  no video is sent to any server.
                </Text>
                
                <Text size="xs" margin="16px 0 0 0" color={theme.colors.secondary}>
                  Note: Classification accuracy may vary based on lighting conditions, camera quality, 
                  and object visibility. For best results, ensure good lighting and center the main object in the frame.
                </Text>
              </InfoContent>
            </InfoCard>
          )}
          
          <VideoContainer>
            <Video 
              ref={videoRef}
              autoPlay
              playsInline
              muted
            />
            <Canvas ref={canvasRef} />
          </VideoContainer>
          
          <Controls gap="md" justify="center">
            {!isDetecting ? (
              <NeumorphicButton 
                onClick={startClassification}
                disabled={!isModelLoaded}
                $primary
              >
                Start Camera Classification
              </NeumorphicButton>
            ) : (
              <>
                <NeumorphicButton 
                  onClick={stopClassification}
                  $primary
                >
                  Stop Camera
                </NeumorphicButton>
                
                <NeumorphicButton 
                  onClick={togglePause}
                >
                  {isPaused ? 'Resume Classification' : 'Pause Classification'}
                </NeumorphicButton>
                
                <NeumorphicButton 
                  onClick={captureClassification}
                  disabled={isPaused || classifications.length === 0}
                >
                  Save Screenshot
                </NeumorphicButton>
                
                <NeumorphicButton 
                  onClick={() => setShowSettings(!showSettings)}
                >
                  {showSettings ? 'Hide Settings' : 'Show Settings'}
                </NeumorphicButton>
              </>
            )}
          </Controls>
          
          {showSettings && isDetecting && (
            <SettingsPanel $isDarkMode={isDarkMode}>
              <SubHeading size="sm" margin="0 0 16px 0">
                Classification Settings
              </SubHeading>
              
              <SettingsRow align="center">
                <SettingsLabel>
                  Confidence Threshold:
                </SettingsLabel>
                <SliderContainer>
                  <Slider 
                    type="range"
                    min="1"
                    max="100"
                    value={confidenceThreshold}
                    onChange={e => setConfidenceThreshold(parseInt(e.target.value))}
                    theme={theme}
                  />
                  <SliderValue>{confidenceThreshold}%</SliderValue>
                </SliderContainer>
              </SettingsRow>
              
              <SettingsRow align="center">
                <SettingsLabel>
                  Max Results:
                </SettingsLabel>
                <SliderContainer>
                  <Slider 
                    type="range"
                    min="1"
                    max="20"
                    value={maxDetections}
                    onChange={e => setMaxDetections(parseInt(e.target.value))}
                    theme={theme}
                  />
                  <SliderValue>{maxDetections}</SliderValue>
                </SliderContainer>
              </SettingsRow>
            </SettingsPanel>
          )}
          
          {isDetecting && !isPaused && (
            <PerformanceMetrics $isDarkMode={isDarkMode}>
              <SubHeading size="sm" margin="0 0 16px 0">
                Performance Metrics
              </SubHeading>
              
              <MetricsRow>
                <MetricsLabel>FPS:</MetricsLabel>
                <MetricsValue>{fps}</MetricsValue>
              </MetricsRow>
              
              <MetricsRow>
                <MetricsLabel>Inference Time:</MetricsLabel>
                <MetricsValue>{inferenceTime} ms</MetricsValue>
              </MetricsRow>
              
              <MetricsRow>
                <MetricsLabel>Classifications:</MetricsLabel>
                <MetricsValue>{classifications.length}</MetricsValue>
              </MetricsRow>
            </PerformanceMetrics>
          )}
          
          {classifications.length > 0 && (
            <>
              <SubHeading size="md" margin="24px 0 8px 0">
                Classification Results
              </SubHeading>
              
              <ResultsContainer>
                {classifications
                  .filter(classification => classification.probability >= confidenceThreshold / 100)
                  .map((classification, index) => (
                    <Result key={index} $isDarkMode={isDarkMode}>
                      <ObjectName>{classification.className}</ObjectName>
                      <Confidence>{Math.round(classification.probability * 100)}%</Confidence>
                    </Result>
                  ))}
                
                {classifications.filter(classification => classification.probability >= confidenceThreshold / 100).length === 0 && (
                  <Text size="sm" center margin="16px 0">
                    No classifications with current confidence threshold
                  </Text>
                )}
              </ResultsContainer>
            </>
          )}
          
          {classesDetected.size > 0 && (
            <>
              <SubHeading size="sm" margin="24px 0 8px 0">
                Classes Detected in This Session:
              </SubHeading>
              
              <div>
                {Array.from(classesDetected).map(className => (
                  <ClassBubble key={className} theme={theme}>
                    {className}
                  </ClassBubble>
                ))}
              </div>
            </>
          )}
        </>
      )}
      
      {activeTab === 'whiteboard' && (
        <>
          <Text size="sm" margin="0 0 16px 0">
            {drawingMode === 'draw' 
              ? 'Draw a shape on the canvas and the trained AI model will try to recognize it.' 
              : 'Draw examples of different shapes to train the AI. Select a category and add examples.'}
          </Text>
          
          <StatusIndicator $active={isDrawingModelLoaded}>
            Model Status: {isDrawingModelLoaded 
              ? isClassifierTrained 
                ? 'Trained and ready' 
                : 'Loaded (needs training)' 
              : 'Loading TensorFlow models...'}
          </StatusIndicator>
          
          {errorMessage && (
            <Text color={theme.colors.danger} margin="0 0 16px 0">
              {errorMessage}
            </Text>
          )}
          
          <DrawingTools align="center" justify="space-between">
            <FlexContainer gap="xs" align="center">
              <Text size="sm" margin="0 8px 0 0">Brush Color:</Text>
              {colors.map(color => (
                <ColorButton 
                  key={color} 
                  color={color}
                  isSelected={drawingColor === color}
                  onClick={() => setDrawingColor(color)}
                  title={color}
                />
              ))}
            </FlexContainer>
            
            <FlexContainer gap="xs" align="center">
              <Text size="sm">Brush Size:</Text>
              {brushSizes.map(size => (
                <BrushSizeButton 
                  key={size}
                  size={size}
                  isSelected={brushSize === size}
                  $isDarkMode={isDarkMode}
                  onClick={() => setBrushSize(size)}
                  title={`${size}px`}
                />
              ))}
            </FlexContainer>
          </DrawingTools>
          
          <DrawingCanvasContainer $isDarkMode={isDarkMode}>
            <DrawingCanvas ref={drawingCanvasRef} />
          </DrawingCanvasContainer>
          
          <Controls gap="md" justify="center">
            <ClearButton onClick={clearDrawing}>
              Clear Canvas
            </ClearButton>
            
            {drawingMode === 'draw' ? (
              <>
                <NeumorphicButton 
                  onClick={recognizeDrawing}
                  disabled={isRecognizing || !isClassifierTrained}
                  $primary
                >
                  {isRecognizing ? 'Analyzing...' : 'Recognize Drawing'}
                </NeumorphicButton>
                
                <NeumorphicButton 
                  onClick={toggleDrawingMode}
                >
                  Switch to Training Mode
                </NeumorphicButton>
              </>
            ) : (
              <>
                <NeumorphicButton 
                  onClick={() => selectedCategory && addExample(selectedCategory.id)}
                  disabled={!selectedCategory || !isDrawingModelLoaded || isTraining}
                  $primary
                >
                  {isTraining ? 'Adding Example...' : 'Add Example'}
                </NeumorphicButton>
                
                <NeumorphicButton 
                  onClick={toggleDrawingMode}
                >
                  Switch to Recognition Mode
                </NeumorphicButton>
              </>
            )}
          </Controls>
          
          {drawingMode === 'train' && (
            <TrainingContainer $isDarkMode={isDarkMode}>
              <SubHeading size="md" margin="0 0 16px 0">
                Training Mode
              </SubHeading>
              
              <Text size="sm" margin="0 0 16px 0">
                Select a category, draw an example, then click "Add Example". 
                Add multiple examples per category for better recognition.
              </Text>
              
              <CategoryGrid>
                {drawingCategories.map(category => {
                  const exampleCount = classifier && classifier.getClassExampleCount()[category.id] || 0;
                  return (
                    <CategoryCard 
                      key={category.id}
                      isSelected={selectedCategory && selectedCategory.id === category.id}
                      theme={theme}
                      onClick={() => setSelectedCategory(category)}
                    >
                      <CategoryName>{category.name}</CategoryName>
                      <ExampleCount>
                        {exampleCount} example{exampleCount !== 1 ? 's' : ''}
                      </ExampleCount>
                    </CategoryCard>
                  );
                })}
              </CategoryGrid>
              
              {isClassifierTrained && (
                <TrainingProgress 
                  progress={Math.min(100, trainingProgress * 10)} 
                  theme={theme}
                  $isDarkMode={isDarkMode}
                />
              )}
              
              <ModelControls>
                <NeumorphicButton
                  onClick={() => {
                    setClassifier(knnClassifier.create());
                    setIsClassifierTrained(false);
                    setTrainingProgress(0);
                  }}
                >
                  Reset Training
                </NeumorphicButton>
                
                <NeumorphicButton
                  onClick={() => {
                    // Export trained model as JSON
                    if (classifier) {
                      const dataset = classifier.getClassifierDataset();
                      const datasetObj = {};
                      Object.keys(dataset).forEach((key) => {
                        const data = dataset[key].dataSync();
                        datasetObj[key] = Array.from(data);
                      });
                      
                      // Create download link
                      const jsonStr = JSON.stringify(datasetObj);
                      const blob = new Blob([jsonStr], {type: 'application/json'});
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.download = 'drawing-model.json';
                      a.href = url;
                      a.click();
                      URL.revokeObjectURL(url);
                    }
                  }}
                  disabled={!isClassifierTrained}
                >
                  Export Model
                </NeumorphicButton>
                
                <label htmlFor="upload-model">
                  <input
                    id="upload-model"
                    type="file"
                    accept=".json"
                    style={{ display: 'none' }}
                    onChange={async (e) => {
                      try {
                        const file = e.target.files[0];
                        const reader = new FileReader();
                        
                        reader.onload = async (event) => {
                          const datasetObj = JSON.parse(event.target.result);
                          const newClassifier = knnClassifier.create();
                          
                          // Load the dataset into the classifier
                          Object.keys(datasetObj).forEach((key) => {
                            const data = tf.tensor(datasetObj[key]);
                            newClassifier.addExample(data, key);
                          });
                          
                          setClassifier(newClassifier);
                          setIsClassifierTrained(true);
                          
                          // Update training progress
                          const exampleCount = Object.values(newClassifier.getClassExampleCount())
                            .reduce((a, b) => a + b, 0);
                          setTrainingProgress(exampleCount);
                        };
                        
                        reader.readAsText(file);
                      } catch (error) {
                        console.error('Error loading model:', error);
                        setErrorMessage('Failed to load the model file. Please try again.');
                      }
                    }}
                  />
                  <NeumorphicButton as="span">
                    Import Model
                  </NeumorphicButton>
                </label>
              </ModelControls>
            </TrainingContainer>
          )}
          
          {drawingMode === 'draw' && !isClassifierTrained && (
            <RecognitionResult visible theme={theme}>
              <Text size="sm" margin="16px 0 0 0">
                The model needs to be trained before it can recognize drawings.
                Switch to Training Mode and add examples for different categories.
              </Text>
              <NeumorphicButton 
                onClick={toggleDrawingMode}
                margin="16px 0 0 0"
                size="sm"
              >
                Start Training
              </NeumorphicButton>
            </RecognitionResult>
          )}
          
          {isRecognizing && (
            <RecognitionResult visible theme={theme}>
              <Spinner theme={theme} />
              <Text size="sm" margin="16px 0 0 0">
                Analyzing your drawing...
              </Text>
            </RecognitionResult>
          )}
          
          {recognitionResult && !isRecognizing && (
            <RecognitionResult visible theme={theme}>
              <SubHeading size="md" margin="0 0 16px 0">
                Recognition Result
              </SubHeading>
              
              <Text size="lg" color={theme.colors.primary} margin="0 0 8px 0">
                {recognitionResult.name} ({recognitionResult.confidence}% confidence)
              </Text>
              
              <Text size="sm">
                {recognitionResult.description}
              </Text>
            </RecognitionResult>
          )}
        </>
      )}
    </DemoContainer>
  );
};

export default AIDemo; 