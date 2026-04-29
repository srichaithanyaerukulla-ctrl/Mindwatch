import React, { useState } from 'react';
import { analyzeStress } from '../services/gemini';
import { saveSession } from '../services/firebase';

export default function CheckInTab({ onAnalysisComplete }) {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!text.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await analyzeStress(text);
      
      const sessionData = {
        text: text,
        stressLevel: result.stressLevel,
        stressScore: result.stressScore,
        emotionalState: result.emotionalState,
        insight: result.insight,
        suggestions: result.suggestions,
        affirmation: result.affirmation
      };

      // Save to Firestore
      await saveSession(sessionData);

      onAnalysisComplete(result);
      setText('');
    } catch (err) {
      console.error(err);
      setError("Failed to analyze or save. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>How are you feeling right now?</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        Take a moment to express your thoughts. MindWatch AI will analyze your state and provide support.
      </p>
      
      <textarea
        placeholder="I've been feeling a bit overwhelmed with my assignments lately..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isLoading}
      />
      
      {error && <p style={{ color: 'var(--stress-high)', marginBottom: '1rem' }}>{error}</p>}
      
      <button 
        className="btn-primary"
        onClick={handleSubmit}
        disabled={isLoading || !text.trim()}
      >
        {isLoading ? 'Analyzing & Saving...' : 'Analyze My State'}
      </button>
    </div>
  );
}
