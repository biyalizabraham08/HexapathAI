import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import './AdminAuth.css';

const AdminRegister = () => {
  const [form, setForm] = useState({ full_name: '', email: '', password: '', admin_secret: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const ADMIN_SECRET = "skillgap-admin-2024";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (form.admin_secret !== ADMIN_SECRET) {
      setLoading(false);
      return setError("Invalid admin secret key. Access denied.");
    }

    try {
      await register(form.email, form.password, { 
        full_name: form.full_name, 
        role: 'admin' 
      });
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Registration failed');
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
          <h1>Create Admin Account</h1>
          <p>Register as an admin to manage your organization's talent pipeline</p>
        </div>

        {error && <div className="admin-error">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-auth-form">
          <div className="admin-form-group">
            <label>Full Name</label>
            <input
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              placeholder="Your full name"
              required
            />
          </div>
          <div className="admin-form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@company.com"
              required
            />
          </div>
          <div className="admin-form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>
          <div className="admin-form-group">
            <label>Admin Secret Key</label>
            <input
              type="password"
              name="admin_secret"
              value={form.admin_secret}
              onChange={handleChange}
              placeholder="Enter the admin secret key"
              required
            />
            <span className="admin-field-hint">Contact your system administrator for the secret key</span>
          </div>
          <button type="submit" disabled={loading} className="admin-auth-btn">
            {loading ? <><span className="admin-spinner" /> Creating account...</> : 'Create Admin Account'}
          </button>
        </form>

        <div className="admin-auth-footer">
          Already have an admin account?{' '}
          <Link to="/admin/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
