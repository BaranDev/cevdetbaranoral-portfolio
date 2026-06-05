import { useState } from "react";
import { DemoContainer, DemoTitle, TabButton } from "./shared";
import EmotionAnalysisDemo from "./EmotionAnalysisDemo";
import DrawingRecognitionDemo from "./DrawingRecognitionDemo";

type TabId = "emotionAnalysis" | "whiteboard";

const TABS: { id: TabId; label: string }[] = [
  { id: "emotionAnalysis", label: "Emotion Analysis" },
  { id: "whiteboard", label: "Drawing Recognition" },
];

const AIDemo = () => {
  const [activeTab, setActiveTab] = useState<TabId>("emotionAnalysis");
  // Demos stay mounted once visited so models and training state survive tab switches.
  const [visited, setVisited] = useState<Record<TabId, boolean>>({
    emotionAnalysis: true,
    whiteboard: false,
  });
  const [ready, setReady] = useState<Record<TabId, boolean>>({
    emotionAnalysis: false,
    whiteboard: false,
  });

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    setVisited((v) => (v[tab] ? v : { ...v, [tab]: true }));
  };

  const markReady = (tab: TabId) => (isReady: boolean) =>
    setReady((r) => ({ ...r, [tab]: isReady }));

  return (
    <DemoContainer>
      <div className="flex mb-4 justify-between items-center">
        <DemoTitle>AI Demonstrations</DemoTitle>
      </div>

      <div className="flex flex-wrap mb-4 justify-center gap-4">
        {TABS.map((tab) => (
          <TabButton
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            active={activeTab === tab.id}
            ready={ready[tab.id]}
            loading={visited[tab.id] && !ready[tab.id]}
          >
            {tab.label}
          </TabButton>
        ))}
      </div>

      <div className={activeTab === "emotionAnalysis" ? "" : "hidden"}>
        <EmotionAnalysisDemo
          active={activeTab === "emotionAnalysis"}
          onReadyChange={markReady("emotionAnalysis")}
        />
      </div>

      {visited.whiteboard && (
        <div className={activeTab === "whiteboard" ? "" : "hidden"}>
          <DrawingRecognitionDemo
            active={activeTab === "whiteboard"}
            onReadyChange={markReady("whiteboard")}
          />
        </div>
      )}
    </DemoContainer>
  );
};

export default AIDemo;
