import React, { useState, useEffect, useRef } from 'react';
import useAuth from '../hooks/useAuth';
import { fetchResource } from '../services/api';


const LndCoach = () => {
  const { user, localId } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial Greeting
  useEffect(() => {
    if (messages.length === 0 && user) {
      const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Learner';
      const firstName = fullName.split(' ')[0];
      const greeting = `Hello ${firstName}! ⚡ I'm your HEXAPATH AI Coach. I've been reviewing your progress. How can I help you accelerate your learning today?`;
      
      setMessages([{ id: '1', text: greeting, sender: 'bot' }]);
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const addMessage = (text, sender) => {
    setMessages(prev => [...prev, { id: Date.now().toString() + Math.random(), text, sender }]);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputVal.trim() || loading) return;

    const userText = inputVal.trim();
    addMessage(userText, 'user');
    setInputVal('');
    setLoading(true);

    try {
      // Map history for Gemini
      const history = messages.map(m => ({
        role: m.sender === 'bot' ? 'assistant' : 'user',
        content: m.text
      }));

      const response = await fetchResource('/learning/coach-chat', {
        method: 'POST',
        body: JSON.stringify({
          user_id: String(localId || localStorage.getItem('skill_gap_local_id') || '0'),
          history: history,
          message: userText
        })
      });

      if (response && response.reply) {
        addMessage(response.reply, 'bot');
      } else {
        addMessage("I'm having a bit of trouble connecting to my AI brain. How else can I help?", 'bot');
      }
    } catch (err) {
      addMessage("I'm momentarily offline. Let's try again in a second!", 'bot');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`lnd-coach-widget ${isOpen ? 'open' : 'closed'}`}>
      <div className="coach-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="coach-avatar">🤖</div>
        <div className="coach-title">
          <h4>AI Career Coach</h4>
          <span>{loading ? 'Thinking...' : 'Live Mentor'}</span>
        </div>
        <button className="coach-toggle">{isOpen ? '▼' : '▲'}</button>
      </div>

      {isOpen && (
        <div className="coach-body">
          <div className="coach-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message-bubble ${msg.sender}`}>
                {msg.text.split('\n').map((line, i) => <p key={i}>{line}</p>)}
              </div>
            ))}
            {loading && (
              <div className="message-bubble bot typing">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="coach-input-area">
            <input
              type="text"
              placeholder="Ask me anything..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              disabled={loading}
            />
            <button type="submit" disabled={!inputVal.trim() || loading}>
              {loading ? '...' : 'Send'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default LndCoach;
