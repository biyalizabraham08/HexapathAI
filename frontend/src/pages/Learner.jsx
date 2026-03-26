import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchResource } from '../services/api';
import useAuth from '../hooks/useAuth';
import { useCourseProgress } from '../context/CourseProgressContext';

const Learner = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    courses: trackedCourses,
    completedCourses,
    totalCourses,
    overallProgress,
    startCourse,
    updateProgress,
    completeCourse,
    removeCourse,
    isCourseTracked,
    getUnifiedStatus,
  } = useCourseProgress();

  const [analysis, setAnalysis] = useState(null);
  const [trackerData, setTrackerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeSlide, setActiveSlide] = useState('overview');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = storedUser.id || user?.id;
    if (userId) fetchTrackerData(userId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchTrackerData = async (userId) => {
    setLoading(true);
    try {
      const res = await fetchResource(`/tracking/dashboard/${userId}`);
      if (res.status === 'success') {
        setTrackerData(res.data);
        if (res.data.latest_analysis) {
          const la = res.data.latest_analysis;
          setAnalysis({
            analysis: {
              career_fit_pct: la.career_fit_pct,
              total_hard_gaps: la.total_hard_gaps,
              total_soft_gaps: la.total_soft_gaps,
              hard_gaps: la.hard_gaps,
              soft_gaps: la.soft_gaps,
              hard_matches: la.hard_matches,
              soft_matches: la.soft_matches,
              resolved_role: la.desired_role,
              industry_context: la.industry,
              experience_level: la.experience_level,
              career_fit: la.career_fit_pct >= 60 ? 'Strong Fit' : la.career_fit_pct >= 40 ? 'Moderate Fit' : 'Low Fit',
              total_skills_matched: (la.hard_matches?.length || 0) + (la.soft_matches?.length || 0)
            },
            learning_path: la.learning_path
          });
        }
      }
    } catch (err) {
      console.error('Failed to fetch tracker data', err);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityClass = (s) => ({ Critical: 'critical', High: 'high', Medium: 'medium', Low: 'low' }[s] || 'medium');

  /* ── Computed Metrics ── */
  const baseSkillsMatched = analysis?.analysis?.total_skills_matched || 0;
  const bonusSkills = completedCourses.length;
  const dynamicSkillsMatched = baseSkillsMatched + bonusSkills;

  const baseCareerFit = analysis?.analysis?.career_fit_pct || trackerData?.latest_career_fit || 0;
  const careerFitBoost = Math.min(20, completedCourses.length * 4); // +4% per completed course, max 20%
  const dynamicCareerFit = Math.min(100, Number(baseCareerFit) + careerFitBoost);

  const hasAssessments = (trackerData?.total_assessments || 0) > 0;
  const unifiedStatus = getUnifiedStatus(hasAssessments);

  const statusColor = {
    'Not Started': '#94a3b8',
    'In Progress': '#2563eb',
    'Assessment Pending': '#d97706',
    'Completed': '#16a34a',
  }[unifiedStatus] || '#94a3b8';

  /* ── Handle Start Course from Recommended Courses ── */
  const handleStartCourse = (item) => {
    startCourse({
      name: item.recommendation || item.title,
      platform: item.platform,
      duration: item.duration,
      topic: item.topic,
      type: item.type,
      url: item.url,
    });
  };

  return (
    <div className="landing-page">
      <div className="page-header" style={{ marginBottom: '20px' }}>
        <h2>Welcome back, {user?.full_name || 'Learner'} 👋</h2>
        <p>Here's your skill development overview powered by Tracker AI</p>
      </div>

      {/* Slide / Tab Navigation */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '2px solid #e5e7eb', marginBottom: '32px' }}>
        <button 
          onClick={() => setActiveSlide('overview')}
          style={{ 
            padding: '12px 24px', background: 'none', border: 'none',
            borderBottom: activeSlide === 'overview' ? '3px solid #1e3a8a' : '3px solid transparent',
            color: activeSlide === 'overview' ? '#1e293b' : '#64748b',
            fontWeight: 600, fontSize: '15px', cursor: 'pointer', transition: 'all 0.2s', marginBottom: '-2px'
          }}
        >
          📊 Skill Overview
        </button>
        <button 
          onClick={() => setActiveSlide('tracker')}
          style={{ 
            padding: '12px 24px', background: 'none', border: 'none',
            borderBottom: activeSlide === 'tracker' ? '3px solid #1e3a8a' : '3px solid transparent',
            color: activeSlide === 'tracker' ? '#1e293b' : '#64748b',
            fontWeight: 600, fontSize: '15px', cursor: 'pointer', transition: 'all 0.2s', marginBottom: '-2px'
          }}
        >
          📈 Tracker Agent (Performance & Courses)
        </button>
      </div>

      {/* Quick Stats (Always visible) */}
      <div className="grid-4 mb-24">
        <div className="stat-card" style={{ animationDelay: '0s' }}>
          <span className="stat-value">{dynamicCareerFit}%</span>
          <span className="stat-label">Career Fit</span>
          {careerFitBoost > 0 && <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600 }}>+{careerFitBoost}% from courses</span>}
        </div>
        <div className="stat-card" style={{ animationDelay: '0.1s' }}>
          <span className="stat-value">{dynamicSkillsMatched}</span>
          <span className="stat-label">Skills Matched</span>
          {bonusSkills > 0 && <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600 }}>+{bonusSkills} from courses</span>}
        </div>
        <div className="stat-card" style={{ animationDelay: '0.2s' }}>
          <span className="stat-value">{trackerData?.latest_assessment_score || '—'}%</span>
          <span className="stat-label">Last Score</span>
        </div>
        <div className="stat-card" style={{ animationDelay: '0.3s' }}>
          <span className="stat-value">{trackerData?.total_assessments || 0}</span>
          <span className="stat-label">Assessments Taken</span>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="glass-card mb-24 text-center" style={{ padding: '40px' }}>
          <div className="spinner spinner-lg" style={{ margin: '0 auto 16px' }}></div>
          <p style={{ color: 'var(--text-secondary)' }}>Analyzing your skill profile...</p>
        </div>
      )}

      {/* ==================== SLIDE 1: SKILL OVERVIEW ==================== */}
      <div style={{ display: activeSlide === 'overview' ? 'block' : 'none' }} className="anim-fade-in">
        {analysis && !loading && (
          <>
            <div className="grid-2 mb-24">
              {/* Hard Gaps */}
              <div className="glass-card">
                <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>🔧 Hard Skill Gaps</h3>
                {analysis.analysis.hard_gaps.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {analysis.analysis.hard_gaps.slice(0, 5).map((gap, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px' }}>{gap.skill}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div className="progress-bar-container" style={{ width: '80px', height: '6px' }}>
                            <div className="progress-bar-fill"
                              style={{
                                width: `${(gap.current_level / gap.required_level) * 100}%`,
                                background: gap.severity === 'Critical' ? 'var(--severity-critical)' : gap.severity === 'High' ? 'var(--severity-high)' : 'var(--accent-primary)'
                              }}
                            ></div>
                          </div>
                          <span className={`badge badge-${getSeverityClass(gap.severity)}`}>{gap.severity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>No hard skill gaps — great job! 🎉</p>
                )}
              </div>

              {/* Soft Gaps */}
              <div className="glass-card">
                <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>💡 Soft Skill Gaps</h3>
                {analysis.analysis.soft_gaps.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {analysis.analysis.soft_gaps.slice(0, 5).map((gap, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px' }}>{gap.skill}</span>
                        <span className={`badge badge-${getSeverityClass(gap.severity)}`}>{gap.severity}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>No soft skill gaps found! 🎉</p>
                )}
              </div>
            </div>

            {/* Recommended Courses — with START COURSE buttons */}
            {analysis.learning_path?.length > 0 && (
              <div className="glass-card mb-24">
                <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>📚 Recommended Courses</h3>
                <div className="grid-3">
                  {analysis.learning_path.slice(0, 6).map((item, i) => {
                    const courseName = item.recommendation || item.title;
                    const tracked = isCourseTracked(courseName, item.platform);
                    const directUrl = item.url && item.url !== '#' ? item.url : `https://www.google.com/search?q=${encodeURIComponent(courseName + ' course on ' + item.platform)}`;
                    return (
                      <div key={i} className="resource-card" style={{ animationDelay: `${i * 0.05}s`, position: 'relative' }}>
                        <a href={directUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                          <div className="resource-title">{courseName}</div>
                          <div className="resource-meta" style={{ marginTop: '8px' }}>
                            <span>📦 {item.platform}</span>
                            <span>⏱ {item.duration}</span>
                          </div>
                        </a>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                          <span className={`badge badge-${item.type === 'Hard Skill' ? 'skill' : 'low'}`}>
                            {item.topic}
                          </span>
                          {tracked ? (
                            <span style={{
                              fontSize: '12px', padding: '4px 12px', borderRadius: '20px',
                              background: tracked.status === 'completed' ? '#f0fdf4' : '#eff6ff',
                              color: tracked.status === 'completed' ? '#16a34a' : '#2563eb',
                              fontWeight: 700
                            }}>
                              {tracked.status === 'completed' ? '✅ Completed' : '📖 In Progress'}
                            </span>
                          ) : (
                            <button
                              onClick={() => handleStartCourse(item)}
                              style={{
                                fontSize: '12px', padding: '4px 12px', borderRadius: '20px',
                                background: '#1e3a8a', color: 'white', border: 'none',
                                fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.2s'
                              }}
                            >
                              ▶ Start Course
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Quick Actions */}
            <div className="glass-card mb-24">
              <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>🚀 Quick Actions</h3>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button onClick={() => navigate('/app/analyzer')} className="btn btn-primary">
                  🤖 Run Full AI Analysis
                </button>
                <button onClick={() => navigate('/app/assessment')} className="btn btn-secondary">
                  📝 Take Assessment
                </button>
              </div>
            </div>
          </>
        )}

        {!analysis && !loading && (
          <div className="glass-card text-center" style={{ padding: '60px 20px' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>🤖</p>
            <h3 style={{ marginBottom: '8px' }}>Start Your Skill Analysis</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Head to the AI Analyzer to discover your skill gaps and get personalized recommendations
            </p>
            <button onClick={() => navigate('/app/analyzer')} className="btn btn-primary">
              ⚡ Open AI Analyzer
            </button>
          </div>
        )}
      </div>

      {/* ==================== SLIDE 2: TRACKER AGENT ==================== */}
      <div style={{ display: activeSlide === 'tracker' ? 'block' : 'none' }} className="anim-fade-in">
        
        {/* Unified Status Banner */}
        <div className="glass-card mb-24" style={{ background: 'linear-gradient(to right, #f8fafc, #eff6ff)', border: '1px solid #bfdbfe' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>AI Unified Status</p>
              <h2 style={{ fontSize: '24px', color: statusColor, margin: 0 }}>
                {unifiedStatus}
              </h2>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#64748b' }}>
                {totalCourses} courses · {completedCourses.length} completed · {overallProgress}% overall
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid-2 mb-24">
          {/* ── Course Progress Panel ── */}
          <div className="glass-card">
            <h3 style={{ marginBottom: '16px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📚</span> Course Progress
              {totalCourses > 0 && <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 400 }}>({totalCourses} active)</span>}
            </h3>

            {trackedCourses.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {trackedCourses.map((course) => (
                  <div key={course.id} style={{ border: '1px solid var(--border-color)', padding: '16px', borderRadius: '10px', background: course.status === 'completed' ? '#f0fdf4' : '#fff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'flex-start' }}>
                      <div>
                        <span style={{ fontWeight: 600, fontSize: '15px', display: 'block' }}>{course.name}</span>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>{course.platform} · {course.duration}</span>
                      </div>
                      <span style={{
                        fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: 700,
                        background: course.status === 'completed' ? '#dcfce7' : course.status === 'in_progress' ? '#dbeafe' : '#f1f5f9',
                        color: course.status === 'completed' ? '#16a34a' : course.status === 'in_progress' ? '#2563eb' : '#94a3b8',
                      }}>
                        {course.status === 'completed' ? '✅ Completed' : course.status === 'in_progress' ? '📖 In Progress' : 'Not Started'}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                      <div className="progress-bar-container" style={{ flex: 1, height: '8px' }}>
                        <div className="progress-bar-fill" style={{
                          width: `${course.progress}%`,
                          background: course.status === 'completed' ? '#16a34a' : 'var(--accent-primary)',
                          transition: 'width 0.5s ease'
                        }}></div>
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: 600, width: '40px', textAlign: 'right' }}>{course.progress}%</span>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {course.status !== 'completed' && (
                        <>
                          <button
                            onClick={() => updateProgress(course.id, course.progress + 25)}
                            style={{
                              fontSize: '12px', padding: '4px 12px', borderRadius: '6px',
                              background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe',
                              fontWeight: 600, cursor: 'pointer'
                            }}
                          >
                            +25% Progress
                          </button>
                          <button
                            onClick={() => completeCourse(course.id)}
                            style={{
                              fontSize: '12px', padding: '4px 12px', borderRadius: '6px',
                              background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0',
                              fontWeight: 600, cursor: 'pointer'
                            }}
                          >
                            ✅ Mark Complete
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => removeCourse(course.id)}
                        style={{
                          fontSize: '12px', padding: '4px 12px', borderRadius: '6px',
                          background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca',
                          fontWeight: 600, cursor: 'pointer'
                        }}
                      >
                        ✕ Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px', background: '#f8fafc', borderRadius: '8px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}>No active courses.</p>
                <p style={{ color: '#94a3b8', fontSize: '12px' }}>Go to the Skill Overview tab and click "Start Course" on a recommendation to begin tracking.</p>
              </div>
            )}
          </div>

          {/* ── Assessment History ── */}
          <div className="glass-card">
            <h3 style={{ marginBottom: '16px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📈</span> Recent Assessments
            </h3>
            {trackerData?.score_trend?.length > 0 ? (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                 {trackerData.score_trend.slice(0, 4).map((record, i) => (
                   <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                     <div>
                       <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{new Date(record.date).toLocaleDateString()}</div>
                       <div style={{ fontSize: '14px', fontWeight: 600 }}>Assessment {trackerData.total_assessments - i}</div>
                     </div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                       <div style={{ fontWeight: 700, fontSize: '18px', color: record.score >= 75 ? '#16a34a' : record.score >= 50 ? '#d97706' : '#dc2626' }}>
                         {record.score}%
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
            ) : (
               <div style={{ textAlign: 'center', padding: '30px' }}>
                 <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>You haven't taken any assessments yet.</p>
                 <button onClick={() => navigate('/app/assessment')} className="btn btn-secondary">Start Assessment</button>
               </div>
            )}
          </div>
        </div>
        
        {/* AI Insights */}
        <div className="glass-card mb-24" style={{ borderLeft: '4px solid #1e3a8a' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🤖</span> AI Performance Insights
          </h3>
          {trackerData && trackerData.ai_insights?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {trackerData.ai_insights.map((insight, i) => (
                <p key={i} style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  • {insight}
                </p>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Complete an assessment to unlock AI insights.</p>
          )}

          {trackerData?.ai_recommendations?.length > 0 && (
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
              <p style={{ fontSize: '13px', color: '#1e3a8a', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 700 }}>
                Course & Assessment Actions
              </p>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', margin: 0 }}>
                {trackerData.ai_recommendations.map((rec, i) => (
                  <li key={i} style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default Learner;
