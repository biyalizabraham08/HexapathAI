import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchResource } from '../services/api';
import useAuth from '../hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetchResource('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      login(response.user, response.access_token);
      navigate(response.user.role === 'admin' ? '/admin' : '/app/learner');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="landing-bg-glow" />
      <div className="auth-card landing-reveal visible">
        <div className="auth-header">
          <div className="logo">⚡</div>
          <h2>Welcome Back</h2>
          <p>Sign in to your HEXAPATH AI account</p>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-full" style={{ marginTop: '8px' }}>
            {loading ? (
              <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></div> Signing in...</>
            ) : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </div>
        <div className="auth-footer" style={{ marginTop: '8px' }}>
          <Link to="/admin/login" style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>🛡️ Admin Portal</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
