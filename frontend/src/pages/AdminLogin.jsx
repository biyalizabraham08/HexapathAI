import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchResource } from '../services/api';
import useAuth from '../hooks/useAuth';
import './AdminAuth.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { user } = await login(email, password);
      
      // Verification: Check if the user has the admin role in their Supabase metadata
      const role = user.user_metadata?.role;
      if (role === 'admin') {
        navigate('/admin');
      } else {
        setError('Access denied: You do not have administrator privileges.');
        // Optionally sign out the user if they're not an admin but tried to login here
        // await logout(); 
      }
    } catch (err) {
      setError(err.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-auth-container">
      <div className="admin-auth-bg" />
      <div className="admin-auth-card">
        <div className="admin-auth-logo">
          <span className="admin-logo-icon">🛡️</span>
          <h1>Admin Portal</h1>
          <p>Sign in to access the Admin Insights Dashboard</p>
        </div>

        {error && <div className="admin-error">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-auth-form">
          <div className="admin-form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@company.com"
              required
            />
          </div>
          <div className="admin-form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="admin-auth-btn">
            {loading ? <><span className="admin-spinner" /> Signing in...</> : 'Sign In as Admin'}
          </button>
        </form>

        <div className="admin-auth-footer">
          Don't have an admin account?{' '}
          <Link to="/admin/register">Create one</Link>
        </div>
        <div className="admin-auth-footer" style={{ marginTop: 4 }}>
          <Link to="/login">← Back to User Login</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
