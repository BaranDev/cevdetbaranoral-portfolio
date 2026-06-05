import {
  Brain,
  Camera,
  Pencil,
  Lock,
  Cpu,
  Code2,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import AIDemo from "../components/interactive/ai-demo/AIDemo";

interface AboutItem {
  icon: LucideIcon;
  title: string;
  content: ReactNode;
}

const ABOUT_ITEMS: AboutItem[] = [
  {
    icon: Brain,
    title: "Browser-Based AI",
    content: (
      <p className="text-sm text-text/80 leading-relaxed">
        These demos showcase TensorFlow.js and face-api.js with real-time
        facial emotion analysis and interactive drawing recognition. All
        processing happens locally in your browser, demonstrating privacy-first
        machine learning approaches.
      </p>
    ),
  },
  {
    icon: Camera,
    title: "Emotion Analysis",
    content: (
      <p className="text-sm text-text/80 leading-relaxed">
        The emotion analysis demo uses face-api.js with the Tiny Face Detector
        for fast face detection, combined with expression recognition and
        age/gender estimation neural networks. It can detect 7 emotions in
        real-time: happy, sad, angry, fearful, disgusted, surprised, and
        neutral.
      </p>
    ),
  },
  {
    icon: Pencil,
    title: "Drawing Recognition",
    content: (
      <p className="text-sm text-text/80 leading-relaxed">
        The drawing recognition component demonstrates the concept of sketch
        recognition. In a full implementation, it would use a model like
        SketchRNN or a CNN trained on the Quick Draw dataset to recognize
        hand-drawn sketches in real-time.
      </p>
    ),
  },
  {
    icon: Lock,
    title: "Privacy-First Machine Learning",
    content: (
      <p className="text-sm text-text/80 leading-relaxed">
        All processing happens locally in your browser - your camera feed and
        drawings never leave your device. This is a powerful example of how
        modern web technologies can deliver AI capabilities while preserving
        user privacy.
      </p>
    ),
  },
  {
    icon: Cpu,
    title: "Real-Time Performance",
    content: (
      <p className="text-sm text-text/80 leading-relaxed">
        Experience the power of browser-based AI with real-time inference. The
        demos are optimized for performance, showcasing how machine learning
        models can run efficiently on consumer hardware without cloud
        dependencies.
      </p>
    ),
  },
  {
    icon: Code2,
    title: "Technical Implementation",
    content: (
      <>
        <p className="text-sm text-text/80 leading-relaxed mb-2">
          These demos showcase several advanced technical capabilities:
        </p>
        <ul className="text-sm text-text/80 list-disc pl-5 leading-relaxed">
          <li>Integration of TensorFlow.js for in-browser machine learning</li>
          <li>
            Real-time video processing using the browser's MediaDevices API
          </li>
          <li>Canvas manipulation for drawing tools and visualization</li>
          <li>Reactive UI that adapts to theme changes</li>
          <li>Performance optimization for real-time inference</li>
          <li>WebGL acceleration for neural network computations</li>
        </ul>
      </>
    ),
  },
];

const AIDemosPage = () => {
  return (
    <div className="py-12">
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-text font-heading">
          AI & Machine Learning{" "}
          <span className="text-primary">Demonstrations</span>
        </h1>
        <p className="text-lg text-text/80 max-w-[800px] mx-auto leading-relaxed">
          Explore interactive AI demos powered by TensorFlow.js and face-api.js,
          running directly in your browser without any server-side processing.
        </p>
      </section>

      {/* AI Demonstrations Section */}
      <section>
        <AIDemo />
      </section>

      <section>
        <div className="p-8 mt-12 bg-card rounded-2xl shadow-neumorphic">
          <h2 className="text-2xl font-semibold mb-6 text-text font-heading">
            About These AI Demonstrations
          </h2>

          {ABOUT_ITEMS.map((item) => (
            <div
              key={item.title}
              className="flex flex-col md:flex-row items-start mb-8 gap-4"
            >
              <div className="w-[50px] h-[50px] min-w-[50px] rounded-full bg-primary text-white flex items-center justify-center shadow-sm shrink-0">
                <item.icon size={24} />
              </div>
              <div className="flex-1">
                <p className="font-semibold mb-2 text-text">{item.title}</p>
                {item.content}
              </div>
            </div>
          ))}

          <p className="text-center mt-6 text-sm text-secondary">
            Note: For the best experience, please use a modern browser and allow
            camera access when prompted. The TensorFlow.js models may take a few
            moments to load on slower connections.
          </p>
        </div>
      </section>
    </div>
  );
};

export default AIDemosPage;
