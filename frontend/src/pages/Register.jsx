import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchResource } from '../services/api';
import useAuth from '../hooks/useAuth';

const Register = () => {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  
  const [formData, setFormData] = useState({
    full_name: '', email: '', password: '', confirmPassword: '',
    department: '', experience_level: 'Beginner', skills: []
  });
  const [skillInput, setSkillInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  const handleRegisterStep1 = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match!");
    }
    if (formData.skills.length === 0) {
      return setError("Please add at least one skill.");
    }
    setLoading(true);
    setError('');
    
    try {
      const res = await fetchResource('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          full_name: formData.full_name, email: formData.email,
          password: formData.password, department: formData.department,
          experience_level: formData.experience_level, skills: formData.skills
        })
      });
      
      if (res.require_otp) {
        if (res.dev_otp) {
          console.log(
            `\n%c🔑 VERIFICATION OTP: ${res.dev_otp}\n`, 
            "background: #1e1e2f; color: #4ade80; font-size: 16px; font-weight: bold; padding: 10px; border-radius: 8px;"
          );
        }
        setStep(2); // Move to OTP step
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Email might already be in use.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      return setError("Please enter a valid 6-digit OTP.");
    }
    setLoading(true);
    setError('');
    try {
      // 1. Verify OTP and Create User
      await fetchResource('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email: formData.email, otp_code: otp })
      });
      
      // 2. Auto-login upon successful verification
      const loginRes = await fetchResource('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });
      
      login(loginRes.user, loginRes.access_token);
      navigate('/app/learner');
    } catch (err) {
      setError(err.message || 'Invalid or expired OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="landing-bg-glow" />
      <div className="auth-card landing-reveal visible" style={{ maxWidth: '500px' }}>
        <div className="auth-header">
          <div className="logo">⚡</div>
          <h2>{step === 1 ? 'Create Account' : 'Verify Email'}</h2>
          <p>{step === 1 ? 'Join HEXAPATH AI and start your learning journey' : `We sent a 6-digit code to ${formData.email}`}</p>
        </div>

        {error && <div className="error-msg">{error}</div>}

        {step === 1 ? (
          <form onSubmit={handleRegisterStep1} className="auth-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" name="full_name" className="form-input" value={formData.full_name} onChange={handleChange} placeholder="Your full name" required />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" name="email" className="form-input" value={formData.email} onChange={handleChange} placeholder="you@example.com" required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input type="password" name="password" className="form-input" value={formData.password} onChange={handleChange} placeholder="••••••••" required />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input type="password" name="confirmPassword" className="form-input" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Department</label>
                <select name="department" className="form-select" value={formData.department} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Product">Product</option>
                  <option value="Design">Design</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Experience Level</label>
                <select name="experience_level" className="form-select" value={formData.experience_level} onChange={handleChange} required>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Skills</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  className="form-input"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  placeholder="Type a skill and press Enter"
                />
                <button type="button" onClick={addSkill} className="btn btn-secondary btn-sm">Add</button>
              </div>
              {formData.skills.length > 0 && (
                <div className="matched-skills" style={{ marginTop: '8px' }}>
                  {formData.skills.map(s => (
                    <span key={s} className="badge badge-skill">
                      {s}
                      <button type="button" onClick={() => removeSkill(s)} className="btn-danger" style={{ fontSize: '12px', padding: '0 2px' }}>✕</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full" style={{ marginTop: '8px' }}>
              {loading ? (
                <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></div> Sending Code...</>
              ) : 'Continue to Verification'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="auth-form anim-fade-in">
            <div className="form-group">
              <label className="form-label">Verification Code (6 Digits)</label>
              <input 
                type="text" 
                className="form-input" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                placeholder="000000" 
                maxLength="6"
                style={{ textAlign: 'center', fontSize: '24px', letterSpacing: '4px' }}
                required 
                autoFocus
              />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary w-full" style={{ marginTop: '8px' }}>
              {loading ? (
                <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></div> Verifying...</>
              ) : 'Verify & Create Account'}
            </button>
            <button type="button" onClick={() => setStep(1)} className="btn btn-secondary w-full" style={{ marginTop: '12px', background: 'transparent' }} disabled={loading}>
              Back to Details
            </button>
          </form>
        )}

        {step === 1 && (
          <div className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
