import { useState, useEffect, useRef, type ChangeEvent } from "react";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as knnClassifier from "@tensorflow-models/knn-classifier";
import {
  Search,
  GraduationCap,
  Plus,
  RotateCcw,
  Download,
  Upload,
  Activity,
  AlertTriangle,
  Brush,
  Eraser,
  Heart,
  Circle,
  Square as SquareIcon,
  Triangle,
  Star,
  Home as HomeIcon,
  Trees,
  type LucideIcon,
} from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import {
  NeumorphicButton,
  StatusIndicator,
  Controls,
  Text,
  SubHeading,
  Spinner,
} from "./shared";
import type { ReactNode } from "react";

/* ── Drawing categories ────────────────────────────────────── */

interface DrawingCategory {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
}

const DRAWING_CATEGORIES: DrawingCategory[] = [
  { id: "star", name: "Star", icon: Star, description: "A classic 5-point star" },
  { id: "heart", name: "Heart", icon: Heart, description: "A symbol of love" },
  { id: "tree", name: "Tree", icon: Trees, description: "A simple tree drawing" },
  { id: "house", name: "House", icon: HomeIcon, description: "A basic house structure" },
  { id: "circle", name: "Circle", icon: Circle, description: "A perfectly round shape" },
  { id: "square", name: "Square", icon: SquareIcon, description: "A four-sided shape" },
  { id: "triangle", name: "Triangle", icon: Triangle, description: "A three-sided shape" },
];

const COLORS = ["#000000", "#FF0000", "#00FF00", "#0000FF", "#FFA500", "#800080"];
const BRUSH_SIZES = [3, 5, 8, 12];

// Module-level cache so MobileNet survives tab switches / remounts.
let mobilenetPromise: Promise<mobilenet.MobileNet> | null = null;

const loadMobilenet = () => {
  mobilenetPromise ??= tf
    .ready()
    .then(() => mobilenet.load())
    .catch((error) => {
      mobilenetPromise = null; // allow retry on next mount
      throw error;
    });
  return mobilenetPromise;
};

/* ── Local UI pieces ───────────────────────────────────────── */

const RecognitionResultCard = ({ children }: { children: ReactNode }) => (
  <div className="mt-4 p-4 text-center bg-card rounded-2xl shadow-neumorphic transition-all duration-300 translate-y-0 opacity-100">
    {children}
  </div>
);

/* ── Component ─────────────────────────────────────────────── */

interface RecognitionResult {
  name: string;
  confidence: number;
  description: string;
}

interface DrawingRecognitionDemoProps {
  active: boolean;
  onReadyChange: (ready: boolean) => void;
}

