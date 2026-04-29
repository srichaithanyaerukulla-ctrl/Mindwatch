import React, { useState } from "react";
import CheckInTab from "./components/CheckInTab";
import AnalysisTab from "./components/AnalysisTab";
import HistoryTab from "./components/HistoryTab";
import "./index.css";

function App() {
  const [activeTab, setActiveTab] = useState("checkin");
  const [currentAnalysis, setCurrentAnalysis] = useState(null);

  const handleAnalysisComplete = (result) => {
    setCurrentAnalysis(result);
    setActiveTab("analysis");
  };

  return (
    <div className="app-container">
      <header>
        <h1>MindWatch AI</h1>
        <p>Real-Time Student Stress Detection System</p>
      </header>

      <div className="tabs">
        <button
          onClick={() => setActiveTab("checkin")}
          className={`tab-btn ${activeTab === "checkin" ? "active" : ""}`}
        >
          Check-In
        </button>
        <button
          onClick={() => setActiveTab("analysis")}
          className={`tab-btn ${activeTab === "analysis" ? "active" : ""}`}
        >
          Analysis
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`tab-btn ${activeTab === "history" ? "active" : ""}`}
        >
          History
        </button>
      </div>

      <main>
        {activeTab === "checkin" && <CheckInTab onAnalysisComplete={handleAnalysisComplete} />}
        {activeTab === "analysis" && <AnalysisTab result={currentAnalysis} />}
        {activeTab === "history" && <HistoryTab />}
      </main>
    </div>
  );
}

export default App;