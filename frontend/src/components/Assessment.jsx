import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchResource } from '../services/api';
import useAuth from '../hooks/useAuth';

const Assessment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Stages: 'setup' -> 'quiz' -> 'result'
  const [stage, setStage] = useState('setup');
  const [sessionId, setSessionId] = useState(null);
  
  // Setup Options
  const [assessmentMode, setAssessmentMode] = useState('adaptive'); // 'adaptive' | 'batch'
  const [selectedDifficulty, setSelectedDifficulty] = useState('Intermediate');
  
  // Batch State
  const [batchQuestions, setBatchQuestions] = useState([]);
  const [batchIndex, setBatchIndex] = useState(0);
  const [batchScore, setBatchScore] = useState(0);
  
  // Adaptive State
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentSkill, setCurrentSkill] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  
  // Correction State
  const [correctionMode, setCorrectionMode] = useState(false);
  const [pendingNextData, setPendingNextData] = useState(null);

  // Real-time Feedback Animation
  const [feedbackMsg, setFeedbackMsg] = useState('');
  
  // Timing
  const [timeTaken, setTimeTaken] = useState(0);
  const timerRef = useRef(null);

  // Result
  const [proficiencies, setProficiencies] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const userSkills = (() => {
    try {
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      return stored.skills || user?.skills || [];
    } catch {
      return [];
    }
  })();

  const startTimer = () => {
    setTimeTaken(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setTimeTaken(prev => prev + 1), 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    return () => stopTimer();
  }, []);

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const startAssessment = () => {
    if (assessmentMode === 'adaptive') {
      startAdaptiveAssessment();
    } else {
      startBatchAssessment();
    }
  };

  const startBatchAssessment = async () => {
    setLoading(true);
    try {
      const skillsToTest = userSkills.length > 0 ? userSkills : ['Python'];
      
      const res = await fetchResource('/assessments/generate', {
        method: 'POST',
        body: JSON.stringify({
          skills: skillsToTest,
          num_total: 10,
          difficulty: selectedDifficulty
        }),
      });

      if (res.status === 'success' && res.questions && res.questions.length > 0) {
        setBatchQuestions(res.questions);
        setBatchIndex(0);
        setBatchScore(0);
        setCurrentQuestion(res.questions[0]);
        setCurrentSkill(res.questions[0].skill || 'Technical');
        setStage('quiz');
        setCorrectionMode(false);
        setPendingNextData(null);
        startTimer();
      }
    } catch (err) {
      console.error('Failed to start batch session', err);
    } finally {
      setLoading(false);
    }
  };

  const startAdaptiveAssessment = async () => {
    setLoading(true);
    try {
      const skillsToTest = userSkills.length > 0 ? userSkills : ['Python', 'SQL'];
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      
      const res = await fetchResource('/assessments/adaptive/start', {
        method: 'POST',
        body: JSON.stringify({
          user_id: storedUser.id || 1,
          domain: 'Technology',
          role: 'Software Engineer',
          skills: skillsToTest
        }),
      });

      if (res.status === 'success') {
        setSessionId(res.session_id);
        setCurrentSkill(res.current_skill);
        setCurrentQuestion(res.question);
        setStage('quiz');
        setCorrectionMode(false);
        setPendingNextData(null);
        startTimer();
      }
    } catch (err) {
      console.error('Failed to start adaptive session', err);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (selectedOption === null) return;
    stopTimer();
    setSubmitting(true);

    const isCorrect = currentQuestion.options[selectedOption] === currentQuestion.options[currentQuestion.correct_answer];
    
    // Quick feedback toast
    if (isCorrect) {
      setFeedbackMsg(`✅ Correct! ${assessmentMode === 'adaptive' ? 'Calibrating difficulty...' : 'Moving forward...'}`);
    }

    if (assessmentMode === 'batch') {
      if (isCorrect) {
        setBatchScore(prev => prev + 1);
        setTimeout(() => handleBatchContinue(), 1500);
      } else {
        setSubmitting(false);
        setCorrectionMode(true);
      }
      return; // End of batch submit logic
    }

    // Adaptive Mode Submit Logic
    try {
      const res = await fetchResource('/assessments/adaptive/submit', {
        method: 'POST',
        body: JSON.stringify({
          session_id: sessionId,
          is_correct: isCorrect,
          time_taken_seconds: timeTaken,
          difficulty: currentQuestion.difficulty || 'Intermediate',
          skill: currentSkill
        }),
      });

      if (isCorrect) {
        setTimeout(async () => {
          setFeedbackMsg('');
          if (res.status === 'completed') {
            setProficiencies(res.proficiency_scores);
            setStage('result');
            await saveToTracker(res.proficiency_scores, Object.keys(res.proficiency_scores).length * 5);
          } else {
            setCurrentSkill(res.current_skill);
            setCurrentQuestion(res.question);
            setSelectedOption(null);
            startTimer();
          }
          setSubmitting(false);
        }, 1500); 
      } else {
        setSubmitting(false);
        setCorrectionMode(true);
        setPendingNextData(res);
      }

    } catch (err) {
      console.error('Failed to submit answer', err);
      setSubmitting(false);
      startTimer();
    }
  };

  const handleBatchContinue = async () => {
    setFeedbackMsg('');
    setCorrectionMode(false);
    setSubmitting(false);
    
    const nextIndex = batchIndex + 1;
    if (nextIndex < batchQuestions.length) {
      setBatchIndex(nextIndex);
      setCurrentQuestion(batchQuestions[nextIndex]);
      setCurrentSkill(batchQuestions[nextIndex].skill || 'Technical');
      setSelectedOption(null);
      startTimer();
    } else {
      // Finish Batch Test
      // Calculate a flat proficiency map based on their score
      const finalScore = (batchScore + (correctionMode ? 0 : (currentQuestion.options[selectedOption] === currentQuestion.options[currentQuestion.correct_answer] ? 1 : 0)));
      const accuracy = finalScore / batchQuestions.length;
      
      const hierarchy = ['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master'];
      const targetLevelIndex = hierarchy.indexOf(selectedDifficulty);
      
      let attainedLevel = selectedDifficulty;
      if (accuracy < 0.6) {
        // Drop them a level if they fail
        attainedLevel = targetLevelIndex > 0 ? hierarchy[targetLevelIndex - 1] : 'Beginner';
      }

      const dummyProfs = {};
      userSkills.forEach(s => dummyProfs[s] = attainedLevel);
      if (Object.keys(dummyProfs).length === 0) dummyProfs['Technical'] = attainedLevel;

      setProficiencies(dummyProfs);
      setStage('result');
      await saveToTracker(dummyProfs, batchQuestions.length);
    }
  };

  const continueFromCorrection = async () => {
    if (assessmentMode === 'batch') {
      handleBatchContinue();
      return;
    }

    // Adaptive correction
    setCorrectionMode(false);
    if (pendingNextData?.status === 'completed') {
      setProficiencies(pendingNextData.proficiency_scores);
      setStage('result');
      await saveToTracker(pendingNextData.proficiency_scores, Object.keys(pendingNextData.proficiency_scores).length * 5);
    } else if (pendingNextData) {
      setCurrentSkill(pendingNextData.current_skill);
      setCurrentQuestion(pendingNextData.question);
      setSelectedOption(null);
      startTimer();
    }
  };

  const saveToTracker = async (profs, totalQs) => {
    const levelMap = { 'Beginner': 30, 'Intermediate': 60, 'Advanced': 85, 'Expert': 100, 'Master': 100 };
    let totalScore = 0;
    let count = 0;
    const perSkill = {};

    for (const [skill, level] of Object.entries(profs)) {
      const numScore = levelMap[level] || 50;
      totalScore += numScore;
      count += 1;
      perSkill[skill] = { score: numScore, level: level };
    }

    const avgScore = count > 0 ? Math.round(totalScore / count) : 0;
    const finalResult = {
      score: avgScore,
      passed: avgScore >= 60,
      total_questions: totalQs,
      correct_count: Math.round(totalQs * (avgScore/100)),
      feedback: `You achieved ${Object.values(profs)[0] || 'Intermediate'} status across your test.`,
      per_skill: perSkill,
    };

    const userId = JSON.parse(localStorage.getItem('user') || '{}').id;
    if (userId) {
      await fetchResource('/tracking/save-assessment', {
        method: 'POST',
        body: JSON.stringify({ user_id: userId, result: finalResult }),
      }).catch(() => {});
    }
  };

  // ─── Setup Screen ─────────────────────────
  if (stage === 'setup') {
    return (
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div className="page-header">
          <h2>🧠 Intelligence Engine</h2>
          <p>Choose your assessment protocol</p>
        </div>

        <div className="glass-card" style={{ padding: '48px 32px' }}>
          <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
            <div 
              className="glass-card" 
              onClick={() => setAssessmentMode('adaptive')}
              style={{ flex: 1, padding: '24px', border: assessmentMode === 'adaptive' ? '2px solid var(--primary-color)' : '1px solid var(--border-color)', cursor: 'pointer', opacity: assessmentMode === 'adaptive' ? 1 : 0.6, transition: 'all 0.2s' }}
            >
              <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>⚡ Adaptive Mode</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Dynamically scales difficulty up or down per question based on your accuracy using IRT.</p>
            </div>
            <div 
              className="glass-card" 
              onClick={() => setAssessmentMode('batch')}
              style={{ flex: 1, padding: '24px', border: assessmentMode === 'batch' ? '2px solid var(--primary-color)' : '1px solid var(--border-color)', cursor: 'pointer', opacity: assessmentMode === 'batch' ? 1 : 0.6, transition: 'all 0.2s' }}
            >
              <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>🎯 Level-Based Test</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Take a rigorous 10-question test locked strictly to a specific difficulty level of your choice.</p>
            </div>
          </div>

          {assessmentMode === 'batch' && (
            <div style={{ marginBottom: '32px', textAlign: 'center' }}>
              <label style={{ display: 'block', marginBottom: '12px', fontSize: '14px', color: 'var(--text-muted)' }}>SELECT TARGET DIFFICULTY</label>
              <select 
                value={selectedDifficulty} 
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                style={{ width: '200px', padding: '12px', borderRadius: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
                <option value="Master">Master</option>
              </select>
            </div>
          )}

          <div style={{ textAlign: 'center' }}>
            {userSkills.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Testing Competencies:
                </p>
                <div className="matched-skills" style={{ justifyContent: 'center' }}>
                  {userSkills.map(s => <span key={s} className="badge badge-skill">{s}</span>)}
                </div>
              </div>
            )}

            <button onClick={startAssessment} disabled={loading} className="btn btn-primary" style={{ padding: '14px 40px', fontSize: '16px' }}>
              {loading ? <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></div> Initializing Engine...</> : (assessmentMode === 'adaptive' ? '🚀 Start Adaptive Run' : '🎯 Start Target Test')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Results Screen ───────────────────────
  if (stage === 'result' && proficiencies) {
    const levelColors = {
      'Master': '#f43f5e',
      'Expert': '#a855f7', 
      'Advanced': '#3b82f6', 
      'Intermediate': 'var(--severity-medium)', 
      'Beginner': 'var(--severity-low)', 
      'Needs Improvement': 'var(--severity-high)'
    };

    return (
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div className="page-header text-center">
          <h2>Assessment Complete!</h2>
          <p>Here are your established proficiency levels</p>
        </div>

        <div className="glass-card mb-24">
          <h3 style={{ marginBottom: '20px', fontSize: '18px', textAlign: 'center' }}>Skill Mastery</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {Object.entries(proficiencies).map(([skill, level], i) => (
              <div key={skill} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-glass-hover)', borderRadius: '8px', animation: `fadeIn 0.3s ease forwards ${i*0.1}s`, opacity: 0 }}>
                <span style={{ fontSize: '16px', fontWeight: 500 }}>{skill}</span>
                <span className="badge" style={{ backgroundColor: levelColors[level] || '#555', color: '#fff', fontSize: '14px', padding: '6px 16px' }}>
                  {level}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button onClick={() => { setStage('setup'); }} className="btn btn-secondary">🔄 Start Next Run</button>
          <button onClick={() => navigate('/app/analyzer')} className="btn btn-primary">🤖 View Skill Dashboard</button>
        </div>
      </div>
    );
  }

  // ─── Quiz Screen ──────────────────────────
  if (!currentQuestion) return null;

  const difficultyColors = {
    'Beginner': 'var(--severity-low)',
    'Intermediate': 'var(--severity-medium)',
    'Advanced': 'var(--severity-high)',
    'Expert': '#a855f7', 
    'Master': '#f43f5e'  
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div className="page-header">
        <h2>{assessmentMode === 'adaptive' ? '⚡ Adaptive Protocol' : '🎯 Target Protocol'}</h2>
        <p>{assessmentMode === 'adaptive' ? 'Difficulty scales dynamically' : `Locked at ${currentQuestion.difficulty} difficulty`}</p>
      </div>

      <div className="glass-card mb-24" style={{ position: 'relative', overflow: 'hidden' }}>
        {feedbackMsg && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, animation: 'fadeIn 0.2s ease' }}>
            <h3 style={{ fontSize: '24px', color: 'var(--text-primary)', textAlign: 'center' }}>{feedbackMsg}</h3>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span className="badge badge-skill" style={{ fontSize: '14px' }}>{currentSkill}</span>
            <span style={{ fontSize: '12px', color: difficultyColors[currentQuestion.difficulty || 'Intermediate'], fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
              • {currentQuestion.difficulty || 'Intermediate'}
            </span>
          </div>
          <div style={{ fontSize: '16px', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
            {assessmentMode === 'batch' && <span style={{ marginRight: '16px', color: 'var(--primary-color)' }}>{batchIndex + 1} / {batchQuestions.length}</span>}
            ⏱ {formatTime(timeTaken)}
          </div>
        </div>

        <h3 style={{ marginBottom: '24px', fontSize: '18px', lineHeight: 1.6 }}>
          {currentQuestion.question}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {currentQuestion.options.map((option, i) => {
            const isSelected = selectedOption === i;
            const isCorrectOption = currentQuestion.correct_answer === i;
            
            let highlightStyle = {};
            if (correctionMode) {
              if (isCorrectOption) {
                highlightStyle = { border: '1px solid #10b981', background: 'rgba(16, 185, 129, 0.1)' };
              } else if (isSelected && !isCorrectOption) {
                highlightStyle = { border: '1px solid #f43f5e', background: 'rgba(244, 63, 94, 0.1)' };
              }
            } else if (isSelected) {
              highlightStyle = { border: '1px solid var(--primary-color)' };
            }

            return (
              <label
                key={i}
                className={`quiz-option ${isSelected && !correctionMode ? 'selected' : ''}`}
                onClick={() => !correctionMode && setSelectedOption(i)}
                style={{ padding: '16px', fontSize: '15px', cursor: correctionMode ? 'default' : 'pointer', ...highlightStyle }}
              >
                {!correctionMode && <input type="radio" name="answer" checked={isSelected} readOnly />}
                {!correctionMode && <span className="radio-dot"></span>}
                {correctionMode && isCorrectOption && <span style={{ marginRight: '10px' }}>✅</span>}
                {correctionMode && isSelected && !isCorrectOption && <span style={{ marginRight: '10px' }}>❌</span>}
                {option}
              </label>
            );
          })}
        </div>

        {correctionMode && (
          <div style={{ marginTop: '24px', padding: '20px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', animation: 'fadeIn 0.4s ease' }}>
            <h4 style={{ color: '#ef4444', marginBottom: '12px', fontSize: '18px' }}>Explanation</h4>
            <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
              {currentQuestion.explanation || 'No further explanation natively provided. Research the topic link below.'}
            </p>
            
            {currentQuestion.reference_query && (
              <a 
                href={`https://www.google.com/search?q=${encodeURIComponent(currentQuestion.reference_query)}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ display: 'inline-flex', padding: '8px 16px', fontSize: '13px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
              >
                🔍 Search Google: "{currentQuestion.reference_query}"
              </a>
            )}
            
            <div style={{ marginTop: '24px', textAlign: 'right' }}>
              <button onClick={continueFromCorrection} className="btn btn-primary">
                Acknowledge & Continue →
              </button>
            </div>
          </div>
        )}

        {!correctionMode && (
          <div style={{ marginTop: '32px', textAlign: 'right' }}>
            <button 
              onClick={submitAnswer} 
              disabled={submitting || selectedOption === null} 
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              {submitting ? 'Checking...' : 'Submit Answer →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assessment;