const DrawingRecognitionDemo = ({
  active,
  onReadyChange,
}: DrawingRecognitionDemoProps) => {
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [mobilenetModel, setMobilenetModel] =
    useState<mobilenet.MobileNet | null>(null);
  const [classifier, setClassifier] =
    useState<knnClassifier.KNNClassifier | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isClassifierTrained, setIsClassifierTrained] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [selectedCategory, setSelectedCategory] =
    useState<DrawingCategory | null>(null);
  const [recognitionResult, setRecognitionResult] =
    useState<RecognitionResult | null>(null);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [drawingMode, setDrawingMode] = useState<"draw" | "train">("draw");
  const [errorMessage, setErrorMessage] = useState("");
  const [drawingColor, setDrawingColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);

  const { theme, isDarkMode } = useTheme();

  /* ── Load MobileNet + KNN classifier ─────────────────────── */

  useEffect(() => {
    let cancelled = false;
    loadMobilenet()
      .then((model) => {
        if (cancelled) return;
        setMobilenetModel(model);
        setClassifier(knnClassifier.create());
        setIsModelLoaded(true);
        onReadyChange(true);
      })
      .catch((error: Error) => {
        console.error("Error loading drawing recognition models:", error);
        if (!cancelled) {
          setErrorMessage(
            `Failed to load drawing recognition models: ${error.message}`,
          );
        }
      });
    return () => {
      cancelled = true;
    };
    // onReadyChange is a stable setter from the parent
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Hidden canvas for preprocessing ─────────────────────── */

  useEffect(() => {
    if (!hiddenCanvasRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = 224;
      canvas.height = 224;
      canvas.style.display = "none";
      hiddenCanvasRef.current = canvas;
      document.body.appendChild(canvas);
    }
    return () => {
      if (
        hiddenCanvasRef.current &&
        document.body.contains(hiddenCanvasRef.current)
      ) {
        document.body.removeChild(hiddenCanvasRef.current);
        hiddenCanvasRef.current = null;
      }
    };
  }, []);

  /* ── Drawing canvas setup ────────────────────────────────── */

  useEffect(() => {
    const canvas = drawingCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const resizeCanvas = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
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
  }, [brushSize, drawingColor, isDarkMode]);

  /* ── Pointer drawing handlers ────────────────────────────── */

  useEffect(() => {
    const canvas = drawingCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    const getCoordinates = (event: MouseEvent | TouchEvent) => {
      if (event.type.includes("mouse")) {
        const e = event as MouseEvent;
        return { offsetX: e.offsetX, offsetY: e.offsetY };
      }
      const rect = canvas.getBoundingClientRect();
      const touch = (event as TouchEvent).touches[0];
      return {
        offsetX: touch.clientX - rect.left,
        offsetY: touch.clientY - rect.top,
      };
    };

    const startDrawing = (e: MouseEvent | TouchEvent) => {
      isDrawing = true;
      const { offsetX, offsetY } = getCoordinates(e);
      lastX = offsetX;
      lastY = offsetY;
    };

    const draw = (e: MouseEvent | TouchEvent) => {
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

    const touchStart = (e: TouchEvent) => {
      e.preventDefault();
      startDrawing(e);
    };
    const touchMove = (e: TouchEvent) => {
      e.preventDefault();
      draw(e);
    };
    const touchEnd = (e: TouchEvent) => {
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
  }, [drawingColor, brushSize]);

  // Reset transient state when the user switches away from this tab
  useEffect(() => {
    if (!active) {
      setRecognitionResult(null);
      setSelectedCategory(null);
      setErrorMessage("");
    }
  }, [active]);

  /* ── Canvas helpers ──────────────────────────────────────── */

  const clearDrawing = () => {
    const canvas = drawingCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = isDarkMode ? "#1e2335" : "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setRecognitionResult(null);
  };

  const preprocessDrawing = (): HTMLCanvasElement | null => {
    const drawingCanvas = drawingCanvasRef.current;
    const hiddenCanvas = hiddenCanvasRef.current;
    if (!drawingCanvas || !hiddenCanvas) return null;
    const hiddenCtx = hiddenCanvas.getContext("2d")!;
    const drawingWidth = drawingCanvas.width;
    const drawingHeight = drawingCanvas.height;

    hiddenCtx.fillStyle = "white";
    hiddenCtx.fillRect(0, 0, hiddenCanvas.width, hiddenCanvas.height);

    const imageData = drawingCanvas
      .getContext("2d")!
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

  /* ── Training & recognition ──────────────────────────────── */

  const addExample = async (classId: string) => {
    if (!mobilenetModel || !classifier || !isModelLoaded) {
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
      setErrorMessage(`Error adding example: ${(error as Error).message}`);
    } finally {
      setIsTraining(false);
    }
  };

  const recognizeDrawing = async () => {
    if (!mobilenetModel || !classifier || !isModelLoaded) {
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
      const category = DRAWING_CATEGORIES.find((c) => c.id === result.label);
      setRecognitionResult({
        name: category ? category.name : result.label,
        confidence: Math.round((result.confidences[result.label] || 0) * 100),
        description: category ? category.description : "Custom drawing",
      });
    } catch (error) {
      setErrorMessage(
        `Error recognizing drawing: ${(error as Error).message}`,
      );
    } finally {
      setIsRecognizing(false);
    }
  };

  const toggleDrawingMode = () => {
    const newMode = drawingMode === "draw" ? "train" : "draw";
    setDrawingMode(newMode);
    if (newMode === "train" && !selectedCategory)
      setSelectedCategory(DRAWING_CATEGORIES[0]);
    else setSelectedCategory(null);
    setRecognitionResult(null);
    clearDrawing();
  };

  const importModel = (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const datasetObj = JSON.parse(event.target?.result as string);
        const newClassifier = knnClassifier.create();
        Object.keys(datasetObj).forEach((key) => {
          newClassifier.addExample(tf.tensor(datasetObj[key]), key);
        });
        setClassifier(newClassifier);
        setIsClassifierTrained(true);
        setTrainingProgress(
          Object.values(newClassifier.getClassExampleCount()).reduce(
            (a, b) => a + b,
            0,
          ),
        );
      };
      reader.readAsText(file);
    } catch (error) {
      setErrorMessage(`Failed to load the model file. ${error}`);
    }
  };

  const exportModel = () => {
    if (!classifier) return;
    const dataset = classifier.getClassifierDataset();
    const obj: Record<string, number[]> = {};
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
  };

  /* ── Render ──────────────────────────────────────────────── */

  return (
    <>
      <Text size="sm" margin="0 0 16px 0">
        {drawingMode === "draw"
          ? "Draw a shape on the canvas and the trained AI model will try to recognize it."
          : "Draw examples of different shapes to train the AI. Select a category and add examples."}
      </Text>

      <StatusIndicator active={isModelLoaded}>
        <Activity
          size={14}
          style={{ marginRight: 8 }}
          color={isModelLoaded ? theme.colors.success : theme.colors.danger}
        />
        Model Status:{" "}
        {isModelLoaded
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

      {!isModelLoaded && !errorMessage && (
        <div className="my-8 text-center">
          <Spinner />
          <Text size="sm" center margin="12px 0 0 0">
            Loading drawing recognition models...
          </Text>
        </div>
      )}

      <div className="flex flex-wrap mb-4 justify-between items-center sm:justify-center">
        <div className="flex items-center gap-1">
          <Text size="sm" margin="0 8px 0 0">
            Brush Color:
          </Text>
          {COLORS.map((color) => (
            <button
              key={color}
              className={`w-8 h-8 rounded-full border-2 mr-2 cursor-pointer transition-transform hover:scale-110 ${drawingColor === color ? "border-primary" : "border-transparent"}`}
              style={{ backgroundColor: color }}
              onClick={() => setDrawingColor(color)}
              title={color}
            />
          ))}
        </div>
        <div className="flex items-center gap-1">
          <Text size="sm">Brush Size:</Text>
          {BRUSH_SIZES.map((size) => (
            <button
              key={size}
              className={`rounded-full border-2 ml-2 cursor-pointer transition-transform hover:scale-110 flex items-center justify-center ${brushSize === size ? "border-primary" : isDarkMode ? "border-[#3a4556]" : "border-[#c5cfe0]"}`}
              style={{
                width: size * 2,
                height: size * 2,
                backgroundColor: isDarkMode ? "white" : "black",
              }}
              onClick={() => setBrushSize(size)}
              title={`${size}px`}
            />
          ))}
        </div>
      </div>

      <div
        className={`relative w-full rounded-lg overflow-hidden shadow-inner my-4 ${isDarkMode ? "bg-[#1e2335]" : "bg-white"}`}
      >
        <canvas
          ref={drawingCanvasRef}
          className="w-full h-[300px] block cursor-crosshair"
        />
      </div>

      <Controls>
        <NeumorphicButton onClick={clearDrawing} className="mr-4">
          <Eraser size={18} style={{ marginRight: 8 }} />
          Clear Canvas
        </NeumorphicButton>
        {drawingMode === "draw" ? (
          <>
            <NeumorphicButton
              onClick={recognizeDrawing}
              disabled={isRecognizing || !isClassifierTrained}
              primary
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
              onClick={() => selectedCategory && addExample(selectedCategory.id)}
              disabled={!selectedCategory || !isModelLoaded || isTraining}
              primary
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
        <div
          className={`flex flex-col mt-4 rounded-lg p-4 ${isDarkMode ? "bg-white/10" : "bg-black/5"}`}
        >
          <SubHeading size="md" margin="0 0 16px 0">
            <GraduationCap
              size={20}
              style={{ marginRight: 8, verticalAlign: "middle" }}
            />
            Training Mode
          </SubHeading>
          <Text size="sm" margin="0 0 16px 0">
            Select a category, draw an example, then click "Add Example". Add
            multiple examples per category for better recognition.
          </Text>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4 my-4">
            {DRAWING_CATEGORIES.map((category) => {
              const exampleCount =
                (classifier &&
                  classifier.getClassExampleCount()[category.id]) ||
                0;
              const CategoryIcon = category.icon;
              return (
                <div
                  key={category.id}
                  className={`
                    p-4 rounded-lg bg-card transition-all duration-200 cursor-pointer text-center hover:-translate-y-0.5
                    ${selectedCategory?.id === category.id ? "ring-2 ring-primary shadow-md" : "shadow-sm"}
                  `}
                  onClick={() => setSelectedCategory(category)}
                >
                  <CategoryIcon
                    size={24}
                    color={theme.colors.primary}
                    style={{ marginBottom: 8 }}
                  />
                  <div className="font-semibold mb-1 text-text">
                    {category.name}
                  </div>
                  <div className="text-xs text-secondary">
                    {exampleCount} example{exampleCount !== 1 ? "s" : ""}
                  </div>
                </div>
              );
            })}
          </div>

          {isClassifierTrained && (
            <div
              className={`w-full h-2 rounded-full my-4 overflow-hidden ${isDarkMode ? "bg-white/10" : "bg-black/10"}`}
            >
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${Math.min(100, trainingProgress * 10)}%` }}
              />
            </div>
          )}

          <div className="flex mt-4 justify-between">
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

            <NeumorphicButton onClick={exportModel} disabled={!isClassifierTrained}>
              <Download size={18} style={{ marginRight: 8 }} />
              Export Model
            </NeumorphicButton>

            <label htmlFor="upload-model">
              <input
                id="upload-model"
                type="file"
                accept=".json"
                style={{ display: "none" }}
                onChange={importModel}
              />
              <NeumorphicButton as="span">
                <Upload size={18} style={{ marginRight: 8 }} />
                Import Model
              </NeumorphicButton>
            </label>
          </div>
        </div>
      )}

      {drawingMode === "draw" && !isClassifierTrained && (
        <RecognitionResultCard>
          <Text size="sm" margin="16px 0 0 0">
            The model needs to be trained before it can recognize drawings.
            Switch to Training Mode and add examples for different categories.
          </Text>
          <NeumorphicButton onClick={toggleDrawingMode}>
            Start Training
          </NeumorphicButton>
        </RecognitionResultCard>
      )}

      {isRecognizing && (
        <RecognitionResultCard>
          <Spinner />
          <Text size="sm" margin="16px 0 0 0">
            Analyzing your drawing...
          </Text>
        </RecognitionResultCard>
      )}

      {recognitionResult && !isRecognizing && (
        <RecognitionResultCard>
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
        </RecognitionResultCard>
      )}
    </>
  );
};

export default DrawingRecognitionDemo;
