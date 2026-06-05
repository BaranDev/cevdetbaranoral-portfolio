import { useState, useEffect, useRef } from "react";
import * as faceapi from "@vladmandic/face-api";
import {
  Smile,
  Meh,
  Frown,
  Angry,
  Ghost,
  Skull,
  Zap,
  Square,
  Camera,
  Activity,
  Info,
  AlertTriangle,
  User,
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

/* ── Emotion metadata ──────────────────────────────────────── */

const EMOTION_ICONS: Record<string, LucideIcon> = {
  neutral: Meh,
  happy: Smile,
  sad: Frown,
  angry: Angry,
  fearful: Ghost,
  disgusted: Skull,
  surprised: Zap,
};

const EMOTION_COLORS: Record<string, string> = {
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

// Module-level cache so models survive tab switches / remounts.
let faceModelsPromise: Promise<unknown> | null = null;

const loadFaceModels = () => {
  faceModelsPromise ??= Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
  ]).catch((error) => {
    faceModelsPromise = null; // allow retry on next mount
    throw error;
  });
  return faceModelsPromise;
};

/* ── Local UI pieces ───────────────────────────────────────── */

const VideoContainer = ({ children }: { children: ReactNode }) => (
  <div className="relative w-full h-0 pb-[56.25%] rounded-lg overflow-hidden shadow-inner mb-4 bg-black/5">
    {children}
  </div>
);

