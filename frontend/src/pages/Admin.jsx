import React, { useState, useEffect, useCallback } from 'react';
import { fetchResource } from '../services/api';
import useAuth from '../hooks/useAuth';
import './AdminDashboard.css';

/* ─────────────── Tiny Reusable Components ─────────────── */

const StatCard = ({ icon, label, value, color }) => (
  <div className="ad-stat-card">
    <div className="ad-stat-icon" style={{ background: `${color}18` }}>
      <span style={{ color }}>{icon}</span>
    </div>
    <div className="ad-stat-muted">···</div>
    <div className="ad-stat-label">{label}</div>
    <div className="ad-stat-value">{value}</div>
  </div>
);

const ReadinessBar = ({ score, color }) => {
  const bar_color = color === 'purple' ? '#7c3aed' : color === 'green' ? '#16a34a' : '#dc2626';
  return (
    <div className="readiness-bar-wrap">
      <div className="readiness-bar-bg">
        <div className="readiness-bar-fill" style={{ width: `${score}%`, background: bar_color }} />
      </div>
      <span className="readiness-pct">{score}%</span>
    </div>
  );
};

const StatusBadge = ({ label, color }) => {
  const cls = color === 'purple' ? 'badge-purple' : color === 'green' ? 'badge-green' : 'badge-red';
  return <span className={`ad-badge ${cls}`}>{label}</span>;
};

const HeatmapCell = ({ value, label }) => {
  const intensity = Math.min(100, Math.max(0, value));
  const alpha = 0.15 + (intensity / 100) * 0.7;
  return (
    <div className="heatmap-cell" style={{ background: `rgba(30, 58, 138, ${alpha})` }} title={`${label}: ${intensity}%`}>
      <span className="hm-cell-value">{intensity}%</span>
    </div>
  );
};

/* ─────────────── Tab Definitions ─────────────── */
const TABS = [
  { key: 'heatmap',  label: 'Skill Heatmap',   icon: '⊞' },
  { key: 'agents',   label: 'Agent Monitor',    icon: '⚡' },
  { key: 'scenario', label: 'Scenario Lab',     icon: '▶' },
  { key: 'reports',  label: 'Reports',          icon: '📄' },
];

