import React from 'react';

const ProgressBar = ({ progress = 0, label = '' }) => {
  return (
    <div style={{ width: '100%' }}>
      {label && <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>{label}</p>}
      <div className="progress-bar-container">
        <div className="progress-bar-fill" style={{ width: `${Math.min(100, progress)}%` }}></div>
      </div>
      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', textAlign: 'right' }}>{progress}%</p>
    </div>
  );
};

export default ProgressBar;
