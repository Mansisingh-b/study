import React, { useState } from 'react';
import { usePlanner } from '../context/PlannerContext';
import { useUI } from '../context/UIContext';
import { Plus, ChevronLeft, ChevronRight, CheckCircle2, Circle } from 'lucide-react';
import './Planner.css';

const Planner: React.FC = () => {
  const { tasks, toggleTaskComplete, deleteTask } = usePlanner();
  const { openModal } = useUI();
  const [view, setView] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Daily View
  const renderDailyView = () => {
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayTasks = tasks.filter(t => t.date === dateStr);
    
    return (
      <div className="daily-view">
        <div className="planner-header">
          <div className="date-navigation">
            <button className="btn-icon" onClick={() => {
              const newDate = new Date(currentDate);
              newDate.setDate(newDate.getDate() - 1);
              setCurrentDate(newDate);
            }}>
              <ChevronLeft size={20} />
            </button>
            <h2 className="current-date">
              {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </h2>
            <button className="btn-icon" onClick={() => {
              const newDate = new Date(currentDate);
              newDate.setDate(newDate.getDate() + 1);
              setCurrentDate(newDate);
            }}>
              <ChevronRight size={20} />
            </button>
          </div>
          <button className="btn btn-primary" onClick={() => openModal('task')}>
            <Plus size={18} />
            Add Task
          </button>
        </div>

        <div className="tasks-container">
          {dayTasks.length === 0 ? (
            <div className="empty-state">
              <p className="empty-state-text">No tasks for this day</p>
            </div>
          ) : (
            <div className="tasks-list-planner">
              {dayTasks.map(task => (
                <div key={task.id} className={`planner-task-item ${task.completed ? 'completed' : ''}`}>
                  <button 
                    className="task-checkbox"
                    onClick={() => toggleTaskComplete(task.id)}
                  >
                    {task.completed ? <CheckCircle2 size={20} color="#10b981" /> : <Circle size={20} />}
                  </button>
                  <div className="task-info">
                    <div className="task-title-row">
                      <span className="task-name" style={{ textDecoration: task.completed ? 'line-through' : 'none', opacity: task.completed ? 0.6 : 1 }}>
                        {task.title}
                      </span>
                      <span className="task-badge" style={{ background: '#6366f1', color: 'white' }}>
                        {task.category}
                      </span>
                    </div>
                    <div className="task-time-row">
                      ⏰ {task.time}
                    </div>
                  </div>
                  <div className="task-actions-planner">
                    <button className="btn-icon" onClick={() => openModal('task')}>✏️</button>
                    <button className="btn-icon">📌</button>
                    <button className="btn-icon" onClick={() => deleteTask(task.id)}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Weekly View
  const renderWeeklyView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);

    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const dayStr = d.toISOString().split('T')[0];
      const dayTasks = tasks.filter(t => t.date === dayStr);
      const done = dayTasks.filter(t => t.completed).length;
      const rate = dayTasks.length > 0 ? Math.round((done / dayTasks.length) * 100) : 0;
      
      const colors = ['#6366f1', '#10b981', '#f59e0b', '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899'];
      return {
        name: d.toLocaleDateString('en-US', { weekday: 'long' }),
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        complete: `${rate}%`,
        color: colors[i]
      };
    });

    return (
      <div className="weekly-view">
        <div className="weekly-grid">
          {weekDays.map((day, index) => (
            <div 
              key={index} 
              className="week-day-card"
              style={{ borderColor: day.color }}
            >
              <div className="week-day-header" style={{ background: day.color }}>
                <span className="week-day-name">{day.name}</span>
              </div>
              <div className="week-day-content">
                <div className="week-day-date">{day.date}</div>
                <div className="week-day-time">8am-12pm</div>
                <div className="week-day-complete">{day.complete} Complete</div>
                <button 
                  className="btn-add-week-task"
                  style={{ background: day.color }}
                  onClick={() => openModal('task')}
                >
                  + Add Task
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Monthly View
  const renderMonthlyView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    return (
      <div className="monthly-view">
        <div className="month-header">
          <button className="btn-icon" onClick={() => {
            const newDate = new Date(currentDate);
            newDate.setMonth(newDate.getMonth() - 1);
            setCurrentDate(newDate);
          }}>
            <ChevronLeft size={20} />
          </button>
          <h2 className="month-title">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <button className="btn-icon" onClick={() => {
            const newDate = new Date(currentDate);
            newDate.setMonth(newDate.getMonth() + 1);
            setCurrentDate(newDate);
          }}>
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="calendar-grid">
          <div className="calendar-header">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="calendar-day-name">{day}</div>
            ))}
          </div>
          <div className="calendar-days">
            {days.map((day, index) => {
                if (!day) return <div key={index} className="calendar-day empty"></div>;
                
                const d = new Date(year, month, day);
                const dStr = d.toISOString().split('T')[0];
                const dayTasks = tasks.filter(t => t.date === dStr);
                const done = dayTasks.filter(t => t.completed).length;
                
                return (
                  <div 
                    key={index} 
                    className={`calendar-day ${dayTasks.length > 0 ? 'has-tasks' : ''}`}
                  >
                    <span className="day-number">{day}</span>
                    {dayTasks.length > 0 && (
                        <div className="day-indicator" style={{ background: done === dayTasks.length ? '#10b981' : '#6366f1' }}>
                            {done}/{dayTasks.length}
                        </div>
                    )}
                  </div>
                );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="planner-page">
      <div className="planner-top">
        <div>
          <h1 className="page-title">Planner</h1>
          <p className="page-subtitle">Organize your tasks by day, week, or month</p>
        </div>
      </div>

      <div className="view-tabs">
        <button 
          className={`view-tab ${view === 'daily' ? 'active' : ''}`}
          onClick={() => setView('daily')}
        >
          Daily
        </button>
        <button 
          className={`view-tab ${view === 'weekly' ? 'active' : ''}`}
          onClick={() => setView('weekly')}
        >
          Weekly
        </button>
        <button 
          className={`view-tab ${view === 'monthly' ? 'active' : ''}`}
          onClick={() => setView('monthly')}
        >
          Monthly
        </button>
      </div>

      <div className="planner-content">
        {view === 'daily' && renderDailyView()}
        {view === 'weekly' && renderWeeklyView()}
        {view === 'monthly' && renderMonthlyView()}
      </div>
    </div>
  );
};

export default Planner;
