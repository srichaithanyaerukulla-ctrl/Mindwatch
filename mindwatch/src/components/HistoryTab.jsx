import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getSessions } from '../services/firebase';

export default function HistoryTab() {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getSessions();
        // Format dates and reverse so chronological order is left to right for the chart
        const formattedData = data.map(s => ({
          ...s,
          dateLabel: s.timestamp?.toDate ? s.timestamp.toDate().toLocaleDateString() : new Date().toLocaleDateString(),
          score: s.stressScore
        })).reverse();
        setSessions(formattedData);
      } catch (err) {
        console.error(err);
        setError("Failed to load history.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHistory();
  }, []);

  if (isLoading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading your history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <p style={{ color: 'var(--stress-high)' }}>{error}</p>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2 style={{ color: 'var(--text-secondary)' }}>No History Yet</h2>
        <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
          Your stress check-ins will appear here over time.
        </p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ background: 'var(--bg-card)', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>{data.dateLabel}</p>
          <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Score: {data.score} / 10</p>
          <p style={{ color: 'var(--accent-teal)', textTransform: 'capitalize' }}>{data.emotionalState}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Stress Trends Over Time</h2>
      
      <div className="history-chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sessions} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-teal)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--accent-teal)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="dateLabel" stroke="var(--text-secondary)" fontSize={12} />
            <YAxis stroke="var(--text-secondary)" domain={[0, 10]} fontSize={12} />
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="score" stroke="var(--accent-teal)" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Recent Logs</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {sessions.slice().reverse().map((session) => (
            <div key={session.id || Math.random()} className="history-item">
              <div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'block', marginBottom: '4px' }}>
                  {session.dateLabel}
                </span>
                <strong style={{ textTransform: 'capitalize', color: 'var(--text-primary)' }}>
                  {session.emotionalState}
                </strong>
                <div style={{ marginTop: '2px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Score: {session.score} / 10
                </div>
              </div>
              
              <div className={`stress-badge ${session.stressLevel === 'LOW' ? 'low' : session.stressLevel === 'MEDIUM' ? 'medium' : 'high'}`} style={{ fontSize: '0.8rem', padding: '0.4rem 1rem', margin: 0 }}>
                {session.stressLevel}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