const PerformanceMetricRow = ({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) => (
  <div className="flex mb-1 last:mb-0">
    <div className="font-medium min-w-[160px] text-text">{label}</div>
    <div className="text-primary font-mono">{value}</div>
  </div>
);

const FaceInfoItem = ({
  value,
  capitalize = false,
  children,
}: {
  value: ReactNode;
  capitalize?: boolean;
  children: ReactNode;
}) => (
  <div className="flex-1 min-w-[120px] text-center">
    <div
      className="text-2xl font-bold text-primary"
      style={capitalize ? { textTransform: "capitalize" } : undefined}
    >
      {value}
    </div>
    <div className="text-xs text-secondary mt-1 flex items-center justify-center gap-1">
      {children}
    </div>
  </div>
);

/* ── Component ─────────────────────────────────────────────── */

interface FaceResults {
  expressions: Record<string, number>;
  age: number;
  gender: string;
  genderProbability: number;
}

interface EmotionAnalysisDemoProps {
  active: boolean;
  onReadyChange: (ready: boolean) => void;
}

const EmotionAnalysisDemo = ({
  active,
  onReadyChange,
}: EmotionAnalysisDemoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDetectingRef = useRef(false);
  const animFrameRef = useRef<number | null>(null);

  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [faceResults, setFaceResults] = useState<FaceResults | null>(null);
  const [facesCount, setFacesCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [fps, setFps] = useState(0);
  const [inferenceTime, setInferenceTime] = useState(0);

  const { theme, isDarkMode } = useTheme();

  /* ── Load face-api.js models ─────────────────────────────── */

  useEffect(() => {
    let cancelled = false;
    setErrorMessage("");
    loadFaceModels()
      .then(() => {
        if (cancelled) return;
        setIsModelLoaded(true);
        onReadyChange(true);
      })
      .catch((error: Error) => {
        console.error("Error loading face-api models:", error);
        if (!cancelled) {
          setErrorMessage(
            `Failed to load emotion analysis models: ${error.message}`,
          );
        }
      });
    return () => {
      cancelled = true;
    };
    // onReadyChange is a stable setter from the parent
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Webcam setup ────────────────────────────────────────── */

  const setupWebcam = async (): Promise<MediaStream | null> => {
    const video = videoRef.current;
    if (!video) return null;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });
      video.srcObject = stream;
      return new Promise((resolve) => {
        video.onloadedmetadata = () => resolve(stream);
      });
    } catch (error) {
      console.error("Error accessing webcam:", error);
      setErrorMessage(
        "Could not access your camera. Please grant camera permissions.",
      );
      return null;
    }
  };

  /* ── Detection loop ──────────────────────────────────────── */

  const startDetection = async () => {
    if (!isModelLoaded) {
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

        const ctx = canvas.getContext("2d")!;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw custom overlays
        resized.forEach((det) => {
          const { x, y, width, height } = det.detection.box;

          // Determine dominant expression
          const expressions = det.expressions as unknown as Record<
            string,
            number
          >;
          let dominant = "neutral";
          let maxVal = 0;
          Object.entries(expressions).forEach(([expr, val]) => {
            if (typeof val === "number" && val > maxVal) {
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
            expressions: best.expressions as unknown as Record<string, number>,
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

  const stopDetection = () => {
    isDetectingRef.current = false;
    setIsDetecting(false);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    const video = videoRef.current;
    if (video?.srcObject) {
      (video.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      video.srcObject = null;
    }
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height);
    }
    setFaceResults(null);
    setFacesCount(0);
    setFps(0);
    setInferenceTime(0);
  };

  // Stop the camera when the user switches away from this tab
  useEffect(() => {
    if (!active && isDetectingRef.current) {
      stopDetection();
      setErrorMessage("");
    }
  }, [active]);

  /* ── Derive dominant emotion ─────────────────────────────── */

  const dominantEmotion = faceResults?.expressions
    ? Object.entries(faceResults.expressions).reduce<[string, number]>(
        (a, b) => (b[1] > a[1] ? b : a),
        ["neutral", 0],
      )
    : null;

  /* ── Render ──────────────────────────────────────────────── */

  return (
    <>
      <Text size="sm" margin="0 0 16px 0">
        Real-time facial emotion analysis powered by face-api.js. Detects
        faces, recognizes expressions, and estimates age &amp; gender, all
        running locally in your browser. No data is sent to any server.
      </Text>

      <StatusIndicator active={isModelLoaded}>
        <Activity
          size={14}
          style={{ marginRight: 8 }}
          color={isModelLoaded ? theme.colors.success : theme.colors.danger}
        />
        Model Status:{" "}
        {isModelLoaded ? "Loaded & Ready" : "Loading face detection models..."}
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
            Loading emotion analysis models...
          </Text>
        </div>
      )}

      {!isDetecting && isModelLoaded && (
        <div className="mt-4 p-4 bg-card rounded-2xl shadow-neumorphic">
          <h3 className="font-semibold mt-0 text-lg">
            <Info
              size={18}
              style={{ marginRight: 8, verticalAlign: "middle" }}
            />
            About Face Emotion Analysis
          </h3>
          <div className="mt-4">
            <Text size="sm">
              This demo uses <strong>Tiny Face Detector</strong> for fast face
              detection, combined with expression recognition and age/gender
              estimation neural networks. It can detect 7 emotions:{" "}
              <em>
                happy, sad, angry, fearful, disgusted, surprised, and neutral
              </em>
              . All inference runs on your device via WebGL acceleration.
            </Text>
            <Text size="xs" margin="16px 0 0 0" color={theme.colors.secondary}>
              <Camera
                size={12}
                style={{ marginRight: 4, verticalAlign: "middle" }}
              />
              Tip: For best results, ensure good lighting and face the camera
              directly. The front-facing camera is used by default.
            </Text>
          </div>
        </div>
      )}

      <VideoContainer>
        <video
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          playsInline
          muted
        />
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
      </VideoContainer>

      <Controls>
        {!isDetecting ? (
          <NeumorphicButton
            onClick={startDetection}
            disabled={!isModelLoaded}
            primary
          >
            <Camera size={18} style={{ marginRight: 8 }} />
            Start Emotion Analysis
          </NeumorphicButton>
        ) : (
          <NeumorphicButton onClick={stopDetection} primary>
            <Square size={18} style={{ marginRight: 8 }} />
            Stop Camera
          </NeumorphicButton>
        )}
      </Controls>

      {isDetecting && (
        <div
          className={`mt-4 p-4 text-sm rounded-lg ${isDarkMode ? "bg-white/5" : "bg-black/5"}`}
        >
          <SubHeading size="sm" margin="0 0 12px 0">
            <Activity
              size={16}
              style={{ marginRight: 8, verticalAlign: "middle" }}
            />
            Performance
          </SubHeading>
          <PerformanceMetricRow label="FPS:" value={fps} />
          <PerformanceMetricRow
            label="Inference Time:"
            value={`${inferenceTime} ms`}
          />
          <PerformanceMetricRow label="Faces Detected:" value={facesCount} />
        </div>
      )}

      {faceResults && (
        <>
          {/* Dominant emotion badge */}
          {dominantEmotion && (
            <div style={{ textAlign: "center" }}>
              <div
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full mt-4 text-lg font-semibold"
                style={{
                  backgroundColor: `${EMOTION_COLORS[dominantEmotion[0]]}22`,
                  border: `1px solid ${EMOTION_COLORS[dominantEmotion[0]]}44`,
                }}
              >
                {(() => {
                  const Icon = EMOTION_ICONS[dominantEmotion[0]] || Meh;
                  return (
                    <Icon size={24} color={EMOTION_COLORS[dominantEmotion[0]]} />
                  );
                })()}
                <span style={{ textTransform: "capitalize", marginLeft: 8 }}>
                  {dominantEmotion[0]} - {Math.round(dominantEmotion[1] * 100)}%
                </span>
              </div>
            </div>
          )}

          {/* Age & Gender info */}
          <div className="p-4 mt-4 flex flex-wrap gap-4 bg-card rounded-2xl shadow-neumorphic">
            <FaceInfoItem value={`~${Math.round(faceResults.age)}`}>
              <User
                size={12}
                style={{ marginRight: 4, verticalAlign: "middle" }}
              />
              Estimated Age
            </FaceInfoItem>
            <FaceInfoItem value={faceResults.gender} capitalize>
              <User
                size={12}
                style={{ marginRight: 4, verticalAlign: "middle" }}
              />
              Gender ({Math.round(faceResults.genderProbability * 100)}%
              confidence)
            </FaceInfoItem>
            <FaceInfoItem value={facesCount}>
              <Camera
                size={12}
                style={{ marginRight: 4, verticalAlign: "middle" }}
              />
              Face{facesCount !== 1 ? "s" : ""} Detected
            </FaceInfoItem>
          </div>

          {/* Expression bars */}
          <div className="mt-4">
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
                  <div key={emotion} className="flex items-center mb-1.5 gap-2">
                    <Icon
                      size={18}
                      color={EMOTION_COLORS[emotion]}
                      style={{ width: 24 }}
                    />
                    <span className="min-w-[100px] text-sm font-medium capitalize text-text">
                      {emotion}
                    </span>
                    <div
                      className={`flex-1 h-3.5 rounded-full overflow-hidden relative ${isDarkMode ? "bg-white/10" : "bg-black/5"}`}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.round(value * 100)}%`,
                          backgroundColor: EMOTION_COLORS[emotion],
                        }}
                      />
                    </div>
                    <span className="min-w-[44px] text-right text-xs font-semibold text-primary">
                      {Math.round(value * 100)}%
                    </span>
                  </div>
                );
              })}
          </div>
        </>
      )}
    </>
  );
};

export default EmotionAnalysisDemo;
