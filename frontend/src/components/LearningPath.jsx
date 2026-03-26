import React from 'react';

const LearningPath = ({ items = [] }) => {
  if (items.length === 0) {
    return (
      <div className="glass-card text-center" style={{ padding: '40px' }}>
        <p style={{ color: 'var(--text-secondary)' }}>
          Run an AI analysis to generate your personalized learning path.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {items.map((item, i) => (
        <div key={i} className="resource-card" style={{ animationDelay: `${i * 0.05}s` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
            <div>
              <div className="resource-title">{item.recommendation || item.title}</div>
              <div className="resource-meta" style={{ marginTop: '6px' }}>
                <span>📦 {item.platform}</span>
                <span>⏱ {item.duration}</span>
                <span>📊 {item.difficulty}</span>
              </div>
            </div>
            <span className={`badge badge-${item.type === 'Hard Skill' ? 'skill' : 'low'}`}>
              {item.topic}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LearningPath;
