import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const observerRef = useRef(null);

  // Setup intersection observer for scroll reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.landing-reveal');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const stats = [
    { value: '85%', label: 'Skills Obsolescence', desc: 'of jobs will require different skills by 2030' },
    { value: '44%', label: 'Employee Gap', desc: 'of workers need core skill sets updated' },
    { value: '3x', label: 'Faster Growth', desc: 'for teams using AI-driven learning paths' },
  ];

  const features = [
    {
      icon: '🤖',
      title: 'AI Pulse Analysis',
      desc: 'Real-time identification of technical and soft skill disparities using deep learning.',
      color: '#6366f1',
      action: '/app/analyzer'
    },
    {
      icon: '🎯',
      title: 'Adaptive Quizzing',
      desc: 'Domain-specific assessments that evolve based on your performance levels.',
      color: '#8b5cf6',
      action: '/app/assessment'
    },
    {
      icon: '🚀',
      title: 'Hyper-Personalized paths',
      desc: 'Automated curriculum generation tailored to your specific career aspirations.',
      color: '#06b6d4',
      action: '/app/analyzer'
    },
    {
      icon: '📊',
      title: 'Progress Intelligence',
      desc: 'Comprehensive data visualization of your professional transformation journey.',
      color: '#10b981',
      action: '/app/learner'
    },
  ];

  return (
    <div className="landing-page">
      <div className="landing-bg-glow" />

      {/* ── Hero Section ──────────────────────────── */}
      <section className="landing-hero" style={{ paddingTop: '60px' }}>
        <div className="landing-badge">
          <span>✨</span> NEXT-GEN SKILL INTELLIGENCE
        </div>
        <h1 className="landing-heading">
          Navigate Your <span className="accent">Skill Journey</span><br />
          in Real-Time
        </h1>
        <p className="landing-subtitle">
          HEXAPATH AI empowers {user?.full_name ? 'you' : 'professionals'} to track disparities, simulate career paths, 
          and master new domains with an intelligent AI micro-coach.
        </p>
        <div className="landing-cta-group">
          {user ? (
            <button onClick={() => navigate('/app/analyzer')} className="landing-cta-primary">
              Run AI Analyzer <span>→</span>
            </button>
          ) : (
            <button onClick={() => navigate('/register')} className="landing-cta-primary">
              Start Free Today <span>→</span>
            </button>
          )}
          <button onClick={() => navigate(user ? '/app/learner' : '/login')} className="landing-cta-secondary">
            {user ? 'View My Progress' : 'Sign In'}
          </button>
          <button
            onClick={() => navigate('/admin/login')}
            className="landing-cta-secondary"
            style={{ borderColor: 'var(--border-color)', color: 'var(--accent-primary)', gap: 6 }}
          >
            🛡️ Admin Login
          </button>
        </div>
      </section>

      <div className="landing-divider" />

      {/* ── Problem Section (Stats) ────────────────── */}
      <section className="landing-section landing-reveal">
        <div className="text-center mb-24">
          <span className="landing-section-badge">The Skill Gap Crisis</span>
          <h2 className="landing-section-heading">Why it matters today</h2>
          <p className="landing-section-desc" style={{ margin: '0 auto' }}>
            Traditional learning is too slow for the AI era. We provide the speed and precision needed to stay ahead.
          </p>
        </div>

        <div className="landing-stats">
          {stats.map((s, i) => (
            <div key={i} className="landing-stat-card">
              <div className="landing-stat-value">{s.value}</div>
              <div className="landing-stat-label">{s.label}</div>
              <div className="landing-stat-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Solution Section (Features) ───────────── */}
      <section className="landing-section landing-reveal">
        <div className="flex justify-between items-center mb-24" style={{ flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span className="landing-section-badge">Our Solution</span>
            <h2 className="landing-section-heading">Built for the future of work</h2>
            <p className="landing-section-desc">
              A comprehensive ecosystem designed to bridge the gap between where you are and where you want to be.
            </p>
          </div>
          <button onClick={() => navigate('/register')} className="btn btn-secondary">Explore All Features</button>
        </div>

        <div className="landing-features-grid">
          {features.map((f, i) => (
            <div 
              key={i} 
              className="landing-feature-card"
              onClick={() => navigate(user ? `/app${f.action}` : '/register')}
            >
              <div className="landing-feature-icon" style={{ background: `${f.color}15`, color: f.color }}>
                {f.icon}
              </div>
              <h3 className="landing-feature-title">{f.title}</h3>
              <p className="landing-feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Footer ────────────────────────────── */}
      <section className="landing-cta-footer landing-reveal">
        <div className="landing-cta-box">
          <h3>Ready to bridge the gap?</h3>
          <p>
            Join thousands of learners identifying their potential and accelerating their careers with HEXAPATH AI.
          </p>
          <div className="landing-cta-group">
            <button onClick={() => navigate('/register')} className="landing-cta-primary">
              Sign Up Now
            </button>
            <button onClick={() => navigate('/login')} className="landing-cta-secondary">
              Sign In
            </button>
          </div>
        </div>
      </section>

      <footer style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: '13px' }}>
        © 2026 HEXAPATH AI Platform. All rights reserved.
        <span style={{ margin: '0 12px' }}>·</span>
        <span
          onClick={() => navigate('/admin/login')}
          style={{ cursor: 'pointer', color: '#6366f1', textDecoration: 'underline' }}
        >
          Admin Portal
        </span>
      </footer>
    </div>
  );
};

export default Home;

