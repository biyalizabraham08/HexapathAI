import React, { useState } from 'react';
import { fetchResource } from '../services/api';
import useAuth from '../hooks/useAuth';

const ROLES = [
  'Frontend Developer', 'Backend Developer', 'Fullstack Developer', 'Software Engineer',
  'DevOps Engineer', 'Mobile Developer', 'Data Scientist', 'Data Analyst',
  'Data Engineer', 'ML Engineer', 'AI Engineer', 'Product Manager',
  'Business Analyst', 'UI/UX Designer', 'Graphic Designer',
  'Cybersecurity Analyst', 'Cloud Architect',
];

const INDUSTRIES = ['Technology', 'Finance', 'Healthcare', 'E-commerce', 'Education', 'Media', 'Manufacturing'];

const Analyzer = () => {
  const { localId } = useAuth();
  const [currentSkills, setCurrentSkills] = useState('');
  const [desiredRole, setDesiredRole] = useState('');
  const [industry, setIndustry] = useState('Technology');
  const [experienceLevel, setExperienceLevel] = useState('Intermediate');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const skillsArray = currentSkills.split(',').map(s => s.trim()).filter(s => s);
    try {
      const response = await fetchResource('/learning/analyze-gap', {
        method: 'POST',
        body: JSON.stringify({
          current_skills: skillsArray,
          desired_role: desiredRole,
          industry,
          experience_level: experienceLevel,
        })
      });
      setAnalysis(response); // Fix mapping: response from api.js already returns the json

      // Auto-save analysis to tracker DB
      const userId = localId || localStorage.getItem('skill_gap_local_id');
      if (userId) {
        fetchResource('/tracking/save-analysis', {
          method: 'POST',
          body: JSON.stringify({
            user_id: userId,
            analysis: response.data.analysis,
            learning_path: response.data.learning_path,
          })
        }).catch(() => {}); // silent — don't block UI
      }
    } catch (err) {
      setError('Failed to analyze. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityClass = (severity) => {
    const map = { Critical: 'critical', High: 'high', Medium: 'medium', Low: 'low' };
    return map[severity] || 'medium';
  };

  return (
    <div>
      <div className="page-header">
        <h2>🤖 AI Skill Gap Analyzer</h2>
        <p>Identify your skill gaps and get a personalized learning path powered by AI</p>
      </div>

      {/* Analysis Form */}
      <div className="glass-card" style={{ marginBottom: '32px' }}>
        <form onSubmit={handleAnalyze} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label">Your Current Skills (comma separated)</label>
            <input
              type="text"
              className="form-input"
              value={currentSkills}
              onChange={(e) => setCurrentSkills(e.target.value)}
              placeholder="e.g. Python, SQL, Machine Learning, Communication"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Desired Role</label>
              <select className="form-select" value={desiredRole} onChange={(e) => setDesiredRole(e.target.value)} required>
                <option value="">Select a role</option>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Industry</label>
              <select className="form-select" value={industry} onChange={(e) => setIndustry(e.target.value)}>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Experience Level</label>
              <select className="form-select" value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)}>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
            {loading ? (
              <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></div> Analyzing with AI...</>
            ) : '⚡ Analyze My Skills'}
          </button>
        </form>
      </div>

      {error && <div className="error-msg mb-24">{error}</div>}

      {/* Results */}
      {analysis && analysis.data && (
        <div className="results-section">
          {/* Summary Stats */}
          <div className="grid-4 mb-24">
            <div className="stat-card" style={{ animationDelay: '0s' }}>
              <div className="fit-gauge">
                <div className="gauge-value">{analysis.data.analysis.career_fit_pct}%</div>
                <div className="gauge-label">Career Fit</div>
              </div>
            </div>
            <div className="stat-card" style={{ animationDelay: '0.1s' }}>
              <span className="stat-value">{analysis.data.analysis.total_hard_gaps}</span>
              <span className="stat-label">Hard Skill Gaps</span>
            </div>
            <div className="stat-card" style={{ animationDelay: '0.2s' }}>
              <span className="stat-value">{analysis.data.analysis.total_soft_gaps}</span>
              <span className="stat-label">Soft Skill Gaps</span>
            </div>
            <div className="stat-card" style={{ animationDelay: '0.3s' }}>
              <span className="stat-value">{analysis.data.summary.total_resources}</span>
              <span className="stat-label">Recommended Resources</span>
            </div>
          </div>

          {/* Strategic AI Insight - THE PROOF OF GEMINI */}
          {analysis.data.ai_insight && (
            <div className="glass-card mb-24" style={{ borderLeft: '4px solid #4285F4', background: 'rgba(66, 133, 244, 0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  ✨ Strategic AI Insight
                </h3>
                <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', background: 'linear-gradient(90deg, #4285F4, #9B72F3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Powered by {analysis.data.powered_by || 'Gemini 1.5 Flash'}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '15px', lineHeight: '1.6', color: 'var(--text-primary)', fontStyle: 'italic' }}>
                "{analysis.data.ai_insight}"
              </p>
            </div>
          )}

          {/* Career Fit & Role Info */}
          <div className="glass-card mb-24">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: '18px' }}>
                  Target: {analysis.data.analysis.resolved_role}
                </h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>
                  {analysis.data.analysis.industry_context} • {analysis.data.analysis.experience_level}
                </p>
              </div>
              <div>
                <span className={`badge badge-${analysis.data.analysis.career_fit_pct >= 60 ? 'low' : analysis.data.analysis.career_fit_pct >= 40 ? 'medium' : 'high'}`} style={{ fontSize: '14px', padding: '6px 16px' }}>
                  {analysis.data.analysis.career_fit}
                </span>
              </div>
            </div>

            {/* Matched Skills */}
            {(analysis.data.analysis.hard_matches?.length > 0 || analysis.data.analysis.soft_matches?.length > 0) && (
              <div style={{ marginTop: '16px' }}>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>✅ SKILLS YOU ALREADY HAVE</p>
                <div className="matched-skills">
                  {[...(analysis.data.analysis.hard_matches || []), ...(analysis.data.analysis.soft_matches || [])].map(s => (
                    <span key={s} className="badge badge-low">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Hard Skill Gaps */}
          {analysis.data.analysis.hard_gaps.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>🔧 Hard Skill Gaps</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {analysis.data.analysis.hard_gaps.map((gap, i) => (
                  <div key={i} className="gap-card" style={{ animationDelay: `${i * 0.05}s` }}>
                    <div className="gap-info">
                      <div className="gap-skill">{gap.skill}</div>
                      <div className="gap-levels">
                        Level: {gap.current_level}/10 → Required: {gap.required_level}/10
                      </div>
                    </div>
                    <div className="severity-bar" style={{ width: '120px' }}>
                      <div className="severity-track">
                        <div className={`severity-fill ${getSeverityClass(gap.severity)}`} style={{ width: `${gap.gap * 10}%` }}></div>
                      </div>
                    </div>
                    <span className={`badge badge-${getSeverityClass(gap.severity)}`}>{gap.severity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Soft Skill Gaps */}
          {analysis.data.analysis.soft_gaps.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>💡 Soft Skill Gaps</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {analysis.data.analysis.soft_gaps.map((gap, i) => (
                  <div key={i} className="gap-card" style={{ animationDelay: `${i * 0.05}s` }}>
                    <div className="gap-info">
                      <div className="gap-skill">{gap.skill}</div>
                      <div className="gap-levels">
                        Level: {gap.current_level}/10 → Required: {gap.required_level}/10
                      </div>
                    </div>
                    <span className={`badge badge-${getSeverityClass(gap.severity)}`}>{gap.severity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Learning Path */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>📚 Personalized Learning Path</h3>
            <div className="grid-2">
              {analysis.data.learning_path.map((item, i) => (
                <div key={i} className="resource-card" style={{ animationDelay: `${i * 0.03}s` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                    <span className="resource-title">{item.recommendation}</span>
                    <span className={`badge badge-${item.type === 'Hard Skill' ? 'skill' : 'low'}`} style={{ flexShrink: 0 }}>
                      {item.topic}
                    </span>
                  </div>
                  <div className="resource-meta">
                    <span>📦 {item.platform}</span>
                    <span>📖 {item.resource_type}</span>
                    <span>⏱ {item.duration}</span>
                    <span>📊 {item.difficulty}</span>
                  </div>
                  {item.url && item.url !== '#' && (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ marginTop: '12px' }}>
                      Start Learning →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analyzer;
