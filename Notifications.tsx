import React, { useState, useEffect } from 'react';
import { usePlanner } from '../context/PlannerContext';
import { Bell, BellOff, Trash2, Clock, CheckCircle2 } from 'lucide-react';
import { saveToStorage, loadFromStorage } from '../utils/storage';
import './Notifications.css';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'task' | 'habit' | 'goal' | 'exam' | 'assignment';
  time: string;
  read: boolean;
  createdAt: string;
}

const Notifications: React.FC = () => {
  const { tasks, habits, goals } = usePlanner();
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadFromStorage('notifications', []));
  const [permissionGranted, setPermissionGranted] = useState(Notification.permission === 'granted');
  const [reminderTime, setReminderTime] = useState(() => loadFromStorage('notifReminderTime', '5 min'));

  useEffect(() => { saveToStorage('notifications', notifications); }, [notifications]);
  useEffect(() => { saveToStorage('notifReminderTime', reminderTime); }, [reminderTime]);

  // Generate notifications from tasks/habits/goals
  useEffect(() => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    const newNotifs: NotificationItem[] = [];

    // Task notifications
    tasks.filter(t => !t.completed && t.date === today).forEach(task => {
      if (!notifications.find(n => n.id === `task-${task.id}`)) {
        newNotifs.push({
          id: `task-${task.id}`,
          title: 'Task Reminder',
          message: `"${task.title}" is due today at ${task.time || 'N/A'}`,
          type: 'task',
          time: task.time || '',
          read: false,
          createdAt: now.toISOString(),
        });
      }
    });

    // Habit notifications
    habits.forEach(habit => {
      if (!notifications.find(n => n.id === `habit-${habit.id}-${today}`)) {
        newNotifs.push({
          id: `habit-${habit.id}-${today}`,
          title: 'Habit Reminder',
          message: `Don't forget to complete "${habit.title}" today!`,
          type: 'habit',
          time: '',
          read: false,
          createdAt: now.toISOString(),
        });
      }
    });

    // Goal notifications
    goals.filter(g => g.progress < g.target).forEach(goal => {
      if (!notifications.find(n => n.id === `goal-${goal.id}`)) {
        newNotifs.push({
          id: `goal-${goal.id}`,
          title: 'Goal Progress',
          message: `"${goal.title}" is ${Math.round((goal.progress / goal.target) * 100)}% complete. Keep going!`,
          type: 'goal',
          time: '',
          read: false,
          createdAt: now.toISOString(),
        });
      }
    });

    if (newNotifs.length > 0) {
      setNotifications(prev => [...newNotifs, ...prev]);
    }
  }, [tasks, habits, goals]);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      setPermissionGranted(perm === 'granted');
      if (perm === 'granted') {
        new Notification('Notifications Enabled', { body: 'You will now receive study reminders!' });
      }
    }
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotif = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => setNotifications([]);
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  const unreadCount = notifications.filter(n => !n.read).length;

  const typeEmoji: Record<string, string> = {
    task: '📋',
    habit: '🔥',
    goal: '🎯',
    exam: '📝',
    assignment: '📚',
  };

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
        </div>
        <div className="notifications-actions">
          {!permissionGranted && (
            <button className="btn btn-primary" onClick={requestPermission}>
              <Bell size={16} /> Enable Browser Notifications
            </button>
          )}
          <button className="btn btn-secondary" onClick={markAllRead}>
            <CheckCircle2 size={16} /> Mark All Read
          </button>
          <button className="btn btn-secondary" onClick={clearAll}>
            <Trash2 size={16} /> Clear All
          </button>
        </div>
      </div>

      {/* Reminder Settings */}
      <div className="notif-settings card">
        <div className="notif-setting-row">
          <div className="notif-setting-label">
            <Clock size={16} />
            <span>Reminder Time</span>
          </div>
          <select className="input notif-select" value={reminderTime} onChange={e => setReminderTime(e.target.value)}>
            <option value="5 min">5 minutes before</option>
            <option value="10 min">10 minutes before</option>
            <option value="30 min">30 minutes before</option>
            <option value="1 hour">1 hour before</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </div>

      {/* Notifications List */}
      <div className="notifications-list">
        {notifications.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <BellOff size={48} style={{ opacity: 0.3 }} />
              <p className="empty-state-text" style={{ marginTop: '1rem' }}>No notifications yet</p>
            </div>
          </div>
        ) : (
          notifications.map(notif => (
            <div key={notif.id} className={`notification-item card ${notif.read ? 'read' : 'unread'}`} onClick={() => markRead(notif.id)}>
              <div className="notif-icon">{typeEmoji[notif.type] || '🔔'}</div>
              <div className="notif-content">
                <span className="notif-title">{notif.title}</span>
                <span className="notif-message">{notif.message}</span>
                <span className="notif-time">{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <button className="btn-icon" onClick={(e) => { e.stopPropagation(); deleteNotif(notif.id); }}>
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
