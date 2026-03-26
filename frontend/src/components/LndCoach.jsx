import React, { useState, useEffect, useRef } from 'react';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const STAGES = {
  1: 'IDENTIFICATION',
  2: 'PROFILE',
  3: 'ASSESSMENT',
  4: 'GAP_DETECTION',
  5: 'RECOMMENDATIONS',
  6: 'TRACKING',
  7: 'MICRO_COACHING'
};

const LndCoach = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [stage, setStage] = useState(1);
  const [inputVal, setInputVal] = useState('');
  const [userData, setUserData] = useState({});
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial Greeting (Stage 1)
  useEffect(() => {
    if (messages.length === 0 && user) {
      const isReturning = localStorage.getItem(`lnd_returning_${user.id}`);
      
      const greeting = `Hello ${user.full_name.split(' ')[0]}! Welcome to your HEXAPATH AI learning portal. I'm your dedicated L&D Assistant.`;
      
      addMessage(greeting, 'bot');

      setTimeout(() => {
        if (isReturning) {
          addMessage(`Welcome back! Let's review the Python and React modules you were working on. How is your progress so far?`, 'bot');
          setStage(6);
        } else {
          addMessage(`To help me personalize your journey, what is your primary learning goal right now? (e.g., leadership, technical depth, compliance)`, 'bot');
          setStage(2);
          setUserData({ profileStep: 'goal' });
        }
      }, 1000);
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const addMessage = (text, sender) => {
    setMessages(prev => [...prev, { id: Date.now().toString() + Math.random(), text, sender }]);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal.trim();
    addMessage(userText, 'user');
    setInputVal('');

    // Process input based on stage
    setTimeout(() => processStageLogic(userText), 800);
  };

  const processStageLogic = (userText) => {
    // --- STAGE 2: PROFILE ---
    if (stage === 2) {
      if (userData.profileStep === 'goal') {
        setUserData({ ...userData, goal: userText, profileStep: 'format' });
        addMessage(`Got it—focusing on ${userText}. What is your preferred learning format? (e.g., video, reading, live sessions, microlearning)`, 'bot');
      } 
      else if (userData.profileStep === 'format') {
        setUserData({ ...userData, format: userText, profileStep: 'time' });
        addMessage(`Great! Finally, how many hours per week can you realistically dedicate to learning?`, 'bot');
      }
      else if (userData.profileStep === 'time') {
        setUserData({ ...userData, time: userText, profileStep: 'done' });
        localStorage.setItem(`lnd_returning_${user?.id}`, 'true'); // mark as returning for next time
        
        addMessage(`Perfect. I've noted that you have ${userText} available primarily for ${userData.format}.`, 'bot');
        setTimeout(() => {
          addMessage(`Let's do a quick, role-relevant self-assessment. On a scale of 1-5, how confident are you in designing scalable software architectures?`, 'bot');
          setStage(3);
          setUserData({ ...userData, assessmentStep: 1, scores: [] });
        }, 1500);
      }
    }
    
    // --- STAGE 3: ASSESSMENT ---
    else if (stage === 3) {
      const step = userData.assessmentStep;
      const scores = [...userData.scores, userText];
      
      if (step === 1) {
        setUserData({ ...userData, scores, assessmentStep: 2 });
        addMessage(`Thanks. Scenario: A deployment breaks production due to an unhandled edge case. How effectively can you isolate and debug the root cause? (1-5)`, 'bot');
      }
      else if (step === 2) {
        setUserData({ ...userData, scores, assessmentStep: 3 });
        addMessage(`Noted. How comfortable are you leading a cross-functional technical discussion with non-technical stakeholders? (1-5)`, 'bot');
      }
      else if (step === 3) {
        setUserData({ ...userData, scores, assessmentStep: 4 });
        // Finish Assessment
        addMessage(`Thank you for reflecting on those scenarios. It looks like you have a strong grasp of debugging, but there's room to grow in architectural design and stakeholder communication.`, 'bot');
        setTimeout(() => {
          setStage(4);
          processGapDetection();
        }, 2000);
      }
    }

    // --- STAGE 6: TRACKING (Returning User) ---
    else if (stage === 6) {
      addMessage(`That's great to hear! Consistency is key. I've updated your learning plan to reflect your progress. Keep up the momentum! 🎉`, 'bot');
      setTimeout(() => {
        setStage(7);
        processMicroCoaching();
      }, 1500);
    }
    
    // Catch-all generic redirect
    else if (stage === 7 || stage === 5) {
      addMessage(`Let's keep your learning momentum going — shall we continue checking the dashboard? 😊`, 'bot');
    }
  };

  const processGapDetection = () => {
    // Stage 4
    addMessage(`Based on your profile and our quick check-in, here are 2 specific growth opportunities for you:`, 'bot');
    setTimeout(() => {
      addMessage(`1. **System Design Confidence:** Enhancing your ability to design scalable architectures from scratch.\n2. **Technical Communication:** Bridging the gap between engineering and business stakeholders effectively.`, 'bot');
      setTimeout(() => {
        setStage(5);
        processRecommendations();
      }, 3000);
    }, 1000);
  };

  const processRecommendations = () => {
    // Stage 5
    addMessage(`I've created a personalized learning plan tailored to your ${userData.time} weekly availability:`, 'bot');
    setTimeout(() => {
      addMessage(`📚 **Module 1 (High Priority):** 'System Design Patterns for Modern Web Apps'\n• Format: Microlearning Videos\n• Duration: 2 hours\n• Reason: Directly addresses your goal to build scalable architecture.`, 'bot');
      setTimeout(() => {
        addMessage(`🗣️ **Module 2 (Medium Priority):** 'Communicating Tech to Execs'\n• Format: Interactive Reading\n• Duration: 45 mins\n• Reason: Refines your cross-team communication skills.`, 'bot');
        setTimeout(() => {
          setStage(7);
          processMicroCoaching();
        }, 3000);
      }, 1500);
    }, 1000);
  };

  const processMicroCoaching = () => {
    // Stage 7
    addMessage(`🚀 **Your 48-Hour Micro-Challenge:**\nBefore the end of the week, try explaining a complex technical concept you're working on to someone outside your department using zero jargon. Let me know how it goes!`, 'bot');
    addMessage(`Feel free to check your full dashboard to dive into these modules!`, 'bot');
  };

  return (
    <div className={`lnd-coach-widget ${isOpen ? 'open' : 'closed'}`}>
      <div className="coach-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="coach-avatar">🤖</div>
        <div className="coach-title">
          <h4>Your L&D Coach</h4>
          <span>{STAGES[stage].replace('_', ' ')}</span>
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
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="coach-input-area">
            <input
              type="text"
              placeholder="Type your response..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
            />
            <button type="submit" disabled={!inputVal.trim()}>Send</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default LndCoach;
