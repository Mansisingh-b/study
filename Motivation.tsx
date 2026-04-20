import React from 'react';
import './Motivation.css';

const Motivation: React.FC = () => {
  return (
    <div className="motivation-page">
      <div className="motivation-header card">
        <span className="motivation-icon">✨</span>
        <div>
          <h2>Stay Motivated</h2>
          <p className="text-sm text-secondary">
            Relax, focus, and keep moving forward. Taking small steps every day leads to great achievements.
          </p>
        </div>
      </div>

      <div className="motivation-grid">
        <div className="card">
          <h3 className="mb-4">Lo-Fi Vibes</h3>
          <div className="video-placeholder">
            <div className="video-thumb">
              <div className="play-btn">▶</div>
              <p className="text-sm">Lo-Fi Chill Beats</p>
              <p className="text-xs text-secondary">Relax and focus</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="mb-4">Motivation Videos</h3>
          <div className="video-placeholder">
            <div className="video-thumb">
              <div className="play-btn">▶</div>
              <p className="text-sm">THIS IS MOTIVATION - KEVIN THE HYPNOTIST</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="mb-4">Inspiring Thoughts</h3>
          <div className="quotes-container">
            <div className="quote-card" style={{ background: 'rgba(236, 72, 153, 0.1)' }}>
              <p className="quote-text">"Success is the sum of small efforts, repeated day in and day out."</p>
              <p className="quote-author">— Robert Collier</p>
            </div>
            <div className="quote-card" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
              <p className="quote-text">"Stay positive, work hard, make it happen."</p>
              <p className="quote-author">— Unknown</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="mb-4">Study Motivation</h3>
          <div className="video-grid">
            <div className="video-thumb-small">
              <div className="play-btn-small">▶</div>
              <p className="text-xs">The World's Best Learner</p>
            </div>
            <div className="video-thumb-small">
              <div className="play-btn-small">▶</div>
              <p className="text-xs">Develop Nature Mindset</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card feeling-low">
        <h4>Feeling low?</h4>
        <p className="text-sm text-secondary">Join our Discord server to connect with fellow students and get support!</p>
        <button className="btn btn-primary mt-4">Join Community</button>
      </div>
    </div>
  );
};

export default Motivation;
