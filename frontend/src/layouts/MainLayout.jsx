import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LndCoach from '../components/LndCoach';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', icon: '🏠', label: 'Home' },
    { path: '/app/learner', icon: '📊', label: 'Dashboard' },
    { path: '/app/analyzer', icon: '🤖', label: 'AI Analyzer' },
    { path: '/app/assessment', icon: '📝', label: 'Assessment' },
    { path: '/app/support', icon: '🎧', label: 'Support' },
  ];

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h1>⚡ HEXAPATH AI</h1>
          <p>Personalized Learning Platform</p>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <span className="icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="btn btn-secondary w-full btn-sm">
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-content">
        <header className="top-bar">
          <span className="top-bar-title">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
          <div className="top-bar-user">
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              {user?.full_name || 'User'}
            </span>
            <div className="avatar">{getInitials(user?.full_name)}</div>
          </div>
        </header>
        <div className="page-content">
          <Outlet />
        </div>
      </div>

      {/* Persistent 7-Stage L&D Coach */}
      <LndCoach />
    </div>
  );
};

export default MainLayout;
