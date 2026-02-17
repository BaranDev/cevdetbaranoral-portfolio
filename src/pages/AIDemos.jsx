import React from "react";
import AIDemo from "../components/interactive/AIDemo";

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

          <div className="flex flex-col md:flex-row items-start mb-8 gap-4">
            <div className="w-[50px] h-[50px] min-w-[50px] rounded-full bg-primary text-white flex items-center justify-center shadow-sm text-2xl shrink-0">
              <i className="fas fa-brain"></i>
            </div>
            <div className="flex-1">
              <p className="font-semibold mb-2 text-text">Browser-Based AI</p>
              <p className="text-sm text-text/80 leading-relaxed">
                These demos showcase TensorFlow.js and face-api.js with
                real-time facial emotion analysis and interactive drawing
                recognition. All processing happens locally in your browser,
                demonstrating privacy-first machine learning approaches.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start mb-8 gap-4">
            <div className="w-[50px] h-[50px] min-w-[50px] rounded-full bg-primary text-white flex items-center justify-center shadow-sm text-2xl shrink-0">
              <i className="fas fa-camera"></i>
            </div>
            <div className="flex-1">
              <p className="font-semibold mb-2 text-text">Emotion Analysis</p>
              <p className="text-sm text-text/80 leading-relaxed">
                The emotion analysis demo uses face-api.js with the Tiny Face
                Detector for fast face detection, combined with expression
                recognition and age/gender estimation neural networks. It can
                detect 7 emotions in real-time: happy, sad, angry, fearful,
                disgusted, surprised, and neutral.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start mb-8 gap-4">
            <div className="w-[50px] h-[50px] min-w-[50px] rounded-full bg-primary text-white flex items-center justify-center shadow-sm text-2xl shrink-0">
              <i className="fas fa-pencil-alt"></i>
            </div>
            <div className="flex-1">
              <p className="font-semibold mb-2 text-text">
                Drawing Recognition
              </p>
              <p className="text-sm text-text/80 leading-relaxed">
                The drawing recognition component demonstrates the concept of
                sketch recognition. In a full implementation, it would use a
                model like SketchRNN or a CNN trained on the Quick Draw dataset
                to recognize hand-drawn sketches in real-time.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start mb-8 gap-4">
            <div className="w-[50px] h-[50px] min-w-[50px] rounded-full bg-primary text-white flex items-center justify-center shadow-sm text-2xl shrink-0">
              <i className="fas fa-lock"></i>
            </div>
            <div className="flex-1">
              <p className="font-semibold mb-2 text-text">
                Privacy-First Machine Learning
              </p>
              <p className="text-sm text-text/80 leading-relaxed">
                All processing happens locally in your browser - your camera
                feed and drawings never leave your device. This is a powerful
                example of how modern web technologies can deliver AI
                capabilities while preserving user privacy.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start mb-8 gap-4">
            <div className="w-[50px] h-[50px] min-w-[50px] rounded-full bg-primary text-white flex items-center justify-center shadow-sm text-2xl shrink-0">
              <i className="fas fa-microchip"></i>
            </div>
            <div className="flex-1">
              <p className="font-semibold mb-2 text-text">
                Real-Time Performance
              </p>
              <p className="text-sm text-text/80 leading-relaxed">
                Experience the power of browser-based AI with real-time
                inference. The demos are optimized for performance, showcasing
                how machine learning models can run efficiently on consumer
                hardware without cloud dependencies.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start mb-8 gap-4">
            <div className="w-[50px] h-[50px] min-w-[50px] rounded-full bg-primary text-white flex items-center justify-center shadow-sm text-2xl shrink-0">
              <i className="fas fa-code"></i>
            </div>
            <div className="flex-1">
              <p className="font-semibold mb-2 text-text">
                Technical Implementation
              </p>
              <p className="text-sm text-text/80 leading-relaxed mb-2">
                These demos showcase several advanced technical capabilities:
              </p>
              <ul className="text-sm text-text/80 list-disc pl-5 leading-relaxed">
                <li>
                  Integration of TensorFlow.js for in-browser machine learning
                </li>
                <li>
                  Real-time video processing using the browser's MediaDevices
                  API
                </li>
                <li>Canvas manipulation for drawing tools and visualization</li>
                <li>
                  Reactive UI with styled-components that adapts to theme
                  changes
                </li>
                <li>Performance optimization for real-time inference</li>
                <li>WebGL acceleration for neural network computations</li>
              </ul>
            </div>
          </div>

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
