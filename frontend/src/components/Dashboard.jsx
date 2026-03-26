import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="page-header">
        <h2>📊 Dashboard</h2>
        <p>Overview of your learning progress</p>
      </div>

      <div className="glass-card text-center" style={{ padding: '60px 20px' }}>
        <p style={{ fontSize: '48px', marginBottom: '16px' }}>📈</p>
        <h3>Your Learning Journey</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
          Start by running an AI analysis to populate your dashboard with skill insights and progress tracking.
        </p>
        <button onClick={() => navigate('/analyzer')} className="btn btn-primary">
          🤖 Run AI Analysis
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
