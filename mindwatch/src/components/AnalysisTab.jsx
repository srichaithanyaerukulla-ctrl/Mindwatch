import React from 'react';

export default function AnalysisTab({ result }) {
  if (!result) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2 style={{ color: 'var(--text-secondary)' }}>No Analysis Yet</h2>
        <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
          Head over to the Check-In tab to share your feelings.
        </p>
      </div>
    );
  }

  const { stressLevel, stressScore, emotionalState, insight, suggestions, affirmation } = result;

  const getLevelClass = (level) => {
    if (level === 'LOW') return 'low';
    if (level === 'MEDIUM') return 'medium';
    return 'high';
  };

  const levelClass = getLevelClass(stressLevel);

  return (
    <div className="card analysis-result">
      {stressLevel === 'HIGH' && (
        <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', padding: '1.5rem', borderRadius: '0.75rem', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--stress-high)', marginBottom: '0.5rem' }}>High Stress Alert</h3>
          <p style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Please remember that you are not alone. Consider reaching out to a professional.</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>National Crisis Hotline: 988</p>
        </div>
      )}

      <div className="stress-header">
        <div className={`stress-badge ${levelClass}`}>
          {stressLevel} STRESS
        </div>
        <h2 style={{ textTransform: 'capitalize', color: 'var(--text-primary)' }}>{emotionalState}</h2>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
          <span>Stress Score</span>
          <span>{stressScore} / 10</span>
        </div>
        <div className="gauge-container">
          <div 
            className="gauge-fill" 
            style={{ 
              width: `${(stressScore / 10) * 100}%`,
              background: `var(--stress-${levelClass})`
            }} 
          />
        </div>
      </div>

      <div className="info-card insight">
        <h3>Insight</h3>
        <p>{insight}</p>
      </div>

      <div className="info-card suggestions">
        <h3>Actionable Suggestions</h3>
        <ul className="suggestions-list">
          {suggestions?.map((suggestion, idx) => (
            <li key={idx}>{suggestion}</li>
          ))}
        </ul>
      </div>

      <div className="info-card affirmation">
        <h3>Affirmation</h3>
        <p style={{ fontStyle: 'italic' }}>"{affirmation}"</p>
      </div>
    </div>
  );
}
