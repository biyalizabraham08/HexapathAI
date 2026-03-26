import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const PublicLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="public-layout-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 48px', position: 'relative', zIndex: 10 }}>
        <div 
          className="landing-badge" 
          style={{ marginBottom: 0, padding: '8px 16px', background: 'transparent', border: 'none', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <h2 style={{ fontSize: '24px', margin: 0, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
            ⚡ HEXAPATH AI
          </h2>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          {user ? (
            <button onClick={() => navigate('/app/learner')} className="btn btn-primary" style={{ padding: '10px 24px' }}>
              Dashboard <span>→</span>
            </button>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="btn btn-secondary" style={{ padding: '10px 24px', background: 'transparent', border: '1px solid var(--border-color)' }}>
                Sign In
              </button>
              <button onClick={() => navigate('/register')} className="btn btn-primary" style={{ padding: '10px 24px' }}>
                Sign Up <span>→</span>
              </button>
            </>
          )}
        </div>
      </nav>
      
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default PublicLayout;