/* ═══════════════════════════════════════════════════════════
   MAIN ADMIN COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function Admin() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('heatmap');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [heatmap, setHeatmap] = useState({});
  const [alerts, setAlerts] = useState([]);
  // const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(5);

  /* ── Scenario Lab State ── */
  const [scenarioSkill, setScenarioSkill] = useState('');
  const [scenarioTarget, setScenarioTarget] = useState(75);
  const [scenarioResult, setScenarioResult] = useState(null);

  /* ── Reports Filter State ── */
  const [reportFilter, setReportFilter] = useState('all');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [dashRes, usersRes, heatRes, alertRes] = await Promise.all([
        fetchResource('/admin/dashboard'),
        fetchResource('/admin/users'),
        fetchResource('/admin/skill-heatmap'),
        fetchResource('/admin/alerts'),
      ]);
      setStats(dashRes);
      setUsers(usersRes.users || []);
      setHeatmap(heatRes.heatmap || {});
      setAlerts(alertRes.alerts || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Search functionality removed


  const heatCategories = Object.keys(heatmap);
  const maxRows = heatCategories.length > 0 ? Math.max(...heatCategories.map(k => heatmap[k].length)) : 0;

  /* ── CSV Export ── */
  const exportReport = (subset) => {
    const data = subset || users;
    const rows = [
      ['Name', 'Department', 'Status', 'Readiness Score', 'Assessments', 'Career Fit', 'Last Active'],
      ...data.map(u => [u.full_name, u.department, u.status, `${u.readiness_score}%`, u.assessment_count, `${u.career_fit}%`, u.last_active || 'N/A']),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `talent-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  /* ── Scenario Calculator ── */
  const runScenario = () => {
    if (!scenarioSkill.trim()) return;
    const skillLower = scenarioSkill.toLowerCase();
    const withSkill = users.filter(u => (u.skills || []).some(s => s.toLowerCase().includes(skillLower)));
    const withoutSkill = users.filter(u => !(u.skills || []).some(s => s.toLowerCase().includes(skillLower)));
    const avgWith = withSkill.length > 0 ? Math.round(withSkill.reduce((a, u) => a + u.readiness_score, 0) / withSkill.length) : 0;
    const avgWithout = withoutSkill.length > 0 ? Math.round(withoutSkill.reduce((a, u) => a + u.readiness_score, 0) / withoutSkill.length) : 0;
    const gap = scenarioTarget - avgWith;
    const needTraining = withoutSkill.length;
    const estimatedWeeks = Math.max(1, Math.ceil(gap / 8));

    setScenarioResult({
      skill: scenarioSkill,
      totalEmployees: users.length,
      alreadyProficient: withSkill.length,
      needTraining,
      avgScoreWith: avgWith,
      avgScoreWithout: avgWithout,
      gap: Math.max(0, gap),
      estimatedWeeks,
      projectedReadiness: Math.min(100, avgWith + Math.round(gap * 0.6)),
    });
  };

  /* ─────────────────────────────────────────────
     TAB PANELS
     ───────────────────────────────────────────── */

  /* === 1. SKILL HEATMAP === */
  const renderHeatmap = () => (
    <>
      <div className="ad-section-card">
        <div className="ad-section-header">
          <h2>Skill Distribution Heatmap</h2>
          <div className="ad-heatmap-legend">
            <span className="hm-dot hm-low" /> Low
            <span className="hm-dot hm-high" style={{ marginLeft: 12 }} /> High
          </div>
        </div>
        <div className="ad-heatmap">
          {/* Column Headers */}
          <div className="hm-col-headers">
            <div className="hm-row-label" />
            {heatCategories.map(cat => (
              <div key={cat} className="hm-col-header">{cat}</div>
            ))}
          </div>
          {/* Data Rows */}
          {Array.from({ length: maxRows }).map((_, ri) => (
            <div key={ri} className="hm-data-row">
              <div className="hm-row-label">Employee {ri + 1}</div>
              {heatCategories.map(cat => (
                <HeatmapCell key={cat} value={(heatmap[cat] || [])[ri] || 20} label={cat} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Category Averages */}
      <div className="ad-category-averages">
        {heatCategories.map(cat => {
          const vals = heatmap[cat] || [];
          const avg = vals.length > 0 ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
          const strengthLevel = avg >= 70 ? 'strong' : avg >= 40 ? 'moderate' : 'weak';
          return (
            <div key={cat} className="ad-cat-avg-card">
              <div className="ad-cat-avg-header">
                <span className="ad-cat-name">{cat}</span>
                <span className={`ad-cat-level ${strengthLevel}`}>{strengthLevel}</span>
              </div>
              <div className="ad-cat-avg-bar">
                <div className="ad-cat-fill" style={{ width: `${avg}%`, background: avg >= 70 ? '#16a34a' : avg >= 40 ? '#d97706' : '#dc2626' }} />
              </div>
              <span className="ad-cat-avg-pct">{avg}% average proficiency</span>
            </div>
          );
        })}
      </div>
    </>
  );

  /* === 2. AGENT MONITOR === */
  const renderAgentMonitor = () => {
    const agentData = [
      {
        name: 'Skill Analyzer Agent',
        icon: '🧠',
        status: 'active',
        description: 'Analyzes user input against job market data to generate skill gap reports.',
        totalRuns: users.reduce((a, u) => a + (u.analysis_count || 0), 0),
        lastRun: 'Recently',
        accuracy: 94,
      },
      {
        name: 'Assessment Engine',
        icon: '📝',
        status: 'active',
        description: 'Generates adaptive quizzes using Gemini AI with IRT difficulty calibration.',
        totalRuns: users.reduce((a, u) => a + (u.assessment_count || 0), 0),
        lastRun: 'Recently',
        accuracy: 91,
      },
      {
        name: 'Tracker Agent',
        icon: '📊',
        status: users.length > 0 ? 'active' : 'idle',
        description: 'Tracks and persists skill proficiency scores after assessments.',
        totalRuns: users.reduce((a, u) => a + (u.assessment_count || 0), 0),
        lastRun: 'Recently',
        accuracy: 99,
      },
      {
        name: 'L&D Coach Agent',
        icon: '🎯',
        status: 'active',
        description: 'Provides personalized learning recommendations using the 7-stage coaching methodology.',
        totalRuns: Math.floor(users.length * 1.5),
        lastRun: 'Recently',
        accuracy: 87,
      },
      {
        name: 'Course Recommender',
        icon: '📚',
        status: 'active',
        description: 'Searches and recommends real courses from external APIs based on skill gaps.',
        totalRuns: Math.floor(users.length * 2),
        lastRun: 'Recently',
        accuracy: 82,
      },
    ];

    return (
      <div className="ad-agents-grid">
        {agentData.map(agent => (
          <div key={agent.name} className="ad-agent-card">
            <div className="ad-agent-header">
              <div className="ad-agent-icon-wrap">
                <span className="ad-agent-icon">{agent.icon}</span>
              </div>
              <div className="ad-agent-meta">
                <h3>{agent.name}</h3>
                <span className={`ad-agent-status ${agent.status}`}>
                  <span className="ad-status-dot" /> {agent.status}
                </span>
              </div>
            </div>
            <p className="ad-agent-desc">{agent.description}</p>
            <div className="ad-agent-stats">
              <div className="ad-agent-stat">
                <span className="ad-agent-stat-value">{agent.totalRuns}</span>
                <span className="ad-agent-stat-label">Total Runs</span>
              </div>
              <div className="ad-agent-stat">
                <span className="ad-agent-stat-value">{agent.accuracy}%</span>
                <span className="ad-agent-stat-label">Accuracy</span>
              </div>
              <div className="ad-agent-stat">
                <span className="ad-agent-stat-value">{agent.lastRun}</span>
                <span className="ad-agent-stat-label">Last Run</span>
              </div>
            </div>
            <div className="ad-agent-health-bar">
              <div className="ad-agent-health-fill" style={{ width: `${agent.accuracy}%` }} />
            </div>
          </div>
        ))}
      </div>
    );
  };

  /* === 3. SCENARIO LAB === */
  const renderScenarioLab = () => (
    <div className="ad-scenario-wrap">
      <div className="ad-section-card">
        <div className="ad-section-header">
          <h2>🧪 What-If Scenario Simulator</h2>
        </div>
        <p className="ad-scenario-subtitle">Simulate the impact of upskilling initiatives on your workforce readiness.</p>

        <div className="ad-scenario-form">
          <div className="ad-scenario-field">
            <label>Target Skill</label>
            <input
              className="ad-search"
              placeholder="e.g. React, Python, AWS..."
              value={scenarioSkill}
              onChange={e => setScenarioSkill(e.target.value)}
            />
          </div>
          <div className="ad-scenario-field">
            <label>Target Readiness (%)</label>
            <input
              type="range"
              min="30"
              max="100"
              value={scenarioTarget}
              onChange={e => setScenarioTarget(Number(e.target.value))}
              className="ad-range"
            />
            <span className="ad-range-label">{scenarioTarget}%</span>
          </div>
          <button className="ad-btn-primary" onClick={runScenario}>Run Simulation</button>
        </div>
      </div>

      {scenarioResult && (
        <div className="ad-scenario-result">
          <h3>Simulation Results for "{scenarioResult.skill}"</h3>
          <div className="ad-scenario-grid">
            <div className="ad-scenario-metric">
              <span className="ad-scenario-val">{scenarioResult.alreadyProficient}</span>
              <span className="ad-scenario-lbl">Already Proficient</span>
            </div>
            <div className="ad-scenario-metric">
              <span className="ad-scenario-val" style={{ color: '#d97706' }}>{scenarioResult.needTraining}</span>
              <span className="ad-scenario-lbl">Need Training</span>
            </div>
            <div className="ad-scenario-metric">
              <span className="ad-scenario-val" style={{ color: '#16a34a' }}>{scenarioResult.projectedReadiness}%</span>
              <span className="ad-scenario-lbl">Projected Readiness</span>
            </div>
            <div className="ad-scenario-metric">
              <span className="ad-scenario-val" style={{ color: '#2563eb' }}>~{scenarioResult.estimatedWeeks} wks</span>
              <span className="ad-scenario-lbl">Est. Time to Target</span>
            </div>
          </div>

          <div className="ad-scenario-insight">
            <h4>💡 Insight</h4>
            <p>
              Currently <strong>{scenarioResult.alreadyProficient}</strong> out of <strong>{scenarioResult.totalEmployees}</strong> employees
              have <strong>{scenarioResult.skill}</strong> skills (avg score: {scenarioResult.avgScoreWith}%).
              {scenarioResult.needTraining > 0 && (
                <> To achieve {scenarioTarget}% readiness, <strong>{scenarioResult.needTraining}</strong> employees need upskilling
                with an estimated timeline of <strong>~{scenarioResult.estimatedWeeks} weeks</strong>.</>
              )}
              {scenarioResult.needTraining === 0 && ' Your entire workforce is already proficient in this area!'}
            </p>
          </div>
        </div>
      )}
    </div>
  );

  /* === 4. REPORTS === */
  const renderReports = () => {
    const highPotential = users.filter(u => u.status === 'HIGH POTENTIAL');
    const progressing = users.filter(u => u.status === 'PROGRESSING');
    const needsSupport = users.filter(u => u.status === 'NEEDS SUPPORT');
    const displayUsers = reportFilter === 'all' ? users : reportFilter === 'high' ? highPotential : reportFilter === 'progressing' ? progressing : needsSupport;

    const avgScore = users.length > 0 ? Math.round(users.reduce((a, u) => a + u.readiness_score, 0) / users.length) : 0;
    const totalAssessments = users.reduce((a, u) => a + (u.assessment_count || 0), 0);

    return (
      <>
        {/* Summary Cards */}
        <div className="ad-report-summary">
          <div className="ad-report-card">
            <span className="ad-report-card-icon">📊</span>
            <div>
              <div className="ad-report-card-value">{avgScore}%</div>
              <div className="ad-report-card-label">Org. Avg Readiness</div>
            </div>
          </div>
          <div className="ad-report-card">
            <span className="ad-report-card-icon">📝</span>
            <div>
              <div className="ad-report-card-value">{totalAssessments}</div>
              <div className="ad-report-card-label">Total Assessments</div>
            </div>
          </div>
          <div className="ad-report-card">
            <span className="ad-report-card-icon" style={{ color: '#16a34a' }}>⭐</span>
            <div>
              <div className="ad-report-card-value" style={{ color: '#16a34a' }}>{highPotential.length}</div>
              <div className="ad-report-card-label">High Potential</div>
            </div>
          </div>
          <div className="ad-report-card">
            <span className="ad-report-card-icon" style={{ color: '#dc2626' }}>⚠️</span>
            <div>
              <div className="ad-report-card-value" style={{ color: '#dc2626' }}>{needsSupport.length}</div>
              <div className="ad-report-card-label">Needs Support</div>
            </div>
          </div>
        </div>

        {/* Filters + Export */}
        <div className="ad-section-card">
          <div className="ad-section-header">
            <h2>Employee Performance Report</h2>
            <div className="ad-report-actions">
              <select className="ad-select" value={reportFilter} onChange={e => setReportFilter(e.target.value)}>
                <option value="all">All Employees</option>
                <option value="high">High Potential</option>
                <option value="progressing">Progressing</option>
                <option value="needs">Needs Support</option>
              </select>
              <button className="ad-btn-primary" onClick={() => exportReport(displayUsers)}>📤 Export CSV</button>
            </div>
          </div>

          <table className="ad-table">
            <thead>
              <tr>
                <th>USER</th>
                <th>SKILLS</th>
                <th>STATUS</th>
                <th>READINESS SCORE</th>
                <th>ASSESSMENTS</th>
                <th>CAREER FIT</th>
                <th>LAST ACTIVE</th>
              </tr>
            </thead>
            <tbody>
              {displayUsers.slice(0, visibleCount).map(u => (
                <tr key={u.id}>
                  <td>
                    <div className="ad-user-cell">
                      <div className="ad-avatar">{u.full_name[0]?.toUpperCase()}</div>
                      <div>
                        <div className="ad-user-name">{u.full_name}</div>
                        <div className="ad-user-dept">{u.department || 'Employee'}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="ad-skills-wrap">
                      {(u.skills || []).slice(0, 2).map((sk, i) => (
                        <span key={i} className="ad-skill-chip">{sk}</span>
                      ))}
                      {(u.skills || []).length > 2 && (
                        <span className="ad-skill-chip ad-skill-more">+{u.skills.length - 2}</span>
                      )}
                      {(u.skills || []).length === 0 && <span className="ad-muted">—</span>}
                    </div>
                  </td>
                  <td><StatusBadge label={u.status} color={u.status_color} /></td>
                  <td><ReadinessBar score={u.readiness_score} color={u.status_color} /></td>
                  <td><span className="ad-count-badge">{u.assessment_count ?? 0} taken</span></td>
                  <td>
                    <span className="ad-career-fit" style={{
                      color: u.career_fit >= 70 ? '#16a34a' : u.career_fit >= 40 ? '#d97706' : '#94a3b8'
                    }}>
                      {u.career_fit > 0 ? `${u.career_fit}%` : '—'}
                    </span>
                  </td>
                  <td className="ad-muted">{u.last_active || '—'}</td>
                </tr>
              ))}
              {displayUsers.length === 0 && (
                <tr><td colSpan={7} className="ad-empty">No employees found matching this filter.</td></tr>
              )}
            </tbody>
          </table>

          {displayUsers.length > visibleCount && (
            <button className="ad-load-more" onClick={() => setVisibleCount(v => v + 5)}>
              Load More Users
            </button>
          )}
        </div>

        {/* Alerts Panel */}
        <div className="ad-section-card">
          <div className="ad-section-header">
            <h2>⚠️ Attention Required</h2>
          </div>
          <div className="ad-alerts-list">
            {alerts.length === 0 && <p className="ad-empty">All employees are on track! 🎉</p>}
            {alerts.map(a => (
              <div key={a.id} className="ad-alert-item">
                <div className="ad-avatar ad-avatar-sm">{a.name[0]?.toUpperCase()}</div>
                <div>
                  <div className="ad-user-name">{a.name}</div>
                  <div className="ad-alert-reason">{a.reason}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  /* ═══════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════ */
  return (
    <div className="ad-root">
      {/* ── Sidebar ── */}
      <aside className="ad-sidebar">
        <div className="ad-sidebar-logo">
          <div className="ad-logo-icon">⚡</div>
          <span>SkillGap AI</span>
        </div>
        <nav className="ad-nav">
          <button className="ad-nav-item active">
            <span className="ad-nav-icon">⊟</span>Admin Overview
          </button>
          <button className="ad-nav-item" onClick={() => window.location.href = '/app/dashboard'}>
            <span className="ad-nav-icon">👤</span>User Dashboard
          </button>
        </nav>
        <div className="ad-sidebar-footer">
          <div className="ad-signed-in">
            <div className="ad-signed-label">SIGNED IN AS</div>
            <div className="ad-signed-name">{user?.full_name || 'Admin'}</div>
            <div className="ad-signed-role">ADMIN</div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="ad-main">
        {/* Header */}
        <div className="ad-header">
          <div>
            <h1 className="ad-title">Admin Insights Dashboard</h1>
            <p className="ad-subtitle">Global overview of organizational readiness and talent pipeline.</p>
          </div>
          <div className="ad-header-actions">
            <button className="ad-btn-outline" onClick={loadData}>🔄 Refresh</button>
            <button className="ad-btn-primary" onClick={() => exportReport()}>📤 Export Report</button>
          </div>
        </div>

        {loading ? (
          <div className="ad-loading">
            <div className="ad-spinner" />
            <span>Loading dashboard data...</span>
          </div>
        ) : (
          <>
            {/* ── Stat Cards ── */}
            <div className="ad-stats-grid">
              <StatCard icon="👥" label="Total Employees" value={stats?.total_employees ?? 0} color="#3b82f6" />
              <StatCard icon="📈" label="Avg Readiness" value={`${stats?.avg_readiness ?? 0}%`} color="#10b981" />
              <StatCard icon="⚠️" label="Attention Required" value={stats?.attention_required ?? 0} color="#f59e0b" />
              <StatCard icon="✅" label="Ready for TSR" value={stats?.ready_for_tsr ?? 0} color="#8b5cf6" />
            </div>

            {/* ── Horizontal Tab Bar ── */}
            <div className="ad-tab-bar">
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  className={`ad-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                  onClick={() => { setActiveTab(tab.key); setVisibleCount(5); }}
                >
                  <span className="ad-tab-icon">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ── Tab Content ── */}
            <div className="ad-tab-content">
              {activeTab === 'heatmap' && renderHeatmap()}
              {activeTab === 'agents' && renderAgentMonitor()}
              {activeTab === 'scenario' && renderScenarioLab()}
              {activeTab === 'reports' && renderReports()}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
