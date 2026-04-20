import React from 'react';
import './Help.css';

const Help: React.FC = () => {
  const faqs = [
    {
      q: "How do I add a task?",
      a: "Click the 'Quick Add' button in the top bar or the '+ Add Task' button on any page. You can set the title, time, and category."
    },
    {
      q: "How does the XP system work?",
      a: "You earn XP by completing tasks (20 XP), habits (10 XP), and study sessions. Level up as you earn more XP to grow your monsters!"
    },
    {
      q: "What are Mini and Boss Monsters?",
      a: "Mini Monsters represent small, achievable goals. Boss Monsters are big, long-term goals that require more effort to 'defeat'."
    },
    {
      q: "How do I track my study time?",
      a: "Go to the 'Study' page to manage subjects. Use the 'Timer' (if enabled in settings) to track your actual focus sessions."
    },
    {
      q: "Can I customize the theme?",
      a: "Yes! Go to Settings to toggle between Light and Dark mode. Dark mode is perfect for late-night study sessions."
    }
  ];

  return (
    <div className="help-page">
      <div className="help-header">
        <h1 className="page-title">Help & FAQ</h1>
        <p className="page-subtitle">Everything you need to know about Student Planner Pro</p>
      </div>
      
      <div className="help-grid">
        <div className="faq-section">
          <div className="card">
            <h3 className="card-title mb-4">Frequently Asked Questions</h3>
            <div className="faq-list">
              {faqs.map((faq, i) => (
                <div key={i} className="faq-item">
                  <h4 className="faq-question">{faq.q}</h4>
                  <p className="faq-answer">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="support-section">
          <div className="card">
            <h3 className="card-title mb-4">Need Support?</h3>
            <div className="support-info">
              <p className="mb-4">If you have any issues or suggestions, please contact our support team.</p>
              <button className="btn btn-primary full-width mb-3">Email Support</button>
              <button className="btn btn-secondary full-width">Join Community</button>
            </div>
          </div>

          <div className="card mt-4">
            <h3 className="card-title mb-4">Keyboard Shortcuts</h3>
            <div className="shortcuts-list">
              <div className="shortcut-item">
                <span className="key">T</span>
                <span>Add Task</span>
              </div>
              <div className="shortcut-item">
                <span className="key">H</span>
                <span>Add Habit</span>
              </div>
              <div className="shortcut-item">
                <span className="key">G</span>
                <span>Add Goal</span>
              </div>
              <div className="shortcut-item">
                <span className="key">S</span>
                <span>Open Settings</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
