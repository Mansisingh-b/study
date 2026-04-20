import React, { useState } from 'react';
import { usePlanner } from '../context/PlannerContext';
import { useUI } from '../context/UIContext';
import { CheckCircle2, Circle, Plus, X, Bookmark, Edit2, Trash2 } from 'lucide-react';
import type { Task } from '../types';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { tasks, toggleTaskComplete, deleteTask, addBookmark } = usePlanner();
  const { openModal } = useUI();
  // removed unused editingTaskId state

  const handleBookmarkTask = (task: Task) => {
    addBookmark({
      title: task.title,
      type: 'task',
      folderId: null,
      metadata: { taskId: task.id, date: task.date, category: task.category },
    });
  };
  const [hoveredPoint, setHoveredPoint] = useState<{ index: number; type: 'planned' | 'actual'; x: number; y: number } | null>(null);
  const [reportDate, setReportDate] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];
  const todaysTasks = tasks.filter(task => task.date === today);

  const completedTasksCount = todaysTasks.filter(t => t.completed).length;
  const totalTasksCount = todaysTasks.length;
  const completionRate = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  // Weekly data helpers
  const getWeekStart = () => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const getDateForOffset = (offset: number) => {
    const start = getWeekStart();
    start.setDate(start.getDate() + offset);
    return start;
  };

  const getDailyData = (offset: number) => {
    const date = getDateForOffset(offset);
    const dateStr = date.toISOString().split('T')[0];
    const dayTasks = tasks.filter(t => t.date === dateStr);
    const done = dayTasks.filter(t => t.completed).length;
    return { total: dayTasks.length, done, date: dateStr, dateObj: date };
  };

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const fullDayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const cardColors = ['#6366f1', '#10b981', '#f59e0b', '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899'];

  // Chart data with scaling
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const data = getDailyData(i);
    return { planned: data.total, actual: data.done };
  });

  const maxVal = Math.max(4, ...chartData.map(d => Math.max(d.planned, d.actual)));
  const yScale = (val: number) => 180 - (val / maxVal) * 160;

  // Y axis labels
  const yTicks = Array.from({ length: 5 }, (_, i) => Math.round((maxVal / 4) * i));

  // Daily report data
  const getReportData = (dateStr: string) => {
    const dayTasks = tasks.filter(t => t.date === dateStr);
    return {
      completed: dayTasks.filter(t => t.completed),
      incomplete: dayTasks.filter(t => !t.completed),
      total: dayTasks.length,
      done: dayTasks.filter(t => t.completed).length,
    };
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Student Planner</p>
        </div>
      </div>

      {/* Weekly Cards - NO Add Task buttons */}
      <div className="weekly-cards">
        {fullDayNames.map((dayName, index) => {
          const data = getDailyData(index);
          const rate = data.total > 0 ? Math.round((data.done / data.total) * 100) : 0;
          const isToday = data.date === today;

          return (
            <div
              key={index}
              className={`week-card ${isToday ? 'today' : ''}`}
              style={{ '--card-color': cardColors[index] } as React.CSSProperties}
              onClick={() => setReportDate(data.date)}
            >
              <div className="week-card-header">
                <span className="week-day-name">{dayName}</span>
                {isToday && <span className="today-badge">Today</span>}
              </div>
              <div className="week-date">
                {data.dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {data.done}/{data.total} Done
              </div>

              <div className="week-progress">
                <div
                  className="week-progress-fill"
                  style={{ width: `${rate}%` }}
                ></div>
              </div>
              <div className="week-rate">{rate}% Complete</div>
            </div>
          );
        })}
      </div>

      {/* Daily Report Modal */}
      {reportDate && (
        <div className="modal-overlay" onClick={() => setReportDate(null)}>
          <div className="modal daily-report-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                Per Day Report — {new Date(reportDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </h3>
              <button className="btn-icon" onClick={() => setReportDate(null)}><X size={20} /></button>
            </div>
            {(() => {
              const report = getReportData(reportDate);
              return (
                <div className="report-body">
                  <div className="report-summary">
                    <div className="report-stat">
                      <span className="report-stat-label">Tasks</span>
                      <span className="report-stat-value">{report.done}/{report.total}</span>
                    </div>
                  </div>

                  {report.completed.length > 0 && (
                    <div className="report-section">
                      <h4>✔ Completed</h4>
                      {report.completed.map(t => (
                        <div key={t.id} className="report-item completed">
                          <CheckCircle2 size={16} color="#10b981" />
                          <span>{t.title}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {report.incomplete.length > 0 && (
                    <div className="report-section">
                      <h4>❌ Incomplete</h4>
                      {report.incomplete.map(t => (
                        <div key={t.id} className="report-item incomplete">
                          <Circle size={16} color="#ef4444" />
                          <span>{t.title}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {report.total === 0 && (
                    <p className="empty-state-text" style={{ textAlign: 'center', padding: '2rem 0' }}>No tasks for this day.</p>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Progress Chart - Updated to match Image 2 */}
        <div className="card dashboard-card progress-card">
          <div className="card-header">
            <h3 className="card-title">📈 Progress of the Week</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => openModal('task')}>
              <Plus size={16} /> Add Task
            </button>
          </div>
          <div className="progress-chart">
            <div className="chart-area">
              <svg viewBox="0 0 620 220" className="line-chart">
                {/* Y axis labels */}
                {yTicks.map((tick, i) => (
                  <React.Fragment key={`y-${i}`}>
                    <text x="25" y={yScale(tick) + 4} textAnchor="end" fontSize="11" fill="var(--text-tertiary)">{tick}</text>
                    <line x1="35" y1={yScale(tick)} x2="580" y2={yScale(tick)} stroke="var(--border)" strokeWidth="1" strokeDasharray="4,4" />
                  </React.Fragment>
                ))}

                {/* X axis labels */}
                {dayNames.map((day, i) => (
                  <text key={`x-${i}`} x={55 + i * 80} y="200" textAnchor="middle" fontSize="11" fill="var(--text-tertiary)">{day}</text>
                ))}

                {/* Planned line */}
                <polyline
                  points={chartData.map((p, i) => `${55 + i * 80},${yScale(p.planned)}`).join(' ')}
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="2.5"
                  strokeDasharray="6,6"
                />

                {/* Actual line */}
                <polyline
                  points={chartData.map((p, i) => `${55 + i * 80},${yScale(p.actual)}`).join(' ')}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                />

                {/* Points - Planned */}
                {chartData.map((p, i) => (
                  <circle
                    key={`p-${i}`}
                    cx={55 + i * 80}
                    cy={yScale(p.planned)}
                    r="5"
                    fill="#cbd5e1"
                    stroke="white"
                    strokeWidth="2"
                    className="chart-point"
                    onMouseEnter={() => setHoveredPoint({ index: i, type: 'planned', x: 55 + i * 80, y: yScale(p.planned) })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                ))}

                {/* Points - Actual */}
                {chartData.map((p, i) => (
                  <circle
                    key={`a-${i}`}
                    cx={55 + i * 80}
                    cy={yScale(p.actual)}
                    r="5"
                    fill="#10b981"
                    stroke="white"
                    strokeWidth="2"
                    className="chart-point"
                    onMouseEnter={() => setHoveredPoint({ index: i, type: 'actual', x: 55 + i * 80, y: yScale(p.actual) })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                ))}

                {/* Tooltip */}
                {hoveredPoint && (
                  <g>
                    <rect
                      x={hoveredPoint.x - 55}
                      y={hoveredPoint.y - 50}
                      width="110"
                      height="42"
                      rx="6"
                      fill="var(--bg-secondary)"
                      stroke="var(--border)"
                      strokeWidth="1"
                    />
                    <text x={hoveredPoint.x} y={hoveredPoint.y - 34} textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--text-primary)">
                      {getDateForOffset(hoveredPoint.index).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </text>
                    <text x={hoveredPoint.x} y={hoveredPoint.y - 18} textAnchor="middle" fontSize="10" fill={hoveredPoint.type === 'planned' ? '#94a3b8' : '#10b981'}>
                      {hoveredPoint.type === 'planned' ? 'Planned' : 'Actual'} : {hoveredPoint.type === 'planned' ? chartData[hoveredPoint.index].planned : chartData[hoveredPoint.index].actual}
                    </text>
                  </g>
                )}
              </svg>
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-dot" style={{ border: '2px dashed #cbd5e1', background: 'transparent', boxSizing: 'border-box' }}></span>
                <span>Planned</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ background: '#10b981' }}></span>
                <span>Actual</span>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics - Updated layout matching Image 3 */}
        <div className="card dashboard-card analytics-card">
          <div className="card-header" style={{ marginBottom: '1.5rem' }}>
            <h3 className="card-title">📊 Task Analytics</h3>
          </div>
          
          <div className="analytics-content-vertical" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            {/* Pie Chart Area */}
            <div style={{ width: '140px', height: '140px', position: 'relative', marginBottom: '1rem', flexShrink: 0 }}>
              <svg viewBox="0 0 100 100" style={{ width: '140px', height: '140px', display: 'block', transform: 'rotate(-90deg)' }}>
                <circle cx="50" cy="50" r="38" fill="none" stroke="#ef4444" strokeWidth="14" />
                <circle
                  cx="50" cy="50" r="38"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray={`${(completionRate / 100) * 238.76} 238.76`}
                  style={{ transition: 'stroke-dasharray 1s ease' }}
                />
              </svg>
              <div style={{
                position: 'absolute', top: 0, left: 0, width: '140px', height: '140px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none'
              }}>
                <span style={{ fontWeight: 800, fontSize: '1.5rem', color: '#1e293b', lineHeight: 1 }}>{completionRate}%</span>
              </div>
            </div>

            {/* Pie Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '1.5rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#475569' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></span> Completed
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#475569' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }}></span> Remaining
              </div>
            </div>

            {/* Stats List */}
            <div className="analytics-stats-list">
              <div className="stat-row">
                <span className="stat-label">Total Tasks</span>
                <span className="stat-val">{totalTasksCount}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Completed</span>
                <span className="stat-val">{completedTasksCount}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Unfulfilled</span>
                <span className="stat-val">{totalTasksCount - completedTasksCount}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Progress</span>
                <span className="stat-val" style={{ color: '#6366f1' }}>{completionRate}%</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Goals Done</span>
                <span className="stat-val">0</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Productive Day</span>
                <span className="stat-val" style={{ color: '#6366f1' }}>{(() => {
                  let best = 'None';
                  let bestCount = 0;
                  for (let i = 0; i < 7; i++) {
                    const d = getDailyData(i);
                    if (d.done > bestCount) {
                      bestCount = d.done;
                      best = dayNames[i];
                    }
                  }
                  return bestCount > 0 ? best : 'None';
                })()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Tasks */}
        <div className="card dashboard-card tasks-card">
          <div className="card-header">
            <h3 className="card-title">⏰ Today's Tasks</h3>
            <button className="btn-icon">...</button>
          </div>

          {todaysTasks.length > 0 ? (
            <div className="tasks-list">
              {todaysTasks.map(task => (
                <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                  <button
                    className="task-checkbox"
                    onClick={() => toggleTaskComplete(task.id)}
                  >
                    {task.completed ? <CheckCircle2 size={20} color="#10b981" /> : <Circle size={20} />}
                  </button>
                  <div className="task-details">
                    <div className="task-title" style={{ textDecoration: task.completed ? 'line-through' : 'none', opacity: task.completed ? 0.6 : 1 }}>
                      {task.title}
                    </div>
                    <div className="task-meta">
                      <span className="task-time">⏰ {task.time}</span>
                      <span className="task-category badge" style={{ background: '#fef3c7', color: '#f59e0b' }}>
                        {task.category}
                      </span>
                    </div>
                  </div>
                  <div className="task-actions">
                    <button className="btn-icon" onClick={() => handleBookmarkTask(task)} title="Bookmark Task">
                      <Bookmark size={18} />
                    </button>
                    <button className="btn-icon" onClick={() => openModal('task')} title="Edit Task">
                      <Edit2 size={18} />
                    </button>
                    <button className="btn-icon" onClick={() => deleteTask(task.id)} title="Delete Task">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p className="empty-state-text">No tasks for today</p>
            </div>
          )}

          <button
            className="btn btn-secondary add-task-btn"
            onClick={() => openModal('task')}
          >
            <Plus size={18} />
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
