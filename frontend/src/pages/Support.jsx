import React, { useState, useEffect } from 'react';
import { fetchResource } from '../services/api';
import useAuth from '../hooks/useAuth';

const CATEGORIES = [
  { value: 'question', label: '❓ General Question', desc: 'Ask about platform features' },
  { value: 'bug', label: '🐛 Bug Report', desc: 'Report something not working' },
  { value: 'feature', label: '💡 Feature Request', desc: 'Suggest improvements' },
  { value: 'feedback', label: '📝 Feedback', desc: 'Share your experience' },
];

const Support = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    subject: '', category: 'question', message: '', priority: 'medium',
  });

  const userId = user?.id || JSON.parse(localStorage.getItem('user') || '{}').id;
  const userName = user?.full_name || JSON.parse(localStorage.getItem('user') || '{}').full_name || '';
  const userEmail = user?.email || JSON.parse(localStorage.getItem('user') || '{}').email || '';

  useEffect(() => {
    fetchTickets();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetchResource(`/support/tickets/user/${userId}`);
      setTickets(res.tickets || []);
    } catch {
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess('');
    try {
      await fetchResource('/support/tickets', {
        method: 'POST',
        body: JSON.stringify({
          user_id: userId,
          user_name: userName,
          user_email: userEmail,
          subject: formData.subject,
          category: formData.category,
          message: formData.message,
          priority: formData.priority,
        }),
      });
      setSuccess('Ticket submitted successfully! Our team will respond shortly.');
      setFormData({ subject: '', category: 'question', message: '', priority: 'medium' });
      setShowForm(false);
      fetchTickets();
    } catch {
      setSuccess('');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      open: 'badge-high', in_progress: 'badge-medium',
      resolved: 'badge-low', closed: 'badge-skill',
    };
    return map[status] || 'badge-skill';
  };

  const getPriorityBadge = (priority) => {
    const map = {
      urgent: 'badge-critical', high: 'badge-high',
      medium: 'badge-medium', low: 'badge-low',
    };
    return map[priority] || 'badge-medium';
  };

  return (
    <div>
      <div className="page-header">
        <h2>🎧 Customer Support</h2>
        <p>Need help? Submit a ticket and our team will get back to you</p>
      </div>

      {/* Success Message */}
      {success && (
        <div style={{
          background: 'var(--bg-glass-hover)', border: '1px solid var(--border-color)',
          color: 'var(--severity-low)', padding: '12px 16px', borderRadius: 'var(--radius-sm)',
          marginBottom: '24px', fontSize: '14px',
        }}>
          ✅ {success}
        </div>
      )}

      {/* Quick Actions */}
      <div className="glass-card mb-24">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '16px', marginBottom: '4px' }}>How can we help?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>
              Choose a category below or create a support ticket
            </p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? '✕ Cancel' : '➕ New Ticket'}
          </button>
        </div>

        {!showForm && (
          <div className="grid-4" style={{ marginTop: '20px' }}>
            {CATEGORIES.map(cat => (
              <div key={cat.value} className="stat-card" style={{ cursor: 'pointer', animation: 'none' }}
                onClick={() => { setFormData({ ...formData, category: cat.value }); setShowForm(true); }}>
                <span style={{ fontSize: '24px' }}>{cat.label.split(' ')[0]}</span>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>{cat.label.split(' ').slice(1).join(' ')}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{cat.desc}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ticket Form */}
      {showForm && (
        <div className="glass-card mb-24" style={{ animation: 'fadeInUp 0.3s ease' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '16px' }}>📬 Submit a Ticket</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Subject</label>
              <input type="text" className="form-input" value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Brief description of your issue" required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select className="form-select" value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea className="form-input" value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe your issue or question in detail..."
                rows={5} required style={{ resize: 'vertical', minHeight: '100px' }} />
            </div>

            <button type="submit" disabled={submitting} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
              {submitting ? (
                <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></div> Submitting...</>
              ) : '📨 Submit Ticket'}
            </button>
          </form>
        </div>
      )}

      {/* Tickets List */}
      <div>
        <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>📋 Your Tickets</h3>

        {loading && (
          <div className="glass-card text-center" style={{ padding: '40px' }}>
            <div className="spinner spinner-lg" style={{ margin: '0 auto 12px' }}></div>
            <p style={{ color: 'var(--text-secondary)' }}>Loading tickets...</p>
          </div>
        )}

        {!loading && tickets.length === 0 && (
          <div className="glass-card text-center" style={{ padding: '40px' }}>
            <p style={{ fontSize: '36px', marginBottom: '12px' }}>📭</p>
            <p style={{ color: 'var(--text-secondary)' }}>No tickets yet. Create one if you need help!</p>
          </div>
        )}

        {!loading && tickets.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tickets.map((ticket) => (
              <div key={ticket.id} className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px', fontSize: '15px' }}>#{ticket.id} — {ticket.subject}</h4>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <span className={`badge ${getStatusBadge(ticket.status)}`}>{ticket.status}</span>
                      <span className={`badge ${getPriorityBadge(ticket.priority)}`}>{ticket.priority}</span>
                      <span className="badge badge-skill">{ticket.category}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : ''}
                  </span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, margin: '8px 0 0' }}>
                  {ticket.message}
                </p>
                {ticket.admin_reply && (
                  <div style={{
                    marginTop: '12px', padding: '12px 16px',
                    background: 'var(--bg-glass-hover)', borderRadius: 'var(--radius-sm)',
                    borderLeft: '3px solid var(--accent-primary)',
                  }}>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>
                      💬 ADMIN REPLY
                    </p>
                    <p style={{ color: 'var(--text-primary)', fontSize: '14px', margin: 0, lineHeight: 1.6 }}>
                      {ticket.admin_reply}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Support;
