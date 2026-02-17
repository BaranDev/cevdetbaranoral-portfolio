import { useState, useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as knnClassifier from "@tensorflow-models/knn-classifier";
import * as faceapi from "@vladmandic/face-api";
import { useTheme } from "../../context/ThemeContext";
import {
  Smile,
  Meh,
  Frown,
  Angry,
  Ghost,
  Skull,
  Zap,
  Play,
  Square,
  Trash2,
  Search,
  GraduationCap,
  Plus,
  RotateCcw,
  Download,
  Upload,
  Camera,
  Save,
  Settings,
  Activity,
  Info,
  User,
  Brush,
  AlertTriangle,
  Eraser,
  Heart,
  Circle,
  Square as SquareIcon,
  Triangle,
  Star,
  Home as HomeIcon,
  Trees,
} from "lucide-react";

// ─── Tailwind Components replacing Styled Components ────────────────

const DemoContainer = ({ children, className = "", ...props }) => (
  <div
    className={`p-6 my-8 bg-card rounded-2xl shadow-neumorphic ${className}`}
    {...props}
  >
    {children}
  </div>
);

const DemoHeader = ({ children, justify, align, ...props }) => (
  <div
    className={`flex mb-4 ${justify ? `justify-${justify.replace("space-", "")}` : ""} ${align ? `items-${align}` : ""}`}
    style={{ justifyContent: justify, alignItems: align }}
    {...props}
  >
    {children}
  </div>
);

const DemoTitle = ({ children, ...props }) => (
  <h3 className="text-xl font-semibold m-0 text-text font-heading" {...props}>
    {children}
  </h3>
);

const TabsContainer = ({ children, justify, gap, ...props }) => (
  <div
    className={`flex flex-wrap mb-4 ${justify === "center" ? "justify-center" : ""} ${gap === "md" ? "gap-4" : "gap-2"}`}
    {...props}
  >
    {children}
  </div>
);

const TabButton = ({ $ready, $loading, $active, children, ...props }) => (
  <button
    className={`
      min-w-[150px] text-center relative px-6 py-3 rounded-xl font-bold transition-all duration-300 md:mb-2
      ${
        $active
          ? "bg-primary text-white shadow-inner transform translate-y-[1px]"
          : "bg-background text-text shadow-neumorphic hover:-translate-y-1 hover:shadow-neumorphic-hover"
      }
    `}
    {...props}
  >
    {children}
    {($ready || $loading) && (
      <span
        className={`absolute top-2.5 right-2.5 w-2 h-2 rounded-full ${$ready ? "bg-success" : "bg-warning"}`}
      />
    )}
  </button>
);

const VideoContainer = ({ children, ...props }) => (
  <div
    className="relative w-full h-0 pb-[56.25%] rounded-lg overflow-hidden shadow-inner mb-4 bg-black/5"
    {...props}
  >
    {children}
  </div>
);

const Video = (props) => (
  <video
    className="absolute top-0 left-0 w-full h-full object-cover"
    {...props}
  />
);

const Canvas = (props) => (
  <canvas className="absolute top-0 left-0 w-full h-full" {...props} />
);

const StatusIndicator = ({ $active, children, ...props }) => (
  <div className="flex items-center mb-4" {...props}>
    <div
      className={`w-3 h-3 rounded-full mr-2 ${$active ? "bg-success" : "bg-danger"}`}
    />
    {children}
  </div>
);

const Controls = ({ children, gap, justify, ...props }) => (
  <div
    className={`flex mt-4 flex-wrap ${gap === "md" ? "gap-4" : "gap-2"} ${justify === "center" ? "justify-center" : ""}`}
    {...props}
  >
    {children}
  </div>
);

const NeumorphicButton = ({ $primary, children, as, ...props }) => {
  const Component = as || "button";
  return (
    <Component
      className={`
        px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center cursor-pointer
        ${
          $primary
            ? "bg-primary text-white shadow-md hover:-translate-y-1 hover:shadow-lg"
            : "bg-background text-text shadow-neumorphic hover:-translate-y-1 hover:shadow-neumorphic-hover"
        }
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
      `}
      {...props}
    >
      {children}
    </Component>
  );
};

// Results & Emotions
const PerformanceMetrics = ({ $isDarkMode, children, ...props }) => (
  <div
    className={`mt-4 p-4 text-sm rounded-lg ${$isDarkMode ? "bg-white/5" : "bg-black/5"}`}
    {...props}
  >
    {children}
  </div>
);

const MetricsRow = ({ children }) => (
  <div className="flex mb-1 last:mb-0">{children}</div>
);

const MetricsLabel = ({ children }) => (
  <div className="font-medium min-w-[160px] text-text">{children}</div>
);

const MetricsValue = ({ children }) => (
  <div className="text-primary font-mono">{children}</div>
);

const DominantEmotionBadge = ({ $color, children, ...props }) => (
  <div
    className="inline-flex items-center gap-2 px-5 py-2 rounded-full mt-4 text-lg font-semibold bg-opacity-20 border border-opacity-30"
    style={{ backgroundColor: `${$color}22`, borderColor: `${$color}44` }}
    {...props}
  >
    {children}
  </div>
);

const FaceInfoCard = ({ children, ...props }) => (
  <div
    className="p-4 mt-4 flex flex-wrap gap-4 bg-card rounded-2xl shadow-neumorphic"
    {...props}
  >
    {children}
  </div>
);

const FaceInfoItem = ({ children }) => (
  <div className="flex-1 min-w-[120px] text-center">{children}</div>
);

const FaceInfoValue = ({ children, style }) => (
  <div className="text-2xl font-bold text-primary" style={style}>
    {children}
  </div>
);

const FaceInfoLabel = ({ children }) => (
  <div className="text-xs text-secondary mt-1 flex items-center justify-center gap-1">
    {children}
  </div>
);

const EmotionBarContainer = ({ children }) => (
  <div className="mt-4">{children}</div>
);

const EmotionRow = ({ children }) => (
  <div className="flex items-center mb-1.5 gap-2">{children}</div>
);

const EmotionLabel = ({ children }) => (
  <span className="min-w-[100px] text-sm font-medium capitalize text-text">
    {children}
  </span>
);

const EmotionBarTrack = ({ $isDarkMode, children }) => (
  <div
    className={`flex-1 h-3.5 rounded-full overflow-hidden relative ${$isDarkMode ? "bg-white/10" : "bg-black/5"}`}
  >
    {children}
  </div>
);

const EmotionBarFill = ({ $width, $color }) => (
  <div
    className="h-full rounded-full transition-all duration-300"
    style={{ width: `${$width}%`, backgroundColor: $color }}
  />
);

const EmotionPercent = ({ children }) => (
  <span className="min-w-[44px] text-right text-xs font-semibold text-primary">
    {children}
  </span>
);

// Drawing & Training
const DrawingCanvasContainer = ({ $isDarkMode, children }) => (
  <div
    className={`relative w-full rounded-lg overflow-hidden shadow-inner my-4 ${$isDarkMode ? "bg-[#1e2335]" : "bg-white"}`}
  >
    {children}
  </div>
);

const DrawingCanvas = (props) => (
  <canvas className="w-full h-[300px] block cursor-crosshair" {...props} />
);

const DrawingTools = ({ children }) => (
  <div className="flex flex-wrap mb-4 justify-between items-center sm:justify-center">
    {children}
  </div>
);

const ColorButton = ({ color, isSelected, ...props }) => (
  <button
    className={`w-8 h-8 rounded-full border-2 mr-2 cursor-pointer transition-transform hover:scale-110 ${isSelected ? "border-primary" : "border-transparent"}`}
    style={{ backgroundColor: color }}
    {...props}
  />
);

const BrushSizeButton = ({ size, isSelected, $isDarkMode, ...props }) => (
  <button
    className={`rounded-full border-2 ml-2 cursor-pointer transition-transform hover:scale-110 flex items-center justify-center ${isSelected ? "border-primary" : $isDarkMode ? "border-[#3a4556]" : "border-[#c5cfe0]"}`}
    style={{
      width: size * 2,
      height: size * 2,
      backgroundColor: $isDarkMode ? "white" : "black",
    }}
    {...props}
  />
);

const ClearButton = (props) => <NeumorphicButton {...props} className="mr-4" />;

const TrainingContainer = ({ $isDarkMode, children }) => (
  <div
    className={`flex flex-col mt-4 rounded-lg p-4 ${$isDarkMode ? "bg-white/10" : "bg-black/5"}`}
  >
    {children}
  </div>
);

const CategoryGrid = ({ children }) => (
  <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4 my-4">
    {children}
  </div>
);

const CategoryCard = ({ isSelected, children, ...props }) => (
  <div
    className={`
      p-4 rounded-lg bg-card transition-all duration-200 cursor-pointer text-center hover:-translate-y-0.5
      ${isSelected ? "ring-2 ring-primary shadow-md" : "shadow-sm"}
    `}
    {...props}
  >
    {children}
  </div>
);

const CategoryName = ({ children }) => (
  <div className="font-semibold mb-1 text-text">{children}</div>
);

const ExampleCount = ({ children }) => (
  <div className="text-xs text-secondary">{children}</div>
);

const TrainingProgress = ({ progress, $isDarkMode }) => (
  <div
    className={`w-full h-2 rounded-full my-4 overflow-hidden ${$isDarkMode ? "bg-white/10" : "bg-black/10"}`}
  >
    <div
      className="h-full bg-primary transition-all duration-300"
      style={{ width: `${progress}%` }}
    />
  </div>
);

const ModelControls = ({ children }) => (
  <div className="flex mt-4 justify-between">{children}</div>
);

const RecognitionResult = ({ visible, children }) => (
  <div
    className={`
      mt-4 p-4 text-center bg-card rounded-2xl shadow-neumorphic transition-all duration-300
      ${visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}
    `}
  >
    {children}
  </div>
);

const Spinner = () => (
  <div className="w-10 h-10 mx-auto border-4 border-black/10 border-l-primary rounded-full animate-spin" />
);

// Info & Typography
const InfoCard = ({ children }) => (
  <div className="mt-4 p-4 bg-card rounded-2xl shadow-neumorphic">
    {children}
  </div>
);

const InfoTitle = ({ size, children }) => (
  <h3
    className={`font-semibold mt-0 ${size === "md" ? "text-lg" : "text-base"}`}
  >
    {children}
  </h3>
);

const InfoContent = ({ children }) => <div className="mt-4">{children}</div>;

const SubHeading = ({ size, margin, children, ...props }) => (
  <h3
    className={`font-semibold text-text ${size === "sm" ? "text-base" : "text-xl"}`}
    style={{ margin }}
    {...props}
  >
    {children}
  </h3>
);

const Text = ({
  size,
  color,
  margin,
  $center,
  $maxWidth,
  weight,
  children,
}) => (
  <p
    className={`
      ${size === "sm" ? "text-sm" : size === "xs" ? "text-xs" : "text-base"}
      ${$center ? "text-center" : ""}
      ${weight === "semiBold" ? "font-semibold" : weight === "medium" ? "font-medium" : ""}
    `}
    style={{
      color,
      margin,
      maxWidth: $maxWidth,
    }}
  >
    {children}
  </p>
);

const FlexContainer = ({ gap, align, justify, children, ...props }) => (
  <div
    className="flex"
    style={{
      gap: gap === "xs" ? 4 : 8,
      alignItems: align,
      justifyContent: justify,
    }}
    {...props}
  >
    {children}
  </div>
);

// ─── Helpers ──────────────────────────────────────────────────

const EMOTION_ICONS = {
  neutral: Meh,
  happy: Smile,
  sad: Frown,
  angry: Angry,
  fearful: Ghost,
  disgusted: Skull,
  surprised: Zap,
};

const EMOTION_COLORS = {
  neutral: "#94a3b8",
  happy: "#facc15",
  sad: "#3b82f6",
  angry: "#ef4444",
  fearful: "#a855f7",
  disgusted: "#22c55e",
  surprised: "#f97316",
};

const MODEL_URL =
  "https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.14/model";

const drawingCategories = [
  {
    id: "star",
    name: "Star",
    icon: Star,
    description: "A classic 5-point star",
  },
  {
    id: "heart",
    name: "Heart",
    icon: Heart,
    description: "A symbol of love",
  },
  {
    id: "tree",
    name: "Tree",
    icon: Trees,
    description: "A simple tree drawing",
  },
  {
    id: "house",
    name: "House",
    icon: HomeIcon,
    description: "A basic house structure",
  },
  {
    id: "circle",
    name: "Circle",
    icon: Circle,
    description: "A perfectly round shape",
  },
  {
    id: "square",
    name: "Square",
    icon: SquareIcon,
    description: "A four-sided shape",
  },
  {
    id: "triangle",
    name: "Triangle",
    icon: Triangle,
    description: "A three-sided shape",
  },
];

// ─── Component ────────────────────────────────────────────────

const AIDemo = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const drawingCanvasRef = useRef(null);
  const hiddenCanvasRef = useRef(null);
  const isDetectingRef = useRef(false);
  const animFrameRef = useRef(null);

  // Emotion Analysis States
  const [isFaceModelLoaded, setIsFaceModelLoaded] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [faceResults, setFaceResults] = useState(null);
  const [facesCount, setFacesCount] = useState(0);

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
  const [drawingMode, setDrawingMode] = useState("draw");

  // UI States
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState("emotionAnalysis");
  const [drawingColor, setDrawingColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);

  // Performance
  const [fps, setFps] = useState(0);
  const [inferenceTime, setInferenceTime] = useState(0);

  const { theme, isDarkMode } = useTheme();

  const colors = [
    "#000000",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFA500",
    "#800080",
  ];
  const brushSizes = [3, 5, 8, 12];

  // ─── Load face-api.js models ───────────────────────────────

  useEffect(() => {
    if (activeTab === "emotionAnalysis" && !isFaceModelLoaded) {
      const loadModels = async () => {
        try {
          setErrorMessage("");
          console.log("Loading face-api.js models from CDN...");

          await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
            faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
          ]);

          console.log("face-api.js models loaded successfully");
          setIsFaceModelLoaded(true);
        } catch (error) {
          console.error("Error loading face-api models:", error);
          setErrorMessage(
            `Failed to load emotion analysis models: ${error.message}`,
          );
        }
      };
      loadModels();
    }
  }, [activeTab, isFaceModelLoaded]);

  // ─── Setup webcam ──────────────────────────────────────────

  const setupWebcam = async () => {
    if (!videoRef.current) return null;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });
      videoRef.current.srcObject = stream;
      return new Promise((resolve) => {
        videoRef.current.onloadedmetadata = () => resolve(stream);
      });
    } catch (error) {
      console.error("Error accessing webcam:", error);
      setErrorMessage(
        "Could not access your camera. Please grant camera permissions.",
      );
      return null;
    }
  };

  // ─── Start emotion analysis ────────────────────────────────

  const startDetection = async () => {
    if (!isFaceModelLoaded) {
      setErrorMessage("Emotion model not loaded yet. Please wait.");
      return;
    }
    const stream = await setupWebcam();
    if (!stream) return;

    isDetectingRef.current = true;
    setIsDetecting(true);
    setErrorMessage("");
    setFps(0);
    setInferenceTime(0);

    let frameCount = 0;
    const fpsInterval = setInterval(() => {
      setFps(frameCount);
      frameCount = 0;
    }, 1000);

    const detectFrame = async () => {
      if (!isDetectingRef.current || !videoRef.current || !canvasRef.current) {
        clearInterval(fpsInterval);
        return;
      }

      if (videoRef.current.readyState < 2) {
        animFrameRef.current = requestAnimationFrame(detectFrame);
        return;
      }

      try {
        frameCount++;
        const start = performance.now();

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const displaySize = {
          width: video.videoWidth,
          height: video.videoHeight,
        };

        canvas.width = displaySize.width;
        canvas.height = displaySize.height;

        faceapi.matchDimensions(canvas, displaySize);

        const detections = await faceapi
          .detectAllFaces(
            video,
            new faceapi.TinyFaceDetectorOptions({
              inputSize: 320,
              scoreThreshold: 0.4,
            }),
          )
          .withFaceLandmarks(true)
          .withFaceExpressions()
          .withAgeAndGender();

        const resized = faceapi.resizeResults(detections, displaySize);

        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw custom overlays
        resized.forEach((det) => {
          const { x, y, width, height } = det.detection.box;

          // Determine dominant expression
          const expressions = det.expressions;
          let dominant = "neutral";
          let maxVal = 0;
          Object.entries(expressions).forEach(([expr, val]) => {
            if (val > maxVal) {
              dominant = expr;
              maxVal = val;
            }
          });
          const boxColor = EMOTION_COLORS[dominant] || "#daa520";

          // Draw face box with rounded corners
          ctx.strokeStyle = boxColor;
          ctx.lineWidth = 3;
          ctx.lineJoin = "round";
          const r = 8;
          ctx.beginPath();
          ctx.moveTo(x + r, y);
          ctx.lineTo(x + width - r, y);
          ctx.quadraticCurveTo(x + width, y, x + width, y + r);
          ctx.lineTo(x + width, y + height - r);
          ctx.quadraticCurveTo(
            x + width,
            y + height,
            x + width - r,
            y + height,
          );
          ctx.lineTo(x + r, y + height);
          ctx.quadraticCurveTo(x, y + height, x, y + height - r);
          ctx.lineTo(x, y + r);
          ctx.quadraticCurveTo(x, y, x + r, y);
          ctx.closePath();
          ctx.stroke();

          // Draw label background
          const label = `${dominant.toUpperCase()} ${Math.round(maxVal * 100)}%`;
          ctx.font = "bold 14px Inter, Arial, sans-serif";
          const textW = ctx.measureText(label).width + 16;
          const labelH = 26;
          const labelY = y > labelH + 4 ? y - labelH - 4 : y + height + 4;

          ctx.fillStyle = boxColor + "cc";
          ctx.beginPath();
          ctx.roundRect(x, labelY, textW, labelH, 6);
          ctx.fill();

          ctx.fillStyle = "#fff";
          ctx.textBaseline = "middle";
          ctx.fillText(label, x + 8, labelY + labelH / 2);

          // Age + Gender label
          if (det.age && det.gender) {
            const ageLabel = `${det.gender}, ~${Math.round(det.age)}y`;
            ctx.font = "13px Inter, Arial, sans-serif";
            const ageW = ctx.measureText(ageLabel).width + 12;
            const ageY =
              labelY === y - labelH - 4
                ? y - labelH - 4 - 24
                : labelY + labelH + 4;
            ctx.fillStyle = "rgba(0,0,0,0.6)";
            ctx.beginPath();
            ctx.roundRect(x, ageY, ageW, 22, 4);
            ctx.fill();
            ctx.fillStyle = "#fff";
            ctx.textBaseline = "middle";
            ctx.fillText(ageLabel, x + 6, ageY + 11);
          }

          // Draw landmark dots
          if (det.landmarks) {
            const positions = det.landmarks.positions;
            ctx.fillStyle = boxColor + "88";
            positions.forEach((pt) => {
              ctx.beginPath();
              ctx.arc(pt.x, pt.y, 1.5, 0, Math.PI * 2);
              ctx.fill();
            });
          }
        });

        setInferenceTime(Math.round(performance.now() - start));
        setFacesCount(resized.length);

        if (resized.length > 0) {
          const best = resized[0];
          setFaceResults({
            expressions: best.expressions,
            age: best.age,
            gender: best.gender,
            genderProbability: best.genderProbability,
          });
        } else {
          setFaceResults(null);
        }
      } catch (err) {
        console.error("Detection error:", err);
      }

      if (isDetectingRef.current) {
        animFrameRef.current = requestAnimationFrame(detectFrame);
      }
    };

    detectFrame();
  };

  // ─── Stop detection ────────────────────────────────────────

  const stopDetection = () => {
    isDetectingRef.current = false;
    setIsDetecting(false);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    if (canvasRef.current) {
      canvasRef.current
        .getContext("2d")
        .clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    setFaceResults(null);
    setFacesCount(0);
    setFps(0);
    setInferenceTime(0);
  };

  // ─── Drawing recognition logic (kept from original) ─────────

  // Load MobileNet model for drawing recognition
  useEffect(() => {
    if (activeTab === "whiteboard" && !mobilenetModel) {
      const loadModels = async () => {
        try {
          await tf.ready();
          const model = await mobilenet.load();
          setMobilenetModel(model);
          const newClassifier = knnClassifier.create();
          setClassifier(newClassifier);
          setIsDrawingModelLoaded(true);
        } catch (error) {
          console.error("Error loading drawing recognition models:", error);
          setErrorMessage(
            `Failed to load drawing recognition models: ${error.message}`,
          );
        }
      };
      loadModels();
    }
  }, [activeTab, mobilenetModel]);

  // Setup hidden canvas
  useEffect(() => {
    if (activeTab === "whiteboard" && !hiddenCanvasRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = 224;
      canvas.height = 224;
      canvas.style.display = "none";
      hiddenCanvasRef.current = canvas;
      document.body.appendChild(canvas);
      return () => {
        if (
          hiddenCanvasRef.current &&
          document.body.contains(hiddenCanvasRef.current)
        ) {
          document.body.removeChild(hiddenCanvasRef.current);
          hiddenCanvasRef.current = null;
        }
      };
    }
  }, [activeTab]);

  // Setup drawing canvas
  useEffect(() => {
    if (activeTab === "whiteboard" && drawingCanvasRef.current) {
      const canvas = drawingCanvasRef.current;
      const ctx = canvas.getContext("2d");
      const resizeCanvas = () => {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = 300;
      };
      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);
      ctx.fillStyle = isDarkMode ? "#1e2335" : "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = drawingColor;
      ctx.lineWidth = brushSize;
      return () => window.removeEventListener("resize", resizeCanvas);
    }
  }, [activeTab, brushSize, drawingColor, isDarkMode]);

  useEffect(() => {
    if (drawingCanvasRef.current && activeTab === "whiteboard") {
      const ctx = drawingCanvasRef.current.getContext("2d");
      ctx.strokeStyle = drawingColor;
      ctx.lineWidth = brushSize;
    }
  }, [drawingColor, brushSize, activeTab]);

  // Drawing functionality
  useEffect(() => {
    if (activeTab === "whiteboard" && drawingCanvasRef.current) {
      const canvas = drawingCanvasRef.current;
      const ctx = canvas.getContext("2d");
      let isDrawing = false;
      let lastX = 0;
      let lastY = 0;

      const getCoordinates = (event) => {
        if (event.type.includes("mouse")) {
          return { offsetX: event.offsetX, offsetY: event.offsetY };
        }
        const rect = canvas.getBoundingClientRect();
        const touch = event.touches[0];
        return {
          offsetX: touch.clientX - rect.left,
          offsetY: touch.clientY - rect.top,
        };
      };

      const startDrawing = (e) => {
        isDrawing = true;
        const { offsetX, offsetY } = getCoordinates(e);
        lastX = offsetX;
        lastY = offsetY;
      };

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

      const stopDrawing = () => {
        isDrawing = false;
      };

      canvas.addEventListener("mousedown", startDrawing);
      canvas.addEventListener("mousemove", draw);
      canvas.addEventListener("mouseup", stopDrawing);
      canvas.addEventListener("mouseout", stopDrawing);

      const touchStart = (e) => {
        e.preventDefault();
        startDrawing(e);
      };
      const touchMove = (e) => {
        e.preventDefault();
        draw(e);
      };
      const touchEnd = (e) => {
        e.preventDefault();
        stopDrawing();
      };

      canvas.addEventListener("touchstart", touchStart);
      canvas.addEventListener("touchmove", touchMove);
      canvas.addEventListener("touchend", touchEnd);

      return () => {
        canvas.removeEventListener("mousedown", startDrawing);
        canvas.removeEventListener("mousemove", draw);
        canvas.removeEventListener("mouseup", stopDrawing);
        canvas.removeEventListener("mouseout", stopDrawing);
        canvas.removeEventListener("touchstart", touchStart);
        canvas.removeEventListener("touchmove", touchMove);
        canvas.removeEventListener("touchend", touchEnd);
      };
    }
  }, [activeTab, drawingColor, brushSize]);

  const clearDrawing = () => {
    if (!drawingCanvasRef.current) return;
    const ctx = drawingCanvasRef.current.getContext("2d");
    ctx.fillStyle = isDarkMode ? "#1e2335" : "white";
    ctx.fillRect(
      0,
      0,
      drawingCanvasRef.current.width,
      drawingCanvasRef.current.height,
    );
    setRecognitionResult(null);
  };

  const preprocessDrawing = () => {
    if (!drawingCanvasRef.current || !hiddenCanvasRef.current) return null;
    const drawingCanvas = drawingCanvasRef.current;
    const hiddenCanvas = hiddenCanvasRef.current;
    const hiddenCtx = hiddenCanvas.getContext("2d");
    const drawingWidth = drawingCanvas.width;
    const drawingHeight = drawingCanvas.height;

    hiddenCtx.fillStyle = "white";
    hiddenCtx.fillRect(0, 0, hiddenCanvas.width, hiddenCanvas.height);

    const imageData = drawingCanvas
      .getContext("2d")
      .getImageData(0, 0, drawingWidth, drawingHeight);
    const data = imageData.data;
    let minX = drawingWidth,
      minY = drawingHeight,
      maxX = 0,
      maxY = 0;
    let hasDrawing = false;

    for (let y = 0; y < drawingHeight; y += 4) {
      for (let x = 0; x < drawingWidth; x += 4) {
        const idx = (y * drawingWidth + x) * 4;
        const r = data[idx],
          g = data[idx + 1],
          b = data[idx + 2],
          a = data[idx + 3];
        const isDrawingPixel = isDarkMode
          ? (r > 150 || g > 150 || b > 150) && a > 100
          : (r < 200 || g < 200 || b < 200) && a > 100;
        if (isDrawingPixel) {
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
          hasDrawing = true;
        }
      }
    }

    if (!hasDrawing) return null;

    const padding = 20;
    minX = Math.max(0, minX - padding);
    minY = Math.max(0, minY - padding);
    maxX = Math.min(drawingWidth, maxX + padding);
    maxY = Math.min(drawingHeight, maxY + padding);
    const bw = maxX - minX,
      bh = maxY - minY;
    if (bw < 20 || bh < 20) return null;

    const scale = Math.min(
      (hiddenCanvas.width - 40) / bw,
      (hiddenCanvas.height - 40) / bh,
    );
    const cx = (hiddenCanvas.width - bw * scale) / 2;
    const cy = (hiddenCanvas.height - bh * scale) / 2;
    hiddenCtx.drawImage(
      drawingCanvas,
      minX,
      minY,
      bw,
      bh,
      cx,
      cy,
      bw * scale,
      bh * scale,
    );

    if (isDarkMode) {
      const hd = hiddenCtx.getImageData(
        0,
        0,
        hiddenCanvas.width,
        hiddenCanvas.height,
      );
      for (let i = 0; i < hd.data.length; i += 4) {
        hd.data[i] = 255 - hd.data[i];
        hd.data[i + 1] = 255 - hd.data[i + 1];
        hd.data[i + 2] = 255 - hd.data[i + 2];
      }
      hiddenCtx.putImageData(hd, 0, 0);
    }
    return hiddenCanvas;
  };

  const addExample = async (classId) => {
    if (!mobilenetModel || !classifier || !isDrawingModelLoaded) {
      setErrorMessage("Drawing recognition model not ready.");
      return;
    }
    const canvas = preprocessDrawing();
    if (!canvas) {
      setErrorMessage("Please draw something first.");
      return;
    }

    try {
      setIsTraining(true);
      const activation = mobilenetModel.infer(canvas, true);
      classifier.addExample(activation, classId);
      const counts = classifier.getClassExampleCount();
      setTrainingProgress(counts[classId] || 0);
      clearDrawing();
      const classCount = Object.keys(counts).length;
      const total = Object.values(counts).reduce((a, b) => a + b, 0);
      if (classCount >= 2 && total >= 2) setIsClassifierTrained(true);
    } catch (error) {
      setErrorMessage(`Error adding example: ${error.message}`);
    } finally {
      setIsTraining(false);
    }
  };

  const recognizeDrawing = async () => {
    if (!mobilenetModel || !classifier || !isDrawingModelLoaded) {
      setErrorMessage("Drawing recognition model not ready.");
      return;
    }
    if (!isClassifierTrained) {
      setErrorMessage("Please train the model with examples first.");
      setDrawingMode("train");
      return;
    }
    const canvas = preprocessDrawing();
    if (!canvas) {
      setErrorMessage("Please draw something to recognize.");
      return;
    }

    setIsRecognizing(true);
    setRecognitionResult(null);
    setErrorMessage("");

    try {
      const activation = mobilenetModel.infer(canvas, true);
      const result = await classifier.predictClass(activation);
      const category = drawingCategories.find((c) => c.id === result.label);
      setRecognitionResult({
        name: category ? category.name : result.label,
        confidence: Math.round((result.confidences[result.label] || 0) * 100),
        description: category ? category.description : "Custom drawing",
      });
    } catch (error) {
      setErrorMessage(`Error recognizing drawing: ${error.message}`);
    } finally {
      setIsRecognizing(false);
    }
  };

  const toggleDrawingMode = () => {
    const newMode = drawingMode === "draw" ? "train" : "draw";
    setDrawingMode(newMode);
    if (newMode === "train" && !selectedCategory)
      setSelectedCategory(drawingCategories[0]);
    else setSelectedCategory(null);
    setRecognitionResult(null);
    clearDrawing();
  };

  const handleTabChange = (tab) => {
    if (activeTab === "emotionAnalysis" && isDetecting) stopDetection();
    if (activeTab === "whiteboard") {
      setRecognitionResult(null);
      setSelectedCategory(null);
    }
    setActiveTab(tab);
    setErrorMessage("");
  };

  // ─── Derive dominant emotion ───────────────────────────────

  const dominantEmotion = faceResults?.expressions
    ? Object.entries(faceResults.expressions).reduce(
        (a, b) => (b[1] > a[1] ? b : a),
        ["neutral", 0],
      )
    : null;

  // ─── Render ────────────────────────────────────────────────

  return (
    <DemoContainer>
      <DemoHeader justify="space-between" align="center">
        <DemoTitle>AI Demonstrations</DemoTitle>
      </DemoHeader>

      <TabsContainer justify="center" gap="md">
        <TabButton
          onClick={() => handleTabChange("emotionAnalysis")}
          $active={activeTab === "emotionAnalysis"}
          $ready={isFaceModelLoaded}
          $loading={activeTab === "emotionAnalysis" && !isFaceModelLoaded}
        >
          Emotion Analysis
        </TabButton>
        <TabButton
          onClick={() => handleTabChange("whiteboard")}
          $active={activeTab === "whiteboard"}
          $ready={isDrawingModelLoaded}
          $loading={activeTab === "whiteboard" && !isDrawingModelLoaded}
        >
          Drawing Recognition
        </TabButton>
      </TabsContainer>

      {/* ─────────── EMOTION ANALYSIS TAB ─────────── */}
      {activeTab === "emotionAnalysis" && (
        <>
          <Text size="sm" margin="0 0 16px 0">
            Real-time facial emotion analysis powered by face-api.js. Detects
            faces, recognizes expressions, and estimates age &amp; gender — all
            running locally in your browser. No data is sent to any server.
          </Text>

          <StatusIndicator $active={isFaceModelLoaded}>
            <Activity
              size={14}
              style={{ marginRight: 8 }}
              color={
                isFaceModelLoaded ? theme.colors.success : theme.colors.danger
              }
            />
            Model Status:{" "}
            {isFaceModelLoaded
              ? "Loaded & Ready"
              : "Loading face detection models..."}
          </StatusIndicator>

          {errorMessage && (
            <Text color={theme.colors.danger} margin="0 0 16px 0">
              <AlertTriangle
                size={14}
                style={{ marginRight: 4, verticalAlign: "middle" }}
              />
              {errorMessage}
            </Text>
          )}

          {!isDetecting && isFaceModelLoaded && (
            <InfoCard>
              <InfoTitle size="md">
                <Info
                  size={18}
                  style={{ marginRight: 8, verticalAlign: "middle" }}
                />
                About Face Emotion Analysis
              </InfoTitle>
              <InfoContent>
                <Text size="sm">
                  This demo uses <strong>Tiny Face Detector</strong> for fast
                  face detection, combined with expression recognition and
                  age/gender estimation neural networks. It can detect 7
                  emotions:{" "}
                  <em>
                    happy, sad, angry, fearful, disgusted, surprised, and
                    neutral
                  </em>
                  . All inference runs on your device via WebGL acceleration.
                </Text>
                <Text
                  size="xs"
                  margin="16px 0 0 0"
                  color={theme.colors.secondary}
                >
                  <Camera
                    size={12}
                    style={{ marginRight: 4, verticalAlign: "middle" }}
                  />
                  Tip: For best results, ensure good lighting and face the
                  camera directly. The front-facing camera is used by default.
                </Text>
              </InfoContent>
            </InfoCard>
          )}

          <VideoContainer>
            <Video ref={videoRef} autoPlay playsInline muted />
            <Canvas ref={canvasRef} />
          </VideoContainer>

          <Controls gap="md" justify="center">
            {!isDetecting ? (
              <NeumorphicButton
                onClick={startDetection}
                disabled={!isFaceModelLoaded}
                $primary
              >
                <Camera size={18} style={{ marginRight: 8 }} />
                Start Emotion Analysis
              </NeumorphicButton>
            ) : (
              <NeumorphicButton onClick={stopDetection} $primary>
                <Square size={18} style={{ marginRight: 8 }} />
                Stop Camera
              </NeumorphicButton>
            )}
          </Controls>

          {isDetecting && (
            <PerformanceMetrics $isDarkMode={isDarkMode}>
              <SubHeading size="sm" margin="0 0 12px 0">
                <Activity
                  size={16}
                  style={{ marginRight: 8, verticalAlign: "middle" }}
                />
                Performance
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
                <MetricsLabel>Faces Detected:</MetricsLabel>
                <MetricsValue>{facesCount}</MetricsValue>
              </MetricsRow>
            </PerformanceMetrics>
          )}

          {faceResults && (
            <>
              {/* Dominant emotion badge */}
              {dominantEmotion && (
                <div style={{ textAlign: "center" }}>
                  <DominantEmotionBadge
                    $color={EMOTION_COLORS[dominantEmotion[0]]}
                  >
                    {(() => {
                      const Icon = EMOTION_ICONS[dominantEmotion[0]] || Meh;
                      return (
                        <Icon
                          size={24}
                          color={EMOTION_COLORS[dominantEmotion[0]]}
                        />
                      );
                    })()}
                    <span
                      style={{ textTransform: "capitalize", marginLeft: 8 }}
                    >
                      {dominantEmotion[0]} —{" "}
                      {Math.round(dominantEmotion[1] * 100)}%
                    </span>
                  </DominantEmotionBadge>
                </div>
              )}

              {/* Age & Gender info */}
              <FaceInfoCard>
                <FaceInfoItem>
                  <FaceInfoValue>~{Math.round(faceResults.age)}</FaceInfoValue>
                  <FaceInfoLabel>
                    <User
                      size={12}
                      style={{ marginRight: 4, verticalAlign: "middle" }}
                    />
                    Estimated Age
                  </FaceInfoLabel>
                </FaceInfoItem>
                <FaceInfoItem>
                  <FaceInfoValue style={{ textTransform: "capitalize" }}>
                    {faceResults.gender}
                  </FaceInfoValue>
                  <FaceInfoLabel>
                    <User
                      size={12}
                      style={{ marginRight: 4, verticalAlign: "middle" }}
                    />
                    Gender ({Math.round(faceResults.genderProbability * 100)}%
                    confidence)
                  </FaceInfoLabel>
                </FaceInfoItem>
                <FaceInfoItem>
                  <FaceInfoValue>{facesCount}</FaceInfoValue>
                  <FaceInfoLabel>
                    <Camera
                      size={12}
                      style={{ marginRight: 4, verticalAlign: "middle" }}
                    />
                    Face{facesCount !== 1 ? "s" : ""} Detected
                  </FaceInfoLabel>
                </FaceInfoItem>
              </FaceInfoCard>

              {/* Expression bars */}
              <EmotionBarContainer>
                <SubHeading size="sm" margin="16px 0 12px 0">
                  <Activity
                    size={16}
                    style={{ marginRight: 8, verticalAlign: "middle" }}
                  />
                  Expression Breakdown
                </SubHeading>
                {Object.entries(faceResults.expressions)
                  .sort((a, b) => b[1] - a[1])
                  .map(([emotion, value]) => {
                    const Icon = EMOTION_ICONS[emotion] || Meh;
                    return (
                      <EmotionRow key={emotion}>
                        <Icon
                          size={18}
                          color={EMOTION_COLORS[emotion]}
                          style={{ width: 24 }}
                        />
                        <EmotionLabel>{emotion}</EmotionLabel>
                        <EmotionBarTrack $isDarkMode={isDarkMode}>
                          <EmotionBarFill
                            $width={Math.round(value * 100)}
                            $color={EMOTION_COLORS[emotion]}
                          />
                        </EmotionBarTrack>
                        <EmotionPercent>
                          {Math.round(value * 100)}%
                        </EmotionPercent>
                      </EmotionRow>
                    );
                  })}
              </EmotionBarContainer>
            </>
          )}
        </>
      )}

      {/* ─────────── DRAWING RECOGNITION TAB ────────── */}
      {activeTab === "whiteboard" && (
        <>
          <Text size="sm" margin="0 0 16px 0">
            {drawingMode === "draw"
              ? "Draw a shape on the canvas and the trained AI model will try to recognize it."
              : "Draw examples of different shapes to train the AI. Select a category and add examples."}
          </Text>

          <StatusIndicator $active={isDrawingModelLoaded}>
            <Activity
              size={14}
              style={{ marginRight: 8 }}
              color={
                isDrawingModelLoaded
                  ? theme.colors.success
                  : theme.colors.danger
              }
            />
            Model Status:{" "}
            {isDrawingModelLoaded
              ? isClassifierTrained
                ? "Trained and ready"
                : "Loaded (needs training)"
              : "Loading TensorFlow models..."}
          </StatusIndicator>

          {errorMessage && (
            <Text color={theme.colors.danger} margin="0 0 16px 0">
              <AlertTriangle
                size={14}
                style={{ marginRight: 4, verticalAlign: "middle" }}
              />
              {errorMessage}
            </Text>
          )}

          <DrawingTools align="center" justify="space-between">
            <FlexContainer gap="xs" align="center">
              <Text size="sm" margin="0 8px 0 0">
                Brush Color:
              </Text>
              {colors.map((color) => (
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
              {brushSizes.map((size) => (
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
              <Eraser size={18} style={{ marginRight: 8 }} />
              Clear Canvas
            </ClearButton>
            {drawingMode === "draw" ? (
              <>
                <NeumorphicButton
                  onClick={recognizeDrawing}
                  disabled={isRecognizing || !isClassifierTrained}
                  $primary
                >
                  <Search size={18} style={{ marginRight: 8 }} />
                  {isRecognizing ? "Analyzing..." : "Recognize Drawing"}
                </NeumorphicButton>
                <NeumorphicButton onClick={toggleDrawingMode}>
                  <GraduationCap size={18} style={{ marginRight: 8 }} />
                  Switch to Training Mode
                </NeumorphicButton>
              </>
            ) : (
              <>
                <NeumorphicButton
                  onClick={() =>
                    selectedCategory && addExample(selectedCategory.id)
                  }
                  disabled={
                    !selectedCategory || !isDrawingModelLoaded || isTraining
                  }
                  $primary
                >
                  <Plus size={18} style={{ marginRight: 8 }} />
                  {isTraining ? "Adding Example..." : "Add Example"}
                </NeumorphicButton>
                <NeumorphicButton onClick={toggleDrawingMode}>
                  <Brush size={18} style={{ marginRight: 8 }} />
                  Switch to Recognition Mode
                </NeumorphicButton>
              </>
            )}
          </Controls>

          {drawingMode === "train" && (
            <TrainingContainer $isDarkMode={isDarkMode}>
              <SubHeading size="md" margin="0 0 16px 0">
                <GraduationCap
                  size={20}
                  style={{ marginRight: 8, verticalAlign: "middle" }}
                />
                Training Mode
              </SubHeading>
              <Text size="sm" margin="0 0 16px 0">
                Select a category, draw an example, then click "Add Example".
                Add multiple examples per category for better recognition.
              </Text>
              <CategoryGrid>
                {drawingCategories.map((category) => {
                  const exampleCount =
                    (classifier &&
                      classifier.getClassExampleCount()[category.id]) ||
                    0;
                  const CategoryIcon = category.icon;
                  return (
                    <CategoryCard
                      key={category.id}
                      isSelected={
                        selectedCategory && selectedCategory.id === category.id
                      }
                      theme={theme}
                      onClick={() => setSelectedCategory(category)}
                    >
                      <CategoryIcon
                        size={24}
                        color={theme.colors.primary}
                        style={{ marginBottom: 8 }}
                      />
                      <CategoryName>{category.name}</CategoryName>
                      <ExampleCount>
                        {exampleCount} example{exampleCount !== 1 ? "s" : ""}
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
                  <RotateCcw size={18} style={{ marginRight: 8 }} />
                  Reset Training
                </NeumorphicButton>

                <NeumorphicButton
                  onClick={() => {
                    if (classifier) {
                      const dataset = classifier.getClassifierDataset();
                      const obj = {};
                      Object.keys(dataset).forEach((key) => {
                        obj[key] = Array.from(dataset[key].dataSync());
                      });
                      const blob = new Blob([JSON.stringify(obj)], {
                        type: "application/json",
                      });
                      const a = document.createElement("a");
                      a.download = "drawing-model.json";
                      a.href = URL.createObjectURL(blob);
                      a.click();
                    }
                  }}
                  disabled={!isClassifierTrained}
                >
                  <Download size={18} style={{ marginRight: 8 }} />
                  Export Model
                </NeumorphicButton>

                <label htmlFor="upload-model">
                  <input
                    id="upload-model"
                    type="file"
                    accept=".json"
                    style={{ display: "none" }}
                    onChange={async (e) => {
                      try {
                        const file = e.target.files[0];
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const datasetObj = JSON.parse(event.target.result);
                          const newClassifier = knnClassifier.create();
                          Object.keys(datasetObj).forEach((key) => {
                            newClassifier.addExample(
                              tf.tensor(datasetObj[key]),
                              key,
                            );
                          });
                          setClassifier(newClassifier);
                          setIsClassifierTrained(true);
                          setTrainingProgress(
                            Object.values(
                              newClassifier.getClassExampleCount(),
                            ).reduce((a, b) => a + b, 0),
                          );
                        };
                        reader.readAsText(file);
                      } catch (error) {
                        setErrorMessage(
                          `Failed to load the model file. ${error}`,
                        );
                      }
                    }}
                  />
                  <NeumorphicButton as="span">
                    <Upload size={18} style={{ marginRight: 8 }} />
                    Import Model
                  </NeumorphicButton>
                </label>
              </ModelControls>
            </TrainingContainer>
          )}

          {drawingMode === "draw" && !isClassifierTrained && (
            <RecognitionResult visible theme={theme}>
              <Text size="sm" margin="16px 0 0 0">
                The model needs to be trained before it can recognize drawings.
                Switch to Training Mode and add examples for different
                categories.
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
                <Search
                  size={20}
                  style={{ marginRight: 8, verticalAlign: "middle" }}
                />
                Recognition Result
              </SubHeading>
              <Text size="lg" color={theme.colors.primary} margin="0 0 8px 0">
                {recognitionResult.name} ({recognitionResult.confidence}%
                confidence)
              </Text>
              <Text size="sm">{recognitionResult.description}</Text>
            </RecognitionResult>
          )}
        </>
      )}
    </DemoContainer>
  );
};

export default AIDemo;
