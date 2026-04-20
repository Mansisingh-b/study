import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Settings as SettingsIcon, HelpCircle, LogOut } from 'lucide-react';
import { usePlanner } from '../../context/PlannerContext';
import './TopBar.css';

const TopBar: React.FC = () => {
  const { user } = usePlanner();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h2 className="topbar-title">Student Planner</h2>
      </div>

      <div className="topbar-right">
        {/* Notifications */}
        <button className="btn-icon notification-btn" onClick={() => navigate('/notifications')}>
          <Bell size={20} />
          <span className="notification-badge">0</span>
        </button>

        {/* User Profile */}
        <div className="profile-wrapper">
          <button
            className="profile-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="profile-info">
              <span className="profile-name">{user.name}</span>
              <span className="profile-role">{user.role}</span>
            </div>
            <div className="profile-avatar">
              {user.avatar?.startsWith('data:image') || user.avatar?.startsWith('http') ? (
                <img src={user.avatar} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                user.avatar
              )}
            </div>
          </button>

          {showProfileMenu && (
            <>
              <div className="profile-overlay" onClick={() => setShowProfileMenu(false)} />
              <div className="profile-menu">
                <button onClick={() => { navigate('/settings'); setShowProfileMenu(false); }}>
                  <SettingsIcon size={16} />
                  Settings
                </button>
                <button onClick={() => { navigate('/help'); setShowProfileMenu(false); }}>
                  <HelpCircle size={16} />
                  Help
                </button>
                <button className="logout-btn" onClick={() => { alert('Logging out...'); navigate('/login'); }}>
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
