import React, { useState } from 'react';
import { usePlanner } from '../context/PlannerContext';
import { 
  Sun, 
  Moon, 
  Bell, 
  MessageSquare, 
  Timer, 
  User,
  Trash2,
  Save,
  RotateCcw
} from 'lucide-react';
import './Settings.css';

const Settings: React.FC = () => {
  const { user, settings, updateSettings, updateUser, resetTimerData, clearChatHistory } = usePlanner();
  const [displayName, setDisplayName] = useState(user.name);

  const avatars = [
    { id: '1', icon: '📚' },
    { id: '2', icon: '🎓' },
    { id: '3', icon: '✏️' },
    { id: '4', icon: '⭐' },
    { id: '5', icon: '🎯' }
  ];

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Customize your Student Planner</p>
      </div>

      <div className="settings-content">
        {/* Theme Section */}
        <div className="settings-card">
          <div className="settings-card-header">
            <span className="icon-badge purple"><Sun size={18} /></span>
            <div className="title-group">
              <h3>Theme</h3>
              <p>Switch between light and dark theme</p>
            </div>
          </div>
          <div className="settings-card-body">
            <div className="setting-row">
              <span className="label">Dark Mode</span>
              <div className="toggle-wrapper theme-toggle">
                <Sun size={16} className={!settings.darkMode ? 'active' : ''} />
                <button 
                  className={`toggle-switch ${settings.darkMode ? 'on' : 'off'}`}
                  onClick={() => updateSettings({ darkMode: !settings.darkMode })}
                >
                  <span className="toggle-handle"></span>
                </button>
                <Moon size={16} className={settings.darkMode ? 'active' : ''} />
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="settings-card">
          <div className="settings-card-header">
            <span className="icon-badge green"><Bell size={18} /></span>
            <div className="title-group">
              <h3>Notifications</h3>
              <p>Get reminders for tasks and habits</p>
            </div>
          </div>
          <div className="settings-card-body">
            <div className="setting-row">
              <span className="label">Enable Notifications</span>
              <button 
                className={`toggle-switch ${settings.notificationsEnabled ? 'on' : 'off'}`}
                onClick={() => updateSettings({ notificationsEnabled: !settings.notificationsEnabled })}
              >
                <span className="toggle-handle"></span>
              </button>
            </div>
            <div className="setting-row">
              <div className="label-group">
                <span className="label"><Timer size={16} /> Reminder Time</span>
                <p className="sub-label">When to remind you before tasks</p>
              </div>
              <select 
                className="select-input"
                value={settings.reminderTime}
                onChange={(e) => updateSettings({ reminderTime: e.target.value })}
              >
                <option value="At time of event">At time of event</option>
                <option value="5 minutes before">5 minutes before</option>
                <option value="10 minutes before">10 minutes before</option>
                <option value="15 minutes before">15 minutes before</option>
                <option value="30 minutes before">30 minutes before</option>
                <option value="1 hour before">1 hour before</option>
              </select>
            </div>
          </div>
        </div>

        {/* AI Chatbot Section */}
        <div className="settings-card">
          <div className="settings-card-header">
            <span className="icon-badge blue"><MessageSquare size={18} /></span>
            <div className="title-group">
              <h3>AI Chatbot</h3>
              <p>Show the AI study assistant</p>
            </div>
          </div>
          <div className="settings-card-body">
            <div className="setting-row">
              <span className="label">Enable Chatbot</span>
              <button 
                className={`toggle-switch ${settings.chatbotEnabled ? 'on' : 'off'}`}
                onClick={() => updateSettings({ chatbotEnabled: !settings.chatbotEnabled })}
              >
                <span className="toggle-handle"></span>
              </button>
            </div>
            <button className="btn-secondary danger-text full-width" onClick={clearChatHistory}>
              <Trash2 size={16} /> Clear Chat History
            </button>
          </div>
        </div>

        {/* Study Timer Section */}
        <div className="settings-card">
          <div className="settings-card-header">
            <span className="icon-badge amber"><Timer size={18} /></span>
            <div className="title-group">
              <h3>Study Timer</h3>
              <p>Customize your focus sessions</p>
            </div>
          </div>
          <div className="settings-card-body">
            <div className="setting-row">
              <div className="label-group">
                <span className="label">Timer Sound</span>
                <p className="sub-label">Play sound when timer completes</p>
              </div>
              <button 
                className={`toggle-switch ${settings.timerSound ? 'on' : 'off'}`}
                onClick={() => updateSettings({ timerSound: !settings.timerSound })}
              >
                <span className="toggle-handle"></span>
              </button>
            </div>
            <button className="btn-secondary full-width" onClick={resetTimerData}>
              <RotateCcw size={16} /> Reset Timer Data
            </button>
          </div>
        </div>

        {/* Profile Section */}
        <div className="settings-card">
          <div className="settings-card-header">
            <span className="icon-badge light-blue"><User size={18} /></span>
            <div className="title-group">
              <h3>Profile</h3>
              <p>Update your personal information</p>
            </div>
          </div>
          <div className="settings-card-body">
            <div className="profile-edit-row">
              <div className="input-with-button">
                <div className="label-group">
                  <span className="label">Display Name</span>
                </div>
                <div className="horizontal-input-group">
                  <input 
                    type="text" 
                    className="text-input" 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                  <button className="btn-primary" onClick={() => updateUser({ name: displayName })}>
                    <Save size={16} /> Save
                  </button>
                </div>
              </div>
            </div>
            
            <div className="avatar-selection-section">
              <span className="label">Profile Photo</span>

              {/* Photo preview + upload */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', margin: '1rem 0' }}>
                {/* Avatar preview circle */}
                <div style={{
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: 'var(--bg-tertiary)', border: '3px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2.2rem', overflow: 'hidden', flexShrink: 0
                }}>
                  {user.avatar?.startsWith('data:image') || user.avatar?.startsWith('http') ? (
                    <img src={user.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span>{user.avatar || '🎓'}</span>
                  )}
                </div>

                {/* Upload button */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => updateUser({ avatar: reader.result as string });
                        reader.readAsDataURL(file);
                      }
                    }}
                    style={{ display: 'none' }}
                    id="avatar-upload"
                  />
                  <label htmlFor="avatar-upload" className="btn-primary" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.875rem' }}>
                    📷 Upload Photo
                  </label>
                  {user.avatar?.startsWith('data:image') && (
                    <button
                      className="btn-secondary"
                      style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                      onClick={() => updateUser({ avatar: '🎓' })}
                    >
                      Remove Photo
                    </button>
                  )}
                </div>
              </div>

              {/* Emoji avatars */}
              <span className="label" style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Or pick an emoji avatar</span>
              <div className="avatar-grid" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                {avatars.map((avatar) => (
                  <button
                    key={avatar.id}
                    className={`avatar-option ${user.avatar === avatar.icon ? 'active' : ''}`}
                    onClick={() => updateUser({ avatar: avatar.icon })}
                  >
                    {avatar.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
